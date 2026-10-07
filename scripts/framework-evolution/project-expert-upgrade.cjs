'use strict';
// Explicit compare-and-swap upgrade; never runs automatically or migrates HOME on import.
const fs = require('node:fs');
const crypto = require('node:crypto');
const gateway = require('./project-expert.cjs');
const installer = require('./project-expert-install.cjs');
const {writeFileAtomically} = require('../../bin/lib/global-provider-adapters.js');
const bytes = value => Buffer.from(JSON.stringify(value,null,2)+'\n');
const key = (root, relative) => gateway.identity(root)+'|'+relative;
function prepareUpgrade({sourceRoot,projectRoots,home,expectedOldRegistrySha256,expectedOldTransactionId,transactionId=crypto.randomUUID(),authorization} = {}) {
  if (!/^[a-f0-9]{64}$/.test(expectedOldRegistrySha256 || '') || !expectedOldTransactionId || !authorization) throw new Error('Explicit old registry/transaction and upgrade authorization required');
  home = gateway.safeRoot(home);
  if (gateway.digest(home,gateway.REGISTRY)!==expectedOldRegistrySha256) throw new Error('Upgrade registry CAS mismatch');
  const registry=gateway.readJson(home,gateway.REGISTRY);
  if (registry.transactionId!==expectedOldTransactionId || registry.kind!=='sinapse-project-expert-registry') throw new Error('Upgrade transaction mismatch');
  gateway.checkDelivery(home,registry,expectedOldRegistrySha256);
  const receipt=gateway.readJson(home,gateway.DELIVERY), oldReceiptSha256=gateway.digest(home,gateway.DELIVERY);
  const replacements=new Map(receipt.files.map(entry=>[key(gateway.safeRoot(entry.root),entry.path),entry.sha256]));
  replacements.set(key(home,gateway.DELIVERY),oldReceiptSha256);
  const plan=installer.prepareProjectPlan({sourceRoot,projectRoots,home,transactionId,authorization},{replacementDigests:replacements});
  const snapshots=plan.entries.map(entry=>({root:entry.root,path:entry.path,sha256:entry.expectedDigest,content:entry.expectedDigest===null?null:fs.readFileSync(gateway.safeFile(entry.root,entry.path)).toString('base64')}));
  return {schemaVersion:1,kind:'sinapse-project-expert-upgrade-plan',expectedOldRegistrySha256,expectedOldTransactionId,expectedOldReceiptSha256:oldReceiptSha256,expectedNewRegistrySha256:plan.registrySha256,plan,snapshots};
}
function validateUpgrade(upgrade) {
  if(upgrade?.schemaVersion!==1 || upgrade.kind!=='sinapse-project-expert-upgrade-plan' || !upgrade.plan || !Array.isArray(upgrade.snapshots)) throw new Error('Invalid upgrade plan');
  const p=upgrade.plan;
  const rebuilt=prepareUpgrade({sourceRoot:p.sourceRoot,projectRoots:p.projectRoots,home:p.home,transactionId:p.transactionId,authorization:p.authorization,expectedOldRegistrySha256:upgrade.expectedOldRegistrySha256,expectedOldTransactionId:upgrade.expectedOldTransactionId});
  if(JSON.stringify(rebuilt)!==JSON.stringify(upgrade)) throw new Error('Upgrade plan differs from trusted current files and frozen source');
}
function journalRelative(upgrade){return '.sinapse/project-expert/backups/'+upgrade.plan.transactionId+'/upgrade-journal.json';}
function lock(upgrade,operation,execute){
  const p=upgrade.plan,relative='.sinapse/project-expert/installation.lock',content=bytes({transactionId:p.transactionId,pid:process.pid,operation});
  writeFileAtomically(gateway.safeFile(p.home,relative,{missing:true}),content,p.home,{expectedContentSha256:null,exclusive:true});
  try{return execute();}finally{try{if(gateway.digest(p.home,relative)===gateway.sha(content))fs.unlinkSync(gateway.safeFile(p.home,relative));}catch{/* Preserve foreign/redirected lock. */}}
}
function restoreWrites(upgrade,journal){
  const p=upgrade.plan;journal.blockedFiles=[];
  for(const entry of [...journal.entries].reverse())if(['intent','written','blocked'].includes(entry.state)){
    try{
      const actual=gateway.digest(entry.root,entry.path),snapshot=upgrade.snapshots.find(s=>s.root===entry.root&&s.path===entry.path);
      if(actual===snapshot.sha256){entry.state='restored';continue;}
      if(actual!==entry.sha256){entry.state='blocked';journal.blockedFiles.push(entry.path);continue;}
      if(snapshot.content===null){
        const file=gateway.safeFile(entry.root,entry.path),stat=fs.lstatSync(file);
        if(gateway.digest(entry.root,entry.path)!==entry.sha256 || fs.lstatSync(file).ino!==stat.ino)throw new Error('Concurrent file mutation');
        fs.unlinkSync(file);
      }else writeFileAtomically(gateway.safeFile(entry.root,entry.path),Buffer.from(snapshot.content,'base64'),entry.root,{expectedContentSha256:entry.sha256});
      entry.state='restored';
    }catch{entry.state='blocked';journal.blockedFiles.push(entry.path);}
  }
  journal.status=journal.blockedFiles.length?'recovery-blocked':'rolled-back';return p;
}
function applyUpgrade(upgrade,{expectedNewRegistrySha256,beforeWrite,afterWrite} = {}) {
  if(expectedNewRegistrySha256!==upgrade?.expectedNewRegistrySha256 || !/^[a-f0-9]{64}$/.test(expectedNewRegistrySha256 || ''))throw new Error('Explicit new registry CAS approval required');
  validateUpgrade(upgrade);
  return lock(upgrade,'upgrade',()=>{
    // Revalidate under the lock so two prepared upgrades cannot both publish.
    validateUpgrade(upgrade);
    const p=upgrade.plan,relative=journalRelative(upgrade);
    const journal={schemaVersion:1,kind:'sinapse-project-expert-upgrade-journal',transactionId:p.transactionId,planSha256:gateway.sha(bytes(upgrade)),oldRegistrySha256:upgrade.expectedOldRegistrySha256,newRegistrySha256:upgrade.expectedNewRegistrySha256,status:'prepared',entries:p.entries.map(e=>({...e,state:'pending'})),blockedFiles:[]};
    let journalDigest=null;
    const save=()=>{const b=bytes(journal);writeFileAtomically(gateway.safeFile(p.home,relative,{missing:true}),b,p.home,{expectedContentSha256:journalDigest});journalDigest=gateway.sha(b);};
    const verifySource=()=>{for(const input of p.sources)if(gateway.digest(p.sourceRoot,input.path)!==input.sha256)throw new Error('Upgrade source changed: '+input.path);const now=installer.sourceInputs(p.sourceRoot);if(JSON.stringify(now)!==JSON.stringify({inputs:p.sources.slice(0,now.inputs.length),rosters:JSON.parse(Buffer.from(p.entries.find(e=>e.path.includes('/links/')).content,'base64')).rosters}))throw new Error('Upgrade source roster changed');};
    save();
    const snapshotPath='.sinapse/project-expert/backups/'+p.transactionId+'/upgrade-snapshots.json';
    const snapshotBytes=bytes({schemaVersion:1,transactionId:p.transactionId,planSha256:journal.planSha256,snapshots:upgrade.snapshots});
    writeFileAtomically(gateway.safeFile(p.home,snapshotPath,{missing:true}),snapshotBytes,p.home,{expectedContentSha256:null});
    try{
      for(const entry of journal.entries){verifySource();entry.state='intent';save();if(beforeWrite)beforeWrite(entry);writeFileAtomically(gateway.safeFile(entry.root,entry.path,{missing:true}),Buffer.from(entry.content,'base64'),entry.root,{expectedContentSha256:entry.expectedDigest});entry.state='written';save();if(afterWrite)afterWrite(entry);}
      for(const entry of journal.entries)if(gateway.digest(entry.root,entry.path)!==entry.sha256)throw new Error('Upgrade readback mismatch');
      for(const root of p.projectRoots)gateway.loadLink({home:p.home,cwd:root,receiptSha256:expectedNewRegistrySha256});
      journal.status='upgraded-bounded';save();
      return {status:journal.status,transactionId:p.transactionId,registrySha256:expectedNewRegistrySha256,journalPath:relative,journalSha256:journalDigest,snapshotPath,snapshotSha256:gateway.sha(snapshotBytes),contextOnly:true,executionObserved:false,privateLibraryCopied:false};
    }catch(error){restoreWrites(upgrade,journal);journal.originalError=error.message;try{save();}catch(e){error.journalError=e.message;}error.recovery={status:journal.status,blockedFiles:journal.blockedFiles};throw error;}
  });
}
function rollbackUpgrade(upgrade,{expectedJournalSha256,expectedSnapshotSha256} = {}) {
  if(upgrade?.kind!=='sinapse-project-expert-upgrade-plan' || !/^[a-zA-Z0-9_-]{1,100}$/.test(upgrade.plan?.transactionId || ''))throw new Error('Invalid upgrade rollback plan');
  const p=upgrade.plan,relative=journalRelative(upgrade),snapshotPath='.sinapse/project-expert/backups/'+p.transactionId+'/upgrade-snapshots.json';
  if(!/^[a-f0-9]{64}$/.test(expectedJournalSha256 || '') || gateway.digest(p.home,relative)!==expectedJournalSha256 || !/^[a-f0-9]{64}$/.test(expectedSnapshotSha256 || '') || gateway.digest(p.home,snapshotPath)!==expectedSnapshotSha256)throw new Error('Upgrade rollback trust hash mismatch');
  const journal=gateway.readJson(p.home,relative,16*1024*1024),snapshots=gateway.readJson(p.home,snapshotPath,16*1024*1024);
  if(journal.status!=='upgraded-bounded' || journal.kind!=='sinapse-project-expert-upgrade-journal' || journal.planSha256!==gateway.sha(bytes(upgrade)) || snapshots.planSha256!==journal.planSha256 || JSON.stringify(snapshots.snapshots)!==JSON.stringify(upgrade.snapshots) || JSON.stringify(journal.entries.map(({state:_state,...e})=>e))!==JSON.stringify(p.entries))throw new Error('Upgrade rollback ownership mismatch');
  return lock(upgrade,'upgrade-rollback',()=>{restoreWrites(upgrade,journal);const b=bytes(journal);writeFileAtomically(gateway.safeFile(p.home,relative),b,p.home,{expectedContentSha256:expectedJournalSha256});return {status:journal.status,blockedFiles:journal.blockedFiles,journalSha256:gateway.sha(b),privateLibraryCopied:false};});
}
if(require.main===module){
  try{
    const [command,file,...args]=process.argv.slice(2);let result;
    if(command==='prepare'&&args.length>=5){const [home,oldHash,oldTransaction,source,...projects]=args;const p=prepareUpgrade({home,expectedOldRegistrySha256:oldHash,expectedOldTransactionId:oldTransaction,sourceRoot:source,projectRoots:projects,authorization:'Explicit user-authorized bounded project expert upgrade'});fs.writeFileSync(file,bytes(p),{flag:'wx',mode:0o600});result={status:'prepared',transactionId:p.plan.transactionId,expectedNewRegistrySha256:p.expectedNewRegistrySha256};}
    else if(command==='apply'&&args.length===1)result=applyUpgrade(JSON.parse(fs.readFileSync(file,'utf8')),{expectedNewRegistrySha256:args[0]});
    else if(command==='rollback'&&args.length===2)result=rollbackUpgrade(JSON.parse(fs.readFileSync(file,'utf8')),{expectedJournalSha256:args[0],expectedSnapshotSha256:args[1]});
    else throw new Error('Usage: project-expert-upgrade.cjs prepare <private-plan> <home> <old-registry-sha> <old-transaction> <source> <project>... | apply <private-plan> <new-registry-sha> | rollback <private-plan> <journal-sha> <snapshot-sha>');
    console.log(JSON.stringify(result));
  }catch(error){console.error(error.message);process.exitCode=1;}
}
module.exports={prepareUpgrade,validateUpgrade,applyUpgrade,rollbackUpgrade};
