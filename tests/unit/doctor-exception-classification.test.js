'use strict';

/**
 * Story A.3 — Doctor Exception Classification
 *
 * Tests the refactored `.sinapse-ai/core/doctor/index.js`:
 *   - Each check module's `onError` field ('fail'|'warn'|'skip') drives
 *     what happens when the check throws.
 *   - Exit codes are mapped via resolveExitCode():
 *       0 — all PASS, no WARNs
 *       1 — WARN only (no FAILs)
 *       2 — at least one FAIL
 *       3 — internal runner error
 */

// jest.mock() is hoisted above all imports, so the factory MUST not reference
// anything that hasn't been initialized yet. Shared state lives on globalThis.
if (!globalThis.__doctorA3MockState__) {
  globalThis.__doctorA3MockState__ = {
    checks: [],
    applyFixesImpl: async () => null,
  };
}

jest.mock('../../.sinapse-ai/core/doctor/checks', () => ({
  loadChecks: jest.fn(() => globalThis.__doctorA3MockState__.checks),
}));

jest.mock('../../.sinapse-ai/core/doctor/fix-handler', () => ({
  applyFixes: jest.fn(async (...args) => globalThis.__doctorA3MockState__.applyFixesImpl(...args)),
}));

jest.mock('../../.sinapse-ai/core/doctor/formatters/text', () => ({
  formatText: jest.fn((output) => `text:${output.summary.pass}/${output.summary.warn}/${output.summary.fail}`),
}));

jest.mock('../../.sinapse-ai/core/doctor/formatters/json', () => ({
  formatJson: jest.fn((output) => JSON.stringify({ s: output.summary, e: output.internalError })),
}));

const path = require('path');

const {
  runDoctorChecks,
  resolveExitCode,
  resolveOnError,
  DOCTOR_VERSION,
} = require('../../.sinapse-ai/core/doctor');

// runDoctorChecks() short-circuits (Story 10.42) when the projectRoot has no
// `<projectRoot>/.sinapse-ai/` marker, returning the friendly NOT_INSTALLED
// payload (empty checks, exit code 4) BEFORE any check runs. These tests
// exercise the exception-classification + exit-code logic that lives *behind*
// that gate, so they must point projectRoot at an installed project. The repo
// root itself is an installed project (it ships `.sinapse-ai/`), so we use it.
const INSTALLED_ROOT = path.resolve(__dirname, '..', '..');

function makeCheck({ name, status, onError, throws }) {
  return {
    name,
    onError,
    run: jest.fn(async () => {
      if (throws) {
        throw throws instanceof Error ? throws : new Error(String(throws));
      }
      return {
        check: name,
        status,
        message: `${name} returned ${status}`,
        fixCommand: null,
      };
    }),
  };
}

function setChecks(checks) {
  globalThis.__doctorA3MockState__.checks = checks;
}

describe('Story A.3 — resolveOnError()', () => {
  it('returns declared value when valid', () => {
    expect(resolveOnError({ onError: 'fail' })).toBe('fail');
    expect(resolveOnError({ onError: 'warn' })).toBe('warn');
    expect(resolveOnError({ onError: 'skip' })).toBe('skip');
  });

  it('falls back to fail when undefined', () => {
    expect(resolveOnError({})).toBe('fail');
    expect(resolveOnError(null)).toBe('fail');
    expect(resolveOnError(undefined)).toBe('fail');
  });

  it('falls back to fail when invalid', () => {
    expect(resolveOnError({ onError: 'boom' })).toBe('fail');
    expect(resolveOnError({ onError: 123 })).toBe('fail');
  });
});

