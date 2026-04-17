/**
 * Tests for bin/postinstall.js — Story A.1
 */

'use strict';

const fs = require('fs');
const os = require('os');
const path = require('path');

// Mock child_process BEFORE requiring the module under test
jest.mock('child_process', () => ({
  spawnSync: jest.fn(),
}));
const { spawnSync } = require('child_process');

const postinstall = require('../../bin/postinstall');

// Helper: clean env vars that affect shouldSkip() behavior
const CI_VARS = [
  'SINAPSE_SKIP_POSTINSTALL',
  'SINAPSE_FORCE_POSTINSTALL',
  'CI',
  'GITHUB_ACTIONS',
  'GITLAB_CI',
  'CIRCLECI',
  'TRAVIS',
  'JENKINS_URL',
];

function snapshotEnv() {
  const snap = {};
  for (const k of CI_VARS) snap[k] = process.env[k];
  return snap;
}
function restoreEnv(snap) {
  for (const k of CI_VARS) {
    if (snap[k] === undefined) delete process.env[k];
    else process.env[k] = snap[k];
  }
}

describe('postinstall — shouldSkip()', () => {
  let envSnap;
  beforeEach(() => {
    envSnap = snapshotEnv();
    for (const k of CI_VARS) delete process.env[k];
  });
  afterEach(() => restoreEnv(envSnap));

  test('returns {skip:true} when SINAPSE_SKIP_POSTINSTALL=1', () => {
    process.env.SINAPSE_SKIP_POSTINSTALL = '1';
    expect(postinstall.shouldSkip()).toEqual({
      skip: true,
      reason: 'SINAPSE_SKIP_POSTINSTALL=1',
    });
  });

  test('returns {skip:false} in a normal local shell', () => {
    expect(postinstall.shouldSkip()).toEqual({ skip: false });
  });

  test('auto-skips on CI=true', () => {
    process.env.CI = 'true';
    const result = postinstall.shouldSkip();
    expect(result.skip).toBe(true);
    expect(result.reason).toMatch(/CI detected/);
  });

  test('auto-skips on GITHUB_ACTIONS', () => {
    process.env.GITHUB_ACTIONS = 'true';
    const result = postinstall.shouldSkip();
    expect(result.skip).toBe(true);
    expect(result.reason).toMatch(/GITHUB_ACTIONS/);
  });

  test('SINAPSE_FORCE_POSTINSTALL overrides CI auto-skip', () => {
    process.env.CI = 'true';
    process.env.SINAPSE_FORCE_POSTINSTALL = '1';
    expect(postinstall.shouldSkip()).toEqual({ skip: false });
  });

  test('SINAPSE_SKIP_POSTINSTALL wins over SINAPSE_FORCE_POSTINSTALL', () => {
    process.env.SINAPSE_SKIP_POSTINSTALL = '1';
    process.env.SINAPSE_FORCE_POSTINSTALL = '1';
    const result = postinstall.shouldSkip();
    expect(result.skip).toBe(true);
    expect(result.reason).toBe('SINAPSE_SKIP_POSTINSTALL=1');
  });
});

describe('postinstall — isValidInstallRoot()', () => {
  test('returns true for the current repo (has .sinapse-ai/)', () => {
    expect(postinstall.isValidInstallRoot()).toBe(true);
  });
});

describe('postinstall — stepSyncIde()', () => {
  beforeEach(() => {
    spawnSync.mockReset();
  });

  test('calls npm run sync:ide with --ide claude-code', () => {
    spawnSync.mockReturnValue({ status: 0, error: null });
    const result = postinstall.stepSyncIde();
    expect(spawnSync).toHaveBeenCalledTimes(1);
    const [cmd, args] = spawnSync.mock.calls[0];
    expect(cmd).toBe('npm');
    expect(args).toEqual(expect.arrayContaining(['run', 'sync:ide', '--ide', 'claude-code']));
    expect(result).toEqual({ ok: true, critical: false });
  });

  test('reports non-critical warn when spawn errors (rc.7: degrade gracefully)', () => {
    spawnSync.mockReturnValue({ status: null, error: new Error('ENOENT') });
    const result = postinstall.stepSyncIde();
    expect(result).toEqual({ ok: false, critical: false });
  });

  test('reports non-critical warn on non-zero exit (rc.7: never kill npm install)', () => {
    spawnSync.mockReturnValue({ status: 1, error: null });
    const result = postinstall.stepSyncIde();
    expect(result).toEqual({ ok: false, critical: false });
  });
});

