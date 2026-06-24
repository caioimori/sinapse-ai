// bin/lib/header.js — ASCII art banner.
// Story GA-1.2 — extracted from bin/cli.js.

const {
  getLogger,
  shouldShowHeader,
  markFirstRunDone,
} = require('../../.sinapse-ai/core/logger');
const { VERSION, WHITE, BOLD, DIM, NC } = require('./constants');

function header(opts = {}) {
  const logger = getLogger();
  const force = !!opts.force;
  // --json (machine output) and --quiet always suppress the banner.
  if (!logger || logger.json || logger.threshold === 0 /* LEVELS.error */) return;
  // Outside json/quiet: show on --verbose / --debug, on first run, OR when the
  // caller forces it. The `install` command forces it so the brand banner is
  // always visible at install time (Story A.2 AC 7 kept for non-forced paths).
  if (!force && !shouldShowHeader(logger)) return;
  const W = `${WHITE}${BOLD}`;
  const lines = [
    '',
    `${W} ███████╗███╗   ██╗██████╗ ███████╗     █████╗ ██╗${NC}`,
    `${W} ██╔════╝████╗  ██║██╔══██╗██╔════╝    ██╔══██╗██║${NC}`,
    `${W} ███████╗██╔██╗ ██║██████╔╝███████╗    ███████║██║${NC}`,
    `${W} ╚════██║██║╚██╗██║██╔═══╝ ╚════██║    ██╔══██║██║${NC}`,
    `${W} ███████║██║ ╚████║██║     ███████║    ██║  ██║██║${NC}`,
    `${W} ╚══════╝╚═╝  ╚═══╝╚═╝     ╚══════╝    ╚═╝  ╚═╝╚═╝${NC}`,
    '',
    `${DIM}   Orquestracao de inteligencia artificial · v${VERSION}${NC}`,
    '',
    `${DIM}   ┼${'─'.repeat(50)}┼${NC}`,
    '',
  ];
  // Write directly to stdout so the header still shows even when the logger
  // level is `warn` (default). The gates above decide whether we get here.
  for (const line of lines) {
    try { process.stdout.write(`${line}\n`); } catch { /* ignore */ }
  }
  // Mark first-run done so subsequent (non-forced) runs stay clean.
  markFirstRunDone();
}

module.exports = { header };
