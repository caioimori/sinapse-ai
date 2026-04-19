/**
 * Unit Tests: Doctor Orchestrator
 * Story INS-4.1: sinapse doctor rewrite
 *
 * Tests for options forwarding, output format, and fix/dry-run behavior.
 */

const fs = require('fs');
const os = require('os');
const path = require('path');

// Use real modules for orchestrator testing (checks will hit real filesystem)
const { runDoctorChecks, DOCTOR_VERSION, resolveExitCode } = require('../../../../../.sinapse-ai/core/doctor');

const projectRoot = path.resolve(__dirname, '..', '..', '..', '..', '..');

describe('Doctor Orchestrator', () => {
  describe('version', () => {
    it('should export DOCTOR_VERSION as semver string (Story A.3 bumped to 2.1.0)', () => {
      expect(DOCTOR_VERSION).toBe('2.1.0');
    });
  });

  describe('options forwarding (AC1)', () => {
    it('should accept and use options object', async () => {
      const result = await runDoctorChecks({ projectRoot });
      expect(result).toHaveProperty('formatted');
      expect(result).toHaveProperty('data');
      expect(result.data).toHaveProperty('version', '2.1.0');
      expect(result.data).toHaveProperty('summary');
      expect(result.data).toHaveProperty('checks');
    });

    it('should produce JSON when json option is true', async () => {
      const result = await runDoctorChecks({ json: true, projectRoot });
      expect(result.formatted).toBeTruthy();

      // Should be valid JSON
      const parsed = JSON.parse(result.formatted);
      expect(parsed).toHaveProperty('version');
      expect(parsed).toHaveProperty('summary');
      expect(parsed).toHaveProperty('checks');
    });

    it('should produce text when json option is false', async () => {
      const result = await runDoctorChecks({ json: false, projectRoot });
      expect(result.formatted).toContain('SINAPSE Doctor');
      expect(result.formatted).toContain('Summary:');
    });
  });

  describe('15 checks (AC2 + INS-4.8)', () => {
    it('should run exactly 15 checks', async () => {
      const result = await runDoctorChecks({ projectRoot });
      expect(result.data.checks).toHaveLength(15);
    });

    it('should return valid status for each check', async () => {
      const result = await runDoctorChecks({ projectRoot });
      const validStatuses = ['PASS', 'WARN', 'FAIL', 'INFO'];

      for (const check of result.data.checks) {
        expect(validStatuses).toContain(check.status);
        expect(check).toHaveProperty('check');
        expect(check).toHaveProperty('message');
      }
    });

    it('should include all expected check names', async () => {
      const result = await runDoctorChecks({ projectRoot });
      const checkNames = result.data.checks.map((c) => c.check);

      expect(checkNames).toContain('settings-json');
      expect(checkNames).toContain('rules-files');
      expect(checkNames).toContain('agent-memory');
      expect(checkNames).toContain('entity-registry');
      expect(checkNames).toContain('git-hooks');
      expect(checkNames).toContain('core-config');
      expect(checkNames).toContain('claude-md');
      expect(checkNames).toContain('ide-sync');
      expect(checkNames).toContain('graph-dashboard');
      expect(checkNames).toContain('code-intel');
      expect(checkNames).toContain('node-version');
      expect(checkNames).toContain('npm-packages');
      expect(checkNames).toContain('skills-count');
      expect(checkNames).toContain('commands-count');
      expect(checkNames).toContain('hooks-claude-count');
    });
  });

  describe('summary (AC3)', () => {
    it('should have pass/warn/fail/info counts that sum to 15', async () => {
      const result = await runDoctorChecks({ projectRoot });
      const { pass, warn, fail, info } = result.data.summary;
      expect(pass + warn + fail + info).toBe(15);
    });

    it('should include Summary line in text output', async () => {
      const result = await runDoctorChecks({ projectRoot });
      expect(result.formatted).toMatch(/Summary: \d+ PASS \| \d+ WARN \| \d+ FAIL \| \d+ INFO/);
    });
  });

  describe('--dry-run (AC4)', () => {
    it('should include fixResults when dryRun is true', async () => {
      const result = await runDoctorChecks({ dryRun: true, projectRoot });
      expect(result.data).toHaveProperty('fixResults');
    });

    it('should not produce file changes with dryRun', async () => {
      const result = await runDoctorChecks({ dryRun: true, projectRoot });
      if (result.data.fixResults) {
        for (const fr of result.data.fixResults) {
          expect(fr.applied).toBe(false);
        }
      }
    });
  });

  describe('NOT_INSTALLED short-circuit (Story 10.42)', () => {
    let tempDir;
    let fakeHome;

    beforeEach(() => {
      // Isolated projectRoot + fake HOME so the doctor cannot see the
      // developer's real ~/.sinapse or ~/.claude. Passing homeDir via
      // options is the reliable way across POSIX and Windows (os.homedir
      // sometimes ignores env changes mid-process).
      tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'sinapse-doctor-fresh-'));
      fakeHome = fs.mkdtempSync(path.join(os.tmpdir(), 'sinapse-doctor-home-'));
    });

    afterEach(() => {
      try { fs.rmSync(tempDir, { recursive: true, force: true }); } catch {}
      try { fs.rmSync(fakeHome, { recursive: true, force: true }); } catch {}
    });

    it('should return notInstalled=true when no SINAPSE markers exist', async () => {
      const result = await runDoctorChecks({ projectRoot: tempDir, homeDir: fakeHome });
      expect(result.data.notInstalled).toBe(true);
      expect(result.data.installCommand).toBe('npx sinapse-ai install');
      expect(result.data.checks).toHaveLength(0);
    });

    it('should produce friendly NOT_INSTALLED text (no FAIL lines)', async () => {
      const result = await runDoctorChecks({ projectRoot: tempDir, homeDir: fakeHome });
      expect(result.formatted).toContain('SINAPSE is not installed');
      expect(result.formatted).toContain('npx sinapse-ai install');
      expect(result.formatted).not.toContain('[FAIL]');
    });

    it('should include notInstalled flag in JSON output', async () => {
      const result = await runDoctorChecks({ json: true, projectRoot: tempDir, homeDir: fakeHome });
      const parsed = JSON.parse(result.formatted);
      expect(parsed.notInstalled).toBe(true);
      expect(parsed.installCommand).toBe('npx sinapse-ai install');
    });

    it('should map to exit code 4', async () => {
      const result = await runDoctorChecks({ projectRoot: tempDir, homeDir: fakeHome });
      expect(resolveExitCode(result)).toBe(4);
    });

    it('should fall back to full check suite when a project marker exists', async () => {
      // Drop a .sinapse-ai/ dir into the temp project. That alone should
      // flip detection to installed=true and run the full check path.
      fs.mkdirSync(path.join(tempDir, '.sinapse-ai'), { recursive: true });
      const result = await runDoctorChecks({ projectRoot: tempDir, homeDir: fakeHome });
      expect(result.data.notInstalled).toBeUndefined();
      expect(result.data.checks.length).toBeGreaterThan(0);
    });
  });

  describe('JSON output schema (AC3)', () => {
    it('should match expected JSON schema', async () => {
      const result = await runDoctorChecks({ json: true, projectRoot });
      const parsed = JSON.parse(result.formatted);

      expect(parsed).toHaveProperty('version');
      expect(parsed).toHaveProperty('timestamp');
      expect(parsed).toHaveProperty('summary');
      expect(parsed.summary).toHaveProperty('pass');
      expect(parsed.summary).toHaveProperty('warn');
      expect(parsed.summary).toHaveProperty('fail');
      expect(parsed.summary).toHaveProperty('info');
      expect(parsed).toHaveProperty('checks');
      expect(Array.isArray(parsed.checks)).toBe(true);
    });
  });
});

