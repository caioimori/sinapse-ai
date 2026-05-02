#!/usr/bin/env node
/**
 * sync-counts.js — keep ecosystem counts honest across docs
 *
 * @story Block 3a (pre-GA hardening)
 *
 * Counts real entities on disk and updates the AUTO-GENERATED block in
 * `.sinapse-ai/constitution.md`. Run via `npm run sync:counts` or
 * automatically through the pre-commit hook when squads/agents change.
 *
 * Why:
 * - Constitution Article VII (Metrics Accuracy) requires exact counts.
 * - Manual counts drift every time a new agent is added.
 * - Block 2 audit (dim-3, dim-6) found constitution declared 18/186/20
 *   while reality was 19/200/22 — exactly the kind of drift this prevents.
 */

'use strict';

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');

function countMatching(dir, predicate) {
  if (!fs.existsSync(dir)) return 0;
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  let count = 0;
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      count += countMatching(full, predicate);
    } else if (predicate(full, entry.name)) {
      count += 1;
    }
  }
  return count;
}

function isMd(filename) {
  return filename.endsWith('.md');
}

function isAgentFile(fullPath, filename) {
  if (!isMd(filename)) return false;
  if (filename === 'MEMORY.md' || filename === 'README.md') return false;
  return fullPath.includes(`${path.sep}agents${path.sep}`);
}

function isTaskFile(fullPath, filename) {
  if (!isMd(filename)) return false;
  return fullPath.includes(`${path.sep}tasks${path.sep}`);
}

function isOrqxFile(_fullPath, filename) {
  return filename.endsWith('-orqx.md');
}

function countSquadDirs() {
  const squadsDir = path.join(ROOT, 'squads');
  if (!fs.existsSync(squadsDir)) return 0;
  return fs.readdirSync(squadsDir, { withFileTypes: true })
    .filter((e) => e.isDirectory())
    .length;
}

function collectCounts() {
  const squadsDir = path.join(ROOT, 'squads');
  const frameworkAgentsDir = path.join(ROOT, '.sinapse-ai', 'development', 'agents');

  const squads = countSquadDirs();
  const squadAgents = countMatching(squadsDir, isAgentFile);
  const frameworkAgents = countMatching(frameworkAgentsDir, isAgentFile);
  const totalAgents = squadAgents + frameworkAgents;
  const tasks = countMatching(squadsDir, isTaskFile);
  const squadOrqx = countMatching(squadsDir, isOrqxFile);
  // Master orqx (sinapse-orqx) lives in squads/sinapse/agents/ as well —
  // counted separately for traceability.
  const totalOrqx = squadOrqx + 1; // +1 for master sinapse-orqx not under squad-X-orqx.md naming

  return {
    squads,
    squadAgents,
    frameworkAgents,
    totalAgents,
    tasks,
    squadOrqx,
    totalOrqx,
    generatedAt: new Date().toISOString(),
  };
}

const BEGIN_MARKER = '<!-- BEGIN AUTO-GENERATED COUNTS (sync via `npm run sync:counts`) -->';
const END_MARKER = '<!-- END AUTO-GENERATED COUNTS -->';

function renderBlock(counts) {
  return `${BEGIN_MARKER}
- **${counts.squads} squads** (diretórios em \`squads/\`)
- **${counts.totalAgents} agentes** (${counts.squadAgents} em squads + ${counts.frameworkAgents} framework agents)
- **${counts.totalOrqx} comandos orqx** (${counts.squadOrqx} squad orqx + 1 master sinapse-orqx)
- **${counts.tasks} tasks** (em \`squads/*/tasks/\`)

*Last synced: ${counts.generatedAt}*
${END_MARKER}`;
}

function updateConstitution(counts) {
  const constitutionPath = path.join(ROOT, '.sinapse-ai', 'constitution.md');
  const content = fs.readFileSync(constitutionPath, 'utf8');
  const block = renderBlock(counts);

  let next;
  if (content.includes(BEGIN_MARKER) && content.includes(END_MARKER)) {
    // Replace existing block in place
    const before = content.split(BEGIN_MARKER)[0];
    const after = content.split(END_MARKER)[1];
    next = before + block + after;
  } else {
    // First-time install — replace the legacy "Números canônicos atuais" block
    const re = /\*\*Números canônicos atuais:\*\*[\s\S]*?(?=\n\*\*Regras:\*\*)/;
    if (!re.test(content)) {
      // No legacy block either — append at end
      next = content + '\n\n' + block + '\n';
    } else {
      next = content.replace(re, `**Números canônicos atuais:**\n\n${block}\n\n`);
    }
  }

  if (next !== content) {
    fs.writeFileSync(constitutionPath, next);
    return true;
  }
  return false;
}

function main() {
  const counts = collectCounts();
  console.log('Ecosystem counts:');
  console.log(`  squads             ${counts.squads}`);
  console.log(`  squad agents       ${counts.squadAgents}`);
  console.log(`  framework agents   ${counts.frameworkAgents}`);
  console.log(`  TOTAL agents       ${counts.totalAgents}`);
  console.log(`  squad orqx         ${counts.squadOrqx}`);
  console.log(`  TOTAL orqx         ${counts.totalOrqx} (incl. master)`);
  console.log(`  tasks              ${counts.tasks}`);

  const changed = updateConstitution(counts);
  if (changed) {
    console.log('\n✅ constitution.md updated with current counts.');
  } else {
    console.log('\n✅ constitution.md already in sync.');
  }
}

if (require.main === module) {
  main();
}

module.exports = { collectCounts, updateConstitution, renderBlock, BEGIN_MARKER, END_MARKER };
