/**
 * SINAPSE Interactive Wizard - Main Entry Point
 *
 * Story 1.2: Interactive Wizard Foundation
 * Provides core wizard functionality with visual feedback and navigation
 *
 * @module wizard
 */

const inquirer = require('inquirer');
const os = require('os');
const path = require('path');
const fse = require('fs-extra');
const { execSync } = require('child_process');
const { colors } = require('../utils/sinapse-colors');
const {
  getLanguageQuestion,
  getUserProfileQuestion,
  getLLMQuestion,
  getProjectTypeQuestion,
  getIDEQuestions,
  getTechPresetQuestion,
} = require('./questions');
const { setLanguage, t } = require('./i18n');
const yaml = require('js-yaml');
const { showWelcome, showCompletion, showCancellation } = require('./feedback');
const { generateIDEConfigs, showSuccessSummary, copySkillFiles, copyExtraCommandFiles } = require('./ide-config-generator');
const {
  configureEnvironment,
} = require('../config/configure-environment');
const {
  installDependencies,
} = require('../installer/dependency-installer');
const { commandSync, commandValidate } = require('../../../../.sinapse-ai/infrastructure/scripts/ide-sync/index');
const {
  installSinapseCore,
  hasPackageJson,
} = require('../installer/sinapse-ai-installer');
const {
  validateInstallation,
  displayValidationReport,
  provideTroubleshooting,
} = require('./validation');
const {
  installLLMRouting,
  isLLMRoutingInstalled,
} = require('../../../../.sinapse-ai/infrastructure/scripts/llm-routing/install-llm-routing');

// DISABLED: Legacy installation block superseded by squads flow (OSR-8)
// /**
//  * Generate AntiGravity workflow content for squad agents
//  * @param {string} agentName - Agent name (e.g., 'data-collector')
//  * @param {string} packName - Starter squad name (e.g., 'etl')
//  * @returns {string} Workflow file content
//  */
// function generateExpansionPackWorkflow(agentName, packName) {
//   const displayName = agentName.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
//
//   return `---
// description: Ativa o agente ${displayName} (${packName})
// ---
//
// # Ativação do Agente ${displayName}
//
// **Squad:** ${packName}
//
// **INSTRUÇÕES CRÍTICAS PARA O ANTIGRAVITY:**
//
// 1. Leia COMPLETAMENTE o arquivo \`.antigravity/agents/${packName}/${agentName}.md\`
// 2. Siga EXATAMENTE as \`activation-instructions\` definidas no bloco YAML do agente
// 3. Adote a persona conforme definido no agente
// 4. Execute a saudação conforme \`greeting_levels\` definido no agente
// 5. **MANTENHA esta persona até receber o comando \`*exit\`**
// 6. Responda aos comandos com prefixo \`*\` conforme definido no agente
// 7. Siga as regras globais do projeto em \`.antigravity/rules.md\`
//
// **Comandos disponíveis:** Use \`*help\` para ver todos os comandos do agente.
// `;
// }

/**
 * Check for existing user_profile in core-config.yaml (Story 10.2 - Idempotency)
 * Returns the existing profile if found, null otherwise
 *
 * @param {string} targetDir - Target directory to check
 * @returns {Promise<string|null>} Existing user profile or null
 */
async function getExistingUserProfile(targetDir = process.cwd()) {
  const coreConfigPath = path.join(targetDir, '.sinapse-ai', 'core-config.yaml');

  try {
    if (await fse.pathExists(coreConfigPath)) {
      const content = await fse.readFile(coreConfigPath, 'utf8');
      const config = yaml.load(content);

      if (config && config.user_profile) {
        // Validate the value
        const validProfiles = ['bob', 'advanced'];
        const normalizedProfile = String(config.user_profile).toLowerCase().trim();

        if (validProfiles.includes(normalizedProfile)) {
          return normalizedProfile;
        }
      }
    }
  } catch {
    // Config doesn't exist or is invalid - will ask for profile
  }

  return null;
}

/**
 * Map wizard language code to Claude Code settings.json language name (Story ACT-12)
 * Claude Code uses full language names, not ISO codes.
 */
const LANGUAGE_MAP = {
  en: 'english',
  pt: 'portuguese',
};

/**
 * Write language preference to Claude Code's native settings.json (Story ACT-12)
 * Replaces the old approach of storing language in core-config.yaml.
 * Claude Code v4.0.4+ natively supports a `language` field in settings.json
 * that is automatically injected into the system prompt.
 *
 * @param {string} language - Language code from wizard (en|pt|es)
 * @param {string} [projectDir] - Project directory (default: process.cwd())
 * @returns {Promise<boolean>} true if written successfully
 */
async function writeClaudeSettings(language, projectDir = process.cwd()) {
  const claudeDir = path.join(projectDir, '.claude');
  const settingsPath = path.join(claudeDir, 'settings.json');

  try {
    await fse.ensureDir(claudeDir);

    let settings = {};
    if (await fse.pathExists(settingsPath)) {
      const content = await fse.readFile(settingsPath, 'utf8');
      settings = JSON.parse(content);
    }

    const claudeLanguage = LANGUAGE_MAP[language] || language;
    settings.language = claudeLanguage;

    await fse.writeFile(settingsPath, JSON.stringify(settings, null, 2) + '\n', 'utf8');
    return true;
  } catch {
    // Non-blocking: language is a preference, not critical
    return false;
  }
}

