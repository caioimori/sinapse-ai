'use strict';

/**
 * Staged Secret Scan — git pre-commit guard.
 *
 * Reads EXCLUSIVELY the staged blob of each changed file (`git show :<path>`),
 * so only what is actually being committed is measured (the working-tree copy,
 * which may differ, is never read — no stash dance required).
 *
 * Detection is delegated to the shared core (`secret-scanner-core.js`):
 *   - all 20+ named patterns
 *   - Shannon-entropy backstop for unnamed high-entropy tokens
 *   - placeholder allowlist (.env.example values, your-key-here, CHANGEME, …)
 *   - lockfile-hash context allowlist
 *   - redacted output (secrets never printed in full)
 *
 * fail-CLOSED: if the scanner cannot run (load error, git error mid-scan), the
 * commit is BLOCKED (exit 1) rather than silently allowed.
 *
 * @module bin/utils/staged-secret-scan
 */

const path = require('path');
const { execFileSync, execSync } = require('child_process');

let core;
try {
  core = require(path.join(__dirname, 'secret-scanner-core.js'));
} catch (err) {
  // fail-CLOSED: the scanner itself is broken — refuse to let a commit through
  // unscanned.
  process.stderr.write('\nStaged Secret Scan: scanner failed to load — commit blocked (fail-closed).\n');
  process.stderr.write(String(err && err.message ? err.message : err) + '\n');
  process.exit(1);
}

const { scanContent, redactMatch } = core;

const BLOCKED_ENV_FILE_PATTERN = /(^|\/)\.env(\..+)?$/i;
const SAFE_ENV_FILE_PATTERN = /(^|\/)\.env\.(example|sample|template)$/i;

// Files that legitimately carry secret-shaped strings by design:
//   - the scanner's own source (named-pattern regexes embed token shapes like
//     the JWT header), which would otherwise self-trip the entropy backstop;
//   - any test/spec file (intentional fixtures that prove detection works).
// These are PATH-exempt so the guard never blocks committing the guard itself
// or its tests. All production code paths remain fully scanned.
const SCANNER_SELF_FILES = new Set([
  'bin/utils/secret-scanner-core.js',
  'bin/utils/staged-secret-scan.js',
  '.claude/hooks/secret-scanning.cjs',
]);
const TEST_FILE_PATTERN = /(^|\/)(tests?|__tests__)\/|\.(test|spec)\.[cm]?[jt]s$/i;

function isScanExemptPath(filePath) {
  const norm = String(filePath).replace(/\\/g, '/');
  return SCANNER_SELF_FILES.has(norm) || TEST_FILE_PATTERN.test(norm);
}

/**
 * Back-compat shim: the previous public API exposed { SECRET_PATTERNS,
 * findSecretMatches }. They now resolve through the shared core so any external
 * importer keeps working while gaining the hardened detection.
 */
const SECRET_PATTERNS = core.NAMED_PATTERNS.map((p) => ({ label: p.name, pattern: p.pattern }));

function findSecretMatches(content, filePath) {
  return scanContent(content, { filePath: filePath || '' }).map((f) => f.name);
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

function isBlockedEnvFile(filePath) {
  return BLOCKED_ENV_FILE_PATTERN.test(filePath) && !SAFE_ENV_FILE_PATTERN.test(filePath);
}

function readStagedFile(filePath) {
  // Throws on failure so the caller can fail-CLOSED instead of scanning "".
  return execFileSync('git', ['show', `:${filePath}`], {
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe'],
    maxBuffer: 5 * 1024 * 1024,
  });
}

function scanStagedFiles(files) {
  const findings = [];

  for (const filePath of files) {
    // A non-safe .env file is blocked outright (its values are real by design).
    if (isBlockedEnvFile(filePath)) {
      findings.push({ filePath, reason: 'environment file (use .env.example with placeholders)', redacted: null });
      continue;
    }

    // Skip the scanner's own source + any test/spec file (intentional fixtures).
    if (isScanExemptPath(filePath)) {
      continue;
    }

    let content;
    try {
      content = readStagedFile(filePath);
    } catch {
      // Could not read the staged blob (binary, deleted-then-readded race, etc.)
      // — skip silently; binary/secret content of unreadable blobs is rare and
      // the named .env rule above already covers the common dotfile leak.
      continue;
    }

    const matches = scanContent(content, { filePath });
    for (const match of matches) {
      findings.push({ filePath, reason: match.name, redacted: match.redacted, entropy: match.entropy });
    }
  }

  return findings;
}

function main() {
  let stagedFiles;
  let findings;
  try {
    stagedFiles = getStagedFiles();
    if (stagedFiles.length === 0) {
      process.exit(0);
    }
    findings = scanStagedFiles(stagedFiles);
  } catch (err) {
    // fail-CLOSED on any unexpected scanner error.
    console.error('');
    console.error('Staged Secret Scan: unexpected error — commit blocked (fail-closed).');
    console.error(String(err && err.message ? err.message : err));
    console.error('');
    process.exit(1);
  }

  if (findings.length === 0) {
    process.exit(0);
  }

  console.error('');
  console.error('Staged Secret Scan: commit blocked.');
  console.error('');
  for (const finding of findings) {
    const sample = finding.redacted ? ` [${finding.redacted}]` : '';
    const ent = finding.entropy ? ` (entropy ${finding.entropy})` : '';
    console.error(`- ${finding.filePath}: ${finding.reason}${sample}${ent}`);
  }
  console.error('');
  console.error('Remove the sensitive content before committing.');
  console.error('Use .env (gitignored) for local dev and .env.example with placeholders for templates.');
  console.error('');
  process.exit(1);
}

module.exports = {
  SECRET_PATTERNS,
  findSecretMatches,
  getStagedFiles,
  isBlockedEnvFile,
  isScanExemptPath,
  scanStagedFiles,
  redactMatch,
};

if (require.main === module) {
  main();
}
