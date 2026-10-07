'use strict';
// Private, offline curation. Captures and reviews remain outside the public corpus.
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const {stableRead, createExclusive} = require('./file-io.cjs');
const {execFileSync} = require('node:child_process');
const ROOT = path.resolve(__dirname, '../..');
const LIBRARY = 'research/expert-evolution/library';
const sha = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
const text = value => typeof value === 'string' && value.trim().length > 0;
const slug = value => text(value) && /^[a-z0-9][a-z0-9-]*$/.test(value);
const hash = value => typeof value === 'string' && /^[a-f0-9]{64}$/.test(value);
const list = value => Array.isArray(value) && value.length > 0 && value.every(text) && new Set(value).size === value.length;
function jsonSafe(value, ancestors = new Set()) {
  if (value === null || typeof value === 'string' || typeof value === 'boolean' || (typeof value === 'number' && Number.isFinite(value))) return;
  if (!value || typeof value !== 'object' || ancestors.has(value) || (!Array.isArray(value) && ![null,Object.prototype].includes(Object.getPrototypeOf(value)))) throw new Error('Curation requires plain finite JSON');
  ancestors.add(value);
  for (const [key, descriptor] of Object.entries(Object.getOwnPropertyDescriptors(value))) {
    if (Array.isArray(value) && key === 'length') continue;
    if (['__proto__','constructor','prototype','toJSON'].includes(key) || descriptor.get || descriptor.set) throw new Error('Reserved/accessor curation key');
    jsonSafe(descriptor.value,ancestors);
  }
  if (Object.getOwnPropertySymbols(value).length) throw new Error('Symbol curation key');
  ancestors.delete(value);
}
function canonical(value) {
  if (Array.isArray(value)) return `[${value.map(canonical).join(',')}]`;
  if (value && typeof value === 'object') return `{${Object.keys(value).sort().map(k => `${JSON.stringify(k)}:${canonical(value[k])}`).join(',')}}`;
  return JSON.stringify(value);
}
function file(root, relative) {
  if (!text(relative) || relative.includes('\\') || path.isAbsolute(relative) || /^[A-Za-z]:/.test(relative) || relative.split('/').some(p => !p || p === '.' || p === '..' || /[:\0]/.test(p) || /[. ]$/.test(p))) throw new Error('Unsafe curation path');
  for (let cursor = path.resolve(root); cursor !== path.dirname(cursor); cursor = path.dirname(cursor)) if (fs.lstatSync(cursor).isSymbolicLink()) throw new Error('Curation symlink root rejected');
  const base = fs.realpathSync(root);
  let target = base;
  for (const segment of relative.split('/')) { target = path.join(target, segment); if (fs.existsSync(target) && fs.lstatSync(target).isSymbolicLink()) throw new Error('Curation symlink rejected'); }
  if (!target.startsWith(base + path.sep)) throw new Error('Curation path outside root');
  return target;
}
function bytes(root, relative, maxBytes = 12000000) {
  return stableRead(file(root,relative),{root,maxBytes});
}
const parseBytes = value => JSON.parse(value.toString('utf8').replace(/^\uFEFF/, ''));
function read(root, relative) { return parseBytes(bytes(root,relative)); }
function reference(root, ref) {
  if (!ref || !hash(ref.sha256)) throw new Error('Unresolved or tampered evidence');
  const value = bytes(root,ref.path);
  if (sha(value) !== ref.sha256) throw new Error('Unresolved or tampered evidence');
  return parseBytes(value);
}
function admitWrite(root, {persist = false, authorizedRoot} = {}) {
  if (typeof persist !== 'boolean') throw new Error('Explicit persist boolean required');
  if (!persist) return false;
  if (!authorizedRoot || fs.realpathSync(authorizedRoot) !== fs.realpathSync(root)) throw new Error('Explicit authorized persist root required');
  try { execFileSync('git', ['-C', root, 'check-ignore', '--quiet', `${LIBRARY}/overlay.json`], {stdio:'ignore'}); }
  catch { throw new Error('Private library must be ignored before persistence'); }
  return true;
}
function locked(root, operation) {
  const directory = file(root, LIBRARY); fs.mkdirSync(directory, {recursive:true});
  const target = file(root, `${LIBRARY}/curation.lock`);
  const fd = fs.openSync(target, 'wx');
  try { return operation(); } finally { fs.closeSync(fd); fs.unlinkSync(target); }
}
function atomic(root, relative, value, expectedSha256) {
  const target = file(root, relative), old = fs.existsSync(target) ? sha(bytes(root, relative)) : null;
  if (old !== expectedSha256) throw new Error('CAS conflict; existing bytes preserved');
  fs.mkdirSync(path.dirname(target), {recursive:true});
  const temporary = `${target}.${crypto.randomUUID()}.tmp`;
  const encoded = Buffer.from(JSON.stringify(value, null, 2) + '\n');
  createExclusive(temporary,encoded,{root});
  // Cooperating curation writers share the lock. Recheck immediately before rename.
  const current = fs.existsSync(target) ? sha(bytes(root, relative)) : null;
  if (current !== expectedSha256) throw new Error('CAS conflict before rename; existing bytes preserved');
  fs.renameSync(temporary, target);
  if (sha(bytes(root, relative)) !== sha(encoded)) throw new Error('Atomic curation readback failure');
  return {path:relative, sha256:sha(encoded)};
}
function immutable(root, relative, value) {
  if (fs.existsSync(file(root, relative))) {
    if (canonical(read(root, relative)) !== canonical(value)) throw new Error('Immutable curation ID conflict');
    return {path:relative, sha256:sha(bytes(root, relative)), duplicate:true};
  }
  return atomic(root, relative, value, null);
}
function captureSegment(root, provenance) {
  if (!provenance || !slug(provenance.sourceId) || !hash(provenance.sourceVersion) || !hash(provenance.captureEntrySha256) || !hash(provenance.segmentId) || !text(provenance.locator) || !text(provenance.quote)) throw new Error('Original segment provenance required');
  const manifest = read(root, `${LIBRARY}/manifest.json`);
  if (manifest.schemaVersion !== 1 || !Array.isArray(manifest.sources) || !Array.isArray(manifest.segments)) throw new Error('Invalid capture manifest');
  const source = manifest.sources.find(s => s.id === provenance.sourceId);
  const segment = manifest.segments.find(s => s.id === provenance.segmentId);
  if (!source || source.inputHash !== provenance.sourceVersion || sha(canonical(source)) !== provenance.captureEntrySha256 || source.rights?.authorized !== true || !['owned','licensed','public-domain','permission'].includes(source.rights?.basis) || !text(source.rights?.evidence)) throw new Error('Capture version or rights unresolved');
  const origin = segment?.origins?.find(o => o.sourceId === source.id && o.locator === provenance.locator && o.charStart === provenance.charStart && o.charEnd === provenance.charEnd);
  const stored = read(root, `${LIBRARY}/${provenance.segmentId}.json`);
  if (!origin || segment.status !== 'captured' || !text(stored.text) || sha(stored.text) !== segment.contentSha256 || stored.contentSha256 !== provenance.segmentId || sha(stored.text) !== provenance.segmentId || origin.charEnd - origin.charStart !== stored.text.length || !stored.text.includes(provenance.quote)) throw new Error('Original segment hash/locator mismatch');
  if (provenance.quote.split(/\s+/).length > 12) throw new Error('Candidate quote exceeds private runtime excerpt bound');
  return {source, segment:stored, origin};
}
function validateCandidate(root, candidate) {
  jsonSafe(candidate);
  if (JSON.stringify(candidate).length > 24000) throw new Error('Complete candidate exceeds bound');
  if (candidate?.schemaVersion !== 1 || !slug(candidate.id) || candidate.status !== 'candidate' || !text(candidate.author) || !['condition','action','rationale','scope'].every(k => text(candidate[k]) && candidate[k].length <= 1500) || candidate.scope !== 'complete-original-segment' || !['exceptions','counterexamples','consumers','competencyIds'].every(k => list(candidate[k])) || !Array.isArray(candidate.bindings) || !candidate.bindings.length) throw new Error('Incomplete candidate mechanism');
  if (!slug(candidate.extraction?.questionVersion) || !text(candidate.extraction?.modelKey) || candidate.extraction.sourceVersion !== candidate.provenance?.sourceVersion || candidate.extraction.resultStatus !== 'complete-candidate' || !['manual-native-curation','jev-extraction'].includes(candidate.extraction.mode)) throw new Error('Complete extraction version/model key required');
  const captured = captureSegment(root, candidate.provenance);
  const program = require('./expertise.cjs').loadProgram(root);
  const seen = new Set(), mappedConsumers = new Set(), mappedCompetencies = new Set();
  for (const b of candidate.bindings) {
    const key = `${b.agentId}:${b.command}`;
    const bound = require('./expertise.cjs').resolveTaskBinding({root,agentId:b.agentId,command:b.command,program});
    if (!bound || seen.has(key) || !list(b.competencyIds) || b.competencyIds.some(c => !bound.competencyIds.includes(c))) throw new Error('Unknown or mismatched exact task binding');
    seen.add(key); mappedConsumers.add(b.agentId); b.competencyIds.forEach(c => mappedCompetencies.add(c));
  }
  if (canonical([...mappedConsumers].sort()) !== canonical([...candidate.consumers].sort()) || canonical([...mappedCompetencies].sort()) !== canonical([...candidate.competencyIds].sort())) throw new Error('Candidate consumers/competencies must match exact bindings');
  const squads = candidate.consumers.map(id => program.profiles.profiles.find(p => p.agentId === id)?.squad);
  if (new Set(squads).size !== 1 || !squads[0]) throw new Error('Mechanism requires one exact squad');
  return {...captured, squad:squads[0]};
}
function propose({root = ROOT, candidate, persist = false, authorizedRoot} = {}) {
  validateCandidate(root, candidate);
  const candidateSha256 = sha(canonical(candidate));
  const output = {schemaVersion:1,status:'candidate',candidateSha256,called:false,expertisePromotion:false};
  if (admitWrite(root,{persist,authorizedRoot})) output.ref = locked(root, () => immutable(root, `${LIBRARY}/candidates/${candidate.id}.json`, candidate));
  return {...output,mode:persist?'persisted':'dry-run'};
}
function validateReview(root, candidate, review) {
  if (review?.schemaVersion !== 1 || review.kind !== 'independent-mechanism-review' || review.candidateSha256 !== sha(canonical(candidate)) || !text(review.reviewer) || review.reviewer.normalize('NFKC').trim().toLowerCase() === candidate.author.normalize('NFKC').trim().toLowerCase() || !['approved','rejected'].includes(review.decision) || !text(review.rationale) || !['technical-fixture','observed-local-artifact'].includes(review.evidenceScope) || !Array.isArray(review.observations)) throw new Error('Independent typed review required');
  if (!Number.isFinite(Date.parse(review.observedAt)) || Date.parse(review.observedAt) > Date.now() + 60000) throw new Error('Invalid review observation date');
  for (const kind of ['positive','negative','conflict']) {
    const matches = review.observations.filter(o => o.kind === kind);
    if (!matches.length) throw new Error(`Missing observed ${kind} evidence`);
    for (const observation of matches) {
      const observed = reference(root, observation.evidence);
      if (observed.schemaVersion !== 1 || observed.kind !== 'mechanism-observation' || observed.candidateSha256 !== review.candidateSha256 || observed.observer !== review.reviewer || observed.caseKind !== kind || !['assertion','expected','actual','interpretation'].every(k => text(observed[k])) || !['supported','outside-condition','controlled-failure','resolved-exception','none-observed','unresolved','contradiction'].includes(observed.outcome)) throw new Error('Typed observed evidence required; booleans are not observation');
      if (review.decision === 'approved' && ((kind === 'positive' && observed.outcome !== 'supported') || (kind === 'negative' && !['outside-condition','controlled-failure'].includes(observed.outcome)) || (kind === 'conflict' && !['resolved-exception','none-observed'].includes(observed.outcome)))) throw new Error('Negative or conflicting evidence blocks approval');
      if (observed.outcome === 'resolved-exception' && !candidate.exceptions.includes(observed.exception)) throw new Error('Conflict resolution requires a recorded exception');
    }
  }
  return review;
}
function reviewCandidate({root = ROOT, candidateRef, reviewRef} = {}) {
  const candidate = reference(root, candidateRef); validateCandidate(root, candidate);
  const review = reference(root, reviewRef); validateReview(root, candidate, review);
  return {schemaVersion:1,status:review.decision === 'approved'?'reviewed':'rejected',candidateRef,reviewRef,reviewer:review.reviewer,expertisePromotion:false};
}
function validateOverlay(root, overlay) {
  if (overlay?.schemaVersion !== 1 || overlay.status !== 'VALIDATED' || !Array.isArray(overlay.entries) || !hash(overlay.entriesSha256) || sha(canonical(overlay.entries)) !== overlay.entriesSha256) throw new Error('Invalid pinned reviewed overlay');
  const seen = new Set();
  return overlay.entries.map(entry => {
    const checked = reviewCandidate({root,candidateRef:entry.candidateRef,reviewRef:entry.reviewRef});
    const candidate = reference(root, entry.candidateRef);
    if (checked.status !== 'reviewed' || seen.has(candidate.id) || entry.candidateSha256 !== sha(canonical(candidate))) throw new Error('Unapproved or duplicate overlay entry');
    seen.add(candidate.id);
    const {source,squad} = validateCandidate(root, candidate);
    // Runtime gets the mechanism and short excerpt, never the captured transcript.
    return {id:`curated-${candidate.id}`,squad,condition:candidate.condition,action:candidate.action,rationale:candidate.rationale,exceptions:candidate.exceptions,counterexamples:candidate.counterexamples,consumers:candidate.consumers,competencies:candidate.competencyIds,status:'inferred',bindings:candidate.bindings,evidence:[{sourceId:source.id,locator:candidate.provenance.locator,excerpt:candidate.provenance.quote}],sources:[{id:source.id,title:source.title,url:source.provenance.uri,locator:candidate.provenance.locator,excerpt:candidate.provenance.quote,contentSha256:candidate.provenance.segmentId,licenseNote:`${source.rights.basis}: ${source.rights.evidence}`}],review:{status:'independent-reviewed',candidateSha256:entry.candidateSha256,receiptSha256:entry.reviewRef.sha256,evidenceScope:reference(root,entry.reviewRef).evidenceScope}};
  });
}
function readOverlay(root = ROOT) {
  const relative = `${LIBRARY}/overlay.json`;
  if (!fs.existsSync(file(root, relative))) return [];
  return validateOverlay(root, read(root, relative));
}
function consolidate({root = ROOT, candidateRef, reviewRef, expectedOverlaySha256 = null, persist = false, authorizedRoot} = {}) {
  const receipt = reviewCandidate({root,candidateRef,reviewRef});
  if (receipt.status !== 'reviewed') throw new Error('Rejected review cannot consolidate');
  const candidate = reference(root, candidateRef), relative = `${LIBRARY}/overlay.json`;
  const operation = () => {
    const prior = fs.existsSync(file(root,relative)) ? read(root,relative) : {schemaVersion:1,status:'VALIDATED',entries:[],entriesSha256:sha(canonical([]))};
    validateOverlay(root,prior);
    const pinned = ref => ({path:ref.path,sha256:ref.sha256});
    const entry = {candidateSha256:sha(canonical(candidate)),candidateRef:pinned(candidateRef),reviewRef:pinned(reviewRef)};
    const duplicate = prior.entries.find(e => e.candidateSha256 === entry.candidateSha256);
    if (duplicate) { if (canonical(duplicate) !== canonical(entry)) throw new Error('Conflicting review for existing mechanism'); return {schemaVersion:1,status:'VALIDATED',duplicate:true,added:0,called:false,expertisePromotion:false}; }
    const entries = [...prior.entries,entry];
    const next = {schemaVersion:1,status:'VALIDATED',entries,entriesSha256:sha(canonical(entries))}; validateOverlay(root,next);
    const ref = persist ? atomic(root,relative,next,expectedOverlaySha256) : null;
    return {schemaVersion:1,status:'VALIDATED',mode:persist?'persisted':'dry-run',added:1,duplicate:false,ref,called:false,expertisePromotion:false};
  };
  return admitWrite(root,{persist,authorizedRoot}) ? locked(root,operation) : operation();
}
function planExtraction({root = ROOT, candidate} = {}) {
  validateCandidate(root,candidate);
  const key = {sourceVersion:candidate.extraction.sourceVersion,questionVersion:candidate.extraction.questionVersion,modelKey:candidate.extraction.modelKey};
  const extractionKey = sha(canonical(key));
  const payload = {model:require('../framework-evolution/jev.cjs').MODEL,state:{candidate,originalSegment:captureSegment(root,candidate.provenance).segment.text},questions:{support:{type:'choice',instructions:'Evaluate only the complete original segment and candidate mechanism; partial support or conflict must remain candidate. This is extraction, not independent review.',criteria:{supported:'Condition/action/exceptions grounded in this segment',partial:'Support incomplete',conflict:'Source conflicts with mechanism'}}}};
  return {schemaVersion:1,status:'manual-native-curation',extractionKey,...key,called:false,expertisePromotion:false,plan:require('../framework-evolution/jev.cjs').plan(payload),payload};
}
async function extract({root = ROOT,candidate,persist = false,authorizedRoot,apiKey,authorized = false,ledger,cache,transport} = {}) {
  const prepared = planExtraction({root,candidate});
  if (!apiKey || !persist) return prepared;
  admitWrite(root,{persist,authorizedRoot});
  if (candidate.extraction.mode !== 'jev-extraction' || candidate.extraction.modelKey !== prepared.payload.model) throw new Error('Paid extraction requires exact Jev model key');
  if (authorized !== true || !text(apiKey) || ledger?.durable !== true || typeof ledger.reserve !== 'function' || !text(ledger.authorizationId) || (cache && cache.durable !== true) || (transport !== undefined && typeof transport !== 'function')) throw new Error('Paid extraction requires explicit authority and durable Jev ledger/cache');
  const relative = `${LIBRARY}/extractions/${prepared.extractionKey}.json`;
  const admission = locked(root, () => {
    if (fs.existsSync(file(root,relative))) {
      const cached = read(root,relative);
      if (cached.extractionKey !== prepared.extractionKey) throw new Error('Extraction receipt semantic key mismatch');
      if (cached.status === 'transport-admitted') throw new Error('Transport-admitted semantic extraction blocks automatic retry; reconcile the preserved receipt and Jev ledger manually');
      if (canonical(cached.payload) !== canonical(prepared.payload) || cached.status !== 'candidate-only') throw new Error('Extraction receipt conflicts with source/version/questions');
      const response = require('../framework-evolution/jev.cjs').validateResponse(cached.execution?.response,prepared.payload);
      return {cached:{...cached,execution:{...cached.execution,response},called:false,status:'candidate-only',mode:'persisted-cache'}};
    }
    // Write-ahead admission is keyed by source/version/questions/model, before
    // any await or paid ledger reservation. A crash preserves this replay block.
    const pending = {schemaVersion:1,status:'transport-admitted',extractionKey:prepared.extractionKey,sourceVersion:prepared.sourceVersion,questionVersion:prepared.questionVersion,modelKey:prepared.modelKey,payloadSha256:sha(canonical(prepared.payload)),jevCacheKey:prepared.plan.cacheKey,authorizationId:ledger.authorizationId,admittedAt:new Date().toISOString(),automaticRetry:'blocked',expertisePromotion:false};
    return {pendingRef:atomic(root,relative,pending,null)};
  });
  if (admission.cached) return admission.cached;
  // Durable billing, single-flight and cache are exclusively owned by jev.cjs.
  // Any failure retains transport-admitted; do not refund or delete its receipt.
  const execution = await require('../framework-evolution/jev.cjs').execute(prepared.payload,{offline:false,authorized,apiKey,ledger,cache,transport,maxAttempts:1});
  const receipt = {...prepared,status:'candidate-only',called:execution.called,execution};
  locked(root,()=>atomic(root,relative,{...receipt,called:false,execution:{response:execution.response,cacheKey:execution.cacheKey,called:false,mode:'recorded'}},admission.pendingRef.sha256));
  return receipt;
}
function main(args = process.argv.slice(2), root = ROOT) {
  const [command,input,...flags] = args;
  if (!input || flags.some(f=>f!=='--persist')) throw new Error('Usage: extraction.cjs propose|review|consolidate|plan <project-relative-input.json> [--persist]');
  const data=read(root,input),persist=flags.includes('--persist');
  let result;
  if(command==='propose')result=propose({root,candidate:data,persist,authorizedRoot:root});
  else if(command==='review')result=reviewCandidate({root,...data});
  else if(command==='consolidate')result=consolidate({root,...data,persist,authorizedRoot:root});
  else if(command==='plan')result=planExtraction({root,candidate:data});
  else throw new Error('Unknown extraction command');
  process.stdout.write(JSON.stringify(result,null,2)+'\n'); return result;
}
if(require.main===module){try{main();}catch(error){process.stderr.write(error.message+'\n');process.exitCode=1;}}
module.exports = {sha,canonical,file,bytes,read,reference,admitWrite,locked,atomic,immutable,validateCandidate,propose,validateReview,reviewCandidate,validateOverlay,readOverlay,consolidate,planExtraction,extract,main};
