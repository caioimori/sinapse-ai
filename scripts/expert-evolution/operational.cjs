'use strict';
const fs=require('node:fs'), path=require('node:path'), crypto=require('node:crypto');
const resolver=require('../../.codex/scripts/resolve-codex-agent.js');
const commands=require('../../.codex/scripts/resolve-codex-command.js');
const DEFAULT_ROOT=path.resolve(__dirname,'../..'), FILE='research/expert-evolution/operational-contracts.json';
const sha=bytes=>crypto.createHash('sha256').update(bytes).digest('hex');
function safeFile(root,relative){
  if(typeof relative!=='string'||path.isAbsolute(relative))throw new Error('Invalid operational path');
  const base=fs.realpathSync(root),target=path.resolve(base,relative),rel=path.relative(base,target);
  if(!rel||rel.startsWith('..')||path.isAbsolute(rel))throw new Error('Operational path escapes project');
  let cursor=base;for(const part of rel.split(path.sep)){cursor=path.join(cursor,part);if(fs.lstatSync(cursor).isSymbolicLink())throw new Error('Operational symlink rejected');}
  if(!fs.statSync(target).isFile())throw new Error('Operational source is not a file');return target;
}
function ownerIdentity(raw,root=DEFAULT_ROOT,index=resolver.loadCodexAgentIndex(root)){
  if(typeof raw!=='string'||!raw.trim()||raw.toLowerCase()==='tbd')return null;
  const key=raw.trim().replace(/^@/,'').toLowerCase(),direct=resolver.resolveAgentId(index,key);if(direct)return direct.id;
  const matches=Object.values(index).filter(entry=>{
    const source=fs.readFileSync(safeFile(root,entry.sourcePath),'utf8');
    const name=source.match(/^\s*-?\s*\*\*Nome:\*\*\s*(.+)$/m)?.[1]||source.match(/^ {2}name:\s*["']?([^"'\r\n]+)["']?\s*$/m)?.[1];
    return name?.trim().toLowerCase()===key;
  });return matches.length===1?matches[0].id:null;
}
function declaredOwner(text){const line=text.match(/^(?:responsavel|responsible|owner):\s*(.+)$/im)?.[1];if(!line)return null;return line.match(/^["']?@?([a-z0-9][a-z0-9-]*)["']?\s*$/i)?.[1]||'unparsed-owner';}
function authorityForTask({root=DEFAULT_ROOT,agentId,command,target,scope,resolvedBy,agent,index}){
  agent=agent||resolver.resolveCodexAgent(agentId,root);index=index||resolver.loadCodexAgentIndex(root);
  const canonical=fs.readFileSync(safeFile(root,agent.sourceOfTruth),'utf8'),taskText=fs.readFileSync(safeFile(root,target),'utf8'),ownerRaw=declaredOwner(taskText),ownerId=ownerIdentity(ownerRaw,root,index);
  if(resolvedBy==='registry'){
    const registry=commands.loadCommandRegistry(root),regAgent=commands.resolveAgent(registry,agent.agentId),regCommand=regAgent&&commands.resolveCommand(regAgent.agentSpec,command);
    if(!regCommand||regCommand.commandSpec.target!==target)throw new Error('Unverified registry authority');
    return {mode:agent.isOrchestrator?'route':'execute',basis:'explicit-registry',ownerId,delegateTo:agent.isOrchestrator?ownerId:null,executionAuthorized:!agent.isOrchestrator,registryAuthority:regAgent.agentId};
  }
  const exposure=agent.tasks.find(t=>t.command===command&&t.target===target);if(!exposure)throw new Error('Task is not exposed by this canonical agent');
  scope=exposure.scope||scope;const dependency=['declared','declared-binding'].includes(scope),owned=ownerId===agent.agentId;
  if(agent.isOrchestrator)return {mode:'delegate',basis:owned?'owned-orchestrator-task':'squad-routing',ownerId,delegateTo:ownerId,executionAuthorized:false};
  if(owned)return {mode:'execute',basis:'exact-owner',ownerId,delegateTo:null,executionAuthorized:true};
  if(agent.squad==='core'&&dependency&&resolver.extractTaskSlugs(canonical).includes(command))return {mode:'workflow',basis:'explicit-core-dependency',ownerId,delegateTo:ownerId&&ownerId!==agent.agentId?ownerId:null,executionAuthorized:true};
  if(dependency&&(!ownerRaw||ownerRaw.toLowerCase()==='tbd'))return {mode:'workflow',basis:'explicit-canonical-dependency',ownerId:null,ownerPending:!!ownerRaw,delegateTo:null,executionAuthorized:true};
  return {mode:'delegate',basis:dependency?'foreign-declared-owner':'discovery-pool-only',ownerId,delegateTo:ownerId,executionAuthorized:false};
}
function state(root){return {profiles:JSON.parse(fs.readFileSync(safeFile(root,'research/expert-evolution/expert-profiles.json'),'utf8')).profiles,index:resolver.loadCodexAgentIndex(root),registry:commands.loadCommandRegistry(root)};}
function buildContract(root,agentId,current){
  const {profiles,index,registry}=current,agent=resolver.resolveCodexAgent(agentId,root),canonical=fs.readFileSync(safeFile(root,agent.sourceOfTruth),'utf8'),profile=profiles.find(p=>p.agentId===agentId),regAgent=commands.resolveAgent(registry,agentId),tasks=[];
  for(const t of agent.tasks){
    if(regAgent&&commands.resolveCommand(regAgent.agentSpec,t.command))continue;
    const authority=authorityForTask({root,agentId,command:t.command,target:t.target,agent,index});
    if(['squad','squad-pool'].includes(t.scope)&&!authority.executionAuthorized&&!agent.isOrchestrator)continue;
    tasks.push({command:t.command,path:t.target,sha256:sha(fs.readFileSync(safeFile(root,t.target))),authority});
  }
  for(const [command,spec]of Object.entries(regAgent?.agentSpec.commands||{})){if(!spec.target)continue;tasks.push({command,path:spec.target,sha256:sha(fs.readFileSync(safeFile(root,spec.target))),authority:authorityForTask({root,agentId,command,target:spec.target,resolvedBy:'registry',agent,index})});}
  return {agentId,squad:agent.squad,role:agent.isOrchestrator?'orchestrator':'specialist',canonical:{path:agent.sourceOfTruth,sha256:sha(canonical)},mission:profile?.mission||agentId,missionBasis:'Canonical responsibility reviewed separately from external expertise',review:{status:'pending-independent-review',locator:'docs/stories/cross-provider-closeout-20261002.story.md#qa-results'},tasks,discoveryPool:{count:agent.tasks.filter(t=>['squad','squad-pool'].includes(t.scope)).length,authority:'Delegation discovery only; never specialist execution or expertise'},gaps:[...(tasks.length?[]:['No explicit executable task; canonical routing/admin only']),'Research and artifact evaluation remain distinct from operational responsibility'],validatedExpertise:false};
}
function buildContracts(root=DEFAULT_ROOT){const current=state(root),contracts=Object.keys(current.index).sort().map(id=>buildContract(root,id,current));return {schemaVersion:1,kind:'canonical-operational-contracts',agents:contracts.length,squads:new Set(contracts.map(c=>c.squad).filter(s=>s!=='core')).size,expertisePromoted:false,contracts};}
function loadContracts(root=DEFAULT_ROOT){return JSON.parse(fs.readFileSync(safeFile(root,FILE),'utf8'));}
function comparable(contract){const result={...contract};delete result.review;return result;}
function assertContract(actual,expected){if(!actual||!['pending-independent-review','canonical-reviewed-operational-not-expertise'].includes(actual.review?.status)||actual.review?.locator!==expected.review.locator||JSON.stringify(comparable(actual))!==JSON.stringify(comparable(expected)))throw new Error('Operational authority/canonical coverage mismatch '+expected.agentId);}
function validateContracts(program,{root=DEFAULT_ROOT}={}){
  const errors=[];try{
    const expected=buildContracts(root);
    if(program.schemaVersion!==expected.schemaVersion||program.kind!==expected.kind||program.expertisePromoted!==false||program.agents!==172||program.squads!==17||!Array.isArray(program.contracts)||JSON.stringify(program.contracts.map(c=>c.agentId))!==JSON.stringify(expected.contracts.map(c=>c.agentId)))throw new Error('Invalid operational coverage');
    for(let i=0;i<expected.contracts.length;i++)assertContract(program.contracts[i],expected.contracts[i]);
  }catch(error){errors.push(error.message);}return {valid:errors.length===0,errors};
}
function getOperationalContract({root=DEFAULT_ROOT,agentId,command,target,resolvedBy,maxChars=2200,requireExecution=false}={}){
  const current=state(root),agent=resolver.resolveCodexAgent(agentId,root),canonicalId=agent.agentId,program=loadContracts(root);
  if(program.schemaVersion!==1||program.expertisePromoted!==false||!Array.isArray(program.contracts))throw new Error('Invalid operational program');
  const matches=program.contracts.filter(c=>c?.agentId===canonicalId);
  if(matches.length!==1)throw new Error('Missing/ambiguous operational canonical contract '+canonicalId);
  const c=matches[0];
  assertContract(c,buildContract(root,canonicalId,current));
  const authority=authorityForTask({root,agentId:canonicalId,command,target,resolvedBy,agent,index:current.index});
  if(requireExecution&&!authority.executionAuthorized&&!agent.isOrchestrator)throw new Error('Task authority requires delegation: '+canonicalId+':'+command+' -> '+(authority.delegateTo||'unresolved owner'));
  const selected=c.tasks.find(t=>t.command===command&&t.path===target);
  if(!selected||selected.sha256!==sha(fs.readFileSync(safeFile(root,target)))||JSON.stringify(selected.authority)!==JSON.stringify(authority))throw new Error('Missing/stale operational task membership');
  const result={schemaVersion:1,agentId:canonicalId,role:c.role,mission:c.mission,canonical:c.canonical,task:{command,target,sha256:selected.sha256,authority},review:c.review,validatedExpertise:false,limits:['Operational responsibility only; read exact canonical and task.','Delegation is not execution; research/promotion and human gates remain separate.']};
  if(JSON.stringify(result).length>maxChars)throw new Error('Operational contract budget exceeded');return result;
}
if(require.main===module){
  try{const command=process.argv[2],program=command==='build'?buildContracts():loadContracts();
    if(command==='build'&&process.argv.includes('--write'))fs.writeFileSync(path.join(DEFAULT_ROOT,FILE),JSON.stringify(program,null,2)+'\n');
    const checked=validateContracts(program);process.stdout.write(JSON.stringify({command,...checked,agents:program.agents,squads:program.squads,tasks:program.contracts.reduce((n,c)=>n+c.tasks.length,0)})+'\n');if(!checked.valid)process.exitCode=1;
  }catch(error){process.stderr.write(error.message+'\n');process.exitCode=1;}
}
module.exports={buildContracts,loadContracts,validateContracts,getOperationalContract,authorityForTask,ownerIdentity,declaredOwner,safeFile,FILE};
