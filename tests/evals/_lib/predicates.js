'use strict';

/**
 * Eval Harness — Deterministic Predicate Library
 *
 * A CLOSED set of deterministic predicates that inspect a GateResult (the exact
 * shape returned by VerificationGate.verify()) and answer a boolean question
 * about it. Predicates are the atomic truth-tests behind every expectation in an
 * eval case.
 *
 * Hard guarantees (Article XI — additive, non-breaking; total determinism):
 *   - NO eval(), NO new Function(), NO dynamic code execution.
 *   - NO clock, NO network, NO LLM, NO filesystem, NO randomness.
 *   - Regex args are compiled with `new RegExp(string)` ONLY (data, not code).
 *   - Predicates NEVER mutate the GateResult they receive.
 *   - Pure functions: same input -> same output, always.
 *
 * GateResult shape (read-only, from verification-gate.js):
 *   {
 *     gateId, agent, timestamp, context,
 *     result: { passed:bool, blocking:bool, warnings:string[], opportunities:object[] },
 *     override: { reason, correctionPrompt, report } | null,
 *     executionMs, circuitBreakerState
 *   }
 *
 * @module tests/evals/_lib/predicates
 */

// ---------------------------------------------------------------------------
// Safe accessors — never throw on malformed GateResults; treat missing as empty.
// ---------------------------------------------------------------------------

/** @returns {object} the `result` sub-object (defaulted). */
function getResult(gateResult) {
  return (gateResult && typeof gateResult === 'object' && gateResult.result) || {};
}

/** @returns {string[]} warnings array (defaulted to []). */
function getWarnings(gateResult) {
  const w = getResult(gateResult).warnings;
  return Array.isArray(w) ? w : [];
}

/** @returns {Array<object>} opportunities array (defaulted to []). */
function getOpportunities(gateResult) {
  const o = getResult(gateResult).opportunities;
  return Array.isArray(o) ? o : [];
}

/** @returns {object|null} the override object (or null). */
function getOverride(gateResult) {
  return (gateResult && typeof gateResult === 'object' && gateResult.override) || null;
}

/** @returns {string} the override.correctionPrompt (or ''). */
function getCorrectionPrompt(gateResult) {
  const ov = getOverride(gateResult);
  return ov && typeof ov.correctionPrompt === 'string' ? ov.correctionPrompt : '';
}

/** @returns {number} the executionMs (or NaN when absent/non-numeric). */
function getExecutionMs(gateResult) {
  const ms = gateResult && typeof gateResult === 'object' ? gateResult.executionMs : undefined;
  return typeof ms === 'number' && Number.isFinite(ms) ? ms : NaN;
}

// ---------------------------------------------------------------------------
// Argument coercion helpers (deterministic, no code execution).
// ---------------------------------------------------------------------------

/**
 * Compile a regex from a string source. Treated strictly as DATA — `new RegExp`
 * does NOT execute arbitrary code, it only builds a matcher.
 * @param {string} source
 * @returns {RegExp}
 */
function compileRegex(source) {
  if (source instanceof RegExp) return source;
  if (typeof source !== 'string') {
    throw new TypeError('regex arg must be a string pattern');
  }
  return new RegExp(source);
}

/**
 * Coerce an argument to a finite integer.
 * @param {*} value
 * @returns {number}
 */
function toInt(value) {
  const n = Number(value);
  if (!Number.isFinite(n)) {
    throw new TypeError('integer arg must be a finite number');
  }
  return Math.trunc(n);
}

// ---------------------------------------------------------------------------
// The CLOSED predicate map.  kind -> (gateResult, arg) => boolean
// Every predicate is total: it returns a boolean for any GateResult.
// ---------------------------------------------------------------------------

const PREDICATES = Object.freeze({
  /** result.passed === true */
  passed_true: (gr) => getResult(gr).passed === true,

  /** result.passed === false */
  passed_false: (gr) => getResult(gr).passed === false,

  /** result.blocking === true */
  blocking_true: (gr) => getResult(gr).blocking === true,

  /** result.blocking === false */
  blocking_false: (gr) => getResult(gr).blocking === false,

  /** result.warnings is a non-empty array */
  has_warnings: (gr) => getWarnings(gr).length > 0,

  /** result.opportunities is a non-empty array */
  has_opportunities: (gr) => getOpportunities(gr).length > 0,

  /** result.opportunities.length >= arg (arg: int) */
  opportunities_min: (gr, arg) => getOpportunities(gr).length >= toInt(arg),

  /** at least one warning matches the regex (arg: regex string) */
  warning_matches: (gr, arg) => {
    const re = compileRegex(arg);
    return getWarnings(gr).some((w) => typeof w === 'string' && re.test(w));
  },

  /** override.correctionPrompt is present and non-empty */
  correction_prompt_present: (gr) => getCorrectionPrompt(gr).length > 0,

  /** override.correctionPrompt matches the regex (arg: regex string) */
  correction_prompt_matches: (gr, arg) => {
    const re = compileRegex(arg);
    return re.test(getCorrectionPrompt(gr));
  },

  /** executionMs < arg (arg: int). False when executionMs is absent/non-numeric. */
  execution_under_ms: (gr, arg) => {
    const ms = getExecutionMs(gr);
    return Number.isFinite(ms) && ms < toInt(arg);
  },
});

/** Sorted list of every supported predicate kind. */
const PREDICATE_KINDS = Object.freeze(Object.keys(PREDICATES).sort());

/**
 * Kinds that REQUIRE an `arg` field on the expectation.
 * @type {Readonly<Object<string,boolean>>}
 */
const ARG_REQUIRED = Object.freeze({
  opportunities_min: true,
  warning_matches: true,
  correction_prompt_matches: true,
  execution_under_ms: true,
});

/**
 * Evaluate a single expectation against a GateResult.
 *
 * Expectation shape:
 *   { id:string, description?:string, kind:string, arg?:(int|string) }
 *
 * @param {object} gateResult — a GateResult (output of gate.verify()).
 * @param {object} expectation — { id, kind, arg? }.
 * @returns {{ id:string, passed:boolean, reason:string }}
 */
function evaluateExpectation(gateResult, expectation) {
  const id = (expectation && expectation.id) || '<unnamed>';

  if (!expectation || typeof expectation !== 'object') {
    return { id, passed: false, reason: 'expectation is not an object' };
  }

  const kind = expectation.kind;
  const fn = PREDICATES[kind];

  if (typeof fn !== 'function') {
    return {
      id,
      passed: false,
      reason: `unknown predicate kind '${kind}' (valid: ${PREDICATE_KINDS.join(', ')})`,
    };
  }

  if (ARG_REQUIRED[kind] && expectation.arg === undefined) {
    return { id, passed: false, reason: `predicate '${kind}' requires an 'arg' field` };
  }

  let passed;
  try {
    passed = fn(gateResult, expectation.arg);
  } catch (err) {
    return { id, passed: false, reason: `predicate '${kind}' errored: ${err.message}` };
  }

  const argStr = expectation.arg === undefined ? '' : ` arg=${JSON.stringify(expectation.arg)}`;
  return {
    id,
    passed: Boolean(passed),
    reason: passed
      ? `predicate '${kind}'${argStr} satisfied`
      : `predicate '${kind}'${argStr} not satisfied`,
  };
}

module.exports = {
  PREDICATES,
  PREDICATE_KINDS,
  ARG_REQUIRED,
  evaluateExpectation,
  // Exposed accessors for downstream tooling / reuse:
  getResult,
  getWarnings,
  getOpportunities,
  getOverride,
  getCorrectionPrompt,
  getExecutionMs,
  compileRegex,
};
