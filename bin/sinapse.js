#!/usr/bin/env node

/**
 * SINAPSE-FullStack CLI
 * Main entry point - Standalone (no external dependencies for npx compatibility)
 * Version: 4.0.0
 */

const path = require('path');
const fs = require('fs');
const os = require('os');
const { execSync } = require('child_process');

// Read package.json for version
const packageJsonPath = path.join(__dirname, '..', 'package.json');
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

// Parse arguments
const args = process.argv.slice(2);
const command = args[0];

// Helper: Run initialization wizard
async function runWizard(options = {}) {
  // Use the v4 wizard from packages/installer/src/wizard/index.js
  const wizardPath = path.join(__dirname, '..', 'packages', 'installer', 'src', 'wizard', 'index.js');

  if (!fs.existsSync(wizardPath)) {
    // Fallback to legacy wizard if new wizard not found
    const legacyScript = path.join(__dirname, 'sinapse-init.js');
    if (fs.existsSync(legacyScript)) {
      if (!options.quiet) {
        console.log('⚠️  Using legacy wizard (src/wizard not found)');
      }
      // Legacy wizard doesn't support options, pass via env vars
      process.env.SINAPSE_INSTALL_FORCE = options.force ? '1' : '';
      process.env.SINAPSE_INSTALL_QUIET = options.quiet ? '1' : '';
      process.env.SINAPSE_INSTALL_DRY_RUN = options.dryRun ? '1' : '';
      require(legacyScript);
      return;
    }
    console.error('❌ Initialization wizard not found');
    console.error('Please ensure SINAPSE-FullStack is installed correctly.');
    process.exit(1);
  }

  try {
    // Run the v4 wizard with options
    const { runWizard: executeWizard } = require(wizardPath);
    await executeWizard(options);
  } catch (error) {
    console.error('❌ Wizard error:', error.message);
    process.exit(1);
  }
}

// Helper: Show help
function showHelp() {
  console.log(`
SINAPSE-FullStack v${packageJson.version}
AI-Orchestrated System for Full Stack Development

USAGE:
  sinapse                             # Launch Claude Code with SINAPSE branding
  sinapse <any claude args>           # Pass arguments to Claude Code
  sinapse install                     # Install SINAPSE in current project
  sinapse init <name>                 # Create new project
  sinapse update                      # Update to latest version
  sinapse brand                       # Re-apply SINAPSE branding (after Claude update)
  sinapse validate                    # Validate installation integrity
  sinapse info                        # Show system info
  sinapse doctor                      # Run diagnostics
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

EXAMPLES:
  # Install in current directory
  npx sinapse-ai@latest

  # Install with minimal mode (only expansion-creator)
  npx sinapse-ai-minimal@latest

  # Create new project
  npx sinapse-ai@latest init my-project

  # Search for workers
  sinapse workers search "json csv"

For more information, visit: https://github.com/SinapseAI/sinapse-ai
`);
}

// Helper: Show version
async function showVersion() {
  const isDetailed = args.includes('--detailed') || args.includes('-d');

  if (!isDetailed) {
    // Simple version output (backwards compatible)
    console.log(packageJson.version);
    return;
  }

  // Detailed version output (Story 7.2: Version Tracking)
  console.log(`SINAPSE-FullStack v${packageJson.version}`);
  console.log('Package: sinapse-ai');

  // Check for local installation
  const localVersionPath = path.join(process.cwd(), '.sinapse-ai', 'version.json');

  if (fs.existsSync(localVersionPath)) {
    try {
      const versionInfo = JSON.parse(fs.readFileSync(localVersionPath, 'utf8'));
      console.log('\n📦 Local Installation:');
      console.log(`  Version:    ${versionInfo.version}`);
      console.log(`  Mode:       ${versionInfo.mode || 'unknown'}`);

      if (versionInfo.installedAt) {
        const installedDate = new Date(versionInfo.installedAt);
        console.log(`  Installed:  ${installedDate.toLocaleDateString()}`);
      }

      if (versionInfo.updatedAt) {
        const updatedDate = new Date(versionInfo.updatedAt);
        console.log(`  Updated:    ${updatedDate.toLocaleDateString()}`);
      }

      if (versionInfo.fileHashes) {
        const fileCount = Object.keys(versionInfo.fileHashes).length;
        console.log(`  Files:      ${fileCount} tracked`);
      }

      if (versionInfo.customized && versionInfo.customized.length > 0) {
        console.log(`  Customized: ${versionInfo.customized.length} files`);
      }

      // Version comparison
      if (versionInfo.version !== packageJson.version) {
        console.log('\n⚠️  Version mismatch!');
        console.log(`  Local:  ${versionInfo.version}`);
        console.log(`  Latest: ${packageJson.version}`);
        console.log('  Run \'npx sinapse-ai update\' to update.');
      } else {
        console.log('\n✅ Up to date');
      }
    } catch (error) {
      console.log(`\n⚠️  Could not read version.json: ${error.message}`);
    }
  } else {
    console.log('\n📭 No local installation found');
    console.log('  Run \'npx sinapse-ai install\' to install SINAPSE in this project.');
  }
}

