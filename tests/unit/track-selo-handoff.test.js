/**
 * Selo/handoff visibility — behavioral tests for the statusline tracker trio
 * (story selo-handoff-visibility):
 *
 *   - track-agent.cjs       roster (cast) injection under Imperator + voice TTL
 *   - track-delegation.cjs  PreToolUse[Task] delegation tracking
 *   - track-agent-clear.cjs Stop hook preserves the cast + voiceTs
 *
 * The hooks are self-contained scripts that read stdin and os.homedir(), so
 * each test spawns them as a child process with HOME/USERPROFILE pointed at a
 * throwaway home dir — real behavior, no mocks.
 */

'use strict';

const { spawnSync } = require('child_process');
const fs = require('fs');
const os = require('os');
const path = require('path');

const TEMPLATES = path.join(
  __dirname, '..', '..', '.sinapse-ai', 'product', 'templates', 'statusline'
);
const TRACK_AGENT = path.join(TEMPLATES, 'track-agent.cjs');
const TRACK_DELEGATION = path.join(TEMPLATES, 'track-delegation.cjs');
const TRACK_CLEAR = path.join(TEMPLATES, 'track-agent-clear.cjs');

// Mirror of the hash used by the tracker trio + statusline.
function simpleHash(str) {
  let h = 0;
  for (let i = 0; i < str.length; i++) {
    h = ((h << 5) - h) + str.charCodeAt(i);
    h |= 0;
  }
  return Math.abs(h).toString(16);
}

const BADGES_FIXTURE = {
  developer: { emoji: '💻', area: 'DEV', name: 'Pixel' },
  'snps-orqx': { emoji: '👑', area: 'ORQX', name: 'Imperator' },
  'squad-brand/brand-orqx': { emoji: '🎯', area: 'BRAND', name: 'Meridian' },
  'squad-brand/brand-auditor': { emoji: '🔍', area: 'BRAND', name: 'Probe' },
  // Double-escaped emoji as shipped in a few real entries — must be decoded.
  'claude-code-mastery/config-engineer': {
    emoji: '\\U0001F9E0',
    area: 'CONFIG',
    name: 'Dial',
  },
};

function makeEnv(homeDir) {
  return { ...process.env, HOME: homeDir, USERPROFILE: homeDir };
}

function runHook(script, stdinObj, { home, cwd }) {
  return spawnSync(process.execPath, [script], {
    input: JSON.stringify(stdinObj),
    cwd,
    env: makeEnv(home),
    encoding: 'utf8',
    timeout: 15000,
  });
}

function extractContext(stdout) {
  if (!stdout || !stdout.trim()) return null;
  const parsed = JSON.parse(stdout);
  return (
    (parsed.hookSpecificOutput && parsed.hookSpecificOutput.additionalContext) || null
  );
}

