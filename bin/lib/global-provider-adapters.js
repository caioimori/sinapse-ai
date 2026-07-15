'use strict';

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const {
  MASTER_ALIAS_ENTRY_POINTS,
  GLOBAL_PROVIDER_SKILL_IDS,
  SUPREME_ORCHESTRATOR_ID,
  SUPREME_PUBLIC_ID,
} = require('./provider-contract');

const NOFOLLOW_READ_FLAGS = fs.constants.O_RDONLY | (fs.constants.O_NOFOLLOW || 0);

function isPathInside(root, candidate) {
  const relative = path.relative(root, candidate);
  return relative === '' || (!relative.startsWith(`..${path.sep}`) && relative !== '..' && !path.isAbsolute(relative));
}

function ensureSafeDirectoryWithinHome(home, directory) {
  const absoluteHome = path.resolve(home);
  const absoluteDirectory = path.resolve(directory);
  if (!isPathInside(absoluteHome, absoluteDirectory)) {
    throw new Error(`Refusing provider write outside HOME: ${absoluteDirectory}`);
  }
  fs.mkdirSync(absoluteHome, { recursive: true });
  const homeStat = fs.lstatSync(absoluteHome);
  if (homeStat.isSymbolicLink() || !homeStat.isDirectory()) {
    throw new Error(`Refusing provider write through unsafe HOME: ${absoluteHome}`);
  }
  const realHome = fs.realpathSync.native(absoluteHome);
  let current = absoluteHome;
  const relative = path.relative(absoluteHome, absoluteDirectory);
  for (const segment of relative.split(path.sep).filter(Boolean)) {
    current = path.join(current, segment);
    if (!fs.existsSync(current)) fs.mkdirSync(current);
    const stat = fs.lstatSync(current);
    if (stat.isSymbolicLink() || !stat.isDirectory()) {
      throw new Error(`Refusing provider write through link/reparse path: ${current}`);
    }
    const realCurrent = fs.realpathSync.native(current);
    if (!isPathInside(realHome, realCurrent)) {
      throw new Error(`Refusing provider write outside HOME through reparse path: ${current}`);
    }
  }
  return absoluteDirectory;
}

function assertSafeFileWithinHome(home, filePath) {
  ensureSafeDirectoryWithinHome(home, path.dirname(filePath));
  if (fs.existsSync(filePath)) {
    const stat = fs.lstatSync(filePath);
    if (stat.isSymbolicLink() || !stat.isFile()) {
      throw new Error(`Refusing provider write through unsafe file: ${filePath}`);
    }
    return stat;
  }
  return null;
}

function readRegularFileNoFollowSync(filePath, encoding = null) {
  let handle;
  try {
    handle = fs.openSync(filePath, NOFOLLOW_READ_FLAGS);
    const opened = fs.fstatSync(handle);
    const after = fs.lstatSync(filePath);
    if (!opened.isFile() || after.isSymbolicLink() || !after.isFile()) return null;
    if (after.dev !== opened.dev || after.ino !== opened.ino) return null;
    return fs.readFileSync(handle, encoding || undefined);
  } catch (error) {
    if (['ENOENT', 'ELOOP', 'EISDIR', 'EINVAL', 'UNKNOWN'].includes(error.code)) return null;
    throw error;
  } finally {
    if (handle !== undefined) fs.closeSync(handle);
  }
}

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
  if (fileName === `${SUPREME_ORCHESTRATOR_ID}.md`) {
    content = content.replace(
      new RegExp(`^name:\\s*${SUPREME_ORCHESTRATOR_ID}\\s*$`, 'm'),
      `name: ${SUPREME_PUBLIC_ID}`,
    );
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
      : `Activate the public adapter \`${SUPREME_PUBLIC_ID}\`, backed by canonical source ID \`${SUPREME_ORCHESTRATOR_ID}\`, and preserve its delegation-only authority.`,
    'Canonical global persona and task sources live under `~/.sinapse/`.',
    'Use native Codex delegation and never start a nested CLI.', '',
  ].join('\n');
}

