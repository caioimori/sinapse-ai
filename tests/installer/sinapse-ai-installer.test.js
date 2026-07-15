/**
 * SINAPSE Core Installer Tests
 *
 * @story Story 7.2: Version Tracking
 */

const path = require('path');
const crypto = require('crypto');
const fs = require('fs-extra');
const os = require('os');

const {
  generateFileHashes,
  generateVersionJson,
  isUserOwnedL3,
  copyFileWithRootReplacement,
  reconcileClaudeHookSettings,
} = require('../../packages/installer/src/installer/sinapse-ai-installer');

describe('SINAPSE Core Installer - Version Tracking', () => {
  let tempDir;

  beforeEach(async () => {
    tempDir = await fs.mkdtemp(path.join(os.tmpdir(), 'sinapse-installer-test-'));
    await fs.ensureDir(path.join(tempDir, '.sinapse-ai'));
  });

  afterEach(async () => {
    if (tempDir && fs.existsSync(tempDir)) {
      await fs.remove(tempDir);
    }
  });

  describe('generateFileHashes', () => {
    it('should generate hashes for installed files', async () => {
      const sinapseCoreDir = path.join(tempDir, '.sinapse-ai');

      // Create test files
      await fs.writeFile(path.join(sinapseCoreDir, 'test1.md'), '# Test File 1');
      await fs.writeFile(path.join(sinapseCoreDir, 'test2.md'), '# Test File 2');
      await fs.ensureDir(path.join(sinapseCoreDir, 'agents'));
      await fs.writeFile(path.join(sinapseCoreDir, 'agents', 'developer.md'), '# Dev Agent');

      const installedFiles = ['test1.md', 'test2.md', 'agents/developer.md'];
      const hashes = await generateFileHashes(sinapseCoreDir, installedFiles);

      expect(Object.keys(hashes)).toHaveLength(3);
      expect(hashes['test1.md']).toMatch(/^sha256:[a-f0-9]{64}$/);
      expect(hashes['test2.md']).toMatch(/^sha256:[a-f0-9]{64}$/);
      expect(hashes['agents/developer.md']).toMatch(/^sha256:[a-f0-9]{64}$/);
    });

    it('should skip non-existent files', async () => {
      const sinapseCoreDir = path.join(tempDir, '.sinapse-ai');

      // Create only one file
      await fs.writeFile(path.join(sinapseCoreDir, 'exists.md'), '# Exists');

      const installedFiles = ['exists.md', 'does-not-exist.md'];
      const hashes = await generateFileHashes(sinapseCoreDir, installedFiles);

      expect(Object.keys(hashes)).toHaveLength(1);
      expect(hashes['exists.md']).toBeDefined();
      expect(hashes['does-not-exist.md']).toBeUndefined();
    });

    it('should skip directories', async () => {
      const sinapseCoreDir = path.join(tempDir, '.sinapse-ai');

      await fs.ensureDir(path.join(sinapseCoreDir, 'agents'));
      await fs.writeFile(path.join(sinapseCoreDir, 'file.md'), '# File');

      const installedFiles = ['file.md', 'agents'];
      const hashes = await generateFileHashes(sinapseCoreDir, installedFiles);

      expect(Object.keys(hashes)).toHaveLength(1);
      expect(hashes['file.md']).toBeDefined();
      expect(hashes['agents']).toBeUndefined();
    });

    it('should generate consistent hashes for same content', async () => {
      const sinapseCoreDir = path.join(tempDir, '.sinapse-ai');

      await fs.writeFile(path.join(sinapseCoreDir, 'file1.md'), 'Same content');
      await fs.writeFile(path.join(sinapseCoreDir, 'file2.md'), 'Same content');

      const installedFiles = ['file1.md', 'file2.md'];
      const hashes = await generateFileHashes(sinapseCoreDir, installedFiles);

      expect(hashes['file1.md']).toBe(hashes['file2.md']);
    });

    it('should generate different hashes for different content', async () => {
      const sinapseCoreDir = path.join(tempDir, '.sinapse-ai');

      await fs.writeFile(path.join(sinapseCoreDir, 'file1.md'), 'Content A');
      await fs.writeFile(path.join(sinapseCoreDir, 'file2.md'), 'Content B');

      const installedFiles = ['file1.md', 'file2.md'];
      const hashes = await generateFileHashes(sinapseCoreDir, installedFiles);

      expect(hashes['file1.md']).not.toBe(hashes['file2.md']);
    });
  });

  describe('generateVersionJson', () => {
    it('should create version.json with correct structure', async () => {
      const sinapseCoreDir = path.join(tempDir, '.sinapse-ai');

      // Create test files
      await fs.writeFile(path.join(sinapseCoreDir, 'test.md'), '# Test');

      const result = await generateVersionJson({
        targetSinapseCore: sinapseCoreDir,
        version: '1.2.0',
        installedFiles: ['test.md'],
        mode: 'project-development',
      });

      expect(result.version).toBe('1.2.0');
      expect(result.mode).toBe('project-development');
      expect(result.installedAt).toMatch(/^\d{4}-\d{2}-\d{2}T/);
      expect(result.fileHashes).toBeDefined();
      expect(result.fileHashes['test.md']).toMatch(/^sha256:/);
      expect(result.customized).toEqual([]);
    });

    it('should write version.json to disk', async () => {
      const sinapseCoreDir = path.join(tempDir, '.sinapse-ai');

      await fs.writeFile(path.join(sinapseCoreDir, 'agent.md'), '# Agent');

      await generateVersionJson({
        targetSinapseCore: sinapseCoreDir,
        version: '2.0.0',
        installedFiles: ['agent.md'],
        mode: 'framework-development',
      });

      const versionJsonPath = path.join(sinapseCoreDir, 'version.json');
      expect(fs.existsSync(versionJsonPath)).toBe(true);

      const versionJson = await fs.readJson(versionJsonPath);
      expect(versionJson.version).toBe('2.0.0');
      expect(versionJson.mode).toBe('framework-development');
    });

    it('should use default mode when not specified', async () => {
      const sinapseCoreDir = path.join(tempDir, '.sinapse-ai');

      const result = await generateVersionJson({
        targetSinapseCore: sinapseCoreDir,
        version: '1.0.0',
        installedFiles: [],
      });

      expect(result.mode).toBe('project-development');
    });

    it('should include file hashes in version.json', async () => {
      const sinapseCoreDir = path.join(tempDir, '.sinapse-ai');

      await fs.ensureDir(path.join(sinapseCoreDir, 'agents'));
      await fs.writeFile(path.join(sinapseCoreDir, 'agents', 'developer.md'), '# Dev');
      await fs.writeFile(path.join(sinapseCoreDir, 'config.yaml'), 'key: value');

      const result = await generateVersionJson({
        targetSinapseCore: sinapseCoreDir,
        version: '1.0.0',
        installedFiles: ['agents/developer.md', 'config.yaml'],
      });

      expect(Object.keys(result.fileHashes)).toHaveLength(2);
      expect(result.fileHashes['agents/developer.md']).toBeDefined();
      expect(result.fileHashes['config.yaml']).toBeDefined();
    });

    it('hashes provider files after applying installer placeholders', async () => {
      const sinapseCoreDir = path.join(tempDir, '.sinapse-ai');
      const providerRoot = path.join(tempDir, 'package');
      const relativePath = path.join('.agents', 'skills', 'test', 'SKILL.md');
      await fs.outputFile(path.join(providerRoot, relativePath), 'Read {root}/guide.md\n');

      const result = await generateVersionJson({
        targetSinapseCore: sinapseCoreDir,
        version: '1.0.0',
        installedFiles: [],
        providerFiles: [relativePath],
        providerSourceRoot: providerRoot,
      });
      const expected = crypto.createHash('sha256')
        .update('Read .sinapse-ai/guide.md\n')
        .digest('hex');

      expect(result.providerFileHashes[relativePath.replace(/\\/g, '/')])
        .toBe(`sha256:${expected}`);
    });
  });

  describe('reconcileClaudeHookSettings', () => {
    it('ignores malformed project settings while preserving them and writing local hooks', async () => {
      const packageRoot = path.join(tempDir, 'package');
      const targetDir = path.join(tempDir, 'project');
      const malformed = '{ "hooks": broken';
      await fs.outputJson(path.join(packageRoot, '.claude', 'settings.json'), {
        hooks: {
          PreToolUse: [{ hooks: [{ command: 'node .claude/hooks/doc-first-gate.cjs' }] }],
        },
      });
      await fs.outputFile(path.join(targetDir, '.claude', 'settings.json'), malformed, 'utf8');

      await expect(reconcileClaudeHookSettings(packageRoot, targetDir))
        .resolves.toBe(path.join('.claude', 'settings.local.json'));
      expect(await fs.readFile(path.join(targetDir, '.claude', 'settings.json'), 'utf8'))
        .toBe(malformed);
      expect(await fs.readJson(path.join(targetDir, '.claude', 'settings.local.json')))
        .toMatchObject({ hooks: { PreToolUse: expect.any(Array) } });
    });

    it('preserves a structurally invalid settings.local file without overwriting it', async () => {
      const packageRoot = path.join(tempDir, 'package');
      const targetDir = path.join(tempDir, 'project');
      await fs.outputJson(path.join(packageRoot, '.claude', 'settings.json'), { hooks: {} });
      await fs.outputJson(path.join(targetDir, '.claude', 'settings.local.json'), []);

      await expect(reconcileClaudeHookSettings(packageRoot, targetDir)).resolves.toBeNull();
      expect(await fs.readJson(path.join(targetDir, '.claude', 'settings.local.json'))).toEqual([]);
    });
  });

  // ===========================================================================
  // Re-install preservation of user-owned L3 files (idempotent upsert).
  // Regression guard: re-running install must NOT wipe core-config.yaml or
  // agent MEMORY.md customizations (verified data-loss before this fix).
  // ===========================================================================
  describe('isUserOwnedL3 predicate', () => {
    it('matches core-config.yaml at the .sinapse-ai root', () => {
      expect(isUserOwnedL3('/proj/.sinapse-ai/core-config.yaml')).toBe(true);
      expect(isUserOwnedL3('C:\\proj\\.sinapse-ai\\core-config.yaml')).toBe(true);
    });

    it('matches agent MEMORY.md under development/agents', () => {
      expect(isUserOwnedL3('/proj/.sinapse-ai/development/agents/dev/MEMORY.md')).toBe(true);
    });

    it('does NOT match framework files (constitution, tasks, other yaml)', () => {
      expect(isUserOwnedL3('/proj/.sinapse-ai/constitution.md')).toBe(false);
      expect(isUserOwnedL3('/proj/.sinapse-ai/development/tasks/create-doc.md')).toBe(false);
      expect(isUserOwnedL3('/proj/.sinapse-ai/data/tech-presets.yaml')).toBe(false);
    });
  });

  describe('copyFileWithRootReplacement — L3 preservation', () => {
    it('preserves an existing user-owned L3 file instead of overwriting', async () => {
      const dest = path.join(tempDir, '.sinapse-ai', 'core-config.yaml');
      const src = path.join(tempDir, 'src-core-config.yaml');
      await fs.ensureDir(path.dirname(dest));
      await fs.writeFile(dest, 'boundary:\n  frameworkProtection: false # USER_EDIT');
      await fs.writeFile(src, 'boundary:\n  frameworkProtection: true # SHIPPED');

      const result = await copyFileWithRootReplacement(src, dest, true, isUserOwnedL3);

      expect(result).toBe('preserved');
      expect(await fs.readFile(dest, 'utf8')).toContain('USER_EDIT');
    });

    it('still writes a framework file (predicate does not match)', async () => {
      const dest = path.join(tempDir, '.sinapse-ai', 'constitution.md');
      const src = path.join(tempDir, 'src-constitution.md');
      await fs.ensureDir(path.dirname(dest));
      await fs.writeFile(dest, 'OLD');
      await fs.writeFile(src, 'FRESH');

      const result = await copyFileWithRootReplacement(src, dest, true, isUserOwnedL3);

      expect(result).toBe(true);
      expect(await fs.readFile(dest, 'utf8')).toContain('FRESH');
    });

    it('writes a user-owned L3 file on FIRST install (dest does not exist yet)', async () => {
      const dest = path.join(tempDir, '.sinapse-ai', 'core-config.yaml');
      const src = path.join(tempDir, 'src-core-config.yaml');
      await fs.writeFile(src, 'shipped: true');

      const result = await copyFileWithRootReplacement(src, dest, true, isUserOwnedL3);

      expect(result).toBe(true);
      expect(await fs.readFile(dest, 'utf8')).toContain('shipped: true');
    });
  });
});
