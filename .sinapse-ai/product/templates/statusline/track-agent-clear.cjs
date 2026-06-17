#!/usr/bin/env node
/**
 * SINAPSE Agent/Squad Tracker (Clear) — Session-Cache v2
 *
 * Called via Claude Code Stop hook (when the assistant turn ends).
 *
 * Soft-clears the per-CWD session cache at end of turn:
 *   - specialists[] -> []          (no longer "active" specialists)
 *   - imperator.active -> false    (imperator no longer active)
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

  // Build a v2 cache preserving squad + agent, clearing the active layers.
  const cache = {
    version: 2,
    agent: typeof raw.agent === 'string' ? raw.agent : '',
    squad: typeof raw.squad === 'string' ? raw.squad : '',
    role: typeof raw.role === 'string' ? raw.role : null,
    imperator: {
      active: false,
      ts: raw.imperator && Number.isFinite(raw.imperator.ts) ? raw.imperator.ts : 0,
    },
    specialists: [],
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
