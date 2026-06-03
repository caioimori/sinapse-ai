/**
 * SINAPSE Git Hooks Installer (Stream B — Frente 4.2)
 *
 * Propagates the SINAPSE secret-scan guard into every project the framework
 * creates or clones. Instead of relying on husky (which the target project may
 * not have), it uses git's native `core.hooksPath` mechanism: a managed hooks
 * directory under `.sinapse-ai/git-hooks/` with Node `.js` hook scripts.
 *
 * Cross-platform by construction:
 *   - Hooks are `.js` files with `#!/usr/bin/env node` shebang. Git on every
 *     platform invokes the file as an executable; the shebang routes it to node.
 *     We NEVER emit `.sh` or `.py` (they would not run on Caio's Windows).
 *   - Execute bit is set via `fs.chmodSync(path, 0o755)` on unix; on win32 the
 *     filesystem has no execute bit so chmod is a tolerated no-op.
 *   - `core.hooksPath` is set via `runSafe` (cross-spawn, argv-based, never
 *     `shell: true`) — no shell metacharacter interpolation, injection-proof.
 *
 * Idempotent: running install twice does not duplicate hooks or chaining. The
 * managed hook is overwritten with the canonical content each run, and the
 * husky chain is detected at runtime (not baked in), so it always reflects the
 * current state of the target project.
 *
 * Husky / existing-hooks safety: the generated pre-commit detects an existing
 * `.husky/pre-commit` (or a prior `core.hooksPath` hook backed up during
 * takeover) and CHAINS to it — it never silently discards the project's own
 * hooks.
 *
 * Callers (Article XI — no orphan):
 *   - installSinapseCore() in sinapse-ai-installer.js (the `sinapse init` flow)
 *   - GreenfieldHandler._ensureGitHooks() in greenfield-handler.js (Phase 0)
 *
 * @module installer/git-hooks-installer
 */

'use strict';

const fs = require('fs');
const path = require('path');

// runSafe lives in the framework core. Resolve it relative to this file so the
// module works both inside the sinapse-ai repo and inside an installed package.
// packages/installer/src/installer -> repo root -> .sinapse-ai/core/utils
const { runSafe } = require('../../../../.sinapse-ai/core/utils/spawn-safe');

/**
 * Name of the managed hooks directory, relative to the project root.
 * Kept under `.sinapse-ai/` so it travels with the framework install and is
 * obviously framework-owned.
 * @constant {string}
 */
const MANAGED_HOOKS_DIRNAME = path.join('.sinapse-ai', 'git-hooks');

/**
 * Source scanner files copied into `<hooksDir>/lib/` so the generated hook can
 * `require` them with a stable relative path regardless of where the project
 * lives. `staged-secret-scan.js` is self-contained (only `child_process`).
 * @constant {Array<{from: string, to: string}>}
 */
const SCANNER_SOURCES = [
  {
    from: path.join(__dirname, '..', '..', '..', '..', 'bin', 'utils', 'staged-secret-scan.js'),
    to: 'staged-secret-scan.js',
  },
  // staged-secret-scan.js requires secret-scanner-core.js via __dirname, so the
  // core must travel with it into the lib/ bundle. Both files use only Node built-ins.
  {
    from: path.join(__dirname, '..', '..', '..', '..', 'bin', 'utils', 'secret-scanner-core.js'),
    to: 'secret-scanner-core.js',
  },
];

/**
 * Marker comment written into managed hooks so we can recognize (and safely
 * overwrite) our own hooks without clobbering a user-authored one.
 * @constant {string}
 */
const MANAGED_MARKER = 'SINAPSE-MANAGED-GIT-HOOK';

/**
 * Detect whether the target project already has a husky pre-commit hook.
 *
 * @param {string} projectDir - Absolute path to the project root.
 * @returns {{ hasHusky: boolean, huskyPreCommit: string|null }}
 */
function detectHusky(projectDir) {
  const huskyPreCommit = path.join(projectDir, '.husky', 'pre-commit');
  const hasHusky = fs.existsSync(huskyPreCommit);
  return { hasHusky, huskyPreCommit: hasHusky ? huskyPreCommit : null };
}

/**
 * Read the currently-configured `core.hooksPath` for a project (if any).
 *
 * @param {string} projectDir - Absolute path to the project root.
 * @returns {Promise<string|null>} Configured value, or null if unset/error.
 */
async function getCoreHooksPath(projectDir) {
  try {
    const result = await runSafe('git', ['-C', projectDir, 'config', '--get', 'core.hooksPath']);
    if (result.success) {
      const value = (result.stdout || '').trim();
      return value || null;
    }
  } catch {
    // git unavailable / not a repo — fall through to null.
  }
  return null;
}

/**
 * Set `core.hooksPath` for a project using argv-safe spawning (no shell).
 *
 * @param {string} projectDir - Absolute path to the project root.
 * @param {string} hooksPathValue - Path to write into core.hooksPath (relative
 *   to projectDir is preferred so the repo stays portable).
 * @returns {Promise<{ success: boolean, error: (string|null) }>}
 */
