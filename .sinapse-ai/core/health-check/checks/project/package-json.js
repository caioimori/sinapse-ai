/**
 * Package.json Check
 *
 * Verifies that package.json exists and is valid JSON.
 *
 * @module sinapse-ai/health-check/checks/project/package-json
 * @version 1.0.0
 * @story HCS-2 - Health Check System Implementation
 */

const fs = require('fs').promises;
const path = require('path');
const { BaseCheck, CheckSeverity, CheckDomain } = require('../../base-check');

/**
 * Package.json validation check
 *
 * @class PackageJsonCheck
 * @extends BaseCheck
 */
class PackageJsonCheck extends BaseCheck {
  constructor() {
    super({
      id: 'project.package-json',
      name: 'Package.json Valid',
      description: 'Verifies package.json exists and contains valid JSON',
      domain: CheckDomain.PROJECT,
      severity: CheckSeverity.CRITICAL,
      timeout: 2000,
      cacheable: true,
      healingTier: 1, // Can auto-patch cosmetic fields (name/version stubs) when JSON is valid
      tags: ['npm', 'config', 'required'],
    });
  }

  /**
   * Execute the check
   * @param {Object} context - Execution context
   * @returns {Promise<Object>} Check result
   */
  async execute(context) {
    const projectRoot = context.projectRoot || process.cwd();
    const packagePath = path.join(projectRoot, 'package.json');

    try {
      // Check if file exists
      await fs.access(packagePath);

      // Read and parse JSON
      const content = await fs.readFile(packagePath, 'utf8');
      const packageJson = JSON.parse(content);

      // Validate required fields
      const issues = [];

      if (!packageJson.name) {
        issues.push('Missing "name" field');
      }

      if (!packageJson.version) {
        issues.push('Missing "version" field');
      }

      if (
        packageJson.name &&
        !/^(@[a-z0-9-~][a-z0-9-._~]*\/)?[a-z0-9-~][a-z0-9-._~]*$/.test(packageJson.name)
      ) {
        issues.push('Invalid package name format');
      }

      if (issues.length > 0) {
        return this.warning(`package.json has issues: ${issues.join(', ')}`, {
          recommendation: 'Run health check with --fix to patch missing fields',
          healable: true,
          healingTier: 1,
          details: { issues, path: packagePath, packagePath },
        });
      }

      return this.pass('package.json is valid', {
        details: {
          name: packageJson.name,
          version: packageJson.version,
          path: packagePath,
        },
      });
    } catch (error) {
      if (error.code === 'ENOENT') {
        return this.fail('package.json not found', {
          recommendation: 'Initialize npm project with: npm init',
          details: { path: packagePath },
        });
      }

      if (error instanceof SyntaxError) {
        return this.fail('package.json contains invalid JSON', {
          recommendation: 'Fix JSON syntax errors in package.json',
          details: { error: error.message, path: packagePath },
        });
      }

      return this.error(`Failed to read package.json: ${error.message}`, error);
    }
  }

  /**
   * Get healer for this check
   * Patches stub name/version fields when JSON is valid but incomplete
   * @returns {Object} Healer configuration
   */
  getHealer() {
    return {
      name: 'patch-package-json-fields',
      action: 'patch-fields',
      successMessage: 'Patched missing package.json fields with safe defaults',
      targetFile: 'package.json',
      fix: async (_result) => {
        const projectRoot = process.cwd();
        const packagePath = path.join(projectRoot, 'package.json');

        const content = await fs.readFile(packagePath, 'utf8');
        const packageJson = JSON.parse(content);

        let patched = false;

        if (!packageJson.name) {
          packageJson.name = path.basename(projectRoot).toLowerCase().replace(/[^a-z0-9-]/g, '-');
          patched = true;
        }

        if (!packageJson.version) {
          packageJson.version = '0.1.0';
          patched = true;
        }

        if (patched) {
          await fs.writeFile(packagePath, JSON.stringify(packageJson, null, 2) + '\n', 'utf8');
        }

        return {
          success: true,
          message: patched ? 'Patched package.json with stub fields' : 'No patches needed',
        };
      },
    };
  }
}

module.exports = PackageJsonCheck;

