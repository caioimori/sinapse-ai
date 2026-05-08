const { detectProjectType } = require('../detection/detect-project-type');
const {
  detectInstallationMode,
  getModeOptions,
  validateModeSelection,
  InstallationMode,
} = require('../../../../.sinapse-ai/infrastructure/scripts/documentation-integrity/mode-detector');

/**
 * Interactive Wizard for SINAPSE Installation
 *
 * Supports three installation modes:
 * - GREENFIELD: New project - generates all docs and config
 * - BROWNFIELD: Existing project - analyzes and adapts
 * - FRAMEWORK_DEV: Contributing to sinapse-ai itself
 *
 * @module wizard
 * @version 2.0.0
 * @story 6.9
 */

/**
 * Run the interactive installer wizard
 *
 * @param {Object} options - Wizard options
 * @param {string} options.targetDir - Target directory for installation
 * @param {string} options.mode - Pre-selected mode (skip detection)
 * @returns {Promise<Object>} Installation configuration
 */
async function runWizard(options = {}) {
  const targetDir = options.targetDir || process.cwd();

  try {
    // Step 1: Welcome screen
    console.log('🚀 Welcome to SINAPSE Installer\n');

    // Step 2: Detect installation mode (Story 6.9)
    console.log('📊 Analyzing project directory...');
    const detected = detectInstallationMode(targetDir);
    console.log(`✅ Detected: ${detected.mode} (${detected.reason})\n`);

    // Step 3: Select installation mode (with user override)
    const selectedMode = options.mode || (await selectInstallationMode(detected));

    // Step 4: Validate selection
    const validation = validateModeSelection(selectedMode, detected);
    if (validation.warnings.length > 0) {
      console.log('\n⚠️  Warnings:');
      validation.warnings.forEach((w) => console.log(`   - ${w}`));
      console.log('');
    }

    // Step 5: Mode-specific configuration
    const modeConfig = await configureModeSpecific(selectedMode, targetDir, detected);

    // Step 6: Continue with installation (Stories 1.4-1.8)
    // - IDE Selection (Story 1.4)
    // - MCP Installation (Story 1.5)
    // - Environment Config (Story 1.6)
    // - Validation (Story 1.8)

    return {
      projectType: detected.legacyType, // Backward compatibility
      installationMode: selectedMode,
      targetDir,
      detected,
      modeConfig,
      // Other configuration will be added by downstream stories
    };
  } catch (error) {
    console.error('❌ Installation failed:', error.message);
    throw error;
  }
}

/**
 * Detect whether the current shell can host an interactive prompt.
 * Falls back to non-interactive in CI / piped stdin / unsupported terminals.
 *
 * @returns {boolean}
 */
function isInteractive() {
  if (process.env.CI === 'true') return false;
  if (process.env.SINAPSE_NON_INTERACTIVE === '1') return false;
  if (!process.stdin.isTTY) return false;
  if (!process.stdout.isTTY) return false;
  return true;
}

/**
 * Select installation mode with user input.
 *
 * Replaces the previous stub. Asks the user to confirm the auto-detected
 * mode (or override it) before any destructive action. In non-interactive
 * environments, falls back to the detected mode and prints the choice so
 * the caller can see what happened.
 *
 * @param {Object} detected - Detection result from mode detector
 * @param {Object} [opts]
 * @param {boolean} [opts.assumeYes=false] - Skip the prompt and accept the detected mode
 * @returns {Promise<string>} Selected installation mode
 */
async function selectInstallationMode(detected, opts = {}) {
  const options = getModeOptions(detected);
  const fallback = detected.mode !== InstallationMode.UNKNOWN
    ? detected.mode
    : InstallationMode.GREENFIELD;

  // Non-interactive path: print the decision and return
  if (opts.assumeYes || !isInteractive()) {
    console.log(`Detected mode: ${detected.mode}${detected.reason ? ` (${detected.reason})` : ''}`);
    console.log(`Using: ${fallback}${opts.assumeYes ? ' (--yes)' : ' (non-interactive)'}\n`);
    return fallback;
  }

  // Interactive path: ask the user to confirm or override
  let inquirer;
  try {
    inquirer = require('inquirer');
  } catch {
    // Inquirer missing for some reason — degrade gracefully to the
    // non-interactive path rather than crashing the install.
    console.log(`(inquirer unavailable; using detected mode: ${fallback})\n`);
    return fallback;
  }

  console.log(`Detected: ${detected.mode}${detected.reason ? ` (${detected.reason})` : ''}\n`);

  const choices = options.map((opt) => ({
    name: `${opt.label} — ${opt.hint}`,
    value: opt.value,
    short: opt.label,
  }));

  const { mode } = await inquirer.prompt([{
    type: 'list',
    name: 'mode',
    message: 'Confirm installation mode:',
    choices,
    default: detected.mode,
  }]);

  return mode;
}

/**
 * Render a pre-install summary and ask the user to confirm before any
 * destructive action. Skipped silently when not interactive.
 *
 * @param {Object} summary - Resolved configuration to display
 * @param {string} summary.mode - Installation mode
 * @param {string} [summary.language] - Language code (pt/en) or label
 * @param {string|string[]} [summary.ide] - IDE selection
 * @param {string} [summary.targetDir] - Target directory
 * @param {Object} [summary.grounding] - Grounding configuration (vault/DS/brand)
 * @param {Object} [opts]
 * @param {boolean} [opts.assumeYes=false] - Skip the confirmation prompt
 * @returns {Promise<boolean>} true if confirmed (or non-interactive), false to abort
 */
