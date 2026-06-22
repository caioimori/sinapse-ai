#!/usr/bin/env node

/**
 * IDE Sync - Main orchestrator for syncing agents to IDEs
 * @story 6.19 - IDE Command Auto-Sync System
 *
 * Commands:
 *   sync     - Sync agents to all enabled IDEs
 *   validate - Validate sync status (report mode)
 *   report   - Generate sync status report
 *
 * Flags:
 *   --ide <name>  - Sync specific IDE only
 *   --strict      - Exit with code 1 if drift detected (CI mode)
 *   --dry-run     - Preview changes without writing
 *   --verbose     - Show detailed output
 *   --quiet       - Minimal output (for pre-commit hooks)
 */

const fs = require('fs-extra');
const path = require('path');
const yaml = require('js-yaml');

const { parseAllAgents, parseAgentFile } = require('./agent-parser');
const { generateAllRedirects, writeRedirects } = require('./redirect-generator');
const { validateAllIdes, formatValidationReport } = require('./validator');

// Transformers (Claude Code + Codex only — secondary IDE adapters removed)
const claudeCodeTransformer = require('./transformers/claude-code');

// ANSI colors for output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  dim: '\x1b[2m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

/**
 * Load core-config.yaml and extract ideSync section
 * @param {string} projectRoot - Project root directory
 * @returns {object} - ideSync configuration
 */
function loadConfig(projectRoot) {
  const configPath = path.join(projectRoot, '.sinapse-ai', 'core-config.yaml');

  // Default configuration
  const defaultConfig = {
    enabled: true,
    source: '.sinapse-ai/development/agents',
    targets: {
      'claude-code': {
        enabled: true,
        path: '.claude/commands/SINAPSE/agents',
        format: 'full-markdown-yaml',
      },
      // Post-E8: .codex is owned by the canonical Codex sync
      // (sync-codex-local-first.js), which writes thin runtime pointers
      // resolved at runtime by resolve-codex-agent.js. ide-sync drives
      // claude-code only now; leaving this enabled would clobber those
      // pointers with full agent bodies on a bare `sync:ide`.
      codex: {
        enabled: false,
        path: '.codex/agents',
        format: 'full-markdown-yaml',
      },
    },
    redirects: {
      'sinapse-developer': 'sinapse-orqx',
      'sinapse-orchestrator': 'sinapse-orqx',
      'db-sage': 'data-engineer',
      'github-devops': 'devops',
    },
    validation: {
      strictMode: true,
      failOnDrift: true,
      failOnOrphaned: false,
    },
  };

  try {
    if (fs.existsSync(configPath)) {
      const content = fs.readFileSync(configPath, 'utf8');
      const config = yaml.load(content);

      if (config && config.ideSync) {
        return { ...defaultConfig, ...config.ideSync };
      }
    }
  } catch (error) {
    console.warn(`${colors.yellow}Warning: Could not load config, using defaults${colors.reset}`);
  }

  return defaultConfig;
}

/**
 * Get transformer for IDE format
 * @param {string} format - IDE format name
 * @returns {object} - Transformer module
 */
function getTransformer(format) {
  const transformers = {
    'full-markdown-yaml': claudeCodeTransformer,
  };

  const transformer = transformers[format];
  if (!transformer) {
    throw new Error(
      `No transformer registered for format '${format}'. ` +
        `Register it in getTransformer() before adding a target with this format. ` +
        `Available formats: ${Object.keys(transformers).join(', ')}`
    );
  }
  return transformer;
}

/**
 * Resolve the primary file content for an agent.
 * Allows IDE-specific transform variants (e.g. transformCommand) when present,
 * falling back to the standard transform() otherwise.
 * @param {object} transformer - Transformer module
 * @param {object} agent - Parsed agent data
 * @param {string} ideName - IDE name
 * @returns {string} - Transformed content
 */
function transformPrimaryContent(transformer, agent, ideName) {
  if (ideName === 'claude-code' && typeof transformer.transformCommand === 'function') {
    return transformer.transformCommand(agent);
  }
  return transformer.transform(agent);
}

/**
 * Guard against path traversal: returns true only when candidatePath resolves
 * to a location strictly inside rootDir.
 * @param {string} rootDir - Allowed root directory
 * @param {string} candidatePath - Path to validate
 * @returns {boolean}
 */
function isPathInside(rootDir, candidatePath) {
  const relativePath = path.relative(rootDir, candidatePath);
  return (
    relativePath !== '' &&
    relativePath !== '..' &&
    !relativePath.startsWith(`..${path.sep}`) &&
    !path.isAbsolute(relativePath)
  );
}

/**
 * Sync agents to a specific IDE
 * @param {object[]} agents - Parsed agent data
 * @param {object} ideConfig - IDE configuration
 * @param {string} ideName - IDE name
 * @param {string} projectRoot - Project root
 * @param {object} options - Sync options
 * @returns {object} - Sync result
 */
