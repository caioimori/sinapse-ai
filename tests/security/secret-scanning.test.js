'use strict';

/**
 * Secret Scanning Pattern Tests
 * Story 8.10: Security Test Suite
 *
 * Validates that secret patterns from .claude/hooks/secret-scanning.cjs
 * correctly detect real-world credential formats and do NOT flag safe content.
 *
 * @module tests/security/secret-scanning.test
 */

// ---------------------------------------------------------------------------
// Patterns extracted from .claude/hooks/secret-scanning.cjs
// ---------------------------------------------------------------------------

const SECRET_PATTERNS = [
  // API Keys & Tokens
  { name: 'AWS Access Key', pattern: /AKIA[0-9A-Z]{16}/, example: 'AKIAIOSFODNN7EXAMPLE1' },
  { name: 'AWS Secret Key', pattern: /(?:aws_secret_access_key|secret_key)\s*[=:]\s*['"]?[A-Za-z0-9/+=]{40}['"]?/i, example: 'aws_secret_access_key = "wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY1"' },
  { name: 'GitHub Token (PAT)', pattern: /gh[ps]_[A-Za-z0-9_]{36,}/, example: 'ghp_ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghij01' },
  { name: 'GitHub OAuth', pattern: /gho_[A-Za-z0-9_]{36,}/, example: 'gho_ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghij01' },
  { name: 'Slack Token', pattern: /xox[bpors]-[0-9]{10,}-[A-Za-z0-9-]+/, example: 'xoxb-1234567890-abcdefghijk' },
  { name: 'Stripe Key (live)', pattern: /[sr]k_(live|test)_[A-Za-z0-9]{20,}/, example: 'sk_live_ABCDEFGHIJKLMNOPQRSTwx' },
  { name: 'Stripe Key (test)', pattern: /[sr]k_(live|test)_[A-Za-z0-9]{20,}/, example: 'rk_test_ABCDEFGHIJKLMNOPQRSTwx' },
  { name: 'OpenAI Key', pattern: /sk-[A-Za-z0-9]{20,}/, example: 'sk-ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuv' },
  { name: 'Anthropic Key', pattern: /sk-ant-[A-Za-z0-9-]{20,}/, example: 'sk-ant-api03-abcdefghijklmnopqrstuvwxyz' },
  { name: 'Supabase JWT', pattern: /eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9\.[A-Za-z0-9_-]{50,}/, example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.' + 'a'.repeat(55) },
  { name: 'Google API Key', pattern: /AIza[0-9A-Za-z_-]{35}/, example: 'AIzaSyB-abcdefghijklmnopqrstuvwxyz12345' },
  { name: 'Vercel Token', pattern: /vercel_[A-Za-z0-9]{20,}/, example: 'vercel_ABCDEFGHIJKLMNOPQRSTwx' },

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
