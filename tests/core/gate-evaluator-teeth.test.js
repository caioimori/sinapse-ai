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
        // epic: empty-build-honesty — real implementation now means real code files,
        // not just an implementationPath. Supply the files the build actually touched.
        codeChanges: ['src/feature.js', 'src/feature.test.js'],
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

  describe('AC2 — gate never approves a result that itself signals failure (master/gate leak fix)', () => {
    it('BLOCKS when the epic result is success:false', async () => {
      const result = await evaluator.evaluate(4, 6, {
        success: false,
        plan: realPlan,
        implementationPath: '/impl',
      });
      expect(result.verdict).toBe(GateVerdict.BLOCKED);
      expect(result.verdict).not.toBe(GateVerdict.APPROVED);
      const guard = result.checks.find((c) => c.name === 'result_not_failed');
      expect(guard).toBeDefined();
      expect(guard.passed).toBe(false);
      expect(guard.severity).toBe('critical');
    });

    it('BLOCKS a QA report whose verdict is BLOCKED (reproduces the e2e: approved score 5.0)', async () => {
      const result = await evaluator.evaluate(6, 7, {
        reportPath: '/qa.md',
        verdict: 'blocked',
        qaReport: { verdict: 'BLOCKED' },
      });
      // Old behavior: qa_report_exists + verdict_generated both passed → score 5.0 → APPROVED.
      expect(result.verdict).not.toBe(GateVerdict.APPROVED);
      expect(result.verdict).toBe(GateVerdict.BLOCKED);
    });

    it('does NOT add the guard (nor inflate checks) for a sound result', async () => {
      const result = await evaluator.evaluate(4, 6, {
        plan: realPlan,
        implementationPath: '/impl',
        codeChanges: ['src/feature.js'],
        errors: [],
      });
      expect(result.checks.find((c) => c.name === 'result_not_failed')).toBeUndefined();
      expect(result.verdict).toBe(GateVerdict.APPROVED);
      expect(result.score).toBe(5);
    });
  });

  // ─────────────────────────────────────────────────────────────────────────────────
  // AC1/AC2/AC3 — empty-build honesty (multi-story measurement, 2026-06-30)
  //
  // The engine's honesty invariant is LAW: "no path reports success without real work."
  // The measurement caught the epic4_to_epic6 gate APPROVING (score 5.0) a build that
  // wrote ZERO code files — because `implementation_exists` trusted `implementationPath`,
  // which epic-4 set to the PLAN path (always exists). These tests prove empty ≠ success:
  // a "succeeded" build with no real files is BLOCKED, and a build with real files passes.
  // ─────────────────────────────────────────────────────────────────────────────────
  describe('empty-build honesty — implementation_exists has teeth', () => {
    it('BLOCKS a "succeeded" build that wrote ZERO code files (only implementationPath=planPath)', async () => {
      // Reproduces the exact defect: plan is real, no errors, but the only implementation
      // signal is `implementationPath` pointing at the plan itself; codeChanges is empty.
      const planPath = '/repo/docs/stories/EMPTY/plan/implementation.yaml';
      const epicResult = {
        plan: realPlan,
        planPath,
        implementationPath: planPath, // the misleading signal — a plan is not an implementation
        codeChanges: [],
        errors: [],
      };
      const result = await evaluator.evaluate(4, 6, epicResult);

      expect(result.verdict).toBe(GateVerdict.BLOCKED);
      expect(result.verdict).not.toBe(GateVerdict.APPROVED);
      const implCheck = result.checks.find((c) => c.name === 'implementation_exists');
      expect(implCheck).toBeDefined();
      expect(implCheck.passed).toBe(false);
      expect(implCheck.severity).toBe('critical');
    });

    it('does NOT count the plan path as implementation (codeChanges listing only the plan)', async () => {
      const planPath = '/repo/docs/stories/EMPTY/plan/implementation.yaml';
      const epicResult = {
        plan: realPlan,
        planPath,
        // Even if the plan path leaks into codeChanges, it must be excluded.
        codeChanges: [planPath],
        errors: [],
      };
      const result = await evaluator.evaluate(4, 6, epicResult);

      const implCheck = result.checks.find((c) => c.name === 'implementation_exists');
      expect(implCheck.passed).toBe(false);
      expect(result.verdict).toBe(GateVerdict.BLOCKED);
    });

    it('APPROVES a build that wrote REAL code files (implementation_exists passes)', async () => {
      const planPath = '/repo/docs/stories/REAL/plan/implementation.yaml';
      const epicResult = {
        plan: realPlan,
        planPath,
        implementationPath: planPath,
        // Real files the build actually touched (plan excluded automatically).
        filesModified: ['src/gate.js', 'tests/gate.test.js'],
        errors: [],
      };
      const result = await evaluator.evaluate(4, 6, epicResult);

      const implCheck = result.checks.find((c) => c.name === 'implementation_exists');
      expect(implCheck.passed).toBe(true);
      expect(implCheck.message).toMatch(/2 code file/);
      expect(result.verdict).toBe(GateVerdict.APPROVED);
      expect(result.score).toBe(5);
    });

    it('reads real files nested under build.filesModified (BuildOrchestrator shape)', async () => {
      const epicResult = {
        plan: realPlan,
        planPath: '/repo/plan.yaml',
        build: { success: true, filesModified: ['src/only-here.js'] },
        errors: [],
      };
      const result = await evaluator.evaluate(4, 6, epicResult);

      const implCheck = result.checks.find((c) => c.name === 'implementation_exists');
      expect(implCheck.passed).toBe(true);
      expect(result.verdict).toBe(GateVerdict.APPROVED);
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
