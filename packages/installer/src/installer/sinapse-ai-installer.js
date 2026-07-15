/**
 * SINAPSE Core Installer Module
 *
 * Story 1.4/1.6: IDE Selection & Environment Configuration
 * Handles copying .sinapse-ai content (agents, tasks, workflows, templates, etc.)
 * to the target project directory.
 *
 * @module installer/sinapse-ai-installer
 */

const fs = require('fs-extra');
const nativeFs = require('fs');
const path = require('path');
const crypto = require('crypto');
const ora = require('ora');
const { hashFile } = require('./file-hasher');

const NOFOLLOW_READ_FLAGS = nativeFs.constants.O_RDONLY | (nativeFs.constants.O_NOFOLLOW || 0);

async function readRegularFileNoFollow(filePath) {
  let handle;
  try {
    handle = await nativeFs.promises.open(filePath, NOFOLLOW_READ_FLAGS);
    const stat = await handle.stat();
    if (!stat.isFile()) return null;
    return await handle.readFile();
  } catch (error) {
    if (['ENOENT', 'ELOOP', 'EISDIR'].includes(error.code)) return null;
    throw error;
  } finally {
    if (handle) await handle.close();
  }
}

/**
 * Get the path to the source .sinapse-ai directory in the package
 * @returns {string} Absolute path to .sinapse-ai source
 */
function getSinapseCoreSourcePath() {
  // Navigate from packages/installer/src/installer/ to project root/.sinapse-ai
  return path.join(__dirname, '..', '..', '..', '..', '.sinapse-ai');
}

/**
 * Folders to copy from .sinapse-ai
 * v4.0.4 Modular Structure + active auxiliary directories
 * @constant {string[]}
 */
const FOLDERS_TO_COPY = [
  // v4.0.4 Four Pillars
  'core',           // Framework utilities, config, registry, migration
  'development',    // Agents, tasks, workflows, scripts, personas
  'product',        // Templates, checklists, cli, api
  'infrastructure', // Hooks, telemetry, integrations, tools

  // Active auxiliary directories (referenced by code/config)
  'cli',                    // CLI commands (bin/sinapse.js)
  'data',                   // Entity registry, tech presets, knowledge base
  'elicitation',            // Questionnaires (core-config reference)
  'schemas',                // JSON schemas for validation
  'scripts',                // Utility scripts (core-config reference)
  'utils',                  // Shared utilities (tests, format-duration)
  'workflow-intelligence',  // Workflow intelligence engine (*next, *patterns)
];

/**
 * Root files to copy from .sinapse-ai
 * @constant {string[]}
 */
const ROOT_FILES_TO_COPY = [
  'index.js',
  'index.esm.js',
  'core-config.yaml',   // Core framework configuration
  'package.json',       // Module package definition
  'constitution.md',    // SINAPSE fundamental principles
  'user-guide.md',
  'working-in-the-brownfield.md',
];

/** Project-local Codex payloads copied only when Codex support is selected. */
const CODEX_TOP_LEVEL_DIRS = ['.agents', '.codex'];
const CLAUDE_SUPPORT_DIRS = ['.claude/hooks', '.claude/rules'];