function syncIde(agents, ideConfig, ideName, projectRoot, options) {
  const result = {
    ide: ideName,
    targetDir: path.join(projectRoot, ideConfig.path),
    files: [],
    errors: [],
  };

  if (!ideConfig.enabled) {
    result.skipped = true;
    return result;
  }

  const transformer = getTransformer(ideConfig.format);

  // Ensure target directory exists
  if (!options.dryRun) {
    fs.ensureDirSync(result.targetDir);
  }

  // Transform and write each agent
  for (const agent of agents) {
    // Skip only when there is no content at all to mirror. The claude-code
    // transform is an identity copy of the raw file body, so an agent whose
    // YAML block is missing/malformed but whose body exists can still be
    // synced verbatim — e.g. the prose-format squad orqx
    // (commercial/finance/paidmedia) pending standardization to the canonical
    // fenced yaml block (E6). Genuinely empty/unreadable files are skipped.
    if (agent.error && !agent.raw) {
      result.errors.push({
        agent: agent.id,
        error: agent.error,
      });
      continue;
    }

    try {
      const content = transformPrimaryContent(transformer, agent, ideName);
      const filename = transformer.getFilename(agent);
      const targetRoot = path.resolve(result.targetDir);

      // Kimi format uses subdirectories per skill: <skill-id>/SKILL.md
      let targetPath;
      if (ideConfig.format === 'kimi-skill' && transformer.getDirname) {
        const dirname = transformer.getDirname(agent);
        const skillDir = path.resolve(targetRoot, dirname);
        targetPath = path.resolve(skillDir, filename);

        if (!isPathInside(targetRoot, skillDir) || !isPathInside(targetRoot, targetPath)) {
          throw new Error(`Unsafe Kimi output path for agent '${agent.id}'`);
        }

        if (!options.dryRun) {
          fs.ensureDirSync(skillDir);
        }
      } else {
        targetPath = path.resolve(targetRoot, filename);
        if (!isPathInside(targetRoot, targetPath)) {
          throw new Error(`Unsafe output path for agent '${agent.id}' in ${ideName}`);
        }
      }

      if (!options.dryRun) {
        fs.writeFileSync(targetPath, content, 'utf8');
      }

      result.files.push({
        agent: agent.id,
        filename,
        path: targetPath,
        content,
      });
    } catch (error) {
      result.errors.push({
        agent: agent.id,
        error: error.message,
      });
    }
  }

  return result;
}

/**
 * Collect squad orchestrator agents (squads/SQUAD/agents/*-orqx.md).
 *
 * Framework-core agents come from config.source
 * (.sinapse-ai/development/agents). The 17 squad orchestrators live under
 * squads/** and were never enumerated here — so the Claude IDE dir only ever
 * received the 12 core agents, and the doctor ide-sync check (which expects
 * core + orqx) rightly WARNed. This mirrors the discovery logic in
 * core/doctor/checks/ide-sync.js so the two always agree. Filenames are the
 * flat basename (e.g. brand-orqx.md), via the claude-code transformer's
 * getFilename, even though the YAML id is "squad-brand/brand-orqx".
 *
 * @param {string} projectRoot - Project root directory
 * @returns {object[]} - Parsed orqx agent data
 */
function collectSquadOrqxAgents(projectRoot) {
  const squadsRoot = path.join(projectRoot, 'squads');
  const out = [];
  if (!fs.existsSync(squadsRoot)) return out;

  let squadDirs = [];
  try {
    squadDirs = fs
      .readdirSync(squadsRoot, { withFileTypes: true })
      .filter((e) => e.isDirectory())
      .map((e) => e.name);
  } catch {
    return out;
  }

  for (const squadName of squadDirs) {
    const agentsDir = path.join(squadsRoot, squadName, 'agents');
    if (!fs.existsSync(agentsDir)) continue;
    let files = [];
    try {
      files = fs.readdirSync(agentsDir).filter((f) => f.endsWith('-orqx.md'));
    } catch {
      continue;
    }
    for (const file of files) {
      out.push(parseAgentFile(path.join(agentsDir, file)));
    }
  }
  return out;
}

/**
 * Execute sync command
 * @param {object} options - Command options
 */
