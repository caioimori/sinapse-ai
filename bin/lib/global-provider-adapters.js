'use strict';

const fs = require('fs');
const path = require('path');

function parseAgentMarkdown(content, fallbackName) {
  const name = content.match(/^name:\s*([^\r\n]+)$/m)?.[1]?.trim() || fallbackName;
  const raw = content.match(/^description:\s*(.+)$/m)?.[1]?.trim() || `SINAPSE ${name} agent`;
  return { name, description: raw.replace(/^['"]|['"]$/g, '') };
}

function renderCodexToml(name, description, instructions) {
  return [
    `name = ${JSON.stringify(name)}`,
    `description = ${JSON.stringify(description)}`,
    `developer_instructions = ${JSON.stringify(instructions)}`,
    '',
  ].join('\n');
}

function renderGlobalSkill(skillId) {
  const generic = skillId === 'sinapse-agent';
  return [
    '---',
    `name: ${skillId}`,
    `description: ${generic ? 'Resolve and activate any globally installed SINAPSE agent by ID.' : 'Activate the globally installed SINAPSE supreme orchestrator.'}`,
    '---', '',
    '<!-- SINAPSE-MANAGED:global-skill -->', '',
    generic ? '# SINAPSE Global Agent Activator' : '# SINAPSE Global Orchestrator', '',
    generic
      ? 'Use the requested ID from `~/.codex/agents/<id>.toml`; reject unknown IDs without guessing.'
      : 'Resolve this alias to the `sinapse-orqx` custom agent and preserve its delegation-only authority.',
    'Canonical global persona and task sources live under `~/.sinapse/`.',
    'Use native Codex delegation and never start a nested CLI.', '',
  ].join('\n');
}

function deliverGlobalProviderAdapters({ llmChoice, home, commandsDir }) {
  const commandFiles = fs.existsSync(commandsDir)
    ? fs.readdirSync(commandsDir).filter((file) => file.endsWith('.md')).sort()
    : [];
  const written = { claude: [], codex: [], skills: [] };

  if (llmChoice === 'claude-code' || llmChoice === 'both') {
    const targetDir = path.join(home, '.claude', 'agents');
    fs.mkdirSync(targetDir, { recursive: true });
    for (const file of commandFiles) {
      fs.copyFileSync(path.join(commandsDir, file), path.join(targetDir, file));
      written.claude.push(file);
    }
  }
  if (llmChoice === 'codex' || llmChoice === 'both') {
    const targetDir = path.join(home, '.codex', 'agents');
    fs.mkdirSync(targetDir, { recursive: true });
    for (const file of commandFiles) {
      const markdown = fs.readFileSync(path.join(commandsDir, file), 'utf8');
      const id = file.replace(/\.md$/, '');
      const metadata = parseAgentMarkdown(markdown, id);
      const tomlName = `${id}.toml`;
      fs.writeFileSync(path.join(targetDir, tomlName), renderCodexToml(metadata.name, metadata.description, markdown), 'utf8');
      const staleMarkdown = path.join(targetDir, file);
      if (fs.existsSync(staleMarkdown)) fs.unlinkSync(staleMarkdown);
      written.codex.push(tomlName);
    }
    const skillsRoot = path.join(home, '.agents', 'skills');
    for (const skillId of ['snps', 'sinapse', 'snps-orqx', 'sinapse-agent']) {
      const skillDir = path.join(skillsRoot, skillId);
      fs.mkdirSync(skillDir, { recursive: true });
      const skillPath = path.join(skillDir, 'SKILL.md');
      const existing = fs.existsSync(skillPath) ? fs.readFileSync(skillPath, 'utf8') : null;
      if (existing === null || existing.includes('SINAPSE-MANAGED:global-skill')) {
        fs.writeFileSync(skillPath, renderGlobalSkill(skillId), 'utf8');
        written.skills.push(skillId);
      }
    }
  }
  return written;
}

function getGlobalCommandStagingDir({ llmChoice, sinapseHome, claudeCommandsDir }) {
  return llmChoice === 'codex'
    ? path.join(sinapseHome, '.generated', 'agents')
    : claudeCommandsDir;
}

module.exports = { parseAgentMarkdown, renderCodexToml, renderGlobalSkill, deliverGlobalProviderAdapters, getGlobalCommandStagingDir };
