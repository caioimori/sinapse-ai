'use strict';

const childProcess = require('child_process');
const fs = require('fs-extra');
const os = require('os');
const path = require('path');

const {
  installSinapseCore,
} = require('../../packages/installer/src/installer/sinapse-ai-installer');
const {
  syncCodexLocalFirst,
} = require('../../.sinapse-ai/infrastructure/scripts/sync-codex-local-first');
const {
  syncCodexNativeAgents,
} = require('../../.codex/scripts/sync-codex-native');
const {
  validateNativeCodex,
} = require('../../.codex/scripts/validate-codex-native');

describe('Codex native clean-project installation', () => {
  jest.setTimeout(120000);

  test('delivers, synchronizes and validates project-local Codex without global writes', async () => {
    const tempRoot = await fs.mkdtemp(path.join(os.tmpdir(), 'sinapse-codex-install-'));
    const targetDir = path.join(tempRoot, 'project');
    const fakeHome = path.join(tempRoot, 'home');
    await fs.ensureDir(targetDir);
    await fs.ensureDir(fakeHome);

    const execSpy = jest.spyOn(childProcess, 'exec').mockImplementation(
      (_command, _options, callback) => {
        callback(null, '', '');
        return { kill: jest.fn() };
      },
    );

    try {
      const installed = await installSinapseCore({
        targetDir,
        includeCodex: true,
      });
      const legacy = syncCodexLocalFirst({ projectRoot: targetDir, quiet: true });
      const native = syncCodexNativeAgents(targetDir);
      const validation = validateNativeCodex(targetDir);
      const second = syncCodexNativeAgents(targetDir);

      expect(installed.success).toBe(true);
      expect(installed.codexInstalledFiles).toBeGreaterThan(300);
      expect(installed.codexNativeSkillFiles).toBe(36);
      expect(legacy.ok).toBe(true);
      expect(native.total).toBe(172);
      expect(validation).toMatchObject({
        ok: true,
        metrics: {
          markdownAgents: 172,
          nativeAgents: 172,
          nativeSkills: 36,
        },
      });
      expect(second).toMatchObject({
        updated: 0,
        skills: { updated: 0 },
      });
      expect(await fs.pathExists(path.join(targetDir, '.codex', 'hooks.json'))).toBe(true);
      expect(await fs.pathExists(path.join(targetDir, '.agents', 'skills', 'sinapse-orqx', 'SKILL.md'))).toBe(true);
      expect(await fs.pathExists(path.join(targetDir, '.agents', 'skills', 'snps', 'SKILL.md'))).toBe(true);
      expect(await fs.pathExists(path.join(targetDir, '.agents', 'skills', 'sinapse', 'SKILL.md'))).toBe(true);
      expect(await fs.pathExists(path.join(targetDir, '.agents', 'skills', 'sinapse-agent', 'SKILL.md'))).toBe(true);
      expect(await fs.pathExists(path.join(fakeHome, '.codex'))).toBe(false);

      const customSkill = path.join(targetDir, '.agents', 'skills', 'user-custom', 'SKILL.md');
      await fs.ensureDir(path.dirname(customSkill));
      const customContent = [
        '---',
        'name: user-custom',
        'description: User-owned custom skill.',
        '---',
        '',
        'User-owned body.',
        '',
      ].join('\n');
      await fs.writeFile(customSkill, customContent, 'utf8');
      const managedCompatibilitySkill = path.join(
        targetDir,
        '.codex',
        'skills',
        'sinapse-dev',
        'SKILL.md',
      );
      const managedNativeSkill = path.join(
        targetDir,
        '.agents',
        'skills',
        'sinapse-dev',
        'SKILL.md',
      );
      const customizedManagedContent = `${await fs.readFile(managedCompatibilitySkill, 'utf8')}\nUser customization marker.\n`;
      await fs.writeFile(managedNativeSkill, customizedManagedContent, 'utf8');
      const configPath = path.join(targetDir, '.codex', 'config.toml');
      const customizedConfig = `${await fs.readFile(configPath, 'utf8')}\n# User customization marker.\n`;
      await fs.writeFile(configPath, customizedConfig, 'utf8');
      const upgraded = await installSinapseCore({ targetDir, includeCodex: true });
      const upgradedNative = syncCodexNativeAgents(targetDir);
      const upgradedValidation = validateNativeCodex(targetDir);
      const settledUpgrade = syncCodexNativeAgents(targetDir);

      expect(upgraded.success).toBe(true);
      expect(upgraded.codexNativeSkillFiles).toBe(0);
      expect(await fs.readFile(customSkill, 'utf8')).toBe(customContent);
      expect(await fs.readFile(managedNativeSkill, 'utf8')).toBe(customizedManagedContent);
      expect(await fs.readFile(managedCompatibilitySkill, 'utf8')).toBe(customizedManagedContent);
      expect(await fs.readFile(configPath, 'utf8')).toBe(customizedConfig);
      expect(upgradedNative).toMatchObject({ updated: 0, skills: { updated: 1 } });
      expect(settledUpgrade).toMatchObject({
        updated: 0,
        nativeSkills: { updated: 0 },
        skills: { updated: 0 },
      });
      expect(upgradedValidation.ok).toBe(true);
    } finally {
      execSpy.mockRestore();
      await fs.remove(tempRoot);
    }
  });
});
