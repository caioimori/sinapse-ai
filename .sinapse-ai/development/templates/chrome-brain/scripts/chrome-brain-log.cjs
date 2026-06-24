#!/usr/bin/env node
'use strict';

/*
 * Chrome Brain — chrome-brain-log (Node, cross-platform).
 *
 * Called by the PostToolUse hook after every browser MCP tool. Appends a usage
 * line and warns when the per-session screenshot count gets risky (the API has
 * a ~20MB response cap). Node version of the old bash logger so it runs hidden
 * on Windows (no console window) and needs no date/awk/grep.
 *
 * FAIL-SOFT: never throws, always exits 0.
 */

const fs = require('fs');
const os = require('os');
const path = require('path');

function toolName() {
  // Claude Code passes a JSON payload on stdin; fall back to env then 'unknown'.
  try {
    const raw = fs.readFileSync(0, 'utf8');
    if (raw) {
      const j = JSON.parse(raw);
      return j.tool_name || j.toolName || process.env.HOOK_TOOL_NAME || 'unknown';
    }
  } catch {
    /* no stdin / not JSON */
  }
  return process.env.HOOK_TOOL_NAME || 'unknown';
}

try {
  const dir = path.join(os.homedir(), '.chrome-brain');
  fs.mkdirSync(dir, { recursive: true });

  const now = new Date();
  const today = now.toISOString().slice(0, 10).replace(/-/g, ''); // YYYYMMDD
  const time = now.toTimeString().slice(0, 8); // HH:MM:SS
  const tool = toolName();

  fs.appendFileSync(path.join(dir, `session-${today}.log`), `${time} ${tool}\n`);

  if (/take_screenshot|take_snapshot/.test(tool)) {
    const countFile = path.join(dir, '.screenshot-count');
    const dateFile = path.join(dir, '.screenshot-date');

    let lastDate = '';
    try {
      lastDate = fs.readFileSync(dateFile, 'utf8').trim();
    } catch {
      /* first run */
    }
    if (lastDate !== today) {
      fs.writeFileSync(dateFile, today);
      fs.writeFileSync(countFile, '0');
    }

    let count = 0;
    try {
      count = parseInt(fs.readFileSync(countFile, 'utf8'), 10) || 0;
    } catch {
      /* default 0 */
    }
    count += 1;
    fs.writeFileSync(countFile, String(count));

    if (count === 12) {
      process.stderr.write('WARNING: 12 screenshots this session. Consider saving state and rotating.\n');
    } else if (count >= 15) {
      process.stderr.write('CRITICAL: 15+ screenshots. Session at risk of the API size cap. Save state NOW.\n');
    }
  }
} catch {
  /* fail-soft */
}

process.exit(0);
