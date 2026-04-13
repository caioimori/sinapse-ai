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
    DOCTOR_VERSION: '2.0.0-test',
  }),
  { virtual: true },
);

const { cmdDoctor } = require('../../bin/cli');

describe('Story 10.21 — cmdDoctor wiring', () => {
  let originalExitCode;
  let consoleLogSpy;

  beforeEach(() => {
    originalExitCode = process.exitCode;
    process.exitCode = 0;
    consoleLogSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
    globalThis.__doctorMockState__.lastCallOptions = null;
    globalThis.__doctorMockState__.mockResult = {
      formatted: '== mock doctor output ==',
      data: { summary: { pass: 12, warn: 0, fail: 0, info: 0 } },
    };
  });

  afterEach(() => {
    consoleLogSpy.mockRestore();
    process.exitCode = originalExitCode;
  });

  it('--help short-circuits and prints help text without running checks', async () => {
    const result = await cmdDoctor({ help: true });
    expect(result.formatted).toBe('');
    expect(globalThis.__doctorMockState__.lastCallOptions).toBeNull();
    expect(consoleLogSpy).toHaveBeenCalled();
    const helpText = consoleLogSpy.mock.calls.map((call) => call.join(' ')).join('\n');
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
    const allOutput = consoleLogSpy.mock.calls.map((call) => call.join(' ')).join('\n');
    expect(allOutput).toContain('== mock doctor output ==');
  });

  it('keeps process.exitCode at 0 when summary.fail === 0', async () => {
    globalThis.__doctorMockState__.mockResult = {
      formatted: 'all good',
      data: { summary: { pass: 5, warn: 2, fail: 0, info: 1 } },
    };
    await cmdDoctor({});
    expect(process.exitCode).toBe(0);
  });

  it('sets process.exitCode to 1 when summary.fail > 0', async () => {
    globalThis.__doctorMockState__.mockResult = {
      formatted: 'some failures',
      data: { summary: { pass: 5, warn: 0, fail: 3, info: 0 } },
    };
    await cmdDoctor({});
    expect(process.exitCode).toBe(1);
  });

  it('returns the result object so callers can inspect it', async () => {
    const result = await cmdDoctor({});
    expect(result).toBe(globalThis.__doctorMockState__.mockResult);
    expect(result.data.summary.pass).toBe(12);
  });
});
