/**
 * @story GA-1.6 — sinapse-vault-grounding hook (executable)
 *
 * Spawns the hook as a child process with a temp HOME so the config path
 * (`~/.claude/sinapse-ai-config.yaml`) is fully isolated from the developer's
 * real machine. Verifies fail-open and structured injection contracts.
 */

'use strict';

const fs = require('fs');
const os = require('os');
const path = require('path');
const { spawnSync } = require('child_process');
const yaml = require('js-yaml');

const HOOK = path.join(__dirname, '..', '..', '.sinapse-ai', 'hooks', 'sinapse-vault-grounding.cjs');
const VAULT_FIXTURE = path.join(__dirname, '..', 'fixtures', 'grounding', 'vault');

function makeTmpHome() {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'sinapse-vault-hook-'));
  fs.mkdirSync(path.join(dir, '.claude'), { recursive: true });
  return dir;
}

function writeConfig(home, cfg) {
  fs.writeFileSync(
    path.join(home, '.claude', 'sinapse-ai-config.yaml'),
    yaml.dump(cfg),
  );
}

function runHook(home, input) {
  const env = { ...process.env, HOME: home, USERPROFILE: home };
  const res = spawnSync(process.execPath, [HOOK], {
    input: JSON.stringify(input),
    env,
    encoding: 'utf8',
    timeout: 10000,
  });
  return res;
}

describe('sinapse-vault-grounding hook (executable)', () => {
  let home;

  beforeEach(() => { home = makeTmpHome(); });
  afterEach(() => {
    try { fs.rmSync(home, { recursive: true, force: true }); } catch { /* ignore */ }
  });

  test('exits 0 silently when config file is absent', () => {
    const res = runHook(home, { prompt: 'a long enough prompt to clear the threshold', session_id: 't' });
    expect(res.status).toBe(0);
    expect(res.stdout).toBe('');
  });

  test('no-op when section disabled', () => {
    writeConfig(home, {
      version: '1',
      grounding: { vault: { enabled: false, path: VAULT_FIXTURE } },
    });
    const res = runHook(home, { prompt: 'a long enough prompt for the hook', session_id: 't' });
    expect(res.status).toBe(0);
    expect(res.stdout).toBe('');
  });

  test('injects <vault-grounding> envelope when enabled and path valid', () => {
    writeConfig(home, {
      version: '1',
      grounding: {
        vault: { enabled: true, path: VAULT_FIXTURE, domains: ['sinapse', 'brand'] },
      },
    });
    const res = runHook(home, {
      prompt: 'work on the brand strategy for next quarter',
      session_id: 't',
    });
    expect(res.status).toBe(0);
    expect(res.stdout.length).toBeGreaterThan(0);
    const parsed = JSON.parse(res.stdout);
    expect(parsed.hookSpecificOutput.hookEventName).toBe('UserPromptSubmit');
    const ctx = parsed.hookSpecificOutput.additionalContext;
    expect(ctx).toContain('<vault-grounding');
    expect(ctx).toContain('domain="sinapse,brand"');
    expect(ctx).toContain('note-recent.md');
    expect(ctx).toContain('</vault-grounding>');
  });

  test('anti-double-injection when prompt already contains tag', () => {
    writeConfig(home, {
      version: '1',
      grounding: { vault: { enabled: true, path: VAULT_FIXTURE } },
    });
    const res = runHook(home, {
      prompt: '<vault-grounding>previously injected</vault-grounding> some text',
      session_id: 't',
    });
    expect(res.status).toBe(0);
    expect(res.stdout).toBe('');
  });

  test('no-op on too-short prompt', () => {
    writeConfig(home, {
      version: '1',
      grounding: { vault: { enabled: true, path: VAULT_FIXTURE } },
    });
    const res = runHook(home, { prompt: 'hi', session_id: 't' });
    expect(res.status).toBe(0);
    expect(res.stdout).toBe('');
  });

  test('fails open on malformed yaml', () => {
    fs.writeFileSync(
      path.join(home, '.claude', 'sinapse-ai-config.yaml'),
      '::: not yaml :::',
    );
    const res = runHook(home, { prompt: 'a perfectly normal prompt here please', session_id: 't' });
    expect(res.status).toBe(0);
    expect(res.stdout).toBe('');
  });
});

describe('sinapse-vault-grounding helpers', () => {
  // Helpers are pure — exercise them directly without spawning.
  const hookModule = require(HOOK);

  test('buildInjection respects MAX_INJECTION_SIZE cap', () => {
    const huge = 'x'.repeat(20000);
    const out = hookModule.buildInjection(
      { enabled: true, path: '/v', domains: [] },
      [{ name: 'big.md', content: huge }],
    );
    expect(out.length).toBeLessThanOrEqual(hookModule.MAX_INJECTION_SIZE);
    expect(out).toContain('</vault-grounding>');
  });

  test('pickNotes returns up to MAX_NOTES from a real dir', () => {
    const notes = hookModule.pickNotes(VAULT_FIXTURE);
    expect(notes.length).toBeGreaterThan(0);
    expect(notes.length).toBeLessThanOrEqual(5);
    expect(notes[0]).toHaveProperty('name');
    expect(notes[0]).toHaveProperty('content');
  });

  test('pickNotes returns empty array when path missing', () => {
    expect(hookModule.pickNotes('/nonexistent/path/xyz')).toEqual([]);
  });
});
