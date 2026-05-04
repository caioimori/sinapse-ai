/**
 * SINAPSE Doctor — Environment Health Check Orchestrator
 *
 * Runs modular checks against the SINAPSE environment and returns
 * structured results with optional --fix, --json, and --dry-run support.
 *
 * Exception Classification (Story A.3):
 * Each check module may export an `onError` field with one of:
 *   - 'fail' (default) — thrown exceptions map to a FAIL verdict
 *   - 'warn'           — thrown exceptions map to a WARN verdict
 *   - 'skip'           — thrown exceptions cause the check to be excluded
 *                        from results entirely
 *
 * This replaces the previous behavior where the generic catch block
 * marked every exception as FAIL, producing false alarms on fresh
 * installs (no git repo, empty registry, missing agent memory dirs).
 *
 * @module sinapse-ai/doctor
 * @version 2.1.0
 * @story INS-4.1, A.3
 */

const fs = require('fs');
const os = require('os');
const path = require('path');
const { loadChecks } = require('./checks');
const { formatText } = require('./formatters/text');
const { formatJson } = require('./formatters/json');
const { applyFixes } = require('./fix-handler');

const DOCTOR_VERSION = '2.1.0';

/**
 * Detect whether SINAPSE has any installation footprint for this user.
 *
 * Returns `{ installed: false }` when ALL of the following are absent:
 *   - `<projectRoot>/.sinapse-ai/`
 *   - `~/.sinapse/`
 *   - `~/.claude/commands/SINAPSE/`
 *
 * If ANY marker is present we short-circuit to `installed: true` and let
 * the full check suite run — partial installs still need diagnosis.
 *
 * Story 10.42: avoid the "11 FAIL wall of text" on the very first run in
 * a directory where a new user has just opened the terminal and typed
 * `sinapse doctor` before ever running the installer.
 *
 * @param {Object} context - runDoctorChecks context
 * @returns {{ installed: boolean, marker?: string }}
 */
function detectInstallState(context) {
  // Allow the caller (tests, CI harnesses) to override the home directory
  // without mutating process env. Falls back to os.homedir() for real runs.
  const home = (context && context.options && context.options.homeDir)
    || process.env.SINAPSE_DOCTOR_HOME
    || os.homedir();
  const markers = [
    { label: 'project', path: path.join(context.projectRoot, '.sinapse-ai') },
    { label: 'global-sinapse', path: path.join(home, '.sinapse') },
    { label: 'claude-commands', path: path.join(home, '.claude', 'commands', 'SINAPSE') },
  ];
  for (const m of markers) {
    try {
      if (fs.existsSync(m.path)) {
        return { installed: true, marker: m.label };
      }
    } catch {
      // permission error on one marker — keep checking others
    }
  }
  return { installed: false };
}

const VALID_ON_ERROR = new Set(['fail', 'warn', 'skip']);

/**
 * Map a check module's `onError` field to the verdict produced when
 * the check itself throws. Falls back to 'fail' for safety.
 *
 * @param {Object} checkModule
 * @returns {'fail' | 'warn' | 'skip'}
 */
function resolveOnError(checkModule) {
  const declared = checkModule && checkModule.onError;
  if (declared && VALID_ON_ERROR.has(declared)) {
    return declared;
  }
  return 'fail';
}

/**
 * Build a structured result entry for a thrown exception, based on
 * the check's declared error policy. Returns null if the policy is
 * 'skip' (excluded from results).
 *
 * @param {Object} checkModule
 * @param {Error} error
 * @returns {Object|null}
 */
function buildErrorResult(checkModule, error) {
  const policy = resolveOnError(checkModule);
  if (policy === 'skip') {
    return null;
  }
  return {
    check: checkModule.name || 'unknown',
    status: policy === 'warn' ? 'WARN' : 'FAIL',
    message: `Check threw error: ${error.message}`,
    fixCommand: null,
  };
}

/**
 * Run all doctor checks
 *
 * @param {Object} options
 * @param {boolean} [options.fix=false] - Auto-correct fixable issues
 * @param {boolean} [options.json=false] - Output as JSON
 * @param {boolean} [options.dryRun=false] - Show what --fix would do
 * @param {boolean} [options.quiet=false] - Minimal output
 * @param {string} [options.projectRoot] - Project root (defaults to cwd)
 * @returns {Promise<Object>} Doctor results (includes `internalError` when the runner itself crashes)
 */