describe('postinstall — stepCreateRuntimeDirs()', () => {
  test('creates .sinapse/handoffs and .sinapse/scratchpad (idempotent)', () => {
    // First run creates; second run is a no-op. Both must succeed.
    const r1 = postinstall.stepCreateRuntimeDirs();
    const r2 = postinstall.stepCreateRuntimeDirs();
    expect(r1.critical).toBe(false);
    expect(r2.critical).toBe(false);
    const repoRoot = path.resolve(__dirname, '..', '..');
    expect(fs.existsSync(path.join(repoRoot, '.sinapse', 'handoffs'))).toBe(true);
    expect(fs.existsSync(path.join(repoRoot, '.sinapse', 'scratchpad'))).toBe(true);
  });
});

describe('postinstall — stepDoctor()', () => {
  beforeEach(() => {
    spawnSync.mockReset();
  });

  test('returns ok when doctor exits 0 (PASS)', () => {
    spawnSync.mockReturnValue({ status: 0, error: null });
    const result = postinstall.stepDoctor();
    expect(result).toEqual({ ok: true, critical: false });
  });

  test('returns non-critical warn when doctor exits 1 (WARN)', () => {
    spawnSync.mockReturnValue({ status: 1, error: null });
    const result = postinstall.stepDoctor();
    expect(result).toEqual({ ok: false, critical: false });
  });

  test('returns critical when doctor exits 2 (FAIL)', () => {
    spawnSync.mockReturnValue({ status: 2, error: null });
    const result = postinstall.stepDoctor();
    expect(result).toEqual({ ok: false, critical: true });
  });

  test('non-critical when doctor fails to spawn', () => {
    spawnSync.mockReturnValue({ status: null, error: new Error('fail') });
    const result = postinstall.stepDoctor();
    expect(result.critical).toBe(false);
  });
});

describe('postinstall — main() integration', () => {
  let envSnap;
  let tmpHome;
  let homedirSpy;
  let stdoutSpy;
  let stderrSpy;
  beforeEach(() => {
    envSnap = snapshotEnv();
    for (const k of CI_VARS) delete process.env[k];
    spawnSync.mockReset();
    // Redirect homedir so first-run flag creation does not touch the dev's real ~/.sinapse.
    tmpHome = fs.mkdtempSync(path.join(os.tmpdir(), 'sinapse-postinstall-main-'));
    homedirSpy = jest.spyOn(os, 'homedir').mockReturnValue(tmpHome);
    // Silence the minimalist summary during these tests.
    stdoutSpy = jest.spyOn(process.stdout, 'write').mockImplementation(() => true);
    stderrSpy = jest.spyOn(process.stderr, 'write').mockImplementation(() => true);
  });
  afterEach(() => {
    restoreEnv(envSnap);
    if (homedirSpy) homedirSpy.mockRestore();
    try { fs.rmSync(tmpHome, { recursive: true, force: true }); } catch { /* ignore */ }
    if (stdoutSpy) stdoutSpy.mockRestore();
    if (stderrSpy) stderrSpy.mockRestore();
  });

  test('returns 0 immediately when SINAPSE_SKIP_POSTINSTALL=1', () => {
    process.env.SINAPSE_SKIP_POSTINSTALL = '1';
    const code = postinstall.main();
    expect(code).toBe(0);
    expect(spawnSync).not.toHaveBeenCalled();
  });

  test('returns 0 on full success path', () => {
    // sync:ide OK, doctor OK
    spawnSync.mockReturnValue({ status: 0, error: null });
    const code = postinstall.main();
    expect(code).toBe(0);
    // Should have called: sync:ide + doctor = 2 spawns
    expect(spawnSync).toHaveBeenCalledTimes(2);
  });

  test('returns 0 when sync:ide fails (rc.7: degraded gracefully, never kills npm install)', () => {
    spawnSync
      .mockReturnValueOnce({ status: 1, error: null })  // sync:ide fails (now non-critical)
      .mockReturnValueOnce({ status: 0, error: null }); // doctor OK
    const code = postinstall.main();
    expect(code).toBe(0);
  });

  test('returns 2 when doctor exits 2 (FAIL)', () => {
    spawnSync
      .mockReturnValueOnce({ status: 0, error: null }) // sync:ide
      .mockReturnValueOnce({ status: 2, error: null }); // doctor FAIL
    const code = postinstall.main();
    expect(code).toBe(2);
  });

  test('returns 0 when doctor exits 1 (WARN only) — Story 10.39: never kill npm install', () => {
    spawnSync
      .mockReturnValueOnce({ status: 0, error: null }) // sync:ide
      .mockReturnValueOnce({ status: 1, error: null }); // doctor WARN
    const code = postinstall.main();
    expect(code).toBe(0);
  });

});

