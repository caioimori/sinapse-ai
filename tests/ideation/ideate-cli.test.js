/**
 * Tests for the `sinapse ideate` CLI wiring + the cross-platform scanners.
 *
 * Locks in VAPORWARE-1's fix (audit 2026-06-11): the IdeationEngine is now
 * reachable via a real command AND its analyzers work on every OS (no grep/sh).
 */

const path = require('path');
const os = require('os');
const fs = require('fs');

const { parseIdeateArgs, VALID_AREAS } = require('../../bin/commands/ideate');

describe('sinapse ideate — arg parsing', () => {
  test('defaults: save on, json off, no focus', () => {
    const o = parseIdeateArgs([]);
    expect(o.save).toBe(true);
    expect(o.json).toBe(false);
    expect(o.focus).toBeUndefined();
  });

  test('--focus accepts a single area and a comma list', () => {
    expect(parseIdeateArgs(['--focus', 'security']).focus).toEqual(['security']);
    expect(parseIdeateArgs(['--focus=performance,security']).focus).toEqual(['performance', 'security']);
  });

  test('--no-save and --json flags', () => {
    const o = parseIdeateArgs(['--no-save', '--json']);
    expect(o.save).toBe(false);
    expect(o.json).toBe(true);
  });

  test('VALID_AREAS covers the five analyzers', () => {
    expect(VALID_AREAS).toEqual(
      expect.arrayContaining(['performance', 'security', 'codeQuality', 'ux', 'architecture']),
    );
  });
});

describe('IdeationEngine — cross-platform analyzers (no shell-out)', () => {
  let tmp;

  beforeEach(() => {
    tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'ideate-xplat-'));
    // Seed a src/ file that should trigger the perf + security analyzers.
    const srcDir = path.join(tmp, 'src');
    fs.mkdirSync(srcDir, { recursive: true });
    fs.writeFileSync(
      path.join(srcDir, 'sample.js'),
      [
        "const fs = require('fs');",
        'function load(p) { return fs.readFileSync(p); }',
        'const danger = (s) => eval(s);',  
        "const api_key = 'hardcoded-123';",
        'module.exports = { load, danger };',
      ].join('\n'),
    );
  });

  afterEach(() => {
    try { fs.rmSync(tmp, { recursive: true, force: true }); } catch { /* ignore */ }
  });

  test('ideate() runs and returns a structured result without shelling out', async () => {
    const IdeationEngine = require('../../.sinapse-ai/core/ideation/ideation-engine');
    const engine = new IdeationEngine({ rootPath: tmp });
    const result = await engine.ideate({ save: false });

    expect(result).toHaveProperty('summary');
    expect(result).toHaveProperty('allSuggestions');
    expect(Array.isArray(result.allSuggestions)).toBe(true);
    // The seeded eval() must be detected by the security analyzer.
    const titles = result.allSuggestions.map((s) => s.title).join(' | ');
    expect(titles).toMatch(/eval/i);
  });

  test('accepts a rootPath with parentheses (no false-positive rejection)', () => {
    const IdeationEngine = require('../../.sinapse-ai/core/ideation/ideation-engine');
    const weird = path.join(tmp, 'Foo (Bar)');
    fs.mkdirSync(weird, { recursive: true });
    expect(() => new IdeationEngine({ rootPath: weird })).not.toThrow();
  });
});
