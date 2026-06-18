/**
 * Integration tests for Wizard IDE Flow
 *
 * Story 1.4: IDE Selection
 * Tests complete flow from selection to config generation
 *
 * SINAPSE v7+ supports 2 IDEs:
 * - Claude Code, Codex CLI
 */

const fs = require('fs-extra');
const os = require('os');
const path = require('path');
const { generateIDEConfigs } = require('../../packages/installer/src/wizard/ide-config-generator');
const { getIDEConfig, getIDEKeys } = require('../../packages/installer/src/config/ide-configs');

describe('Wizard IDE Flow Integration', () => {
  // Unique per-suite temp dir so the full `jest` run never has two suites racing
  // on a shared fixed directory.
  const testDir = fs.mkdtempSync(path.join(os.tmpdir(), 'sinapse-wizard-ide-'));

  beforeEach(async () => {
    await fs.ensureDir(testDir);
  });

  afterEach(async () => {
    await fs.remove(testDir);
  });

  describe.skip('Full flow: select -> generate -> verify', () => {
    it('should complete flow for single IDE (Claude Code)', async () => {
      const wizardState = {
        projectType: 'greenfield',
        projectName: 'test-project',
        selectedIDEs: ['claude-code'],
      };

      const result = await generateIDEConfigs(wizardState.selectedIDEs, wizardState, {
        projectRoot: testDir,
      });

      expect(result.success).toBe(true);
      expect(result.files.length).toBeGreaterThanOrEqual(1);

      const configPath = path.join(testDir, '.claude', 'CLAUDE.md');
      expect(await fs.pathExists(configPath)).toBe(true);

      const content = await fs.readFile(configPath, 'utf8');
      expect(content).toContain('SINAPSE');
      expect(content).toContain('Development Rules');
    });

    it('should complete flow for both IDEs', async () => {
      const wizardState = {
        projectType: 'brownfield',
        projectName: 'multi-ide-project',
        selectedIDEs: ['claude-code', 'codex'],
      };

      const result = await generateIDEConfigs(wizardState.selectedIDEs, wizardState, {
        projectRoot: testDir,
      });

      expect(result.success).toBe(true);
      expect(result.files.length).toBeGreaterThanOrEqual(2);

      expect(await fs.pathExists(path.join(testDir, '.claude', 'CLAUDE.md'))).toBe(true);
      expect(await fs.pathExists(path.join(testDir, '.codex', 'instructions.md'))).toBe(true);
    });

    it('should complete flow for all IDEs', async () => {
      const wizardState = {
        projectType: 'greenfield',
        projectName: 'all-ides-project',
        selectedIDEs: getIDEKeys(),
      };

      const result = await generateIDEConfigs(wizardState.selectedIDEs, wizardState, {
        projectRoot: testDir,
      });

      expect(result.success).toBe(true);
      expect(result.files.length).toBeGreaterThanOrEqual(2);

      for (const ideKey of getIDEKeys()) {
        const config = getIDEConfig(ideKey);
        const configPath = path.join(testDir, config.configFile);
        expect(await fs.pathExists(configPath)).toBe(true);
      }
    });
  });

  describe.skip('Directory structure', () => {
    it('should create directories for IDEs that need them', async () => {
      const wizardState = {
        projectType: 'greenfield',
        projectName: 'dir-test',
        selectedIDEs: ['claude-code', 'codex'],
      };

      const result = await generateIDEConfigs(wizardState.selectedIDEs, wizardState, {
        projectRoot: testDir,
      });

      expect(result.success).toBe(true);

      expect(await fs.pathExists(path.join(testDir, '.claude'))).toBe(true);
      expect(await fs.pathExists(path.join(testDir, '.codex'))).toBe(true);
    });
  });

  describe.skip('Content and formatting', () => {
    it('should generate valid content from templates', async () => {
      const wizardState = {
        projectType: 'greenfield',
        projectName: 'content-test',
        selectedIDEs: ['claude-code', 'codex'],
      };

      const result = await generateIDEConfigs(wizardState.selectedIDEs, wizardState, {
        projectRoot: testDir,
      });

      expect(result.success).toBe(true);

      const claudeContent = await fs.readFile(path.join(testDir, '.claude', 'CLAUDE.md'), 'utf8');
      expect(claudeContent).toContain('SINAPSE');
      expect(claudeContent).toContain('Documentation-First Development');
    });

    it('should generate Claude Code config as recommended', async () => {
      const wizardState = {
        projectType: 'greenfield',
        projectName: 'claude-test',
        selectedIDEs: ['claude-code'],
      };

      const result = await generateIDEConfigs(wizardState.selectedIDEs, wizardState, {
        projectRoot: testDir,
      });

      expect(result.success).toBe(true);

      const claudePath = path.join(testDir, '.claude', 'CLAUDE.md');
      expect(await fs.pathExists(claudePath)).toBe(true);

      const content = await fs.readFile(claudePath, 'utf8');
      expect(content).toContain('SINAPSE');
    });
  });

  describe('Error handling and edge cases', () => {
    it('should handle directory creation for nested configs', async () => {
      const wizardState = {
        projectType: 'greenfield',
        projectName: 'nested-test',
        selectedIDEs: ['claude-code', 'codex'],
      };

      const result = await generateIDEConfigs(wizardState.selectedIDEs, wizardState, {
        projectRoot: testDir,
      });

      expect(result.success).toBe(true);

      expect(await fs.pathExists(path.join(testDir, '.claude'))).toBe(true);
    });

    it('should handle all IDEs with text format', async () => {
      const wizardState = {
        projectType: 'greenfield',
        projectName: 'format-test',
        selectedIDEs: ['claude-code', 'codex'],
      };

      const result = await generateIDEConfigs(wizardState.selectedIDEs, wizardState, {
        projectRoot: testDir,
      });

      expect(result.success).toBe(true);
      expect(result.files.length).toBeGreaterThanOrEqual(2);

      const claudeContent = await fs.readFile(path.join(testDir, '.claude', 'CLAUDE.md'), 'utf8');
      expect(typeof claudeContent).toBe('string');
    });
  });

  describe('Template content validation', () => {
    it('should generate config from template without errors', async () => {
      const wizardState = {
        projectType: 'brownfield',
        projectName: 'my-awesome-project',
        selectedIDEs: ['claude-code'],
      };

      await generateIDEConfigs(wizardState.selectedIDEs, wizardState, {
        projectRoot: testDir,
      });

      const configPath = path.join(testDir, '.claude', 'CLAUDE.md');
      const content = await fs.readFile(configPath, 'utf8');

      expect(content).toContain('SINAPSE');
      expect(content).toContain('Development Rules');
      expect(content).toContain('Documentation-First Development');
      expect(content).not.toContain('{{');
    });

    it('should handle default values when wizard state is minimal', async () => {
      const wizardState = {};

      const result = await generateIDEConfigs(['claude-code'], wizardState, {
        projectRoot: testDir,
      });

      expect(result.success).toBe(true);

      const configPath = path.join(testDir, '.claude', 'CLAUDE.md');
      const content = await fs.readFile(configPath, 'utf8');

      expect(content).toContain('SINAPSE');
      expect(content).toContain('Development Rules');
    });
  });
});
