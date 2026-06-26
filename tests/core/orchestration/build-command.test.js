/**
 * build-command.test.js
 *
 * Covers `sinapse build` wiring (Story reconnect-bob-orchestrator-build-command):
 *   - dry-run renders the route plan WITHOUT constructing the heavy engine
 *   - the real path delegates to BobOrchestrator.orchestrate and reports its result
 */

'use strict';

const path = require('path');

const ORCH_DIR = path.resolve(__dirname, '../../../.sinapse-ai/core/orchestration');
const BUILD_CMD = path.join(ORCH_DIR, 'build-command');
const INDEX = path.join(ORCH_DIR, 'index');

describe('build-command (sinapse build)', () => {
  let logSpy;

  beforeEach(() => {
    jest.resetModules();
    logSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
  });

  afterEach(() => {
    logSpy.mockRestore();
    jest.restoreAllMocks();
  });

  it('dry-run returns success and prints the routing plan without building the engine', async () => {
    // If the engine were constructed, requiring ./index would run; we assert the
    // dry-run path resolves cleanly and never throws (no locks/panels).
    const { build } = require(BUILD_CMD);
    const res = await build('criar um site institucional', {
      projectRoot: process.cwd(),
      dryRun: true,
    });

    expect(res.success).toBe(true);
    expect(res.exitCode).toBe(0);
    expect(res.state).toBeDefined();
    expect(res.state.projectType).toBe('site');
    // The plan header is printed.
    const out = logSpy.mock.calls.map((c) => c.join(' ')).join('\n');
    expect(out).toMatch(/SINAPSE Build/);
    expect(out).toMatch(/dry-run/);
    // No engine result was rendered.
    expect(res.result).toBeUndefined();
  });

  it('real path delegates to BobOrchestrator.orchestrate and reports the result', async () => {
    const orchestrateMock = jest.fn().mockResolvedValue({
      success: true,
      projectState: 'EMPTY',
      action: 'greenfield_started',
      data: { nextStep: 'produce docs/project-brief.md' },
    });

    jest.doMock(INDEX, () => ({
      BobOrchestrator: jest.fn().mockImplementation(() => ({
        orchestrate: orchestrateMock,
      })),
    }), { virtual: false });

    const { build } = require(BUILD_CMD);
    const res = await build('criar um site', { projectRoot: process.cwd() });

    expect(orchestrateMock).toHaveBeenCalledTimes(1);
    expect(orchestrateMock).toHaveBeenCalledWith(
      expect.objectContaining({ userGoal: 'criar um site' }),
    );
    expect(res.success).toBe(true);
    expect(res.exitCode).toBe(0);
    expect(res.result.action).toBe('greenfield_started');
  });

  it('reports a non-zero exit when the engine fails to load', async () => {
    jest.doMock(INDEX, () => {
      throw new Error('boom');
    }, { virtual: false });

    const { build } = require(BUILD_CMD);
    const res = await build('criar um site', { projectRoot: process.cwd() });

    expect(res.success).toBe(false);
    expect(res.exitCode).toBe(1);
  });
});
