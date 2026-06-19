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
 * --check mode (E8 / auditoria-pos-190):
 * Beyond detecting a MISSING block, --check now RECONCILES the declared
 * agents list against the actual `.md` files on disk. It fails (exit 1) when:
 *   - a squad.yaml is missing the components.agents block (needs-update), OR
 *   - the declared list diverges from disk (drift): a declared agent has no
 *     file, or an agent file is not declared.
 * Inline `# comments` after a filename are stripped before comparison, so a
 * `- foo.md  # Persona — Role` entry reconciles cleanly against `foo.md`.
 *
 * Usage:
 *   node scripts/sync-squad-yaml-components.js              # apply changes
 *   node scripts/sync-squad-yaml-components.js --check      # report + reconcile, no write
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

// parseDeclaredAgents extracts the filenames declared under components.agents.
// It tolerates inline `# comments` after each filename (several squad.yaml files
// annotate entries like `- brand-auditor.md  # Sentinel — Guardian`). Returns a
// sorted array of bare filenames, or null if no components.agents block exists.
function parseDeclaredAgents(yamlContent) {
  const lines = yamlContent.split('\n');
  let inAgents = false;
  let found = false;
  const agents = [];
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (!inAgents) {
      if (/^components:\s*$/.test(line)) {
        // scan forward for the agents: sub-key (block style)
        for (let j = i + 1; j < lines.length; j++) {
          if (/^ {2}agents:/.test(lines[j])) {
            inAgents = true;
            found = true;
            i = j; // continue after the agents: header
            break;
          }
          // a new top-level key ends the components: block
          if (/^\S/.test(lines[j]) && !/^\s*#/.test(lines[j])) break;
        }
      }
      continue;
    }
    // Inside the agents list: collect `    - name.md` items, stop at dedent.
    const itemMatch = line.match(/^ {4}-\s*(.+?)\s*$/);
    if (itemMatch) {
      // strip an inline comment (`# ...`) and surrounding quotes/whitespace
      let value = itemMatch[1].replace(/\s+#.*$/, '').trim();
      value = value.replace(/^["']|["']$/g, '').trim();
      if (value) agents.push(value);
      continue;
    }
    // blank line inside the list is tolerated; anything else dedented ends it
    if (line.trim() === '') continue;
    if (!/^ {4}/.test(line)) break;
  }
  if (!found) return null;
  return agents.sort();
}

// reconcileAgents compares the declared list against disk reality.
// Returns { declaredOnly, diskOnly } arrays (empty when in sync).
function reconcileAgents(declared, diskFiles) {
  const declaredSet = new Set(declared);
  const diskSet = new Set(diskFiles);
  return {
    declaredOnly: declared.filter((f) => !diskSet.has(f)), // declared, no file
    diskOnly: diskFiles.filter((f) => !declaredSet.has(f)), // file, not declared
  };
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
    // Block is present — in --check mode, reconcile the declared list vs disk.
    if (CHECK_ONLY) {
      const declared = parseDeclaredAgents(content) || [];
      const { declaredOnly, diskOnly } = reconcileAgents(declared, agents);
      if (declaredOnly.length > 0 || diskOnly.length > 0) {
        return {
          squadName,
          status: 'drift',
          changes: declaredOnly.length + diskOnly.length,
          declaredOnly,
          diskOnly,
        };
      }
    }
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
  let drift = 0;
  let other = 0;
  for (const r of results) {
    if (r.status === 'updated') updated++;
    else if (r.status === 'already-declared') alreadyDeclared++;
    else if (r.status === 'needs-update') needsUpdate++;
    else if (r.status === 'drift') drift++;
    else other++;
  }

  console.log('');
  console.log('Squad YAML components sync');
  console.log('---------------------------');
  for (const r of results) {
    const marker = r.status === 'updated' ? 'UPDATED'
      : r.status === 'needs-update' ? 'NEEDS UPDATE'
        : r.status === 'drift' ? 'DRIFT'
          : r.status === 'already-declared' ? 'ok'
            : r.status.toUpperCase();
    console.log(`  ${marker.padEnd(14)} ${r.squadName} (${r.changes} agent(s))`);
    if (r.status === 'drift') {
      if (r.declaredOnly.length > 0) {
        console.log(`                   declared but no file: ${r.declaredOnly.join(', ')}`);
      }
      if (r.diskOnly.length > 0) {
        console.log(`                   file but not declared: ${r.diskOnly.join(', ')}`);
      }
    }
  }
  console.log('');
  console.log(`Summary: ${alreadyDeclared} already declared, ${updated} updated, ${needsUpdate} need update, ${drift} drift, ${other} other`);

  if (CHECK_ONLY && (needsUpdate > 0 || drift > 0)) {
    console.error('');
    if (needsUpdate > 0) {
      console.error('FAIL: some squad.yaml files are missing components.agents.');
      console.error('Run `node scripts/sync-squad-yaml-components.js` to apply.');
    }
    if (drift > 0) {
      console.error('FAIL: some squad.yaml components.agents lists diverge from disk.');
      console.error('Reconcile the declared list with the actual files in squads/{squad}/agents/.');
    }
    return 1;
  }
  return 0;
}

if (require.main === module) {
  process.exit(run());
}

module.exports = {
  run,
  listSquads,
  listAgentFiles,
  hasComponentsAgents,
  parseDeclaredAgents,
  reconcileAgents,
};
