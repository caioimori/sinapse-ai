/**
 * IDE Config Generator
 *
 * Story 1.4: IDE Selection
 * Generates IDE-specific configuration files with validation and rollback
 *
 * @module wizard/ide-config-generator
 */

const fs = require('fs-extra');
const path = require('path');
const yaml = require('js-yaml');
const ora = require('ora');
// cross-spawn resolves gemini's Windows .cmd/.ps1 shim WITHOUT a shell and
// escapes argv properly (CVE-2024-27980), so a path with spaces in extensionDir
// stays intact — shell:true would split it and break the link silently.
const crossSpawn = require('cross-spawn');
const { getIDEConfig } = require('../config/ide-configs');
const { validateProjectName } = require('./validators');
const { getMergeStrategy, hasMergeStrategy } = require('../merger/index.js');

/**
 * Render template with variables
 * @param {string} template - Template string
 * @param {Object} variables - Variables to interpolate
 * @returns {string} Rendered template
 */
function renderTemplate(template, variables) {
  let rendered = template;

  // Replace all {{variable}} patterns
  for (const [key, value] of Object.entries(variables)) {
    const regex = new RegExp(`{{${key}}}`, 'g');
    rendered = rendered.replace(regex, value);
  }

  return rendered;
}

/**
 * Validate config content based on format
 * @param {string} content - Config file content
 * @param {string} format - Format: 'json', 'yaml', or 'text'
 * @throws {Error} If validation fails
 */
function validateConfigContent(content, format) {
  if (format === 'json') {
    try {
      JSON.parse(content);
    } catch (error) {
      throw new Error(`Invalid JSON: ${error.message}`);
    }
  } else if (format === 'yaml') {
    try {
      yaml.load(content);
    } catch (error) {
      throw new Error(`Invalid YAML: ${error.message}`);
    }
  }
  // Text format doesn't need validation
}

/**
 * Create backup of existing file
 * @param {string} filePath - Path to file to backup
 * @returns {Promise<string>} Backup file path
 */
async function backupFile(filePath) {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const backupPath = `${filePath}.backup.${timestamp}`;

  await fs.copy(filePath, backupPath);
  return backupPath;
}

/**
 * Prompt user for action when file exists
 * @param {string} filePath - Path to existing file
 * @param {Object} options - Options
 * @param {string} options.projectType - 'BROWNFIELD' | 'GREENFIELD' | 'EXISTING_SINAPSE'
 * @param {boolean} options.forceMerge - If true, auto-select merge without prompting
 * @param {boolean} options.noMerge - If true, don't offer merge option
 * @returns {Promise<string>} Action: 'merge', 'overwrite', 'skip', or 'backup'
 */
async function promptFileExists(filePath, _options = {}) {
  // Story 10.38: Merge-only policy. Users who are not developers must never
  // be able to destroy their own config by choosing "overwrite" in a prompt.
  // If the file has a registered merge strategy, merge unconditionally.
  // Otherwise, fall back to a timestamped backup + overwrite (never plain
  // overwrite, never skip, never prompt).
  if (hasMergeStrategy(filePath)) {
    return 'merge';
  }
  return 'backup';
}

/**
 * Sanitize and validate a candidate project name
 * Converts unsafe directory names to safe project names
 * 
 * @param {string} candidate - Candidate project name (e.g., from path.basename)
 * @returns {string} Safe, validated project name
 */
function sanitizeProjectName(candidate) {
  if (!candidate || typeof candidate !== 'string') {
    return 'my-project';
  }

  // Step 1: Convert to lowercase and replace spaces/special chars with dashes
  let sanitized = candidate
    .toLowerCase()
    .trim()
    .replace(/[^a-zA-Z0-9_-]/g, '-') // Replace non-alphanumeric (except dash/underscore) with dash
    .replace(/[-_]+/g, '-') // Collapse multiple dashes/underscores into single dash
    .replace(/^[-_]+|[-_]+$/g, ''); // Remove leading/trailing dashes/underscores

  // Step 2: Ensure it starts with alphanumeric
  sanitized = sanitized.replace(/^[^a-zA-Z0-9]+/, '');
  
  // Step 3: Limit length (validateProjectName allows up to 100)
  if (sanitized.length > 100) {
    sanitized = sanitized.substring(0, 100);
    // Remove trailing dash if truncation created one
    sanitized = sanitized.replace(/-+$/, '');
  }

  // Step 4: Validate the sanitized name
  const validation = validateProjectName(sanitized);
  
  if (validation === true && sanitized.length > 0) {
    return sanitized;
  }

  // Step 5: If validation fails, generate a safe alphanumeric slug
  // Use first alphanumeric chars from original, or generate default
  const alphanumericOnly = candidate.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
  if (alphanumericOnly.length > 0 && alphanumericOnly.length <= 100) {
    const fallbackValidation = validateProjectName(alphanumericOnly);
    if (fallbackValidation === true) {
      return alphanumericOnly;
    }
  }

  // Step 6: Ultimate fallback - safe default
  return 'my-project';
}

