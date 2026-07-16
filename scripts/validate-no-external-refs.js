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
 * the `NOTICE.md` file (legal attribution requirement), the historical
 * process document `docs/research-synthesis-for-upgrade.md`, and a small set
 * of pre-existing upstream-attribution files inherited from the BMAD fork
 * lineage (flagged for future per-file review — see the internal
 * upstream-attribution follow-up backlog).
 *
 * === Source of truth: `git ls-files` (QA v1.1 fix) ===
 *
 * The original implementation parsed `.gitignore` with a custom (naive)
 * matcher. That matcher was too aggressive: because artifact-ignore rules
 * (e.g. `.test.cache/`, `coverage/`) happened to match prefixes that also
 * appeared inside legitimate tracked directories, entire trees like
 * `squads/`, `tests/`, and `scripts/` were incorrectly pruned from the scan.
 * Out of 4493 files tracked by git, the scanner only visited ~1623 (36 %)
 * — which means it was silently blind to the real repo state and missed
 * pre-existing upstream references that QA later caught by hand.
 *
 * The fix replaces the custom walker with a single call to `git ls-files`,
 * which is the exact set of files that will be published to GitHub / npm.
 * This is correct for three reasons:
 *
 *   1. Publishability — `git ls-files` is EXACTLY what ships. Any file we
 *      miss there cannot reach a user, so scanning it is meaningless.
 *   2. Zero parser bugs — git does gitignore resolution natively; we don't
 *      need to approximate it.
 *   3. Deterministic — no filesystem walk, no binary sniffing of files that
 *      aren't even tracked, no accidental inclusion of `node_modules/`.
 *
 * Behavior:
 *   - Shells out to `git ls-files` in `rootDir` to get the tracked set.
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
 *   Only NOTICE.md may contain these references (legal requirement).
 *
 * Usage:
 *   node scripts/validate-no-external-refs.js [--root <dir>]
 *
 * Exit codes:
 *   0 = clean
 *   1 = at least one violation
 *   2 = usage / filesystem / git error
 */

'use strict';

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// ── Configuration ───────────────────────────────────────────────────────────

/**
 * Case-insensitive regex for any forbidden reference word. Uses `\b` to avoid
 * matching inside longer identifiers (e.g., `sinapse-ai` must not hit even
 * though it contains `ai`).
 */
const FORBIDDEN_REGEX = /\b(aiox|synkra|synkraai|bmad|llamaindex|langchain|autogen|crewai|metagpt)\b/gi;

/**
 * Persona-leak detector — flags BMAD-heritage persona names ("Sally",
 * "Winston", "Sarah") only when used in an agent/persona/author context.
 * This catches regressions where a persona name slips back into a canonical
 * SINAPSE agent or doc. Conceptual/unrelated uses of these common first
 * names in research or narrative content are NOT flagged by this regex.
 */
