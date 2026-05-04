'use strict';

// Story 10.21 — cmdDoctor wiring tests
//
// We mock the doctor module BEFORE requiring bin/cli.js so the cached
// require inside cmdDoctor picks up the mock. jest.mock() is hoisted,
// so the factory must reach shared state via globalThis.

if (!globalThis.__doctorMockState__) {
  globalThis.__doctorMockState__ = { lastCallOptions: null, mockResult: null };
}

jest.mock(
  '../../.sinapse-ai/core/doctor',
  () => ({
    runDoctorChecks: jest.fn(async (options) => {
      globalThis.__doctorMockState__.lastCallOptions = options;
      return globalThis.__doctorMockState__.mockResult;
    }),
    // Story A.3: expose resolveExitCode so the CLI wrapper uses the canonical mapping.
    resolveExitCode: jest.fn((result) => {
      if (!result || !result.data) return 3;
      if (result.data.internalError) return 3;
      const s = result.data.summary || {};
      if ((s.fail || 0) > 0) return 2;
      if ((s.warn || 0) > 0) return 1;
      return 0;
    }),
    DOCTOR_VERSION: '2.1.0-test',
  }),
  { virtual: true },
);

const { cmdDoctor } = require('../../bin/cli');

describe('Story 10.21 — cmdDoctor wiring', () => {
  let originalExitCode;
  let stdoutSpy;

  // Story A.2 — cmdDoctor now writes via the shared logger which targets
  // process.stdout.write directly, so we spy on that instead of console.log.
  beforeEach(() => {
    originalExitCode = process.exitCode;
    process.exitCode = 0;
    stdoutSpy = jest.spyOn(process.stdout, 'write').mockImplementation(() => true);
    globalThis.__doctorMockState__.lastCallOptions = null;
    globalThis.__doctorMockState__.mockResult = {
      formatted: '== mock doctor output ==',
      data: { summary: { pass: 12, warn: 0, fail: 0, info: 0 } },
    };
  });

  afterEach(() => {
    stdoutSpy.mockRestore();
    process.exitCode = originalExitCode;
  });

  it('--help short-circuits and prints help text without running checks', async () => {
    const result = await cmdDoctor({ help: true });
    expect(result.formatted).toBe('');
    expect(globalThis.__doctorMockState__.lastCallOptions).toBeNull();
    expect(stdoutSpy).toHaveBeenCalled();
    const helpText = stdoutSpy.mock.calls.map((call) => String(call[0])).join('');
    expect(helpText).toContain('Usage: npx sinapse-ai doctor');
    expect(helpText).toContain('--fix');
    expect(helpText).toContain('--json');
  });

  it('forwards all flags to runDoctorChecks', async () => {
    await cmdDoctor({ fix: true, json: true, dryRun: true, quiet: true, deep: true });
    expect(globalThis.__doctorMockState__.lastCallOptions).toMatchObject({
      fix: true,
      json: true,
      dryRun: true,
      quiet: true,
      deep: true,
    });
    expect(globalThis.__doctorMockState__.lastCallOptions.projectRoot).toBe(process.cwd());
  });

  it('coerces undefined flags to false', async () => {
    await cmdDoctor({});
    expect(globalThis.__doctorMockState__.lastCallOptions).toMatchObject({
      fix: false,
      json: false,
      dryRun: false,
      quiet: false,
      deep: false,
    });
  });

  it('prints the formatted result', async () => {
    await cmdDoctor({});
    const allOutput = stdoutSpy.mock.calls.map((call) => String(call[0])).join('');
    expect(allOutput).toContain('== mock doctor output ==');
  });

  it('keeps process.exitCode at 0 when all checks PASS (Story A.3)', async () => {
    globalThis.__doctorMockState__.mockResult = {
      formatted: 'all good',
      data: { summary: { pass: 5, warn: 0, fail: 0, info: 1 } },
    };
    await cmdDoctor({});
    expect(process.exitCode).toBe(0);
  });

  it('sets process.exitCode to 2 when summary.fail > 0 (Story A.3)', async () => {
    globalThis.__doctorMockState__.mockResult = {
      formatted: 'some failures',
      data: { summary: { pass: 5, warn: 0, fail: 3, info: 0 } },
    };
    await cmdDoctor({});
    expect(process.exitCode).toBe(2);
  });

  it('sets process.exitCode to 1 when WARN only (Story A.3)', async () => {
    globalThis.__doctorMockState__.mockResult = {
      formatted: 'warnings',
      data: { summary: { pass: 5, warn: 2, fail: 0, info: 0 } },
    };
    await cmdDoctor({});
    expect(process.exitCode).toBe(1);
  });

  it('sets process.exitCode to 3 when internal error (Story A.3)', async () => {
    globalThis.__doctorMockState__.mockResult = {
      formatted: 'internal error',
      data: {
        summary: { pass: 0, warn: 0, fail: 0, info: 0 },
        internalError: { message: 'boom' },
      },
    };
    await cmdDoctor({});
    expect(process.exitCode).toBe(3);
  });

  it('returns the result object so callers can inspect it', async () => {
    const result = await cmdDoctor({});
    expect(result).toBe(globalThis.__doctorMockState__.mockResult);
    expect(result.data.summary.pass).toBe(12);
  });
});
