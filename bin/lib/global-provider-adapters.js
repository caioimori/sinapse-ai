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

function writeFileAtomically(filePath, content) {
  const temporaryPath = `${filePath}.${process.pid}.${Date.now()}.tmp`;
  let handle;
  try {
    handle = fs.openSync(temporaryPath, 'wx', 0o600);
    fs.writeFileSync(handle, content, 'utf8');
    fs.fsyncSync(handle);
    fs.closeSync(handle);
    handle = undefined;
    fs.renameSync(temporaryPath, filePath);
  } finally {
    if (handle !== undefined) fs.closeSync(handle);
    try { fs.unlinkSync(temporaryPath); } catch { /* already published or cleanup is best-effort */ }
  }
}

function writeGlobalSkillIfManaged(skillPath, content) {
  fs.mkdirSync(path.dirname(skillPath), { recursive: true });

  let handle;
  try {
    const noFollow = fs.constants.O_NOFOLLOW || 0;
    handle = fs.openSync(skillPath, fs.constants.O_RDONLY | noFollow);
  } catch (error) {
    if (error.code === 'ELOOP') return false;
    if (error.code !== 'ENOENT') throw error;
    try {
      handle = fs.openSync(skillPath, 'wx');
    } catch (createError) {
      if (createError.code === 'EEXIST') return writeGlobalSkillIfManaged(skillPath, content);
      throw createError;
    }
    try {
      fs.writeFileSync(handle, content, 'utf8');
      return true;
    } finally {
      fs.closeSync(handle);
    }
  }

  try {
    if (!fs.fstatSync(handle).isFile()) return false;
    const existing = fs.readFileSync(handle, 'utf8');
    if (!existing.includes('SINAPSE-MANAGED:global-skill')) return false;
    fs.closeSync(handle);
    handle = undefined;
    writeFileAtomically(skillPath, content);
    return true;
  } finally {
    if (handle !== undefined) fs.closeSync(handle);
  }
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
      const skillPath = path.join(skillDir, 'SKILL.md');
      if (writeGlobalSkillIfManaged(skillPath, renderGlobalSkill(skillId))) {
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

module.exports = { parseAgentMarkdown, renderCodexToml, renderGlobalSkill, writeGlobalSkillIfManaged, deliverGlobalProviderAdapters, getGlobalCommandStagingDir };
