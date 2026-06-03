'use strict';

/**
 * Stream B (Frente 4.2) — git-hooks-installer propagation tests.
 *
 * Verifies that installGitHooks():
 *   - sets git core.hooksPath to the managed directory
 *   - writes a Node `.js` pre-commit hook with a `#!/usr/bin/env node` shebang
 *   - bundles the staged-secret-scan library so the hook is self-contained
 *   - is idempotent (running twice does not duplicate / corrupt)
 *   - detects husky and chains to it
 *   - actually BLOCKS a commit with a staged secret, and ALLOWS a placeholder
 *
 * All git is driven with `git -C <dir> ...` against a tmpdir created with
 * fs.mkdtempSync(os.tmpdir()) so the global workspace-routing PreToolUse hook
 * (which rewrites bare `git init` / `mkdir` outside the Workspace) is never
 * triggered — we never run `mkdir` or `git init` as a bare cwd-based command.
 */

const fs = require('fs');
const os = require('os');
const path = require('path');

const { runSafe } = require('../../../../.sinapse-ai/core/utils/spawn-safe');
const {
  installGitHooks,
  detectHusky,
  buildPreCommitHook,
  getCoreHooksPath,
  MANAGED_HOOKS_DIRNAME,
  MANAGED_MARKER,
} = require('../../src/installer/git-hooks-installer');

const GIT_IDENTITY_ARGS = [
  '-c', 'user.email=test@sinapse.local',
  '-c', 'user.name=SINAPSE Test',
  '-c', 'commit.gpgsign=false',
];

/** Create an isolated temp dir (no mkdir command — pure Node fs). */
function makeTempDir() {
  return fs.mkdtempSync(path.join(os.tmpdir(), 'snps-githooks-'));
}

/** Initialize a git repo at dir using `git -C` (avoids workspace-routing). */
async function initRepo(dir) {
  const res = await runSafe('git', ['-C', dir, 'init', '-q']);
  if (!res.success) throw new Error(`git init failed: ${res.stderr}`);
  // Ensure a deterministic default branch / identity for commits.
  await runSafe('git', ['-C', dir, 'symbolic-ref', 'HEAD', 'refs/heads/main']);
}

/** Stage a file (write via Node fs, add via `git -C`). */
async function writeAndStage(dir, relPath, content) {
  const full = path.join(dir, relPath);
  fs.mkdirSync(path.dirname(full), { recursive: true });
  fs.writeFileSync(full, content, 'utf8');
  const res = await runSafe('git', ['-C', dir, 'add', '--', relPath]);
  if (!res.success) throw new Error(`git add failed: ${res.stderr}`);
}

/** Attempt a commit; returns the runSafe result ({success, code, stderr}). */
async function commit(dir, message) {
  return runSafe('git', [...GIT_IDENTITY_ARGS, '-C', dir, 'commit', '-m', message]);
}

function rmrf(dir) {
  try {
    fs.rmSync(dir, { recursive: true, force: true });
  } catch {
    /* best-effort cleanup */
  }
}

