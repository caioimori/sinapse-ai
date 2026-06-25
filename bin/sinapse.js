#!/usr/bin/env node

/**
 * SINAPSE-FullStack CLI
 * Main entry point - Standalone (no external dependencies for npx compatibility)
 * Version: 4.0.0
 */

const path = require('path');
const fs = require('fs');
const os = require('os');
const { execSync, spawnSync } = require('child_process');
const { emitDeprecationWarning } = require('./utils/deprecation-warning');

// Story A.2 — unified logger. Levels: error/warn/info/debug.
// Flags: --verbose, --debug, --quiet, --json. Default level: warn.
// sinapse.js does NOT render the ASCII header itself (cli.js owns it), so it
// only imports getLogger. shouldShowHeader / markFirstRunDone stay in cli.js.
const { getLogger } = require('../.sinapse-ai/core/logger');
const logger = getLogger();

// Read package.json for version
const packageJsonPath = path.join(__dirname, '..', 'package.json');
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

// Parse arguments
const args = process.argv.slice(2);
const command = args[0];

// Helper: Run initialization wizard
/**
 * Fail fast with an actionable message if the Node.js runtime is older than the
 * `engines.node` requirement. Without this, an old Node gets a cryptic error
 * deep inside the wizard (syntax/API failure) instead of a clear "upgrade Node"
 * message at the door. Uses semver when available, else a major-version fallback
 * so a missing dependency never blocks the check.
 */
function nodeSatisfies(currentVersion, required) {
  // Major-version fallback (used if semver is unavailable in the runtime).
  const m = String(required).match(/(\d+)/);
  const minMajor = m ? parseInt(m[1], 10) : 18;
  let satisfied = parseInt(String(currentVersion).replace(/^v/, '').split('.')[0], 10) >= minMajor;
  try {
    satisfied = require('semver').satisfies(currentVersion, required, { includePrerelease: true });
  } catch {
    // semver unavailable — keep the major-version fallback computed above.
  }
  return satisfied;
}

function checkNodePrerequisites() {
  const required = (packageJson.engines && packageJson.engines.node) || '>=18.0.0';
  if (!nodeSatisfies(process.version, required)) {
    logger.error(`\n❌ Node.js ${process.version} does not meet SINAPSE's requirement (Node ${required}).`);
    logger.error('   How to fix:');
    logger.error('   1. Install the Node.js LTS from https://nodejs.org/');
    logger.error('   2. Reopen your terminal and run the command again.\n');
    process.exit(1);
  }
}

async function runWizard(options = {}) {
  // Prerequisite gate (Node version) before any install/init work.
  checkNodePrerequisites();

  // Use the v4 wizard from packages/installer/src/wizard/index.js
  const wizardPath = path.join(__dirname, '..', 'packages', 'installer', 'src', 'wizard', 'index.js');

  if (!fs.existsSync(wizardPath)) {
    // Fallback to legacy wizard if new wizard not found
    const legacyScript = path.join(__dirname, 'sinapse-init.js');
    if (fs.existsSync(legacyScript)) {
      if (!options.quiet) {
        logger.always('⚠️  Using legacy wizard (src/wizard not found)');
      }
      // Legacy wizard doesn't support options, pass via env vars
      process.env.SINAPSE_INSTALL_FORCE = options.force ? '1' : '';
      process.env.SINAPSE_INSTALL_QUIET = options.quiet ? '1' : '';
      process.env.SINAPSE_INSTALL_DRY_RUN = options.dryRun ? '1' : '';
      require(legacyScript);
      return;
    }
    logger.error('❌ Initialization wizard not found');
    logger.error('Please ensure SINAPSE-FullStack is installed correctly.');
    process.exit(1);
  }

  try {
    // Run the v4 wizard with options
    const { runWizard: executeWizard } = require(wizardPath);
    await executeWizard(options);
  } catch (error) {
    logger.error('❌ Wizard error:', error.message);
    process.exit(1);
  }
}

// Helper: Show help
function showHelp() {
  logger.always(`
SINAPSE-FullStack v${packageJson.version}
AI-Orchestrated System for Full Stack Development

USAGE:
  sinapse                             # Launch Claude Code with SINAPSE branding
  sinapse <any claude args>           # Pass arguments to Claude Code
  sinapse install                     # Install SINAPSE in current project
  sinapse init <name>                 # Create new project
  sinapse update                      # Update to latest version
  sinapse uninstall                   # Remove SINAPSE from the project (--keep-data)
  sinapse brand                       # Re-apply SINAPSE branding (after Claude update)
  sinapse validate                    # Validate installation integrity
  sinapse info                        # Show system info
  sinapse doctor                      # Run diagnostics
  sinapse telemetry status            # Show telemetry state (disabled by default)
  sinapse telemetry enable            # Opt in to anonymized telemetry
  sinapse telemetry disable           # Opt out of telemetry
  sinapse qa run                      # Run quality gate pipeline
  sinapse qa run --layer=1            # Run specific layer
  sinapse qa status                   # Show gate status
  sinapse qa audit                    # Audit squad ecosystem quality
  sinapse --version                   # Show version
  sinapse --help                      # Show this help

UPDATE:
  sinapse update                    # Update to latest version
  sinapse update --check            # Check for updates without applying
  sinapse update --dry-run          # Preview what would be updated
  sinapse update --force            # Force update even if up-to-date
  sinapse update --verbose          # Show detailed output

VALIDATION:
  sinapse validate                    # Validate installation integrity
  sinapse validate --repair           # Repair missing/corrupted files
  sinapse validate --repair --dry-run # Preview repairs
  sinapse validate --detailed         # Show detailed file list

CAPABILITIES:
  sinapse chrome-brain install              # Install Chrome Brain (browser automation)
  sinapse chrome-brain uninstall            # Remove Chrome Brain
  sinapse chrome-brain status               # Check Chrome Brain installation

CONFIGURATION:
  sinapse config show                       # Show resolved configuration
  sinapse config show --debug               # Show with source annotations
  sinapse config diff --levels L1,L2        # Compare config levels
  sinapse config migrate                    # Migrate monolithic to layered
  sinapse config validate                   # Validate config files
  sinapse config init-local                 # Create local-config.yaml

SERVICE DISCOVERY:
  sinapse workers search <query>            # Search for workers
  sinapse workers search "json" --category=data
  sinapse workers search "transform" --tags=etl,data
  sinapse workers search "api" --format=json

GENERATE & CREATE:
  sinapse generate <prd|adr|story|epic|task>  # Generate a document from a template
  sinapse create <agent|task|workflow>        # Scaffold a new framework component

ORCHESTRATION:
  sinapse orchestrate <story-id>            # Run the autonomous dev pipeline for a story
  sinapse orchestrate --status              # Show / --stop / --resume a running pipeline
  sinapse mode [explore|ask|auto]           # Show or set the agent permission mode (--cycle)

INTELLIGENCE & HEALTH:
  sinapse health                            # Framework health analytics (--deep for full scan)
  sinapse graph --deps                      # Dependency & stats dashboard (--format, --watch)
  sinapse performance                       # Squad & agent performance ranking (--top N)
  sinapse routing-intel analyze             # Routing intelligence analysis

INTEGRATIONS & LICENSE:
  sinapse mcp setup                         # Configure global MCP servers (setup/link/status/add)
  sinapse pro status                        # SINAPSE Pro license (activate/status/deactivate/features)

EXAMPLES:
  # Install in current directory
  npx sinapse-ai@latest

  # Install with minimal mode (only expansion-creator)
  npx sinapse-ai-minimal@latest

  # Create new project
  npx sinapse-ai@latest init my-project

  # Search for workers
  sinapse workers search "json csv"

For more information, visit: https://github.com/caioimori/sinapse-ai
`);
}

