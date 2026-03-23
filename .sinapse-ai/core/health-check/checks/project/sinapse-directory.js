/**
 * SINAPSE Directory Check
 *
 * Verifies .sinapse/ directory structure and permissions.
 *
 * @module sinapse-ai/health-check/checks/project/sinapse-directory
 * @version 1.0.0
 * @story HCS-2 - Health Check System Implementation
 */

const fs = require('fs').promises;
const path = require('path');
const { BaseCheck, CheckSeverity, CheckDomain } = require('../../base-check');

/**
 * Expected .sinapse directory structure
 */
const EXPECTED_STRUCTURE = [
  { path: '.sinapse', type: 'directory', required: false },
  { path: '.sinapse/config.yaml', type: 'file', required: false },
  { path: '.sinapse/reports', type: 'directory', required: false },
  { path: '.sinapse/backups', type: 'directory', required: false },
];

/**
 * SINAPSE directory structure check
 *
 * @class SinapseDirectoryCheck
 * @extends BaseCheck
 */
class SinapseDirectoryCheck extends BaseCheck {
  constructor() {
    super({
      id: 'project.sinapse-directory',
      name: 'SINAPSE Directory Structure',
      description: 'Verifies .sinapse/ directory structure',
      domain: CheckDomain.PROJECT,
      severity: CheckSeverity.MEDIUM,
      timeout: 2000,
      cacheable: true,
      healingTier: 1, // Can auto-create directories
      tags: ['sinapse', 'directory', 'structure'],
    });
  }

  /**
   * Execute the check
   * @param {Object} context - Execution context
   * @returns {Promise<Object>} Check result
   */
  async execute(context) {
    const projectRoot = context.projectRoot || process.cwd();
    const sinapsePath = path.join(projectRoot, '.sinapse');
    const issues = [];
    const found = [];

    // Check if .sinapse exists at all
    try {
      const stats = await fs.stat(sinapsePath);
      if (!stats.isDirectory()) {
        return this.fail('.sinapse exists but is not a directory', {
          recommendation: 'Remove .sinapse file and run health check again',
        });
      }
      found.push('.sinapse');
    } catch {
      // .sinapse doesn't exist - this is optional
      return this.pass('.sinapse directory not present (optional)', {
        details: {
          message: '.sinapse directory is created automatically when needed',
          healable: true,
        },
      });
    }

    // Check subdirectories
    for (const item of EXPECTED_STRUCTURE.filter((i) => i.path !== '.sinapse')) {
      const fullPath = path.join(projectRoot, item.path);
      try {
        const stats = await fs.stat(fullPath);
        const typeMatch = item.type === 'directory' ? stats.isDirectory() : stats.isFile();
        if (typeMatch) {
          found.push(item.path);
        } else {
          issues.push(`${item.path} exists but is wrong type`);
        }
      } catch {
        if (item.required) {
          issues.push(`Missing: ${item.path}`);
        }
      }
    }

    // Check write permissions
    try {
      const testFile = path.join(sinapsePath, '.write-test');
      await fs.writeFile(testFile, 'test');
      await fs.unlink(testFile);
    } catch {
      issues.push('.sinapse directory is not writable');
    }

    if (issues.length > 0) {
      return this.warning(`SINAPSE directory has issues: ${issues.join(', ')}`, {
        recommendation: 'Run health check with --fix to create missing directories',
        healable: true,
        healingTier: 1,
        details: { issues, found },
      });
    }

    return this.pass('SINAPSE directory structure is valid', {
      details: { found },
    });
  }

  /**
   * Get healer for this check
   * @returns {Object} Healer configuration
   */
  getHealer() {
    return {
      name: 'create-sinapse-directories',
      action: 'create-directories',
      successMessage: 'Created missing SINAPSE directories',
      fix: async (_result) => {
        const projectRoot = process.cwd();
        const dirs = ['.sinapse', '.sinapse/reports', '.sinapse/backups', '.sinapse/backups/health-check'];

        for (const dir of dirs) {
          const fullPath = path.join(projectRoot, dir);
          await fs.mkdir(fullPath, { recursive: true });
        }

        return { success: true, message: 'Created SINAPSE directories' };
      },
    };
  }
}

module.exports = SinapseDirectoryCheck;