function getClaudeHookName(command) {
  const match = String(command || '').replace(/\\/g, '/').match(/\.claude\/hooks\/([^"'\s]+)/);
  return match ? match[1] : null;
}

function getClaudeHookRegistrationKey(event, matcher, hookName) {
  return JSON.stringify([event, matcher ?? null, hookName]);
}

/** Merge shipped SINAPSE hook registrations without replacing user settings. */
async function reconcileClaudeHookSettings(packageRoot, targetDir) {
  const sourcePath = path.join(packageRoot, '.claude', 'settings.json');
  if (!await fs.pathExists(sourcePath)) return null;

  const targetPath = path.join(targetDir, '.claude', 'settings.local.json');
  const source = await fs.readJson(sourcePath);
  let target = {};
  if (await fs.pathExists(targetPath)) {
    try {
      target = await fs.readJson(targetPath);
    } catch (_error) {
      // Preserve malformed user settings verbatim. The installer must not turn
      // a recoverable configuration problem into data loss or a failed install.
      return null;
    }
  }
  if (!target || typeof target !== 'object' || Array.isArray(target)) return null;
  if (!target.hooks || typeof target.hooks !== 'object' || Array.isArray(target.hooks)) {
    target.hooks = {};
  }

  const existingSettings = [target];
  const projectSettingsPath = path.join(targetDir, '.claude', 'settings.json');
  if (await fs.pathExists(projectSettingsPath)) {
    try {
      const projectSettings = await fs.readJson(projectSettingsPath);
      if (projectSettings && typeof projectSettings === 'object' && !Array.isArray(projectSettings)) {
        existingSettings.push(projectSettings);
      }
    } catch (_error) {
      // An invalid sibling settings file cannot provide reliable registrations;
      // ignore it while retaining its contents and merge into settings.local.
    }
  }
  const registered = new Set();
  for (const settings of existingSettings) {
    for (const [event, groups] of Object.entries(settings.hooks || {})) {
      for (const group of Array.isArray(groups) ? groups : []) {
        for (const hook of Array.isArray(group.hooks) ? group.hooks : []) {
          const hookName = getClaudeHookName(hook.command);
          if (hookName) registered.add(getClaudeHookRegistrationKey(event, group.matcher, hookName));
        }
      }
    }
  }

  for (const [event, groups] of Object.entries(source.hooks || {})) {
    if (!Array.isArray(target.hooks[event])) target.hooks[event] = [];
    for (const group of groups || []) {
      for (const hook of group.hooks || []) {
        const hookName = getClaudeHookName(hook.command);
        const registrationKey = getClaudeHookRegistrationKey(event, group.matcher, hookName);
        if (!hookName || registered.has(registrationKey)) continue;
        const registration = { hooks: [hook] };
        if (group.matcher) registration.matcher = group.matcher;
        target.hooks[event].push(registration);
        registered.add(registrationKey);
      }
    }
  }

  await fs.ensureDir(path.dirname(targetPath));
  await fs.writeJson(targetPath, target, { spaces: 2 });
  return path.join('.claude', 'settings.local.json');
}

/**
 * Replace {root} placeholder in file content
 * @param {string} content - File content
 * @param {string} rootPath - Replacement path (e.g., '.sinapse-ai')
 * @returns {string} Content with {root} replaced
 */
function replaceRootPlaceholder(content, rootPath = '.sinapse-ai') {
  return content.replace(/\{root\}/g, rootPath);
}

/**
 * Generate file hashes for installed files
 * Story 7.2: Version Tracking
 *
 * @param {string} targetSinapseCore - Path to .sinapse-ai directory
 * @param {string[]} installedFiles - List of installed files (relative to .sinapse-ai)
 * @returns {Promise<Object>} Object mapping file paths to their sha256 hashes
 */
async function generateFileHashes(targetSinapseCore, installedFiles) {
  const fileHashes = {};

  for (const filePath of installedFiles) {
    const absolutePath = path.join(targetSinapseCore, filePath);

    try {
      if (await fs.pathExists(absolutePath)) {
        const stats = await fs.stat(absolutePath);
        if (stats.isFile()) {
          const hash = hashFile(absolutePath);
          fileHashes[filePath] = `sha256:${hash}`;
        }
      }
    } catch (_error) {
      // Skip files that can't be hashed (permissions, etc.)
      continue;
    }
  }

  return fileHashes;
}

/**
 * Generate version.json for installation tracking
 * Story 7.2: Version Tracking - Enables update command to detect changes
 *
 * @param {Object} options - Options
 * @param {string} options.targetSinapseCore - Path to .sinapse-ai directory
 * @param {string} options.version - Package version
 * @param {string[]} options.installedFiles - List of installed files
 * @param {string} [options.mode='project-development'] - Installation mode
 * @returns {Promise<Object>} version.json content
 */
async function generateVersionJson(options) {
  const {
    targetSinapseCore,
    version,
    installedFiles,
    mode = 'project-development',
    providers = [],
    targetDir = path.dirname(targetSinapseCore),
    providerFiles = [],
    providerSourceRoot = targetDir,
  } = options;

  const fileHashes = await generateFileHashes(targetSinapseCore, installedFiles);
  const providerFileHashes = {};
  for (const relativePath of providerFiles) {
    const sourcePath = path.join(providerSourceRoot, relativePath);
    const sourceContent = await readRegularFileNoFollow(sourcePath);
    if (sourceContent !== null) {
      const installedContent = replaceRootPlaceholder(sourceContent.toString('utf8'));
      const digest = crypto.createHash('sha256').update(installedContent).digest('hex');
      providerFileHashes[relativePath.replace(/\\/g, '/')] = `sha256:${digest}`;
    }
  }

  const versionJson = {
    version,
    installedAt: new Date().toISOString(),
    mode,
    providers: [...new Set(providers)].sort(),
    fileHashes,
    providerFileHashes,
    customized: [],
  };

  const versionJsonPath = path.join(targetSinapseCore, 'version.json');
  await fs.writeJson(versionJsonPath, versionJson, { spaces: 2 });

  return versionJson;
}

/**
 * Copy a single file with optional {root} replacement
 * @param {string} sourcePath - Source file path
 * @param {string} destPath - Destination file path
 * @param {boolean} replaceRoot - Whether to replace {root} placeholders
 * @returns {Promise<boolean>} Success status
 */
/**
 * Predicate: is this destination a user-owned L3 file that must survive a
 * re-install? Matches the boundary contract (core-config.yaml + agent
 * MEMORY.md are L3 "mutable / user-owned") and the README promise that
 * re-running install is an idempotent upsert that preserves customizations.
 * @param {string} destPath - Absolute destination path
 * @returns {boolean}
 */
function isUserOwnedL3(destPath) {
  const norm = String(destPath).replace(/\\/g, '/');
  if (norm.endsWith('/.sinapse-ai/core-config.yaml')) return true;
  if (/\/\.sinapse-ai\/development\/agents\/[^/]+\/MEMORY\.md$/.test(norm)) return true;
  return false;
}

function getManagedCodexSkillPaths(packageRoot) {
  const catalog = fs.readJsonSync(path.join(packageRoot, '.codex', 'catalog.json'));
  return [...new Set([
    ...(catalog.expectedSkillIds || []),
    ...(catalog.publicAliasSkillIds || []),
    catalog.genericAgentSkillId,
  ].filter(Boolean))]
    .sort()
    .map((skillId) => path.posix.join('.agents', 'skills', skillId, 'SKILL.md'));
}

function createCodexPreservePredicate(targetDir, packageRoot, previousProviderHashes = {}) {
  const legacyRegistry = fs.readJsonSync(path.join(
    packageRoot,
    'packages',
    'installer',
    'src',
    'migrations',
    'legacy-codex-native-skill-hashes.json',
  ));
  return (destPath) => {
    const normalized = String(destPath).replace(/\\/g, '/');
    if (normalized.endsWith('/.codex/config.toml') || normalized.endsWith('/.codex/hooks.json')) return true;
    if (!/\/(?:\.codex|\.agents)\/skills\/[^/]+\/SKILL\.md$/.test(normalized)) return false;
    if (!fs.existsSync(destPath)) return false;
    const relativePath = path.relative(targetDir, destPath).replace(/\\/g, '/');
    const digest = hashFile(destPath);
    const previous = String(previousProviderHashes[relativePath] || '').replace(/^sha256:/, '');
    const legacyHashes = legacyRegistry.files[relativePath] || [];
    return digest !== previous && !legacyHashes.includes(digest);
  };
}

async function reconcileLegacyCodexSkills(targetDir, packageRoot) {
  const catalogPath = path.join(packageRoot, '.codex', 'catalog.json');
  if (!await fs.pathExists(catalogPath)) return { removed: 0, migrated: 0, quarantined: 0, ambiguous: [] };

  const catalog = await fs.readJson(catalogPath);
  const managedIds = [...new Set([
    ...(catalog.expectedSkillIds || []),
    ...(catalog.publicAliasSkillIds || []),
    catalog.genericAgentSkillId,
  ].filter((id) => /^[a-z0-9][a-z0-9-]*$/.test(String(id))))].sort();
  const result = { removed: 0, migrated: 0, quarantined: 0, ambiguous: [] };

  for (const skillId of managedIds) {
    const legacyPath = path.join(targetDir, '.codex', 'skills', skillId, 'SKILL.md');
    if (!await fs.pathExists(legacyPath)) continue;
    const legacyContent = await readRegularFileNoFollow(legacyPath);
    if (legacyContent === null) {
      result.ambiguous.push(path.relative(targetDir, legacyPath));
      continue;
    }

    const nativePath = path.join(targetDir, '.agents', 'skills', skillId, 'SKILL.md');
    if (!await fs.pathExists(nativePath)) {
      await fs.ensureDir(path.dirname(nativePath));
      try {
        await fs.writeFile(nativePath, legacyContent, { flag: 'wx' });
      } catch (error) {
        if (error.code === 'EEXIST') {
          result.ambiguous.push(path.relative(targetDir, legacyPath));
          continue;
        }
        throw error;
      }
      await fs.remove(legacyPath);
      if ((await fs.readdir(path.dirname(legacyPath))).length === 0) {
        await fs.remove(path.dirname(legacyPath));
      }
      result.migrated += 1;
      continue;
    }

    const nativeContent = await readRegularFileNoFollow(nativePath);
    if (nativeContent === null) {
      result.ambiguous.push(path.relative(targetDir, legacyPath));
      continue;
    }
    if (legacyContent.equals(nativeContent)) {
      await fs.remove(legacyPath);
      if ((await fs.readdir(path.dirname(legacyPath))).length === 0) {
        await fs.remove(path.dirname(legacyPath));
      }
      result.removed += 1;
      continue;
    }

    const digest = crypto.createHash('sha256').update(legacyContent).digest('hex').slice(0, 12);
    const quarantinePath = path.join(
      targetDir,
      '.sinapse-ai',
      'migrations',
      'codex-skills',
      `${skillId}.${digest}.legacy.md`,
    );
    await fs.ensureDir(path.dirname(quarantinePath));
    try {
      await fs.writeFile(quarantinePath, legacyContent, { flag: 'wx' });
    } catch (error) {
      if (error.code !== 'EEXIST') throw error;
      const quarantinedContent = await readRegularFileNoFollow(quarantinePath);
      if (quarantinedContent === null || !quarantinedContent.equals(legacyContent)) {
        result.ambiguous.push(path.relative(targetDir, legacyPath));
        continue;
      }
    }
    await fs.remove(legacyPath);
    if ((await fs.readdir(path.dirname(legacyPath))).length === 0) {
      await fs.remove(path.dirname(legacyPath));
    }
    result.quarantined += 1;
  }

  return result;
}

async function reconcileLegacyClaudeAgentCommands(targetDir, packageRoot = path.join(__dirname, '..', '..', '..', '..')) {
  const legacyDir = path.join(targetDir, '.claude', 'commands', 'SINAPSE', 'agents');
  const result = { removed: 0, preserved: 0, ambiguous: [] };
  if (!await fs.pathExists(legacyDir)) return result;

  const registryPath = path.join(
    packageRoot,
    'packages',
    'installer',
    'src',
    'migrations',
    'legacy-claude-agent-command-hashes.json',
  );
  const registry = await fs.readJson(registryPath);
  for (const entry of await fs.readdir(legacyDir, { withFileTypes: true })) {
    const filePath = path.join(legacyDir, entry.name);
    if (!entry.isFile()) {
      result.preserved += 1;
      result.ambiguous.push(path.relative(targetDir, filePath));
      continue;
    }
    const content = await fs.readFile(filePath);
    const digest = crypto.createHash('sha256').update(content).digest('hex');
    const knownHashes = registry.files[entry.name] || [];
    const isMarked = content.includes(Buffer.from('SINAPSE-MANAGED:claude-command'));
    if (knownHashes.includes(digest) || isMarked) {
      await fs.remove(filePath);
      result.removed += 1;
    } else {
      result.preserved += 1;
      result.ambiguous.push(path.relative(targetDir, filePath));
    }
  }
  if ((await fs.readdir(legacyDir)).length === 0) await fs.remove(legacyDir);
  return result;
}

async function copyFileWithRootReplacement(sourcePath, destPath, replaceRoot = true, preserveExisting = null) {
  try {
    // Preserve user-owned L3 files (core-config.yaml, agent MEMORY.md) when they
    // already exist — a re-install must not silently wipe the user's config.
    if (preserveExisting && preserveExisting(destPath) && await fs.pathExists(destPath)) {
      return 'preserved';
    }

    await fs.ensureDir(path.dirname(destPath));

    // Check if file needs {root} replacement (.md, .yaml, .yml)
    const ext = path.extname(sourcePath).toLowerCase();
    const needsReplacement = replaceRoot && ['.md', '.yaml', '.yml'].includes(ext);

    if (needsReplacement) {
      const content = await fs.readFile(sourcePath, 'utf8');
      const updatedContent = replaceRootPlaceholder(content, '.sinapse-ai');
      await fs.writeFile(destPath, updatedContent, 'utf8');
    } else {
      await fs.copy(sourcePath, destPath);
    }

    return true;
  } catch (error) {
    console.error(`Failed to copy ${sourcePath}: ${error.message}`);
    return false;
  }
}

/**
 * Copy a directory recursively with {root} replacement
 * @param {string} sourceDir - Source directory path
 * @param {string} destDir - Destination directory path
 * @param {Function} onProgress - Progress callback
 * @returns {Promise<string[]>} List of copied files (relative paths)
 */
async function copyDirectoryWithRootReplacement(sourceDir, destDir, onProgress = null, preserveExisting = null) {
  const copiedFiles = [];

  if (!await fs.pathExists(sourceDir)) {
    return copiedFiles;
  }

  await fs.ensureDir(destDir);

  const items = await fs.readdir(sourceDir, { withFileTypes: true });

  for (const item of items) {
    const sourcePath = path.join(sourceDir, item.name);
    const destPath = path.join(destDir, item.name);

    // Skip backup files and hidden files (except .gitignore and .session*)
    if (item.name.includes('.backup') ||
        (item.name.startsWith('.') && !item.name.startsWith('.session') && item.name !== '.gitignore')) {
      continue;
    }

    if (item.isDirectory()) {
      const subFiles = await copyDirectoryWithRootReplacement(sourcePath, destPath, onProgress, preserveExisting);
      copiedFiles.push(...subFiles);
    } else {
      const success = await copyFileWithRootReplacement(sourcePath, destPath, true, preserveExisting);
      // Only count files actually written; 'preserved' (existing user-owned L3)
      // and false (error) must not inflate the installed-files manifest.
      if (success === true) {
        copiedFiles.push(path.relative(destDir, destPath));
        if (onProgress) {
          onProgress({ file: item.name, copied: true });
        }
      }
    }
  }

  return copiedFiles;
}

async function deliverClaudeNativeAdapters(pkgRoot, targetDir, options = {}) {
  const overwriteManaged = options.overwriteManaged === true;
  const delivered = { agents: [], skills: [], manifest: null };
  const sourceAgents = path.join(pkgRoot, '.claude', 'agents');
  if (await fs.pathExists(sourceAgents)) {
    for (const file of (await fs.readdir(sourceAgents)).filter((name) => /^sinapse-.+\.md$/.test(name))) {
      const destination = path.join(targetDir, '.claude', 'agents', file);
      if (!overwriteManaged && await fs.pathExists(destination)) continue;
      if (await copyFileWithRootReplacement(path.join(sourceAgents, file), destination, true)) {
        delivered.agents.push(path.join('.claude', 'agents', file));
      }
    }
  }

  const sourceSkills = path.join(pkgRoot, '.claude', 'skills');
  if (await fs.pathExists(sourceSkills)) {
    const entries = await fs.readdir(sourceSkills, { withFileTypes: true });
    for (const entry of entries.filter((item) => item.isDirectory())) {
      const source = path.join(sourceSkills, entry.name, 'SKILL.md');
      if (!await fs.pathExists(source)) continue;
      const relativePath = path.join('.claude', 'skills', entry.name, 'SKILL.md');
      const destination = path.join(targetDir, relativePath);
      if (!overwriteManaged && await fs.pathExists(destination)) continue;
      if (await copyFileWithRootReplacement(source, destination, true)) delivered.skills.push(relativePath);
    }
  }
  const manifestSource = path.join(pkgRoot, '.claude', 'skill-manifest.json');
  if (await fs.pathExists(manifestSource)) {
    const relativePath = path.join('.claude', 'skill-manifest.json');
    const destination = path.join(targetDir, relativePath);
    if ((overwriteManaged || !await fs.pathExists(destination)) && await copyFileWithRootReplacement(manifestSource, destination, true)) {
      delivered.manifest = relativePath;
    }
  }
  return delivered;
}

/**
 * Codex CLI context files that live at the package ROOT (not under .codex/ or
 * .sinapse-ai/), so the directory-copy loops never reach them. AGENTS.md is the
 * file Codex reads by default — it carries the Imperator greeting and the full
 * agent roster. Delivered only when the user selects Codex.
 * @constant {string[]}
 */
const CODEX_ROOT_FILES = ['AGENTS.md'];

/**
 * Deliver the Codex root context files (AGENTS.md) into the target project.
 * Idempotent: re-running overwrites the destination so it stays aligned with the
 * shipped roster. Missing source files are skipped silently (never throws).
 *
 * @param {string} pkgRoot - Package root (where AGENTS.md ships)
 * @param {string} targetDir - Destination project root
 * @returns {Promise<string[]>} Relative paths actually delivered
 */
async function deliverCodexRootFiles(pkgRoot, targetDir) {
  const delivered = [];
  for (const name of CODEX_ROOT_FILES) {
    const src = path.join(pkgRoot, name);
    if (!await fs.pathExists(src)) continue;
    const ok = await copyFileWithRootReplacement(src, path.join(targetDir, name));
    if (ok) delivered.push(name);
  }
  return delivered;
}

/**
 * Install .sinapse-ai content to target directory
 *
 * @param {Object} options - Installation options
 * @param {string} [options.targetDir=process.cwd()] - Target directory
 * @param {Function} [options.onProgress] - Progress callback
 * @returns {Promise<Object>} Installation result
 *
 * @example
 * const result = await installSinapseCore({ targetDir: '/path/to/project' });
 * console.log(result.installedFiles); // List of installed files
 */
async function installSinapseCore(options = {}) {
  const {
    targetDir = process.cwd(),
    onProgress = null,
    includeCodex = false,
    includeClaude = false,
    overwriteManagedAdapters = false,
  } = options;

  const result = {
    success: false,
    installedFiles: [],
    installedFolders: [],
    errors: [],
  };

  const spinner = ora('Installing SINAPSE core framework...').start();

  try {
    const sourceDir = getSinapseCoreSourcePath();
    const targetSinapseCore = path.join(targetDir, '.sinapse-ai');
    const previousVersionPath = path.join(targetSinapseCore, 'version.json');
    let previousProviderHashes = {};
    if (await fs.pathExists(previousVersionPath)) {
      try {
        previousProviderHashes = (await fs.readJson(previousVersionPath)).providerFileHashes || {};
      } catch (_error) {
        previousProviderHashes = {};
      }
    }

    // Check if source exists
    if (!await fs.pathExists(sourceDir)) {
      throw new Error('.sinapse-ai source directory not found in package');
    }

    // Create target .sinapse-ai directory
    await fs.ensureDir(targetSinapseCore);

    // Copy each folder
    for (const folder of FOLDERS_TO_COPY) {
      const folderSource = path.join(sourceDir, folder);
      const folderDest = path.join(targetSinapseCore, folder);

      if (await fs.pathExists(folderSource)) {
        spinner.text = `Copying ${folder}...`;

        const copiedFiles = await copyDirectoryWithRootReplacement(
          folderSource,
          folderDest,
          onProgress,
          isUserOwnedL3,
        );

        if (copiedFiles.length > 0) {
          result.installedFolders.push(folder);
          result.installedFiles.push(...copiedFiles.map(f => path.join(folder, f)));
        }
      }
    }

    // Copy root files
    for (const file of ROOT_FILES_TO_COPY) {
      const fileSource = path.join(sourceDir, file);
      const fileDest = path.join(targetSinapseCore, file);

      if (await fs.pathExists(fileSource)) {
        spinner.text = `Copying ${file}...`;
        const success = await copyFileWithRootReplacement(fileSource, fileDest, true, isUserOwnedL3);
        if (success === true) {
          result.installedFiles.push(file);
        }
      }
    }

    // Top-level payload dirs that live OUTSIDE .sinapse-ai (siblings at the
    // package root), so the FOLDERS_TO_COPY loop above never reaches them:
    //  - squads/ : the 17 domain squads (160 specialists + orchestrators).
    //              Needed by BOTH IDEs — Claude syncs the squad orchestrators
    //              into .claude/commands, and Codex resolves the full 172-agent
    //              roster from here. Without it a project has only the 12 core
    //              agents, contradicting the shipped AGENTS.md.
    //  - .codex/ : Codex CLI payload (resolvers, tasks, JSON registries). Only
    //              when the user selected Codex; agents + skills are then
    //              regenerated from squads/ + core by sync-codex-local-first.js.
    const pkgRoot = path.dirname(sourceDir);
    const topLevelDirs = ['squads'];
    if (includeCodex) topLevelDirs.push(...CODEX_TOP_LEVEL_DIRS);
    if (includeClaude) topLevelDirs.push(...CLAUDE_SUPPORT_DIRS);
    for (const dirName of topLevelDirs) {
      const src = path.join(pkgRoot, dirName);
      const dest = path.join(targetDir, dirName);
      if (await fs.pathExists(src)) {
        spinner.text = `Copying ${dirName}...`;
        const preserveExisting = dirName === '.codex' || dirName === '.agents'
          ? createCodexPreservePredicate(targetDir, pkgRoot, previousProviderHashes)
          : null;
        const copied = await copyDirectoryWithRootReplacement(
          src,
          dest,
          onProgress,
          preserveExisting,
        );
        result.installedFiles.push(...copied.map((f) => path.join(dirName, f)));
        if (dirName === '.codex') result.codexInstalledFiles = copied.length;
        if (dirName === '.agents') result.codexNativeSkillFiles = copied.length;
        if (dirName === 'squads') result.squadsInstalledFiles = copied.length;
      }
    }

    if (includeClaude) {
      result.claudeLegacyAgentCommandReconciliation = await reconcileLegacyClaudeAgentCommands(targetDir, pkgRoot);
      const claude = await deliverClaudeNativeAdapters(pkgRoot, targetDir, { overwriteManaged: overwriteManagedAdapters });
      result.claudeNativeAgentFiles = claude.agents.length;
      result.claudeNativeSkillFiles = claude.skills.length;
      result.installedFiles.push(...claude.agents, ...claude.skills);
      if (claude.manifest) result.installedFiles.push(claude.manifest);
      const claudeContextSource = path.join(pkgRoot, '.claude', 'CLAUDE.md');
      const claudeContextDest = path.join(targetDir, '.claude', 'CLAUDE.md');
      if (await fs.pathExists(claudeContextSource) && await copyFileWithRootReplacement(claudeContextSource, claudeContextDest, true)) {
        result.installedFiles.push(path.join('.claude', 'CLAUDE.md'));
      }
      const claudeSettings = await reconcileClaudeHookSettings(pkgRoot, targetDir);
      if (claudeSettings) result.installedFiles.push(claudeSettings);
    }

    // AGENTS.md is the Codex CLI's default context file (Imperator greeting +
    // the full agent roster). It lives at the package ROOT (not under .codex/ or
    // .sinapse-ai/), so neither loop above reaches it. Without it, a Codex user's
    // project has the .codex pointers/resolvers but no greeting and no roster —
    // the parity built in the repo never reaches the user.
    if (includeCodex) {
      spinner.text = 'Copying AGENTS.md...';
      const delivered = await deliverCodexRootFiles(pkgRoot, targetDir);
      if (delivered.includes('AGENTS.md')) {
        result.installedFiles.push('AGENTS.md');
        result.agentsMdInstalled = true;
      }
      result.codexLegacySkillReconciliation = await reconcileLegacyCodexSkills(targetDir, pkgRoot);
    }

    // Create install manifest
    spinner.text = 'Creating installation manifest...';
    const packageVersion = require('../../../../package.json').version;
    const manifest = {
      version: packageVersion,
      installed_at: new Date().toISOString(),
      install_type: 'full',
      files: result.installedFiles,
    };

    await fs.writeFile(
      path.join(targetSinapseCore, 'install-manifest.yaml'),
      require('js-yaml').dump(manifest),
      'utf8',
    );

    // Story 7.2: Create version.json with file hashes for update tracking
    spinner.text = 'Generating version tracking info...';
    const versionInfo = await generateVersionJson({
      targetSinapseCore,
      version: packageVersion,
      installedFiles: result.installedFiles,
      mode: 'project-development',
      providers: [includeClaude && 'claude-code', includeCodex && 'codex'].filter(Boolean),
      targetDir,
      providerFiles: includeCodex ? getManagedCodexSkillPaths(pkgRoot) : [],
      providerSourceRoot: pkgRoot,
    });
    result.versionInfo = versionInfo;

    // BUG-2 fix (INS-1): Install .sinapse-ai dependencies after copy
    // The copied .sinapse-ai/package.json has dependencies (js-yaml, execa, etc.)
    // that must be installed for the activation pipeline to work
    // INS-4.12: Track dep install success for bootstrap guard
    const sinapseCorePackageJson = path.join(targetSinapseCore, 'package.json');
    result.sinapseCoreDepsInstalled = false;
    if (await fs.pathExists(sinapseCorePackageJson)) {
      spinner.text = 'Installing .sinapse-ai dependencies (js-yaml, fast-glob, etc.)...';
      try {
        const { exec } = require('child_process');
        const { promisify } = require('util');
        const execAsync = promisify(exec);
        await execAsync('npm install --production --ignore-scripts', {
          cwd: targetSinapseCore,
          timeout: 60000,
        });
        result.sinapseCoreDepsInstalled = true;
        spinner.succeed('Installed .sinapse-ai dependencies');
        spinner.start('Finishing installation...');
      } catch (depError) {
        spinner.warn(`Could not install .sinapse-ai dependencies: ${depError.message}`);
        spinner.start('Continuing installation...');
        result.errors.push(`Dependencies warning: ${depError.message}`);
      }
    }

    // Stream B (Frente 4.2): propagate the SINAPSE secret-scan guard into the
    // target project via git core.hooksPath + a managed Node pre-commit hook.
    // Best-effort: a hooks-wiring failure must not abort a successful install.
    spinner.text = 'Installing git secret-scan guard...';
    result.gitHooksInstalled = false;
    try {
      const { installGitHooks } = require('./git-hooks-installer');
      const hooksResult = await installGitHooks({ projectDir: targetDir });
      result.gitHooksInstalled = hooksResult.success;
      if (!hooksResult.success && hooksResult.error) {
        result.errors.push(`Git hooks warning: ${hooksResult.error}`);
      }
    } catch (hooksError) {
      result.errors.push(`Git hooks warning: ${hooksError.message}`);
    }

    result.success = true;
    spinner.succeed(`SINAPSE core installed (${result.installedFiles.length} files)`);

  } catch (error) {
    spinner.fail('SINAPSE core installation failed');
    result.errors.push(error.message);
    throw error;
  }

  return result;
}

/**
 * Check if package.json exists in target directory
 * @param {string} targetDir - Directory to check
 * @returns {Promise<boolean>} True if package.json exists
 */
async function hasPackageJson(targetDir = process.cwd()) {
  const packageJsonPath = path.join(targetDir, 'package.json');
  return fs.pathExists(packageJsonPath);
}

/**
 * Create a basic package.json for SINAPSE projects
 * @param {Object} options - Options
 * @param {string} [options.targetDir=process.cwd()] - Target directory
 * @param {string} [options.projectName] - Project name
 * @param {string} [options.projectType='greenfield'] - Project type
 * @returns {Promise<void>}
 */
async function createBasicPackageJson(options = {}) {
  const {
    targetDir = process.cwd(),
    projectName = path.basename(targetDir),
    projectType = 'greenfield',
  } = options;

  const packageJson = {
    name: sanitizePackageName(projectName),
    version: '0.1.0',
    description: `SINAPSE-powered ${projectType} project`,
    private: true,
    scripts: {
      start: 'echo "Configure your start script"',
      test: 'echo "Configure your test script"',
      lint: 'echo "Configure your lint script"',
    },
    keywords: ['sinapse', projectType],
    license: 'MIT',
  };

  const packageJsonPath = path.join(targetDir, 'package.json');
  await fs.writeFile(packageJsonPath, JSON.stringify(packageJson, null, 2), 'utf8');
}

/**
 * Sanitize project name for package.json
 * @param {string} name - Raw project name
 * @returns {string} Sanitized name
 */
function sanitizePackageName(name) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9-_]/g, '-')
    .replace(/--+/g, '-')
    .replace(/^-|-$/g, '') || 'my-project';
}

module.exports = {
  installSinapseCore,
  hasPackageJson,
  createBasicPackageJson,
  getSinapseCoreSourcePath,
  copyFileWithRootReplacement,
  copyDirectoryWithRootReplacement,
  isUserOwnedL3,
  createCodexPreservePredicate,
  getManagedCodexSkillPaths,
  reconcileLegacyCodexSkills,
  reconcileLegacyClaudeAgentCommands,
  generateVersionJson,
  generateFileHashes,
  deliverCodexRootFiles,
  deliverClaudeNativeAdapters,
  getClaudeHookName,
  reconcileClaudeHookSettings,
  FOLDERS_TO_COPY,
  ROOT_FILES_TO_COPY,
  CODEX_ROOT_FILES,
  CODEX_TOP_LEVEL_DIRS,
  CLAUDE_SUPPORT_DIRS,
};
