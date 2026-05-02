#!/usr/bin/env node
/**
 * reconcile-squad-manifests.js — fix squad.yaml count fields
 *
 * @story Block 3a (pre-GA hardening)
 *
 * Audit dim-6 (squads) found 10/19 squad manifests with arithmetic
 * drift between declared counts and reality. This script walks every
 * each squads/SQUAD_NAME/squad.yaml, recounts entities on disk, and patches the
 * declared `metadata.{agents,tasks,workflows,knowledge_bases,
 * checklists,templates,preferences,total_files}` fields.
 *
 * Idempotent: rerun is a no-op when everything already aligns.
 */

'use strict';

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const SQUADS_DIR = path.join(ROOT, 'squads');

function countMd(dir, exclude = ['MEMORY.md', 'README.md']) {
  if (!fs.existsSync(dir)) return 0;
  const stack = [dir];
  let count = 0;
  while (stack.length) {
    const current = stack.pop();
    const entries = fs.readdirSync(current, { withFileTypes: true });
    for (const entry of entries) {
      const full = path.join(current, entry.name);
      if (entry.isDirectory()) stack.push(full);
      else if (entry.isFile() && entry.name.endsWith('.md') && !exclude.includes(entry.name)) {
        count += 1;
      }
    }
  }
  return count;
}

function countFiles(dir) {
  if (!fs.existsSync(dir)) return 0;
  const stack = [dir];
  let count = 0;
  while (stack.length) {
    const current = stack.pop();
    const entries = fs.readdirSync(current, { withFileTypes: true });
    for (const entry of entries) {
      const full = path.join(current, entry.name);
      if (entry.isDirectory()) stack.push(full);
      else if (entry.isFile()) count += 1;
    }
  }
  return count;
}

function realCounts(squadDir) {
  return {
    agents: countMd(path.join(squadDir, 'agents')),
    tasks: countMd(path.join(squadDir, 'tasks')),
    workflows: countMd(path.join(squadDir, 'workflows')),
    knowledge_bases: countMd(path.join(squadDir, 'knowledge-base')),
    checklists: countMd(path.join(squadDir, 'checklists')),
    templates: countMd(path.join(squadDir, 'templates')),
    preferences: countMd(path.join(squadDir, 'preferences')),
    total_files: countFiles(squadDir),
  };
}

function patchYamlNumber(content, key, oldValue, newValue) {
  // Match `  key: number` (with leading 2-space indent typical in metadata block)
  const re = new RegExp(`(\\n\\s*${key}:\\s*)${oldValue}(\\s|$)`);
  return content.replace(re, `$1${newValue}$2`);
}

function buildMetricsBlock(real) {
  return `  total_files: ${real.total_files}\n` +
    `  agents: ${real.agents}\n` +
    `  tasks: ${real.tasks}\n` +
    `  workflows: ${real.workflows}\n` +
    `  knowledge_bases: ${real.knowledge_bases}\n` +
    `  checklists: ${real.checklists}\n` +
    `  templates: ${real.templates}\n` +
    `  preferences: ${real.preferences}\n`;
}

function insertMetricsBlock(content, real) {
  // Insert under existing `metadata:` key, preserving any existing fields
  // (created/last_updated/author/tier). Detects metadata block boundary by
  // first non-indented sibling (e.g. `changelog:`).
  const metaMatch = content.match(/\nmetadata:\n/);
  if (!metaMatch) {
    // No metadata block at all — append a new one near the top, after description.
    return content.replace(
      /(\ndescription:[\s\S]*?)(\n[a-z]\w*:\s)/,
      `$1\n\nmetadata:\n${buildMetricsBlock(real)}$2`,
    );
  }

  // Find insertion point inside existing metadata block — just append the
  // missing fields at the end of that block (right before next top-level key).
  const lines = content.split('\n');
  let metadataStart = -1;
  let metadataEnd = -1;
  for (let i = 0; i < lines.length; i += 1) {
    if (lines[i] === 'metadata:') {
      metadataStart = i;
    } else if (metadataStart >= 0 && /^[a-z][\w-]*:/.test(lines[i])) {
      metadataEnd = i;
      break;
    }
  }
  if (metadataEnd < 0) metadataEnd = lines.length;

  const metricsBlockLines = buildMetricsBlock(real).trimEnd().split('\n');
  const before = lines.slice(0, metadataEnd);
  const after = lines.slice(metadataEnd);
  // Trim trailing empty line in `before` to keep formatting tight.
  while (before.length > 0 && before[before.length - 1] === '') before.pop();
  return [...before, ...metricsBlockLines, '', ...after].join('\n');
}

