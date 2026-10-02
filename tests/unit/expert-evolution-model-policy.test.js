'use strict';
const {validatePolicy,assessModel,loadPolicy}=require('../../scripts/expert-evolution/model-policy.cjs');
const root=require('node:path').resolve(__dirname,'../..');
const fs=require('node:fs');
const os=require('node:os');
const path=require('node:path');
const model=(id,status,validated)=>({id,provider:'native',status,availability:{validated,checkedAt:'2026-10-02',method:'authenticated execution',evidence:['run receipt']},evaluation:{passed:false,localBenchmark:false,evidence:[]}});
describe('model availability is separate from expertise promotion',()=>{
  test('current published providers remain blocked and native runtime is permitted without promotion',()=>{
    const policy=loadPolicy(root);
    expect(validatePolicy(policy)).toEqual({valid:true,errors:[]});
    expect(assessModel(policy,'gpt-6.1-sol',{now:'2026-10-02'}).allowed).toBe(true);
    for(const id of ['claude-opus-5-5','jev-1.13.0']) expect(assessModel(policy,id,{now:'2026-10-02'}).allowed).toBe(false);
    expect(()=>assessModel(policy,'future-invented')).toThrow('Unknown');
  });
  test('a candidate cannot become available from metadata or large context',()=>{
    const policy={schemaVersion:1,models:[model('official-future','candidate',false)]};
    expect(assessModel(policy,'official-future').allowed).toBe(false);
    policy.models[0].availability.validated=true;
    expect(validatePolicy(policy).valid).toBe(false);
  });
  test('native access does not satisfy promotion and local benchmark needs evidence',()=>{
    const policy={schemaVersion:1,models:[model('native-current','available',true)]};
    expect(assessModel(policy,'native-current').allowed).toBe(true);
    expect(assessModel(policy,'native-current',{promotion:true}).allowed).toBe(false);
    Object.assign(policy.models[0].evaluation,{passed:true,localBenchmark:true});
    expect(validatePolicy(policy).valid).toBe(false);
    policy.models[0].evaluation.evidence=['reserved comparison receipt'];
    expect(assessModel(policy,'native-current',{promotion:true}).allowed).toBe(true);
  });
  test('expired review, duplicate models and missing availability proof fail closed',()=>{
    const policy={schemaVersion:1,reviewedAt:'2026-10-01',reviewExpiresAt:'2026-11-01',models:[model('native-current','available',true)]};
    expect(assessModel(policy,'native-current',{now:'2026-11-02'}).allowed).toBe(false);
    policy.models.push(policy.models[0]); expect(validatePolicy(policy).valid).toBe(false);
    policy.models.pop(); policy.models[0].availability.evidence=[]; expect(validatePolicy(policy).valid).toBe(false);
  });
  test('invalid assessment clock values cannot turn expiry comparisons into allow',()=>{
    const policy={schemaVersion:1,reviewedAt:'2026-10-01',reviewExpiresAt:'2026-11-01',models:[model('native-current','available',true)]};
    for(const now of ['not-a-date','',new Date(NaN),NaN,Infinity,null,{},1e100]) expect(()=>assessModel(policy,'native-current',{now})).toThrow('assessment date');
    expect(assessModel(policy,'native-current',{now:'2026-11-01'}).allowed).toBe(false);
    expect(assessModel(policy,'native-current',{now:new Date('2026-10-02')}).allowed).toBe(true);
    expect(assessModel(policy,'native-current',{now:Date.parse('2026-10-02')}).allowed).toBe(true);
  });
  test('expiry requires a valid ordered review date rather than comparing against NaN',()=>{
    const policy={schemaVersion:1,reviewExpiresAt:'2026-11-01',models:[model('native-current','available',true)]};
    expect(validatePolicy(policy).valid).toBe(false);
    expect(()=>assessModel(policy,'native-current',{now:'2026-10-02'})).toThrow('reviewedAt');
    for(const reviewedAt of ['not-a-date',null,{},'2026-11-01','2026-11-02']) expect(validatePolicy({...policy,reviewedAt}).valid).toBe(false);
    expect(validatePolicy({...policy,reviewedAt:'2026-10-01'}).valid).toBe(true);
  });
  test('a junction ancestor is rejected before reading an external policy or leaking its content',()=>{
    const temporary=fs.mkdtempSync(path.join(os.tmpdir(),'policy confinement '));
    const project=path.join(temporary,'project'),outside=path.join(temporary,'outside');
    fs.mkdirSync(project);fs.mkdirSync(path.join(outside,'expert-evolution'),{recursive:true});
    fs.writeFileSync(path.join(outside,'expert-evolution/model-policy.json'),'private sentinel: must never be parsed');
    fs.symlinkSync(outside,path.join(project,'research'),process.platform==='win32'?'junction':'dir');
    const read=jest.spyOn(fs,'readFileSync');
    try {
      expect(()=>loadPolicy(project)).toThrow('symlink');
      expect(read).not.toHaveBeenCalled();
      expect(()=>loadPolicy(path.join(project,'research'))).toThrow('root symlink');
      expect(read).not.toHaveBeenCalled();
    } finally {read.mockRestore();fs.rmSync(temporary,{recursive:true,force:true});}
  });
});