// Helper: Show version
async function showVersion() {
  const isDetailed = args.includes('--detailed') || args.includes('-d');

  if (!isDetailed) {
    // Simple version output (backwards compatible)
    logger.always(packageJson.version);
    return;
  }

  // Detailed version output (Story 7.2: Version Tracking)
  logger.always(`SINAPSE-FullStack v${packageJson.version}`);
  logger.always('Package: sinapse-ai');

  // Check for local installation
  const localVersionPath = path.join(process.cwd(), '.sinapse-ai', 'version.json');

  if (fs.existsSync(localVersionPath)) {
    try {
      const versionInfo = JSON.parse(fs.readFileSync(localVersionPath, 'utf8'));
      logger.always('\n📦 Local Installation:');
      logger.always(`  Version:    ${versionInfo.version}`);
      logger.always(`  Mode:       ${versionInfo.mode || 'unknown'}`);

      if (versionInfo.installedAt) {
        const installedDate = new Date(versionInfo.installedAt);
        logger.always(`  Installed:  ${installedDate.toLocaleDateString()}`);
      }

      if (versionInfo.updatedAt) {
        const updatedDate = new Date(versionInfo.updatedAt);
        logger.always(`  Updated:    ${updatedDate.toLocaleDateString()}`);
      }

      if (versionInfo.fileHashes) {
        const fileCount = Object.keys(versionInfo.fileHashes).length;
        logger.always(`  Files:      ${fileCount} tracked`);
      }

      if (versionInfo.customized && versionInfo.customized.length > 0) {
        logger.always(`  Customized: ${versionInfo.customized.length} files`);
      }

      // Version comparison
      if (versionInfo.version !== packageJson.version) {
        logger.always('\n⚠️  Version mismatch!');
        logger.always(`  Local:  ${versionInfo.version}`);
        logger.always(`  Latest: ${packageJson.version}`);
        logger.always('  Run \'npx sinapse-ai update\' to update.');
      } else {
        logger.always('\n✅ Up to date');
      }
    } catch (error) {
      logger.always(`\n⚠️  Could not read version.json: ${error.message}`);
    }
  } else {
    logger.always('\n📭 No local installation found');
    logger.always('  Run \'npx sinapse-ai install\' to install SINAPSE in this project.');
  }
}

// Helper: Show system info
function showInfo() {
  logger.always('📊 SINAPSE-FullStack System Information\n');
  logger.always(`Version: ${packageJson.version}`);
  logger.always(`Platform: ${process.platform}`);
  logger.always(`Node.js: ${process.version}`);
  logger.always(`Architecture: ${process.arch}`);
  logger.always(`Working Directory: ${process.cwd()}`);
  logger.always(`Install Location: ${path.join(__dirname, '..')}`);

  // Check if .sinapse-ai exists
  const sinapseCoreDir = path.join(__dirname, '..', '.sinapse-ai');
  if (fs.existsSync(sinapseCoreDir)) {
    logger.always('\n✓ SINAPSE Core installed');

    // Count components
    const countFiles = (dir) => {
      try {
        return fs.readdirSync(dir).length;
      } catch {
        return 0;
      }
    };

    const devDir = path.join(sinapseCoreDir, 'development');
    const componentBase = fs.existsSync(devDir) ? devDir : sinapseCoreDir;

    logger.always(`  - Agents: ${countFiles(path.join(componentBase, 'agents'))}`);
    logger.always(`  - Tasks: ${countFiles(path.join(componentBase, 'tasks'))}`);
    logger.always(`  - Templates: ${countFiles(path.join(componentBase, 'templates'))}`);
    logger.always(`  - Workflows: ${countFiles(path.join(componentBase, 'workflows'))}`);

  } else {
    logger.always('\n⚠️  SINAPSE Core not found');
  }

  // Check SINAPSE Pro status (Task 5.1)
  const proDir = path.join(__dirname, '..', 'pro');
  if (fs.existsSync(proDir)) {
    logger.always('\n✓ SINAPSE Pro installed');

    try {
      const { featureGate } = require(path.join(proDir, 'license', 'feature-gate'));
      const state = featureGate.getLicenseState();
      const info = featureGate.getLicenseInfo();

      const stateEmoji = {
        'Active': '✅',
        'Grace': '⚠️',
        'Expired': '❌',
        'Not Activated': '➖',
      };

      logger.always(`  - License: ${stateEmoji[state] || ''} ${state}`);

      if (info && info.features) {
        const availableCount = featureGate.listAvailable().length;
        logger.always(`  - Features: ${availableCount} available`);
      }
    } catch {
      logger.always('  - License: Unable to check status');
    }
  }
}

