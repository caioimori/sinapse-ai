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
 * Fail-open: if parsing fails, allow.
 *
 * @module secret-scanning
 */

const fs = require('fs');
const path = require('path');

// ---------------------------------------------------------------------------
// Secret Patterns — ordered by severity
// ---------------------------------------------------------------------------

const SECRET_PATTERNS = [
  // API Keys & Tokens
  { name: 'AWS Access Key', pattern: /AKIA[0-9A-Z]{16}/ },
  { name: 'AWS Secret Key', pattern: /(?:aws_secret_access_key|secret_key)\s*[=:]\s*['"]?[A-Za-z0-9/+=]{40}['"]?/i },
  { name: 'GitHub Token', pattern: /gh[ps]_[A-Za-z0-9_]{36,}/ },
  { name: 'GitHub OAuth', pattern: /gho_[A-Za-z0-9_]{36,}/ },
  { name: 'Slack Token', pattern: /xox[bpors]-[0-9]{10,}-[A-Za-z0-9-]+/ },
  { name: 'Stripe Key', pattern: /[sr]k_(live|test)_[A-Za-z0-9]{20,}/ },
  { name: 'OpenAI Key', pattern: /sk-[A-Za-z0-9]{20,}/ },
  { name: 'Anthropic Key', pattern: /sk-ant-[A-Za-z0-9-]{20,}/ },
  { name: 'Supabase Key', pattern: /eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9\.[A-Za-z0-9_-]{50,}/ },
  { name: 'Google API Key', pattern: /AIza[0-9A-Za-z_-]{35}/ },
  { name: 'Vercel Token', pattern: /vercel_[A-Za-z0-9]{20,}/ },

  // Private Keys
  { name: 'RSA Private Key', pattern: /-----BEGIN RSA PRIVATE KEY-----/ },
  { name: 'SSH Private Key', pattern: /-----BEGIN OPENSSH PRIVATE KEY-----/ },
  { name: 'PGP Private Key', pattern: /-----BEGIN PGP PRIVATE KEY BLOCK-----/ },
  { name: 'EC Private Key', pattern: /-----BEGIN EC PRIVATE KEY-----/ },

  // Connection Strings
  { name: 'DB Connection String', pattern: /(?:postgres|mysql|mongodb|redis):\/\/[^:]+:[^@]+@[^/\s]+/i },
  { name: 'Supabase DB URL', pattern: /postgresql:\/\/postgres\.[A-Za-z0-9]+:[^@]+@/i },

  // Generic Patterns (broader, lower confidence)
  { name: 'Hardcoded Password', pattern: /(?:password|passwd|pwd)\s*[=:]\s*['"][^'"]{8,}['"]/i },
  { name: 'Bearer Token', pattern: /[Bb]earer\s+[A-Za-z0-9_\-.]{20,}/ },
  { name: 'Basic Auth', pattern: /[Bb]asic\s+[A-Za-z0-9+/=]{20,}/ },
];

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

function scanForSecrets(content) {
  const findings = [];
  for (const { name, pattern } of SECRET_PATTERNS) {
    if (pattern.test(content)) {
      findings.push(name);
    }
  }
  return findings;
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

  const findings = scanForSecrets(content);
  if (findings.length === 0) process.exit(0);

  // BLOCK
  process.stderr.write(
    `\nSECRET SCANNING BLOCK: Potential secrets detected!\n` +
    `File: ${rel}\n` +
    `Found: ${findings.join(', ')}\n` +
    `\n` +
    `DO NOT commit secrets to code. Instead:\n` +
    `  - Use environment variables (.env) for local dev\n` +
    `  - Use .env.example with placeholder values for templates\n` +
    `  - Use secret managers for production (Supabase Vault, etc.)\n`,
  );
  process.exit(2);
}

main();