function captureParentBinding(home, parentPath) {
  ensureSafeDirectoryWithinHome(home, parentPath);
  const handle = fs.openSync(parentPath, fs.constants.O_RDONLY);
  const opened = fs.fstatSync(handle);
  const current = fs.lstatSync(parentPath);
  if (!opened.isDirectory() || current.isSymbolicLink() || !current.isDirectory()
    || opened.dev !== current.dev || opened.ino !== current.ino) {
    fs.closeSync(handle);
    throw new Error(`Refusing provider write through unstable parent: ${parentPath}`);
  }
  return { handle, dev: opened.dev, ino: opened.ino, realPath: fs.realpathSync.native(parentPath) };
}

function assertParentBinding(home, parentPath, binding) {
  ensureSafeDirectoryWithinHome(home, parentPath);
  const current = fs.lstatSync(parentPath);
  const opened = fs.fstatSync(binding.handle);
  const realPath = fs.realpathSync.native(parentPath);
  if (current.isSymbolicLink() || !current.isDirectory() || !opened.isDirectory()
    || current.dev !== binding.dev || current.ino !== binding.ino
    || opened.dev !== binding.dev || opened.ino !== binding.ino
    || realPath !== binding.realPath) {
    throw new Error(`Refusing provider publish after parent path changed: ${parentPath}`);
  }
}

function unlinkFileWithBinding(home, filePath, binding, expected, beforeDelete) {
  if (typeof beforeDelete === 'function') beforeDelete({ filePath, parentPath: path.dirname(filePath) });
  assertParentBinding(home, path.dirname(filePath), binding);
  let current;
  try {
    current = fs.lstatSync(filePath);
  } catch (error) {
    if (error.code === 'ENOENT') return false;
    throw error;
  }
  if (current.isSymbolicLink() || !current.isFile()
    || current.dev !== expected.dev || current.ino !== expected.ino) {
    throw new Error(`Refusing provider delete after file identity changed: ${filePath}`);
  }
  fs.unlinkSync(filePath);
  assertParentBinding(home, path.dirname(filePath), binding);
  return true;
}

function writeFileAtomically(filePath, content, home = path.dirname(filePath), options = {}) {
  const destinationIdentity = assertSafeFileWithinHome(home, filePath);
  const parentPath = path.dirname(filePath);
  const binding = captureParentBinding(home, parentPath);
  const temporaryPath = path.join(
    parentPath,
    `.${path.basename(filePath)}.${crypto.randomBytes(24).toString('hex')}.tmp`,
  );
  let handle;
  let temporaryIdentity;
  let temporaryExists = false;
  try {
    handle = fs.openSync(temporaryPath, 'wx', 0o600);
    temporaryIdentity = fs.fstatSync(handle);
    temporaryExists = true;
    fs.writeFileSync(handle, content, 'utf8');
    fs.fsyncSync(handle);
    fs.closeSync(handle);
    handle = undefined;
    if (typeof options.beforePublish === 'function') {
      options.beforePublish({ filePath, parentPath, temporaryPath });
    }
    assertParentBinding(home, parentPath, binding);
    if (options.exclusive) {
      fs.linkSync(temporaryPath, filePath);
      assertParentBinding(home, parentPath, binding);
      unlinkFileWithBinding(home, temporaryPath, binding, temporaryIdentity, options.beforeTempCleanup);
      temporaryExists = false;
    } else {
      const currentDestination = assertSafeFileWithinHome(home, filePath);
      if (destinationIdentity && (!currentDestination
        || currentDestination.dev !== destinationIdentity.dev
        || currentDestination.ino !== destinationIdentity.ino)) {
        throw new Error(`Refusing provider overwrite after file identity changed: ${filePath}`);
      }
      if (!destinationIdentity && currentDestination) {
        throw new Error(`Refusing provider overwrite of a newly appeared file: ${filePath}`);
      }
      assertParentBinding(home, parentPath, binding);
      fs.renameSync(temporaryPath, filePath);
      temporaryExists = false;
    }
    assertParentBinding(home, parentPath, binding);
  } finally {
    if (handle !== undefined) fs.closeSync(handle);
    let parentStillBound = false;
    try {
      assertParentBinding(home, parentPath, binding);
      parentStillBound = true;
    } catch { /* never traverse the temporary pathname after an ancestor swap */ }
    if (parentStillBound && temporaryExists) {
      try {
        unlinkFileWithBinding(home, temporaryPath, binding, temporaryIdentity, options.beforeTempCleanup);
      } catch { /* fail closed: leave an untrusted temporary path untouched */ }
    }
    fs.closeSync(binding.handle);
  }
}

