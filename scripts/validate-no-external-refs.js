#!/usr/bin/env node

/**
 * validate-no-external-refs.js
 *
 * Story 10.17 — Authorial Hygiene & Competitive Reference Guard.
 *
 * Scans the repository for any reference to a competing framework name and
 * fails (exit 1) if any match is found outside an explicit allow-list.
 *
 * The guard keeps the SINAPSE codebase in a 100% authorial voice: the only
 * places in the entire repo where competitive names may legally appear are
 * the MIT `LICENSE` file (legal attribution requirement) and the historical
 * process document `docs/research-synthesis-for-upgrade.md`. Everything else
 * — code, commit messages rendered in files, comments, public docs, CLI
 * output strings, changelogs — must be clean.
 *
 * Behavior:
 *   - Walks the repo from `rootDir` (default cwd), honouring `.gitignore`.
 *   - Skips the hardcoded allow-list paths.
 *   - Scans only text files (binary files and a small set of known-binary
 *     extensions are skipped).
 *   - Applies the regex `\b(aiox|synkra|synkraai|bmad)\b` (case-insensitive)
 *     line-by-line so the reporter can point at the exact file:line:match.
 *   - Returns a structured result for unit tests; the CLI wraps it.
 *
 * Output on violation (one block per match, matches AC 4 exactly):
 *
 *   ❌ External reference detected
 *   File: <path>
 *   Line: <num>
 *   Match: <text>
 *
 *   Fix: Remove the reference. This repo uses authorial SINAPSE voice only.
 *   Only LICENSE may contain these references (legal requirement).
 *
 * Usage:
 *   node scripts/validate-no-external-refs.js [--root <dir>]
 *
 * Exit codes:
 *   0 = clean
 *   1 = at least one violation
 *   2 = usage / filesystem error
 */

'use strict';

const fs = require('fs');
const path = require('path');

// ── Configuration ───────────────────────────────────────────────────────────

/**
 * Case-insensitive regex for any forbidden reference word. Uses `\b` to avoid
 * matching inside longer identifiers (e.g., `sinapse-ai` must not hit even
 * though it contains `ai`).
 */
const FORBIDDEN_REGEX = /\b(aiox|synkra|synkraai|bmad)\b/gi;

/**
 * Hardcoded allow-list. Every entry is a POSIX-style path relative to the
 * repo root. Directory entries end with `/`. These paths are skipped by the
 * scanner even when they are NOT gitignored.
 *
 *   - LICENSE: MIT attribution may legally require naming upstream authors.
 *   - docs/research-synthesis-for-upgrade.md: historical process document.
 *   - node_modules/, .git/: always skipped for performance and hygiene.
 */
const HARDCODED_ALLOW_LIST = [
  'LICENSE',
  'docs/research-synthesis-for-upgrade.md',
  'node_modules/',
  '.git/',
];

/**
 * Path fragments we skip unconditionally. These are generated or vendored
 * content that should never be scanned even if they slip past the gitignore
 * parser.
 */
const ALWAYS_SKIP_FRAGMENTS = [
  '/node_modules/',
  '/.git/',
  '/.eslintcache',
];

/**
 * File extensions we treat as binary and never scan. A line-by-line regex
 * scan on binary content is slow, noisy, and can produce false positives
 * (e.g. a byte sequence that happens to spell a forbidden word).
 */
const BINARY_EXTENSIONS = new Set([
  '.png', '.jpg', '.jpeg', '.gif', '.webp', '.svg', '.ico', '.bmp',
  '.pdf', '.zip', '.tar', '.gz', '.tgz', '.7z', '.rar',
  '.mp3', '.mp4', '.mov', '.avi', '.webm', '.ogg',
  '.woff', '.woff2', '.ttf', '.otf', '.eot',
  '.exe', '.dll', '.so', '.dylib',
  '.lock', '.lockb',
]);

/**
 * Maximum file size we scan (8 MB). Anything larger is almost certainly a
 * binary blob or a generated artifact and is not worth the IO cost.
 */
const MAX_SCAN_BYTES = 8 * 1024 * 1024;

// ── Gitignore parser ────────────────────────────────────────────────────────

/**
 * Minimal `.gitignore` matcher. We do NOT reimplement full git semantics
 * (that would require `git check-ignore` or a battle-tested library); we
 * only implement the subset this repo uses:
 *
 *   - comment lines (`#...`) and blank lines are ignored
 *   - trailing slashes mean "match directories"
 *   - leading `/` anchors the pattern to the repo root
 *   - `*` matches any run of non-slash characters
 *   - negation (`!`) is ignored for safety (we err on the side of NOT
 *     scanning; the validator's job is to be strict about unallowed
 *     references, and skipping a file by mistake is safer than scanning a
 *     file that is legitimately gitignored and legitimately contains the
 *     forbidden words — like the feature map)
 *
 * For correctness on edge cases the caller can always cross-check with
 * `git check-ignore -v` in CI.
 */
