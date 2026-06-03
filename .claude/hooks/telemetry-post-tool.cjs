#!/usr/bin/env node
/**
 * telemetry-post-tool.cjs
 * PostToolUse hook — accumulates per-session DORA counters into a state file.
 *
 * FAIL-OPEN TOTAL: any error is swallowed; hook always exits 0 so it never
 * blocks the main Claude Code flow.
 *
 * State path: <projectRoot>/.sinapse/telemetry/sessions/<sessionId>.json
 * Written by: this hook (PostToolUse)
 * Read+cleared by: telemetry-stop.cjs (Stop)
 *
 * Registered in HOOK_EVENT_MAP as: PostToolUse, no matcher, timeout 3.
 */

'use strict';

const fs   = require('fs');
const path = require('path');
const os   = require('os');

// ─── constants ───────────────────────────────────────────────────────────────

const FILE_WRITE_TOOLS = new Set(['Write', 'Edit', 'NotebookEdit']);

// ─── helpers ─────────────────────────────────────────────────────────────────

function resolveProjectRoot() {
  // CLAUDE_PROJECT_DIR is injected by Claude Code into hook environment
  const fromEnv = process.env.CLAUDE_PROJECT_DIR || process.env.SINAPSE_PROJECT_DIR;
  if (fromEnv) return fromEnv;
  // Fallback: cwd at the time the hook is spawned
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

function sessionStatePath(projectRoot, sessionId) {
  return path.join(projectRoot, '.sinapse', 'telemetry', 'sessions', `${sessionId}.json`);
}

function readState(statePath) {
  try {
    const raw = fs.readFileSync(statePath, 'utf8');
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function writeState(statePath, state) {
  try {
    fs.mkdirSync(path.dirname(statePath), { recursive: true });
    fs.writeFileSync(statePath, JSON.stringify(state, null, 2), 'utf8');
  } catch {
    // fail-open: ignore write errors
  }
}

// ─── main ────────────────────────────────────────────────────────────────────

function main() {
  try {
    // Read event payload from stdin (Claude Code injects it as JSON)
    let raw = '';
    try {
      raw = fs.readFileSync('/dev/stdin', 'utf8');
    } catch {
      // On Windows there's no /dev/stdin — read from fd 0
      try {
        const buf = Buffer.alloc(64 * 1024);
        let totalBytes = 0;
        let bytesRead = 0;
        // Read synchronously until EOF
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
    const toolName    = data.tool_name || data.toolName || '';
    const statePath   = sessionStatePath(projectRoot, sessionId);

    // Read existing state or bootstrap it
    const existing = readState(statePath);
    const state = existing || {
      startedAt:     Date.now(),
      toolExecutions: 0,
      filesModified:  0,
    };

    // Increment counters
    state.toolExecutions += 1;
    if (FILE_WRITE_TOOLS.has(toolName)) {
      state.filesModified += 1;
    }

    writeState(statePath, state);
  } catch {
    // fail-open: swallow any top-level error
  }

  // Always exit 0 — observability hooks are never fail-closed
  process.exit(0);
}

main();
