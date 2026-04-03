'use strict';

const fs = require('fs');
const os = require('os');
const path = require('path');

const {
  validateCodexSync,
} = require('../../.sinapse-ai/infrastructure/scripts/validate-codex-sync');

describe('validate-codex-sync', () => {
  let tmpRoot;

  beforeEach(() => {
    tmpRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'sinapse-validate-codex-sync-'));
  });

  afterEach(() => {
    fs.rmSync(tmpRoot, { recursive: true, force: true });
  });

  it('aggregates expanded-mode Codex checks', () => {
    fs.mkdirSync(path.join(tmpRoot, '.codex'), { recursive: true });
    fs.writeFileSync(
      path.join(tmpRoot, '.codex', 'catalog.json'),
      JSON.stringify({ version: 1, catalogMode: 'expanded' }),
      'utf8',
    );

    const result = validateCodexSync(
      { projectRoot: tmpRoot },
      {
        validateCodexCommandRegistry: () => ({ ok: true, errors: [], warnings: [] }),
        validateCodexIntegration: () => ({ ok: true, errors: [], warnings: [] }),
        validateCodexSkills: () => ({ ok: true, errors: [], warnings: [] }),
        validatePaths: () => ({ ok: true, errors: [], warnings: [] }),
      },
    );

    expect(result.ok).toBe(true);
    expect(result.mode).toBe('expanded');
    expect(result.checks.map((check) => check.id)).toEqual([
      'codex-catalog',
      'codex-integration',
      'codex-commands',
      'codex-skills',
      'paths',
    ]);
  });

  it('delegates to the legacy validator outside expanded mode', () => {
    const runLegacyCodexValidate = jest.fn(() => ({
      ok: true,
      mode: 'canonical',
      checks: [],
      errors: [],
      warnings: [],
      raw: 'legacy-ok',
    }));

    const result = validateCodexSync(
      { projectRoot: tmpRoot },
      { runLegacyCodexValidate },
    );

    expect(runLegacyCodexValidate).toHaveBeenCalledWith(tmpRoot, { projectRoot: tmpRoot });
    expect(result.ok).toBe(true);
    expect(result.mode).toBe('canonical');
    expect(result.raw).toBe('legacy-ok');
  });
});
