'use strict';

/**
 * Story rodada2-m3 (AF-20260704 Mesa #9a)
 *
 * Guard that lints tool/command `description:` fields. A command an agent
 * exposes is a tool; its description drives selection. These tests lock the
 * clarity contract: empty, placeholder, template-only, and too-short values
 * are rejected, while real descriptions — including ones with inline command
 * argument syntax like `(*build {story-id})` — and YAML block scalars pass.
 */

const fs = require('fs');
const os = require('os');
const path = require('path');

const { lintDescriptions, unquote } = require('../../scripts/validate-tool-descriptions.js');

function tmpFile(content) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'tooldesc-'));
  const f = path.join(dir, 'agent.md');
  fs.writeFileSync(f, content);
  return f;
}

describe('unquote', () => {
  test('strips matching single/double quotes', () => {
    expect(unquote("'hello'")).toBe('hello');
    expect(unquote('"hello"')).toBe('hello');
    expect(unquote('  bare  ')).toBe('bare');
  });
});

describe('lintDescriptions — rejects bad descriptions', () => {
  test('empty description', () => {
    const v = lintDescriptions([tmpFile('    description: ')]);
    expect(v).toHaveLength(1);
    expect(v[0].reason).toMatch(/vazia/);
  });

  test('placeholder tokens (TODO/TBD/custom)', () => {
    const v = lintDescriptions([tmpFile('    description: TODO\n    description: TBD\n    description: custom')]);
    expect(v).toHaveLength(3);
    expect(v.every((x) => /placeholder/.test(x.reason))).toBe(true);
  });

  test('template-only value ({description})', () => {
    const v = lintDescriptions([tmpFile("    description: '{description}'")]);
    expect(v).toHaveLength(1);
    expect(v[0].reason).toMatch(/template/);
  });

  test('too-short value', () => {
    const v = lintDescriptions([tmpFile('    description: hi')]);
    expect(v).toHaveLength(1);
    expect(v[0].reason).toMatch(/curta/);
  });
});

describe('lintDescriptions — accepts valid descriptions', () => {
  test('real descriptions, including inline command-arg braces', () => {
    const content = [
      "    description: 'Show all available commands with descriptions'",
      "    description: 'Complete autonomous build (*build {story-id})'",
      "    description: 'Exit PM mode'",
    ].join('\n');
    expect(lintDescriptions([tmpFile(content)])).toHaveLength(0);
  });

  test('YAML block scalars are not flagged', () => {
    const content = '    description: |\n      A long multi-line\n      description follows.\n    description: >\n      Folded scalar text.';
    expect(lintDescriptions([tmpFile(content)])).toHaveLength(0);
  });

  test('reports file + line for each violation', () => {
    const v = lintDescriptions([tmpFile('    description: TODO')]);
    expect(v[0]).toMatchObject({ line: 1 });
    expect(typeof v[0].file).toBe('string');
  });
});

describe('lintDescriptions — real repo baseline is clean', () => {
  test('the framework agent definitions all pass the contract', () => {
    const dir = path.join(__dirname, '..', '..', '.sinapse-ai', 'development', 'agents');
    const files = fs
      .readdirSync(dir)
      .filter((f) => f.endsWith('.md'))
      .map((f) => path.join(dir, f));
    expect(files.length).toBeGreaterThan(0);
    expect(lintDescriptions(files)).toEqual([]);
  });
});
