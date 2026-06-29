#!/usr/bin/env node

/**
 * validate-all.js
 *
 * Sessao 2 / Categoria 2 / PR 2.2.
 *
 * Runs every push-time lint guard in parallel and aggregates results.
 *
 * Why: the pre-push hook used to chain 6 `npm run` calls sequentially. On a
 * cold cache that's roughly 6 x npm-startup overhead (~3 s each) before the
 * actual check work. Running them as concurrent child processes cuts wall
 * time to ~max(per-check), typically 4-6 s instead of 12-18 s.
 *
 * Each guard runs as an independent child process so a crash in one doesn't
 * affect the others. Output is buffered and printed in a stable order at the
 * end so logs stay readable.
 *
 * The cross-IDE parity check (validate:parity:fast) is intentionally NOT
 * included here — it short-circuits when no agent file changed and is run
 * conditionally by the pre-push hook. Folding it in would force every push
 * to pay its cost.
 *
 * Usage:
 *   npm run validate:all
 *   node scripts/validate-all.js              # equivalent
 *   node scripts/validate-all.js --verbose    # stream child stdout live
 *
 * Exit codes:
 *   0  all guards passed
 *   1  one or more guards failed
 */

'use strict';

const { spawn } = require('child_process');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const VERBOSE = process.argv.includes('--verbose');

const NPM_CMD = process.platform === 'win32' ? 'npm.cmd' : 'npm';

/**
 * Lint guards executed in parallel. Order here is the report order, not
 * execution order — every guard kicks off at the same time.
 */
const GUARDS = [
  { name: 'no-external-refs', script: 'validate:no-external-refs' },
  { name: 'no-personal-leaks', script: 'validate:no-personal-leaks' },
  { name: 'orqx-discipline', script: 'validate:orqx-discipline' },
  { name: 'cross-refs', script: 'validate:cross-refs' },
  { name: 'agents-md', script: 'validate:agents-md' },
  { name: 'manifest:parity', script: 'validate:manifest:parity' },
  { name: 'squad-yaml', script: 'validate:squad-yaml' },
  { name: 'squad-orqx', script: 'validate:squad-orqx' },
  { name: 'agent-codenames', script: 'validate:agent-codenames' },
];

/**
 * Run a single guard and capture its outcome.
 *
 * @param {{ name: string, script: string }} guard
 * @returns {Promise<{ name: string, script: string, code: number, durationMs: number, stdout: string, stderr: string }>}
 */
function runGuard(guard) {
  return new Promise((resolve) => {
    const startedAt = Date.now();
    // shell:true required on Windows so npm.cmd resolves correctly; harmless on POSIX.
    const child = spawn(NPM_CMD, ['run', '--silent', guard.script], {
      cwd: ROOT,
      env: process.env,
      shell: process.platform === 'win32',
    });

    let stdout = '';
    let stderr = '';

    child.stdout.on('data', (chunk) => {
      stdout += chunk.toString();
      if (VERBOSE) process.stdout.write(chunk);
    });
    child.stderr.on('data', (chunk) => {
      stderr += chunk.toString();
      if (VERBOSE) process.stderr.write(chunk);
    });

    child.on('close', (code) => {
      resolve({
        name: guard.name,
        script: guard.script,
        code: code ?? 1,
        durationMs: Date.now() - startedAt,
        stdout,
        stderr,
      });
    });

    child.on('error', (err) => {
      resolve({
        name: guard.name,
        script: guard.script,
        code: 1,
        durationMs: Date.now() - startedAt,
        stdout,
        stderr: stderr + `\n[validate-all] failed to spawn: ${err.message}`,
      });
    });
  });
}

/**
 * Format a result row for the summary table.
 */
function formatRow(result) {
  const status = result.code === 0 ? 'PASS' : 'FAIL';
  const seconds = (result.durationMs / 1000).toFixed(2);
  return `  ${status.padEnd(4)}  ${seconds.padStart(5)}s  ${result.name}`;
}

async function main() {
  const startedAt = Date.now();
  console.log('=== validate-all ===');
  console.log(`Running ${GUARDS.length} lint guard(s) in parallel...`);
  console.log('');

  const results = await Promise.all(GUARDS.map(runGuard));

  const totalSeconds = ((Date.now() - startedAt) / 1000).toFixed(2);
  const failed = results.filter((r) => r.code !== 0);

  console.log('Results:');
  for (const r of results) console.log(formatRow(r));
  console.log('');
  console.log(`Total wall time: ${totalSeconds}s`);

  if (failed.length === 0) {
    console.log('OK — all lint guards passed.');
    process.exit(0);
  }

  console.log('');
  console.log(`${failed.length} guard(s) failed. Output below:`);
  console.log('');

  for (const r of failed) {
    console.log(`──────── ${r.name} (exit ${r.code}) ────────`);
    if (r.stdout.trim()) console.log(r.stdout.trimEnd());
    if (r.stderr.trim()) console.error(r.stderr.trimEnd());
    console.log('');
  }

  process.exit(1);
}

main();
