'use strict';

/**
 * G6 — CI/CD Registry Integrity Gate
 *
 * Agent: @devops
 * Type: Automated, Blocking
 * Latency SLA: < 60s (registry integrity check + sync)
 * Blocking: YES on CRITICAL, WARN on MEDIUM/LOW
 *
 * Purpose: The CI/CD merge gate of the IDS pipeline. Before a push/merge is
 * accepted it (1) verifies the Entity Registry is structurally intact and
 * (2) syncs the registry against the set of changed files — the same work the
 * `.sinapse-ai/hooks/ids-pre-push.js` hook performs, but exposed as a first-class
 * gate so the GateEvaluator can wire G6 into the SDC pipeline (ids-principles.md
 * documented G6 while the code only shipped G1-G5).
 *
 * Severity model (ids-principles.md G6):
 *   - CRITICAL  → registry fails to load / is corrupt / lost its `entities` root
 *                 → passed=false → blocks merge, carries a correction prompt.
 *   - MEDIUM/LOW → per-file sync errors → surfaced as warnings, never block.
 *
 * Graceful-degradation friendly (inherited from VerificationGate): a thrown
 * error inside _doVerify is caught by the base class and converted to a
 * warn-and-proceed, so a flaky CI environment never hard-blocks a merge by
 * accident — only a genuine integrity violation does.
 *
 * Source: IDS-5b (Blocking Gates), ids-principles.md G6 definition.
 */

const path = require('path');
const { VerificationGate } = require(path.resolve(__dirname, '../verification-gate.js'));
const { RegistryLoader } = require(path.resolve(__dirname, '../registry-loader.js'));

// G6 runs in CI; its SLA is generous (< 60s) vs the in-editor gates (< 2s).
const G6_DEFAULT_TIMEOUT_MS = 60000;

class G6CiIntegrityGate extends VerificationGate {
  /**
   * @param {object} options
   * @param {RegistryLoader} [options.registryLoader] — Injected loader (tests).
   * @param {object}         [options.registryUpdater] — Injected updater (tests);
   *        defaults to a lazily-required RegistryUpdater instance.
   * @param {string}         [options.registryPath] — Registry path override.
   * @param {object}         [options.circuitBreakerOptions]
   * @param {number}         [options.timeoutMs=60000]
   * @param {Function}       [options.logger]
   */
  constructor(options = {}) {
    super({
      gateId: 'G6',
      agent: '@devops',
      blocking: true,
      timeoutMs: options.timeoutMs ?? G6_DEFAULT_TIMEOUT_MS,
      circuitBreakerOptions: options.circuitBreakerOptions,
      logger: options.logger,
    });

    this._registryPath = options.registryPath || null;
    this._injectedLoader = options.registryLoader || null;
    this._injectedUpdater = options.registryUpdater || null;
  }

  /**
   * Verify registry integrity and sync against changed files.
   *
   * @param {object} context
   * @param {Array<object>} [context.changes] — Changed files since remote, each
   *        `{ action: 'add'|'change'|'unlink', relativePath, filePath }`
   *        (the shape produced by ids-pre-push.js). Optional — when absent, only
   *        the integrity check runs.
   * @returns {Promise<object>} { passed, warnings, opportunities, override }
   */
  async _doVerify(context = {}) {
    const warnings = [];

    // ── 1. Integrity check (CRITICAL) ──────────────────────────────────────
    let entityCount = 0;
    try {
      const loader = this._getLoader();
      const registry = loader.load();
      if (!registry || !registry.entities) {
        return this._block('Entity Registry loaded but has no `entities` root.');
      }
      entityCount = Object.keys(registry.entities).length;
    } catch (error) {
      return this._block(`Entity Registry failed to load (corrupt or unreadable): ${error.message}`);
    }

    // ── 2. Registry sync against changed files (MEDIUM/LOW → warnings) ──────
    const changes = Array.isArray(context.changes) ? context.changes : [];
    let synced = 0;
    if (changes.length > 0) {
      try {
        const updater = this._getUpdater();
        const result = await updater.processChanges(changes);
        synced = (result && result.updated) || 0;
        const errors = (result && result.errors) || [];
        for (const err of errors) {
          // Sync errors are MEDIUM/LOW: surface them, but do not block the merge.
          warnings.push(`[G6] Registry sync issue (non-blocking): ${err.message || err}`);
        }
      } catch (error) {
        // A sync failure is non-critical — the integrity check already passed.
        warnings.push(`[G6] Registry sync failed (non-blocking): ${error.message}`);
      }
    }

    return {
      passed: true,
      warnings,
      opportunities: [],
      meta: { entityCount, synced },
    };
  }

  /**
   * Build a blocking verdict carrying a correction prompt.
   * @param {string} reason
   * @returns {object}
   * @private
   */
  _block(reason) {
    const correctionPrompt =
      `${reason}\n\nFix the Entity Registry before merging: run \`sinapse ids:health\` to ` +
      'diagnose, restore the registry from a known-good state, and re-run the registry sync.';
    return {
      passed: false,
      warnings: [`[G6] CRITICAL: ${reason}`],
      opportunities: [],
      override: { correctionPrompt },
    };
  }

  /**
   * Lazily build (and memoize) the RegistryLoader.
   * @returns {RegistryLoader}
   * @private
   */
  _getLoader() {
    if (!this._injectedLoader) {
      this._injectedLoader = new RegistryLoader(this._registryPath || undefined);
    }
    return this._injectedLoader;
  }

  /**
   * Lazily build (and memoize) the RegistryUpdater. Required only when there are
   * changes to sync, so the dependency stays out of the integrity-only path.
   * @returns {object}
   * @private
   */
  _getUpdater() {
    if (!this._injectedUpdater) {
      const { RegistryUpdater } = require(path.resolve(__dirname, '../registry-updater.js'));
      this._injectedUpdater = new RegistryUpdater();
    }
    return this._injectedUpdater;
  }
}

module.exports = { G6CiIntegrityGate, G6_DEFAULT_TIMEOUT_MS };