async function confirmInstallSummary(summary, opts = {}) {
  console.log('\n──── Install summary ────');
  if (summary.targetDir) console.log(`  Target:    ${summary.targetDir}`);
  console.log(`  Mode:      ${summary.mode}`);
  if (summary.language) console.log(`  Language:  ${summary.language}`);
  if (summary.ide) {
    const ide = Array.isArray(summary.ide) ? summary.ide.join(', ') : summary.ide;
    console.log(`  IDE:       ${ide}`);
  }
  if (summary.grounding) {
    const g = summary.grounding;
    const parts = [];
    if (g.vault) parts.push('vault');
    if (g.designSystem) parts.push('design-system');
    if (g.brand) parts.push('brand');
    console.log(`  Grounding: ${parts.length ? parts.join(', ') : 'none'}`);
  }
  console.log('─────────────────────────\n');

  if (opts.assumeYes || !isInteractive()) return true;

  let inquirer;
  try {
    inquirer = require('inquirer');
  } catch {
    return true; // degrade gracefully
  }

  const { confirmed } = await inquirer.prompt([{
    type: 'confirm',
    name: 'confirmed',
    message: 'Proceed with install?',
    default: true,
  }]);

  return confirmed;
}

/**
 * Configure mode-specific settings
 *
 * @param {string} mode - Selected installation mode
 * @param {string} targetDir - Target directory
 * @param {Object} detected - Detection result
 * @returns {Promise<Object>} Mode-specific configuration
 */
async function configureModeSpecific(mode, _targetDir, _detected) {
  const config = {
    mode,
    generateDocs: true,
    generateConfig: true,
    generateGitignore: true,
    runSetupGithub: false,
    deployment: null,
  };

  switch (mode) {
    case InstallationMode.FRAMEWORK_DEV:
      // Framework development - skip project setup
      console.log('🔧 Framework Development Mode');
      console.log('   → Using existing framework standards');
      console.log('   → Skipping project documentation generation');
      console.log('   → Skipping infrastructure setup\n');
      config.generateDocs = false;
      config.generateConfig = false;
      config.generateGitignore = false;
      break;

    case InstallationMode.GREENFIELD:
      // New project - full scaffolding
      console.log('🆕 Greenfield Mode');
      console.log('   → Will generate project documentation');
      console.log('   → Will create project-specific core-config');
      console.log('   → Will generate .gitignore based on tech stack');
      console.log('   → Will offer *setup-github for infrastructure\n');
      config.runSetupGithub = true;
      // Deployment config will be elicited in Phase 3
      config.deployment = await elicitDeploymentConfig();
      break;

    case InstallationMode.BROWNFIELD:
      // Existing project - analyze and adapt
      console.log('📂 Brownfield Mode');
      console.log('   → Will analyze existing source tree');
      console.log('   → Will detect existing coding standards');
      console.log('   → Will merge with existing .gitignore');
      console.log('   → Will analyze existing GitHub workflows\n');
      // Deployment config will be elicited based on analysis in Phase 3
      config.deployment = await elicitDeploymentConfig();
      break;

    default:
      console.log('❓ Unknown mode - using greenfield defaults\n');
  }

  return config;
}

/**
 * Elicit deployment configuration from user
 * Implements Task 3.3 from Story 6.9
 *
 * @returns {Promise<Object>} Deployment configuration
 */
async function elicitDeploymentConfig() {
  // Stub implementation - will be fully implemented in Phase 3
  console.log('📦 Deployment Configuration');
  console.log('   (Full elicitation will be implemented in Phase 3)\n');

  // Return default staging-first workflow
  return {
    workflow: 'staging-first',
    branches: {
      staging_targets: ['feature/*', 'fix/*', 'docs/*', 'chore/*', 'refactor/*', 'test/*'],
      production_targets: ['hotfix/*'],
      staging_branch: 'staging',
      production_branch: 'main',
      default_target: 'staging',
    },
    environments: {
      staging: {
        name: 'Staging',
        auto_deploy: true,
        platform: null, // To be detected/elicited
      },
      production: {
        name: 'Production',
        auto_deploy: true,
        platform: null,
      },
    },
    quality_gates: {
      lint: true,
      typecheck: true,
      tests: true,
      security_scan: false,
    },
  };
}

/**
 * Confirm project type with user or allow override
 * @deprecated Use selectInstallationMode instead
 *
 * @param {string} detectedType - Detected project type
 * @returns {Promise<string>} Confirmed project type
 */
async function confirmProjectType(detectedType) {
  // Kept for backward compatibility
  const typeDescriptions = {
    GREENFIELD: 'New project - SINAPSE will create complete structure',
    BROWNFIELD: 'Existing project - SINAPSE will integrate with current setup',
    EXISTING_SINAPSE: 'SINAPSE already installed - Would you like to update or reinstall?',
    UNKNOWN: 'Unknown project type - Manual selection required',
  };

  console.log(`Project Type: ${detectedType}`);
  console.log(`Description: ${typeDescriptions[detectedType]}`);
  console.log('(Use selectInstallationMode for new three-mode selection)\n');

  return detectedType;
}

/**
 * Get project type for a directory (exposed for downstream stories)
 * 
 * @param {string} targetDir - Directory to check
 * @returns {string} Project type
 */
function getProjectType(targetDir) {
  return detectProjectType(targetDir);
}

module.exports = {
  runWizard,
  selectInstallationMode,
  confirmInstallSummary,
  configureModeSpecific,
  elicitDeploymentConfig,
  confirmProjectType, // Deprecated - kept for backward compatibility
  getProjectType,
  InstallationMode,
  isInteractive,
};


