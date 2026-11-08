'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { spawnSync } = require('node:child_process');
const test = typeof global.it === 'function' ? global.it : require('node:test');
const engine = require(path.resolve(__dirname, '../../packages/engineering-workflows'));
const { main } = require(path.resolve(__dirname, '../../bin/engineering-workflows'));
const { readRegularFile } = require(path.resolve(__dirname, '../../packages/engineering-workflows/safe-file'));

function fixture(run) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'engineering-runtime-'));
  try {
    fs.writeFileSync(path.join(root, 'evidence.md'), 'Observed: reproduction and targeted verification recorded.\n');
    return run(root);
  } finally {
    fs.rmSync(root, { recursive: true, force: true });
  }
}

function plan(overrides = {}) {
  return engine.createPlan({ brief: 'Corrigir regressão pequena de validação', completionCriterion: 'A reprodução falha antes da mudança e passa após a correção, com readback do fluxo afetado.', complexity: 'simple', changeKind: 'fix', risk: 'low', reversibility: 'reversible', workflowIds: ['wave-08-w01'], ...overrides });
}

function advance(root, state, outcome = 'pass', overrides = {}) {
  return engine.advanceRun(root, state.runId, { expectedRevision: state.revision, stageId: state.currentStage.id, outcome, evidencePath: 'evidence.md', notes: 'Evidência sanitizada registrada; resultado revisado no fluxo afetado.', ...overrides });
}

test('bounded reversible fix selects quick path without mandatory story', () => {
  const value = plan();
  assert.equal(value.track, 'quick');
  assert.equal(value.recipe, 'quick-fix');
  assert.ok(!value.stages.some((stage) => stage.id === 'design'));
  assert.ok(!value.gates.includes('story-spec-readiness'));
  assert.equal(value.authority.grantsApproval, false);
  assert.equal(value.planDigest, plan().planDigest);
});

test('automatically ranked multiple workflows preserve their order when starting and resuming', () => fixture((root) => {
  const value = engine.createPlan({ brief: 'Implement authentication', completionCriterion: 'Tests pass' });
  assert.ok(value.workflows.length > 1);
  const state = engine.startRun(root, 'automatic-order', value);
  assert.deepEqual(state.plan.workflows.map((item) => item.id), value.workflows.map((item) => item.id));
  assert.deepEqual(engine.statusRun(root, 'automatic-order').plan.stages, value.stages);
}));

test('scope and elevated risk monotonically add design; external authority is never granted', () => {
  const value = plan({ risk: 'high', actions: ['production', 'payment'], reversibility: 'irreversible' });
  assert.equal(value.track, 'deep');
  assert.ok(value.stages.some((stage) => stage.id === 'design'));
  assert.ok(value.humanCheckpoints.some((item) => item.id === 'production-handoff'));
  assert.equal(value.authority.executesExternalActions, false);
});

test('unknown input and invalid budgets are rejected without inventing a safe plan', () => {
  assert.throws(() => plan({ approve: true }), /Unknown/);
  assert.throws(() => plan({ risk: 'unknown' }), /Invalid risk/);
  assert.throws(() => plan({ maxIterations: 0 }), /integer/);
  assert.throws(() => plan({ maxIterations: 11 }), /integer/);
  assert.throws(() => plan({ timeoutMs: Infinity }), /integer/);
  assert.throws(() => plan({ signals: { risk: 'low' } }), /object/);
});

test('a run requires its own explicit completion criterion before starting', () => fixture((root) => {
  const value = plan({ completionCriterion: undefined });
  assert.equal(value.status, 'needs-context');
  assert.equal(value.completionCriterion, null);
  assert.throws(() => engine.startRun(root, 'missing-criterion', value), /needs context/);
  assert.throws(() => plan({ completionCriterion: '' }), /nonempty/);
}));

