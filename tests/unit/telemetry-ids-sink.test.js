'use strict';

/**
 * tests/unit/telemetry-ids-sink.test.js
 * @story Frente 4.3 — Stream B (B.1)
 *
 * Tests:
 *  (a) emitGateDecision writes a JSONL line with OTel GenAI fields
 *  (b) emitSessionEnd writes a session-end JSONL line with DORA fields
 *  (c) fail-open: sink unwritable → no exception propagates
 *  (d) OTel field names are present and match conventions
 */

const fs = require('fs');
const os = require('os');
const path = require('path');

let tmpDir;

beforeEach(() => {
  jest.resetModules();
  tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'sinapse-ids-sink-'));
  process.env.SINAPSE_TELEMETRY_SINK = path.join(tmpDir, 'gate-decisions.jsonl');
  delete process.env.CLAUDE_SESSION_ID;
  delete process.env.CLAUDE_CODE_SESSION_ID;
  delete process.env.SINAPSE_SESSION_ID;
});

afterEach(() => {
  delete process.env.SINAPSE_TELEMETRY_SINK;
  try { fs.rmSync(tmpDir, { recursive: true, force: true }); } catch { /* ignore */ }
});

function loadSink() {
  return require('../../.sinapse-ai/core/telemetry/ids-sink');
}

function readLines() {
  const sinkPath = process.env.SINAPSE_TELEMETRY_SINK;
  try {
    const raw = fs.readFileSync(sinkPath, 'utf8').trim();
    return raw.split('\n').filter(Boolean).map((l) => JSON.parse(l));
  } catch {
    return [];
  }
}

// ─── (a) emitGateDecision ─────────────────────────────────────────────────────

describe('emitGateDecision', () => {
  it('writes a JSONL line with all required OTel GenAI fields', () => {
    const sink = loadSink();
    sink.emitGateDecision({ tool: 'G1', phase: 'epic_creation', blocked: false, warnings: [] });

    const lines = readLines();
    expect(lines).toHaveLength(1);
    const line = lines[0];

    expect(line['gen_ai.operation.name']).toBe('ids.gate.evaluate');
    expect(line['gen_ai.request.model']).toBe('sinapse-ids');
    expect(line['gen_ai.usage.input_tokens']).toBe(0);
    expect(line['gen_ai.usage.output_tokens']).toBe(0);
    expect(line.tool).toBe('G1');
    expect(line.phase).toBe('epic_creation');
    expect(line.blocked).toBe(false);
    expect(Array.isArray(line.warnings)).toBe(true);
    expect(typeof line.timestamp).toBe('string');
    expect(new Date(line.timestamp).toString()).not.toBe('Invalid Date');
  });

  it('records blocked=true when gate is blocking', () => {
    const sink = loadSink();
    sink.emitGateDecision({ tool: 'G3', phase: 'story_validation', blocked: true, warnings: ['no story'] });

    const lines = readLines();
    expect(lines[0].blocked).toBe(true);
    expect(lines[0].warnings).toEqual(['no story']);
  });

  it('uses fallback sessionId "unknown" when env vars absent', () => {
    const sink = loadSink();
    sink.emitGateDecision({ tool: 'G1', phase: 'epic_creation', blocked: false });

    const lines = readLines();
    expect(lines[0].sessionId).toBe('unknown');
  });

  it('picks up CLAUDE_SESSION_ID from env', () => {
    process.env.CLAUDE_SESSION_ID = 'test-session-abc';
    const sink = loadSink();
    sink.emitGateDecision({ tool: 'G1', phase: 'epic_creation', blocked: false });
    delete process.env.CLAUDE_SESSION_ID;

    const lines = readLines();
    expect(lines[0].sessionId).toBe('test-session-abc');
  });

  it('appends multiple lines (one per gate call)', () => {
    const sink = loadSink();
    sink.emitGateDecision({ tool: 'G1', phase: 'epic_creation', blocked: false });
    sink.emitGateDecision({ tool: 'G2', phase: 'story_creation', blocked: false });
    sink.emitGateDecision({ tool: 'G5', phase: '2_development', blocked: true });

    const lines = readLines();
    expect(lines).toHaveLength(3);
    expect(lines.map((l) => l.tool)).toEqual(['G1', 'G2', 'G5']);
  });
});