// Helper: Show system info
function showInfo() {
  console.log('📊 SINAPSE-FullStack System Information\n');
  console.log(`Version: ${packageJson.version}`);
  console.log(`Platform: ${process.platform}`);
  console.log(`Node.js: ${process.version}`);
  console.log(`Architecture: ${process.arch}`);
  console.log(`Working Directory: ${process.cwd()}`);
  console.log(`Install Location: ${path.join(__dirname, '..')}`);

  // Check if .sinapse-ai exists
  const sinapseCoreDir = path.join(__dirname, '..', '.sinapse-ai');
  if (fs.existsSync(sinapseCoreDir)) {
    console.log('\n✓ SINAPSE Core installed');

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

    console.log(`  - Agents: ${countFiles(path.join(componentBase, 'agents'))}`);
    console.log(`  - Tasks: ${countFiles(path.join(componentBase, 'tasks'))}`);
    console.log(`  - Templates: ${countFiles(path.join(componentBase, 'templates'))}`);
    console.log(`  - Workflows: ${countFiles(path.join(componentBase, 'workflows'))}`);

  } else {
    console.log('\n⚠️  SINAPSE Core not found');
  }

  // Check SINAPSE Pro status (Task 5.1)
  const proDir = path.join(__dirname, '..', 'pro');
  if (fs.existsSync(proDir)) {
    console.log('\n✓ SINAPSE Pro installed');

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

      console.log(`  - License: ${stateEmoji[state] || ''} ${state}`);

      if (info && info.features) {
        const availableCount = featureGate.listAvailable().length;
        console.log(`  - Features: ${availableCount} available`);
      }
    } catch {
      console.log('  - License: Unable to check status');
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
    console.log('Running installation validation...\n');

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

      console.log(formatReport(report, { colors: true }));

      if (
        report.status === 'failed' ||
        report.stats.missingFiles > 0 ||
        report.stats.corruptedFiles > 0
      ) {
        process.exit(1);
      }
    } catch (validatorError) {
      console.error(`❌ Validation error: ${validatorError.message}`);
      if (args.includes('--verbose') || args.includes('-v')) {
        console.error(validatorError.stack);
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
      console.error('❌ Updater module not found');
      console.error('Please ensure SINAPSE-FullStack is installed correctly.');
      process.exit(1);
    }

    const { SINAPSEUpdater, formatCheckResult, formatUpdateResult } = require(updaterPath);

    const updater = new SINAPSEUpdater(process.cwd(), {
      verbose: isVerbose,
      force: isForce,
    });

    if (isCheck) {
      // Check only mode
      console.log('🔍 Checking for updates...\n');
      const result = await updater.checkForUpdates();
      console.log(formatCheckResult(result, { colors: true }));

      if (result.status === 'check_failed') {
        process.exit(1);
      }
    } else {
      // Update mode
      console.log('🔄 SINAPSE Update\n');

      const result = await updater.update({
        dryRun: isDryRun,
        onProgress: (phase, message) => {
          if (isVerbose) {
            console.log(`[${phase}] ${message}`);
          }
        },
      });

      console.log(formatUpdateResult(result, { colors: true }));

      if (!result.success && result.error !== 'Already up to date') {
        process.exit(1);
      }
    }
  } catch (error) {
    console.error(`❌ Update error: ${error.message}`);
    if (args.includes('--verbose') || args.includes('-v')) {
      console.error(error.stack);
    }
    process.exit(1);
  }
}

