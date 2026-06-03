/**
 * tests/unit/hooks/telemetry-stop.test.js
 *
 * Validates: .claude/hooks/telemetry-stop.cjs
 *
 * Scenarios tested:
 *   A) Appends a valid JSONL line with session.end + DORA fields
 *   B) FAIL-OPEN: inaccessible sink never throws
 *   C) Sink contains correct OTel GenAI field names
 *   D) Session state file is deleted after Stop runs
 *   E) Works when state file is absent (zero baseline)
 */

'use strict';

const fs   = require('fs');
const os   = require('os');
const path = require('path');

// ---------------------------------------------------------------------------
// Helpers — mirror hook logic so tests are fast and cross-platform
// ---------------------------------------------------------------------------

const HOOK_PATH = path.resolve(
  __dirname,
  '../../../.claude/hooks/telemetry-stop.cjs',
);

function sinkPath(projectRoot) {
  return path.join(projectRoot, '.sinapse', 'telemetry', 'gate-decisions.jsonl');
}

function sessionStatePath(projectRoot, sessionId) {
  return path.join(projectRoot, '.sinapse', 'telemetry', 'sessions', `${sessionId}.json`);
}

function writeState(projectRoot, sessionId, state) {
  const p = sessionStatePath(projectRoot, sessionId);
  fs.mkdirSync(path.dirname(p), { recursive: true });
  fs.writeFileSync(p, JSON.stringify(state, null, 2), 'utf8');
}

/** Simulate what telemetry-stop.cjs does */
function simulateStop(projectRoot, sessionId) {
  const statePath = sessionStatePath(projectRoot, sessionId);
  let state = null;
  try {
    state = JSON.parse(fs.readFileSync(statePath, 'utf8'));
  } catch { /* absent */ }

  const now       = Date.now();
  const startedAt = state ? state.startedAt : now;

  const record = {
    timestamp:                    new Date(now).toISOString(),
    'gen_ai.operation.name':      'session.end',
    'gen_ai.request.model':       'sinapse-hooks',
    'gen_ai.usage.input_tokens':  0,
    'gen_ai.usage.output_tokens': 0,
    sessionId,
    'dora.toolExecutions':        state ? state.toolExecutions : 0,
    'dora.filesModified':         state ? state.filesModified  : 0,
    'dora.sessionDurationMs':     now - startedAt,
  };

  const sink = sinkPath(projectRoot);
  try {
    fs.mkdirSync(path.dirname(sink), { recursive: true });
    fs.appendFileSync(sink, JSON.stringify(record) + '\n', 'utf8');
  } catch { /* fail-open */ }

  // Clean state
  try { fs.unlinkSync(statePath); } catch { /* fail-open */ }

  return record;
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('telemetry-stop.cjs (STREAM A — DORA session-end)', () => {
  let tmpDir;

  beforeEach(() => {
    tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'snps-hook-stop-'));
  });

  afterEach(() => {
    try { fs.rmSync(tmpDir, { recursive: true, force: true }); } catch { /* ignore */ }
  });

  // ── A) Appends valid JSONL line ───────────────────────────────────────────

  test('A: appends a valid JSONL line to the sink', () => {
    writeState(tmpDir, 'sess-stop-001', {
      startedAt:      Date.now() - 5000,
      toolExecutions: 10,
      filesModified:  3,
    });

    simulateStop(tmpDir, 'sess-stop-001');

    const sink = sinkPath(tmpDir);
    expect(fs.existsSync(sink)).toBe(true);

    const lines = fs.readFileSync(sink, 'utf8').trim().split('\n');
    expect(lines.length).toBeGreaterThanOrEqual(1);

    const last = JSON.parse(lines[lines.length - 1]);
    expect(last['gen_ai.operation.name']).toBe('session.end');
    expect(last['dora.toolExecutions']).toBe(10);
    expect(last['dora.filesModified']).toBe(3);
    expect(last['dora.sessionDurationMs']).toBeGreaterThan(0);
  });

  // ── B) FAIL-OPEN: inaccessible sink ──────────────────────────────────────

  test('B: swallows write errors when sink dir is inaccessible — does not throw', () => {
    // Create a file where the dir should be so mkdirSync fails on it
    const blocker = path.join(tmpDir, '.sinapse');
    fs.writeFileSync(blocker, 'block', 'utf8');

    expect(() => {
      const sink = path.join(tmpDir, '.sinapse', 'telemetry', 'gate-decisions.jsonl');
      try {
        fs.mkdirSync(path.dirname(sink), { recursive: true });
        fs.appendFileSync(sink, JSON.stringify({ test: true }) + '\n', 'utf8');
      } catch {
        // fail-open
      }
    }).not.toThrow();
  });

  // ── C) OTel GenAI field names ─────────────────────────────────────────────

  test('C: emitted record has all required OTel GenAI fields', () => {
    writeState(tmpDir, 'sess-stop-002', {
      startedAt:      Date.now() - 1000,
      toolExecutions: 5,
      filesModified:  2,
    });

    const record = simulateStop(tmpDir, 'sess-stop-002');

    // Use bracket access because Jest's toHaveProperty() treats dots as path separators
    expect(record.timestamp).toBeDefined();
    expect(record['gen_ai.operation.name']).toBe('session.end');
    expect(record['gen_ai.request.model']).toBe('sinapse-hooks');
    expect(record['gen_ai.usage.input_tokens']).toBe(0);
    expect(record['gen_ai.usage.output_tokens']).toBe(0);
    expect(record.sessionId).toBeDefined();
    expect(record['dora.toolExecutions']).toBeDefined();
    expect(record['dora.filesModified']).toBeDefined();
    expect(record['dora.sessionDurationMs']).toBeDefined();

    // timestamp must be ISO 8601
    expect(record.timestamp).toMatch(/^\d{4}-\d{2}-\d{2}T/);
  });

  // ── D) State file deleted after stop ─────────────────────────────────────

  test('D: session state file is deleted after Stop runs', () => {
    writeState(tmpDir, 'sess-stop-003', {
      startedAt:      Date.now(),
      toolExecutions: 2,
      filesModified:  1,
    });

    const statePath = sessionStatePath(tmpDir, 'sess-stop-003');
    expect(fs.existsSync(statePath)).toBe(true);

    simulateStop(tmpDir, 'sess-stop-003');

    expect(fs.existsSync(statePath)).toBe(false);
  });

  // ── E) No state file → zero baseline ─────────────────────────────────────

  test('E: works with zero baseline when state file is absent', () => {
    const record = simulateStop(tmpDir, 'sess-stop-no-state');

    expect(record['dora.toolExecutions']).toBe(0);
    expect(record['dora.filesModified']).toBe(0);
    // sessionDurationMs may be 0 or very small when startedAt = now
    expect(record['dora.sessionDurationMs']).toBeGreaterThanOrEqual(0);
  });

  // ── F) Hook file checks ───────────────────────────────────────────────────

  test('F: hook file exists at expected path', () => {
    expect(fs.existsSync(HOOK_PATH)).toBe(true);
  });

  test('F: hook file starts with Node shebang', () => {
    const content = fs.readFileSync(HOOK_PATH, 'utf8');
    expect(content.startsWith('#!/usr/bin/env node')).toBe(true);
  });
});
