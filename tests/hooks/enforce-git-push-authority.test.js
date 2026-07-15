// File: tests/hooks/enforce-git-push-authority.test.js

/**
 * enforce-git-push-authority.sh Test Suite (Story 10.15)
 *
 * Validates the push authority hook's agent detection logic:
 *   AC 1: active agent "devops" → exit 0 (allow)
 *   AC 2: any other active agent → deny
 *   AC 3: missing/malformed session-state.json → deny (fail-closed)
 *   AC 9: no regression to existing 5 command-detection patterns
 *
 * The hook is a bash script, so tests spawn it via `bash` with controlled
 * CLAUDE_PROJECT_DIR pointing at an isolated temp directory. Each test
 * seeds (or omits) `.sinapse/session-state.json` to simulate the agent.
 */

'use strict';

const { spawnSync } = require('child_process');
const fs = require('fs');
const os = require('os');
const path = require('path');

const HOOK_PATH = path.resolve(
  __dirname,
  '..',
  '..',
  '.claude',
  'hooks',
  'enforce-git-push-authority.sh',
);

function makeTempRoot() {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'sinapse-push-hook-'));
  return dir;
}

function writeSessionState(root, state) {
  const sinapseDir = path.join(root, '.sinapse');
  fs.mkdirSync(sinapseDir, { recursive: true });
  fs.writeFileSync(
    path.join(sinapseDir, 'session-state.json'),
    typeof state === 'string' ? state : JSON.stringify(state, null, 2),
    'utf8',
  );
}

function toBashPath(filePath) {
  if (process.platform !== 'win32') return filePath;
  const normalized = filePath.replace(/\\/g, '/');
  const match = normalized.match(/^([A-Za-z]):\/(.*)$/);
  return match ? `/mnt/${match[1].toLowerCase()}/${match[2]}` : normalized;
}

function quoteBash(value) {
  const escapedSingleQuote = String.fromCharCode(39, 34, 39, 34, 39);
  return `'${value.replace(/'/g, escapedSingleQuote)}'`;
}

const bashPathCache = new Map();

function toRuntimeBashPath(filePath) {
  if (process.platform !== 'win32') return filePath;
  if (bashPathCache.has(filePath)) return bashPathCache.get(filePath);

  const converted = spawnSync('bash', ['-c', `cygpath -u ${quoteBash(filePath)}`], {
    encoding: 'utf8',
  });
  const resolved = converted.status === 0 && converted.stdout.trim()
    ? converted.stdout.trim()
    : toBashPath(filePath);
  bashPathCache.set(filePath, resolved);
  return resolved;
}

function runHook({ command, projectRoot }) {
  const input = JSON.stringify({
    tool_name: 'Bash',
    tool_input: { command },
  });

  const bashArgs = process.platform === 'win32'
    ? [
      '-c',
      `export CLAUDE_PROJECT_DIR=${quoteBash(toRuntimeBashPath(projectRoot))}; `
        + `exec ${quoteBash(toRuntimeBashPath(HOOK_PATH))}`,
    ]
    : [HOOK_PATH];
  const result = spawnSync('bash', bashArgs, {
    input,
    env: process.platform === 'win32'
      ? process.env
      : { ...process.env, CLAUDE_PROJECT_DIR: projectRoot },
    encoding: 'utf8',
  });

  return {
    status: result.status,
    stdout: (result.stdout || '').trim(),
    stderr: (result.stderr || '').trim(),
  };
}

function isDenied(stdout) {
  if (!stdout) return false;
  try {
    const parsed = JSON.parse(stdout);
    return parsed?.hookSpecificOutput?.permissionDecision === 'deny';
  } catch {
    return false;
  }
}

describe('enforce-git-push-authority.sh — agent detection (Story 10.15)', () => {
  let tmpRoot;

  beforeEach(() => {
    tmpRoot = makeTempRoot();
  });

  afterEach(() => {
    try {
      fs.rmSync(tmpRoot, { recursive: true, force: true });
    } catch {
      /* ignore */
    }
  });

  describe('AC 1 — active agent is devops', () => {
    test('allows `git push origin main` when lastAgent === "devops"', () => {
      writeSessionState(tmpRoot, { lastAgent: 'devops' });
      const res = runHook({
        command: 'git push origin main',
        projectRoot: tmpRoot,
      });

      expect(res.status).toBe(0);
      expect(isDenied(res.stdout)).toBe(false);
    });

    test('allows `git push --force-with-lease` when lastAgent === "devops"', () => {
      writeSessionState(tmpRoot, { lastAgent: 'devops' });
      const res = runHook({
        command: 'git push --force-with-lease origin feature',
        projectRoot: tmpRoot,
      });

      expect(res.status).toBe(0);
      expect(isDenied(res.stdout)).toBe(false);
    });
  });

  describe('AC 2 — active agent is NOT devops', () => {
    test('denies `git push` when lastAgent === "developer"', () => {
      writeSessionState(tmpRoot, { lastAgent: 'developer' });
      const res = runHook({
        command: 'git push origin main',
        projectRoot: tmpRoot,
      });

      expect(isDenied(res.stdout)).toBe(true);
      expect(res.stdout).toContain('EXCLUSIVE to @devops');
    });

    test('denies `git push` when lastAgent === "architect"', () => {
      writeSessionState(tmpRoot, { lastAgent: 'architect' });
      const res = runHook({
        command: 'git push origin main',
        projectRoot: tmpRoot,
      });

      expect(isDenied(res.stdout)).toBe(true);
    });

    test('denies `git push` when lastAgent is missing from the state', () => {
      writeSessionState(tmpRoot, { somethingElse: true });
      const res = runHook({
        command: 'git push origin main',
        projectRoot: tmpRoot,
      });

      expect(isDenied(res.stdout)).toBe(true);
    });
  });

  describe('AC 3 — fail-closed on missing / malformed state', () => {
    test('denies `git push` when .sinapse/session-state.json does not exist', () => {
      // No state seeded
      const res = runHook({
        command: 'git push origin main',
        projectRoot: tmpRoot,
      });

      expect(isDenied(res.stdout)).toBe(true);
    });

    test('denies `git push` when session-state.json is malformed JSON', () => {
      writeSessionState(tmpRoot, '{ this is not: valid json');
      const res = runHook({
        command: 'git push origin main',
        projectRoot: tmpRoot,
      });

      expect(isDenied(res.stdout)).toBe(true);
    });
  });

  describe('AC 9 — no regression on existing detection patterns (non-devops)', () => {
    beforeEach(() => {
      writeSessionState(tmpRoot, { lastAgent: 'developer' });
    });

    test('still denies pipe-to-shell containing "push"', () => {
      const res = runHook({
        command: 'echo "git push origin main" | bash',
        projectRoot: tmpRoot,
      });
      expect(isDenied(res.stdout)).toBe(true);
    });

    test('still denies eval push patterns', () => {
      const res = runHook({
        command: 'eval "git push origin main"',
        projectRoot: tmpRoot,
      });
      expect(isDenied(res.stdout)).toBe(true);
    });

    test('still denies node -e push patterns', () => {
      const res = runHook({
        command: "node -e \"require('child_process').execSync('git push origin main')\"",
        projectRoot: tmpRoot,
      });
      expect(isDenied(res.stdout)).toBe(true);
    });

    test('allows non-push commands (baseline)', () => {
      const res = runHook({
        command: 'git status',
        projectRoot: tmpRoot,
      });
      expect(res.status).toBe(0);
      expect(isDenied(res.stdout)).toBe(false);
    });
  });
});