async function setCoreHooksPath(projectDir, hooksPathValue) {
  try {
    const result = await runSafe('git', ['-C', projectDir, 'config', 'core.hooksPath', hooksPathValue]);
    if (result.success) {
      return { success: true, error: null };
    }
    return { success: false, error: (result.stderr || '').trim() || `git exited with code ${result.code}` };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

/**
 * Write a managed hook file with the node shebang and set the execute bit.
 *
 * @param {string} hooksDir - Absolute path to the managed hooks directory.
 * @param {string} hookName - Hook name (e.g. 'pre-commit').
 * @param {string} scriptContent - Full file content (must start with shebang).
 * @returns {string} Absolute path to the written hook.
 */
function writeManagedHook(hooksDir, hookName, scriptContent) {
  fs.mkdirSync(hooksDir, { recursive: true });
  const hookPath = path.join(hooksDir, hookName);
  fs.writeFileSync(hookPath, scriptContent, 'utf8');
  try {
    // 0o755 = rwxr-xr-x. No-op effect on win32 (no execute bit), tolerated.
    fs.chmodSync(hookPath, 0o755);
  } catch {
    // chmod can fail on exotic filesystems; the shebang still routes to node
    // and on Windows the bit is irrelevant. Non-fatal.
  }
  return hookPath;
}

/**
 * Copy the scanner library files into `<hooksDir>/lib/` so the hook can require
 * them with a stable relative path. Idempotent (overwrites).
 *
 * @param {string} hooksDir - Absolute path to the managed hooks directory.
 * @returns {string[]} Relative names of the copied scanner files.
 */
function copyScannerLib(hooksDir) {
  const libDir = path.join(hooksDir, 'lib');
  fs.mkdirSync(libDir, { recursive: true });

  const copied = [];
  for (const source of SCANNER_SOURCES) {
    if (fs.existsSync(source.from)) {
      fs.copyFileSync(source.from, path.join(libDir, source.to));
      copied.push(source.to);
    }
  }
  return copied;
}

/**
 * Build the content of the managed `pre-commit` Node hook.
 *
 * The hook:
 *   1. Runs the bundled staged-secret-scan against the staged index.
 *   2. Blocks the commit (exit 1) on any finding, printing redacted reasons.
 *   3. Fail-CLOSED: if the scanner cannot be loaded/run, the commit is blocked
 *      (a broken guard must never silently allow secrets through).
 *   4. Chains to a pre-existing `.husky/pre-commit` (or a backed-up prior hook)
 *      so the project's own hooks still run.
 *
 * @param {Object} [options]
 * @param {string|null} [options.chainHookRel] - Relative path (from project
 *   root) of a prior hook to chain to after the scan passes. When null, the
 *   hook auto-detects `.husky/pre-commit` at runtime.
 * @returns {string} Hook file content.
 */
function buildPreCommitHook(options = {}) {
  const chainHookRel = options.chainHookRel || null;
  const chainLiteral = chainHookRel ? JSON.stringify(chainHookRel) : 'null';

  return `#!/usr/bin/env node
'use strict';
/* ${MANAGED_MARKER} — Auto-generated by SINAPSE git-hooks-installer. Do not edit manually. */
/* Re-run \`sinapse init\` (or the greenfield bootstrap) to regenerate. */

const path = require('path');
const fs = require('fs');
const { spawnSync } = require('child_process');

const projectRoot = process.cwd();

// --- 1. SINAPSE staged secret scan (fail-CLOSED) ----------------------------
let scanStagedFiles;
let getStagedFiles;
try {
  // The scanner is bundled next to this hook under ./lib so the require path is
  // stable no matter where the project lives.
  ({ scanStagedFiles, getStagedFiles } = require(path.join(__dirname, 'lib', 'staged-secret-scan.js')));
} catch (loadErr) {
  process.stderr.write('SINAPSE Secret Scan: scanner could not be loaded — blocking commit (fail-closed).\\n');
  process.stderr.write('  ' + (loadErr && loadErr.message ? loadErr.message : String(loadErr)) + '\\n');
  process.exit(1);
}

try {
  const files = getStagedFiles();
  const findings = scanStagedFiles(files);
  if (findings.length > 0) {
    process.stderr.write('\\nSINAPSE Secret Scan: commit blocked.\\n\\n');
    for (const f of findings) {
      process.stderr.write('  - ' + f.filePath + ': ' + f.reason + '\\n');
    }
    process.stderr.write('\\nRemove the sensitive content before committing.\\n\\n');
    process.exit(1);
  }
} catch (scanErr) {
  process.stderr.write('SINAPSE Secret Scan: scan failed — blocking commit (fail-closed).\\n');
  process.stderr.write('  ' + (scanErr && scanErr.message ? scanErr.message : String(scanErr)) + '\\n');
  process.exit(1);
}

// --- 2. Chain to a pre-existing hook (husky or backed-up prior hook) --------
const explicitChain = ${chainLiteral};
const candidates = [];
if (explicitChain) {
  candidates.push(path.resolve(projectRoot, explicitChain));
}
candidates.push(path.join(projectRoot, '.husky', 'pre-commit'));

const selfPath = __filename;
for (const candidate of candidates) {
  if (!candidate || !fs.existsSync(candidate)) continue;
  if (path.resolve(candidate) === path.resolve(selfPath)) continue; // never recurse into self

  const isJs = candidate.endsWith('.js') || candidate.endsWith('.cjs');
  const cmd = isJs ? process.execPath : candidate;
  const args = isJs ? [candidate] : [];
  const res = spawnSync(cmd, args, { stdio: 'inherit', cwd: projectRoot });

  if (res.error) {
    // A shell-script hook (.husky uses sh) may not be directly executable via
    // spawnSync on Windows. Try 'sh' as an interpreter before giving up.
    if (!isJs) {
      const shRes = spawnSync('sh', [candidate], { stdio: 'inherit', cwd: projectRoot });
      if (!shRes.error) {
        if (typeof shRes.status === 'number' && shRes.status !== 0) process.exit(shRes.status);
        break;
      }
    }
    process.stderr.write('SINAPSE pre-commit: failed to run chained hook ' + candidate + ': ' + res.error.message + '\\n');
    process.exit(1);
  }
  if (typeof res.status === 'number' && res.status !== 0) {
    process.exit(res.status);
  }
  break; // only chain to the first existing prior hook
}

process.exit(0);
`;
}

/**
 * Install the SINAPSE git guard into a project.
 *
 * Steps:
 *   1. Verify the target is a git repo (best-effort; we still write the hooks
 *      so a later `git init` picks them up via core.hooksPath).
 *   2. If a non-SINAPSE `core.hooksPath` is already set, preserve it by chaining
 *      (we do not blow away a project's existing managed hooks dir).
 *   3. Create `.sinapse-ai/git-hooks/`, bundle the scanner lib, write pre-commit.
 *   4. Point `core.hooksPath` at the managed dir.
 *
 * Idempotent. Multiplatform. No shell.
 *
 * @param {Object} options
 * @param {string} options.projectDir - Absolute path to the project root.
 * @returns {Promise<{
 *   success: boolean,
 *   hooksDir: string,
 *   huskyDetected: boolean,
 *   chainedTo: (string|null),
 *   coreHooksPathSet: boolean,
 *   skipped: boolean,
 *   error: (string|null),
 * }>}
 */
async function installGitHooks(options = {}) {
  const projectDir = options.projectDir;

  const result = {
    success: false,
    hooksDir: null,
    huskyDetected: false,
    chainedTo: null,
    coreHooksPathSet: false,
    skipped: false,
    error: null,
  };

  if (!projectDir || typeof projectDir !== 'string') {
    result.error = 'installGitHooks requires options.projectDir (absolute string path)';
    return result;
  }

  try {
    const hooksDir = path.join(projectDir, MANAGED_HOOKS_DIRNAME);
    result.hooksDir = hooksDir;

    // Detect husky so we can chain to it (and report it).
    const { hasHusky } = detectHusky(projectDir);
    result.huskyDetected = hasHusky;
    if (hasHusky) {
      result.chainedTo = path.join('.husky', 'pre-commit');
    }

    // Detect a pre-existing non-SINAPSE core.hooksPath. If the project already
    // routes hooks somewhere that ISN'T ours, chain to that dir's pre-commit so
    // we never silently disable the project's existing guard.
    const existingHooksPath = await getCoreHooksPath(projectDir);
    let explicitChain = null;
    if (existingHooksPath) {
      const resolvedExisting = path.resolve(projectDir, existingHooksPath);
      const resolvedOurs = path.resolve(hooksDir);
      if (resolvedExisting !== resolvedOurs) {
        const existingPreCommit = path.join(resolvedExisting, 'pre-commit');
        if (fs.existsSync(existingPreCommit)) {
          // Store as a project-relative path for portability.
          explicitChain = path.relative(projectDir, existingPreCommit);
          result.chainedTo = explicitChain;
        }
      }
    }

    // Bundle the scanner lib and write the managed pre-commit hook.
    copyScannerLib(hooksDir);
    writeManagedHook(hooksDir, 'pre-commit', buildPreCommitHook({ chainHookRel: explicitChain }));

    // Point core.hooksPath at our managed dir (project-relative for portability).
    const relHooksDir = MANAGED_HOOKS_DIRNAME.split(path.sep).join('/');
    const set = await setCoreHooksPath(projectDir, relHooksDir);
    result.coreHooksPathSet = set.success;

    if (!set.success) {
      // Hooks are on disk; only the git config wiring failed. Surface a soft
      // error but keep the artifacts so a later retry / manual `git config`
      // completes the wiring. Not fatal to the overall install.
      result.error = set.error;
      result.success = false;
      return result;
    }

    result.success = true;
    return result;
  } catch (error) {
    result.error = error.message;
    return result;
  }
}

module.exports = {
  installGitHooks,
  detectHusky,
  getCoreHooksPath,
  setCoreHooksPath,
  writeManagedHook,
  copyScannerLib,
  buildPreCommitHook,
  MANAGED_HOOKS_DIRNAME,
  MANAGED_MARKER,
};
