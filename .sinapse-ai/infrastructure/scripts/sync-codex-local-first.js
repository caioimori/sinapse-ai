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

  return `OK Codex local-first sync complete (agents preserved: ${result.metrics.codexAgents}, total skills: ${result.metrics.codexSkills}, skills regenerated: ${result.metrics.generatedSkills})`;
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
};
