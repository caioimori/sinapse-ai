'use strict';
const fs=require('node:fs'),path=require('node:path');
const competence=require('../../scripts/expert-evolution/competence.cjs');
const expertise=require('../../scripts/expert-evolution/expertise.cjs');
const runtime=require('../../scripts/framework-evolution/runtime.cjs');
const installer=require('../../scripts/framework-evolution/project-expert-install.cjs');
const ROOT=path.resolve(__dirname,'../..');
describe('bounded individual competence supplements',()=>{
  test('all 172 selected task contracts preserve every critical gate within 12000/6000/3000',()=>{
    const program=competence.loadCompetence(),matrix=[];
    for(const p of program.profiles){
      const context=runtime.buildRuntimeContext({agentId:p.agentId,task:p.selectedTask.command,contextOnly:true});
      const profileChars=JSON.stringify(context.profile).length,knowledgeChars=JSON.stringify(context.knowledge).length;
      expect(context.charsUsed).toBe(JSON.stringify(context).length);
      expect(context.charsUsed).toBeLessThanOrEqual(12000);expect(knowledgeChars).toBeLessThanOrEqual(6000);expect(profileChars).toBeLessThanOrEqual(3000);
      expect(context.profile.criteriaComplete).toBe(true);expect(context.profile.omittedCriterionIds).toEqual([]);
      expect(context.knowledge.competence.qualityCriteria).toEqual(p.qualityCriteria);
      expect(context.knowledge.competence.vetoes).toEqual(p.vetoes);
      expect(context.operational.task.authority).toEqual(p.selectedTask.authority);
      expect(context).toMatchObject({contextOnly:true,executionObserved:false,capsule:{model:null}});
      matrix.push({agentId:p.agentId,command:p.selectedTask.command,authority:p.selectedTask.authority,chars:context.charsUsed,knowledge:knowledgeChars,profile:profileChars,criteriaComplete:true,criticalCriterionIds:p.qualityCriteria.filter(c=>c.critical).map(c=>c.id),executionObserved:false});
    }
    const output=process.env.SINAPSE_RUNTIME_MATRIX_OUTPUT;
    if(output){
      if(!/^examples\/framework-quality\/output\/expertise-20261007\/[a-z0-9-]+\.json$/.test(output))throw new Error('Unsafe matrix output destination');
      const file=require('../../scripts/framework-evolution/project-expert.cjs').safeFile(ROOT,output,{missing:true});
      fs.mkdirSync(path.dirname(file),{recursive:true});fs.writeFileSync(file,JSON.stringify(matrix,null,2)+'\n');
    }
  });
  test('canonical 172 coverage is grounded and remains planned, with no diagnostic outputs',()=>{
    const program=competence.loadCompetence();
    expect(competence.validateCompetence(program)).toEqual({valid:true,errors:[]});
    expect(program.profiles).toHaveLength(172);
    expect(program.profiles.every(p=>p.status==='planned'&&p.validatedExpertise===false)).toBe(true);
    expect(JSON.stringify(program)).not.toMatch(/"(?:heldOutCase|brief|output|expectedCriteria)"\s*:/);
    const publicPacks=['creative','business','knowledge'].map(c=>JSON.parse(fs.readFileSync(path.join(ROOT,'research/expert-evolution/competence-packs/'+c+'.json'),'utf8')));
    expect(publicPacks.flatMap(p=>p.profiles)).toHaveLength(172);
    expect(publicPacks.every(p=>p.profiles.every(p=>p.diagnosticCase.outputSha256&&!p.diagnosticCase.output&&!p.heldOutCase))).toBe(true);
  });
  test.each(['missing-source','canonical-mismatch','task-mismatch','output-leak','false-promotion','excerpt-drift','critical-loss'])('rejects %s before knowledge retrieval',kind=>{
    const p=competence.loadCompetence();
    const first=p.profiles[0];
    if(kind==='missing-source')first.mechanisms[0].sourceIds=['missing-source'];
    if(kind==='canonical-mismatch')first.canonical.sha256='0'.repeat(64);
    if(kind==='task-mismatch')first.selectedTask.path='other.md';
    if(kind==='output-leak')first.heldOutCase={output:'reserved answer'};
    if(kind==='false-promotion')first.validatedExpertise=true;
    if(kind==='excerpt-drift')p.sources[0].excerpt+='tampered';
    if(kind==='critical-loss')first.qualityCriteria=first.qualityCriteria.map(c=>({...c,critical:false}));
    expect(competence.validateCompetence(p).valid).toBe(false);
  });
  test.each(['ad-copywriter','animation-interpreter','analyst','config-engineer','mcp-integrator','dx-frontend-engineer'])('retrieves specific conditions and all protected checks for %s',agentId=>{
    const p=competence.loadCompetence().profiles.find(p=>p.agentId===agentId);
    const supplement=competence.selectCompetenceKnowledge({agentId,command:p.selectedTask.command,brief:'contradictory evidence conditions and exception'});
    expect(supplement.taskMatched).toBe(true);
    expect(supplement.mechanisms.length).toBeGreaterThan(0);
    expect(supplement.qualityCriteria).toEqual(p.qualityCriteria);
    expect(supplement.vetoes).toEqual(p.vetoes);
    expect(JSON.stringify(supplement).length).toBeLessThanOrEqual(6000);
    const result=runtime.buildRuntimeContext({agentId,task:p.selectedTask.command,contextOnly:true});
    expect(result.charsUsed).toBeLessThanOrEqual(12000);
    expect(JSON.stringify(result.knowledge).length).toBeLessThanOrEqual(6000);
    expect(JSON.stringify(result.profile).length).toBeLessThanOrEqual(3000);
    expect(result.profile.criteriaComplete).toBe(true);
    const binding=expertise.resolveTaskBinding({agentId,command:p.selectedTask.command});
    expect(result.profile.deliverables.flatMap(d=>d.criteria).map(c=>c.id)).toEqual(expect.arrayContaining(binding?.requiredCriterionIds||p.qualityCriteria.map(c=>c.id)));
    expect(result).toMatchObject({contextOnly:true,executionObserved:false,capsule:{model:null}});
  });
  test('unmatched task exposes a gap and never retrieves another task supplement',()=>{
    const result=competence.selectCompetenceKnowledge({agentId:'analyst',command:'other-real-task'});
    expect(result.taskMatched).toBe(false);expect(result.mechanisms).toEqual([]);
    expect(()=>competence.selectCompetenceKnowledge({agentId:'analyst',command:'create-deep-research-prompt',maxChars:256})).toThrow('Critical');
  });
  test.each(['ad-copywriter','meta-ads-specialist','cost-optimizer'])('mandatory provenance and limits fit alongside protected criteria for %s',agentId=>{
    const p=competence.loadCompetence().profiles.find(p=>p.agentId===agentId);
    for(const maxChars of [2400,3200,3790,5000]){
      const result=competence.selectCompetenceKnowledge({agentId,command:p.selectedTask.command,maxChars});
      expect(JSON.stringify(result).length).toBeLessThanOrEqual(maxChars);
      expect(result.qualityCriteria).toEqual(p.qualityCriteria);expect(result.vetoes).toEqual(p.vetoes);
      expect(result.sourcePointer).toBe(competence.FILE);
      expect(result.gaps.some(gap=>gap.includes('blind/causal'))).toBe(true);
    }
  });
  test('frozen data graph excludes diagnostic, benchmark, and mutable budget JSON files',()=>{
    const graph=installer.sourceInputs(ROOT);
    expect(graph.inputs.some(input=>input.path==='research/expert-evolution/competence-runtime.json')).toBe(true);
    expect(graph.inputs.filter(input=>input.path.startsWith('research/')).some(input=>/benchmark|jev-pilot|budget|competence-packs/.test(input.path))).toBe(false);
    expect(graph.inputs.some(input=>input.path.includes('original-packs/'))).toBe(false);
  });
  test('all eleven original unread candidates remain candidates across every public knowledge surface',()=>{
    const runtime=competence.loadCompetence(),sources=expertise.loadProgram().sources.references;
    const actual=[];
    const candidates={creative:['mobbin'],business:['meta-dedup-candidate','rfb-perguntao-candidate'],knowledge:['prisma','wcag','dalio','johnstone','snyder','klaff','thiel','ganz']};
    for(const cohort of ['creative','business','knowledge']){
      const pack=JSON.parse(fs.readFileSync(path.join(ROOT,'research/expert-evolution/competence-packs/'+cohort+'.json'),'utf8'));
      expect(pack.originalPackSha256).toMatch(/^[a-f0-9]{64}$/);
      for(const candidate of candidates[cohort]){
        const id='upgrade-'+cohort+'-'+candidate;actual.push(id);
        for(const surface of [runtime.sources,sources,pack.sources])expect(surface.find(s=>s.id===id)).toMatchObject({status:'CANDIDATE',originalStatus:'CANDIDATE',originalSourceId:candidate,sourceScope:'external-candidate',readAt:null,excerpt:null,contentSha256:null});
      }
    }
    expect(actual).toHaveLength(11);
    expect(runtime.sources.filter(s=>s.sourceScope==='external-section'&&s.status==='READ')).toHaveLength(75);
    const meta=runtime.profiles.find(p=>p.agentId==='meta-ads-specialist');
    const retrieved=competence.selectCompetenceKnowledge({agentId:meta.agentId,command:meta.selectedTask.command});
    expect([...retrieved.mechanisms,...retrieved.mentalModels,...retrieved.tools].flatMap(m=>m.sourceIds).some(id=>actual.includes(id))).toBe(false);
    expect(retrieved.sources.some(s=>actual.includes(s.id))).toBe(false);
  });
});
