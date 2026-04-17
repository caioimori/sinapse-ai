'use strict';

const { execFileSync, execSync, spawnSync } = require('child_process');
const fs = require('fs');

function execGit(command) {
  return execSync(command, {
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe'],
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

function parsePushRefs(stdinBuffer) {
  const payload = stdinBuffer.toString('utf8').trim();
  if (!payload) {
    return [];
  }

  return payload
    .split('\n')
    .filter(Boolean)
    .map((line) => {
      const [localRef, localSha, remoteRef, remoteSha] = line.trim().split(/\s+/);
      return { localRef, localSha, remoteRef, remoteSha };
    });
}

function isProtectedPushTarget(remoteRef, defaultBranch) {
  return remoteRef === `refs/heads/${defaultBranch}` || remoteRef === 'refs/heads/master';
}

function branchContainsRemoteDefault(defaultBranch) {
  const result = spawnSync('git', ['merge-base', '--is-ancestor', `origin/${defaultBranch}`, 'HEAD'], {
    stdio: 'ignore',
  });
  return result.status === 0;
}

function fetchRemoteDefault(defaultBranch) {
  execFileSync('git', ['fetch', 'origin', defaultBranch, '--quiet'], {
    stdio: ['ignore', 'ignore', 'pipe'],
  });
}

function main() {
  const defaultBranch = resolveDefaultBranch();
  const branchName = getCurrentBranch();
  const refs = parsePushRefs(fs.readFileSync(0));

  // Allow tag-only pushes (semantic-release pushes release tags from main in CI).
  // Tags do not modify branch history, so branch-protection rules don't apply.
  const tagOnlyPush =
    refs.length > 0 && refs.every((ref) => ref.remoteRef && ref.remoteRef.startsWith('refs/tags/'));
  if (tagOnlyPush) {
    return;
  }

  if (branchName === defaultBranch || branchName === 'master') {
    console.error('');
    console.error(`Pre-push Safety: push blocked on protected branch '${branchName}'.`);
    console.error('Open a feature branch or worktree first.');
    console.error('');
    process.exit(1);
  }

  if (refs.some((ref) => isProtectedPushTarget(ref.remoteRef, defaultBranch))) {
    console.error('');
    console.error(`Pre-push Safety: direct push to '${defaultBranch}' is blocked.`);
    console.error('Open a pull request instead.');
    console.error('');
    process.exit(1);
  }

  try {
    fetchRemoteDefault(defaultBranch);
  } catch {
    console.error('');
    console.error(`Pre-push Safety: could not fetch origin/${defaultBranch}.`);
    console.error('Sync with the remote before pushing.');
    console.error('');
    process.exit(1);
  }

  if (!branchContainsRemoteDefault(defaultBranch)) {
    console.error('');
    console.error(`Pre-push Safety: your branch is missing commits from origin/${defaultBranch}.`);
    console.error(`Merge or rebase origin/${defaultBranch} before pushing.`);
    console.error('');
    process.exit(1);
  }

  process.exit(0);
}

module.exports = {
  branchContainsRemoteDefault,
  getCurrentBranch,
  isProtectedPushTarget,
  parsePushRefs,
  resolveDefaultBranch,
};

if (require.main === module) {
  main();
}