describe('git-hooks-installer (Stream B propagation)', () => {
  let gitAvailable = true;

  beforeAll(async () => {
    const res = await runSafe('git', ['--version']).catch(() => ({ success: false }));
    gitAvailable = res.success === true;
  });

  describe('buildPreCommitHook (pure)', () => {
    test('emits a Node hook with the node shebang and managed marker', () => {
      const content = buildPreCommitHook();
      expect(content.startsWith('#!/usr/bin/env node')).toBe(true);
      expect(content).toContain(MANAGED_MARKER);
      expect(content).toContain('staged-secret-scan.js');
      // Never a shell or python hook.
      expect(content).not.toMatch(/^#!\/usr\/bin\/env (sh|bash|python)/);
    });

    test('bakes an explicit chain path when provided', () => {
      const content = buildPreCommitHook({ chainHookRel: '.git/hooks-old/pre-commit' });
      expect(content).toContain('.git/hooks-old/pre-commit');
    });
  });

  describe('detectHusky', () => {
    test('reports false when no .husky/pre-commit exists', () => {
      const dir = makeTempDir();
      try {
        expect(detectHusky(dir).hasHusky).toBe(false);
      } finally {
        rmrf(dir);
      }
    });

    test('reports true when .husky/pre-commit exists', () => {
      const dir = makeTempDir();
      try {
        const huskyDir = path.join(dir, '.husky');
        fs.mkdirSync(huskyDir, { recursive: true });
        fs.writeFileSync(path.join(huskyDir, 'pre-commit'), '#!/usr/bin/env sh\nexit 0\n');
        expect(detectHusky(dir).hasHusky).toBe(true);
      } finally {
        rmrf(dir);
      }
    });
  });

  describe('installGitHooks (filesystem + git config)', () => {
    test('writes a managed Node pre-commit and sets core.hooksPath', async () => {
      if (!gitAvailable) return;
      const dir = makeTempDir();
      try {
        await initRepo(dir);
        const result = await installGitHooks({ projectDir: dir });

        expect(result.success).toBe(true);
        expect(result.coreHooksPathSet).toBe(true);

        const hookPath = path.join(dir, MANAGED_HOOKS_DIRNAME, 'pre-commit');
        expect(fs.existsSync(hookPath)).toBe(true);

        const hookContent = fs.readFileSync(hookPath, 'utf8');
        expect(hookContent.startsWith('#!/usr/bin/env node')).toBe(true);
        expect(hookContent).toContain(MANAGED_MARKER);

        // The scanner lib is bundled next to the hook.
        const libScanner = path.join(dir, MANAGED_HOOKS_DIRNAME, 'lib', 'staged-secret-scan.js');
        expect(fs.existsSync(libScanner)).toBe(true);

        // git config points at the managed dir (forward-slash, project-relative).
        const configured = await getCoreHooksPath(dir);
        expect(configured).toBe('.sinapse-ai/git-hooks');
      } finally {
        rmrf(dir);
      }
    });

    test('is idempotent — running twice keeps a single managed hook', async () => {
      if (!gitAvailable) return;
      const dir = makeTempDir();
      try {
        await initRepo(dir);
        await installGitHooks({ projectDir: dir });
        const firstContent = fs.readFileSync(path.join(dir, MANAGED_HOOKS_DIRNAME, 'pre-commit'), 'utf8');

        const second = await installGitHooks({ projectDir: dir });
        expect(second.success).toBe(true);

        const secondContent = fs.readFileSync(path.join(dir, MANAGED_HOOKS_DIRNAME, 'pre-commit'), 'utf8');
        expect(secondContent).toBe(firstContent);

        // Exactly one pre-commit file in the managed dir (no .bak duplicates).
        const entries = fs.readdirSync(path.join(dir, MANAGED_HOOKS_DIRNAME));
        expect(entries.filter((e) => e.startsWith('pre-commit'))).toEqual(['pre-commit']);

        // core.hooksPath is set once, not appended.
        expect(await getCoreHooksPath(dir)).toBe('.sinapse-ai/git-hooks');
      } finally {
        rmrf(dir);
      }
    });

    test('detects husky and chains to it', async () => {
      if (!gitAvailable) return;
      const dir = makeTempDir();
      try {
        await initRepo(dir);
        const huskyDir = path.join(dir, '.husky');
        fs.mkdirSync(huskyDir, { recursive: true });
        fs.writeFileSync(path.join(huskyDir, 'pre-commit'), '#!/usr/bin/env sh\nexit 0\n');

        const result = await installGitHooks({ projectDir: dir });
        expect(result.success).toBe(true);
        expect(result.huskyDetected).toBe(true);

        const hookContent = fs.readFileSync(path.join(dir, MANAGED_HOOKS_DIRNAME, 'pre-commit'), 'utf8');
        // The runtime chain auto-detects .husky/pre-commit.
        expect(hookContent).toContain('.husky');
        expect(hookContent).toContain('pre-commit');
      } finally {
        rmrf(dir);
      }
    });

    test('rejects a missing projectDir', async () => {
      const result = await installGitHooks({});
      expect(result.success).toBe(false);
      expect(result.error).toMatch(/projectDir/);
    });
  });

  describe('end-to-end commit gating', () => {
    test('BLOCKS a commit that stages a real secret', async () => {
      if (!gitAvailable) return;
      const dir = makeTempDir();
      try {
        await initRepo(dir);
        await installGitHooks({ projectDir: dir });

        // AWS access key — matches the scanner's AKIA pattern.
        await writeAndStage(dir, 'config.js', 'const k = "AKIAIOSFODNN7EXAMPLE";\n');

        const res = await commit(dir, 'should be blocked');
        expect(res.success).toBe(false);
        expect((res.stderr || '') + (res.stdout || '')).toMatch(/Secret Scan|blocked/i);
      } finally {
        rmrf(dir);
      }
    });

    test('ALLOWS a commit of a placeholder .env.example', async () => {
      if (!gitAvailable) return;
      const dir = makeTempDir();
      try {
        await initRepo(dir);
        await installGitHooks({ projectDir: dir });

        await writeAndStage(dir, '.env.example', 'STRIPE_KEY=your-key-here\nDB_PASSWORD=changeme\n');

        const res = await commit(dir, 'add example env');
        expect(res.success).toBe(true);
      } finally {
        rmrf(dir);
      }
    });

    test('fail-CLOSED: a broken scanner lib blocks the commit', async () => {
      if (!gitAvailable) return;
      const dir = makeTempDir();
      try {
        await initRepo(dir);
        await installGitHooks({ projectDir: dir });

        // Corrupt the bundled scanner so require() throws inside the hook.
        const libScanner = path.join(dir, MANAGED_HOOKS_DIRNAME, 'lib', 'staged-secret-scan.js');
        fs.writeFileSync(libScanner, 'throw new Error("corrupted scanner");\n', 'utf8');

        await writeAndStage(dir, 'safe.txt', 'totally harmless content\n');

        const res = await commit(dir, 'should still be blocked');
        expect(res.success).toBe(false);
        expect((res.stderr || '') + (res.stdout || '')).toMatch(/fail-closed|blocking commit/i);
      } finally {
        rmrf(dir);
      }
    });
  });
});
