#!/usr/bin/env node
'use strict';

/**
 * Generate the .synapse/ runtime domains consumed by the SYNAPSE context engine.
 *
 * Currently builds the L0 constitution domain from .sinapse-ai/constitution.md.
 * (L1/L2 domains degrade gracefully when absent — loadDomainFile returns []).
 *
 * TOLERANT BY DESIGN: a generation hiccup must NEVER fail the build or block the
 * test suite. The engine already degrades gracefully when domains are missing
 * (the hook silently emits no context). So this wrapper always exits 0 and only
 * surfaces detail under DEBUG=1.
 *
 * Wired into: `npm run generate:synapse`, `pretest`, and the postinstall setup.
 */

function generate() {
  // Silence the generator's own console.log (e.g. "Constitution generated…")
  // during pretest unless DEBUG=1 — keeps `npm test` output clean.
  const debug = process.env.DEBUG === '1';
  const origLog = console.log;
  if (!debug) console.log = () => {};
  try {
    const { main } = require('../.sinapse-ai/core/synapse/scripts/generate-constitution.js');
    const result = main();
    if (result && result.success) {
      if (debug) {
        console.error(`[generate-synapse] constitution: ${result.articles} articles, ${result.rules} rules`);
      }
      return true;
    }
    if (debug) {
      console.error(`[generate-synapse] constitution skipped: ${result && result.error}`);
    }
  } catch (err) {
    if (debug) {
      console.error(`[generate-synapse] error: ${err && err.message}`);
    }
  } finally {
    console.log = origLog;
  }
  return false;
}

if (require.main === module) {
  generate();
  process.exitCode = 0; // never block the build/test
}

module.exports = { generate };
