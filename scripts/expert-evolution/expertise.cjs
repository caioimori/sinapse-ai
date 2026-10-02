'use strict';
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const jev = require('../framework-evolution/jev.cjs');
const DEFAULT_ROOT = path.resolve(__dirname, '../..');
const hash = text => crypto.createHash('sha256').update(text).digest('hex');
const text = value => typeof value === 'string' && value.trim().length > 0;
const slug = value => typeof value === 'string' && /^[a-z0-9][a-z0-9-]*$/.test(value);
function read(file) { return JSON.parse(fs.readFileSync(file, 'utf8').replace(/^\uFEFF/, '')); }
function rootPath(root = DEFAULT_ROOT) { return fs.realpathSync(root); }
function confined(root, relative) {
  const base = rootPath(root), target = path.resolve(base, relative);
  if (!target.startsWith(base + path.sep)) throw new Error('Path outside project');
  let current = target;
  while (!fs.existsSync(current)) current = path.dirname(current);
  let cursor = current;
  while (cursor !== base) { if (fs.lstatSync(cursor).isSymbolicLink()) throw new Error('Symlink redirection rejected'); cursor = path.dirname(cursor); }
  const real = fs.realpathSync(current);
  if (real !== base && !real.startsWith(base + path.sep)) throw new Error('Symlink outside project');
  return target;
}
function loadProgram(root = DEFAULT_ROOT) {
  return {profiles: read(confined(root, 'research/expert-evolution/expert-profiles.json')), useCases: read(confined(root, 'research/expert-evolution/jev-use-cases.json')), sources: read(confined(root, 'research/expert-evolution/source-program.json')), bindings: read(confined(root, 'research/expert-evolution/task-bindings.json'))};
}
function validateProgram(program, {root = DEFAULT_ROOT, agentId} = {}) {
  const errors = [];
  try {
    const index = require('../../.codex/scripts/resolve-codex-agent.js').loadCodexAgentIndex(root);
    const profiles = program.profiles.profiles, cases = program.useCases.useCases, references = program.sources.references;
    if ([program.profiles, program.useCases, program.sources].some(p => p.schemaVersion !== 1) || !Array.isArray(profiles) || !Array.isArray(cases) || !Array.isArray(references)) throw new Error('Invalid program schema');
    const actual = profiles.map(p => p.agentId).sort(), expected = Object.keys(index).sort();
    if (actual.length !== 172 || new Set(actual).size!==172 || (agentId===undefined && JSON.stringify(actual) !== JSON.stringify(expected)) || (agentId!==undefined && (!slug(agentId)||!index[agentId]||!actual.includes(agentId)))) errors.push('Canonical 172 IDs mismatch');
    if (program.profiles.agents!==172 || program.profiles.squads!==17 || program.profiles.includesCore!==true || program.useCases.squads!==17) errors.push('Declared canonical counts mismatch');
    const plans=program.sources.profilePrograms;
    if (!Array.isArray(plans) || JSON.stringify(plans.map(p=>p.agentId).sort())!==JSON.stringify(actual)) errors.push('Source acquisition profile coverage mismatch');
    for (const p of profiles) {
      const acquisition=plans?.find(a=>a.agentId===p.agentId);
      if (!Array.isArray(acquisition?.competencyAcquisition) || JSON.stringify(acquisition.competencyAcquisition.map(c=>c.competency).sort())!==JSON.stringify([...p.competencies].sort()) || acquisition.competencyAcquisition.some(c=>c.status!=='pending'||!text(c.query)||!text(c.acceptance))) errors.push('Source acquisition competency coverage missing '+p.agentId);
    }
    const refIds = new Set();
    for (const ref of references) {
      if (!slug(ref.id) || refIds.has(ref.id) || !text(ref.title) || !/^https:\/\//.test(ref.url) || !['CANDIDATE', 'READ'].includes(ref.status) || !text(ref.rights)) errors.push('Invalid reference ' + ref.id);
      refIds.add(ref.id);
      if (ref.status === 'READ' && (!text(ref.locator) || !text(ref.readAt) || !text(ref.excerpt) || hash(ref.excerpt) !== ref.contentSha256)) errors.push('Read evidence missing ' + ref.id);
    }
    for (const p of profiles) {
      if (((agentId===undefined || p.agentId===agentId) && (!index[p.agentId] || p.squad !== index[p.agentId]?.squad || p.canonical.path !== index[p.agentId]?.sourcePath)) || !text(p.mission) || !Array.isArray(p.competencies) || p.competencies.some(c=>!slug(c)) || !Array.isArray(p.deliverables) || !Array.isArray(p.gaps) || !p.gaps.length || p.status !== 'planned' || p.validatedExpertise!==false || typeof p.contractReviewed!=='boolean' || (!p.contractReviewed && (p.competencies.length || p.deliverables.length)) || p.candidateContracts?.status!=='unreviewed') errors.push('Invalid profile ' + p.agentId);
      if ((agentId===undefined || p.agentId===agentId) && p.canonical && hash(fs.readFileSync(confined(root, p.canonical.path), 'utf8')) !== p.canonical.sha256) errors.push('Stale canonical profile ' + p.agentId);
      for (const d of p.deliverables || []) if (!text(d.name) || !Array.isArray(d.criteria) || d.criteria.length < 2 || d.criteria.some(c => !text(c.check) || !text(c.method))) errors.push('Missing deliverable criteria ' + p.agentId);
      for (const r of p.references || []) if (!refIds.has(r.referenceId) || !text(r.methodFit)) errors.push('Missing profile reference ' + p.agentId);
      if (!(p.references || []).length) errors.push('No references ' + p.agentId);
    }
    const squads = [...new Set((agentId===undefined?Object.values(index):profiles).map(p => p.squad))].filter(s => s !== 'core');
    if (squads.length !== 17) errors.push('Canonical squads mismatch');
    const caseIds = new Set();
    for (const c of cases) {
      if (!slug(c.id) || caseIds.has(c.id) || !squads.includes(c.squad) || !['choice', 'noul', 'score'].includes(c.type) || !text(c.decision) || !text(c.question) || !Array.isArray(c.inputs) || !c.inputs.length || !text(c.evaluation)) errors.push('Invalid use case ' + c.id);
      caseIds.add(c.id);
    }
    for (const squad of squads) if (cases.filter(c => c.squad === squad).length < 2) errors.push('Jev cases missing ' + squad);
    errors.push(...validateTaskBindings(program,{root,agentId}).errors);
  } catch (error) { errors.push(error.message); }
  return {valid: errors.length === 0, errors};
}
function validateTaskBindings(program, {root = DEFAULT_ROOT, agentId} = {}) {
  const errors=[];
  try {
    if(program.bindings?.schemaVersion!==1 || !Array.isArray(program.bindings.bindings)) throw new Error('Invalid task bindings schema');
    const seen=new Set(), resolve=require('../../.codex/scripts/resolve-codex-command.js').resolveCodexCommand;
    for(const b of program.bindings.bindings){
      const key=b.agentId+':'+b.command, p=program.profiles.profiles.find(p=>p.agentId===b.agentId);
      if(!slug(b.agentId)||!slug(b.command)||seen.has(key)||!p?.contractReviewed||b.sourceSha256!==p.canonical.sha256||b.review?.status!=='semantic-reviewed-not-evaluated'||!text(b.review?.rationale)||!text(b.review?.locator)) throw new Error('Invalid semantic binding '+key);
      seen.add(key);
      for(const list of ['competencyIds','deliverableIds','requiredCriterionIds']) if(!Array.isArray(b[list])||!b[list].length||new Set(b[list]).size!==b[list].length||b[list].some(v=>!slug(v))) throw new Error('Invalid binding IDs '+key);
      const ds=p.deliverables.filter(d=>b.deliverableIds.includes(d.id)), criteria=ds.flatMap(d=>d.criteria);
      if(b.competencyIds.some(c=>!p.competencies.includes(c))||ds.length!==b.deliverableIds.length||ds.some(d=>!b.competencyIds.includes(d.competency))||b.requiredCriterionIds.some(c=>!criteria.some(x=>x.id===c))||criteria.some(c=>c.critical&&!b.requiredCriterionIds.includes(c.id))) throw new Error('Binding contract mismatch '+key);
      if(agentId===undefined || b.agentId===agentId){
        const command=resolve(b.agentId,b.command,root);
        if(command.target!==b.taskPath || hash(fs.readFileSync(confined(root,b.taskPath),'utf8'))!==b.taskSha256) throw new Error('Stale task binding '+key);
        const canonical=fs.readFileSync(confined(root,p.canonical.path),'utf8');
        if(hash(canonical)!==b.sourceSha256||!canonical.includes(b.review.locator)) throw new Error('Stale canonical binding '+key);
      }
    }
  } catch(error){errors.push(error.message);}
  return {valid:errors.length===0,errors};
}
function resolveTaskBinding({root=DEFAULT_ROOT,agentId,command,program}={}) {
  if(!slug(agentId)||typeof command!=='string'||!/^[*/]?[a-z0-9][a-z0-9-]*$/.test(command)) return null;
  program=program||loadProgram(root);
  const checked=validateTaskBindings(program,{root,agentId});
  if(!checked.valid) throw new Error('Invalid task bindings: '+checked.errors.join('; '));
  return program.bindings.bindings.find(b=>b.agentId===agentId&&b.command===command.replace(/^[*/]/,''))||null;
}
function selectProtectedCriteria(profile,binding){
  return profile.deliverables.filter(d=>binding.deliverableIds.includes(d.id)).map(d=>({...d,criteria:d.criteria.filter(c=>binding.requiredCriterionIds.includes(c.id)||c.critical)}));
}
function bounded(value, maxChars) {
  if (!Number.isSafeInteger(maxChars) || maxChars < 256 || maxChars > 64000) throw new Error('Invalid JSON character budget');
  if (JSON.stringify(value).length > maxChars) throw new Error('Complete JSON exceeds character budget');
  return value;
}
function getProfile({root = DEFAULT_ROOT, agentId, maxChars = 12000, compact = false, task} = {}) {
  if (!slug(agentId)) throw new Error('Invalid agent ID');
  const program = loadProgram(root);
  const profile = program.profiles.profiles.find(p => p.agentId === agentId);
  if (!profile) throw new Error('Unknown agent ID');
  const checked = validateProgram(program, {root,agentId});
  if (!checked.valid) throw new Error('Invalid expertise program: ' + checked.errors.join('; '));
  if (task !== undefined && (!task || typeof task!=='object' || Object.keys(task).some(k=>!['command','title','text'].includes(k)) || Object.entries(task).some(([k,v])=>typeof v!=='string'||v.length>({command:128,title:512,text:4000}[k])))) throw new Error('Invalid bounded task context');
  if (typeof compact !== 'boolean') throw new Error('Invalid compact flag');
  if (!compact) {
    const {candidateContracts: _candidateContracts, declaredResponsibilities: _declaredResponsibilities, ...publicProfile}=profile;
    return bounded({...publicProfile,candidateContracts:{status:'unreviewed',pointer:'research/expert-evolution/expert-profiles.json',canonicalPointer:profile.canonical.path}},Math.min(maxChars,12000));
  }
  if(maxChars>3000) maxChars=3000;
  const binding=resolveTaskBinding({root,agentId,command:task?.command,program});
  const result={schemaVersion:1,agentId:profile.agentId,squad:profile.squad,canonical:profile.canonical,status:'planned',validatedExpertise:false,competencies:[],deliverables:[],references:[],criteriaComplete:false,omittedCriterionIds:[],selectionEvidence:{status:binding?'bound':'gap',command:task?.command||null},gaps:profile.gaps.map(g=>({id:g.id,reason:g.reason})),omissions:[]};
  if(!binding){result.gaps.push({id:'unmatched-task',reason:'No reviewed task binding; load canonical source and exact task. Candidate contracts are not runtime supplements.'});return bounded(result,maxChars);}
  result.competencies=[...binding.competencyIds];
  result.deliverables=selectProtectedCriteria(profile,binding);
  result.criteriaComplete=true;
  result.selectionEvidence={status:'bound',command:binding.command,sourceSha256:binding.sourceSha256,taskSha256:binding.taskSha256,taskPath:binding.taskPath,reviewStatus:binding.review.status};
  const relevantRefs=profile.references.map(r=>{const source=program.sources.references.find(s=>s.id===r.referenceId);return {referenceId:r.referenceId,status:source.status,rights:source.rights,url:source.url,...(source.status==='READ'?{locator:source.locator,contentSha256:source.contentSha256}:{locator:null})};});
  // Candidate references are acquisition pointers, never proof of expertise.
  for(const ref of relevantRefs.sort((a,b)=>(a.status==='READ'?-1:0)-(b.status==='READ'?-1:0))){if(result.references.length===2)break;result.references.push(ref);if(JSON.stringify(result).length>maxChars){result.references.pop();break;}}
  if(JSON.stringify(result).length>maxChars){
    result.deliverables=[];result.competencies=[];result.references=[];result.criteriaComplete=false;
    result.omittedCriterionIds=[...binding.requiredCriterionIds];
    result.selectionEvidence.status='deferred-budget';
    result.omissions=['All required criteria deferred together; load research/expert-evolution/expert-profiles.json and task-bindings.json before execution.'];
    result.gaps.push({id:'required-criteria-budget',reason:'Minimum protected contract cannot fit; no partial or complete-criteria claim.'});
  }
  return bounded(result,maxChars);
}

function validateSource(source, maxSegmentChars) {
  const safe=(value, seen=new Set())=>{
    if (value===null || typeof value==='string' || typeof value==='boolean' || (typeof value==='number' && Number.isFinite(value))) return;
    if (!value || typeof value!=='object' || seen.has(value)) throw new Error('Capture must be JSON safe');
    seen.add(value);
    for (const [key, descriptor] of Object.entries(Object.getOwnPropertyDescriptors(value))) { if (Array.isArray(value) && key==='length') continue; if (['__proto__','constructor','prototype'].includes(key) || descriptor.get || descriptor.set) throw new Error('Reserved/accessor capture key'); safe(descriptor.value,seen); }
    if (Object.getOwnPropertySymbols(value).length) throw new Error('Symbol capture key');
    seen.delete(value);
  };
  safe(source);
  const serialized=JSON.stringify(source);
  if (typeof serialized !== 'string' || serialized.length > 12000000) throw new Error('Complete capture exceeds input bound');

  if (!source || !slug(source.id) || !text(source.title) || !text(source.provenance?.uri) || !text(source.provenance?.capturedAt) || !text(source.provenance?.capturedBy) || !text(source.provenance?.locator) || !text(source.rights?.basis) || source.rights?.authorized !== true || !['owned', 'licensed', 'public-domain', 'permission'].includes(source.rights?.basis) || !text(source.rights?.evidence) || !['text', 'transcript'].includes(source.kind) || !Array.isArray(source.units) || !source.units.length) throw new Error('Source provenance, rights and locator required');
  if (!Number.isSafeInteger(maxSegmentChars) || maxSegmentChars < 128 || maxSegmentChars > 6000) throw new Error('Invalid segment bound');
  if (source.units.length > 10000) throw new Error('Too many units');
  let total = 0, duration = 0;
  for (const unit of source.units) {
    if (!text(unit.text) || !text(unit.locator) || unit.text.length > 1000000) throw new Error('Unit text/locator invalid');
    total += unit.text.length;
    if (source.kind === 'transcript') {
      if (!Number.isFinite(unit.startSeconds) || !Number.isFinite(unit.endSeconds) || unit.startSeconds < 0 || unit.endSeconds <= unit.startSeconds) throw new Error('Transcript timestamps required');
      duration += unit.endSeconds - unit.startSeconds;
    }
  }
  if (!/^https:\/\//.test(source.provenance.uri) && !/^urn:[a-z0-9][a-z0-9:-]+$/i.test(source.provenance.uri)) throw new Error('Provenance URI must be HTTPS or explicit URN');
  if (Number.isNaN(Date.parse(source.provenance.capturedAt))) throw new Error('Invalid capture date');
  if (total > 10000000) throw new Error('Ingestion input bound exceeded');
  const intervals = source.kind === 'transcript' ? source.units.map(u => [u.startSeconds, u.endSeconds]).sort((a,b) => a[0]-b[0]) : [];
  for (let i=1; i<intervals.length; i++) if (intervals[i][0] < intervals[i-1][1]) throw new Error('Overlapping transcript units cannot measure hours');
  return {characters: total, observedSeconds: source.kind === 'transcript' ? duration : null};
}
function ingest({root = DEFAULT_ROOT, source, maxSegmentChars = 2400, persist = false} = {}) {
  if (typeof persist !== 'boolean') throw new Error('Explicit persist boolean required');
  const dryRun = !persist;
  const metrics = validateSource(source, maxSegmentChars);
  const segments = [];
  for (const unit of source.units) {
    for (let offset=0; offset<unit.text.length;) {
      let end = Math.min(offset + maxSegmentChars, unit.text.length);
      if (end < unit.text.length && /[\uD800-\uDBFF]/.test(unit.text[end-1])) end--;
      const content = unit.text.slice(offset,end), contentSha256 = hash(content);
      segments.push({id: contentSha256, text: content, contentSha256, origin: {sourceId: source.id, locator: unit.locator, charStart: offset, charEnd: end, ...(source.kind === 'transcript' ? {startSeconds: unit.startSeconds, endSeconds: unit.endSeconds, timestampScope: 'original-unit; segment timing not interpolated'} : {})}, status: 'captured'});
      offset=end;
    }
  }
  const inputHash = hash(JSON.stringify(source));
  const dir = confined(root, 'research/expert-evolution/library');
  const manifestFile = confined(root, 'research/expert-evolution/library/manifest.json');
  let lock;
  const lockFile=confined(root,'research/expert-evolution/library/ingest.lock');
  if (!dryRun) { fs.mkdirSync(dir,{recursive:true}); lock=fs.openSync(lockFile,'wx'); }
  try {
    const manifest = fs.existsSync(manifestFile) ? read(manifestFile) : {schemaVersion:1, sources:[], segments:[]};
    if (manifest.schemaVersion !== 1 || !Array.isArray(manifest.sources) || !Array.isArray(manifest.segments)) throw new Error('Invalid library manifest');
    const previous = manifest.sources.find(s => s.id === source.id);
    if (previous && previous.inputHash !== inputHash) throw new Error('Source ID already bound to different capture');
    if (previous) return {mode: dryRun ? 'dry-run' : 'persisted', sourceId: source.id, duplicateCapture: true, addedSegments: 0, metrics: previous.metrics};
    let addedSegments = 0;
    for (const segment of segments) {
      const existing = manifest.segments.find(s => s.id === segment.id);
      if (existing) existing.origins.push(segment.origin);
      else { manifest.segments.push({id:segment.id, contentSha256:segment.contentSha256, origins:[segment.origin], status:'captured'}); addedSegments++; }
    }
    manifest.sources.push({id:source.id, title:source.title, kind:source.kind, provenance:source.provenance, rights:source.rights, inputHash, metrics});
    if (!dryRun) {
      fs.mkdirSync(dir,{recursive:true});
      for (const s of segments) {
        const target=confined(root, 'research/expert-evolution/library/' + s.id + '.json');
        if (fs.existsSync(target)) { const stored=read(target); if (hash(stored.text) !== s.id) throw new Error('Segment integrity failure'); }
        else fs.writeFileSync(target,JSON.stringify({schemaVersion:1,id:s.id,text:s.text,contentSha256:s.id},null,2)+'\n',{flag:'wx'});
      }
      const temporary = confined(root, 'research/expert-evolution/library/manifest-' + crypto.randomUUID() + '.tmp');
      fs.writeFileSync(temporary,JSON.stringify(manifest,null,2)+'\n',{flag:'wx'});
      fs.renameSync(temporary,manifestFile);
    }
    return {mode:dryRun?'dry-run':'persisted',sourceId:source.id,addedSegments,totalSegments:manifest.segments.length,metrics};
  } finally { if (lock !== undefined) { fs.closeSync(lock); fs.unlinkSync(lockFile); } }
}
function planUseCase({root = DEFAULT_ROOT, useCaseId, evidenceIds, caseContext, maxChars = 24000} = {}) {
  if (!slug(useCaseId) || !Array.isArray(evidenceIds) || !evidenceIds.length || evidenceIds.length > 8 || new Set(evidenceIds).size !== evidenceIds.length || evidenceIds.some(id => !/^[a-f0-9]{64}$/.test(id)) || !text(caseContext) || caseContext.length > 2000) throw new Error('Atomic case and bounded evidence required');
  const program = loadProgram(root), c = program.useCases.useCases.find(v => v.id === useCaseId);
  if (!c) throw new Error('Unknown Jev use case');
  const manifest=read(confined(root,'research/expert-evolution/library/manifest.json'));
  const evidence=evidenceIds.map(id => {
    const m=manifest.segments.find(s => s.id === id);
    if (!m || !m.origins?.length) throw new Error('Unknown evidence');
    const segment=read(confined(root,'research/expert-evolution/library/'+id+'.json'));
    if (hash(segment.text)!==id) throw new Error('Evidence hash mismatch');
    for (const origin of m.origins) { const s=manifest.sources.find(v=>v.id===origin.sourceId); if (!s?.rights?.authorized || !text(origin.locator)) throw new Error('Evidence rights/locator missing'); }
    return {id,text:segment.text,origins:m.origins};
  });
  const question={type:c.type,instructions:c.question+' Julgue apenas este caso e evidências identificadas; não completar de memória.'};
  if (c.criteria) question.criteria=c.criteria;
  const payload={model:jev.MODEL,state:{useCaseId,squad:c.squad,caseContext,evidence},questions:{[useCaseId]:question}};
  bounded(payload,maxChars);
  return {...jev.plan(payload),useCaseId,evaluation:c.evaluation,promotion:'candidate-only; explicit evidence and held-out evaluation required'};
}
function assessPromotion({root = DEFAULT_ROOT, profile, evaluation, evidence} = {}) {
  if(!profile?.contractReviewed || !Array.isArray(profile.competencies) || !profile.competencies.length) throw new Error('Promotion requires a reviewed nonempty competency contract; gap profiles are ineligible');
  if (!profile || !text(profile.agentId) || !Array.isArray(profile.competencies) || !evaluation || evaluation.agentId !== profile.agentId || evaluation.heldOut !== true || evaluation.independent !== true || evaluation.passed !== true || !text(evaluation.receiptId) || !text(evaluation.reviewer) || evaluation.reviewer === evaluation.executor || !text(evaluation.executor) || !/^[a-f0-9]{64}$/.test(evaluation.corpusSha256) || !text(evaluation.model) || !Array.isArray(evaluation.caseIds) || evaluation.caseIds.length < 2 || new Set(evaluation.caseIds).size !== evaluation.caseIds.length || !Array.isArray(evaluation.competencyResults) || !Array.isArray(evidence) || evidence.length < 2 || new Set(evidence.map(e=>e.id)).size < 2 || new Set(evidence.map(e=>e.contentSha256)).size < 2 || evidence.some(e=>e.status!=='READ'|| !text(e.id)|| !text(e.locator)||!text(e.excerpt)|| hash(e.excerpt)!==e.contentSha256)) throw new Error('Promotion requires grounded READ evidence and independent per-competency held-out evaluation receipt');
  for (const competency of profile.competencies) {
    const result=evaluation.competencyResults.find(r=>r.competency===competency);
    if (!result || result.passed!==true || !Array.isArray(result.evidenceIds) || result.evidenceIds.length<2 || new Set(result.evidenceIds).size<2 || result.evidenceIds.some(id=>!evidence.some(e=>e.id===id)) || !Array.isArray(result.caseIds) || result.caseIds.length<2 || result.caseIds.some(id=>!evaluation.caseIds.includes(id)) || !text(result.negativeCaseId) || !result.caseIds.includes(result.negativeCaseId)) throw new Error('Missing grounded evaluation for competency');
  }
  // Metadata booleans/IDs do not establish observation. Pin a resolvable artifact
  // receipt and verify every case's independently observed protected criteria.
  const resolve = ref => {
    if (!ref || !text(ref.path) || path.isAbsolute(ref.path) || ref.path.includes('\\') || ref.path.split('/').some(p=>!p||p==='.'||p==='..') || !/^[a-f0-9]{64}$/.test(ref.sha256 || '')) throw new Error('Promotion requires a resolvable typed artifact receipt');
    const bytes = fs.readFileSync(confined(root,ref.path));
    if(hash(bytes)!==ref.sha256) throw new Error('Promotion artifact/source hash mismatch');
    return bytes;
  };
  for(const source of evidence) if(!resolve(source.sourceRef).toString('utf8').includes(source.excerpt)) throw new Error('Promotion source file does not contain grounded excerpt');
  const receipt=JSON.parse(resolve(evaluation.artifactReceipt).toString('utf8'));
  const checked=require('./model-policy.cjs').validateArtifactEvaluation(receipt,{root,modelId:evaluation.model,taskFamily:evaluation.taskFamily,corpusSha256:evaluation.corpusSha256});
  if (!checked.valid || receipt.agentId!==profile.agentId || receipt.executor!==evaluation.executor || receipt.reviewer!==evaluation.reviewer || receipt.reviewer.trim().toLowerCase()===receipt.executor.trim().toLowerCase() || !['technical-fixture','observed-local-artifact'].includes(receipt.evidenceScope)) throw new Error('Promotion requires observed independent artifact evidence: '+checked.errors.join('; '));
  const binding=resolveTaskBinding({root,agentId:profile.agentId,command:evaluation.taskCommand});
  if(!binding || profile.competencies.some(competency=>!binding.competencyIds.includes(competency)) || receipt.taskCommand!==binding.command || receipt.sourceCanonicalSha256!==binding.sourceSha256 || receipt.taskSha256!==binding.taskSha256) throw new Error('Promotion requires exact canonical task/competency binding');
  const critical=profile.deliverables.flatMap(d=>d.criteria.filter(c=>c.critical).map(c=>c.id));
  if(!critical.length) throw new Error('Promotion requires explicit protected critical gates');
  const observedCases=[];
  for(const artifactCase of receipt.cases){
    const observed=JSON.parse(resolve(artifactCase.review).toString('utf8'));
    resolve(artifactCase.artifact);
    if(observed.schemaVersion!==1 || observed.kind!=='competency-artifact-observation' || !text(artifactCase.id) || !evaluation.caseIds.includes(artifactCase.id) || observed.caseId!==artifactCase.id || observed.caseKind!==artifactCase.kind || observed.observer!==receipt.reviewer || observed.author!==receipt.executor || observed.artifactSha256!==artifactCase.artifact.sha256 || observed.agentId!==profile.agentId || observed.modelId!==evaluation.model || observed.taskFamily!==evaluation.taskFamily || observed.corpusSha256!==evaluation.corpusSha256 || !Array.isArray(observed.sourceSha256s) || evidence.some(s=>!observed.sourceSha256s.includes(s.contentSha256)) || !Array.isArray(observed.competencyIds) || !Array.isArray(observed.criticalGates) || !['assertion','expected','actual','interpretation'].every(k=>text(observed[k])) || !['positive','negative','conflict'].includes(artifactCase.kind)) throw new Error('Promotion observation lacks artifact/source/scope binding');
    const allowed=artifactCase.kind==='positive'?['supported']:artifactCase.kind==='negative'?['outside-condition','controlled-failure']:['resolved-exception','none-observed'];
    if(!allowed.includes(observed.outcome) || critical.some(id=>!observed.criticalGates.some(g=>g.criterionId===id && text(g.observed) && text(g.method) && allowed.includes(g.outcome)))) throw new Error('Promotion negative/conflict or incomplete critical gates');
    observedCases.push(observed);
  }
  for(const result of evaluation.competencyResults) for(const kind of ['positive','negative','conflict']) if(!observedCases.some(o=>o.caseKind===kind && o.competencyIds.includes(result.competency) && result.caseIds.includes(o.caseId) && (kind!=='negative'||o.caseId===result.negativeCaseId))) throw new Error('Missing observed positive/negative/conflict competency evidence');
  return {agentId:profile.agentId,eligibleForReview:true,promoted:false,evaluationReceipt:evaluation.receiptId};
}
if (require.main === module) {
  try {
    const [command,...args]=process.argv.slice(2);
    const arg=name=>args[args.indexOf(name)+1];
    const root=DEFAULT_ROOT;
    let result;
    if (command==='validate') {result=validateProgram(loadProgram(root),{root});if(!result.valid) process.exitCode=1;}
    else if (command==='profile') { const p=getProfile({root,agentId:arg('--agent')}); result=args.includes('--json')?p:{agentId:p.agentId,squad:p.squad,mission:p.mission,deliverables:p.deliverables.map(d=>d.name),status:p.status,gaps:p.gaps}; }
    else if (command==='ingest' && args.includes('--input')) result=ingest({root,source:read(arg('--input')),persist:args.includes('--persist')});
    else if (command==='plan' && args.includes('--input')) {const data=read(arg('--input')); const p=planUseCase({root,useCaseId:arg('--use-case'),...data});result=args.includes('--json')?p:{useCaseId:p.useCaseId,called:p.called,maximumUsd:p.maximumUsd,admission:p.admission,cacheKey:p.cacheKey};}
    else throw new Error('Usage: expertise.cjs profile --agent ID [--json] | validate | ingest --input file [--persist] | plan --use-case ID --input file [--json]');
    console.log(JSON.stringify(result,null,args.includes('--json')?0:2));
  } catch(error) {console.error(error.message);process.exitCode=1;}
}
module.exports={loadProgram,validateProgram,validateTaskBindings,resolveTaskBinding,selectProtectedCriteria,getProfile,ingest,planUseCase,assessPromotion};
