'use strict';

const fs = require('node:fs');
const path = require('node:path');
const os = require('node:os');
const crypto = require('node:crypto');
const { execFileSync } = require('node:child_process');
const { createRequire } = require('node:module');
const manifest = require('../../vendor/npm-security-refresh/SOURCE-MANIFEST.json');
const repository = path.resolve(__dirname, '../..');
const installedRoot = path.join(repository, 'node_modules/npm');
const sha256 = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
const bundled = name => path.join(installedRoot, 'node_modules', name);
function cleanupOwnedSandbox(temporaryRoot, sandbox) {
  const relative = path.relative(temporaryRoot, sandbox);
  if (!relative || relative.startsWith('..') || path.isAbsolute(relative) || !path.basename(sandbox).startsWith('sinapse-npm-fork-')) {
    throw new Error('Refusing cleanup outside the owned temporary directory');
  }
  fs.rmSync(sandbox, { recursive: true, force: true });
}

describe('actual installed project development npm fork', () => {
  test('installs the reviewed identity and all changed payload bytes', () => {
    const pkg = JSON.parse(fs.readFileSync(path.join(installedRoot, 'package.json'), 'utf8'));
    expect(pkg.name).toBe(manifest.identity.name);
    expect(pkg.version).toBe(manifest.identity.version);
    expect(pkg.engines).toEqual(manifest.inputs[0].engines);
    expect(sha256(fs.readFileSync(path.join(repository, 'vendor/npm-security-refresh', manifest.artifact.path))))
      .toBe(manifest.artifact.sha256);
    const actualRoot = fs.realpathSync(installedRoot);
    const npmRequire = createRequire(path.join(actualRoot, 'package.json'));
    for (const input of manifest.inputs.slice(1)) {
      const separator = input.spec.lastIndexOf('@');
      const name = input.spec.slice(0, separator);
      const version = input.spec.slice(separator + 1);
      expect(JSON.parse(fs.readFileSync(path.join(bundled(name), 'package.json'), 'utf8')).version).toBe(version);
      expect(fs.realpathSync(npmRequire.resolve(name)).startsWith(actualRoot + path.sep)).toBe(true);
    }
    for (const delta of manifest.deltas) {
      const file = path.resolve(installedRoot, ...delta.path.split('/'));
      expect(file.startsWith(path.resolve(installedRoot) + path.sep)).toBe(true);
      if (delta.newSha256 === null) expect(fs.existsSync(file)).toBe(false);
      else expect(sha256(fs.readFileSync(file))).toBe(delta.newSha256);
    }
  });

  test('runs the installed CLI with owned offline config, prefix and cache', () => {
    const temporaryRoot = fs.realpathSync(os.tmpdir());
    const sandbox = fs.realpathSync(fs.mkdtempSync(path.join(temporaryRoot, 'sinapse-npm-fork-')));
    const prefix = path.join(sandbox, 'prefix');
    fs.mkdirSync(prefix);
    for (const name of ['user.npmrc', 'global.npmrc']) {
      fs.writeFileSync(path.join(sandbox, name), '# isolated test configuration\n', { flag: 'wx' });
    }
    try {
      const config = ['--offline', '--ignore-scripts', '--no-audit', '--no-fund',
        '--userconfig=' + path.join(sandbox, 'user.npmrc'),
        '--globalconfig=' + path.join(sandbox, 'global.npmrc'),
        '--prefix=' + prefix, '--cache=' + path.join(sandbox, 'cache')];
      const cli = args => execFileSync(process.execPath, [path.join(installedRoot, 'bin/npm-cli.js'), ...args, ...config], {
        cwd: sandbox, encoding: 'utf8', timeout: 10000, maxBuffer: 100000,
      }).trim();
      expect(cli(['--version'])).toBe(manifest.identity.version);
      expect(fs.realpathSync(cli(['config', 'get', 'prefix']))).toBe(fs.realpathSync(prefix));
    } finally {
      cleanupOwnedSandbox(temporaryRoot, sandbox);
    }
  }, 30000);

  test('executes the five actual bundled components with bounded benign inputs and no network', async () => {
    const brace = require(bundled('brace-expansion'));
    expect(brace.expand('owned/{a,b}/{1..2}')).toEqual(['owned/a/1', 'owned/a/2', 'owned/b/1', 'owned/b/2']);
    const Policy = require(bundled('http-cache-semantics'));
    const request = { url: 'https://fixture.invalid/owned', method: 'GET', headers: {} };
    const policy = new Policy(request, { status: 200, headers: {
      'cache-control': 'public,max-age=60', date: new Date().toUTCString(),
    } });
    expect(policy.storable()).toBe(true);
    expect(policy.satisfiesWithoutRevalidation(request)).toBe(true);
    const { Address4, Address6 } = require(bundled('ip-address'));
    expect(new Address4('192.0.2.1').correctForm()).toBe('192.0.2.1');
    expect(new Address6('2001:db8::1').correctForm()).toBe('2001:db8::1');
    const selector = require(bundled('postcss-selector-parser'));
    expect(selector().astSync('a[href="owned"], .card > span').nodes).toHaveLength(2);
    const undici = require(bundled('undici'));
    expect(new undici.Headers({ 'x-owned': 'fixture' }).get('x-owned')).toBe('fixture');
    const agent = new undici.MockAgent();
    agent.disableNetConnect();
    try {
      agent.get('https://fixture.invalid').intercept({ path: '/owned', method: 'GET' }).reply(200, 'owned-fixture');
      const response = await agent.request({ origin: 'https://fixture.invalid', path: '/owned', method: 'GET' });
      expect(await response.body.text()).toBe('owned-fixture');
      await expect(agent.request({ origin: 'https://unregistered.invalid', path: '/', method: 'GET' })).rejects.toThrow();
    } finally {
      await agent.close();
    }
  });
});
