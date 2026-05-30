'use strict';

/**
 * PORT #6 — gotcha-loader hardened
 *
 * Proves that:
 * 1. IdeationEngine correctly extracts the named export GotchasMemory
 *    (not the raw module object) — Bug #1 fix
 * 2. IdeationEngine calls listGotchas() (not the non-existent getAll()) — Bug #2 fix
 * 3. With recorded gotchas, ideate() filters matching suggestions
 */

const path = require('path');
const os = require('os');
const fs = require('fs');

// ── helpers ──────────────────────────────────────────────────────────────────

function makeTmpDir() {
  return fs.mkdtempSync(path.join(os.tmpdir(), 'sinapse-ideation-'));
}

function cleanTmpDir(dir) {
  try {
    fs.rmSync(dir, { recursive: true, force: true });
  } catch {
    // ignore
  }
}

const IDEATION_ENGINE_PATH = path.join(
  __dirname,
  '..',
  '..',
  '.sinapse-ai',
  'core',
  'ideation',
  'ideation-engine.js',
);

const GOTCHAS_MEMORY_PATH = path.join(
  __dirname,
  '..',
  '..',
  '.sinapse-ai',
  'core',
  'memory',
  'gotchas-memory.js',
);

// ─────────────────────────────────────────────────────────────────────────────

