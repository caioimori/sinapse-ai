'use strict';

/**
 * IDS Telemetry Sink — SINAPSE Framework
 * @story Frente 4.3 — Telemetria OTel + DORA + Gate Decisions JSONL (Stream B)
 *
 * A LOCAL-only, always-on sink for IDS gate decision events.
 * This is NOT the opt-in user telemetry stub (telemetry/index.js).
 * This sink records framework-internal operational data only — no PII,
 * no user paths, no prompt content.
 *
 * Design principles:
 *  - FAIL-OPEN TOTAL: any error is swallowed silently. Never throws. Never blocks.
 *  - Zero external deps: pure Node stdlib (fs, path, os).
 *  - OTel GenAI semantic conventions for field names.
 *  - Separate from opt-in telemetry; isEnabled() is NOT consulted.
 *
 * Output file: <projectRoot>/.sinapse/telemetry/gate-decisions.jsonl
 * (gitignored by default — .sinapse/ is in .gitignore)
 */

const fs = require('fs');
const path = require('path');

// ─── Constants (OTel GenAI semantic conventions) ─────────────────────────────

const OPERATION_GATE_EVALUATE = 'ids.gate.evaluate';
const OPERATION_SESSION_END = 'session.end';
const MODEL_IDS = 'sinapse-ids';

// ─── Sink path resolution ─────────────────────────────────────────────────────

/**
 * Resolve the absolute path to the JSONL sink file.
 * Uses process.cwd() as project root — same convention as DashboardEmitter.
 * Caller may override via SINAPSE_TELEMETRY_SINK env var (useful in tests).
 *
 * @returns {string}
 */
function resolveSinkPath() {
  if (process.env.SINAPSE_TELEMETRY_SINK) {
    return process.env.SINAPSE_TELEMETRY_SINK;
  }
  return path.join(process.cwd(), '.sinapse', 'telemetry', 'gate-decisions.jsonl');
}

/**
 * Ensure the directory for the sink exists. Fail-open.
 * @param {string} sinkPath
 */
function ensureSinkDir(sinkPath) {
  try {
    fs.mkdirSync(path.dirname(sinkPath), { recursive: true });
  } catch {
    // fail-open: if we can't create the dir, the appendFileSync below will
    // also fail and be swallowed by the outer try/catch.
  }
}

/**
 * Append a single JSON line to the sink. Fail-open.
 * @param {object} record — must be JSON-serialisable.
 */
function appendLine(record) {
  try {
    const sinkPath = resolveSinkPath();
    ensureSinkDir(sinkPath);
    fs.appendFileSync(sinkPath, JSON.stringify(record) + '\n', 'utf8');
  } catch {
    /* fail-open: telemetry MUST NEVER block the caller */
  }
}

// ─── Session ID resolution ────────────────────────────────────────────────────

/**
 * Resolve the current session id from environment variables injected by
 * Claude Code. Falls back to 'unknown' when not available.
 * @returns {string}
 */
function resolveSessionId() {
  return (
    process.env.CLAUDE_SESSION_ID ||
    process.env.CLAUDE_CODE_SESSION_ID ||
    process.env.SINAPSE_SESSION_ID ||
    'unknown'
  );
}

// ─── Public API ───────────────────────────────────────────────────────────────

/**
 * Emit a gate-decision event as a JSONL line using OTel GenAI field names.
 *
 * Fields emitted (NO PII):
 *  - timestamp            ISO-8601
 *  - gen_ai.operation.name  "ids.gate.evaluate"
 *  - gen_ai.request.model   "sinapse-ids"
 *  - gen_ai.usage.input_tokens   always 0 (no LLM call)
 *  - gen_ai.usage.output_tokens  always 0 (no LLM call)
 *  - tool                 gateId (e.g. "G1")
 *  - sessionId            from CLAUDE_SESSION_ID env or "unknown"
 *  - phase                phaseId (e.g. "epic_creation")
 *  - blocked              boolean
 *  - warnings             string[] (gate warning messages)
 *
 * FAIL-OPEN: any error inside this function is swallowed. Returns void.
 *
 * @param {{
 *   tool: string,
 *   phase: string,
 *   blocked: boolean,
 *   warnings?: string[],
 *   sessionId?: string,
 * }} record
 */
function emitGateDecision(record) {
  try {
    appendLine({
      timestamp: new Date().toISOString(),
      'gen_ai.operation.name': OPERATION_GATE_EVALUATE,
      'gen_ai.request.model': MODEL_IDS,
      'gen_ai.usage.input_tokens': 0,
      'gen_ai.usage.output_tokens': 0,
      tool: String(record.tool || 'unknown'),
      sessionId: record.sessionId || resolveSessionId(),
      phase: String(record.phase || 'unknown'),
      blocked: record.blocked === true,
      warnings: Array.isArray(record.warnings) ? record.warnings : [],
    });
  } catch {
    /* fail-open */
  }
}

/**
 * Emit a session-end event with DORA base counters.
 *
 * Fields emitted:
 *  - timestamp
 *  - gen_ai.operation.name   "session.end"
 *  - gen_ai.request.model    "sinapse-ids"
 *  - gen_ai.usage.input_tokens   0
 *  - gen_ai.usage.output_tokens  0
 *  - sessionId
 *  - dora.toolExecutions     total tool calls in the session
 *  - dora.filesModified      Write + Edit tool calls count
 *  - dora.sessionDurationMs  session wall-clock duration in ms
 *
 * FAIL-OPEN. Returns void.
 *
 * @param {{
 *   sessionId: string,
 *   toolExecutions: number,
 *   filesModified: number,
 *   sessionDurationMs: number,
 * }} record
 */
function emitSessionEnd(record) {
  try {
    appendLine({
      timestamp: new Date().toISOString(),
      'gen_ai.operation.name': OPERATION_SESSION_END,
      'gen_ai.request.model': MODEL_IDS,
      'gen_ai.usage.input_tokens': 0,
      'gen_ai.usage.output_tokens': 0,
      sessionId: String(record.sessionId || 'unknown'),
      'dora.toolExecutions': Number(record.toolExecutions) || 0,
      'dora.filesModified': Number(record.filesModified) || 0,
      'dora.sessionDurationMs': Number(record.sessionDurationMs) || 0,
    });
  } catch {
    /* fail-open */
  }
}

// ─── Exported (test-accessible) internals ────────────────────────────────────

module.exports = {
  emitGateDecision,
  emitSessionEnd,
  // Exposed for tests only — NOT part of the public contract.
  _resolveSinkPath: resolveSinkPath,
  _resolveSessionId: resolveSessionId,
  OPERATION_GATE_EVALUATE,
  OPERATION_SESSION_END,
  MODEL_IDS,
};