// Helper: Run doctor diagnostics (v2.0 — delegates to modular doctor)
async function runDoctor(options = {}) {
  const { runDoctorChecks } = require(path.join(__dirname, '..', '.sinapse-ai', 'core', 'doctor'));

  const result = await runDoctorChecks({
    fix: options.fix || false,
    json: options.json || false,
    dryRun: options.dryRun || false,
    quiet: options.quiet || false,
    projectRoot: process.cwd(),
  });

  console.log(result.formatted);

  // Exit with code 1 if any FAIL results
  if (result.data && result.data.summary && result.data.summary.fail > 0) {
    process.exit(1);
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
  console.log(`
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
  } catch {}
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
    console.error('❌ Patch script not found at:', patchPath);
    console.error('Please ensure SINAPSE-FullStack is installed correctly.');
    process.exit(1);
  }

  console.log('◆ Applying SINAPSE branding to Claude Code...\n');

  try {
    execSync(`node "${patchPath}"`, { stdio: 'inherit' });
  } catch (error) {
    console.error('❌ Branding patch failed:', error.message);
    process.exit(1);
  }
}

// Helper: Ensure branding is applied then launch Claude Code
function launchSinapse(extraArgs) {
  // 1. Check if Claude Code is installed
  const cliPath = findClaudeCliPath();
  if (!cliPath) {
    console.error('❌ Claude Code not found. Install it first:');
    console.error('   npm install -g @anthropic-ai/claude-code');
    process.exit(1);
  }

  // 2. Auto-apply branding if not yet applied
  if (!isBrandingApplied()) {
    const patchPath = path.join(__dirname, '..', 'scripts', 'sinapse-patch.js');
    if (fs.existsSync(patchPath)) {
      console.log('◆ First run — applying SINAPSE branding...\n');
      try {
        execSync(`node "${patchPath}"`, { stdio: 'inherit' });
        console.log('');
      } catch {
        console.error('⚠️  Branding patch failed, launching without branding...\n');
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
  console.log(`
Usage: npx sinapse-ai doctor [options]

Run health checks on your SINAPSE installation.

Options:
  --fix        Automatically fix detected issues
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
    console.log('ℹ️  No SINAPSE installation found in this directory.');
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
    console.log('\n📋 Items to be removed:\n');
    for (const item of itemSizes) {
      const sizeStr = item.size > 0 ? ` (${formatBytes(item.size)})` : '';
      console.log(`  • ${item.path}/${sizeStr} - ${item.description}`);
    }
    console.log(`\n  Total: ${formatBytes(totalSize)}`);

    // Check for .gitignore cleanup
    const gitignorePath = path.join(cwd, '.gitignore');
    if (fs.existsSync(gitignorePath)) {
      const content = fs.readFileSync(gitignorePath, 'utf8');
      if (content.includes('# SINAPSE') || content.includes('# Added by SINAPSE')) {
        console.log('  • .gitignore SINAPSE entries will be cleaned');
      }
    }
    console.log('');
  }

  // Dry run - stop here
  if (dryRun) {
    console.log('🔍 Dry run - no changes made.');
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
      console.log('❌ Uninstall cancelled.');
      process.exit(1);
    }
  }

  // Perform removal
  if (!quiet) console.log('\n🗑️  Removing SINAPSE components...\n');

  for (const item of existingItems) {
    const itemPath = path.join(cwd, item.path);
    try {
      fs.rmSync(itemPath, { recursive: true, force: true });
      if (!quiet) console.log(`  ✓ Removed ${item.path}/`);
    } catch (error) {
      console.error(`  ✗ Failed to remove ${item.path}: ${error.message}`);
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
        if (!quiet) console.log(`  ✓ Removed global agent: ~/.claude/agents/${file}`);
      }
    } catch (error) {
      if (!quiet) console.warn(`  ⚠ Could not clean global agents: ${error.message}`);
    }
  }

  // Clean .gitignore
  const gitignorePath = path.join(cwd, '.gitignore');
  const gitignoreResult = cleanGitignore(gitignorePath);
  if (gitignoreResult.removed && !quiet) {
    console.log(`  ✓ Cleaned ${gitignoreResult.lines} SINAPSE entries from .gitignore`);
  }

  // Summary
  if (!quiet) {
    console.log('\n✅ SINAPSE has been uninstalled.');
    if (keepData) {
      console.log('   Your project data in .sinapse/ has been preserved.');
    }
    console.log('\n   To reinstall: npx sinapse-ai install');
  }
}

