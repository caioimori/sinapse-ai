#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');

const {
  resolveCodexAgent,
  resolveCodexAgentCommand,
} = require('./resolve-codex-agent');

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
  const matches = [];

  for (const [agentId, agentSpec] of Object.entries(registry.agents || {})) {
    const aliases = [agentId, ...(agentSpec.aliases || [])]
      .map((alias) => normalizeAgentInput(alias));
    if (aliases.includes(normalized)) {
      matches.push({ agentId, agentSpec });
    }
  }

  if (matches.length > 1) {
    throw new Error(`Ambiguous Codex agent "${agentInput}"`);
  }

  return matches[0] || null;
}

function resolveCommand(agentSpec, commandInput) {
  const normalized = normalizeCommandInput(commandInput);
  const matches = [];

  for (const [commandId, commandSpec] of Object.entries(agentSpec.commands || {})) {
    const aliases = [commandId, ...(commandSpec.aliases || [])]
      .map((alias) => normalizeCommandInput(alias));
    if (aliases.includes(normalized)) {
      matches.push({ commandId, commandSpec });
    }
  }

  if (matches.length > 1) {
    throw new Error(`Ambiguous Codex command "${commandInput}"`);
  }

  return matches[0] || null;
}

function resolveCodexCommand(agentInput, commandInput, projectRoot = PROJECT_ROOT) {
  const registry = loadCommandRegistry(projectRoot);
  const agent = resolveAgent(registry, agentInput);

  // Tier 1 — curated registry (the SDC core agents with explicit command maps).
  if (agent) {
    const command = resolveCommand(agent.agentSpec, commandInput);
    if (command) {
      return {
        agentId: agent.agentId,
        skillId: agent.agentSpec.skillId,
        commandId: command.commandId,
        kind: command.commandSpec.kind,
        target: command.commandSpec.target,
        resources: command.commandSpec.resources || [],
        sourceOfTruth: agent.agentSpec.sourceOfTruth,
        resolvedBy: 'registry',
      };
    }
    // Agent is in the registry but the command isn't — fall through to the
    // parametric activator (the agent may own squad/dev tasks beyond its
    // curated commands).
  }

  // Tier 2 — parametric activator: resolves ANY of the ~172 agents and the
  // tasks they actually own from source, with on-disk pointer verification.
  try {
    const parametric = resolveCodexAgentCommand(agentInput, commandInput, projectRoot);
    return {
      agentId: parametric.agentId,
      skillId: null,
      squad: parametric.squad,
      commandId: parametric.commandId,
      kind: parametric.kind,
      target: parametric.target,
      resources: [],
      sourceOfTruth: parametric.sourceOfTruth,
      resolvedBy: 'activator',
    };
  } catch (err) {
    // If the agent existed in the curated registry but neither tier knew the
    // command, report a command error (not an agent error).
    if (agent && /Unknown Codex agent/.test(err.message)) {
      throw new Error(
        `Unknown Codex command "${commandInput}" for agent "${agent.agentId}"`,
      );
    }
    throw err;
  }
}

/**
 * Resolve an agent (without a specific command) across BOTH tiers. Returns the
 * curated registry entry when present, otherwise the parametric activator view.
 * Guarantees every one of the ~172 agents resolves — never "Unknown Codex agent".
 */
function resolveCodexAgentEntry(agentInput, projectRoot = PROJECT_ROOT) {
  const registry = loadCommandRegistry(projectRoot);
  const agent = resolveAgent(registry, agentInput);
  if (agent) {
    return {
      agentId: agent.agentId,
      skillId: agent.agentSpec.skillId,
      sourceOfTruth: agent.agentSpec.sourceOfTruth,
      commands: Object.keys(agent.agentSpec.commands || {}),
      resolvedBy: 'registry',
    };
  }
  const parametric = resolveCodexAgent(agentInput, projectRoot);
  return {
    agentId: parametric.agentId,
    skillId: null,
    squad: parametric.squad,
    sourceOfTruth: parametric.sourceOfTruth,
    taskCount: parametric.taskCount,
    commands: parametric.tasks.map((t) => t.command),
    resolvedBy: 'activator',
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
  resolveCodexAgentEntry,
  parseArgs,
  formatHumanResult,
};