// Helper: Run installation validation
async function runValidate() {
  const validateArgs = args.slice(1); // Remove 'validate' from args

  try {
    // Load the validate command module
    const { createValidateCommand } = require('../.sinapse-ai/cli/commands/validate/index.js');
    const validateCmd = createValidateCommand();

    // Parse and execute (Note: don't include 'validate' as it's the command name, not an argument)
    await validateCmd.parseAsync(['node', 'sinapse', ...validateArgs]);
  } catch (_error) {
    // Fallback: Run quick validation inline
    logger.always('Running installation validation...\n');

    try {
      const validatorPath = path.join(
        __dirname,
        '..',
        'packages',
        'installer',
        'src',
        'installer',
        'post-install-validator.js',
      );
      const { PostInstallValidator, formatReport } = require(validatorPath);

      const projectRoot = process.cwd();
      const validator = new PostInstallValidator(projectRoot, path.join(__dirname, '..'));
      const report = await validator.validate();

      logger.always(formatReport(report, { colors: true }));

      if (
        report.status === 'failed' ||
        report.stats.missingFiles > 0 ||
        report.stats.corruptedFiles > 0
      ) {
        process.exit(1);
      }
    } catch (validatorError) {
      logger.error(`❌ Validation error: ${validatorError.message}`);
      if (args.includes('--verbose') || args.includes('-v')) {
        logger.error(validatorError.stack);
      }
      process.exit(2);
    }
  }
}

// Helper: Run update command
async function runUpdate() {
  const updateArgs = args.slice(1);
  const isCheck = updateArgs.includes('--check');
  const isDryRun = updateArgs.includes('--dry-run');
  const isForce = updateArgs.includes('--force');
  const isVerbose = updateArgs.includes('--verbose') || updateArgs.includes('-v');

  try {
    const updaterPath = path.join(__dirname, '..', 'packages', 'installer', 'src', 'updater', 'index.js');

    if (!fs.existsSync(updaterPath)) {
      logger.error('❌ Updater module not found');
      logger.error('Please ensure SINAPSE-FullStack is installed correctly.');
      process.exit(1);
    }

    const { SINAPSEUpdater, formatCheckResult, formatUpdateResult } = require(updaterPath);

    const updater = new SINAPSEUpdater(process.cwd(), {
      verbose: isVerbose,
      force: isForce,
    });

    if (isCheck) {
      // Check only mode
      logger.always('🔍 Checking for updates...\n');
      const result = await updater.checkForUpdates();
      logger.always(formatCheckResult(result, { colors: true }));

      if (result.status === 'check_failed') {
        process.exit(1);
      }
    } else {
      // Update mode
      logger.always('🔄 SINAPSE Update\n');

      const result = await updater.update({
        dryRun: isDryRun,
        onProgress: (phase, message) => {
          if (isVerbose) {
            logger.always(`[${phase}] ${message}`);
          }
        },
      });

      logger.always(formatUpdateResult(result, { colors: true }));

      if (!result.success && result.error !== 'Already up to date') {
        process.exit(1);
      }
    }
  } catch (error) {
    logger.error(`❌ Update error: ${error.message}`);
    if (args.includes('--verbose') || args.includes('-v')) {
      logger.error(error.stack);
    }
    process.exit(1);
  }
}

// Helper: Run doctor diagnostics (v2.1 — delegates to modular doctor)
// Story A.3: exit code mapping is now 0 PASS | 1 WARN only | 2 FAIL | 3 internal error.
async function runDoctor(options = {}) {
  const { runDoctorChecks, resolveExitCode } = require(path.join(__dirname, '..', '.sinapse-ai', 'core', 'doctor'));

  const result = await runDoctorChecks({
    fix: options.fix || false,
    json: options.json || false,
    dryRun: options.dryRun || false,
    quiet: options.quiet || false,
    deep: options.deep || false,
    projectRoot: process.cwd(),
  });

  logger.always(result.formatted);

  const code = typeof resolveExitCode === 'function'
    ? resolveExitCode(result)
    : (result && result.data && result.data.summary && result.data.summary.fail > 0 ? 2 : 0);

  if (code !== 0) {
    process.exit(code);
  }
}

// Helper: Format bytes to human readable
function formatBytes(bytes) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// Helper: Remove SINAPSE sections from .gitignore
function cleanGitignore(gitignorePath) {
  if (!fs.existsSync(gitignorePath)) return { removed: false };

  const content = fs.readFileSync(gitignorePath, 'utf8');
  const lines = content.split('\n');
  const newLines = [];
  let inSinapseSection = false;
  let removedLines = 0;

  for (const line of lines) {
    if (line.includes('# SINAPSE') || line.includes('# Added by SINAPSE')) {
      inSinapseSection = true;
      removedLines++;
      continue;
    }
    if (inSinapseSection && line.trim() === '') {
      inSinapseSection = false;
      continue;
    }
    if (inSinapseSection) {
      removedLines++;
      continue;
    }
    newLines.push(line);
  }

  if (removedLines > 0) {
    fs.writeFileSync(gitignorePath, newLines.join('\n'));
    return { removed: true, lines: removedLines };
  }
  return { removed: false };
}

// Helper: Show uninstall help
function showUninstallHelp() {
  logger.always(`
Usage: npx sinapse-ai uninstall [options]

Remove SINAPSE from the current project.

Options:
  --force      Skip confirmation prompt
  --keep-data  Keep .sinapse/ directory (settings and history)
  --dry-run    Show what would be removed without removing
  -h, --help   Show this help message

What gets removed:
  - .sinapse-ai/     Framework core files
  - docs/stories/   Story files (if created by SINAPSE)
  - squads/         Squad definitions
  - .gitignore      SINAPSE-added entries only

What is preserved (with --keep-data):
  - .sinapse/          Project settings and agent history

Exit Codes:
  0  Uninstall successful
  1  Uninstall failed or cancelled

Examples:
  # Interactive uninstall (with confirmation)
  npx sinapse-ai uninstall

  # Force uninstall without prompts
  npx sinapse-ai uninstall --force

  # See what would be removed
  npx sinapse-ai uninstall --dry-run

  # Uninstall but keep project data
  npx sinapse-ai uninstall --keep-data
`);
}