/**
 * Generate template variables from wizard state
 * @param {Object} wizardState - Current wizard state
 * @returns {Object} Template variables
 */
function generateTemplateVariables(wizardState) {
  const timestamp = new Date().toISOString();

  // Safely get project name with validation
  // If provided, validate it; otherwise sanitize fallback from directory name
  let projectName;
  if (wizardState.projectName) {
    const validation = validateProjectName(wizardState.projectName);
    if (validation === true) {
      projectName = wizardState.projectName;
    } else {
      // If provided name is invalid, sanitize it
      projectName = sanitizeProjectName(wizardState.projectName);
    }
  } else {
    // No project name provided, sanitize fallback from directory name
    projectName = sanitizeProjectName(path.basename(process.cwd()));
  }

  return {
    projectName,
    projectType: wizardState.projectType || 'greenfield',
    timestamp,
    sinapseVersion: '2.1.0', // From package.json in real implementation
  };
}

/**
 * Copy agent files from .sinapse-ai/development/agents to IDE-specific agent folder
 * v4 modular structure: agents are now in development/ module
 * @param {string} projectRoot - Project root directory
 * @param {string} agentFolder - Target folder for agent files (IDE-specific)
 * @param {Object} ideConfig - IDE configuration object (optional, for special handling)
 * @returns {Promise<string[]>} List of copied files
 */
async function copyAgentFiles(projectRoot, agentFolder, _ideConfig = null) {
  // v4: Agents are in development/agents/ (not root agents/)
  const sourceDir = path.join(__dirname, '..', '..', '..', '..', '.sinapse-ai', 'development', 'agents');
  const targetDir = path.join(projectRoot, agentFolder);
  const copiedFiles = [];

  // Ensure target directory exists
  await fs.ensureDir(targetDir);

  // Get all agent files (excluding backup files)
  const files = await fs.readdir(sourceDir);
  const agentFiles = files.filter(file =>
    file.endsWith('.md') &&
    !file.includes('.backup') &&
    !file.startsWith('test-'),  // Exclude test agents
  );

  for (const file of agentFiles) {
    const sourcePath = path.join(sourceDir, file);
    // Only copy if source is a file (not directory)
    const stat = await fs.stat(sourcePath);
    if (stat.isFile()) {
      // Copy agent file (Claude Code + Codex only — secondary IDE adapters removed)
      const targetPath = path.join(targetDir, file);
      await fs.copy(sourcePath, targetPath);
      copiedFiles.push(targetPath);
    }
  }

  return copiedFiles;
}

/**
 * Copy .claude/rules folder for Claude Code IDE
 * @param {string} projectRoot - Project root directory
 * @returns {Promise<string[]>} List of copied files
 */
async function copyClaudeRulesFolder(projectRoot) {
  const sourceDir = path.join(__dirname, '..', '..', '..', '..', '.claude', 'rules');
  const targetDir = path.join(projectRoot, '.claude', 'rules');
  const copiedFiles = [];

  // Check if source exists
  if (!await fs.pathExists(sourceDir)) {
    return copiedFiles;
  }

  // Ensure target directory exists
  await fs.ensureDir(targetDir);

  // Get all files in rules folder
  const files = await fs.readdir(sourceDir);

  for (const file of files) {
    const sourcePath = path.join(sourceDir, file);
    const targetPath = path.join(targetDir, file);

    const stat = await fs.stat(sourcePath);
    if (stat.isFile()) {
      await fs.copy(sourcePath, targetPath);
      copiedFiles.push(targetPath);
    }
  }

  return copiedFiles;
}


/**
 * Generate IDE configuration files
 *
 * AC2: Creates appropriate config file for each selected IDE
 * AC3: Validates config content before writing
 * AC4: Handles existing files with user prompt
 * AC5: Shows progress feedback
 *
 * @param {string[]} selectedIDEs - Array of IDE keys
 * @param {Object} wizardState - Current wizard state
 * @param {Object} options - Options
 * @param {string} options.projectRoot - Project root directory (defaults to cwd)
 * @returns {Promise<{success: boolean, files: string[], errors: Array}>}
 *
 * @example
 * const result = await generateIDEConfigs(['cursor', 'github-copilot'], wizardState);
 * console.log(result.files); // ['.cursorrules', '.github/copilot-instructions.md']
 */
