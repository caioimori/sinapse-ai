#!/usr/bin/env node
'use strict';

/**
 * Hook: Enforce Story Gate — Constitution Article III (Documentation-First)
 *
 * RULE: Code files in implementation paths cannot be created/edited unless
 *       a story exists in docs/stories/ with status >= Ready.
 *
 * Protocol (Claude Code PreToolUse):
 *   exit 0  → allow
 *   exit 2  → block (message shown to model via stderr)
 *
 * Fail-open: if session state is unreadable or story status is indeterminate,
 *            the hook allows the operation (never blocks productive work).
 *
 * @module enforce-story-gate
 */

const fs = require('fs');
const path = require('path');

// ---------------------------------------------------------------------------
// Configuration
// ---------------------------------------------------------------------------

/** Paths that require an active story before code changes. */
const CODE_PATHS = [
  'packages/', 'src/', 'app/', 'lib/', 'bin/',
  'components/', 'pages/', 'api/', 'services/',
];

/** Paths always exempt from story requirement. */
const EXEMPT_PATHS = [
  '.claude/', '.sinapse-ai/', '.sinapse/', '.sinapse-custom/',
  'docs/', 'tests/', '__tests__/', 'test/',
  'node_modules/', '.git/', 'squads/', 'outputs/',
];

/** Config files always exempt. */
const EXEMPT_FILES = [
  'package.json', 'package-lock.json', 'tsconfig.json',
  '.env', '.env.local', '.env.example',
  '.gitignore', '.eslintrc', '.prettierrc',
  'README.md', 'CHANGELOG.md',
  'jest.config.js', 'jest.config.ts',
  'vite.config.ts', 'next.config.js', 'next.config.mjs',
  'tailwind.config.js', 'tailwind.config.ts',
  'postcss.config.js', 'postcss.config.cjs',
];

/** Story statuses that allow implementation. */
const VALID_STATUSES = ['ready', 'inprogress', 'in progress', 'in_progress', 'inreview', 'in review', 'in_review', 'done'];

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
  const basename = path.basename(rel);
  if (EXEMPT_FILES.includes(basename)) return true;
  return EXEMPT_PATHS.some((ep) => rel.startsWith(ep));
}

function isCodePath(rel) {
  return CODE_PATHS.some((cp) => rel.startsWith(cp));
}

/**
 * Check if there's an active story with valid status.
 * Reads .sinapse/session-state.json for story context,
 * then scans docs/stories/ for any story with status >= Ready.
 */
function hasActiveStory(root) {
  // Strategy 1: Check session state for active story
  const sessionStatePath = path.join(root, '.sinapse', 'session-state.json');
  try {
    const state = JSON.parse(fs.readFileSync(sessionStatePath, 'utf8'));
    if (state.activeStory && state.activeStory.status) {
      const status = state.activeStory.status.toLowerCase().replace(/[\s_-]+/g, '');
      if (VALID_STATUSES.some((vs) => vs.replace(/[\s_-]+/g, '') === status)) {
        return true;
      }
    }
  } catch {
    // No session state or invalid — continue to Strategy 2
  }

  // Strategy 2: Scan docs/stories/ for any story file
  const storiesDir = path.join(root, 'docs', 'stories');
  try {
    if (!fs.existsSync(storiesDir)) return false;

    // Recursively find .md files
    const files = walkSync(storiesDir, '.md');
    for (const file of files) {
      try {
        const content = fs.readFileSync(file, 'utf8');
        // Look for status field in YAML frontmatter or markdown
        const statusMatch = content.match(/status:\s*["']?(\w[\w\s]*\w?)["']?/i);
        if (statusMatch) {
          const status = statusMatch[1].toLowerCase().replace(/[\s_-]+/g, '');
          if (VALID_STATUSES.some((vs) => vs.replace(/[\s_-]+/g, '') === status)) {
            return true;
          }
        }
      } catch {
        // Skip unreadable files
      }
    }
  } catch {
    // Can't scan — fail-open
    return true;
  }

  return false;
}

/** Simple recursive file walker. */
function walkSync(dir, ext) {
  const results = [];
  try {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        results.push(...walkSync(full, ext));
      } else if (entry.name.endsWith(ext)) {
        results.push(full);
      }
    }
  } catch {
    // Skip inaccessible dirs
  }
  return results;
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

  // Exempt paths and files
  if (isExempt(rel)) process.exit(0);

  // Only enforce on code paths
  if (!isCodePath(rel)) process.exit(0);

  // Check for active story
  if (hasActiveStory(root)) process.exit(0);

  // BLOCK
  process.stderr.write(
    `\nDOCUMENTATION-FIRST BLOCK (Constitution Article III)\n` +
    `File: ${rel}\n` +
    `No active story found with status >= Ready in docs/stories/.\n` +
    `Create a story first: @sprint-lead *draft\n` +
    `Then validate it: @product-lead *validate\n` +
    `Only then can implementation proceed.\n`,
  );
  process.exit(2);
}

main();
