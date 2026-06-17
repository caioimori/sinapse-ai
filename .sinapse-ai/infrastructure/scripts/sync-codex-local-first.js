#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');
const { syncSkills } = require('./codex-skills-sync/index');
const { loadCodexCatalogConfig } = require('./codex-parity/catalog');

function parseArgs(argv = process.argv.slice(2)) {
  const args = new Set(argv);
  return {
    dryRun: args.has('--dry-run'),
    quiet: args.has('--quiet') || args.has('-q'),
    json: args.has('--json'),
  };
}

function countMarkdownFiles(dirPath) {
  if (!fs.existsSync(dirPath)) return 0;
  return fs.readdirSync(dirPath).filter((entry) => entry.endsWith('.md')).length;
}

/**
 * Build the canonical agent source map.
 * Source of truth = framework core agents (canonicalAgentsDir, flat *.md)
 * + every squad specialist/orchestrator under squads/<squad>/agents/*.md.
 *
 * The result keys agents by id (filename without .md). When the same id exists
 * in more than one place, core wins, then the first squad alphabetically — but in
 * practice ids are unique across the ecosystem. Deprecated folders (e.g.
 * squads/<squad>/_deprecated) are intentionally NOT scanned, so retired agents
 * never re-enter the catalog.
 *
 * @param {string} projectRoot
 * @param {string} canonicalAgentsDir - relative path to core agents dir
 * @param {string} squadsDir - relative path to squads root (default 'squads')
 * @returns {Map<string, {id: string, squad: string, sourcePath: string}>}
 */
function buildAgentSourceMap(projectRoot, canonicalAgentsDir, squadsDir = 'squads') {
  const map = new Map();

  const addAgent = (filePath, squad) => {
    if (!filePath.endsWith('.md')) return;
    const id = path.basename(filePath, '.md');
    if (map.has(id)) return; // first writer wins (core scanned first)
    map.set(id, {
      id,
      squad,
      sourcePath: path.relative(projectRoot, filePath).split(path.sep).join('/'),
    });
  };

  // 1. Framework core agents (flat *.md only — ignore persona subfolders)
  const coreDir = path.join(projectRoot, canonicalAgentsDir);
  if (fs.existsSync(coreDir)) {
    for (const entry of fs.readdirSync(coreDir, { withFileTypes: true })) {
      if (entry.isFile() && entry.name.endsWith('.md')) {
        addAgent(path.join(coreDir, entry.name), 'core');
      }
    }
  }

  // 2. Squad specialists + orchestrators
  const squadsRoot = path.join(projectRoot, squadsDir);
  if (fs.existsSync(squadsRoot)) {
    for (const squadEntry of fs.readdirSync(squadsRoot, { withFileTypes: true })) {
      if (!squadEntry.isDirectory()) continue;
      const squadName = squadEntry.name;
      const agentsDir = path.join(squadsRoot, squadName, 'agents');
      if (!fs.existsSync(agentsDir)) continue;
      for (const agentEntry of fs.readdirSync(agentsDir, { withFileTypes: true })) {
        // Only top-level *.md — skip _deprecated/ and persona subfolders
        if (agentEntry.isFile() && agentEntry.name.endsWith('.md')) {
          addAgent(path.join(agentsDir, agentEntry.name), squadName);
        }
      }
    }
  }

  return map;
}

/**
 * Render the Codex activator pointer for an agent. Thin by design (D7):
 * Codex reads the real persona/tasks from the canonical source, so the pointer
 * never copies content — it only routes to the source of truth.
 *
 * @param {{id: string, squad: string, sourcePath: string}} agent
 * @returns {string}
 */
function renderCodexActivator(agent) {
  return [
    `Activate agent: ${agent.id}`,
    `Squad: ${agent.squad}`,
    `Read the agent definition at: ${agent.sourcePath}`,
    'Follow ALL instructions in the agent file. Adopt the persona, use the frameworks, and respond as that agent.',
    '',
  ].join('\n');
}

/**
 * Regenerate .codex/agents from the canonical source map, idempotently.
 * - Writes/updates one activator per source agent (pointers always valid,
 *   because the target path is derived from where the file actually lives).
 * - Prunes any .codex agent whose id is not in the source set (removes orphans
 *   such as retired chiefs and squad-artdir personas).
 *
 * @returns {{written: string[], pruned: string[], total: number}}
 */
function regenerateCodexAgents(agentsDir, sourceMap, options = {}) {
  const dryRun = Boolean(options.dryRun);
  const written = [];
  const pruned = [];

  if (!dryRun) {
    fs.mkdirSync(agentsDir, { recursive: true });
  }

  // 1. Write/refresh pointers for every canonical agent
  for (const agent of sourceMap.values()) {
    const target = path.join(agentsDir, `${agent.id}.md`);
    const next = renderCodexActivator(agent);
    let current = null;
    if (fs.existsSync(target)) {
      current = fs.readFileSync(target, 'utf8');
    }
    if (current !== next) {
      if (!dryRun) fs.writeFileSync(target, next, 'utf8');
      written.push(`${agent.id}.md`);
    }
  }

  // 2. Prune orphans (present in .codex but absent from source)
  if (fs.existsSync(agentsDir)) {
    for (const entry of fs.readdirSync(agentsDir)) {
      if (!entry.endsWith('.md')) continue;
      const id = entry.slice(0, -'.md'.length);
      if (!sourceMap.has(id)) {
        if (!dryRun) fs.rmSync(path.join(agentsDir, entry), { force: true });
        pruned.push(entry);
      }
    }
  }

  return {
    written,
    pruned,
    total: sourceMap.size,
  };
}

