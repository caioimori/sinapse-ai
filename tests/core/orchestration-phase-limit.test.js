/**
 * Phase-limited orchestration + honest Windows QA verdict
 *
 * Story: onda2-p3 — feat(cli): assistente medido como produto
 * Source: audits/AF-20260702-fable5-upgrade.md items 2.2, 2.3, 2.4
 *
 * Covers:
 * - `spec` phase limit runs Epic 3 only and never reaches build/QA (AC1)
 * - `plan` phase limit runs Epics 3+4 and never reaches QA (AC1)
 * - BuildOrchestrator planOnly stops after the plan phase (no execute/qa/merge)
 * - finalize() verdict distinguishes QA infrastructure failure (PASS_QA_SKIPPED)
 *   from a real failure (AC3)
 * - Epic6Executor records invocation failures as infrastructure (AC3)
 * - displayResult() surfaces result.warning + the PASS_QA_SKIPPED banner (AC3)
 * - computeExitCode() maps PASS_QA_SKIPPED to exit 0
 */

const path = require('path');
const fs = require('fs-extra');
const os = require('os');
const yaml = require('js-yaml');

const MasterOrchestrator = require('../../.sinapse-ai/core/orchestration/master-orchestrator');
const Epic6Executor = require('../../.sinapse-ai/core/orchestration/executors/epic-6-executor');
const {
  BuildOrchestrator,
} = require('../../.sinapse-ai/core/execution/build-orchestrator');
const {
  spec,
  plan,
  displayResult,
  computeExitCode,
  commands,
} = require('../../.sinapse-ai/core/orchestration/cli-commands');

// A mock agent output that passes Epic 3's "looks like a spec" honesty check
// (>= 200 chars + markdown headings) so the spec is written as a REAL artifact.
const MOCK_SPEC_MARKDOWN = `# Specification: mock story

## Overview
This specification was produced by the injected mock executor for unit tests.
It describes the change in enough detail to be implementation-ready.

## Scope
- IN: the feature under test, its command surface and its honest verdicts.
- OUT: anything unrelated to the phase-limited pipeline.

## Acceptance Criteria
- AC1: the spec phase stops before plan/build/QA.
- AC2: the plan phase stops before build/QA.

## Complexity
LOW — single-module change with focused tests.
`;

const mockInvokeAgent = async () => ({
  status: 'success',
  success: true,
  output: MOCK_SPEC_MARKDOWN,
  filesModified: [],
});

