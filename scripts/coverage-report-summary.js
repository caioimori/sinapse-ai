#!/usr/bin/env node
/**
 * coverage-report-summary — Story 10.25
 *
 * Reads coverage/coverage-summary.json (Jest `json-summary` reporter)
 * and prints a Current vs Floor comparison table to stdout. When run
 * inside GitHub Actions (GITHUB_STEP_SUMMARY env var set), also writes
 * a Markdown table to the job summary file so reviewers see coverage
 * in the PR Checks tab.
 *
 * Always exits 0 — coverage gating is enforced by Jest's
 * coverageThreshold in jest.config.js, not by this script.
 *
 * Usage:
 *   node scripts/coverage-report-summary.js
 *   node scripts/coverage-report-summary.js --json   (JSON output)
 *
 * Reads ratchet floors from jest.config.js coverageThreshold.global.
 */

'use strict';

const fs = require('fs');
const path = require('path');

const PROJECT_ROOT = path.resolve(__dirname, '..');
const SUMMARY_PATH = path.join(PROJECT_ROOT, 'coverage', 'coverage-summary.json');
const JEST_CONFIG_PATH = path.join(PROJECT_ROOT, 'jest.config.js');

function readCoverageSummary(summaryPath = SUMMARY_PATH) {
  if (!fs.existsSync(summaryPath)) {
    return null;
  }
  try {
    const raw = fs.readFileSync(summaryPath, 'utf8');
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function readRatchetFloors(jestConfigPath = JEST_CONFIG_PATH) {
  // We don't require() jest.config.js because Jest itself loads it with
  // its own resolver. Instead we parse it as text and extract the global
  // floors. This avoids running jest at script load time.
  if (!fs.existsSync(jestConfigPath)) {
    return null;
  }
  const raw = fs.readFileSync(jestConfigPath, 'utf8');
  const globalBlockMatch = raw.match(/global:\s*\{([^}]+)\}/);
  if (!globalBlockMatch) return null;
  const block = globalBlockMatch[1];
  const floors = {};
  for (const key of ['statements', 'branches', 'lines', 'functions']) {
    const re = new RegExp(`${key}\\s*:\\s*(\\d+)`);
    const m = block.match(re);
    if (m) floors[key] = Number(m[1]);
  }
  return floors;
}

function buildRows(summary, floors) {
  if (!summary || !summary.total || !floors) return [];
  const total = summary.total;
  const metrics = ['statements', 'branches', 'lines', 'functions'];
  return metrics.map((m) => {
    const actual = total[m] && typeof total[m].pct === 'number' ? total[m].pct : null;
    const floor = typeof floors[m] === 'number' ? floors[m] : null;
    let status = '?';
    if (actual !== null && floor !== null) {
      status = actual >= floor ? 'PASS' : 'FAIL';
    }
    return { metric: m, floor, actual, status };
  });
}

function formatAsciiTable(rows) {
  const header = ['Metric', 'Floor', 'Actual', 'Status'];
  const widths = header.map((h) => h.length);
  for (const r of rows) {
    widths[0] = Math.max(widths[0], r.metric.length);
    widths[1] = Math.max(widths[1], String(r.floor).length + 1); // +1 for %
    widths[2] = Math.max(widths[2], String(r.actual).length + 1);
    widths[3] = Math.max(widths[3], r.status.length);
  }
  const sep = '+' + widths.map((w) => '-'.repeat(w + 2)).join('+') + '+';
  const fmt = (cells) =>
    '| '
    + cells.map((c, i) => String(c).padEnd(widths[i])).join(' | ')
    + ' |';
  const lines = [sep, fmt(header), sep];
  for (const r of rows) {
    lines.push(
      fmt([
        r.metric,
        r.floor === null ? '?' : `${r.floor}%`,
        r.actual === null ? '?' : `${r.actual}%`,
        r.status,
      ]),
    );
  }
  lines.push(sep);
  return lines.join('\n');
}

function formatMarkdownTable(rows) {
  const lines = [];
  lines.push('### Coverage Report (Story 10.19 ratchet)');
  lines.push('');
  lines.push('| Metric | Floor | Actual | Status |');
  lines.push('|--------|-------|--------|--------|');
  for (const r of rows) {
    const floorStr = r.floor === null ? '?' : `${r.floor}%`;
    const actualStr = r.actual === null ? '?' : `${r.actual}%`;
    const statusEmoji = r.status === 'PASS' ? '✅' : r.status === 'FAIL' ? '❌' : '❓';
    lines.push(`| ${r.metric} | ${floorStr} | ${actualStr} | ${statusEmoji} |`);
  }
  return lines.join('\n');
}

function appendToGithubSummary(markdown) {
  const target = process.env.GITHUB_STEP_SUMMARY;
  if (!target) return false;
  try {
    fs.appendFileSync(target, markdown + '\n\n', 'utf8');
    return true;
  } catch {
    return false;
  }
}

function main(argv = process.argv.slice(2)) {
  const args = new Set(argv);
  const summary = readCoverageSummary();
  if (!summary) {
    console.log('=== coverage-report-summary ===');
    console.log('No coverage/coverage-summary.json found — run `npm run test:coverage` first.');
    return 0;
  }
  const floors = readRatchetFloors();
  if (!floors) {
    console.log('=== coverage-report-summary ===');
    console.log('Could not parse jest.config.js coverageThreshold.global — skipping comparison.');
    return 0;
  }
  const rows = buildRows(summary, floors);
  if (args.has('--json')) {
    console.log(JSON.stringify({ rows, floors }, null, 2));
    return 0;
  }
  console.log('=== Coverage Report (Story 10.19 ratchet) ===');
  console.log(formatAsciiTable(rows));
  appendToGithubSummary(formatMarkdownTable(rows));
  return 0;
}

if (require.main === module) {
  process.exitCode = main();
}

module.exports = {
  readCoverageSummary,
  readRatchetFloors,
  buildRows,
  formatAsciiTable,
  formatMarkdownTable,
  appendToGithubSummary,
  main,
};
