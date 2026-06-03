'use strict';

/**
 * GateEvaluator — IDS Gate Wiring (Frente 4.0)
 *
 * Bridges the inert verification gates (G1-G5) to the live SDC workflow.
 * Reads a phase->gates mapping from the `ids.gateEvaluation` block of
 * core-config.yaml, instantiates the mapped gates, calls verify(context) on
 * each, and aggregates a single PhaseVerdict.
 *
 * Aggregation contract:
 *   - Advisory gates (G1-G4): collect warnings/opportunities, never block.
 *   - Blocking gates (G3 soft, G5 hard): if a gate result reports
 *     result.blocking === true, the verdict is marked blocked, carrying the
 *     blocking gateId and the correctionPrompt extracted from the gate override.
 *
 * Fail-open is enforced at two levels:
 *   1. VerificationGate.verify() never throws (timeout/error -> warn-and-proceed).
 *   2. This evaluator wraps each gate.verify() in try/catch — a single broken
 *      gate is logged and skipped; it never knocks out the other gates.
 *
 * Source: IDS Gate Wiring frente, ids-principles.md G1-G6 definitions.
 */

const path = require('path');

const { G1EpicCreationGate } = require(path.resolve(__dirname, 'gates/g1-epic-creation.js'));
const { G2StoryCreationGate } = require(path.resolve(__dirname, 'gates/g2-story-creation.js'));
const { G3StoryValidationGate } = require(path.resolve(__dirname, 'gates/g3-story-validation.js'));
const { G4DevContextGate } = require(path.resolve(__dirname, 'gates/g4-dev-context.js'));
const { G5SemanticHandshakeGate } = require(path.resolve(__dirname, 'gates/g5-semantic-handshake.js'));
const { RegistryLoader } = require(path.resolve(__dirname, 'registry-loader.js'));
const { IncrementalDecisionEngine } = require(path.resolve(__dirname, 'incremental-decision-engine.js'));

const DEFAULT_TIMEOUT_MS = 2000;

/**
 * Default phase->gates mapping used when the config omits `phaseGates`.
 * Mirrors the SDC trigger points from ids-principles.md.
 */
const DEFAULT_PHASE_GATES = Object.freeze({
  epic_creation: ['G1'],
  story_creation: ['G2'],
  story_validation: ['G3'],
  '2_development': ['G4', 'G5'],
});

/**
 * @typedef {object} PhaseVerdict
 * @property {string} phase                 - Phase id evaluated (e.g. '2_development').
 * @property {Array<object>} results        - GateResult of each gate executed, in order.
 * @property {boolean} blocked              - true only when a blocking gate failed.
 * @property {string|null} blockingGate     - gateId of the gate that blocked, or null.
 * @property {string|null} correctionPrompt - correction prompt of the blocking gate, or null.
 */

class GateEvaluator {
  /**
   * @param {object} [config]  — the `ids` block of core-config (expects config.gateEvaluation).
   * @param {object} [deps]    — dependency injection seam for tests.
   * @param {RegistryLoader}            [deps.registryLoader]
   * @param {IncrementalDecisionEngine} [deps.decisionEngine]
   * @param {object}                    [deps.engine]  — pre-configured SemanticHandshakeEngine for G5.
   * @param {object}                    [deps.logger]  — logger with warn/info/error (defaults to console).
   */
  constructor(config = {}, deps = {}) {
    const gateConfig = config.gateEvaluation || {};

    this._enabled = gateConfig.enabled !== false; // default enabled
    this._failOpen = gateConfig.failOpen !== false; // default fail-open
    this._phaseGates = gateConfig.phaseGates || DEFAULT_PHASE_GATES;
    this._timeoutMs = gateConfig.timeoutMs ?? DEFAULT_TIMEOUT_MS;
    this._registryPath = gateConfig.registryPath || null;
    this._logger = deps.logger || console;

    // Shared, lazily-built dependencies (mirrors FrameworkGovernor wiring).
    this._injectedRegistryLoader = deps.registryLoader || null;
    this._injectedDecisionEngine = deps.decisionEngine || null;
    this._injectedEngine = deps.engine || null;

    this._registryLoader = this._injectedRegistryLoader;
    this._decisionEngine = this._injectedDecisionEngine;

    // Cache of instantiated gates by gateId.
    this._gateCache = new Map();
  }

  // ================================================================
  // Public API
  // ================================================================

  /**
   * Evaluate every gate mapped to `phaseId` and return the aggregated verdict.
   *
   * @param {string} phaseId — Phase identifier (e.g. '2_development').
   * @param {object} [context] — Gate-specific context (intent, storyId, proposedCode, ...).
   * @returns {Promise<PhaseVerdict>}
   */
  async evaluateGatesForPhase(phaseId, context = {}) {
    const verdict = {
      phase: phaseId,
      results: [],
      blocked: false,
      blockingGate: null,
      correctionPrompt: null,
    };

    if (!this._enabled) {
      return verdict;
    }

    const gateIds = this._phaseGates[phaseId] || [];

    for (const gateId of gateIds) {
      const result = await this._runGate(gateId, context);
      if (!result) {
        // Gate could not be built/run — already logged. Skip, never block.
        continue;
      }

      verdict.results.push(result);

      // A blocking gate that failed marks the verdict blocked.
      if (result.result && result.result.blocking === true) {
        verdict.blocked = true;
        verdict.blockingGate = gateId;
        verdict.correctionPrompt = this._extractCorrectionPrompt(result);
        // First blocking gate wins; stop evaluating further gates for this phase.
        return verdict;
      }
    }

    return verdict;
  }