async function generateIDEConfigs(selectedIDEs, wizardState, options = {}) {
  const projectRoot = options.projectRoot || process.cwd();
  const createdFiles = [];
  const createdFolders = [];
  const backupFiles = [];
  const errors = [];

  // Generate template variables
  const templateVars = generateTemplateVariables(wizardState);

  const spinner = ora();

  try {
    for (const ideKey of selectedIDEs) {
      const ide = getIDEConfig(ideKey);

      if (!ide) {
        errors.push({ ide: ideKey, error: 'IDE configuration not found' });
        continue;
      }

      spinner.start(`Configuring ${ide.name}...`);

      try {
        // Create directory if needed
        const configPath = path.join(projectRoot, ide.configFile);
        const configDir = path.dirname(configPath);

        if (ide.requiresDirectory) {
          await fs.ensureDir(configDir);
        }

        // Check if file exists
        const exists = await fs.pathExists(configPath);
        let userAction = null;

        if (exists) {
          spinner.stop();
          userAction = await promptFileExists(configPath, {
            projectType: wizardState.projectType,
            forceMerge: options.forceMerge,
            noMerge: options.noMerge,
          });

          if (userAction === 'skip') {
            spinner.succeed(`Skipped ${ide.name} (file exists)`);
            continue;
          }

          if (userAction === 'backup') {
            const backupPath = await backupFile(configPath);
            backupFiles.push(backupPath);
            spinner.info(`Created backup: ${path.basename(backupPath)}`);
          }

          spinner.start(`Configuring ${ide.name}...`);
        }

        // Load template from .sinapse-ai/product/templates/
        const templatePath = path.join(__dirname, '..', '..', '..', '..', '.sinapse-ai', 'product', 'templates', ide.template);

        if (!await fs.pathExists(templatePath)) {
          throw new Error(`Template file not found: ${ide.template}`);
        }

        const template = await fs.readFile(templatePath, 'utf8');

        // Render template
        const rendered = renderTemplate(template, templateVars);

        // Validate content
        validateConfigContent(rendered, ide.format);

        // Handle merge vs overwrite
        let finalContent = rendered;

        if (userAction === 'merge' && exists) {
          // Merge existing content with new template
          spinner.text = `Merging ${ide.configFile}...`;
          const existingContent = await fs.readFile(configPath, 'utf8');
          const merger = getMergeStrategy(configPath);
          const mergeResult = await merger.merge(existingContent, rendered);

          finalContent = mergeResult.content;

          // Show merge summary
          spinner.succeed(`Merged ${ide.configFile}`);
          console.log(`   📋 Preserved: ${mergeResult.stats.preserved}, Updated: ${mergeResult.stats.updated}, Added: ${mergeResult.stats.added}`);
          if (mergeResult.stats.conflicts > 0) {
            console.log(`   ⚠️  Suggestions: ${mergeResult.stats.conflicts} (see comments in file)`);
          }
          spinner.start(`Finishing ${ide.name}...`);
        }

        // Write file
        await fs.writeFile(configPath, finalContent, 'utf8');
        createdFiles.push(configPath);

        spinner.succeed(`Created ${ide.configFile}`);

        // Copy agent files to IDE-specific agent folder
        if (ide.agentFolder) {
          spinner.start(`Copying agents to ${ide.agentFolder}...`);
          const agentFiles = await copyAgentFiles(projectRoot, ide.agentFolder, ide);
          createdFiles.push(...agentFiles);
          createdFolders.push(path.join(projectRoot, ide.agentFolder));

          spinner.succeed(`Copied ${agentFiles.length} agent files to ${ide.agentFolder}`);
        }

        // For Claude Code, also copy .claude/rules folder, hooks, and settings
        if (ideKey === 'claude-code') {
          spinner.start('Copying Claude Code rules...');
          const rulesFiles = await copyClaudeRulesFolder(projectRoot);
          createdFiles.push(...rulesFiles);
          if (rulesFiles.length > 0) {
            createdFolders.push(path.join(projectRoot, '.claude', 'rules'));
            spinner.succeed(`Copied ${rulesFiles.length} rule file(s) to .claude/rules`);
          } else {
            spinner.info('No rule files to copy');
          }

          // BUG-3 fix (INS-1): Copy .claude/hooks/ folder (SYNAPSE engine + precompact)
          spinner.start('Copying Claude Code hooks...');
          const hookFiles = await copyClaudeHooksFolder(projectRoot);
          createdFiles.push(...hookFiles);
          if (hookFiles.length > 0) {
            createdFolders.push(path.join(projectRoot, '.claude', 'hooks'));
            spinner.succeed(`Copied ${hookFiles.length} hook file(s) to .claude/hooks`);
          } else {
            spinner.info('No hook files to copy (SYNAPSE hooks not found in source)');
          }

          // BUG-4 fix (INS-1): Create .claude/settings.local.json with hook registration
          spinner.start('Configuring Claude Code settings...');
          const settingsFile = await createClaudeSettingsLocal(projectRoot);
          if (settingsFile) {
            createdFiles.push(settingsFile);
            spinner.succeed('Created .claude/settings.local.json with registered hooks');
          } else {
            spinner.info('Skipped settings.local.json (no hooks to register)');
          }
        }

        // Gemini parity with Claude Code: copy hooks and configure settings
        if (ideKey === 'gemini') {
          spinner.start('Copying Gemini CLI hooks...');
          const hookFiles = await copyGeminiHooksFolder(projectRoot);
          createdFiles.push(...hookFiles);
          if (hookFiles.length > 0) {
            createdFolders.push(path.join(projectRoot, '.gemini', 'hooks'));
            spinner.succeed(`Copied ${hookFiles.length} hook file(s) to .gemini/hooks`);
          } else {
            spinner.info('No Gemini hook files to copy');
          }

          spinner.start('Configuring Gemini CLI settings...');
          const settingsFile = await createGeminiSettings(projectRoot);
          if (settingsFile) {
            createdFiles.push(settingsFile);
            spinner.succeed('Created .gemini/settings.json with SINAPSE hooks');
          } else {
            spinner.info('Skipped .gemini/settings.json (no hooks to register)');
          }

          spinner.start('Linking Gemini SINAPSE extension...');
          const extensionResult = await linkGeminiExtension(projectRoot);
          if (extensionResult.status === 'linked') {
            spinner.succeed('Gemini extension "sinapse" linked and enabled');
          } else if (extensionResult.status === 'already-linked') {
            spinner.succeed('Gemini extension "sinapse" already linked');
          } else {
            spinner.info(`Skipped Gemini extension linking (${extensionResult.reason})`);
          }
        }

      } catch (error) {
        spinner.fail(`Failed to configure ${ide.name}`);
        errors.push({ ide: ide.name, error: error.message });

        // Rollback: Delete all created files
        for (const file of createdFiles) {
          await fs.remove(file).catch(() => {});
        }

        // Rollback: Delete created folders
        for (const folder of createdFolders) {
          await fs.remove(folder).catch(() => {});
        }

        // Restore backups
        for (const backup of backupFiles) {
          const original = backup.replace(/\.backup\.\d{4}-\d{2}-\d{2}T\d{2}-\d{2}-\d{2}-\d{3}Z$/, '');
          await fs.move(backup, original, { overwrite: true }).catch(() => {});
        }

        throw new Error(`IDE config generation failed for ${ide.name}: ${error.message}`);
      }
    }

    return {
      success: true,
      files: createdFiles,
      errors: errors.length > 0 ? errors : undefined,
    };

  } catch (error) {
    return {
      success: false,
      files: [],
      errors: [{ error: error.message }],
    };
  }
}

