/**
 * Story onda2-p9 (AC3) — uninstall removes the .synapse/ context-engine runtime
 * from BOTH uninstall binaries:
 *
 *   1. bin/sinapse.js   → runUninstall  (project uninstall; .synapse grouped
 *      with project data: removed by default, preserved under --keep-data)
 *   2. bin/cli.js       → cmdUninstall  (bin/commands/uninstall.js; removes
 *      the project-level .synapse/ at cwd alongside the global items)
 *
 * Both are exercised as REAL child processes with HOME/USERPROFILE redirected
 * to a throwaway dir — the real ~/.claude and ~/.sinapse are NEVER touched.
 */

'use strict';

const { spawnSync } = require('child_process');
const fs = require('fs');
const os = require('os');
const path = require('path');

jest.setTimeout(120000);

const PROJECT_ROOT = path.resolve(__dirname, '..', '..');
const SINAPSE_BIN = path.join(PROJECT_ROOT, 'bin', 'sinapse.js');
const CLI_BIN = path.join(PROJECT_ROOT, 'bin', 'cli.js');

/** Build a fake installed project (enough structure for uninstall to act on). */
function makeFakeProject() {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'sinapse-p9-uninst-'));
  fs.mkdirSync(path.join(dir, '.sinapse-ai'), { recursive: true });
  fs.writeFileSync(path.join(dir, '.sinapse-ai', 'core-config.yaml'), 'project:\n  type: TEST\n');
  fs.mkdirSync(path.join(dir, '.sinapse'), { recursive: true });
  fs.writeFileSync(path.join(dir, '.sinapse', 'data.txt'), 'keepable');
  fs.mkdirSync(path.join(dir, '.synapse', 'sessions'), { recursive: true });
  fs.mkdirSync(path.join(dir, '.synapse', 'metrics'), { recursive: true });
  fs.writeFileSync(path.join(dir, '.synapse', 'constitution'), 'CONSTITUTION_RULE_ART1_0=Test (NON-NEGOTIABLE)\n');
  return dir;
}

/** Throwaway HOME so no uninstaller ever touches the real user profile. */
function makeFakeHome() {
  return fs.mkdtempSync(path.join(os.tmpdir(), 'sinapse-p9-home-'));
}

function runBin(bin, args, cwd, home) {
  return spawnSync(process.execPath, [bin, ...args], {
    cwd,
    encoding: 'utf8',
    timeout: 90000,
    windowsHide: true,
    env: {
      ...process.env,
      HOME: home,
      USERPROFILE: home,
    },
  });
}

describe('onda2-p9 AC3 — bin/sinapse.js uninstall removes .synapse/', () => {
  test('default uninstall removes .synapse/ along with project data', () => {
    const project = makeFakeProject();
    const home = makeFakeHome();

    const res = runBin(SINAPSE_BIN, ['uninstall', '--force', '--quiet'], project, home);

    expect(res.status).toBe(0);
    expect(fs.existsSync(path.join(project, '.sinapse-ai'))).toBe(false);
    expect(fs.existsSync(path.join(project, '.sinapse'))).toBe(false);
    expect(fs.existsSync(path.join(project, '.synapse'))).toBe(false);
  });

  test('--keep-data preserves .synapse/ (parity with .sinapse project data)', () => {
    const project = makeFakeProject();
    const home = makeFakeHome();

    const res = runBin(SINAPSE_BIN, ['uninstall', '--force', '--quiet', '--keep-data'], project, home);

    expect(res.status).toBe(0);
    expect(fs.existsSync(path.join(project, '.sinapse-ai'))).toBe(false);
    expect(fs.existsSync(path.join(project, '.sinapse'))).toBe(true);
    expect(fs.existsSync(path.join(project, '.synapse'))).toBe(true);
  });

  test('dry-run lists .synapse/ but removes nothing', () => {
    const project = makeFakeProject();
    const home = makeFakeHome();

    const res = runBin(SINAPSE_BIN, ['uninstall', '--dry-run'], project, home);

    expect(res.status).toBe(0);
    expect(`${res.stdout}${res.stderr}`).toContain('.synapse');
    expect(fs.existsSync(path.join(project, '.synapse'))).toBe(true);
    expect(fs.existsSync(path.join(project, '.sinapse-ai'))).toBe(true);
  });
});

describe('onda2-p9 AC3 — bin/cli.js uninstall removes project .synapse/ at cwd', () => {
  test('cmdUninstall --yes removes ./.synapse/ (real ~ untouched via redirect)', () => {
    const project = makeFakeProject();
    const home = makeFakeHome();
    // Seed a fake global install in the redirected home so the global part of
    // the uninstall has something real to act on too.
    fs.mkdirSync(path.join(home, '.sinapse'), { recursive: true });
    fs.writeFileSync(path.join(home, '.sinapse', 'metadata.json'), '{"version":"0.0.0"}');

    const res = runBin(CLI_BIN, ['uninstall', '--yes'], project, home);

    expect(res.status).toBe(0);
    expect(fs.existsSync(path.join(project, '.synapse'))).toBe(false);
    // Global side ran against the REDIRECTED home
    expect(fs.existsSync(path.join(home, '.sinapse'))).toBe(false);
    // cmdUninstall is the global uninstaller: project .sinapse-ai/.sinapse are
    // out of its scope (runUninstall owns those) — only .synapse is added here.
    expect(fs.existsSync(path.join(project, '.sinapse-ai'))).toBe(true);
  });

  test('reports "(not found)" gracefully when ./.synapse/ is absent', () => {
    const project = fs.mkdtempSync(path.join(os.tmpdir(), 'sinapse-p9-nosyn-'));
    const home = makeFakeHome();

    const res = runBin(CLI_BIN, ['uninstall', '--yes'], project, home);

    expect(res.status).toBe(0);
    expect(`${res.stdout}${res.stderr}`).toContain('.synapse');
  });
});
