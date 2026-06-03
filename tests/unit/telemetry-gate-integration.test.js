'use strict';

/**
 * tests/unit/telemetry-gate-integration.test.js
 * @story Frente 4.3 — Stream B (B.2)
 *
 * Tests:
 *  - gate-evaluator emits telemetry per gate decision
 *  - gate evaluation still succeeds even when ids-sink is broken (fail-open)
 *  - session-end counter test (via telemetry-stop hook contract)
 */

const fs = require('fs');
const os = require('os');
const path = require('path');

let tmpDir;

beforeEach(() => {
  jest.resetModules();
  tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'sinapse-gate-tel-'));
  process.env.SINAPSE_TELEMETRY_SINK = path.join(tmpDir, 'gate-decisions.jsonl');
  delete process.env.CLAUDE_SESSION_ID;
});

afterEach(() => {
  delete process.env.SINAPSE_TELEMETRY_SINK;
  try { fs.rmSync(tmpDir, { recursive: true, force: true }); } catch { /* ignore */ }
});

function readLines() {
  const sinkPath = process.env.SINAPSE_TELEMETRY_SINK;
  try {
    const raw = fs.readFileSync(sinkPath, 'utf8').trim();
    return raw.split('\n').filter(Boolean).map((l) => JSON.parse(l));
  } catch {
    return [];
  }
}

// Helper: build a minimal GateEvaluator with a fake gate
function buildEvaluatorWithFakeGate(gateResult) {
  // We need the real GateEvaluator from ids module, but inject a fake gate
  const { GateEvaluator } = require('../../.sinapse-ai/core/ids/gate-evaluator');

  // Create evaluator with custom phaseGates
  const evaluator = new GateEvaluator(
    {
      gateEvaluation: {
        enabled: true,
        failOpen: true,
        phaseGates: { test_phase: ['G1'] },
        timeoutMs: 2000,
      },
    },
    {}
  );

  // Inject a fake G1 gate that returns the desired result
  evaluator._gateCache.set('G1', {
    verify: async () => gateResult,
  });

  return evaluator;
}

// ─── Gate decision emits telemetry line ───────────────────────────────────────

describe('gate-evaluator telemetry emission (B.2)', () => {
  it('emits a gate-decision JSONL line after each gate runs', async () => {
    const gateResult = {
      gateId: 'G1',
      result: { blocking: false, warnings: [] },
      override: null,
    };
    const evaluator = buildEvaluatorWithFakeGate(gateResult);

    await evaluator.evaluateGatesForPhase('test_phase', { intent: 'test' });

    const lines = readLines();
    expect(lines.length).toBeGreaterThanOrEqual(1);

    const gateLine = lines.find((l) => l['gen_ai.operation.name'] === 'ids.gate.evaluate');
    expect(gateLine).toBeDefined();
    expect(gateLine.tool).toBe('G1');
    expect(gateLine.phase).toBe('test_phase');
    expect(gateLine.blocked).toBe(false);
    expect(gateLine['gen_ai.request.model']).toBe('sinapse-ids');
    expect(gateLine['gen_ai.usage.input_tokens']).toBe(0);
    expect(gateLine['gen_ai.usage.output_tokens']).toBe(0);
  });

  it('emits blocked=true when gate returns blocking', async () => {
    const gateResult = {
      gateId: 'G1',
      result: { blocking: true, warnings: ['missing epic'] },
      override: { correctionPrompt: 'Create an epic first.' },
    };
    const evaluator = buildEvaluatorWithFakeGate(gateResult);

    await evaluator.evaluateGatesForPhase('test_phase', {});

    const lines = readLines();
    const gateLine = lines.find((l) => l['gen_ai.operation.name'] === 'ids.gate.evaluate');
    expect(gateLine).toBeDefined();
    expect(gateLine.blocked).toBe(true);
  });

  it('gate evaluation returns correct verdict even when sink is broken (fail-open)', async () => {
    // Break the sink
    const originalMkdir = fs.mkdirSync;
    const originalAppend = fs.appendFileSync;
    fs.mkdirSync = () => { throw new Error('EACCES'); };
    fs.appendFileSync = () => { throw new Error('EACCES'); };

    const gateResult = {
      gateId: 'G1',
      result: { blocking: false, warnings: [] },
      override: null,
    };
    const evaluator = buildEvaluatorWithFakeGate(gateResult);

    let verdict;
    let threw = false;
    try {
      verdict = await evaluator.evaluateGatesForPhase('test_phase', {});
    } catch {
      threw = true;
    }

    fs.mkdirSync = originalMkdir;
    fs.appendFileSync = originalAppend;

    expect(threw).toBe(false);
    expect(verdict).toBeDefined();
    expect(verdict.blocked).toBe(false);
    expect(verdict.phase).toBe('test_phase');
  });

  it('gate evaluation with disabled evaluator returns empty verdict without writing', async () => {
    const { GateEvaluator } = require('../../.sinapse-ai/core/ids/gate-evaluator');
    const evaluator = new GateEvaluator(
      { gateEvaluation: { enabled: false } },
      {}
    );

    await evaluator.evaluateGatesForPhase('test_phase', {});

    const lines = readLines();
    expect(lines).toHaveLength(0);
  });
});

// ─── DORA session counter contract ───────────────────────────────────────────

describe('DORA session counter contract (B.3 hook contract)', () => {
  it('session state file accumulates toolExecutions and filesModified', () => {
    // Simulate what telemetry-post-tool.cjs does per call
    const sessionId = 'test-dora-session';
    const sessionsDir = path.join(tmpDir, '.sinapse', 'telemetry', 'sessions');
    fs.mkdirSync(sessionsDir, { recursive: true });
    const stateFile = path.join(sessionsDir, `${sessionId}.json`);

    // Simulate 3 tool calls: Bash, Write, Edit
    const tools = ['Bash', 'Write', 'Edit'];
    const fileWriteTools = new Set(['Write', 'Edit', 'NotebookEdit']);

    let state = { startedAt: Date.now(), toolExecutions: 0, filesModified: 0 };
    for (const tool of tools) {
      state.toolExecutions += 1;
      if (fileWriteTools.has(tool)) state.filesModified += 1;
      fs.writeFileSync(stateFile, JSON.stringify(state), 'utf8');
    }

    const saved = JSON.parse(fs.readFileSync(stateFile, 'utf8'));
    expect(saved.toolExecutions).toBe(3);
    expect(saved.filesModified).toBe(2); // Write + Edit
    expect(typeof saved.startedAt).toBe('number');
  });

  it('emitSessionEnd writes correct DORA counters to sink', () => {
    const sink = require('../../.sinapse-ai/core/telemetry/ids-sink');
    sink.emitSessionEnd({
      sessionId: 'dora-test',
      toolExecutions: 10,
      filesModified: 3,
      sessionDurationMs: 120000,
    });

    const lines = readLines();
    expect(lines).toHaveLength(1);
    expect(lines[0]['gen_ai.operation.name']).toBe('session.end');
    expect(lines[0]['dora.toolExecutions']).toBe(10);
    expect(lines[0]['dora.filesModified']).toBe(3);
    expect(lines[0]['dora.sessionDurationMs']).toBe(120000);
  });
});