async function commandSync(options) {
  const projectRoot = process.cwd();
  const config = loadConfig(projectRoot);

  if (!config.enabled) {
    if (!options.quiet) {
      console.log(`${colors.yellow}IDE sync is disabled in config${colors.reset}`);
    }
    return;
  }

  if (!options.quiet) {
    console.log(`${colors.bright}${colors.blue}🔄 IDE Sync${colors.reset}`);
    console.log('');
  }

  // Parse all agents
  const agentsDir = path.join(projectRoot, config.source);
  if (!options.quiet) {
    console.log(`${colors.dim}Source: ${agentsDir}${colors.reset}`);
  }

  const agents = [...parseAllAgents(agentsDir), ...collectSquadOrqxAgents(projectRoot)];
  if (!options.quiet) {
    console.log(`${colors.dim}Found ${agents.length} agents${colors.reset}`);
    console.log('');
  }

  // Filter IDEs if --ide flag specified
  let targetIdes = Object.entries(config.targets);

  // Hard-skip: ide-sync must NEVER write .codex. The Codex mirror is owned by the
  // canonical Codex sync (sync-codex-local-first.js writes thin runtime pointers
  // resolved by resolve-codex-agent.js). Letting ide-sync write it clobbers those
  // pointers with full agent bodies. This is enforced in CODE — not just via the
  // config `targets.codex.enabled: false` — so a stray config flip can't re-arm the
  // foot-gun. To refresh .codex, run `npm run sync:codex`.
  if (options.ide === 'codex') {
    console.error(
      `${colors.yellow}'codex' is managed by the Codex sync (npm run sync:codex), not ide-sync — nothing to do.${colors.reset}`
    );
    process.exit(0);
  }
  targetIdes = targetIdes.filter(([name]) => name !== 'codex');

  if (options.ide) {
    targetIdes = targetIdes.filter(([name]) => name === options.ide);
    if (targetIdes.length === 0) {
      console.error(`${colors.red}Error: IDE '${options.ide}' not found in config${colors.reset}`);
      process.exit(1);
    }
  }

  const results = [];

  // Sync to each IDE
  for (const [ideName, ideConfig] of targetIdes) {
    if (!ideConfig.enabled) {
      if (!options.quiet) {
        console.log(`${colors.dim}⏭️  ${ideName}: skipped (disabled)${colors.reset}`);
      }
      continue;
    }

    if (!options.quiet) {
      console.log(`${colors.cyan}📁 Syncing ${ideName}...${colors.reset}`);
    }

    const result = syncIde(agents, ideConfig, ideName, projectRoot, options);

    result.commandFiles = [];

    results.push(result);

    // Generate redirects for this IDE
    const redirects = generateAllRedirects(config.redirects, result.targetDir, ideConfig.format);
    const redirectResult = writeRedirects(redirects, options.dryRun);

    if (options.verbose && !options.quiet) {
      console.log(`   ${colors.dim}Target: ${result.targetDir}${colors.reset}`);
    }

    const agentCount = result.files.length;
    const commandCount = (result.commandFiles || []).length;
    const redirectCount = redirectResult.written.length;
    const errorCount = result.errors.length;

    if (!options.quiet) {
      let status = `${colors.green}✓${colors.reset}`;
      if (errorCount > 0) {
        status = `${colors.yellow}⚠${colors.reset}`;
      }

      console.log(
        `   ${status} ${agentCount} agents${commandCount > 0 ? `, ${commandCount} commands` : ''}, ${redirectCount} redirects${errorCount > 0 ? `, ${errorCount} errors` : ''}`
      );

      if (options.verbose && result.errors.length > 0) {
        for (const err of result.errors) {
          console.log(`   ${colors.red}✗ ${err.agent}: ${err.error}${colors.reset}`);
        }
      }
    }
  }

  // Summary
  const totalFiles = results.reduce((sum, r) => sum + r.files.length + (r.commandFiles || []).length, 0);
  const totalRedirects =
    Object.keys(config.redirects).length * targetIdes.filter(([, c]) => c.enabled).length;
  const totalErrors = results.reduce((sum, r) => sum + r.errors.length, 0);

  if (!options.quiet) {
    console.log('');

    if (options.dryRun) {
      console.log(
        `${colors.yellow}Dry run: ${totalFiles} agents + ${totalRedirects} redirects would be written${colors.reset}`
      );
    } else {
      console.log(
        `${colors.green}✅ Sync complete: ${totalFiles} agents + ${totalRedirects} redirects${colors.reset}`
      );
    }

    if (totalErrors > 0) {
      console.log(`${colors.yellow}⚠️  ${totalErrors} errors occurred${colors.reset}`);
    }
  }
}

/**
 * Execute validate command
 * @param {object} options - Command options
 */
