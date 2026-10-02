'use strict';
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const ROOT = path.resolve(__dirname, '../..');
const nonempty = value => typeof value === 'string' && value.trim().length > 0;
const evidence = value => Array.isArray(value) && value.length > 0 && value.every(nonempty);
const validDate = value => nonempty(value) && Number.isFinite(Date.parse(value));
const MODEL_IDS = Object.freeze({'codex-native':['gpt-6.1-sol'],'anthropic-api':['claude-opus-5-5'],'typesafe-api':['jev-1.13.0']});
const sha = value => crypto.createHash('sha256').update(value).digest('hex');
function clock(now = new Date()) {
  const value=now instanceof Date?now.getTime():typeof now==='string'&&nonempty(now)?Date.parse(now):typeof now==='number'?now:NaN;
  if(!Number.isFinite(value)||!Number.isFinite(new Date(value).getTime()))throw new Error('Invalid assessment date');
  return value;
}
function resolveEvidence(ref, root) {
  if(!ref||!nonempty(ref.path)||!/^([a-f0-9]{64})$/.test(ref.sha256)||path.isAbsolute(ref.path)||ref.path.includes('\\')||ref.path.split('/').some(part=>!part||part==='.'||part==='..'))throw new Error('Unresolvable model evidence');
  const base=path.resolve(root);let file=base;
  for(let cursor=base;cursor!==path.dirname(cursor);cursor=path.dirname(cursor))if(fs.lstatSync(cursor).isSymbolicLink())throw new Error('Unsafe evidence root');
  for(const part of ref.path.split('/')){file=path.join(file,part);if(fs.lstatSync(file).isSymbolicLink())throw new Error('Unsafe evidence symlink');}
  if(!fs.statSync(file).isFile())throw new Error('Unresolvable model evidence');
  const bytes=fs.readFileSync(file);
  if(sha(bytes)!==ref.sha256)throw new Error('Model evidence hash mismatch');
  return bytes;
}
function validateAvailabilityReceipt(receipt,{root=ROOT,provider,modelId,accountScope,now=new Date(),checkExpiry=true}={}) {
  const errors=[],timestamp=clock(now),tolerance=300000;
  if(receipt?.schemaVersion!==1||receipt.receiptType!=='native-model-availability'||receipt.origin!=='local-native-execution-record')errors.push('Invalid typed availability receipt');
  if(!MODEL_IDS[receipt?.provider]?.includes(receipt?.modelId)||receipt.provider!==provider||receipt.modelId!==modelId||!nonempty(receipt.accountScope)||receipt.accountScope!==accountScope)errors.push('Availability provider/model/account scope mismatch');
  if(!validDate(receipt?.checkedAt)||!validDate(receipt?.expiresAt)||Date.parse(receipt.expiresAt)<=Date.parse(receipt.checkedAt))errors.push('Availability requires ordered checkedAt/expiresAt');
  if(Date.parse(receipt?.checkedAt)>timestamp+tolerance)errors.push('Availability evidence is future dated');
  if(checkExpiry&&Date.parse(receipt?.expiresAt)<=timestamp)errors.push('Availability receipt expired');
  if(receipt?.scope!=='native-use-within-existing-authority'||receipt?.promotion!==false)errors.push('Availability is not expertise promotion');
  if(!Array.isArray(receipt?.evidence)||!receipt.evidence.length)errors.push('Missing resolvable availability evidence');
  else for(const ref of receipt.evidence){try{resolveEvidence(ref,root);}catch(error){errors.push(error.message);}}
  return {valid:errors.length===0,errors};
}
function validateArtifactEvaluation(receipt,{root=ROOT,modelId,taskFamily,corpusSha256}={}) {
  const errors=[];
  const identity=value=>typeof value==='string'?value.normalize('NFKC').trim().toLowerCase():'';
  if(receipt?.schemaVersion!==1||receipt.receiptType!=='artifact-model-evaluation'||receipt.passed!==true||receipt.heldOut!==true||receipt.independent!==true||!nonempty(receipt.executor)||!nonempty(receipt.reviewer)||identity(receipt.executor)===identity(receipt.reviewer))errors.push('Missing independent held-out artifact evaluation');
  if(receipt?.modelId!==modelId||receipt?.taskFamily!==taskFamily||receipt?.corpusSha256!==corpusSha256||!/^([a-f0-9]{64})$/.test(corpusSha256))errors.push('Evaluation model/task/corpus scope mismatch');
  try{
    const raw=resolveEvidence(receipt?.corpusRef,root),snapshot=JSON.parse(raw.toString('utf8'));
    if(sha(raw)!==corpusSha256||snapshot.schemaVersion!==1||snapshot.kind!=='knowledge-corpus-snapshot'||!Array.isArray(snapshot.files)||snapshot.files.length!==3)throw new Error('Missing pinned corpus bytes');
    const expected=['sources','heuristics','competencies'].map(name=>`research/framework-evolution/${name}.json`);
    if(JSON.stringify(snapshot.files.map(ref=>ref.path).sort())!==JSON.stringify(expected.sort()))throw new Error('Corpus snapshot must bind exactly three corpus files');
    for(const ref of snapshot.files)resolveEvidence(ref,root);
  }catch(error){errors.push(error.message);}
  const strings=value=>Array.isArray(value)&&value.length>0&&value.every(nonempty)&&new Set(value).size===value.length;
  if(!['technical-fixture','observed-local-artifact'].includes(receipt?.evidenceScope)||!strings(receipt?.competencyIds)||!strings(receipt?.requiredCriterionIds))errors.push('Missing typed observation scope/competencies/critical gates');
  let binding;
  try{
    binding=require('./expertise.cjs').resolveTaskBinding({root,agentId:receipt?.agentId,command:receipt?.taskCommand});
    if(!binding||receipt.sourceCanonicalSha256!==binding.sourceSha256||receipt.taskSha256!==binding.taskSha256||!strings(receipt.competencyIds)||receipt.competencyIds.some(c=>!binding.competencyIds.includes(c))||!strings(receipt.requiredCriterionIds)||JSON.stringify([...receipt.requiredCriterionIds].sort())!==JSON.stringify([...binding.requiredCriterionIds].sort()))throw new Error('Evaluation canonical task/competency/criterion binding mismatch');
  }catch(error){errors.push(error.message);}
  const sourceHashes=[];
  if(!Array.isArray(receipt?.sources)||receipt.sources.length<2)errors.push('Missing independent resolvable source evidence');
  else for(const source of receipt.sources){try{
    const raw=resolveEvidence(source.sourceRef,root);
    if(!nonempty(source.id)||!nonempty(source.locator)||!nonempty(source.excerpt)||sha(source.excerpt)!==source.contentSha256||!raw.toString('utf8').includes(source.excerpt))throw new Error('Observed source hash/excerpt mismatch');
    sourceHashes.push(source.contentSha256);
  }catch(error){errors.push(error.message);}}
  if(new Set(sourceHashes).size<2)errors.push('Distinct grounded source evidence required');
  const caseIds=new Set();
  for(const kind of ['positive','negative','conflict']){
    const artifacts=Array.isArray(receipt?.cases)?receipt.cases.filter(entry=>entry?.kind===kind):[];
    if(!artifacts.length)errors.push(`Missing ${kind} artifact case`);
    for(const entry of artifacts){try{
      resolveEvidence(entry.artifact,root);
      if(!nonempty(entry.id)||caseIds.has(entry.id)||!nonempty(entry.locator)||entry.artifact.path===entry.review?.path||entry.artifact.sha256===entry.review?.sha256)throw new Error('Distinct observed artifact/review and case locator required');
      caseIds.add(entry.id);
      const observed=JSON.parse(resolveEvidence(entry.review,root).toString('utf8'));
      if(observed?.schemaVersion!==1||observed.kind!=='competency-artifact-observation'||observed.caseId!==entry.id||observed.caseKind!==kind||identity(observed.observer)!==identity(receipt.reviewer)||identity(observed.author)!==identity(receipt.executor)||identity(observed.author)===identity(observed.observer)||observed.artifactSha256!==entry.artifact.sha256||observed.agentId!==receipt.agentId||observed.modelId!==modelId||observed.taskFamily!==taskFamily||observed.corpusSha256!==corpusSha256||!strings(observed.sourceSha256s)||sourceHashes.some(s=>!observed.sourceSha256s.includes(s))||!strings(observed.competencyIds)||receipt.competencyIds.some(c=>!observed.competencyIds.includes(c))||!['assertion','expected','actual','interpretation'].every(k=>nonempty(observed[k]))||!Array.isArray(observed.criticalGates))throw new Error('Missing typed observed artifact/source/model/task/corpus/competency binding');
      const allowed=kind==='positive'?['supported']:kind==='negative'?['outside-condition','controlled-failure']:['resolved-exception','none-observed'];
      if(!allowed.includes(observed.outcome)||receipt.requiredCriterionIds.some(id=>!observed.criticalGates.some(g=>g.criterionId===id&&nonempty(g.observed)&&nonempty(g.method)&&allowed.includes(g.outcome)))||(kind==='conflict'&&!nonempty(observed.conflictResolution)))throw new Error('Observed negative/conflict or incomplete critical gates');
    }catch(error){errors.push(error.message);}}
  }
  if(Array.isArray(receipt?.cases)&&receipt.cases.some(entry=>!['positive','negative','conflict'].includes(entry?.kind)))errors.push('Unknown observed case kind');
  return {valid:errors.length===0,errors};
}
function loadPolicy(root = ROOT) {
  const requested = path.resolve(root);
  for (let cursor = requested; cursor !== path.dirname(cursor); cursor = path.dirname(cursor)) if (fs.lstatSync(cursor).isSymbolicLink()) throw new Error('Unsafe model policy root symlink');
  const base = fs.realpathSync.native(requested);
  let file = base;
  for (const segment of ['research', 'expert-evolution', 'model-policy.json']) {
    file = path.join(file, segment);
    if (fs.lstatSync(file).isSymbolicLink()) throw new Error('Unsafe model policy ancestor/path symlink');
  }
  const confined = path.relative(base, fs.realpathSync.native(file));
  if (confined.startsWith('..') || path.isAbsolute(confined) || !fs.statSync(file).isFile()) throw new Error('Model policy path escapes root or is not a file');
  return JSON.parse(fs.readFileSync(file, 'utf8').replace(/^\uFEFF/, ''));
}
function validatePolicy(policy,{root=ROOT,now=new Date(),checkExpiry=true}={}) {
  const errors = [];
  const timestamp=clock(now);
  if (policy?.schemaVersion !== 1 || !Array.isArray(policy.models) || !policy.models.length) return {valid:false, errors:['Invalid model policy schema']};
  const ids = new Set();
  for (const model of policy.models) {
    if (!model || !nonempty(model.id) || ids.has(model.id) || !nonempty(model.provider) || !['available','published','candidate'].includes(model.status)) { errors.push('Invalid/duplicate model definition'); continue; }
    ids.add(model.id);
    if (typeof model.availability?.validated !== 'boolean' || typeof model.evaluation?.passed !== 'boolean' || typeof model.evaluation?.localBenchmark !== 'boolean') errors.push(`Missing validation gates: ${model.id}`);
    if(model.availability?.validated){
      try{
        const receipt=JSON.parse(resolveEvidence(model.availability.receipt,root));
        const checked=validateAvailabilityReceipt(receipt,{root,provider:model.provider,modelId:model.id,accountScope:model.accountScope,now,checkExpiry});
        errors.push(...checked.errors.map(error=>`${model.id}: ${error}`));
        if(model.availability.checkedAt!==receipt.checkedAt||model.availability.expiresAt!==receipt.expiresAt)errors.push(`Availability metadata/receipt mismatch: ${model.id}`);
        if(JSON.stringify(model.availability.evidence)!==JSON.stringify(receipt.evidence))errors.push(`Availability evidence/receipt mismatch: ${model.id}`);
      }catch(error){errors.push(`${model.id}: ${error.message}`);}
    }
    if (model.evaluation?.passed && (!model.evaluation.localBenchmark || !evidence(model.evaluation.evidence))) errors.push(`Missing evaluation evidence: ${model.id}`);
    if(model.evaluation?.passed){
      try{const receipt=JSON.parse(resolveEvidence(model.evaluation.receipt,root));errors.push(...validateArtifactEvaluation(receipt,{root,modelId:model.id,taskFamily:model.evaluation.taskFamily,corpusSha256:model.evaluation.corpusSha256}).errors);}catch(error){errors.push(`Invalid evaluation receipt: ${error.message}`);}
    }
    if (model.status === 'candidate' && (model.availability?.validated || model.evaluation?.passed)) errors.push(`Candidate cannot bypass availability/evaluation: ${model.id}`);
  }
  if(!validDate(policy.reviewedAt)||!validDate(policy.reviewExpiresAt)||Date.parse(policy.reviewExpiresAt)<=Date.parse(policy.reviewedAt))errors.push('Invalid policy review expiry: reviewedAt and ordered valid dates required');
  if(Date.parse(policy.reviewedAt)>timestamp+300000)errors.push('Policy review is future dated');
  if(checkExpiry&&Date.parse(policy.reviewExpiresAt)<=timestamp)errors.push('Policy review expired');
  return {valid:errors.length === 0, errors};
}
function assessModel(policy, id, {promotion = false, now = new Date(),root=ROOT,taskFamily,corpusSha256} = {}) {
  const timestamp = clock(now);
  if (typeof promotion !== 'boolean') throw new Error('Invalid promotion flag');
  const validation = validatePolicy(policy,{root,now,checkExpiry:false});
  if (!validation.valid) throw new Error(validation.errors.join('; '));
  const model = policy.models.find(entry => entry.id === id);
  if (!model) throw new Error(`Unknown model: ${id}`);
  const reasons = [];
  if (policy.reviewExpiresAt && Date.parse(policy.reviewExpiresAt) <= timestamp) reasons.push('Policy review expired; refresh availability evidence');
  if (model.status === 'candidate') reasons.push('Candidate is not available for runtime');
  if (!model.availability.validated) reasons.push('Provider availability not validated');
  if(model.availability.validated&&Date.parse(model.availability.expiresAt)<=timestamp)reasons.push('Availability receipt expired');
  if (model.status === 'published' && !model.evaluation.passed) reasons.push('Published model has not passed local evaluation');
  if (promotion && (!model.evaluation.passed || !model.evaluation.localBenchmark)) reasons.push('Expert promotion requires local benchmark evidence');
  if(promotion&&model.evaluation.passed){
    try{const receipt=JSON.parse(resolveEvidence(model.evaluation.receipt,root));reasons.push(...validateArtifactEvaluation(receipt,{root,modelId:id,taskFamily,corpusSha256}).errors);}catch(error){reasons.push(error.message);}
  }
  return {id:model.id, provider:model.provider, status:model.status, allowed:reasons.length === 0, promotion, localBenchmark:model.evaluation.localBenchmark, reasons};
}
function main(args = process.argv.slice(2), root = ROOT) {
  const policy = loadPolicy(root);
  const command = args[0] || 'summary';
  const result = command === 'validate' ? validatePolicy(policy,{root}) : command === 'assess' ? assessModel(policy, args[1], {root,promotion:args.includes('--promotion')}) : command === 'summary' ? {schemaVersion:1, models:policy.models.map(model => assessModel(policy, model.id,{root}))} : (() => { throw new Error('Usage: model-policy.cjs summary|validate|assess <id> [--promotion]'); })();
  process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);
  if (result.valid === false || result.allowed === false) process.exitCode = 1;
  return result;
}
if (require.main === module) { try { main(); } catch (error) { process.stderr.write(`${error.message}\n`); process.exitCode = 1; } }
module.exports = {loadPolicy, validatePolicy, validateAvailabilityReceipt, validateArtifactEvaluation, assessModel, main};
