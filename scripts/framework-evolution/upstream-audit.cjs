'use strict';

// Offline audit only. Never loads or executes a file from the upstream tree.
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const hash = (bytes) => crypto.createHash('sha256').update(bytes).digest('hex');
const PROTECTED = /^(?:\.sinapse-ai\/(?:core\/|infrastructure\/|constitution\.md$|development\/(?:tasks|templates|checklists|workflows)\/)|bin\/sinapse[^/]*\.js$)/i;

function safePath(root, relative) {
  if (typeof relative !== 'string' || !relative || relative.includes('\\') || relative.includes(':') || relative.split('/').some((p) => p === '..' || p === '.' || !p)) throw new Error('Unsafe relative path');
  const base = path.resolve(root);
  const target = path.resolve(base, relative);
  if (!target.startsWith(base + path.sep)) throw new Error('Path escapes root');
  let current = base;
  if (fs.lstatSync(base).isSymbolicLink()) throw new Error('Symlink root denied');
  for (const part of relative.split('/')) {
    current = path.join(current, part);
    if (fs.existsSync(current) && fs.lstatSync(current).isSymbolicLink()) throw new Error('Symlink denied');
  }
  return target;
}

function mappedPath(relative) {
  return relative.replace(/^\.aiox-core\//, '.sinapse-ai/').replace(/^bin\/aiox([^/]*)\.js$/, 'bin/sinapse$1.js');
}

function classify(relative) {
  const mapped = mappedPath(relative);
  if (PROTECTED.test(mapped)) return { classification: 'protected', decision: 'defer-protected-path' };
  if (/(?:^|\/)(?:pro|aiox-pro|pro-setup|pro-license)(?:[/.-]|$)/i.test(relative) || /proprietary/i.test(relative)) return { classification: 'pro-integration-public', decision: 'exclude-pro-integration' };
  if (relative === 'LICENSE' || /^docs\/.*\.md$/i.test(relative)) return { classification: 'public-reference', decision: 'stage-reference-only' };
  return { classification: 'public-code-or-config', decision: 'review-before-adaptation' };
}

function audit(snapshotRoot, forkRoot, provenance) {
  if (!/^[a-f0-9]{40}$/.test(provenance.sha || '')) throw new Error('Pinned SHA required');
  const files = [];
  function walk(relative = '') {
    const directory = relative ? safePath(snapshotRoot, relative) : path.resolve(snapshotRoot);
    for (const entry of fs.readdirSync(directory, { withFileTypes: true }).sort((a, b) => a.name.localeCompare(b.name))) {
      const name = relative ? `${relative}/${entry.name}` : entry.name;
      const source = safePath(snapshotRoot, name);
      if (entry.isDirectory()) walk(name);
      else if (entry.isFile()) {
        const bytes = fs.readFileSync(source);
        const targetPath = mappedPath(name);
        const target = safePath(forkRoot, targetPath);
        const forkHash = fs.existsSync(target) && fs.statSync(target).isFile() ? hash(fs.readFileSync(target)) : null;
        const gitBlobSha1 = crypto.createHash('sha1').update(Buffer.from(`blob ${bytes.length}\0`)).update(bytes).digest('hex');
        files.push({ path: name, sha256: hash(bytes), gitBlobSha1, bytes: bytes.length, sinapsePath: targetPath, forkSha256: forkHash, comparison: forkHash === hash(bytes) ? 'identical' : forkHash ? 'different' : 'absent', ...classify(name) });
      } else throw new Error(`Non-regular file denied: ${name}`);
    }
  }
  walk();
  if (provenance.gitTree) {
    const tree = provenance.gitTree;
    if (tree.truncated !== false || tree.sha !== provenance.sha || !Array.isArray(tree.blobs) || tree.blobs.length !== files.length || new Set(tree.blobs.map((blob) => blob.path)).size !== files.length) throw new Error('Git tree identity/count mismatch');
    const expected = new Map(tree.blobs.map((blob) => [blob.path, blob.sha]));
    for (const file of files) {
      if (file.gitBlobSha1 === expected.get(file.path)) { file.gitTreeMatch = 'exact'; continue; }
      // GitHub archives honor the pinned .gitattributes eol=crlf for Windows scripts.
      const attributes = files.find((item) => item.path === '.gitattributes');
      const extension = path.posix.extname(file.path);
      const trustedAttributes = attributes && attributes.gitBlobSha1 === expected.get('.gitattributes');
      const declared = trustedAttributes && fs.readFileSync(safePath(snapshotRoot, '.gitattributes'), 'utf8').split(/\r?\n/).includes(`*${extension} text eol=crlf`);
      if (!declared || !['.ps1', '.cmd', '.bat'].includes(extension)) throw new Error('Git tree blob mismatch');
      const normalized = Buffer.from(fs.readFileSync(safePath(snapshotRoot, file.path), 'utf8').replace(/\r\n/g, '\n'));
      const canonical = crypto.createHash('sha1').update(Buffer.from(`blob ${normalized.length}\0`)).update(normalized).digest('hex');
      if (canonical !== expected.get(file.path)) throw new Error('Git tree blob mismatch');
      file.gitTreeMatch = 'pinned-gitattributes-crlf-to-lf';
      file.canonicalGitBlobSha1 = canonical;
    }
  }
  const licenses = files.filter((file) => /(?:^|\/)LICENSE(?:\.txt|\.md)?$/i.test(file.path)).map((file) => {
    const content = fs.readFileSync(safePath(snapshotRoot, file.path), 'utf8');
    return { path: file.path, sha256: file.sha256, scope: path.posix.dirname(file.path), spdx: content.includes('Apache License') ? 'Apache-2.0' : content.startsWith('MIT License') ? 'MIT' : 'review-required' };
  });
  for (const file of files) {
    const applicable = licenses.filter((license) => license.scope === '.' || file.path.startsWith(license.scope + '/')).sort((a, b) => b.scope.length - a.scope.length)[0];
    file.effectiveLicense = { path: applicable.path, sha256: applicable.sha256, spdx: applicable.spdx };
  }
  const license = files.find((file) => file.path === 'LICENSE');
  if (!license || !fs.readFileSync(safePath(snapshotRoot, 'LICENSE'), 'utf8').startsWith('MIT License')) throw new Error('Expected MIT LICENSE missing');
  return { schemaVersion: 1, provenance, license: { spdx: 'MIT', sha256: license.sha256, noticeRequired: true }, ancestralDelta: { status: 'not-established', reason: 'No trusted common ancestor established; comparison is current mapped tree only.' }, namespaceDiagnostics: namespaceDiagnostics(forkRoot), files, summary: files.reduce((counts, file) => { counts[file.decision] = (counts[file.decision] || 0) + 1; return counts; }, {}) };
}

function namespaceDiagnostics(forkRoot) {
  const rootFile = safePath(forkRoot, 'package.json');
  const internalFile = safePath(forkRoot, '.sinapse-ai/package.json');
  if (!fs.existsSync(rootFile) || !fs.existsSync(internalFile)) return { status: 'unavailable', findings: ['Manifest pair not present'] };
  const root = JSON.parse(fs.readFileSync(rootFile, 'utf8'));
  const internal = JSON.parse(fs.readFileSync(internalFile, 'utf8'));
  const findings = [];
  if (root.version !== internal.version) findings.push('internal-version-differs-from-root');
  if (internal.private !== true) findings.push('internal-manifest-not-private');
  if (!internal.name?.endsWith('-internal')) findings.push('internal-name-without-internal-suffix');
  return { status: findings.length ? 'review-required' : 'aligned', root: { name: root.name, version: root.version }, internal: { name: internal.name, version: internal.version, private: internal.private === true }, findings, policy: 'Upstream-inspired diagnostic only; SINAPSE version policy requires maintainer decision.' };
}

function releaseGate(forkRoot, lockstepManifests = []) {
  const read = (relative) => JSON.parse(fs.readFileSync(safePath(forkRoot, relative), 'utf8'));
  const root = read('package.json');
  const lock = read('package-lock.json');
  const errors = [];
  if (root.version !== lock.version || root.version !== lock.packages?.['']?.version) errors.push('root-lockfile-version-drift');
  for (const relative of lockstepManifests) {
    if (read(relative).version !== root.version) errors.push(`explicit-lockstep-version-drift:${relative}`);
  }
  if (!root.dependencies?.tar) errors.push('tar-direct-dependency-missing');
  const lockedTar = lock.packages?.['node_modules/tar']?.version;
  try {
    const installedTar = read('node_modules/tar/package.json').version;
    if (!lockedTar || installedTar !== lockedTar) errors.push('tar-installed-lockfile-drift');
  } catch { errors.push('tar-not-installed'); }
  return { ok: errors.length === 0, version: root.version, lockedTar, checkedLockstepManifests: lockstepManifests, errors, internalManifestPolicy: 'Legacy internal manifest is excluded unless explicitly selected.' };
}

function stageReferences(snapshotRoot, destination, receipt, selection) {
  // Complete validation precedes writes; exclusive create prevents silent overwrites.
  if (!Array.isArray(selection) || !selection.length || new Set(selection).size !== selection.length) throw new Error('Unique explicit selection required');
  const chosen = [...new Set(['LICENSE', ...selection])].map((relative) => {
    const file = receipt.files.find((item) => item.path === relative);
    if (!file || classify(relative).decision !== 'stage-reference-only') throw new Error('Only public references can be staged');
    if (file.effectiveLicense.spdx !== 'MIT') throw new Error('Non-MIT reference requires separate license review');
    const source = safePath(snapshotRoot, relative);
    const bytes = fs.readFileSync(source);
    if (hash(bytes) !== file.sha256) throw new Error('Snapshot hash mismatch');
    const target = safePath(destination, relative);
    if (fs.existsSync(target)) throw new Error('Destination exists; overwrite denied');
    return { bytes, target, relative, sha256: file.sha256 };
  });
  for (const item of chosen) {
    fs.mkdirSync(path.dirname(item.target), { recursive: true });
    fs.writeFileSync(item.target, item.bytes, { flag: 'wx' });
  }
  return chosen.map(({ relative, sha256 }) => ({ path: relative, sha256, purpose: 'reference-only; not installed or executable' }));
}

if (require.main === module) {
  try {
    if (process.argv[2] === '--gate') {
      const result = releaseGate(process.argv[3], process.argv.slice(4));
      process.stdout.write(JSON.stringify(result) + '\n');
      process.exitCode = result.ok ? 0 : 1;
    } else {
      const [snapshot, fork, provenanceFile, output, staging, ...selection] = process.argv.slice(2);
      if (!snapshot || !fork || !provenanceFile || !output) throw new Error('Usage: node upstream-audit.cjs SNAPSHOT FORK PROVENANCE_JSON OUTPUT_JSON [EXISTING_STAGE_DIRECTORY DOC_PATH...]');
      const receipt = audit(snapshot, fork, JSON.parse(fs.readFileSync(provenanceFile, 'utf8')));
      if (staging) receipt.staged = stageReferences(snapshot, staging, receipt, selection);
      fs.writeFileSync(output, JSON.stringify(receipt, null, 2) + '\n', { flag: 'wx' });
      process.stdout.write(JSON.stringify({ files: receipt.files.length, summary: receipt.summary }) + '\n');
    }
  } catch (error) { process.stderr.write(error.message + '\n'); process.exitCode = 1; }
}
module.exports = { audit, stageReferences, classify, safePath, mappedPath, namespaceDiagnostics, releaseGate };
