/**
 * Spec-Pipeline Complexity — deterministic threshold + phase plan.
 *
 * The COMPLEX≥16 rule lived only in prose (`workflow-execution.md` §3,
 * `documentation-first.md` complexity gate): "score ≥16 → COMPLEX → run the full
 * Spec Pipeline (6 phases + revision cycle) FIRST". Nothing in code enforced the
 * threshold or derived the phase plan from it, so the assessment was advisory.
 *
 * This module turns the threshold and the per-level phase plan into deterministic,
 * tested code (Story rodada2-m4, AF-20260704 #9b). It does NOT invent HOW the five
 * dimensions are scored — those values come from the `assess-complexity` phase; it
 * only encodes the mapping score → level → required phases, canonically defined in
 * `workflow-execution.md`.
 *
 * @module core/orchestration/spec-complexity
 */

'use strict';

/** The five complexity dimensions, each scored 1-5 (min 5, max 25). */
const DIMENSIONS = Object.freeze(['scope', 'integration', 'infrastructure', 'knowledge', 'risk']);

/**
 * Canonical thresholds (`workflow-execution.md` §3):
 *   score <= 8  → SIMPLE
 *   9..15       → STANDARD
 *   score >= 16 → COMPLEX
 */
const THRESHOLDS = Object.freeze({ SIMPLE_MAX: 8, COMPLEX_MIN: 16 });

const LEVELS = Object.freeze({ SIMPLE: 'SIMPLE', STANDARD: 'STANDARD', COMPLEX: 'COMPLEX' });

/**
 * Phase plans per level (`workflow-execution.md` §3 table):
 *   SIMPLE   → gather → spec → critique                                   (3)
 *   STANDARD → gather → assess → research → spec → critique → plan        (6)
 *   COMPLEX  → the 6 phases + a revision cycle                            (6 + revision)
 */
const PHASES_BY_LEVEL = Object.freeze({
  SIMPLE: Object.freeze(['gather-requirements', 'write-spec', 'critique']),
  STANDARD: Object.freeze([
    'gather-requirements',
    'assess-complexity',
    'research-dependencies',
    'write-spec',
    'critique',
    'plan',
  ]),
  COMPLEX: Object.freeze([
    'gather-requirements',
    'assess-complexity',
    'research-dependencies',
    'write-spec',
    'critique',
    'plan',
  ]),
});

/**
 * Map a numeric complexity score to its level. Deterministic; no side effects.
 * @param {number} score - Sum of the five dimensions (nominally 5..25).
 * @returns {'SIMPLE'|'STANDARD'|'COMPLEX'}
 */
function scoreToLevel(score) {
  const n = Number(score);
  if (!Number.isFinite(n)) return LEVELS.STANDARD; // conservative default
  if (n <= THRESHOLDS.SIMPLE_MAX) return LEVELS.SIMPLE;
  if (n >= THRESHOLDS.COMPLEX_MIN) return LEVELS.COMPLEX;
  return LEVELS.STANDARD;
}

/** Normalize a level-ish input (a level string, in any case) to a canonical level. */
function normalizeLevel(level) {
  const u = String(level || '').trim().toUpperCase();
  return LEVELS[u] || null;
}

/**
 * Sum an object of dimension → score (1-5). Missing dimensions count as 0.
 * @param {Record<string, number>} dimensions
 * @returns {number}
 */
function sumDimensions(dimensions) {
  if (!dimensions || typeof dimensions !== 'object') return NaN;
  return DIMENSIONS.reduce((total, d) => {
    const v = Number(dimensions[d]);
    return total + (Number.isFinite(v) ? v : 0);
  }, 0);
}

/**
 * Classify complexity from either a numeric score, a dimensions object, or an
 * already-decided level string. Returns the deterministic plan.
 *
 * @param {number|string|Record<string, number>} input
 * @returns {{
 *   level: 'SIMPLE'|'STANDARD'|'COMPLEX',
 *   score: number|null,
 *   phases: string[],
 *   requiresRevisionCycle: boolean,
 *   requiresFullSpecPipeline: boolean
 * }}
 */
function classifyComplexity(input) {
  let level;
  let score = null;

  if (typeof input === 'number') {
    score = input;
    level = scoreToLevel(input);
  } else if (typeof input === 'string') {
    level = normalizeLevel(input) || LEVELS.STANDARD;
  } else if (input && typeof input === 'object') {
    const s = sumDimensions(input);
    score = Number.isFinite(s) ? s : null;
    level = Number.isFinite(s) ? scoreToLevel(s) : LEVELS.STANDARD;
  } else {
    level = LEVELS.STANDARD; // conservative default when nothing usable is given
  }

  return {
    level,
    score,
    phases: [...PHASES_BY_LEVEL[level]],
    // COMPLEX is the only level that adds the revision cycle.
    requiresRevisionCycle: level === LEVELS.COMPLEX,
    // SIMPLE runs the trimmed 3-phase pipeline; STANDARD/COMPLEX run the full one.
    requiresFullSpecPipeline: level !== LEVELS.SIMPLE,
  };
}

module.exports = {
  DIMENSIONS,
  THRESHOLDS,
  LEVELS,
  PHASES_BY_LEVEL,
  scoreToLevel,
  normalizeLevel,
  sumDimensions,
  classifyComplexity,
};