// Helper: Find Claude Code CLI path (reuses logic from sinapse-patch.js)
function findClaudeCliPath() {
  const HOME = os.homedir();
  const candidates = [
    path.join(HOME, '.npm-global/lib/node_modules/@anthropic-ai/claude-code/cli.js'),
    path.join(HOME, '.nvm/versions/node', process.version, 'lib/node_modules/@anthropic-ai/claude-code/cli.js'),
    '/usr/local/lib/node_modules/@anthropic-ai/claude-code/cli.js',
    '/usr/lib/node_modules/@anthropic-ai/claude-code/cli.js',
  ];
  try {
    const npmRoot = execSync('npm root -g', { encoding: 'utf8' }).trim();
    candidates.unshift(path.join(npmRoot, '@anthropic-ai/claude-code/cli.js'));
  } catch { /* npm root -g may be unavailable; fall through to other candidates */ }
  for (const p of candidates) {
    if (fs.existsSync(p)) return p;
  }
  return null;
}

// Helper: Check if SINAPSE branding is already applied
function isBrandingApplied() {
  const cliPath = findClaudeCliPath();
  if (!cliPath) return false;
  try {
    const content = fs.readFileSync(cliPath, 'utf8');
    return content.includes('SINAPSE CODE');
  } catch {
    return false;
  }
}

// Helper: Apply SINAPSE branding to Claude Code CLI
function runBrand() {
  const patchPath = path.join(__dirname, '..', 'scripts', 'sinapse-patch.js');

  if (!fs.existsSync(patchPath)) {
    logger.error('❌ Patch script not found at:', patchPath);
    logger.error('Please ensure SINAPSE-FullStack is installed correctly.');
    process.exit(1);
  }

  logger.always('◆ Applying SINAPSE branding to Claude Code...\n');

  try {
    execSync(`node "${patchPath}"`, { stdio: 'inherit' });
  } catch (error) {
    logger.error('❌ Branding patch failed:', error.message);
    process.exit(1);
  }
}

// Helper: Ensure branding is applied then launch Claude Code
function launchSinapse(extraArgs) {
  // 1. Check if Claude Code is installed
  const cliPath = findClaudeCliPath();
  if (!cliPath) {
    logger.error('❌ Claude Code not found. Install it first:');
    logger.error('   npm install -g @anthropic-ai/claude-code');
    process.exit(1);
  }

  // 2. Auto-apply branding if not yet applied
  if (!isBrandingApplied()) {
    const patchPath = path.join(__dirname, '..', 'scripts', 'sinapse-patch.js');
    if (fs.existsSync(patchPath)) {
      logger.always('◆ First run — applying SINAPSE branding...\n');
      try {
        execSync(`node "${patchPath}"`, { stdio: 'inherit' });
        logger.always('');
      } catch {
        logger.error('⚠️  Branding patch failed, launching without branding...\n');
      }
    }
  }

  // 3. Find the claude executable
  let claudeBin;
  try {
    const npmPrefix = execSync('npm prefix -g', { encoding: 'utf8' }).trim();
    // On Windows (Git Bash / cmd), binaries are directly in the prefix
    const winPath = path.join(npmPrefix, 'claude.cmd');
    const unixPath = path.join(npmPrefix, 'bin', 'claude');
    const directPath = path.join(npmPrefix, 'claude');

    if (process.platform === 'win32' && fs.existsSync(winPath)) {
      claudeBin = winPath;
    } else if (fs.existsSync(unixPath)) {
      claudeBin = unixPath;
    } else if (fs.existsSync(directPath)) {
      claudeBin = directPath;
    } else {
      claudeBin = 'claude'; // fallback to PATH
    }
  } catch {
    claudeBin = 'claude'; // fallback to PATH
  }

  // 4. Launch Claude Code with all extra args, replacing this process
  const { spawnSync } = require('child_process');
  const result = spawnSync(`"${claudeBin}"`, extraArgs, {
    stdio: 'inherit',
    shell: true,
    windowsVerbatimArguments: false,
  });
  process.exit(result.status || 0);
}

// Helper: Show doctor help
function showDoctorHelp() {
  logger.always(`
Usage: npx sinapse-ai doctor [options]

Run health checks on your SINAPSE installation.

Options:
  --fix        Automatically fix detected issues
  --deep       Run additional deep validation checks (constitution consistency, etc.)
  --dry-run    Show what --fix would do without making changes
  --json       Output results as structured JSON
  --quiet      Minimal output (exit code only)
  -h, --help   Show this help message

Checks performed:
  • Required directories exist (.sinapse-ai/, .sinapse/)
  • Configuration files are valid JSON/YAML
  • Agent definitions are complete
  • Task files have required fields
  • Dependencies are installed

Deep checks (--deep):
  • Constitution consistency across all documents
  • Article references synchronized
  • Required rule files for NON-NEGOTIABLE articles

Exit Codes:
  0  All checks passed (or issues fixed with --fix)
  1  Issues detected (run with --fix to repair)

Examples:
  # Run health check
  npx sinapse-ai doctor

  # Auto-fix detected issues
  npx sinapse-ai doctor --fix

  # Preview what would be fixed
  npx sinapse-ai doctor --fix --dry-run
`);
}