/**
 * Get existing language from Claude Code settings.json (Story ACT-12 - Idempotency)
 * Returns the existing language code if found, null otherwise.
 *
 * @param {string} [projectDir] - Project directory to check
 * @returns {Promise<string|null>} Existing language code or null
 */
async function getExistingLanguage(projectDir = process.cwd()) {
  const settingsPath = path.join(projectDir, '.claude', 'settings.json');

  try {
    if (await fse.pathExists(settingsPath)) {
      const content = await fse.readFile(settingsPath, 'utf8');
      const settings = JSON.parse(content);

      if (settings && settings.language) {
        // Reverse map: Claude Code language name → wizard code
        const reverseMap = Object.fromEntries(
          Object.entries(LANGUAGE_MAP).map(([k, v]) => [v, k]),
        );
        const langValue = String(settings.language).toLowerCase().trim();
        return reverseMap[langValue] || null;
      }
    }
  } catch {
    // Settings don't exist or invalid JSON
  }

  return null;
}

/**
 * Handle Ctrl+C gracefully
 */
let cancellationRequested = false;
let sigintHandlerAdded = false;

function setupCancellationHandler() {
  // Prevent adding multiple listeners (MaxListeners warning fix)
  if (sigintHandlerAdded) {
    return;
  }

  // Increase limit to prevent warning during testing
  process.setMaxListeners(15);

  const handleSigint = async () => {
    if (cancellationRequested) {
      // Second Ctrl+C - force exit
      console.log('\nForce exit');
      process.exit(0);
    }

    cancellationRequested = true;

    console.log('\n');
    const { t: translate } = require('./i18n');
    const { confirmCancel } = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'confirmCancel',
        message: translate('cancelConfirm'),
        default: false,
      },
    ]);

    if (confirmCancel) {
      showCancellation();
      process.exit(0);
    } else {
      cancellationRequested = false;
      console.log(translate('continuing') + '\n');
      // Note: inquirer will resume automatically
    }
  };

  process.on('SIGINT', handleSigint);
  sigintHandlerAdded = true;
}

/**
 * Auto-detect project type based on filesystem markers
 *
 * @param {string} [cwd] - Working directory to inspect
 * @returns {string} 'upgrade' | 'brownfield' | 'greenfield'
 */
function detectProjectType(cwd = process.cwd()) {
  if (fse.existsSync(path.join(cwd, '.sinapse-ai'))) {
    return 'upgrade';
  }
  if (fse.existsSync(path.join(cwd, 'package.json'))) {
    return 'brownfield';
  }
  return 'greenfield';
}

/**
 * Auto-detect tech preset based on project files
 *
 * @param {string} [cwd] - Working directory to inspect
 * @returns {string} Detected preset name or 'none'
 */
function detectTechPreset(cwd = process.cwd()) {
  // Check package.json for Next.js
  const pkgPath = path.join(cwd, 'package.json');
  if (fse.existsSync(pkgPath)) {
    try {
      const pkg = JSON.parse(fse.readFileSync(pkgPath, 'utf8'));
      const allDeps = {
        ...(pkg.dependencies || {}),
        ...(pkg.devDependencies || {}),
      };
      if (allDeps['next']) return 'nextjs-react';
    } catch {
      // Ignore parse errors
    }
  }

  if (fse.existsSync(path.join(cwd, 'go.mod'))) return 'go';
  if (fse.existsSync(path.join(cwd, 'Cargo.toml'))) return 'rust';
  if (fse.existsSync(path.join(cwd, 'pom.xml'))) return 'java';
  if (fse.existsSync(path.join(cwd, 'composer.json'))) return 'php';

  // Check for .csproj files
  try {
    const entries = fse.readdirSync(cwd);
    if (entries.some((f) => f.endsWith('.csproj'))) return 'csharp';
  } catch {
    // Ignore
  }

  return 'none';
}

/**
 * Map LLM selection to IDE list for generateIDEConfigs
 *
 * @param {string} selectedLLM - 'claude-code' | 'codex' | 'both'
 * @returns {string[]} IDE identifiers
 */
function llmToIDEs(selectedLLM) {
  switch (selectedLLM) {
    case 'claude-code':
      return ['claude-code'];
    case 'codex':
      return ['codex'];
    case 'both':
      return ['claude-code', 'codex'];
    default:
      return ['claude-code'];
  }
}

/**
 * Map LLM selection to a display label for the completion screen
 *
 * @param {string} selectedLLM - 'claude-code' | 'codex' | 'both'
 * @returns {string} Human-readable label
 */
function llmLabel(selectedLLM) {
  switch (selectedLLM) {
    case 'claude-code':
      return 'Claude Code';
    case 'codex':
      return 'Codex CLI';
    case 'both':
      return 'Claude Code + Codex CLI';
    default:
      return 'Claude Code';
  }
}

/**
 * 19 orqx agent definitions to install globally.
 * Each entry maps agent-id to its squad directory name.
 */
