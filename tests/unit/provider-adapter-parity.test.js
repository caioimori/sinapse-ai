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
});
