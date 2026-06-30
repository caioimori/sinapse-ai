'use strict';

/**
 * Load-tolerant perf budgets for wall-clock test assertions.
 *
 * Wall-clock perf checks are smoke tests for *catastrophic* regression — an
 * O(n) path turning O(n^2), an accidental synchronous hang — NOT precise
 * latency gates. Tight nominal budgets produced flaky failures under machine
 * load (parallel Jest workers locally + shared CI runners): a test that passes
 * in isolation fails when the box is busy. That is a false positive, and a red
 * CI on a public repo is worse than a loose perf assertion.
 *
 * `perfBudget(baseMs)` scales a nominal budget by a generous, environment-aware
 * factor so the assertion still catches real regressions (a 10s generate when
 * the budget is 500ms*20) without firing on transient load. Tune via the
 * `SINAPSE_PERF_FACTOR` env var when profiling a specific machine.
 */

const DEFAULT_FACTOR = process.env.CI === 'true' ? 20 : 10;

const FACTOR = Number(process.env.SINAPSE_PERF_FACTOR) > 0
  ? Number(process.env.SINAPSE_PERF_FACTOR)
  : DEFAULT_FACTOR;

/**
 * @param {number} baseMs Nominal expected duration in milliseconds (the value
 *   you would assert against on an idle machine).
 * @returns {number} A load-tolerant upper bound for `expect(duration).toBeLessThan(...)`.
 */
function perfBudget(baseMs) {
  if (!Number.isFinite(baseMs) || baseMs <= 0) {
    throw new TypeError(`perfBudget expects a positive number of ms, got: ${baseMs}`);
  }
  return Math.ceil(baseMs * FACTOR);
}

module.exports = { perfBudget, PERF_FACTOR: FACTOR };
