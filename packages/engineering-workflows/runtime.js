'use strict';

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { digest, decideApplicability } = require(path.join(__dirname, '..', 'engineering-applicability'));
const catalog = require(path.join(__dirname, 'catalog'));
const { readRegularFile } = require(path.join(__dirname, 'safe-file'));

const SCHEMA_VERSION = '1.0.0';
const STATE_DIRECTORY = '.sinapse/workflow-state/engineering';
const MAX_FILE_BYTES = 2 * 1024 * 1024;
const RECIPES = Object.freeze({
  'quick-fix': ['inspect', 'implement', 'verify', 'review', 'handoff'],
  feature: ['inspect', 'design', 'implement', 'verify', 'review', 'handoff'],
  architecture: ['inspect', 'design', 'implement', 'verify', 'review', 'handoff'],
  incident: ['observe', 'containment-plan', 'verify', 'review', 'handoff'],
});
const INSTRUCTIONS = Object.freeze({
  inspect: 'Inspecione somente o fluxo afetado, reproduza o comportamento e registre o resultado esperado e a baseline pertinente.',
  observe: 'Registre sintomas, impacto e evidências existentes sem executar contenção ou alterar produção.',
  design: 'Registre objetivo, critérios de aceite, limites, riscos e recuperação proporcionais à mudança; reaproveite decisões vigentes.',
  'containment-plan': 'Prepare contenção e recuperação revisáveis, identificando ações externas e sua autorização própria; não execute a partir deste runtime.',
  implement: 'Execute o recorte autorizado na sessão atual, preserve trabalho concorrente e registre arquivos e comportamento alterados.',
  verify: 'Verifique os critérios aplicáveis com ferramentas apropriadas; diferencie observado, declarado e não verificado.',
  review: 'Revise resultado e evidências contra o pedido, entradas, permissões e regressões pertinentes; registre falhas e limitações.',
  handoff: 'Entregue resultado, evidência e pendências reais; produção, envio, cobrança e destruição exigem seu próprio caminho autorizado.',
});
const ACTIONS = ['production', 'destructive', 'payment', 'third-party'];
const SIGNAL_KEYS = ['schemaVersion', 'projectType', 'surfaces', 'changeKind', 'dataClasses', 'deploymentTargets', 'reversibility', 'risk'];

function object(value, name, keys) {
  if (!value || typeof value !== 'object' || Array.isArray(value) || ![Object.prototype, null].includes(Object.getPrototypeOf(value))) throw new Error(`${name} must be an object`);
  for (const key of Object.keys(value)) if (!keys.includes(key)) throw new Error(`Unknown ${name} field: ${key}`);
  return value;
}