describe('Story A.3 — exception classification', () => {
  beforeEach(() => {
    setChecks([]);
  });

  it('onError: fail → thrown exception becomes FAIL', async () => {
    setChecks([makeCheck({ name: 'blocker', onError: 'fail', throws: new Error('ENOENT') })]);
    const result = await runDoctorChecks({ projectRoot: INSTALLED_ROOT });
    expect(result.data.summary).toEqual({ pass: 0, warn: 0, fail: 1, info: 0 });
    expect(result.data.checks).toHaveLength(1);
    expect(result.data.checks[0].status).toBe('FAIL');
    expect(result.data.checks[0].check).toBe('blocker');
    expect(result.data.checks[0].message).toContain('ENOENT');
  });

  it('onError: warn → thrown exception becomes WARN (not FAIL)', async () => {
    setChecks([makeCheck({ name: 'optional', onError: 'warn', throws: new Error('missing dir') })]);
    const result = await runDoctorChecks({ projectRoot: INSTALLED_ROOT });
    expect(result.data.summary).toEqual({ pass: 0, warn: 1, fail: 0, info: 0 });
    expect(result.data.checks[0].status).toBe('WARN');
    expect(result.data.checks[0].message).toContain('missing dir');
  });

  it('onError: skip → thrown exception excludes check from results', async () => {
    setChecks([
      makeCheck({ name: 'alpha', status: 'PASS' }),
      makeCheck({ name: 'skipped', onError: 'skip', throws: new Error('noop') }),
      makeCheck({ name: 'omega', status: 'PASS' }),
    ]);
    const result = await runDoctorChecks({ projectRoot: INSTALLED_ROOT });
    expect(result.data.checks).toHaveLength(2);
    expect(result.data.checks.map((c) => c.check)).toEqual(['alpha', 'omega']);
    expect(result.data.summary).toEqual({ pass: 2, warn: 0, fail: 0, info: 0 });
  });

  it('undeclared onError defaults to fail', async () => {
    setChecks([makeCheck({ name: 'legacy', throws: new Error('oops') })]);
    const result = await runDoctorChecks({ projectRoot: INSTALLED_ROOT });
    expect(result.data.checks[0].status).toBe('FAIL');
  });

  it('non-throwing checks keep their returned status regardless of onError', async () => {
    setChecks([
      makeCheck({ name: 'a', onError: 'warn', status: 'PASS' }),
      makeCheck({ name: 'b', onError: 'warn', status: 'WARN' }),
      makeCheck({ name: 'c', onError: 'warn', status: 'FAIL' }),
    ]);
    const result = await runDoctorChecks({ projectRoot: INSTALLED_ROOT });
    expect(result.data.summary).toEqual({ pass: 1, warn: 1, fail: 1, info: 0 });
  });
});

describe('Story A.3 — exit code mapping', () => {
  beforeEach(() => {
    setChecks([]);
  });

  it('exit 0 — all PASS, no WARN', async () => {
    setChecks([
      makeCheck({ name: 'a', status: 'PASS' }),
      makeCheck({ name: 'b', status: 'PASS' }),
    ]);
    const result = await runDoctorChecks({ projectRoot: INSTALLED_ROOT });
    expect(resolveExitCode(result)).toBe(0);
  });

  it('exit 1 — WARN only (no FAILs)', async () => {
    setChecks([
      makeCheck({ name: 'a', status: 'PASS' }),
      makeCheck({ name: 'b', status: 'WARN' }),
    ]);
    const result = await runDoctorChecks({ projectRoot: INSTALLED_ROOT });
    expect(resolveExitCode(result)).toBe(1);
  });

  it('exit 2 — at least one FAIL', async () => {
    setChecks([
      makeCheck({ name: 'a', status: 'PASS' }),
      makeCheck({ name: 'b', status: 'WARN' }),
      makeCheck({ name: 'c', status: 'FAIL' }),
    ]);
    const result = await runDoctorChecks({ projectRoot: INSTALLED_ROOT });
    expect(resolveExitCode(result)).toBe(2);
  });

  it('exit 3 — internal runner error', async () => {
    // Force the runner itself to crash by throwing inside applyFixes
    // via a check that triggers the fix pipeline.
    const { loadChecks } = require('../../.sinapse-ai/core/doctor/checks');
    loadChecks.mockImplementationOnce(() => {
      throw new Error('boom: loadChecks crashed');
    });
    const result = await runDoctorChecks({ projectRoot: INSTALLED_ROOT });
    expect(result.data.internalError).toBeTruthy();
    expect(result.data.internalError.message).toContain('boom');
    expect(resolveExitCode(result)).toBe(3);
  });

  it('exit 3 — null/undefined result', () => {
    expect(resolveExitCode(null)).toBe(3);
    expect(resolveExitCode(undefined)).toBe(3);
    expect(resolveExitCode({})).toBe(3);
    expect(resolveExitCode({ data: null })).toBe(3);
  });

  it('exit 2 takes precedence over exit 1 when both FAIL and WARN present', () => {
    const result = {
      data: {
        summary: { pass: 1, warn: 2, fail: 1, info: 0 },
        internalError: null,
      },
    };
    expect(resolveExitCode(result)).toBe(2);
  });
});

