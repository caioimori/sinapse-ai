#!/usr/bin/env node

/**
 * validate-cross-refs.js
 *
 * Sessao 2 / Categoria 2 / PR 2.1.
 *
 * Lint guard that catches broken cross-references in workflow YAML files.
 * Specifically: every `agent: <id>` reference in a workflow MUST resolve to
 * an actual agent file under `.sinapse-ai/development/agents/`.
 *
 * Why: workflows are descriptive YAMLs that name agents by id. If an agent
 * is renamed, deleted, or its alias drifts, the workflow silently breaks
 * and the failure only surfaces at runtime (or never, if the workflow path
 * is rarely exercised). This script catches it at lint time.
 *
 * Scope (intentionally conservative — see audit doc for rationale):
 *   - Reads `.sinapse-ai/development/workflows/*.yaml` files.
 *   - Extracts `agent: <id>` and `agent: "@<id>"` patterns.
 *   - Resolves each id through the agent registry (file ids + aliases).
 *   - Reports unresolved refs.
 *
 * NOT in scope for v1 (avoid false positives):
 *   - `task:` / `template:` / `checklist:` refs (lots of free-text noise)
 *   - `requires:` / `creates:` paths (often runtime-generated artifacts)
 *   - Doc-style references inside agent .md files
 *
 * Exit codes:
 *   0  no broken refs
 *   1  one or more broken refs detected
 */

'use strict';

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const WORKFLOWS_DIR = path.join(ROOT, '.sinapse-ai', 'development', 'workflows');
const AGENTS_DIR = path.join(ROOT, '.sinapse-ai', 'development', 'agents');

/**
 * Reserved pseudo-agents that workflows are allowed to reference even though
 * no actual agent file exists. These represent automated steps with no human
 * or AI owner (e.g., a verdict-check evaluator inside the qa-loop).
 */
const PSEUDO_AGENTS = new Set(['system']);

// ─────────────────────────────────────────────────────────────────────────────
// AGENT REGISTRY
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Build the set of valid agent ids by scanning agent .md files.
 * Each file contributes its filename-derived id plus any explicit `id:` and
 * `aliases:` entries declared in the file front-matter / yaml block.
 *
 * @returns {{ ids: Set<string>, byFile: Map<string, string[]> }}
 */
function buildAgentRegistry() {
  const ids = new Set();
  const byFile = new Map();

  if (!fs.existsSync(AGENTS_DIR)) {
    return { ids, byFile };
  }

  const entries = fs.readdirSync(AGENTS_DIR, { withFileTypes: true });

  for (const entry of entries) {
    if (!entry.isFile() || !entry.name.endsWith('.md')) continue;

    const filename = entry.name;
    const fileId = filename.replace(/\.md$/, '');
    const filePath = path.join(AGENTS_DIR, filename);
    const fileIds = [fileId];

    ids.add(fileId);

    // Parse `id:` and `aliases:` from the file
    try {
      const content = fs.readFileSync(filePath, 'utf-8');

      // id: snps-orqx
      const idMatches = content.matchAll(/^\s*id:\s*([a-zA-Z0-9_-]+)\s*$/gm);
      for (const m of idMatches) {
        ids.add(m[1]);
        if (!fileIds.includes(m[1])) fileIds.push(m[1]);
      }

      // aliases: [foo, bar]   OR   aliases:\n  - foo\n  - bar
      const inlineAliases = content.match(/^\s*aliases:\s*\[([^\]]+)\]/m);
      if (inlineAliases) {
        const list = inlineAliases[1].split(',').map((s) => s.trim().replace(/['"]/g, ''));
        for (const alias of list) {
          if (alias) {
            ids.add(alias);
            if (!fileIds.includes(alias)) fileIds.push(alias);
          }
        }
      }

      const blockAliases = content.match(/^\s*aliases:\s*\n((?:\s*-\s*[a-zA-Z0-9_-]+\s*\n)+)/m);
      if (blockAliases) {
        const list = blockAliases[1].split('\n').map((s) => s.trim().replace(/^-\s*/, ''));
        for (const alias of list) {
          if (alias) {
            ids.add(alias);
            if (!fileIds.includes(alias)) fileIds.push(alias);
          }
        }
      }
    } catch {
      // ignore parse failures
    }

    byFile.set(filename, fileIds);
  }

  return { ids, byFile };
}

// ─────────────────────────────────────────────────────────────────────────────
// WORKFLOW SCAN
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Scan a single workflow file for `agent: <id>` references.
 *
 * @param {string} filePath
 * @returns {Array<{ line: number, raw: string, id: string }>}
 */
function extractAgentRefs(filePath) {
  const refs = [];
  const content = fs.readFileSync(filePath, 'utf-8');
  const lines = content.split('\n');

  // Match `agent: foo` or `agent: "@foo"` or `agent: '@foo'`
  // Skip lines inside ``` fenced blocks (mermaid diagrams, examples).
  let inFence = false;
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (/^\s*```/.test(line)) {
      inFence = !inFence;
      continue;
    }
    if (inFence) continue;

    const m = line.match(/^\s*agent:\s*['"]?@?([a-zA-Z0-9_-]+)['"]?\s*(?:#.*)?$/);
    if (m) {
      refs.push({ line: i + 1, raw: line.trim(), id: m[1] });
    }
  }

  return refs;
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN
// ─────────────────────────────────────────────────────────────────────────────

function main() {
  const { ids: validIds } = buildAgentRegistry();

  if (validIds.size === 0) {
    console.error('❌ No agent files found under .sinapse-ai/development/agents/');
    console.error('   Cannot validate cross-refs without an agent registry.');
    process.exit(1);
  }

  if (!fs.existsSync(WORKFLOWS_DIR)) {
    console.log('ℹ️  No workflows directory found — skipping cross-refs check.');
    process.exit(0);
  }

  const workflowFiles = fs
    .readdirSync(WORKFLOWS_DIR)
    .filter((f) => f.endsWith('.yaml') || f.endsWith('.yml'));

  const broken = [];
  let scannedCount = 0;
  let refCount = 0;

  for (const filename of workflowFiles) {
    const filePath = path.join(WORKFLOWS_DIR, filename);
    const refs = extractAgentRefs(filePath);
    scannedCount += 1;
    refCount += refs.length;

    for (const ref of refs) {
      if (PSEUDO_AGENTS.has(ref.id)) continue;
      if (!validIds.has(ref.id)) {
        broken.push({
          file: path.relative(ROOT, filePath),
          line: ref.line,
          id: ref.id,
          raw: ref.raw,
        });
      }
    }
  }

  console.log('=== validate-cross-refs ===');
  console.log(
    `Scanned ${scannedCount} workflow file(s), ${refCount} agent ref(s), ${validIds.size} known agent id(s).`,
  );

  if (broken.length === 0) {
    console.log('OK — every agent ref resolves to a known agent id.');
    process.exit(0);
  }

  console.error(`❌ ${broken.length} broken cross-ref(s):`);
  for (const b of broken) {
    console.error(`  ${b.file}:${b.line}  agent: ${b.id}  (no matching agent file)`);
  }
  console.error('');
  console.error('Fix by either:');
  console.error('  1. Renaming the workflow ref to a valid agent id, or');
  console.error('  2. Adding the missing agent under .sinapse-ai/development/agents/, or');
  console.error('  3. Adding the id as an alias in an existing agent definition.');
  process.exit(1);
}

main();
