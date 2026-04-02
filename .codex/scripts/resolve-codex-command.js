#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');

const PROJECT_ROOT = path.resolve(__dirname, '..', '..');
const REGISTRY_PATH = path.join(PROJECT_ROOT, '.codex', 'command-registry.json');

function loadCommandRegistry(projectRoot = PROJECT_ROOT) {
  const registryPath = path.join(projectRoot, '.codex', 'command-registry.json');
  const raw = fs.readFileSync(registryPath, 'utf8');
  return JSON.parse(raw);
}

function normalizeAgentInput(value) {
  return String(value || '').trim().replace(/^@/, '').toLowerCase();
}

function normalizeCommandInput(value) {
  return String(value || '').trim().replace(/^\*/, '').toLowerCase();
}

function resolveAgent(registry, agentInput) {
  const normalized = normalizeAgentInput(agentInput);

  for (const [agentId, agentSpec] of Object.entries(registry.agents || {})) {
    const aliases = [agentId, ...(agentSpec.aliases || [])]
      .map((alias) => normalizeAgentInput(alias));
    if (aliases.includes(normalized)) {
      return { agentId, agentSpec };
    }
  }

  return null;
}

function resolveCommand(agentSpec, commandInput) {
  const normalized = normalizeCommandInput(commandInput);

  for (const [commandId, commandSpec] of Object.entries(agentSpec.commands || {})) {
    const aliases = [commandId, ...(commandSpec.aliases || [])]
      .map((alias) => normalizeCommandInput(alias));
    if (aliases.includes(normalized)) {
      return { commandId, commandSpec };
    }
  }

  return null;
}

function resolveCodexCommand(agentInput, commandInput, projectRoot = PROJECT_ROOT) {
  const registry = loadCommandRegistry(projectRoot);
  const agent = resolveAgent(registry, agentInput);
  if (!agent) {
    throw new Error(`Unknown Codex agent "${agentInput}"`);
  }

  const command = resolveCommand(agent.agentSpec, commandInput);
  if (!command) {
    throw new Error(`Unknown Codex command "${commandInput}" for agent "${agent.agentId}"`);
  }

  return {
    agentId: agent.agentId,
    skillId: agent.agentSpec.skillId,
    commandId: command.commandId,
    kind: command.commandSpec.kind,
    target: command.commandSpec.target,
    resources: command.commandSpec.resources || [],
    sourceOfTruth: agent.agentSpec.sourceOfTruth,
  };
}

function parseArgs(argv = process.argv.slice(2)) {
  const args = argv.filter((arg) => !arg.startsWith('--'));
  const flags = new Set(argv.filter((arg) => arg.startsWith('--')));
  return {
    agent: args[0],
    command: args[1],
    json: flags.has('--json'),
  };
}

function formatHumanResult(result) {
  const lines = [
    `Agent: ${result.agentId}`,
    `Skill: ${result.skillId}`,
    `Command: ${result.commandId}`,
    `Kind: ${result.kind}`,
    `Target: ${result.target}`,
    `Source: ${result.sourceOfTruth}`,
  ];

  if (result.resources.length > 0) {
    lines.push('Resources:');
    lines.push(...result.resources.map((resource) => `- ${resource}`));
  }

  return lines.join('\n');
}

function main() {
  const args = parseArgs();
  if (!args.agent || !args.command) {
    console.error('Usage: node .codex/scripts/resolve-codex-command.js <agent> <command> [--json]');
    process.exit(1);
  }

  try {
    const result = resolveCodexCommand(args.agent, args.command);
    if (args.json) {
      console.log(JSON.stringify(result, null, 2));
    } else {
      console.log(formatHumanResult(result));
    }
  } catch (error) {
    console.error(error.message);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = {
  REGISTRY_PATH,
  loadCommandRegistry,
  normalizeAgentInput,
  normalizeCommandInput,
  resolveAgent,
  resolveCommand,
  resolveCodexCommand,
  parseArgs,
  formatHumanResult,
};
