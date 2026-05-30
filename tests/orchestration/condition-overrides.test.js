/**
 * Runtime Condition Overrides — PORT #15
 *
 * Proves that:
 *   (a) setRuntimeCondition('tests_passing', true) takes precedence over defaults
 *   (b) without any override, behaviour is identical to the current implementation
 *       (regression guard)
 */

'use strict';

const ConditionEvaluator = require('../../.sinapse-ai/core/orchestration/condition-evaluator');
const { RUNTIME_CONDITION_DEFAULTS } = require('../../.sinapse-ai/core/orchestration/condition-evaluator');

// ---------------------------------------------------------------------------
// Minimal stub TechStackProfile (same shape used by production code)
// ---------------------------------------------------------------------------
function makeProfile(overrides = {}) {
  return {
    hasDatabase: false,
    hasFrontend: false,
    hasBackend: false,
    hasTypeScript: false,
    hasTests: false,
    database: { type: null, envVarsConfigured: false, hasRLS: false, hasMigrations: false },
    frontend: { framework: null, styling: null },
    ...overrides,
  };
}

// ---------------------------------------------------------------------------
// Test suite
// ---------------------------------------------------------------------------
describe('ConditionEvaluator — runtime condition overrides (PORT #15)', () => {
  let evaluator;

  beforeEach(() => {
    evaluator = new ConditionEvaluator(makeProfile());
  });

  // ── A. setRuntimeCondition / setRuntimeConditions API ────────────────────

  describe('setRuntimeCondition', () => {
    it('stores a boolean true override', () => {
      evaluator.setRuntimeCondition('tests_passing', true);
      expect(evaluator._runtimeOverrides.get('tests_passing')).toBe(true);
    });

    it('stores a boolean false override', () => {
      evaluator.setRuntimeCondition('tests_passing', false);
      expect(evaluator._runtimeOverrides.get('tests_passing')).toBe(false);
    });

    it('coerces truthy values to boolean true', () => {
      evaluator.setRuntimeCondition('some_condition', 1);
      expect(evaluator._runtimeOverrides.get('some_condition')).toBe(true);
    });

    it('coerces falsy values to boolean false', () => {
      evaluator.setRuntimeCondition('some_condition', 0);
      expect(evaluator._runtimeOverrides.get('some_condition')).toBe(false);
    });
  });

  describe('setRuntimeConditions (bulk)', () => {
    it('sets multiple overrides at once', () => {
      evaluator.setRuntimeConditions({ gate_approved: false, stories_remaining: false });
      expect(evaluator._runtimeOverrides.get('gate_approved')).toBe(false);
      expect(evaluator._runtimeOverrides.get('stories_remaining')).toBe(false);
    });

    it('accepts an empty object without throwing', () => {
      expect(() => evaluator.setRuntimeConditions({})).not.toThrow();
    });

    it('accepts no argument (default param) without throwing', () => {
      expect(() => evaluator.setRuntimeConditions()).not.toThrow();
    });
  });

  // ── B. Override precedence over RUNTIME_CONDITION_DEFAULTS ───────────────

  describe('override precedence', () => {
    it('(a) setRuntimeCondition true overrides a default-true condition', () => {
      // gate_approved is true in RUNTIME_CONDITION_DEFAULTS — override stays true
      evaluator.setRuntimeCondition('gate_approved', true);
      expect(evaluator.evaluate('gate_approved')).toBe(true);
    });

    it('(a) setRuntimeCondition false overrides a default-true condition', () => {
      // gate_approved defaults to true — override to false must win
      evaluator.setRuntimeCondition('gate_approved', false);
      expect(evaluator.evaluate('gate_approved')).toBe(false);
    });

    it('(a) setRuntimeCondition("tests_passing", true) wins even for unknown conditions', () => {
      // tests_passing is not in RUNTIME_CONDITION_DEFAULTS nor built-in evaluators
      evaluator.setRuntimeCondition('tests_passing', true);
      expect(evaluator.evaluate('tests_passing')).toBe(true);
    });

    it('(a) setRuntimeCondition("tests_passing", false) wins for unknown conditions', () => {
      evaluator.setRuntimeCondition('tests_passing', false);
      expect(evaluator.evaluate('tests_passing')).toBe(false);
    });

    it('overrides a built-in evaluator (project_has_database)', () => {
      // profile says no database, but runtime override forces true
      evaluator.setRuntimeCondition('project_has_database', true);
      expect(evaluator.evaluate('project_has_database')).toBe(true);
    });

    it('override false beats built-in evaluator that would return true', () => {
      const profileWithDb = makeProfile({ hasDatabase: true });
      const ev = new ConditionEvaluator(profileWithDb);
      // Without override, built-in returns true
      expect(ev.evaluate('project_has_database')).toBe(true);
      // With override false, must return false
      ev.setRuntimeCondition('project_has_database', false);
      expect(ev.evaluate('project_has_database')).toBe(false);
    });
  });

  // ── C. RUNTIME_CONDITION_DEFAULTS fallback (no override set) ─────────────

  describe('RUNTIME_CONDITION_DEFAULTS fallback', () => {
    it('returns true for all keys in RUNTIME_CONDITION_DEFAULTS when no override is set', () => {
      for (const key of Object.keys(RUNTIME_CONDITION_DEFAULTS)) {
        expect(evaluator.evaluate(key)).toBe(true);
      }
    });

    it('RUNTIME_CONDITION_DEFAULTS is frozen (immutable)', () => {
      expect(Object.isFrozen(RUNTIME_CONDITION_DEFAULTS)).toBe(true);
    });
  });

  // ── D. Regression — no override set behaves like the old implementation ──

  describe('regression — no override set', () => {
    it('(b) null condition returns true (no-op)', () => {
      expect(evaluator.evaluate(null)).toBe(true);
    });

    it('(b) undefined condition returns true (no-op)', () => {
      expect(evaluator.evaluate(undefined)).toBe(true);
    });

    it('(b) built-in project_has_database returns false when profile has no DB', () => {
      expect(evaluator.evaluate('project_has_database')).toBe(false);
    });

    it('(b) built-in project_has_frontend returns false when profile has no frontend', () => {
      expect(evaluator.evaluate('project_has_frontend')).toBe(false);
    });

    it('(b) built-in project_has_database returns true when profile hasDatabase', () => {
      const ev = new ConditionEvaluator(makeProfile({ hasDatabase: true }));
      expect(ev.evaluate('project_has_database')).toBe(true);
    });

    it('(b) qa_review_approved returns false with no QA approval set', () => {
      expect(evaluator.evaluate('qa_review_approved')).toBe(false);
    });

    it('(b) qa_review_approved returns true after setQAApproval(true)', () => {
      evaluator.setQAApproval(true);
      expect(evaluator.evaluate('qa_review_approved')).toBe(true);
    });

    it('(b) AND compound condition evaluates normally', () => {
      const ev = new ConditionEvaluator(makeProfile({ hasDatabase: true, hasFrontend: true }));
      expect(ev.evaluate('project_has_database && project_has_frontend')).toBe(true);
    });

    it('(b) OR compound condition evaluates normally', () => {
      const ev = new ConditionEvaluator(makeProfile({ hasDatabase: true }));
      expect(ev.evaluate('project_has_database || project_has_frontend')).toBe(true);
    });

    it('(b) negation of a false condition returns true', () => {
      // project_has_database is false on the default profile
      expect(evaluator.evaluate('!project_has_database')).toBe(true);
    });

    it('(b) shouldExecutePhase with no condition returns shouldExecute true', () => {
      const result = evaluator.shouldExecutePhase({ phase: 1 });
      expect(result.shouldExecute).toBe(true);
      expect(result.reason).toBe('no_condition');
    });

    it('(b) shouldExecutePhase honours condition without override', () => {
      const result = evaluator.shouldExecutePhase({
        phase: 1,
        condition: 'project_has_database',
      });
      expect(result.shouldExecute).toBe(false);
    });
  });

  // ── E. shouldExecutePhase respects override ───────────────────────────────

  describe('shouldExecutePhase with runtime override', () => {
    it('returns shouldExecute true when override forces condition true', () => {
      evaluator.setRuntimeCondition('project_has_database', true);
      const result = evaluator.shouldExecutePhase({
        phase: 1,
        condition: 'project_has_database',
      });
      expect(result.shouldExecute).toBe(true);
      expect(result.reason).toBe('condition_met');
    });

    it('returns shouldExecute false when override forces condition false', () => {
      evaluator.setRuntimeCondition('gate_approved', false);
      const result = evaluator.shouldExecutePhase({
        phase: 2,
        condition: 'gate_approved',
      });
      expect(result.shouldExecute).toBe(false);
    });
  });
});
