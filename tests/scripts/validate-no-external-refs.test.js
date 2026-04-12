/**
 * Unit tests for scripts/validate-no-external-refs.js (Story 10.17, Task 5).
 *
 * QA v1.1 — The validator now uses `git ls-files` as its source of truth
 * (instead of a custom .gitignore parser), so fixtures MUST be real git
 * repositories: `git init` + `git add` to track files we want scanned, and
 * leave files untracked to simulate gitignored content.
 *
 * Each test case creates its own isolated root under os.tmpdir() so they do
 * not interfere with each other or with the real repo.
 */

'use strict';

const fs = require('fs');
const os = require('os');
const path = require('path');
const { execSync } = require('child_process');

const {
  validateNoExternalRefs,
  isAllowListed,
  formatViolation,
  listTrackedFiles,
} = require('../../scripts/validate-no-external-refs');

// ── fixture helpers ─────────────────────────────────────────────────────────

function makeTmpRoot(label) {
  return fs.mkdtempSync(path.join(os.tmpdir(), `sinapse-ext-refs-${label}-`));
}

function writeFile(root, relPath, content) {
  const abs = path.join(root, relPath);
  fs.mkdirSync(path.dirname(abs), { recursive: true });
  fs.writeFileSync(abs, content, 'utf8');
}

/**
 * Initialize a bare-bones git repo in `root`. We configure user.name and
 * user.email locally (not globally) so `git add` / `git commit` succeed in
 * CI environments where git identity is not pre-configured. The repo is
 * initialized with `-b main` so behavior is stable across git versions.
 */
function initGit(root) {
  const run = (cmd) =>
    execSync(cmd, { cwd: root, stdio: ['ignore', 'pipe', 'pipe'] });
  run('git init -b main');
  run('git config user.email "test@sinapse.local"');
  run('git config user.name "Sinapse Test"');
  run('git config commit.gpgsign false');
}

/**
 * Stage a file in the git index so it becomes part of `git ls-files`. We
 * don't need to commit — staged files are enough for the scanner.
 */
function gitAdd(root, relPath) {
  execSync(`git add -- "${relPath}"`, {
    cwd: root,
    stdio: ['ignore', 'pipe', 'pipe'],
  });
}

function cleanup(root) {
  try {
    fs.rmSync(root, { recursive: true, force: true });
  } catch {
    /* best effort */
  }
}

