// bin/lib/header.js — ASCII art banner.
// Story GA-1.2 — extracted from bin/cli.js.

const {
  getLogger,
  shouldShowHeader,
  markFirstRunDone,
} = require('../../.sinapse-ai/core/logger');
const { VERSION, WHITE, BOLD, DIM, NC } = require('./constants');

function header() {
  const logger = getLogger();
  // Story A.2 AC 7 — ASCII art only on --verbose / --debug OR first-run.
  // Never in --quiet or --json mode.
  if (!shouldShowHeader(logger)) return;
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
    `${DIM} Seu copiloto de inteligencia artificial${NC}`,
    `${DIM} v${VERSION}${NC}`,
    '',
  ];
  // Write directly to stdout so the header still shows on first-run even when
  // the logger level is `warn` (default). `shouldShowHeader` is the single
  // gate that decides whether we get here at all.
  for (const line of lines) {
    try { process.stdout.write(`${line}\n`); } catch { /* ignore */ }
  }
  // Mark first-run done so subsequent runs stay clean unless --verbose.
  markFirstRunDone();
}

module.exports = { header };
