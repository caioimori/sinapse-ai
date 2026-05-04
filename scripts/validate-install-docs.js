#!/usr/bin/env node

/**
 * validate-install-docs.js
 *
 * Story 10.13 — Doc-drift guard for the canonical install commands.
 *
 * Scans user-facing installation documentation for any reference to a
 * non-canonical install/update/uninstall command. Fails with exit code 1
 * (and a clear, grep-friendly report) if drift is detected.
 *
 * Canonical commands (the ONLY public entry points):
 *   npx sinapse-ai install
 *   npx sinapse-ai update
 *   npx sinapse-ai uninstall
 *
 * Non-canonical patterns the guard rejects in public docs:
 *   - `sinapse install|update|uninstall`  (missing the `-ai` suffix)
 *   - `sinapse-minimal`                    (internal/legacy binary)
 *   - `sinapse-graph`                      (internal/legacy binary)
 *   - `install-squads.sh`                  (internal script, must not be exposed)
 *   - `update-squads.sh`                   (internal script, must not be exposed)
 *   - `install-chrome-brain.sh`            (internal script, must not be exposed)
 *   - `install-monitor-hooks.sh`           (internal script, must not be exposed)
 *
 * Allow-lists (to prevent false positives):
 *   - Sections explicitly marked as `### Internal (developer-only)` within a
 *     file are treated as developer notes and skipped by the scanner. The
 *     section ends at the next heading of equal or higher level.
 *   - Historical / release-notes paths: `CHANGELOG.md`, `docs/releases/**`,
 *     `docs/changelog/**`.
 *
 * Usage:
 *   node scripts/validate-install-docs.js [--root <dir>]
 *
 * Exit codes:
 *   0 = no drift
 *   1 = drift detected (report printed to stdout)
 *   2 = usage / filesystem error (message printed to stderr)
 *
 * The scanner is pure (no side-effects) so it can be unit-tested by passing
 * a custom `rootDir` to `validateInstallDocs()` — see tests/scripts/validate-install-docs.test.js.
 */

'use strict';

const fs = require('fs');
const path = require('path');

// ── Rules ────────────────────────────────────────────────────────────────────

/**
 * Each rule has a regex and a human-readable reason. The regex is applied
 * line-by-line so the reporter can pinpoint the exact line number.
 */
const FORBIDDEN_PATTERNS = [
  {
    id: 'legacy-sinapse-install',
    regex: /\bsinapse\s+install\b/,
    reason: 'Use `npx sinapse-ai install` (the `sinapse install` form is deprecated).',
  },
  {
    id: 'legacy-sinapse-update',
    regex: /\bsinapse\s+update\b/,
    reason: 'Use `npx sinapse-ai update` (the `sinapse update` form is deprecated).',
  },
  {
    id: 'legacy-sinapse-uninstall',
    regex: /\bsinapse\s+uninstall\b/,
    reason: 'Use `npx sinapse-ai uninstall` (the `sinapse uninstall` form is deprecated).',
  },
  {
    id: 'sinapse-minimal-binary',
    regex: /\bsinapse-minimal\b/,
    reason: '`sinapse-minimal` is internal/deprecated. Use `npx sinapse-ai install`.',
  },
  {
    id: 'sinapse-graph-binary',
    regex: /\bsinapse-graph\b/,
    reason: '`sinapse-graph` is internal/deprecated. Use `npx sinapse-ai --help`.',
  },
  {
    id: 'install-squads-script',
    regex: /\binstall-squads\.sh\b/,
    reason: 'Internal script — do not expose in public docs. It runs under `npx sinapse-ai install`.',
  },
  {
    id: 'update-squads-script',
    regex: /\bupdate-squads\.sh\b/,
    reason: 'Internal script — do not expose in public docs. It runs under `npx sinapse-ai update`.',
  },
  {
    id: 'install-chrome-brain-script',
    regex: /\binstall-chrome-brain\.sh\b/,
    reason:
      'Internal script — use `npx sinapse-ai chrome-brain install`. Developer-only mentions must live under a `### Internal (developer-only)` section.',
  },
  {
    id: 'install-monitor-hooks-script',
    regex: /\binstall-monitor-hooks\.sh\b/,
    reason:
      'Internal script — must be invoked internally by `npx sinapse-ai install`, never shown as a user-facing command.',
  },
];

