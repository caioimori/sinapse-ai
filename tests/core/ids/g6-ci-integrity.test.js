'use strict';

const path = require('path');

// Module paths (mirrors g5-semantic-handshake.test.js convention)
const G6_PATH = path.resolve(
  __dirname,
  '../../../.sinapse-ai/core/ids/gates/g6-ci-integrity.js',
);
const INDEX_PATH = path.resolve(
  __dirname,
  '../../../.sinapse-ai/core/ids/index.js',
);

const { G6CiIntegrityGate, G6_DEFAULT_TIMEOUT_MS } = require(G6_PATH);

/** Suppress gate logging during tests while recording calls. */
function createMockLogger() {
  return {
    info: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
    log: jest.fn(),
  };
}

/** A loader stub returning a registry with N entity categories. */
function makeLoader(registry) {
  return { load: jest.fn(() => registry) };
}

describe('G6CiIntegrityGate', () => {
  let logger;

  beforeEach(() => {
    logger = createMockLogger();
  });

  describe('constructor', () => {
    it('creates a blocking gate for @devops', () => {
      const gate = new G6CiIntegrityGate({ logger });
      expect(gate.getGateId()).toBe('G6');
      expect(gate.getAgent()).toBe('@devops');
      expect(gate.isBlocking()).toBe(true);
    });

    it('defaults to a 60s CI timeout', () => {
      expect(G6_DEFAULT_TIMEOUT_MS).toBe(60000);
    });
  });

  describe('integrity check (CRITICAL)', () => {
    it('passes when the registry loads with an entities root', async () => {
      const loader = makeLoader({ entities: { agents: {}, tasks: {} } });
      const gate = new G6CiIntegrityGate({ registryLoader: loader, logger });

      const res = await gate.verify({});

      expect(res.result.passed).toBe(true);
      expect(res.result.blocking).toBe(false);
      expect(loader.load).toHaveBeenCalledTimes(1);
    });

    it('BLOCKS when the registry has no entities root', async () => {
      const loader = makeLoader({ not_entities: {} });
      const gate = new G6CiIntegrityGate({ registryLoader: loader, logger });

      const res = await gate.verify({});

      expect(res.result.passed).toBe(false);
      expect(res.result.blocking).toBe(true);
      expect(res.override).toBeTruthy();
      expect(res.override.correctionPrompt).toMatch(/registry/i);
    });

    it('BLOCKS when the registry fails to load (corrupt)', async () => {
      const loader = {
        load: jest.fn(() => {
          throw new Error('YAML parse error');
        }),
      };
      const gate = new G6CiIntegrityGate({ registryLoader: loader, logger });

      const res = await gate.verify({});

      expect(res.result.passed).toBe(false);
      expect(res.result.blocking).toBe(true);
      expect(res.result.warnings.join(' ')).toMatch(/CRITICAL/);
    });
  });

  describe('registry sync (MEDIUM/LOW → warnings, never blocks)', () => {
    it('syncs changed files and passes', async () => {
      const loader = makeLoader({ entities: { agents: {} } });
      const updater = {
        processChanges: jest.fn(async () => ({ updated: 2, errors: [] })),
      };
      const gate = new G6CiIntegrityGate({
        registryLoader: loader,
        registryUpdater: updater,
        logger,
      });

      const changes = [
        { action: 'change', relativePath: 'a.js', filePath: '/abs/a.js' },
      ];
      const res = await gate.verify({ changes });

      expect(res.result.passed).toBe(true);
      expect(updater.processChanges).toHaveBeenCalledWith(changes);
    });

    it('surfaces sync errors as non-blocking warnings', async () => {
      const loader = makeLoader({ entities: { agents: {} } });
      const updater = {
        processChanges: jest.fn(async () => ({
          updated: 0,
          errors: [{ message: 'entity not found' }],
        })),
      };
      const gate = new G6CiIntegrityGate({
        registryLoader: loader,
        registryUpdater: updater,
        logger,
      });

      const res = await gate.verify({
        changes: [{ action: 'change', relativePath: 'b.js', filePath: '/abs/b.js' }],
      });

      expect(res.result.passed).toBe(true);
      expect(res.result.blocking).toBe(false);
      expect(res.result.warnings.join(' ')).toMatch(/non-blocking/i);
    });

    it('does not require an updater when there are no changes', async () => {
      const loader = makeLoader({ entities: { agents: {} } });
      const gate = new G6CiIntegrityGate({ registryLoader: loader, logger });

      const res = await gate.verify({}); // no changes → updater never built

      expect(res.result.passed).toBe(true);
    });
  });

  describe('barrel export', () => {
    it('is exported from the IDS index', () => {
      const ids = require(INDEX_PATH);
      expect(ids.G6CiIntegrityGate).toBe(G6CiIntegrityGate);
      expect(ids.G6_DEFAULT_TIMEOUT_MS).toBe(60000);
    });
  });
});
