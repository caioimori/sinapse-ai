'use strict';

/**
 * G5 — Semantic Handshake Gate
 *
 * Agent: @developer
 * Type: Automated, Blocking
 * Latency SLA: < 2s
 * Blocking: YES (blocks on BLOCKER-severity constraint violations)
 *
 * Purpose: Converts planning constraints (from @architect / story / planning
 * output) into executable assertions and validates proposed code against them
 * BEFORE development execution proceeds. If a registered BLOCKER constraint is
 * violated by the proposed code, the gate fails and returns a correction prompt.
 *
 * Behavior is graceful-degradation friendly (inherited from VerificationGate):
 *   - No constraints registered  → passes (advisory note).
 *   - Constraints but no code     → passes, surfaces constraints as opportunities.
 *   - Code + constraints          → validates; BLOCKER violation → passed=false.
 *
 * Composes with SemanticHandshakeEngine (public API):
 *   getConstraints, registerConstraints, addConstraint, clone,
 *   validateExecutionIntent, generateComplianceReport.
 *
 * Source: IDS-5b (Blocking Gates), ids-principles.md G5 definition.
 */

const path = require('path');
const { VerificationGate } = require(path.resolve(__dirname, '../verification-gate.js'));
const { SemanticHandshakeEngine } = require(
  path.resolve(__dirname, '../../synapse/context/semantic-handshake-engine.js'),
);

const G5_DEFAULT_TIMEOUT_MS = 2000;

class G5SemanticHandshakeGate extends VerificationGate {
  /**
   * @param {object} options
   * @param {SemanticHandshakeEngine} [options.engine] — Pre-configured engine instance
   * @param {object[]} [options.constraints] — Seed constraints (used when no engine provided)
   * @param {object} [options.circuitBreakerOptions]
   * @param {number} [options.timeoutMs=2000]
   * @param {Function} [options.logger]
   */
  constructor(options = {}) {
    super({
      gateId: 'G5',
      agent: '@developer',
      blocking: true,
      timeoutMs: options.timeoutMs ?? G5_DEFAULT_TIMEOUT_MS,
      circuitBreakerOptions: options.circuitBreakerOptions,
      logger: options.logger,
    });

    this._engine = options.engine || new SemanticHandshakeEngine({
      constraints: options.constraints || [],
    });
  }

  /**
   * Validate proposed code against registered + context-derived constraints.
   *
   * @param {object} context
   * @param {string} [context.planningOutput] — Planning / architecture text to extract constraints from
   * @param {string} [context.planningText]
   * @param {string} [context.architectureText]
   * @param {string} [context.storyText]
   * @param {object[]} [context.constraints] — Explicit structured constraints to add
   * @param {string} [context.proposedCode] — Proposed code to validate
   * @param {Array} [context.files] — File list ({ path, content }) to validate
   * @param {Array} [context.diffs]
   * @param {Array} [context.codeFiles]
   * @param {string} [context.source] — Constraint source label (default '@architect')
   * @param {string} [context.storyId]
   * @returns {Promise<object>} { passed, warnings, opportunities, override }
   */
  async _doVerify(context = {}) {
    const engine = this._createScopedEngine(context);
    const constraints = engine.getConstraints();

    if (constraints.length === 0) {
      return {
        passed: true,
        warnings: ['No Semantic Handshake constraints registered'],
        opportunities: [],
      };
    }

    if (!this._hasCodeContext(context)) {
      return {
        passed: true,
        warnings: ['Semantic Handshake constraints registered, but no proposed code was provided'],
        opportunities: constraints.map((c) => ({
          entity: c.id,
          recommendation: c.description,
          severity: c.severity,
        })),
      };
    }

    const result = await engine.validateExecutionIntent(context);
    const report = engine.generateComplianceReport(result);

    return {
      passed: result.passed,
      warnings: [
        ...result.warnings,
        ...result.blockingViolations.map((v) => v.message),
      ],
      opportunities: [
        ...result.verifiedConstraints.map((c) => ({
          entity: c.id,
          recommendation: 'Constraint verified',
          severity: c.severity,
        })),
        ...result.violations.map((v) => ({
          entity: v.id,
          recommendation: v.message,
          severity: v.severity,
          matches: v.matches,
        })),
      ],
      override: result.passed
        ? null
        : {
          reason: 'Semantic Handshake blocker violation',
          correctionPrompt: result.correctionPrompt,
          report,
        },
    };
  }

  /**
   * Build a per-invocation engine scoped to this context's constraints so the
   * gate instance stays stateless across calls.
   * @param {object} context
   * @returns {SemanticHandshakeEngine}
   */
  _createScopedEngine(context) {
    const engine = typeof this._engine.clone === 'function'
      ? this._engine.clone()
      : new SemanticHandshakeEngine();
    this._registerContextConstraints(engine, context);
    return engine;
  }

  /**
   * Register constraints derived from planning text and explicit constraint
   * objects supplied in the context.
   * @param {SemanticHandshakeEngine} engine
   * @param {object} context
   */
  _registerContextConstraints(engine, context) {
    const planningText = [
      context.planningOutput,
      context.planningText,
      context.architectureText,
      context.storyText,
    ].filter(Boolean).join('\n\n');

    if (planningText.trim()) {
      engine.registerConstraints(planningText, {
        source: context.source || '@architect',
        metadata: { storyId: context.storyId || 'unknown' },
      });
    }

    if (Array.isArray(context.constraints)) {
      for (const c of context.constraints) {
        engine.addConstraint(c);
      }
    }
  }

  /**
   * Determine whether the context carries any code to validate.
   * @param {object} context
   * @returns {boolean}
   */
  _hasCodeContext(context) {
    return Boolean(
      context.proposedCode ||
      (Array.isArray(context.files) && context.files.length > 0) ||
      (Array.isArray(context.diffs) && context.diffs.length > 0) ||
      (Array.isArray(context.codeFiles) && context.codeFiles.length > 0),
    );
  }
}

module.exports = { G5SemanticHandshakeGate, G5_DEFAULT_TIMEOUT_MS };