// ─── (b) emitSessionEnd ───────────────────────────────────────────────────────

describe('emitSessionEnd', () => {
  it('writes a session-end JSONL line with all DORA fields', () => {
    const sink = loadSink();
    sink.emitSessionEnd({
      sessionId: 'sess-xyz',
      toolExecutions: 42,
      filesModified: 7,
      sessionDurationMs: 30000,
    });

    const lines = readLines();
    expect(lines).toHaveLength(1);
    const line = lines[0];

    expect(line['gen_ai.operation.name']).toBe('session.end');
    expect(line['gen_ai.request.model']).toBe('sinapse-ids');
    expect(line['gen_ai.usage.input_tokens']).toBe(0);
    expect(line['gen_ai.usage.output_tokens']).toBe(0);
    expect(line.sessionId).toBe('sess-xyz');
    expect(line['dora.toolExecutions']).toBe(42);
    expect(line['dora.filesModified']).toBe(7);
    expect(line['dora.sessionDurationMs']).toBe(30000);
    expect(typeof line.timestamp).toBe('string');
  });
});

// ─── (c) fail-open guarantee ─────────────────────────────────────────────────

describe('fail-open guarantee', () => {
  it('does NOT throw when mkdirSync and appendFileSync both throw EACCES', () => {
    const sink = loadSink();
    const originalMkdir = fs.mkdirSync;
    const originalAppend = fs.appendFileSync;

    fs.mkdirSync = () => { throw new Error('EACCES: permission denied'); };
    fs.appendFileSync = () => { throw new Error('EACCES: permission denied'); };

    let threw = false;
    try {
      sink.emitGateDecision({ tool: 'G1', phase: 'test', blocked: false });
    } catch {
      threw = true;
    }

    fs.mkdirSync = originalMkdir;
    fs.appendFileSync = originalAppend;

    expect(threw).toBe(false);
  });

  it('does NOT throw from emitSessionEnd when sink is unwritable', () => {
    const sink = loadSink();
    const originalMkdir = fs.mkdirSync;
    const originalAppend = fs.appendFileSync;

    fs.mkdirSync = () => { throw new Error('ENOSPC: no space left on device'); };
    fs.appendFileSync = () => { throw new Error('ENOSPC: no space left on device'); };

    let threw = false;
    try {
      sink.emitSessionEnd({ sessionId: 's', toolExecutions: 1, filesModified: 0, sessionDurationMs: 100 });
    } catch {
      threw = true;
    }

    fs.mkdirSync = originalMkdir;
    fs.appendFileSync = originalAppend;

    expect(threw).toBe(false);
  });

  it('does NOT throw when JSON.stringify throws internally', () => {
    const sink = loadSink();
    const original = JSON.stringify;
    JSON.stringify = () => { throw new Error('Serialisation failure'); };

    let threw = false;
    try {
      sink.emitGateDecision({ tool: 'G4', phase: 'dev', blocked: false });
    } catch {
      threw = true;
    }

    JSON.stringify = original;
    expect(threw).toBe(false);
  });
});

// ─── (d) exported constants match OTel naming ────────────────────────────────

describe('exported constants', () => {
  it('OPERATION_GATE_EVALUATE === "ids.gate.evaluate"', () => {
    const sink = loadSink();
    expect(sink.OPERATION_GATE_EVALUATE).toBe('ids.gate.evaluate');
  });

  it('OPERATION_SESSION_END === "session.end"', () => {
    const sink = loadSink();
    expect(sink.OPERATION_SESSION_END).toBe('session.end');
  });

  it('MODEL_IDS === "sinapse-ids"', () => {
    const sink = loadSink();
    expect(sink.MODEL_IDS).toBe('sinapse-ids');
  });
});
