/**
 * Unit tests — wave-gate.js (deterministic wave gate).
 * Story onda3-s5-epic-waves-wrapper-pilot (AF-20260702 item 3.5).
 *
 * Real fs + real `node --test` runs against tiny fixtures in temp dirs.
 */

'use strict';

const fs = require('fs');
const os = require('os');
const path = require('path');

const {
  scanWrittenFiles,
  parseNodeTestSummary,
  evaluateStory,
  evaluateWave,
} = require('../../scripts/wave-gate');

const PASSING_SRC = 'exports.double = (n) => n * 2;\n';
const PASSING_TEST = [
  "const { test } = require('node:test');",
  "const assert = require('node:assert');",
  "const { double } = require('../src/lib.js');",
  "test('double', () => { assert.strictEqual(double(2), 4); });",
  '',
].join('\n');
const FAILING_TEST = [
  "const { test } = require('node:test');",
  "const assert = require('node:assert');",
  "test('broken', () => { assert.strictEqual(1, 2); });",
  '',
].join('\n');

function makeStory(root, name, files) {
  const dir = path.join(root, name);
  for (const [rel, content] of Object.entries(files)) {
    const full = path.join(dir, rel);
    fs.mkdirSync(path.dirname(full), { recursive: true });
    fs.writeFileSync(full, content, 'utf8');
  }
  fs.mkdirSync(dir, { recursive: true });
  return dir;
}

describe('wave-gate (Onda3-S5)', () => {
  let root;

  beforeEach(() => {
    root = fs.mkdtempSync(path.join(os.tmpdir(), 'wave-gate-'));
  });

  afterEach(() => {
    fs.rmSync(root, { recursive: true, force: true });
  });

  describe('scanWrittenFiles', () => {
    test('counts code files, ignores plan/, docs/, markdown and dotfiles', () => {
      const dir = makeStory(root, 's', {
        'src/lib.js': PASSING_SRC,
        'tests/lib.test.js': PASSING_TEST,
        'plan/build-state.json': '{}',
        'docs/notes.txt': 'x',
        'README.md': '# doc',
        '.hidden': 'x',
      });
      const files = scanWrittenFiles(dir).map((f) => f.replace(/\\/g, '/'));
      expect(files.sort()).toEqual(['src/lib.js', 'tests/lib.test.js']);
    });

    test('empty/missing dir yields empty list', () => {
      expect(scanWrittenFiles(path.join(root, 'nope'))).toEqual([]);
    });
  });

  describe('parseNodeTestSummary', () => {
    test('extracts pass/fail counts from node --test output', () => {
      const out = '# tests 3\n# pass 2\n# fail 1\n';
      expect(parseNodeTestSummary(out)).toEqual({ pass: 2, fail: 1 });
    });

    test('returns nulls when summary absent', () => {
      expect(parseNodeTestSummary('garbage')).toEqual({ pass: null, fail: null });
    });
  });

  describe('evaluateStory', () => {
    test('APPROVED: files written and tests green', () => {
      const dir = makeStory(root, 'ok', {
        'src/lib.js': PASSING_SRC,
        'tests/lib.test.js': PASSING_TEST,
      });
      const result = evaluateStory(dir);
      expect(result.verdict).toBe('APPROVED');
      expect(result.filesWritten).toBe(2);
      expect(result.tests.exitCode).toBe(0);
      expect(result.reasons).toEqual([]);
    }, 30000);

    test('NEEDS_WORK: tests failing', () => {
      const dir = makeStory(root, 'fail', {
        'src/lib.js': PASSING_SRC,
        'tests/lib.test.js': FAILING_TEST,
      });
      const result = evaluateStory(dir);
      expect(result.verdict).toBe('NEEDS_WORK');
      expect(result.tests.exitCode).not.toBe(0);
      expect(result.reasons.join(' ')).toMatch(/tests failed/);
    }, 30000);

    test('NEEDS_WORK: empty build (only plan/docs) — a plan is not an implementation', () => {
      const dir = makeStory(root, 'empty', {
        'plan/build-state.json': '{"completedSubtasks":["1.1"]}',
        'docs/spec.md': '# spec',
      });
      const result = evaluateStory(dir);
      expect(result.verdict).toBe('NEEDS_WORK');
      expect(result.filesWritten).toBe(0);
      expect(result.tests.skipped).toBe(true);
      expect(result.reasons.join(' ')).toMatch(/zero product files/);
    }, 30000);
  });

  describe('evaluateWave', () => {
    test('wave APPROVED only when every story is APPROVED', () => {
      const good = makeStory(root, 'w-good', {
        'src/lib.js': PASSING_SRC,
        'tests/lib.test.js': PASSING_TEST,
      });
      const empty = makeStory(root, 'w-empty', { 'plan/x.json': '{}' });

      const wave = evaluateWave([good, empty]);
      expect(wave.verdict).toBe('NEEDS_WORK');
      expect(wave.stories.map((s) => s.verdict)).toEqual(['APPROVED', 'NEEDS_WORK']);

      const waveOk = evaluateWave([good]);
      expect(waveOk.verdict).toBe('APPROVED');
    }, 60000);
  });
});
