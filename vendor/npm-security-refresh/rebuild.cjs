'use strict';
// Offline payload reconstruction from integrity-verified official input archives.
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const assert = require('node:assert/strict');
const tar = require('tar');
const manifest = require('./SOURCE-MANIFEST.json');
const repository = path.resolve(__dirname, '../..');
const input = path.resolve(process.argv[2] || '');
const output = path.resolve(process.argv[3] || '');
const privateRoot = path.join(repository, 'examples/framework-quality/output');
assert(process.argv[2] && process.argv[3], 'Usage: node rebuild.cjs <official-archive-directory> <new-private-output-directory>');
assert(output.startsWith(privateRoot + path.sep) && !fs.existsSync(output), 'Output must be a new private directory inside examples/framework-quality/output');
const sha = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
async function readArchive(entry) {
  const file = path.join(input, entry.filename);
  const bytes = fs.readFileSync(file);
  assert(bytes.length <= manifest.guards.maximumArchiveBytes);
  assert.equal('sha512-' + crypto.createHash('sha512').update(bytes).digest('base64'), entry.integrity);
  const files = new Map();
  let count = 0, total = 0;
  await new Promise((resolve, reject) => {
    const parser = tar.t({ onReadEntry(item) {
      assert(item.path === 'package' || item.path.startsWith('package/'));
      assert(!path.posix.isAbsolute(item.path) && !item.path.includes('\\') && !item.path.includes('\0') && !item.path.split('/').includes('..'));
      if (item.type === 'Directory') { item.resume(); return; }
      assert(['File', 'OldFile', 'ContiguousFile'].includes(item.type));
      total += item.size; count++;
      assert(item.size < 2000000 && total < manifest.guards.maximumUnpackedBytesPerInput && count < manifest.guards.maximumEntriesPerInput);
      const chunks = [];
      item.on('data', chunk => chunks.push(chunk));
      item.on('end', () => { const name = item.path.slice(8); assert(!files.has(name)); files.set(name, Buffer.concat(chunks)); });
    } });
    parser.once('error', reject);
    parser.once('end', resolve);
    parser.end(bytes);
  });
  return files;
}
(async () => {
  const sources = [];
  for (const entry of manifest.inputs) sources.push(await readArchive(entry));
  const upstream = sources[0], files = new Map(upstream);
  for (const component of sources.slice(1)) {
    const prefix = 'node_modules/' + JSON.parse(component.get('package.json')).name + '/';
    for (const name of [...files.keys()]) if (name.startsWith(prefix)) files.delete(name);
    for (const [name, bytes] of component) files.set(prefix + name, bytes);
  }
  const pkg = JSON.parse(files.get('package.json'));
  pkg.name = manifest.identity.name; pkg.version = manifest.identity.version;
  pkg.description = 'SINAPSE private development-only fork of npm11.19.1 with five verified upstream bundled security updates; not an official npm release';
  pkg.sinapseUpstream = { name: 'npm', version: '11.19.1', integrity: manifest.upstream.integrity, scope: 'private development dependency; no global npm or production publication' };
  files.set('package.json', Buffer.from(JSON.stringify(pkg, null, 2) + '\n'));
  assert.equal(files.size, manifest.packedFiles);
  const changes = new Map(manifest.deltas.map(delta => [delta.path, delta]));
  for (const name of new Set([...upstream.keys(), ...files.keys()])) {
    const current = files.get(name), old = upstream.get(name), delta = changes.get(name);
    if (delta) assert.equal(current ? sha(current) : null, delta.newSha256);
    else assert(old && current && old.equals(current), 'Unexpected payload delta ' + name);
  }
  fs.mkdirSync(output);
  for (const [name, bytes] of files) { const destination = path.resolve(output, 'package', ...name.split('/')); assert(destination.startsWith(path.join(output, 'package') + path.sep)); fs.mkdirSync(path.dirname(destination), { recursive: true }); fs.writeFileSync(destination, bytes, { flag: 'wx' }); }
  const artifact = path.join(output, manifest.artifact.path);
  await tar.c({ file: artifact, cwd: output, gzip: true, portable: true, mtime: new Date('2026-10-07T00:00:00Z') }, ['package']);
  console.log(JSON.stringify({ payloadFilesVerified: files.size, artifactSha256: sha(fs.readFileSync(artifact)), recordedArtifactSha256: manifest.artifact.sha256, offline: true }));
})().catch(error => { console.error(error.message); process.exitCode = 1; });