// ─── Story B.1: Minimalist Install Output ───────────────────────────────────

describe('postinstall — detectFlags() (Story B.1)', () => {
  test('default (no flags) returns all false', () => {
    expect(postinstall.detectFlags([], {})).toEqual({ verbose: false, json: false, quiet: false });
  });

  test('--verbose sets verbose=true', () => {
    expect(postinstall.detectFlags(['--verbose'], {}).verbose).toBe(true);
    expect(postinstall.detectFlags(['-v'], {}).verbose).toBe(true);
  });

  test('--json sets json=true', () => {
    expect(postinstall.detectFlags(['--json'], {}).json).toBe(true);
  });

  test('--quiet sets quiet=true', () => {
    expect(postinstall.detectFlags(['--quiet'], {}).quiet).toBe(true);
    expect(postinstall.detectFlags(['-q'], {}).quiet).toBe(true);
  });

  test('npm_config_loglevel=verbose promotes to verbose', () => {
    expect(postinstall.detectFlags([], { npm_config_loglevel: 'verbose' }).verbose).toBe(true);
    expect(postinstall.detectFlags([], { npm_config_loglevel: 'silly' }).verbose).toBe(true);
    expect(postinstall.detectFlags([], { npm_config_loglevel: 'warn' }).verbose).toBe(false);
  });

  test('SINAPSE_VERBOSE=1 / SINAPSE_JSON=1 / SINAPSE_QUIET=1 env vars opt in', () => {
    expect(postinstall.detectFlags([], { SINAPSE_VERBOSE: '1' }).verbose).toBe(true);
    expect(postinstall.detectFlags([], { SINAPSE_JSON: '1' }).json).toBe(true);
    expect(postinstall.detectFlags([], { SINAPSE_QUIET: '1' }).quiet).toBe(true);
  });
});

describe('postinstall — dynamic counts (Story B.1)', () => {
  test('countAgents returns real count from .sinapse-ai/development/agents/', () => {
    const count = postinstall.countAgents();
    // There are 12 agent .md files in this repo (developer, quality-gate, architect, etc.)
    expect(count).toBeGreaterThanOrEqual(10);
    expect(count).toBeLessThanOrEqual(30); // sanity ceiling
  });

  test('countSquads returns a non-negative integer', () => {
    const count = postinstall.countSquads();
    expect(Number.isInteger(count)).toBe(true);
    expect(count).toBeGreaterThanOrEqual(0);
  });

  test('readVersion returns package.json version', () => {
    const version = postinstall.readVersion();
    expect(typeof version).toBe('string');
    expect(version).toMatch(/^\d+\.\d+\.\d+/); // semver-ish
  });
});

