#!/usr/bin/env node
'use strict';

/**
 * Code Intelligence Hook Entry Point — PreToolUse (Write|Edit)
 *
 * Thin wrapper that reads the PreToolUse JSON from stdin, resolves code
 * intelligence for the file being written/edited, and injects an
 * <code-intel-context> block as additionalContext so the model sees the
 * existing entity, its references, and dependencies before editing.
 *
 * Design (mirrors synapse-engine.cjs + hook-governance.md):
 * - Fail-open: any error or missing data → empty stdout, exit 0 (never blocks)
 * - Fast: the runtime resolver targets < 500ms; 5s hard safety timeout here
 * - Silent on no-data: empty stdout is a valid "no context"
 *
 * @module code-intel-pretool-hook
 */

const path = require('path');
const {
  resolveCodeIntel,
  formatAsXml,
} = require(
  path.join(__dirname, '..', '..', '.sinapse-ai', 'core', 'code-intel', 'hook-runtime.js'),
);

/** Safety timeout (ms) — defense-in-depth; Claude Code also manages hook timeout. */
const HOOK_TIMEOUT_MS = 5000;

/**
 * Read all data from stdin as a JSON object.
 * @returns {Promise<object>} Parsed JSON input
 */
function readStdin() {
  return new Promise((resolve, reject) => {
    let data = '';
    process.stdin.setEncoding('utf8');
    process.stdin.on('error', (e) => reject(e));
    process.stdin.on('data', (chunk) => { data += chunk; });
    process.stdin.on('end', () => {
      try { resolve(JSON.parse(data)); }
      catch (e) { reject(e); }
    });
  });
}

/** Write to stdout robustly across real and mocked (Jest) streams. */
function writeStdout(output) {
  return new Promise((resolve, reject) => {
    let settled = false;
    const finish = (err) => {
      if (settled) return;
      settled = true;
      if (err) reject(err); else resolve();
    };
    try {
      const flushed = process.stdout.write(output, (err) => finish(err));
      if (flushed) setImmediate(() => finish());
      else if (typeof process.stdout.once === 'function') process.stdout.once('drain', () => finish());
    } catch (err) {
      finish(err);
    }
  });
}

/** Main hook execution pipeline. */
async function main() {
  const input = await readStdin();

  // PreToolUse payload: the target path lives in tool_input.file_path
  // (Write/Edit). Bail silently if absent — nothing to enrich.
  const toolInput = input && input.tool_input ? input.tool_input : {};
  const filePath = toolInput.file_path || toolInput.path || '';
  const cwd = input.cwd || process.cwd();
  if (!filePath) return;

  const intel = await resolveCodeIntel(filePath, cwd);
  if (!intel) return;

  const xml = formatAsXml(intel, filePath);
  // Empty/insufficient intel → formatAsXml returns null → valid "no context".
  if (!xml) return;

  const output = JSON.stringify({
    hookSpecificOutput: {
      hookEventName: 'PreToolUse',
      additionalContext: xml,
    },
  });
  await writeStdout(output);
}

/** Entry point runner — lets Node exit naturally after stdout flush. */
function run() {
  const timer = setTimeout(() => {
    // Enforce the hard limit even if stdout backpressure leaves handles open.
    process.exit(0);
  }, HOOK_TIMEOUT_MS);
  timer.unref();
  main()
    .then(() => {
      clearTimeout(timer);
      process.exitCode = 0;
    })
    .catch(() => {
      clearTimeout(timer);
      // Silent exit — stderr would surface as a "hook error" in the Claude Code UI.
      process.exitCode = 0;
    });
}

if (require.main === module) run();

module.exports = { readStdin, main, run, HOOK_TIMEOUT_MS };
