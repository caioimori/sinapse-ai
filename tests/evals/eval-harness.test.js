'use strict';

/**
 * Eval Harness — CI wrapper (Onda 6.1)
 *
 * Puts the eval harness into the main jest suite so `npm test` (and therefore CI)
 * fails when:
 *   - any eval contract is structurally invalid (Camada-1 linter, exit != 0), or
 *   - any gate case stops producing the asserted GateResult (runner, exit != 0).
 *
 * This is the "Camada-1 linter in CI" gate from DoD-3: declaration -> measurement.
 * The runner/linter are spawned as child processes (they call process.exit), and
 * their exit codes are the assertion.
 */

const { execFileSync } = require('child_process');
const path = require('path');

const REPO_ROOT = path.resolve(__dirname, '..', '..');

function runNode(script, args = []) {
  try {
    const stdout = execFileSync('node', [path.join('scripts', script), ...args], {
      cwd: REPO_ROOT,
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'pipe'],
    });
    return { code: 0, stdout };
  } catch (err) {
    return {
      code: typeof err.status === 'number' ? err.status : 1,
      stdout: (err.stdout || '').toString(),
      stderr: (err.stderr || '').toString(),
    };
  }
}

describe('eval harness (Onda 6.1)', () => {
  test('Camada-1 linter: all eval contracts are structurally valid (exit 0)', () => {
    const r = runNode('validate-evals.js');
    expect(r.stdout).toMatch(/all eval contracts are structurally valid/);
    expect(r.code).toBe(0);
  }, 30000);

  test('runner: every gate case passes against the real gate (exit 0)', () => {
    const r = runNode('eval-runner.js');
    expect(r.stdout).toMatch(/"success": true/);
    expect(r.code).toBe(0);
  }, 30000);

  test('G5 meta-eval: the gate detects the known bad case (postgres mandated, sqlite used)', () => {
    const r = runNode('eval-runner.js', ['g5']);
    expect(r.stdout).toMatch(/postgres-constraint-violated-by-sqlite/);
    expect(r.code).toBe(0);
  }, 30000);
});
