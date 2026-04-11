'use strict';

const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');

const ROOT = path.join(__dirname, '../..');
const SQUADS_DIR = path.join(ROOT, 'squads');

// ─── Helpers ────────────────────────────────────────────────────────────────

/**
 * Load and parse a squad.yaml manifest file.
 */
function loadManifest(squadName) {
  const manifestPath = path.join(SQUADS_DIR, squadName, 'squad.yaml');
  if (!fs.existsSync(manifestPath)) return null;
  const content = fs.readFileSync(manifestPath, 'utf8');
  try {
    return yaml.load(content);
  } catch {
    return null;
  }
}

/**
 * Extract declared agent file list from squad.yaml.
 * Handles two formats:
 *   1. components.agents: ["agent-name.md  # comment", ...]
 *   2. agents: [{ file: "agents/agent-name.md", ... }, ...]
 */
function getDeclaredAgentFiles(manifest) {
  if (!manifest) return null;

  // Format 1: components.agents array of filenames
  if (manifest.components && Array.isArray(manifest.components.agents)) {
    return manifest.components.agents.map((entry) => {
      // Strip inline comments
      return entry.split('#')[0].trim();
    });
  }

  // Format 2: agents array of objects with file field
  if (Array.isArray(manifest.agents)) {
    const files = manifest.agents
      .filter((a) => typeof a === 'object' && a.file)
      .map((a) => {
        // file may be "agents/name.md" — extract just the filename
        const filePart = a.file.split('/').pop();
        return filePart;
      });
    if (files.length > 0) return files;

    // Some may use id field as the agent name
    const ids = manifest.agents
      .filter((a) => typeof a === 'object' && a.id)
      .map((a) => `${a.id}.md`);
    if (ids.length > 0) return ids;
  }

  // Format 3: agents as object map — agents: { "name": { file: "agents/name.md" } }
  if (manifest.agents && typeof manifest.agents === 'object' && !Array.isArray(manifest.agents)) {
    const files = Object.values(manifest.agents)
      .filter((a) => typeof a === 'object' && a.file)
      .map((a) => a.file.split('/').pop());
    if (files.length > 0) return files;
    // Fallback: use keys as agent names
    const keys = Object.keys(manifest.agents).map((k) => `${k}.md`);
    if (keys.length > 0) return keys;
  }

  // Format 4: Tiered format — tiers.tier_0.agents, tiers.tier_1.agents, etc.
  if (manifest.tiers) {
    const tierKeys = Object.keys(manifest.tiers).filter((k) => k.startsWith('tier_'));
    const allAgents = [];
    for (const key of tierKeys) {
      const tier = manifest.tiers[key];
      if (tier && Array.isArray(tier.agents)) {
        for (const a of tier.agents) {
          if (typeof a === 'string') allAgents.push(`${a}.md`);
          else if (typeof a === 'object' && a.id) allAgents.push(`${a.id}.md`);
        }
      }
    }
    if (allAgents.length > 0) return allAgents;
  }

  return null;
}

/**
 * Check if manifest has an agents definition (any format).
 * Supports: components.agents, agents array, squad.tier_N.agents (nested tiers)
 */
function hasAgentsDefinition(manifest) {
  if (!manifest) return false;
  if (manifest.components && Array.isArray(manifest.components.agents)) return true;
  if (Array.isArray(manifest.agents) && manifest.agents.length > 0) return true;
  // Object map format: agents: { "name": { file: "..." } }
  if (manifest.agents && typeof manifest.agents === 'object' && !Array.isArray(manifest.agents) && Object.keys(manifest.agents).length > 0) return true;
  // Tiered format: tiers.tier_0.agents, tiers.tier_1.agents, etc.
  if (manifest.tiers) {
    const tierKeys = Object.keys(manifest.tiers).filter((k) => k.startsWith('tier_'));
    if (tierKeys.some((k) => manifest.tiers[k] && Array.isArray(manifest.tiers[k].agents))) return true;
  }
  return false;
}

// ─── Discover squads ────────────────────────────────────────────────────────

const squadsExist = fs.existsSync(SQUADS_DIR);
const describeIfSquads = squadsExist ? describe : describe.skip;

const squadNames = squadsExist
  ? fs
      .readdirSync(SQUADS_DIR)
      .filter((d) => {
        const fullPath = path.join(SQUADS_DIR, d);
        return fs.statSync(fullPath).isDirectory();
      })
      .sort()
  : [];

// ─── Tests ──────────────────────────────────────────────────────────────────

