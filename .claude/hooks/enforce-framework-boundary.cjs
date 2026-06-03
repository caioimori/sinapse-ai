#!/usr/bin/env node
'use strict';

/**
 * Hook: Enforce Framework Boundary — PreToolUse Write|Edit guard
 *
 * RULE: When boundary.frameworkProtection is true in core-config.yaml, Write/Edit
 *       operations on L1/L2 framework paths ('protected' globs) are BLOCKED —
 *       UNLESS the path also matches an 'exceptions' glob (exceptions WIN).
 *
 * This is the RUNTIME defense-in-depth layer for the framework boundary. The
 * static deny-rule generator (.sinapse-ai/infrastructure/scripts/generate-settings-json.js)
 * bakes deny/allow into .claude/settings.json at install time; this hook reads
 * the boundary config DYNAMICALLY at every Write/Edit, so it stays correct even
 * if settings.json was never regenerated. The two layers are independent and
 * read the SAME single source of truth (boundary block in core-config.yaml).
 *
 * Protocol (Claude Code PreToolUse):
 *   exit 0  → allow (operation proceeds; silent on allow)
 *   exit 2  → block (message shown to model via stderr)
 *
 * Fail-open policy (per hook-governance.md principle #1):
 *   - Only acts on Write / Edit / NotebookEdit; any other tool → exit 0.
 *   - Missing/unreadable core-config.yaml → exit 0.
 *   - Missing js-yaml dependency → exit 0.
 *   - Missing/invalid boundary block → exit 0.
 *   - frameworkProtection !== true → exit 0 (toggle respected).
 *   - No file_path → exit 0.
 *   - Any unexpected error → exit 0.
 *
 * Design constraints: < 5s, deterministic, no side effects (read-only).
 *
 * @module enforce-framework-boundary
 */

const fs = require('fs');
const path = require('path');

const CORE_CONFIG_FILE = path.join('.sinapse-ai', 'core-config.yaml');
const WRITE_TOOLS = ['Write', 'Edit', 'NotebookEdit'];

// ---------------------------------------------------------------------------
// Project root resolution
// ---------------------------------------------------------------------------

function projectRoot() {
  return process.env.CLAUDE_PROJECT_DIR || process.cwd();
}

// ---------------------------------------------------------------------------
// Boundary config loader (js-yaml in try/catch; fail-open if absent)
// ---------------------------------------------------------------------------

/**
 * Read the boundary block from core-config.yaml.
 * Returns null on any failure (missing file, missing js-yaml, parse error,
 * absent boundary section) so the caller can fail-open.
 *
 * @param {string} root project root
 * @returns {{ frameworkProtection: boolean, protected: string[], exceptions: string[] } | null}
 */
function loadBoundary(root) {
  let yaml;
  try {
    // js-yaml is a repo dependency; in installed user projects it resolves via
    // the sinapse-ai node_modules. If unavailable for any reason → fail-open.
    yaml = require('js-yaml');
  } catch {
    return null;
  }

  const configPath = path.join(root, CORE_CONFIG_FILE);

  let content;
  try {
    content = fs.readFileSync(configPath, 'utf8');
  } catch {
    return null; // missing or unreadable
  }

  let config;
  try {
    config = yaml.load(content);
  } catch {
    return null; // malformed YAML
  }

  if (!config || typeof config !== 'object' || !config.boundary) {
    return null;
  }

  const b = config.boundary;
  return {
    // Strictly require === true; anything else (false, undefined, "true"
    // string, etc.) is treated as "not protected" → fail-open at the caller.
    frameworkProtection: b.frameworkProtection === true,
    protected: Array.isArray(b.protected) ? b.protected : [],
    exceptions: Array.isArray(b.exceptions) ? b.exceptions : [],
  };
}

// ---------------------------------------------------------------------------
// Path normalization (absolute → relative-to-root, POSIX, traversal-safe)
// ---------------------------------------------------------------------------

/**
 * Normalize a tool file_path into a clean project-relative POSIX path.
 *
 * Steps:
 *   - If absolute, make it relative to the project root.
 *   - Convert backslashes to forward slashes.
 *   - Collapse a leading "./" and any leading "/".
 *   - Reject traversal: if the resolved path escapes the root (leading "..")
 *     we return null (caller fails-open — we don't block paths we can't
 *     confidently place inside the project).
 *
 * @param {string} filePath raw file_path from tool_input
 * @param {string} root project root
 * @returns {string | null} clean relative POSIX path, or null if unresolvable/escaping
 */
