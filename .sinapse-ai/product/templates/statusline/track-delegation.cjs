#!/usr/bin/env node
/**
 * SINAPSE Delegation Tracker — Session-Cache v2
 *
 * Called via Claude Code PreToolUse hook with matcher "Task".
 *
 * Auto-routing means the user never types specialist @ids — so the prompt
 * detector (track-agent.cjs) can't see programmatic delegations. This hook
 * closes that gap: every real delegation (Task tool spawn) registers its
 * `subagent_type` in the per-CWD session-cache `specialists[]`, so the next
 * turn's badge injection lists the voices actually in play and the statusline
 * can show the orchestration cast.
 *
 * Rules:
 *   - Only ids that resolve to a badge in ~/.claude/agent-badges.json enter
 *     the cache (harness-generic types like "general-purpose" are ignored).
 *   - Never mutates the primary voice (agent/role) — delegation does not
 *     change who is speaking; the orchestrator remains the voice.
 *   - Cap of 6 specialists (oldest evicted), mirroring track-agent.cjs.
 *
 * OBSERVER ONLY / FAIL-OPEN: always exits 0 — a tracking hook must NEVER
 * block a Task call, on any error whatsoever.
 *
 * Installed automatically by `npx sinapse-ai install`.
 * Source: .sinapse-ai/product/templates/statusline/
 */

'use strict';

const fs = require('fs');
const path = require('path');
const os = require('os');

const SPECIALIST_CAP = 6;
// Masters are never a delegated "specialist in play" — they ARE the primary
// voice. Squad orchestrators delegated as subagents DO enter the cast.
const MASTERS = new Set(['sinapse', 'snps', 'sinapse-orqx', 'snps-orqx']);

// Identical to track-agent.cjs and statusline-script.js.
function simpleHash(str) {
  let h = 0;
  for (let i = 0; i < str.length; i++) {
    h = ((h << 5) - h) + str.charCodeAt(i);
    h |= 0;
  }
  return Math.abs(h).toString(16);
}

function nowSec() {
  return Math.floor(Date.now() / 1000);
}

// Badge ids indexed by last path segment (same contract as track-agent.cjs).
function loadBadgeIds() {
  try {
    const p = path.join(os.homedir(), '.claude', 'agent-badges.json');
    const raw = JSON.parse(fs.readFileSync(p, 'utf8'));
    if (!raw || typeof raw !== 'object') return null;
    const ids = new Set();
    for (const key of Object.keys(raw)) {
      const v = raw[key];
      if (!v || typeof v !== 'object' || !v.emoji || !v.name) continue;
      ids.add(key.split('/').pop().toLowerCase());
    }
    return ids.size ? ids : null;
  } catch {
    return null;
  }
}

function main() {
  let input;
  try {
    input = JSON.parse(fs.readFileSync(0, 'utf8'));
  } catch {
    process.exit(0);
  }

  if (!input || input.tool_name !== 'Task') process.exit(0);

  const subagent = ((input.tool_input || {}).subagent_type || '').toLowerCase().trim();
  if (!subagent || MASTERS.has(subagent)) process.exit(0);

  // Only SINAPSE agents (present in the badge map) enter the cast.
  const badgeIds = loadBadgeIds();
  if (!badgeIds || !badgeIds.has(subagent)) process.exit(0);

  const cacheDir = path.join(os.homedir(), '.claude', 'session-cache');
  const cacheFile = path.join(cacheDir, `${simpleHash(process.cwd())}.json`);

  let cache;
  try {
    cache = JSON.parse(fs.readFileSync(cacheFile, 'utf8'));
  } catch {
    cache = null;
  }
  if (!cache || typeof cache !== 'object') {
    cache = {
      version: 2,
      agent: '',
      squad: '',
      role: null,
      imperator: { active: false, ts: 0 },
      specialists: [],
      voiceTs: 0,
      updated: '',
    };
  }
  if (!Array.isArray(cache.specialists)) cache.specialists = [];

  const ts = nowSec();
  const existing = cache.specialists.find(
    (s) => s && typeof s.id === 'string' && s.id.toLowerCase() === subagent
  );
  if (existing) {
    existing.ts = ts; // renew freshness, no duplicate
  } else {
    cache.specialists.push({ id: subagent, label: subagent, icon: '🤖', ts });
    if (cache.specialists.length > SPECIALIST_CAP) {
      let minIdx = 0;
      for (let i = 1; i < cache.specialists.length; i++) {
        if (cache.specialists[i].ts < cache.specialists[minIdx].ts) minIdx = i;
      }
      cache.specialists.splice(minIdx, 1);
    }
  }

  cache.version = 2;
  // Freeze the voice-freshness point BEFORE refreshing `updated` — a legacy
  // cache (pre-voiceTs) must not have its ghost voice resurrected by this
  // write (same migration as track-agent.cjs/track-agent-clear.cjs).
  if (!(Number.isFinite(cache.voiceTs) && cache.voiceTs > 0)) {
    let frozen = 0;
    if (typeof cache.updated === 'string' && cache.updated) {
      const parsed = Date.parse(cache.updated);
      if (Number.isFinite(parsed)) frozen = Math.floor(parsed / 1000);
    }
    cache.voiceTs = frozen;
  }
  cache.updated = new Date().toISOString();

  try {
    fs.mkdirSync(cacheDir, { recursive: true });
    // Atomic (tmp+rename): concurrent readers (statusline, track-agent) must
    // never see a torn file. Parallel Task spawns remain last-write-wins —
    // acceptable for an observer-only cast (worst case: one specialist waits
    // for its next delegation to appear).
    const tmp = `${cacheFile}.${process.pid}.tmp`;
    fs.writeFileSync(tmp, JSON.stringify(cache));
    fs.renameSync(tmp, cacheFile);
  } catch {
    /* best-effort */
  }

  process.exit(0);
}

try {
  main();
} catch {
  process.exit(0);
}