// ── Paths ────────────────────────────────────────────────────────────────────

/**
 * Directories whose `.md` files are public user-facing installation docs.
 * Everything in these trees is scanned.
 */
const PUBLIC_DOC_DIRS = ['docs/installation'];

/**
 * Additional top-level public doc files (relative to root).
 */
const PUBLIC_DOC_FILES = ['README.md'];

/**
 * Path fragments that identify historical / release notes. Any file whose
 * relative path (forward-slash normalized) contains one of these is skipped
 * even if it lives under a public directory.
 */
const HISTORICAL_PATH_FRAGMENTS = [
  'CHANGELOG.md',
  'docs/releases/',
  'docs/changelog/',
];

// ── Internal-section allow-list ──────────────────────────────────────────────

/**
 * Matches a heading that opens a developer-only section. The section is
 * considered active until the next heading of the same or higher level.
 *
 * Accepts both exact phrasing and the loose form "internal — developer-only".
 */
const INTERNAL_SECTION_HEADING = /^(#{1,6})\s+Internal\s*(\(|—|-)\s*developer[-\s]?only/i;

/**
 * Walk the file line-by-line and return the set of line indices (0-based)
 * that fall inside an "Internal (developer-only)" block. These lines are
 * exempt from the forbidden-pattern scan.
 */
function computeAllowedLineSet(lines) {
  const allowed = new Set();
  let insideInternal = false;
  let internalLevel = 0;
  // Track fenced code blocks so that shell comments like `# Run this` inside
  // a ```bash``` block are NOT misinterpreted as markdown headings (which
  // would incorrectly close an internal section).
  let insideFence = false;

  const FENCE_RE = /^\s*(```|~~~)/;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Toggle code-fence state first — everything else honours the current state.
    if (FENCE_RE.test(line)) {
      // If we are inside an internal block, the fence lines themselves are allowed.
      if (insideInternal) allowed.add(i);
      insideFence = !insideFence;
      continue;
    }

    if (insideFence) {
      // Lines inside a fenced block are verbatim content — never treat them as
      // headings. If we are inside an internal section, they are allowed.
      if (insideInternal) allowed.add(i);
      continue;
    }

    const headingMatch = line.match(/^(#{1,6})\s+/);

    if (insideInternal && headingMatch) {
      const level = headingMatch[1].length;
      if (level <= internalLevel) {
        // New heading at same or higher level closes the internal block.
        insideInternal = false;
        internalLevel = 0;
      }
    }

    const internalMatch = line.match(INTERNAL_SECTION_HEADING);
    if (internalMatch) {
      insideInternal = true;
      internalLevel = internalMatch[1].length;
      // The heading line itself is part of the allowed region.
      allowed.add(i);
      continue;
    }

    if (insideInternal) {
      allowed.add(i);
    }
  }

  return allowed;
}

// ── File discovery ───────────────────────────────────────────────────────────

function isHistorical(relPath) {
  const normalized = relPath.replace(/\\/g, '/');
  return HISTORICAL_PATH_FRAGMENTS.some((fragment) => normalized.includes(fragment));
}

function walkMarkdown(rootDir, relDir, collected) {
  const absDir = path.join(rootDir, relDir);
  let entries;
  try {
    entries = fs.readdirSync(absDir, { withFileTypes: true });
  } catch {
    return;
  }
  for (const entry of entries) {
    const entryRel = path.posix.join(relDir.replace(/\\/g, '/'), entry.name);
    if (entry.isDirectory()) {
      walkMarkdown(rootDir, entryRel, collected);
    } else if (entry.isFile() && entry.name.toLowerCase().endsWith('.md')) {
      if (!isHistorical(entryRel)) collected.push(entryRel);
    }
  }
}

function discoverPublicDocs(rootDir) {
  const files = [];
  for (const dir of PUBLIC_DOC_DIRS) {
    walkMarkdown(rootDir, dir, files);
  }
  for (const file of PUBLIC_DOC_FILES) {
    const abs = path.join(rootDir, file);
    if (fs.existsSync(abs) && !isHistorical(file)) files.push(file);
  }
  return files;
}

// ── Scanner ──────────────────────────────────────────────────────────────────

/**
 * Scan a single file for forbidden patterns, respecting internal-section
 * allow-lists. Returns an array of violation objects.
 *
 * @param {string} rootDir
 * @param {string} relPath
 * @returns {Array<{file:string, line:number, col:number, ruleId:string, reason:string, snippet:string}>}
 */
function scanFile(rootDir, relPath) {
  const absPath = path.join(rootDir, relPath);
  const content = fs.readFileSync(absPath, 'utf8');
  const lines = content.split(/\r?\n/);
  const allowed = computeAllowedLineSet(lines);
  const violations = [];

  for (let i = 0; i < lines.length; i++) {
    if (allowed.has(i)) continue;
    const line = lines[i];
    for (const rule of FORBIDDEN_PATTERNS) {
      const match = line.match(rule.regex);
      if (match) {
        violations.push({
          file: relPath,
          line: i + 1,
          col: (match.index || 0) + 1,
          ruleId: rule.id,
          reason: rule.reason,
          snippet: line.trim(),
        });
      }
    }
  }

  return violations;
}

/**
 * Validate all public install docs under `rootDir`. Returns a structured
 * result object (no side effects). Callers decide how to present it.
 *
 * @param {string} rootDir
 * @returns {{ok:boolean, scanned:string[], violations:Array<object>}}
 */
function validateInstallDocs(rootDir) {
  const scanned = discoverPublicDocs(rootDir);
  const violations = [];
  for (const relPath of scanned) {
    violations.push(...scanFile(rootDir, relPath));
  }
  return { ok: violations.length === 0, scanned, violations };
}

// ── Reporter ─────────────────────────────────────────────────────────────────

function formatReport(result) {
  const lines = [];
  lines.push('');
  lines.push('=== validate-install-docs ===');
  lines.push(`Scanned ${result.scanned.length} public install doc(s).`);
  if (result.ok) {
    lines.push('');
    lines.push('OK — no drift detected. Every public doc uses the canonical');
    lines.push('`npx sinapse-ai install | update | uninstall` commands.');
    lines.push('');
    return lines.join('\n');
  }
  lines.push('');
  lines.push(`FAIL — ${result.violations.length} non-canonical reference(s):`);
  lines.push('');
  for (const v of result.violations) {
    lines.push(`  ${v.file}:${v.line}:${v.col}  [${v.ruleId}]`);
    lines.push(`    ${v.snippet}`);
    lines.push(`    -> ${v.reason}`);
    lines.push('');
  }
  lines.push('Canonical commands:');
  lines.push('  npx sinapse-ai install');
  lines.push('  npx sinapse-ai update');
  lines.push('  npx sinapse-ai uninstall');
  lines.push('');
  lines.push('Wrap developer-only mentions in an `### Internal (developer-only)` section to opt them out.');
  lines.push('');
  return lines.join('\n');
}

// ── CLI entry point ──────────────────────────────────────────────────────────

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
      'Usage: node scripts/validate-install-docs.js [--root <dir>]',
      '',
      'Validates that user-facing install docs reference only the canonical',
      '`npx sinapse-ai install | update | uninstall` commands.',
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
      process.stderr.write(`error: root directory not found: ${rootAbs}\n`);
      process.exit(2);
    }
    const result = validateInstallDocs(rootAbs);
    process.stdout.write(formatReport(result));
    process.exit(result.ok ? 0 : 1);
  } catch (err) {
    process.stderr.write(`error: ${err && err.message ? err.message : err}\n`);
    process.exit(2);
  }
}

// Exports for unit testing.
module.exports = {
  FORBIDDEN_PATTERNS,
  PUBLIC_DOC_DIRS,
  PUBLIC_DOC_FILES,
  HISTORICAL_PATH_FRAGMENTS,
  computeAllowedLineSet,
  discoverPublicDocs,
  scanFile,
  validateInstallDocs,
  formatReport,
};

// Only run the CLI when invoked directly (not when required by tests).
if (require.main === module) {
  main();
}
