/**
 * Gate Evaluator — "teeth" suite (Story F5, epic: orchestration-consolidation)
 *
 * The cold audit found the quality gates were loose: they passed even when the
 * upstream artifact was degraded/stub/absent. F4 made `generatePlan` mark degraded
 * plans (`degraded:true`/`stub:true`). F5 closes the loop — at least one gate MUST be
 * able to actually BLOCK a degraded/absent plan, and APPROVE a real one.
 *
 * These tests drive the GateEvaluator directly with fabricated epicResults, using the
 * REAL DEFAULT_GATE_CONFIG (no custom checks) so they prove the default epic4_to_epic6
 * gate has teeth.
 */

const path = require('path');
const fs = require('fs-extra');
const os = require('os');

const {
  GateEvaluator,
  GateVerdict,
} = require('../../.sinapse-ai/core/orchestration/gate-evaluator');

describe('Gate Evaluator teeth (Story F5) — blocks degraded/absent, approves real', () => {
  let tempDir;
  let evaluator;

  beforeEach(async () => {
    tempDir = path.join(os.tmpdir(), `gate-teeth-${Date.now()}-${Math.random().toString(36).slice(2)}`);
    await fs.ensureDir(tempDir);
    evaluator = new GateEvaluator({ projectRoot: tempDir, strictMode: false });
  });

  afterEach(async () => {
    await fs.remove(tempDir).catch(() => {});
  });

  // A real, non-degraded plan with at least one phase carrying subtasks.
  const realPlan = {
    storyId: 'F5-TEST',
    phases: [
      { id: 'implementation', name: 'Implementation', subtasks: [{ id: '1.1', description: 'do real work' }] },
    ],
  };

  describe('AC1 — gate BLOCKS when the plan is not real', () => {
    it('blocks a DEGRADED plan (degraded:true)', async () => {
      const epicResult = {
        plan: { ...realPlan, degraded: true, stub: true, reason: 'real-planning-disabled' },
        implementationPath: '/impl',
      };
      const result = await evaluator.evaluate(4, 6, epicResult);

      expect(result.verdict).toBe(GateVerdict.BLOCKED);
      const planReal = result.checks.find((c) => c.name === 'plan_is_real');
      expect(planReal.passed).toBe(false);
      expect(planReal.severity).toBe('critical');
    });

    it('blocks a STUB plan (stub:true, not flagged degraded)', async () => {
      const epicResult = {
        plan: { ...realPlan, stub: true },
        implementationPath: '/impl',
      };
      const result = await evaluator.evaluate(4, 6, epicResult);
      expect(result.verdict).toBe(GateVerdict.BLOCKED);
    });

    it('blocks an ABSENT plan', async () => {
      const epicResult = { implementationPath: '/impl' }; // no plan object at all
      const result = await evaluator.evaluate(4, 6, epicResult);

      expect(result.verdict).toBe(GateVerdict.BLOCKED);
      const planReal = result.checks.find((c) => c.name === 'plan_is_real');
      expect(planReal.passed).toBe(false);
    });

    it('blocks a plan with NO subtasks', async () => {
      const epicResult = {
        plan: { storyId: 'F5', phases: [{ id: 'p1', name: 'P1', subtasks: [] }] },
        implementationPath: '/impl',
      };
      const result = await evaluator.evaluate(4, 6, epicResult);
      expect(result.verdict).toBe(GateVerdict.BLOCKED);
    });
  });

  describe('AC1 — gate APPROVES a real plan', () => {
    it('approves a real, non-degraded plan with subtasks + implementation + no errors', async () => {
      const epicResult = {
        plan: realPlan,
        implementationPath: '/impl',
        errors: [],
        // testResults omitted on purpose → requireTests check is skipped honestly.
      };
      const result = await evaluator.evaluate(4, 6, epicResult);

      expect(result.verdict).toBe(GateVerdict.APPROVED);
      expect(result.score).toBe(5);
      const planReal = result.checks.find((c) => c.name === 'plan_is_real');
      expect(planReal.passed).toBe(true);
    });
  });

  describe('AC3 — zero checks is honest (score 0, never max)', () => {
    it('a gate that runs zero checks scores 0 and does not approve', async () => {
      // An unconfigured transition (no DEFAULT config, no default checks) → 0 checks.
      const e = new GateEvaluator({
        projectRoot: tempDir,
        gateConfig: { epic9_to_epic10: { blocking: false, checks: [] } },
      });
      const result = await e.evaluate(9, 10, {});

      expect(result.checks).toHaveLength(0);
      expect(result.score).toBe(0);
      expect(result.verdict).not.toBe(GateVerdict.APPROVED);
      expect(result.issues.some((i) => i.check === 'no_checks_evaluated')).toBe(true);
    });

    it('blocks a zero-check gate in strict mode', async () => {
      const e = new GateEvaluator({
        projectRoot: tempDir,
        strictMode: true,
        gateConfig: { epic9_to_epic10: { blocking: false, checks: [] } },
      });
      const result = await e.evaluate(9, 10, {});
      expect(result.verdict).toBe(GateVerdict.BLOCKED);
    });
  });
});