async function commandValidate(options) {
  const projectRoot = process.cwd();
  const config = loadConfig(projectRoot);

  if (!config.enabled) {
    console.log(`${colors.yellow}IDE sync is disabled in config${colors.reset}`);
    return;
  }

  console.log(`${colors.bright}${colors.blue}🔍 IDE Sync Validation${colors.reset}`);
  console.log('');

  // Parse all agents (framework core + squad orchestrators)
  const agentsDir = path.join(projectRoot, config.source);
  const agents = [...parseAllAgents(agentsDir), ...collectSquadOrqxAgents(projectRoot)];

  // Build expected files for each IDE
  const ideConfigs = {};
  let targetIdes = Object.entries(config.targets).filter(([, ideConfig]) => ideConfig.enabled);

  // Filter IDEs if --ide flag specified
  if (options.ide) {
    targetIdes = targetIdes.filter(([name]) => name === options.ide);
    if (targetIdes.length === 0) {
      console.error(`${colors.red}Error: IDE '${options.ide}' not found in config${colors.reset}`);
      process.exit(1);
    }
  }

  for (const [ideName, ideConfig] of targetIdes) {

    const transformer = getTransformer(ideConfig.format);
    const expectedFiles = [];

    for (const agent of agents) {
      if (agent.error) continue;

      try {
        const content = transformPrimaryContent(transformer, agent, ideName);
        const filename = transformer.getFilename(agent);
        // Kimi format stores each skill in <skill-id>/SKILL.md — record nested path
        const relPath =
          ideConfig.format === 'kimi-skill' && transformer.getDirname
            ? path.join(transformer.getDirname(agent), filename)
            : filename;
        expectedFiles.push({ filename: relPath, content });
      } catch (error) {
        // Skip agents that fail to transform
      }
    }

    // Add redirect files
    const redirects = generateAllRedirects(
      config.redirects,
      path.join(projectRoot, ideConfig.path),
      ideConfig.format
    );

    for (const redirect of redirects) {
      expectedFiles.push({
        filename: redirect.filename,
        content: redirect.content,
      });
    }

    ideConfigs[ideName] = {
      expectedFiles,
      targetDir: path.join(projectRoot, ideConfig.path),
    };
  }

  // Validate
  const results = validateAllIdes(ideConfigs, config.redirects);

  // Output report
  const report = formatValidationReport(results, options.verbose);
  console.log(report);

  // Exit code
  if (options.strict && !results.summary.pass) {
    console.log('');
    console.log(`${colors.red}Validation failed in strict mode${colors.reset}`);
    process.exit(1);
  }
}

/**
 * Parse command line arguments
 * @returns {object} - Parsed options
 */
function parseArgs() {
  const args = process.argv.slice(2);
  const options = {
    command: args[0] || 'sync',
    ide: null,
    strict: false,
    dryRun: false,
    verbose: false,
    quiet: false,
  };

  for (let i = 1; i < args.length; i++) {
    const arg = args[i];

    if (arg === '--ide' && args[i + 1]) {
      options.ide = args[++i];
    } else if (arg === '--strict') {
      options.strict = true;
    } else if (arg === '--dry-run') {
      options.dryRun = true;
    } else if (arg === '--verbose' || arg === '-v') {
      options.verbose = true;
    } else if (arg === '--quiet' || arg === '-q') {
      options.quiet = true;
    }
  }

  return options;
}

/**
 * Show help
 */
function showHelp() {
  console.log(`
${colors.bright}IDE Sync${colors.reset} - Sync SINAPSE agents to IDE command files

${colors.bright}Usage:${colors.reset}
  node ide-sync/index.js <command> [options]

${colors.bright}Commands:${colors.reset}
  sync      Sync agents to all enabled IDEs (default)
  validate  Validate sync status
  report    Generate sync status report (alias for validate)

${colors.bright}Options:${colors.reset}
  --ide <name>   Sync/validate specific IDE only
  --strict       Exit with code 1 if drift detected (CI mode)
  --dry-run      Preview changes without writing files
  --verbose, -v  Show detailed output
  --quiet, -q    Minimal output (for pre-commit hooks)

${colors.bright}Examples:${colors.reset}
  node ide-sync/index.js sync
  node ide-sync/index.js sync --ide codex
  node ide-sync/index.js validate --strict
  node ide-sync/index.js sync --dry-run --verbose
`);
}

/**
 * Main entry point
 */
async function main() {
  const options = parseArgs();

  if (options.command === 'help' || options.command === '--help' || options.command === '-h') {
    showHelp();
    return;
  }

  switch (options.command) {
    case 'sync':
      await commandSync(options);
      break;

    case 'validate':
    case 'report':
      await commandValidate(options);
      break;

    default:
      console.error(`${colors.red}Unknown command: ${options.command}${colors.reset}`);
      showHelp();
      process.exit(1);
  }
}

// Run if executed directly
if (require.main === module) {
  main().catch((error) => {
    console.error(`${colors.red}Error: ${error.message}${colors.reset}`);
    process.exit(1);
  });
}

module.exports = {
  loadConfig,
  getTransformer,
  transformPrimaryContent,
  isPathInside,
  syncIde,
  commandSync,
  commandValidate,
};
