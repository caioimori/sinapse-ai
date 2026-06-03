'use strict';

/**
 * Secret Scanner Core — unit tests (Frente 4.2, Stream A).
 *
 * Focused unit coverage of the shared detection primitives:
 *   shannonEntropy, isAllowlistPlaceholder, isLockfilePath, redactMatch,
 *   scanContent (named + entropy paths), hasSecret.
 *
 * @module tests/security/secret-scanner-core.test
 */

const path = require('path');

const core = require(path.join(__dirname, '..', '..', 'bin', 'utils', 'secret-scanner-core.js'));

describe('shannonEntropy', () => {
  test('returns 0 for empty input', () => {
    expect(core.shannonEntropy('')).toBe(0);
    expect(core.shannonEntropy(null)).toBe(0);
    expect(core.shannonEntropy(undefined)).toBe(0);
  });

  test('single repeated char has zero entropy', () => {
    expect(core.shannonEntropy('aaaaaaaa')).toBe(0);
  });

  test('uniform two-symbol string approaches 1 bit', () => {
    expect(core.shannonEntropy('abababab')).toBeCloseTo(1, 5);
  });

  test('random-looking token clears the 4.0 threshold', () => {
    expect(core.shannonEntropy('Xq9Zk2mNp7Bv4Lc8Rt6Wy3Ds1Fg5Hj0Aa')).toBeGreaterThanOrEqual(core.ENTROPY_THRESHOLD);
  });
});

describe('isAllowlistPlaceholder', () => {
  test.each([
    'your-key-here',
    'CHANGEME',
    'REPLACE_ME',
    '<sua-chave>',
    '[CHANGE_ME]',
    '{token}',
    '${SECRET}',
    'YOUR_API_KEY',
    'placeholder',
    'example',
    'xxxxxxxx',
    '00000000',
    '--------',
    '',
  ])('treats "%s" as a placeholder', (value) => {
    expect(core.isAllowlistPlaceholder(value)).toBe(true);
  });

  test.each([
    'Xq9Zk2mNp7Bv4Lc8Rt6Wy3Ds1Fg5Hj0Aa',
    'AKIA' + '7G4Q2XV9PLZK3MWB', // split prefix: no contiguous token literal in source
    'skLiveAbC9dEfGhJkLmNpQ',
  ])('does NOT treat real-looking "%s" as a placeholder', (value) => {
    expect(core.isAllowlistPlaceholder(value)).toBe(false);
  });

  test('the string-level placeholder heuristic does NOT gate structural keys', () => {
    // A real AWS key may coincidentally contain "123456"; isAllowlistPlaceholder
    // flags the raw string, but scanContent bypasses the placeholder check for
    // CONCLUSIVE structural patterns, so the key still BLOCKS end-to-end.
    expect(core.isAllowlistPlaceholder('AKIA1234567890ABCDEF')).toBe(true);
    const findings = core.scanContent('AKIA1234567890ABCDEF', { filePath: 'src/x.js' });
    expect(findings.some((f) => f.name === 'AWS Access Key')).toBe(true);
  });

  test('null/undefined are not placeholders (defensive)', () => {
    expect(core.isAllowlistPlaceholder(null)).toBe(false);
    expect(core.isAllowlistPlaceholder(undefined)).toBe(false);
  });
});

describe('isLockfilePath', () => {
  test.each([
    'package-lock.json',
    'a/b/yarn.lock',
    'pnpm-lock.yaml',
    'Cargo.lock',
    'poetry.lock',
  ])('recognizes lockfile: %s', (p) => {
    expect(core.isLockfilePath(p)).toBe(true);
  });

  test('windows-style separators are normalized', () => {
    expect(core.isLockfilePath('sub\\dir\\package-lock.json')).toBe(true);
  });

  test('non-lockfiles are not matched', () => {
    expect(core.isLockfilePath('src/index.js')).toBe(false);
    expect(core.isLockfilePath('')).toBe(false);
  });
});

describe('redactMatch', () => {
  test('keeps a short prefix and masks the remainder', () => {
    const out = core.redactMatch('AKIA1234567890ABCDEF');
    expect(out.startsWith('AKIA')).toBe(true);
    expect(out).toContain('REDACTED');
    expect(out).not.toContain('1234567890ABCDEF');
  });

  test('fully redacts very short values', () => {
    expect(core.redactMatch('ab')).toBe('[REDACTED]');
    expect(core.redactMatch('')).toBe('[REDACTED]');
  });
});

describe('scanContent / hasSecret', () => {
  test('returns [] for empty content', () => {
    expect(core.scanContent('')).toEqual([]);
    expect(core.hasSecret('')).toBe(false);
  });

  test('detects a structural secret and reports it redacted', () => {
    const findings = core.scanContent('const k = "AKIA1234567890ABCDEF";', { filePath: 'src/x.js' });
    expect(findings.length).toBeGreaterThan(0);
    expect(findings[0].redacted).toContain('REDACTED');
    expect(core.hasSecret('AKIA1234567890ABCDEF')).toBe(true);
  });

  test('entropy detection can be disabled via options.entropy=false', () => {
    const content = 'const t = "Xq9Zk2mNp7Bv4Lc8Rt6Wy3Ds1Fg5Hj0Aa";';
    const withEntropy = core.scanContent(content, { filePath: 'src/x.js' });
    const withoutEntropy = core.scanContent(content, { filePath: 'src/x.js', entropy: false });
    expect(withEntropy.some((f) => f.kind === 'entropy')).toBe(true);
    expect(withoutEntropy.some((f) => f.kind === 'entropy')).toBe(false);
  });

  test('placeholder content yields no findings', () => {
    expect(core.scanContent('KEY=your-key-here', { filePath: 'src/x.js' })).toEqual([]);
    expect(core.hasSecret('KEY=your-key-here')).toBe(false);
  });
});