const GLOBAL_AGENTS = [
  { id: 'sinapse-orqx', squad: 'sinapse' },
  { id: 'animations-orqx', squad: 'squad-animations' },
  { id: 'brand-orqx', squad: 'squad-brand' },
  { id: 'claude-orqx', squad: 'squad-claude' },
  { id: 'cloning-orqx', squad: 'squad-cloning' },
  { id: 'commercial-orqx', squad: 'squad-commercial' },
  { id: 'content-orqx', squad: 'squad-content' },
  { id: 'copy-orqx', squad: 'squad-copy' },
  { id: 'council-orqx', squad: 'squad-council' },
  { id: 'courses-orqx', squad: 'squad-courses' },
  { id: 'cyber-orqx', squad: 'squad-cybersecurity' },
  { id: 'design-orqx', squad: 'squad-design' },
  { id: 'finance-orqx', squad: 'squad-finance' },
  { id: 'growth-orqx', squad: 'squad-growth' },
  { id: 'paidmedia-orqx', squad: 'squad-paidmedia' },
  { id: 'product-orqx', squad: 'squad-product' },
  { id: 'research-orqx', squad: 'squad-research' },
  { id: 'storytelling-orqx', squad: 'squad-storytelling' },
  { id: 'swarm-orqx', squad: 'squad-claude' },
];

/**
 * Generate the markdown template for a global orqx agent definition.
 *
 * @param {string} agentId - Agent identifier (e.g. 'brand-orqx')
 * @param {string} squadName - Squad directory name (e.g. 'squad-brand')
 * @param {string} homedir - Absolute path to user home directory
 * @returns {string} Markdown content for the agent file
 */
function buildAgentTemplate(agentId, squadName, homedir) {
  // Normalise to forward slashes for the template paths (cross-platform readability)
  const agentDefPath = path.join(homedir, '.sinapse', squadName, 'agents', `${agentId}.md`).replace(/\\/g, '/');
  const squadManifestPath = path.join(homedir, '.sinapse', squadName, 'squad.yaml').replace(/\\/g, '/');

  return [
    '---',
    `name: ${agentId}`,
    `description: "${squadName} orchestrator — routes to specialized agents within the squad"`,
    'tools: [Read, Grep, Glob, Write, Edit, Bash, WebSearch, WebFetch]',
    '---',
    '',
    `# ${agentId}`,
    '',
    'ACTIVATION-NOTICE: This command activates an agent from sinapse.',
    '',
    `CRITICAL: Read the agent definition file at \`${agentDefPath}\` to understand your full operating parameters. Then:`,
    `1. Adopt the persona defined in that file`,
    `2. Load the squad manifest at \`${squadManifestPath}\` for context`,
    '3. Display a greeting showing your agent name, role, and available commands',
    '4. HALT and await user input',
    '',
  ].join('\n');
}

/**
 * Install 19 global orqx agent definitions to ~/.claude/agents/
 * Each file is a small markdown that points to the full agent definition
 * inside the user's ~/.sinapse/{squad}/ directory.
 *
 * @returns {Promise<{success: boolean, count: number, errors: string[]}>}
 */
async function installGlobalAgents() {
  const homedir = os.homedir();
  const agentsDir = path.join(homedir, '.claude', 'agents');
  const errors = [];
  let count = 0;

  try {
    await fse.ensureDir(agentsDir);
  } catch (err) {
    return { success: false, count: 0, errors: [`Failed to create ${agentsDir}: ${err.message}`] };
  }

  for (const agent of GLOBAL_AGENTS) {
    try {
      const content = buildAgentTemplate(agent.id, agent.squad, homedir);
      const filePath = path.join(agentsDir, `${agent.id}.md`);
      await fse.writeFile(filePath, content, 'utf8');
      count++;
    } catch (err) {
      errors.push(`${agent.id}: ${err.message}`);
    }
  }

  return { success: errors.length === 0, count, errors };
}

/**
 * Main wizard execution function
 *
 * Simplified 2-step flow:
 *   Step 1: Welcome screen (immersive)
 *   Step 2: LLM selection (single question)
 *   Everything else is auto-detected.
 *
 * @returns {Promise<Object>} Wizard answers object
 *
 * @example
 * const { runWizard } = require('./src/wizard');
 * const answers = await runWizard();
 * console.log(answers.projectType); // 'greenfield', 'brownfield', or 'upgrade'
 */
