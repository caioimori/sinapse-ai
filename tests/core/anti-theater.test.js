/**
 * Anti-Theater Suite (epic: orchestration-consolidation, F7)
 *
 * The cold audit of 2026-06-04 found the engine was "theater": executors
 * reported success:true without doing real work. F0a fixed it and several unit
 * tests lock specific cases. This suite is the CONSOLIDATED structural guard: it
 * asserts the honesty invariant across EVERY epic executor at once, so a future
 * regression that makes any stub "lie green" fails CI.
 *
 * Honesty invariant: an executor that did NOT perform real work MUST NOT return
 * `{ success: true, stub: false }`. It must be an honest stub (stub:true /
 * status:'stub') or an explicit failure.
 */

const path = require('path');
const fs = require('fs-extra');
const os = require('os');

const {
  Epic3Executor,
  Epic4Executor,
  Epic5Executor,
  Epic6Executor,
} = require('../../.sinapse-ai/core/orchestration/executors');

const MasterOrchestrator = require('../../.sinapse-ai/core/orchestration/master-orchestrator');

describe('Anti-Theater Suite (F7) — engine never fabricates success', () => {
  let tempDir;
  let mockOrchestrator;

  beforeEach(async () => {
    tempDir = path.join(os.tmpdir(), `anti-theater-${Date.now()}-${Math.random().toString(36).slice(2)}`);
    await fs.ensureDir(tempDir);
    // Mock orchestrator WITHOUT invokeAgent — i.e. no real executor wired.
    // Every executor must degrade honestly, not fabricate success.
    mockOrchestrator = {
      projectRoot: tempDir,
      storyId: 'ANTITHEATER-001',
      maxRetries: 0,
      _log: jest.fn(),
    };
  });

  afterEach(async () => {
    await fs.remove(tempDir).catch(() => {});
  });

  /**
   * A result "claims real success" iff it says success:true while NOT being an
   * honest stub. That is the exact shape the cold audit caught and we forbid.
   */
  function claimsRealSuccess(result) {
    if (!result) return false;
    const isHonestStub = result.stub === true || result.status === 'stub';
    return result.success === true && !isHonestStub;
  }

  describe('epic executors with no real executor wired', () => {
    const cases = [
      { name: 'Epic3 (Spec)', Ctor: Epic3Executor, ctx: { storyId: 'ANTITHEATER-001', source: 'story' } },
      { name: 'Epic4 (Execution)', Ctor: Epic4Executor, ctx: { storyId: 'ANTITHEATER-001' } },
      { name: 'Epic6 (QA)', Ctor: Epic6Executor, ctx: { storyId: 'ANTITHEATER-001', buildResult: {} } },
    ];

    for (const { name, Ctor, ctx } of cases) {
      test(`${name} does not fabricate success without a real agent`, async () => {
        const exec = new Ctor(mockOrchestrator);
        const result = await exec.execute(ctx);
        // Either honest stub or explicit non-success — never a fabricated success.
        expect(claimsRealSuccess(result)).toBe(false);
      });
    }
  });

  describe('full pipeline (default, mocked) reports stub honestly', () => {
    test('executeFullPipeline never reports a real success when epics are stubbed', async () => {
      const orchestrator = new MasterOrchestrator(tempDir, {
        storyId: 'ANTITHEATER-001',
        autoRecovery: false,
        maxRetries: 0,
        // Inject a stub executor: simulates "no real work" without spawning claude.
        invokeAgent: async () => ({ status: 'failed', success: false, error: 'no agent (anti-theater test)' }),
      });

      const result = await orchestrator.executeFullPipeline();
      // The pipeline ran stubbed epics → must NOT claim overall real success.
      expect(result.success).toBe(false);
      expect(result.mode).toBe('stub');
    });
  });

  describe('full pipeline with a REAL epic failure never lies green (master/gate leak fix)', () => {
    // Reproduces the e2e checkpoint: a real epic that FAILS (not a stub) — executor
    // returns { success:false, status:'failed' } WITHOUT throwing. The old code marked it
    // COMPLETED, logged "completed successfully", returned success:true and exited 0.
    test('a FAILED epic flips success:false, state ≠ COMPLETE, exit ≠ 0, and the gate does not approve', async () => {
      const { OrchestratorState } = MasterOrchestrator;
      const orchestrator = new MasterOrchestrator(tempDir, {
        storyId: 'ANTITHEATER-FAIL-001',
        autoRecovery: false,
        maxRetries: 0,
        // Real-success agent so Epic 3 produces a sound (non-stub) result and the
        // pipeline actually advances to Epic 4 (where we inject the real failure).
        invokeAgent: async () => ({ status: 'success', success: true, output: 'ok', filesModified: [] }),
      });
      await orchestrator.initialize();

      // Force a REAL, non-stub success for Epic 3 and a REAL failure for Epic 4.
      orchestrator.executors[3] = {
        execute: async () => ({
          success: true,
          specPath: '/spec.md',
          complexity: 'STANDARD',
          requirements: ['r1'],
        }),
      };
      orchestrator.executors[4] = {
        execute: async () => ({
          success: false,
          status: 'failed',
          error: 'real build failure (anti-theater)',
        }),
      };

      const result = await orchestrator.executeFullPipeline();

      // AC1: honest master — no fabricated green over a red epic.
      expect(result.success).toBe(false);
      expect(result.status).not.toBe(OrchestratorState.COMPLETE);
      expect(orchestrator.state).not.toBe(OrchestratorState.COMPLETE);
      expect(result.epics.failed).toContain(4);
      // Epic 4 is recorded FAILED, never COMPLETED.
      expect(orchestrator.executionState.epics[4].status).toBe('failed');

      // AC3: exit code reflects the truth (cli-commands derives it from success/blocked).
      const exitCode = result.success ? 0 : result.blocked ? 2 : 1;
      expect(exitCode).not.toBe(0);

      // AC2: a gate fed the failed epic result must NOT approve it.
      const { GateEvaluator, GateVerdict } = require('../../.sinapse-ai/core/orchestration/gate-evaluator');
      const gate = new GateEvaluator({ projectRoot: tempDir });
      const gateResult = await gate.evaluate(4, 6, {
        success: false,
        status: 'failed',
        error: 'real build failure (anti-theater)',
      });
      expect(gateResult.verdict).not.toBe(GateVerdict.APPROVED);
      expect(gateResult.verdict).toBe(GateVerdict.BLOCKED);
    });
  });

  describe('real-dispatch guard is active in the test runner', () => {
    test('the default dispatch executor refuses to spawn claude under jest', async () => {
      // No SINAPSE_REAL_DISPATCH → the guard must block real spawning and return
      // an honest failure, never a fabricated success.
      delete process.env.SINAPSE_REAL_DISPATCH;
      const orchestrator = new MasterOrchestrator(tempDir, { storyId: 'ANTITHEATER-001' });
      const out = await orchestrator.invokeAgent({ name: 'developer' }, { id: 't', description: 'x' }, {});
      expect(out.success).toBe(false);
      expect(String(out.error || '')).toMatch(/disabled in test environment|SINAPSE_REAL_DISPATCH/i);
    });
  });
});
