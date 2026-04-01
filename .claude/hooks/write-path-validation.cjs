#!/usr/bin/env node
'use strict';

/**
 * Hook: Write Path Validation (CJS port)
 *
 * RULE: Documentation files should go to the correct paths per conventions.
 *       This hook WARNS (never blocks) when a doc path looks wrong.
 *
 * Protocol: always exit 0 (warn-only, never blocks).
 *
 * @module write-path-validation
 */

const fs = require('fs');
const path = require('path');

// ---------------------------------------------------------------------------
// Configuration
// ---------------------------------------------------------------------------

const PATH_RULES = [
  {
    namePatterns: [/session/i, /handoff/i, /^2\d{3}-\d{2}-\d{2}/],
    expectedPath: 'docs/sessions/',
    description: 'Session logs e handoffs → docs/sessions/YYYY-MM/',
  },
  {
    namePatterns: [/architecture/i, /system-design/i, /infra/i],
    expectedPath: 'docs/architecture/',
    description: 'Docs de arquitetura → docs/architecture/',
    excludePatterns: [/ARCHITECTURE_RULES/i],
  },
  {
    namePatterns: [/guide/i, /tutorial/i, /how-to/i],
    expectedPath: 'docs/guides/',
    description: 'Guias e tutoriais → docs/guides/',
  },
  {
    namePatterns: [/prd\.md$/i, /epic.*\.md$/i, /story.*\.md$/i],
    expectedPath: 'docs/projects/',
    description: 'PRDs, Epics, Stories → docs/projects/{project}/',
  },
  {
    namePatterns: [/mind.*specific/i, /mind.*validation/i],
    expectedPath: 'outputs/minds/',
    description: 'Docs de mind → outputs/minds/{slug}/docs/',
  },
];

const ALWAYS_VALID = [
  '.claude/', '.sinapse-ai/', '.sinapse-upstream/', 'squads/',
  'node_modules/', '.git/', 'app/', 'supabase/', 'outputs/',
];

const DOC_EXTENSIONS = ['.md', '.mdx', '.txt', '.rst'];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function projectRoot() {
  return process.env.CLAUDE_PROJECT_DIR || process.cwd();
}

function relativize(filePath, root) {
  if (filePath.startsWith(root)) return filePath.slice(root.length).replace(/^[/\\]+/, '');
  return filePath;
}

function isAlwaysValid(rel) {
  return ALWAYS_VALID.some((v) => rel.startsWith(v));
}

function isDocFile(rel) {
  return DOC_EXTENSIONS.some((ext) => rel.endsWith(ext));
}

function checkRules(rel) {
  const filename = path.basename(rel);
  for (const rule of PATH_RULES) {
    const matchesName = rule.namePatterns.some((p) => p.test(filename));
    if (!matchesName) continue;

    if (rule.excludePatterns && rule.excludePatterns.some((p) => p.test(filename))) continue;

    if (!rel.startsWith(rule.expectedPath)) {
      return { currentPath: rel, expectedPath: rule.expectedPath, description: rule.description };
    }
  }
  return null;
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

function main() {
  let input;
  try {
    input = JSON.parse(fs.readFileSync(0, 'utf8'));
  } catch {
    process.exit(0);
  }

  const toolName = input.tool_name || '';
  if (toolName !== 'Write' && toolName !== 'Edit') process.exit(0);

  const filePath = (input.tool_input || {}).file_path || '';
  if (!filePath) process.exit(0);

  const root = projectRoot();
  const rel = relativize(filePath, root);

  if (isAlwaysValid(rel)) process.exit(0);
  if (!isDocFile(rel)) process.exit(0);

  const violation = checkRules(rel);
  if (!violation) process.exit(0);

  // WARN only — never block
  process.stderr.write(
    `\nPATH WARNING: Document may be in the wrong location.\n` +
    `  File:     ${violation.currentPath}\n` +
    `  Expected: ${violation.expectedPath}\n` +
    `  Rule:     ${violation.description}\n` +
    `  NOTE: This is a WARNING only — the operation will proceed.\n`,
  );
  process.exit(0);
}

main();