async function runWizard(options = {}) {
  try {
    // Setup graceful cancellation
    setupCancellationHandler();

    // Show welcome message with SINAPSE branding
    if (!options.quiet) {
      showWelcome();
    }

    // Hardcode PT-BR as default language
    const language = options.language || 'pt';
    setLanguage(language);

    let answers = {};

    // Auto-detect project type and tech preset (always)
    const detectedProjectType = detectProjectType();
    const detectedTechPreset = detectTechPreset();

    if (options.quiet) {
      // Quiet mode: Skip all prompts, use defaults
      answers = {
        language,
        userProfile: 'bob',
        projectType: options.projectType || detectedProjectType,
        selectedLLM: options.selectedLLM || 'claude-code',
        selectedIDEs: options.ide ? [options.ide] : llmToIDEs(options.selectedLLM || 'claude-code'),
        selectedTechPreset: detectedTechPreset,
        ...options, // Merge any other options
      };
    } else {
      // Interactive mode — simplified 2-step flow
      // Step 1: Welcome screen already shown above

      // Step 2: Single question — LLM selection
      const llmAnswer = await inquirer.prompt([getLLMQuestion()]);

      // Derive IDEs from LLM choice
      const selectedIDEs = llmToIDEs(llmAnswer.selectedLLM);

      answers = {
        language,
        userProfile: 'bob',
        projectType: detectedProjectType,
        selectedLLM: llmAnswer.selectedLLM,
        selectedIDEs,
        selectedTechPreset: detectedTechPreset,
      };
    }

    // Story 1.4: Install SINAPSE core framework (agents, tasks, workflows, templates)
    console.log('\n📦 Installing SINAPSE core framework...');
    let sinapseCoreResult = null;
    try {
      sinapseCoreResult = await installSinapseCore({
        targetDir: process.cwd(),
        onProgress: (_status) => {
          // Silent progress - spinner handles feedback
        },
      });

      if (sinapseCoreResult.success) {
        console.log(`✅ SINAPSE core installed (${sinapseCoreResult.installedFolders.length} folders)`);
        console.log(
          `   - Agents: ${sinapseCoreResult.installedFolders.includes('agents') ? '✓' : '⨉'}`,
        );
        console.log(`   - Tasks: ${sinapseCoreResult.installedFolders.includes('tasks') ? '✓' : '⨉'}`);
        console.log(
          `   - Workflows: ${sinapseCoreResult.installedFolders.includes('workflows') ? '✓' : '⨉'}`,
        );
        console.log(
          `   - Templates: ${sinapseCoreResult.installedFolders.includes('templates') ? '✓' : '⨉'}`,
        );
      }
      answers.sinapseCoreInstalled = true;
      answers.sinapseCoreResult = sinapseCoreResult;
    } catch (error) {
      console.error('\n⚠️  SINAPSE core installation failed:', error.message);
      answers.sinapseCoreInstalled = false;
    }

    // Install global orqx agent definitions to ~/.claude/agents/ (only for Claude Code)
    const selectedLLM = answers.selectedLLM || 'claude-code';
    if (selectedLLM === 'claude-code' || selectedLLM === 'both') {
      console.log('\n🤖 Installing global agent definitions...');
      try {
        const globalAgentsResult = await installGlobalAgents();
        if (globalAgentsResult.success) {
          console.log(`✅ Global agents: ${globalAgentsResult.count} installed to ~/.claude/agents/`);
        } else {
          console.log(`⚠️  Global agents: ${globalAgentsResult.count} installed, ${globalAgentsResult.errors.length} errors`);
          globalAgentsResult.errors.forEach((err) => console.warn(`   - ${err}`));
        }
        answers.globalAgentsInstalled = globalAgentsResult.count;
        answers.globalAgentsResult = globalAgentsResult;
      } catch (error) {
        console.warn(`⚠️  Global agents installation failed: ${error.message}`);
        answers.globalAgentsInstalled = 0;
      }
    } else {
      console.log('\n🤖 Skipping global Claude agents (Codex-only install)');
      answers.globalAgentsInstalled = 0;
    }

    // Install Tech Preset if selected
    if (answers.selectedTechPreset && answers.selectedTechPreset !== 'none') {
      console.log('\n📐 Configuring Tech Preset...');

      try {
        // Find tech-presets source directory
        const possiblePresetDirs = [
          path.join(__dirname, '..', '..', '.sinapse-ai', 'data', 'tech-presets'),
          path.join(process.cwd(), '.sinapse-ai', 'data', 'tech-presets'),
        ];

        let sourcePresetDir = null;
        for (const dir of possiblePresetDirs) {
          if (fse.existsSync(dir)) {
            sourcePresetDir = dir;
            break;
          }
        }

        if (sourcePresetDir) {
          const presetFile = path.join(sourcePresetDir, `${answers.selectedTechPreset}.md`);

          if (fse.existsSync(presetFile)) {
            // Copy preset to project's .sinapse-ai/data/tech-presets/
            const targetPresetDir = path.join(process.cwd(), '.sinapse-ai', 'data', 'tech-presets');
            await fse.ensureDir(targetPresetDir);

            // BUG-5 fix (INS-1): Guard against source === dest (e.g., running inside sinapse-ai repo)
            const targetPresetFile = path.join(targetPresetDir, `${answers.selectedTechPreset}.md`);
            const sourceResolved = path.resolve(presetFile);
            const targetResolved = path.resolve(targetPresetFile);

            if (sourceResolved === targetResolved) {
              console.log('   ℹ️  Tech preset already in place (framework-dev mode)');
            } else {
              // Copy the selected preset
              await fse.copy(presetFile, targetPresetFile);

              // Copy the template too
              const templateFile = path.join(sourcePresetDir, '_template.md');
              if (fse.existsSync(templateFile)) {
                const targetTemplate = path.join(targetPresetDir, '_template.md');
                if (path.resolve(templateFile) !== path.resolve(targetTemplate)) {
                  await fse.copy(templateFile, targetTemplate);
                }
              }

              // Update technical-preferences.md to mark the selected preset
              const techPrefsFile = path.join(
                process.cwd(),
                '.sinapse-ai',
                'data',
                'technical-preferences.md',
              );
              const techPrefsSource = path.join(sourcePresetDir, '..', 'technical-preferences.md');

              if (fse.existsSync(techPrefsSource)) {
                const techPrefsSourceResolved = path.resolve(techPrefsSource);
                const techPrefsTargetResolved = path.resolve(techPrefsFile);

                if (techPrefsSourceResolved !== techPrefsTargetResolved) {
                  // Prefer existing target file to preserve user customizations
                  const baseFile = fse.existsSync(techPrefsFile) ? techPrefsFile : techPrefsSource;
                  let techPrefsContent = await fse.readFile(baseFile, 'utf8');

                  // Add active preset marker only if not already present
                  const activePresetSection = `\n## Active Preset\n\n**Selected:** \`${answers.selectedTechPreset}\`\n\nThis preset was selected during installation. The @architect and @developer agents will use these patterns by default.\n`;

                  if (!techPrefsContent.includes('## Active Preset')) {
                    // Insert after the first heading
                    techPrefsContent = techPrefsContent.replace(
                      '# User-Defined Preferred Patterns and Preferences',
                      '# User-Defined Preferred Patterns and Preferences' + activePresetSection,
                    );
                    await fse.writeFile(techPrefsFile, techPrefsContent, 'utf8');
                  }
                }
              }
            }

            console.log(`   ✅ Tech Preset: ${answers.selectedTechPreset}`);
            console.log(
              `   📁 Location: .sinapse-ai/data/tech-presets/${answers.selectedTechPreset}.md`,
            );
            answers.techPresetInstalled = true;
            answers.techPresetResult = { preset: answers.selectedTechPreset, success: true };
          } else {
            console.log(`   ⚠️  Preset file not found: ${answers.selectedTechPreset}`);
            answers.techPresetInstalled = false;
          }
        } else {
          console.log('   ⚠️  Tech presets directory not found');
          answers.techPresetInstalled = false;
        }
      } catch (error) {
        console.error(`   ⚠️  Tech Preset error: ${error.message}`);
        answers.techPresetInstalled = false;
      }
    } else {
      answers.techPresetInstalled = false;
      answers.techPresetResult = { preset: 'none', success: true };
    }

    // Legacy squad installation path removed; unified squads flow is now the only supported path.

    // Story 1.4: Generate IDE configs if IDEs were selected
    let ideConfigResult = null;
    if (answers.selectedIDEs && answers.selectedIDEs.length > 0) {
      // Pass merge options from CLI to IDE config generator (Story 9.4)
      const ideOptions = {
        ...answers,
        forceMerge: options.forceMerge,
        noMerge: options.noMerge,
      };
      ideConfigResult = await generateIDEConfigs(answers.selectedIDEs, ideOptions);

      if (ideConfigResult.success) {
        showSuccessSummary(ideConfigResult);
      } else {
        console.error('\n⚠️  Some IDE configurations could not be created:');
        if (ideConfigResult.errors) {
          ideConfigResult.errors.forEach((err) => {
            console.error(`  - ${err.ide || 'Unknown'}: ${err.error}`);
          });
        }
      }

      // Legacy per-squad IDE copy path removed; sync pipeline handles IDE propagation.
    }

    // Story INS-4.3: Wire settings.json boundary generator after .sinapse-ai/ copy
    console.log('\n🔒 Generating boundary rules...');
    try {
      const settingsGenerator = require('../../../../.sinapse-ai/infrastructure/scripts/generate-settings-json');
      settingsGenerator.generate(process.cwd());
      const settingsContent = await fse.readFile(path.join(process.cwd(), '.claude', 'settings.json'), 'utf8').catch(() => '{}');
      const settingsParsed = JSON.parse(settingsContent);
      const denyCount = (settingsParsed.permissions && settingsParsed.permissions.deny) ? settingsParsed.permissions.deny.length : 0;
      console.log(`✅ settings.json: generated (${denyCount} deny rules)`);
      answers.settingsGenerated = true;
      answers.settingsDenyCount = denyCount;
    } catch (error) {
      console.warn(`⚠️  settings.json generation failed: ${error.message} — run 'sinapse doctor --fix' post-install`);
      answers.settingsGenerated = false;
    }

    // Story INS-4.3: Copy skills (Gap #11)
    console.log('\n📚 Copying skills...');
    try {
      const skillsResult = await copySkillFiles(process.cwd());
      if (skillsResult.skipped) {
        console.log('   ℹ️  Skills: source not found (skipped)');
      } else {
        console.log(`✅ Skills: ${skillsResult.count} copied`);
      }
      answers.skillsCopied = skillsResult.count;
      answers.skillsSkipped = skillsResult.skipped;
    } catch (error) {
      console.warn(`⚠️  Skills copy failed: ${error.message}`);
      answers.skillsCopied = 0;
    }

    // Story INS-4.3: Copy extra commands (Gap #12)
    console.log('\n📋 Copying extra commands...');
    try {
      const commandsResult = await copyExtraCommandFiles(process.cwd());
      if (commandsResult.skipped) {
        console.log('   ℹ️  Extra commands: source not found (skipped)');
      } else {
        console.log(`✅ Commands: ${commandsResult.count} extras copied`);
      }
      answers.extraCommandsCopied = commandsResult.count;
      answers.extraCommandsSkipped = commandsResult.skipped;
    } catch (error) {
      console.warn(`⚠️  Extra commands copy failed: ${error.message}`);
      answers.extraCommandsCopied = 0;
    }

    // Story INS-4.5: IDE Sync — transform agents/skills/commands for each configured IDE
    console.log('\n🔄 Running IDE sync...');
    const targetProjectRoot = process.cwd();
    const savedCwd = process.cwd();
    try {
      process.chdir(targetProjectRoot);
      await commandSync({ quiet: true });
      answers.ideSyncStatus = 'synced';
      console.log('✅ IDE sync: synced');

      // Validate sync output (commandValidate does not support quiet — suppress its console output)
      const _origLog = console.log;
      console.log = () => {};
      try {
        await commandValidate({ quiet: true });
        answers.ideSyncValidation = 'pass';
      } catch (validateError) {
        answers.ideSyncValidation = 'drift';
      } finally {
        console.log = _origLog;
      }
      if (answers.ideSyncValidation === 'drift') {
        console.warn('⚠️  IDE sync validation: drift detected — run \'sinapse doctor --fix\' post-install');
      }
    } catch (syncError) {
      console.warn(`⚠️  IDE sync failed: ${syncError.message} — run 'sinapse doctor --fix' post-install`);
      answers.ideSyncStatus = 'failed';
      answers.ideSyncValidation = 'skipped';
    } finally {
      process.chdir(savedCwd);
    }

    // Story INS-4.6: Entity Registry Bootstrap — populate entity-registry.yaml on install
    // Story INS-4.12: Fix module resolution + bootstrap timing
    // Bootstrap runs AFTER .sinapse-ai deps are installed (sinapse-ai-installer.js:324-345)
    // NODE_PATH ensures spawned scripts can resolve packages from .sinapse-ai/node_modules/
    console.log('\n📇 Bootstrapping entity registry...');
    try {
      const registryScript = path.join(process.cwd(), '.sinapse-ai', 'development', 'scripts', 'populate-entity-registry.js');
      if (fse.existsSync(registryScript)) {
        // INS-4.12 AC3: Guard — skip bootstrap if .sinapse-ai deps are not installed
        const sinapseCoreNodeModules = path.join(process.cwd(), '.sinapse-ai', 'node_modules');
        if (!fse.existsSync(sinapseCoreNodeModules)) {
          console.warn('⚠️  .sinapse-ai/node_modules/ not found — skipping entity registry bootstrap');
          console.warn('   Run: cd .sinapse-ai && npm install --production');
          answers.entityRegistryStatus = 'skipped-no-deps';
        } else {
        // INS-4.12 AC2: Set NODE_PATH so spawned scripts resolve deps from .sinapse-ai/node_modules/
          const parentNodeModules = path.join(process.cwd(), 'node_modules');
          const nodePath = [sinapseCoreNodeModules, parentNodeModules].join(path.delimiter);
          const startMs = Date.now();
          execSync(`node "${registryScript}"`, {
            cwd: process.cwd(),
            encoding: 'utf8',
            timeout: 30000,
            stdio: 'pipe',
            env: { ...process.env, NODE_PATH: nodePath },
          });
          const elapsedMs = Date.now() - startMs;

          // Read entity count from generated registry
          const registryPath = path.join(process.cwd(), '.sinapse-ai', 'data', 'entity-registry.yaml');
          let entityCount = 0;
          if (fse.existsSync(registryPath)) {
            const registryContent = fse.readFileSync(registryPath, 'utf8');
            const countMatch = registryContent.match(/entityCount:\s*(\d+)/);
            entityCount = countMatch ? parseInt(countMatch[1], 10) : 0;
          }

          console.log(`✅ Entity registry: populated (${entityCount} entities, ${(elapsedMs / 1000).toFixed(1)}s)`);
          answers.entityRegistryStatus = 'populated';
          answers.entityRegistryCount = entityCount;
          answers.entityRegistryMs = elapsedMs;
        } // end else (deps exist)
      } else {
        console.log('   ℹ️  Entity registry script not found (skipped)');
        answers.entityRegistryStatus = 'skipped';
      }
    } catch (error) {
      console.warn(`⚠️  Entity registry bootstrap failed: ${error.message} — run 'sinapse doctor' post-install`);
      answers.entityRegistryStatus = 'failed';
    }

    // Story 1.6: Environment Configuration
    console.log('\n📝 Configuring environment...');

    try {
      const envResult = await configureEnvironment({
        targetDir: process.cwd(),
        projectType: answers.projectType || 'greenfield',
        selectedIDEs: answers.selectedIDEs || [],
        mcpServers: answers.mcpServers || [],
        userProfile: answers.userProfile || 'advanced', // Story 10.2: User Profile
        skipPrompts: options.quiet || false, // Skip prompts in quiet mode
        forceMerge: options.forceMerge, // Story 9.4: Smart Merge support
        noMerge: options.noMerge, // Story 9.4: Smart Merge support
      });

      // Story ACT-12: Write language to Claude Code settings.json
      if (answers.language) {
        const langWritten = await writeClaudeSettings(answers.language);
        if (langWritten) {
          console.log('  - Language written to .claude/settings.json');
        } else {
          console.warn('  - Failed to write language to .claude/settings.json');
        }
      }

      if (envResult.envCreated && envResult.coreConfigCreated) {
        console.log('\n✅ Environment configuration complete!');
        console.log('  - .env file created');
        console.log('  - .env.example file created');
        console.log('  - .sinapse-ai/core-config.yaml created');
        if (envResult.gitignoreUpdated) {
          console.log('  - .gitignore updated');
        }
      }

      // Store env config result for downstream stories
      answers.envConfigured = true;
      answers.envResult = envResult;
    } catch (error) {
      console.error('\n⚠️  Environment configuration failed:');
      console.error(`  ${error.message}`);

      // Ask user if they want to continue without env config
      const { continueWithoutEnv } = await inquirer.prompt([
        {
          type: 'confirm',
          name: 'continueWithoutEnv',
          message: 'Continue installation without environment configuration?',
          default: false,
        },
      ]);

      if (!continueWithoutEnv) {
        throw new Error('Installation cancelled - environment configuration required');
      }

      answers.envConfigured = false;
      console.log('\n⚠️  Continuing without environment configuration...');
    }

    // Story 1.7: Dependency Installation
    // Check if package.json exists first (greenfield projects won't have one)
    const { detectPackageManager } = require('../installer/dependency-installer');
    const projectPath = process.cwd();
    const packageJsonExists = await hasPackageJson(projectPath);

    if (!packageJsonExists) {
      // Greenfield project - no package.json, skip dependency installation
      console.log('\n📦 Dependency installation...');
      console.log('   ℹ️  No package.json found (greenfield project)');
      console.log('   💡 Dependencies will be installed when you add a package.json');
      answers.depsInstalled = true; // Mark as success since there's nothing to install
      answers.depsResult = { success: true, skipped: true, reason: 'no-package-json' };
      answers.packageManager = detectPackageManager();
    } else {
      // Brownfield project or existing project - has package.json
      console.log('\n📦 Installing dependencies...');

      // Auto-detect package manager (no longer asked as question)
      const detectedPM = detectPackageManager();
      answers.packageManager = detectedPM;

      try {
        const depsResult = await installDependencies({
          packageManager: detectedPM,
          projectPath: projectPath,
        });

        if (depsResult.success) {
          if (depsResult.offlineMode) {
            console.log('✅ Using existing dependencies (offline mode)');
          } else {
            console.log(`✅ Dependencies installed with ${depsResult.packageManager}!`);
          }
          answers.depsInstalled = true;
          answers.depsResult = depsResult;
        } else {
          console.error('\n⚠️  Dependency installation failed:');
          console.error(`  ${depsResult.errorMessage}`);
          console.error(`  Solution: ${depsResult.solution}`);

          // Ask user if they want to retry
          const { retryDeps } = await inquirer.prompt([
            {
              type: 'confirm',
              name: 'retryDeps',
              message: 'Retry dependency installation?',
              default: true,
            },
          ]);

          if (retryDeps) {
            // Recursive retry with exponential backoff (built into installDependencies)
            const retryResult = await installDependencies({
              packageManager: answers.packageManager,
              projectPath: projectPath,
            });

            if (retryResult.success) {
              console.log(`\n✅ Dependencies installed with ${retryResult.packageManager}!`);
              answers.depsInstalled = true;
              answers.depsResult = retryResult;
            } else {
              console.log(
                '\n⚠️  Installation still failed. You can run `npm install` manually later.',
              );
              answers.depsInstalled = false;
              answers.depsResult = retryResult;
            }
          } else {
            console.log('\n⚠️  Skipping dependency installation. Run manually with `npm install`.');
            answers.depsInstalled = false;
            answers.depsResult = depsResult;
          }
        }
      } catch (error) {
        console.error('\n⚠️  Dependency installation error:', error.message);
        answers.depsInstalled = false;
      }
    }

    // DISABLED: MCPs are advanced config that can confuse beginners
    // TODO: Remove entirely in future version - each project has unique MCP needs
    // Story 1.5/1.8: MCP Installation
    // if (answers.selectedMCPs && answers.selectedMCPs.length > 0) {
    //   console.log('\n🔌 Installing MCPs...');
    //
    //   try {
    //     const mcpResult = await installProjectMCPs({
    //       selectedMCPs: answers.selectedMCPs,
    //       projectPath: process.cwd(),
    //       apiKeys: answers.exaApiKey ? { EXA_API_KEY: answers.exaApiKey } : {},
    //       onProgress: (status) => {
    //         if (status.mcp) {
    //           console.log(`  [${status.mcp}] ${status.message}`);
    //         } else {
    //           console.log(`  ${status.message}`);
    //         }
    //       },
    //     });
    //
    //     if (mcpResult.success) {
    //       const successCount = Object.values(mcpResult.installedMCPs).filter(r => r.status === 'success').length;
    //       console.log(`\n✅ MCPs installed successfully! (${successCount}/${answers.selectedMCPs.length})`);
    //       console.log(`   Configuration: ${mcpResult.configPath}`);
    //     } else {
    //       console.error('\n⚠️  Some MCPs failed to install:');
    //       mcpResult.errors.forEach(err => console.error(`  - ${err}`));
    //       console.log('\n💡 Check .sinapse/install-errors.log for details');
    //     }
    //
    //     // Store MCP result for validation
    //     answers.mcpsInstalled = mcpResult.success;
    //     answers.mcpResult = mcpResult;
    //
    //   } catch (error) {
    //     console.error('\n⚠️  MCP installation error:', error.message);
    //     answers.mcpsInstalled = false;
    //   }
    // }

    // Story 6.7: LLM Routing Installation
    console.log('\nInstalling LLM Routing commands...');
    try {
      // Check if already installed
      if (isLLMRoutingInstalled()) {
        console.log('   ℹ️  LLM Routing already installed');
        answers.llmRoutingInstalled = true;
        answers.llmRoutingResult = { success: true, alreadyInstalled: true };
      } else {
        const llmResult = installLLMRouting({
          projectRoot: process.cwd(),
          onProgress: (msg) => console.log(`   ${msg}`),
          onError: (msg) => console.error(`   ${msg}`),
        });

        if (llmResult.success) {
          console.log('\n✅ LLM Routing installed!');
          console.log('   • claude-max  → Uses Claude Max subscription');
          console.log('   • claude-free → Uses DeepSeek (~$0.14/M tokens)');
          console.log('\n   💡 For claude-free, add DEEPSEEK_API_KEY to your .env');
          answers.llmRoutingInstalled = true;
          answers.llmRoutingResult = llmResult;
        } else {
          console.error('\n⚠️  LLM Routing installation had errors:');
          llmResult.errors.forEach((err) => console.error(`   - ${err}`));
          answers.llmRoutingInstalled = false;
          answers.llmRoutingResult = llmResult;
        }
      }
    } catch (error) {
      console.error('\n⚠️  LLM Routing error:', error.message);
      answers.llmRoutingInstalled = false;
    }

    // Story INS-3.2: Pro Installation Wizard (optional phase)
    if (!options.skipPro) {
      try {
        const { runProWizard } = require('./pro-setup');
        const isCI = process.env.CI === 'true' || !process.stdout.isTTY;
        const hasProKey = !!process.env.SINAPSE_PRO_KEY;

        const proOptions = { targetDir: process.cwd() };

        if (isCI && hasProKey) {
          // CI mode: auto-run if SINAPSE_PRO_KEY is set
          console.log('\n🔑 Pro license key detected, running Pro setup...');
          const proResult = await runProWizard({ ...proOptions, quiet: true });
          answers.proInstalled = proResult.success;
          answers.proResult = proResult;
        } else if (!isCI && !options.quiet) {
          // Interactive mode: ask which edition to install
          const { edition } = await inquirer.prompt([
            {
              type: 'list',
              name: 'edition',
              message: colors.primary('Which edition do you want to install?'),
              choices: [
                {
                  name: 'Community (free) — agents, workflows, squads, full CLI',
                  value: 'community',
                },
                {
                  name: 'Pro (requires account) — premium squads, minds, priority support',
                  value: 'pro',
                },
              ],
              default: 'community',
            },
          ]);

          if (edition === 'pro') {
            const proResult = await runProWizard(proOptions);
            answers.proInstalled = proResult.success;
            answers.proResult = proResult;

            if (!proResult.success && proResult.error) {
              console.error(`\n⚠️  Pro activation failed: ${proResult.error}`);

              const { fallback } = await inquirer.prompt([
                {
                  type: 'confirm',
                  name: 'fallback',
                  message: colors.primary('Continue with Community (free) edition instead?'),
                  default: true,
                },
              ]);

              if (!fallback) {
                console.log('\n👋 Installation cancelled. Run again when ready.');
                return answers;
              }

              console.log('\n📦 Continuing with Community edition...\n');
            }
          } else {
            answers.proInstalled = false;
          }
        }
      } catch (error) {
        console.error(`\n⚠️  Pro setup error: ${error.message}`);
        answers.proInstalled = false;
      }
    }

    // Story 1.8: Installation Validation
    console.log('\n🔍 Validating installation...\n');

    try {
      const validation = await validateInstallation(
        {
          files: {
            ideConfigs: ideConfigResult?.files || [],
            env: '.env',
            coreConfig: '.sinapse-ai/core-config.yaml',
            mcpConfig: '.mcp.json',
          },
          configs: {
            env: answers.envResult,
            mcps: answers.mcpResult,
            coreConfig: '.sinapse-ai/core-config.yaml',
          },
          mcps: answers.mcpResult,
          dependencies: answers.depsResult,
        },
        (status) => {
          console.log(`  [${status.step}] ${status.message}`);
        },
      );

      // Display validation report
      await displayValidationReport(validation);

      // Offer troubleshooting if there are errors
      if (validation.errors && validation.errors.length > 0) {
        await provideTroubleshooting(validation.errors);
      }

      // Store validation result
      answers.validationResult = validation;
    } catch (error) {
      console.error('\n⚠️  Validation failed:', error.message);
      console.log('Installation may be incomplete. Check logs in .sinapse/ directory.');
    }

    // Show completion with LLM label
    showCompletion({ llmLabel: llmLabel(answers.selectedLLM), llmValue: answers.selectedLLM });

    return answers;
  } catch (error) {
    if (error.isTtyError) {
      console.error("Error: Prompt couldn't be rendered in the current environment");
    } else {
      console.error('Wizard error:', error.message);
    }
    throw error;
  }
}

