const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { audit, stageReferences, classify, safePath, namespaceDiagnostics, releaseGate } = require('../../scripts/framework-evolution/upstream-audit.cjs');

describe('offline upstream audit and reference staging', () => {
  let root, upstream, fork, stage;
  beforeEach(() => {
    root = fs.mkdtempSync(path.join(os.tmpdir(), 'sinapse-upstream-test-'));
    upstream = path.join(root, 'upstream'); fork = path.join(root, 'fork'); stage = path.join(root, 'stage');
    for (const directory of [upstream, fork, stage]) fs.mkdirSync(directory);
    fs.mkdirSync(path.join(upstream, 'docs'));
    fs.writeFileSync(path.join(upstream, 'LICENSE'), 'MIT License\nnotice');
    fs.writeFileSync(path.join(upstream, 'docs', 'example.md'), 'reference');
    fs.writeFileSync(path.join(upstream, 'payload.cjs'), 'throw new Error("never execute")');
  });
  afterEach(() => fs.rmSync(root, { recursive: true, force: true }));
  const provenance = { sha: 'a'.repeat(40) };
  test('inventories without executing upstream and reproduces hashes', () => {
    expect(audit(upstream, fork, provenance)).toEqual(audit(upstream, fork, provenance));
    expect(audit(upstream, fork, provenance).files).toHaveLength(3);
  });
  test.each(['.aiox-core/core/file.js', '.aiox-core/infrastructure/file.js', '.aiox-core/constitution.md', '.aiox-core/development/tasks/example.md', 'bin/aiox.js'])('protected mapping is denied: %s', (name) => expect(classify(name).decision).toBe('defer-protected-path'));
  test('requires pin and license', () => {
    expect(() => audit(upstream, fork, {})).toThrow('Pinned SHA');
    fs.writeFileSync(path.join(upstream, 'LICENSE'), 'proprietary');
    expect(() => audit(upstream, fork, provenance)).toThrow('MIT');
  });
  test('stages explicit docs with license; refuses code and overwrite', () => {
    const receipt = audit(upstream, fork, provenance);
    expect(() => stageReferences(upstream, stage, receipt, ['payload.cjs'])).toThrow('Only public references');
    expect(stageReferences(upstream, stage, receipt, ['docs/example.md'])).toHaveLength(2);
    expect(() => stageReferences(upstream, stage, receipt, ['docs/example.md'])).toThrow('overwrite');
    expect(fs.readFileSync(path.join(stage, 'LICENSE'), 'utf8')).toContain('notice');
  });
  test('tampering aborts before copying license', () => {
    const receipt = audit(upstream, fork, provenance);
    fs.writeFileSync(path.join(upstream, 'docs', 'example.md'), 'tampered');
    expect(() => stageReferences(upstream, stage, receipt, ['docs/example.md'])).toThrow('hash mismatch');
    expect(fs.readdirSync(stage)).toEqual([]);
  });
  test.each(['../outside', 'docs/../../outside', 'C:/secret', 'docs\\secret', '/absolute'])('rejects escaping path %s', (name) => expect(() => safePath(upstream, name)).toThrow());
  test('public Pro integration is not confused with a licensed Pro module', () => expect(classify('packages/installer/pro-setup.js').decision).toBe('exclude-pro-integration'));
  test('reports internal namespace/version drift without mutating manifests', () => {
    fs.mkdirSync(path.join(fork, '.sinapse-ai'));
    fs.writeFileSync(path.join(fork, 'package.json'), JSON.stringify({ name: 'sinapse-ai', version: '1.27.0' }));
    const original = JSON.stringify({ name: '@sinapse-fullstack/core', version: '4.31.1' });
    fs.writeFileSync(path.join(fork, '.sinapse-ai', 'package.json'), original);
    expect(namespaceDiagnostics(fork).findings).toHaveLength(3);
    expect(fs.readFileSync(path.join(fork, '.sinapse-ai', 'package.json'), 'utf8')).toBe(original);
  });
  test('release gate enforces root/lock/explicit wrapper lockstep and installed tar', () => {
    const write = (name, value) => { const target = path.join(fork, name); fs.mkdirSync(path.dirname(target), { recursive: true }); fs.writeFileSync(target, JSON.stringify(value)); };
    write('package.json', { version: '1.0.0', dependencies: { tar: '^7.5.22' } });
    write('package-lock.json', { version: '1.0.0', packages: { '': { version: '1.0.0' }, 'node_modules/tar': { version: '7.5.22' } } });
    write('node_modules/tar/package.json', { version: '7.5.22' });
    write('compat/wrapper/package.json', { version: '1.0.0' });
    expect(releaseGate(fork, ['compat/wrapper/package.json']).ok).toBe(true);
    write('compat/wrapper/package.json', { version: '0.9.0' });
    expect(releaseGate(fork, ['compat/wrapper/package.json']).errors).toContain('explicit-lockstep-version-drift:compat/wrapper/package.json');
    write('node_modules/tar/package.json', { version: '7.0.0' });
    expect(releaseGate(fork).errors).toContain('tar-installed-lockfile-drift');
    write('package.json', { version: '1.1.0' });
    expect(releaseGate(fork).errors).toEqual(expect.arrayContaining(['root-lockfile-version-drift', 'tar-direct-dependency-missing']));
  });
  test('records subtree license override and denies staging unknown licenses', () => {
    fs.writeFileSync(path.join(upstream, 'docs', 'LICENSE'), 'Custom terms');
    const receipt = audit(upstream, fork, provenance);
    expect(receipt.files.find((file) => file.path === 'docs/example.md').effectiveLicense.spdx).toBe('review-required');
    expect(() => stageReferences(upstream, stage, receipt, ['docs/example.md'])).toThrow('license review');
  });
  test('validates every file against pinned Git tree and rejects mismatches', () => {
    const baseline = audit(upstream, fork, provenance);
    const pinned = { ...provenance, gitTree: { sha: provenance.sha, truncated: false, blobs: baseline.files.map((file) => ({ path: file.path, sha: file.gitBlobSha1 })) } };
    expect(audit(upstream, fork, pinned).files).toHaveLength(3);
    pinned.gitTree.blobs[0].sha = '0'.repeat(40);
    expect(() => audit(upstream, fork, pinned)).toThrow('blob mismatch');
    pinned.gitTree.truncated = true;
    expect(() => audit(upstream, fork, pinned)).toThrow('identity/count mismatch');
  });
  test('accepts archive CRLF only under verified pinned attributes', () => {
    fs.writeFileSync(path.join(upstream, '.gitattributes'), '*.ps1 text eol=crlf\n');
    fs.writeFileSync(path.join(upstream, 'script.ps1'), 'Write-Output 1\n');
    const baseline = audit(upstream, fork, provenance);
    const pinned = { ...provenance, gitTree: { sha: provenance.sha, truncated: false, blobs: baseline.files.map((file) => ({ path: file.path, sha: file.gitBlobSha1 })) } };
    fs.writeFileSync(path.join(upstream, 'script.ps1'), 'Write-Output 1\r\n');
    expect(audit(upstream, fork, pinned).files.find((file) => file.path === 'script.ps1').gitTreeMatch).toBe('pinned-gitattributes-crlf-to-lf');
    fs.writeFileSync(path.join(upstream, '.gitattributes'), '*.ps1 text eol=lf\n');
    expect(() => audit(upstream, fork, pinned)).toThrow('blob mismatch');
  });
});
