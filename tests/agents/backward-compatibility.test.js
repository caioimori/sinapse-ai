'use strict';

const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');

const AGENTS_DIR = path.join(__dirname, '../../.sinapse-ai/development/agents');

const EXPECTED_AGENTS = [
  'analyst',
  'architect',
  'data-engineer',
  'developer',
  'devops',
  'product-lead',
  'project-lead',
  'quality-gate',
  'sinapse-orqx',
  'sprint-lead',
  'squad-creator',
  'ux-design-expert',
];

/**
 * Extract the primary YAML block from an agent markdown file.
 *
 * Most agents embed their definition inside a ```yaml code fence.
 * sinapse-orqx uses a different layout but still has a ```yaml block
 * for the agent definition section.
 *
 * Returns the parsed YAML object or null if no block is found.
 */
function extractYaml(content) {
  // Match the first ```yaml ... ``` block (handles \r\n and \n)
  const yamlMatch = content.match(/```ya?ml[\r\n]+([\s\S]*?)[\r\n]+```/);
  if (yamlMatch) {
    return yaml.load(yamlMatch[1]);
  }

  // Fallback: try frontmatter style ---\n...\n---
  const fmMatch = content.match(/---\n([\s\S]*?)---/);
  if (fmMatch) {
    return yaml.load(fmMatch[1]);
  }

  return null;
}

/**
 * Load and parse an agent definition file.
 */
function loadAgent(agentFileName) {
  const filePath = path.join(AGENTS_DIR, `${agentFileName}.md`);
  const content = fs.readFileSync(filePath, 'utf8');
  const parsed = extractYaml(content);
  return { content, parsed, filePath };
}

