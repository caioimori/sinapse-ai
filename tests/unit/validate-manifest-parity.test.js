/**
 * Unit tests for .sinapse-ai/infrastructure/scripts/validate-manifest-parity.js
 * Story A.4 — Install Manifest Parity & Regeneration
 *
 * Uses a temp repo root with synthetic manifest/registry/files so the tests
 * never depend on the real repository state.
 */
'use strict';

const fs = require('fs');
const os = require('os');
const path = require('path');
const yaml = require('js-yaml');

const {
  runParityCheck,
  scanDomain,
  collectManifestEntries,
  diffSets,
  getRegistryAgentNames,
  DOMAINS,
} = require('../../.sinapse-ai/infrastructure/scripts/validate-manifest-parity');

function makeTempRepo() {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'sinapse-a4-parity-'));
  const core = path.join(root, '.sinapse-ai');
  fs.mkdirSync(path.join(core, 'development', 'agents'), { recursive: true });
  fs.mkdirSync(path.join(core, 'development', 'tasks'), { recursive: true });
  fs.mkdirSync(path.join(core, 'development', 'templates'), { recursive: true });
  fs.mkdirSync(path.join(core, 'development', 'checklists'), { recursive: true });
  fs.mkdirSync(path.join(core, 'data'), { recursive: true });
  return { root, core };
}

function writeFile(p, content = '') {
  fs.mkdirSync(path.dirname(p), { recursive: true });
  fs.writeFileSync(p, content, 'utf8');
}

function writeManifest(core, files) {
  const manifest = {
    version: 'test',
    generator: 'test',
    file_count: files.length,
    files: files.map((p) => ({ path: p, hash: 'sha256:test', type: 'test', size: 0 })),
  };
  fs.writeFileSync(
    path.join(core, 'install-manifest.yaml'),
    yaml.dump(manifest),
    'utf8',
  );
}

function writeRegistry(core, agentNames) {
  const entities = { agents: {} };
  for (const name of agentNames) {
    entities.agents[name] = {
      path: `.sinapse-ai/development/agents/${name}.md`,
      type: 'agent',
    };
  }
  const registry = { metadata: { version: '1.0.0' }, entities };
  fs.writeFileSync(
    path.join(core, 'data', 'entity-registry.yaml'),
    yaml.dump(registry),
    'utf8',
  );
}

function cleanup(root) {
  try {
    fs.rmSync(root, { recursive: true, force: true });
  } catch (_) {
    // ignore
  }
}

