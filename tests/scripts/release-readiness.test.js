'use strict';

// Story 10.29 — release-readiness tests
//
// We test the pure helpers (parseArgs, summarize, formatTable) directly
// and stub spawnSync via Jest module mocking so runGate can be exercised
// without actually running the gates (which would take minutes).

jest.mock('child_process', () => {
  const actual = jest.requireActual('child_process');
  return {
    ...actual,
    spawnSync: jest.fn(),
  };
});

const { spawnSync } = require('child_process');
const {
  parseArgs,
  GATES,
  runGate,
  runAllGates,
  summarize,
  formatTable,
} = require('../../scripts/release-readiness');

describe('Story 10.29 — release-readiness', () => {
  beforeEach(() => {
    spawnSync.mockReset();
  });

  describe('parseArgs', () => {
    it('parses --json and --quiet', () => {
      expect(parseArgs(['--json']).json).toBe(true);
      expect(parseArgs(['--quiet']).quiet).toBe(true);
      expect(parseArgs(['-q']).quiet).toBe(true);
      expect(parseArgs(['--skip-publish']).skipPublish).toBe(true);
      expect(parseArgs([]).json).toBe(false);
      expect(parseArgs([]).skipPublish).toBe(false);
    });
  });

  describe('GATES', () => {
    it('exposes a non-empty array of gate definitions', () => {
      expect(Array.isArray(GATES)).toBe(true);
      expect(GATES.length).toBeGreaterThan(5);
    });

    it('every gate has id, name, and cmd array', () => {
      for (const g of GATES) {
        expect(typeof g.id).toBe('string');
        expect(typeof g.name).toBe('string');
        expect(Array.isArray(g.cmd)).toBe(true);
        expect(g.cmd.length).toBeGreaterThan(0);
      }
    });

    it('includes lint, typecheck, agents, story-meta, parity, manifest', () => {
      const ids = GATES.map((g) => g.id);
      expect(ids).toContain('lint');
      expect(ids).toContain('typecheck');
      expect(ids).toContain('agents');
      expect(ids).toContain('story-meta');
      expect(ids).toContain('parity');
      expect(ids).toContain('manifest');
    });
  });

  describe('runGate', () => {
    it('returns PASS when spawnSync exits 0', () => {
      spawnSync.mockReturnValue({ status: 0, stderr: '' });
      const result = runGate({ id: 'x', name: 'X', cmd: ['echo', 'hi'] });
      expect(result.status).toBe('PASS');
      expect(result.exitCode).toBe(0);
    });

    it('returns FAIL when spawnSync exits non-zero', () => {
      spawnSync.mockReturnValue({ status: 1, stderr: 'oops' });
      const result = runGate({ id: 'x', name: 'X', cmd: ['echo', 'hi'] });
      expect(result.status).toBe('FAIL');
      expect(result.exitCode).toBe(1);
      expect(result.stderr).toContain('oops');
    });

    it('measures elapsed time', () => {
      spawnSync.mockReturnValue({ status: 0, stderr: '' });
      const result = runGate({ id: 'x', name: 'X', cmd: ['echo', 'hi'] });
      expect(typeof result.elapsedMs).toBe('number');
      expect(result.elapsedMs).toBeGreaterThanOrEqual(0);
    });
  });

  describe('runAllGates', () => {
    it('runs every gate provided', () => {
      spawnSync.mockReturnValue({ status: 0, stderr: '' });
      const fakeGates = [
        { id: 'a', name: 'A', cmd: ['x'] },
        { id: 'b', name: 'B', cmd: ['y'] },
      ];
      const results = runAllGates(fakeGates);
      expect(results).toHaveLength(2);
      expect(results.every((r) => r.status === 'PASS')).toBe(true);
    });
  });

  describe('summarize', () => {
    it('counts pass and fail correctly', () => {
      const results = [
        { status: 'PASS', elapsedMs: 100 },
        { status: 'FAIL', elapsedMs: 200 },
        { status: 'PASS', elapsedMs: 50 },
      ];
      const s = summarize(results);
      expect(s.total).toBe(3);
      expect(s.pass).toBe(2);
      expect(s.fail).toBe(1);
      expect(s.elapsedMs).toBe(350);
    });
  });

  describe('formatTable', () => {
    it('produces a multi-line table with header + rows', () => {
      const results = [
        { id: 'a', name: 'Gate A', status: 'PASS', exitCode: 0, elapsedMs: 123 },
        { id: 'b', name: 'Gate B', status: 'FAIL', exitCode: 1, elapsedMs: 456 },
      ];
      const table = formatTable(results);
      expect(table).toContain('Gate A');
      expect(table).toContain('Gate B');
      expect(table).toContain('PASS');
      expect(table).toContain('FAIL');
      expect(table).toContain('123ms');
      expect(table).toContain('456ms');
    });
  });
});
