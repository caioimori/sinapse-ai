'use strict';

const { execSync } = require('child_process');

function execGit(command, options = {}) {
  return execSync(command, {
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe'],
    ...options,
  }).trim();
}

function resolveDefaultBranch() {
  try {
    const remoteHead = execGit('git symbolic-ref --short refs/remotes/origin/HEAD');
    return remoteHead.replace(/^origin\//, '');
  } catch {
    return 'main';
  }
}

function getCurrentBranch() {
  return execGit('git rev-parse --abbrev-ref HEAD');
}

function getStagedFiles() {
  try {
    const output = execGit('git diff --cached --name-only');
    return output ? output.split('\n').filter(Boolean) : [];
  } catch {
    return [];
  }
}

function shouldBlockCommit({ branchName, defaultBranch, stagedFiles }) {
  const protectedBranches = new Set([defaultBranch, 'master']);
  return Boolean(stagedFiles.length) && (protectedBranches.has(branchName) || branchName === 'HEAD');
}

function main() {
  const defaultBranch = resolveDefaultBranch();
  const branchName = getCurrentBranch();
  const stagedFiles = getStagedFiles();

  if (!shouldBlockCommit({ branchName, defaultBranch, stagedFiles })) {
    process.exit(0);
  }

  console.error('');
  console.error('Git Branch Guard: commit blocked.');
  console.error('');
  if (branchName === 'HEAD') {
    console.error('You are in detached HEAD state. Create an isolated branch or worktree first.');
  } else {
    console.error(`Commits are blocked on the protected branch '${branchName}'.`);
  }
  console.error('');
  console.error('Start a safe maintainer workspace first:');
  console.error('  npm run collab:start -- <story-id> <slug>');
  console.error('');
  console.error('Example:');
  console.error('  npm run collab:start -- 7.7.4 codex-collab-hardening');
  console.error('');
  process.exit(1);
}

module.exports = {
  getCurrentBranch,
  getStagedFiles,
  resolveDefaultBranch,
  shouldBlockCommit,
};

if (require.main === module) {
  main();
}
