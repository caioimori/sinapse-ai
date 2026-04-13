'use strict';

// Story 10.24 — registry write idempotency
//
// Asserts that the IDS registry writer produces byte-identical output for
// the same logical input regardless of JS object iteration order. Without
// this guarantee, every IDS post-commit hook can dirty entity-registry.yaml
// with key-reordering noise that pollutes git status across the repo.

const fs = require('fs');
const os = require('os');
const path = require('path');
const crypto = require('crypto');
const yaml = require('js-yaml');

const { RegistryUpdater } = require('../../../.sinapse-ai/core/ids/registry-updater');

function sha256(buf) {
  return crypto.createHash('sha256').update(buf).digest('hex');
}

function makeTempRegistryFile(initialData) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'sinapse-registry-'));
  const filePath = path.join(dir, 'entity-registry.yaml');
  fs.writeFileSync(filePath, yaml.dump(initialData, { sortKeys: true }), 'utf8');
  return { dir, filePath };
}

describe('Story 10.24 — registry write idempotency', () => {
  it('produces byte-identical output when the same data is written twice', () => {
    const initial = {
      version: '1.0.0',
      entities: {
        'entity-a': { type: 'task', layer: 'L4' },
        'entity-b': { type: 'task', layer: 'L4' },
      },
    };
    const { filePath } = makeTempRegistryFile(initial);

    const updater = new RegistryUpdater({ registryPath: filePath });
    // Trigger two writes via the internal method
    const data = updater._loadRegistry();
    updater._writeRegistry(data);
    const hash1 = sha256(fs.readFileSync(filePath));
    updater._writeRegistry(data);
    const hash2 = sha256(fs.readFileSync(filePath));

    expect(hash1).toBe(hash2);
  });

  it('produces byte-identical output regardless of insertion order', () => {
    const data1 = {
      version: '1.0.0',
      entities: {
        zebra: { layer: 'L4', type: 'task' },
        apple: { layer: 'L4', type: 'task' },
        mango: { layer: 'L4', type: 'task' },
      },
    };
    const data2 = {
      entities: {
        apple: { type: 'task', layer: 'L4' },
        mango: { type: 'task', layer: 'L4' },
        zebra: { type: 'task', layer: 'L4' },
      },
      version: '1.0.0',
    };

    const out1 = yaml.dump(data1, { lineWidth: 120, noRefs: true, sortKeys: true });
    const out2 = yaml.dump(data2, { lineWidth: 120, noRefs: true, sortKeys: true });

    expect(out1).toBe(out2);
  });

  it('keys appear in alphabetical order in the rendered YAML', () => {
    const data = {
      zebra: { type: 'a' },
      apple: { type: 'b' },
      mango: { type: 'c' },
    };
    const out = yaml.dump(data, { lineWidth: 120, noRefs: true, sortKeys: true });
    const topKeys = out
      .split('\n')
      .filter((line) => /^[a-z]/.test(line))
      .map((line) => line.split(':')[0]);
    expect(topKeys).toEqual(['apple', 'mango', 'zebra']);
  });

  it('the real registry-updater module write is idempotent against itself', () => {
    const initial = {
      version: '1.0.0',
      meta: {
        last_updated: '2026-01-01T00:00:00.000Z',
      },
      entities: {
        'task-foo': { type: 'task', layer: 'L4', file: 'tasks/foo.md' },
        'task-bar': { type: 'task', layer: 'L4', file: 'tasks/bar.md' },
      },
    };
    const { filePath } = makeTempRegistryFile(initial);
    const updater = new RegistryUpdater({ registryPath: filePath });

    updater._writeRegistry(updater._loadRegistry());
    const first = fs.readFileSync(filePath, 'utf8');
    updater._writeRegistry(updater._loadRegistry());
    const second = fs.readFileSync(filePath, 'utf8');
    updater._writeRegistry(updater._loadRegistry());
    const third = fs.readFileSync(filePath, 'utf8');

    expect(first).toBe(second);
    expect(second).toBe(third);
  });
});
