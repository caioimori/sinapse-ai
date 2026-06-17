/**
 * Golden Journey — E8-UX Fase K
 *
 * Proves the end-to-end SINAPSE journey by RESULT, not by file existence
 * (the anti-façade gate): onboard/activate the coordinator → the commit-time
 * security guards actually detect a secret and destructive SQL → the guards are
 * wired into the git hooks. It exercises the real detection functions instead of
 * counting markdown files.
 */
'use strict';

const fs = require('fs');
const path = require('path');

const REPO = path.resolve(__dirname, '..', '..');
const GITHOOKS = path.join(REPO, '.sinapse-ai', 'git-hooks');

const { findSecretMatches } = require(path.join(GITHOOKS, 'lib', 'staged-secret-scan.js'));
const { detectDangerousSql } = require(path.join(GITHOOKS, 'lib', 'staged-sql-guard.js'));

describe('Golden Journey (E8-UX Fase K) — onboard → activate → execute → safe commit', () => {
  describe('Step 1 — coordinator onboarding / activation', () => {
    test('master agent greeting carries the [Imperator] identity marker (D5)', () => {
      const src = fs.readFileSync(
        path.join(REPO, '.sinapse-ai', 'development', 'agents', 'snps-orqx.md'),
        'utf8',
      );
      expect(src).toMatch(/\[Imperator\]/);
    });

    test('activation template detects orchestrators (*-orqx, incl. sinapse/snps alias)', () => {
      const tpl = fs.readFileSync(
        path.join(REPO, '.sinapse-ai', 'product', 'templates', 'activation-instructions-inline-greeting.yaml'),
        'utf8',
      );
      expect(tpl).toMatch(/-orqx/);
      expect(tpl.toLowerCase()).toMatch(/orchestrator|orquestrador/);
    });

    test('agent prefix convention (D5) is documented', () => {
      const doc = path.join(REPO, 'docs', 'framework', 'agent-prefix-convention.md');
      expect(fs.existsSync(doc)).toBe(true);
      expect(fs.readFileSync(doc, 'utf8')).toMatch(/\[Imperator\]/);
    });
  });

  describe('Step 2 — commit-time security blocks (measured by result)', () => {
    test('a hardcoded API key is detected (commit would be blocked)', () => {
      const payload = 'const key = "sk-proj-' + 'A'.repeat(48) + '";';
      expect(findSecretMatches(payload, 'config.js').length).toBeGreaterThan(0);
    });

    test('a DB connection string with credentials is detected', () => {
      const payload = 'DATABASE_URL=postgres://user:S3cr3tP4ss@db.example.com:5432/app';
      expect(findSecretMatches(payload, '.env').length).toBeGreaterThan(0);
    });

    test('destructive SQL (DROP TABLE) is detected', () => {
      expect(detectDangerousSql('DROP TABLE users;')).toContain('DROP TABLE');
    });

    test('DELETE without WHERE is detected', () => {
      expect(detectDangerousSql('DELETE FROM users;')).toContain('DELETE without WHERE');
    });

    test('safe SQL is NOT flagged (no false positive)', () => {
      expect(detectDangerousSql('SELECT * FROM users WHERE id = 1;')).toHaveLength(0);
    });
  });

  describe('Step 3 — guards are wired into the git hooks (journey integrity)', () => {
    test('pre-commit chains secret-scan + sql-guard + framework-boundary', () => {
      const hook = fs.readFileSync(path.join(GITHOOKS, 'pre-commit'), 'utf8');
      expect(hook).toContain('staged-secret-scan.js');
      expect(hook).toContain('staged-sql-guard.js');
      expect(hook).toContain('framework-guard.js');
    });

    test('pre-push runs the aggregate validation gate', () => {
      const hook = fs.readFileSync(path.join(GITHOOKS, 'pre-push'), 'utf8');
      expect(hook).toMatch(/validate:all/);
    });
  });
});
