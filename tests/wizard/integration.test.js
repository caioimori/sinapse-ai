/**
 * Wizard Integration Tests
 *
 * Story 1.7: Dependency Installation Integration
 * Tests the full wizard flow including dependency installation
 *
 * Updated for simplified wizard: hardcoded PT-BR, 1 question (LLM selection),
 * auto-detect project type/tech preset, userProfile always 'bob'.
 */

const inquirer = require('inquirer');
const fse = require('fs-extra');
const { runWizard } = require('../../packages/installer/src/wizard/index');
const {
  installDependencies,
  detectPackageManager,
} = require('../../packages/installer/src/installer/dependency-installer');
const {
  configureEnvironment,
} = require('../../packages/installer/src/config/configure-environment');
const { generateIDEConfigs } = require('../../packages/installer/src/wizard/ide-config-generator');
const { installSinapseCore, hasPackageJson } = require('../../packages/installer/src/installer/sinapse-ai-installer');

// Mock dependencies
jest.mock('inquirer');
jest.mock('fs-extra');
jest.mock('../../packages/installer/src/installer/dependency-installer');
jest.mock('../../packages/installer/src/config/configure-environment');
jest.mock('../../packages/installer/src/wizard/ide-config-generator');
jest.mock('../../packages/installer/src/installer/sinapse-ai-installer');
jest.mock('../../bin/modules/mcp-installer', () => ({
  installProjectMCPs: jest.fn().mockResolvedValue({
    success: true,
    installedMCPs: {},
    configPath: '.mcp.json',
    errors: [],
  }),
}));
jest.mock('../../packages/installer/src/wizard/validation', () => ({
  validateInstallation: jest.fn().mockResolvedValue({
    valid: true,
    errors: [],
    warnings: [],
  }),
  displayValidationReport: jest.fn().mockResolvedValue(),
  provideTroubleshooting: jest.fn().mockResolvedValue(),
}));
jest.mock('../../packages/installer/src/wizard/feedback', () => ({
  showWelcome: jest.fn(),
  showCompletion: jest.fn(),
  showCancellation: jest.fn(),
}));
// Mock IDE sync pipeline (new wizard steps)
jest.mock('../../.sinapse-ai/infrastructure/scripts/ide-sync/index', () => ({
  commandSync: jest.fn().mockResolvedValue(),
  commandValidate: jest.fn().mockResolvedValue(),
}));
// Mock LLM routing installer
jest.mock('../../.sinapse-ai/infrastructure/scripts/llm-routing/install-llm-routing', () => ({
  installLLMRouting: jest.fn().mockReturnValue({ success: true, errors: [] }),
  isLLMRoutingInstalled: jest.fn().mockReturnValue(true),
}));