describe('postinstall — renderFinalSummary() (Story B.1)', () => {
  let writeSpy;
  let captured;
  beforeEach(() => {
    captured = [];
    writeSpy = jest.spyOn(process.stdout, 'write').mockImplementation((chunk) => {
      captured.push(String(chunk));
      return true;
    });
    // Default mode (not verbose, not json, not quiet)
    postinstall._setFlags({ verbose: false, json: false, quiet: false });
  });
  afterEach(() => {
    writeSpy.mockRestore();
  });

  function stripAnsi(s) {
    // eslint-disable-next-line no-control-regex
    return s.replace(/\x1b\[[0-9;]*m/g, '');
  }

  test('AC 1 + AC 7: default mode prints ≤ 8 lines with spec layout', () => {
    const result = postinstall.renderFinalSummary({ firstRun: false });
    expect(result.lineCount).toBeLessThanOrEqual(8);
    expect(result.lineCount).toBeGreaterThanOrEqual(6);

    const text = stripAnsi(captured.join(''));
    const lines = text.split('\n').filter((_, i, arr) => i < arr.length - 1); // drop trailing empty

    // Line 1: "SINAPSE {version} instalado ✓"
    expect(lines[0]).toMatch(/^SINAPSE .+ instalado ✓$/);
    // Line 2: "{N} agents · {M} squads prontos" (or singular variants)
    expect(lines[1]).toMatch(/^\d+ agents? · \d+ squads? (prontos|pronto)$/);
    // Line 3: blank
    expect(lines[2]).toBe('');
    // Line 4: "Teste:   sinapse doctor"
    expect(lines[3]).toMatch(/^Teste:\s+sinapse doctor$/);
    // Line 5: "Começar: @sinapse no Claude Code"
    expect(lines[4]).toMatch(/^Começar:\s+@sinapse no Claude Code$/);
    // Line 6: blank
    expect(lines[5]).toBe('');
    // Line 7: "Docs:    https://sinapse.club"
    expect(lines[6]).toMatch(/^Docs:\s+https:\/\/sinapse\.club$/);
  });

  test('AC 5: firstRun=true adds welcome line as first line, still ≤ 8 lines', () => {
    const result = postinstall.renderFinalSummary({ firstRun: true });
    expect(result.lineCount).toBeLessThanOrEqual(8);

    const text = stripAnsi(captured.join(''));
    expect(text).toContain('Bem-vindo ao SINAPSE!');
    // Welcome must be the first content line.
    const firstLine = text.split('\n')[0];
    expect(firstLine).toMatch(/^Bem-vindo ao SINAPSE!/);
  });

  test('AC 5: firstRun=false does NOT show welcome line', () => {
    postinstall.renderFinalSummary({ firstRun: false });
    const text = stripAnsi(captured.join(''));
    expect(text).not.toContain('Bem-vindo ao SINAPSE!');
  });

  test('AC 6: copy is Portuguese and non-technical (no paths, no agent IDs)', () => {
    postinstall.renderFinalSummary({ firstRun: false });
    const text = stripAnsi(captured.join(''));
    expect(text).toContain('instalado');
    expect(text).toMatch(/pronto/); // "prontos" or "pronto"
    // No filesystem paths, no agent IDs like "@developer".
    // Strip the allowed docs URL first, then assert no other URL-like content remains.
    const withoutDocs = text.replace('https://sinapse.club', '');
    expect(withoutDocs).not.toMatch(/https?:\/\//);
    expect(text).not.toContain('node_modules');
    expect(text).not.toContain('.sinapse-ai/');
    expect(text).not.toContain('@developer'); // user sees generic "@sinapse" CTA
  });

  test('AC 3: --json mode produces no stdout until flushJson() and emits structured object', () => {
    postinstall._setFlags({ verbose: false, json: true, quiet: false });
    const result = postinstall.renderFinalSummary({ firstRun: true });
    // No human lines in JSON mode
    expect(result.lineCount).toBe(0);
    expect(captured.join('')).toBe('');

    // Flush emits the structured object
    postinstall.flushJson();
    const out = captured.join('');
    expect(out).toBeTruthy();
    const parsed = JSON.parse(out.trim());
    expect(parsed).toHaveProperty('status');
    expect(parsed).toHaveProperty('version');
    expect(parsed).toHaveProperty('agents');
    expect(parsed).toHaveProperty('squads');
    expect(parsed).toHaveProperty('warnings');
    expect(parsed).toHaveProperty('errors');
    expect(typeof parsed.agents).toBe('number');
    expect(typeof parsed.squads).toBe('number');
    expect(Array.isArray(parsed.warnings)).toBe(true);
    expect(Array.isArray(parsed.errors)).toBe(true);
    expect(parsed.firstRun).toBe(true);
  });

  test('AC 2: --quiet mode produces no summary output', () => {
    postinstall._setFlags({ verbose: false, json: false, quiet: true });
    const result = postinstall.renderFinalSummary({ firstRun: false });
    expect(result.lineCount).toBe(0);
    expect(captured.join('')).toBe('');
  });
});

// ─── Story C.1: Partial install message ─────────────────────────────────────

describe('postinstall — partial install message (Story C.1 AC 3)', () => {
  let envSnap;
  let tmpHome;
  let homedirSpy;
  let stdoutChunks;
  let stdoutSpy;
  let stderrSpy;

  function stripAnsi(s) {
    // eslint-disable-next-line no-control-regex
    return s.replace(/\x1b\[[0-9;]*m/g, '');
  }

  beforeEach(() => {
    envSnap = snapshotEnv();
    for (const k of CI_VARS) delete process.env[k];
    spawnSync.mockReset();
    tmpHome = fs.mkdtempSync(path.join(os.tmpdir(), 'sinapse-postinstall-c1-'));
    homedirSpy = jest.spyOn(os, 'homedir').mockReturnValue(tmpHome);
    stdoutChunks = [];
    stdoutSpy = jest.spyOn(process.stdout, 'write').mockImplementation((chunk) => {
      stdoutChunks.push(String(chunk));
      return true;
    });
    stderrSpy = jest.spyOn(process.stderr, 'write').mockImplementation(() => true);
    // Reset flags to default so each test controls its own mode.
    postinstall._setFlags({ verbose: false, json: false, quiet: false });
  });

  afterEach(() => {
    restoreEnv(envSnap);
    if (homedirSpy) homedirSpy.mockRestore();
    if (stdoutSpy) stdoutSpy.mockRestore();
    if (stderrSpy) stderrSpy.mockRestore();
    try { fs.rmSync(tmpHome, { recursive: true, force: true }); } catch { /* ignore */ }
  });

  test('AC 3: renderPartialInstallMessage prints exact one-liner in default mode', () => {
    postinstall.renderPartialInstallMessage();
    const text = stripAnsi(stdoutChunks.join(''));
    expect(text).toContain("Instalação parcial — rode 'sinapse doctor' pra ver o quê");
    // Single line (one newline at end).
    expect(text.split('\n').filter((l) => l.length > 0).length).toBe(1);
  });

  test('AC 3: --quiet suppresses the partial install message', () => {
    postinstall._setFlags({ verbose: false, json: false, quiet: true });
    postinstall.renderPartialInstallMessage();
    expect(stdoutChunks.join('')).toBe('');
  });

  test('AC 3: --json suppresses the partial install message', () => {
    postinstall._setFlags({ verbose: false, json: true, quiet: false });
    postinstall.renderPartialInstallMessage();
    expect(stdoutChunks.join('')).toBe('');
  });

  test('AC 1 + AC 3: main() with doctor exit 1 returns 0 and prints partial message [Story 10.39]', () => {
    spawnSync
      .mockReturnValueOnce({ status: 0, error: null }) // sync:ide
      .mockReturnValueOnce({ status: 1, error: null }); // doctor WARN
    const code = postinstall.main();
    // Story 10.39: exit 0 even with WARN, to avoid killing `npm install`.
    // The user-visible message is still printed.
    expect(code).toBe(0);
    const text = stripAnsi(stdoutChunks.join(''));
    expect(text).toContain("Instalação parcial — rode 'sinapse doctor' pra ver o quê");
  });

  test('AC 1 + AC 3: main() with doctor exit 2 returns 2 and prints partial message', () => {
    spawnSync
      .mockReturnValueOnce({ status: 0, error: null }) // sync:ide
      .mockReturnValueOnce({ status: 2, error: null }); // doctor FAIL
    const code = postinstall.main();
    expect(code).toBe(2);
    const text = stripAnsi(stdoutChunks.join(''));
    expect(text).toContain("Instalação parcial — rode 'sinapse doctor' pra ver o quê");
  });

  test('AC 1: main() with all green returns 0 and does NOT print partial message', () => {
    spawnSync.mockReturnValue({ status: 0, error: null });
    const code = postinstall.main();
    expect(code).toBe(0);
    const text = stripAnsi(stdoutChunks.join(''));
    expect(text).not.toContain('Instalação parcial');
  });
});

describe('postinstall — first-run flag (Story B.1)', () => {
  let tmpHome;
  let homedirSpy;

  beforeEach(() => {
    tmpHome = fs.mkdtempSync(path.join(os.tmpdir(), 'sinapse-firstrun-'));
    // Mock os.homedir() directly so the postinstall module's sinapseHome() points
    // into the tmp dir. This avoids touching the dev's real ~/.sinapse/.first-run-done.
    homedirSpy = jest.spyOn(os, 'homedir').mockReturnValue(tmpHome);
  });
  afterEach(() => {
    if (homedirSpy) homedirSpy.mockRestore();
    try { fs.rmSync(tmpHome, { recursive: true, force: true }); } catch { /* ignore */ }
  });

  test('isFirstRun() is true on a clean HOME, false after markFirstRunDone()', () => {
    expect(postinstall.isFirstRun()).toBe(true);
    expect(postinstall.markFirstRunDone()).toBe(true);
    expect(postinstall.isFirstRun()).toBe(false);
    // Flag file should exist under tmpHome/.sinapse/.first-run-done
    expect(fs.existsSync(path.join(tmpHome, '.sinapse', '.first-run-done'))).toBe(true);
  });
});