function text(value, name, max = 4000) {
  if (typeof value !== 'string' || !value.trim() || value.length > max) throw new Error(`${name} must be nonempty text (max ${max})`);
  if (/-----BEGIN [A-Z ]*PRIVATE KEY-----|\b(?:gh[pousr]_[A-Za-z0-9]{20,}|sk-(?:proj-)?[A-Za-z0-9_-]{20,})\b|(?:password|api[_-]?key|access[_-]?token|secret)\s*[:=]\s*["']?[^\s"']{12,}/i.test(value)) throw new Error(`${name} appears to contain a secret; use a sanitized report`);
  return value.trim();
}

function enumValue(value, name, choices, fallback) {
  if (value === undefined) return fallback;
  if (!choices.includes(value)) throw new Error(`Invalid ${name}: ${String(value)}`);
  return value;
}

function integer(value, name, min, max, fallback) {
  const result = value === undefined ? fallback : value;
  if (!Number.isSafeInteger(result) || result < min || result > max) throw new Error(`${name} must be an integer from ${min} to ${max}`);
  return result;
}

function stringArray(value, name, allowed, sort = true) {
  if (value === undefined) return [];
  if (!Array.isArray(value) || value.length > 20 || value.some((item) => typeof item !== 'string' || (allowed && !allowed.includes(item)))) throw new Error(`Invalid ${name}`);
  const unique = [...new Set(value)];
  return sort ? unique.sort() : unique;
}

function createPlan(input) {
  object(input, 'plan', ['brief', 'completionCriterion', 'workflowIds', 'signals', 'complexity', 'changeKind', 'risk', 'reversibility', 'actions', 'maxIterations', 'timeoutMs']);
  const brief = text(input.brief, 'brief');
  const completionCriterion = input.completionCriterion === undefined ? null : text(input.completionCriterion, 'completionCriterion', 2000);
  const complexity = enumValue(input.complexity, 'complexity', ['simple', 'standard', 'complex'], 'standard');
  const changeKind = enumValue(input.changeKind, 'changeKind', ['fix', 'feature', 'architecture', 'incident', 'infrastructure', 'migration', 'release'], input.signals?.changeKind || 'feature');
  if (input.signals?.changeKind !== undefined && input.changeKind !== undefined && input.signals.changeKind !== input.changeKind) throw new Error('changeKind conflicts with signals.changeKind; reconcile the classification');
  const reversibilityChoices = ['reversible', 'conditional', 'irreversible'];
  const suppliedReversibility = enumValue(input.reversibility, 'reversibility', reversibilityChoices, input.signals?.reversibility || 'conditional');
  const reversibility = reversibilityChoices[Math.max(reversibilityChoices.indexOf(suppliedReversibility), reversibilityChoices.indexOf(input.signals?.reversibility || 'reversible'))];
  const actions = stringArray(input.actions, 'actions', ACTIONS);
  const maxIterations = integer(input.maxIterations, 'maxIterations', 1, 10, 3);
  const timeoutMs = integer(input.timeoutMs, 'timeoutMs', 1000, 3600000, 900000);
  let applicability = null;
  if (input.signals !== undefined) {
    object(input.signals, 'signals', SIGNAL_KEYS);
    if (input.signals.risk !== undefined) object(input.signals.risk, 'signals.risk', ['availability', 'privacy', 'security']);
    for (const key of ['surfaces', 'dataClasses', 'deploymentTargets']) if (input.signals[key] !== undefined && !Array.isArray(input.signals[key])) throw new Error(`signals.${key} must be an array`);
    applicability = decideApplicability(input.signals);
  }
  const inferredRisk = applicability?.normalized.risk;
  const riskChoices = ['low', 'medium', 'high', 'critical'];
  const signalRisk = inferredRisk ? riskChoices[Math.max(...Object.values(inferredRisk).map((item) => riskChoices.indexOf(item)))] : undefined;
  const risk = enumValue(input.risk, 'risk', riskChoices, signalRisk || 'medium');
  // Explicit low risk cannot lower a stronger signal supplied in the same request.
  const effectiveRisk = riskChoices[Math.max(riskChoices.indexOf(risk), riskChoices.indexOf(signalRisk || 'low'))];
  const deep = ['high', 'critical'].includes(effectiveRisk) || complexity === 'complex' || ['architecture', 'migration'].includes(changeKind) || reversibility === 'irreversible';
  const quick = changeKind === 'fix' && complexity === 'simple' && effectiveRisk === 'low' && reversibility === 'reversible';
  const track = deep ? 'deep' : quick ? 'quick' : 'standard';
  const recipe = changeKind === 'incident' ? 'incident' : deep ? 'architecture' : quick ? 'quick-fix' : 'feature';
  const suppliedIds = stringArray(input.workflowIds, 'workflowIds', undefined, false);
  if (suppliedIds.length > 8) throw new Error('Select at most 8 workflows per run; load further context only when needed');
  const selected = suppliedIds.length ? suppliedIds.map((id) => catalog.getWorkflow(id)) : catalog.searchWorkflows(brief.slice(0, 2000), { limit: quick ? 1 : 3 }).map((item) => item.workflow || item);
  if (selected.some((item) => !item || typeof item.id !== 'string')) throw new Error('Unknown workflow selection');
  selected.forEach((item) => catalog.readWorkflow(item.id));
  const workflows = selected.map((item) => ({ id: item.id, title: item.title, source: item.source, executionMode: 'guided' }));
  const stages = RECIPES[recipe].map((id) => ({ id, instruction: INSTRUCTIONS[id], evidenceRequired: true }));
  const guidance = workflows.map((item) => ({ id: `workflow:${item.id}`, instruction: `Siga o workflow ${item.title}; consulte seu trecho original sob demanda, registre decisões, desvios, execução e verificações pertinentes. O diagrama não é executado automaticamente.`, workflowId: item.id, evidenceRequired: true }));
  stages.splice(stages.findIndex((stage) => stage.id === 'verify'), 0, ...guidance);
  const gates = ['quality-assurance', 'requirements-traceability'];
  if (track === 'deep') gates.push('scope-risk-recovery');
  if (applicability) gates.push(...applicability.selected.map((item) => item.id).filter((id) => id !== 'story-spec-readiness'));
  const humanCheckpoints = [...(applicability?.humanCheckpoints || [])];
  if (reversibility === 'irreversible') humanCheckpoints.push({ id: 'irreversible-action-approval', reasonCodes: ['IRREVERSIBLE_CHANGE'] });
  actions.forEach((action) => humanCheckpoints.push({ id: `${action}-handoff`, reasonCodes: ['EXTERNAL_AUTHORITY_REQUIRED'] }));
  const body = {
    schemaVersion: SCHEMA_VERSION, executionMode: 'guided', brief, completionCriterion, track, recipe,
    classification: { changeKind, complexity, risk: effectiveRisk, reversibility },
    reasons: [deep ? 'RISK_OR_SCOPE_REQUIRES_DESIGN' : quick ? 'BOUNDED_REVERSIBLE_FIX' : 'STANDARD_CHANGE', ...(!input.risk && !signalRisk ? ['RISK_UNSPECIFIED_CONSERVATIVE_MEDIUM'] : [])],
    status: !completionCriterion || applicability?.status === 'unknown-signal' ? 'needs-context' : 'ready',
    limits: { maxIterations, timeoutMs }, actions, workflows, stages,
    gates: [...new Set(gates)].sort(), humanCheckpoints: [...new Map(humanCheckpoints.map((item) => [item.id, item])).values()],
    applicability, catalogDigest: digest(catalog.loadCatalog()),
    authority: { executesExternalActions: false, grantsApproval: false, evidenceMeaning: 'recorded artifact and reported outcome; no semantic verification' },
  };
  return { ...body, planDigest: digest(body) };
}

function validatePlan(plan) {
  object(plan, 'stored plan', ['schemaVersion', 'executionMode', 'brief', 'completionCriterion', 'track', 'recipe', 'classification', 'reasons', 'status', 'limits', 'actions', 'workflows', 'stages', 'gates', 'humanCheckpoints', 'applicability', 'catalogDigest', 'authority', 'planDigest']);
  const { planDigest, ...body } = plan;
  if (plan.schemaVersion !== SCHEMA_VERSION || digest(body) !== planDigest) throw new Error('Plan integrity mismatch');
  if (digest(catalog.loadCatalog()) !== plan.catalogDigest) throw new Error('Catalog changed; review and create a new plan');
  const regenerated = createPlan({ brief: plan.brief, completionCriterion: plan.completionCriterion === null ? undefined : plan.completionCriterion, workflowIds: plan.workflows.map((item) => item.id), signals: plan.applicability?.normalized, ...plan.classification, actions: plan.actions, ...plan.limits });
  // The original plan may contain the conservative-default reason; behavior must match.
  for (const key of ['stages', 'track', 'recipe', 'gates', 'humanCheckpoints', 'actions', 'authority', 'workflows', 'classification', 'status', 'limits']) {
    if (JSON.stringify(regenerated[key]) !== JSON.stringify(plan[key])) throw new Error(`Plan contract does not match current runtime: ${key}`);
  }
}

function projectRoot(root) {
  if (typeof root !== 'string' || !root) throw new Error('An explicit project root is required');
  const absolute = fs.realpathSync(path.resolve(root));
  if (!fs.statSync(absolute).isDirectory()) throw new Error('Project root must be a directory');
  return absolute;
}

function safePath(root, relative, { createParents = false } = {}) {
  if (typeof relative !== 'string' || !relative || relative.includes('\0') || path.isAbsolute(relative) || /^[A-Za-z]:/.test(relative) || relative.includes(':') || relative.includes('\\')) throw new Error('Use a project-relative forward-slash path');
  const parts = relative.split('/');
  if (parts.some((part) => !part || part === '.' || part === '..')) throw new Error('Path traversal is forbidden');
  let current = root;
  parts.forEach((part, index) => {
    current = path.join(current, part);
    if (fs.existsSync(current)) {
      if (fs.lstatSync(current).isSymbolicLink()) throw new Error('Symlinks are forbidden for state and evidence');
      if (index < parts.length - 1 && !fs.statSync(current).isDirectory()) throw new Error('Invalid parent directory');
    } else if (index < parts.length - 1 && createParents) fs.mkdirSync(current);
  });
  const relativeCheck = path.relative(root, current);
  if (relativeCheck.startsWith('..') || path.isAbsolute(relativeCheck)) throw new Error('Path escapes project root');
  return current;
}

function runName(runId) {
  if (typeof runId !== 'string' || !/^[a-z0-9][a-z0-9-]{0,63}$/.test(runId)) throw new Error('runId must contain 1-64 lowercase letters, numbers or hyphens');
  return runId;
}

function statePath(root, runId, createParents = false) {
  return safePath(root, `${STATE_DIRECTORY}/${runName(runId)}.json`, { createParents });
}

function readJson(file, root) {
  return JSON.parse(readRegularFile(file, { maxBytes: MAX_FILE_BYTES, root }).toString('utf8'));
}

function evidenceArtifact(root, relative) {
  if (typeof relative !== 'string' || /(?:^|\/)(?:\.env(?:\..*)?|\.git|\.ssh|credentials?|secrets?)(?:\/|$)|\.(?:pem|key|pfx|p12|kdbx)$/i.test(relative)) throw new Error('Sensitive evidence path is forbidden');
  if (relative.startsWith(`${STATE_DIRECTORY}/`)) throw new Error('Runtime state is not independent evidence');
  const absolute = safePath(root, relative);
  const bytes = readRegularFile(absolute, { maxBytes: MAX_FILE_BYTES, nonempty: true, root });
  text(bytes.toString('utf8'), 'evidence contents', MAX_FILE_BYTES);
  return { path: relative, sha256: crypto.createHash('sha256').update(bytes).digest('hex'), bytes: bytes.length, verification: 'artifact-hash-only' };
}

function signedState(body) {
  const { stateDigest: _ignored, ...content } = body;
  return { ...content, stateDigest: digest(content) };
}

function readState(root, runId) {
  const state = readJson(statePath(root, runId), root);
  object(state, 'state', ['schemaVersion', 'runId', 'revision', 'plan', 'createdAt', 'updatedAt', 'deadlineAt', 'cursor', 'status', 'attempts', 'history', 'stateDigest']);
  const { stateDigest, ...body } = state;
  if (state.schemaVersion !== SCHEMA_VERSION || state.runId !== runId || digest(body) !== stateDigest) throw new Error('State integrity mismatch');
  validatePlan(state.plan);
  if (!Number.isSafeInteger(state.createdAt) || state.createdAt < 0 || state.deadlineAt !== state.createdAt + state.plan.limits.timeoutMs || !Array.isArray(state.history) || state.history.length > state.plan.stages.length * state.plan.limits.maxIterations) throw new Error('Invalid state timestamps/history');
  let cursor = 0;
  let status = 'in-progress';
  let recordedAt = state.createdAt;
  const attempts = {};
  for (const item of state.history) {
    object(item, 'history entry', ['stageId', 'outcome', 'notes', 'evidence', 'recordedAt']);
    object(item.evidence, 'recorded evidence', ['path', 'sha256', 'bytes', 'verification']);
    if (!['in-progress', 'review-required'].includes(status) || item.stageId !== state.plan.stages[cursor]?.id || !['pass', 'fail', 'requires-human'].includes(item.outcome)) throw new Error('Invalid state history progression');
    if (!Number.isSafeInteger(item.recordedAt) || item.recordedAt < recordedAt || item.recordedAt > state.deadlineAt) throw new Error('Invalid history timestamp');
    text(item.notes, 'stored notes', 2000);
    const current = evidenceArtifact(root, item.evidence.path);
    if (current.sha256 !== item.evidence.sha256 || current.bytes !== item.evidence.bytes || item.evidence.verification !== 'artifact-hash-only') throw new Error(`Evidence drift: ${item.evidence.path}`);
    attempts[item.stageId] = (attempts[item.stageId] || 0) + 1;
    if (item.outcome === 'pass') {
      cursor++;
      status = cursor === state.plan.stages.length ? (state.plan.humanCheckpoints.length ? 'human-checkpoint' : 'completed') : 'in-progress';
    } else if (item.outcome === 'requires-human') status = 'human-checkpoint';
    else status = attempts[item.stageId] >= state.plan.limits.maxIterations ? 'exhausted' : 'review-required';
    recordedAt = item.recordedAt;
  }
  if (state.cursor !== cursor || state.status !== status || state.revision !== state.history.length || state.updatedAt !== recordedAt || digest(state.attempts) !== digest(attempts)) throw new Error('State does not reconcile with recorded history');
  return state;
}

function atomicWrite(file, state) {
  const temporary = `${file}.${crypto.randomBytes(8).toString('hex')}.tmp`;
  const content = `${JSON.stringify(signedState(state), null, 2)}\n`;
  if (Buffer.byteLength(content) > MAX_FILE_BYTES) throw new Error('State size limit exceeded; use shorter sanitized notes');
  let descriptor;
  try {
    descriptor = fs.openSync(temporary, 'wx', 0o600);
    fs.writeFileSync(descriptor, content, 'utf8');
    fs.fsyncSync(descriptor);
    fs.closeSync(descriptor);
    descriptor = undefined;
    fs.renameSync(temporary, file);
  } finally {
    if (descriptor !== undefined) fs.closeSync(descriptor);
    if (fs.existsSync(temporary)) fs.unlinkSync(temporary);
  }
}

function locked(root, runId, operation) {
  const file = statePath(root, runId, true);
  const lock = `${file}.lock`;
  safePath(root, `${STATE_DIRECTORY}/${runName(runId)}.json.lock`);
  let descriptor;
  try {
    descriptor = fs.openSync(lock, 'wx', 0o600);
    return operation(file);
  } catch (error) {
    if (error.code === 'EEXIST') throw new Error('Run is locked by another writer; inspect its owner before recovering the lock');
    throw error;
  } finally {
    if (descriptor !== undefined) {
      fs.closeSync(descriptor);
      fs.unlinkSync(lock);
    }
  }
}

function startRun(root, runId, plan) {
  root = projectRoot(root);
  runName(runId);
  validatePlan(plan);
  if (plan.status !== 'ready') throw new Error('Plan needs context; resolve unknown signals before starting');
  return locked(root, runId, (file) => {
    if (fs.existsSync(file)) throw new Error('Run already exists; use status or a new runId');
    const now = Date.now();
    const state = { schemaVersion: SCHEMA_VERSION, runId, revision: 0, plan, createdAt: now, updatedAt: now, deadlineAt: now + plan.limits.timeoutMs, cursor: 0, status: 'in-progress', attempts: {}, history: [] };
    atomicWrite(file, state);
    return statusRun(root, runId);
  });
}

function statusRun(root, runId) {
  root = projectRoot(root);
  const state = readState(root, runName(runId));
  const elapsed = Date.now() > state.deadlineAt && state.status !== 'completed';
  return { ...state, effectiveStatus: elapsed ? 'timed-out' : state.status, currentStage: state.plan.stages[state.cursor] || null, evidenceMeaning: 'recorded, not semantically verified', actionsExecuted: [] };
}

function advanceRun(root, runId, input) {
  root = projectRoot(root);
  object(input, 'advance', ['expectedRevision', 'stageId', 'outcome', 'evidencePath', 'notes']);
  const expectedRevision = integer(input.expectedRevision, 'expectedRevision', 0, Number.MAX_SAFE_INTEGER);
  const outcome = enumValue(input.outcome, 'outcome', ['pass', 'fail', 'requires-human']);
  if (!outcome) throw new Error('outcome is required');
  const notes = text(input.notes, 'notes', 2000);
  return locked(root, runName(runId), (file) => {
    const state = readState(root, runId);
    if (state.revision !== expectedRevision) throw new Error('Revision conflict; read status before retrying');
    if (['completed', 'human-checkpoint', 'exhausted', 'timed-out'].includes(state.status)) throw new Error(`Run cannot advance from ${state.status}; create a reviewed follow-up run`);
    const now = Date.now();
    if (now > state.deadlineAt) throw new Error('Run timed out; create a reviewed follow-up run');
    const stage = state.plan.stages[state.cursor];
    if (!stage || input.stageId !== stage.id) throw new Error('Only the current stage can advance');
    const evidence = evidenceArtifact(root, input.evidencePath);
    state.attempts[stage.id] = (state.attempts[stage.id] || 0) + 1;
    state.history.push({ stageId: stage.id, outcome, notes, evidence, recordedAt: now });
    if (outcome === 'pass') {
      state.cursor++;
      state.status = state.cursor === state.plan.stages.length ? (state.plan.humanCheckpoints.length ? 'human-checkpoint' : 'completed') : 'in-progress';
    } else if (outcome === 'requires-human') state.status = 'human-checkpoint';
    else state.status = state.attempts[stage.id] >= state.plan.limits.maxIterations ? 'exhausted' : 'review-required';
    state.revision++;
    state.updatedAt = now;
    atomicWrite(file, state);
    return statusRun(root, runId);
  });
}

module.exports = { SCHEMA_VERSION, STATE_DIRECTORY, RECIPES, createPlan, startRun, statusRun, advanceRun, evidenceArtifact, validatePlan };
