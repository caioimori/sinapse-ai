'use strict';
const {validatePolicy,assessModel,loadPolicy,validateAvailabilityReceipt,validateArtifactEvaluation}=require('../../scripts/expert-evolution/model-policy.cjs');
const root=require('node:path').resolve(__dirname,'../..');
const fs=require('node:fs'),os=require('node:os'),path=require('node:path'),crypto=require('node:crypto');
const now='2026-10-02T12:00:00Z',id='gpt-6.1-sol';
const sha=bytes=>crypto.createHash('sha256').update(bytes).digest('hex');
describe('model availability is separate from expertise promotion',()=>{
  test('native evidence resolves; published providers blocked and native availability never promotes',()=>{
    const policy=loadPolicy(root);
    expect(validatePolicy(policy,{now})).toEqual({valid:true,errors:[]});
    expect(assessModel(policy,id,{now}).allowed).toBe(true);
    for(const published of ['claude-opus-5-5','jev-1.13.0'])expect(assessModel(policy,published,{now}).allowed).toBe(false);
    expect(assessModel(policy,id,{now,promotion:true}).allowed).toBe(false);
    expect(policy.models[0].apiId).toBe(null);
    expect(()=>assessModel(policy,'future-invented',{now})).toThrow('Unknown');
  });
  test('candidate cannot become available from metadata or large context',()=>{
    const policy=loadPolicy(root),candidate=policy.models[1];candidate.status='candidate';
    expect(assessModel(policy,candidate.id,{now}).allowed).toBe(false);
    candidate.availability.validated=true;expect(validatePolicy(policy,{now}).valid).toBe(false);
  });
  test('written benchmark strings cannot replace typed artifact evaluation',()=>{
    const policy=loadPolicy(root);
    Object.assign(policy.models[0].evaluation,{passed:true,localBenchmark:true,evidence:['reserved comparison receipt']});
    expect(validatePolicy(policy,{now}).valid).toBe(false);
    expect(validateArtifactEvaluation({schemaVersion:1,modelId:id,scope:'written decisions only'}).valid).toBe(false);
  });
  test('expired review/receipt, duplicates, placeholder and absent TTL fail closed',()=>{
    const policy=loadPolicy(root);
    expect(assessModel(policy,id,{now:'2026-11-02'}).allowed).toBe(false);
    expect(validatePolicy(policy,{now:'2026-11-02'}).valid).toBe(false);
    policy.models.push(policy.models[0]);expect(validatePolicy(policy,{now}).valid).toBe(false);policy.models.pop();
    delete policy.reviewExpiresAt;expect(validatePolicy(policy,{now}).valid).toBe(false);
    const fresh=loadPolicy(root);delete fresh.models[0].availability.expiresAt;expect(validatePolicy(fresh,{now}).valid).toBe(false);
    fresh.models[0].availability.receipt={path:'unresolvable-placeholder',sha256:'a'.repeat(64)};expect(validatePolicy(fresh,{now}).valid).toBe(false);
  });
  test('invalid assessment clocks and future dates cannot bypass comparisons',()=>{
    const policy=loadPolicy(root);
    for(const value of ['not-a-date','',new Date(NaN),NaN,Infinity,null,{},1e100])expect(()=>assessModel(policy,id,{now:value})).toThrow('assessment date');
    expect(assessModel(policy,id,{now:new Date(now)}).allowed).toBe(true);
    expect(assessModel(policy,id,{now:Date.parse(now)}).allowed).toBe(true);
    policy.models[0].availability.checkedAt='2099-01-01';expect(validatePolicy(policy,{now:'2040-01-01'}).valid).toBe(false);
  });
  test('ordered review date and mandatory expiry required',()=>{
    const policy=loadPolicy(root);delete policy.reviewedAt;
    expect(()=>assessModel(policy,id,{now})).toThrow('reviewedAt');
    for(const reviewedAt of ['not-a-date',null,{},policy.reviewExpiresAt,'2099-01-01'])expect(validatePolicy({...policy,reviewedAt},{now}).valid).toBe(false);
  });
  test('typed receipt checks provider/account/model/expiry/origin/hashes without fetching',()=>{
    const model=loadPolicy(root).models[0],receipt=JSON.parse(fs.readFileSync(path.join(root,model.availability.receipt.path)));
    const options={root,now,provider:model.provider,modelId:id,accountScope:model.accountScope};
    expect(validateAvailabilityReceipt(receipt,options).valid).toBe(true);
    for(const change of [{provider:'anthropic-api'},{modelId:'invented-alias'},{accountScope:'other-account'},{expiresAt:undefined},{checkedAt:'2099-01-01'},{origin:'arbitrary-text'},{promotion:true}])expect(validateAvailabilityReceipt({...receipt,...change},options).valid).toBe(false);
    const broken=structuredClone(receipt);broken.evidence[0].sha256='0'.repeat(64);expect(validateAvailabilityReceipt(broken,options).valid).toBe(false);
  });
  test('artifact evaluation requires positive/negative/conflict, reproducible hashes and separate reviewer',()=>{
    const temp=fs.mkdtempSync(path.join(os.tmpdir(),'artifact evaluation '));
    try{
      fs.writeFileSync(path.join(temp,'artifact.txt'),'rendered fixture');fs.writeFileSync(path.join(temp,'review.txt'),'independent fixture review');
      const ref=name=>({path:name,sha256:sha(fs.readFileSync(path.join(temp,name)))});
      const receipt={schemaVersion:1,receiptType:'artifact-model-evaluation',passed:true,heldOut:true,independent:true,executor:'generator-a',reviewer:'reviewer-b',modelId:id,taskFamily:'fixture-ui',corpusSha256:'c'.repeat(64),cases:['positive','negative','conflict'].map(kind=>({kind,artifact:ref('artifact.txt'),review:ref('review.txt'),locator:'fixture/line1'}))};
      const options={root:temp,modelId:id,taskFamily:'fixture-ui',corpusSha256:receipt.corpusSha256};
      expect(validateArtifactEvaluation(receipt,options).valid).toBe(false);
      // Plain text reviews and booleans are metadata, not observed artifact evidence.
      expect(validateArtifactEvaluation({...receipt,cases:receipt.cases.slice(0,2)},options).valid).toBe(false);
      expect(validateArtifactEvaluation({...receipt,reviewer:'generator-a'},options).valid).toBe(false);
      expect(validateArtifactEvaluation(receipt,{...options,taskFamily:'video'}).valid).toBe(false);
    }finally{fs.rmSync(temp,{recursive:true,force:true});}
  });
  test('junction ancestor rejected before reading external policy or leaking content',()=>{
    const temp=fs.mkdtempSync(path.join(os.tmpdir(),'policy confinement ')),project=path.join(temp,'project'),outside=path.join(temp,'outside');
    fs.mkdirSync(project);fs.mkdirSync(path.join(outside,'expert-evolution'),{recursive:true});fs.writeFileSync(path.join(outside,'expert-evolution/model-policy.json'),'private sentinel');
    fs.symlinkSync(outside,path.join(project,'research'),process.platform==='win32'?'junction':'dir');
    const read=jest.spyOn(fs,'readFileSync');
    try{expect(()=>loadPolicy(project)).toThrow('symlink');expect(read).not.toHaveBeenCalled();expect(()=>loadPolicy(path.join(project,'research'))).toThrow('root symlink');expect(read).not.toHaveBeenCalled();}
    finally{read.mockRestore();fs.rmSync(temp,{recursive:true,force:true});}
  });
});