function writeGlobalSkillIfManaged(skillPath, content, home = path.dirname(skillPath), options = {}) {
  ensureSafeDirectoryWithinHome(home, path.dirname(skillPath));

  let handle;
  try {
    try {
      const existingStat = fs.lstatSync(skillPath);
      if (existingStat.isSymbolicLink() || !existingStat.isFile()) return false;
    } catch (error) {
      if (error.code !== 'ENOENT') throw error;
    }
    const noFollow = fs.constants.O_NOFOLLOW || 0;
    handle = fs.openSync(skillPath, fs.constants.O_RDONLY | noFollow);
  } catch (error) {
    if (error.code === 'ELOOP') return false;
    if (error.code !== 'ENOENT') throw error;
    try {
      writeFileAtomically(skillPath, content, home, { ...options, exclusive: true });
      return true;
    } catch (createError) {
      if (createError.code === 'EEXIST') return writeGlobalSkillIfManaged(skillPath, content, home, options);
      throw createError;
    }
  }

  try {
    const opened = fs.fstatSync(handle);
    const current = fs.lstatSync(skillPath);
    if (!opened.isFile() || current.isSymbolicLink() || !current.isFile()) return false;
    if (current.dev !== opened.dev || current.ino !== opened.ino) return false;
    const existing = fs.readFileSync(handle, 'utf8');
    if (!existing.includes('SINAPSE-MANAGED:global-skill')) return false;
    fs.closeSync(handle);
    handle = undefined;
    writeFileAtomically(skillPath, content, home);
    return true;
  } finally {
    if (handle !== undefined) fs.closeSync(handle);
  }
}

function isValidGlobalSkill(skillId, skillPath) {
  const content = readRegularFileNoFollowSync(skillPath, 'utf8');
  return content !== null && content === renderGlobalSkill(skillId);
}

function removeStaleManagedAgents(targetDir, expectedFiles, extension, options = {}) {
  if (!fs.existsSync(targetDir)) return [];
  const home = options.home || path.dirname(targetDir);
  const binding = captureParentBinding(home, targetDir);
  const expected = new Set(expectedFiles);
  const removed = [];
  try {
    for (const file of fs.readdirSync(targetDir).filter((name) => name.endsWith(extension))) {
      if (expected.has(file)) continue;
      const filePath = path.join(targetDir, file);
      const identity = fs.lstatSync(filePath);
      const content = readRegularFileNoFollowSync(filePath, 'utf8');
      if (content === null) continue;
      const explicitlyManaged = content.includes('SINAPSE-MANAGED:global-agent');
      const legacyManaged = content.includes('ACTIVATION-NOTICE: This command activates an agent from sinapse.')
        && /\.sinapse[\\/]sinapse[\\/]agents[\\/]/.test(content)
        && content.includes('Load the squad manifest');
      if (!explicitlyManaged && !legacyManaged) continue;
      if (unlinkFileWithBinding(home, filePath, binding, identity, options.beforeDelete)) removed.push(file);
    }
  } finally {
    fs.closeSync(binding.handle);
  }
  return removed;
}

function removeManagedFileWithBinding(home, filePath, beforeDelete) {
  let identity;
  try {
    identity = fs.lstatSync(filePath);
  } catch (error) {
    if (error.code === 'ENOENT') return false;
    throw error;
  }
  const content = readRegularFileNoFollowSync(filePath, 'utf8');
  if (content === null || !content.includes('SINAPSE-MANAGED:global-agent')) return false;
  const afterRead = fs.lstatSync(filePath);
  if (afterRead.isSymbolicLink() || !afterRead.isFile()
    || afterRead.dev !== identity.dev || afterRead.ino !== identity.ino) {
    throw new Error(`Refusing provider delete after file identity changed: ${filePath}`);
  }
  const binding = captureParentBinding(home, path.dirname(filePath));
  try {
    return unlinkFileWithBinding(home, filePath, binding, identity, beforeDelete);
  } finally {
    fs.closeSync(binding.handle);
  }
}

