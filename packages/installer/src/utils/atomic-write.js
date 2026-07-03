/**
 * Atomic write bridge — Onda B2 (AF-20260703)
 *
 * Thin pointer to the canonical tmp+rename util in
 * `.sinapse-ai/core/synapse/utils/atomic-write.js` (ships in the same npm
 * package as this workspace). Fail-open: if the canonical util can't be
 * resolved, fall back to a plain write (the pre-hardening behavior) rather
 * than breaking the installer.
 *
 * @module src/utils/atomic-write
 */

'use strict';

const fs = require('fs');
const path = require('path');

let _atomicWriteSync = null;
try {
  // packages/installer/src/utils → repo/package root is 4 levels up
  _atomicWriteSync = require(path.join(
    __dirname, '..', '..', '..', '..',
    '.sinapse-ai', 'core', 'synapse', 'utils', 'atomic-write',
  )).atomicWriteSync;
} catch { /* fallback below */ }

function atomicWriteFileSync(filePath, data, encoding = 'utf8') {
  if (_atomicWriteSync) {
    _atomicWriteSync(filePath, data, encoding);
  } else {
    fs.writeFileSync(filePath, data, encoding);
  }
}

module.exports = { atomicWriteFileSync };
