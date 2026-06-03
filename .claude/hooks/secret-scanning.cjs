#!/usr/bin/env node
'use strict';

/**
 * Hook: Secret Scanning
 *
 * RULE: Detect and block potential secrets/credentials from being written to files.
 *
 * Protocol (Claude Code PreToolUse):
 *   exit 0  → allow
 *   exit 2  → block (message shown to model via stderr)
 *
 * fail-CLOSED: if the scanner cannot load or stdin cannot be parsed, BLOCK
 * (exit 2) rather than silently allowing an unscanned write.
 *
 * Detection logic is shared with the git pre-commit scanner via
 * bin/utils/secret-scanner-core.js (20+ named patterns + Shannon-entropy
 * backstop + placeholder allowlist + lockfile-hash allowlist + redaction).
 *
 * @module secret-scanning
 */

const fs = require('fs');
const path = require('path');

// ---------------------------------------------------------------------------
// Shared detection core (single source of truth for patterns + entropy)
// ---------------------------------------------------------------------------

let core;
try {
  // Hook lives at <root>/.claude/hooks/; core lives at <root>/bin/utils/.
  core = require(path.join(__dirname, '..', '..', 'bin', 'utils', 'secret-scanner-core.js'));
} catch (err) {
  // fail-CLOSED: cannot scan → do not allow the write.
  process.stderr.write(
    '\nSECRET SCANNING BLOCK: scanner failed to load (fail-closed).\n' +
    String(err && err.message ? err.message : err) + '\n',
  );
  process.exit(2);
}

const { scanContent } = core;

/** Files that are expected to contain secret-like patterns */
const EXEMPT_PATHS = [
  '.env.example', '.env.template', '.env.sample',
  'node_modules/', '.git/',
  '.claude/hooks/',       // Hook scripts may reference patterns
  'test/', 'tests/', '__tests__/',
  '.sinapse-ai/core/',    // Framework core may have validators
];

/** File extensions to scan */
const SCANNABLE_EXTENSIONS = [
  '.ts', '.tsx', '.js', '.jsx', '.cjs', '.mjs',
  '.json', '.yaml', '.yml', '.toml',
  '.env', '.sh', '.bash', '.py',
  '.md', '.txt', '.cfg', '.conf', '.ini',
];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function projectRoot() {
  return process.env.CLAUDE_PROJECT_DIR || process.cwd();
}

function relativize(filePath, root) {
  const normalized = filePath.replace(/\\/g, '/');
  const normalizedRoot = root.replace(/\\/g, '/');
  if (normalized.startsWith(normalizedRoot)) {
    return normalized.slice(normalizedRoot.length).replace(/^\/+/, '');
  }
  return normalized;
}

function isExempt(rel) {
  return EXEMPT_PATHS.some((ep) => rel.includes(ep));
}

function isScannable(rel) {
  return SCANNABLE_EXTENSIONS.some((ext) => rel.endsWith(ext));
}

function scanForSecrets(content, filePath) {
  // Delegates to the shared, hardened core. Returns redacted findings.
  return scanContent(content, { filePath: filePath || '' });
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

function main() {
  let input;
  try {
    input = JSON.parse(fs.readFileSync(0, 'utf8'));
  } catch {
    // fail-CLOSED: unparseable hook input → block rather than allow blindly.
    process.stderr.write('\nSECRET SCANNING BLOCK: could not parse hook input (fail-closed).\n');
    process.exit(2);
  }

  const toolName = input.tool_name || '';
  if (toolName !== 'Write' && toolName !== 'Edit') {
    process.exit(0);
  }

  const toolInput = input.tool_input || {};
  const filePath = toolInput.file_path || '';
  if (!filePath) process.exit(0);

  const root = projectRoot();
  const rel = relativize(filePath, root);

  if (isExempt(rel)) process.exit(0);
  if (!isScannable(rel)) process.exit(0);

  // Scan content being written
  const content = toolInput.content || toolInput.new_string || '';
  if (!content) process.exit(0);

  const findings = scanForSecrets(content, rel);
  if (findings.length === 0) process.exit(0);

  // BLOCK — secrets are reported REDACTED (the core never returns raw values).
  const lines = findings.map((f) => {
    const ent = f.entropy ? ` (entropy ${f.entropy})` : '';
    return `  - ${f.name}: ${f.redacted}${ent}`;
  });
  process.stderr.write(
    `\nSECRET SCANNING BLOCK: Potential secrets detected!\n` +
    `File: ${rel}\n` +
    `Found:\n${lines.join('\n')}\n` +
    `\n` +
    `DO NOT commit secrets to code. Instead:\n` +
    `  - Use environment variables (.env) for local dev\n` +
    `  - Use .env.example with placeholder values for templates\n` +
    `  - Use secret managers for production (Supabase Vault, etc.)\n`,
  );
  process.exit(2);
}

main();
