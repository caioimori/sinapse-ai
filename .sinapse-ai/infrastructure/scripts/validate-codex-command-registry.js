#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');

function parseArgs(argv = process.argv.slice(2)) {
  const args = new Set(argv);
  return {
    quiet: args.has('--quiet') || args.has('-q'),
    json: args.has('--json'),
  };
}

function loadRegistry(projectRoot) {
  const registryPath = path.join(projectRoot, '.codex', 'command-registry.json');
  if (!fs.existsSync(registryPath)) {
    return {
      registryPath,
      registry: null,
      error: `Missing Codex command registry: ${path.relative(projectRoot, registryPath)}`,
    };
  }

  try {
    return {
      registryPath,
      registry: JSON.parse(fs.readFileSync(registryPath, 'utf8')),
      error: null,
    };
  } catch (error) {
    return {
      registryPath,
      registry: null,
      error: `Unable to parse Codex command registry: ${error.message}`,
    };
  }
}

function validateCodexCommandRegistry(options = {}) {
  const projectRoot = options.projectRoot || process.cwd();
  const { registryPath, registry, error } = loadRegistry(projectRoot);
  const errors = [];

  if (error) {
    errors.push(error);
    return {
      ok: false,
      errors,
      warnings: [],
      metrics: { agents: 0, commands: 0 },
    };
  }

  let commandCount = 0;
  for (const [agentId, agentSpec] of Object.entries(registry.agents || {})) {
    const skillPath = path.join(projectRoot, '.codex', 'skills', agentSpec.skillId || agentId, 'SKILL.md');
    if (!fs.existsSync(skillPath)) {
      errors.push(`${agentId}: missing skill file ${path.relative(projectRoot, skillPath)}`);
    }

    const sourceOfTruth = path.join(projectRoot, agentSpec.sourceOfTruth || '');
    if (!fs.existsSync(sourceOfTruth)) {
      errors.push(`${agentId}: missing source of truth ${path.relative(projectRoot, sourceOfTruth)}`);
    }

    for (const [commandId, commandSpec] of Object.entries(agentSpec.commands || {})) {
      commandCount += 1;

      const targetPath = path.join(projectRoot, commandSpec.target || '');
      if (!fs.existsSync(targetPath)) {
        errors.push(`${agentId}.${commandId}: missing target ${path.relative(projectRoot, targetPath)}`);
      }

      for (const resource of commandSpec.resources || []) {
        const resourcePath = path.join(projectRoot, resource);
        if (!fs.existsSync(resourcePath)) {
          errors.push(`${agentId}.${commandId}: missing resource ${path.relative(projectRoot, resourcePath)}`);
        }
      }
    }
  }

  return {
    ok: errors.length === 0,
    errors,
    warnings: [],
    metrics: {
      agents: Object.keys(registry.agents || {}).length,
      commands: commandCount,
      registryPath: path.relative(projectRoot, registryPath),
    },
  };
}

function formatHumanReport(result) {
  if (result.ok) {
    return `OK Codex command registry validation passed (agents: ${result.metrics.agents}, commands: ${result.metrics.commands})`;
  }

  return [
    `X Codex command registry validation failed (${result.errors.length} issue(s))`,
    ...result.errors.map((error) => `- ${error}`),
  ].join('\n');
}

function main() {
  const args = parseArgs();
  const result = validateCodexCommandRegistry(args);

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
  loadRegistry,
  validateCodexCommandRegistry,
  formatHumanReport,
};
