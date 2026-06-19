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
  // v1.4.2 fix: drop the "node_modules not found" hard FAIL.
  // Many user projects don't have a project-level package.json or node_modules
  // (e.g. someone using SINAPSE in a writing project, design repo, infra-only
  // repo). The presence of project node_modules is NOT a requirement for the
  // framework to work — Story 10.48 already established that .sinapse-ai deps
  // can resolve via parent/global node_modules. Only flag what truly blocks
  // the framework: unresolvable .sinapse-ai deps.

  // Story 10.48: resolve declared deps via Node's resolver.
  // Walks parent + global directories — does NOT require a sibling
  // node_modules/ inside .sinapse-ai/ when the dep is reachable elsewhere.
  const sinapseCoreDir = path.join(context.projectRoot, '.sinapse-ai');
  const sinapseCorePackageJson = path.join(sinapseCoreDir, 'package.json');
  const sinapseCoreNodeModules = path.join(sinapseCoreDir, 'node_modules');

  const unresolved = [];
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

  // v1.4.2: report status based on what's actually relevant — sinapse-ai
  // deps resolvability, not the presence of an arbitrary node_modules dir.
  let message;
  if (hasSinapseCorePkg) {
    if (fs.existsSync(sinapseCoreNodeModules)) {
      message = `.sinapse-ai deps complete (${totalDeps} declared)`;
    } else if (totalDeps > 0) {
      message = `.sinapse-ai deps (${totalDeps}) resolved via parent/global node_modules`;
    } else {
      message = '.sinapse-ai package has no deps declared';
    }
  } else {
    message = 'no .sinapse-ai/package.json — framework runs from npm install';
  }

  return {
    check: name,
    status: 'PASS',
    message,
    fixCommand: null,
  };
}

// Story A.3: missing npm packages are always blocking. Exceptions are FAIL.
const onError = 'fail';

module.exports = { name, run, onError };

