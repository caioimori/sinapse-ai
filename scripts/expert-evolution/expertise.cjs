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
  return {profiles: read(confined(root, 'research/expert-evolution/expert-profiles.json')), useCases: read(confined(root, 'research/expert-evolution/jev-use-cases.json')), sources: read(confined(root, 'research/expert-evolution/source-program.json'))};
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
      if (((agentId===undefined || p.agentId===agentId) && (!index[p.agentId] || p.squad !== index[p.agentId]?.squad || p.canonical.path !== index[p.agentId]?.sourcePath)) || !text(p.mission) || !Array.isArray(p.competencies) || p.competencies.length < 2 || !Array.isArray(p.deliverables) || !p.deliverables.length || !Array.isArray(p.gaps) || !p.gaps.length || p.status !== 'planned') errors.push('Invalid profile ' + p.agentId);
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
  } catch (error) { errors.push(error.message); }
  return {valid: errors.length === 0, errors};
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
  if (!compact) return bounded(profile, maxChars);
  const normalize=s=>s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]+/g,' ');
  const tokens=[...new Set(normalize(Object.values(task||{}).join(' ')).split(' ').filter(s=>s.length>3))];
  const score=value=>tokens.reduce((sum,token)=>sum+(normalize(JSON.stringify(value)).includes(token)?1:0),0);
  const ordered=list=>list.map((value,index)=>({value,index,score:score(value)})).sort((a,b)=>b.score-a.score||a.index-b.index).map(v=>v.value);
  const refs=profile.references.map(r=>{const source=program.sources.references.find(s=>s.id===r.referenceId);return {referenceId:r.referenceId,status:source.status,url:source.url,methodFit:r.methodFit,...(source.status==='READ'?{locator:source.locator,contentSha256:source.contentSha256}:{})};}).sort((a,b)=>(a.status==='READ'?-1:0)-(b.status==='READ'?-1:0));
  const result={schemaVersion:1,agentId:profile.agentId,squad:profile.squad,title:profile.title,mission:profile.mission,canonical:profile.canonical,status:'planned',priority:profile.priority,validatedExpertise:false,competencies:ordered(profile.competencies).slice(0,2),deliverables:ordered(profile.deliverables).slice(0,1),references:refs.slice(0,2),gaps:profile.gaps.map(g=>({id:g.id,reason:g.reason})),omissions:['Additional competencies, deliverables and references; full profile remains canonical in expert-profiles.json'],taskRelevance:tokens.length?(score(profile)>0?'lexical-match':'no-lexical-match'):'unfiltered'};
  const fits=()=>JSON.stringify(result).length<=maxChars;
  if (!fits()) {delete result.mission;result.omissions.push('Full mission omitted; title identifies canonical function');}
  if (!fits()) {result.references=result.references.slice(0,1);result.omissions.push('Additional reference');}
  if (!fits()) {result.deliverables=result.deliverables.map(d=>({id:d.id,name:d.name,competency:d.competency,criteria:d.criteria.slice(0,2)}));result.omissions.push('Additional deliverable criteria');}
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
function assessPromotion({profile, evaluation, evidence} = {}) {
  if (!profile || !text(profile.agentId) || !Array.isArray(profile.competencies) || !evaluation || evaluation.agentId !== profile.agentId || evaluation.heldOut !== true || evaluation.independent !== true || evaluation.passed !== true || !text(evaluation.receiptId) || !text(evaluation.reviewer) || evaluation.reviewer === evaluation.executor || !text(evaluation.executor) || !/^[a-f0-9]{64}$/.test(evaluation.corpusSha256) || !text(evaluation.model) || !Array.isArray(evaluation.caseIds) || evaluation.caseIds.length < 2 || new Set(evaluation.caseIds).size !== evaluation.caseIds.length || !Array.isArray(evaluation.competencyResults) || !Array.isArray(evidence) || evidence.length < 2 || new Set(evidence.map(e=>e.id)).size < 2 || new Set(evidence.map(e=>e.contentSha256)).size < 2 || evidence.some(e=>e.status!=='READ'|| !text(e.id)|| !text(e.locator)||!text(e.excerpt)|| hash(e.excerpt)!==e.contentSha256)) throw new Error('Promotion requires grounded READ evidence and independent per-competency held-out evaluation receipt');
  for (const competency of profile.competencies) {
    const result=evaluation.competencyResults.find(r=>r.competency===competency);
    if (!result || result.passed!==true || !Array.isArray(result.evidenceIds) || result.evidenceIds.length<2 || new Set(result.evidenceIds).size<2 || result.evidenceIds.some(id=>!evidence.some(e=>e.id===id)) || !Array.isArray(result.caseIds) || result.caseIds.length<2 || result.caseIds.some(id=>!evaluation.caseIds.includes(id)) || !text(result.negativeCaseId) || !result.caseIds.includes(result.negativeCaseId)) throw new Error('Missing grounded evaluation for competency');
  }
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
module.exports={loadProgram,validateProgram,getProfile,ingest,planUseCase,assessPromotion};
