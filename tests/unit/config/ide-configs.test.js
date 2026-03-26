/**
 * Unit tests for IDE Configs Metadata
 *
 * Story 1.4: IDE Selection
 * Tests IDE configuration metadata structure
 *
 * SINAPSE v4 supports 2 IDEs:
 * - Claude Code, Codex CLI
 */

const {
  IDE_CONFIGS,
  getIDEKeys,
  getIDEConfig,
  isValidIDE,
  getIDEChoices,
} = require('../../../packages/installer/src/config/ide-configs');

describe('IDE Configs', () => {
  describe('IDE_CONFIGS', () => {
    it('should have 2 IDE configurations', () => {
      const keys = Object.keys(IDE_CONFIGS);
      expect(keys).toHaveLength(2);
    });

    it('should include all expected IDEs', () => {
      const expectedIDEs = ['claude-code', 'codex'];

      expectedIDEs.forEach((ide) => {
        expect(IDE_CONFIGS).toHaveProperty(ide);
      });
    });

    it('should have valid structure for each IDE', () => {
      Object.entries(IDE_CONFIGS).forEach(([key, config]) => {
        expect(config).toHaveProperty('name');
        expect(config).toHaveProperty('description');
        expect(config).toHaveProperty('configFile');
        expect(config).toHaveProperty('template');
        expect(config).toHaveProperty('requiresDirectory');
        expect(config).toHaveProperty('format');
        expect(config).toHaveProperty('agentFolder');

        expect(typeof config.name).toBe('string');
        expect(typeof config.description).toBe('string');
        expect(typeof config.configFile).toBe('string');
        expect(typeof config.template).toBe('string');
        expect(typeof config.requiresDirectory).toBe('boolean');
        expect(['text', 'json', 'yaml']).toContain(config.format);
        expect(typeof config.agentFolder).toBe('string');
      });
    });

    it('should have correct directory requirements', () => {
      expect(IDE_CONFIGS['claude-code'].requiresDirectory).toBe(true);
      expect(IDE_CONFIGS.codex.requiresDirectory).toBe(true);
    });

    it('should have correct file formats', () => {
      Object.values(IDE_CONFIGS).forEach((config) => {
        expect(config.format).toBe('text');
      });
    });

    it('should have correct config file paths', () => {
      expect(IDE_CONFIGS['claude-code'].configFile).toContain('.claude');
      expect(IDE_CONFIGS.codex.configFile).toContain('.codex');
    });

    it('should have template paths in ide-rules folder', () => {
      Object.values(IDE_CONFIGS).forEach((config) => {
        expect(config.template).toMatch(/^ide-rules\//);
      });
    });

    it('should have Claude Code and Codex as recommended', () => {
      expect(IDE_CONFIGS['claude-code'].recommended).toBe(true);
      expect(IDE_CONFIGS.codex.recommended).toBe(true);
    });

    it('should have correct agent folder paths', () => {
      expect(IDE_CONFIGS['claude-code'].agentFolder).toContain('.claude');
      expect(IDE_CONFIGS['claude-code'].agentFolder).toContain('agents');
      expect(IDE_CONFIGS.codex.agentFolder).toContain('.codex');
      expect(IDE_CONFIGS.codex.agentFolder).toContain('agents');
    });
  });

  describe('getIDEKeys', () => {
    it('should return array of IDE keys', () => {
      const keys = getIDEKeys();

      expect(Array.isArray(keys)).toBe(true);
      expect(keys).toHaveLength(2);
    });

    it('should return all IDE keys', () => {
      const keys = getIDEKeys();
      const expectedKeys = ['claude-code', 'codex'];

      expectedKeys.forEach((key) => {
        expect(keys).toContain(key);
      });
    });
  });

  describe('getIDEConfig', () => {
    it('should return config for valid IDE', () => {
      const config = getIDEConfig('codex');

      expect(config).toBeDefined();
      expect(config.name).toBe('Codex CLI');
    });

    it('should return null for invalid IDE', () => {
      const config = getIDEConfig('invalid-ide');

      expect(config).toBeNull();
    });

    it('should return correct config for all IDEs', () => {
      const ides = ['claude-code', 'codex'];

      ides.forEach((ide) => {
        const config = getIDEConfig(ide);
        expect(config).toBeDefined();
        expect(config).toBe(IDE_CONFIGS[ide]);
      });
    });
  });

  describe('isValidIDE', () => {
    it('should return true for valid IDE', () => {
      expect(isValidIDE('claude-code')).toBe(true);
      expect(isValidIDE('codex')).toBe(true);
    });

    it('should return false for invalid IDE', () => {
      expect(isValidIDE('invalid-ide')).toBe(false);
      expect(isValidIDE('')).toBe(false);
      expect(isValidIDE('cursor')).toBe(false);
      expect(isValidIDE('gemini')).toBe(false);
    });

    it('should return true for all valid IDE keys', () => {
      const keys = getIDEKeys();

      keys.forEach((key) => {
        expect(isValidIDE(key)).toBe(true);
      });
    });
  });

  describe('getIDEChoices', () => {
    it('should return array of choices', () => {
      const choices = getIDEChoices();

      expect(Array.isArray(choices)).toBe(true);
      expect(choices).toHaveLength(2);
    });

    it('should have valid choice structure', () => {
      const choices = getIDEChoices();

      choices.forEach((choice) => {
        expect(choice).toHaveProperty('name');
        expect(choice).toHaveProperty('value');
        expect(typeof choice.name).toBe('string');
        expect(typeof choice.value).toBe('string');
      });
    });

    it('should include IDE name in choice name', () => {
      const choices = getIDEChoices();

      choices.forEach((choice) => {
        const ideKey = choice.value;
        const config = getIDEConfig(ideKey);

        expect(choice.name).toContain(config.name);
      });
    });

    it('should use IDE key as choice value', () => {
      const choices = getIDEChoices();
      const keys = getIDEKeys();

      const choiceValues = choices.map((c) => c.value);

      keys.forEach((key) => {
        expect(choiceValues).toContain(key);
      });
    });

    it('should pre-check recommended IDEs', () => {
      const choices = getIDEChoices();
      const claudeCodeChoice = choices.find((c) => c.value === 'claude-code');
      const codexChoice = choices.find((c) => c.value === 'codex');

      expect(claudeCodeChoice.checked).toBe(true);
      expect(codexChoice.checked).toBe(true);
    });
  });
});
