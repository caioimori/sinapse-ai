/**
 * Doctor Check: Git Hooks
 *
 * Validates that the ACTIVE git hook system is wired and populated. The single
 * IDE-agnostic security backstop is the managed `core.hooksPath` directory
 * (`.sinapse-ai/git-hooks/`) containing a `pre-commit` guard. A common failure
 * mode (the one this check exists to catch): `core.hooksPath` points at
 * `.sinapse-ai/git-hooks` but that directory is EMPTY/MISSING — so every guard
 * is silently INERT and secrets/destructive SQL pass at commit time.
 *
 * Verdicts:
 *   - FAIL: core.hooksPath is set but the dir is missing OR has no pre-commit
 *           (the inert-trap state — security off without anyone noticing).
 *   - WARN: no core.hooksPath set and no .husky fallback (hooks not installed).
 *   - PASS: managed hooksPath populated with pre-commit (and ideally pre-push),
 *           OR a husky fallback with the expected hooks exists.
 *
 * @module sinapse-ai/doctor/checks/git-hooks
 * @story INS-4.1, E8-SECURITY
 */

const path = require('path');
const fs = require('fs');
const { execFileSync } = require('child_process');

const name = 'git-hooks';

const MANAGED_HOOKS_DIR = path.join('.sinapse-ai', 'git-hooks');
const EXPECTED_MANAGED = ['pre-commit', 'pre-push'];
const EXPECTED_HUSKY = ['pre-commit', 'pre-push'];

/**
 * Read core.hooksPath from git config (null if unset / not a repo).
 * @param {string} projectRoot
 * @returns {string|null}
 */
function readHooksPath(projectRoot) {
  try {
    const out = execFileSync('git', ['-C', projectRoot, 'config', '--get', 'core.hooksPath'], {
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore'],
    }).trim();
    return out || null;
  } catch {
    return null;
  }
}

async function run(context) {
  const projectRoot = context.projectRoot;
  const hooksPath = readHooksPath(projectRoot);

  // --- Case 1: core.hooksPath is configured -> it MUST be populated ---------
  if (hooksPath) {
    const hooksDirAbs = path.resolve(projectRoot, hooksPath);
    const preCommit = path.join(hooksDirAbs, 'pre-commit');

    if (!fs.existsSync(hooksDirAbs)) {
      return {
        check: name,
        status: 'FAIL',
        message: `core.hooksPath -> "${hooksPath}" but that directory is MISSING. Git guards are INERT (secret-scan/SQL/boundary do not run). Run the installer to populate it.`,
        fixCommand: 'sinapse init   # repopulates .sinapse-ai/git-hooks and re-wires core.hooksPath',
      };
    }

    if (!fs.existsSync(preCommit)) {
      return {
        check: name,
        status: 'FAIL',
        message: `core.hooksPath -> "${hooksPath}" exists but has NO pre-commit guard. The secret-scan backstop is INERT.`,
        fixCommand: 'sinapse init   # regenerates the managed pre-commit guard',
      };
    }

    // Populated. Report which managed hooks are present.
    const present = EXPECTED_MANAGED.filter((h) => fs.existsSync(path.join(hooksDirAbs, h)));
    const missing = EXPECTED_MANAGED.filter((h) => !fs.existsSync(path.join(hooksDirAbs, h)));

    if (missing.length === 0) {
      return {
        check: name,
        status: 'PASS',
        message: `managed git guards active at ${hooksPath} (${present.join(' + ')})`,
        fixCommand: null,
      };
    }

    // pre-commit present (security backstop active) but pre-push missing -> WARN.
    return {
      check: name,
      status: 'WARN',
      message: `managed pre-commit active at ${hooksPath}; missing: ${missing.join(', ')}`,
      fixCommand: 'sinapse init   # writes the missing managed hook(s)',
    };
  }

  // --- Case 2: no core.hooksPath -> fall back to husky detection ------------
  const huskyDir = path.join(projectRoot, '.husky');
  if (!fs.existsSync(huskyDir)) {
    return {
      check: name,
      status: 'FAIL',
      message: 'No git hook system active: core.hooksPath is unset and .husky/ is absent. Commit-time guards (secret-scan/SQL/boundary) do not run.',
      fixCommand: 'sinapse init   # installs the managed git guards',
    };
  }

  const missingHusky = EXPECTED_HUSKY.filter((h) => !fs.existsSync(path.join(huskyDir, h)));
  if (missingHusky.length === 0) {
    return {
      check: name,
      status: 'WARN',
      message: 'husky hooks present but core.hooksPath is not set to the managed dir — the framework backstop is not the active hook system. Run the installer to consolidate.',
      fixCommand: 'sinapse init   # consolidates onto .sinapse-ai/git-hooks via core.hooksPath',
    };
  }

  return {
    check: name,
    status: 'WARN',
    message: `husky present but missing hooks: ${missingHusky.join(', ')}; managed core.hooksPath not set.`,
    fixCommand: 'sinapse init',
  };
}

// E8-SECURITY: a missing/inert hook dir is now a hard FAIL (the whole point of
// this check is to catch the silent-INERT trap). But on a fresh global install
// with no git repo at all, readHooksPath() returns null and we fall to the
// husky branch; to avoid a false alarm there, thrown exceptions stay WARN.
const onError = 'warn';

module.exports = { name, run, onError };