describe('validate-manifest-parity', () => {
  describe('helpers', () => {
    test('diffSets returns empty arrays when sets match', () => {
      const a = new Set(['a', 'b']);
      const b = new Set(['a', 'b']);
      const r = diffSets(a, b);
      expect(r.missingFromManifest).toEqual([]);
      expect(r.missingFromDisk).toEqual([]);
    });

    test('diffSets detects missing entries in both directions', () => {
      const onDisk = new Set(['a', 'b', 'c']);
      const inManifest = new Set(['b', 'd']);
      const r = diffSets(onDisk, inManifest);
      expect(r.missingFromManifest).toEqual(['a', 'c']);
      expect(r.missingFromDisk).toEqual(['d']);
    });

    test('getRegistryAgentNames extracts top-level agent keys', () => {
      const registry = {
        entities: { agents: { foo: {}, bar: {} }, tasks: { baz: {} } },
      };
      const names = getRegistryAgentNames(registry);
      expect(Array.from(names).sort()).toEqual(['bar', 'foo']);
    });

    test('getRegistryAgentNames handles missing sections', () => {
      expect(getRegistryAgentNames(null).size).toBe(0);
      expect(getRegistryAgentNames({}).size).toBe(0);
      expect(getRegistryAgentNames({ entities: {} }).size).toBe(0);
    });

    test('DOMAINS includes agents/tasks/templates/checklists', () => {
      const names = DOMAINS.map((d) => d.name);
      expect(names).toEqual(['agents', 'tasks', 'templates', 'checklists']);
    });

    test('scanDomain excludes MEMORY.md and subfolders from agents', () => {
      const { root, core } = makeTempRepo();
      try {
        writeFile(path.join(core, 'development/agents/foo.md'));
        writeFile(path.join(core, 'development/agents/bar.md'));
        writeFile(path.join(core, 'development/agents/foo/MEMORY.md'));
        writeFile(path.join(core, 'development/agents/README.md'));
        const agentsDomain = DOMAINS.find((d) => d.name === 'agents');
        const found = scanDomain(core, agentsDomain);
        expect(Array.from(found).sort()).toEqual([
          'development/agents/bar.md',
          'development/agents/foo.md',
        ]);
      } finally {
        cleanup(root);
      }
    });

    test('collectManifestEntries keeps only top-level files in domain dir', () => {
      const files = [
        { path: 'development/agents/dev.md' },
        { path: 'development/agents/dev/MEMORY.md' },
        { path: 'development/tasks/other.md' },
      ];
      const agentsDomain = DOMAINS.find((d) => d.name === 'agents');
      const entries = collectManifestEntries(files, agentsDomain);
      expect(Array.from(entries)).toEqual(['development/agents/dev.md']);
    });
  });

  describe('runParityCheck — disk vs manifest', () => {
    test('reports OK when manifest, disk, and registry agree', () => {
      const { root, core } = makeTempRepo();
      try {
        writeFile(path.join(core, 'development/agents/dev.md'));
        writeFile(path.join(core, 'development/agents/arch.md'));
        writeFile(path.join(core, 'development/tasks/task-a.md'));
        writeFile(path.join(core, 'development/templates/tmpl.md'));
        writeFile(path.join(core, 'development/checklists/c.md'));
        writeManifest(core, [
          'development/agents/dev.md',
          'development/agents/arch.md',
          'development/tasks/task-a.md',
          'development/templates/tmpl.md',
          'development/checklists/c.md',
        ]);
        writeRegistry(core, ['dev', 'arch']);

        const report = runParityCheck(root);
        expect(report.ok).toBe(true);
        expect(report.errors).toEqual([]);
        expect(report.domains.agents.ok).toBe(true);
        expect(report.domains.agents.diskCount).toBe(2);
        expect(report.domains.agents.manifestCount).toBe(2);
        expect(report.registry.agentCountRegistry).toBe(2);
      } finally {
        cleanup(root);
      }
    });

    test('reports DRIFT when a file exists on disk but not in manifest', () => {
      const { root, core } = makeTempRepo();
      try {
        writeFile(path.join(core, 'development/agents/dev.md'));
        writeFile(path.join(core, 'development/agents/ghost.md'));
        writeManifest(core, ['development/agents/dev.md']);
        writeRegistry(core, ['dev', 'ghost']);

        const report = runParityCheck(root);
        expect(report.ok).toBe(false);
        expect(report.domains.agents.ok).toBe(false);
        expect(report.domains.agents.missingFromManifest).toEqual([
          'development/agents/ghost.md',
        ]);
        expect(report.domains.agents.missingFromDisk).toEqual([]);
      } finally {
        cleanup(root);
      }
    });

    test('reports DRIFT when a file is in manifest but missing on disk', () => {
      const { root, core } = makeTempRepo();
      try {
        writeFile(path.join(core, 'development/agents/dev.md'));
        writeManifest(core, [
          'development/agents/dev.md',
          'development/agents/vanished.md',
        ]);
        writeRegistry(core, ['dev']);

        const report = runParityCheck(root);
        expect(report.ok).toBe(false);
        expect(report.domains.agents.missingFromDisk).toEqual([
          'development/agents/vanished.md',
        ]);
        expect(report.domains.agents.missingFromManifest).toEqual([]);
      } finally {
        cleanup(root);
      }
    });
  });

  describe('runParityCheck — registry cross-validation', () => {
    test('reports DRIFT when registry has an agent that is not on disk', () => {
      const { root, core } = makeTempRepo();
      try {
        writeFile(path.join(core, 'development/agents/dev.md'));
        writeManifest(core, ['development/agents/dev.md']);
        writeRegistry(core, ['dev', 'ghost-agent']);

        const report = runParityCheck(root);
        expect(report.ok).toBe(false);
        expect(report.registry.extraInRegistry).toEqual(['ghost-agent']);
        expect(report.registry.missingInRegistry).toEqual([]);
      } finally {
        cleanup(root);
      }
    });

    test('reports DRIFT when registry is missing an agent that is on disk', () => {
      const { root, core } = makeTempRepo();
      try {
        writeFile(path.join(core, 'development/agents/dev.md'));
        writeFile(path.join(core, 'development/agents/arch.md'));
        writeManifest(core, [
          'development/agents/dev.md',
          'development/agents/arch.md',
        ]);
        writeRegistry(core, ['dev']);

        const report = runParityCheck(root);
        expect(report.ok).toBe(false);
        expect(report.registry.missingInRegistry).toEqual(['arch']);
      } finally {
        cleanup(root);
      }
    });

    test('reports error when manifest file is missing', () => {
      const { root } = makeTempRepo();
      try {
        const report = runParityCheck(root);
        expect(report.ok).toBe(false);
        expect(report.errors.length).toBeGreaterThan(0);
        expect(report.errors[0]).toMatch(/install-manifest\.yaml not found/);
      } finally {
        cleanup(root);
      }
    });
  });
});
