'use strict';

/**
 * Gemini Commands Sync — generates .gemini/commands/*.toml from parsed agent data.
 *
 * Writes one TOML file per agent plus a sinapse-menu.toml launcher.
 * Called by index.js after agents are parsed; the index.js caller is responsible
 * for registering this as the Gemini IDE target handler.
 *
 * @story 5.1 - IDE Sync Expansion
 */

const fs = require('fs-extra');
const path = require('path');

const FALLBACK_DESCRIPTION = 'Agente especializado SINAPSE';
const MAX_DESCRIPTION_CONTEXT = 120;

const MENU_ORDER = [
  'sinapse-orqx',
  'analyst',
  'architect',
  'data-engineer',
  'developer',
  'devops',
  'project-lead',
  'product-lead',
  'quality-gate',
  'sprint-lead',
  'squad-creator',
  'ux-design-expert',
];

/**
 * Strip the sinapse- prefix so the slug is short and readable.
 * @param {string} agentId
 * @returns {string}
 */
function commandSlugForAgent(agentId) {
  if (agentId.startsWith('sinapse-')) {
    return agentId.replace(/^sinapse-/, '');
  }
  return agentId;
}

/**
 * Return the Gemini slash-command name for an agent.
 * Example: "developer" → "/sinapse-developer"
 * @param {string} agentId
 * @returns {string}
 */
function menuCommandName(agentId) {
  return `/sinapse-${commandSlugForAgent(agentId)}`;
}

/**
 * Collapse internal whitespace and trim.
 * @param {string} text
 * @returns {string}
 */
function normalizeText(text) {
  if (!text || typeof text !== 'string') return '';
  return text.replace(/\s+/g, ' ').trim();
}

/**
 * Truncate to maxLen characters with an ellipsis.
 * @param {string} text
 * @param {number} [maxLen]
 * @returns {string}
 */
function truncateText(text, maxLen = MAX_DESCRIPTION_CONTEXT) {
  if (!text || text.length <= maxLen) return text;
  return `${text.slice(0, maxLen - 1).trimEnd()}…`;
}

/**
 * Extract a concise one-liner from a whenToUse block.
 * Drops redirect/negative-guidance sections before truncating.
 * @param {string} whenToUse
 * @returns {string}
 */
function summarizeWhenToUse(whenToUse) {
  const normalized = normalizeText(whenToUse);
  if (!normalized) return '';

  // Drop redirect/negative guidance sections that are useful for routing, not for menu labels.
  const withoutNegativeSection = normalized.split(/\b(?:NOT\s+for|NÃO\s+para)\b/i)[0].trim();
  const primary = withoutNegativeSection || normalized;

  // Keep only the first sentence/chunk for concise autocomplete labels.
  const firstChunk = primary.split(/[.;!?](?:\s|$)/)[0].trim();
  return truncateText(firstChunk || primary);
}

/**
 * Escape a string for embedding inside a TOML double-quoted scalar.
 * @param {string} text
 * @returns {string}
 */