async function runDoctorChecks(options = {}) {
  const {
    fix = false,
    json = false,
    dryRun = false,
    quiet = false,
    deep = false,
    projectRoot = process.cwd(),
    homeDir,
  } = options;

  try {
    const context = {
      projectRoot,
      frameworkRoot: path.resolve(__dirname, '..', '..', '..'),
      options: { fix, json, dryRun, quiet, deep, homeDir },
    };

    // Story 10.42 — Short-circuit when SINAPSE has never been installed.
    // A fresh user running `sinapse doctor` in an empty dir should see a
    // single friendly line, not 11 FAILs. We still want the full check
    // suite to run when ANY install marker exists (so partial installs
    // are diagnosable).
    const installState = detectInstallState(context);
    if (!installState.installed) {
      const summary = { pass: 0, warn: 0, fail: 0, info: 0 };
      const output = {
        version: DOCTOR_VERSION,
        timestamp: new Date().toISOString(),
        summary,
        checks: [],
        fixResults: null,
        internalError: null,
        notInstalled: true,
        installCommand: 'npx sinapse-ai install',
      };
      return {
        formatted: json ? formatJson(output) : formatText(output, { quiet }),
        data: output,
      };
    }

    // Load and run all checks (deep checks only with --deep flag)
    const checks = loadChecks({ deep });
    const results = [];

    for (const checkModule of checks) {
      try {
        const result = await checkModule.run(context);
        results.push(result);
      } catch (error) {
        const errorResult = buildErrorResult(checkModule, error);
        if (errorResult !== null) {
          results.push(errorResult);
        }
        // policy === 'skip' → silently exclude
      }
    }

    // Apply fixes if requested
    let fixResults = null;
    if (fix || dryRun) {
      fixResults = await applyFixes(results, context);
    }

    // Build summary
    const summary = {
      pass: results.filter((r) => r.status === 'PASS').length,
      warn: results.filter((r) => r.status === 'WARN').length,
      fail: results.filter((r) => r.status === 'FAIL').length,
      info: results.filter((r) => r.status === 'INFO').length,
    };

    const output = {
      version: DOCTOR_VERSION,
      timestamp: new Date().toISOString(),
      summary,
      checks: results,
      fixResults,
      internalError: null,
    };

    // Format output
    if (json) {
      return { formatted: formatJson(output), data: output };
    }

    return { formatted: formatText(output, { quiet }), data: output };
  } catch (runnerError) {
    // Runner itself crashed (not a check throwing). Surface as exit code 3.
    const summary = { pass: 0, warn: 0, fail: 0, info: 0 };
    const errorPayload = {
      message: runnerError.message,
      stack: runnerError.stack,
    };
    const output = {
      version: DOCTOR_VERSION,
      timestamp: new Date().toISOString(),
      summary,
      checks: [],
      fixResults: null,
      internalError: errorPayload,
    };

    const formatted = json
      ? formatJson(output)
      : `SINAPSE Doctor v${DOCTOR_VERSION} — internal error: ${runnerError.message}`;

    return { formatted, data: output };
  }
}

/**
 * Resolve a doctor result object into a canonical exit code.
 *
 * Story A.3 exit code mapping:
 *   0 — PASS (no FAILs, no WARNs)
 *   1 — WARN only (no FAILs)
 *   2 — at least one FAIL
 *   3 — internal runner error (runDoctorChecks itself crashed)
 *
 * @param {Object} result - Return value from runDoctorChecks()
 * @returns {0 | 1 | 2 | 3}
 */
function resolveExitCode(result) {
  if (!result || !result.data) {
    return 3;
  }
  if (result.data.internalError) {
    return 3;
  }
  // Story 10.42 — distinct exit code for "SINAPSE never installed".
  // Scripts that today branch on 0/1/2/3 are unaffected; 4 is new.
  if (result.data.notInstalled) {
    return 4;
  }
  const summary = result.data.summary || {};
  if ((summary.fail || 0) > 0) {
    return 2;
  }
  if ((summary.warn || 0) > 0) {
    return 1;
  }
  return 0;
}

module.exports = {
  runDoctorChecks,
  resolveExitCode,
  resolveOnError,
  DOCTOR_VERSION,
};
