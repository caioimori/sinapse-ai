'use strict';

// Native filesystem operations for cooperating local writers. The handle is
// opened once; no bytes are consumed until its pathname and parents agree.
// This is not isolation from a hostile process owning the entire filesystem.
const fs = require('node:fs');
const path = require('node:path');
const sameIdentity = (a, b) => a.dev === b.dev && a.ino === b.ino && a.birthtimeMs === b.birthtimeMs;
const sameSnapshot = (a, b) => sameIdentity(a, b) && a.size === b.size && a.mtimeMs === b.mtimeMs && a.ctimeMs === b.ctimeMs;
function parents(file, root) {
  const target = path.resolve(file), base = path.resolve(root || path.dirname(target));
  const relative = path.relative(base, target);
  if (!relative || relative.startsWith('..' + path.sep) || relative === '..' || path.isAbsolute(relative)) throw new Error('File outside authorized root');
  const result = [];
  for (let cursor = path.dirname(target);; cursor = path.dirname(cursor)) {
    let stat;
    try { stat = fs.lstatSync(cursor); } catch (error) { if (error.code !== 'ENOENT') throw error; }
    if (!stat) { if (cursor === path.dirname(cursor)) break; continue; }
    if (stat.isSymbolicLink() || !stat.isDirectory()) throw new Error('Unsafe file parent symlink or non-directory');
    result.push({path:cursor, stat});
    if (cursor === path.dirname(cursor)) break;
  }
  return result;
}
function verifyParents(snapshot) {
  for (const entry of snapshot) {
    const current = fs.lstatSync(entry.path);
    if (current.isSymbolicLink() || !current.isDirectory() || !sameIdentity(entry.stat, current)) throw new Error('File parent identity changed');
  }
}
function stableRead(file, {root, maxBytes = 12000000, optional = false} = {}) {
  if (!Number.isSafeInteger(maxBytes) || maxBytes < 1 || maxBytes > 12000000) throw new Error('Invalid file byte bound');
  const snapshot = parents(file, root);
  let fd;
  try { fd = fs.openSync(file, fs.constants.O_RDONLY | (fs.constants.O_NOFOLLOW || 0) | (fs.constants.O_NONBLOCK || 0)); }
  catch (error) {
    verifyParents(snapshot);
    if (optional && error.code === 'ENOENT') {
      // A dangling link also opens as ENOENT on some native platforms.
      try { fs.lstatSync(file); } catch (missing) { if (missing.code === 'ENOENT') return null; throw missing; }
      throw new Error('Unsafe file or pathname changed while opening');
    }
    throw error;
  }
  try {
    const opened = fs.fstatSync(fd), named = fs.lstatSync(file);
    if (named.isSymbolicLink() || !opened.isFile() || !named.isFile() || !sameSnapshot(opened, named)) throw new Error('Unsafe file or identity changed before read');
    if (!Number.isSafeInteger(opened.size) || opened.size < 0 || opened.size > maxBytes) throw new Error('File input exceeds byte bound');
    verifyParents(snapshot);
    const bytes = Buffer.alloc(opened.size);
    let offset = 0;
    while (offset < bytes.length) {
      const count = fs.readSync(fd, bytes, offset, bytes.length - offset, offset);
      if (!count) throw new Error('File changed during read');
      offset += count;
    }
    if (!sameSnapshot(opened, fs.fstatSync(fd))) throw new Error('File changed during read');
    verifyParents(snapshot);
    const after = fs.lstatSync(file);
    if (after.isSymbolicLink() || !sameSnapshot(opened, after)) throw new Error('File identity changed after read');
    return bytes;
  } finally { fs.closeSync(fd); }
}
function createExclusive(file, bytes, {root, mode = 0o600} = {}) {
  const snapshot = parents(file, root);
  const fd = fs.openSync(file, 'wx', mode);
  try {
    const opened = fs.fstatSync(fd), named = fs.lstatSync(file);
    if (!opened.isFile() || named.isSymbolicLink() || !sameIdentity(opened, named)) throw new Error('File identity changed before write');
    verifyParents(snapshot);
    fs.writeFileSync(fd, bytes);
    fs.fsyncSync(fd);
    verifyParents(snapshot);
    const after = fs.lstatSync(file);
    if (after.isSymbolicLink() || !sameSnapshot(fs.fstatSync(fd), after)) throw new Error('File identity changed after write');
  } finally { fs.closeSync(fd); }
}
module.exports = {stableRead, createExclusive};