describe('Story A.3 — fresh install simulation', () => {
  it('all fresh-install-WARN checks throw → exit code 1 (not 2)', async () => {
    // Simulate: node-version/npm-packages/settings-json PASS (blocking infra ok)
    // entity-registry/agent-memory/git-hooks throw (fresh install)
    setChecks([
      makeCheck({ name: 'node-version', onError: 'fail', status: 'PASS' }),
      makeCheck({ name: 'npm-packages', onError: 'fail', status: 'PASS' }),
      makeCheck({ name: 'settings-json', onError: 'fail', status: 'PASS' }),
      makeCheck({ name: 'entity-registry', onError: 'warn', throws: new Error('ENOENT') }),
      makeCheck({ name: 'agent-memory', onError: 'warn', throws: new Error('ENOENT') }),
      makeCheck({ name: 'git-hooks', onError: 'warn', throws: new Error('ENOENT') }),
    ]);
    const result = await runDoctorChecks({ projectRoot: INSTALLED_ROOT });
    expect(result.data.summary.fail).toBe(0);
    expect(result.data.summary.warn).toBe(3);
    expect(result.data.summary.pass).toBe(3);
    expect(resolveExitCode(result)).toBe(1);
  });

  it('clean machine with all PASS → exit code 0', async () => {
    setChecks([
      makeCheck({ name: 'node-version', onError: 'fail', status: 'PASS' }),
      makeCheck({ name: 'npm-packages', onError: 'fail', status: 'PASS' }),
      makeCheck({ name: 'settings-json', onError: 'fail', status: 'PASS' }),
      makeCheck({ name: 'entity-registry', onError: 'warn', status: 'PASS' }),
    ]);
    const result = await runDoctorChecks({ projectRoot: INSTALLED_ROOT });
    expect(resolveExitCode(result)).toBe(0);
  });

  it('blocking check throws → exit code 2', async () => {
    setChecks([
      makeCheck({ name: 'node-version', onError: 'fail', throws: new Error('exec failed') }),
      makeCheck({ name: 'entity-registry', onError: 'warn', throws: new Error('ENOENT') }),
    ]);
    const result = await runDoctorChecks({ projectRoot: INSTALLED_ROOT });
    expect(result.data.summary).toEqual({ pass: 0, warn: 1, fail: 1, info: 0 });
    expect(resolveExitCode(result)).toBe(2);
  });
});

describe('Story A.3 — module shape', () => {
  it('exports runDoctorChecks, resolveExitCode, resolveOnError, DOCTOR_VERSION', () => {
    expect(typeof runDoctorChecks).toBe('function');
    expect(typeof resolveExitCode).toBe('function');
    expect(typeof resolveOnError).toBe('function');
    expect(typeof DOCTOR_VERSION).toBe('string');
    expect(DOCTOR_VERSION).toMatch(/^\d+\.\d+\.\d+$/);
  });
});
