#!/usr/bin/env node
'use strict';

/**
 * Hook: Enforce Architecture-First Development (CJS port)
 *
 * RULE: Code in protected paths can only be created/edited if prior
 *       architecture documentation exists.
 *
 * Protocol (Claude Code PreToolUse):
 *   exit 0  → allow
 *   exit 2  → block (message shown to model via stderr)
 *
 * Fail-open: if parsing fails or project root is unresolvable, allow.
 *
 * @module enforce-architecture-first
 */

const fs = require('fs');
const path = require('path');

// ---------------------------------------------------------------------------
// Configuration: paths that REQUIRE prior documentation
// ---------------------------------------------------------------------------

const PROTECTED_PATHS = [
  {
    pattern: 'supabase/functions/',
    docPatterns: [
      'docs/architecture/{name}.md',
      'docs/architecture/{name}-architecture.md',
      'docs/approved-plans/{name}.md',
    ],
    extractName(p) {
      const idx = p.indexOf('supabase/functions/');
      if (idx === -1) return null;
      return p.slice(idx + 'supabase/functions/'.length).split('/')[0] || null;
    },
  },
  {
    pattern: 'supabase/migrations/',
    docPatterns: [
      'docs/approved-plans/migration-{name}.md',
      'docs/architecture/database-changes.md',
    ],
    extractName(p) {
      const idx = p.indexOf('supabase/migrations/');
      if (idx === -1) return null;
      return path.basename(p, path.extname(p));
    },
    allowIfExists: true,
  },
];

const ALWAYS_ALLOWED = [
  '.claude/', 'docs/', 'outputs/', 'squads/', '.sinapse-ai/',
  '.sinapse-custom/', 'node_modules/', '.git/',
  'package.json', 'package-lock.json', 'tsconfig.json', '.env', 'README.md',
];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function projectRoot() {
  return process.env.CLAUDE_PROJECT_DIR || process.cwd();
}

function relativize(filePath, root) {
  if (filePath.startsWith(root)) {
    return filePath.slice(root.length).replace(/^[/\\]+/, '');
  }
  return filePath;
}

function isAlwaysAllowed(rel) {
  return ALWAYS_ALLOWED.some((a) => rel.includes(a));
}

function findProtection(rel) {
  return PROTECTED_PATHS.find((p) => rel.includes(p.pattern)) || null;
}

function docExists(rel, protection, root) {
  const name = protection.extractName(rel);
  if (!name) return true;

  for (const dp of protection.docPatterns) {
    const docPath = path.join(root, dp.replace('{name}', name));
    if (fs.existsSync(docPath)) return true;
  }

  if (protection.allowIfExists) {
    const full = path.isAbsolute(rel) ? rel : path.join(root, rel);
    if (fs.existsSync(full)) return true;
  }

  return false;
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

function main() {
  let input;
  try {
    input = JSON.parse(fs.readFileSync(0, 'utf8'));
  } catch {
    process.exit(0); // fail-open
  }

  const toolName = input.tool_name || '';
  if (toolName !== 'Write' && toolName !== 'Edit') {
    process.exit(0);
  }

  const filePath = (input.tool_input || {}).file_path || '';
  if (!filePath) process.exit(0);

  const root = projectRoot();
  const rel = relativize(filePath, root);

  if (isAlwaysAllowed(rel)) process.exit(0);

  const protection = findProtection(rel);
  if (!protection) process.exit(0);

  if (docExists(rel, protection, root)) process.exit(0);

  // BLOCK
  const name = protection.extractName(rel) || 'unknown';
  const accepted = protection.docPatterns.map((d) => `  - ${d.replace('{name}', name)}`).join('\n');

  process.stderr.write(
    `\nARCHITECTURE-FIRST BLOCK: Documentation required before code.\n` +
    `File: ${rel}\n` +
    `Create one of:\n${accepted}\n` +
    `Then retry the operation.\n`,
  );
  process.exit(2);
}

main();
