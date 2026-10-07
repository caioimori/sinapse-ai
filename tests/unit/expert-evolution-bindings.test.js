'use strict';
const e=require('../../scripts/expert-evolution/expertise.cjs');
const k=require('../../scripts/framework-evolution/knowledge.cjs');
const r=require('../../scripts/framework-evolution/runtime.cjs');
test('negative controls never receive unrelated supplements',()=>{
  const profile=e.getProfile({agentId:'dx-frontend-engineer',compact:true,maxChars:3000,task:{command:'unrelated',text:'banana'}});
  expect(profile.deliverables).toEqual([]); expect(profile.selectionEvidence.status).toBe('gap');
  for(const text of ['estado','evidência']) expect(k.retrieveKnowledge({agentId:'dx-frontend-engineer',task:{text}}).items).toEqual([]);
  expect(k.retrieveKnowledge({agentId:'css-motion-artist',task:{command:'analyze-reference-animation'},brief:'CSS estado evidência'}).items).toEqual([]);
  expect(()=>r.buildRuntimeContext({agentId:'css-motion-artist',task:'analyze-reference-animation',brief:'CSS estado evidência'})).toThrow('Task authority requires delegation: css-motion-artist:analyze-reference-animation -> animation-interpreter');
});
test('Storybook binding is explicit and independent of profile order',()=>{
  const program=e.loadProgram();expect(e.validateTaskBindings(program,{root:process.cwd()})).toEqual({valid:true,errors:[]});
  const binding=e.resolveTaskBinding({agentId:'dx-frontend-engineer',command:'setup-storybook-integration'});
  expect(binding.deliverableIds).toEqual(['frontend-storybook']);
  program.profiles.profiles.reverse(); for(const p of program.profiles.profiles){p.deliverables.reverse();p.competencies.reverse();}
  expect(e.validateTaskBindings(program,{root:process.cwd()})).toEqual({valid:true,errors:[]});
});
test('modal and motion required criteria are preserved or explicitly deferred',()=>{
  for(const [agentId,command] of [['dx-frontend-engineer','implement-component-library'],['css-motion-artist','create-css-animation'],['animation-performance-engineer','ensure-animation-accessibility'],['production-director','write-video-script']]){
    const p=e.getProfile({agentId,compact:true,maxChars:3000,task:{command}});
    const binding=e.resolveTaskBinding({agentId,command});const emitted=p.deliverables.flatMap(d=>d.criteria.map(c=>c.id));
    expect(p.criteriaComplete ? emitted : p.omittedCriterionIds).toEqual(expect.arrayContaining(binding.requiredCriterionIds));
    expect(JSON.stringify(p).length).toBeLessThanOrEqual(3000);
    for(const ref of p.references){expect(ref.rights).toBeTruthy();expect(['READ','CANDIDATE']).toContain(ref.status);}
  }
});
test('bounded user brief enters runtime and cannot escape via file option',()=>{
  const p=r.buildRuntimeContext({agentId:'dx-frontend-engineer',task:'implement-component-library',brief:'Modal com Escape e retorno de foco'});
  expect(p.brief).toBe('Modal com Escape e retorno de foco'); expect(p.knowledge.items.map(h=>h.id)).toContain('priority-modal-focus');
  expect(()=>r.buildRuntimeContext({agentId:'dx-frontend-engineer',task:'implement-component-library',brief:'x'.repeat(4001)})).toThrow('brief');
  expect(()=>r.parseArgs(['dx-frontend-engineer','--task','implement-component-library','--brief-file','../secret'])).toThrow();
});
test('all profiles preserve canonical identity without fake expertise',()=>{
  const p=e.loadProgram();for(const profile of p.profiles.profiles){
    expect(profile.validatedExpertise).toBe(false);
    expect(profile.competencies.every(c=>/^[a-z][a-z0-9-]*$/.test(c))).toBe(true);
    if(!profile.contractReviewed){expect(profile.competencies).toEqual([]);expect(profile.deliverables).toEqual([]);}
  }
});
test('small budget emits only pointer/gap and every required criterion ID',()=>{
  const binding=e.resolveTaskBinding({agentId:'css-motion-artist',command:'create-css-animation'});
  const p=e.getProfile({agentId:'css-motion-artist',compact:true,maxChars:1600,task:{command:'create-css-animation'}});
  expect(p.criteriaComplete).toBe(false);expect(p.deliverables).toEqual([]);expect(p.selectionEvidence.status).toBe('deferred-budget');
  expect(p.omittedCriterionIds).toEqual(binding.requiredCriterionIds);expect(JSON.stringify(p).length).toBeLessThanOrEqual(1600);
});
test('tampered task/source hashes and dangling critical IDs fail closed',()=>{
  for(const mutate of [b=>b.sourceSha256='f'.repeat(64),b=>b.taskSha256='f'.repeat(64),b=>b.requiredCriterionIds.pop(),b=>b.deliverableIds=['banana']]){
    const p=e.loadProgram();mutate(p.bindings.bindings[0]);expect(e.validateTaskBindings(p).valid).toBe(false);
  }
});
test('rights and source status survive compact source selection',()=>{
  const p=e.getProfile({agentId:'dx-frontend-engineer',compact:true,maxChars:3000,task:{command:'implement-component-library'}});
  expect(p.references.some(r=>r.status==='READ'&&r.locator&&r.contentSha256&&r.rights)).toBe(true);
  expect(p.references.some(r=>r.status==='CANDIDATE'&&r.locator===null&&r.rights)).toBe(true);
});
test('CSS binding excludes WebGL and specialist mismatch does not borrow supplement',()=>{
  const css=k.retrieveKnowledge({agentId:'css-motion-artist',task:{command:'create-css-animation',text:'WebGL readPixels VRAM'},brief:'CSS hover transform'});
  expect(css.items.length).toBeGreaterThan(0);expect(css.items.map(h=>h.id)).not.toContain('h-webgl-main-thread');expect(css.items.map(h=>h.id)).not.toContain('h-webgl-resource-budget');
  const other=k.retrieveKnowledge({agentId:'animation-interpreter',task:{command:'create-css-animation'},brief:'CSS hover transform'});
  expect(other.items).toEqual([]);
});
test('known metadata/slogan candidates stay historical after a new task contract is reviewed',()=>{
  const p=e.loadProgram();for(const id of ['design-system','roadmap-sentinel','platform-aesthetic-director']){
    const a=p.profiles.profiles.find(a=>a.agentId===id);expect(a.candidateContracts.semanticCorrection.reason).toBeTruthy();
    expect(a.candidateContracts.status).toBe('unreviewed');
    for(const legacy of a.candidateContracts.competencies) expect(a.competencies).not.toContain(legacy);
    for(const legacy of a.candidateContracts.deliverables) expect(a.deliverables.map(d=>d.id)).not.toContain(legacy.id);
    if(!a.contractReviewed){expect(a.competencies).toEqual([]);expect(a.deliverables).toEqual([]);}
    expect(a.validatedExpertise).toBe(false);
  }
});
