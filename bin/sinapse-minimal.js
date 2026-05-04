#!/usr/bin/env node

/**
 * SINAPSE-FullStack Minimal Installation
 *
 * REMOVED FROM PUBLIC SURFACE — Story 10.30 (Cycle 5)
 *
 * As of v10.0.0 this binary is no longer registered in package.json
 * `bin`, so `npm install -g sinapse-ai` does not install a
 * `sinapse-minimal` shim anymore. The file is kept in the repo for one
 * release cycle as a forwarder, then will be deleted entirely in v11.
 *
 * Originally deprecated in v3.11.1 (Story 10.13 added the deprecation
 * warning). The "minimal" install is no longer a real distinct mode —
 * `npx sinapse-ai install` is the single canonical entry point.
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

