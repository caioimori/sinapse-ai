/**
 * Story 10.40 — Update staleness detection
 *
 * Verifies the helper that compares installed vs executing version
 * and decides whether to emit a WARN.
 */

const { detectStaleness } = require('../../bin/cli');

describe('Story 10.40 — detectStaleness()', () => {
  test('returns none when versions are equal', () => {
    expect(detectStaleness('10.0.0-rc.5', '10.0.0-rc.5')).toEqual({ kind: 'none' });
  });

  test('returns stale when installed < executing (rc.3 < rc.5)', () => {
    expect(detectStaleness('10.0.0-rc.3', '10.0.0-rc.5')).toEqual({ kind: 'stale' });
  });

  test('returns stale when installed major < executing major', () => {
    expect(detectStaleness('9.4.0', '10.0.0-rc.5')).toEqual({ kind: 'stale' });
  });

  test('returns ahead when installed > executing (rc.5 > rc.3)', () => {
    expect(detectStaleness('10.0.0-rc.5', '10.0.0-rc.3')).toEqual({ kind: 'ahead' });
  });

  test('returns none when installed version is missing', () => {
    expect(detectStaleness(null, '10.0.0-rc.5')).toEqual({ kind: 'none' });
    expect(detectStaleness('', '10.0.0-rc.5')).toEqual({ kind: 'none' });
  });

  test('returns none when executing version is missing', () => {
    expect(detectStaleness('10.0.0-rc.5', null)).toEqual({ kind: 'none' });
  });

  test('returns none when versions are unparseable', () => {
    expect(detectStaleness('not-a-version', 'also-not')).toEqual({ kind: 'none' });
  });

  test('handles GA vs rc correctly (rc < GA of same major)', () => {
    // semver: 10.0.0-rc.5 < 10.0.0
    expect(detectStaleness('10.0.0-rc.5', '10.0.0')).toEqual({ kind: 'stale' });
    expect(detectStaleness('10.0.0', '10.0.0-rc.5')).toEqual({ kind: 'ahead' });
  });
});