describe('Wizard Integration - Story 1.7', () => {
  let consoleLogSpy, consoleErrorSpy, consoleWarnSpy;

  beforeEach(() => {
    jest.clearAllMocks();
    consoleLogSpy = jest.spyOn(console, 'log').mockImplementation();
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
    consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation();

    // Default mock: single LLM selection prompt (simplified wizard)
    inquirer.prompt.mockResolvedValue({
      selectedLLM: 'claude-code',
    });

    generateIDEConfigs.mockResolvedValue({
      success: true,
      configs: [{ ide: 'claude-code', path: '.claude/settings.json' }],
    });

    configureEnvironment.mockResolvedValue({
      envCreated: true,
      envExampleCreated: true,
      coreConfigCreated: true,
      gitignoreUpdated: true,
      errors: [],
    });

    // Mock SINAPSE core installer
    installSinapseCore.mockResolvedValue({
      success: true,
      installedFiles: ['agents/developer.md', 'tasks/create-story.yaml'],
      installedFolders: ['agents', 'tasks', 'workflows', 'templates'],
      errors: [],
    });

    // Mock hasPackageJson - default to true (brownfield project)
    hasPackageJson.mockResolvedValue(true);

    // Mock detectPackageManager
    detectPackageManager.mockReturnValue('npm');

    installDependencies.mockResolvedValue({
      success: true,
      packageManager: 'npm',
    });

    // Mock fs-extra methods used by the wizard
    fse.pathExists.mockResolvedValue(false);
    fse.existsSync.mockReturnValue(false);
    fse.ensureDir.mockResolvedValue();
    fse.readFile.mockResolvedValue('{}');
    fse.writeFile.mockResolvedValue();
  });

  afterEach(() => {
    consoleLogSpy.mockRestore();
    consoleErrorSpy.mockRestore();
    consoleWarnSpy.mockRestore();
  });

  describe('Full Wizard Flow (AC Integration)', () => {
    it('should complete full wizard with dependency installation', async () => {
      const answers = await runWizard();

      // projectType is auto-detected (fse.existsSync returns false -> greenfield)
      expect(answers.projectType).toBe('greenfield');
      // selectedIDEs derived from LLM choice (claude-code -> ['claude-code'])
      expect(answers.selectedIDEs).toContain('claude-code');
      expect(answers.packageManager).toBe('npm'); // Auto-detected
      expect(answers.envConfigured).toBe(true);
      expect(answers.depsInstalled).toBe(true);
      expect(answers.depsResult.success).toBe(true);
    });

    it('should install SINAPSE core before IDE configs', async () => {
      await runWizard();

      // Verify SINAPSE core was installed
      expect(installSinapseCore).toHaveBeenCalled();

      // Verify order: SINAPSE core before IDE configs
      const sinapseCoreCallOrder = installSinapseCore.mock.invocationCallOrder[0];
      const ideConfigCallOrder = generateIDEConfigs.mock.invocationCallOrder[0];

      expect(sinapseCoreCallOrder).toBeLessThan(ideConfigCallOrder);
    });

    it('should install dependencies after env configuration', async () => {
      await runWizard();

      // Verify order of operations
      const envCallOrder = configureEnvironment.mock.invocationCallOrder[0];
      const depsCallOrder = installDependencies.mock.invocationCallOrder[0];

      expect(envCallOrder).toBeLessThan(depsCallOrder);
    });

    it('should use auto-detected package manager for installDependencies', async () => {
      detectPackageManager.mockReturnValue('yarn');

      await runWizard();

      expect(installDependencies).toHaveBeenCalledWith({
        packageManager: 'yarn',
        projectPath: process.cwd(),
      });
    });
  });

  describe('Package Manager Auto-Detection (AC1)', () => {
    it('should auto-detect npm', async () => {
      detectPackageManager.mockReturnValue('npm');

      const answers = await runWizard();
      expect(answers.packageManager).toBe('npm');
    });

    it('should auto-detect yarn', async () => {
      detectPackageManager.mockReturnValue('yarn');

      const answers = await runWizard();
      expect(answers.packageManager).toBe('yarn');
    });

    it('should auto-detect pnpm', async () => {
      detectPackageManager.mockReturnValue('pnpm');

      const answers = await runWizard();
      expect(answers.packageManager).toBe('pnpm');
    });

    it('should auto-detect bun', async () => {
      detectPackageManager.mockReturnValue('bun');

      const answers = await runWizard();
      expect(answers.packageManager).toBe('bun');
    });
  });

  describe('Greenfield Projects (No package.json)', () => {
    it('should skip dependency installation when no package.json exists', async () => {
      hasPackageJson.mockResolvedValue(false);

      const answers = await runWizard();

      expect(installDependencies).not.toHaveBeenCalled();
      expect(answers.depsInstalled).toBe(true);
      expect(answers.depsResult.skipped).toBe(true);
      expect(answers.depsResult.reason).toBe('no-package-json');
    });

    it('should still set packageManager when skipping dependencies', async () => {
      hasPackageJson.mockResolvedValue(false);
      detectPackageManager.mockReturnValue('pnpm');

      const answers = await runWizard();

      expect(answers.packageManager).toBe('pnpm');
    });
  });

  describe('User Profile (simplified wizard)', () => {
    it('should always set userProfile to bob in simplified wizard', async () => {
      const answers = await runWizard();

      expect(answers.userProfile).toBe('bob');
    });

    it('should pass userProfile to configureEnvironment', async () => {
      await runWizard();

      expect(configureEnvironment).toHaveBeenCalledWith(
        expect.objectContaining({
          userProfile: 'bob',
        }),
      );
    });
  });

  describe('Offline Mode (AC6)', () => {
    it('should handle offline mode gracefully', async () => {
      installDependencies.mockResolvedValue({
        success: true,
        offlineMode: true,
        packageManager: 'npm',
      });

      const answers = await runWizard();

      expect(answers.depsInstalled).toBe(true);
      expect(answers.depsResult.offlineMode).toBe(true);
      expect(consoleLogSpy).toHaveBeenCalledWith(expect.stringContaining('offline mode'));
    });
  });

  describe('Error Handling (AC4, AC5)', () => {
    it('should offer retry on installation failure', async () => {
      installDependencies
        .mockResolvedValueOnce({
          success: false,
          errorMessage: 'Network connection failed',
          solution: 'Check your internet connection',
          errorCategory: 'network',
        })
        .mockResolvedValueOnce({
          success: true,
          packageManager: 'npm',
        });

      // Prompt sequence: 1) LLM selection, 2) retryDeps
      inquirer.prompt
        .mockResolvedValueOnce({ selectedLLM: 'claude-code' })
        .mockResolvedValueOnce({ retryDeps: true });

      const answers = await runWizard();

      expect(installDependencies).toHaveBeenCalledTimes(2);
      expect(answers.depsInstalled).toBe(true);
    });

    it('should allow skipping installation on failure', async () => {
      installDependencies.mockResolvedValue({
        success: false,
        errorMessage: 'Network connection failed',
        solution: 'Check your internet connection',
      });

      // Prompt sequence: 1) LLM selection, 2) retryDeps=false
      inquirer.prompt
        .mockResolvedValueOnce({ selectedLLM: 'claude-code' })
        .mockResolvedValueOnce({ retryDeps: false });

      const answers = await runWizard();

      expect(answers.depsInstalled).toBe(false);
      expect(consoleLogSpy).toHaveBeenCalledWith(expect.stringContaining('manually'));
    });

    it('should display clear error messages', async () => {
      installDependencies.mockResolvedValue({
        success: false,
        errorMessage: 'Permission denied',
        solution: 'Try running with elevated permissions',
        errorCategory: 'permission',
      });

      // Prompt sequence: 1) LLM selection, 2) retryDeps=false
      inquirer.prompt
        .mockResolvedValueOnce({ selectedLLM: 'claude-code' })
        .mockResolvedValueOnce({ retryDeps: false });

      await runWizard();

      expect(consoleErrorSpy).toHaveBeenCalledWith(expect.stringContaining('Permission denied'));
      expect(consoleErrorSpy).toHaveBeenCalledWith(expect.stringContaining('elevated permissions'));
    });
  });

  describe('Progress Feedback (AC3)', () => {
    it('should show installation progress messages', async () => {
      await runWizard();

      expect(consoleLogSpy).toHaveBeenCalledWith(
        expect.stringContaining('Installing dependencies'),
      );
      expect(consoleLogSpy).toHaveBeenCalledWith(expect.stringContaining('installed'));
    });
  });

  describe('Wizard State Flow', () => {
    it('should maintain correct state through all steps', async () => {
      const answers = await runWizard();

      // Verify all story steps completed
      expect(answers.projectType).toBeDefined(); // Auto-detected
      expect(answers.selectedIDEs).toBeDefined(); // Derived from LLM
      expect(answers.envConfigured).toBeDefined(); // Story 1.6
      expect(answers.packageManager).toBeDefined(); // Story 1.7 (auto-detected)
      expect(answers.depsInstalled).toBeDefined(); // Story 1.7
      expect(answers.sinapseCoreInstalled).toBeDefined(); // Story 1.4 - SINAPSE core
    });

    it('should handle environment config failure gracefully', async () => {
      configureEnvironment.mockRejectedValue(new Error('Env config failed'));

      // Prompt sequence: 1) LLM selection, 2) continueWithoutEnv
      inquirer.prompt
        .mockResolvedValueOnce({ selectedLLM: 'claude-code' })
        .mockResolvedValueOnce({ continueWithoutEnv: true });

      const answers = await runWizard();

      expect(answers.envConfigured).toBe(false);
      // Should still proceed to dependency installation
      expect(installDependencies).toHaveBeenCalled();
    });

    it('should handle SINAPSE core installation failure gracefully', async () => {
      installSinapseCore.mockRejectedValue(new Error('SINAPSE core installation failed'));

      const answers = await runWizard();

      expect(answers.sinapseCoreInstalled).toBe(false);
      // Should still proceed to other steps
      expect(configureEnvironment).toHaveBeenCalled();
    });
  });
});

