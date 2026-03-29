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

// Summary
console.log('');
if (passed) {
  console.log(`PUBLISH SAFETY GATE: PASS (${fileCount} files in package)`);
  process.exit(0);
} else {
  console.error('PUBLISH SAFETY GATE: FAIL — publish blocked. Fix issues above before retrying.');
  process.exit(1);
}
