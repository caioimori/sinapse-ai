/**
 * detectInteractiveMode + isFirstRun unit tests
 *
 * @story 10.46 — Setup wizard always prompts (TTY-detection bypass fix)
 *
 * Targets bin/cli.js:
 *   - detectInteractiveMode()  multi-signal interactive detection
 *   - isFirstRun()             empty-args first-run hint
 */

'use strict';

const path = require('path');
const fs = require('fs');
const os = require('os');

// Save originals so individual tests can stub freely.
const originalEnv = { ...process.env };
const originalArgv = [...process.argv];
const originalStdinIsTTY = process.stdin.isTTY;
const originalStdoutIsTTY = process.stdout.isTTY;

// Suppress noisy header() / logger output during require-time side-effects.
const originalStdoutWrite = process.stdout.write.bind(process.stdout);
const originalStderrWrite = process.stderr.write.bind(process.stderr);
process.stdout.write = () => true;
process.stderr.write = () => true;
const cli = require(path.join(__dirname, '..', '..', 'bin', 'cli.js'));
process.stdout.write = originalStdoutWrite;
process.stderr.write = originalStderrWrite;

const { detectInteractiveMode, isFirstRun, SINAPSE_HOME } = cli;

function setIsTTY(stream, value) {
  Object.defineProperty(stream, 'isTTY', {
    value,
    writable: true,
    configurable: true,
  });
}

function resetEnvAndStreams() {
  process.env = { ...originalEnv };
  delete process.env.CI;
  delete process.env.GITHUB_ACTIONS;
  delete process.env.npm_config_yes;
  process.argv = [...originalArgv];
  setIsTTY(process.stdin, originalStdinIsTTY);
  setIsTTY(process.stdout, originalStdoutIsTTY);
}

afterAll(() => {
  resetEnvAndStreams();
});

describe('detectInteractiveMode (Story 10.46)', () => {
  beforeEach(resetEnvAndStreams);

  test('returns true when stdin.isTTY is true', () => {
    setIsTTY(process.stdin, true);
    setIsTTY(process.stdout, false);
    expect(detectInteractiveMode(['node', 'cli.js'])).toBe(true);
  });

  test('returns true when only stdout.isTTY is true (Git Bash + Windows case)', () => {
    // The exact regression this story fixes: stdin.isTTY undefined but
    // stdout.isTTY truthy in Git Bash on Windows + Node 24.
    setIsTTY(process.stdin, undefined);
    setIsTTY(process.stdout, true);
    expect(detectInteractiveMode(['node', 'cli.js'])).toBe(true);
  });

  test('returns false when both stdin and stdout TTYs are falsy', () => {
    setIsTTY(process.stdin, false);
    setIsTTY(process.stdout, false);
    expect(detectInteractiveMode(['node', 'cli.js'])).toBe(false);
  });

  test('returns false when CI=true (preserves Story 10.33 silent default path)', () => {
    process.env.CI = 'true';
    setIsTTY(process.stdin, true);
    setIsTTY(process.stdout, true);
    expect(detectInteractiveMode(['node', 'cli.js'])).toBe(false);
  });

  test('returns false when GITHUB_ACTIONS=true', () => {
    process.env.GITHUB_ACTIONS = 'true';
    setIsTTY(process.stdin, true);
    expect(detectInteractiveMode(['node', 'cli.js'])).toBe(false);
  });

  test('returns false when --yes flag is present', () => {
    setIsTTY(process.stdin, true);
    expect(detectInteractiveMode(['node', 'cli.js', 'install', '--yes'])).toBe(false);
  });

  test('returns false when -y short flag is present', () => {
    setIsTTY(process.stdin, true);
    expect(detectInteractiveMode(['node', 'cli.js', 'install', '-y'])).toBe(false);
  });

  test('returns false when --non-interactive flag is present', () => {
    setIsTTY(process.stdin, true);
    expect(detectInteractiveMode(['node', 'cli.js', 'install', '--non-interactive'])).toBe(false);
  });

  test('returns false when npm_config_yes=true', () => {
    process.env.npm_config_yes = 'true';
    setIsTTY(process.stdin, true);
    expect(detectInteractiveMode(['node', 'cli.js'])).toBe(false);
  });

  test('--interactive override beats CI=true', () => {
    process.env.CI = 'true';
    setIsTTY(process.stdin, false);
    setIsTTY(process.stdout, false);
    expect(detectInteractiveMode(['node', 'cli.js', 'install', '--interactive'])).toBe(true);
  });

  test('--interactive override beats GITHUB_ACTIONS=true', () => {
    process.env.GITHUB_ACTIONS = 'true';
    setIsTTY(process.stdin, false);
    expect(detectInteractiveMode(['node', 'cli.js', '--interactive'])).toBe(true);
  });

  test('--non-interactive beats truthy TTYs', () => {
    setIsTTY(process.stdin, true);
    setIsTTY(process.stdout, true);
    expect(detectInteractiveMode(['node', 'cli.js', '--non-interactive'])).toBe(false);
  });

  test('flag precedence: --interactive > --non-interactive (early-return order)', () => {
    setIsTTY(process.stdin, false);
    expect(
      detectInteractiveMode(['node', 'cli.js', '--interactive', '--non-interactive']),
    ).toBe(true);
  });

  test('defaults to process.argv when no argv argument provided', () => {
    // Sanity: function uses process.argv by default.
    process.argv = ['node', 'cli.js', '--non-interactive'];
    setIsTTY(process.stdin, true);
    expect(detectInteractiveMode()).toBe(false);
  });
});

describe('isFirstRun (Story 10.46)', () => {
  let tempCwd;
  let originalCwd;
  let metadataPath;
  let metadataExisted;
  let metadataBackup;

  beforeAll(() => {
    metadataPath = path.join(SINAPSE_HOME, 'metadata.json');
    metadataExisted = fs.existsSync(metadataPath);
    if (metadataExisted) {
      metadataBackup = fs.readFileSync(metadataPath, 'utf8');
    }
  });

  beforeEach(() => {
    originalCwd = process.cwd();
    tempCwd = fs.mkdtempSync(path.join(os.tmpdir(), 'sinapse-firstrun-'));
    process.chdir(tempCwd);
    // Ensure the global metadata is absent during the test window.
    if (fs.existsSync(metadataPath)) {
      fs.rmSync(metadataPath);
    }
  });

  afterEach(() => {
    process.chdir(originalCwd);
    try {
      fs.rmSync(tempCwd, { recursive: true, force: true });
    } catch { /* ignore */ }
  });

  afterAll(() => {
    if (metadataExisted && metadataBackup !== undefined) {
      fs.mkdirSync(SINAPSE_HOME, { recursive: true });
      fs.writeFileSync(metadataPath, metadataBackup);
    }
  });

  test('returns true on a clean machine with empty cwd', () => {
    expect(isFirstRun()).toBe(true);
  });

  test('returns false when global metadata.json exists', () => {
    fs.mkdirSync(SINAPSE_HOME, { recursive: true });
    fs.writeFileSync(metadataPath, '{}');
    try {
      expect(isFirstRun()).toBe(false);
    } finally {
      fs.rmSync(metadataPath);
    }
  });

  test('returns false when cwd has a .sinapse-ai directory', () => {
    fs.mkdirSync(path.join(tempCwd, '.sinapse-ai'));
    expect(isFirstRun()).toBe(false);
  });
});
