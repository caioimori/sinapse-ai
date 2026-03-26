/**
 * IDE Configuration Metadata
 *
 * Story 1.4: IDE Selection
 * Defines supported IDEs with their config file paths and template information
 *
 * @module config/ide-configs
 */

const path = require('path');

/**
 * IDE Configuration Metadata
 * Maps IDE identifiers to their configuration requirements
 *
 * @typedef {Object} IDEConfig
 * @property {string} name - Display name of the IDE
 * @property {string} description - Brief description for selection prompt
 * @property {string} configFile - Relative path to config file from project root
 * @property {string} template - Path to template file
 * @property {boolean} requiresDirectory - Whether config file needs a directory created
 * @property {string} format - Config file format: 'text', 'json', or 'yaml'
 */

/**
 * IDE Configuration Metadata
 *
 * SINAPSE v4 supports 2 main IDEs:
 * - Claude Code (Anthropic's official CLI) - Recommended
 * - Codex CLI (OpenAI coding CLI)
 */
const IDE_CONFIGS = {
  'claude-code': {
    name: 'Claude Code',
    description: '', // Simplified - no description needed
    configFile: path.join('.claude', 'CLAUDE.md'),
    template: 'ide-rules/claude-rules.md',
    requiresDirectory: true,
    format: 'text',
    recommended: true,
    agentFolder: path.join('.claude', 'commands', 'SINAPSE', 'agents'),
  },
  codex: {
    name: 'Codex CLI',
    description: '',
    configFile: '.codex/instructions.md',
    template: 'ide-rules/codex-rules.md',
    requiresDirectory: true,
    format: 'text',
    recommended: true,
    agentFolder: path.join('.codex', 'agents'),
  },
};

/**
 * Get all IDE keys
 * @returns {string[]} Array of IDE identifiers
 */
function getIDEKeys() {
  return Object.keys(IDE_CONFIGS);
}

/**
 * Get IDE config by key
 * @param {string} ideKey - IDE identifier
 * @returns {IDEConfig|null} IDE config object or null if not found
 */
function getIDEConfig(ideKey) {
  return IDE_CONFIGS[ideKey] || null;
}

/**
 * Validate IDE key exists
 * @param {string} ideKey - IDE identifier to validate
 * @returns {boolean} True if IDE exists
 */
function isValidIDE(ideKey) {
  return ideKey in IDE_CONFIGS;
}

/**
 * Get formatted choices for inquirer prompt
 * @returns {Array<{name: string, value: string, checked?: boolean}>} Inquirer-compatible choices
 */
function getIDEChoices() {
  const { colors } = require('../utils/sinapse-colors');
  const { t } = require('../wizard/i18n');

  return getIDEKeys().map((key) => {
    const config = IDE_CONFIGS[key];
    const isRecommended = config.recommended === true;

    // Simplified format: just "IDE Name" with optional (Recommended) tag
    let displayName = config.name;
    if (isRecommended) {
      displayName = colors.highlight(config.name) + colors.success(` (${t('recommended')})`);
    }

    return {
      name: displayName,
      value: key,
      checked: isRecommended,
    };
  });
}

module.exports = {
  IDE_CONFIGS,
  getIDEKeys,
  getIDEConfig,
  isValidIDE,
  getIDEChoices,
};