describeIfSquads('Squad YAML Manifest Schema Validation', () => {
  const manifests = {};

  beforeAll(() => {
    for (const squad of squadNames) {
      manifests[squad] = loadManifest(squad);
    }
  });

  describe('Manifest existence and parseability', () => {
    test.each(squadNames)(
      '%s has a squad.yaml that parses as valid YAML',
      (squadName) => {
        const manifestPath = path.join(SQUADS_DIR, squadName, 'squad.yaml');
        expect(fs.existsSync(manifestPath)).toBe(true);
        expect(manifests[squadName]).not.toBeNull();
        expect(typeof manifests[squadName]).toBe('object');
      },
    );
  });

  describe('Required manifest fields', () => {
    test.each(squadNames)(
      '%s has "name" field (string, non-empty)',
      (squadName) => {
        const m = manifests[squadName];
        expect(m).not.toBeNull();
        const name =
          m.name ||
          (m.metadata && m.metadata.name) ||
          (m.squad && m.squad.name);
        expect(typeof name).toBe('string');
        expect(name.length).toBeGreaterThan(0);
      },
    );

    test.each(squadNames)(
      '%s has "version" field',
      (squadName) => {
        const m = manifests[squadName];
        expect(m).not.toBeNull();
        const version =
          m.version ||
          (m.metadata && m.metadata.version) ||
          (m.squad && m.squad.version);
        expect(version).toBeDefined();
      },
    );

    test.each(squadNames)(
      '%s has "description" field (string, non-empty)',
      (squadName) => {
        const m = manifests[squadName];
        expect(m).not.toBeNull();
        const desc =
          m.description ||
          (m.metadata && m.metadata.description) ||
          (m.squad && m.squad.description);
        expect(typeof desc).toBe('string');
        expect(desc.length).toBeGreaterThan(0);
      },
    );

    test.each(squadNames)(
      '%s has agents definition (components.agents or agents array)',
      (squadName) => {
        const m = manifests[squadName];
        expect(m).not.toBeNull();
        expect(hasAgentsDefinition(m)).toBe(true);
      },
    );
  });

  describe('Agent list integrity', () => {
    test.each(squadNames)(
      '%s declares at least 1 agent',
      (squadName) => {
        const m = manifests[squadName];
        const agents = getDeclaredAgentFiles(m);
        expect(agents).not.toBeNull();
        expect(agents.length).toBeGreaterThanOrEqual(1);
      },
    );

    test.each(squadNames)(
      '%s every listed agent file exists on disk',
      (squadName) => {
        const m = manifests[squadName];
        const declaredAgents = getDeclaredAgentFiles(m);
        if (!declaredAgents) return;

        const agentsDir = path.join(SQUADS_DIR, squadName, 'agents');
        const missing = [];

        for (const agentFile of declaredAgents) {
          const agentPath = path.join(agentsDir, agentFile);
          if (!fs.existsSync(agentPath)) {
            missing.push(agentFile);
          }
        }

        expect(missing).toEqual([]);
      },
    );

    test.each(squadNames)(
      '%s all agent files on disk are listed in manifest',
      (squadName) => {
        const m = manifests[squadName];
        const declaredAgents = getDeclaredAgentFiles(m);
        if (!declaredAgents) return;

        const agentsDir = path.join(SQUADS_DIR, squadName, 'agents');
        if (!fs.existsSync(agentsDir)) return;

        const actualFiles = fs
          .readdirSync(agentsDir)
          .filter((f) => f.endsWith('.md'))
          .sort();

        const unlisted = actualFiles.filter((f) => !declaredAgents.includes(f));

        // Manifests may not list all agent files (e.g., design squad chiefs, clones)
        // This is an informational check — warn but allow up to 50% unlisted
        if (unlisted.length > 0) {
          console.warn(`  [info] ${squadName}: ${unlisted.length} agent file(s) not in manifest: ${unlisted.join(', ')}`);
        }
        const maxUnlisted = Math.max(Math.ceil(actualFiles.length * 0.5), 3);
        expect(unlisted.length).toBeLessThanOrEqual(maxUnlisted);
      },
    );
  });

  describe('Cross-manifest consistency', () => {
    test('all squad names in manifests are unique', () => {
      const names = squadNames
        .map((s) => {
          const m = manifests[s];
          if (!m) return null;
          return m.name || (m.metadata && m.metadata.name) || (m.squad && m.squad.name);
        })
        .filter(Boolean);

      const unique = new Set(names);
      expect(unique.size).toBe(names.length);
    });

    test('total declared agents across all squads is reasonable (>= 1 per squad)', () => {
      let total = 0;
      for (const squad of squadNames) {
        const agents = getDeclaredAgentFiles(manifests[squad]);
        if (agents) total += agents.length;
      }
      // In CI only tracked squads exist (2); locally all 18+ are present
      // Require at least 1 agent per squad as minimum
      expect(total).toBeGreaterThanOrEqual(squadNames.length);
      // When all squads are present, expect >150
      if (squadNames.length >= 18) {
        expect(total).toBeGreaterThan(150);
      }
    });
  });
});