const PERSONA_LEAK_REGEX = /\b(sally|winston|sarah)\s*(?:\(@|,?\s*\(?@)(architect|product-lead|pm|po|dev|developer|ux-design-expert)/gi;

/**
 * Hardcoded allow-list. Every entry is a POSIX-style path relative to the
 * repo root. These paths are skipped by the scanner.
 *
 *   - NOTICE.md: legal attribution may require naming upstream authors.
 *   - docs/research-synthesis-for-upgrade.md: historical process document.
 *   - squads/claude-code-mastery/agents/skill-craftsman.md: PERMANENT.
 *     The agent's documented purpose is to study and adapt external
 *     agile-AI methodologies, so the references serve the framework
 *     rather than inheriting from a fork. Story 10.23 audited the file
 *     and decided to keep it allow-listed indefinitely.
 *
 * Each entry is an EXACT path match. Directory prefixes are NOT used — this
 * forces future files under `squads/claude-code-mastery/` to be BLOCKED
 * until they are explicitly added, which is what we want: a new file with a
 * forbidden literal should fail the validator loudly.
 */
const HARDCODED_ALLOW_LIST = [
  'NOTICE.md', // Legal attribution requirement
  'docs/research-synthesis-for-upgrade.md', // Historical process doc

  // ── The validator itself + its tests ─────────────────────────────────
  // These files MUST literally contain the forbidden strings: the script
  // defines the regex that matches them, and the test suite builds fixtures
  // that assert the regex catches each term. Without this exemption the
  // validator would fail on its own source code.
  'scripts/validate-no-external-refs.js',
  'tests/scripts/validate-no-external-refs.test.js',

  // ── PERMANENT: skill-craftsman methodology study ─────────────────────
  // Story 10.23 audited the 6 pre-existing fork attribution files from
  // Story 10.17. Five were rewritten in authorial voice and removed from
  // the allow-list. This one stays: the agent's identity is built around
  // studying external agile-AI methodologies and the references are
  // load-bearing, not inherited noise.
  'squads/claude-code-mastery/agents/skill-craftsman.md',

  // ── Research/comparison KBs — neutral nomenclature only ──────────────
  // These knowledge bases contain comparison tables of multi-agent
  // frameworks (CrewAI, LangChain, AutoGen, MetaGPT) as industry
  // nomenclature. Per the 2026-04-18 third-party policy, neutral
  // conceptual mentions are OK; URLs and promotional/endorse language
  // were stripped in the cleanup pass.
  'squads/squad-claude/knowledge-base/swarm-orchestration-patterns.md',
  'squads/squad-cloning/knowledge-base/multi-agent-deployment-patterns.md',
  'squads/squad-research/knowledge-base/agentic-second-brain-reference.md',
  'squads/squad-research/knowledge-base/multi-agent-research-methodology.md',
  'squads/squad-claude/knowledge-base/skill-creation-patterns.md',
  'squads/claude-code-mastery/knowledge-base/claude-code-internals-reference.md',

  // Standards doc with competitive positioning table (nomenclature only).
  '.sinapse-ai/docs/standards/SINAPSE-LIVRO-DE-OURO-V2.1-COMPLETE.md',
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

// ── Allow-list matching ─────────────────────────────────────────────────────

/**
 * Exact-match allow-list check. Directory prefixes are NOT supported by
 * design: see the comment on HARDCODED_ALLOW_LIST.
 */
function isAllowListed(relPath) {
  const normalized = relPath.replace(/\\/g, '/');
  return HARDCODED_ALLOW_LIST.indexOf(normalized) !== -1;
}

// ── File discovery ──────────────────────────────────────────────────────────

/**
 * Return the list of files tracked by git in `rootDir`, as POSIX-style
 * relative paths. This is the exact set of files that will be published.
 *
 * We use `git ls-files -z` (null-delimited) so filenames with spaces or
 * other special chars are handled correctly on Windows and Unix.
 *
 * @param {string} rootDir absolute path to a git repository root
 * @returns {string[]}
 * @throws if `git ls-files` cannot be run (no git, not a repo, etc.)
 */
function listTrackedFiles(rootDir) {
  let raw;
  try {
    raw = execSync('git ls-files -z', {
      cwd: rootDir,
      encoding: 'utf8',
      maxBuffer: 64 * 1024 * 1024, // 64 MB — plenty for any repo we care about
      stdio: ['ignore', 'pipe', 'pipe'],
    });
  } catch (err) {
    const msg = err && err.message ? err.message : String(err);
    throw new Error(
      'git ls-files failed in ' + rootDir + ': ' + msg +
        '\n(The validator requires a git repository as its root.)',
    );
  }
  // Split on NUL; drop the trailing empty entry that `-z` always leaves.
  return raw
    .split('\0')
    .filter((entry) => entry.length > 0)
    .map((entry) => entry.replace(/\\/g, '/'));
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

  // Size cap and read share one fd, so the scanned bytes are the sized bytes.
  let content;
  let fd;
  try {
    fd = fs.openSync(absPath, 'r');
  } catch {
    return [];
  }
  try {
    const stat = fs.fstatSync(fd);
    if (!stat.isFile()) return [];
    if (stat.size > MAX_SCAN_BYTES) return [];
    if (isBinaryFile(absPath)) return [];
    const buf = Buffer.alloc(stat.size);
    fs.readSync(fd, buf, 0, stat.size, 0);
    content = buf.toString('utf8');
  } catch {
    return [];
  } finally {
    fs.closeSync(fd);
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
    PERSONA_LEAK_REGEX.lastIndex = 0;
    let pMatch;
    while ((pMatch = PERSONA_LEAK_REGEX.exec(line)) !== null) {
      violations.push({
        file: relPath,
        line: i + 1,
        match: pMatch[0],
      });
    }
  }
  return violations;
}

/**
 * Public API: scan the repository rooted at `rootDir` and return
 *   { ok, scanned, violations }
 *
 * The function uses `git ls-files` to determine the scan set, so `rootDir`
 * MUST be a git repository root (or a directory inside one). Tests should
 * create a fixture with `git init` + `git add` to exercise this.
 *
 * @param {string} rootDir
 * @returns {{ok: boolean, scanned: string[], violations: Array<{file: string, line: number, match: string}>}}
 */
function validateNoExternalRefs(rootDir) {
  const files = listTrackedFiles(rootDir);
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
    'Only NOTICE.md may contain these references (legal requirement).',
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
      'any match is found outside the hardcoded allow-list (NOTICE.md, historical',
      'process doc, pre-existing upstream fork attribution). Uses `git ls-files`',
      'as the source of truth so only publishable tracked files are scanned.',
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
  PERSONA_LEAK_REGEX,
  HARDCODED_ALLOW_LIST,
  isAllowListed,
  listTrackedFiles,
  scanFile,
  validateNoExternalRefs,
  formatViolation,
  formatReport,
};

if (require.main === module) {
  main();
}
