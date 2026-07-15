'use strict';

const path = require('path');

const {
  parseTomlDocument,
  stableJson,
  validateNativeCodex,
} = require('../../.codex/scripts/validate-codex-native');

const PROJECT_ROOT = path.resolve(__dirname, '..', '..');

describe('validate-codex-native', () => {
  it('strictly parses the portable TOML subset used by Codex agents', () => {
    expect(
      parseTomlDocument(
        [
          'name = "reviewer"',
          'description = "Review changes"',
          '[agents]',
          'max_threads = 6',
          'max_depth = 1',
          '[features]',
          'hooks = true',
        ].join('\n')
      )
    ).toEqual({
      name: 'reviewer',
      description: 'Review changes',
      agents: { max_threads: 6, max_depth: 1 },
      features: { hooks: true },
    });
  });

  it('rejects malformed and duplicate TOML instead of reporting a false green', () => {
    expect(() => parseTomlDocument('name = "unterminated')).toThrow(/Invalid TOML string/);
    expect(() => parseTomlDocument('name = "one"\nname = "two"')).toThrow(/Duplicate TOML key/);
    expect(() => parseTomlDocument('not valid toml')).toThrow(/Malformed TOML/);
  });

  it('compares object content independently of JSON key order', () => {
    expect(stableJson({ b: 2, a: { d: 4, c: 3 } })).toBe(stableJson({ a: { c: 3, d: 4 }, b: 2 }));
  });

  it('validates the complete repository Codex-native surface', () => {
    const result = validateNativeCodex(PROJECT_ROOT);
    expect(result).toEqual(
      expect.objectContaining({
        ok: true,
        errors: [],
        metrics: expect.objectContaining({ nativeAgents: 172 }),
      })
    );
  });
});
