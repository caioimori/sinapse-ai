#!/usr/bin/env node

/**
 * SINAPSE-FullStack Minimal Installation
 *
 * DEPRECATED (since v3.11.1, scheduled for removal in v5.0.0):
 * The --minimal mode was designed for squads which have been
 * replaced by the Squads system (OSR-8). This command now runs the
 * standard wizard through the main router.
 */

const { spawn } = require('child_process');
const path = require('path');
const { emitDeprecationWarning } = require('./utils/deprecation-warning');

// Story 10.13 — sinapse-minimal is internal/deprecated. Emit the canonical
// deprecation notice on stderr, pointing users at `npx sinapse-ai install`.
// The subcommand (if any) is forwarded to the router; the warning uses the
// first known subcmd when present, otherwise it falls back to the generic
// --help pointer.
const rawArgs = process.argv.slice(2);
const knownSubcmd = rawArgs.find((a) => ['install', 'update', 'uninstall'].includes(a));
emitDeprecationWarning('sinapse-minimal', knownSubcmd || 'install');

// Get the path to the main router (sinapse.js)
const routerPath = path.join(__dirname, 'sinapse.js');

// Forward all arguments to the main router
const args = rawArgs;

// Spawn the main router
const child = spawn('node', [routerPath, ...args], {
  stdio: 'inherit',
  cwd: process.cwd(),
});

child.on('close', (code) => {
  process.exit(code || 0);
});

child.on('error', (error) => {
  console.error('❌ Failed to start SINAPSE:', error.message);
  process.exit(1);
});

