/**
 * Persistence Graceful Degradation Tests
 *
 * Ports #12 + #13 — graceful IO degradation on Windows.
 *
 * Proves that when file-backed persistence fails (disk full, permission denied,
 * invalid Windows path), the build does NOT crash: it marks persistence
 * unavailable and continues in memory.
 *
 * Covered:
 *   - BuildStateManager.saveState() — a throwing fs.writeFileSync marks
 *     persistence unavailable instead of throwing.
 *   - BuildStateManager.saveCheckpoint() — a throwing fs.writeFileSync still
 *     returns the checkpoint and keeps in-memory state intact.
 *   - BuildStateManager.recordFailure() — failures are normalized via
 *     core/errors and recorded in memory even when persistence is down.
 *   - MasterOrchestrator.saveState() — a throwing fs-extra.writeJson resolves
 *     false (never rejects) and flags persistence unavailable.
 *
 * @author @developer
 * @version 1.0.0
 */

const path = require('path');
const fs = require('fs');
const fsExtra = require('fs-extra');
const os = require('os');

const {
  BuildStateManager,
  BuildStatus,
} = require('../../.sinapse-ai/core/execution/build-state-manager');

const MasterOrchestrator = require('../../.sinapse-ai/core/orchestration/master-orchestrator');

// ═══════════════════════════════════════════════════════════════════════════════════
//                              BUILD STATE MANAGER
// ═══════════════════════════════════════════════════════════════════════════════════

describe('Persistence graceful degradation — BuildStateManager (Port #12)', () => {
  let testDir;
  let manager;
  const testStoryId = 'test-story-persistence';

  beforeEach(() => {
    testDir = fs.mkdtempSync(path.join(os.tmpdir(), 'persistence-graceful-'));
    manager = new BuildStateManager(testStoryId, {
      planDir: path.join(testDir, 'plan'),
      rootPath: testDir,
    });
    manager.createState({ totalSubtasks: 3 });
  });

  afterEach(() => {
    jest.restoreAllMocks();
    if (testDir && fs.existsSync(testDir)) {
      fs.rmSync(testDir, { recursive: true, force: true });
    }
  });

  test('starts with persistence available', () => {
    expect(manager.isPersistenceAvailable()).toBe(true);
    expect(manager.getPersistenceError()).toBeNull();
  });

  test('saveState does NOT throw when fs.writeFileSync fails — continues in memory', () => {
    const diskError = new Error('ENOSPC: no space left on device');
    jest.spyOn(fs, 'writeFileSync').mockImplementation(() => {
      throw diskError;
    });

    // Build continues: saveState returns the in-memory state, no crash.
    let saved;
    expect(() => {
      saved = manager.saveState();
    }).not.toThrow();

    expect(saved).toBe(manager.getState());
    expect(saved.storyId).toBe(testStoryId);

    // Persistence is now flagged unavailable with the underlying error.
    expect(manager.isPersistenceAvailable()).toBe(false);
    expect(manager.getPersistenceError()).toBe(diskError);
  });

  test('once persistence is down, later saves are no-ops that still return state', () => {
    const writeSpy = jest.spyOn(fs, 'writeFileSync').mockImplementation(() => {
      throw new Error('EACCES: permission denied');
    });

    manager.saveState(); // trips the breaker
    expect(manager.isPersistenceAvailable()).toBe(false);

    const callsAfterTrip = writeSpy.mock.calls.length;

    // Subsequent save short-circuits before touching fs again.
    const stateAgain = manager.saveState();
    expect(stateAgain).toBe(manager.getState());
    expect(writeSpy.mock.calls.length).toBe(callsAfterTrip);
  });

  test('saveCheckpoint does NOT crash when checkpoint write fails — state stays consistent', () => {
    jest.spyOn(fs, 'writeFileSync').mockImplementation(() => {
      throw new Error('EPERM: operation not permitted');
    });

    let checkpoint;
    expect(() => {
      checkpoint = manager.saveCheckpoint('1.1', { duration: 100 });
    }).not.toThrow();

    // Checkpoint object is still produced and tracked in memory.
    expect(checkpoint).toBeDefined();
    expect(checkpoint.subtaskId).toBe('1.1');
    expect(manager.getState().checkpoints).toHaveLength(1);
    expect(manager.getState().completedSubtasks).toContain('1.1');

    // Persistence flagged down.
    expect(manager.isPersistenceAvailable()).toBe(false);
    expect(manager.getPersistenceError()).toBeInstanceOf(Error);
  });

  test('recordFailure normalizes the error and records it in memory under degraded persistence', () => {
    jest.spyOn(fs, 'writeFileSync').mockImplementation(() => {
      throw new Error('disk full');
    });

    let result;
    expect(() => {
      result = manager.recordFailure('1.1', { error: new Error('compile blew up') });
    }).not.toThrow();

    expect(result.failure.subtaskId).toBe('1.1');
    expect(result.failure.error).toContain('compile blew up');
    // Normalized envelope from core/errors is attached.
    expect(result.failure.errorDetails).toBeDefined();
    expect(result.failure.errorDetails.code).toBe('SNPS_EXECUTION_FAILED');

    // In-memory metrics advanced despite persistence being unavailable.
    expect(manager.getState().failedAttempts).toHaveLength(1);
    expect(manager.getState().metrics.totalFailures).toBe(1);
    expect(manager.isPersistenceAvailable()).toBe(false);
  });

  test('happy path still persists to disk when writes succeed', () => {
    manager.saveState();
    expect(manager.isPersistenceAvailable()).toBe(true);
    expect(fs.existsSync(manager.stateFilePath)).toBe(true);

    const onDisk = JSON.parse(fs.readFileSync(manager.stateFilePath, 'utf-8'));
    expect(onDisk.storyId).toBe(testStoryId);
    expect(onDisk.status).toBe(BuildStatus.PENDING);
  });
});