test('legacy decision stays advisory; its unknown signal blocks only this guided run', () => fixture((root) => {
  const value = plan({ signals: { schemaVersion: '1.0.0', projectType: 'mystery', risk: { security: 'low', privacy: 'low', availability: 'low' } } });
  assert.equal(value.applicability.mode, 'advisory');
  assert.equal(value.status, 'needs-context');
  assert.throws(() => engine.startRun(root, 'unknown', value), /needs context/);
}));

test('strong signals cannot be lowered by explicit low risk', () => {
  const value = plan({ signals: { schemaVersion: '1.0.0', projectType: 'brownfield', surfaces: ['frontend'], changeKind: 'fix', dataClasses: ['personal'], deploymentTargets: ['web'], reversibility: 'reversible', risk: { security: 'high', privacy: 'low', availability: 'low' } } });
  assert.equal(value.classification.risk, 'high');
  assert.ok(value.gates.includes('design-system-grounding'));
  assert.ok(value.gates.includes('threat-model'));
});

test('irreversibility cannot be lowered and contradictory change kinds must be reconciled', () => {
  const signals = { schemaVersion: '1.0.0', projectType: 'brownfield', surfaces: ['database'], changeKind: 'fix', dataClasses: ['public'], deploymentTargets: ['web'], reversibility: 'irreversible', risk: { security: 'low', privacy: 'low', availability: 'low' } };
  const value = plan({ signals });
  assert.equal(value.classification.reversibility, 'irreversible');
  assert.equal(value.track, 'deep');
  assert.ok(value.humanCheckpoints.some((item) => item.id === 'irreversible-action-approval'));
  assert.throws(() => plan({ signals: { ...signals, changeKind: 'migration' } }), /conflicts/);
});

test('forged plan cannot remove pending external authority even when its public hash is recomputed', () => fixture((root) => {
  const value = plan({ actions: ['production'] });
  value.humanCheckpoints = [];
  const { digest } = require(path.resolve(__dirname, '../../packages/engineering-applicability'));
  const { planDigest: _ignored, ...body } = value;
  value.planDigest = digest(body);
  assert.throws(() => engine.startRun(root, 'forged', value), /contract.*humanCheckpoints/);
}));

test('run persists, resumes, records hashes and completes only after every stage', () => fixture((root) => {
  let state = engine.startRun(root, 'happy-path', plan());
  assert.equal(state.revision, 0);
  assert.equal(state.status, 'in-progress');
  while (state.currentStage) state = advance(root, state);
  assert.equal(state.status, 'completed');
  assert.equal(state.history.length, state.plan.stages.length);
  assert.deepEqual(state.actionsExecuted, []);
  assert.match(state.history[0].evidence.sha256, /^[a-f0-9]{64}$/);
  assert.match(state.evidenceMeaning, /not semantically/);
  assert.equal(engine.statusRun(root, 'happy-path').revision, state.revision);
}));

test('final handoff remains pending for production; no approval flag can clear it', () => fixture((root) => {
  let state = engine.startRun(root, 'external', plan({ actions: ['production'] }));
  while (state.currentStage) state = advance(root, state);
  assert.equal(state.status, 'human-checkpoint');
  assert.throws(() => engine.advanceRun(root, 'external', { expectedRevision: state.revision, stageId: 'handoff', outcome: 'pass', evidencePath: 'evidence.md', notes: 'approved', approved: true }), /Unknown/);
}));

test('failure retains current stage and exhausts its predetermined retry budget', () => fixture((root) => {
  let state = engine.startRun(root, 'retry', plan({ maxIterations: 2 }));
  state = advance(root, state, 'fail');
  assert.equal(state.status, 'review-required');
  assert.equal(state.cursor, 0);
  state = advance(root, state, 'fail');
  assert.equal(state.status, 'exhausted');
  assert.throws(() => advance(root, state), /cannot advance/);
}));