function escapeTomlString(text) {
  return String(text || '').replace(/\\/g, '\\\\').replace(/"/g, '\\"');
}

/**
 * Build a human-readable one-liner description for an agent entry.
 * Prefers title + whenToUse summary; falls back to SINAPSE generic.
 * @param {object} agent - Parsed agent object from agent-parser
 * @returns {string}
 */
function buildAgentDescription(agent) {
  const agentData = agent.agent || {};
  const title = normalizeText(agentData.title);
  const whenToUseSummary = summarizeWhenToUse(agentData.whenToUse);

  if (title && whenToUseSummary) {
    return `${title} (${whenToUseSummary})`;
  }
  if (title) {
    return title;
  }
  if (whenToUseSummary) {
    return whenToUseSummary;
  }
  return `Ativar agente SINAPSE ${agent.id}`;
}

/**
 * Build the activation prompt stored in each agent's TOML file.
 * References the agent definition at .gemini/rules/SINAPSE/agents/{id}.md.
 * @param {string} agentId
 * @returns {string}
 */
function buildAgentCommandPrompt(agentId) {
  return [
    `Ative o agente ${agentId}:`,
    `1. Leia a definição completa em .gemini/rules/SINAPSE/agents/${agentId}.md`,
    '2. Siga as activation-instructions do bloco YAML',
    `3. Renderize o greeting via: node .sinapse-ai/development/scripts/generate-greeting.js ${agentId}`,
    '   Se shell nao disponivel, exiba o greeting de persona_profile.communication.greeting_levels.named',
    '4. Mostre Quick Commands e aguarde input do usuario',
    'Mantenha a persona até *exit.',
  ].join('\n');
}

/**
 * Build the TOML content for a single agent command file.
 * @param {string} agentId
 * @param {string} [description]
 * @returns {{ filename: string, content: string, agentId: string, description: string }}
 */
function buildAgentCommandFile(agentId, description = FALLBACK_DESCRIPTION) {
  const slug = commandSlugForAgent(agentId);

  const prompt = buildAgentCommandPrompt(agentId);
  const content = [
    `description = "${escapeTomlString(description)}"`,
    'prompt = """',
    prompt,
    '"""',
    '',
  ].join('\n');

  return {
    filename: `sinapse-${slug}.toml`,
    content,
    agentId,
    description,
  };
}

/**
 * Build the multi-line prompt that lists all agents in the launcher menu.
 * @param {Array<{ agentId: string, description: string }>} commandFiles
 * @returns {string}
 */
function buildMenuPrompt(commandFiles) {
  const lines = [
    'Você está no launcher SINAPSE para Gemini.',
    '',
    'Mostre a lista de agentes abaixo em formato numerado, explicando em 1 linha quando usar cada um:',
  ];

  let index = 1;
  for (const commandFile of commandFiles) {
    lines.push(`${index}. ${menuCommandName(commandFile.agentId)} - ${commandFile.description}`);
    index += 1;
  }

  lines.push('');
  lines.push('No final, peça para o usuário escolher um número ou digitar o comando direto.');
  return lines.join('\n');
}

/**
 * Build the sinapse-menu.toml launcher file that lists all agents.
 * @param {Array<{ agentId: string, description: string }>} commandFiles
 * @returns {{ filename: string, content: string }}
 */
function buildMenuCommandFile(commandFiles) {
  const content = [
    'description = "Menu rápido SINAPSE (lista agentes e orienta qual ativar)"',
    'prompt = """',
    buildMenuPrompt(commandFiles),
    '"""',
    '',
  ].join('\n');

  return {
    filename: 'sinapse-menu.toml',
    content,
  };
}

/**
 * Resolve the display order for agent IDs.
 * MENU_ORDER entries come first (in declared order), extras are sorted alphabetically.
 * @param {string[]} agentIds
 * @returns {string[]}
 */
function resolveAgentOrder(agentIds) {
  const unique = [...new Set(agentIds)];
  const known = MENU_ORDER.filter((id) => unique.includes(id));
  const extra = unique.filter((id) => !MENU_ORDER.includes(id)).sort();
  return [...known, ...extra];
}

/**
 * Build the full set of TOML command files for all valid agents.
 * Returns an array of { filename, content, agentId, description } entries,
 * with sinapse-menu.toml prepended as the first item.
 * @param {object[]} agents - Array of parsed agent objects from agent-parser
 * @returns {Array<{ filename: string, content: string, agentId: string, description: string }>}
 */
function buildGeminiCommandFiles(agents) {
  const validAgents = agents
    .filter((agent) => !agent.error)
    .map((agent) => ({
      id: agent.id,
      description: buildAgentDescription(agent),
    }));

  const ordered = resolveAgentOrder(validAgents.map((agent) => agent.id));
  const byId = new Map(validAgents.map((agent) => [agent.id, agent]));
  const files = ordered.map((id) => {
    const meta = byId.get(id);
    const description = meta?.description || FALLBACK_DESCRIPTION;
    return buildAgentCommandFile(id, description);
  });
  files.unshift(buildMenuCommandFile(files));
  return files;
}

/**
 * Write all Gemini command TOML files to {projectRoot}/.gemini/commands/.
 * In dry-run mode the directory is not created and files are not written,
 * but the return value still lists what would have been written.
 * @param {object[]} agents - Parsed agents
 * @param {string} projectRoot - Absolute path to the project root
 * @param {{ dryRun?: boolean }} [options]
 * @returns {{ commandsDir: string, files: Array<{ filename: string, path: string, content: string }> }}
 */
function syncGeminiCommands(agents, projectRoot, options = {}) {
  const commandsDir = path.join(projectRoot, '.gemini', 'commands');
  const files = buildGeminiCommandFiles(agents);
  const written = [];

  if (!options.dryRun) {
    fs.ensureDirSync(commandsDir);
  }

  for (const file of files) {
    const targetPath = path.join(commandsDir, file.filename);
    if (!options.dryRun) {
      fs.writeFileSync(targetPath, file.content, 'utf8');
    }
    written.push({
      filename: path.join('commands', file.filename),
      path: targetPath,
      content: file.content,
    });
  }

  return { commandsDir, files: written };
}

module.exports = {
  FALLBACK_DESCRIPTION,
  MENU_ORDER,
  commandSlugForAgent,
  menuCommandName,
  buildAgentDescription,
  summarizeWhenToUse,
  truncateText,
  escapeTomlString,
  buildGeminiCommandFiles,
  syncGeminiCommands,
};