function toRelativePosix(filePath, root) {
  if (!filePath || typeof filePath !== 'string') return null;

  let rel;
  if (path.isAbsolute(filePath)) {
    rel = path.relative(root, filePath);
  } else {
    rel = filePath;
  }

  // Normalize OS separators and collapse "." / ".." segments deterministically.
  rel = path.normalize(rel).replace(/\\/g, '/');

  // Strip leading "./"
  rel = rel.replace(/^\.\//, '');
  // Strip leading slash (defensive)
  rel = rel.replace(/^\/+/, '');

  // Traversal: a normalized relative path that still starts with ".." escapes
  // the project root. We cannot confidently classify it → signal fail-open.
  if (rel === '..' || rel.startsWith('../')) {
    return null;
  }

  return rel;
}

// ---------------------------------------------------------------------------
// Glob matcher (** and *) — own implementation, NO minimatch
// ---------------------------------------------------------------------------

/**
 * Convert a glob (supporting ** and *) into an anchored RegExp.
 *
 * Semantics (matching generate-settings-json + Claude permission globs):
 *   **  → matches any characters across any depth, INCLUDING path separators
 *         (and zero characters).
 *   *   → matches any characters within a single path segment (no "/").
 *   All other regex-special characters are escaped literally.
 *
 * Examples:
 *   ".sinapse-ai/core/**"        matches ".sinapse-ai/core/a/b.js"
 *   ".sinapse-ai/development/agents/*​/MEMORY.md"
 *                                matches ".sinapse-ai/development/agents/dev/MEMORY.md"
 *                                but NOT ".sinapse-ai/development/agents/a/b/MEMORY.md"
 *   ".sinapse-ai/constitution.md" matches itself exactly.
 *
 * @param {string} glob
 * @returns {RegExp}
 */
function globToRegExp(glob) {
  let re = '';
  for (let i = 0; i < glob.length; i++) {
    const c = glob[i];
    if (c === '*') {
      if (glob[i + 1] === '*') {
        // "**" → any chars, any depth (including separators), zero or more.
        re += '.*';
        i++; // consume the second '*'
        // Swallow an immediate "/" after "**" so that "a/**/b" also matches
        // "a/b" (zero intermediate segments).
        if (glob[i + 1] === '/') {
          re += '(?:/)?';
          i++;
        }
      } else {
        // single "*" → any chars except path separator
        re += '[^/]*';
      }
    } else {
      // Escape regex-special characters
      re += c.replace(/[.+?^${}()|[\]\\]/g, '\\$&');
    }
  }
  return new RegExp('^' + re + '$');
}

/**
 * Does a normalized relative path match ANY glob in the list?
 *
 * @param {string} relPath project-relative POSIX path
 * @param {string[]} globs
 * @returns {string | null} the first matching glob, or null
 */
function firstMatch(relPath, globs) {
  for (const g of globs) {
    if (typeof g !== 'string' || g.length === 0) continue;
    try {
      if (globToRegExp(g).test(relPath)) return g;
    } catch {
      // A malformed glob never blocks — skip it (fail-open per-glob).
    }
  }
  return null;
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

function main() {
  // Parse stdin — fail-open on any parse error
  let input;
  try {
    input = JSON.parse(fs.readFileSync(0, 'utf8'));
  } catch {
    process.exit(0);
  }

  const toolName = (input && input.tool_name ? String(input.tool_name) : '').trim();
  const toolInput = (input && input.tool_input) || {};

  // Only enforce on write-class tools. Everything else → allow.
  if (!WRITE_TOOLS.includes(toolName)) {
    process.exit(0);
  }

  const root = projectRoot();

  // Load boundary — fail-open if anything is off.
  let boundary;
  try {
    boundary = loadBoundary(root);
  } catch {
    process.exit(0);
  }
  if (!boundary) {
    process.exit(0);
  }

  // Toggle respected: only enforce when explicitly enabled.
  if (boundary.frameworkProtection !== true) {
    process.exit(0);
  }

  if (boundary.protected.length === 0) {
    process.exit(0);
  }

  // Resolve the target file path.
  // NotebookEdit uses notebook_path; Write/Edit use file_path.
  const rawPath = toolInput.file_path || toolInput.notebook_path;

  let relPath;
  try {
    relPath = toRelativePosix(rawPath, root);
  } catch {
    process.exit(0);
  }
  if (!relPath) {
    // No path or unresolvable/escaping path → fail-open.
    process.exit(0);
  }

  // Exceptions WIN: if the path matches any exception, allow.
  let exceptionHit = null;
  try {
    exceptionHit = firstMatch(relPath, boundary.exceptions);
  } catch {
    process.exit(0);
  }
  if (exceptionHit) {
    process.exit(0);
  }

  // Protected check.
  let protectedHit = null;
  try {
    protectedHit = firstMatch(relPath, boundary.protected);
  } catch {
    process.exit(0);
  }

  if (!protectedHit) {
    // Not a protected path → allow.
    process.exit(0);
  }

  // BLOCK — exit 2 with a clear message.
  process.stderr.write(
    `\nFRAMEWORK-BOUNDARY BLOCK [L1/L2 protected]\n` +
    `Tool: ${toolName}\n` +
    `File: ${relPath}\n` +
    `Matched protected rule: ${protectedHit}\n` +
    `\n` +
    `This path is a protected framework artifact (Constitution Art. II —\n` +
    `Agent Authority / L1-L2 boundary). Direct edits are blocked while\n` +
    `boundary.frameworkProtection is enabled.\n` +
    `\n` +
    `To change it:\n` +
    `  - Edit it through a story (the proper SDC flow), OR\n` +
    `  - If you are a framework contributor, set\n` +
    `    boundary.frameworkProtection: false in .sinapse-ai/core-config.yaml.\n`,
  );
  process.exit(2);
}

main();
