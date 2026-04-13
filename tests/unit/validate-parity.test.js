'use strict';

const fs = require('fs');
const os = require('os');
const path = require('path');
const {
  runParityValidation,
  diffCompatibilityContracts,
  parseArgs,
  getDefaultContractPath,
  extractSyncFailureDetails,
} = require('../../.sinapse-ai/infrastructure/scripts/validate-parity');

describe('validate-parity', () => {
  function createMockProjectRoot() {
    const root = fs.mkdtempSync(path.join(os.tmpdir(), 'sinapse-parity-'));
    fs.mkdirSync(path.join(root, 'docs'), { recursive: true });
    fs.writeFileSync(
      path.join(root, 'docs', 'ide-integration.md'),
      [
        '| IDE/CLI | Overall Status |',
        '| --- | --- |',
        '| Claude Code | Works |',
        '| Codex CLI | Works |',
      ].join('\n'),
      'utf8',
    );
    return root;
  }

  function buildMockContract() {
    return {
      release: 'SINAPSE 4.0.4',
      global_required_checks: ['paths'],
      ide_matrix: [
        { ide: 'claude-code', display_name: 'Claude Code', expected_status: 'Works', required_checks: ['claude-sync', 'claude-integration'] },
        { ide: 'codex', display_name: 'Codex CLI', expected_status: 'Works', required_checks: ['codex-sync', 'codex-integration', 'codex-skills'] },
      ],
    };
  }

  it('passes when all checks return ok', () => {
    const projectRoot = createMockProjectRoot();
    const ok = { ok: true, errors: [], warnings: [] };
    const result = runParityValidation(
      { projectRoot },
      {
        runSyncValidate: () => ok,
        validateClaudeIntegration: () => ok,
        validateCodexSync: () => ok,
        validateCodexIntegration: () => ok,
        validateCodexSkills: () => ok,
        validatePaths: () => ok,
        loadCompatibilityContract: () => buildMockContract(),
      },
    );

    expect(result.ok).toBe(true);
    expect(result.checks).toHaveLength(6);
    expect(result.checks.every((c) => c.ok)).toBe(true);
    expect(result.contractViolations).toHaveLength(0);
  });

  it('fails when any check fails', () => {
    const projectRoot = createMockProjectRoot();
    let count = 0;
    const result = runParityValidation(
      { projectRoot },
      {
        runSyncValidate: () => ({ ok: true, errors: [], warnings: [] }),
        validateClaudeIntegration: () => ({ ok: true, errors: [], warnings: [] }),
        validateCodexIntegration: () => {
          count += 1;
          return count === 1
            ? { ok: false, errors: ['broken codex integration'], warnings: [] }
            : { ok: true, errors: [], warnings: [] };
        },
        validateCodexSkills: () => ({ ok: true, errors: [], warnings: [] }),
        validatePaths: () => ({ ok: true, errors: [], warnings: [] }),
        loadCompatibilityContract: () => buildMockContract(),
      },
    );

    expect(result.ok).toBe(false);
    expect(result.checks.some((c) => c.id === 'codex-integration' && c.ok === false)).toBe(true);
  });

  it('fails when docs matrix claim diverges from contract', () => {
    const projectRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'sinapse-parity-mismatch-'));
    fs.mkdirSync(path.join(projectRoot, 'docs'), { recursive: true });
    fs.writeFileSync(path.join(projectRoot, 'docs', 'ide-integration.md'), '| IDE/CLI | Overall Status |\n| --- | --- |\n| Codex CLI | Works |\n', 'utf8');

    const ok = { ok: true, errors: [], warnings: [] };
    const result = runParityValidation(
      { projectRoot },
      {
        runSyncValidate: () => ok,
        validateClaudeIntegration: () => ok,
        validateCodexIntegration: () => ok,
        validateCodexSkills: () => ok,
        validatePaths: () => ok,
        loadCompatibilityContract: () => buildMockContract(),
      },
    );

    expect(result.ok).toBe(false);
    expect(result.contractViolations.length).toBeGreaterThan(0);
  });

  it('generates diff between contract versions', () => {
    const previous = buildMockContract();
    // Make previous codex status different so diff detects a change
    previous.ide_matrix = previous.ide_matrix.map((ide) => {
      if (ide.ide === 'codex') {
        return { ...ide, expected_status: 'Limited' };
      }
      return ide;
    });
    const current = buildMockContract();
    current.release = 'SINAPSE 4.1.0';
    current.global_required_checks = ['paths', 'codex-skills'];

    const diff = diffCompatibilityContracts(current, previous);

    expect(diff).toBeDefined();
    expect(diff.release_changed).toBe(true);
    expect(diff.has_changes).toBe(true);
    expect(diff.global_required_checks.added).toContain('codex-skills');
    expect(diff.ide_changes.some((change) => change.ide === 'codex')).toBe(true);
  });

  // ---- Story 10.18: Cross-IDE Parity Hardening ----

  describe('parseArgs (Story 10.18)', () => {
    it('recognizes the --fast flag', () => {
      const args = parseArgs(['--fast']);
      expect(args.fast).toBe(true);
    });

    it('defaults --fast to false', () => {
      const args = parseArgs([]);
      expect(args.fast).toBe(false);
    });

    it('combines --fast with --quiet without losing either', () => {
      const args = parseArgs(['--fast', '--quiet']);
      expect(args.fast).toBe(true);
      expect(args.quiet).toBe(true);
    });
  });

  describe('getDefaultContractPath (Story 10.18)', () => {
    it('prefers sinapse-current.yaml when it exists on disk', () => {
      const root = fs.mkdtempSync(path.join(os.tmpdir(), 'sinapse-contract-'));
      const dir = path.join(root, '.sinapse-ai', 'infrastructure', 'contracts', 'compatibility');
      fs.mkdirSync(dir, { recursive: true });
      fs.writeFileSync(path.join(dir, 'sinapse-current.yaml'), 'release: "SINAPSE 10.0.0"\n', 'utf8');
      fs.writeFileSync(path.join(dir, 'sinapse-4.0.4.yaml'), 'release: "SINAPSE 4.0.4"\n', 'utf8');
      expect(getDefaultContractPath(root)).toBe(path.join(dir, 'sinapse-current.yaml'));
    });

    it('falls back to sinapse-4.0.4.yaml when sinapse-current.yaml is absent', () => {
      const root = fs.mkdtempSync(path.join(os.tmpdir(), 'sinapse-contract-fallback-'));
      const dir = path.join(root, '.sinapse-ai', 'infrastructure', 'contracts', 'compatibility');
      fs.mkdirSync(dir, { recursive: true });
      fs.writeFileSync(path.join(dir, 'sinapse-4.0.4.yaml'), 'release: "SINAPSE 4.0.4"\n', 'utf8');
      expect(getDefaultContractPath(root)).toBe(path.join(dir, 'sinapse-4.0.4.yaml'));
    });
  });

  describe('extractSyncFailureDetails (Story 10.18)', () => {
    it('extracts drift count from sync validate report', () => {
      const report = '| Drift | 3 |\n| Missing | 0 |';
      const details = extractSyncFailureDetails(report);
      expect(details.some((d) => d.includes('3 file(s) drifted'))).toBe(true);
    });

    it('extracts missing count from sync validate report', () => {
      const report = '| Drift | 0 |\n| Missing | 2 |';
      const details = extractSyncFailureDetails(report);
      expect(details.some((d) => d.includes('2 file(s) missing'))).toBe(true);
    });

    it('extracts orphaned count from sync validate report', () => {
      const report = '| Orphaned | 1 |';
      const details = extractSyncFailureDetails(report);
      expect(details.some((d) => d.includes('1 orphaned file'))).toBe(true);
    });

    it('returns empty array on null or non-string input', () => {
      expect(extractSyncFailureDetails(null)).toEqual([]);
      expect(extractSyncFailureDetails(undefined)).toEqual([]);
      expect(extractSyncFailureDetails(42)).toEqual([]);
    });

    it('returns empty array when report shows zero drift', () => {
      const report = '| Drift | 0 |\n| Missing | 0 |\n| Orphaned | 0 |';
      const details = extractSyncFailureDetails(report);
      expect(details).toEqual([]);
    });
  });

  describe('runParityValidation --fast mode (Story 10.18)', () => {
    it('runs only sync + paths checks when fast=true (3 checks, not 6)', () => {
      const projectRoot = createMockProjectRoot();
      const ok = { ok: true, errors: [], warnings: [] };
      let claudeIntegrationCalled = false;
      let codexIntegrationCalled = false;
      let codexSkillsCalled = false;
      const result = runParityValidation(
        { projectRoot, fast: true },
        {
          runSyncValidate: () => ok,
          validateClaudeIntegration: () => {
            claudeIntegrationCalled = true;
            return ok;
          },
          validateCodexSync: () => ok,
          validateCodexIntegration: () => {
            codexIntegrationCalled = true;
            return ok;
          },
          validateCodexSkills: () => {
            codexSkillsCalled = true;
            return ok;
          },
          validatePaths: () => ok,
          loadCompatibilityContract: () => buildMockContract(),
        },
      );

      expect(result.ok).toBe(true);
      expect(result.fast).toBe(true);
      expect(result.checks).toHaveLength(3);
      expect(result.checks.map((c) => c.id).sort()).toEqual(['claude-sync', 'codex-sync', 'paths']);
      expect(claudeIntegrationCalled).toBe(false);
      expect(codexIntegrationCalled).toBe(false);
      expect(codexSkillsCalled).toBe(false);
    });

    it('skips contract loading and contract violations when fast=true', () => {
      const projectRoot = createMockProjectRoot();
      const ok = { ok: true, errors: [], warnings: [] };
      let contractLoaded = false;
      const result = runParityValidation(
        { projectRoot, fast: true },
        {
          runSyncValidate: () => ok,
          validateCodexSync: () => ok,
          validatePaths: () => ok,
          loadCompatibilityContract: () => {
            contractLoaded = true;
            return buildMockContract();
          },
        },
      );

      expect(contractLoaded).toBe(false);
      expect(result.contract).toBeNull();
      expect(result.contractViolations).toEqual([]);
      expect(result.contractDiff).toBeNull();
    });

    it('still fails fast when sync check fails', () => {
      const projectRoot = createMockProjectRoot();
      const result = runParityValidation(
        { projectRoot, fast: true },
        {
          runSyncValidate: () => ({
            ok: false,
            errors: ['Sync validation failed for claude-code', '3 file(s) drifted from source-of-truth'],
            warnings: [],
          }),
          validateCodexSync: () => ({ ok: true, errors: [], warnings: [] }),
          validatePaths: () => ({ ok: true, errors: [], warnings: [] }),
        },
      );

      expect(result.ok).toBe(false);
      const claudeSync = result.checks.find((c) => c.id === 'claude-sync');
      expect(claudeSync.ok).toBe(false);
      expect(claudeSync.errors).toContain('3 file(s) drifted from source-of-truth');
    });
  });

  it('includes contractDiff in parity result when --diff path is provided', () => {
    const projectRoot = createMockProjectRoot();
    const ok = { ok: true, errors: [], warnings: [] };
    const result = runParityValidation(
      { projectRoot, diffPath: '.sinapse-ai/infrastructure/contracts/compatibility/sinapse-4.0.3.yaml' },
      {
        runSyncValidate: () => ok,
        validateClaudeIntegration: () => ok,
        validateCodexSync: () => ok,
        validateCodexIntegration: () => ok,
        validateCodexSkills: () => ok,
        validatePaths: () => ok,
        loadCompatibilityContract: (contractPath) => {
          if (contractPath.endsWith('sinapse-4.0.3.yaml')) {
            return {
              release: 'SINAPSE 4.0.3',
              global_required_checks: ['paths'],
              ide_matrix: [
                { ide: 'codex', display_name: 'Codex CLI', expected_status: 'Experimental', required_checks: ['codex-sync'] },
              ],
            };
          }
          return buildMockContract();
        },
      },
    );

    expect(result.ok).toBe(true);
    expect(result.contractDiff).toBeDefined();
    expect(result.contractDiff.from_release).toBe('SINAPSE 4.0.3');
    expect(result.contractDiff.to_release).toBe('SINAPSE 4.0.4');
    expect(result.contractDiff.has_changes).toBe(true);
  });
});