function reconcileFile(yamlPath, squadName) {
  const content = fs.readFileSync(yamlPath, 'utf8');
  const squadDir = path.dirname(yamlPath);
  const real = realCounts(squadDir);

  let next = content;
  const changes = [];
  const missing = [];

  for (const [key, value] of Object.entries(real)) {
    const declaredMatch = next.match(new RegExp(`\\n\\s*${key}:\\s*(\\d+)`));
    if (!declaredMatch) {
      missing.push(key);
      continue;
    }
    const declared = parseInt(declaredMatch[1], 10);
    if (declared !== value) {
      next = patchYamlNumber(next, key, declared, value);
      changes.push(`  ${key}: ${declared} → ${value}`);
    }
  }

  // Insert any fields that were entirely missing from the metadata block.
  if (missing.length === Object.keys(real).length) {
    // Whole metrics block absent — insert at once.
    next = insertMetricsBlock(next, real);
    changes.push(`  [inserted] entire metrics block (${missing.length} fields)`);
  } else if (missing.length > 0) {
    // Partial fields missing — append at end of metadata block individually.
    for (const key of missing) {
      const append = `  ${key}: ${real[key]}\n`;
      // Insert the line after the last metadata line found.
      const lines = next.split('\n');
      let metadataStart = -1;
      let metadataEnd = -1;
      for (let i = 0; i < lines.length; i += 1) {
        if (lines[i] === 'metadata:') metadataStart = i;
        else if (metadataStart >= 0 && /^[a-z][\w-]*:/.test(lines[i])) {
          metadataEnd = i;
          break;
        }
      }
      if (metadataEnd < 0) metadataEnd = lines.length;
      lines.splice(metadataEnd, 0, append.trimEnd());
      next = lines.join('\n');
      changes.push(`  [added] ${key}: ${real[key]}`);
    }
  }

  if (next !== content) {
    fs.writeFileSync(yamlPath, next);
    return { squadName, changed: true, changes, real };
  }
  return { squadName, changed: false, changes: [], real };
}

function main() {
  if (!fs.existsSync(SQUADS_DIR)) {
    console.error('squads/ directory not found');
    process.exit(1);
  }

  const squadDirs = fs.readdirSync(SQUADS_DIR, { withFileTypes: true })
    .filter((e) => e.isDirectory())
    .map((e) => e.name);

  let totalChanged = 0;
  let totalSquads = 0;

  for (const squadName of squadDirs) {
    const yamlPath = path.join(SQUADS_DIR, squadName, 'squad.yaml');
    if (!fs.existsSync(yamlPath)) continue;
    totalSquads += 1;
    const result = reconcileFile(yamlPath, squadName);
    if (result.changed) {
      totalChanged += 1;
      console.log(`✏️  ${squadName}`);
      result.changes.filter((c) => !c.startsWith('  [missing]')).forEach((c) => console.log(c));
    } else if (result.changes.length > 0) {
      console.log(`ℹ️  ${squadName} (no patch — fields missing, manual add required)`);
      result.changes.forEach((c) => console.log(c));
    }
  }

  console.log(`\n${totalChanged}/${totalSquads} squad manifests patched.`);
  if (totalChanged === 0) {
    console.log('✅ All manifests already in sync.');
  }
}

if (require.main === module) {
  main();
}

module.exports = { realCounts, reconcileFile };
