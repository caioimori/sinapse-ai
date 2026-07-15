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

  /**
   * Build a minimal fixture project: a core agent, a squad specialist, a squad
   * orchestrator, plus an orphan + a broken-pointer file already in .codex.
   */
  function seedExpandedFixture() {
    // Canonical source of truth
    fs.mkdirSync(path.join(tmpRoot, '.sinapse-ai', 'development', 'agents'), { recursive: true });
    fs.writeFileSync(
      path.join(tmpRoot, '.sinapse-ai', 'development', 'agents', 'architect.md'),
      '# architect',
      'utf8',
    );
    fs.mkdirSync(path.join(tmpRoot, 'squads', 'squad-brand', 'agents'), { recursive: true });
    fs.writeFileSync(
      path.join(tmpRoot, 'squads', 'squad-brand', 'agents', 'brand-orqx.md'),
      '# brand-orqx',
      'utf8',
    );
    fs.writeFileSync(
      path.join(tmpRoot, 'squads', 'squad-brand', 'agents', 'brand-strategist.md'),
      '# brand-strategist',
      'utf8',
    );
    // Retired agents must NOT re-enter the catalog
    fs.mkdirSync(path.join(tmpRoot, 'squads', 'claude-code-mastery', '_deprecated'), { recursive: true });
    fs.writeFileSync(
      path.join(tmpRoot, 'squads', 'claude-code-mastery', '_deprecated', 'claude-orqx.md'),
      '# claude-orqx (retired)',
      'utf8',
    );

    // Pre-existing .codex snapshot: a stale orphan + a broken pointer
    fs.mkdirSync(path.join(tmpRoot, '.codex', 'agents'), { recursive: true });
    fs.writeFileSync(
      path.join(tmpRoot, '.codex', 'agents', 'design-chief.md'),
      'Activate agent: design-chief\nSquad: squad-artdir\n',
      'utf8',
    );
    fs.writeFileSync(
      path.join(tmpRoot, '.codex', 'agents', 'brand-strategist.md'),
      'Activate agent: brand-strategist\nSquad: squad-brand\nRead the agent definition at: squads/DEAD/agents/brand-strategist.md\n',
      'utf8',
    );

    fs.mkdirSync(path.join(tmpRoot, '.agents', 'skills', 'sinapse-brand'), { recursive: true });
    fs.writeFileSync(path.join(tmpRoot, '.agents', 'skills', 'sinapse-brand', 'SKILL.md'), '# brand', 'utf8');
    fs.writeFileSync(
      path.join(tmpRoot, '.codex', 'catalog.json'),
      JSON.stringify({
        version: 1,
        catalogMode: 'expanded',
        codexAgentsDir: '.codex/agents',
        skillsDir: '.agents/skills',
        canonicalAgentsDir: '.sinapse-ai/development/agents',
      }),
      'utf8',
    );
  }

  it('regenerates the Codex agent catalog from source: prunes orphans, fixes pointers', () => {
    seedExpandedFixture();

    const syncSkills = jest.fn(() => ({ generated: 12 }));

    const result = syncCodexLocalFirst(
      { projectRoot: tmpRoot },
      { syncSkills },
    );

    expect(syncSkills).toHaveBeenCalled();
    expect(result.ok).toBe(true);
    expect(result.mode).toBe('expanded');

    const agentsDir = path.join(tmpRoot, '.codex', 'agents');
    const files = fs.readdirSync(agentsDir).sort();
    // 3 canonical agents only — orphan design-chief removed
    expect(files).toEqual(['architect.md', 'brand-orqx.md', 'brand-strategist.md']);
    expect(result.metrics.codexAgents).toBe(3);
    expect(result.metrics.agentsPruned).toBe(1);

    // Broken pointer repaired to the real source location
    const repaired = fs.readFileSync(path.join(agentsDir, 'brand-strategist.md'), 'utf8');
    expect(repaired).toContain('Read the agent definition at: squads/squad-brand/agents/brand-strategist.md');
    expect(repaired).not.toContain('squads/DEAD/');

    // Core agent points at the framework source, tagged as core
    const core = fs.readFileSync(path.join(agentsDir, 'architect.md'), 'utf8');
    expect(core).toContain('Squad: core');
    expect(core).toContain('Read the agent definition at: .sinapse-ai/development/agents/architect.md');

    expect(result.metrics.codexSkills).toBe(1);
    expect(result.metrics.generatedSkills).toBe(12);
  });

  it('is idempotent: a second run writes nothing', () => {
    seedExpandedFixture();
    const syncSkills = jest.fn(() => ({ generated: 0 }));

    syncCodexLocalFirst({ projectRoot: tmpRoot }, { syncSkills });
    const second = syncCodexLocalFirst({ projectRoot: tmpRoot }, { syncSkills });

    expect(second.metrics.agentsRegenerated).toBe(0);
    expect(second.metrics.agentsPruned).toBe(0);
    expect(second.metrics.codexAgents).toBe(3);
  });

  it('does NOT re-introduce agents from squad _deprecated folders', () => {
    seedExpandedFixture();
    syncCodexLocalFirst({ projectRoot: tmpRoot }, { syncSkills: jest.fn(() => ({ generated: 0 })) });
    const files = fs.readdirSync(path.join(tmpRoot, '.codex', 'agents'));
    expect(files).not.toContain('claude-orqx.md');
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
