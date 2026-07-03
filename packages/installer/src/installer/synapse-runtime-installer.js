/**
 * SYNAPSE Context-Engine Runtime Installer
 *
 * Story onda2-p9 (DEC-01 option A) — activates the context engine for every
 * installed project. The synapse-engine.cjs hook is ALREADY copied + registered
 * by every install (wizard/ide-config-generator.js HOOKS_TO_COPY + HOOK_EVENT_MAP),
 * but it dies on an early-return when `<project>/.synapse/` does not exist
 * (.sinapse-ai/core/synapse/runtime/hook-runtime.js — `if (!fs.existsSync(synapsePath)) return null;`).
 * This module closes that gap on the CANONICAL install path (install + init)
 * by generating the `.synapse/` runtime in the target project:
 *
 *   .synapse/constitution   — L0 domain (KEY=VALUE), generated from the target's
 *                             own .sinapse-ai/constitution.md by the EXISTING
 *                             generator (core/synapse/scripts/generate-constitution.js
 *                             — reused via main({ projectRoot }), never duplicated)
 *   .synapse/sessions/      — per-session state (session-manager also auto-creates)
 *   .synapse/metrics/       — engine injection metrics
 *
 * FAIL-OPEN CONTRACT (NON-NEGOTIABLE for this step): any error here must NEVER
 * break the installation. The function never throws — it returns
 * { success: false, error } and the caller logs a warning and continues.
 * This is safe because the hook itself is fail-safe by design: in the absence
 * of .synapse/ (or of a readable constitution) hook-runtime.js returns null and
 * NOTHING is injected — the engine simply stays dormant, exactly the pre-P9
 * behavior. Worst case of a generation failure = status quo ante.
 *
 * @module installer/synapse-runtime-installer
 */

const fs = require('fs');
const path = require('path');

/**
 * Relative path (from a project root) to the constitution generator that ships
 * inside the framework core.
 * @constant {string[]}
 */
const GENERATOR_REL_PATH = [
  '.sinapse-ai', 'core', 'synapse', 'scripts', 'generate-constitution.js',
];

/**
 * Resolve the generate-constitution.js module to use for a given target.
 *
 * Preference order:
 *   1. The TARGET's own copy (installed by installSinapseCore just before this
 *      step) — version-matched with the .sinapse-ai/ payload the project got.
 *      In framework-dev mode (target === package root) this IS the source copy.
 *   2. The package's own copy — fallback for partial copies.
 *
 * @param {string} targetDir - Target project root
 * @returns {string|null} Absolute path to the generator, or null if none found
 */
function resolveGeneratorPath(targetDir) {
  const targetCopy = path.join(targetDir, ...GENERATOR_REL_PATH);
  if (fs.existsSync(targetCopy)) return targetCopy;

  // packages/installer/src/installer/ → package root
  const packageCopy = path.join(__dirname, '..', '..', '..', '..', ...GENERATOR_REL_PATH);
  if (fs.existsSync(packageCopy)) return packageCopy;

  return null;
}

/**
 * Generate the `.synapse/` context-engine runtime in the target project.
 *
 * Never throws. Silences the generator's own console.log and preserves
 * process.exitCode (the underlying generator sets exitCode=1 on a miss, which
 * must not leak into the installer's exit semantics — same protection the
 * repo-source wrapper scripts/generate-synapse-runtime.js applies).
 *
 * @param {Object} [options]
 * @param {string} [options.targetDir=process.cwd()] - Target project root
 * @param {string} [options.generatorPath] - Override generator module (tests)
 * @returns {{success: boolean, articles?: number, rules?: number, outputPath?: string, error?: string, sessionsDir?: string, metricsDir?: string}}
 */
function installSynapseRuntime(options = {}) {
  const { targetDir = process.cwd() } = options;
  const savedExitCode = process.exitCode;
  const origLog = console.log;
  const origError = console.error;

  try {
    const generatorPath = options.generatorPath || resolveGeneratorPath(targetDir);
    if (!generatorPath) {
      return {
        success: false,
        error: 'generate-constitution.js not found (target and package copies missing)',
      };
    }

    // Silence the generator's console output ("Constitution generated…" /
    // "Constitution not found…") — the wizard prints its own summary line.
    console.log = () => {};
    console.error = () => {};

    let result;
    try {
      const { main } = require(generatorPath);
      if (typeof main !== 'function') {
        return { success: false, error: 'generator module has no main() export' };
      }
      result = main({ projectRoot: targetDir });
    } finally {
      console.log = origLog;
      console.error = origError;
    }

    if (!result || !result.success) {
      return {
        success: false,
        error: (result && result.error) || 'constitution generation failed',
      };
    }

    // sessions/ + metrics/ — mirrors the repo-source .synapse/ layout. The
    // session-manager also mkdir -p's sessions/ lazily, but creating them here
    // gives the installed project the complete structure from prompt zero.
    const sessionsDir = path.join(targetDir, '.synapse', 'sessions');
    const metricsDir = path.join(targetDir, '.synapse', 'metrics');
    fs.mkdirSync(sessionsDir, { recursive: true });
    fs.mkdirSync(metricsDir, { recursive: true });

    return {
      success: true,
      articles: result.articles,
      rules: result.rules,
      outputPath: result.outputPath,
      sessionsDir,
      metricsDir,
    };
  } catch (err) {
    return { success: false, error: (err && err.message) || String(err) };
  } finally {
    // The generator sets process.exitCode = 1 on a miss; restore whatever the
    // installer process had (fail-open: a dormant engine is not an install error).
    process.exitCode = savedExitCode;
    console.log = origLog;
    console.error = origError;
  }
}

module.exports = {
  installSynapseRuntime,
  resolveGeneratorPath,
  GENERATOR_REL_PATH,
};