/**
 * Show success summary after config generation
 * @param {Object} result - Result from generateIDEConfigs
 */
function showSuccessSummary(result) {
  if (result.files.length === 0) {
    console.log('\nNo IDE configurations created.');
    return;
  }

  // Compact summary: categorize files instead of listing each one
  const agents = result.files.filter(f => f.includes('agents/') || f.includes('agents\\'));
  const rules = result.files.filter(f => f.includes('rules/') || f.includes('rules\\'));
  const hooks = result.files.filter(f => f.includes('hooks/') || f.includes('hooks\\'));
  const other = result.files.length - agents.length - rules.length - hooks.length;

  const parts = [];
  if (agents.length) parts.push(`${agents.length} agents`);
  if (rules.length) parts.push(`${rules.length} rules`);
  if (hooks.length) parts.push(`${hooks.length} hooks`);
  if (other > 0) parts.push(`${other} configs`);

  console.log(`\n✅ IDE: ${result.files.length} files (${parts.join(', ')})`);
}

/**
 * BUG-3 fix (INS-1): Copy .claude/hooks/ folder during installation
 * Only copies JS hooks that work without external dependencies (Python, etc.)
 * @param {string} projectRoot - Project root directory
 * @returns {Promise<string[]>} List of copied files
 */
async function copyClaudeHooksFolder(projectRoot) {
  const sourceDir = path.join(__dirname, '..', '..', '..', '..', '.claude', 'hooks');
  const targetDir = path.join(projectRoot, '.claude', 'hooks');
  const copiedFiles = [];

  if (!await fs.pathExists(sourceDir)) {
    return copiedFiles;
  }

  // QA-C2 fix: Guard source === dest (framework-dev mode)
  if (path.resolve(sourceDir) === path.resolve(targetDir)) {
    return copiedFiles;
  }

  await fs.ensureDir(targetDir);

  // Copy CJS hooks that work standalone (no Python/shell deps)
  const HOOKS_TO_COPY = [
    'synapse-engine.cjs',
    'code-intel-pretool.cjs',
    'precompact-session-digest.cjs',
    // v7.6.0 Constitutional enforcement hooks
    'enforce-architecture-first.cjs',
    'enforce-delegation.cjs',
    'enforce-story-gate.cjs',
    'doc-first-gate.cjs',
    'enforce-framework-boundary.cjs',
    'secret-scanning.cjs',
    'write-path-validation.cjs',
    // Frente 4.3 — DORA + OTel telemetry hooks (STREAM A)
    'telemetry-post-tool.cjs',
    'telemetry-stop.cjs',
    'README.md',
  ];

  const files = await fs.readdir(sourceDir);

  for (const file of files) {
    if (!HOOKS_TO_COPY.includes(file)) {
      continue;
    }

    const sourcePath = path.join(sourceDir, file);
    const targetPath = path.join(targetDir, file);

    const stat = await fs.stat(sourcePath);
    if (stat.isFile()) {
      await fs.copy(sourcePath, targetPath);
      copiedFiles.push(targetPath);
    }
  }

  return copiedFiles;
}

