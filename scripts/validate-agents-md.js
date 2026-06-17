#!/usr/bin/env node

'use strict';

/**
 * validate-agents-md.js
 *
 * Makes AGENTS.md a self-enforcing single source of truth for the ecosystem
 * counts. The body of AGENTS.md is hand-authored (security rules, agent
 * descriptions, workflows) and stays that way — but the headline counts
 * (squads / agents / task files / resolvable task pointers) MUST match what
 * the parametric activator measures from disk. This guard fails when they
 * drift, which is exactly how AGENTS.md ended up with 3 contradictory numbers
 * (172 / 178 / 185 / 189) across docs before the refino.
 *
 * Truth source: `node .codex/scripts/resolve-codex-agent.js --stats` (measured
 * from disk, never a frozen snapshot).
 *
 * Usage:
 *   node scripts/validate-agents-md.js            # verify (CI / pre-push)
 *   node scripts/validate-agents-md.js --fix      # rewrite the count numbers
 *
 * Exit codes:
 *   0  AGENTS.md counts match disk (or were fixed)
 *   1  drift detected (verify mode) or a parse/IO failure
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const ROOT = path.resolve(__dirname, '..');
const AGENTS_MD = path.join(ROOT, 'AGENTS.md');
const STATS_SCRIPT = path.join(ROOT, '.codex', 'scripts', 'resolve-codex-agent.js');
const FIX = process.argv.includes('--fix');

// Headline count fields: label in AGENTS.md -> key in --stats JSON.
const FIELDS = [
  { label: 'squads', statKey: 'squads', re: /(\d[\d,]*)\s+squads/i },
  { label: 'agents', statKey: 'totalAgents', re: /(\d[\d,]*)\s+agents/i },
  { label: 'task files', statKey: 'totalTaskFiles', re: /(\d[\d,]*)\s+task files/i },
  { label: 'resolvable', statKey: 'resolvableTaskPointers', re: /(\d[\d,]*)\s+resolvable/i },
];

function fail(msg) {
  console.error(`FAIL validate:agents-md — ${msg}`);
  process.exit(1);
}

function readStats() {
  let out;
  try {
    out = execSync(`node "${STATS_SCRIPT}" --stats`, { cwd: ROOT, encoding: 'utf8' });
  } catch (err) {
    fail(`could not run resolve-codex-agent.js --stats: ${err.message}`);
  }
  // The script prints a JSON object; parse defensively in case anything else
  // is written to stdout around it.
  try {
    return JSON.parse(out);
  } catch {
    const match = out.match(/\{[\s\S]*\}/);
    if (!match) fail('resolve-codex-agent.js --stats did not emit JSON');
    try {
      return JSON.parse(match[0]);
    } catch (err) {
      fail(`could not parse --stats JSON: ${err.message}`);
    }
  }
}

function toInt(str) {
  return parseInt(String(str).replace(/,/g, ''), 10);
}

function main() {
  if (!fs.existsSync(AGENTS_MD)) fail('AGENTS.md not found at repo root');

  const stats = readStats();
  let content = fs.readFileSync(AGENTS_MD, 'utf8');

  const mismatches = [];
  let fixed = content;

  for (const field of FIELDS) {
    const expected = stats[field.statKey];
    if (typeof expected !== 'number') {
      fail(`--stats is missing numeric field "${field.statKey}"`);
    }
    const m = content.match(field.re);
    if (!m) {
      mismatches.push(`could not find "<n> ${field.label}" in AGENTS.md`);
      continue;
    }
    const declared = toInt(m[1]);
    if (declared !== expected) {
      mismatches.push(
        `${field.label}: AGENTS.md says ${m[1]}, disk has ${expected.toLocaleString('en-US')}`,
      );
      if (FIX) {
        const replacement = m[0].replace(m[1], expected.toLocaleString('en-US'));
        fixed = fixed.replace(m[0], replacement);
      }
    }
  }

  if (mismatches.length === 0) {
    console.log(
      `OK AGENTS.md counts match disk (${stats.squads} squads, ${stats.totalAgents} agents, ` +
        `${stats.totalTaskFiles} task files, ${stats.resolvableTaskPointers} resolvable).`,
    );
    process.exit(0);
  }

  if (FIX) {
    fs.writeFileSync(AGENTS_MD, fixed, 'utf8');
    console.log('AGENTS.md count(s) rewritten to match disk:');
    for (const mm of mismatches) console.log(`  - ${mm}`);
    process.exit(0);
  }

  console.error('FAIL validate:agents-md — AGENTS.md counts drifted from disk:');
  for (const mm of mismatches) console.error(`  - ${mm}`);
  console.error('Fix: npm run validate:agents-md:fix');
  process.exit(1);
}

main();
