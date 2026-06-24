#!/usr/bin/env node
'use strict';

/*
 * Chrome Brain — chrome-ensure (Node, cross-platform).
 *
 * Called by the PreToolUse hook before any browser MCP tool. Guarantees the
 * SINGLE fixed-profile debug Chrome is up on the CDP port — and crucially:
 *   - NEVER kills a healthy instance (the old bash script force-killed on a
 *     flaky check, which dropped the live DevTools connection).
 *   - Launches detached + windowsHide so NO console (CMD/PowerShell) window
 *     ever pops (the old `#!/bin/bash` script spawned a console on Windows).
 *   - Uses one fixed profile so the user logs in ONCE and stays logged in.
 *
 * Reads config from ~/.sinapse/chrome-brain.json (written at install time):
 *   { "chromePath": "...", "port": 9222, "profile": "~/.chrome-debug-profile" }
 *
 * FAIL-SOFT: any error -> exit 0. A browser helper is never worth blocking a
 * tool call (the MCP itself will surface a clear error if Chrome is truly down).
 *
 * Pass `--visible` (or run via `chrome-brain login`) to force a launch even when
 * an instance is already up — used to open the window for first-time login.
 */

const fs = require('fs');
const os = require('os');
const path = require('path');
const http = require('http');
const { spawn } = require('child_process');

const CONFIG_PATH = path.join(os.homedir(), '.sinapse', 'chrome-brain.json');

function readConfig() {
  try {
    const c = JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf8'));
    if (!c || !c.chromePath) return null;
    return {
      chromePath: c.chromePath,
      port: Number(c.port) || 9222,
      profile: c.profile || path.join(os.homedir(), '.chrome-debug-profile'),
    };
  } catch {
    return null;
  }
}

// True iff a debug Chrome is already answering CDP on the port. Short timeout so
// the hook never stalls a tool call.
function isAlive(port) {
  return new Promise((resolve) => {
    const req = http.get(
      { host: '127.0.0.1', port, path: '/json/version', timeout: 1200 },
      (res) => {
        res.resume();
        resolve(res.statusCode === 200);
      }
    );
    req.on('error', () => resolve(false));
    req.on('timeout', () => {
      req.destroy();
      resolve(false);
    });
  });
}

function launch(cfg) {
  const args = [
    `--remote-debugging-port=${cfg.port}`,
    `--user-data-dir=${cfg.profile}`,
    '--no-first-run',
    '--no-default-browser-check',
  ];
  // detached + ignored stdio + unref: Chrome survives this short-lived hook
  // process and keeps the fixed profile alive across the whole session.
  // windowsHide hides any console wrapper (chrome.exe itself is a GUI app, so
  // its own window still shows — that is intentional, the user logs in there).
  const child = spawn(cfg.chromePath, args, {
    detached: true,
    stdio: 'ignore',
    windowsHide: true,
  });
  child.unref();
}

async function main() {
  const force = process.argv.includes('--visible') || process.argv.includes('--force');
  const cfg = readConfig();
  if (!cfg) process.exit(0); // not configured -> do nothing, never block

  const alive = await isAlive(cfg.port);
  if (alive && !force) process.exit(0); // healthy -> NEVER touch it, just return

  try {
    launch(cfg);
  } catch {
    process.exit(0);
  }

  // Poll until ready (~10s max). We never kill anything; if it does not come up
  // we exit quietly and let the MCP report the connection error.
  for (let i = 0; i < 20; i++) {
    await new Promise((r) => setTimeout(r, 500));
    if (await isAlive(cfg.port)) process.exit(0);
  }
  process.exit(0);
}

main().catch(() => process.exit(0));
