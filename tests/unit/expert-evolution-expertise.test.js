'use strict';
const fs=require('node:fs');
const os=require('node:os');
const path=require('node:path');
const crypto=require('node:crypto');
const e=require('../../scripts/expert-evolution/expertise.cjs');
const j=require('../../scripts/framework-evolution/jev.cjs');
const hash=text=>crypto.createHash('sha256').update(text).digest('hex');
let root;
const source=()=>({id:'licensed-sample',title:'Owned interview',kind:'text',provenance:{uri:'urn:sinapse:sample',capturedAt:'2026-10-02',capturedBy:'fixture-author',locator:'pages 1-2'},rights:{authorized:true,basis:'owned',evidence:'Author-created fixture'},units:[{locator:'page 1',text:'A contextual decision with an explicit exception. '.repeat(60)}]});
beforeEach(()=>{root=fs.realpathSync.native(fs.mkdtempSync(path.join(os.tmpdir(),'expert-evolution-')));fs.mkdirSync(path.join(root,'research/expert-evolution'),{recursive:true});for(const f of ['expert-profiles.json','source-program.json','jev-use-cases.json','task-bindings.json'])fs.copyFileSync(path.join(__dirname,'../../research/expert-evolution',f),path.join(root,'research/expert-evolution',f));});
afterEach(()=>fs.rmSync(root,{recursive:true,force:true}));
test('172 canonical profiles and 17 squads have differentiated missions, outputs, criteria and source programs',()=>{
  const p=e.loadProgram();expect(e.validateProgram(p)).toEqual({valid:true,errors:[]});
  expect(p.profiles.profiles).toHaveLength(172);expect(new Set(p.profiles.profiles.map(p=>p.mission)).size).toBe(172);
  expect(new Set(p.profiles.profiles.filter(p=>p.squad!=='core').map(p=>p.squad)).size).toBe(17);
  expect(p.sources.profilePrograms.map(p=>p.agentId).sort()).toEqual(p.profiles.profiles.map(p=>p.agentId).sort());
  const frontend=e.getProfile({agentId:'dx-frontend-engineer'}),sonic=e.getProfile({agentId:'brand-sonic-designer'});
  expect(frontend.mission).not.toBe(sonic.mission);expect(frontend.competencies).not.toEqual(sonic.competencies);
  expect(frontend.deliverables[0].criteria.some(c=>c.check.includes('390px'))).toBe(true);
  expect(sonic.references.some(r=>r.referenceId==='brand-sonic-designer-specific')).toBe(true);
  expect(p.profiles.profiles.every(p=>p.status==='planned'&&p.gaps.length>=2&&p.evolution.hoursObserved===null)).toBe(true);
});
test('unknown ID, traversal, stale canonical hash and complete JSON budget fail closed',()=>{
  expect(()=>e.getProfile({agentId:'unknown-agent'})).toThrow('Unknown');expect(()=>e.getProfile({agentId:'../analyst'})).toThrow();
  const p=e.loadProgram();p.profiles.profiles[0].canonical.sha256='f'.repeat(64);expect(e.validateProgram(p).valid).toBe(false);
  expect(()=>e.getProfile({agentId:'dx-frontend-engineer',maxChars:256})).toThrow('Complete JSON');
  const developer=e.loadProgram().profiles.profiles.find(p=>p.agentId==='developer');
  fs.mkdirSync(path.dirname(path.join(root,developer.canonical.path)),{recursive:true});
  fs.copyFileSync(path.join(__dirname,'../..',developer.canonical.path),path.join(root,developer.canonical.path));
  fs.mkdirSync(path.join(root,'.codex/agents'),{recursive:true});
  fs.copyFileSync(path.join(__dirname,'../../.codex/agents/developer.md'),path.join(root,'.codex/agents/developer.md'));
  fs.copyFileSync(path.join(__dirname,'../../.codex/command-registry.json'),path.join(root,'.codex/command-registry.json'));
  const program=e.loadProgram();
  const dependencies=[...program.sources.references.filter(r=>r.sourceScope==='local-contract'&&developer.references.some(ref=>ref.referenceId===r.id)).map(r=>r.sourceRef.path),...program.bindings.bindings.filter(b=>b.agentId==='developer').map(b=>b.taskPath)];
  for(const relative of dependencies){fs.mkdirSync(path.dirname(path.join(root,relative)),{recursive:true});fs.copyFileSync(path.join(__dirname,'../..',relative),path.join(root,relative));}
  expect(e.getProfile({root,agentId:'developer',compact:true,maxChars:3000}).agentId).toBe('developer');
  expect(e.validateProgram(e.loadProgram(root),{root}).valid).toBe(false);
});
test('candidate references never count as READ and malformed read provenance fails',()=>{
  const p=e.loadProgram();expect(p.sources.references.some(r=>r.status==='CANDIDATE')).toBe(true);
  const read=p.sources.references.find(r=>r.status==='READ');delete read.locator;expect(e.validateProgram(p).valid).toBe(false);
  expect(()=>e.assessPromotion({profile:p.profiles.profiles[0],evidence:p.sources.references,evaluation:{passed:true}})).toThrow();
});
test('ingestion defaults to dry run; explicit persistence bounds segments and deduplicates across origins',()=>{
  const s=source();const dry=e.ingest({root,source:s,maxSegmentChars:128});expect(dry.mode).toBe('dry-run');expect(fs.existsSync(path.join(root,'research/expert-evolution/library'))).toBe(false);
  const first=e.ingest({root,source:s,maxSegmentChars:128,persist:true});expect(first.addedSegments).toBeGreaterThan(0);
  const manifest=JSON.parse(fs.readFileSync(path.join(root,'research/expert-evolution/library/manifest.json'),'utf8'));
  const texts=manifest.segments.map(s=>JSON.parse(fs.readFileSync(path.join(root,'research/expert-evolution/library',s.id+'.json'),'utf8')).text);
  expect(texts.every(t=>t.length<=128)).toBe(true);expect(e.ingest({root,source:s,maxSegmentChars:128,persist:true}).duplicateCapture).toBe(true);
  const second={...s,id:'second-capture'};expect(e.ingest({root,source:second,maxSegmentChars:128,persist:true}).addedSegments).toBe(0);
  const updated=JSON.parse(fs.readFileSync(path.join(root,'research/expert-evolution/library/manifest.json'),'utf8'));expect(updated.segments.every(s=>s.origins.some(o=>o.sourceId==='second-capture'))).toBe(true);
  expect(()=>e.ingest({root,source:{...s,title:'Different capture'},persist:true})).toThrow('already bound');
});
test('rights, provenance, locator, huge input and invalid segment budget reject before persistence',()=>{
  for(const mutate of [s=>delete s.rights,s=>s.rights.authorized=false,s=>s.rights.basis='publicly-accessible',s=>delete s.provenance.locator,s=>delete s.units[0].locator,s=>s.provenance.uri='http://insecure.example',s=>s.units[0].text='x'.repeat(1000001)]){const s=source();mutate(s);expect(()=>e.ingest({root,source:s,persist:true})).toThrow();}
  expect(()=>e.ingest({root,source:source(),maxSegmentChars:6500})).toThrow();expect(fs.existsSync(path.join(root,'research/expert-evolution/library'))).toBe(false);
});
test('transcript hours use observed nonoverlapping units; no interpolated timestamps or invented text hours',()=>{
  const s=source();s.kind='transcript';s.units=[{locator:'00:10-00:30',startSeconds:10,endSeconds:30,text:'Transcript text. '.repeat(40)}];
  expect(e.ingest({root,source:s,persist:true,maxSegmentChars:128}).metrics.observedSeconds).toBe(20);
  const m=JSON.parse(fs.readFileSync(path.join(root,'research/expert-evolution/library/manifest.json'),'utf8'));expect(m.segments[0].origins[0].timestampScope).toContain('not interpolated');
  const bad={...s,id:'overlap',units:[...s.units,{locator:'00:20-00:40',startSeconds:20,endSeconds:40,text:'overlap'}]};expect(()=>e.ingest({root,source:bad,persist:true})).toThrow('Overlapping');
  expect(e.ingest({root,source:{...source(),id:'plain-text'}}).metrics.observedSeconds).toBeNull();
});
test('all 119 Jev cases ground one atomic question each in persisted evidence and existing context guard',()=>{
  e.ingest({root,source:source(),persist:true});const m=JSON.parse(fs.readFileSync(path.join(root,'research/expert-evolution/library/manifest.json'),'utf8'));
  const cases=e.loadProgram().useCases.useCases;expect(cases).toHaveLength(119);
  expect(new Set(cases.map(c=>c.squad)).size).toBe(17);
  for(const c of cases){const p=e.planUseCase({root,useCaseId:c.id,evidenceIds:[m.segments[0].id],caseContext:'One claim and its explicit condition, exception and criterion.'});expect(p.called).toBe(false);expect(Object.keys(p.payload.questions)).toEqual([c.id]);expect(p.payload.state.evidence[0].origins[0].locator).toBe('page 1');expect(()=>j.validatePayload(p.payload)).not.toThrow();}
  expect(()=>e.planUseCase({root,useCaseId:cases[0].id,evidenceIds:['f'.repeat(64)],caseContext:'case'})).toThrow('Unknown evidence');
  expect(()=>e.planUseCase({root,useCaseId:cases[0].id,evidenceIds:[m.segments[0].id],caseContext:'case',maxChars:256})).toThrow('Complete JSON');
});
test('tampered segment, undocumented use case and absent case context fail before Jev',()=>{
  e.ingest({root,source:source(),persist:true});const m=JSON.parse(fs.readFileSync(path.join(root,'research/expert-evolution/library/manifest.json'),'utf8')),id=m.segments[0].id;
  expect(()=>e.planUseCase({root,useCaseId:'unknown-case',evidenceIds:[id],caseContext:'case'})).toThrow('Unknown');
  expect(()=>e.planUseCase({root,useCaseId:'squad-design-support',evidenceIds:[id],caseContext:''})).toThrow();
  fs.writeFileSync(path.join(root,'research/expert-evolution/library',id+'.json'),JSON.stringify({text:'tampered'}));expect(()=>e.planUseCase({root,useCaseId:'squad-design-support',evidenceIds:[id],caseContext:'claim'})).toThrow('hash mismatch');
});
test('promotion requires independent held-out per-competency evidence; eligibility never mutates profile',()=>{
  const profile=e.getProfile({agentId:'dx-frontend-engineer'}),evidence=['a','b'].map(id=>({id,status:'READ',locator:'section '+id,excerpt:'Original authorized evidence '+id,contentSha256:hash('Original authorized evidence '+id)}));
  const evaluation={agentId:profile.agentId,independent:true,heldOut:true,passed:true,receiptId:'review-1',reviewer:'independent-reviewer',executor:'implementation-author',model:j.MODEL,corpusSha256:'a'.repeat(64),caseIds:['positive','negative'],competencyResults:profile.competencies.map(competency=>({competency,passed:true,evidenceIds:['a','b'],caseIds:['positive','negative'],negativeCaseId:'negative'}))};
  expect(()=>e.assessPromotion({profile,evidence,evaluation})).toThrow('resolvable typed artifact receipt');expect(profile.status).toBe('planned');
  expect(()=>e.assessPromotion({profile,evidence,evaluation:{...evaluation,independent:false}})).toThrow();expect(()=>e.assessPromotion({profile,evidence,evaluation:{...evaluation,competencyResults:[]}})).toThrow('competency');expect(()=>e.assessPromotion({profile,evidence:evidence.slice(0,1),evaluation})).toThrow();
});
test('ingest rejects active writer locks and reconstructs bounded Unicode chunks without loss',()=>{
  const s=source();s.units=[{locator:'page 1',text:'🙂'.repeat(170)+'tail'}];e.ingest({root,source:s,maxSegmentChars:129,persist:true});
  const m=JSON.parse(fs.readFileSync(path.join(root,'research/expert-evolution/library/manifest.json'),'utf8'));
  const chunks=m.segments.flatMap(segment=>segment.origins.filter(o=>o.sourceId===s.id).map(origin=>({origin,text:JSON.parse(fs.readFileSync(path.join(root,'research/expert-evolution/library',segment.id+'.json'),'utf8')).text}))).sort((a,b)=>a.origin.charStart-b.origin.charStart);
  expect(chunks.map(c=>c.text).join('')).toBe(s.units[0].text);expect(chunks.every(c=>!/[\uD800-\uDBFF]$/.test(c.text))).toBe(true);
  const lock=path.join(root,'research/expert-evolution/library/ingest.lock');fs.writeFileSync(lock,'active');
  expect(()=>e.ingest({root,source:{...s,id:'blocked-capture'},persist:true})).toThrow();expect(fs.readFileSync(lock,'utf8')).toBe('active');
  const after=JSON.parse(fs.readFileSync(path.join(root,'research/expert-evolution/library/manifest.json'),'utf8'));expect(after.sources).toHaveLength(1);
});
test('unsafe numeric metadata and absent per-competency negative evaluation reject',()=>{
  const s=source();s.units[0].startSeconds=NaN;expect(()=>e.ingest({root,source:s,persist:true})).toThrow('JSON safe');
  const p=e.loadProgram();p.profiles.profiles[0].references[0].referenceId='unknown-source';expect(e.validateProgram(p).valid).toBe(false);
  expect(()=>e.assessPromotion({profile:p.profiles.profiles[0],evaluation:{passed:true,independent:true,heldOut:true},evidence:[]})).toThrow();
});
test('compact runtime profile preserves gaps and read/candidate boundaries within complete JSON budget',()=>{
  const architecture=e.getProfile({agentId:'dx-frontend-engineer',compact:true,maxChars:3000,task:{command:'setup-frontend-architecture',title:'Frontend architecture documentation',text:'architecture routing boundaries'}});
  const storybook=e.getProfile({agentId:'dx-frontend-engineer',compact:true,maxChars:3000,task:{command:'setup-storybook-integration',title:'Storybook stories',text:'Storybook isolation'}});
  expect(JSON.stringify(architecture).length).toBeLessThanOrEqual(3000);expect(architecture.validatedExpertise).toBe(false);expect(architecture.status).toBe('planned');expect(architecture.gaps.length).toBeGreaterThanOrEqual(2);
  expect(architecture.deliverables[0].id).not.toBe(storybook.deliverables[0].id);expect(architecture.references.some(r=>r.status==='READ'&&r.contentSha256)).toBe(true);
  expect(()=>e.getProfile({agentId:'dx-frontend-engineer',compact:true,maxChars:256})).toThrow('Complete JSON');
  expect(()=>e.getProfile({agentId:'dx-frontend-engineer',compact:true,task:{text:'x'.repeat(4001)}})).toThrow('bounded task');
});
