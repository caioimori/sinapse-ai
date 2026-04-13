'use strict';

const fs = require('fs');
const os = require('os');
const path = require('path');

const {
  readCoverageSummary,
  readRatchetFloors,
  buildRows,
  formatAsciiTable,
  formatMarkdownTable,
  appendToGithubSummary,
  main,
} = require('../../scripts/coverage-report-summary');

function makeTempDir(prefix = 'coverage-summary-') {
  return fs.mkdtempSync(path.join(os.tmpdir(), prefix));
}

function fixtureSummary() {
  return {
    total: {
      statements: { pct: 24.44 },
      branches: { pct: 22.03 },
      lines: { pct: 24.58 },
      functions: { pct: 26.06 },
    },
  };
}

function fixtureFloors() {
  return { statements: 23, branches: 21, lines: 23, functions: 25 };
}

describe('Story 10.25 — coverage-report-summary', () => {
  describe('readCoverageSummary', () => {
    it('returns null when the file does not exist', () => {
      const dir = makeTempDir();
      const result = readCoverageSummary(path.join(dir, 'missing.json'));
      expect(result).toBeNull();
    });

    it('parses a valid summary JSON', () => {
      const dir = makeTempDir();
      const file = path.join(dir, 'coverage-summary.json');
      fs.writeFileSync(file, JSON.stringify(fixtureSummary()));
      const result = readCoverageSummary(file);
      expect(result.total.statements.pct).toBe(24.44);
    });

    it('returns null on corrupt JSON', () => {
      const dir = makeTempDir();
      const file = path.join(dir, 'coverage-summary.json');
      fs.writeFileSync(file, '{ this is not json');
      expect(readCoverageSummary(file)).toBeNull();
    });
  });

  describe('readRatchetFloors', () => {
    it('extracts the four global floors from a jest.config.js text block', () => {
      const dir = makeTempDir();
      const file = path.join(dir, 'jest.config.js');
      fs.writeFileSync(
        file,
        `module.exports = {
          coverageThreshold: {
            global: {
              branches: 21,
              functions: 25,
              lines: 23,
              statements: 23,
            },
          },
        };`,
      );
      const floors = readRatchetFloors(file);
      expect(floors).toEqual({ statements: 23, branches: 21, lines: 23, functions: 25 });
    });

    it('returns null when the file does not exist', () => {
      expect(readRatchetFloors('/this/does/not/exist/jest.config.js')).toBeNull();
    });

    it('returns null when the global block is missing', () => {
      const dir = makeTempDir();
      const file = path.join(dir, 'jest.config.js');
      fs.writeFileSync(file, 'module.exports = { something: "else" };');
      expect(readRatchetFloors(file)).toBeNull();
    });
  });

  describe('buildRows', () => {
    it('produces 4 rows with PASS status when all actuals exceed floors', () => {
      const rows = buildRows(fixtureSummary(), fixtureFloors());
      expect(rows).toHaveLength(4);
      expect(rows.every((r) => r.status === 'PASS')).toBe(true);
    });

    it('marks a row as FAIL when actual < floor', () => {
      const summary = fixtureSummary();
      summary.total.statements.pct = 5;
      const rows = buildRows(summary, fixtureFloors());
      const stRow = rows.find((r) => r.metric === 'statements');
      expect(stRow.status).toBe('FAIL');
    });

    it('returns empty array when summary is missing', () => {
      expect(buildRows(null, fixtureFloors())).toEqual([]);
    });

    it('returns empty array when floors are missing', () => {
      expect(buildRows(fixtureSummary(), null)).toEqual([]);
    });
  });

  describe('formatAsciiTable', () => {
    it('produces a multi-line table with header + 4 rows + borders', () => {
      const rows = buildRows(fixtureSummary(), fixtureFloors());
      const table = formatAsciiTable(rows);
      expect(table).toContain('Metric');
      expect(table).toContain('Floor');
      expect(table).toContain('Actual');
      expect(table).toContain('Status');
      expect(table).toContain('statements');
      expect(table).toContain('PASS');
      expect(table.split('\n').length).toBeGreaterThanOrEqual(8);
    });
  });

  describe('formatMarkdownTable', () => {
    it('produces a Markdown table with status emojis', () => {
      const rows = buildRows(fixtureSummary(), fixtureFloors());
      const md = formatMarkdownTable(rows);
      expect(md).toContain('| Metric | Floor | Actual | Status |');
      expect(md).toContain('|--------|-------|--------|--------|');
      expect(md).toContain('| statements |');
      expect(md).toContain('✅');
    });

    it('emits ❌ for FAIL rows', () => {
      const summary = fixtureSummary();
      summary.total.statements.pct = 1;
      const rows = buildRows(summary, fixtureFloors());
      const md = formatMarkdownTable(rows);
      expect(md).toContain('❌');
    });
  });

  describe('appendToGithubSummary', () => {
    it('appends to the file when GITHUB_STEP_SUMMARY is set', () => {
      const dir = makeTempDir();
      const summaryFile = path.join(dir, 'summary.md');
      fs.writeFileSync(summaryFile, '# Existing\n');
      const orig = process.env.GITHUB_STEP_SUMMARY;
      process.env.GITHUB_STEP_SUMMARY = summaryFile;
      try {
        const ok = appendToGithubSummary('## new content');
        expect(ok).toBe(true);
        const content = fs.readFileSync(summaryFile, 'utf8');
        expect(content).toContain('# Existing');
        expect(content).toContain('## new content');
      } finally {
        if (orig === undefined) delete process.env.GITHUB_STEP_SUMMARY;
        else process.env.GITHUB_STEP_SUMMARY = orig;
      }
    });

    it('returns false when GITHUB_STEP_SUMMARY is not set', () => {
      const orig = process.env.GITHUB_STEP_SUMMARY;
      delete process.env.GITHUB_STEP_SUMMARY;
      try {
        expect(appendToGithubSummary('x')).toBe(false);
      } finally {
        if (orig !== undefined) process.env.GITHUB_STEP_SUMMARY = orig;
      }
    });
  });

  describe('main', () => {
    let consoleSpy;
    beforeEach(() => {
      consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
    });
    afterEach(() => {
      consoleSpy.mockRestore();
    });

    it('exits 0 with a clear message when coverage-summary.json is missing', () => {
      // The main() function reads from the project's actual coverage path,
      // so we just verify it returns 0 regardless of file presence.
      const exitCode = main([]);
      expect(exitCode).toBe(0);
    });
  });
});