/**
 * Answer object schema (for integration documentation)
 *
 * @typedef {Object} WizardAnswers
 * @property {string} projectType - 'greenfield' or 'brownfield' (Story 1.3)
 * @property {string[]} [selectedIDEs] - Selected IDEs array (Story 1.4)
 * @property {string[]} [mcpServers] - Selected MCP servers (Story 1.5)
 * @property {boolean} [envConfigured] - Whether env config succeeded (Story 1.6)
 * @property {Object} [envResult] - Environment configuration result (Story 1.6)
 * @property {boolean} envResult.envCreated - .env file created
 * @property {boolean} envResult.envExampleCreated - .env.example file created
 * @property {boolean} envResult.coreConfigCreated - core-config.yaml created
 * @property {boolean} envResult.gitignoreUpdated - .gitignore updated
 * @property {Array<string>} envResult.errors - Any errors encountered
 * @property {string} packageManager - Selected package manager (Story 1.7)
 * @property {boolean} [depsInstalled] - Whether dependencies installed successfully (Story 1.7)
 * @property {Object} [depsResult] - Dependency installation result (Story 1.7)
 * @property {boolean} depsResult.success - Installation succeeded
 * @property {boolean} [depsResult.offlineMode] - Used existing node_modules
 * @property {string} depsResult.packageManager - Package manager used
 * @property {string} [depsResult.error] - Error message if failed
 */

module.exports = {
  runWizard,
  // Exported for testing
  _testing: {
    writeClaudeSettings,
    getExistingLanguage,
    LANGUAGE_MAP,
    detectProjectType,
    detectTechPreset,
    llmToIDEs,
    llmLabel,
    installGlobalAgents,
    buildAgentTemplate,
    GLOBAL_AGENTS,
  },
};
