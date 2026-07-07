/**
 * Tests for the enforce-story-gate PreToolUse hook.
 *
 * Story mesa2-docfirst-gate-coverage: locks the expanded code detection (any
 * code file in a non-exempt, non-config location requires a Ready story), the
 * config/build exemptions, and the framework-repo exception (Art. III).
 *
 * Spawns the hook as a child process with mock stdin + CLAUDE_PROJECT_DIR,
 * asserting exit 0 (allow) vs exit 2 (block).
 */

'use strict';

const fs = require('fs');
const os = require('os');
const path = require('path');
const { execFileSync } = require('child_process');

const HOOK = path.join(__dirname, '..', '..', '.claude', 'hooks', 'enforce-story-gate.cjs');

function mkTmp() {
  return fs.mkdtempSync(path.join(os.tmpdir(), 'storygate-'));
}

function runHook(projectDir, filePath, { tool = 'Write' } = {}) {
  const input = JSON.stringify({ tool_name: tool, tool_input: { file_path: filePath } });
  try {
    execFileSync(process.execPath, [HOOK], {
      input,
      env: { ...process.env, CLAUDE_PROJECT_DIR: projectDir },
      stdio: ['pipe', 'pipe', 'pipe'],
    });
    return 0;
  } catch (err) {
    return typeof err.status === 'number' ? err.status : -1;
  }
}

function writeFile(root, rel, content = 'x') {
  const full = path.join(root, rel);
  fs.mkdirSync(path.dirname(full), { recursive: true });
  fs.writeFileSync(full, content);
}

/** A project with a valid Ready story (satisfies the story gate). */
function withReadyStory(root) {
  writeFile(root, 'docs/stories/1.1.md', '---\nstatus: "Ready"\n---\n# S');
}

describe('enforce-story-gate hook', () => {
  it('BLOCKS code in the original allowlist dirs without a Ready story (no regression)', () => {
    const root = mkTmp();
    expect(runHook(root, path.join(root, 'src', 'index.js'))).toBe(2);
    expect(runHook(root, path.join(root, 'packages', 'a', 'x.ts'))).toBe(2);
  });

  it('ALLOWS the same code once a Ready story exists', () => {
    const root = mkTmp();
    withReadyStory(root);
    expect(runHook(root, path.join(root, 'src', 'index.js'))).toBe(0);
  });

  describe('expanded code detection (the coverage gap)', () => {
    it('BLOCKS code in dirs outside the old allowlist without a story', () => {
      const root = mkTmp();
      expect(runHook(root, path.join(root, 'server', 'api.ts'))).toBe(2);
      expect(runHook(root, path.join(root, 'functions', 'handler.js'))).toBe(2);
      expect(runHook(root, path.join(root, 'routes', 'users.rb'))).toBe(2);
    });

    it('BLOCKS a code file at the project ROOT without a story', () => {
      const root = mkTmp();
      expect(runHook(root, path.join(root, 'index.ts'))).toBe(2);
    });

    it('ALLOWS those same paths once a Ready story exists', () => {
      const root = mkTmp();
      withReadyStory(root);
      expect(runHook(root, path.join(root, 'server', 'api.ts'))).toBe(0);
      expect(runHook(root, path.join(root, 'index.ts'))).toBe(0);
    });
  });

  describe('exemptions (never over-block)', () => {
    it('ALLOWS config-like files anywhere without a story', () => {
      const root = mkTmp();
      expect(runHook(root, path.join(root, 'vitest.config.ts'))).toBe(0);
      expect(runHook(root, path.join(root, 'src', 'app.config.mjs'))).toBe(0);
      expect(runHook(root, path.join(root, 'types', 'x.d.ts'))).toBe(0);
      expect(runHook(root, path.join(root, '.prettierrc.cjs'))).toBe(0);
    });

    it('ALLOWS build-output dirs without a story', () => {
      const root = mkTmp();
      expect(runHook(root, path.join(root, '.next', 'x.js'))).toBe(0);
      expect(runHook(root, path.join(root, 'dist', 'bundle.js'))).toBe(0);
    });

    it('ALLOWS exempt paths and non-code files', () => {
      const root = mkTmp();
      expect(runHook(root, path.join(root, 'docs', 'note.js'))).toBe(0);
      expect(runHook(root, path.join(root, 'tests', 'a.test.js'))).toBe(0);
      expect(runHook(root, path.join(root, 'random.txt'))).toBe(0);
    });
  });

  describe('framework repo exception (Art. III)', () => {
    it("ALLOWS the framework's own repo even without a story", () => {
      const root = mkTmp();
      writeFile(root, 'package.json', '{"name":"sinapse-ai"}');
      expect(runHook(root, path.join(root, 'scripts', 'validate-x.js'))).toBe(0);
      expect(runHook(root, path.join(root, 'src', 'index.js'))).toBe(0);
    });

    it('still BLOCKS a normal project (different package name) without a story', () => {
      const root = mkTmp();
      writeFile(root, 'package.json', '{"name":"client-app"}');
      expect(runHook(root, path.join(root, 'src', 'index.js'))).toBe(2);
    });
  });

  it('ALLOWS non-Write/Edit tools', () => {
    const root = mkTmp();
    expect(runHook(root, path.join(root, 'src', 'index.js'), { tool: 'Read' })).toBe(0);
  });
});
