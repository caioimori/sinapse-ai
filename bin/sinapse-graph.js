#!/usr/bin/env node
'use strict';

// Story 10.13 — sinapse-graph is internal/deprecated for end users.
// Story 10.30 (Cycle 5) — removed from package.json `bin` for v10.0.0.
// File kept in the repo for one release cycle as a forwarder, then
// deleted entirely in v11. The dashboard functionality is preserved
// for backward compat during the v11 transition window via direct
// `node bin/sinapse-graph.js` invocation only.
const { emitDeprecationWarning } = require('./utils/deprecation-warning');
emitDeprecationWarning('sinapse-graph');

const { run } = require('../.sinapse-ai/core/graph-dashboard/cli');

run(process.argv.slice(2)).catch((err) => {
  console.error(`Error: ${err.message}`);
  process.exit(1);
});

