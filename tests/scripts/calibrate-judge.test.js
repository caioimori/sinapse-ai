'use strict';

/**
 * Story mesa2-llm-judge-calibration (AF-20260704 Mesa #2)
 *
 * Two layers of assurance:
 *  1. `scoreCalibration` pure logic (agreement, disagreement detection, confusion).
 *  2. A CI enforcement test: the REAL _parseVerdict must agree 100% with the
 *     human golden set — if it regresses, this fails in CI.
 */

const fs = require('fs');
const {
  scoreCalibration,
  loadRealParseVerdict,
  GOLDEN_SET_PATH,
} = require('../../scripts/calibrate-judge.js');

describe('scoreCalibration', () => {
  const parse = (out) => out; // identity: output already equals the verdict token

  test('full agreement yields empty disagreements and rate 1', () => {
    const cases = [
      { id: 'a', output: 'approved', expected: 'approved' },
      { id: 'b', output: 'blocked', expected: 'blocked' },
    ];
    const r = scoreCalibration(cases, parse);
    expect(r.total).toBe(2);
    expect(r.agreed).toBe(2);
    expect(r.agreementRate).toBe(1);
    expect(r.disagreements).toHaveLength(0);
  });

  test('detects a disagreement and records the predicted value', () => {
    const cases = [
      { id: 'ok', output: 'approved', expected: 'approved' },
      { id: 'bad', output: 'approved', expected: 'blocked' },
    ];
    const r = scoreCalibration(cases, parse);
    expect(r.agreed).toBe(1);
    expect(r.disagreements).toEqual([{ id: 'bad', expected: 'blocked', predicted: 'approved' }]);
  });

  test('builds an expected→predicted confusion map', () => {
    const cases = [
      { id: '1', output: 'approved', expected: 'approved' },
      { id: '2', output: 'blocked', expected: 'approved' },
    ];
    const r = scoreCalibration(cases, parse);
    expect(r.confusion.approved).toEqual({ approved: 1, blocked: 1 });
  });

  test('empty case set is vacuously calibrated', () => {
    const r = scoreCalibration([], parse);
    expect(r.agreementRate).toBe(1);
    expect(r.disagreements).toHaveLength(0);
  });
});

describe('CI enforcement — real _parseVerdict vs human golden set', () => {
  const golden = JSON.parse(fs.readFileSync(GOLDEN_SET_PATH, 'utf8'));

  test('golden set is non-trivial and balanced across all three verdicts', () => {
    const byVerdict = {};
    for (const c of golden.cases) byVerdict[c.expected] = (byVerdict[c.expected] || 0) + 1;
    expect(golden.cases.length).toBeGreaterThanOrEqual(12);
    expect(byVerdict.approved).toBeGreaterThan(0);
    expect(byVerdict.needs_revision).toBeGreaterThan(0);
    expect(byVerdict.blocked).toBeGreaterThan(0);
  });

  test('the production _parseVerdict agrees 100% with the golden labels', () => {
    const parseFn = loadRealParseVerdict();
    const r = scoreCalibration(golden.cases, parseFn);
    // A disagreement means either the parser regressed or a label is wrong.
    expect(r.disagreements).toEqual([]);
    expect(r.agreementRate).toBe(1);
  });
});
