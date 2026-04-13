#!/usr/bin/env node
/**
 * release-readiness — Story 10.29
 *
 * Aggregates every validator and quality gate built throughout Epic 10.0
 * into one release-readiness report. Run before opening a release PR or
 * tagging v10.0.0 to confirm the framework is shippable.
 *
 * Validators executed (in order):
 *   1. lint              — npm run lint
 *   2. typecheck         — npm run typecheck
 *   3. agents            — npm run validate:agents
 *   4. squad-orqx        — npm run validate:squad-orqx     (Story 10.28)
 *   5. story-meta        — npm run validate:story-meta     (Story 10.19)
 *   6. no-external-refs  — npm run validate:no-external-refs (Story 10.17)
 *   7. parity            — npm run validate:parity         (Story 10.18)
 *   8. manifest          — npm run validate:manifest
 *   9. install-docs      — npm run validate:docs
 *
 * Each gate runs in its own subprocess. Failures are reported but do NOT
 * short-circuit — the script always runs every gate so the operator sees
 * the full picture in one pass.
 *
 * Exit codes:
 *   0  every gate passed
 *   1  one or more gates failed (per-gate detail in the summary table)
 *
 * Usage:
 *   node scripts/release-readiness.js
 *   node scripts/release-readiness.js --json
 *   node scripts/release-readiness.js --quiet
 */

'use strict';

const path = require('path');
const { spawnSync } = require('child_process');

const PROJECT_ROOT = path.resolve(__dirname, '..');

const GATES = [
  { id: 'lint', name: 'ESLint', cmd: ['npm', 'run', 'lint', '--silent'] },
  { id: 'typecheck', name: 'TypeScript', cmd: ['npm', 'run', 'typecheck', '--silent'] },
  { id: 'agents', name: 'Core agents', cmd: ['npm', 'run', 'validate:agents', '--silent'] },
  { id: 'story-meta', name: 'Story meta (10.19)', cmd: ['npm', 'run', 'validate:story-meta', '--silent'] },
  { id: 'no-external-refs', name: 'External refs (10.17)', cmd: ['npm', 'run', 'validate:no-external-refs', '--silent'] },
  { id: 'parity', name: 'Cross-IDE parity (10.18)', cmd: ['npm', 'run', 'validate:parity', '--silent'] },
  { id: 'manifest', name: 'Install manifest', cmd: ['npm', 'run', 'validate:manifest', '--silent'] },
  { id: 'install-docs', name: 'Install docs', cmd: ['npm', 'run', 'validate:docs', '--silent'] },
];

function parseArgs(argv = process.argv.slice(2)) {
  const args = new Set(argv);
  return {
    json: args.has('--json'),
    quiet: args.has('--quiet') || args.has('-q'),
  };
}

function runGate(gate) {
  const start = Date.now();
  const result = spawnSync(gate.cmd[0], gate.cmd.slice(1), {
    cwd: PROJECT_ROOT,
    encoding: 'utf8',
    shell: process.platform === 'win32',
  });
  const elapsed = Date.now() - start;
  return {
    id: gate.id,
    name: gate.name,
    status: result.status === 0 ? 'PASS' : 'FAIL',
    exitCode: result.status,
    elapsedMs: elapsed,
    stderr: result.stderr ? result.stderr.split('\n').slice(-5).join('\n') : '',
  };
}

function runAllGates(gates = GATES) {
  return gates.map((g) => runGate(g));
}

function summarize(results) {
  return {
    total: results.length,
    pass: results.filter((r) => r.status === 'PASS').length,
    fail: results.filter((r) => r.status === 'FAIL').length,
    elapsedMs: results.reduce((sum, r) => sum + r.elapsedMs, 0),
  };
}

function formatTable(results) {
  const lines = [];
  const widths = [22, 8, 8, 6];
  const sep = '+' + widths.map((w) => '-'.repeat(w + 2)).join('+') + '+';
  lines.push(sep);
  lines.push(
    '| '
    + 'Gate'.padEnd(widths[0])
    + ' | '
    + 'Status'.padEnd(widths[1])
    + ' | '
    + 'Time'.padEnd(widths[2])
    + ' | '
    + 'Exit'.padEnd(widths[3])
    + ' |',
  );
  lines.push(sep);
  for (const r of results) {
    lines.push(
      '| '
      + r.name.padEnd(widths[0])
      + ' | '
      + r.status.padEnd(widths[1])
      + ' | '
      + `${r.elapsedMs}ms`.padEnd(widths[2])
      + ' | '
      + String(r.exitCode).padEnd(widths[3])
      + ' |',
    );
  }
  lines.push(sep);
  return lines.join('\n');
}

function main(argv = process.argv.slice(2)) {
  const args = parseArgs(argv);
  if (!args.quiet && !args.json) {
    console.log('=== release-readiness ===');
    console.log('Running all release gates (this can take a few minutes)...');
    console.log('');
  }
  const results = runAllGates();
  const summary = summarize(results);

  if (args.json) {
    console.log(JSON.stringify({ results, summary }, null, 2));
  } else if (!args.quiet) {
    console.log(formatTable(results));
    console.log('');
    console.log(
      `Summary: ${summary.total} gates — ${summary.pass} pass, ${summary.fail} fail (${summary.elapsedMs}ms total)`,
    );
    if (summary.fail > 0) {
      console.log('');
      console.log('Failed gates (last 5 lines of stderr):');
      for (const r of results.filter((x) => x.status === 'FAIL')) {
        console.log(`\n--- ${r.name} ---`);
        console.log(r.stderr || '(no stderr)');
      }
    }
  }

  return summary.fail > 0 ? 1 : 0;
}

if (require.main === module) {
  process.exitCode = main();
}

module.exports = {
  parseArgs,
  GATES,
  runGate,
  runAllGates,
  summarize,
  formatTable,
  main,
};