/**
 * Hook event mapping: fileName → { event, matcher, timeout }
 * Maps each .cjs hook file to its correct Claude Code event.
 * Extensible: add new hooks here as they are created.
 *
 * @see Story MIS-3.1 - Fix Session-Digest Hook Registration
 * @see https://code.claude.com/docs/en/hooks (Claude Code Hooks Documentation)
 */
const HOOK_EVENT_MAP = {
  'synapse-engine.cjs': {
    event: 'UserPromptSubmit',
    matcher: null,
    timeout: 10,
  },
  'code-intel-pretool.cjs': {
    event: 'PreToolUse',
    matcher: 'Write|Edit',
    timeout: 10,
  },
  'precompact-session-digest.cjs': {
    event: 'PreCompact',
    matcher: null,
    timeout: 10,
  },
  // v7.6.0 Constitutional enforcement hooks
  'enforce-architecture-first.cjs': {
    event: 'PreToolUse',
    matcher: 'Write|Edit',
    timeout: 5,
  },
  'enforce-story-gate.cjs': {
    event: 'PreToolUse',
    matcher: 'Write|Edit',
    timeout: 5,
  },
  'doc-first-gate.cjs': {
    event: 'PreToolUse',
    matcher: 'Write|Edit',
    timeout: 5,
  },
  // Boundary L1-L4 — protects untouchable framework core when
  // boundary.frameworkProtection=true (read dynamically from core-config.yaml).
  'enforce-framework-boundary.cjs': {
    event: 'PreToolUse',
    matcher: 'Write|Edit',
    timeout: 5,
  },
  'write-path-validation.cjs': {
    event: 'PreToolUse',
    matcher: 'Write|Edit',
    timeout: 5,
  },
  'enforce-delegation.cjs': {
    event: 'PreToolUse',
    matcher: 'Write|Edit|Bash',
    timeout: 5,
  },
  'secret-scanning.cjs': {
    event: 'PreToolUse',
    matcher: 'Write|Edit',
    timeout: 5,
  },
  // Frente 4.3 — DORA + OTel observability hooks (STREAM A)
  // FAIL-OPEN: these hooks swallow all errors and always exit 0.
  'telemetry-post-tool.cjs': {
    event: 'PostToolUse',
    matcher: null,
    timeout: 3,
  },
  'telemetry-stop.cjs': {
    event: 'Stop',
    matcher: null,
    timeout: 5,
  },
  // Statusline agent/squad tracker (Cluster D — feedback visual).
  // Detector writes the per-cwd session-cache the statusline reads;
  // clear wipes it when the session ends. FAIL-OPEN: both exit 0 on error.
  'track-agent.cjs': {
    event: 'UserPromptSubmit',
    matcher: null,
    timeout: 10,
  },
  'track-agent-clear.cjs': {
    event: 'Stop',
    matcher: null,
    timeout: 10,
  },
};

/** Default event config for unmapped hooks (backwards compatible). */
const DEFAULT_HOOK_CONFIG = {
  event: 'UserPromptSubmit',
  matcher: null,
  timeout: 10,
};

/**
 * BUG-4 fix (INS-1) + MIS-3.1: Create .claude/settings.local.json with hook registration
 * Creates or merges hook entries into settings.local.json using HOOK_EVENT_MAP
 * to register each hook under its correct Claude Code event.
 * @param {string} projectRoot - Project root directory
 * @returns {Promise<string|null>} Path to created/updated file, or null if skipped
 */
