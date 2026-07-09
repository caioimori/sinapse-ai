#!/usr/bin/env node
/**
 * SINAPSE Agent/Squad Tracker (Clear) — Session-Cache v2
 *
 * Called via Claude Code Stop hook (when the assistant turn ends).
 *
 * Soft-clears the per-CWD session cache at end of turn:
 *   - imperator.active -> false    (turn-scoped flag; role survives)
 *   - PRESERVES specialists[]       (orchestration cast spans turns — the 6h
 *     TTL in track-agent.cjs/statusline handles expiry; wiping per turn made
 *     cross-turn delegation tracking impossible)
 *   - PRESERVES squad and agent     (last-known, for statusline back-compat)
 *   - regrava updated (ISO)
 *
 * Reads/writes:
 *   ~/.claude/session-cache/{simpleHash(cwd)}.json   (Session-Cache v2 shape)
 *
 * FAIL-OPEN: any error -> exit 0 without writing. Never blocks the Stop event.
 *
 * Installed automatically by `npx sinapse-ai install`.
 * Source: .sinapse-ai/product/templates/statusline/
 */

'use strict';

const fs = require('fs');
const path = require('path');
const os = require('os');

// Identical to track-agent.cjs and statusline-script.js.
function simpleHash(str) {
  let h = 0;
  for (let i = 0; i < str.length; i++) {
    h = ((h << 5) - h) + str.charCodeAt(i);
    h |= 0;
  }
  return Math.abs(h).toString(16);
}

function main() {
  const cacheDir = path.join(os.homedir(), '.claude', 'session-cache');
  const cacheFile = path.join(cacheDir, `${simpleHash(process.cwd())}.json`);

  let raw;
  try {
    raw = JSON.parse(fs.readFileSync(cacheFile, 'utf8'));
  } catch {
    // No cache (or unreadable) -> nothing to clear.
    process.exit(0);
  }

  if (!raw || typeof raw !== 'object') process.exit(0);

  // Freeze the voice-freshness point BEFORE refreshing `updated` below.
  // Legacy caches (pre-voiceTs) inherit their ORIGINAL last-activity time —
  // without this, every Stop would refresh `updated` and resurrect expired
  // ("ghost") voices on the next prompt, defeating the voice TTL.
  let voiceTs = Number.isFinite(raw.voiceTs) && raw.voiceTs > 0 ? raw.voiceTs : 0;
  if (!voiceTs && typeof raw.updated === 'string' && raw.updated) {
    const parsed = Date.parse(raw.updated);
    if (Number.isFinite(parsed)) voiceTs = Math.floor(parsed / 1000);
  }

  // Build a v2 cache preserving squad + agent, clearing the active layers.
  // voiceTs is preserved so the primary voice keeps its 6h freshness window
  // across turns of the same session (track-agent.cjs enforces the TTL).
  const cache = {
    version: 2,
    agent: typeof raw.agent === 'string' ? raw.agent : '',
    squad: typeof raw.squad === 'string' ? raw.squad : '',
    role: typeof raw.role === 'string' ? raw.role : null,
    imperator: {
      active: false,
      ts: raw.imperator && Number.isFinite(raw.imperator.ts) ? raw.imperator.ts : 0,
    },
    specialists: Array.isArray(raw.specialists)
      ? raw.specialists.filter(
          (s) => s && typeof s === 'object' && typeof s.id === 'string' && s.id
        )
      : [],
    voiceTs,
    updated: new Date().toISOString(),
  };

  try {
    fs.writeFileSync(cacheFile, JSON.stringify(cache));
  } catch {
    process.exit(0);
  }

  process.exit(0);
}

try {
  main();
} catch {
  process.exit(0);
}
