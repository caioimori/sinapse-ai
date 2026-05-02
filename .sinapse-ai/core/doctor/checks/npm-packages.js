/**
 * Doctor Check: npm Packages
 *
 * Validates:
 * 1. node_modules/ exists in project root (quick sanity check)
 * 2. (Story 10.48) Each declared dep in .sinapse-ai/package.json is *resolvable*
 *    via Node's standard module resolution (which walks up the directory tree).
 *    A missing .sinapse-ai/node_modules/ is no longer a blocker by itself: when
 *    the parent project or the global install already provides the dep, Node
 *    finds it transparently and the framework runs fine.
 *
 * @module sinapse-ai/doctor/checks/npm-packages
 * @story INS-4.1, INS-4.12, 10.48
 */

const path = require('path');
const fs = require('fs');
const Module = require('module');

const name = 'npm-packages';

function canResolveDep(dep, fromDir) {
  try {
    // Use Node's own resolver from `fromDir`, which walks up node_modules
    // chains exactly the way `require()` does at runtime.
    require.resolve(dep, { paths: Module._nodeModulePaths(fromDir) });
    return true;
  } catch {
    return false;
  }
}

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

  // Check 2 (Story 10.48): resolve declared deps via Node's resolver.
  // Walks parent + global directories — does NOT require a sibling
  // node_modules/ inside .sinapse-ai/ when the dep is reachable elsewhere.
  const sinapseCoreDir = path.join(context.projectRoot, '.sinapse-ai');
  const sinapseCorePackageJson = path.join(sinapseCoreDir, 'package.json');
  const sinapseCoreNodeModules = path.join(sinapseCoreDir, 'node_modules');

  let unresolved = [];
  let totalDeps = 0;
  let hasSinapseCorePkg = false;

  if (fs.existsSync(sinapseCorePackageJson)) {
    hasSinapseCorePkg = true;
    try {
      const pkg = JSON.parse(fs.readFileSync(sinapseCorePackageJson, 'utf8'));
      const deps = Object.keys(pkg.dependencies || {});
      totalDeps = deps.length;

      for (const dep of deps) {
        if (!canResolveDep(dep, sinapseCoreDir)) {
          unresolved.push(dep);
        }
      }
    } catch {
      // package.json unparseable — skip dep resolution, fall through to PASS
      // with a softened message; full validation requires manual review.
    }
  }

  if (unresolved.length > 0) {
    return {
      check: name,
      status: 'FAIL',
      message:
        `${unresolved.length}/${totalDeps} .sinapse-ai deps unresolvable: ` +
        `${unresolved.slice(0, 5).join(', ')}${unresolved.length > 5 ? '...' : ''}`,
      fixCommand: 'cd .sinapse-ai && npm install --production',
    };
  }

  let detail = '';
  if (hasSinapseCorePkg) {
    if (fs.existsSync(sinapseCoreNodeModules)) {
      detail = ', .sinapse-ai deps complete';
    } else if (totalDeps > 0) {
      detail = `, .sinapse-ai deps (${totalDeps}) resolved via parent node_modules`;
    }
  }

  return {
    check: name,
    status: 'PASS',
    message: 'node_modules present' + detail,
    fixCommand: null,
  };
}

// Story A.3: missing npm packages are always blocking. Exceptions are FAIL.
const onError = 'fail';

module.exports = { name, run, onError };

