'use strict';

const fs = require('fs');
const os = require('os');
const path = require('path');

const {
  INSTALLED_AGENTS_MANIFEST,
  readInstalledAgentsManifest,
  recordInstalledAgents,
  reconcileInstalledAgents,
  removeManagedGlobalSkills,
  hasManagedInstalledAgents,
} = require('../../bin/commands/uninstall');

describe('global provider lifecycle', () => {
  let root;
  let backup;

  beforeEach(() => {
    root = fs.mkdtempSync(path.join(os.tmpdir(), 'sinapse-provider-lifecycle-'));
    backup = fs.existsSync(INSTALLED_AGENTS_MANIFEST)
      ? fs.readFileSync(INSTALLED_AGENTS_MANIFEST)
      : null;
    fs.rmSync(INSTALLED_AGENTS_MANIFEST, { force: true });
  });

  afterEach(() => {
    fs.rmSync(root, { recursive: true, force: true });
    fs.rmSync(INSTALLED_AGENTS_MANIFEST, { force: true });
    if (backup) {
      fs.mkdirSync(path.dirname(INSTALLED_AGENTS_MANIFEST), { recursive: true });
      fs.writeFileSync(INSTALLED_AGENTS_MANIFEST, backup);
    }
  });

  test('provider switch removes only stale manifest-owned agents', () => {
    const claudeDir = path.join(root, '.claude', 'agents');
    fs.mkdirSync(claudeDir, { recursive: true });
    fs.writeFileSync(path.join(claudeDir, 'developer.md'), 'managed');
    fs.writeFileSync(path.join(claudeDir, 'user-custom.md'), 'user');
    recordInstalledAgents(['developer.md'], ['claude-code'], root);

    expect(reconcileInstalledAgents(root, new Set(['developer.toml'])).removed).toBe(1);
    expect(fs.existsSync(path.join(claudeDir, 'developer.md'))).toBe(false);
    expect(fs.existsSync(path.join(claudeDir, 'user-custom.md'))).toBe(true);
    expect(readInstalledAgentsManifest(root).filenames).toEqual(['developer.md']);
  });

  test('provider-qualified reconciliation preserves an edited Claude collision and removes stale Codex markdown', () => {
    const claudeDir = path.join(root, '.claude', 'agents');
    const codexDir = path.join(root, '.codex', 'agents');
    fs.mkdirSync(claudeDir, { recursive: true });
    fs.mkdirSync(codexDir, { recursive: true });
    const claudeAgent = path.join(claudeDir, 'developer.md');
    fs.writeFileSync(claudeAgent, '<!-- SINAPSE-MANAGED:global-agent -->\noriginal');
    recordInstalledAgents(['developer.md'], ['claude-code'], root);

    fs.writeFileSync(claudeAgent, '# User replacement without ownership marker\n');
    fs.writeFileSync(
      path.join(codexDir, 'developer.md'),
      '<!-- SINAPSE-MANAGED:global-agent -->\nstale legacy Codex markdown',
    );

    expect(reconcileInstalledAgents(root, new Set(['developer.md'])).removed).toBe(1);
    expect(fs.readFileSync(claudeAgent, 'utf8')).toContain('User replacement');
    expect(fs.existsSync(path.join(codexDir, 'developer.md'))).toBe(false);
  });

  test('reconciliation preserves a digest-mismatched v2 artifact even when its marker remains', () => {
    const claudeDir = path.join(root, '.claude', 'agents');
    fs.mkdirSync(claudeDir, { recursive: true });
    const claudeAgent = path.join(claudeDir, 'developer.md');
    fs.writeFileSync(claudeAgent, '<!-- SINAPSE-MANAGED:global-agent -->\noriginal');
    recordInstalledAgents(['developer.md'], ['claude-code'], root);
    fs.appendFileSync(claudeAgent, '\nuser edit');

    expect(reconcileInstalledAgents(root, new Set(['developer.toml'])).removed).toBe(0);
    expect(fs.readFileSync(claudeAgent, 'utf8')).toContain('user edit');
  });

  test('managed artifact detection rejects empty provider directories', () => {
    fs.mkdirSync(path.join(root, '.claude', 'agents'), { recursive: true });
    expect(hasManagedInstalledAgents(root)).toBe(false);

    const agentPath = path.join(root, '.claude', 'agents', 'developer.md');
    fs.writeFileSync(agentPath, '<!-- SINAPSE-MANAGED:global-agent -->\n');
    recordInstalledAgents(['developer.md'], ['claude-code'], root);
    expect(hasManagedInstalledAgents(root)).toBe(true);
  });

  test('reconciliation removes marked stale adapters and the legacy Claude command surface', () => {
    const claudeDir = path.join(root, '.claude', 'agents');
    const codexDir = path.join(root, '.codex', 'agents');
    const legacyCommands = path.join(root, '.claude', 'commands', 'SINAPSE', 'agents');
    fs.mkdirSync(claudeDir, { recursive: true });
    fs.mkdirSync(codexDir, { recursive: true });
    fs.mkdirSync(legacyCommands, { recursive: true });
    fs.writeFileSync(path.join(claudeDir, 'stale.md'), '<!-- SINAPSE-MANAGED:global-agent -->\n');
    fs.writeFileSync(path.join(claudeDir, 'user.md'), '# User agent\n');
    fs.writeFileSync(path.join(codexDir, 'stale.md'), '<!-- SINAPSE-MANAGED:global-agent -->\n');
    fs.writeFileSync(path.join(codexDir, 'user.md'), '# User adapter\n');
    fs.writeFileSync(
      path.join(legacyCommands, 'developer.md'),
      '<!-- SINAPSE-MANAGED:claude-command -->\n',
    );
    fs.writeFileSync(path.join(legacyCommands, 'user-custom.md'), '# user custom\n');

    const result = reconcileInstalledAgents(root, new Set());

    expect(result).toMatchObject({
      removed: 2,
      legacyCommandDirectoryRemoved: false,
      legacyCommandsRemoved: 1,
      legacyCommandsPreserved: 1,
    });
    expect(fs.existsSync(path.join(claudeDir, 'stale.md'))).toBe(false);
    expect(fs.existsSync(path.join(codexDir, 'stale.md'))).toBe(false);
    expect(fs.existsSync(path.join(claudeDir, 'user.md'))).toBe(true);
    expect(fs.existsSync(path.join(codexDir, 'user.md'))).toBe(true);
    expect(fs.existsSync(path.join(legacyCommands, 'developer.md'))).toBe(false);
    expect(fs.existsSync(path.join(legacyCommands, 'user-custom.md'))).toBe(true);
  });

  test('managed skill cleanup preserves user-owned collisions', () => {
    const managed = path.join(root, '.agents', 'skills', 'sinapse', 'SKILL.md');
    const user = path.join(root, '.agents', 'skills', 'snps', 'SKILL.md');
    fs.mkdirSync(path.dirname(managed), { recursive: true });
    fs.mkdirSync(path.dirname(user), { recursive: true });
    fs.writeFileSync(managed, '<!-- SINAPSE-MANAGED:global-skill -->\n');
    fs.writeFileSync(user, '# User skill\n');
    const claudeManaged = path.join(root, '.claude', 'skills', 'snps', 'SKILL.md');
    fs.mkdirSync(path.dirname(claudeManaged), { recursive: true });
    fs.writeFileSync(claudeManaged, '<!-- SINAPSE-MANAGED:global-skill -->\n');

    expect(removeManagedGlobalSkills(root).removed).toBe(2);
    expect(fs.existsSync(managed)).toBe(false);
    expect(fs.existsSync(user)).toBe(true);
    expect(fs.existsSync(claudeManaged)).toBe(false);
  });

  test('provider switch cleanup removes Codex skills without deleting Claude aliases', () => {
    const aliases = ['snps', 'sinapse', 'snps-orqx', 'sinapse-orqx', 'sinapse-agent'];
    for (const alias of aliases) {
      for (const providerRoot of ['.agents', '.claude']) {
        const skillPath = path.join(root, providerRoot, 'skills', alias, 'SKILL.md');
        fs.mkdirSync(path.dirname(skillPath), { recursive: true });
        fs.writeFileSync(skillPath, '<!-- SINAPSE-MANAGED:global-skill -->\n');
      }
    }

    expect(removeManagedGlobalSkills(root, { providers: ['codex'] }).removed).toBe(5);
    for (const alias of aliases) {
      expect(fs.existsSync(path.join(root, '.agents', 'skills', alias, 'SKILL.md'))).toBe(false);
      expect(fs.existsSync(path.join(root, '.claude', 'skills', alias, 'SKILL.md'))).toBe(true);
    }
    expect(removeManagedGlobalSkills(root).removed).toBe(5);
    for (const alias of aliases) {
      expect(fs.existsSync(path.join(root, '.claude', 'skills', alias, 'SKILL.md'))).toBe(false);
    }
  });
});
