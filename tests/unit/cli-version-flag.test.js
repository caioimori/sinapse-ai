/**
 * Story GA-1.2.1 — `npx sinapse-ai --version` canonical contract.
 *
 * Locks down the bin/cli.js version flag so it:
 *   1. Reads from package.json (single source of truth)
 *   2. Prints raw semver only (no banner, no decoration)
 *   3. Accepts --version, -v, and bare `version` as equivalent forms
 *   4. Exits 0 on success
 */

'use strict';

const path = require('path');
const { spawnSync } = require('child_process');

const CLI_PATH = path.join(__dirname, '../../bin/cli.js');
const PKG_VERSION = require('../../package.json').version;

function runCli(args) {
  return spawnSync(process.execPath, [CLI_PATH, ...args], {
    encoding: 'utf8',
    timeout: 10000,
  });
}

describe('bin/cli.js --version flag (Story GA-1.2.1)', () => {
  it('prints package.json version on --version', () => {
    const result = runCli(['--version']);
    expect(result.status).toBe(0);
    expect(result.stdout.trim()).toBe(PKG_VERSION);
  });

  it('accepts -v as alias for --version', () => {
    const result = runCli(['-v']);
    expect(result.status).toBe(0);
    expect(result.stdout.trim()).toBe(PKG_VERSION);
  });

  it('accepts bare `version` subcommand', () => {
    const result = runCli(['version']);
    expect(result.status).toBe(0);
    expect(result.stdout.trim()).toBe(PKG_VERSION);
  });

  it('output is exactly the semver — no banner, no decoration', () => {
    const result = runCli(['--version']);
    const out = result.stdout.trim();
    // Must match strict semver (e.g. 1.2.0, 1.2.0-rc.1, 1.2.0+build)
    expect(out).toMatch(/^\d+\.\d+\.\d+(-[\w.]+)?(\+[\w.]+)?$/);
    // Must not contain ANSI codes
    // eslint-disable-next-line no-control-regex
    expect(out).not.toMatch(/\[/);
    // Must not contain banner text
    expect(out).not.toContain('SINAPSE');
    expect(out).not.toContain('SNPS');
  });

  it('matches the version exposed via package.json import', () => {
    const result = runCli(['--version']);
    expect(result.stdout.trim()).toBe(PKG_VERSION);
  });
});
