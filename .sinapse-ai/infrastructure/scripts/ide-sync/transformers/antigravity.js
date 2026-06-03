/**
 * Antigravity Transformer - Cursor-style format
 * @story 5.1 - IDE Sync Expansion
 *
 * Format: Similar to Cursor, condensed rules format (.md, no frontmatter)
 * Includes a full "All Commands" section in addition to Quick/Key sections.
 * Target: .antigravity/rules/agents/*.md
 */

const { getVisibleCommands, normalizeCommands } = require('../agent-parser');

/**
 * Transform agent data to Antigravity format.
 * Produces a plain Markdown file (no YAML frontmatter) with three command
 * sections: Quick Commands, Key Commands (exclusive), and All Commands.
 *
 * @param {object} agentData - Parsed agent data from agent-parser
 * @param {object|null} agentData.agent - Parsed agent YAML block
 * @param {object|null} agentData.persona_profile - Persona profile block
 * @param {string} agentData.id - Agent ID (basename without .md)
 * @param {string} agentData.filename - Source filename (e.g. sinapse-orqx.md)
 * @param {Array}  agentData.commands - Raw commands array
 * @param {object} agentData.sections - Extracted markdown sections
 * @returns {string} Transformed content ready to write to disk
 */
function transform(agentData) {
  const agent = agentData.agent || {};
  const persona = agentData.persona_profile || {};

  const icon = agent.icon || '🤖';
  const name = agent.name || agentData.id;
  const title = agent.title || 'SINAPSE Agent';
  const whenToUse = agent.whenToUse || 'Use this agent for specific tasks';
  const archetype = persona.archetype || '';

  // Normalize commands to a consistent {name, description, visibility} shape
  const allCommands = normalizeCommands(agentData.commands || []);
  const quickCommands = getVisibleCommands(allCommands, 'quick');
  const keyCommands = getVisibleCommands(allCommands, 'key');

  // Build header
  let content = `# ${name} (@${agentData.id})

${icon} **${title}**${archetype ? ` | ${archetype}` : ''}

> ${whenToUse}

`;

  // Quick Commands section
  if (quickCommands.length > 0) {
    content += `## Quick Commands

`;
    for (const cmd of quickCommands) {
      content += `- \`*${cmd.name}\` - ${cmd.description || 'No description'}\n`;
    }
    content += '\n';
  }

  // Key Commands section — only commands NOT already in Quick
  const keyOnlyCommands = keyCommands.filter(
    (k) => !quickCommands.some((q) => q.name === k.name)
  );
  if (keyOnlyCommands.length > 0) {
    content += `## Key Commands

`;
    for (const cmd of keyOnlyCommands) {
      content += `- \`*${cmd.name}\` - ${cmd.description || 'No description'}\n`;
    }
    content += '\n';
  }

  // All Commands section — shown when total exceeds what quick+key already covers
  if (allCommands.length > quickCommands.length + keyOnlyCommands.length) {
    content += `## All Commands

`;
    for (const cmd of allCommands) {
      content += `- \`*${cmd.name}\` - ${cmd.description || 'No description'}\n`;
    }
    content += '\n';
  }

  // Collaboration section (optional)
  if (agentData.sections && agentData.sections.collaboration) {
    content += `## Collaboration

${agentData.sections.collaboration}

`;
  }

  content += `---
*SINAPSE Agent - Synced from .sinapse-ai/development/agents/${agentData.filename}*
`;

  return content;
}

/**
 * Get the target filename for this agent.
 * Antigravity uses the same filename as the source agent file.
 *
 * @param {object} agentData - Parsed agent data
 * @returns {string} Target filename (e.g. sinapse-orqx.md)
 */
function getFilename(agentData) {
  return agentData.filename;
}

module.exports = {
  transform,
  getFilename,
  format: 'cursor-style',
};
