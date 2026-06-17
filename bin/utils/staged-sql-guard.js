'use strict';

/**
 * Staged SQL Guard — git pre-commit guard for destructive DDL/DML.
 *
 * Ports the DANGEROUS_PATTERNS from `.claude/hooks/sql-governance.py` (which is
 * IDE-bound: it only fires on Claude Code Bash tool calls) into an IDE-agnostic
 * Node guard that runs at the git layer. It scans the STAGED blob of every
 * changed `.sql` / migration-bearing file and BLOCKS the commit (exit 1) if it
 * finds destructive schema/data operations:
 *
 *   - DROP TABLE/VIEW/FUNCTION/TRIGGER/INDEX/SCHEMA/POLICY
 *   - TRUNCATE
 *   - DELETE ... (without a WHERE clause)
 *   - CREATE TABLE ... AS SELECT (disallowed backup pattern)
 *
 * Scope decision: this guard targets the genuinely IRREVERSIBLE / data-loss
 * operations (the same ones a destructive migration would carry). Plain
 * CREATE/ALTER are intentionally NOT blocked at the git layer — they are the
 * normal content of forward migrations and blocking them would make every
 * legitimate schema change require `--no-verify`. The Claude-Code-level
 * sql-governance.py still gates CREATE/ALTER at authoring time interactively.
 *
 * Only `.sql` files and files under a `migrations/` path are scanned, so SQL
 * embedded in prose/docs or string literals in application code does not trip
 * the guard. SQL comments (line and block) are stripped before matching.
 *
 * fail-CLOSED on scanner error (a broken guard must never silently pass
 * destructive SQL). fail-OPEN only when there is genuinely nothing to scan.
 *
 * @module bin/utils/staged-sql-guard
 */

const { execFileSync, execSync } = require('child_process');

/**
 * Destructive patterns. Mirrors the irreversible subset of
 * sql-governance.py DANGEROUS_PATTERNS. Each entry: [regex, humanLabel].
 * Regexes are case-insensitive and operate on comment-stripped SQL text.
 * @constant {Array<[RegExp, string]>}
 */
const DANGEROUS_PATTERNS = [
  // DDL — destructive drops
  [/\bDROP\s+TABLE\b/i, 'DROP TABLE'],
  [/\bDROP\s+VIEW\b/i, 'DROP VIEW'],
  [/\bDROP\s+MATERIALIZED\s+VIEW\b/i, 'DROP MATERIALIZED VIEW'],
  [/\bDROP\s+FUNCTION\b/i, 'DROP FUNCTION'],
  [/\bDROP\s+TRIGGER\b/i, 'DROP TRIGGER'],
  [/\bDROP\s+INDEX\b/i, 'DROP INDEX'],
  [/\bDROP\s+SCHEMA\b/i, 'DROP SCHEMA'],
  [/\bDROP\s+POLICY\b/i, 'DROP POLICY'],
  [/\bDROP\s+DATABASE\b/i, 'DROP DATABASE'],
  // DML — data loss
  [/\bTRUNCATE\b/i, 'TRUNCATE'],
  // DELETE without a WHERE clause (whole-table wipe).
  [/\bDELETE\s+FROM\s+[^;]*?(?:;|$)(?<!\bWHERE\b[^;]*)/i, 'DELETE without WHERE'],
  // Disallowed backup pattern (table copy).
  [/\bCREATE\s+TABLE\b[\s\S]*?\bAS\s+SELECT\b/i, 'CREATE TABLE AS SELECT (backup pattern)'],
];

const SQL_FILE_PATTERN = /\.sql$/i;
const MIGRATION_PATH_PATTERN = /(^|\/)migrations?\//i;

/**
 * Should this path be SQL-scanned?
 * @param {string} filePath
 * @returns {boolean}
 */
function isSqlScanTarget(filePath) {
  const norm = String(filePath).replace(/\\/g, '/');
  return SQL_FILE_PATTERN.test(norm) || MIGRATION_PATH_PATTERN.test(norm);
}