// Uninstall SINAPSE from project
async function runUninstall(options = {}) {
  const { force = false, keepData = false, dryRun = false, quiet = false } = options;
  const cwd = process.cwd();

  // Items to remove
  const itemsToRemove = [
    { path: '.sinapse-ai', description: 'Framework core' },
    { path: 'squads', description: 'Squad definitions' },
  ];

  // Optionally remove .sinapse
  if (!keepData) {
    itemsToRemove.push({ path: '.sinapse', description: 'Project data and settings' });
  }

  // Check what exists
  const existingItems = itemsToRemove.filter(item =>
    fs.existsSync(path.join(cwd, item.path)),
  );

  if (existingItems.length === 0) {
    logger.always('ℹ️  No SINAPSE installation found in this directory.');
    return;
  }

  // Calculate total size
  let totalSize = 0;
  const itemSizes = [];

  for (const item of existingItems) {
    const itemPath = path.join(cwd, item.path);
    try {
      const stats = fs.statSync(itemPath);
      if (stats.isDirectory()) {
        // Simple recursive size calculation
        const getSize = (dir) => {
          let size = 0;
          try {
            const files = fs.readdirSync(dir);
            for (const file of files) {
              const filePath = path.join(dir, file);
              const stat = fs.statSync(filePath);
              if (stat.isDirectory()) {
                size += getSize(filePath);
              } else {
                size += stat.size;
              }
            }
          } catch { /* ignore errors */ }
          return size;
        };
        const size = getSize(itemPath);
        totalSize += size;
        itemSizes.push({ ...item, size });
      } else {
        totalSize += stats.size;
        itemSizes.push({ ...item, size: stats.size });
      }
    } catch {
      itemSizes.push({ ...item, size: 0 });
    }
  }

  // Show what will be removed
  if (!quiet) {
    logger.always('\n📋 Items to be removed:\n');
    for (const item of itemSizes) {
      const sizeStr = item.size > 0 ? ` (${formatBytes(item.size)})` : '';
      logger.always(`  • ${item.path}/${sizeStr} - ${item.description}`);
    }
    logger.always(`\n  Total: ${formatBytes(totalSize)}`);

    // Check for .gitignore cleanup
    const gitignorePath = path.join(cwd, '.gitignore');
    if (fs.existsSync(gitignorePath)) {
      const content = fs.readFileSync(gitignorePath, 'utf8');
      if (content.includes('# SINAPSE') || content.includes('# Added by SINAPSE')) {
        logger.always('  • .gitignore SINAPSE entries will be cleaned');
      }
    }
    logger.always('');
  }

  // Dry run - stop here
  if (dryRun) {
    logger.always('🔍 Dry run - no changes made.');
    return;
  }

  // Confirmation
  if (!force) {
    const readline = require('readline');
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    const answer = await new Promise(resolve => {
      rl.question('⚠️  Are you sure you want to uninstall SINAPSE? (y/N): ', resolve);
    });
    rl.close();

    if (answer.toLowerCase() !== 'y' && answer.toLowerCase() !== 'yes') {
      logger.always('❌ Uninstall cancelled.');
      process.exit(1);
    }
  }

  // Perform removal
  if (!quiet) logger.always('\n🗑️  Removing SINAPSE components...\n');

  for (const item of existingItems) {
    const itemPath = path.join(cwd, item.path);
    try {
      fs.rmSync(itemPath, { recursive: true, force: true });
      if (!quiet) logger.always(`  ✓ Removed ${item.path}/`);
    } catch (error) {
      logger.error(`  ✗ Failed to remove ${item.path}: ${error.message}`);
    }
  }

  // Clean global agents from ~/.claude/agents/
  const homedir = require('os').homedir();
  const globalAgentsDir = path.join(homedir, '.claude', 'agents');
  const orqxSuffix = '-orqx.md';
  if (fs.existsSync(globalAgentsDir)) {
    try {
      const globalFiles = fs.readdirSync(globalAgentsDir);
      const sinapseAgents = globalFiles.filter((f) => f.endsWith(orqxSuffix));
      for (const file of sinapseAgents) {
        fs.rmSync(path.join(globalAgentsDir, file), { force: true });
        if (!quiet) logger.always(`  ✓ Removed global agent: ~/.claude/agents/${file}`);
      }
    } catch (error) {
      if (!quiet) logger.warn(`  ⚠ Could not clean global agents: ${error.message}`);
    }
  }

  // Clean .gitignore
  const gitignorePath = path.join(cwd, '.gitignore');
  const gitignoreResult = cleanGitignore(gitignorePath);
  if (gitignoreResult.removed && !quiet) {
    logger.always(`  ✓ Cleaned ${gitignoreResult.lines} SINAPSE entries from .gitignore`);
  }

  // Summary
  if (!quiet) {
    logger.always('\n✅ SINAPSE has been uninstalled.');
    if (keepData) {
      logger.always('   Your project data in .sinapse/ has been preserved.');
    }
    logger.always('\n   To reinstall: npx sinapse-ai install');
  }
}

// Helper: Show install help
function showInstallHelp() {
  logger.always(`
Usage: npx sinapse-ai install [options]

Install SINAPSE in the current directory.

Options:
  --force      Overwrite existing SINAPSE installation (destructive, opt-in)
  --quiet      Minimal output (no banner, no prompts) - ideal for CI/CD
  --dry-run    Simulate installation without modifying files
  -h, --help   Show this help message

Safe Merge (Always On):
  When installing in a project with existing config files (.env, CLAUDE.md),
  SINAPSE ALWAYS merges — your customizations are never overwritten.

  - .env files: Adds new variables, preserves existing values
  - CLAUDE.md: Updates SINAPSE sections, keeps your custom rules
  - Unknown file types: Backed up automatically before any change

  This behavior is non-negotiable and replaces the old --merge / --no-merge
  flags (which are accepted as no-ops for backward compatibility).

Exit Codes:
  0  Installation successful
  1  Installation failed

Examples:
  # Interactive installation
  npx sinapse-ai install

  # Force reinstall without prompts
  npx sinapse-ai install --force

  # Silent install for CI/CD
  npx sinapse-ai install --quiet --force

  # Preview what would be installed
  npx sinapse-ai install --dry-run
`);
}

// Helper: Create new project
// Helper: Show init help
function showInitHelp() {
  logger.always(`
Usage: npx sinapse-ai init <project-name> [options]

Create a new SINAPSE project with the specified name.

Options:
  --force              Force creation in non-empty directory
  --skip-install       Skip npm dependency installation
  --template <name>    Use specific template (default: default)
  -t <name>            Shorthand for --template
  -h, --help           Show this help message

Available Templates:
  default     Full installation with all agents, tasks, and workflows
  minimal     Essential files only (dev agent + basic tasks)
  enterprise  Everything + dashboards + team integrations

Examples:
  npx sinapse-ai init my-project
  npx sinapse-ai init my-project --template minimal
  npx sinapse-ai init my-project --force --skip-install
  npx sinapse-ai init . --template enterprise
`);
}