async function createClaudeSettingsLocal(projectRoot) {
  const settingsPath = path.join(projectRoot, '.claude', 'settings.local.json');
  const hooksDir = path.join(projectRoot, '.claude', 'hooks');

  // Only create if hooks directory exists
  if (!await fs.pathExists(hooksDir)) {
    return null;
  }

  // Find all .cjs hook files dynamically (Story INS-4.3, Gap #13)
  const allFiles = await fs.readdir(hooksDir);
  const hookFiles = allFiles.filter(f => f.endsWith('.cjs'));

  if (hookFiles.length === 0) {
    return null;
  }

  const isWindows = process.platform === 'win32';

  let settings = {};

  // Merge with existing settings if present
  if (await fs.pathExists(settingsPath)) {
    try {
      const existing = await fs.readFile(settingsPath, 'utf8');
      settings = JSON.parse(existing);
    } catch (parseError) {
      // Corrupted file — log and overwrite with fresh settings
      console.error(`   ⚠️  Could not parse ${settingsPath}: ${parseError.message}`);
      settings = {};
    }
  }

  if (!settings.hooks) {
    settings.hooks = {};
  }

  // Register each .cjs hook file under its correct event
  for (const hookFileName of hookFiles) {
    const hookFilePath = path.join(hooksDir, hookFileName);
    const hookConfig = HOOK_EVENT_MAP[hookFileName] || DEFAULT_HOOK_CONFIG;
    const eventName = hookConfig.event;

    // Ensure event array exists
    if (!Array.isArray(settings.hooks[eventName])) {
      settings.hooks[eventName] = [];
    }

    // Windows workaround: $CLAUDE_PROJECT_DIR has known bug on Windows (GH #6023/#5814)
    const hookCommand = isWindows
      ? `node "${hookFilePath.replace(/\\/g, '\\\\')}"` // Absolute path with escaped backslashes
      : `node "$CLAUDE_PROJECT_DIR/.claude/hooks/${hookFileName}"`;

    // Check if this hook is already registered under this event
    const hookBaseName = hookFileName.replace('.cjs', '');
    const alreadyRegistered = settings.hooks[eventName].some(entry => {
      if (Array.isArray(entry.hooks)) {
        return entry.hooks.some(h => h.command && h.command.includes(hookBaseName));
      }
      return entry.command && entry.command.includes(hookBaseName);
    });

    if (!alreadyRegistered) {
      const hookEntry = {
        hooks: [
          {
            type: 'command',
            command: hookCommand,
            timeout: hookConfig.timeout,
          },
        ],
      };

      // Add matcher if configured (e.g., "Write|Edit" for PreToolUse)
      if (hookConfig.matcher) {
        hookEntry.matcher = hookConfig.matcher;
      }

      settings.hooks[eventName].push(hookEntry);
    }
  }

  try {
    await fs.ensureDir(path.dirname(settingsPath));
    await fs.writeFile(settingsPath, JSON.stringify(settings, null, 2), 'utf8');
  } catch (writeError) {
    console.error(`   ⚠️  Failed to write ${settingsPath}: ${writeError.message}`);
    return null;
  }

  return settingsPath;
}

/**
 * Copy .sinapse-ai/hooks/gemini folder into .gemini/hooks during installation
 * @param {string} projectRoot - Project root directory
 * @returns {Promise<string[]>} List of copied files
 */
async function copyGeminiHooksFolder(projectRoot) {
  const sourceDir = path.join(__dirname, '..', '..', '..', '..', '.sinapse-ai', 'hooks', 'gemini');
  const targetDir = path.join(projectRoot, '.gemini', 'hooks');
  const copiedFiles = [];

  if (!await fs.pathExists(sourceDir)) {
    return copiedFiles;
  }

  if (path.resolve(sourceDir) === path.resolve(targetDir)) {
    return copiedFiles;
  }

  await fs.ensureDir(targetDir);

  const files = await fs.readdir(sourceDir);
  for (const file of files) {
    if (!file.endsWith('.js')) continue;

    const sourcePath = path.join(sourceDir, file);
    const targetPath = path.join(targetDir, file);
    const stat = await fs.stat(sourcePath);
    if (stat.isFile()) {
      await fs.copy(sourcePath, targetPath);
      copiedFiles.push(targetPath);
    }
  }

  return copiedFiles;
}

/**
 * Create/merge .gemini/settings.json and register SINAPSE hooks as enabled.
 * @param {string} projectRoot - Project root directory
 * @returns {Promise<string|null>} Path to settings file or null if skipped
 */
