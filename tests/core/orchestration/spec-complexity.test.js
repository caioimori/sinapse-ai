'use strict';

/**
 * Story rodada2-m4 (AF-20260704 #9b) — the COMPLEX≥16 spec-pipeline threshold as
 * deterministic, tested code instead of prose. Locks the canonical thresholds
 * and per-level phase plan from workflow-execution.md §3.
 */

const {
  DIMENSIONS,
  THRESHOLDS,
  scoreToLevel,
  normalizeLevel,
  sumDimensions,
  classifyComplexity,
  PHASES_BY_LEVEL,
} = require('../../../.sinapse-ai/core/orchestration/spec-complexity');

describe('scoreToLevel — canonical thresholds', () => {
  test('score <= 8 is SIMPLE', () => {
    expect(scoreToLevel(5)).toBe('SIMPLE');
    expect(scoreToLevel(8)).toBe('SIMPLE');
  });

  test('9..15 is STANDARD', () => {
    expect(scoreToLevel(9)).toBe('STANDARD');
    expect(scoreToLevel(15)).toBe('STANDARD');
  });

  test('score >= 16 is COMPLEX (the boundary that mattered)', () => {
    expect(scoreToLevel(16)).toBe('COMPLEX');
    expect(scoreToLevel(25)).toBe('COMPLEX');
  });

  test('non-numeric input defaults conservatively to STANDARD', () => {
    expect(scoreToLevel(NaN)).toBe('STANDARD');
    expect(scoreToLevel(undefined)).toBe('STANDARD');
  });

  test('thresholds match the documented constants', () => {
    expect(THRESHOLDS.SIMPLE_MAX).toBe(8);
    expect(THRESHOLDS.COMPLEX_MIN).toBe(16);
  });
});

describe('sumDimensions', () => {
  test('sums the five dimensions', () => {
    expect(sumDimensions({ scope: 5, integration: 5, infrastructure: 4, knowledge: 1, risk: 1 })).toBe(16);
  });

  test('missing dimensions count as 0', () => {
    expect(sumDimensions({ scope: 3 })).toBe(3);
  });

  test('exposes exactly the five canonical dimensions', () => {
    expect(DIMENSIONS).toEqual(['scope', 'integration', 'infrastructure', 'knowledge', 'risk']);
  });
});

describe('normalizeLevel', () => {
  test('accepts any case, rejects garbage', () => {
    expect(normalizeLevel('complex')).toBe('COMPLEX');
    expect(normalizeLevel('Standard')).toBe('STANDARD');
    expect(normalizeLevel('nonsense')).toBeNull();
  });
});

describe('classifyComplexity — deterministic plan', () => {
  test('from a numeric score ≥16 → COMPLEX + revision cycle', () => {
    const c = classifyComplexity(18);
    expect(c.level).toBe('COMPLEX');
    expect(c.score).toBe(18);
    expect(c.requiresRevisionCycle).toBe(true);
    expect(c.requiresFullSpecPipeline).toBe(true);
    expect(c.phases).toEqual(PHASES_BY_LEVEL.COMPLEX);
  });

  test('from a dimensions object', () => {
    const c = classifyComplexity({ scope: 5, integration: 5, infrastructure: 4, knowledge: 1, risk: 1 });
    expect(c.score).toBe(16);
    expect(c.level).toBe('COMPLEX');
  });

  test('SIMPLE runs the trimmed 3-phase pipeline, no revision', () => {
    const c = classifyComplexity(6);
    expect(c.level).toBe('SIMPLE');
    expect(c.phases).toEqual(['gather-requirements', 'write-spec', 'critique']);
    expect(c.requiresRevisionCycle).toBe(false);
    expect(c.requiresFullSpecPipeline).toBe(false);
  });

  test('STANDARD runs the full 6-phase pipeline without revision', () => {
    const c = classifyComplexity(12);
    expect(c.level).toBe('STANDARD');
    expect(c.phases).toHaveLength(6);
    expect(c.requiresRevisionCycle).toBe(false);
    expect(c.requiresFullSpecPipeline).toBe(true);
  });

  test('from a level string (as the assess phase currently returns)', () => {
    expect(classifyComplexity('COMPLEX').requiresRevisionCycle).toBe(true);
    expect(classifyComplexity('STANDARD').level).toBe('STANDARD');
  });

  test('nothing usable → conservative STANDARD, never throws', () => {
    expect(classifyComplexity(null).level).toBe('STANDARD');
    expect(classifyComplexity(undefined).level).toBe('STANDARD');
  });

  test('returned phases are a copy (mutating them cannot corrupt the plan)', () => {
    const c = classifyComplexity(20);
    c.phases.push('evil');
    expect(classifyComplexity(20).phases).not.toContain('evil');
  });
});
