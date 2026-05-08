#!/usr/bin/env node

/**
 * sync-squad-yaml-components.js
 *
 * Story master-audit-2026-05-06 / Wave 3 / PR-11.
 *
 * Ensures every squad.yaml declares an explicit `components.agents` list
 * matching the actual files in `squads/{squad}/agents/`.
 *
 * Why this exists:
 * Eixo A audit found that 13 of 18 squad.yaml files do NOT declare their
 * agents list. Tooling (installer, validators) cannot trust the manifest;
 * has to walk the filesystem instead. This script adds the missing
 * `components.agents` block based on disk reality, restoring manifest
 * as a reliable source of truth.
 *
 * Usage:
 *   node scripts/sync-squad-yaml-components.js              # apply changes
 *   node scripts/sync-squad-yaml-components.js --check      # report only, no write
 */

'use strict';

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const SQUADS_DIR = path.join(ROOT, 'squads');

const CHECK_ONLY = process.argv.includes('--check');

function listSquads() {
  return fs
    .readdirSync(SQUADS_DIR, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => d.name)
    .sort();
}

function listAgentFiles(squadName) {
  const agentsDir = path.join(SQUADS_DIR, squadName, 'agents');
  if (!fs.existsSync(agentsDir)) return [];
  return fs
    .readdirSync(agentsDir)
    .filter((f) => f.endsWith('.md'))
    .sort();
}

function hasComponentsAgents(yamlContent) {
  // Detect both block style (components:\n  agents:) and inline style (agents: [list]).
  // Look for any "components:" header followed within 30 lines by a line starting
  // with "  agents:" (with or without inline value).
  const lines = yamlContent.split('\n');
  for (let i = 0; i < lines.length; i++) {
    if (/^components:\s*$/.test(lines[i])) {
      for (let j = i + 1; j < Math.min(i + 30, lines.length); j++) {
        if (/^ {2}agents:/.test(lines[j])) return true;
        // Stop searching if we hit a top-level key (no leading space, not blank/comment)
        if (/^\S/.test(lines[j]) && !/^\s*#/.test(lines[j])) break;
      }
    }
  }
  return false;
}

function buildComponentsBlock(agentFiles) {
  const lines = ['', '# ════════════════════════════════════════════════════', '# COMPONENTS — declared agents (synced from filesystem)', '# ════════════════════════════════════════════════════', 'components:', '  agents:'];
  for (const file of agentFiles) {
    lines.push(`    - ${file}`);
  }
  return lines.join('\n') + '\n';
}

function processSquad(squadName) {
  const yamlPath = path.join(SQUADS_DIR, squadName, 'squad.yaml');
  if (!fs.existsSync(yamlPath)) {
    return { squadName, status: 'no-yaml', changes: 0 };
  }
  const content = fs.readFileSync(yamlPath, 'utf8');
  const agents = listAgentFiles(squadName);
  if (agents.length === 0) {
    return { squadName, status: 'no-agents', changes: 0 };
  }
  if (hasComponentsAgents(content)) {
    return { squadName, status: 'already-declared', changes: 0 };
  }
  if (CHECK_ONLY) {
    return { squadName, status: 'needs-update', changes: agents.length };
  }
  const block = buildComponentsBlock(agents);
  const newContent = content.trimEnd() + '\n' + block;
  fs.writeFileSync(yamlPath, newContent, 'utf8');
  return { squadName, status: 'updated', changes: agents.length };
}

function run() {
  const squads = listSquads();
  const results = squads.map(processSquad);
  let updated = 0;
  let alreadyDeclared = 0;
  let needsUpdate = 0;
  let other = 0;
  for (const r of results) {
    if (r.status === 'updated') updated++;
    else if (r.status === 'already-declared') alreadyDeclared++;
    else if (r.status === 'needs-update') needsUpdate++;
    else other++;
  }

  console.log('');
  console.log('Squad YAML components sync');
  console.log('---------------------------');
  for (const r of results) {
    const marker = r.status === 'updated' ? 'UPDATED'
      : r.status === 'needs-update' ? 'NEEDS UPDATE'
      : r.status === 'already-declared' ? 'ok'
      : r.status.toUpperCase();
    console.log(`  ${marker.padEnd(14)} ${r.squadName} (${r.changes} agent(s))`);
  }
  console.log('');
  console.log(`Summary: ${alreadyDeclared} already declared, ${updated} updated, ${needsUpdate} need update, ${other} other`);

  if (CHECK_ONLY && needsUpdate > 0) {
    console.error('');
    console.error('FAIL: some squad.yaml files are missing components.agents.');
    console.error('Run `node scripts/sync-squad-yaml-components.js` to apply.');
    return 1;
  }
  return 0;
}

if (require.main === module) {
  process.exit(run());
}

module.exports = { run, listSquads, listAgentFiles, hasComponentsAgents };
