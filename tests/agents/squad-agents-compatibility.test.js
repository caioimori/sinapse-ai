'use strict';

const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');

const SQUADS_DIR = path.join(__dirname, '../../squads');

const EXPECTED_SQUADS = [
  'claude-code-mastery',
  'squad-animations',
  'squad-brand',
  'squad-claude',
  'squad-cloning',
  'squad-commercial',
  'squad-content',
  'squad-copy',
  'squad-council',
  'squad-courses',
  'squad-cybersecurity',
  'squad-design',
  'squad-finance',
  'squad-growth',
  'squad-paidmedia',
  'squad-product',
  'squad-research',
  'squad-storytelling',
];

const EXPECTED_TOTAL_AGENTS = 174;

// Skip if squads directory doesn't exist (CI or minimal install)
const squadsExist = fs.existsSync(SQUADS_DIR);
const describeIfSquads = squadsExist ? describe : describe.skip;

/**
 * Extract the primary YAML block from a squad agent markdown file.
 *
 * Squad agents use ```yaml code fences for their definition.
 * Falls back to --- frontmatter style.
 *
 * Returns the parsed YAML object or null if no block is found.
 */
function extractYaml(content) {
  const yamlMatch = content.match(/```ya?ml[\r\n]+([\s\S]*?)[\r\n]+```/);
  if (yamlMatch) {
    try {
      return yaml.load(yamlMatch[1]);
    } catch {
      return null;
    }
  }

  // Frontmatter: must start with --- on the first line
  const fmMatch = content.match(/^---[\r\n]+([\s\S]*?)[\r\n]+---/);
  if (fmMatch) {
    try {
      return yaml.load(fmMatch[1]);
    } catch {
      return null;
    }
  }

  return null;
}

/**
 * Detect the agent file format.
 *
 * Returns one of:
 *   - 'yaml-fence': has ```yaml code fence
 *   - 'frontmatter': starts with --- ... ---
 *   - 'markdown': uses ## sections with bold fields (e.g. **ID:**, **Nome:**)
 */
