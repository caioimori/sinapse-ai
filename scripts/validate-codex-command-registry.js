#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');

const legacy = require('../.sinapse-ai/infrastructure/scripts/validate-codex-command-registry');

function validateCodexCommandRegistry(options = {}) {
  const projectRoot = options.projectRoot || process.cwd();
  const { registryPath, registry, error } = legacy.loadRegistry(projectRoot);
  const errors = [];
  const requiredCoverage = options.requiredCoverage === false
    ? null
    : options.requiredCoverage || legacy.REQUIRED_COMMAND_COVERAGE;

  if (error) return { ok: false, errors: [error], warnings: [], metrics: { agents: 0, commands: 0 } };

  let commandCount = 0;
  const seenAgentAliases = new Map();
  for (const [agentId, agentSpec] of Object.entries(registry.agents || {})) {
    const skillPath = path.join(projectRoot, '.agents', 'skills', agentSpec.skillId || agentId, 'SKILL.md');
    if (!fs.existsSync(skillPath)) {
      errors.push(`${agentId}: missing skill file ${path.relative(projectRoot, skillPath)}`);
    }

    const sourceOfTruth = path.join(projectRoot, agentSpec.sourceOfTruth || '');
    if (!fs.existsSync(sourceOfTruth)) {
      errors.push(`${agentId}: missing source of truth ${path.relative(projectRoot, sourceOfTruth)}`);
    }

    for (const alias of legacy.collectAgentAliases(agentId, agentSpec)) {
      const owner = seenAgentAliases.get(alias);
      if (owner && owner !== agentId) errors.push(`duplicate agent alias "${alias}" claimed by ${owner} and ${agentId}`);
      else seenAgentAliases.set(alias, agentId);
    }

    const seenCommandAliases = new Map();
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
      for (const alias of legacy.collectCommandAliases(commandId, commandSpec)) {
        const owner = seenCommandAliases.get(alias);
        if (owner && owner !== commandId) errors.push(`duplicate command alias "${alias}" claimed by ${owner} and ${commandId}`);
        else seenCommandAliases.set(alias, commandId);
      }
    }
  }

  legacy.validateRequiredCoverage(registry, requiredCoverage, errors);
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

function main() {
  const args = legacy.parseArgs();
  const result = validateCodexCommandRegistry(args);
  if (!args.quiet) {
    console.log(args.json ? JSON.stringify(result, null, 2) : legacy.formatHumanReport(result));
  }
  if (!result.ok) process.exitCode = 1;
}

if (require.main === module) main();

module.exports = {
  ...legacy,
  validateCodexCommandRegistry,
};
