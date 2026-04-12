// File: tests/code-intel/registry-syncer-idempotency.test.js

/**
 * Registry Syncer Idempotency Tests (Story 10.15)
 *
 * Integration-style tests that use a REAL filesystem (temp dir) and a stub
 * code-intel client. The goal is to validate the content-hash idempotency
 * guarantee introduced in Story 10.15:
 *
 *   AC 6: When no structural change occurred, sync() must NOT rewrite
 *         entity-registry.yaml on disk (mtime stable, content stable).
 *   AC 7: When content genuinely changes, sync() DOES write normally and
 *         refreshes metadata.lastUpdated.
 *
 * Notes:
 * - We construct RegistrySyncer with a minimal registry via a temp file
 *   and pass a stub client that resolves with stable, deterministic data.
 * - A tiny wait between sync() calls ensures mtime resolution on all
 *   platforms (Windows filesystem mtime granularity is ~10ms).
 */

'use strict';

const fs = require('fs');
const os = require('os');
const path = require('path');
const yaml = require('js-yaml');

const { RegistrySyncer } = require('../../.sinapse-ai/core/code-intel/registry-syncer');

function makeTempRegistry() {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'sinapse-registry-'));
  const registryPath = path.join(dir, 'entity-registry.yaml');

  const initial = {
    metadata: {
      version: '1.0.0',
      lastUpdated: '2026-04-01T00:00:00.000Z',
      entityCount: 1,
    },
    categories: ['tasks'],
    entities: {
      tasks: {
        'dev-develop-story': {
          path: '.sinapse-ai/development/tasks/dev-develop-story.md',
          type: 'task',
          purpose: 'Develop story',
          keywords: ['develop', 'story'],
          usedBy: [],
          dependencies: [],
          // Pre-populate metadata with a lastSynced far in the future so the
          // incremental-skip logic never re-enriches (we want to isolate the
          // idempotency behavior from enrichment-driven changes).
          codeIntelMetadata: {
            callerCount: 0,
            role: 'task',
            lastSynced: '2099-12-31T23:59:59.000Z',
            provider: 'stub',
          },
        },
      },
    },
  };

  fs.writeFileSync(registryPath, yaml.dump(initial, { lineWidth: 120, noRefs: true }), 'utf8');
  return { dir, registryPath };
}

function stubClient() {
  return {
    findReferences: jest.fn().mockResolvedValue([]),
    analyzeDependencies: jest.fn().mockResolvedValue(null),
    _activeProvider: { name: 'stub' },
  };
}

function readRegistryMetadata(registryPath) {
  const parsed = yaml.load(fs.readFileSync(registryPath, 'utf8'));
  return parsed.metadata || {};
}

