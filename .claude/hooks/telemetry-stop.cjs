#!/usr/bin/env node
/**
 * telemetry-stop.cjs
 * Stop hook — reads per-session DORA state and appends a session-end line
 * to the JSONL sink, then cleans up the state file.
 *
 * FAIL-OPEN TOTAL: any error is swallowed; hook always exits 0.
 *
 * Sink path:  <projectRoot>/.sinapse/telemetry/gate-decisions.jsonl
 * State path: <projectRoot>/.sinapse/telemetry/sessions/<sessionId>.json
 *
 * Registered in HOOK_EVENT_MAP as: Stop, no matcher, timeout 5.
 */

'use strict';

const fs   = require('fs');
const path = require('path');

// ─── helpers ─────────────────────────────────────────────────────────────────

function resolveProjectRoot() {
  const fromEnv = process.env.CLAUDE_PROJECT_DIR || process.env.SINAPSE_PROJECT_DIR;
  if (fromEnv) return fromEnv;
  return process.cwd();
}

function resolveSessionId(data) {
  return (
    process.env.CLAUDE_SESSION_ID ||
    process.env.CLAUDE_CODE_SESSION_ID ||
    data.session_id ||
    data.sessionId ||
    'unknown'
  );
}

function sinkPath(projectRoot) {
  return path.join(projectRoot, '.sinapse', 'telemetry', 'gate-decisions.jsonl');
}

function sessionStatePath(projectRoot, sessionId) {
  return path.join(projectRoot, '.sinapse', 'telemetry', 'sessions', `${sessionId}.json`);
}

function appendLine(filePath, record) {
  try {
    fs.mkdirSync(path.dirname(filePath), { recursive: true });
    fs.appendFileSync(filePath, JSON.stringify(record) + '\n', 'utf8');
  } catch {
    // fail-open: ignore write errors
  }
}

function readState(statePath) {
  try {
    const raw = fs.readFileSync(statePath, 'utf8');
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function deleteState(statePath) {
  try {
    fs.unlinkSync(statePath);
  } catch {
    // fail-open
  }
}

// ─── main ────────────────────────────────────────────────────────────────────

function main() {
  try {
    // Read event payload from stdin
    let raw = '';
    try {
      raw = fs.readFileSync('/dev/stdin', 'utf8');
    } catch {
      try {
        const buf = Buffer.alloc(64 * 1024);
        let totalBytes = 0;
        let bytesRead = 0;
        while (true) {
          try {
            bytesRead = fs.readSync(0, buf, totalBytes, buf.length - totalBytes, null);
            if (bytesRead === 0) break;
            totalBytes += bytesRead;
          } catch {
            break;
          }
        }
        raw = buf.slice(0, totalBytes).toString('utf8');
      } catch {
        raw = '{}';
      }
    }

    const data = (() => { try { return JSON.parse(raw); } catch { return {}; } })();

    const projectRoot = resolveProjectRoot();
    const sessionId   = resolveSessionId(data);
    const statePath   = sessionStatePath(projectRoot, sessionId);
    const state       = readState(statePath);

    const now       = Date.now();
    const startedAt = state ? state.startedAt : now;

    // Build DORA session-end record with OTel GenAI field names
    const record = {
      timestamp:                   new Date(now).toISOString(),
      'gen_ai.operation.name':     'session.end',
      'gen_ai.request.model':      'sinapse-hooks',
      'gen_ai.usage.input_tokens': 0,
      'gen_ai.usage.output_tokens': 0,
      sessionId,
      'dora.toolExecutions':        state ? state.toolExecutions : 0,
      'dora.filesModified':         state ? state.filesModified  : 0,
      'dora.sessionDurationMs':     now - startedAt,
    };

    appendLine(sinkPath(projectRoot), record);
    deleteState(statePath);
  } catch {
    // fail-open: swallow any top-level error
  }

  process.exit(0);
}

main();
