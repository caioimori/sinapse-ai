/**
 * @story GA-1.6 — sinapse-ds-grounding hook (executable)
 */

'use strict';

const fs = require('fs');
const os = require('os');
const path = require('path');
const { spawnSync } = require('child_process');
const yaml = require('js-yaml');

const HOOK = path.join(__dirname, '..', '..', '.sinapse-ai', 'hooks', 'sinapse-ds-grounding.cjs');
const DS_FIXTURE = path.join(__dirname, '..', 'fixtures', 'grounding', 'ds');

function makeTmpHome() {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'sinapse-ds-hook-'));
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
  return spawnSync(process.execPath, [HOOK], {
    input: JSON.stringify(input),
    env,
    encoding: 'utf8',
    timeout: 10000,
  });
}

describe('sinapse-ds-grounding hook (executable)', () => {
  let home;
  beforeEach(() => { home = makeTmpHome(); });
  afterEach(() => {
    try { fs.rmSync(home, { recursive: true, force: true }); } catch { /* ignore */ }
  });

  test('no-op when prompt is non-UI even with config', () => {
    writeConfig(home, {
      version: '1',
      grounding: {
        designSystem: { enabled: true, profileName: 'Acme', rootPath: DS_FIXTURE },
      },
    });
    const res = runHook(home, { prompt: 'refactor backend cron job and database migration', session_id: 't' });
    expect(res.status).toBe(0);
    expect(res.stdout).toBe('');
  });

  test('no-op when config absent on UI prompt', () => {
    const res = runHook(home, { prompt: 'crie uma landing page hero com CTA', session_id: 't' });
    expect(res.status).toBe(0);
    expect(res.stdout).toBe('');
  });

  test('injects <ds-grounding> on UI prompt with valid config', () => {
    writeConfig(home, {
      version: '1',
      grounding: {
        designSystem: { enabled: true, profileName: 'Acme DS', rootPath: DS_FIXTURE },
      },
    });
    const res = runHook(home, {
      prompt: 'crie uma landing page hero com componente de CTA',
      session_id: 't',
    });
    expect(res.status).toBe(0);
    const parsed = JSON.parse(res.stdout);
    const ctx = parsed.hookSpecificOutput.additionalContext;
    expect(ctx).toContain('<ds-grounding');
    expect(ctx).toContain('name="Acme DS"');
    expect(ctx).toContain('Rule 01');
    expect(ctx).toContain('</ds-grounding>');
  });

  test('anti-double-injection', () => {
    writeConfig(home, {
      version: '1',
      grounding: {
        designSystem: { enabled: true, profileName: 'Acme', rootPath: DS_FIXTURE },
      },
    });
    const res = runHook(home, {
      prompt: '<ds-grounding>already</ds-grounding> crie uma pagina',
      session_id: 't',
    });
    expect(res.status).toBe(0);
    expect(res.stdout).toBe('');
  });

  test('disabled section means no-op even on UI prompt', () => {
    writeConfig(home, {
      version: '1',
      grounding: {
        designSystem: { enabled: false, profileName: 'Acme', rootPath: DS_FIXTURE },
      },
    });
    const res = runHook(home, { prompt: 'crie uma landing page', session_id: 't' });
    expect(res.status).toBe(0);
    expect(res.stdout).toBe('');
  });
});

describe('sinapse-ds-grounding helpers', () => {
  const hookModule = require(HOOK);

  test('isUIPrompt detects UI keywords', () => {
    expect(hookModule.isUIPrompt('crie uma landing page')).toBe(true);
    expect(hookModule.isUIPrompt('build a react component')).toBe(true);
    expect(hookModule.isUIPrompt('refactor backend cron job')).toBe(false);
    expect(hookModule.isUIPrompt('hi')).toBe(false);
    expect(hookModule.isUIPrompt('')).toBe(false);
  });

  test('findLawFile picks 0.0-guidelines.md preferentially', () => {
    const found = hookModule.findLawFile(DS_FIXTURE);
    expect(found).toMatch(/0\.0-guidelines\.md$/);
  });

  test('findLawFile returns null on missing path', () => {
    expect(hookModule.findLawFile('/nonexistent/xyz')).toBeNull();
  });
});
