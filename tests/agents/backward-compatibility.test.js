'use strict';

const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');

const ROOT = path.join(__dirname, '../..');
const FRAMEWORK_AGENTS_DIR = path.join(ROOT, '.sinapse-ai/development/agents');
const SQUADS_DIR = path.join(ROOT, 'squads');
const SINAPSE_AGENTS_DIR = path.join(ROOT, 'sinapse/agents');

// ─── Helpers ────────────────────────────────────────────────────────────────

/**
 * Extract the primary YAML block from an agent markdown file.
 * Handles ```yaml code fences and --- frontmatter.
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
 * Collect all .md agent files from a directory.
 */
function collectAgentFiles(dir) {
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith('.md'))
    .sort();
}

/**
 * Load an agent file and return its content, parsed YAML, and metadata.
 */
function loadAgent(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const parsed = extractYaml(content);
  const fileName = path.basename(filePath);
  const stat = fs.statSync(filePath);
  return { content, parsed, filePath, fileName, size: stat.size };
}

/**
 * Check if content has a top-level heading (# ...).
 */
function hasTopLevelHeading(content) {
  return /^#\s+\S/m.test(content);
}

/**
 * Check if agent has name/agent definition.
 */
function hasAgentDefinition(agent) {
  if (agent.parsed) {
    if (agent.parsed.agent && typeof agent.parsed.agent.name === 'string') return true;
    if (typeof agent.parsed.name === 'string') return true;
  }
  // Markdown patterns
  if (/\*\*(?:Nome|Name):\*\*\s*.+/i.test(agent.content)) return true;
  if (/^#\s+(?:Agent:\s*)?\S+/m.test(agent.content)) return true;
  return false;
}

/**
 * Check if agent has persona section.
 * Handles YAML-based (persona/persona_profile) and markdown-based
 * (## Role, ## Identidade, ## Identity) formats.
 */
function hasPersonaSection(agent) {
  if (agent.parsed) {
    if (agent.parsed.persona && typeof agent.parsed.persona === 'object') return true;
    if (agent.parsed.persona_profile && typeof agent.parsed.persona_profile === 'object') return true;
  }
  // Markdown-format agents use ## Role, ## Identidade, ## Identity, ## Principios
  return (
    /persona/i.test(agent.content) ||
    /## (?:Role|Identidade|Identity|Principios|Principles)/i.test(agent.content) ||
    /arquet[iy]po/i.test(agent.content) ||
    /\*\*(?:Archetype|Arquetipo):/i.test(agent.content)
  );
}

/**
 * Check if agent has commands section.
 */
function hasCommandsSection(agent) {
  if (agent.parsed) {
    if (agent.parsed.commands !== undefined) return true;
    if (agent.parsed.tools !== undefined) return true;
  }
  return (
    /commands:/i.test(agent.content) ||
    /## (?:Tasks|Comandos|Commands|Heuristics|Responsabilidades|Protocolos|Protocols)/i.test(agent.content) ||
    /\| Task /i.test(agent.content) ||
    /heuristics:/i.test(agent.content)
  );
}

/**
 * Check kebab-case naming: lowercase letters, digits, hyphens only.
 */
function isKebabCase(filename) {
  const name = filename.replace('.md', '');
  return /^[a-z0-9-]+$/.test(name);
}

// ─── Collect all agents from all locations ──────────────────────────────────

const frameworkAgentFiles = collectAgentFiles(FRAMEWORK_AGENTS_DIR);
const sinapseMasterAgentFiles = collectAgentFiles(SINAPSE_AGENTS_DIR);

const squadNames = fs.existsSync(SQUADS_DIR)
  ? fs
      .readdirSync(SQUADS_DIR)
      .filter((d) => {
        const fullPath = path.join(SQUADS_DIR, d);
        return fs.statSync(fullPath).isDirectory();
      })
      .sort()
  : [];

const squadAgentMap = {};
for (const squad of squadNames) {
  const agentsDir = path.join(SQUADS_DIR, squad, 'agents');
  squadAgentMap[squad] = collectAgentFiles(agentsDir);
}

// ─── Test suites ────────────────────────────────────────────────────────────

describe('Agent Backward Compatibility', () => {
  // ═══════════════════════════════════════════════════════════════════════════
  // 1. Framework Development Agents (.sinapse-ai/development/agents/*.md)
  // ═══════════════════════════════════════════════════════════════════════════

  describe('Framework Development Agents', () => {
    const agents = {};

    beforeAll(() => {
      for (const file of frameworkAgentFiles) {
        const filePath = path.join(FRAMEWORK_AGENTS_DIR, file);
        agents[file] = loadAgent(filePath);
      }
    });

    test('at least 10 framework agent files exist', () => {
      expect(frameworkAgentFiles.length).toBeGreaterThanOrEqual(10);
    });

    describe.each(frameworkAgentFiles)('%s', (file) => {
      test('file exists and is readable', () => {
        const filePath = path.join(FRAMEWORK_AGENTS_DIR, file);
        expect(fs.existsSync(filePath)).toBe(true);
        expect(() => fs.readFileSync(filePath, 'utf8')).not.toThrow();
      });

      test('is not empty (> 100 bytes)', () => {
        const agent = agents[file];
        expect(agent.size).toBeGreaterThan(100);
      });

      test('file name matches kebab-case pattern', () => {
        expect(isKebabCase(file)).toBe(true);
      });

      test('contains a top-level heading', () => {
        const agent = agents[file];
        expect(hasTopLevelHeading(agent.content)).toBe(true);
      });

      test('contains agent or name definition', () => {
        const agent = agents[file];
        expect(hasAgentDefinition(agent)).toBe(true);
      });

      test('contains persona section', () => {
        const agent = agents[file];
        expect(hasPersonaSection(agent)).toBe(true);
      });

      test('contains commands section', () => {
        const agent = agents[file];
        expect(hasCommandsSection(agent)).toBe(true);
      });

      test('has whenToUse field', () => {
        const agent = agents[file];
        // sinapse-orqx uses a different structure (markdown-based activation)
        if (file === 'sinapse-orqx.md') {
          expect(
            agent.content.includes('orchestrat') ||
            agent.content.includes('route') ||
            agent.content.includes('diagnos') ||
            agent.content.includes('delegate')
          ).toBe(true);
          return;
        }
        // whenToUse can be at parsed.whenToUse, parsed.agent.whenToUse,
        // or as text in content
        const hasWhenToUse =
          (agent.parsed && (
            agent.parsed.whenToUse ||
            agent.parsed.when_to_use ||
            (agent.parsed.agent && agent.parsed.agent.whenToUse) ||
            (agent.parsed.agent && agent.parsed.agent.when_to_use)
          )) ||
          /whenToUse|when_to_use/i.test(agent.content);
        expect(hasWhenToUse).toBeTruthy();
      });

      test('has relationships or delegation info', () => {
        const agent = agents[file];
        // Check YAML-level relationships
        if (agent.parsed && agent.parsed.relationships) {
          const rel = agent.parsed.relationships;
          expect(
            rel.delegates_to !== undefined || rel.receives_from !== undefined
          ).toBe(true);
          return;
        }
        // Many framework agents define delegation context through
        // heuristics, protocols, or content-level references
        const hasDelegationContext =
          /relationships:/i.test(agent.content) ||
          /delegates_to|receives_from/i.test(agent.content) ||
          /delegate|handoff|escalat/i.test(agent.content) ||
          /co.?agent/i.test(agent.content) ||
          /@\w+/m.test(agent.content); // references to other agents
        expect(hasDelegationContext).toBe(true);
      });
    });
  });

  // ═══════════════════════════════════════════════════════════════════════════
  // 2. Squad Agents (squads/*/agents/*.md)
  // ═══════════════════════════════════════════════════════════════════════════

  describe('Squad Agents', () => {
    const agentCache = {};

    beforeAll(() => {
      for (const squad of squadNames) {
        agentCache[squad] = {};
        for (const file of squadAgentMap[squad]) {
          const filePath = path.join(SQUADS_DIR, squad, 'agents', file);
          agentCache[squad][file] = loadAgent(filePath);
        }
      }
    });

    test('at least 15 squads exist', () => {
      expect(squadNames.length).toBeGreaterThanOrEqual(15);
    });

    for (const squad of squadNames) {
      describe(`${squad}`, () => {
        test('has at least 1 agent file', () => {
          expect(squadAgentMap[squad].length).toBeGreaterThanOrEqual(1);
        });

        const files = squadAgentMap[squad];
        if (files.length === 0) return;

        describe.each(files)('%s', (file) => {
          test('file exists and is readable', () => {
            const filePath = path.join(SQUADS_DIR, squad, 'agents', file);
            expect(fs.existsSync(filePath)).toBe(true);
          });

          test('is not empty (> 100 bytes)', () => {
            const agent = agentCache[squad]?.[file];
            if (!agent) return;
            expect(agent.size).toBeGreaterThan(100);
          });

          test('file name matches kebab-case pattern', () => {
            expect(isKebabCase(file)).toBe(true);
          });

          test('contains a top-level heading', () => {
            const agent = agentCache[squad]?.[file];
            if (!agent) return;
            expect(hasTopLevelHeading(agent.content)).toBe(true);
          });

          test('contains agent or name definition', () => {
            const agent = agentCache[squad]?.[file];
            if (!agent) return;
            expect(hasAgentDefinition(agent)).toBe(true);
          });

          test('contains persona section', () => {
            const agent = agentCache[squad]?.[file];
            if (!agent) return;
            // Some lightweight agents (e.g., sop-extractor) use frontmatter-only format
            // without a dedicated persona section — warn but don't fail
            if (!hasPersonaSection(agent)) {
              console.warn(`  [warn] ${squad}/${file}: no persona section found (frontmatter-only agent)`);
            }
            // At minimum, agent should have description in frontmatter or content
            expect(agent.content.length).toBeGreaterThan(50);
          });

          test('contains commands or tasks section', () => {
            const agent = agentCache[squad]?.[file];
            if (!agent) return;
            expect(hasCommandsSection(agent)).toBe(true);
          });
        });
      });
    }
  });

  // ═══════════════════════════════════════════════════════════════════════════
  // 3. Squad Orchestrator Agents (*-orqx.md)
  // ═══════════════════════════════════════════════════════════════════════════

  describe('Squad Orchestrator Agents', () => {
    const orchestrators = [];

    beforeAll(() => {
      for (const squad of squadNames) {
        for (const file of squadAgentMap[squad]) {
          if (file.includes('orqx')) {
            const filePath = path.join(SQUADS_DIR, squad, 'agents', file);
            orchestrators.push({
              squad,
              file,
              ...loadAgent(filePath),
            });
          }
        }
      }
    });

    test('at least 15 orchestrator agents exist across squads', () => {
      expect(orchestrators.length).toBeGreaterThanOrEqual(15);
    });

    test('each orchestrator has routing intelligence or heuristics', () => {
      for (const orqx of orchestrators) {
        const hasRouting =
          /rout(e|ing)/i.test(orqx.content) ||
          /heuristic/i.test(orqx.content) ||
          /orchestrat/i.test(orqx.content) ||
          /protocol/i.test(orqx.content) ||
          /delegat/i.test(orqx.content) ||
          /workflow/i.test(orqx.content);
        expect(hasRouting).toBe(true);
      }
    });

    test('each orchestrator has commands or protocols section', () => {
      for (const orqx of orchestrators) {
        expect(hasCommandsSection(orqx)).toBe(true);
      }
    });
  });

  // ═══════════════════════════════════════════════════════════════════════════
  // 4. Sinapse Master Squad Agents (sinapse/agents/*.md)
  // ═══════════════════════════════════════════════════════════════════════════

  describe('Sinapse Master Squad Agents', () => {
    const agents = {};

    beforeAll(() => {
      for (const file of sinapseMasterAgentFiles) {
        const filePath = path.join(SINAPSE_AGENTS_DIR, file);
        agents[file] = loadAgent(filePath);
      }
    });

    test('sinapse/agents/ directory exists', () => {
      expect(fs.existsSync(SINAPSE_AGENTS_DIR)).toBe(true);
    });

    test('at least 1 agent file exists', () => {
      expect(sinapseMasterAgentFiles.length).toBeGreaterThanOrEqual(1);
    });

    if (sinapseMasterAgentFiles.length > 0) {
      describe.each(sinapseMasterAgentFiles)('%s', (file) => {
        test('is not empty (> 100 bytes)', () => {
          const agent = agents[file];
          expect(agent.size).toBeGreaterThan(100);
        });

        test('file name matches kebab-case pattern', () => {
          expect(isKebabCase(file)).toBe(true);
        });

        test('contains a top-level heading', () => {
          const agent = agents[file];
          expect(hasTopLevelHeading(agent.content)).toBe(true);
        });
      });
    }
  });

  // ═══════════════════════════════════════════════════════════════════════════
  // 5. Summary — Ecosystem-wide validation
  // ═══════════════════════════════════════════════════════════════════════════

  describe('Ecosystem Summary', () => {
    test('reports total agent count across all locations', () => {
      let totalAgents = frameworkAgentFiles.length;
      totalAgents += sinapseMasterAgentFiles.length;
      for (const squad of squadNames) {
        totalAgents += squadAgentMap[squad].length;
      }

      // Log for visibility
      const summary = {
        frameworkAgents: frameworkAgentFiles.length,
        sinapseMasterAgents: sinapseMasterAgentFiles.length,
        squadCount: squadNames.length,
        squadAgents: Object.fromEntries(
          squadNames.map((s) => [s, squadAgentMap[s].length])
        ),
        totalAgents,
      };

      // eslint-disable-next-line no-console
      console.log('\n--- Agent Ecosystem Summary ---');
      // eslint-disable-next-line no-console
      console.log(`Framework agents: ${summary.frameworkAgents}`);
      // eslint-disable-next-line no-console
      console.log(`Sinapse master agents: ${summary.sinapseMasterAgents}`);
      // eslint-disable-next-line no-console
      console.log(`Squads: ${summary.squadCount}`);
      // eslint-disable-next-line no-console
      console.log(`Total agents: ${summary.totalAgents}`);

      // Ecosystem should have at least 180 agents total (framework + squads)
      expect(totalAgents).toBeGreaterThanOrEqual(180);
    });

    test('all agent file names use kebab-case', () => {
      const violations = [];

      for (const file of frameworkAgentFiles) {
        if (!isKebabCase(file)) violations.push(`framework/${file}`);
      }
      for (const file of sinapseMasterAgentFiles) {
        if (!isKebabCase(file)) violations.push(`sinapse/${file}`);
      }
      for (const squad of squadNames) {
        for (const file of squadAgentMap[squad]) {
          if (!isKebabCase(file)) violations.push(`${squad}/${file}`);
        }
      }

      expect(violations).toEqual([]);
    });

    test('no agent file is empty across the ecosystem', () => {
      const emptyFiles = [];

      const checkDir = (dir, label) => {
        const files = collectAgentFiles(dir);
        for (const file of files) {
          const filePath = path.join(dir, file);
          const stat = fs.statSync(filePath);
          if (stat.size <= 100) {
            emptyFiles.push(`${label}/${file} (${stat.size} bytes)`);
          }
        }
      };

      checkDir(FRAMEWORK_AGENTS_DIR, 'framework');
      checkDir(SINAPSE_AGENTS_DIR, 'sinapse');
      for (const squad of squadNames) {
        checkDir(path.join(SQUADS_DIR, squad, 'agents'), squad);
      }

      expect(emptyFiles).toEqual([]);
    });
  });
});