test('out of order steps, missing evidence, stale revisions and lock conflicts fail safely', () => fixture((root) => {
  const state = engine.startRun(root, 'conflicts', plan());
  assert.throws(() => advance(root, state, 'pass', { stageId: 'verify' }), /current stage/);
  assert.throws(() => advance(root, state, 'pass', { evidencePath: 'missing.md' }));
  const next = advance(root, state);
  assert.throws(() => advance(root, state), /Revision conflict/);
  const lock = path.join(root, engine.STATE_DIRECTORY, 'conflicts.json.lock');
  fs.writeFileSync(lock, 'another owner');
  assert.throws(() => advance(root, next), /locked/);
  assert.equal(fs.readFileSync(lock, 'utf8'), 'another owner');
  assert.equal(engine.statusRun(root, 'conflicts').revision, next.revision);
}));

test('artifact drift and state tampering prevent resumed advancement', () => fixture((root) => {
  const state = advance(root, engine.startRun(root, 'drift', plan()));
  fs.appendFileSync(path.join(root, 'evidence.md'), 'Changed afterward.');
  assert.throws(() => engine.statusRun(root, 'drift'), /Evidence drift/);
  assert.equal(state.revision, 1);
  const file = path.join(root, engine.STATE_DIRECTORY, 'drift.json');
  const stored = JSON.parse(fs.readFileSync(file, 'utf8'));
  stored.cursor++;
  fs.writeFileSync(file, JSON.stringify(stored));
  assert.throws(() => engine.statusRun(root, 'drift'), /integrity/);
}));

test('state must replay its history even when a changed public digest is valid', () => fixture((root) => {
  engine.startRun(root, 'impossible', plan());
  const file = path.join(root, engine.STATE_DIRECTORY, 'impossible.json');
  const original = JSON.parse(fs.readFileSync(file, 'utf8'));
  const { digest } = require(path.resolve(__dirname, '../../packages/engineering-applicability'));
  for (const changes of [
    { status: 'completed', cursor: original.plan.stages.length },
    { revision: 5 },
    { attempts: { inspect: 2 } },
    { deadlineAt: original.deadlineAt + 1000 },
  ]) {
    const { stateDigest: _ignored, ...body } = { ...original, ...changes };
    fs.writeFileSync(file, JSON.stringify({ ...body, stateDigest: digest(body) }));
    assert.throws(() => engine.statusRun(root, 'impossible'), /reconcile|timestamps/);
  }
}));

test('resume revalidates selected source bytes through the catalog reader', () => fixture((root) => {
  engine.startRun(root, 'source-drift', plan());
  const catalog = require(path.resolve(__dirname, '../../packages/engineering-workflows/catalog'));
  const original = catalog.readWorkflow;
  try {
    catalog.readWorkflow = () => { throw new Error('Workflow source integrity mismatch: injected drift'); };
    assert.throws(() => engine.statusRun(root, 'source-drift'), /source integrity/);
  } finally { catalog.readWorkflow = original; }
}));

test('timeout is observed without mutating the stored run', () => fixture((root) => {
  const originalNow = Date.now;
  let state;
  try {
    Date.now = () => 100000;
    state = engine.startRun(root, 'timeout', plan({ timeoutMs: 1000 }));
    const before = fs.readFileSync(path.join(root, engine.STATE_DIRECTORY, 'timeout.json'), 'utf8');
    Date.now = () => 102000;
    assert.equal(engine.statusRun(root, 'timeout').effectiveStatus, 'timed-out');
    assert.throws(() => advance(root, state), /timed out/);
    assert.equal(fs.readFileSync(path.join(root, engine.STATE_DIRECTORY, 'timeout.json'), 'utf8'), before);
  } finally { Date.now = originalNow; }
}));

test('traversal, private artifacts, state as evidence and secret content are rejected', () => fixture((root) => {
  const state = engine.startRun(root, 'paths', plan());
  for (const evidencePath of ['../outside.md', '/outside.md', 'C:/outside.md', '.env', '.ssh/id_rsa', '.sinapse/workflow-state/engineering/paths.json']) assert.throws(() => advance(root, state, 'pass', { evidencePath }));
  assert.throws(() => engine.startRun(root, '../escape', plan()), /runId/);
  fs.writeFileSync(path.join(root, 'empty.md'), '');
  assert.throws(() => advance(root, state, 'pass', { evidencePath: 'empty.md' }), /nonempty/);
  const fixtureSecret = `ghp_${'A'.repeat(30)}`;
  fs.writeFileSync(path.join(root, 'private-report.md'), fixtureSecret);
  assert.throws(() => advance(root, state, 'pass', { evidencePath: 'private-report.md' }), /secret/);
}));

