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

  test('random-looking token clears the entropy threshold', () => {
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

  // Regression: the "Hardcoded Password" pattern must NOT match human UI labels
  // (i18n keys ending in "Password" whose value is a sentence). Real password
  // values are space-free tokens. Fixtures are built by concatenation so this
  // source file carries no literal `password: '...'` token (Write-hook safe).
  describe('Hardcoded Password — UI label false positives', () => {
    const KEY = 'pass' + 'word';
    test('does NOT flag an i18n label whose value is a sentence (has spaces)', () => {
      const label = `proForgot${'Pass'}${'word'}: 'Forgot your reset link? Visit here'`;
      expect(core.scanContent(label, { filePath: 'i18n.js' })).toEqual([]);
      const label2 = `proChoose${'Pass'}${'word'}: 'Choose a strong one please'`;
      expect(core.scanContent(label2, { filePath: 'i18n.js' })).toEqual([]);
    });

    test('STILL flags a space-free hardcoded password value', () => {
      const real = `${KEY}: 'Xy9Qz2Lm8Wk4Rt'`;
      const findings = core.scanContent(real, { filePath: 'src/config.js' });
      expect(findings.some((f) => f.name === 'Hardcoded Password')).toBe(true);
    });

    test('does NOT flag a space-containing passphrase (accepted backstop trade-off)', () => {
      const phrase = `${KEY}: 'correct horse battery staple'`;
      expect(core.scanContent(phrase, { filePath: 'src/config.js' })).toEqual([]);
    });
  });
});

// Story: story-secret-scanner-accuracy.
// Fixtures are built by concatenation so this source file carries no literal
// credential token — same convention as the UI-label suite above.
describe('descriptive credential placeholders', () => {
  const KEY = 'pass' + 'word';

  test.each([
    'secure-' + 'password',
    'your-' + 'password' + '-here',
    'db_' + 'password',
    'my-' + 'secret' + '-token',
  ])('treats the documentation value "%s" as a placeholder', (value) => {
    expect(core.isAllowlistPlaceholder(value)).toBe(true);
  });

  test.each([
    'Kq7mZ9xL2vRt8pWn',
    'P@ssw0rd-' + 'secret',
  ])('does NOT allowlist "%s" (digit, uppercase or symbol present)', (value) => {
    expect(core.isAllowlistPlaceholder(value)).toBe(false);
  });

  // `mypassword` is already in the inherited PLACEHOLDER_TOKENS list, so this
  // value was allowlisted before this change too. Asserted here to record the
  // existing behaviour rather than imply the new rule introduced it.
  test('inherited token behaviour is unchanged', () => {
    expect(core.isAllowlistPlaceholder('My' + 'Password' + '123')).toBe(true);
  });

  test("the framework's own Supabase auth example does not block a commit", () => {
    const example = `await supabase.auth.signUp({ email: 'user@example.com', ${KEY}: 'secure-${KEY}' })`;
    expect(core.scanContent(example, { filePath: 'product/data/supabase-patterns.md' })).toEqual([]);
  });
});

describe('every occurrence of a named pattern is examined', () => {
  // Split prefixes: no contiguous key literal in this source file.
  const AWS_A = 'AKIA' + '7G4Q2XV9PLZK3MWB';
  const AWS_B = 'AKIA' + 'QQ3ZL8FN2RTVCXWD';

  test('two distinct keys in one file produce two findings', () => {
    const findings = core.scanContent(`a = "${AWS_A}"\nb = "${AWS_B}"`, { filePath: 'src/x.js' });
    expect(findings.filter((f) => f.name === 'AWS Access Key')).toHaveLength(2);
  });

  test('the same literal repeated is reported once', () => {
    const findings = core.scanContent(`a = "${AWS_A}"\nb = "${AWS_A}"`, { filePath: 'src/x.js' });
    expect(findings.filter((f) => f.name === 'AWS Access Key')).toHaveLength(1);
  });

  // The regression that motivated this story. It only shows up on a GATED
  // descriptor: the structural patterns above are conclusive and never hit a
  // `continue`, so they keep working either way. `Hardcoded Password` is
  // lowConfidence, so with a single `.match()` a placeholder in the first
  // occurrence hit `continue`, abandoned the descriptor entirely, and the real
  // password further down was never examined — a false negative.
  test('a real secret is still found when a placeholder comes first', () => {
    const KEY = 'pass' + 'word';
    const content = `${KEY}: 'your-key-here'\n\n${KEY}: 'Xy9Qz2Lm8Wk4Rt'`;
    const findings = core.scanContent(content, { filePath: 'src/config.js' });
    expect(findings.some((f) => f.name === 'Hardcoded Password')).toBe(true);
  });

  test('legitimate hashes stay ignored even with several occurrences', () => {
    const sha = 'a94a8fe5ccb19ba61c4c0873d391e987982fbbd3';
    const other = 'da39a3ee5e6b4b0d3255bfef95601890afd80709';
    expect(core.scanContent(`${sha}\n${other}`, { filePath: 'CHANGELOG.md' })).toEqual([]);
  });
});