async function createGeminiSettings(projectRoot) {
  const settingsPath = path.join(projectRoot, '.gemini', 'settings.json');
  const hooksDir = path.join(projectRoot, '.gemini', 'hooks');

  if (!await fs.pathExists(hooksDir)) {
    return null;
  }

  const hookEntries = [
    {
      event: 'SessionStart',
      matcher: '*',
      hook: {
        name: 'sinapse-session-init',
        type: 'command',
        command: 'node ".gemini/hooks/session-start.js"',
        timeout: 5000,
        enabled: true,
      },
    },
    {
      event: 'BeforeAgent',
      matcher: '*',
      hook: {
        name: 'sinapse-context-inject',
        type: 'command',
        command: 'node ".gemini/hooks/before-agent.js"',
        timeout: 3000,
        enabled: true,
      },
    },
    {
      event: 'BeforeTool',
      matcher: 'write_file|replace|shell|bash|execute',
      hook: {
        name: 'sinapse-security-check',
        type: 'command',
        command: 'node ".gemini/hooks/before-tool.js"',
        timeout: 2000,
        enabled: true,
      },
    },
    {
      event: 'AfterTool',
      matcher: '*',
      hook: {
        name: 'sinapse-audit-log',
        type: 'command',
        command: 'node ".gemini/hooks/after-tool.js"',
        timeout: 2000,
        enabled: true,
      },
    },
    {
      event: 'SessionEnd',
      matcher: '*',
      hook: {
        name: 'sinapse-session-persist',
        type: 'command',
        command: 'node ".gemini/hooks/session-end.js"',
        timeout: 5000,
        enabled: true,
      },
    },
  ];

  let settings = {};
  if (await fs.pathExists(settingsPath)) {
    try {
      settings = JSON.parse(await fs.readFile(settingsPath, 'utf8'));
    } catch (error) {
      console.error(`   ⚠️  Could not parse ${settingsPath}: ${error.message}`);
      settings = {};
    }
  }

  settings.previewFeatures = true;
  settings.folderTrust = settings.folderTrust || { enabled: true };
  settings.hooks = settings.hooks || {};

  for (const entry of hookEntries) {
    if (!Array.isArray(settings.hooks[entry.event])) {
      settings.hooks[entry.event] = [];
    }

    const alreadyRegistered = settings.hooks[entry.event].some((wrapper) => {
      if (wrapper && Array.isArray(wrapper.hooks)) {
        return wrapper.hooks.some((h) => h && h.name === entry.hook.name);
      }
      return false;
    });

    if (!alreadyRegistered) {
      settings.hooks[entry.event].push({
        matcher: entry.matcher,
        hooks: [entry.hook],
      });
    }
  }

  await fs.ensureDir(path.dirname(settingsPath));
  await fs.writeFile(settingsPath, JSON.stringify(settings, null, 2), 'utf8');
  return settingsPath;
}

/**
 * Best-effort Gemini extension linking for SINAPSE project.
 * Does not fail installation when auth/CLI is unavailable.
 * @param {string} projectRoot
 * @returns {Promise<{status: 'linked'|'already-linked'|'skipped', reason?: string}>}
 */
async function linkGeminiExtension(projectRoot) {
  const extensionDir = path.join(projectRoot, 'packages', 'gemini-sinapse-extension');
  const manifestPath = path.join(extensionDir, 'gemini-extension.json');
  const legacyManifestPath = path.join(extensionDir, 'extension.json');

  if (!await fs.pathExists(extensionDir)) {
    return { status: 'skipped', reason: 'extension-dir-not-found' };
  }

  // Gemini CLI >=0.28 expects gemini-extension.json
  if (!await fs.pathExists(manifestPath) && await fs.pathExists(legacyManifestPath)) {
    await fs.copy(legacyManifestPath, manifestPath);
  }

  if (!await fs.pathExists(manifestPath)) {
    return { status: 'skipped', reason: 'manifest-not-found' };
  }

  // On Windows, `gemini` is a .cmd/.ps1 shim — spawnSync without a shell throws
  // EINVAL. Run through the shell on win32 so the shim resolves.
  const versionCheck = crossSpawn.sync('gemini', ['--version'], {
    encoding: 'utf8',
  });
  if (versionCheck.status !== 0) {
    return { status: 'skipped', reason: 'gemini-cli-not-available' };
  }

  let linkResult = crossSpawn.sync('gemini', ['extensions', 'link', extensionDir, '--consent'], {
    cwd: projectRoot,
    encoding: 'utf8',
    timeout: 30000,
  });

  if (linkResult.status === 0) {
    return { status: 'linked' };
  }

  const output = `${linkResult.stdout || ''}\n${linkResult.stderr || ''}`;

  // When already installed, perform idempotent relink.
  if (output.includes('already installed')) {
    const uninstall = crossSpawn.sync('gemini', ['extensions', 'uninstall', 'sinapse'], {
      cwd: projectRoot,
      encoding: 'utf8',
      timeout: 30000,
    });

    if (uninstall.status !== 0) {
      return { status: 'skipped', reason: 'uninstall-failed' };
    }

    linkResult = crossSpawn.sync('gemini', ['extensions', 'link', extensionDir, '--consent'], {
      cwd: projectRoot,
      encoding: 'utf8',
      timeout: 30000,
    });

    if (linkResult.status === 0) {
      return { status: 'linked' };
    }
    return { status: 'skipped', reason: 'relink-failed' };
  }

  if (output.toLowerCase().includes('authentication')) {
    return { status: 'skipped', reason: 'authentication-required' };
  }

  return { status: 'skipped', reason: 'link-failed' };
}