function countSkillFiles(skillsDir) {
  if (!fs.existsSync(skillsDir)) return 0;
  return fs.readdirSync(skillsDir, { withFileTypes: true })
    .filter((entry) => entry.isDirectory() && entry.name.startsWith('sinapse-'))
    .filter((entry) => fs.existsSync(path.join(skillsDir, entry.name, 'SKILL.md')))
    .length;
}

function runLegacyCodexSync(projectRoot, options = {}) {
  const args = [
    path.join('.sinapse-ai', 'infrastructure', 'scripts', 'ide-sync', 'index.js'),
    'sync',
    '--ide',
    'codex',
  ];

  if (options.dryRun) args.push('--dry-run');
  if (options.quiet) args.push('--quiet');

  const result = spawnSync(process.execPath, args, {
    cwd: projectRoot,
    encoding: 'utf8',
  });

  return {
    ok: result.status === 0,
    mode: 'canonical',
    delegated: true,
    stdout: result.stdout || '',
    stderr: result.stderr || '',
    status: result.status || 0,
  };
}

function syncCodexLocalFirst(options = {}, deps = {}) {
  const projectRoot = options.projectRoot || process.cwd();
  const config = loadCodexCatalogConfig(projectRoot);
  const runLegacySync = deps.runLegacyCodexSync || runLegacyCodexSync;
  const runSyncSkills = deps.syncSkills || syncSkills;
  const errors = [];

  if (config.catalogMode !== 'expanded') {
    return runLegacySync(projectRoot, options);
  }

  const agentsDir = path.join(projectRoot, config.codexAgentsDir || '.codex/agents');
  const skillsDir = path.join(projectRoot, config.skillsDir || '.codex/skills');
  const sourceDir = path.join(projectRoot, config.canonicalAgentsDir || '.sinapse-ai/development/agents');

  if (!fs.existsSync(agentsDir)) {
    errors.push(`Missing Codex agents dir: ${path.relative(projectRoot, agentsDir)}`);
  }

  if (errors.length > 0) {
    return {
      ok: false,
      mode: 'expanded',
      delegated: false,
      errors,
      metrics: {
        codexAgents: countMarkdownFiles(agentsDir),
        codexSkills: 0,
        generatedSkills: 0,
      },
    };
  }

  // Regenerate the agent catalog from the canonical source of truth.
  // This replaces the old "preserve whatever is on disk" behaviour that froze
  // the snapshot and perpetuated broken pointers + retired orphans.
  const sourceMap = (deps.buildAgentSourceMap || buildAgentSourceMap)(
    projectRoot,
    config.canonicalAgentsDir || '.sinapse-ai/development/agents',
    config.squadsDir || 'squads',
  );
  const regen = (deps.regenerateCodexAgents || regenerateCodexAgents)(
    agentsDir,
    sourceMap,
    { dryRun: Boolean(options.dryRun) },
  );

  const syncResult = runSyncSkills({
    projectRoot,
    sourceDir,
    localSkillsDir: skillsDir,
    dryRun: Boolean(options.dryRun),
    quiet: true,
    config,
  });

  return {
    ok: true,
    mode: 'expanded',
    delegated: false,
    errors: [],
    metrics: {
      codexAgents: countMarkdownFiles(agentsDir),
      agentsRegenerated: regen.written.length,
      agentsPruned: regen.pruned.length,
      codexSkills: countSkillFiles(skillsDir),
      generatedSkills: syncResult.generated,
    },
  };
}

function formatHumanReport(result) {
  if (result.delegated) {
    return [result.stdout, result.stderr].filter(Boolean).join('\n').trim();
  }

  if (!result.ok) {
    return [
      `X Codex local-first sync failed (${result.errors.length} issue(s))`,
      ...result.errors.map((error) => `- ${error}`),
    ].join('\n');
  }

  return (
    `OK Codex local-first sync complete ` +
    `(agents: ${result.metrics.codexAgents}, ` +
    `regenerated: ${result.metrics.agentsRegenerated ?? 0}, ` +
    `pruned: ${result.metrics.agentsPruned ?? 0}, ` +
    `total skills: ${result.metrics.codexSkills}, ` +
    `skills regenerated: ${result.metrics.generatedSkills})`
  );
}

function main() {
  const args = parseArgs();
  const result = syncCodexLocalFirst(args);

  if (!args.quiet) {
    if (args.json) {
      console.log(JSON.stringify(result, null, 2));
    } else {
      console.log(formatHumanReport(result));
    }
  }

  if (!result.ok) {
    process.exitCode = 1;
  }
}

if (require.main === module) {
  main();
}

module.exports = {
  parseArgs,
  syncCodexLocalFirst,
  formatHumanReport,
  runLegacyCodexSync,
  countMarkdownFiles,
  countSkillFiles,
  buildAgentSourceMap,
  renderCodexActivator,
  regenerateCodexAgents,
};