describe('selo/handoff visibility (track-agent trio)', () => {
  let home;
  let work;
  let cacheFile;

  beforeEach(() => {
    home = fs.mkdtempSync(path.join(os.tmpdir(), 'selo-home-'));
    work = fs.mkdtempSync(path.join(os.tmpdir(), 'selo-work-'));
    fs.mkdirSync(path.join(home, '.claude', 'session-cache'), { recursive: true });
    fs.writeFileSync(
      path.join(home, '.claude', 'agent-badges.json'),
      JSON.stringify(BADGES_FIXTURE)
    );
    cacheFile = path.join(home, '.claude', 'session-cache', `${simpleHash(work)}.json`);
  });

  afterEach(() => {
    for (const dir of [home, work]) {
      try {
        fs.rmSync(dir, { recursive: true, force: true });
      } catch {
        /* best-effort cleanup */
      }
    }
  });

  function seedCache(cache) {
    fs.writeFileSync(cacheFile, JSON.stringify(cache));
  }

  function readCache() {
    return JSON.parse(fs.readFileSync(cacheFile, 'utf8'));
  }

  const now = () => Math.floor(Date.now() / 1000);

  // ── AC1: cast roster under the Imperator ──────────────────────────────────

  test('imperator mention injects the handoff cast (core + orqx, ≤2500 chars)', () => {
    const res = runHook(TRACK_AGENT, { prompt: '@snps organiza isso' }, { home, cwd: work });
    expect(res.status).toBe(0);
    const ctx = extractContext(res.stdout);
    expect(ctx).toContain('<sinapse-selo>');
    expect(ctx).toContain('Imperator'); // primary voice
    expect(ctx).toContain('Elenco pra handoffs');
    expect(ctx).toContain('developer → 💻 · DEV · Pixel'); // core agent in the cast
    expect(ctx).toContain('brand-orqx → 🎯 · BRAND · Meridian'); // squad orqx in the cast
    expect(ctx).not.toContain('Probe'); // squad specialist stays out of the base cast
    expect(ctx.length).toBeLessThanOrEqual(2500);
  });

  test('cast persists across turns via role (imperator.active lowered by Stop)', () => {
    seedCache({
      version: 2,
      agent: '',
      squad: '',
      role: 'imperator',
      imperator: { active: false, ts: now() - 60 }, // Stop hook already ran
      specialists: [],
      voiceTs: now() - 60,
      updated: new Date().toISOString(),
    });
    const res = runHook(TRACK_AGENT, { prompt: 'continua' }, { home, cwd: work });
    const ctx = extractContext(res.stdout);
    expect(ctx).toContain('Elenco pra handoffs');
  });

  test('specialist voice does NOT get the cast block', () => {
    const res = runHook(TRACK_AGENT, { prompt: '@developer conserta isso' }, { home, cwd: work });
    const ctx = extractContext(res.stdout);
    expect(ctx).toContain('Pixel'); // own badge
    expect(ctx).not.toContain('Elenco pra handoffs');
  });

  // ── AC3: voice TTL ────────────────────────────────────────────────────────

  test('stale voice (voiceTs older than 6h) injects no selo', () => {
    seedCache({
      version: 2,
      agent: 'developer',
      squad: '',
      role: 'specialist',
      imperator: { active: false, ts: 0 },
      specialists: [],
      voiceTs: now() - 7 * 3600,
      updated: new Date(Date.now() - 7 * 3600 * 1000).toISOString(),
    });
    const res = runHook(TRACK_AGENT, { prompt: 'oi' }, { home, cwd: work });
    expect(res.status).toBe(0);
    expect(extractContext(res.stdout)).toBeNull();
  });

  test('legacy cache without voiceTs falls back to `updated` freshness', () => {
    seedCache({
      version: 2,
      agent: 'developer',
      squad: '',
      role: 'specialist',
      imperator: { active: false, ts: 0 },
      specialists: [],
      updated: new Date().toISOString(), // fresh legacy cache → voice alive
    });
    const fresh = runHook(TRACK_AGENT, { prompt: 'oi' }, { home, cwd: work });
    expect(extractContext(fresh.stdout)).toContain('Pixel');

    seedCache({
      version: 2,
      agent: 'developer',
      squad: '',
      role: 'specialist',
      imperator: { active: false, ts: 0 },
      specialists: [],
      updated: new Date(Date.now() - 7 * 3600 * 1000).toISOString(), // stale ghost
    });
    const stale = runHook(TRACK_AGENT, { prompt: 'oi' }, { home, cwd: work });
    expect(extractContext(stale.stdout)).toBeNull();
  });

  test('ghost voice stays dead after Stop refreshes `updated` (resurrection regression)', () => {
    // Exact legacy shape main used to write (no voiceTs), 3 days stale.
    seedCache({
      version: 2,
      agent: 'developer',
      squad: '',
      role: 'specialist',
      imperator: { active: false, ts: 0 },
      specialists: [],
      updated: new Date(Date.now() - 3 * 24 * 3600 * 1000).toISOString(),
    });
    // Turn 1: stale → suppressed.
    expect(
      extractContext(runHook(TRACK_AGENT, { prompt: 'oi' }, { home, cwd: work }).stdout)
    ).toBeNull();
    // Stop hook refreshes `updated` — the freshness point must stay frozen.
    spawnSync(process.execPath, [TRACK_CLEAR], {
      cwd: work,
      env: makeEnv(home),
      encoding: 'utf8',
      timeout: 15000,
    });
    // Turn 2 (the old resurrection path): must remain dead.
    expect(
      extractContext(runHook(TRACK_AGENT, { prompt: 'e agora' }, { home, cwd: work }).stdout)
    ).toBeNull();
    // Delegation writes must not resurrect it either.
    runHook(
      TRACK_DELEGATION,
      { tool_name: 'Task', tool_input: { subagent_type: 'brand-auditor' } },
      { home, cwd: work }
    );
    expect(
      extractContext(runHook(TRACK_AGENT, { prompt: 'segue' }, { home, cwd: work }).stdout)
    ).toBeNull();
  });

  test('live legacy voice survives the Stop hook (frozen, not refreshed)', () => {
    seedCache({
      version: 2,
      agent: 'developer',
      squad: '',
      role: 'specialist',
      imperator: { active: false, ts: 0 },
      specialists: [],
      updated: new Date().toISOString(), // session alive at upgrade time
    });
    spawnSync(process.execPath, [TRACK_CLEAR], {
      cwd: work,
      env: makeEnv(home),
      encoding: 'utf8',
      timeout: 15000,
    });
    const cache = readCache();
    expect(cache.voiceTs).toBeGreaterThan(0); // frozen at original activity time
    expect(
      extractContext(runHook(TRACK_AGENT, { prompt: 'oi' }, { home, cwd: work }).stdout)
    ).toContain('Pixel');
  });

  test('a new mention renews voiceTs in the cache', () => {
    runHook(TRACK_AGENT, { prompt: '@developer vai' }, { home, cwd: work });
    const cache = readCache();
    expect(cache.voiceTs).toBeGreaterThan(now() - 60);
  });

  // ── AC2: delegation tracking (PreToolUse Task) ───────────────────────────

  test('Task delegation registers the specialist in the cast (no duplicates)', () => {
    const payload = { tool_name: 'Task', tool_input: { subagent_type: 'developer' } };
    let res = runHook(TRACK_DELEGATION, payload, { home, cwd: work });
    expect(res.status).toBe(0);
    let cache = readCache();
    expect(cache.specialists.map((s) => s.id)).toEqual(['developer']);

    res = runHook(TRACK_DELEGATION, payload, { home, cwd: work });
    expect(res.status).toBe(0);
    cache = readCache();
    expect(cache.specialists.filter((s) => s.id === 'developer')).toHaveLength(1);
  });

  test('delegated specialist surfaces in the next selo block under the Imperator', () => {
    runHook(TRACK_AGENT, { prompt: '@snps toca o plano' }, { home, cwd: work });
    runHook(
      TRACK_DELEGATION,
      { tool_name: 'Task', tool_input: { subagent_type: 'brand-auditor' } },
      { home, cwd: work }
    );
    const res = runHook(TRACK_AGENT, { prompt: 'segue' }, { home, cwd: work });
    const ctx = extractContext(res.stdout);
    expect(ctx).toContain('Especialistas em jogo nesta orquestração');
    expect(ctx).toContain('Probe'); // brand-auditor badge resolved by last segment
  });

  test('harness-generic subagent types and non-Task tools are ignored', () => {
    let res = runHook(
      TRACK_DELEGATION,
      { tool_name: 'Task', tool_input: { subagent_type: 'general-purpose' } },
      { home, cwd: work }
    );
    expect(res.status).toBe(0);
    expect(fs.existsSync(cacheFile)).toBe(false);

    res = runHook(
      TRACK_DELEGATION,
      { tool_name: 'Write', tool_input: { file_path: 'x.js' } },
      { home, cwd: work }
    );
    expect(res.status).toBe(0);
    expect(fs.existsSync(cacheFile)).toBe(false);
  });

  test('masters are never registered as delegated specialists', () => {
    const res = runHook(
      TRACK_DELEGATION,
      { tool_name: 'Task', tool_input: { subagent_type: 'snps-orqx' } },
      { home, cwd: work }
    );
    expect(res.status).toBe(0);
    expect(fs.existsSync(cacheFile)).toBe(false);
  });

  test('double-escaped badge emoji is decoded in the selo block', () => {
    runHook(TRACK_AGENT, { prompt: '@snps toca' }, { home, cwd: work });
    runHook(
      TRACK_DELEGATION,
      { tool_name: 'Task', tool_input: { subagent_type: 'config-engineer' } },
      { home, cwd: work }
    );
    const ctx = extractContext(
      runHook(TRACK_AGENT, { prompt: 'segue' }, { home, cwd: work }).stdout
    );
    expect(ctx).toContain('🧠'); // decoded from \U0001F9E0
    expect(ctx).not.toContain('\\U0001F9E0');
  });

  test('delegation tracking never mutates the primary voice', () => {
    runHook(TRACK_AGENT, { prompt: '@snps vai' }, { home, cwd: work });
    const before = readCache();
    runHook(
      TRACK_DELEGATION,
      { tool_name: 'Task', tool_input: { subagent_type: 'developer' } },
      { home, cwd: work }
    );
    const after = readCache();
    expect(after.role).toBe(before.role);
    expect(after.agent).toBe(before.agent);
  });

  // ── Stop hook: cast survives the turn boundary ───────────────────────────

  test('clear hook lowers imperator.active but preserves specialists + voiceTs', () => {
    runHook(TRACK_AGENT, { prompt: '@snps vai' }, { home, cwd: work });
    runHook(
      TRACK_DELEGATION,
      { tool_name: 'Task', tool_input: { subagent_type: 'developer' } },
      { home, cwd: work }
    );
    const res = spawnSync(process.execPath, [TRACK_CLEAR], {
      cwd: work,
      env: makeEnv(home),
      encoding: 'utf8',
      timeout: 15000,
    });
    expect(res.status).toBe(0);
    const cache = readCache();
    expect(cache.imperator.active).toBe(false);
    expect(cache.specialists.map((s) => s.id)).toContain('developer');
    expect(cache.voiceTs).toBeGreaterThan(0);
    expect(cache.role).toBe('imperator');
  });
});