/**
 * Copy .claude/skills/ directories during installation (Story INS-4.3, Gap #11)
 * @param {string} projectRoot - Project root directory
 * @param {string} [_sourceRoot] - Override source root for testing (default: __dirname-relative)
 * @returns {Promise<{count: number, skipped: boolean}>} Copy result
 */
async function copySkillFiles(projectRoot, _sourceRoot) {
  const sourceDir = _sourceRoot
    ? path.join(_sourceRoot, '.claude', 'skills')
    : path.join(__dirname, '..', '..', '..', '..', '.claude', 'skills');
  const targetDir = path.join(projectRoot, '.claude', 'skills');

  if (!await fs.pathExists(sourceDir)) {
    return { count: 0, skipped: true };
  }

  // Guard source === dest (framework-dev mode)
  if (path.resolve(sourceDir) === path.resolve(targetDir)) {
    return { count: 0, skipped: true };
  }

  await fs.ensureDir(targetDir);

  const entries = await fs.readdir(sourceDir, { withFileTypes: true });
  const skillDirs = entries.filter(d => d.isDirectory());
  let count = 0;

  for (const dir of skillDirs) {
    const sourcePath = path.join(sourceDir, dir.name);
    const targetPath = path.join(targetDir, dir.name);
    await fs.copy(sourcePath, targetPath, { overwrite: true });
    count++;
  }

  return { count, skipped: false };
}

/**
 * Copy extra .claude/commands/ files during installation (Story INS-4.3, Gap #12)
 * Uses an allowlist of distributable top-level directories to prevent leaking
 * private squads or project-specific content into installed projects.
 * @param {string} projectRoot - Project root directory
 * @param {string} [_sourceRoot] - Override source root for testing (default: __dirname-relative)
 * @returns {Promise<{count: number, skipped: boolean}>} Copy result
 */
async function copyExtraCommandFiles(projectRoot, _sourceRoot) {
  const sourceDir = _sourceRoot
    ? path.join(_sourceRoot, '.claude', 'commands')
    : path.join(__dirname, '..', '..', '..', '..', '.claude', 'commands');
  const targetDir = path.join(projectRoot, '.claude', 'commands');

  if (!await fs.pathExists(sourceDir)) {
    return { count: 0, skipped: true };
  }

  // Guard source === dest (framework-dev mode)
  if (path.resolve(sourceDir) === path.resolve(targetDir)) {
    return { count: 0, skipped: true };
  }

  // Allowlist: only these top-level entries are distributable.
  // Squad commands (cohort-squad/, design-system/, squad-creator-pro/, etc.)
  // are private and must NOT be copied to installed projects.
  const DISTRIBUTABLE_ENTRIES = new Set([
    'SINAPSE',       // Core agent/script commands (agents/ sub-dir excluded below)
    'synapse',    // SYNAPSE context engine commands
    'greet.md',   // Greeting skill
  ]);

  // Within SINAPSE/, these sub-dirs are excluded (private or handled separately)
  const SINAPSE_EXCLUDED = new Set([
    'SINAPSE/agents',   // Already handled by copyAgentFiles()
    'SINAPSE/stories',  // Project-specific story skills, not distributable
  ]);

  await fs.ensureDir(targetDir);

  let count = 0;

  async function copyRecursive(src, dest, relativePath) {
    const entries = await fs.readdir(src, { withFileTypes: true });

    for (const entry of entries) {
      const entryRelative = relativePath ? `${relativePath}/${entry.name}` : entry.name;

      // At top level, only copy distributable entries
      if (!relativePath && !DISTRIBUTABLE_ENTRIES.has(entry.name)) {
        continue;
      }

      // Within SINAPSE/, skip excluded sub-directories
      if (SINAPSE_EXCLUDED.has(entryRelative) || [...SINAPSE_EXCLUDED].some(ex => entryRelative.startsWith(ex + '/'))) {
        continue;
      }

      const sourcePath = path.join(src, entry.name);
      const targetPath = path.join(dest, entry.name);

      if (entry.isDirectory()) {
        await fs.ensureDir(targetPath);
        await copyRecursive(sourcePath, targetPath, entryRelative);
      } else if (entry.name.endsWith('.md')) {
        await fs.copy(sourcePath, targetPath, { overwrite: true });
        count++;
      }
    }
  }

  await copyRecursive(sourceDir, targetDir, '');
  return { count, skipped: false };
}

module.exports = {
  generateIDEConfigs,
  showSuccessSummary,
  renderTemplate,
  validateConfigContent,
  backupFile,
  promptFileExists,
  generateTemplateVariables,
  copyClaudeHooksFolder,
  createClaudeSettingsLocal,
  copySkillFiles,
  copyExtraCommandFiles,
  copyGeminiHooksFolder,
  createGeminiSettings,
  linkGeminiExtension,
  HOOK_EVENT_MAP,
  DEFAULT_HOOK_CONFIG,
};
