'use strict';

/**
 * Follow-up #13 — Installer upgrade rollback wiring
 *
 * Exercises the transactional safety net that wraps the FATAL install phases
 * (1–6) of `cmdInstallGlobal`. The seam under test is the trio of exported
 * helpers (createInstallTransaction / buildTransactionPaths /
 * backupGlobalState / runFatalPhasesTransactional) driven by a REAL
 * InstallTransaction against a REAL temp directory — no fs mocks, so the
 * backup → fail → rollback → re-throw and backup → success → commit paths are
 * genuinely executed end-to-end.
 *
 * NOTE: This file is intentionally NOT named install-transaction.test.js — that
 * exact path is ignored in jest.config.js (flaky perf suite). This one runs.
 */

const fs = require('fs');
const fse = require('fs-extra');
const os = require('os');
const path = require('path');

const { InstallTransaction } = require('../../bin/utils/install-transaction');
const {
  runFatalPhasesTransactional,
  backupGlobalState,
  buildTransactionPaths,
  createInstallTransaction,
} = require('../../bin/commands/install');

describe('Follow-up #13 — installer upgrade rollback wiring', () => {
  let tmp;
  let sinapseHome;
  let claudeAgents;
  let binDir;
  let backupDir;
  let logFile;

  beforeEach(() => {
    tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'sinapse-rollback-'));
    sinapseHome = path.join(tmp, '.sinapse');
    claudeAgents = path.join(tmp, '.claude', 'agents');
    binDir = path.join(tmp, 'bin');
    // Backup + log live OUTSIDE every snapshot target (mirrors production, where
    // the backup dir is a sibling of ~/.sinapse so the recursive copy can never
    // copy a snapshot into itself).
    backupDir = path.join(tmp, '.sinapse-backup', 'snap');
    logFile = path.join(tmp, 'install.log');

    // Seed a realistic PRE-UPGRADE global state.
    fse.ensureDirSync(sinapseHome);
    fs.writeFileSync(path.join(sinapseHome, 'metadata.json'), JSON.stringify({ version: '1.0.0' }));
    fs.writeFileSync(path.join(sinapseHome, 'squad-old.txt'), 'OLD-SQUAD');
    fse.ensureDirSync(claudeAgents);
    fs.writeFileSync(path.join(claudeAgents, 'old-agent.md'), 'OLD-AGENT');
    fse.ensureDirSync(binDir);
    fs.writeFileSync(path.join(binDir, 'sinapse'), 'OLD-LAUNCHER');
  });

  afterEach(() => {
    fse.removeSync(tmp);
  });

  const makeTx = () => new InstallTransaction({ logFile, backupDir });
  const snapshotPaths = () => ({ dirs: [sinapseHome, claudeAgents, binDir], files: [] });

  // A phase runner that half-applies an upgrade, then optionally explodes.
  const mutateThen = (throwErr) => () => {
    fs.writeFileSync(path.join(sinapseHome, 'metadata.json'), JSON.stringify({ version: '2.0.0' }));
    fs.writeFileSync(path.join(sinapseHome, 'squad-new.txt'), 'NEW-SQUAD');
    fs.rmSync(path.join(sinapseHome, 'squad-old.txt'));
    fs.writeFileSync(path.join(claudeAgents, 'new-agent.md'), 'NEW-AGENT');
    fs.writeFileSync(path.join(binDir, 'sinapse'), 'NEW-LAUNCHER');
    if (throwErr) throw throwErr;
    return { ok: true };
  };

  test('failed upgrade restores the pre-upgrade state and re-throws', async () => {
    const tx = makeTx();
    const boom = new Error('Phase 4 exploded');
    boom.code = 'EACCES';
    let banner = null;

    await expect(
      runFatalPhasesTransactional({
        tx,
        isUpsert: true,
        paths: snapshotPaths(),
        runPhases: mutateThen(boom),
        onRollback: (b) => { banner = b; },
      }),
    ).rejects.toThrow('Phase 4 exploded');

    // Every snapshot target is back to its seeded pre-upgrade content.
    expect(JSON.parse(fs.readFileSync(path.join(sinapseHome, 'metadata.json'), 'utf8')).version).toBe('1.0.0');
    expect(fs.readFileSync(path.join(sinapseHome, 'squad-old.txt'), 'utf8')).toBe('OLD-SQUAD');
    expect(fs.existsSync(path.join(sinapseHome, 'squad-new.txt'))).toBe(false);
    expect(fs.readFileSync(path.join(claudeAgents, 'old-agent.md'), 'utf8')).toBe('OLD-AGENT');
    expect(fs.existsSync(path.join(claudeAgents, 'new-agent.md'))).toBe(false);
    expect(fs.readFileSync(path.join(binDir, 'sinapse'), 'utf8')).toBe('OLD-LAUNCHER');

    // Transaction state + the snapshot is cleaned up after a rollback.
    expect(tx.isRolledBack).toBe(true);
    expect(tx.isCommitted).toBe(false);
    expect(fs.existsSync(tx.backupDir)).toBe(false);

    // The rollback banner (formatRollbackMessage output) was surfaced to the CLI.
    expect(typeof banner).toBe('string');
    expect(banner.toLowerCase()).toContain('rollback');
  });

  test('successful upgrade commits, keeps changes, leaves no orphan backup', async () => {
    const tx = makeTx();
    let rolledBack = false;

    const result = await runFatalPhasesTransactional({
      tx,
      isUpsert: true,
      paths: snapshotPaths(),
      runPhases: mutateThen(null),
      onRollback: () => { rolledBack = true; },
    });

    expect(result).toEqual({ ok: true });
    expect(rolledBack).toBe(false);
    expect(tx.isCommitted).toBe(true);
    expect(tx.isRolledBack).toBe(false);

    // The upgrade changes SURVIVE — commit must not revert them.
    expect(JSON.parse(fs.readFileSync(path.join(sinapseHome, 'metadata.json'), 'utf8')).version).toBe('2.0.0');
    expect(fs.existsSync(path.join(sinapseHome, 'squad-new.txt'))).toBe(true);
    expect(fs.existsSync(path.join(sinapseHome, 'squad-old.txt'))).toBe(false);
    expect(fs.readFileSync(path.join(claudeAgents, 'new-agent.md'), 'utf8')).toBe('NEW-AGENT');

    // No orphan backup left behind.
    expect(fs.existsSync(tx.backupDir)).toBe(false);
  });

  test('fresh install runs phases unwrapped — no backup, no commit, no rollback', async () => {
    const tx = makeTx();
    let ran = false;

    const result = await runFatalPhasesTransactional({
      tx,
      isUpsert: false,
      paths: snapshotPaths(),
      runPhases: () => { ran = true; return { fresh: true }; },
      onRollback: () => {},
    });

    expect(ran).toBe(true);
    expect(result).toEqual({ fresh: true });
    expect(tx.backups).toHaveLength(0);
    expect(tx.isCommitted).toBe(false);
    expect(tx.isRolledBack).toBe(false);
    expect(fs.existsSync(tx.backupDir)).toBe(false);
  });

  test('fresh install failure re-throws WITHOUT taking or restoring a backup', async () => {
    const tx = makeTx();
    let rolledBack = false;
    const err = new Error('fresh boom');

    await expect(
      runFatalPhasesTransactional({
        tx,
        isUpsert: false,
        paths: snapshotPaths(),
        runPhases: () => { throw err; },
        onRollback: () => { rolledBack = true; },
      }),
    ).rejects.toThrow('fresh boom');

    expect(rolledBack).toBe(false);
    expect(tx.isRolledBack).toBe(false);
    expect(tx.backups).toHaveLength(0);
  });

  test('backupGlobalState snapshots only existing paths (skips missing)', async () => {
    const tx = makeTx();
    const standalone = path.join(tmp, 'standalone.json');
    fs.writeFileSync(standalone, '{}');

    await backupGlobalState(tx, {
      dirs: [sinapseHome, path.join(tmp, 'ghost-dir'), claudeAgents],
      files: [standalone, path.join(tmp, 'ghost.json')],
    });

    // 2 existing dirs + 1 existing file = 3 backups; the two ghosts are skipped.
    expect(tx.backups).toHaveLength(3);
    const originals = tx.backups.map((b) => b.original);
    expect(originals).toContain(path.resolve(sinapseHome));
    expect(originals).toContain(path.resolve(claudeAgents));
    expect(originals).toContain(path.resolve(standalone));
  });

  test('createInstallTransaction targets the global install, not process.cwd()', () => {
    const tx = createInstallTransaction();
    const home = os.homedir();

    expect(tx.logFile).toBe(path.join(home, '.sinapse', '.sinapse-install.log'));
    expect(tx.backupDir.startsWith(path.join(home, '.sinapse-backup'))).toBe(true);

    // It must NOT fall back to the class's cwd-based defaults.
    expect(tx.logFile).not.toContain(process.cwd());
    expect(tx.backupDir).not.toContain(path.join(process.cwd(), '.sinapse-backup'));
  });

  test('buildTransactionPaths lists the dirs/files each IDE phase mutates', () => {
    const home = os.homedir();

    const both = buildTransactionPaths('both');
    expect(both.dirs).toContain(path.join(home, '.sinapse'));
    expect(both.dirs).toContain(path.join(home, '.claude', 'agents'));
    expect(both.dirs).toContain(path.join(home, '.codex', 'agents'));
    expect(both.dirs).toContain(path.join(home, 'bin'));
    expect(both.files).toContain(path.join(home, '.claude', 'settings.json'));

    // IDE-specific agent dirs are only snapshotted when that IDE is selected.
    const claude = buildTransactionPaths('claude-code');
    expect(claude.dirs).toContain(path.join(home, '.claude', 'agents'));
    expect(claude.dirs).not.toContain(path.join(home, '.codex', 'agents'));

    const codex = buildTransactionPaths('codex');
    expect(codex.dirs).toContain(path.join(home, '.codex', 'agents'));
    expect(codex.dirs).not.toContain(path.join(home, '.claude', 'agents'));
  });
});