function parseGitignore(rootDir) {
  const gitignorePath = path.join(rootDir, '.gitignore');
  if (!fs.existsSync(gitignorePath)) return [];
  const raw = fs.readFileSync(gitignorePath, 'utf8');
  const patterns = [];
  for (const rawLine of raw.split(/\r?\n/)) {
    const line = rawLine.replace(/\s+#.*$/, '').trim();
    if (!line) continue;
    if (line.startsWith('#')) continue;
    if (line.startsWith('!')) continue; // see note above — we skip negations
    patterns.push(line);
  }
  return patterns;
}

/**
 * Convert a gitignore pattern into a simple regex. Strips the inline-comment
 * whitespace already, accepts `**`, `*`, trailing `/`, leading `/`.
 */
function gitignorePatternToRegex(pattern) {
  let p = pattern;
  const anchored = p.startsWith('/');
  if (anchored) p = p.slice(1);
  const dirOnly = p.endsWith('/');
  if (dirOnly) p = p.slice(0, -1);

  // Escape regex metacharacters EXCEPT `*` and `?` which we translate below.
  let regex = '';
  let i = 0;
  while (i < p.length) {
    const ch = p[i];
    if (ch === '*') {
      if (p[i + 1] === '*') {
        regex += '.*';
        i += 2;
        if (p[i] === '/') i++; // `**/` → `.*`
      } else {
        regex += '[^/]*';
        i++;
      }
    } else if (ch === '?') {
      regex += '[^/]';
      i++;
    } else if ('.^$+{}()|[]\\'.indexOf(ch) !== -1) {
      regex += '\\' + ch;
      i++;
    } else {
      regex += ch;
      i++;
    }
  }

  // Build final regex:
  //   anchored → must match from start of relPath
  //   directory-only → pattern plus `/...` or bare dir
  //   otherwise → may match anywhere in path
  if (dirOnly) {
    const prefix = anchored ? '^' : '(^|/)';
    return new RegExp(prefix + regex + '(/|$)');
  }
  const prefix = anchored ? '^' : '(^|/)';
  return new RegExp(prefix + regex + '(/|$)');
}

/**
 * Build a matcher from the parsed gitignore patterns. Returns `isIgnored(relPath)`.
 */
function buildGitignoreMatcher(patterns) {
  const compiled = patterns.map(gitignorePatternToRegex);
  return function isIgnored(relPath) {
    const normalized = relPath.replace(/\\/g, '/');
    for (const rx of compiled) {
      if (rx.test(normalized)) return true;
    }
    return false;
  };
}

// ── Allow-list matching ─────────────────────────────────────────────────────

function isAllowListed(relPath) {
  const normalized = relPath.replace(/\\/g, '/');
  for (const entry of HARDCODED_ALLOW_LIST) {
    if (entry.endsWith('/')) {
      if (normalized === entry.slice(0, -1)) return true;
      if (normalized.startsWith(entry)) return true;
    } else if (normalized === entry) {
      return true;
    }
  }
  return false;
}

function isAlwaysSkipped(relPath) {
  const normalized = '/' + relPath.replace(/\\/g, '/');
  for (const frag of ALWAYS_SKIP_FRAGMENTS) {
    if (normalized.includes(frag)) return true;
  }
  return false;
}

// ── File discovery ──────────────────────────────────────────────────────────

/**
 * Recursively walk `rootDir` and return every regular file's relative path
 * (POSIX-normalized). Gitignored and always-skipped entries are pruned.
 */
function walkFiles(rootDir, isIgnored) {
  const collected = [];
  function visit(relDir) {
    const absDir = path.join(rootDir, relDir);
    let entries;
    try {
      entries = fs.readdirSync(absDir, { withFileTypes: true });
    } catch {
      return;
    }
    for (const entry of entries) {
      const relEntry = relDir ? path.posix.join(relDir, entry.name) : entry.name;
      if (isAlwaysSkipped(relEntry)) continue;
      if (isIgnored(relEntry)) continue;
      if (entry.isDirectory()) {
        // Check directory form of ignore too (`foo/` in .gitignore).
        if (isIgnored(relEntry + '/')) continue;
        visit(relEntry);
      } else if (entry.isFile()) {
        collected.push(relEntry);
      }
    }
  }
  visit('');
  return collected;
}

// ── Scanner ─────────────────────────────────────────────────────────────────

/**
 * Detect whether a file is likely binary by checking its extension and a
 * quick sniff of the first 4 KB for null bytes.
 */
function isBinaryFile(absPath) {
  const ext = path.extname(absPath).toLowerCase();
  if (BINARY_EXTENSIONS.has(ext)) return true;
  try {
    const fd = fs.openSync(absPath, 'r');
    const buf = Buffer.alloc(4096);
    const n = fs.readSync(fd, buf, 0, 4096, 0);
    fs.closeSync(fd);
    for (let i = 0; i < n; i++) {
      if (buf[i] === 0) return true;
    }
  } catch {
    return true; // unreadable → treat as binary
  }
  return false;
}

/**
 * Scan a single file. Returns an array of violation objects; empty if clean.
 */
function scanFile(rootDir, relPath) {
  if (isAllowListed(relPath)) return [];
  const absPath = path.join(rootDir, relPath);
  let stat;
  try {
    stat = fs.statSync(absPath);
  } catch {
    return [];
  }
  if (!stat.isFile()) return [];
  if (stat.size > MAX_SCAN_BYTES) return [];
  if (isBinaryFile(absPath)) return [];

  let content;
  try {
    content = fs.readFileSync(absPath, 'utf8');
  } catch {
    return [];
  }

  const lines = content.split(/\r?\n/);
  const violations = [];
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    // Reset regex state for each line; /g keeps lastIndex sticky.
    FORBIDDEN_REGEX.lastIndex = 0;
    let match;
    while ((match = FORBIDDEN_REGEX.exec(line)) !== null) {
      violations.push({
        file: relPath,
        line: i + 1,
        match: match[0],
      });
    }
  }
  return violations;
}

