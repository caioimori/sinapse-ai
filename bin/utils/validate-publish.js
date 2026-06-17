#!/usr/bin/env node
'use strict';

/**
 * Publish Safety Gate — File Count + Dependency Validation
 * Story INS-4.10, INS-4.12
 *
 * Prevents publishing incomplete packages by validating:
 * 1. Package file count meets minimum threshold (>= 50)
 * 2. (INS-4.12) .sinapse-ai/package.json dependency completeness
 *
 * Exit codes: 0 = PASS, 1 = FAIL
 * Usage: node bin/utils/validate-publish.js
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const PROJECT_ROOT = path.join(__dirname, '..', '..');
const MIN_FILE_COUNT = 50;

let passed = true;
let fileCount = 0;

console.log('--- Publish Safety Gate (INS-4.10) ---\n');

// Check 1: File count threshold via npm pack --dry-run
try {
  const packOutput = execSync('npm pack --dry-run 2>&1', {
    encoding: 'utf8',
    cwd: PROJECT_ROOT,
    timeout: 30000,
  });
  // npm pack --dry-run outputs lines starting with "npm notice" for each file
  const fileLines = packOutput.split('\n').filter(line =>
    line.includes('npm notice') && !line.includes('Tarball') && !line.includes('name:') &&
    !line.includes('version:') && !line.includes('filename:') && !line.includes('package size:') &&
    !line.includes('unpacked size:') && !line.includes('shasum:') && !line.includes('integrity:') &&
    !line.includes('total files:'),
  );
  fileCount = fileLines.length;

  if (fileCount < MIN_FILE_COUNT) {
    console.error(`FAIL: Package has only ${fileCount} files, expected >= ${MIN_FILE_COUNT}.`);
    console.error('  Check that all directories in "files" array are populated.');
    passed = false;
  } else {
    console.log(`PASS: Package contains ${fileCount} files (minimum: ${MIN_FILE_COUNT})`);
  }
} catch (err) {
  console.error(`FAIL: npm pack --dry-run failed: ${err.message}`);
  passed = false;
}

// Check 4 (INS-4.12): .sinapse-ai dependency completeness
console.log('');
console.log('--- Dependency Completeness (INS-4.12) ---\n');
try {
  const depValidatorPath = path.join(PROJECT_ROOT, 'scripts', 'validate-sinapse-ai-deps.js');
  if (fs.existsSync(depValidatorPath)) {
    execSync(`node "${depValidatorPath}"`, {
      encoding: 'utf8',
      cwd: PROJECT_ROOT,
      timeout: 30000,
      stdio: 'inherit',
    });
    console.log('PASS: .sinapse-ai dependency completeness validated');
  } else {
    console.log('SKIP: scripts/validate-sinapse-ai-deps.js not found');
  }
} catch (_depErr) {
  console.error('FAIL: .sinapse-ai dependency completeness check failed');
  console.error('  Fix: Run "node scripts/validate-sinapse-ai-deps.js" to see details');
  passed = false;
}

// Check 5 (E9): Secret scan over the EXACT files that would be published.
// Reuses the shared scanner core, scoped as a RELEASE gate (not the commit-time
// diff scan): it skips vendored node_modules (a dependency's strings are not our
// secret to gate on) and HARD-FAILS only on HIGH-CONFIDENCE key formats
// (sk-proj / AKIA / ghp_ / private keys / real connection strings). The entropy
// backstop and the low-confidence keyword heuristics (Hardcoded Password /
// Bearer Token) are intentionally NOT release-blocking — over a whole package
// they match documentation examples and minified vendor code, which would block
// every release on noise. The git pre-commit hook keeps the stricter,
// diff-scoped scan (entropy + low-confidence) for authored changes.
console.log('');
console.log('--- Secret Scan (E9, packaged files) ---\n');
try {
  const core = require(
    path.join(PROJECT_ROOT, '.sinapse-ai', 'git-hooks', 'lib', 'secret-scanner-core.js'),
  );
  const { isScanExemptPath } = require(
    path.join(PROJECT_ROOT, '.sinapse-ai', 'git-hooks', 'lib', 'staged-secret-scan.js'),
  );
  const lowConfidence = new Set(
    (core.NAMED_PATTERNS || []).filter((p) => p.lowConfidence).map((p) => p.name),
  );
  const packJson = execSync('npm pack --dry-run --json', {
    encoding: 'utf8',
    cwd: PROJECT_ROOT,
    timeout: 60000,
    // npm writes notices to stderr and the JSON result to stdout; capture only stdout.
    stdio: ['ignore', 'pipe', 'ignore'],
    maxBuffer: 32 * 1024 * 1024,
  });
  const files = (JSON.parse(packJson)[0] || {}).files || [];
  // Binary/asset extensions can't carry plaintext secrets and may blow up the reader.
  const BINARY = /\.(png|jpe?g|gif|webp|ico|pdf|zip|gz|tgz|woff2?|ttf|eot|mp4|mp3|wasm|node)$/i;
  const findings = [];
  let scanned = 0;
  for (const f of files) {
    const rel = f.path;
    if (!rel || BINARY.test(rel) || rel.includes('node_modules/') || isScanExemptPath(rel)) continue;
    let content;
    try {
      content = fs.readFileSync(path.join(PROJECT_ROOT, rel), 'utf8');
    } catch {
      continue;
    }
    scanned += 1;
    const hits = core
      .scanContent(content, { filePath: rel, entropy: false })
      .filter((h) => !lowConfidence.has(h.name));
    if (hits.length > 0) findings.push({ file: rel, secrets: [...new Set(hits.map((h) => h.name))] });
  }
  if (findings.length > 0) {
    console.error(`FAIL: ${findings.length} packaged file(s) contain high-confidence secrets — publish blocked:`);
    for (const fnd of findings) console.error(`  - ${fnd.file}: ${fnd.secrets.join(', ')}`);
    passed = false;
  } else {
    console.log(`PASS: no high-confidence secrets in ${scanned} packaged source files`);
  }
} catch (err) {
  // Fail-closed: a broken secret scan must NOT let a publish through silently.
  console.error(`FAIL: secret scan over package could not complete: ${err.message}`);
  passed = false;
}

// Summary
console.log('');
if (passed) {
  console.log(`PUBLISH SAFETY GATE: PASS (${fileCount} files in package)`);
  process.exit(0);
} else {
  console.error('PUBLISH SAFETY GATE: FAIL — publish blocked. Fix issues above before retrying.');
  process.exit(1);
}