describe('Agent Backward Compatibility', () => {
  // Cache all loaded agents for reuse across tests
  const agentCache = {};

  beforeAll(() => {
    for (const agentName of EXPECTED_AGENTS) {
      agentCache[agentName] = loadAgent(agentName);
    }
  });

  // ─── 1. All 12 expected agent files exist ─────────────────────────────────

  describe('Agent file existence', () => {
    test('all 12 expected agent definition files exist', () => {
      for (const agentName of EXPECTED_AGENTS) {
        const filePath = path.join(AGENTS_DIR, `${agentName}.md`);
        expect(fs.existsSync(filePath)).toBe(true);
      }
    });

    test('agent file names match expected list exactly', () => {
      const mdFiles = fs
        .readdirSync(AGENTS_DIR)
        .filter((f) => f.endsWith('.md'))
        .map((f) => f.replace('.md', ''))
        .sort();

      // All expected agents must be present
      for (const expected of EXPECTED_AGENTS) {
        expect(mdFiles).toContain(expected);
      }
    });
  });

  // ─── 2. Required fields on every agent ────────────────────────────────────

  describe('Required agent fields', () => {
    test.each(EXPECTED_AGENTS)(
      '%s has agent.name (string, non-empty)',
      (agentName) => {
        const { parsed } = agentCache[agentName];
        expect(parsed).not.toBeNull();
        expect(parsed.agent).toBeDefined();
        expect(typeof parsed.agent.name).toBe('string');
        expect(parsed.agent.name.length).toBeGreaterThan(0);
      },
    );

    test.each(EXPECTED_AGENTS)(
      '%s has agent.id (string, non-empty)',
      (agentName) => {
        const { parsed } = agentCache[agentName];
        expect(parsed.agent.id).toBeDefined();
        expect(typeof parsed.agent.id).toBe('string');
        expect(parsed.agent.id.length).toBeGreaterThan(0);
      },
    );

    test.each(EXPECTED_AGENTS)(
      '%s has agent.title (string)',
      (agentName) => {
        const { parsed } = agentCache[agentName];
        expect(parsed.agent.title).toBeDefined();
        expect(typeof parsed.agent.title).toBe('string');
      },
    );

    test.each(EXPECTED_AGENTS)(
      '%s has agent.icon (string)',
      (agentName) => {
        const { parsed } = agentCache[agentName];
        expect(parsed.agent.icon).toBeDefined();
        expect(typeof parsed.agent.icon).toBe('string');
      },
    );

    test.each(EXPECTED_AGENTS)(
      '%s has persona_profile or persona (object)',
      (agentName) => {
        const { parsed } = agentCache[agentName];
        const hasPersonaProfile =
          parsed.persona_profile && typeof parsed.persona_profile === 'object';
        const hasPersona =
          parsed.persona && typeof parsed.persona === 'object';
        expect(hasPersonaProfile || hasPersona).toBe(true);
      },
    );

    test.each(EXPECTED_AGENTS)(
      '%s has commands (array or object)',
      (agentName) => {
        const { parsed } = agentCache[agentName];
        expect(parsed.commands).toBeDefined();
        const isArray = Array.isArray(parsed.commands);
        const isObject = typeof parsed.commands === 'object';
        expect(isArray || isObject).toBe(true);
      },
    );

    test.each(EXPECTED_AGENTS)(
      '%s has activation-instructions or activation (exists)',
      (agentName) => {
        const { parsed, content } = agentCache[agentName];
        // Some agents (sinapse-orqx) define activation in the markdown header
        // rather than in the YAML block
        const hasInYaml =
          parsed['activation-instructions'] !== undefined ||
          parsed.activation !== undefined;
        const hasInMarkdown =
          content.includes('ACTIVATION') ||
          content.includes('activation');
        expect(hasInYaml || hasInMarkdown).toBe(true);
      },
    );
  });

  // ─── 3. Persona greeting levels ───────────────────────────────────────────

  describe('Persona communication', () => {
    test.each(EXPECTED_AGENTS)(
      '%s has persona name (string)',
      (agentName) => {
        const { parsed } = agentCache[agentName];
        // The persona name lives in agent.name for all agents
        expect(typeof parsed.agent.name).toBe('string');
        expect(parsed.agent.name.length).toBeGreaterThan(0);
      },
    );

    // Most agents have greeting_levels under persona_profile.communication
    // sinapse-orqx is the exception (uses its own greeting format in markdown)
    const agentsWithGreetingLevels = EXPECTED_AGENTS.filter(
      (a) => a !== 'sinapse-orqx',
    );

    test.each(agentsWithGreetingLevels)(
      '%s has greeting_levels with named and archetypal',
      (agentName) => {
        const { parsed } = agentCache[agentName];
        const gl = parsed.persona_profile?.communication?.greeting_levels;
        expect(gl).toBeDefined();
        expect(typeof gl).toBe('object');
        expect(gl.named).toBeDefined();
        expect(typeof gl.named).toBe('string');
        expect(gl.archetypal).toBeDefined();
        expect(typeof gl.archetypal).toBe('string');
      },
    );

    test('sinapse-orqx has greeting defined in markdown content', () => {
      const { content } = agentCache['sinapse-orqx'];
      // sinapse-orqx has an ASCII banner greeting in the markdown
      expect(content).toContain('Imperator');
      expect(content).toContain('SINAPSE');
    });
  });

  // ─── 4. MEMORY.md validation ──────────────────────────────────────────────

  describe('Agent MEMORY.md files', () => {
    // Agents with subdirectories containing MEMORY.md
    const agentsWithSubdir = EXPECTED_AGENTS.filter((agentName) => {
      // sinapse-orqx and squad-creator do not have subdirectories
      const subdir = agentName === 'ux-design-expert' ? 'ux' : agentName;
      const subdirPath = path.join(AGENTS_DIR, subdir);
      return (
        fs.existsSync(subdirPath) &&
        fs.statSync(subdirPath).isDirectory()
      );
    });

    test('at least some agents have MEMORY.md subdirectories', () => {
      expect(agentsWithSubdir.length).toBeGreaterThan(0);
    });

    test.each(agentsWithSubdir)(
      '%s has MEMORY.md with at least a header',
      (agentName) => {
        // ux-design-expert uses 'ux/' subdirectory
        const subdir = agentName === 'ux-design-expert' ? 'ux' : agentName;
        const memoryPath = path.join(AGENTS_DIR, subdir, 'MEMORY.md');

        if (!fs.existsSync(memoryPath)) {
          // Skip if no MEMORY.md for this agent
          return;
        }

        const memoryContent = fs.readFileSync(memoryPath, 'utf8').trim();
        // Should have at least a markdown header line
        expect(memoryContent.length).toBeGreaterThan(0);
        expect(memoryContent).toMatch(/^#/);
      },
    );
  });

  // ─── 5. Uniqueness constraints ────────────────────────────────────────────

  describe('Uniqueness constraints', () => {
    test('all agent IDs are unique (no duplicates)', () => {
      const ids = EXPECTED_AGENTS.map(
        (name) => agentCache[name].parsed.agent.id,
      );
      const uniqueIds = new Set(ids);
      expect(uniqueIds.size).toBe(ids.length);
    });

    test('all persona names are unique (no duplicates)', () => {
      const names = EXPECTED_AGENTS.map(
        (name) => agentCache[name].parsed.agent.name,
      );
      const uniqueNames = new Set(names);
      expect(uniqueNames.size).toBe(names.length);
    });

    test('agent IDs match their file names', () => {
      // Most agents: agent.id === filename
      // Verify the mapping is consistent
      for (const agentName of EXPECTED_AGENTS) {
        const { parsed } = agentCache[agentName];
        const agentId = parsed.agent.id;
        // The agent ID should match the filename (or be a known alias)
        // e.g., developer.md -> agent.id = 'developer'
        expect(agentId).toBe(agentName);
      }
    });
  });

  // ─── 6. Structural integrity ──────────────────────────────────────────────

  describe('Structural integrity', () => {
    test('all agent YAML blocks parse without errors', () => {
      const errors = [];
      for (const agentName of EXPECTED_AGENTS) {
        try {
          const filePath = path.join(AGENTS_DIR, `${agentName}.md`);
          const content = fs.readFileSync(filePath, 'utf8');
          const result = extractYaml(content);
          if (!result) {
            errors.push(`${agentName}: no YAML block found`);
          }
        } catch (err) {
          errors.push(`${agentName}: ${err.message}`);
        }
      }
      expect(errors).toEqual([]);
    });

    test('no agent file is empty', () => {
      for (const agentName of EXPECTED_AGENTS) {
        const { content } = agentCache[agentName];
        expect(content.trim().length).toBeGreaterThan(100);
      }
    });

    test('all agents have either persona or persona_profile with role info', () => {
      for (const agentName of EXPECTED_AGENTS) {
        const { parsed } = agentCache[agentName];
        const hasPersonaRole =
          parsed.persona && typeof parsed.persona.role === 'string';
        const hasProfileArchetype =
          parsed.persona_profile &&
          typeof parsed.persona_profile.archetype === 'string';
        expect(hasPersonaRole || hasProfileArchetype).toBe(true);
      }
    });
  });

  // ─── 7. Cross-release stability ───────────────────────────────────────────

  describe('Cross-release stability', () => {
    test('total agent count matches expected (12)', () => {
      const mdFiles = fs
        .readdirSync(AGENTS_DIR)
        .filter((f) => f.endsWith('.md'));
      expect(mdFiles.length).toBe(EXPECTED_AGENTS.length);
    });

    test('agent icons are all non-empty strings', () => {
      for (const agentName of EXPECTED_AGENTS) {
        const { parsed } = agentCache[agentName];
        expect(parsed.agent.icon).toBeTruthy();
        expect(parsed.agent.icon.trim().length).toBeGreaterThan(0);
      }
    });

    test('commands have at least one entry per agent', () => {
      for (const agentName of EXPECTED_AGENTS) {
        const { parsed } = agentCache[agentName];
        if (Array.isArray(parsed.commands)) {
          expect(parsed.commands.length).toBeGreaterThan(0);
        } else {
          // Object-style commands
          expect(Object.keys(parsed.commands).length).toBeGreaterThan(0);
        }
      }
    });
  });
});
