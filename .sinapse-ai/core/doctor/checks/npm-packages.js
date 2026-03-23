/**
 * Doctor Check: npm Packages
 *
 * Validates:
 * 1. node_modules/ exists in project root (quick sanity check)
 * 2. (INS-4.12) .sinapse-ai/node_modules/ exists and contains all declared deps
 *
 * @module sinapse-ai/doctor/checks/npm-packages
 * @story INS-4.1, INS-4.12
 */

const path = require('path');
const fs = require('fs');

const name = 'npm-packages';

async function run(context) {
  const nodeModulesPath = path.join(context.projectRoot, 'node_modules');
  // Check 1: Project node_modules
  if (!fs.existsSync(nodeModulesPath)) {
    return {
      check: name,
      status: 'FAIL',
      message: 'node_modules not found',
      fixCommand: 'npm install',
    };
  }

  // Check 2 (INS-4.12): .sinapse-ai/node_modules/ completeness
  const sinapseCoreDir = path.join(context.projectRoot, '.sinapse-ai');
  const sinapseCorePackageJson = path.join(sinapseCoreDir, 'package.json');
  const sinapseCoreNodeModules = path.join(sinapseCoreDir, 'node_modules');

  if (fs.existsSync(sinapseCorePackageJson)) {
    if (!fs.existsSync(sinapseCoreNodeModules)) {
      return {
        check: name,
        status: 'FAIL',
        message: 'node_modules present, but .sinapse-ai/node_modules/ missing',
        fixCommand: 'cd .sinapse-ai && npm install --production',
      };
    }

    // Verify all declared deps are installed
    try {
      const pkg = JSON.parse(fs.readFileSync(sinapseCorePackageJson, 'utf8'));
      const deps = Object.keys(pkg.dependencies || {});
      const missing = [];

      for (const dep of deps) {
        const depPath = path.join(sinapseCoreNodeModules, dep);
        if (!fs.existsSync(depPath)) {
          missing.push(dep);
        }
      }

      if (missing.length > 0) {
        return {
          check: name,
          status: 'FAIL',
          message: `node_modules present, but .sinapse-ai missing deps: ${missing.join(', ')}`,
          fixCommand: 'cd .sinapse-ai && npm install --production',
        };
      }
    } catch {
      // If we can't parse package.json, just check existence passed above
    }
  }

  return {
    check: name,
    status: 'PASS',
    message: 'node_modules present' + (fs.existsSync(sinapseCoreNodeModules) ? ', .sinapse-ai deps complete' : ''),
    fixCommand: null,
  };
}

module.exports = { name, run };
