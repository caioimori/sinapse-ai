'use strict';

/**
 * Eval Harness — Universal Scoring
 *
 * Turns a GateResult + a list of expectations into the UNIVERSAL Score shape
 * that every downstream tool (runner, reporter, CI gate) codes against:
 *
 *   { score: 0..1, reason: string, success: boolean, threshold: number }
 *
 * Determinism + Article XI (additive, non-breaking):
 *   - Reads the GateResult; NEVER mutates it and NEVER touches verification-gate.js.
 *   - Pure function of (gateResult, expectations, opts). No clock/network/LLM.
 *   - `score` is the fraction of expectations whose predicate passed.
 *   - `success` is `score >= threshold` (default threshold 1.0 => all must pass).
 *
 * @module tests/evals/_lib/score
 */

const { evaluateExpectation } = require('./predicates');

const DEFAULT_THRESHOLD = 1.0;

/**
 * @typedef {object} Score
 * @property {number}  score     — fraction in [0,1] of expectations satisfied.
 * @property {string}  reason    — human-readable summary of pass/fail breakdown.
 * @property {boolean} success   — true iff score >= threshold.
 * @property {number}  threshold — the threshold applied (echoed for the caller).
 */

/**
 * Clamp a number to [0,1].
 * @param {number} n
 * @returns {number}
 */
function clamp01(n) {
  if (!Number.isFinite(n)) return 0;
  if (n < 0) return 0;
  if (n > 1) return 1;
  return n;
}

/**
 * Resolve the effective threshold from opts (defaults to 1.0).
 * @param {object} [opts]
 * @returns {number}
 */
function resolveThreshold(opts) {
  const t = opts && typeof opts.threshold === 'number' ? opts.threshold : DEFAULT_THRESHOLD;
  return clamp01(t);
}

/**
 * Score a GateResult against a list of expectations.
 *
 * @param {object} gateResult — a GateResult (output of gate.verify()).
 * @param {Array<object>} expectations — [{ id, kind, arg? }, ...].
 * @param {object} [opts]
 * @param {number} [opts.threshold=1.0] — success cutoff in [0,1].
 * @returns {Score & { details: Array<{id,passed,reason}> }}
 */
function toScore(gateResult, expectations, opts = {}) {
  const threshold = resolveThreshold(opts);
  const list = Array.isArray(expectations) ? expectations : [];

  if (list.length === 0) {
    return {
      score: 0,
      reason: 'no expectations defined',
      success: false,
      threshold,
      details: [],
    };
  }

  const details = list.map((exp) => evaluateExpectation(gateResult, exp));
  const passedCount = details.filter((d) => d.passed).length;
  const score = clamp01(passedCount / list.length);
  const success = score >= threshold;

  const failed = details.filter((d) => !d.passed);
  const reason = success
    ? `${passedCount}/${list.length} expectations passed (score ${score.toFixed(2)} >= threshold ${threshold})`
    : `${passedCount}/${list.length} expectations passed (score ${score.toFixed(2)} < threshold ${threshold}); failed: ${failed
        .map((f) => `${f.id} (${f.reason})`)
        .join('; ')}`;

  return { score, reason, success, threshold, details };
}

/**
 * Score a whole eval case. A case is `{ id, description?, context, expectations[] }`.
 * The caller is responsible for having produced `gateResult` by running the gate
 * with `caseObj.context`; this function only scores the result against the case's
 * expectations.
 *
 * @param {object} gateResult — GateResult from gate.verify(caseObj.context).
 * @param {object} caseObj — { id, description?, context, expectations[] }.
 * @param {object} [opts] — { threshold? }.
 * @returns {{ id:string, description:string } & Score & { details: Array<{id,passed,reason}> }}
 */
function evaluateCase(gateResult, caseObj, opts = {}) {
  const id = (caseObj && caseObj.id) || '<unnamed-case>';
  const description = (caseObj && caseObj.description) || '';
  const expectations = (caseObj && caseObj.expectations) || [];
  const scored = toScore(gateResult, expectations, opts);
  return { id, description, ...scored };
}

module.exports = {
  toScore,
  evaluateCase,
  DEFAULT_THRESHOLD,
};
