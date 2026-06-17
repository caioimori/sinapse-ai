'use strict';

const fs = require('fs');
const os = require('os');
const path = require('path');

const {
  validateCodexIntegration,
} = require('../../.sinapse-ai/infrastructure/scripts/validate-codex-integration');

describe('validate-codex-integration', () => {
  let tmpRoot;

  function write(file, content = '') {
    fs.mkdirSync(path.dirname(file), { recursive: true });
    fs.writeFileSync(file, content, 'utf8');
  }

  beforeEach(() => {
    tmpRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'validate-codex-'));
  });

  afterEach(() => {
    fs.rmSync(tmpRoot, { recursive: true, force: true });
  });

  it('passes when required Codex files exist', () => {
    write(path.join(tmpRoot, 'AGENTS.md'), '# rules');
    write(path.join(tmpRoot, '.codex', 'agents', 'dev.md'), '# dev');
    write(path.join(tmpRoot, '.codex', 'skills', 'sinapse-dev', 'SKILL.md'), '# skill');
    write(path.join(tmpRoot, '.sinapse-ai', 'development', 'agents', 'dev.md'), '# dev');

    const result = validateCodexIntegration({ projectRoot: tmpRoot });
    expect(result.ok).toBe(true);
    expect(result.errors).toEqual([]);
  });

  it('fails when codex agents/skills dirs are missing', () => {
    const result = validateCodexIntegration({ projectRoot: tmpRoot });
    expect(result.ok).toBe(false);
    expect(result.errors.some((e) => e.includes('Missing Codex agents dir'))).toBe(true);
    expect(result.errors.some((e) => e.includes('Missing Codex skills dir'))).toBe(true);
    expect(result.warnings.some((w) => w.includes('Codex instructions file not found yet'))).toBe(true);
  });

  it('uses the configured Codex catalog for expected skill counts', () => {
    write(path.join(tmpRoot, 'AGENTS.md'), '# rules');
    write(path.join(tmpRoot, '.codex', 'catalog.json'), JSON.stringify({
      version: 1,
      catalogMode: 'expanded',
      expectedSkillIds: ['sinapse-dev', 'sinapse-brand'],
    }));
    write(path.join(tmpRoot, '.codex', 'agents', 'dev.md'), '# dev');
    write(path.join(tmpRoot, '.codex', 'skills', 'sinapse-dev', 'SKILL.md'), '# skill');
    write(path.join(tmpRoot, '.codex', 'skills', 'sinapse-brand', 'SKILL.md'), '# skill');
    write(path.join(tmpRoot, '.sinapse-ai', 'development', 'agents', 'dev.md'), '# dev');

    const result = validateCodexIntegration({ projectRoot: tmpRoot });
    expect(result.ok).toBe(true);
    expect(result.warnings).toEqual([]);
    expect(result.metrics.expectedSkills).toBe(2);
  });

  // --- Anti-fachada: pointers must RESOLVE, not just exist -----------------

  it('ERRORS on a broken pointer (target file missing), not just a warning', () => {
    write(path.join(tmpRoot, 'AGENTS.md'), '# rules');
    write(path.join(tmpRoot, '.codex', 'catalog.json'), JSON.stringify({
      version: 1,
      catalogMode: 'expanded',
      expectedSkillIds: ['sinapse-brand'],
    }));
    // Real source exists, but the pointer aims at a ghost path.
    write(path.join(tmpRoot, 'squads', 'squad-brand', 'agents', 'brand-orqx.md'), '# brand-orqx');
    write(
      path.join(tmpRoot, '.codex', 'agents', 'brand-orqx.md'),
      'Activate agent: brand-orqx\nRead the agent definition at: squads/squad-GHOST/agents/brand-orqx.md\n',
    );
    write(path.join(tmpRoot, '.codex', 'skills', 'sinapse-brand', 'SKILL.md'), '# skill');

    const result = validateCodexIntegration({ projectRoot: tmpRoot });
    expect(result.ok).toBe(false);
    expect(result.errors.some((e) => e.includes('Broken Codex pointer: brand-orqx'))).toBe(true);
    expect(result.metrics.brokenPointers).toBe(1);
  });

  it('ERRORS on an orphan (Codex agent with no source-of-truth)', () => {
    write(path.join(tmpRoot, 'AGENTS.md'), '# rules');
    write(path.join(tmpRoot, '.codex', 'catalog.json'), JSON.stringify({
      version: 1,
      catalogMode: 'expanded',
      expectedSkillIds: ['sinapse-brand'],
    }));
    // ghost-orphan has no matching source agent anywhere.
    write(
      path.join(tmpRoot, '.codex', 'agents', 'ghost-orphan.md'),
      'Activate agent: ghost-orphan\nRead the agent definition at: squads/void/agents/ghost-orphan.md\n',
    );
    write(path.join(tmpRoot, '.codex', 'skills', 'sinapse-brand', 'SKILL.md'), '# skill');

    const result = validateCodexIntegration({ projectRoot: tmpRoot });
    expect(result.ok).toBe(false);
    expect(result.errors.some((e) => e.includes('Orphan Codex agent: ghost-orphan'))).toBe(true);
    expect(result.metrics.orphans).toBe(1);
  });
});