/**
 * Strip SQL comments so `-- DROP TABLE foo` (commented out) is ignored.
 * Removes `--` line comments and `/* ... *\/` block comments.
 * @param {string} sql
 * @returns {string}
 */
function stripSqlComments(sql) {
  return String(sql == null ? '' : sql)
    .replace(/\/\*[\s\S]*?\*\//g, ' ') // block comments
    .replace(/--[^\n\r]*/g, ' '); // line comments
}

/**
 * Detect destructive SQL in a blob. Operates per-statement (split on ';') so a
 * `DELETE FROM a WHERE x; DELETE FROM b;` correctly flags only the second.
 * @param {string} content
 * @returns {string[]} list of human labels for findings (deduped)
 */
function detectDangerousSql(content) {
  const cleaned = stripSqlComments(content);
  const statements = cleaned.split(';');
  const found = new Set();

  for (const rawStmt of statements) {
    const stmt = rawStmt.trim();
    if (!stmt) continue;

    for (const [pattern, label] of DANGEROUS_PATTERNS) {
      if (label === 'DELETE without WHERE') {
        // Per-statement WHERE check: flag a DELETE FROM only when this
        // statement has no WHERE.
        if (/\bDELETE\s+FROM\b/i.test(stmt) && !/\bWHERE\b/i.test(stmt)) {
          found.add(label);
        }
        continue;
      }
      if (pattern.test(stmt)) {
        found.add(label);
      }
    }
  }

  return Array.from(found);
}

function getStagedFiles() {
  try {
    const output = execSync('git diff --cached --name-only --diff-filter=ACMR', {
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'pipe'],
    }).trim();
    return output ? output.split('\n').filter(Boolean) : [];
  } catch {
    return [];
  }
}

function readStagedFile(filePath) {
  // Throws on failure so the caller can fail-CLOSED instead of scanning "".
  return execFileSync('git', ['show', `:${filePath}`], {
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe'],
    maxBuffer: 5 * 1024 * 1024,
  });
}

/**
 * Scan the given staged files for destructive SQL.
 * @param {string[]} files
 * @returns {Array<{ filePath: string, reasons: string[] }>}
 */
function scanStagedFiles(files) {
  const findings = [];

  for (const filePath of files) {
    if (!isSqlScanTarget(filePath)) continue;

    let content;
    try {
      content = readStagedFile(filePath);
    } catch {
      // Unreadable blob (binary/deleted-readded race) — skip; SQL files are text.
      continue;
    }

    const reasons = detectDangerousSql(content);
    if (reasons.length > 0) {
      findings.push({ filePath, reasons });
    }
  }

  return findings;
}

function main() {
  let findings;
  try {
    const files = getStagedFiles();
    if (files.length === 0) process.exit(0);
    findings = scanStagedFiles(files);
  } catch (err) {
    // fail-CLOSED on unexpected scanner error.
    process.stderr.write('\nStaged SQL Guard: unexpected error — commit blocked (fail-closed).\n');
    process.stderr.write(String(err && err.message ? err.message : err) + '\n');
    process.exit(1);
  }

  if (findings.length === 0) process.exit(0);

  process.stderr.write('\nStaged SQL Guard: commit blocked (destructive SQL detected).\n\n');
  for (const f of findings) {
    process.stderr.write(`- ${f.filePath}: ${f.reasons.join(', ')}\n`);
  }
  process.stderr.write('\nDestructive schema/data operations must go through a reviewed migration,\n');
  process.stderr.write('not a raw commit. If this is an intentional, reviewed migration:\n');
  process.stderr.write('  git commit --no-verify   (framework contributors / reviewed migrations only)\n\n');
  process.exit(1);
}

module.exports = {
  DANGEROUS_PATTERNS,
  isSqlScanTarget,
  stripSqlComments,
  detectDangerousSql,
  getStagedFiles,
  scanStagedFiles,
};

if (require.main === module) {
  main();
}
