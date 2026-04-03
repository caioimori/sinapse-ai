'use strict';

const fs = require('fs');
const os = require('os');
const path = require('path');

const {
  syncCodexLocalFirst,
} = require('../../.sinapse-ai/infrastructure/scripts/sync-codex-local-first');

describe('sync-codex-local-first', () => {
  let tmpRoot;

  beforeEach(() => {
    tmpRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'sinapse-sync-codex-local-first-'));
  });

  afterEach(() => {
    fs.rmSync(tmpRoot, { recursive: true, force: true });
  });

  it('preserves the expanded Codex agent catalog and syncs skills only', () => {
    fs.mkdirSync(path.join(tmpRoot, '.codex', 'agents'), { recursive: true });
    fs.writeFileSync(path.join(tmpRoot, '.codex', 'agents', 'architect.md'), '# architect', 'utf8');
    fs.mkdirSync(path.join(tmpRoot, '.codex', 'skills', 'sinapse-brand'), { recursive: true });
    fs.writeFileSync(path.join(tmpRoot, '.codex', 'skills', 'sinapse-brand', 'SKILL.md'), '# brand', 'utf8');
    fs.writeFileSync(
      path.join(tmpRoot, '.codex', 'catalog.json'),
      JSON.stringify({
        version: 1,
        catalogMode: 'expanded',
        codexAgentsDir: '.codex/agents',
        skillsDir: '.codex/skills',
        canonicalAgentsDir: '.sinapse-ai/development/agents',
      }),
      'utf8',
    );

    const syncSkills = jest.fn(() => ({ generated: 12 }));

    const result = syncCodexLocalFirst(
      { projectRoot: tmpRoot },
      { syncSkills },
    );

    expect(syncSkills).toHaveBeenCalled();
    expect(result.ok).toBe(true);
    expect(result.mode).toBe('expanded');
    expect(result.metrics.codexAgents).toBe(1);
    expect(result.metrics.codexSkills).toBe(1);
    expect(result.metrics.generatedSkills).toBe(12);
  });

  it('delegates to the legacy Codex sync outside expanded mode', () => {
    const runLegacyCodexSync = jest.fn(() => ({
      ok: true,
      mode: 'canonical',
      delegated: true,
      stdout: 'legacy-sync',
      stderr: '',
      status: 0,
    }));

    const result = syncCodexLocalFirst(
      { projectRoot: tmpRoot },
      { runLegacyCodexSync },
    );

    expect(runLegacyCodexSync).toHaveBeenCalledWith(tmpRoot, { projectRoot: tmpRoot });
    expect(result.ok).toBe(true);
    expect(result.mode).toBe('canonical');
  });
});