test('evidence symlinks are rejected where the host permits symlink creation', () => fixture((root) => {
  const link = path.join(root, 'linked.md');
  try { fs.symlinkSync(path.join(root, 'evidence.md'), link); } catch (error) {
    if (['EPERM', 'EACCES'].includes(error.code)) return;
    throw error;
  }
  assert.throws(() => engine.evidenceArtifact(root, 'linked.md'), /Symlinks/);
}));

test('CLI subprocess returns JSON and rejects unknown command and options', () => {
  const cli = path.resolve(__dirname, '../../bin/engineering-workflows.js');
  const result = spawnSync(process.execPath, [cli, 'catalog', '--json'], { encoding: 'utf8' });
  assert.equal(result.status, 0, result.stderr);
  assert.ok(JSON.parse(result.stdout).stats);
  assert.throws(() => main(['status', 'x', '--approve']), /Unknown/);
  assert.throws(() => main(['unknown']), /Unknown command/);
  assert.throws(() => main(['search', 'tdd', '--limit', 'NaN']), /requires/);
});

test('safe reader rejects path replacement after open and always closes its descriptor', () => fixture((root) => {
  const file = path.join(root, 'evidence.md');
  const open = fs.openSync;
  let opened;
  try {
    fs.openSync = (candidate, ...args) => {
      const descriptor = open(candidate, ...args);
      if (path.resolve(candidate) === file) {
        opened = descriptor;
        fs.renameSync(file, `${file}.original`);
        fs.writeFileSync(file, 'Replacement content must not be read.');
      }
      return descriptor;
    };
    assert.throws(() => readRegularFile(file), /path changed|symlink/);
  } finally { fs.openSync = open; }
  assert.throws(() => fs.fstatSync(opened), /bad file descriptor|EBADF/);
}));

test('safe reader stays on the validated descriptor and rejects replacement during reading', () => fixture((root) => {
  const file = path.join(root, 'evidence.md');
  const original = fs.readFileSync(file, 'utf8');
  const read = fs.readSync;
  let replaced = false;
  const observed = [];
  try {
    fs.readSync = (descriptor, ...args) => {
      assert.equal(typeof descriptor, 'number');
      if (!replaced) {
        replaced = true;
        fs.renameSync(file, `${file}.original`);
        fs.writeFileSync(file, 'Untrusted replacement.');
      }
      const length = read(descriptor, ...args);
      observed.push(args[0].subarray(args[1], args[1] + length));
      return length;
    };
    assert.throws(() => readRegularFile(file), /changed/);
    assert.equal(Buffer.concat(observed).toString('utf8'), original);
  } finally { fs.readSync = read; }
}));

test('safe reader bounds concurrent growth, rejects directories and input symlinks', () => fixture((root) => {
  const file = path.join(root, 'bounded.md');
  fs.writeFileSync(file, 'Small.');
  const read = fs.readSync;
  let grew = false;
  try {
    fs.readSync = (descriptor, ...args) => {
      if (!grew) { grew = true; fs.appendFileSync(file, 'X'.repeat(100)); }
      return read(descriptor, ...args);
    };
    assert.throws(() => readRegularFile(file, { maxBytes: 8 }), /changed|byte limit/);
  } finally { fs.readSync = read; }
  assert.throws(() => readRegularFile(root));
  const link = path.join(root, 'input-link.json');
  try { fs.symlinkSync(file, link); } catch (error) {
    if (['EPERM', 'EACCES'].includes(error.code)) return;
    throw error;
  }
  assert.throws(() => main(['plan', '--input', link]), /symlink|ELOOP/);
}));
