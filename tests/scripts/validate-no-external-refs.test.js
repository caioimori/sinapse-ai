/**
 * Unit tests for scripts/validate-no-external-refs.js (Story 10.17, Task 5).
 *
 * The validator is pure: it takes a `rootDir` and scans files under it,
 * honouring the .gitignore in that root and the hardcoded allow-list. We
 * exercise it by building tiny fixture filesystems under os.tmpdir().
 *
 * Each test case creates its own isolated root so they do not interfere.
 */

'use strict';

const fs = require('fs');
const os = require('os');
const path = require('path');

const {
  validateNoExternalRefs,
  isAllowListed,
  formatViolation,
  parseGitignore,
  buildGitignoreMatcher,
} = require('../../scripts/validate-no-external-refs');

function makeTmpRoot(label) {
  return fs.mkdtempSync(path.join(os.tmpdir(), `sinapse-ext-refs-${label}-`));
}

function writeFile(root, relPath, content) {
  const abs = path.join(root, relPath);
  fs.mkdirSync(path.dirname(abs), { recursive: true });
  fs.writeFileSync(abs, content, 'utf8');
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
    });

    afterAll(() => cleanup(root));

    test('returns ok=true with zero violations', () => {
      const result = validateNoExternalRefs(root);
      expect(result.ok).toBe(true);
      expect(result.violations).toEqual([]);
      expect(result.scanned.length).toBeGreaterThanOrEqual(2);
    });
  });

  // ─────────────────────────────────────────────────────────────────────────
  describe('dirty fixture — single lowercase violation', () => {
    let root;

    beforeAll(() => {
      root = makeTmpRoot('dirty-lower');
      writeFile(root, 'src/bad.js', [
        '// This references aiox which is forbidden',
        'const x = 1;',
        '',
      ].join('\n'));
    });

    afterAll(() => cleanup(root));

    test('returns ok=false and reports the violation with file, line, match', () => {
      const result = validateNoExternalRefs(root);
      expect(result.ok).toBe(false);
      expect(result.violations.length).toBeGreaterThanOrEqual(1);

      const v = result.violations[0];
      expect(v.file).toBe('src/bad.js');
      expect(v.line).toBe(1);
      expect(typeof v.match).toBe('string');
      expect(v.match.toLowerCase()).toMatch(/aiox/);
    });

    test('formatViolation produces the AC 4 output format', () => {
      const result = validateNoExternalRefs(root);
      const formatted = formatViolation(result.violations[0]);
      expect(formatted).toContain('❌ External reference detected');
      expect(formatted).toContain('File: src/bad.js');
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
      // Uppercase form must also be caught (regex is case-insensitive).
      writeFile(root, 'docs/notes.md', ['# Notes', 'Ref: AIOX upstream.', ''].join('\n'));
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
    });

    afterAll(() => cleanup(root));

    test('allow-listed historical doc is skipped even when it contains forbidden terms', () => {
      const result = validateNoExternalRefs(root);
      expect(result.ok).toBe(true);
      expect(result.violations).toEqual([]);
    });
  });

  // ─────────────────────────────────────────────────────────────────────────
  describe('gitignored path is not scanned', () => {
    let root;

    beforeAll(() => {
      root = makeTmpRoot('gitignored');
      writeFile(
        root,
        '.gitignore',
        ['.sinapse-ai/internal/', ''].join('\n'),
      );
      // A file inside a gitignored directory with a forbidden term must be skipped.
      writeFile(
        root,
        '.sinapse-ai/internal/aiox-feature-map.md',
        [
          '# Internal reference (gitignored)',
          '',
          'This file intentionally references aiox, synkra, bmad for internal analysis.',
          '',
        ].join('\n'),
      );
      // A clean sibling file that SHOULD be scanned.
      writeFile(root, 'README.md', ['# Clean', ''].join('\n'));
    });

    afterAll(() => cleanup(root));

    test('files in gitignored directories are not in the scanned list', () => {
      const result = validateNoExternalRefs(root);
      expect(
        result.scanned.includes('.sinapse-ai/internal/aiox-feature-map.md'),
      ).toBe(false);
    });

    test('scan passes overall because the gitignored file is skipped', () => {
      const result = validateNoExternalRefs(root);
      expect(result.ok).toBe(true);
      expect(result.violations).toEqual([]);
    });
  });

  // ─────────────────────────────────────────────────────────────────────────
  describe('bonus — every term in the regex is caught', () => {
    let root;

    beforeAll(() => {
      root = makeTmpRoot('all-terms');
      writeFile(root, 'src/terms.md', [
        '# Terms',
        'line with aiox',
        'line with synkra',
        'line with synkraai',
        'line with bmad',
        '',
      ].join('\n'));
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

    test('arbitrary source file is not allow-listed', () => {
      expect(isAllowListed('src/index.js')).toBe(false);
    });

    test('directory prefix (node_modules/) is allow-listed for any child', () => {
      expect(isAllowListed('node_modules/foo/index.js')).toBe(true);
    });
  });

  // ─────────────────────────────────────────────────────────────────────────
  describe('gitignore parser — comments and blanks are skipped', () => {
    let root;

    beforeAll(() => {
      root = makeTmpRoot('gitignore-parse');
      writeFile(
        root,
        '.gitignore',
        [
          '# this is a comment',
          '',
          'build/',
          '  ',
          '# another comment',
          'dist/',
          '',
        ].join('\n'),
      );
    });

    afterAll(() => cleanup(root));

    test('parses only the 2 real pattern lines', () => {
      const patterns = parseGitignore(root);
      expect(patterns).toEqual(['build/', 'dist/']);
    });

    test('matcher ignores paths under declared directories', () => {
      const patterns = parseGitignore(root);
      const isIgnored = buildGitignoreMatcher(patterns);
      expect(isIgnored('build/x.js')).toBe(true);
      expect(isIgnored('dist/a.txt')).toBe(true);
      expect(isIgnored('src/main.js')).toBe(false);
    });
  });
});