describe('RegistrySyncer idempotency (Story 10.15)', () => {
  let temp;

  beforeEach(() => {
    temp = makeTempRegistry();
  });

  afterEach(() => {
    try {
      fs.rmSync(temp.dir, { recursive: true, force: true });
    } catch {
      /* ignore */
    }
  });

  test('AC 6: second sync with no changes does NOT rewrite the file', async () => {
    const syncer = new RegistrySyncer({
      registryPath: temp.registryPath,
      repoRoot: temp.dir,
      client: stubClient(),
      logger: () => {},
    });

    // First sync — may or may not write depending on whether the seeded
    // file already matches the canonical hash. We only care that after
    // this run, subsequent no-op runs are true no-ops.
    await syncer.sync({ full: false });
    const statsAfterFirst = fs.statSync(temp.registryPath);
    const contentAfterFirst = fs.readFileSync(temp.registryPath, 'utf8');
    const lastUpdatedAfterFirst = readRegistryMetadata(temp.registryPath).lastUpdated;

    // Small wait to ensure mtime resolution differs if the file is rewritten.
    await new Promise((r) => setTimeout(r, 50));

    // Second sync with no structural changes MUST skip the write.
    const second = await syncer.sync({ full: false });
    const statsAfterSecond = fs.statSync(temp.registryPath);
    const contentAfterSecond = fs.readFileSync(temp.registryPath, 'utf8');
    const lastUpdatedAfterSecond = readRegistryMetadata(temp.registryPath).lastUpdated;

    expect(second.writeSkipped).toBe(true);
    expect(contentAfterSecond).toBe(contentAfterFirst);
    expect(lastUpdatedAfterSecond).toBe(lastUpdatedAfterFirst);
    expect(statsAfterSecond.mtimeMs).toBe(statsAfterFirst.mtimeMs);
  });

  test('AC 6 (repeat): third sync is also a no-op', async () => {
    const syncer = new RegistrySyncer({
      registryPath: temp.registryPath,
      repoRoot: temp.dir,
      client: stubClient(),
      logger: () => {},
    });

    await syncer.sync({ full: false }); // baseline
    await new Promise((r) => setTimeout(r, 20));
    await syncer.sync({ full: false }); // first no-op

    const statsBefore = fs.statSync(temp.registryPath);
    await new Promise((r) => setTimeout(r, 50));

    const third = await syncer.sync({ full: false });
    const statsAfter = fs.statSync(temp.registryPath);

    expect(third.writeSkipped).toBe(true);
    expect(statsAfter.mtimeMs).toBe(statsBefore.mtimeMs);
  });

  test('AC 7: genuine content change (new entity) DOES rewrite the file', async () => {
    // First: do a baseline sync so the on-disk hash is canonicalized.
    const syncerBaseline = new RegistrySyncer({
      registryPath: temp.registryPath,
      repoRoot: temp.dir,
      client: stubClient(),
      logger: () => {},
    });
    await syncerBaseline.sync({ full: true });

    const lastUpdatedBefore = readRegistryMetadata(temp.registryPath).lastUpdated;
    const contentBefore = fs.readFileSync(temp.registryPath, 'utf8');

    // Mutate on-disk registry to add a new entity, simulating a structural change.
    const parsed = yaml.load(contentBefore);
    parsed.entities.tasks['new-entity'] = {
      path: '.sinapse-ai/development/tasks/new-entity.md',
      type: 'task',
      purpose: 'A new task',
      keywords: ['new'],
      usedBy: [],
      dependencies: [],
      codeIntelMetadata: {
        callerCount: 0,
        role: 'task',
        lastSynced: '2099-12-31T23:59:59.000Z',
        provider: 'stub',
      },
    };
    fs.writeFileSync(temp.registryPath, yaml.dump(parsed, { lineWidth: 120, noRefs: true }), 'utf8');

    await new Promise((r) => setTimeout(r, 50));

    // New syncer instance picks up the mutated registry.
    const syncer = new RegistrySyncer({
      registryPath: temp.registryPath,
      repoRoot: temp.dir,
      client: stubClient(),
      logger: () => {},
    });
    const result = await syncer.sync({ full: false });

    const metaAfter = readRegistryMetadata(temp.registryPath);

    expect(result.writeSkipped).toBe(false);
    expect(metaAfter.entityCount).toBe(2);
    expect(metaAfter.lastUpdated).not.toBe(lastUpdatedBefore);
  });

  test('AC 6: hash intentionally excludes metadata.lastUpdated', async () => {
    // If the hash did NOT exclude lastUpdated, every sync would produce a
    // different hash because stamping `new Date().toISOString()` would mutate
    // the observable registry. This test asserts the exclusion is respected
    // by running the syncer through _computeContentHash against two registry
    // objects that differ ONLY in the lastUpdated field.
    const syncer = new RegistrySyncer({
      registryPath: temp.registryPath,
      repoRoot: temp.dir,
      client: stubClient(),
      logger: () => {},
    });

    const base = {
      metadata: { version: '1.0.0', lastUpdated: '2026-01-01T00:00:00.000Z', entityCount: 0 },
      entities: {},
    };
    const otherTimestamp = {
      metadata: { version: '1.0.0', lastUpdated: '2026-12-31T23:59:59.999Z', entityCount: 0 },
      entities: {},
    };
    const otherContent = {
      metadata: { version: '1.0.0', lastUpdated: '2026-01-01T00:00:00.000Z', entityCount: 1 },
      entities: {},
    };

    const hashBase = syncer._computeContentHash(base);
    const hashSameContent = syncer._computeContentHash(otherTimestamp);
    const hashDifferentContent = syncer._computeContentHash(otherContent);

    expect(hashSameContent).toBe(hashBase);
    expect(hashDifferentContent).not.toBe(hashBase);
  });
});
