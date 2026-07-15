'use strict';

const { assertProviderAdapterParity } = require('../../bin/lib/provider-parity');

describe('provider adapter parity', () => {
  test('returns the canonical count when both provider catalogs match', () => {
    expect(assertProviderAdapterParity('both', {
      claude: ['a', 'b'],
      codex: ['a', 'b'],
    }, 2)).toBe(2);
  });

  test('rejects divergent provider counts in both mode', () => {
    expect(() => assertProviderAdapterParity('both', {
      claude: ['a', 'b'],
      codex: ['a'],
    }, 2)).toThrow('Provider adapter parity failed (Codex: 1/2)');
  });

  test('validates only Claude Code in claude-code mode', () => {
    expect(assertProviderAdapterParity('claude-code', {
      claude: ['a', 'b'],
      codex: [],
    }, 2)).toBe(2);
  });

  test('validates only Codex in codex mode', () => {
    expect(assertProviderAdapterParity('codex', {
      claude: [],
      codex: ['a', 'b'],
    }, 2)).toBe(2);
  });

  test('rejects an invalid LLM choice', () => {
    expect(() => assertProviderAdapterParity('unknown', {
      claude: [],
      codex: [],
    }, 0)).toThrow('Invalid LLM choice for provider parity: unknown');
  });
});