function deliverGlobalProviderAdapters({ llmChoice, home, commandsDir, testHooks = {} }) {
  let commandFiles = fs.existsSync(commandsDir)
    ? fs.readdirSync(commandsDir).filter((file) => file.endsWith('.md')).sort()
    : [];
  if (commandFiles.includes(`${SUPREME_ORCHESTRATOR_ID}.md`)) {
    const aliasFiles = new Set(MASTER_ALIAS_ENTRY_POINTS.map((id) => `${id}.md`));
    commandFiles = commandFiles.filter((file) => !aliasFiles.has(file));
  }
  const written = {
    claude: [],
    claudeSkills: [],
    claudeAvailableSkills: [],
    codex: [],
    skills: [],
    availableSkills: [],
  };

  if (llmChoice === 'claude-code' || llmChoice === 'both') {
    const targetDir = path.join(home, '.claude', 'agents');
    ensureSafeDirectoryWithinHome(home, targetDir);
    removeStaleManagedAgents(targetDir, commandFiles, '.md', { home, beforeDelete: testHooks.beforeStaleAgentDelete });
    for (const file of commandFiles) {
      const markdown = markGlobalAgent(fs.readFileSync(path.join(commandsDir, file), 'utf8'), file);
      writeFileAtomically(path.join(targetDir, file), markdown, home);
      written.claude.push(file);
    }
    const skillsRoot = path.join(home, '.claude', 'skills');
    for (const skillId of GLOBAL_PROVIDER_SKILL_IDS) {
      const skillPath = path.join(skillsRoot, skillId, 'SKILL.md');
      if (writeGlobalSkillIfManaged(skillPath, renderGlobalSkill(skillId), home, { beforePublish: testHooks.beforeSkillPublish })) {
        written.claudeSkills.push(skillId);
      }
      if (isValidGlobalSkill(skillId, skillPath)) written.claudeAvailableSkills.push(skillId);
    }
  }
  if (llmChoice === 'codex' || llmChoice === 'both') {
    const targetDir = path.join(home, '.codex', 'agents');
    ensureSafeDirectoryWithinHome(home, targetDir);
    removeStaleManagedAgents(
      targetDir,
      commandFiles.map((file) => file.replace(/\.md$/, '.toml')),
      '.toml',
      { home, beforeDelete: testHooks.beforeStaleAgentDelete },
    );
    for (const file of commandFiles) {
      const markdown = markGlobalAgent(fs.readFileSync(path.join(commandsDir, file), 'utf8'), file);
      const id = file.replace(/\.md$/, '');
      const metadata = parseAgentMarkdown(markdown, id);
      const tomlName = `${id}.toml`;
      writeFileAtomically(path.join(targetDir, tomlName), renderCodexToml(metadata.name, metadata.description, markdown), home);
      const staleMarkdown = path.join(targetDir, file);
      removeManagedFileWithBinding(home, staleMarkdown, testHooks.beforeStaleMarkdownDelete);
      written.codex.push(tomlName);
    }
    const skillsRoot = path.join(home, '.agents', 'skills');
    for (const skillId of GLOBAL_PROVIDER_SKILL_IDS) {
      const skillDir = path.join(skillsRoot, skillId);
      const skillPath = path.join(skillDir, 'SKILL.md');
      if (writeGlobalSkillIfManaged(skillPath, renderGlobalSkill(skillId), home, { beforePublish: testHooks.beforeSkillPublish })) {
        written.skills.push(skillId);
      }
      if (isValidGlobalSkill(skillId, skillPath)) written.availableSkills.push(skillId);
    }
  }
  return written;
}

function getGlobalCommandStagingDir({ llmChoice, sinapseHome, claudeCommandsDir }) {
  void llmChoice;
  void claudeCommandsDir;
  return path.join(sinapseHome, '.generated', 'agents');
}

module.exports = { parseAgentMarkdown, renderCodexToml, markGlobalAgent, renderGlobalSkill, readRegularFileNoFollowSync, writeFileAtomically, writeGlobalSkillIfManaged, isValidGlobalSkill, ensureSafeDirectoryWithinHome, removeStaleManagedAgents, deliverGlobalProviderAdapters, getGlobalCommandStagingDir };
