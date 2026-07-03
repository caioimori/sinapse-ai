// bin/lib/fs-utils.js — filesystem helpers.
// Story GA-1.2 — extracted from bin/cli.js.

const fs = require('fs');
const path = require('path');
const { IS_WIN } = require('./constants');

function copyDirSync(src, dest) {
  try {
    if (typeof fs.cpSync === 'function') {
      fs.cpSync(src, dest, { recursive: true, force: true });
    } else {
      fs.mkdirSync(dest, { recursive: true });
      for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
        const s = path.join(src, entry.name);
        const d = path.join(dest, entry.name);
        entry.isDirectory() ? copyDirSync(s, d) : fs.copyFileSync(s, d);
      }
    }
  } catch (err) {
    if (err.code === 'ENOTEMPTY') {
      // Windows: dest not fully cleared, force remove and retry once
      rmDirSync(dest);
      fs.cpSync(src, dest, { recursive: true, force: true });
    } else {
      throw err;
    }
  }
}

function rmDirSync(dir) {
  if (!fs.existsSync(dir)) return;
  // Windows ENOTEMPTY fix: retry with maxRetries (handles antivirus/indexer locks)
  try {
    fs.rmSync(dir, { recursive: true, force: true, maxRetries: 3, retryDelay: 200 });
  } catch (err) {
    if (err.code === 'ENOTEMPTY' || err.code === 'EBUSY') {
      // Last resort: rename to temp then delete
      const tmp = dir + '.old.' + Date.now();
      fs.renameSync(dir, tmp);
      try { fs.rmSync(tmp, { recursive: true, force: true }); } catch { /* cleanup later */ }
    } else {
      throw err;
    }
  }
}

// syncDirSync — Story 10.20
// Copies src -> dest, only writing files whose mtime+size differ. Returns a
// {added, updated, unchanged, removed} delta. Removes orphaned files in dest
// that are no longer present in src. Used by install upsert mode to avoid
// the rmDir+copyDir destruction of user-customized files.
function syncDirSync(src, dest, delta = { added: 0, updated: 0, unchanged: 0, removed: 0 }) {
  if (!fs.existsSync(src)) return delta;
  fs.mkdirSync(dest, { recursive: true });
  const srcEntries = new Set();
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    srcEntries.add(entry.name);
    const sp = path.join(src, entry.name);
    const dp = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      syncDirSync(sp, dp, delta);
    } else {
      const srcStat = fs.statSync(sp);
      let needsWrite = true;
      if (fs.existsSync(dp)) {
        try {
          const dstStat = fs.statSync(dp);
          if (dstStat.size === srcStat.size && dstStat.mtimeMs >= srcStat.mtimeMs) {
            needsWrite = false;
            delta.unchanged += 1;
          } else {
            delta.updated += 1;
          }
        } catch {
          delta.updated += 1;
        }
      } else {
        delta.added += 1;
      }
      if (needsWrite) fs.copyFileSync(sp, dp);
    }
  }
  if (fs.existsSync(dest)) {
    for (const name of fs.readdirSync(dest)) {
      if (!srcEntries.has(name)) {
        const orphan = path.join(dest, name);
        try {
          const stat = fs.statSync(orphan);
          if (stat.isDirectory()) rmDirSync(orphan);
          else fs.unlinkSync(orphan);
          delta.removed += 1;
        } catch { /* skip */ }
      }
    }
  }
  return delta;
}

// atomicWriteFileSync — Onda B2 (AF-20260703): tmp+rename via the canonical
// core util so a crash or concurrent reader never sees a torn config file.
// Fail-open: if the util can't be loaded, fall back to a plain write (the
// pre-hardening behavior) rather than breaking the installer.
let _atomicWriteSync = null;
try {
  _atomicWriteSync = require('../../.sinapse-ai/core/synapse/utils/atomic-write').atomicWriteSync;
} catch { /* fallback below */ }

function atomicWriteFileSync(filePath, data, encoding = 'utf8') {
  if (_atomicWriteSync) {
    _atomicWriteSync(filePath, data, encoding);
  } else {
    fs.writeFileSync(filePath, data, encoding);
  }
}

function toForwardSlash(p) {
  return p.replace(/\\/g, '/');
}

function toPosixPath(p) {
  if (IS_WIN) {
    return p.replace(/\\/g, '/').replace(/^([A-Za-z]):/, (_, l) => '/' + l.toLowerCase());
  }
  return p;
}

module.exports = {
  copyDirSync,
  rmDirSync,
  syncDirSync,
  atomicWriteFileSync,
  toForwardSlash,
  toPosixPath,
};
