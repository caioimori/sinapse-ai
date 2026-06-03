/**
 * Gemini CLI Check
 *
 * Verifies Gemini CLI installation and configuration.
 *
 * @module sinapse-ai/health-check/checks/services/gemini-cli
 * @version 1.0.0
 * @story 5.1 - IDE Sync Expansion
 */

const fs = require('fs').promises;
const path = require('path');
const { execSync } = require('child_process');
const { BaseCheck, CheckSeverity, CheckDomain } = require('../../base-check');

/**
 * Gemini CLI check
 *
 * @class GeminiCliCheck
 * @extends BaseCheck
 */
class GeminiCliCheck extends BaseCheck {
  constructor() {
    super({
      id: 'services.gemini-cli',
      name: 'Gemini CLI',
      description: 'Verifies Gemini CLI installation and configuration',
      domain: CheckDomain.SERVICES,
      severity: CheckSeverity.LOW,
      timeout: 3000,
      cacheable: true,
      healingTier: 0,
      tags: ['gemini', 'google', 'ai', 'cli'],
    });
  }

  /**
   * Execute the check
   * @param {Object} context - Execution context
   * @returns {Promise<Object>} Check result
   */
  async execute(context) {
    const projectRoot = context.projectRoot || process.cwd();

    const details = {
      installed: false,
      version: null,
      projectConfig: false,
      commandsDir: false,
    };

    // Check if gemini CLI is installed
    try {
      const version = execSync('gemini --version', {
        encoding: 'utf8',
        timeout: 5000,
        windowsHide: true,
      }).trim();

      details.installed = true;
      details.version = version;
    } catch {
      // Not installed - check project config anyway
    }

    // Check project .gemini directory
    try {
      const geminiDir = path.join(projectRoot, '.gemini');
      await fs.access(geminiDir);
      details.projectConfig = true;

      // Check for .gemini/commands directory (synced by ide-sync)
      try {
        await fs.access(path.join(geminiDir, 'commands'));
        details.commandsDir = true;
      } catch {
        details.commandsDir = false;
      }
    } catch {
      // No project config
    }

    // Not using Gemini at all → pass silently
    if (!details.installed && !details.projectConfig) {
      return this.pass('Gemini CLI not detected (not using Gemini CLI)', {
        details,
      });
    }

    const issues = [];

    if (!details.projectConfig) {
      issues.push('No .gemini directory found');
    }

    if (details.projectConfig && !details.commandsDir) {
      issues.push('.gemini/commands directory missing');
    }

    if (issues.length > 0) {
      return this.warning(`Gemini CLI configuration incomplete: ${issues.join(', ')}`, {
        recommendation: 'Run: npm run sync:ide to generate Gemini command files',
        details: { ...details, issues },
      });
    }

    const parts = [];
    if (details.installed) parts.push(`CLI ${details.version}`);
    if (details.commandsDir) parts.push('.gemini/commands synced');

    return this.pass(`Gemini CLI configured (${parts.join(', ')})`, {
      details,
    });
  }
}

module.exports = GeminiCliCheck;
