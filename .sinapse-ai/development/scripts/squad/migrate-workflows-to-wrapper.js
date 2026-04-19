#!/usr/bin/env node
/**
 * migrate-workflows-to-wrapper.js
 *
 * One-shot migrator that wraps flat squad workflow YAMLs under the canonical
 * `workflow:` root required by `.sinapse-ai/development/scripts/workflow-validator.js`.
 *
 * Shape transformation (flat → wrapped):
 *   Before: `name: foo` + `phases: [...]` at root
 *   After:  `workflow: { id: <slug>, name: foo, phases: [...], sequence: [...] }`
 *
 * Rules:
 * - Idempotent: files that already have a top-level `workflow:` key are skipped.
 * - `workflow.id` is derived from filename slug (kebab-case, extension stripped) if absent.
 * - `phases` is preserved; a matching `sequence` alias is added so the validator
 *   reads the canonical execution contract without losing backward compat.
 * - Per-squad backup at `<squad>/.backup/pre-workflow-wrap-<ISO>/` before writing.
 *
 * Usage:
 *   node .sinapse-ai/development/scripts/squad/migrate-workflows-to-wrapper.js [--dry-run] [--path squads]
 *
 * @module migrate-workflows-to-wrapper
 * @see Story 10.43 — HYBRID migration for workflow.id / workflow: wrapper contract
 */

'use strict';

const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');

const args = process.argv.slice(2);
const DRY_RUN = args.includes('--dry-run');
const pathFlag = args.indexOf('--path');
const ROOT = pathFlag !== -1 && args[pathFlag + 1]
  ? path.resolve(args[pathFlag + 1])
  : path.resolve(process.cwd(), 'squads');

/**
 * Find all workflow YAML files under <root>/<squad>/workflows/
 * @param {string} root
 * @returns {string[]}
 */
function findWorkflowFiles(root) {
  if (!fs.existsSync(root)) return [];
  const out = [];
  for (const squad of fs.readdirSync(root)) {
    const wfDir = path.join(root, squad, 'workflows');
    if (!fs.existsSync(wfDir) || !fs.statSync(wfDir).isDirectory()) continue;
    for (const f of fs.readdirSync(wfDir)) {
      if (f.endsWith('.yaml') || f.endsWith('.yml')) {
        out.push(path.join(wfDir, f));
      }
    }
  }
  return out;
}

/**
 * Derive an id from the filename (kebab-case slug, no extension).
 * @param {string} filePath
 * @returns {string}
 */
function slugFromFilename(filePath) {
  return path.basename(filePath).replace(/\.(yaml|yml)$/i, '');
}

/**
 * Decide whether a parsed workflow doc needs wrapping.
 * @param {*} doc
 * @returns {boolean}
 */
function needsWrap(doc) {
  if (!doc || typeof doc !== 'object') return false;
  // Already canonical shape
  if (doc.workflow && typeof doc.workflow === 'object') return false;
  return true;
}

/**
 * Build the wrapped representation from a flat doc.
 * @param {Object} flat - Parsed flat YAML
 * @param {string} derivedId - Fallback id from filename
 * @returns {Object} Wrapped doc: { workflow: { ... } }
 */
function wrap(flat, derivedId) {
  // Extract canonical workflow fields (if present at root) into the wrapper,
  // and keep any non-canonical extras at root too (non-destructive).
  const canonicalKeys = new Set([
    'id', 'name', 'description', 'version', 'type', 'orchestrator',
    'sequence', 'phases', 'handoff_prompts', 'flow_diagram',
    'trigger', 'input', 'outputs', 'success_criteria', 'agents',
  ]);

  const wf = {};
  const rest = {};
  for (const [k, v] of Object.entries(flat)) {
    if (canonicalKeys.has(k)) {
      wf[k] = v;
    } else {
      rest[k] = v;
    }
  }

  if (!wf.id) wf.id = derivedId;
  // Alias phases → sequence if sequence absent (keeps phases for legacy readers)
  if (!Array.isArray(wf.sequence) && Array.isArray(wf.phases)) {
    wf.sequence = wf.phases;
  }

  return { ...rest, workflow: wf };
}

/**
 * Create a timestamped backup of a single file, mirroring the squad-migrator
 * backup discipline but scoped to per-file operation.
 * @param {string} filePath
 * @param {string} timestamp
 */
function backupFile(filePath, timestamp) {
  const workflowsDir = path.dirname(filePath);
  const squadDir = path.dirname(workflowsDir);
  const backupDir = path.join(squadDir, '.backup', `pre-workflow-wrap-${timestamp}`, 'workflows');
  fs.mkdirSync(backupDir, { recursive: true });
  const dest = path.join(backupDir, path.basename(filePath));
  fs.copyFileSync(filePath, dest);
  return dest;
}

function main() {
  const files = findWorkflowFiles(ROOT);
  if (files.length === 0) {
    console.log(`[migrate-workflows] No workflow files found under ${ROOT}`);
    return;
  }

  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const summary = { total: files.length, wrapped: 0, skipped: 0, errors: 0 };

  for (const file of files) {
    try {
      const raw = fs.readFileSync(file, 'utf-8');
      const doc = yaml.load(raw);

      if (!needsWrap(doc)) {
        summary.skipped++;
        if (DRY_RUN) console.log(`SKIP  (already wrapped) ${file}`);
        continue;
      }

      const derivedId = slugFromFilename(file);
      const wrapped = wrap(doc, derivedId);

      if (DRY_RUN) {
        console.log(`WRAP  ${file}  → workflow.id=${wrapped.workflow.id}`);
        summary.wrapped++;
        continue;
      }

      // Real write: backup, then serialize. Use lineWidth -1 to avoid line folding
      // damaging long single-line strings; noRefs avoids yaml anchors.
      backupFile(file, timestamp);
      const out = yaml.dump(wrapped, { lineWidth: -1, noRefs: true, quotingType: '"' });
      fs.writeFileSync(file, out, 'utf-8');
      console.log(`WRAP  ${file}  → workflow.id=${wrapped.workflow.id}`);
      summary.wrapped++;
    } catch (err) {
      summary.errors++;
      console.error(`ERROR ${file}: ${err.message}`);
    }
  }

  console.log('\n[migrate-workflows] Summary');
  console.log(`  total:   ${summary.total}`);
  console.log(`  wrapped: ${summary.wrapped}`);
  console.log(`  skipped: ${summary.skipped}`);
  console.log(`  errors:  ${summary.errors}`);
  console.log(`  mode:    ${DRY_RUN ? 'dry-run' : 'write'}`);
  if (!DRY_RUN && summary.wrapped > 0) {
    console.log(`  backup:  <squad>/.backup/pre-workflow-wrap-${timestamp}/`);
  }

  if (summary.errors > 0) process.exit(1);
}

if (require.main === module) {
  main();
}

module.exports = { findWorkflowFiles, needsWrap, wrap, slugFromFilename };
