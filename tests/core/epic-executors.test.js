/**
 * Epic Executors Tests
 *
 * Story: 0.3 - Epic Executors
 * Epic: Epic 0 - ADE Master Orchestrator
 *
 * Tests for all epic executor classes.
 *
 * @author @developer (Dex)
 * @version 1.0.0
 */

const path = require('path');
const fs = require('fs-extra');
const os = require('os');

const {
  EpicExecutor,
  Epic3Executor,
  Epic4Executor,
  Epic5Executor,
  Epic6Executor,
  ExecutionStatus,
  RecoveryStrategy,
  QAVerdict,
  createExecutor,
  hasExecutor,
  getAvailableEpics,
  EXECUTOR_MAP,
} = require('../../.sinapse-ai/core/orchestration/executors');

describe('Epic Executors (Story 0.3)', () => {
  let tempDir;
  let mockOrchestrator;

  beforeEach(async () => {
    // Create temp directory
    tempDir = path.join(os.tmpdir(), `epic-executors-test-${Date.now()}`);
    await fs.ensureDir(tempDir);

    // Create mock orchestrator
    mockOrchestrator = {
      projectRoot: tempDir,
      storyId: 'TEST-001',
      maxRetries: 3,
      _log: jest.fn(),
    };
  });

  afterEach(async () => {
    await fs.remove(tempDir);
  });

  describe('EpicExecutor Base Class (AC1)', () => {
    it('should create instance with orchestrator and epic number', () => {
      const executor = new EpicExecutor(mockOrchestrator, 3);

      expect(executor.orchestrator).toBe(mockOrchestrator);
      expect(executor.epicNum).toBe(3);
      expect(executor.status).toBe(ExecutionStatus.PENDING);
    });

    it('should throw error on execute() - abstract method', async () => {
      const executor = new EpicExecutor(mockOrchestrator, 3);

      await expect(executor.execute({})).rejects.toThrow('must implement execute()');
    });

    it('should return standardized result (AC7)', () => {
      const executor = new EpicExecutor(mockOrchestrator, 3);
      executor.status = ExecutionStatus.SUCCESS;
      executor.startTime = new Date().toISOString();
      executor.endTime = new Date().toISOString();

      const result = executor.getResult();

      expect(result.epicNum).toBe(3);
      expect(result.status).toBe(ExecutionStatus.SUCCESS);
      expect(result.success).toBe(true);
      expect(result.artifacts).toEqual([]);
      expect(result.errors).toEqual([]);
    });

    it('should track artifacts', () => {
      const executor = new EpicExecutor(mockOrchestrator, 3);

      executor._addArtifact('file', '/path/to/file.md', { size: 100 });

      expect(executor.artifacts).toHaveLength(1);
      expect(executor.artifacts[0].type).toBe('file');
      expect(executor.artifacts[0].path).toBe('/path/to/file.md');
      expect(executor.artifacts[0].size).toBe(100);
    });

    it('should track logs', () => {
      const executor = new EpicExecutor(mockOrchestrator, 3);

      executor._log('Test message', 'info');
      executor._log('Error message', 'error');

      expect(executor.logs).toHaveLength(2);
      expect(executor.logs[0].message).toBe('Test message');
      expect(executor.logs[1].level).toBe('error');
    });

    it('should calculate duration', () => {
      const executor = new EpicExecutor(mockOrchestrator, 3);
      executor.startTime = new Date(Date.now() - 5000).toISOString();
      executor.endTime = new Date().toISOString();

      const duration = executor._getDuration();
      const durationMs = executor._getDurationMs();

      expect(duration).toBe('5s');
      expect(durationMs).toBeGreaterThanOrEqual(4900);
      expect(durationMs).toBeLessThanOrEqual(5100);
    });
  });

  describe('Epic3Executor - Spec Pipeline (AC2)', () => {
    let executor;

    beforeEach(() => {
      executor = new Epic3Executor(mockOrchestrator);
    });

    it('should create instance with epic number 3', () => {
      expect(executor.epicNum).toBe(3);
    });

    it('should run in STUB mode and report it honestly (no real agent wired yet)', async () => {
      // Honesty invariant (epic: orchestration-consolidation, F0a):
      // with no spec present and no real agent, Epic 3 auto-stubs the spec and MUST
      // report status:'stub' / success:false — never a fabricated success.
      const result = await executor.execute({
        storyId: 'TEST-001',
        source: 'story',
      });

      expect(result.success).toBe(false);
      expect(result.status).toBe('stub');
      expect(result.stub).toBe(true);
      expect(result.specPath).toBeDefined();
      expect(result.complexity).toBeDefined();
    });

    it('should fail without storyId', async () => {
      const result = await executor.execute({});

      expect(result.success).toBe(false);
      expect(result.error).toContain('storyId');
    });

    it('should reuse existing spec', async () => {
      // Create existing spec
      const specPath = path.join(tempDir, 'docs', 'stories', 'TEST-001', 'spec.md');
      await fs.ensureDir(path.dirname(specPath));
      await fs.writeFile(specPath, '# Existing Spec');

      const result = await executor.execute({
        storyId: 'TEST-001',
        source: 'story',
      });

      expect(result.success).toBe(true);
      expect(result.reused).toBe(true);
    });

    it('should generate a REAL spec when a real executor is wired (F1)', async () => {
      // Inject a real executor (mock) — proves Epic 3 invokes the agent, not stubbing.
      const orchWithExecutor = {
        ...mockOrchestrator,
        invokeAgent: jest.fn(async () => ({
          status: 'success',
          success: true,
          // Must pass the plausibility gate (≥200 chars + markdown structure):
          // a real spec, not a one-liner — mirrors what a real agent returns.
          output: [
            '# Specification: TEST-001',
            '',
            '## Overview',
            'Real agent-generated spec for TEST-001 covering the full scope.',
            '',
            '## Acceptance Criteria',
            '1. Given a valid input, when processed, then output matches the contract.',
            '2. Given an invalid input, when processed, then a clear error is raised.',
            '',
            '## Scope',
            '- IN: core behavior, unit tests',
            '- OUT: integrations beyond this story',
            '',
            '## Complexity',
            'SIMPLE — single module, no external dependencies.',
            '',
          ].join('\n'),
          filesModified: [],
        })),
      };
      const exec = new Epic3Executor(orchWithExecutor);

      const result = await exec.execute({ storyId: 'TEST-001', source: 'story' });

      expect(orchWithExecutor.invokeAgent).toHaveBeenCalled();
      // Real work happened → NOT a stub.
      expect(result.success).toBe(true);
      expect(result.stub).toBeFalsy();
      // The written spec is the agent output, not the template stub.
      const written = await fs.readFile(result.specPath, 'utf8');
      expect(written).toContain('Real agent-generated spec');
    });
  });

  describe('Epic4Executor - Execution Engine (AC3)', () => {
    let executor;

    beforeEach(() => {
      executor = new Epic4Executor(mockOrchestrator);
    });

    it('should create instance with epic number 4', () => {
      expect(executor.epicNum).toBe(4);
    });

    it('should run in STUB mode and report it honestly (subtasks/tests not wired yet)', async () => {
      // Honesty invariant (epic: orchestration-consolidation, F0a):
      // Epic 4 does not yet invoke real agents — it MUST report status:'stub',
      // never success:true. Wired for real in Frente F1.
      const result = await executor.execute({
        storyId: 'TEST-001',
        specPath: '/path/to/spec.md',
        complexity: 'STANDARD',
      });

      expect(result.success).toBe(false);
      expect(result.status).toBe('stub');
      expect(result.stub).toBe(true);
      expect(result.progress).toBeDefined();
      expect(result.planPath).toBeDefined();
    });

    it('should DELEGATE to BuildOrchestrator when real execution is allowed (F1 convergence)', async () => {
      const buildModule = require('../../.sinapse-ai/core/execution/build-orchestrator');
      const buildSpy = jest
        .spyOn(buildModule.BuildOrchestrator.prototype, 'build')
        .mockResolvedValue({
          success: true,
          storyId: 'TEST-001',
          duration: 1,
          phases: {},
          reportPath: 'report.md',
        });

      process.env.SINAPSE_REAL_DISPATCH = '1';
      try {
        const exec = new Epic4Executor(mockOrchestrator);
        const result = await exec.execute({ storyId: 'TEST-001', specPath: '/path/to/spec.md' });

        // Proves Epic 4 delegates instead of re-implementing/stubbing.
        expect(buildSpy).toHaveBeenCalledWith('TEST-001', expect.anything());
        // Real build (mocked) succeeded → completed, NOT a stub.
        expect(result.success).toBe(true);
        expect(result.stub).toBeFalsy();
        expect(result.build).toBeDefined();
      } finally {
        delete process.env.SINAPSE_REAL_DISPATCH;
        buildSpy.mockRestore();
      }
    });

    it('should create stub plan if not exists', async () => {
      const result = await executor.execute({
        storyId: 'TEST-001',
        specPath: '/path/to/spec.md',
      });

      const planPath = path.join(
        tempDir,
        'docs',
        'stories',
        'TEST-001',
        'plan',
        'implementation.yaml',
      );
      expect(await fs.pathExists(planPath)).toBe(true);
    });

    // Regression: stub plan must survive a write→read round-trip with a Windows
    // specPath. Pre-fix the YAML was hand-written into a double-quoted scalar, so
    // `C:\Users\...` produced an invalid escape (`\U`) and yaml.load threw — killing
    // the build path on Windows. (Story: FIX windows-path-yaml-plan, AC2)
    it('should round-trip a Windows specPath through write→yaml.load without throwing (AC2)', async () => {
      const yaml = require('js-yaml');
      const winSpecPath = 'C:\\Users\\Caio Imori\\AppData\\Local\\Temp\\spec.md';
      const planPath = path.join(tempDir, 'plan', 'win', 'implementation.yaml');

      // Real write path.
      await executor._createStubPlan(planPath, 'WIN-001', winSpecPath);

      // Real read path (identical yaml.load call used by plan-tracker,
      // build-orchestrator and autonomous-build-loop).
      const raw = await fs.readFile(planPath, 'utf-8');
      let plan;
      expect(() => {
        plan = yaml.load(raw);
      }).not.toThrow();

      expect(plan.metadata.specPath).toBe(winSpecPath);
      expect(plan.metadata.storyId).toBe('WIN-001');
      expect(plan.phases).toHaveLength(4);
    });

    // No regression for POSIX paths / N/A fallback. (AC3)
    it('should round-trip a POSIX specPath and N/A fallback (AC3)', async () => {
      const yaml = require('js-yaml');

      const posixPath = path.join(tempDir, 'plan', 'posix', 'implementation.yaml');
      await executor._createStubPlan(posixPath, 'POSIX-001', '/path/to/spec.md');
      const posixPlan = yaml.load(await fs.readFile(posixPath, 'utf-8'));
      expect(posixPlan.metadata.specPath).toBe('/path/to/spec.md');

      const naPath = path.join(tempDir, 'plan', 'na', 'implementation.yaml');
      await executor._createStubPlan(naPath, 'NA-001', null);
      const naPlan = yaml.load(await fs.readFile(naPath, 'utf-8'));
      expect(naPlan.metadata.specPath).toBe('N/A');
    });
  });

  describe('Epic5Executor - Recovery System (AC4)', () => {
    let executor;

    beforeEach(() => {
      executor = new Epic5Executor(mockOrchestrator);
    });

    it('should create instance with epic number 5', () => {
      expect(executor.epicNum).toBe(5);
    });

    it('should execute recovery for failed epic', async () => {
      const result = await executor.execute({
        storyId: 'TEST-001',
        failedEpic: 4,
        error: new Error('Test failure'),
        attempts: 0,
      });

      expect(result.success).toBe(true);
      expect(result.strategy).toBeDefined();
      expect(result.shouldRetry).toBeDefined();
    });

    it('should escalate after max attempts', async () => {
      const result = await executor.execute({
        storyId: 'TEST-001',
        failedEpic: 4,
        error: new Error('Persistent failure'),
        attempts: 5,
      });

      expect(result.strategy).toBe(RecoveryStrategy.ESCALATE_TO_HUMAN);
      expect(result.escalated).toBe(true);
    });

    it('should create escalation report', async () => {
      const result = await executor.execute({
        storyId: 'TEST-001',
        failedEpic: 4,
        error: new Error('Critical failure'),
        attempts: 5,
      });

      expect(result.recoveryResult.reportPath).toBeDefined();
      expect(await fs.pathExists(result.recoveryResult.reportPath)).toBe(true);
    });
  });

  describe('Epic6Executor - QA Loop (AC5)', () => {
    let executor;

    beforeEach(() => {
      executor = new Epic6Executor(mockOrchestrator);
    });

    it('should create instance with epic number 6', () => {
      expect(executor.epicNum).toBe(6);
    });

    it('should execute QA loop and report STUB honestly when no real reviewer is wired', async () => {
      const result = await executor.execute({
        storyId: 'TEST-001',
        buildResult: {},
        testResults: [],
      });

      // Honesty invariant (F0a/F7): basic-checks-only QA must NOT fabricate success.
      expect(result.stub).toBe(true);
      expect(result.success).not.toBe(true);
      expect(result.verdict).toBeDefined();
      expect(result.iterations).toBeDefined();
    });

    it('reports real success when a real @quality-gate reviewer approves', async () => {
      const invokeAgent = jest.fn(async () => ({
        success: true,
        output: 'Reviewed the changes; coverage is adequate.\nVERDICT: APPROVED',
      }));
      const exec = new Epic6Executor({ ...mockOrchestrator, invokeAgent });

      process.env.SINAPSE_REAL_DISPATCH = '1';
      try {
        const result = await exec.execute({ storyId: 'TEST-001', buildResult: {}, testResults: [] });
        expect(invokeAgent).toHaveBeenCalled();
        expect(result.success).toBe(true);
        expect(result.stub).toBeFalsy();
        expect(result.verdict).toBe(QAVerdict.APPROVED);
        expect(result.passed).toBe(true);
      } finally {
        delete process.env.SINAPSE_REAL_DISPATCH;
      }
    });

    it('should generate QA report', async () => {
      const result = await executor.execute({
        storyId: 'TEST-001',
        buildResult: {},
      });

      expect(result.reportPath).toBeDefined();
      expect(await fs.pathExists(result.reportPath)).toBe(true);
    });

    it('_applyFixes invokes the real agent when one is wired (F: epic-6 real)', async () => {
      const invokeAgent = jest.fn(async () => ({
        success: true,
        output: 'fixed',
        filesModified: ['src/x.js'],
      }));
      const orchWithExecutor = { ...mockOrchestrator, invokeAgent };
      const exec = new Epic6Executor(orchWithExecutor);

      const issues = [{ type: 'lint', severity: 'major', message: 'unused var' }];
      // SINAPSE_REAL_DISPATCH gate: allow real path inside the test runner.
      process.env.SINAPSE_REAL_DISPATCH = '1';
      try {
        const res = await exec._applyFixes(issues, { storyId: 'TEST-001' });
        expect(invokeAgent).toHaveBeenCalled();
        expect(res.applied).toBe(true);
        expect(res.stub).toBe(false);
        expect(res.fixed).toBe(1);
      } finally {
        delete process.env.SINAPSE_REAL_DISPATCH;
      }
    });

    it('_applyFixes is honest (stub) when no executor is wired', async () => {
      // mockOrchestrator has no invokeAgent → must NOT claim a fix happened.
      const res = await executor._applyFixes(
        [{ type: 'lint', severity: 'minor', message: 'x' }],
        { storyId: 'TEST-001' },
      );
      expect(res.applied).toBe(false);
      expect(res.stub).toBe(true);
    });
  });

  describe('Factory Functions', () => {
    it('should create executor with createExecutor()', () => {
      const executor = createExecutor(3, mockOrchestrator);

      expect(executor).toBeInstanceOf(Epic3Executor);
      expect(executor.epicNum).toBe(3);
    });

    it('should throw for unknown epic number', () => {
      expect(() => createExecutor(99, mockOrchestrator)).toThrow('No executor found');
    });

    it('should check executor existence with hasExecutor()', () => {
      expect(hasExecutor(3)).toBe(true);
      expect(hasExecutor(6)).toBe(true);
      expect(hasExecutor(99)).toBe(false);
    });

    it('should return available epics', () => {
      const epics = getAvailableEpics();

      expect(epics).toContain(3);
      expect(epics).toContain(4);
      expect(epics).toContain(5);
      expect(epics).toContain(6);
    });
  });

  describe('Enums', () => {
    it('should export ExecutionStatus enum', () => {
      expect(ExecutionStatus.PENDING).toBe('pending');
      expect(ExecutionStatus.RUNNING).toBe('running');
      expect(ExecutionStatus.SUCCESS).toBe('success');
      expect(ExecutionStatus.FAILED).toBe('failed');
    });

    it('should export RecoveryStrategy enum', () => {
      expect(RecoveryStrategy.RETRY_SAME_APPROACH).toBe('retry_same_approach');
      expect(RecoveryStrategy.ESCALATE_TO_HUMAN).toBe('escalate_to_human');
    });

    it('should export QAVerdict enum', () => {
      expect(QAVerdict.APPROVED).toBe('approved');
      expect(QAVerdict.NEEDS_REVISION).toBe('needs_revision');
      expect(QAVerdict.BLOCKED).toBe('blocked');
    });
  });

  describe('EXECUTOR_MAP', () => {
    it('should map all epic numbers to executor classes', () => {
      expect(EXECUTOR_MAP[3]).toBe(Epic3Executor);
      expect(EXECUTOR_MAP[4]).toBe(Epic4Executor);
      expect(EXECUTOR_MAP[5]).toBe(Epic5Executor);
      expect(EXECUTOR_MAP[6]).toBe(Epic6Executor);
    });
  });
});