async function initProject() {
  // 1. Parse ALL args after 'init'
  const initArgs = args.slice(1);

  // 2. Handle --help FIRST (before creating any directories)
  if (initArgs.includes('--help') || initArgs.includes('-h')) {
    showInitHelp();
    return;
  }

  // 3. Parse flags
  const isForce = initArgs.includes('--force');
  const skipInstall = initArgs.includes('--skip-install');

  // Template with argument
  const templateIndex = initArgs.findIndex((a) => a === '--template' || a === '-t');
  let template = 'default';
  if (templateIndex !== -1) {
    template = initArgs[templateIndex + 1];
    if (!template || template.startsWith('-')) {
      logger.error('❌ --template requires a template name');
      logger.error('Available templates: default, minimal, enterprise');
      process.exit(1);
    }
  }

  // Validate template
  const validTemplates = ['default', 'minimal', 'enterprise'];
  if (!validTemplates.includes(template)) {
    logger.error(`❌ Unknown template: ${template}`);
    logger.error(`Available templates: ${validTemplates.join(', ')}`);
    process.exit(1);
  }

  // 4. Extract project name (anything that doesn't start with - and isn't a template value)
  const projectName = initArgs.find((arg, i) => {
    if (arg.startsWith('-')) return false;
    // Skip if it's the value after --template
    const prevArg = initArgs[i - 1];
    if (prevArg === '--template' || prevArg === '-t') return false;
    return true;
  });

  if (!projectName) {
    logger.error('❌ Project name is required');
    logger.always('\nUsage: npx sinapse-ai init <project-name> [options]');
    logger.always('Run with --help for more information.');
    process.exit(1);
  }

  // 5. Handle "." to install in current directory
  const isCurrentDir = projectName === '.';
  const targetPath = isCurrentDir ? process.cwd() : path.join(process.cwd(), projectName);
  const displayName = isCurrentDir ? path.basename(process.cwd()) : projectName;

  // 6. Check if directory exists
  if (fs.existsSync(targetPath) && !isCurrentDir) {
    const contents = fs.readdirSync(targetPath).filter((f) => !f.startsWith('.'));
    if (contents.length > 0 && !isForce) {
      logger.error(`❌ Directory already exists and is not empty: ${projectName}`);
      logger.error('Use --force to overwrite.');
      process.exit(1);
    }
    if (contents.length > 0 && isForce) {
      logger.always(`⚠️  Using --force: overwriting existing directory: ${projectName}`);
    } else {
      logger.always(`✓ Using existing empty directory: ${projectName}`);
    }
  } else if (!fs.existsSync(targetPath)) {
    fs.mkdirSync(targetPath, { recursive: true });
    logger.always(`✓ Created directory: ${projectName}`);
  }

  logger.always(`Creating new SINAPSE project: ${displayName}`);
  if (template !== 'default') {
    logger.always(`Template: ${template}`);
  }
  if (skipInstall) {
    logger.always('Skip install: enabled');
  }
  logger.always('');

  // 7. Change to project directory (if not already there)
  if (!isCurrentDir) {
    process.chdir(targetPath);
  }

  // 8. Run the initialization wizard with options
  await runWizard({
    template,
    skipInstall,
    force: isForce,
  });
}