  /**
   * Get the gate ids mapped to a phase (empty array if none).
   * @param {string} phaseId
   * @returns {string[]}
   */
  getGatesForPhase(phaseId) {
    return [...(this._phaseGates[phaseId] || [])];
  }

  // ================================================================
  // Internal helpers
  // ================================================================

  /**
   * Run a single gate, guarding against construction/verification errors.
   * @param {string} gateId
   * @param {object} context
   * @returns {Promise<object|null>} GateResult or null when the gate was skipped.
   */
  async _runGate(gateId, context) {
    let gate;
    try {
      gate = this._getGate(gateId);
    } catch (buildError) {
      this._log('warn', `Gate ${gateId} could not be instantiated: ${buildError.message}`);
      return null;
    }

    if (!gate) {
      this._log('warn', `Gate ${gateId} is not registered. Skipping.`);
      return null;
    }

    try {
      // VerificationGate.verify() is itself fail-open, but we still guard here
      // so a broken individual gate never derails the rest of the phase.
      return await gate.verify(context);
    } catch (verifyError) {
      this._log('warn', `Gate ${gateId} verify() threw: ${verifyError.message}. Proceeding.`);
      return null;
    }
  }

  /**
   * Lazily instantiate (and cache) the gate for a gateId.
   * @param {string} gateId
   * @returns {object|null}
   */
  _getGate(gateId) {
    if (this._gateCache.has(gateId)) {
      return this._gateCache.get(gateId);
    }

    const gate = this._buildGate(gateId);
    if (gate) {
      this._gateCache.set(gateId, gate);
    }
    return gate;
  }

  /**
   * Construct the gate instance for a gateId, wiring shared dependencies.
   * @param {string} gateId
   * @returns {object|null}
   */
  _buildGate(gateId) {
    const logger = this._logger;
    const timeoutMs = this._timeoutMs;

    switch (gateId) {
      case 'G1':
        return new G1EpicCreationGate({
          decisionEngine: this._getDecisionEngine(),
          timeoutMs,
          logger,
        });
      case 'G2':
        return new G2StoryCreationGate({
          decisionEngine: this._getDecisionEngine(),
          timeoutMs,
          logger,
        });
      case 'G3':
        return new G3StoryValidationGate({
          decisionEngine: this._getDecisionEngine(),
          registryLoader: this._getRegistryLoader(),
          timeoutMs,
          logger,
        });
      case 'G4':
        return new G4DevContextGate({
          decisionEngine: this._getDecisionEngine(),
          timeoutMs,
          logger,
        });
      case 'G5':
        return new G5SemanticHandshakeGate({
          engine: this._injectedEngine || undefined,
          timeoutMs,
          logger,
        });
      default:
        this._log('warn', `Unknown gateId '${gateId}' in phaseGates mapping.`);
        return null;
    }
  }

  /**
   * Lazily build (and memoize) the shared RegistryLoader.
   * @returns {RegistryLoader}
   */
  _getRegistryLoader() {
    if (!this._registryLoader) {
      this._registryLoader = new RegistryLoader(this._registryPath || undefined);
    }
    return this._registryLoader;
  }

  /**
   * Lazily build (and memoize) the shared IncrementalDecisionEngine.
   * @returns {IncrementalDecisionEngine}
   */
  _getDecisionEngine() {
    if (!this._decisionEngine) {
      this._decisionEngine = new IncrementalDecisionEngine(this._getRegistryLoader());
    }
    return this._decisionEngine;
  }

  /**
   * Extract the correction prompt from a blocking gate result.
   * Falls back to a generic message when the gate did not provide one.
   * @param {object} result — GateResult.
   * @returns {string}
   */
  _extractCorrectionPrompt(result) {
    const override = result && result.override;
    if (override && override.correctionPrompt) {
      return override.correctionPrompt;
    }
    const warnings = (result && result.result && result.result.warnings) || [];
    if (warnings.length > 0) {
      return warnings.join('; ');
    }
    return `Gate ${result && result.gateId} reported a blocking violation.`;
  }

  /**
   * Internal logging helper.
   * @param {string} level
   * @param {string} message
   */
  _log(level, message) {
    const prefix = '[IDS-GateEvaluator]';
    const logFn = (this._logger && this._logger[level]) || (this._logger && this._logger.log) || console.log;
    logFn(`${prefix} ${message}`);
  }
}

module.exports = {
  GateEvaluator,
  DEFAULT_PHASE_GATES,
  DEFAULT_TIMEOUT_MS,
};
