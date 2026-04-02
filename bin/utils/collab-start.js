'use strict';

const { execFileSync, execSync } = require('child_process');
const path = require('path');

function execGit(command) {
  return execSync(command, {
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe'],
  }).trim();
}

function safeExec(command) {
  try {
    return execGit(command);
  } catch {
    return '';
  }
}

function parseArgs(argv) {
  const parsed = {
    adoptCurrent: false,
    check: false,
    type: 'feat',
    owner: null,
    storyId: null,
    slug: null,
  };

  for (const arg of argv) {
    if (arg === '--adopt-current') {
      parsed.adoptCurrent = true;
      continue;
    }
    if (arg === '--check') {
      parsed.check = true;
      continue;
    }
    if (arg.startsWith('--type=')) {
      parsed.type = arg.split('=')[1] || parsed.type;
      continue;
    }
    if (arg.startsWith('--owner=')) {
      parsed.owner = arg.split('=')[1] || null;
      continue;
    }
    if (!parsed.storyId) {
      parsed.storyId = arg;
      continue;
    }
    if (!parsed.slug) {
      parsed.slug = arg;
    }
  }

  return parsed;
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

function getStatusLines() {
  const output = safeExec('git status --porcelain');
  return output ? output.split('\n').filter(Boolean) : [];
}

function sanitizeSegment(value) {
  return String(value || '')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .replace(/-{2,}/g, '-');
}

function detectOwnerPrefix(explicitOwner) {
  if (explicitOwner) {
    return sanitizeSegment(explicitOwner) || 'dev';
  }

  const rawSignals = [
    safeExec('git config user.name'),
    safeExec('git config user.email'),
    process.env.USERNAME || '',
    process.env.USER || '',
  ]
    .join(' ')
    .toLowerCase();

  if (/(caio|imori)/.test(rawSignals)) {
    return 'caio';
  }

  if (/(matheus|soier|sawyer)/.test(rawSignals)) {
    return 'soier';
  }

  return 'dev';
}

function buildWorkItemSlug(storyId, slug) {
  const sanitizedStory = sanitizeSegment(storyId);
  const sanitizedSlug = sanitizeSegment(slug || storyId);
  if (!sanitizedSlug) {
    return sanitizedStory;
  }
  if (!sanitizedStory) {
    return sanitizedSlug;
  }
  return sanitizedSlug.startsWith(`${sanitizedStory}-`) || sanitizedSlug === sanitizedStory
    ? sanitizedSlug
    : `${sanitizedStory}-${sanitizedSlug}`;
}

function buildBranchName({ owner, type, storyId, slug }) {
  return `${owner}/${sanitizeSegment(type) || 'feat'}/${buildWorkItemSlug(storyId, slug)}`;
}

function buildWorktreePath(worktreeKey) {
  return path.join(process.cwd(), '.sinapse', 'worktrees', worktreeKey);
}

function ensureReadyDefaultBranch(defaultBranch) {
  const branchName = getCurrentBranch();
  const statusLines = getStatusLines();

  if (branchName !== defaultBranch) {
    throw new Error(
      `Run collab:start from a clean '${defaultBranch}' checkout. Current branch: '${branchName}'.`,
    );
  }

  if (statusLines.length > 0) {
    throw new Error(
      `Working tree is dirty on '${defaultBranch}'. Commit or stash your changes before opening a new worktree.`,
    );
  }
}

function ensureOnDefaultBranch(defaultBranch) {
  const branchName = getCurrentBranch();
  if (branchName !== defaultBranch) {
    throw new Error(
      `Run this command from '${defaultBranch}'. Current branch: '${branchName}'.`,
    );
  }
}

function ensureUpToDate(defaultBranch) {
  execFileSync('git', ['fetch', 'origin'], {
    stdio: ['ignore', 'ignore', 'pipe'],
  });

  const localSha = safeExec(`git rev-parse ${defaultBranch}`);
  const remoteSha = safeExec(`git rev-parse origin/${defaultBranch}`);

  if (localSha && remoteSha && localSha !== remoteSha) {
    execFileSync('git', ['pull', '--ff-only', 'origin', defaultBranch], {
      stdio: 'inherit',
    });
  }
}

function createWorktree({ branchName, defaultBranch, worktreePath }) {
  execFileSync('git', ['worktree', 'add', worktreePath, '-b', branchName, defaultBranch], {
    stdio: 'inherit',
  });
}

function adoptCurrentWorkspace(branchName) {
  execFileSync('git', ['checkout', '-b', branchName], {
    stdio: 'inherit',
  });
}

function runCheck() {
  const defaultBranch = resolveDefaultBranch();
  const currentBranch = getCurrentBranch();
  const statusLines = getStatusLines();
  const owner = detectOwnerPrefix(null);

  console.log(`Default branch: ${defaultBranch}`);
  console.log(`Current branch: ${currentBranch}`);
  console.log(`Detected maintainer prefix: ${owner}`);
  console.log(`Working tree clean: ${statusLines.length === 0 ? 'yes' : 'no'}`);
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  if (args.check) {
    runCheck();
    return;
  }

  if (!args.storyId) {
    console.error(
      'Usage: npm run collab:start -- <story-id> <slug> [--type=feat] [--owner=caio] [--adopt-current]',
    );
    process.exit(1);
  }

  const defaultBranch = resolveDefaultBranch();
  const owner = detectOwnerPrefix(args.owner);
  const branchName = buildBranchName({
    owner,
    type: args.type,
    storyId: args.storyId,
    slug: args.slug,
  });
  const worktreeKey = sanitizeSegment(branchName.replace(/\//g, '-'));
  const worktreePath = buildWorktreePath(worktreeKey);

  try {
    if (args.adoptCurrent) {
      ensureOnDefaultBranch(defaultBranch);
      adoptCurrentWorkspace(branchName);
    } else {
      ensureReadyDefaultBranch(defaultBranch);
      ensureUpToDate(defaultBranch);
      createWorktree({ branchName, defaultBranch, worktreePath });
    }
  } catch (error) {
    console.error('');
    console.error(`collab:start failed: ${error.message}`);
    console.error('');
    process.exit(1);
  }

  console.log('');
  if (args.adoptCurrent) {
    console.log('Current workspace adopted into a safe maintainer branch.');
    console.log(`Branch: ${branchName}`);
    console.log('');
    console.log('Continue working in the current directory, now outside main.');
  } else {
    console.log('Safe maintainer workspace created.');
    console.log(`Branch:   ${branchName}`);
    console.log(`Worktree: ${worktreePath}`);
    console.log('');
    console.log(`Next step: cd "${worktreePath}"`);
  }
  console.log('');
}

module.exports = {
  buildBranchName,
  buildWorkItemSlug,
  detectOwnerPrefix,
  parseArgs,
  resolveDefaultBranch,
  sanitizeSegment,
};

if (require.main === module) {
  main();
}