describe('Standardized Results (AC7)', () => {
  let tempDir;
  let mockOrchestrator;

  beforeEach(async () => {
    tempDir = path.join(os.tmpdir(), `executor-results-test-${Date.now()}`);
    await fs.ensureDir(tempDir);

    mockOrchestrator = {
      projectRoot: tempDir,
      storyId: 'TEST-001',
      _log: jest.fn(),
    };
  });

  afterEach(async () => {
    await fs.remove(tempDir);
  });

  it('all executors should return consistent result structure', async () => {
    const executors = [
      new Epic3Executor(mockOrchestrator),
      new Epic4Executor(mockOrchestrator),
      new Epic5Executor(mockOrchestrator),
      new Epic6Executor(mockOrchestrator),
    ];

    const contexts = [
      { storyId: 'TEST-001', source: 'story' },
      { storyId: 'TEST-001', specPath: '/path' },
      { storyId: 'TEST-001', failedEpic: 3, error: 'test', attempts: 0 },
      { storyId: 'TEST-001', buildResult: {} },
    ];

    for (let i = 0; i < executors.length; i++) {
      const result = await executors[i].execute(contexts[i]);

      // All results should have these fields
      expect(result).toHaveProperty('epicNum');
      expect(result).toHaveProperty('status');
      expect(result).toHaveProperty('success');
      expect(result).toHaveProperty('artifacts');
      expect(result).toHaveProperty('errors');
      expect(result).toHaveProperty('duration');
    }
  });
});

