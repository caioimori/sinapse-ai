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

function markGlobalAgent(markdown, fileName = '') {
  let content = markdown;
  if (fileName === 'snps-orqx.md') {
    content = content.replace(/^name:\s*snps-orqx\s*$/m, 'name: sinapse-orqx');
  }
  if (content.includes('SINAPSE-MANAGED:global-agent')) return content;
  return `${content.trimEnd()}\n\n<!-- SINAPSE-MANAGED:global-agent -->\n`;
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
      ? 'Resolve the requested ID through the native agent catalog of the active provider; reject unknown IDs without guessing.'
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

function removeStaleManagedAgents(targetDir, expectedFiles, extension) {
  if (!fs.existsSync(targetDir)) return [];
  const expected = new Set(expectedFiles);
  const removed = [];
  for (const file of fs.readdirSync(targetDir).filter((name) => name.endsWith(extension))) {
    if (expected.has(file)) continue;
    const filePath = path.join(targetDir, file);
    if (!fs.statSync(filePath).isFile()) continue;
    const content = fs.readFileSync(filePath, 'utf8');
    const explicitlyManaged = content.includes('SINAPSE-MANAGED:global-agent');
    const legacyManaged = content.includes('ACTIVATION-NOTICE: This command activates an agent from sinapse.')
      && /\.sinapse[\\/]sinapse[\\/]agents[\\/]/.test(content)
      && content.includes('Load the squad manifest');
    if (!explicitlyManaged && !legacyManaged) continue;
    fs.unlinkSync(filePath);
    removed.push(file);
  }
  return removed;
}

function deliverGlobalProviderAdapters({ llmChoice, home, commandsDir }) {
  let commandFiles = fs.existsSync(commandsDir)
    ? fs.readdirSync(commandsDir).filter((file) => file.endsWith('.md')).sort()
    : [];
  if (commandFiles.includes('snps-orqx.md')) {
    const aliasFiles = new Set(['sinapse.md', 'sinapse-orqx.md', 'snps.md']);
    commandFiles = commandFiles.filter((file) => !aliasFiles.has(file));
  }
  const written = { claude: [], claudeSkills: [], codex: [], skills: [] };

  if (llmChoice === 'claude-code' || llmChoice === 'both') {
    const targetDir = path.join(home, '.claude', 'agents');
    fs.mkdirSync(targetDir, { recursive: true });
    removeStaleManagedAgents(targetDir, commandFiles, '.md');
    for (const file of commandFiles) {
      const markdown = markGlobalAgent(fs.readFileSync(path.join(commandsDir, file), 'utf8'), file);
      fs.writeFileSync(path.join(targetDir, file), markdown, 'utf8');
      written.claude.push(file);
    }
    const skillsRoot = path.join(home, '.claude', 'skills');
    for (const skillId of ['snps', 'sinapse', 'snps-orqx', 'sinapse-orqx', 'sinapse-agent']) {
      const skillPath = path.join(skillsRoot, skillId, 'SKILL.md');
      if (writeGlobalSkillIfManaged(skillPath, renderGlobalSkill(skillId))) {
        written.claudeSkills.push(skillId);
      }
    }
  }
  if (llmChoice === 'codex' || llmChoice === 'both') {
    const targetDir = path.join(home, '.codex', 'agents');
    fs.mkdirSync(targetDir, { recursive: true });
    removeStaleManagedAgents(
      targetDir,
      commandFiles.map((file) => file.replace(/\.md$/, '.toml')),
      '.toml',
    );
    for (const file of commandFiles) {
      const markdown = markGlobalAgent(fs.readFileSync(path.join(commandsDir, file), 'utf8'), file);
      const id = file.replace(/\.md$/, '');
      const metadata = parseAgentMarkdown(markdown, id);
      const tomlName = `${id}.toml`;
      fs.writeFileSync(path.join(targetDir, tomlName), renderCodexToml(metadata.name, metadata.description, markdown), 'utf8');
      const staleMarkdown = path.join(targetDir, file);
      if (fs.existsSync(staleMarkdown)) fs.unlinkSync(staleMarkdown);
      written.codex.push(tomlName);
    }
    const skillsRoot = path.join(home, '.agents', 'skills');
    for (const skillId of ['snps', 'sinapse', 'snps-orqx', 'sinapse-orqx', 'sinapse-agent']) {
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
  void llmChoice;
  void claudeCommandsDir;
  return path.join(sinapseHome, '.generated', 'agents');
}

module.exports = { parseAgentMarkdown, renderCodexToml, markGlobalAgent, renderGlobalSkill, writeGlobalSkillIfManaged, removeStaleManagedAgents, deliverGlobalProviderAdapters, getGlobalCommandStagingDir };
