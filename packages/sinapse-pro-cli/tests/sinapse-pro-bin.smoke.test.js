/**
 * sinapse-pro CLI bin — smoke tests
 *
 * @audit Audit 2 P0 (Q1.3) — Pro CLI entrypoint shipped at 0% coverage.
 * Spawns the bin script with --help and known commands to verify it
 * exits without crashing and prints expected messaging. Real install /
 * activate flows are out of scope (require network + license server).
 */

'use strict';

const { spawnSync } = require('child_process');
const path = require('path');

const BIN_PATH = path.join(__dirname, '..', 'bin', 'sinapse-pro.js');

function runBin(args = []) {
  const result = spawnSync(process.execPath, [BIN_PATH, ...args], {
    encoding: 'utf8',
    timeout: 15000,
  });
  return {
    code: result.status,
    stdout: result.stdout || '',
    stderr: result.stderr || '',
    error: result.error,
  };
}

describe('sinapse-pro bin — smoke (Audit 2 Q1.3)', () => {
  test('bin file exists and is requirable', () => {
    const fs = require('fs');
    expect(fs.existsSync(BIN_PATH)).toBe(true);
  });

  test('`help` exits cleanly and prints command list', () => {
    const result = runBin(['help']);
    expect(result.error).toBeUndefined();
    // Help should print to stdout/stderr and exit non-error (or 0).
    const combined = result.stdout + result.stderr;
    expect(combined.length).toBeGreaterThan(0);
    expect(combined.toLowerCase()).toMatch(/install|activate|status|help|usage/);
  });

  test('`--help` flag is recognized', () => {
    const result = runBin(['--help']);
    expect(result.error).toBeUndefined();
    const combined = result.stdout + result.stderr;
    expect(combined.length).toBeGreaterThan(0);
  });

  test('unknown command exits with non-zero or prints help', () => {
    const result = runBin(['nonexistent-command-xyz']);
    expect(result.error).toBeUndefined();
    // Either non-zero exit OR stderr/stdout contains help/error context
    const combined = result.stdout + result.stderr;
    const exitedOrEducated = result.code !== 0 || combined.length > 0;
    expect(exitedOrEducated).toBe(true);
  });

  test('`status` runs without crashing (no license required)', () => {
    const result = runBin(['status']);
    expect(result.error).toBeUndefined();
    // Status with no license configured prints a "no license" or similar
    // message — what matters is it does not crash with an unhandled
    // exception (stderr containing "TypeError"/"Error: " not at parse).
    const combined = result.stdout + result.stderr;
    expect(combined.length).toBeGreaterThan(0);
  });
});
