#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');

const REQUIRED_COMMAND_COVERAGE = Object.freeze({
  'sinapse-orqx': ['onboard', 'route', 'plan', 'status', 'brief', 'resolve', 'council'],
  'sinapse-pm': [
    'create-prd',
    'create-brownfield-prd',
    'create-epic',
    'create-story',
    'research',
    'execute-epic',
    'gather-requirements',
    'write-spec',
    'shard-prd',
  ],
  'sinapse-po': [
    'validate-story',
    'validate-story-draft',
    'backlog-review',
    'backlog-prioritize',
    'backlog-schedule',
    'close-story',
    'sync-story',
    'pull-story',
    'stories-index',
  ],
  'sinapse-sm': ['draft', 'story-checklist'],
  'sinapse-dev': [
    'develop',
    'run-tests',
    'apply-qa-fixes',
    'execute-subtask',
    'verify-subtask',
    'build-autonomous',
    'build-resume',
    'build-status',
    'build',
  ],
  'sinapse-qa': [
    'review',
    'review-story',
    'code-review',
    'gate',
    'review-build',
    'create-fix-request',
    'test-design',
    'generate-tests',
    'run-tests',
    'nfr-assess',
    'validate-libraries',
    'security-check',
    'validate-migrations',
    'evidence-check',
    'false-positive-check',
    'console-check',
  ],
});

function parseArgs(argv = process.argv.slice(2)) {
  const args = new Set(argv);
  return {
    quiet: args.has('--quiet') || args.has('-q'),
    json: args.has('--json'),
  };
}

function normalizeAgentAlias(value) {
  return String(value || '').trim().replace(/^@/, '').toLowerCase();
}

function normalizeCommandAlias(value) {
  return String(value || '').trim().replace(/^\*/, '').toLowerCase();
}

function collectAgentAliases(agentId, agentSpec) {
  return [agentId, ...(agentSpec.aliases || [])]
    .map((alias) => normalizeAgentAlias(alias))
    .filter(Boolean);
}

function collectCommandAliases(commandId, commandSpec) {
  return [commandId, ...(commandSpec.aliases || [])]
    .map((alias) => normalizeCommandAlias(alias))
    .filter(Boolean);
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

function validateRequiredCoverage(registry, requiredCoverage, errors) {
  for (const [agentId, requiredCommands] of Object.entries(requiredCoverage || {})) {
    const agentSpec = (registry.agents || {})[agentId];
    if (!agentSpec) {
      errors.push(`missing required agent coverage: ${agentId}`);
      continue;
    }

    const availableCommands = new Set();
    for (const [commandId, commandSpec] of Object.entries(agentSpec.commands || {})) {
      for (const alias of collectCommandAliases(commandId, commandSpec)) {
        availableCommands.add(alias);
      }
    }

    for (const requiredCommand of requiredCommands) {
      if (!availableCommands.has(normalizeCommandAlias(requiredCommand))) {
        errors.push(`${agentId}: missing required command coverage for ${requiredCommand}`);
      }
    }
  }
}

function validateCodexCommandRegistry(options = {}) {
  const projectRoot = options.projectRoot || process.cwd();
  const { registryPath, registry, error } = loadRegistry(projectRoot);
  const errors = [];
  const requiredCoverage =
    options.requiredCoverage === false
      ? null
      : options.requiredCoverage || REQUIRED_COMMAND_COVERAGE;

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
  const seenAgentAliases = new Map();
  for (const [agentId, agentSpec] of Object.entries(registry.agents || {})) {
    const skillPath = path.join(projectRoot, '.codex', 'skills', agentSpec.skillId || agentId, 'SKILL.md');
    if (!fs.existsSync(skillPath)) {
      errors.push(`${agentId}: missing skill file ${path.relative(projectRoot, skillPath)}`);
    }

    const sourceOfTruth = path.join(projectRoot, agentSpec.sourceOfTruth || '');
    if (!fs.existsSync(sourceOfTruth)) {
      errors.push(`${agentId}: missing source of truth ${path.relative(projectRoot, sourceOfTruth)}`);
    }

    for (const alias of collectAgentAliases(agentId, agentSpec)) {
      const owner = seenAgentAliases.get(alias);
      if (owner && owner !== agentId) {
        errors.push(`duplicate agent alias "${alias}" claimed by ${owner} and ${agentId}`);
      } else {
        seenAgentAliases.set(alias, agentId);
      }
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

      for (const alias of collectCommandAliases(commandId, commandSpec)) {
        const owner = seenCommandAliases.get(alias);
        if (owner && owner !== commandId) {
          errors.push(`${agentId}: duplicate command alias "${alias}" claimed by ${owner} and ${commandId}`);
        } else {
          seenCommandAliases.set(alias, commandId);
        }
      }
    }
  }

  validateRequiredCoverage(registry, requiredCoverage, errors);

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
  normalizeAgentAlias,
  normalizeCommandAlias,
  collectAgentAliases,
  collectCommandAliases,
  validateRequiredCoverage,
  validateCodexCommandRegistry,
  formatHumanReport,
  REQUIRED_COMMAND_COVERAGE,
};
