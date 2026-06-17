#!/usr/bin/env node
'use strict';

/**
 * @sinapse/installer entry point.
 *
 * Fixes the broken `main` / `bin.sinapse-installer` reference: package.json
 * pointed here but the file did not exist. This re-exports the real wizard
 * (src/wizard/index.js) for programmatic use, and runs it when invoked
 * directly as a CLI (`sinapse-installer`).
 */

const wizard = require('./wizard');

module.exports = wizard;

// CLI mode: run the wizard when this file is executed directly.
if (require.main === module) {
  Promise.resolve()
    .then(() => wizard.runWizard())
    .catch((error) => {
      // eslint-disable-next-line no-console
      console.error('Installer failed:', error && error.message ? error.message : error);
      process.exit(1);
    });
}
