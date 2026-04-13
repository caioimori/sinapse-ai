'use strict';

const fs = require('fs');
const os = require('os');
const path = require('path');

// Story 10.20 — install upsert helpers
const { syncDirSync, detectExistingInstall, SINAPSE_HOME, HOME } = require('../../bin/cli');

function makeTempTree(layout) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'sinapse-upsert-'));
  function write(node, basePath) {
    for (const [name, content] of Object.entries(node)) {
      const p = path.join(basePath, name);
      if (typeof content === 'string') {
        fs.mkdirSync(path.dirname(p), { recursive: true });
        fs.writeFileSync(p, content);
      } else {
        fs.mkdirSync(p, { recursive: true });
        write(content, p);
      }
    }
  }
  write(layout, root);
  return root;
}

describe('Story 10.20 — install upsert', () => {
  describe('syncDirSync', () => {
    it('reports all files as added when dest does not exist', () => {
      const src = makeTempTree({ 'a.txt': 'one', 'b.txt': 'two' });
      const dest = path.join(os.tmpdir(), `sync-dest-${Date.now()}`);
      const delta = syncDirSync(src, dest);
      expect(delta.added).toBe(2);
      expect(delta.updated).toBe(0);
      expect(delta.unchanged).toBe(0);
      expect(delta.removed).toBe(0);
      expect(fs.readFileSync(path.join(dest, 'a.txt'), 'utf8')).toBe('one');
      expect(fs.readFileSync(path.join(dest, 'b.txt'), 'utf8')).toBe('two');
    });

    it('reports unchanged when dest matches src size and mtime is at least as new', () => {
      const src = makeTempTree({ 'a.txt': 'same' });
      const dest = makeTempTree({ 'a.txt': 'same' });
      // Set dest mtime to 1 hour in the future to guarantee dest >= src
      const future = new Date(Date.now() + 3600 * 1000);
      fs.utimesSync(path.join(dest, 'a.txt'), future, future);
      const delta = syncDirSync(src, dest);
      expect(delta.added).toBe(0);
      expect(delta.updated).toBe(0);
      expect(delta.unchanged).toBe(1);
    });

    it('reports updated when dest file is older or different size', () => {
      const src = makeTempTree({ 'a.txt': 'new content longer' });
      const dest = makeTempTree({ 'a.txt': 'old' });
      // Set dest mtime to 1 hour ago to guarantee src > dest
      const past = new Date(Date.now() - 3600 * 1000);
      fs.utimesSync(path.join(dest, 'a.txt'), past, past);
      const delta = syncDirSync(src, dest);
      expect(delta.updated).toBe(1);
      expect(fs.readFileSync(path.join(dest, 'a.txt'), 'utf8')).toBe('new content longer');
    });

    it('removes orphan files in dest that are not in src', () => {
      const src = makeTempTree({ 'a.txt': 'one' });
      const dest = makeTempTree({ 'a.txt': 'one', 'orphan.txt': 'gone' });
      const srcStat = fs.statSync(path.join(src, 'a.txt'));
      fs.utimesSync(path.join(dest, 'a.txt'), srcStat.atime, srcStat.mtime);
      const delta = syncDirSync(src, dest);
      expect(delta.removed).toBe(1);
      expect(fs.existsSync(path.join(dest, 'orphan.txt'))).toBe(false);
      expect(fs.existsSync(path.join(dest, 'a.txt'))).toBe(true);
    });

    it('handles nested directories recursively', () => {
      const src = makeTempTree({ sub: { 'nested.txt': 'deep' }, 'top.txt': 'shallow' });
      const dest = path.join(os.tmpdir(), `sync-nested-${Date.now()}`);
      const delta = syncDirSync(src, dest);
      expect(delta.added).toBe(2);
      expect(fs.readFileSync(path.join(dest, 'sub', 'nested.txt'), 'utf8')).toBe('deep');
      expect(fs.readFileSync(path.join(dest, 'top.txt'), 'utf8')).toBe('shallow');
    });

    it('returns empty delta when src does not exist', () => {
      const dest = path.join(os.tmpdir(), `sync-nosrc-${Date.now()}`);
      const delta = syncDirSync('/this/path/does/not/exist', dest);
      expect(delta.added).toBe(0);
      expect(delta.updated).toBe(0);
      expect(delta.unchanged).toBe(0);
      expect(delta.removed).toBe(0);
    });
  });

  describe('detectExistingInstall', () => {
    let originalHome;
    let tempHome;

    beforeEach(() => {
      // Override HOME for the duration of each test
      tempHome = fs.mkdtempSync(path.join(os.tmpdir(), 'sinapse-home-'));
      originalHome = process.env.HOME || process.env.USERPROFILE;
      // Mock os.homedir() requires re-requiring the module — instead we
      // place files at the actual SINAPSE_HOME path that the loaded module
      // has cached. We back up real files first.
    });

    it('returns upsert: false when ~/.sinapse/metadata.json is absent', () => {
      // We can't actually unset SINAPSE_HOME at runtime since it was captured
      // when bin/cli.js loaded. But we CAN test the negative-path behavior
      // by directly verifying the function handles missing files.
      // This test asserts the contract: if SINAPSE_HOME has no metadata.json,
      // upsert is false.
      const metaPath = path.join(SINAPSE_HOME, 'metadata.json');
      const existed = fs.existsSync(metaPath);
      let backupContent = null;
      if (existed) {
        backupContent = fs.readFileSync(metaPath, 'utf8');
        fs.unlinkSync(metaPath);
      }
      try {
        const result = detectExistingInstall();
        expect(result.upsert).toBe(false);
      } finally {
        if (backupContent !== null) {
          fs.writeFileSync(metaPath, backupContent);
        }
      }
    });

    it('returns upsert: true with prevMeta when metadata.json is valid', () => {
      const metaPath = path.join(SINAPSE_HOME, 'metadata.json');
      const existedBefore = fs.existsSync(metaPath);
      let backup = null;
      if (existedBefore) backup = fs.readFileSync(metaPath, 'utf8');

      try {
        fs.mkdirSync(SINAPSE_HOME, { recursive: true });
        fs.writeFileSync(
          metaPath,
          JSON.stringify({
            version: '9.3.0',
            installedAt: '2026-01-15T10:00:00.000Z',
            llm: 'claude-code',
          }),
        );
        const result = detectExistingInstall();
        expect(result.upsert).toBe(true);
        expect(result.prevMeta).toBeDefined();
        expect(result.prevMeta.version).toBe('9.3.0');
        expect(result.prevMeta.installedAt).toBe('2026-01-15T10:00:00.000Z');
        expect(result.llm).toBe('claude-code');
      } finally {
        if (backup !== null) fs.writeFileSync(metaPath, backup);
        else if (fs.existsSync(metaPath)) fs.unlinkSync(metaPath);
      }
    });

    it('returns upsert: false when metadata.json is corrupt JSON', () => {
      const metaPath = path.join(SINAPSE_HOME, 'metadata.json');
      const existedBefore = fs.existsSync(metaPath);
      let backup = null;
      if (existedBefore) backup = fs.readFileSync(metaPath, 'utf8');

      try {
        fs.mkdirSync(SINAPSE_HOME, { recursive: true });
        fs.writeFileSync(metaPath, '{ this is not json');
        const result = detectExistingInstall();
        expect(result.upsert).toBe(false);
      } finally {
        if (backup !== null) fs.writeFileSync(metaPath, backup);
        else if (fs.existsSync(metaPath)) fs.unlinkSync(metaPath);
      }
    });

    it('reads language from ~/.claude/settings.json when present', () => {
      const metaPath = path.join(SINAPSE_HOME, 'metadata.json');
      const settingsPath = path.join(HOME, '.claude', 'settings.json');
      const metaExisted = fs.existsSync(metaPath);
      const settingsExisted = fs.existsSync(settingsPath);
      let metaBackup = metaExisted ? fs.readFileSync(metaPath, 'utf8') : null;
      let settingsBackup = settingsExisted ? fs.readFileSync(settingsPath, 'utf8') : null;

      try {
        fs.mkdirSync(SINAPSE_HOME, { recursive: true });
        fs.writeFileSync(metaPath, JSON.stringify({ version: '9.4.0', llm: 'codex' }));
        fs.mkdirSync(path.dirname(settingsPath), { recursive: true });
        // Read existing settings so we don't clobber other fields
        let settings = {};
        try { settings = JSON.parse(settingsBackup || '{}'); } catch { settings = {}; }
        settings.language = 'portuguese';
        fs.writeFileSync(settingsPath, JSON.stringify(settings));

        const result = detectExistingInstall();
        expect(result.upsert).toBe(true);
        expect(result.language).toBe('pt');
      } finally {
        if (metaBackup !== null) fs.writeFileSync(metaPath, metaBackup);
        else if (fs.existsSync(metaPath)) fs.unlinkSync(metaPath);
        if (settingsBackup !== null) fs.writeFileSync(settingsPath, settingsBackup);
      }
    });
  });
});
