'use strict';

/**
 * Secret Scanning Pattern Tests
 * Story 8.10: Security Test Suite
 * Frente 4.2 (Stream A): hardened scanner — entropy, allowlist, fail-closed, redact.
 *
 * Validates that secret patterns from .claude/hooks/secret-scanning.cjs
 * (now sharing bin/utils/secret-scanner-core.js) correctly detect real-world
 * credential formats and do NOT flag safe content.
 *
 * @module tests/security/secret-scanning.test
 */

const path = require('path');
const { execFileSync } = require('child_process');

// Real shared core under test (single source of truth for both scanners).
const core = require(path.join(__dirname, '..', '..', 'bin', 'utils', 'secret-scanner-core.js'));

// ---------------------------------------------------------------------------
// Patterns extracted from .claude/hooks/secret-scanning.cjs
// (kept inline to PROVE none of the 20+ patterns regressed)
// ---------------------------------------------------------------------------

const SECRET_PATTERNS = [
  // API Keys & Tokens
  // example values are split (prefix + body) so the source holds no contiguous
  // token literal; the runtime string is identical, so the regex still matches.
  { name: 'AWS Access Key', pattern: /AKIA[0-9A-Z]{16}/, example: 'AKIA' + 'IOSFODNN7EXAMPLE1' },
  { name: 'AWS Secret Key', pattern: /(?:aws_secret_access_key|secret_key)\s*[=:]\s*['"]?[A-Za-z0-9/+=]{40}['"]?/i, example: 'aws_secret_access_key = "' + 'wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY1"' },
  { name: 'GitHub Token (PAT)', pattern: /gh[ps]_[A-Za-z0-9_]{36,}/, example: 'ghp' + '_ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghij01' },
  { name: 'GitHub OAuth', pattern: /gho_[A-Za-z0-9_]{36,}/, example: 'gho' + '_ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghij01' },
  { name: 'Slack Token', pattern: /xox[bpors]-[0-9]{10,}-[A-Za-z0-9-]+/, example: 'xoxb' + '-1234567890-abcdefghijk' },
  { name: 'Stripe Key (live)', pattern: /[sr]k_(live|test)_[A-Za-z0-9]{20,}/, example: 'sk_live' + '_ABCDEFGHIJKLMNOPQRSTwx' },
  { name: 'Stripe Key (test)', pattern: /[sr]k_(live|test)_[A-Za-z0-9]{20,}/, example: 'rk_test' + '_ABCDEFGHIJKLMNOPQRSTwx' },
  { name: 'OpenAI Key', pattern: /sk-[A-Za-z0-9]{20,}/, example: 'sk' + '-ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuv' },
  { name: 'Anthropic Key', pattern: /sk-ant-[A-Za-z0-9-]{20,}/, example: 'sk-ant' + '-api03-abcdefghijklmnopqrstuvwxyz' },
  { name: 'Supabase JWT', pattern: /eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9\.[A-Za-z0-9_-]{50,}/, example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.' + 'a'.repeat(55) },
  { name: 'Google API Key', pattern: /AIza[0-9A-Za-z_-]{35}/, example: 'AIza' + 'SyB-abcdefghijklmnopqrstuvwxyz12345' },
  { name: 'Vercel Token', pattern: /vercel_[A-Za-z0-9]{20,}/, example: 'vercel' + '_ABCDEFGHIJKLMNOPQRSTwx' },

  // Private Keys
  { name: 'RSA Private Key', pattern: /-----BEGIN RSA PRIVATE KEY-----/, example: '-----BEGIN RSA PRIVATE KEY-----' },
  { name: 'SSH Private Key', pattern: /-----BEGIN OPENSSH PRIVATE KEY-----/, example: '-----BEGIN OPENSSH PRIVATE KEY-----' },
  { name: 'PGP Private Key', pattern: /-----BEGIN PGP PRIVATE KEY BLOCK-----/, example: '-----BEGIN PGP PRIVATE KEY BLOCK-----' },
  { name: 'EC Private Key', pattern: /-----BEGIN EC PRIVATE KEY-----/, example: '-----BEGIN EC PRIVATE KEY-----' },

  // Connection Strings
  { name: 'Postgres Connection String', pattern: /(?:postgres|mysql|mongodb|redis):\/\/[^:]+:[^@]+@[^/\s]+/i, example: 'postgres://user:password@host:5432/db' },
  { name: 'Supabase DB URL', pattern: /postgresql:\/\/postgres\.[A-Za-z0-9]+:[^@]+@/i, example: 'postgresql://postgres.abcxyz:secretpassword@db.supabase.co' },

  // Generic Patterns
  { name: 'Hardcoded Password', pattern: /(?:password|passwd|pwd)\s*[=:]\s*['"][^'"]{8,}['"]/i, example: 'password = "mySuperSecretPwd123"' },
  { name: 'Bearer Token', pattern: /[Bb]earer\s+[A-Za-z0-9_\-.]{20,}/, example: 'Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9' },
  { name: 'Basic Auth', pattern: /[Bb]asic\s+[A-Za-z0-9+/=]{20,}/, example: 'Basic dXNlcjpwYXNzd29yZDEyMzQ1Njc4OQ==' },
];

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('Secret Pattern Detection (Story 8.10)', () => {
  describe('positive detection — each pattern matches its example', () => {
    test.each(SECRET_PATTERNS)('detects $name', ({ pattern, example }) => {
      expect(pattern.test(example)).toBe(true);
    });
  });

  describe('false-positive resistance — safe content is NOT flagged', () => {
    const SAFE_CONTENT = [
      'const API_KEY = process.env.API_KEY;',
      'NEXT_PUBLIC_URL=https://example.com',
      'const password = req.body.password;',
      '// This is a comment about AWS access keys',
      'const AKIA = "placeholder";',  // too short to match 16 chars after AKIA
      'export const DB_URL = process.env.DATABASE_URL;',
      'password: process.env.DB_PASSWORD,',
      'Authorization: `Bearer ${token}`',
      '// sk-ant-... is the Anthropic key format',
      'const isStripeKey = key.startsWith("sk_live_");',
      'ghp_ is a GitHub PAT prefix',
      'xoxb tokens are Slack bot tokens',
      'vercel_ prefix tokens',
      '-----BEGIN PUBLIC KEY-----',  // public keys are fine
      '-----BEGIN CERTIFICATE-----', // certs are fine
    ];

    test.each(SAFE_CONTENT)('does NOT flag: %s', (line) => {
      for (const { pattern, name } of SECRET_PATTERNS) {
        expect(pattern.test(line)).toBe(false);
      }
    });
  });

  describe('multi-line content scanning', () => {
    test('detects secret embedded in multi-line content', () => {
      const content = [
        'const config = {',
        '  host: "localhost",',
        '  key: "AKIAIOSFODNN7EXAMPLE1",',
        '  port: 3000,',
        '};',
      ].join('\n');

      const awsPattern = SECRET_PATTERNS.find((p) => p.name === 'AWS Access Key');
      expect(awsPattern.pattern.test(content)).toBe(true);
    });

    test('detects private key header in file content', () => {
      const content = [
        '-----BEGIN RSA PRIVATE KEY-----',
        'MIIEpAIBAAKCAQEA0Z3VS5JJcds3xfn/ygWyF8...',
        '-----END RSA PRIVATE KEY-----',
      ].join('\n');

      const rsaPattern = SECRET_PATTERNS.find((p) => p.name === 'RSA Private Key');
      expect(rsaPattern.pattern.test(content)).toBe(true);
    });

    test('detects connection string in config block', () => {
      const content = 'DATABASE_URL=postgres://admin:s3cret@prod-db.example.com:5432/myapp';
      const pgPattern = SECRET_PATTERNS.find((p) => p.name === 'Postgres Connection String');
      expect(pgPattern.pattern.test(content)).toBe(true);
    });
  });

  describe('edge cases', () => {
    test('AWS key with exactly 16 characters after AKIA', () => {
      expect(/AKIA[0-9A-Z]{16}/.test('AKIA1234567890ABCDEF')).toBe(true);
    });

    test('AWS key too short does NOT match', () => {
      expect(/AKIA[0-9A-Z]{16}/.test('AKIA123')).toBe(false);
    });

    test('GitHub token with minimum 36 characters', () => {
      const minToken = 'ghp_' + 'a'.repeat(36);
      expect(/gh[ps]_[A-Za-z0-9_]{36,}/.test(minToken)).toBe(true);
    });

    test('password assignment with short value does NOT match', () => {
      // Pattern requires 8+ chars between quotes
      expect(/(?:password|passwd|pwd)\s*[=:]\s*['"][^'"]{8,}['"]/i.test('password = "short"')).toBe(false);
    });

    test('password assignment with 8+ char value matches', () => {
      expect(/(?:password|passwd|pwd)\s*[=:]\s*['"][^'"]{8,}['"]/i.test('password = "longpassword"')).toBe(true);
    });
  });
});

// ===========================================================================
// Hardened core (Frente 4.2 — Stream A)
// ===========================================================================

describe('Shared scanner core — no pattern regression', () => {
  // Every legacy named pattern must still be present in the core and must still
  // detect its canonical example. This is the explicit "20+ patterns preserved"
  // guarantee.
  const LEGACY_NAMES = [
    'AWS Access Key', 'AWS Secret Key', 'GitHub Token', 'GitHub OAuth',
    'Slack Token', 'Stripe Key', 'OpenAI Key', 'Anthropic Key',
    'Supabase Key', 'Google API Key', 'Vercel Token',
    'RSA Private Key', 'SSH Private Key', 'PGP Private Key', 'EC Private Key',
    'DB Connection String', 'Supabase DB URL',
    'Hardcoded Password', 'Bearer Token', 'Basic Auth',
  ];

  test('core exposes at least 20 named patterns', () => {
    expect(core.NAMED_PATTERNS.length).toBeGreaterThanOrEqual(20);
  });

  test.each(LEGACY_NAMES)('legacy pattern still present: %s', (name) => {
    const found = core.NAMED_PATTERNS.some((p) => p.name === name);
    expect(found).toBe(true);
  });

  // Realistic (non-placeholder, high-entropy) samples — one per named pattern.
  // These prove the core flags GENUINE secrets end-to-end (named pattern OR
  // entropy backstop), distinct from the inline regex tests above which prove
  // the raw regexes still match their canonical (possibly placeholder) examples.
  // Fake high-entropy samples, one per pattern. The provider-prefix and the body
  // are kept as separate string literals (joined at runtime) so this source file
  // holds NO contiguous token literal — the runtime value is identical, the core
  // still flags it, but push-protection / external scanners never see a real-shaped
  // token in the file. Same defensive style as the Supabase JWT and PEM samples.
  const REAL_SAMPLES = [
    ['AWS Access Key', 'AKIA' + '7G4Q2XV9PLZK3MWB'],
    ['AWS Secret Key', 'aws_secret_access_key = "' + 'Xk9Bv2Lc8Rt6Wy3Ds1Fg5Hj0Aq7Zm4Np2Tb6Vd"'],
    ['GitHub Token', 'ghp' + '_9XqK2vNp7Bw4Lc8Rt6Wy3Ds1Fg5Hj0Aq7Zm4'],
    ['GitHub OAuth', 'gho' + '_9XqK2vNp7Bw4Lc8Rt6Wy3Ds1Fg5Hj0Aq7Zm4'],
    ['Slack Token', 'xoxb' + '-9283746152-Xq9Zk2mNp7Bv4Lc8Rt'],
    ['Stripe Key', 'sk_live' + '_9XqK2vNp7Bw4Lc8Rt6Wy3Ds'],
    ['OpenAI Key', 'sk' + '-9XqK2vNp7Bw4Lc8Rt6Wy3Ds1Fg5Hj0Aq7Zm4Np2Tb6Vd'],
    ['Anthropic Key', 'sk-ant' + '-api03-9XqK2vNp7Bw4Lc8Rt6Wy3Ds'],
    ['Supabase Key', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.' + 'Xq9Zk2mNp7Bv4Lc8Rt6Wy3Ds1Fg5Hj0Aq7Zm4Np2Tb6VdJ8wErY'],
    ['Google API Key', 'AIza' + 'SyD9Xq2Zk7Np4Bv8Lc6Rt3Wy1Ds5Fg0Hj'],
    ['Vercel Token', 'vercel' + '_9XqK2vNp7Bw4Lc8Rt6Wy3Ds'],
    ['DB Connection String', 'postgres://admin:' + 'Xk9Bv2Lc8Rt@prod-db.internal:5432/app'],
    ['Supabase DB URL', 'postgresql://postgres.abcxyz9q:' + 'Xk9Bv2Lc8Rt6@db.supabase.co'],
    ['Hardcoded Password', 'password = "' + 'Tq9Xk2mNp7Bv4Lc8Rt"'],
    ['Bearer Token', 'Bearer ' + 'Xq9Zk2mNp7Bv4Lc8Rt6Wy3Ds1Fg5Hj0Aq'],
    ['Basic Auth', 'Basic ' + 'Wk85cjJxOXpYazJtTnA3QnY0TGM4UnQ2V3kz'],
  ];

  test.each(REAL_SAMPLES)('core flags a genuine %s', (_name, sample) => {
    const findings = core.scanContent(sample, { filePath: 'src/secrets.js' });
    expect(findings.length).toBeGreaterThan(0);
  });

  // Private-key PEM headers (built dynamically so this test file holds no literal
  // header that would self-trip scanners).
  const PK = String.fromCharCode(80) + 'RIVATE KEY';
  const PEM = (kind) => `-----BEGIN ${kind} ${PK}-----`;
  test.each([['RSA'], ['OPENSSH'], ['EC']])('core flags %s private key header', (kind) => {
    const findings = core.scanContent(PEM(kind), { filePath: 'id_key' });
    expect(findings.length).toBeGreaterThan(0);
  });
});

describe('Shannon entropy', () => {
  test('low-entropy repetitive string scores low', () => {
    expect(core.shannonEntropy('aaaaaaaaaaaaaaaaaaaa')).toBeLessThan(1);
  });

  test('high-entropy random string scores high', () => {
    expect(core.shannonEntropy('Xq9-Zk2mNp7Bv4Lc8Rt6Wy3Ds1Fg5Hj0Aa')).toBeGreaterThan(4);
  });

  test('empty string scores zero', () => {
    expect(core.shannonEntropy('')).toBe(0);
  });

  test('flags unnamed high-entropy token as suspected secret', () => {
    const content = 'const apiToken = "Xq9Zk2mNp7Bv4Lc8Rt6Wy3Ds1Fg5Hj0Aa";';
    const findings = core.scanContent(content, { filePath: 'src/api.js' });
    expect(findings.some((f) => f.kind === 'entropy')).toBe(true);
  });

  test('does NOT flag low-entropy string even at 20+ chars', () => {
    const content = 'const label = "aaaaaaaaaaaaaaaaaaaaaaaa";';
    const findings = core.scanContent(content, { filePath: 'src/x.js' });
    expect(findings.length).toBe(0);
  });

  test('does NOT flag lockfile integrity hashes (context allowlist)', () => {
    const hash = 'sha512-K8Jp2qVx7mNw4tLb9cRfYhGzAeDuQsWnXvUgEoPiBjMy3rT6kHd';
    const content = `"integrity": "${hash}"`;
    const findings = core.scanContent(content, { filePath: 'package-lock.json' });
    expect(findings.length).toBe(0);
  });
});

describe('Placeholder allowlist — fakes PASS', () => {
  const PLACEHOLDERS = [
    'STRIPE_KEY=your-key-here',
    'api_key = "CHANGEME"',
    'token: <sua-chave>',
    'secret = "REPLACE_ME"',
    'key = "${TOKEN}"',
    'password = "placeholder"',
    'const url = "https://example.com/api";',
    'aws_secret_access_key = "wJalrXUtnFEMI/K7MDENG/bPxRfiCYzEXAMPLEK"',
    'Bearer your-token-goes-here-xx',
  ];

  test.each(PLACEHOLDERS)('placeholder is allowed: %s', (line) => {
    const findings = core.scanContent(line, { filePath: 'src/config.js' });
    expect(findings.length).toBe(0);
  });

  test('isAllowlistPlaceholder recognizes angle/bracket/brace forms', () => {
    expect(core.isAllowlistPlaceholder('<your-key>')).toBe(true);
    expect(core.isAllowlistPlaceholder('[CHANGE_ME]')).toBe(true);
    expect(core.isAllowlistPlaceholder('${TOKEN}')).toBe(true);
    expect(core.isAllowlistPlaceholder('YOUR_API_KEY')).toBe(true);
    expect(core.isAllowlistPlaceholder('xxxxxxxx')).toBe(true);
  });

  test('isAllowlistPlaceholder does NOT allow a real-looking random token', () => {
    expect(core.isAllowlistPlaceholder('Xq9Zk2mNp7Bv4Lc8Rt6Wy3Ds1Fg5Hj0Aa')).toBe(false);
  });

  test('structural key with coincidental placeholder substring still blocks', () => {
    // Real AWS access key containing "123456" must NOT be allowlisted.
    const findings = core.scanContent('AKIA1234567890ABCDEF', { filePath: 'src/x.js' });
    expect(findings.some((f) => f.name === 'AWS Access Key')).toBe(true);
  });
});

describe('Redaction — secrets never printed in full', () => {
  test('redactMatch masks the tail and never returns the full value', () => {
    const secret = 'sk_live' + '_ABCDEFGHIJKLMNOPQRSTwx';
    const red = core.redactMatch(secret);
    expect(red).not.toBe(secret);
    expect(red).not.toContain('GHIJKLMNOPQRST');
    expect(red).toContain('REDACTED');
  });

  test('every finding carries a redacted (not raw) sample', () => {
    const secret = 'AKIA1234567890ABCDEF';
    const findings = core.scanContent(secret, { filePath: 'src/x.js' });
    expect(findings.length).toBeGreaterThan(0);
    for (const f of findings) {
      expect(f.redacted).toBeDefined();
      expect(f).not.toHaveProperty('matchedValue'); // raw value never exposed
      expect(f.redacted).not.toBe(secret);
    }
  });
});

describe('Claude Code hook — fail-CLOSED + exit codes (integration)', () => {
  const HOOK = path.join(__dirname, '..', '..', '.claude', 'hooks', 'secret-scanning.cjs');
  const root = path.join(__dirname, '..', '..');

  function runHook(stdin) {
    try {
      execFileSync('node', [HOOK], {
        input: stdin,
        encoding: 'utf8',
        env: { ...process.env, CLAUDE_PROJECT_DIR: root },
        stdio: ['pipe', 'pipe', 'pipe'],
      });
      return 0;
    } catch (err) {
      return typeof err.status === 'number' ? err.status : 1;
    }
  }

  test('real secret in a scannable src file is BLOCKED (exit 2)', () => {
    const payload = JSON.stringify({
      tool_name: 'Write',
      tool_input: { file_path: path.join(root, 'src', 'leak.js'), content: 'const k="AKIA1234567890ABCDEF";' },
    });
    expect(runHook(payload)).toBe(2);
  });

  test('placeholder content is ALLOWED (exit 0)', () => {
    const payload = JSON.stringify({
      tool_name: 'Write',
      tool_input: { file_path: path.join(root, 'src', 'cfg.js'), content: 'STRIPE_KEY=your-key-here' },
    });
    expect(runHook(payload)).toBe(0);
  });

  test('malformed JSON input fails CLOSED (exit 2, never silently allows)', () => {
    expect(runHook('this-is-not-json{')).toBe(2);
  });

  test('non-Write/Edit tool is ignored (exit 0)', () => {
    expect(runHook(JSON.stringify({ tool_name: 'Read', tool_input: { file_path: 'x' } }))).toBe(0);
  });
});

describe('Staged scanner — shared core + back-compat exports', () => {
  const staged = require(path.join(__dirname, '..', '..', 'bin', 'utils', 'staged-secret-scan.js'));

  test('exposes back-compat API', () => {
    expect(Array.isArray(staged.SECRET_PATTERNS)).toBe(true);
    expect(staged.SECRET_PATTERNS.length).toBeGreaterThanOrEqual(20);
    expect(typeof staged.findSecretMatches).toBe('function');
    expect(typeof staged.scanStagedFiles).toBe('function');
    expect(typeof staged.isBlockedEnvFile).toBe('function');
  });

  test('findSecretMatches detects a real key and skips a placeholder', () => {
    expect(staged.findSecretMatches('AKIA1234567890ABCDEF', 'src/x.js').length).toBeGreaterThan(0);
    expect(staged.findSecretMatches('STRIPE_KEY=your-key-here', 'src/x.js').length).toBe(0);
  });

  test('isBlockedEnvFile blocks .env but allows .env.example', () => {
    expect(staged.isBlockedEnvFile('.env')).toBe(true);
    expect(staged.isBlockedEnvFile('config/.env.production')).toBe(true);
    expect(staged.isBlockedEnvFile('.env.example')).toBe(false);
    expect(staged.isBlockedEnvFile('.env.template')).toBe(false);
  });
});
