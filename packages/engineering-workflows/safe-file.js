'use strict';

const fs = require('fs');
const path = require('path');

// Bind validation and reads to one descriptor. O_NOFOLLOW is unavailable on
// Windows, so also bind its file identity to a post-open lstat and reject links.
function readRegularFile(file, { maxBytes = 2 * 1024 * 1024, nonempty = false, root } = {}) {
  const absolute = path.resolve(file);
  const flags = fs.constants.O_RDONLY | (fs.constants.O_NOFOLLOW || 0) | (fs.constants.O_NONBLOCK || 0);
  const descriptor = fs.openSync(absolute, flags);
  try {
    const opened = fs.fstatSync(descriptor, { bigint: true });
    if (!opened.isFile() || opened.size > BigInt(maxBytes) || (nonempty && opened.size === 0n)) throw new Error('Artifact must be a regular, nonempty file when required and within the byte limit');
    if (root) {
      const relative = path.relative(root, absolute);
      if (!relative || relative.startsWith('..') || path.isAbsolute(relative)) throw new Error('Artifact escapes project root');
      let current = root;
      for (const part of relative.split(path.sep)) {
        current = path.join(current, part);
        if (fs.lstatSync(current).isSymbolicLink()) throw new Error('Symlinks are forbidden for artifacts');
      }
    }
    const linked = fs.lstatSync(absolute, { bigint: true });
    if (linked.isSymbolicLink() || !linked.isFile() || linked.dev !== opened.dev || linked.ino !== opened.ino) throw new Error('Artifact path changed or is a symlink');
    // A bounded descriptor read also prevents concurrent growth from causing an
    // unbounded allocation; never reopen the path after checking its identity.
    const buffer = Buffer.alloc(Math.min(Number(opened.size) + 1, maxBytes + 1));
    let length = 0;
    while (length < buffer.length) {
      const bytes = fs.readSync(descriptor, buffer, length, buffer.length - length, null);
      if (!bytes) break;
      length += bytes;
    }
    const after = fs.fstatSync(descriptor, { bigint: true });
    const bound = fs.lstatSync(absolute, { bigint: true });
    if (bound.isSymbolicLink() || !bound.isFile() || bound.dev !== opened.dev || bound.ino !== opened.ino || length > maxBytes || BigInt(length) !== opened.size || after.size !== opened.size || after.mtimeNs !== opened.mtimeNs || after.ctimeNs !== opened.ctimeNs) throw new Error('Artifact changed while being read or exceeds the byte limit');
    return buffer.subarray(0, length);
  } finally {
    fs.closeSync(descriptor);
  }
}

module.exports = { readRegularFile };