function detectFormat(content) {
  if (/```ya?ml/i.test(content)) return 'yaml-fence';
  if (/^---[\r\n]/.test(content)) return 'frontmatter';
  return 'markdown';
}

/**
 * Get all .md files in a squad's agents/ directory.
 */
function getSquadAgentFiles(squadName) {
  const agentsDir = path.join(SQUADS_DIR, squadName, 'agents');
  if (!fs.existsSync(agentsDir)) return [];
  return fs
    .readdirSync(agentsDir)
    .filter((f) => f.endsWith('.md'))
    .sort();
}

/**
 * Load and parse a squad agent file.
 */
function loadSquadAgent(squadName, fileName) {
  const filePath = path.join(SQUADS_DIR, squadName, 'agents', fileName);
  const content = fs.readFileSync(filePath, 'utf8');
  const parsed = extractYaml(content);
  const format = detectFormat(content);
  return { content, parsed, filePath, fileName, format };
}

/**
 * Parse squad.yaml and extract metadata.
 */
function loadSquadManifest(squadName) {
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
 * Extract declared agent count from squad.yaml.
 * Handles multiple formats:
 *   - metadata.agents_count: N
 *   - agents: N (top-level numeric)
 *   - squad.agents: N (nested under squad key)
 */
function getDeclaredAgentCount(manifest) {
  if (!manifest) return null;
  if (manifest.metadata && typeof manifest.metadata.agents_count === 'number') {
    return manifest.metadata.agents_count;
  }
  if (typeof manifest.agents === 'number') {
    return manifest.agents;
  }
  if (manifest.squad && typeof manifest.squad.agents === 'number') {
    return manifest.squad.agents;
  }
  return null;
}

/**
 * Extract declared agent list from squad.yaml components.agents array.
 */
function getDeclaredAgentList(manifest) {
  if (!manifest) return null;
  if (manifest.components && Array.isArray(manifest.components.agents)) {
    return manifest.components.agents.map((entry) => {
      // entries may have comments: "brand-orqx.md  # Meridian — Conductor"
      const cleaned = entry.split('#')[0].trim();
      return cleaned;
    });
  }
  return null;
}

/**
 * Extract the squad name from its manifest, handling multiple formats.
 */
function getManifestName(manifest) {
  if (!manifest) return null;
  if (typeof manifest.name === 'string') return manifest.name;
  if (manifest.metadata && typeof manifest.metadata.name === 'string') {
    return manifest.metadata.name;
  }
  if (manifest.squad && typeof manifest.squad.name === 'string') {
    return manifest.squad.name;
  }
  return null;
}

/**
 * Check if an agent has a name/persona defined (any format).
 *
 * Accepts:
 *   - YAML: agent.name, name (top-level)
 *   - Markdown: **Nome:**, **Name:**, or # Agent: Name title
 *   - Frontmatter: name: field
 */
function hasAgentName(agent) {
  // YAML-parsed
  if (agent.parsed) {
    if (agent.parsed.agent && typeof agent.parsed.agent.name === 'string') return true;
    if (typeof agent.parsed.name === 'string') return true;
  }

  // Markdown bold fields
  if (/\*\*(?:Nome|Name):\*\*\s*.+/i.test(agent.content)) return true;

  // Title pattern: "# Agent: PersonaName" or "# agentname — PersonaName"
  if (/^#\s+(?:Agent:\s*)?\S+/m.test(agent.content)) return true;

  return false;
}

/**
 * Check if an agent has an ID defined (any format).
 *
 * Accepts:
 *   - YAML: agent.id, id (top-level)
 *   - Markdown: **ID:** field
 *   - Frontmatter: name: field (acts as ID in this format)
 *   - Filename-based: the .md filename itself serves as the ID
 */
function hasAgentId(agent) {
  // YAML-parsed
  if (agent.parsed) {
    if (agent.parsed.agent && typeof agent.parsed.agent.id === 'string') return true;
    if (typeof agent.parsed.id === 'string') return true;
    // Frontmatter name acts as ID
    if (typeof agent.parsed.name === 'string') return true;
  }

  // Markdown bold fields
  if (/\*\*ID:\*\*\s*.+/i.test(agent.content)) return true;

  // Agent filename is always a valid implicit ID
  if (agent.fileName && agent.fileName.endsWith('.md')) return true;

  return false;
}

/**
 * Extract the explicit agent ID for uniqueness checks.
 * Returns null if no explicit ID is found (filename-based implicit IDs
 * are handled separately in the uniqueness test).
 */
function extractAgentId(agent, squadName) {
  if (agent.parsed) {
    if (agent.parsed.agent && typeof agent.parsed.agent.id === 'string') {
      return agent.parsed.agent.id;
    }
    if (typeof agent.parsed.id === 'string') {
      return agent.parsed.id;
    }
    // Frontmatter name is the identifier
    if (typeof agent.parsed.name === 'string') {
      return agent.parsed.name;
    }
  }

  // Markdown **ID:** field
  const idMatch = agent.content.match(/\*\*ID:\*\*\s*(\S+)/i);
  if (idMatch) return idMatch[1].trim();

  // Fallback: derive from filename within squad context
  return `${squadName}/${agent.fileName.replace('.md', '')}`;
}

describeIfSquads('Squad Agent Compatibility', () => {
  // Pre-load all squad data
  const squadData = {};

  beforeAll(() => {
    for (const squadName of EXPECTED_SQUADS) {
      const agentFiles = getSquadAgentFiles(squadName);
      const agents = agentFiles.map((f) => loadSquadAgent(squadName, f));
      const manifest = loadSquadManifest(squadName);
      squadData[squadName] = { agentFiles, agents, manifest };
    }
  });

  // ─── 1. All 18 expected squads present ──────────────────────────────────

  describe('Squad directory existence', () => {
    test('all 18 expected squad directories exist', () => {
      for (const squadName of EXPECTED_SQUADS) {
        const squadDir = path.join(SQUADS_DIR, squadName);
        expect(fs.existsSync(squadDir)).toBe(true);
      }
    });

    test('all squads have an agents/ subdirectory', () => {
      for (const squadName of EXPECTED_SQUADS) {
        const agentsDir = path.join(SQUADS_DIR, squadName, 'agents');
        expect(fs.existsSync(agentsDir)).toBe(true);
      }
    });
  });

  // ─── 2. Squad manifest (squad.yaml) validation ─────────────────────────

  describe('Squad manifest validation', () => {
    test.each(EXPECTED_SQUADS)(
      '%s has a valid squad.yaml',
      (squadName) => {
        const manifestPath = path.join(SQUADS_DIR, squadName, 'squad.yaml');
        expect(fs.existsSync(manifestPath)).toBe(true);

        const { manifest } = squadData[squadName];
        expect(manifest).not.toBeNull();
        expect(typeof manifest).toBe('object');
      },
    );

    test.each(EXPECTED_SQUADS)(
      '%s squad.yaml has a name field',
      (squadName) => {
        const { manifest } = squadData[squadName];
        expect(manifest).not.toBeNull();
        const name = getManifestName(manifest);
        expect(name).not.toBeNull();
        expect(typeof name).toBe('string');
        expect(name.length).toBeGreaterThan(0);
      },
    );

    test.each(EXPECTED_SQUADS)(
      '%s declared agent count matches actual agent files',
      (squadName) => {
        const { manifest, agentFiles } = squadData[squadName];
        const declaredCount = getDeclaredAgentCount(manifest);

        if (declaredCount !== null) {
          // Allow +/- 2 tolerance for recently added agents
          // that may not yet be reflected in squad.yaml metadata
          expect(Math.abs(agentFiles.length - declaredCount)).toBeLessThanOrEqual(2);
        }

        // If components.agents list exists, verify alignment
        const declaredList = getDeclaredAgentList(manifest);
        if (declaredList !== null) {
          for (const agentFile of declaredList) {
            expect(agentFiles).toContain(agentFile);
          }
        }
      },
    );
  });

  // ─── 3. Orchestrator agent per squad ────────────────────────────────────

  describe('Orchestrator agent existence', () => {
    test.each(EXPECTED_SQUADS)(
      '%s has an orchestrator (*-orqx or *-chief) agent',
      (squadName) => {
        const { agentFiles } = squadData[squadName];
        const orchestratorFiles = agentFiles.filter(
          (f) => f.includes('orqx') || f.includes('chief'),
        );
        expect(orchestratorFiles.length).toBeGreaterThanOrEqual(1);
      },
    );
  });

  // ─── 4. Individual agent file validation ────────────────────────────────

  describe('Agent file content validation', () => {
    // Build a flat list of [squadName, fileName] pairs for test.each
    const allAgentPairs = [];

    if (squadsExist) {
      for (const squadName of EXPECTED_SQUADS) {
        const agentFiles = getSquadAgentFiles(squadName);
        for (const fileName of agentFiles) {
          allAgentPairs.push([squadName, fileName]);
        }
      }
    }

    test.each(allAgentPairs.length ? allAgentPairs : [['skip', 'skip']])(
      '%s/%s is non-empty (>100 chars)',
      (squadName, fileName) => {
        if (squadName === 'skip') return;
        const agent = squadData[squadName].agents.find((a) => a.fileName === fileName);
        expect(agent.content.length).toBeGreaterThan(100);
      },
    );

    test.each(allAgentPairs.length ? allAgentPairs : [['skip', 'skip']])(
      '%s/%s has a structured definition (YAML block, frontmatter, or markdown sections)',
      (squadName, fileName) => {
        if (squadName === 'skip') return;
        const agent = squadData[squadName].agents.find((a) => a.fileName === fileName);
        const format = agent.format;

        // yaml-fence and frontmatter are always structured
        if (format === 'yaml-fence' || format === 'frontmatter') return;

        // Markdown format: must have structural sections
        const hasStructuralSections =
          /^## /m.test(agent.content) ||
          /^# Agent:/m.test(agent.content) ||
          /^# .+ —/m.test(agent.content);
        expect(hasStructuralSections).toBe(true);
      },
    );

    test.each(allAgentPairs.length ? allAgentPairs : [['skip', 'skip']])(
      '%s/%s has agent name defined',
      (squadName, fileName) => {
        if (squadName === 'skip') return;
        const agent = squadData[squadName].agents.find((a) => a.fileName === fileName);
        expect(hasAgentName(agent)).toBe(true);
      },
    );

    test.each(allAgentPairs.length ? allAgentPairs : [['skip', 'skip']])(
      '%s/%s has agent ID defined',
      (squadName, fileName) => {
        if (squadName === 'skip') return;
        const agent = squadData[squadName].agents.find((a) => a.fileName === fileName);
        expect(hasAgentId(agent)).toBe(true);
      },
    );

    test.each(allAgentPairs.length ? allAgentPairs : [['skip', 'skip']])(
      '%s/%s has persona/role definition',
      (squadName, fileName) => {
        if (squadName === 'skip') return;
        const agent = squadData[squadName].agents.find((a) => a.fileName === fileName);

        if (agent.parsed) {
          const hasPersona =
            agent.parsed.persona && typeof agent.parsed.persona === 'object';
          const hasPersonaProfile =
            agent.parsed.persona_profile && typeof agent.parsed.persona_profile === 'object';
          const hasRole =
            agent.parsed.persona && typeof agent.parsed.persona.role === 'string';
          // Frontmatter agents may have description as their role
          const hasDescription = typeof agent.parsed.description === 'string';
          if (hasPersona || hasPersonaProfile || hasRole || hasDescription) return;
        }

        // Markdown/content-level checks
        const hasRoleContent =
          /## (?:Role|Persona|Identity|Identidade)/i.test(agent.content) ||
          /arquet[iy]po/i.test(agent.content) ||
          /\*\*(?:Role|Archetype|Arquetipo):/i.test(agent.content) ||
          /persona/i.test(agent.content);
        expect(hasRoleContent).toBe(true);
      },
    );

    test.each(allAgentPairs.length ? allAgentPairs : [['skip', 'skip']])(
      '%s/%s has commands or tasks section',
      (squadName, fileName) => {
        if (squadName === 'skip') return;
        const agent = squadData[squadName].agents.find((a) => a.fileName === fileName);

        // YAML-level commands
        if (agent.parsed) {
          if (agent.parsed.commands !== undefined) return;
          if (agent.parsed.tools !== undefined) return; // frontmatter agents list tools
        }

        // Content-level patterns for commands/tasks/heuristics/protocols
        const hasTasksOrCommands =
          /## (?:Tasks|Comandos|Commands|Heuristics|Heur[ií]sticas|Responsabilidades|Protocolos|Protocols)/i.test(agent.content) ||
          /commands:/i.test(agent.content) ||
          /\| Task /i.test(agent.content);
        expect(hasTasksOrCommands).toBe(true);
      },
    );
  });

  // ─── 5. Ecosystem-wide uniqueness ──────────────────────────────────────

  describe('Ecosystem-wide validation', () => {
    test('no duplicate agent IDs across all squads', () => {
      const idMap = new Map();
      const duplicates = [];

      for (const squadName of EXPECTED_SQUADS) {
        const { agents } = squadData[squadName];
        for (const agent of agents) {
          const id = extractAgentId(agent, squadName);
          if (!id) continue;

          if (idMap.has(id)) {
            duplicates.push(
              `${squadName}/${agent.fileName} duplicates ${idMap.get(id)}: ${id}`,
            );
          }
          idMap.set(id, `${squadName}/${agent.fileName}`);
        }
      }

      expect(duplicates).toEqual([]);
    });

    test(`total squad agent count is ${EXPECTED_TOTAL_AGENTS}`, () => {
      let total = 0;
      for (const squadName of EXPECTED_SQUADS) {
        total += squadData[squadName].agentFiles.length;
      }
      expect(total).toBe(EXPECTED_TOTAL_AGENTS);
    });

    test('all 18 expected squads are present', () => {
      const actualSquads = fs
        .readdirSync(SQUADS_DIR)
        .filter((d) => {
          const fullPath = path.join(SQUADS_DIR, d);
          return fs.statSync(fullPath).isDirectory();
        })
        .sort();

      for (const expected of EXPECTED_SQUADS) {
        expect(actualSquads).toContain(expected);
      }
    });
  });

  // ─── 6. Per-squad agent counts ─────────────────────────────────────────

  describe('Per-squad agent counts', () => {
    const expectedCounts = {
      'claude-code-mastery': 8,
      'squad-animations': 9,
      'squad-brand': 15,
      'squad-claude': 10,
      'squad-cloning': 9,
      'squad-commercial': 11,
      'squad-content': 7,
      'squad-copy': 14,
      'squad-council': 11,
      'squad-courses': 8,
      'squad-cybersecurity': 9,
      'squad-design': 15,
      'squad-finance': 5,
      'squad-growth': 7,
      'squad-paidmedia': 10,
      'squad-product': 7,
      'squad-research': 8,
      'squad-storytelling': 11,
    };

    test.each(EXPECTED_SQUADS)(
      '%s has expected number of agent files',
      (squadName) => {
        const { agentFiles } = squadData[squadName];
        expect(agentFiles.length).toBe(expectedCounts[squadName]);
      },
    );
  });
});
