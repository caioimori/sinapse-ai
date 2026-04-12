#!/usr/bin/env node
'use strict';

// Story 10.13 — sinapse-graph is internal/deprecated for end users. Emit the
// canonical deprecation notice on stderr (no subcommand equivalent, so the
// warning points at `npx sinapse-ai --help`). The dashboard functionality is
// preserved for backward compat during the v11 transition window.
const { emitDeprecationWarning } = require('./utils/deprecation-warning');
emitDeprecationWarning('sinapse-graph');

const { run } = require('../.sinapse-ai/core/graph-dashboard/cli');

run(process.argv.slice(2)).catch((err) => {
  console.error(`Error: ${err.message}`);
  process.exit(1);
});