describe('PORT #6 — gotcha-loader hardened', () => {
  // ── Bug #1: named export extraction ─────────────────────────────────────────

  describe('Bug #1 — named export GotchasMemory extracted correctly', () => {
    let tmpDir;

    beforeEach(() => {
      tmpDir = makeTmpDir();
    });

    afterEach(() => {
      cleanTmpDir(tmpDir);
    });

    test('IdeationEngine constructor does not throw with real module', () => {
      jest.isolateModules(() => {
        const IdeationEngine = require(IDEATION_ENGINE_PATH);
        expect(() => {
          new IdeationEngine({ rootPath: tmpDir, outputDir: path.join(tmpDir, 'out') });
        }).not.toThrow();
      });
    });

    test('gotchasMemory instance is not null — real module loaded correctly', () => {
      jest.isolateModules(() => {
        const IdeationEngine = require(IDEATION_ENGINE_PATH);
        const engine = new IdeationEngine({ rootPath: tmpDir, outputDir: path.join(tmpDir, 'out') });
        expect(engine.gotchasMemory).not.toBeNull();
        expect(typeof engine.gotchasMemory.listGotchas).toBe('function');
      });
    });

    test('gotchasMemory falls back to null when module is absent', () => {
      jest.isolateModules(() => {
        jest.mock(GOTCHAS_MEMORY_PATH, () => {
          throw new Error('simulated missing module');
        });
        const IdeationEngine = require(IDEATION_ENGINE_PATH);
        const engine = new IdeationEngine({ rootPath: tmpDir, outputDir: path.join(tmpDir, 'out') });
        expect(engine.gotchasMemory).toBeNull();
      });
    });

    test('gotchasMemory falls back to null when module exports wrong shape', () => {
      jest.isolateModules(() => {
        jest.mock(GOTCHAS_MEMORY_PATH, () => ({ notGotchasMemory: 'wrong' }));
        const IdeationEngine = require(IDEATION_ENGINE_PATH);
        const engine = new IdeationEngine({ rootPath: tmpDir, outputDir: path.join(tmpDir, 'out') });
        expect(engine.gotchasMemory).toBeNull();
      });
    });
  });

  // ── Bug #2: listGotchas() called instead of getAll() ────────────────────────

  describe('Bug #2 — listGotchas() used (not getAll)', () => {
    let tmpDir;

    beforeEach(() => {
      tmpDir = makeTmpDir();
    });

    afterEach(() => {
      cleanTmpDir(tmpDir);
    });

    test('ideate() calls listGotchas, never getAll', async () => {
      const IdeationEngine = require(IDEATION_ENGINE_PATH);

      const calls = [];
      const mockGotchasMemory = {
        listGotchas: jest.fn(() => {
          calls.push('listGotchas');
          return [];
        }),
        getAll: jest.fn(() => {
          calls.push('getAll');
          return [];
        }),
      };

      const engine = new IdeationEngine({
        rootPath: tmpDir,
        outputDir: path.join(tmpDir, 'out'),
        gotchasMemory: mockGotchasMemory,
      });

      await engine.ideate({ focus: [], save: false });

      expect(calls).toContain('listGotchas');
      expect(calls).not.toContain('getAll');
    });
  });

  // ── Integration: recorded gotchas ARE filtered from suggestions ──────────────

  describe('Integration — gotchas filter suggestions', () => {
    let tmpDir;

    beforeEach(() => {
      tmpDir = makeTmpDir();
    });

    afterEach(() => {
      cleanTmpDir(tmpDir);
    });

    test('GotchasMemory has listGotchas() and no getAll()', () => {
      jest.isolateModules(() => {
        const { GotchasMemory } = jest.requireActual(GOTCHAS_MEMORY_PATH);
        const memory = new GotchasMemory(tmpDir);
        expect(typeof memory.listGotchas).toBe('function');
        expect(typeof memory.getAll).toBe('undefined');
      });
    });

    test('listGotchas() returns a recorded gotcha with correct shape', () => {
      jest.isolateModules(() => {
        const { GotchasMemory } = jest.requireActual(GOTCHAS_MEMORY_PATH);
        const memory = new GotchasMemory(tmpDir);

        memory.addGotcha({
          title: 'spawn sh not available on Windows',
          description: 'Using spawn sh -c fails on win32 — use argv spawn instead',
          category: 'build',
          severity: 'critical',
        });

        const gotchas = memory.listGotchas();
        expect(gotchas.length).toBeGreaterThanOrEqual(1);

        const g = gotchas[0];
        expect(g).toHaveProperty('id');
        expect(g).toHaveProperty('title');
        expect(g).toHaveProperty('description');
        expect(g).toHaveProperty('category');
        expect(g).toHaveProperty('severity', 'critical');
      });
    });

    test('isKnownGotcha filters suggestion that overlaps a recorded gotcha', () => {
      const { GotchasMemory } = jest.requireActual(GOTCHAS_MEMORY_PATH);
      const IdeationEngine = jest.requireActual(IDEATION_ENGINE_PATH);

      const memory = new GotchasMemory(tmpDir);
      memory.addGotcha({
        title: 'synchronous file operations blocks event loop',
        description: 'Excessive synchronous readFileSync writeFileSync calls block the event loop',
        category: 'runtime',
        severity: 'warning',
      });

      const engine = new IdeationEngine({
        rootPath: tmpDir,
        outputDir: path.join(tmpDir, 'out'),
        gotchasMemory: memory,
      });

      const overlapSuggestion = {
        id: 'test-overlap',
        title: 'Excessive synchronous file operations',
        description: 'Found readFileSync writeFileSync calls that block event loop',
        area: 'performance',
        impact: 0.7,
        effort: 'medium',
        priority: 0.7,
      };

      const nonOverlapSuggestion = {
        id: 'test-no-overlap',
        title: 'Consider refactoring component lifecycle',
        description: 'React component has complex lifecycle hooks that could be simplified',
        area: 'codeQuality',
        impact: 0.5,
        effort: 'high',
        priority: 0.3,
      };

      const knownIssues = memory.listGotchas();
      const filtered = [overlapSuggestion, nonOverlapSuggestion].filter(
        (s) => !engine.isKnownGotcha(s, knownIssues),
      );

      // The overlapping suggestion must be filtered out
      expect(filtered.find((s) => s.id === 'test-overlap')).toBeUndefined();
      // The unrelated suggestion must remain
      expect(filtered.find((s) => s.id === 'test-no-overlap')).toBeDefined();
    });
  });
});