describe('validate-no-external-refs', () => {
  // ─────────────────────────────────────────────────────────────────────────
  describe('clean fixture', () => {
    let root;

    beforeAll(() => {
      root = makeTmpRoot('clean');
      initGit(root);
      writeFile(root, 'README.md', [
        '# SINAPSE',
        '',
        'Authorial voice with no external references.',
        '',
      ].join('\n'));
      writeFile(root, 'src/index.js', [
        '// SINAPSE core module',
        'module.exports = {};',
        '',
      ].join('\n'));
      gitAdd(root, 'README.md');
      gitAdd(root, 'src/index.js');
    });

    afterAll(() => cleanup(root));

    test('returns ok=true with zero violations', () => {
      const result = validateNoExternalRefs(root);
      expect(result.ok).toBe(true);
      expect(result.violations).toEqual([]);
      expect(result.scanned.length).toBe(2);
    });
  });

  // ─────────────────────────────────────────────────────────────────────────
  describe('dirty fixture — single lowercase violation', () => {
    let root;

    beforeAll(() => {
      root = makeTmpRoot('dirty-lower');
      initGit(root);
      writeFile(root, 'src/bad.js', [
        '// This references a-i-o-x (forbidden) but we interpolate to avoid self-trip',
        '// actual token assembled at runtime below',
        'const forbidden = ["a","i","o","x"].join("");',
        '',
      ].join('\n'));
      // Intentionally write the literal forbidden token via buffer so the
      // test SOURCE file doesn't contain it (the validator's allow-list
      // only covers scripts/validate-no-external-refs.js and this test
      // file — wait, actually it covers this test file too, so we can use
      // the literal). Keep it straightforward:
      writeFile(root, 'src/literal.js', [
        '// This references aiox which is forbidden',
        'const x = 1;',
        '',
      ].join('\n'));
      gitAdd(root, 'src/bad.js');
      gitAdd(root, 'src/literal.js');
    });

    afterAll(() => cleanup(root));

    test('returns ok=false and reports the violation with file, line, match', () => {
      const result = validateNoExternalRefs(root);
      expect(result.ok).toBe(false);
      expect(result.violations.length).toBeGreaterThanOrEqual(1);

      const v = result.violations.find((x) => x.file === 'src/literal.js');
      expect(v).toBeDefined();
      expect(v.line).toBe(1);
      expect(typeof v.match).toBe('string');
      expect(v.match.toLowerCase()).toMatch(/aiox/);
    });

    test('formatViolation produces the AC 4 output format', () => {
      const result = validateNoExternalRefs(root);
      const v = result.violations.find((x) => x.file === 'src/literal.js');
      const formatted = formatViolation(v);
      expect(formatted).toContain('❌ External reference detected');
      expect(formatted).toContain('File: src/literal.js');
      expect(formatted).toContain('Line: 1');
      expect(formatted).toMatch(/Match: /);
      expect(formatted).toContain(
        'Fix: Remove the reference. This repo uses authorial SINAPSE voice only.',
      );
      expect(formatted).toContain(
        'Only LICENSE may contain these references (legal requirement).',
      );
    });
  });

  // ─────────────────────────────────────────────────────────────────────────
  describe('uppercase / mixed-case violation', () => {
    let root;

    beforeAll(() => {
      root = makeTmpRoot('dirty-upper');
      initGit(root);
      // Uppercase form must also be caught (regex is case-insensitive).
      writeFile(root, 'docs/notes.md', ['# Notes', 'Ref: AIOX upstream.', ''].join('\n'));
      gitAdd(root, 'docs/notes.md');
    });

    afterAll(() => cleanup(root));

    test('uppercase AIOX triggers a violation', () => {
      const result = validateNoExternalRefs(root);
      expect(result.ok).toBe(false);
      const match = result.violations.find((v) => v.file === 'docs/notes.md');
      expect(match).toBeDefined();
      expect(match.match).toMatch(/AIOX/);
    });
  });

  // ─────────────────────────────────────────────────────────────────────────
  describe('LICENSE allow-list', () => {
    let root;

    beforeAll(() => {
      root = makeTmpRoot('license');
      initGit(root);
      // LICENSE is allow-listed — having a forbidden term here MUST NOT fail.
      writeFile(
        root,
        'LICENSE',
        [
          'MIT License',
          '',
          'Copyright (c) 2024 Upstream aiox attribution chain.',
          '',
        ].join('\n'),
      );
      gitAdd(root, 'LICENSE');
    });

    afterAll(() => cleanup(root));

    test('LICENSE with a forbidden term does not trigger a violation', () => {
      const result = validateNoExternalRefs(root);
      expect(result.ok).toBe(true);
      expect(result.violations).toEqual([]);
    });
  });

  // ─────────────────────────────────────────────────────────────────────────
  describe('research-synthesis-for-upgrade.md allow-list', () => {
    let root;

    beforeAll(() => {
      root = makeTmpRoot('research');
      initGit(root);
      writeFile(
        root,
        'docs/research-synthesis-for-upgrade.md',
        [
          '# Historical research',
          '',
          'This document references synkra and aiox for historical context.',
          '',
        ].join('\n'),
      );
      gitAdd(root, 'docs/research-synthesis-for-upgrade.md');
    });

    afterAll(() => cleanup(root));

    test('allow-listed historical doc is skipped even when it contains forbidden terms', () => {
      const result = validateNoExternalRefs(root);
      expect(result.ok).toBe(true);
      expect(result.violations).toEqual([]);
    });
  });

  // ─────────────────────────────────────────────────────────────────────────
  describe('pre-existing BMAD fork attribution allow-list (QA v1.1)', () => {
    let root;

    beforeAll(() => {
      root = makeTmpRoot('bmad-fork');
      initGit(root);
      writeFile(
        root,
        'squads/claude-code-mastery/README.md',
        [
          '# Claude Code Mastery',
          '',
          'This squad was originally forked from the BMAD Method project.',
          '',
        ].join('\n'),
      );
      gitAdd(root, 'squads/claude-code-mastery/README.md');
    });

    afterAll(() => cleanup(root));

    test('pre-existing fork README is allow-listed', () => {
      const result = validateNoExternalRefs(root);
      expect(result.ok).toBe(true);
      expect(result.violations).toEqual([]);
    });
  });

  // ─────────────────────────────────────────────────────────────────────────
  describe('new file under an allow-listed tree is still BLOCKED', () => {
    let root;

    beforeAll(() => {
      root = makeTmpRoot('new-under-tree');
      initGit(root);
      // A NEW agent file under squads/claude-code-mastery/agents/ that is NOT
      // skill-craftsman.md (which IS allow-listed). The validator MUST flag
      // this, because the allow-list uses exact-path matching, not directory
      // prefix matching.
      writeFile(
        root,
        'squads/claude-code-mastery/agents/new-agent.md',
        [
          '# New Agent',
          '',
          'This agent references BMAD for some reason.',
          '',
        ].join('\n'),
      );
      gitAdd(root, 'squads/claude-code-mastery/agents/new-agent.md');
    });

    afterAll(() => cleanup(root));

    test('new non-allow-listed file under squads/claude-code-mastery triggers violation', () => {
      const result = validateNoExternalRefs(root);
      expect(result.ok).toBe(false);
      const v = result.violations.find(
        (x) => x.file === 'squads/claude-code-mastery/agents/new-agent.md',
      );
      expect(v).toBeDefined();
      expect(v.match.toLowerCase()).toBe('bmad');
    });
  });

  // ─────────────────────────────────────────────────────────────────────────
  describe('untracked files are never scanned (QA v1.1 — git ls-files as source of truth)', () => {
    let root;

    beforeAll(() => {
      root = makeTmpRoot('untracked');
      initGit(root);
      // Tracked: clean README
      writeFile(root, 'README.md', ['# Clean', ''].join('\n'));
      gitAdd(root, 'README.md');
      // UNTRACKED: file with forbidden term, never `git add`-ed. This
      // simulates a gitignored or work-in-progress file that should never
      // appear in git ls-files output.
      writeFile(
        root,
        '.sinapse-ai/internal/aiox-feature-map.md',
        [
          '# Internal reference (untracked)',
          '',
          'This file references aiox, synkra, bmad for internal analysis.',
          '',
        ].join('\n'),
      );
    });

    afterAll(() => cleanup(root));

    test('untracked file is not in the scanned list', () => {
      const result = validateNoExternalRefs(root);
      expect(
        result.scanned.includes('.sinapse-ai/internal/aiox-feature-map.md'),
      ).toBe(false);
    });

    test('scan passes overall because untracked file is skipped', () => {
      const result = validateNoExternalRefs(root);
      expect(result.ok).toBe(true);
      expect(result.violations).toEqual([]);
    });

    test('scanned list equals git ls-files output', () => {
      const tracked = listTrackedFiles(root);
      const result = validateNoExternalRefs(root);
      expect(result.scanned).toEqual(tracked);
      expect(tracked).toContain('README.md');
      expect(tracked).not.toContain('.sinapse-ai/internal/aiox-feature-map.md');
    });
  });

  // ─────────────────────────────────────────────────────────────────────────
  describe('bonus — every term in the regex is caught', () => {
    let root;

    beforeAll(() => {
      root = makeTmpRoot('all-terms');
      initGit(root);
      writeFile(root, 'src/terms.md', [
        '# Terms',
        'line with aiox',
        'line with synkra',
        'line with synkraai',
        'line with bmad',
        '',
      ].join('\n'));
      gitAdd(root, 'src/terms.md');
    });

    afterAll(() => cleanup(root));

    test('all four forbidden terms (aiox, synkra, synkraai, bmad) produce violations', () => {
      const result = validateNoExternalRefs(root);
      expect(result.ok).toBe(false);

      const matched = new Set(
        result.violations
          .filter((v) => v.file === 'src/terms.md')
          .map((v) => v.match.toLowerCase()),
      );
      expect(matched.has('aiox')).toBe(true);
      expect(matched.has('synkra')).toBe(true);
      expect(matched.has('synkraai')).toBe(true);
      expect(matched.has('bmad')).toBe(true);
    });
  });

  // ─────────────────────────────────────────────────────────────────────────
  describe('word-boundary safety — SINAPSE and sinapse-ai must NOT match', () => {
    let root;

    beforeAll(() => {
      root = makeTmpRoot('word-boundary');
      initGit(root);
      writeFile(
        root,
        'src/clean.md',
        [
          '# Clean doc',
          'Welcome to sinapse-ai. SINAPSE is authorial.',
          'We use npm package "sinapse-ai" as the canonical name.',
          '',
        ].join('\n'),
      );
      gitAdd(root, 'src/clean.md');
    });

    afterAll(() => cleanup(root));

    test('sinapse-ai and SINAPSE do not trip the regex (no substring match of forbidden terms)', () => {
      const result = validateNoExternalRefs(root);
      expect(result.ok).toBe(true);
      expect(result.violations).toEqual([]);
    });
  });

  // ─────────────────────────────────────────────────────────────────────────
  describe('isAllowListed unit', () => {
    test('LICENSE is allow-listed', () => {
      expect(isAllowListed('LICENSE')).toBe(true);
    });

    test('historical doc is allow-listed', () => {
      expect(isAllowListed('docs/research-synthesis-for-upgrade.md')).toBe(true);
    });

    test('validator script is allow-listed (self-reference)', () => {
      expect(isAllowListed('scripts/validate-no-external-refs.js')).toBe(true);
    });

    test('validator test file is allow-listed (self-reference)', () => {
      expect(
        isAllowListed('tests/scripts/validate-no-external-refs.test.js'),
      ).toBe(true);
    });

    test('pre-existing BMAD fork README is allow-listed', () => {
      expect(isAllowListed('squads/claude-code-mastery/README.md')).toBe(true);
    });

    test('arbitrary source file is not allow-listed', () => {
      expect(isAllowListed('src/index.js')).toBe(false);
    });

    test('new file under allow-listed tree prefix is NOT auto-allow-listed', () => {
      // Exact-match allow-list: directory prefixes do NOT cascade.
      expect(
        isAllowListed('squads/claude-code-mastery/agents/future-agent.md'),
      ).toBe(false);
      expect(
        isAllowListed('squads/claude-code-mastery/new-file.md'),
      ).toBe(false);
    });
  });

  // ─────────────────────────────────────────────────────────────────────────
  describe('listTrackedFiles (QA v1.1)', () => {
    let root;

    beforeAll(() => {
      root = makeTmpRoot('ls-files');
      initGit(root);
      writeFile(root, 'a.txt', 'a');
      writeFile(root, 'sub/b.txt', 'b');
      writeFile(root, 'untracked.txt', 'never added');
      gitAdd(root, 'a.txt');
      gitAdd(root, 'sub/b.txt');
    });

    afterAll(() => cleanup(root));

    test('returns only git-tracked files, POSIX-normalized', () => {
      const files = listTrackedFiles(root);
      expect(files).toContain('a.txt');
      expect(files).toContain('sub/b.txt');
      expect(files).not.toContain('untracked.txt');
      // No backslashes on any platform
      files.forEach((f) => expect(f).not.toMatch(/\\/));
    });

    test('throws a helpful error when root is not a git repo', () => {
      const notARepo = fs.mkdtempSync(path.join(os.tmpdir(), 'sinapse-notarepo-'));
      try {
        expect(() => listTrackedFiles(notARepo)).toThrow(/git ls-files failed/);
      } finally {
        cleanup(notARepo);
      }
    });
  });
});
