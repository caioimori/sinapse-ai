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
    recordInstalledAgents(['developer.md'], ['claude-code']);

    expect(reconcileInstalledAgents(root, new Set(['developer.toml'])).removed).toBe(1);
    expect(fs.existsSync(path.join(claudeDir, 'developer.md'))).toBe(false);
    expect(fs.existsSync(path.join(claudeDir, 'user-custom.md'))).toBe(true);
    expect(readInstalledAgentsManifest().filenames).toEqual(['developer.md']);
  });

  test('managed skill cleanup preserves user-owned collisions', () => {
    const managed = path.join(root, '.agents', 'skills', 'sinapse', 'SKILL.md');
    const user = path.join(root, '.agents', 'skills', 'snps', 'SKILL.md');
    fs.mkdirSync(path.dirname(managed), { recursive: true });
    fs.mkdirSync(path.dirname(user), { recursive: true });
    fs.writeFileSync(managed, '<!-- SINAPSE-MANAGED:global-skill -->\n');
    fs.writeFileSync(user, '# User skill\n');

    expect(removeManagedGlobalSkills(root).removed).toBe(1);
    expect(fs.existsSync(managed)).toBe(false);
    expect(fs.existsSync(user)).toBe(true);
  });
});