// Helper: Show install help
function showInstallHelp() {
  console.log(`
Usage: npx sinapse-ai install [options]

Install SINAPSE in the current directory.

Options:
  --force      Overwrite existing SINAPSE installation
  --quiet      Minimal output (no banner, no prompts) - ideal for CI/CD
  --dry-run    Simulate installation without modifying files
  --merge      Auto-merge existing config files (brownfield mode)
  --no-merge   Disable merge option, use legacy overwrite behavior
  -h, --help   Show this help message

Smart Merge (Brownfield):
  When installing in a project with existing config files (.env, CLAUDE.md),
  SINAPSE can merge new settings while preserving your customizations.

  - .env files: Adds new variables, preserves existing values
  - CLAUDE.md: Updates SINAPSE sections, keeps your custom rules

Exit Codes:
  0  Installation successful
  1  Installation failed

Examples:
  # Interactive installation
  npx sinapse-ai install

  # Force reinstall without prompts
  npx sinapse-ai install --force

  # Brownfield: merge configs automatically
  npx sinapse-ai install --merge

  # Silent install for CI/CD
  npx sinapse-ai install --quiet --force

  # Preview what would be installed
  npx sinapse-ai install --dry-run
`);
}

// Helper: Create new project
// Helper: Show init help
function showInitHelp() {
  console.log(`
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
      console.error('❌ --template requires a template name');
      console.error('Available templates: default, minimal, enterprise');
      process.exit(1);
    }
  }

  // Validate template
  const validTemplates = ['default', 'minimal', 'enterprise'];
  if (!validTemplates.includes(template)) {
    console.error(`❌ Unknown template: ${template}`);
    console.error(`Available templates: ${validTemplates.join(', ')}`);
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
    console.error('❌ Project name is required');
    console.log('\nUsage: npx sinapse-ai init <project-name> [options]');
    console.log('Run with --help for more information.');
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
      console.error(`❌ Directory already exists and is not empty: ${projectName}`);
      console.error('Use --force to overwrite.');
      process.exit(1);
    }
    if (contents.length > 0 && isForce) {
      console.log(`⚠️  Using --force: overwriting existing directory: ${projectName}`);
    } else {
      console.log(`✓ Using existing empty directory: ${projectName}`);
    }
  } else if (!fs.existsSync(targetPath)) {
    fs.mkdirSync(targetPath, { recursive: true });
    console.log(`✓ Created directory: ${projectName}`);
  }

  console.log(`Creating new SINAPSE project: ${displayName}`);
  if (template !== 'default') {
    console.log(`Template: ${template}`);
  }
  if (skipInstall) {
    console.log('Skip install: enabled');
  }
  console.log('');

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
  switch (command) {
    case 'workers':
      // Service Discovery CLI - Story 2.7
      try {
        const { run } = require('../.sinapse-ai/cli/index.js');
        await run(process.argv);
      } catch (error) {
        console.error(`❌ Workers command error: ${error.message}`);
        process.exit(1);
      }
      break;

    case 'config':
      // Layered Configuration CLI - Story PRO-4
      try {
        const { run } = require('../.sinapse-ai/cli/index.js');
        await run(process.argv);
      } catch (error) {
        console.error(`❌ Config command error: ${error.message}`);
        process.exit(1);
      }
      break;

    case 'pro':
      // SINAPSE Pro License Management - Story PRO-6
      try {
        const { run } = require('../.sinapse-ai/cli/index.js');
        await run(process.argv);
      } catch (error) {
        console.error(`❌ Pro command error: ${error.message}`);
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
        console.error(`Error in chrome-brain: ${error.message}`);
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
      const installOptions = {
        force: installArgs.includes('--force'),
        quiet: installArgs.includes('--quiet'),
        dryRun: installArgs.includes('--dry-run'),
        forceMerge: installArgs.includes('--merge'),
        noMerge: installArgs.includes('--no-merge'),
      };
      if (!installOptions.quiet) {
        console.log('SINAPSE-FullStack Installation\n');
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
      };
      await runDoctor(doctorOptions);
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

    case undefined:
      // No arguments - launch Claude Code with SINAPSE branding
      launchSinapse([]);
      break;

    default:
      // Any unknown command is passed through to Claude Code as arguments
      // e.g. `sinapse --model sonnet` → `claude --model sonnet`
      launchSinapse(args);
  }
}

// Execute main function
main().catch((error) => {
  console.error('❌ Fatal error:', error.message);
  process.exit(1);
});