// Command routing (async main function)
async function main() {
  // Story 10.13 — emit deprecation notice when the legacy `sinapse` binary
  // is used for the canonical subcommands. The warning goes to stderr so it
  // does NOT interfere with pipes, does NOT change the exit code, and does
  // NOT block execution (backward compat preserved for one major version).
  if (command === 'install' || command === 'update' || command === 'uninstall') {
    emitDeprecationWarning('sinapse', command);
  }

  switch (command) {
    case 'workers':
      // Service Discovery CLI - Story 2.7
      try {
        const { run } = require('../.sinapse-ai/cli/index.js');
        await run(process.argv);
      } catch (error) {
        logger.error(`❌ Workers command error: ${error.message}`);
        process.exit(1);
      }
      break;

    case 'config':
      // Layered Configuration CLI - Story PRO-4
      try {
        const { run } = require('../.sinapse-ai/cli/index.js');
        await run(process.argv);
      } catch (error) {
        logger.error(`❌ Config command error: ${error.message}`);
        process.exit(1);
      }
      break;

    case 'pro':
      // SINAPSE Pro License Management - Story PRO-6
      try {
        const { run } = require('../.sinapse-ai/cli/index.js');
        await run(process.argv);
      } catch (error) {
        logger.error(`❌ Pro command error: ${error.message}`);
        process.exit(1);
      }
      break;

    case 'chrome-brain': {
      // Chrome Brain capability management - Story 7.4.1
      const chromeBrainArgs = args.slice(1);
      try {
        const { runChromeBrain } = require('./modules/chrome-brain-installer');
        await runChromeBrain(chromeBrainArgs);
      } catch (error) {
        logger.error(`Error in chrome-brain: ${error.message}`);
        process.exit(1);
      }
      break;
    }

    case 'install': {
      // Install in current project with flag support
      const installArgs = args.slice(1);
      if (installArgs.includes('--help') || installArgs.includes('-h')) {
        showInstallHelp();
        break;
      }
      // Story A.2 — expose verbosity flags on the wizard options so the wizard
      // can pipe them down to sub-steps that still use raw console.
      const installOptions = {
        force: installArgs.includes('--force'),
        quiet: installArgs.includes('--quiet') || logger._flags?.quiet,
        verbose: installArgs.includes('--verbose') || logger._flags?.verbose,
        debug: installArgs.includes('--debug') || logger._flags?.debug,
        json: installArgs.includes('--json') || logger._flags?.json,
        dryRun: installArgs.includes('--dry-run'),
        forceMerge: installArgs.includes('--merge'),
        noMerge: installArgs.includes('--no-merge'),
      };
      // Story A.2 AC 9 — json mode: record metadata so flush() emits a
      // structured summary at process exit.
      if (installOptions.json) {
        logger.setVersion(packageJson.version);
      }
      if (!installOptions.quiet && !installOptions.json) {
        logger.always('SINAPSE-FullStack Installation\n');
      }
      await runWizard(installOptions);
      break;
    }

    case 'uninstall': {
      // Uninstall SINAPSE from project
      const uninstallArgs = args.slice(1);
      if (uninstallArgs.includes('--help') || uninstallArgs.includes('-h')) {
        showUninstallHelp();
        break;
      }
      const uninstallOptions = {
        force: uninstallArgs.includes('--force'),
        keepData: uninstallArgs.includes('--keep-data'),
        dryRun: uninstallArgs.includes('--dry-run'),
        quiet: uninstallArgs.includes('--quiet'),
      };
      await runUninstall(uninstallOptions);
      break;
    }

    case 'init': {
      // Create new project (flags parsed inside initProject)
      await initProject();
      break;
    }

    case 'info':
      showInfo();
      break;

    case 'doctor': {
      // Run health check with flag support
      const doctorArgs = args.slice(1);
      if (doctorArgs.includes('--help') || doctorArgs.includes('-h')) {
        showDoctorHelp();
        break;
      }
      const doctorOptions = {
        fix: doctorArgs.includes('--fix'),
        json: doctorArgs.includes('--json'),
        dryRun: doctorArgs.includes('--dry-run'),
        quiet: doctorArgs.includes('--quiet'),
        deep: doctorArgs.includes('--deep'),
      };
      await runDoctor(doctorOptions);
      break;
    }

    case 'telemetry': {
      // Story C.1 — Opt-in telemetry (disabled by default).
      // Subcommands: enable | disable | status
      const sub = args[1];
      const telemetry = require(path.join(__dirname, '..', '.sinapse-ai', 'core', 'telemetry'));
      if (sub === 'enable') {
        const ok = telemetry.enable();
        if (ok) {
          logger.always('Telemetria ativada. Obrigado por ajudar a melhorar o SINAPSE!');
          logger.always('Política de privacidade: docs/TELEMETRY.md');
        } else {
          logger.error(`Falha ao gravar ${telemetry.configPath()} — telemetria não ativada.`);
          process.exit(1);
        }
      } else if (sub === 'disable') {
        const ok = telemetry.disable();
        if (ok) {
          logger.always('Telemetria desativada.');
        } else {
          logger.error(`Falha ao gravar ${telemetry.configPath()} — estado não alterado.`);
          process.exit(1);
        }
      } else if (sub === 'status' || sub === undefined) {
        const enabled = telemetry.isEnabled();
        const envOverride = process.env.SINAPSE_TELEMETRY;
        logger.always(`Telemetria: ${enabled ? 'ATIVADA' : 'DESATIVADA (padrão)'}`);
        if (envOverride === '1' || envOverride === 'true') {
          logger.always('  (forçada por SINAPSE_TELEMETRY env var)');
        } else if (envOverride === '0' || envOverride === 'false') {
          logger.always('  (forçada desativada por SINAPSE_TELEMETRY env var)');
        } else {
          logger.always(`  Config: ${telemetry.configPath()}`);
        }
        logger.always('');
        logger.always('Comandos:');
        logger.always('  sinapse telemetry enable    Ativar telemetria (opt-in)');
        logger.always('  sinapse telemetry disable   Desativar telemetria');
        logger.always('  sinapse telemetry status    Ver estado atual');
        logger.always('');
        logger.always('Política de privacidade: docs/TELEMETRY.md');
      } else {
        logger.error(`Subcomando desconhecido: telemetry ${sub}`);
        logger.always('Use: sinapse telemetry [enable|disable|status]');
        process.exit(1);
      }
      break;
    }

    case 'validate':
      // Post-installation validation - Story 6.19
      await runValidate();
      break;

    case 'brand':
      // Apply SINAPSE branding to Claude Code CLI
      runBrand();
      break;

    case 'update':
      // Update to latest version - Epic 7
      await runUpdate();
      break;

    case '--version':
    case '-v':
    case '-V':
      await showVersion();
      break;

    case '--help':
    case '-h':
      showHelp();
      break;

    case 'qa': {
      // Quality Gate Manager — sinapse qa run|status|audit
      try {
        const { run } = require('../.sinapse-ai/cli/index.js');
        await run(process.argv);
      } catch (error) {
        logger.error(`❌ QA command error: ${error.message}`);
        process.exit(1);
      }
      break;
    }

    case 'health': {
      // Framework health analytics. Default = lightweight install-health
      // (hooks/squads/rules/skills). --deep runs the full core/health-check
      // engine (~35 project/runtime checks). --output-file writes the report.
      const { runHealth } = require('../.sinapse-ai/cli/commands/health/index.js');
      const healthArgs = args.slice(1);
      const outIdx = healthArgs.indexOf('--output-file');
      const isDeepHealth = healthArgs.includes('--deep');
      await runHealth({
        json: healthArgs.includes('--json'),
        fix: healthArgs.includes('--fix'),
        deep: isDeepHealth,
        outputFile: outIdx >= 0 ? healthArgs[outIdx + 1] : undefined,
      });
      // The --deep engine can leave async handles (e.g. spawned git checks)
      // open; exit explicitly so the CLI returns promptly. The report is fully
      // written/printed synchronously above. Lightweight path exits naturally.
      if (isDeepHealth) process.exit(0);
      break;
    }

    case 'performance': {
      // Squad & agent performance ranking
      const { runPerformance } = require('../.sinapse-ai/cli/commands/performance/index.js');
      const perfArgs = args.slice(1);
      const topIdx = perfArgs.indexOf('--top');
      await runPerformance({
        json: perfArgs.includes('--json'),
        top: topIdx >= 0 ? parseInt(perfArgs[topIdx + 1], 10) : undefined,
      });
      break;
    }

    case 'routing-intel': {
      // Routing intelligence analyzer
      const { runRoutingIntel } = require('../.sinapse-ai/cli/commands/routing-intel/index.js');
      const riArgs = args.slice(1);
      await runRoutingIntel({
        json: riArgs.includes('--json'),
        analyze: riArgs.includes('analyze'),
      });
      break;
    }

    case 'graph': {
      // Dependency/stats dashboard. Consolidated from the deprecated
      // standalone `sinapse-graph` binary into a subcommand of the main CLI.
      // Closes the published interface contract (claude-md template + CI test
      // expect `sinapse graph --deps` to work in every installed project).
      const { run } = require('../.sinapse-ai/core/graph-dashboard/cli');
      await run(args.slice(1));
      break;
    }

    case 'mcp': {
      // Global MCP configuration manager (setup, link, status, add).
      // Routes to the Commander CLI, same pattern as the `qa` case.
      const { run } = require('../.sinapse-ai/cli/index.js');
      await run(process.argv);
      break;
    }

    case 'generate': {
      // Document generator (templates: prd/adr/story/epic/task) — routes to the
      // Commander CLI. Without this case `sinapse generate` fell through to the
      // default and was passed to Claude Code as args (same bug class as graph/ids).
      try {
        const { run } = require('../.sinapse-ai/cli/index.js');
        await run(process.argv);
      } catch (error) {
        logger.error(`❌ Generate command error: ${error.message}`);
        process.exit(1);
      }
      break;
    }

    case 'create': {
      // Component generator — sinapse create <agent|task|workflow>
      // Exposes ComponentGenerator (template + elicitation) at the CLI.
      try {
        const ComponentGenerator = require('../.sinapse-ai/infrastructure/scripts/component-generator');
        const type = args[1];
        if (!type || type.startsWith('--')) {
          logger.error('Usage: sinapse create <agent|task|workflow>');
          process.exit(1);
        }
        const generator = new ComponentGenerator({ rootPath: process.cwd() });
        const result = await generator.generateComponent(type, {});
        process.exit(result && result.success === false ? 1 : 0);
      } catch (error) {
        logger.error(`❌ Create command error: ${error.message}`);
        process.exit(1);
      }
      break; // unreachable (both branches process.exit) — satisfies no-fallthrough
    }

    case 'mode': {
      // Permission mode manager — sinapse mode [explore|ask|auto] [--cycle]
      // Exposes PermissionMode (explore/ask/auto) at the CLI.
      try {
        const { PermissionMode } = require('../.sinapse-ai/core/permissions');
        const pm = new PermissionMode(process.cwd());
        await pm.load(); // load persisted mode first
        const target = args[1];
        let info;
        if (args.includes('--cycle')) {
          info = await pm.cycleMode();
        } else if (target && !target.startsWith('--')) {
          info = await pm.setMode(target);
        } else {
          info = pm.getModeInfo();
        }
        console.log(`Permission mode: ${info.name} — ${info.description}`);
        process.exit(0);
      } catch (error) {
        logger.error(`❌ Mode command error: ${error.message}`);
        process.exit(1);
      }
      break; // unreachable (both branches process.exit) — satisfies no-fallthrough
    }

    case 'orchestrate': {
      // Autonomous pipeline entry point (Epic 0 — MasterOrchestrator).
      // Usage: sinapse orchestrate <story-id> [--status|--stop|--resume]
      //                                        [--dry-run] [--epic N] [--strict]
      // Without this case the most powerful pipeline (executeFullPipeline) was
      // only reachable programmatically — violating Art. I (CLI First).
      try {
        const orchestration = require('../.sinapse-ai/core/orchestration');
        const epicIdx = args.indexOf('--epic');
        // The story-id is the first positional arg after `orchestrate` — i.e.
        // the first token that is neither a flag nor the `--epic` value. This
        // keeps `orchestrate STORY-1 --status` and `orchestrate --status STORY-1`
        // both resolving STORY-1 as the id.
        const epicValueIdx = epicIdx !== -1 ? epicIdx + 1 : -1;
        const storyId = args
          .slice(1)
          .find((a, i) => !a.startsWith('--') && i + 1 !== epicValueIdx);
        const options = {
          projectRoot: process.cwd(),
          dryRun: args.includes('--dry-run'),
          strict: args.includes('--strict'),
          epic: epicIdx !== -1 ? parseInt(args[epicIdx + 1], 10) : undefined,
        };

        let result;
        if (args.includes('--status')) {
          result = await orchestration.orchestrateStatus(storyId, options);
        } else if (args.includes('--stop')) {
          result = await orchestration.orchestrateStop(storyId, options);
        } else if (args.includes('--resume')) {
          result = await orchestration.orchestrateResume(storyId, options);
        } else {
          result = await orchestration.orchestrate(storyId, options);
        }

        const exitCode =
          result && typeof result.exitCode === 'number'
            ? result.exitCode
            : result && result.success === false
              ? 1
              : 0;
        process.exit(exitCode);
      } catch (error) {
        logger.error(`❌ Orchestrate command error: ${error.message}`);
        process.exit(1);
      }
      break; // unreachable (both branches process.exit) — satisfies no-fallthrough
    }

    case 'route': {
      // Doc-first routing observability (READ-ONLY) — Art. I (CLI First).
      // Usage: sinapse route "<brief>" [--type <project_type>]
      // Shows, deterministically: project type → workflow → required upstream
      // docs (which exist / which are missing) → whether the doc-first gate
      // (PRD + epic + Ready story) is satisfied. Shares logic with the
      // doc-first gate hook so the conversation and the gate never disagree.
      try {
        const { route: routeCmd } = require('../.sinapse-ai/core/orchestration/route-command');
        const typeIdx = args.indexOf('--type');
        const typeValueIdx = typeIdx !== -1 ? typeIdx + 1 : -1;
        // The brief is every positional token after `route` joined back together
        // (so an unquoted multi-word brief still works), minus flags/flag-values.
        const brief = args
          .slice(1)
          .filter((a, i) => !a.startsWith('--') && i + 1 !== typeValueIdx)
          .join(' ')
          .trim();
        const options = {
          projectRoot: process.cwd(),
          type: typeIdx !== -1 ? args[typeIdx + 1] : undefined,
        };
        const result = await routeCmd(brief, options);
        process.exit(result && typeof result.exitCode === 'number' ? result.exitCode : 0);
      } catch (error) {
        logger.error(`❌ Route command error: ${error.message}`);
        process.exit(1);
      }
      break; // unreachable (both branches process.exit) — satisfies no-fallthrough
    }

    case undefined:
      // No arguments - launch Claude Code with SINAPSE branding
      launchSinapse([]);
      break;

    default:
      // IDS subcommands (`ids:query`, `ids:health`, ...) delegate to the
      // dedicated IDS CLI. Without this they fell through to launchSinapse and
      // were silently passed to Claude Code as args (confirmed bug).
      if (typeof command === 'string' && command.startsWith('ids:')) {
        const idsBin = path.join(__dirname, 'sinapse-ids.js');
        const result = spawnSync(process.execPath, [idsBin, ...args], { stdio: 'inherit' });
        process.exit(result.status === null ? 1 : result.status);
      }
      // Any unknown command is passed through to Claude Code as arguments
      // e.g. `sinapse --model sonnet` → `claude --model sonnet`
      launchSinapse(args);
  }
}

// Execute main function (only when run directly, so the module can be required
// in tests without launching the CLI).
if (require.main === module) {
  main().catch((error) => {
    logger.error('❌ Fatal error:', error.message);
    process.exit(1);
  });
}

module.exports = { nodeSatisfies };
