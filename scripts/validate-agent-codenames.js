#!/usr/bin/env node
/**
 * validate-agent-codenames — AuditFinding AF-20260629 #32
 *
 * Rejects DUPLICATE persona codenames (the `name:` field) shared across two or
 * more DISTINCT agents. A codename is an agent's public identity (Pixel, Litmus,
 * Meridian, ...); two unrelated agents answering to the same codename is a
 * collision that confuses routing, selos and the agent badges.
 *
 * Scope (sources scanned):
 *   - squads/{squad}/agents/*.md      (squad specialists + orqx)
 *   - sinapse/agents/*.md             (master squad)
 *   - .sinapse-ai/development/agents/*.md (framework core agents)
 *
 * Codename extraction: the FIRST quoted `name: "X"` in the file. In every agent
 * format the persona block sits at the top, so the first quoted name is the
 * codename — knowledge-base `name:` entries (mental models, frameworks) appear
 * far below and are intentionally ignored. Files with no quoted `name:` (table /
 * frontmatter-only formats) are skipped — there is no codename to compare.
 *
 * Allow-list: the master orchestrator (Imperator) is intentionally registered
 * under multiple entry-point files (snps-orqx / sinapse-orqx) — same logical
 * agent, dual register (Constitution Article XI). It is NOT a collision.
 *
 * Exit codes:
 *   0  every codename is unique (modulo the allow-list)
 *   1  one or more codenames are shared by distinct agents
 *
 * Usage:
 *   node scripts/validate-agent-codenames.js
 *   node scripts/validate-agent-codenames.js --json
 *   node scripts/validate-agent-codenames.js --quiet
 */

'use strict';

const fs = require('fs');
const path = require('path');

const PROJECT_ROOT = path.resolve(__dirname, '..');

// Source directories that hold agent definition files.
const AGENT_DIRS = [
  path.join(PROJECT_ROOT, 'sinapse', 'agents'),
  path.join(PROJECT_ROOT, '.sinapse-ai', 'development', 'agents'),
];
const SQUADS_DIR = path.join(PROJECT_ROOT, 'squads');

// Codenames allowed to appear in more than one file because they are the SAME
// logical agent registered under multiple alias files (dual register).
const ALLOWED_DUPLICATES = new Set(['Imperator']);

// Non-agent markdown that may live in an agents/ dir.
const SKIP_FILES = new Set(['README.md', 'MEMORY.md']);

function parseArgs(argv = process.argv.slice(2)) {
  const args = new Set(argv);
  return { quiet: args.has('--quiet') || args.has('-q'), json: args.has('--json') };
}

function isAgentFile(fileName) {
  return (
    fileName.endsWith('.md') &&
    !SKIP_FILES.has(fileName) &&
    !fileName.startsWith('_')
  );
}

function collectAgentDirs() {
  const dirs = [...AGENT_DIRS];
  if (fs.existsSync(SQUADS_DIR)) {
    for (const entry of fs.readdirSync(SQUADS_DIR, { withFileTypes: true })) {
      if (!entry.isDirectory()) continue;
      const agentsDir = path.join(SQUADS_DIR, entry.name, 'agents');
      if (fs.existsSync(agentsDir)) dirs.push(agentsDir);
    }
  }
  return dirs;
}

/**
 * Extract the agent codename: the first quoted `name: "X"` in the file.
 * @returns {string|null}
 */
function extractCodename(content) {
  const match = content.match(/^\s*name:\s*"([^"]+)"\s*$/m);
  return match ? match[1].trim() : null;
}

function collectCodenames() {
  const byName = new Map(); // codename -> [relPath, ...]
  for (const dir of collectAgentDirs()) {
    let files;
    try {
      files = fs.readdirSync(dir).filter(isAgentFile);
    } catch {
      continue;
    }
    for (const file of files) {
      const filePath = path.join(dir, file);
      let content;
      try {
        content = fs.readFileSync(filePath, 'utf8');
      } catch {
        continue;
      }
      const codename = extractCodename(content);
      if (!codename) continue;
      const relPath = path.relative(PROJECT_ROOT, filePath).replace(/\\/g, '/');
      if (!byName.has(codename)) byName.set(codename, []);
      byName.get(codename).push(relPath);
    }
  }
  return byName;
}

function findCollisions(byName) {
  const collisions = [];
  for (const [codename, files] of byName) {
    if (files.length > 1 && !ALLOWED_DUPLICATES.has(codename)) {
      collisions.push({ codename, files: files.sort() });
    }
  }
  return collisions.sort((a, b) => a.codename.localeCompare(b.codename));
}

function formatReport(byName, collisions) {
  const lines = [];
  const totalAgents = [...byName.values()].reduce((n, f) => n + f.length, 0);
  lines.push(`Scanned ${totalAgents} agent file(s) with a codename; ${byName.size} distinct codename(s).`);
  if (collisions.length === 0) {
    lines.push('OK — every codename is unique (master dual-register allow-listed).');
    return lines.join('\n');
  }
  lines.push('');
  lines.push(`FAIL — ${collisions.length} duplicate codename(s) found:`);
  for (const c of collisions) {
    lines.push(`  "${c.codename}" used by ${c.files.length} agents:`);
    for (const f of c.files) lines.push(`    - ${f}`);
  }
  lines.push('');
  lines.push('Fix: rename the least-canonical side to a unique codename.');
  return lines.join('\n');
}

function main() {
  const args = parseArgs();
  const byName = collectCodenames();
  const collisions = findCollisions(byName);

  if (args.json) {
    console.log(JSON.stringify({ collisions, distinct: byName.size }, null, 2));
  } else if (!args.quiet) {
    console.log('=== validate-agent-codenames ===');
    console.log(formatReport(byName, collisions));
  }

  return collisions.length > 0 ? 1 : 0;
}

if (require.main === module) {
  process.exitCode = main();
}

module.exports = {
  parseArgs,
  extractCodename,
  collectAgentDirs,
  collectCodenames,
  findCollisions,
  formatReport,
  main,
  ALLOWED_DUPLICATES,
};
