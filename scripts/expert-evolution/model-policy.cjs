'use strict';
const fs = require('node:fs');
const path = require('node:path');
const ROOT = path.resolve(__dirname, '../..');
const nonempty = value => typeof value === 'string' && value.trim().length > 0;
const evidence = value => Array.isArray(value) && value.length > 0 && value.every(nonempty);
const validDate = value => nonempty(value) && Number.isFinite(Date.parse(value));
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
function validatePolicy(policy) {
  const errors = [];
  if (policy?.schemaVersion !== 1 || !Array.isArray(policy.models) || !policy.models.length) return {valid:false, errors:['Invalid model policy schema']};
  const ids = new Set();
  for (const model of policy.models) {
    if (!model || !nonempty(model.id) || ids.has(model.id) || !nonempty(model.provider) || !['available','published','candidate'].includes(model.status)) { errors.push('Invalid/duplicate model definition'); continue; }
    ids.add(model.id);
    if (typeof model.availability?.validated !== 'boolean' || typeof model.evaluation?.passed !== 'boolean' || typeof model.evaluation?.localBenchmark !== 'boolean') errors.push(`Missing validation gates: ${model.id}`);
    if (model.availability?.validated && (!validDate(model.availability.checkedAt) || !nonempty(model.availability.method) || !evidence(model.availability.evidence))) errors.push(`Missing availability evidence: ${model.id}`);
    if (model.evaluation?.passed && (!model.evaluation.localBenchmark || !evidence(model.evaluation.evidence))) errors.push(`Missing evaluation evidence: ${model.id}`);
    if (model.status === 'candidate' && (model.availability?.validated || model.evaluation?.passed)) errors.push(`Candidate cannot bypass availability/evaluation: ${model.id}`);
  }
  if (policy.reviewedAt !== undefined && !validDate(policy.reviewedAt)) errors.push('Invalid policy review date');
  if (policy.reviewExpiresAt !== undefined && (!validDate(policy.reviewedAt) || !validDate(policy.reviewExpiresAt) || Date.parse(policy.reviewExpiresAt) <= Date.parse(policy.reviewedAt))) errors.push('Invalid policy review expiry: reviewedAt and ordered valid dates required');
  return {valid:errors.length === 0, errors};
}
function assessModel(policy, id, {promotion = false, now = new Date()} = {}) {
  const timestamp = now instanceof Date ? now.getTime() : typeof now === 'string' && nonempty(now) ? Date.parse(now) : typeof now === 'number' ? now : NaN;
  if (!Number.isFinite(timestamp) || !Number.isFinite(new Date(timestamp).getTime())) throw new Error('Invalid assessment date');
  if (typeof promotion !== 'boolean') throw new Error('Invalid promotion flag');
  const validation = validatePolicy(policy);
  if (!validation.valid) throw new Error(validation.errors.join('; '));
  const model = policy.models.find(entry => entry.id === id);
  if (!model) throw new Error(`Unknown model: ${id}`);
  const reasons = [];
  if (policy.reviewExpiresAt && Date.parse(policy.reviewExpiresAt) <= timestamp) reasons.push('Policy review expired; refresh availability evidence');
  if (model.status === 'candidate') reasons.push('Candidate is not available for runtime');
  if (!model.availability.validated) reasons.push('Provider availability not validated');
  if (model.status === 'published' && !model.evaluation.passed) reasons.push('Published model has not passed local evaluation');
  if (promotion && (!model.evaluation.passed || !model.evaluation.localBenchmark)) reasons.push('Expert promotion requires local benchmark evidence');
  return {id:model.id, provider:model.provider, status:model.status, allowed:reasons.length === 0, promotion, localBenchmark:model.evaluation.localBenchmark, reasons};
}
function main(args = process.argv.slice(2), root = ROOT) {
  const policy = loadPolicy(root);
  const command = args[0] || 'summary';
  const result = command === 'validate' ? validatePolicy(policy) : command === 'assess' ? assessModel(policy, args[1], {promotion:args.includes('--promotion')}) : command === 'summary' ? {schemaVersion:1, models:policy.models.map(model => assessModel(policy, model.id))} : (() => { throw new Error('Usage: model-policy.cjs summary|validate|assess <id> [--promotion]'); })();
  process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);
  if (result.valid === false || result.allowed === false) process.exitCode = 1;
  return result;
}
if (require.main === module) { try { main(); } catch (error) { process.stderr.write(`${error.message}\n`); process.exitCode = 1; } }
module.exports = {loadPolicy, validatePolicy, assessModel, main};
