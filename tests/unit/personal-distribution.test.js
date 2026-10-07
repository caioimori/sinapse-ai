'use strict';
const fs = require('node:fs');
const path = require('node:path');
const os = require('node:os');
const {applyPlan, validatePlan, readPriorDelivery, canonicalUpdateOrigin, digest, sha, RECEIPT} = require('../../scripts/expert-evolution/personal-distribution.cjs');

describe('delimited personal distribution', () => {
  let home, root;
  beforeEach(() => {
    root = fs.realpathSync.native(fs.mkdtempSync(path.join(os.tmpdir(), 'sinapse-personal-source-')));
    home = fs.realpathSync.native(fs.mkdtempSync(path.join(os.tmpdir(), 'sinapse-personal-home-')));
    fs.mkdirSync(path.join(home, '.sinapse')); fs.writeFileSync(path.join(root, 'input.txt'), 'frozen');
  });
  afterEach(() => {
    for (const dir of [home, root]) {
      if (path.dirname(path.resolve(dir)) !== fs.realpathSync.native(os.tmpdir()) || !/^sinapse-personal-(?:source|home)-/.test(path.basename(dir))) throw new Error('Unsafe fixture cleanup');
      fs.rmSync(dir, {recursive: true, force: true});
    }
  });
  function entry(relative, content, old = null) {
    if (old !== null) { const f = path.join(home, relative); fs.mkdirSync(path.dirname(f), {recursive: true}); fs.writeFileSync(f, old); }
    return {path: relative, content: Buffer.from(content).toString('base64'), sha256: sha(content), expectedDigest: old === null ? null : sha(old)};
  }
  function plan(entries) {
    return {schemaVersion: 1, transactionId: 'fixture', root, home, sources: [{path: 'input.txt', sha256: sha('frozen')}], homeInputs: [],
      entries, files: entries.map(e => ({path: e.path, sha256: e.sha256})), receiptExpected: null,
      canonical: {matched: 172, updatedFromBaseline: 0}, bindingCount: 1, preservation: {settings: true}, restartRequired: ['new context']};
  }
  test('delivers bounded bytes and confirms receipt while preserving settings', () => {
    fs.mkdirSync(path.join(home, '.codex')); fs.writeFileSync(path.join(home, '.codex/config.toml'), 'personal');
    const result = applyPlan(plan([entry('.sinapse/scripts/framework-evolution/runtime.cjs', 'extension')]));
    expect(result.status).toBe('installed-bounded'); expect(result.nativeAgentExecutionObserved).toBe(false);
    expect(fs.readFileSync(path.join(home, RECEIPT), 'utf8')).toContain('installed-bounded');
    expect(fs.readFileSync(path.join(home, '.codex/config.toml'), 'utf8')).toBe('personal');
  });
  test('blocks a source changed after the plan without mutation', () => {
    const p = plan([entry('.sinapse/research/expert-evolution/test.json', 'new')]); fs.writeFileSync(path.join(root, 'input.txt'), 'changed');
    expect(() => applyPlan(p)).toThrow('Source changed'); expect(fs.existsSync(path.join(home, RECEIPT))).toBe(false);
  });
  test('blocks a concurrently edited destination during preflight', () => {
    const p = plan([entry('.sinapse/research/expert-evolution/test.json', 'new', 'old')]); fs.writeFileSync(path.join(home, p.entries[0].path), 'personal');
    expect(() => applyPlan(p)).toThrow('destination changed'); expect(fs.readFileSync(path.join(home, p.entries[0].path), 'utf8')).toBe('personal');
  });
  test('restores changed file and removes only own new file after failure', () => {
    const p = plan([entry('.sinapse/research/expert-evolution/a.json', 'new', 'old'), entry('.sinapse/research/expert-evolution/b.json', 'new')]);
    expect(() => applyPlan(p, {afterWrite: e => {if (e.path.endsWith('b.json')) throw new Error('fixture failure');}})).toThrow('fixture failure');
    expect(fs.readFileSync(path.join(home, p.entries[0].path), 'utf8')).toBe('old'); expect(fs.existsSync(path.join(home, p.entries[1].path))).toBe(false);
  });
  test('preserves concurrent changes during recovery and records blocked path', () => {
    const p = plan([entry('.sinapse/research/expert-evolution/a.json', 'new', 'old')]); let error;
    try { applyPlan(p, {afterWrite: e => {if (e.path === p.entries[0].path) {fs.writeFileSync(path.join(home, e.path), 'concurrent'); throw new Error('fixture failure');}}}); } catch (caught) {error = caught;}
    expect(error.blockedFiles).toEqual([p.entries[0].path]); expect(fs.readFileSync(path.join(home, p.entries[0].path), 'utf8')).toBe('concurrent');
  });
  test('CAS catches a race between preflight and write', () => {
    const p = plan([entry('.sinapse/research/expert-evolution/a.json', 'new', 'old')]);
    expect(() => applyPlan(p, {beforeWrite: e => {if (e.path === p.entries[0].path) fs.writeFileSync(path.join(home, e.path), 'race');}})).toThrow('concurrently modified');
    expect(fs.readFileSync(path.join(home, p.entries[0].path), 'utf8')).toBe('race');
  });
  test.each(['../outside.json', '.codex/config.toml', '.sinapse/core/agents/devops.md', '.claude/agents/devops.md', '.sinapse/scripts/../../.codex/config.toml', '.sinapse/scripts/file.txt:stream'])('rejects protected/escaping destination %s', relative => {
    expect(() => validatePlan(plan([{path: relative, content: Buffer.from('x').toString('base64'), sha256: sha('x'), expectedDigest: null}]))).toThrow();
  });
  test('rejects duplicate and corrupt staged bytes', () => {
    const e = entry('.sinapse/research/expert-evolution/test.json', 'new');
    expect(() => validatePlan(plan([e, e]))).toThrow('Invalid personal extension');
    expect(() => validatePlan(plan([{...e, content: Buffer.from('bad').toString('base64')}]))).toThrow('Corrupt');
  });
  test('refuses a destination ancestor symlink', () => {
    fs.symlinkSync(root, path.join(home, '.sinapse/research'), process.platform === 'win32' ? 'junction' : 'dir');
    expect(() => applyPlan(plan([{path: '.sinapse/research/x.json', content: Buffer.from('x').toString('base64'), sha256: sha('x'), expectedDigest: null}]))).toThrow('symlink');
  });
  function ownedCanonical() {
    const installed = '.sinapse/squad-design/agents/dx-frontend-engineer.md';
    applyPlan(plan([entry(installed, 'managed-v1')]));
    return {installed, prior: readPriorDelivery(home)};
  }
  test('accepts a completed prior receipt and CAS updates its owned canonical in a second transaction', () => {
    const {installed, prior} = ownedCanonical();
    expect(canonicalUpdateOrigin({home, installed, existing: sha('managed-v1'), baselineDigest: sha('baseline'), prior})).toBe('receipt');
    const next = plan([entry(installed, 'managed-v2', 'managed-v1')]); next.transactionId = 'fixture-second';
    next.receiptExpected = prior.receiptDigest; next.homeInputs = [{path: prior.journalRelative, sha256: prior.journalDigest}];
    const result = applyPlan(next);
    expect(result.status).toBe('installed-bounded'); expect(fs.readFileSync(path.join(home, installed), 'utf8')).toBe('managed-v2');
    const saved = readPriorDelivery(home);
    expect(saved.receipt.transactionId).toBe('fixture-second'); expect(saved.written.get(installed).sha256).toBe(sha('managed-v2'));
  });
  test('retains receipt ownership after an identical guarded canonical write', () => {
    const {installed, prior} = ownedCanonical();
    const next = plan([entry(installed, 'managed-v1', 'managed-v1')]); next.transactionId = 'fixture-second'; next.receiptExpected = prior.receiptDigest;
    applyPlan(next);
    const saved = readPriorDelivery(home);
    expect(canonicalUpdateOrigin({home, installed, existing: sha('managed-v1'), baselineDigest: null, prior: saved})).toBe('receipt');
  });
  test('blocks a tampered receipt instead of trusting its ownership hashes', () => {
    ownedCanonical(); const file = path.join(home, RECEIPT), receipt = JSON.parse(fs.readFileSync(file)); receipt.installedAt = 'tampered'; fs.writeFileSync(file, JSON.stringify(receipt));
    expect(() => readPriorDelivery(home)).toThrow('receipt/journal hash mismatch');
  });
  test('blocks a journal marked incomplete', () => {
    const {prior} = ownedCanonical(); const file = path.join(home, prior.journalRelative), journal = JSON.parse(fs.readFileSync(file)); journal.status = 'committing'; fs.writeFileSync(file, JSON.stringify(journal));
    expect(() => readPriorDelivery(home)).toThrow('not completed');
  });
  test('blocks journal staged bytes that no longer match their hash', () => {
    const {installed, prior} = ownedCanonical(); const file = path.join(home, prior.journalRelative), journal = JSON.parse(fs.readFileSync(file)); journal.entries.find(e => e.path === installed).content = Buffer.from('tampered').toString('base64'); fs.writeFileSync(file, JSON.stringify(journal));
    expect(() => readPriorDelivery(home)).toThrow('Invalid prior completed journal entry');
  });
  test('blocks an unsafe prior transaction ID before traversing a journal path', () => {
    ownedCanonical(); const file = path.join(home, RECEIPT), receipt = JSON.parse(fs.readFileSync(file)); receipt.transactionId = '../outside'; fs.writeFileSync(file, JSON.stringify(receipt));
    expect(() => readPriorDelivery(home)).toThrow('Invalid prior');
  });
  test('preserves a personal canonical divergence even with a valid ownership receipt', () => {
    const {installed, prior} = ownedCanonical(); fs.writeFileSync(path.join(home, installed), 'personal');
    expect(() => canonicalUpdateOrigin({home, installed, existing: sha('personal'), baselineDigest: sha('baseline'), prior})).toThrow('Preserving modified');
    expect(fs.readFileSync(path.join(home, installed), 'utf8')).toBe('personal');
  });
  test('blocks a canonical race after prior ownership was checked', () => {
    const {installed, prior} = ownedCanonical(); const existing = digest(home, installed); fs.writeFileSync(path.join(home, installed), 'race');
    expect(() => canonicalUpdateOrigin({home, installed, existing, baselineDigest: null, prior})).toThrow('Canonical changed');
  });
  test('does not let a valid receipt grant ownership of protected core definitions', () => {
    const {prior} = ownedCanonical();
    expect(() => canonicalUpdateOrigin({home, installed: '.sinapse/core/agents/devops.md', existing: null, baselineDigest: null, prior})).toThrow('Protected');
  });
  test('blocks a prior journal edited between plan freeze and second application', () => {
    const {installed, prior} = ownedCanonical(), next = plan([entry(installed, 'managed-v2', 'managed-v1')]); next.transactionId = 'fixture-second'; next.receiptExpected = prior.receiptDigest;
    next.homeInputs = [{path: prior.journalRelative, sha256: prior.journalDigest}]; fs.appendFileSync(path.join(home, prior.journalRelative), ' ');
    expect(() => applyPlan(next)).toThrow('changed after personal plan freeze'); expect(fs.readFileSync(path.join(home, installed), 'utf8')).toBe('managed-v1');
  });
  test('does not adopt and overwrite a journal changed by another writer after a payload write', () => {
    const p = plan([entry('.sinapse/research/expert-evolution/a.json', 'new', 'old')]);
    const journalPath = path.join(home, '.sinapse/backups/expert-evolution/fixture/journal.json'); let concurrentBytes, error;
    try {
      applyPlan(p, {afterWrite: e => {
        if (e.path !== p.entries[0].path) return;
        concurrentBytes = fs.readFileSync(journalPath, 'utf8') + '\nconcurrent journal edit\n'; fs.writeFileSync(journalPath, concurrentBytes);
      }});
    } catch (caught) {error = caught;}
    expect(error.message).toContain('concurrently modified'); expect(error.recovery.journalPreserved).toBe(true);
    expect(fs.readFileSync(journalPath, 'utf8')).toBe(concurrentBytes);
    expect(fs.readFileSync(path.join(home, p.entries[0].path), 'utf8')).toBe('old');
    expect(fs.existsSync(path.join(home, RECEIPT))).toBe(false);
    const evidence = JSON.parse(fs.readFileSync(path.join(home, error.recovery.evidencePath), 'utf8'));
    expect(evidence.originalError.message).toBe(error.message); expect(evidence.blockedFiles).toContain('.sinapse/backups/expert-evolution/fixture/journal.json');
  });
  test('keeps the original failure and independent evidence when recovery cannot update a changed journal', () => {
    const p = plan([entry('.sinapse/research/expert-evolution/a.json', 'new', 'old')]);
    const journalPath = path.join(home, '.sinapse/backups/expert-evolution/fixture/journal.json'); let error;
    try {
      applyPlan(p, {afterWrite: e => {
        if (e.path !== p.entries[0].path) return;
        fs.writeFileSync(journalPath, 'concurrent journal'); throw new Error('original fixture failure');
      }});
    } catch (caught) {error = caught;}
    expect(error.message).toBe('original fixture failure'); expect(fs.readFileSync(journalPath, 'utf8')).toBe('concurrent journal');
    const evidence = JSON.parse(fs.readFileSync(path.join(home, error.recovery.evidencePath), 'utf8'));
    expect(evidence.originalError.message).toBe('original fixture failure'); expect(evidence.status).toBe('recovery-blocked');
  });
  test.each(['directory', 'symlink'])('continues restoring safe earlier entries when a later destination becomes a %s', kind => {
    const p = plan([entry('.sinapse/research/expert-evolution/a.json', 'new-a', 'old-a'), entry('.sinapse/research/expert-evolution/b.json', 'new-b')]);
    const second = path.join(home, p.entries[1].path); let error;
    try {
      applyPlan(p, {afterWrite: e => {
        if (e.path !== p.entries[1].path) return;
        fs.unlinkSync(second);
        if (kind === 'directory') fs.mkdirSync(second);
        else fs.symlinkSync(root, second, process.platform === 'win32' ? 'junction' : 'dir');
        throw new Error('second destination replaced');
      }});
    } catch (caught) {error = caught;}
    expect(error.message).toBe('second destination replaced'); expect(error.blockedFiles).toEqual([p.entries[1].path]);
    expect(fs.readFileSync(path.join(home, p.entries[0].path), 'utf8')).toBe('old-a');
    expect(fs.lstatSync(second)[kind === 'directory' ? 'isDirectory' : 'isSymbolicLink']()).toBe(true);
    const journal = JSON.parse(fs.readFileSync(path.join(home, '.sinapse/backups/expert-evolution/fixture/journal.json'), 'utf8'));
    expect(journal.status).toBe('recovery-blocked'); expect(journal.blockedFiles).toEqual([p.entries[1].path]);
    expect(journal.originalError.message).toBe('second destination replaced'); expect(journal.entries[0].state).toBe('restored');
  });
  test('first journal write expects absence and preserves an existing journal', () => {
    const p = plan([entry('.sinapse/research/expert-evolution/a.json', 'new', 'old')]);
    const journalPath = path.join(home, '.sinapse/backups/expert-evolution/fixture/journal.json'); fs.mkdirSync(path.dirname(journalPath), {recursive: true}); fs.writeFileSync(journalPath, 'existing journal');
    expect(() => applyPlan(p)).toThrow('concurrently modified'); expect(fs.readFileSync(journalPath, 'utf8')).toBe('existing journal');
    expect(fs.readFileSync(path.join(home, p.entries[0].path), 'utf8')).toBe('old');
  });
});
