#!/usr/bin/env node
/**
 * LLM-judge calibration harness (Story mesa2-llm-judge-calibration, AF-20260704 Mesa #2).
 *
 * The judge that decides "Done" is the @quality-gate agent: it emits free-form
 * prose ending in `VERDICT: X`, and Epic6Executor._parseVerdict turns that prose
 * into the binary verdict (APPROVED → Done). This harness calibrates that
 * DETERMINISTIC seam against a human-labeled golden set:
 *
 *   - It runs the REAL _parseVerdict (imported, never re-implemented) over each
 *     golden output and checks it agrees with the human-assigned verdict.
 *   - _parseVerdict is deterministic, so the gate is 100%: any disagreement means
 *     the parser regressed OR a golden label is wrong — both demand action.
 *
 * This does NOT calibrate the LLM's semantic judgment (non-deterministic, costly)
 * — that is the documented LIVE procedure (feed the golden scenarios to the real
 * @quality-gate and compare). See .sinapse-ai/quality/judge-calibration/README.md.
 *
 * `scoreCalibration` is pure so tests can drive it with any parse function.
 *
 * Exit 0 = full agreement · Exit 1 = one or more disagreements.
 *
 * @module scripts/calibrate-judge
 */

'use strict';

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const GOLDEN_SET_PATH = path.join(
  ROOT,
  '.sinapse-ai/quality/judge-calibration/golden-set.json',
);

/**
 * The REAL verdict-decision logic under calibration. `_parseVerdict` uses only
 * its `output` argument and the module-level QAVerdict constants (no `this`), so
 * it can be invoked detached via the prototype — using the exact production
 * function, never a copy.
 *
 * @returns {(output: string) => string}
 */
function loadRealParseVerdict() {
  const Epic6Executor = require('../.sinapse-ai/core/orchestration/executors/epic-6-executor.js');
  const fn = Epic6Executor.prototype._parseVerdict;
  return (output) => fn.call(null, output);
}

/**
 * Score a parse function against golden cases.
 *
 * @param {Array<{ id: string, output: string, expected: string }>} cases
 * @param {(output: string) => string} parseFn
 * @returns {{
 *   total: number,
 *   agreed: number,
 *   agreementRate: number,
 *   disagreements: Array<{ id: string, expected: string, predicted: string }>,
 *   confusion: Record<string, Record<string, number>>
 * }}
 */
function scoreCalibration(cases, parseFn) {
  const disagreements = [];
  const confusion = {};
  let agreed = 0;

  for (const c of cases) {
    const predicted = parseFn(c.output);
    confusion[c.expected] = confusion[c.expected] || {};
    confusion[c.expected][predicted] = (confusion[c.expected][predicted] || 0) + 1;
    if (predicted === c.expected) {
      agreed += 1;
    } else {
      disagreements.push({ id: c.id, expected: c.expected, predicted });
    }
  }

  const total = cases.length;
  return {
    total,
    agreed,
    agreementRate: total === 0 ? 1 : agreed / total,
    disagreements,
    confusion,
  };
}

/** CLI entry point. */
function main() {
  let golden;
  try {
    golden = JSON.parse(fs.readFileSync(GOLDEN_SET_PATH, 'utf8'));
  } catch (err) {
    console.error(`calibrate-judge: cannot read golden set at ${GOLDEN_SET_PATH}: ${err.message}`);
    process.exit(1);
  }

  const cases = Array.isArray(golden.cases) ? golden.cases : [];
  if (cases.length === 0) {
    console.error('calibrate-judge: golden set has no cases.');
    process.exit(1);
  }

  const parseFn = loadRealParseVerdict();
  const result = scoreCalibration(cases, parseFn);

  const pct = (result.agreementRate * 100).toFixed(1);
  console.log(`judge calibration: ${result.agreed}/${result.total} agree with the human golden set (${pct}%).`);
  console.log('confusion (expected → predicted):');
  for (const expected of Object.keys(result.confusion)) {
    const preds = result.confusion[expected];
    const parts = Object.keys(preds).map((p) => `${p}:${preds[p]}`).join(', ');
    console.log(`  ${expected} → ${parts}`);
  }

  if (result.disagreements.length === 0) {
    console.log('PASS — deterministic verdict extraction is calibrated to the human baseline.');
    process.exit(0);
  }

  console.log('');
  console.log(`FAIL — ${result.disagreements.length} case(s) disagree with the human label:`);
  for (const d of result.disagreements) {
    console.log(`  ${d.id}: expected ${d.expected}, parser produced ${d.predicted}`);
  }
  console.log('\nEither _parseVerdict regressed or the golden label is wrong. Fix the code or the label — do not loosen the gate.');
  process.exit(1);
}

if (require.main === module) main();

module.exports = { scoreCalibration, loadRealParseVerdict, GOLDEN_SET_PATH };
