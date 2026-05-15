#!/usr/bin/env node

/**
 * SINAPSE External Executor Delegation
 *
 * Outsource specific tasks (story implementation, refactors, mechanical edits)
 * to an external executor (e.g. Codex CLI) while SINAPSE stays focused on
 * higher-value orchestration. The delegate writes prompt + output + log
 * artifacts to .sinapse/external-runs/<timestamp>-<slug>/ for audit.
 *
 * Usage: sinapse-delegate codex -t story-X -f prompt.md
 *
 * @since v1.5.0 (2026-05-15)
 * @see .sinapse-ai/core/external-executors/delegate-cli.js
 */

const path = require('path');
const { main } = require(path.join(
  __dirname,
  '..',
  '.sinapse-ai',
  'core',
  'external-executors',
  'delegate-cli',
));

main().catch((error) => {
  process.stderr.write(`ERROR=${error.message || error}\n`);
  process.exit(error.exitCode || 1);
});