/**
 * Public API: scan the repository rooted at `rootDir` and return
 *   { ok, scanned, violations }
 *
 * The function is pure (no console/process side-effects) so tests can exercise
 * it by passing a custom `rootDir`.
 *
 * @param {string} rootDir
 * @returns {{ok: boolean, scanned: string[], violations: Array<{file: string, line: number, match: string}>}}
 */
function validateNoExternalRefs(rootDir) {
  const patterns = parseGitignore(rootDir);
  const isIgnored = buildGitignoreMatcher(patterns);
  const files = walkFiles(rootDir, isIgnored);
  const violations = [];
  for (const relPath of files) {
    violations.push(...scanFile(rootDir, relPath));
  }
  return { ok: violations.length === 0, scanned: files, violations };
}

// ── Reporter ────────────────────────────────────────────────────────────────

/**
 * Format a violation block exactly as AC 4 specifies.
 */
function formatViolation(v) {
  return [
    '❌ External reference detected',
    'File: ' + v.file,
    'Line: ' + v.line,
    'Match: ' + v.match,
    '',
    'Fix: Remove the reference. This repo uses authorial SINAPSE voice only.',
    'Only LICENSE may contain these references (legal requirement).',
    '',
  ].join('\n');
}

function formatReport(result) {
  if (result.ok) {
    return (
      '\n=== validate-no-external-refs ===\n' +
      'Scanned ' + result.scanned.length + ' file(s).\n' +
      'OK — no external references detected.\n\n'
    );
  }
  const blocks = result.violations.map(formatViolation);
  return (
    '\n=== validate-no-external-refs ===\n' +
    'Scanned ' + result.scanned.length + ' file(s).\n' +
    'FAIL — ' + result.violations.length + ' external reference(s):\n\n' +
    blocks.join('\n')
  );
}

// ── CLI entry point ─────────────────────────────────────────────────────────

function parseArgs(argv) {
  const args = { root: process.cwd() };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--root' || a === '-r') {
      args.root = argv[++i];
    } else if (a === '--help' || a === '-h') {
      args.help = true;
    }
  }
  return args;
}

function printUsage() {
  process.stdout.write(
    [
      'Usage: node scripts/validate-no-external-refs.js [--root <dir>]',
      '',
      'Scans the repo for any competitive framework reference and fails if',
      'any match is found outside the hardcoded allow-list (LICENSE, historical',
      'process doc). Honours .gitignore so internal reference material placed',
      'under gitignored paths is never scanned.',
      '',
      'Options:',
      '  --root, -r <dir>   Root directory to scan (defaults to cwd).',
      '  --help, -h         Show this help.',
      '',
    ].join('\n'),
  );
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  if (args.help) {
    printUsage();
    process.exit(0);
  }
  try {
    const rootAbs = path.resolve(args.root);
    if (!fs.existsSync(rootAbs)) {
      process.stderr.write('error: root directory not found: ' + rootAbs + '\n');
      process.exit(2);
    }
    const result = validateNoExternalRefs(rootAbs);
    process.stdout.write(formatReport(result));
    process.exit(result.ok ? 0 : 1);
  } catch (err) {
    process.stderr.write('error: ' + (err && err.message ? err.message : err) + '\n');
    process.exit(2);
  }
}

// Exports for unit testing.
module.exports = {
  FORBIDDEN_REGEX,
  HARDCODED_ALLOW_LIST,
  parseGitignore,
  gitignorePatternToRegex,
  buildGitignoreMatcher,
  isAllowListed,
  isAlwaysSkipped,
  walkFiles,
  scanFile,
  validateNoExternalRefs,
  formatViolation,
  formatReport,
};

if (require.main === module) {
  main();
}
