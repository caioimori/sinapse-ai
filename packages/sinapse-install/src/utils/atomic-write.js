/**
 * Atomic write (tmp + rename) — self-contained copy for @sinapse/sinapse-install.
 *
 * This package publishes on its own, so it cannot require the canonical util
 * in `.sinapse-ai/core/synapse/utils/atomic-write.js` (main sinapse-ai
 * package). Keep the two in sync if the pattern evolves.
 *
 * Onda B2 (AF-20260703): a crash or concurrent reader must never see a torn
 * config file.
 *
 * @module src/utils/atomic-write
 */

'use strict';

const fs = require('fs');
const path = require('path');

const IS_WINDOWS = process.platform === 'win32';
const TRANSIENT_LOCK_CODES = new Set(['EPERM', 'EBUSY', 'EACCES', 'ENOTEMPTY']);

function sleepSync(ms) {
  Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, ms);
}

function retrySync(fn, retries = 3, delayMs = 120) {
  for (let attempt = 0; ; attempt++) {
    try {
      return fn();
    } catch (err) {
      if (!TRANSIENT_LOCK_CODES.has(err.code) || attempt >= retries) {
        throw err;
      }
      sleepSync(delayMs * (attempt + 1));
    }
  }
}

function atomicWriteFileSync(filePath, data, encoding = 'utf8') {
  const tmpPath = `${filePath}.tmp.${process.pid}`;
  try {
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(tmpPath, data, encoding);
    if (IS_WINDOWS) {
      retrySync(() => {
        try {
          fs.unlinkSync(filePath);
        } catch (err) {
          if (err.code !== 'ENOENT') {
            throw err;
          }
        }
      });
    }
    retrySync(() => fs.renameSync(tmpPath, filePath));
  } catch (error) {
    try {
      fs.unlinkSync(tmpPath);
    } catch { /* ignore cleanup errors */ }
    throw error;
  }
}

module.exports = { atomicWriteFileSync };