describe('Phase-limited orchestration (Story onda2-p3)', () => {
  let tempDir;

  beforeEach(async () => {
    tempDir = path.join(
      os.tmpdir(),
      `phase-limit-test-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    );
    await fs.ensureDir(tempDir);
  });

  afterEach(async () => {
    await fs.remove(tempDir);
  });

  describe('MasterOrchestrator.phaseLimitSequence', () => {
    it('maps spec → [3], plan → [3,4], full → [3,4,6]', () => {
      expect(MasterOrchestrator.phaseLimitSequence('spec')).toEqual([3]);
      expect(MasterOrchestrator.phaseLimitSequence('plan')).toEqual([3, 4]);
      expect(MasterOrchestrator.phaseLimitSequence(null)).toEqual([3, 4, 6]);
      expect(MasterOrchestrator.phaseLimitSequence(undefined)).toEqual([3, 4, 6]);
    });

    it('rejects an invalid phaseLimit at construction', () => {
      expect(
        () => new MasterOrchestrator(process.cwd(), { storyId: 'X', phaseLimit: 'build' }),
      ).toThrow(/Invalid phaseLimit/);
    });
  });

  describe('spec phase limit (stops before plan/build/QA)', () => {
    it('runs Epic 3 only — Epics 4 and 6 are never started', async () => {
      const orchestrator = new MasterOrchestrator(tempDir, {
        storyId: 'SPEC-ONLY-1',
        phaseLimit: 'spec',
        autoRecovery: false,
        invokeAgent: mockInvokeAgent,
      });

      const result = await orchestrator.executeFullPipeline();

      expect(result.epics.executed).toEqual([3]);
      expect(result.epics.executed).not.toContain(4);
      expect(result.epics.executed).not.toContain(6);
      expect(orchestrator.executionState.epics[4].status).toBe('pending');
      expect(orchestrator.executionState.epics[6].status).toBe('pending');
      expect(result.phaseLimit).toBe('spec');
    });

    it('produces a REAL spec artifact on disk', async () => {
      const orchestrator = new MasterOrchestrator(tempDir, {
        storyId: 'SPEC-ONLY-2',
        phaseLimit: 'spec',
        autoRecovery: false,
        invokeAgent: mockInvokeAgent,
      });

      const result = await orchestrator.executeFullPipeline();
      const specPath = orchestrator.executionState.epics[3].result.specPath;

      expect(result.success).toBe(true);
      expect(result.verdict).toBe('PASS');
      expect(specPath).toBeDefined();
      expect(await fs.pathExists(specPath)).toBe(true);
      const content = await fs.readFile(specPath, 'utf8');
      expect(content).toContain('Acceptance Criteria');
    });
  });

  describe('plan phase limit (stops before build/QA)', () => {
    it('runs Epics 3 and 4 — Epic 6 (QA) is never started', async () => {
      const orchestrator = new MasterOrchestrator(tempDir, {
        storyId: 'PLAN-ONLY-1',
        phaseLimit: 'plan',
        autoRecovery: false,
        invokeAgent: mockInvokeAgent,
      });

      const result = await orchestrator.executeFullPipeline();

      // Inside jest Epic 4 runs its honest stub (real build delegated outside
      // the test runner) — the sequence contract is what matters here: QA never
      // starts under the 'plan' phase limit.
      expect(result.epics.executed).toContain(3);
      expect(result.epics.executed).toContain(4);
      expect(result.epics.executed).not.toContain(6);
      expect(orchestrator.executionState.epics[6].status).toBe('pending');
      expect(result.phaseLimit).toBe('plan');
    });

    it('threads planOnly buildOptions into the Epic 4 context', () => {
      const planOrch = new MasterOrchestrator(tempDir, {
        storyId: 'CTX-1',
        phaseLimit: 'plan',
      });
      const fullOrch = new MasterOrchestrator(tempDir, { storyId: 'CTX-2' });

      expect(planOrch._buildContextForEpic(4).buildOptions).toEqual({ planOnly: true });
      expect(fullOrch._buildContextForEpic(4).buildOptions).toBeUndefined();
    });
  });

  describe('BuildOrchestrator planOnly', () => {
    it('stops after the plan phase and persists a story-scoped plan', async () => {
      const storyId = 'STORY-PLANONLY';
      const storyPath = path.join(tempDir, 'docs', 'stories', `${storyId}.md`);
      await fs.ensureDir(path.dirname(storyPath));
      await fs.writeFile(
        storyPath,
        [
          `# Story: ${storyId}`,
          '',
          'Implement a small feature with clear acceptance criteria for the planner.',
          '',
          '- [ ] AC1: create the module',
          '- [ ] AC2: cover it with tests',
          '',
        ].join('\n'),
      );

      const builder = new BuildOrchestrator({
        rootPath: tempDir,
        useWorktree: false,
        autoMerge: false,
      });
      const result = await builder.build(storyId, { planOnly: true });

      expect(result.success).toBe(true);
      expect(result.planOnly).toBe(true);
      // Stops BEFORE build/QA/merge: only init + plan + report phases ran.
      expect(result.phases.plan).toBeDefined();
      expect(result.phases.plan.status).toBe('completed');
      expect(result.phases.execute).toBeUndefined();
      expect(result.phases.qa).toBeUndefined();
      expect(result.phases.merge).toBeUndefined();
      // A plan-only run writes no implementation files — honest by construction.
      expect(result.filesModified).toEqual([]);

      // The plan artifact is persisted STORY-SCOPED (not the shared <root>/plan/
      // path — the measured cross-story contamination vector).
      expect(result.planPath).toBe(
        path.join(tempDir, 'docs', 'stories', storyId, 'plan', 'implementation.yaml'),
      );
      expect(await fs.pathExists(result.planPath)).toBe(true);
      const persisted = yaml.load(
        (await fs.readFile(result.planPath, 'utf8')).replace(/^#.*$/gm, ''),
      );
      expect(Array.isArray(persisted.phases)).toBe(true);
      expect(persisted.phases.length).toBeGreaterThan(0);
    });
  });

  describe('finalize() honest verdict (audit AF-20260702 item 2.2)', () => {
    const basePipeline = {
      success: true,
      epicsExecuted: [3, 4, 6],
      epicsStubbed: [6],
      epicsFailed: [],
      hasStubs: true,
    };

    it('reports PASS_QA_SKIPPED when only QA stubbed due to infrastructure', () => {
      const orch = new MasterOrchestrator(tempDir, { storyId: 'V-1' });
      orch.executionState.epics[6] = {
        status: 'completed',
        result: { infrastructureFailure: true },
      };

      const result = orch.finalize({ ...basePipeline });

      expect(result.verdict).toBe('PASS_QA_SKIPPED');
      expect(result.qaSkipped).toBe(true);
      // F0a honesty preserved: a stubbed QA is still not a full success.
      expect(result.success).toBe(false);
      expect(result.warning).toMatch(/QA/i);
      expect(result.warning).toMatch(/0xC0000142/);
      expect(result.warning).toMatch(/build output is real/i);
    });

    it('keeps FAILED when the QA stub is NOT an infrastructure failure', () => {
      const orch = new MasterOrchestrator(tempDir, { storyId: 'V-2' });
      orch.executionState.epics[6] = { status: 'completed', result: {} };

      const result = orch.finalize({ ...basePipeline });

      expect(result.verdict).toBe('FAILED');
      expect(result.qaSkipped).toBe(false);
      // The generic stub warning still surfaces (previously hidden in the UX).
      expect(result.warning).toMatch(/STUB mode/i);
    });

    it('keeps FAILED when a build epic failed, even with QA infra failure', () => {
      const orch = new MasterOrchestrator(tempDir, { storyId: 'V-3' });
      orch.executionState.epics[6] = {
        status: 'completed',
        result: { infrastructureFailure: true },
      };

      const result = orch.finalize({
        ...basePipeline,
        success: false,
        epicsFailed: [4],
      });

      expect(result.verdict).toBe('FAILED');
      expect(result.qaSkipped).toBe(false);
    });

    it('keeps FAILED when build epics were stubbed too (nothing real was built)', () => {
      const orch = new MasterOrchestrator(tempDir, { storyId: 'V-4' });
      orch.executionState.epics[6] = {
        status: 'completed',
        result: { infrastructureFailure: true },
      };

      const result = orch.finalize({
        ...basePipeline,
        epicsStubbed: [4, 6],
      });

      expect(result.verdict).toBe('FAILED');
      expect(result.qaSkipped).toBe(false);
    });

    it('reports PASS on a clean full success', () => {
      const orch = new MasterOrchestrator(tempDir, { storyId: 'V-5' });

      const result = orch.finalize({
        success: true,
        epicsExecuted: [3, 4, 6],
        epicsStubbed: [],
        epicsFailed: [],
      });

      expect(result.verdict).toBe('PASS');
      expect(result.success).toBe(true);
      expect(result.warning).toBeUndefined();
    });
  });

  describe('Epic6Executor infrastructure-failure recording', () => {
    const spawnErrorResult = {
      status: 'failed',
      success: false,
      error: 'Claude CLI exited with code 3221225794: STATUS_DLL_INIT_FAILED',
      filesModified: [],
    };

    afterEach(() => {
      delete process.env.SINAPSE_REAL_DISPATCH;
    });

    it('marks the stub as infrastructure when the agent invocation returns a spawn failure', async () => {
      const invokeAgent = jest.fn(async () => ({ ...spawnErrorResult }));
      const exec = new Epic6Executor({ projectRoot: tempDir, invokeAgent });
      exec.maxIterations = 1;

      process.env.SINAPSE_REAL_DISPATCH = '1';
      const result = await exec.execute({
        storyId: 'QA-INFRA-1',
        buildResult: {},
        testResults: [],
        codeChanges: [],
      });

      expect(invokeAgent).toHaveBeenCalled();
      expect(result.stub).toBe(true);
      expect(result.infrastructureFailure).toBe(true);
      expect(result.infrastructureErrors.join(' ')).toContain('3221225794');
      expect(result.stubReason).toMatch(/infrastructure/i);
      expect(result.stubReason).toMatch(/not a test rejection/i);
    });

    it('marks the stub as infrastructure when the agent invocation throws', async () => {
      const invokeAgent = jest.fn(async () => {
        throw new Error('spawn claude ENOENT');
      });
      const exec = new Epic6Executor({ projectRoot: tempDir, invokeAgent });
      exec.maxIterations = 1;

      process.env.SINAPSE_REAL_DISPATCH = '1';
      const result = await exec.execute({
        storyId: 'QA-INFRA-2',
        buildResult: {},
        testResults: [],
        codeChanges: [],
      });

      expect(result.stub).toBe(true);
      expect(result.infrastructureFailure).toBe(true);
      expect(result.infrastructureErrors.join(' ')).toContain('ENOENT');
    });

    it('does NOT mark infrastructure when no real invocation was attempted', async () => {
      // No SINAPSE_REAL_DISPATCH → real path never attempted (plain stub).
      const exec = new Epic6Executor({ projectRoot: tempDir });
      exec.maxIterations = 1;

      const result = await exec.execute({
        storyId: 'QA-STUB-1',
        buildResult: {},
        testResults: [],
        codeChanges: [],
      });

      expect(result.stub).toBe(true);
      expect(result.infrastructureFailure).toBeUndefined();
      expect(result.stubReason).toBe(
        'QA ran deterministic basic checks only — no real review agent wired',
      );
    });

    it('does NOT mark infrastructure when a real review produced a verdict (rejection path)', async () => {
      const invokeAgent = jest.fn(async () => ({
        status: 'success',
        success: true,
        output: 'Review complete. Serious issues found.\nVERDICT: BLOCKED',
        filesModified: [],
      }));
      const exec = new Epic6Executor({ projectRoot: tempDir, invokeAgent });
      exec.maxIterations = 1;

      process.env.SINAPSE_REAL_DISPATCH = '1';
      const result = await exec.execute({
        storyId: 'QA-REJECT-1',
        buildResult: {},
        testResults: [],
        codeChanges: [],
      });

      // A real rejection is a VERDICT, not an infrastructure failure.
      expect(result.stub).toBeUndefined();
      expect(result.infrastructureFailure).toBeUndefined();
      expect(result.verdict).toBe('blocked');
    });
  });

  describe('CLI output honesty (displayResult / computeExitCode)', () => {
    let logOutput;
    let originalLog;

    beforeEach(() => {
      logOutput = [];
      originalLog = console.log;
      console.log = (...args) => logOutput.push(args.join(' '));
    });

    afterEach(() => {
      console.log = originalLog;
    });

    it('displayResult surfaces result.warning', () => {
      displayResult({
        success: false,
        warning: 'WARNING-MARKER-42',
        duration: '0m 1s',
        epics: { executed: [3] },
      });

      const out = logOutput.join('\n');
      expect(out).toContain('WARNING-MARKER-42');
      expect(out).toContain('ORCHESTRATION FAILED');
    });

    it('displayResult shows the PASS_QA_SKIPPED banner instead of FAILED', () => {
      displayResult({
        success: false,
        verdict: 'PASS_QA_SKIPPED',
        warning: 'QA could not run here',
        duration: '1m 2s',
        epics: { executed: [3, 4, 6] },
      });

      const out = logOutput.join('\n');
      expect(out).toContain('BUILD OK — QA SKIPPED');
      expect(out).toContain('QA could not run here');
      expect(out).not.toContain('ORCHESTRATION FAILED');
    });

    it('computeExitCode maps PASS_QA_SKIPPED to 0 and real failures to 1/2', () => {
      expect(computeExitCode({ success: true })).toBe(0);
      expect(computeExitCode({ success: false, verdict: 'PASS_QA_SKIPPED' })).toBe(0);
      expect(computeExitCode({ success: false, blocked: true })).toBe(2);
      expect(computeExitCode({ success: false })).toBe(1);
    });
  });

  describe('spec/plan command surface', () => {
    it('exports spec and plan in the commands map', () => {
      expect(commands.spec).toBe(spec);
      expect(commands.plan).toBe(plan);
    });

    it('spec requires a story id (same contract as orchestrate)', async () => {
      const result = await spec(null, { projectRoot: tempDir });
      expect(result.success).toBe(false);
      expect(result.exitCode).toBe(3);
    });

    it('spec --dry-run previews ONLY Epic 3', async () => {
      const logOutput = [];
      const originalLog = console.log;
      console.log = (...args) => logOutput.push(args.join(' '));
      try {
        const result = await spec('DRY-1', { projectRoot: tempDir, dryRun: true });
        expect(result.success).toBe(true);
        const out = logOutput.join('\n');
        expect(out).toContain('Epic 3');
        expect(out).not.toContain('Epic 4');
        expect(out).not.toContain('Epic 6');
      } finally {
        console.log = originalLog;
      }
    });

    it('plan --dry-run previews Epics 3 and 4 but never Epic 6', async () => {
      const logOutput = [];
      const originalLog = console.log;
      console.log = (...args) => logOutput.push(args.join(' '));
      try {
        const result = await plan('DRY-2', { projectRoot: tempDir, dryRun: true });
        expect(result.success).toBe(true);
        const out = logOutput.join('\n');
        expect(out).toContain('Epic 3');
        expect(out).toContain('Epic 4');
        expect(out).not.toContain('Epic 6');
      } finally {
        console.log = originalLog;
      }
    });
  });
});
