'use strict';

const { execFileSync, execSync } = require('child_process');

const BLOCKED_ENV_FILE_PATTERN = /(^|\/)\.env(\..+)?$/i;
const SAFE_ENV_FILE_PATTERN = /(^|\/)\.env\.(example|sample|template)$/i;
const SECRET_PATTERNS = [
  { label: 'private key', pattern: /BEGIN (RSA|DSA|EC|OPENSSH|PGP) PRIVATE KEY/ },
  { label: 'generic private key', pattern: /BEGIN PRIVATE KEY/ },
  { label: 'GitHub personal token', pattern: /\bgh[pousr]_[A-Za-z0-9]{20,}\b/ },
  { label: 'GitHub fine-grained token', pattern: /\bgithub_pat_[A-Za-z0-9_]{20,}\b/ },
  { label: 'OpenAI key', pattern: /\bsk-(proj-)?[A-Za-z0-9_-]{20,}\b/ },
  { label: 'AWS access key', pattern: /\bAKIA[0-9A-Z]{16}\b/ },
  { label: 'Google API key', pattern: /\bAIza[0-9A-Za-z\-_]{35}\b/ },
  { label: 'Slack token', pattern: /\bxox[baprs]-[A-Za-z0-9-]{10,}\b/ },
];

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
  try {
    return execFileSync('git', ['show', `:${filePath}`], {
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'pipe'],
      maxBuffer: 5 * 1024 * 1024,
    });
  } catch {
    return '';
  }
}

function findSecretMatches(content) {
  const matches = [];
  for (const descriptor of SECRET_PATTERNS) {
    if (descriptor.pattern.test(content)) {
      matches.push(descriptor.label);
    }
  }
  return matches;
}

function scanStagedFiles(files) {
  const findings = [];

  for (const filePath of files) {
    if (isBlockedEnvFile(filePath)) {
      findings.push({ filePath, reason: 'environment file' });
      continue;
    }

    // Skip security test files (they contain intentional fake patterns for testing detection)
    if (filePath.startsWith('tests/security/') && filePath.endsWith('.test.js')) {
      continue;
    }

    const content = readStagedFile(filePath);
    const matches = findSecretMatches(content);
    for (const match of matches) {
      findings.push({ filePath, reason: match });
    }
  }

  return findings;
}

function main() {
  const stagedFiles = getStagedFiles();
  if (stagedFiles.length === 0) {
    process.exit(0);
  }

  const findings = scanStagedFiles(stagedFiles);
  if (findings.length === 0) {
    process.exit(0);
  }

  console.error('');
  console.error('Staged Secret Scan: commit blocked.');
  console.error('');
  for (const finding of findings) {
    console.error(`- ${finding.filePath}: ${finding.reason}`);
  }
  console.error('');
  console.error('Remove the sensitive content before committing.');
  console.error('');
  process.exit(1);
}

module.exports = {
  SECRET_PATTERNS,
  findSecretMatches,
  getStagedFiles,
  isBlockedEnvFile,
  scanStagedFiles,
};

if (require.main === module) {
  main();
}