// ═══════════════════════════════════════════════════════════════════════════════════
//                              MASTER ORCHESTRATOR
// ═══════════════════════════════════════════════════════════════════════════════════

describe('Persistence graceful degradation — MasterOrchestrator (Port #13)', () => {
  let testDir;
  let orchestrator;

  beforeEach(() => {
    testDir = fs.mkdtempSync(path.join(os.tmpdir(), 'persistence-graceful-mo-'));
    orchestrator = new MasterOrchestrator(testDir, { storyId: 'mo-persistence' });
  });

  afterEach(() => {
    jest.restoreAllMocks();
    if (testDir && fs.existsSync(testDir)) {
      fs.rmSync(testDir, { recursive: true, force: true });
    }
  });

  test('starts with persistence available', () => {
    expect(orchestrator.isPersistenceAvailable()).toBe(true);
    expect(orchestrator.getPersistenceError()).toBeNull();
  });

  test('saveState resolves false (never rejects) when writeJson throws — no crash', async () => {
    jest.spyOn(fsExtra, 'writeJson').mockRejectedValue(new Error('ENOSPC: no space left on device'));

    let ok;
    await expect(
      (async () => {
        ok = await orchestrator.saveState();
      })(),
    ).resolves.toBeUndefined();

    expect(ok).toBe(false);
    expect(orchestrator.isPersistenceAvailable()).toBe(false);
    expect(orchestrator.getPersistenceError()).toContain('ENOSPC');
  });

  test('getStatus and finalize expose persistence health after a failed save', async () => {
    jest.spyOn(fsExtra, 'writeJson').mockRejectedValue(new Error('EACCES: permission denied'));

    await orchestrator.saveState();

    const status = orchestrator.getStatus();
    expect(status.persistence).toBeDefined();
    expect(status.persistence.available).toBe(false);
    expect(status.persistence.error).toContain('EACCES');

    const finalized = orchestrator.finalize({ success: true });
    expect(finalized.persistence.available).toBe(false);
    expect(finalized.persistence.error).toContain('EACCES');
  });

  test('happy path persists state and reports persistence available', async () => {
    const ok = await orchestrator.saveState();
    expect(ok).toBe(true);
    expect(orchestrator.isPersistenceAvailable()).toBe(true);
    expect(orchestrator.getPersistenceError()).toBeNull();
    expect(await fsExtra.pathExists(orchestrator.statePath)).toBe(true);
  });
});
