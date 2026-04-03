#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');

const PROJECT_ROOT = path.resolve(__dirname, '..', '..');

function loadDelegationMatrix(projectRoot = PROJECT_ROOT) {
  const matrixPath = path.join(projectRoot, '.codex', 'delegation-matrix.json');
  const raw = fs.readFileSync(matrixPath, 'utf8');
  return JSON.parse(raw);
}

function normalizeAgentInput(value) {
  return String(value || '').trim().replace(/^@/, '').toLowerCase();
}

function normalizeRouteInput(value) {
  return String(value || '').trim().replace(/^\*/, '').toLowerCase();
}

function collectAliases(routeId, routeSpec) {
  return [routeId, ...(routeSpec.aliases || [])]
    .map((alias) => normalizeRouteInput(alias))
    .filter(Boolean);
}

function getSourceAgentConfig(matrix, agentInput) {
  const normalized = normalizeAgentInput(agentInput);

  if (['sinapse-orqx', 'imperator'].includes(normalized)) {
    return {
      sourceAgent: 'sinapse-orqx',
      routes: {
        ...(matrix.masterRoutes || {}),
        ...(matrix.orqxRoutes || {}),
      },
    };
  }

  const matches = Object.entries(matrix.specialistRoutes || {})
    .filter(([sourceAgentId, sourceSpec]) => {
      const aliases = [sourceAgentId, ...(sourceSpec.aliases || [])]
        .map((alias) => normalizeAgentInput(alias))
        .filter(Boolean);
      return aliases.includes(normalized);
    });

  if (matches.length > 1) {
    throw new Error(`Ambiguous Codex delegation source "${agentInput}"`);
  }

  if (matches.length === 1) {
    return {
      sourceAgent: matches[0][0],
      routes: matches[0][1].routes || {},
    };
  }

  return null;
}

function resolveRoute(routes, routeInput) {
  const normalized = normalizeRouteInput(routeInput);
  const matches = Object.entries(routes || {})
    .filter(([routeId, routeSpec]) => collectAliases(routeId, routeSpec).includes(normalized));

  if (matches.length > 1) {
    throw new Error(`Ambiguous Codex delegation route "${routeInput}"`);
  }

  if (matches.length === 0) {
    return null;
  }

  return {
    routeId: matches[0][0],
    routeSpec: matches[0][1],
  };
}

function resolveCodexDelegation(agentInput, routeInput, projectRoot = PROJECT_ROOT) {
  const matrix = loadDelegationMatrix(projectRoot);
  const source = getSourceAgentConfig(matrix, agentInput);
  if (!source) {
    throw new Error(`Unknown Codex delegation source "${agentInput}"`);
  }

  const route = resolveRoute(source.routes, routeInput);
  if (!route) {
    throw new Error(`Unknown Codex delegation route "${routeInput}" for source "${source.sourceAgent}"`);
  }

  return {
    sourceAgent: source.sourceAgent,
    routeId: route.routeId,
    classification: route.routeSpec.classification,
    target: route.routeSpec.target,
    handoff: route.routeSpec.handoff || null,
    sourceDocs: route.routeSpec.sourceDocs || [],
    handoffSchemaPath: matrix.handoffSchemaPath,
    handoffTemplatePath: matrix.handoffTemplatePath,
  };
}

function parseArgs(argv = process.argv.slice(2)) {
  const args = argv.filter((arg) => !arg.startsWith('--'));
  const flags = new Set(argv.filter((arg) => arg.startsWith('--')));
  return {
    agent: args[0],
    route: args[1],
    json: flags.has('--json'),
  };
}

function formatHumanResult(result) {
  const lines = [
    `Source: ${result.sourceAgent}`,
    `Route: ${result.routeId}`,
    `Classification: ${result.classification}`,
    `Target Type: ${result.target.type}`,
    `Target Agent: ${result.target.agentId}`,
  ];

  if (result.target.commandId) {
    lines.push(`Target Command: ${result.target.commandId}`);
  }
  if (result.target.docPath) {
    lines.push(`Target Doc: ${result.target.docPath}`);
  }
  if (result.target.taskPath) {
    lines.push(`Target Task: ${result.target.taskPath}`);
  }
  if (result.handoff) {
    lines.push(`Next Handoff: ${result.handoff.nextHandoff}`);
  }

  return lines.join('\n');
}

function main() {
  const args = parseArgs();
  if (!args.agent || !args.route) {
    console.error('Usage: node .codex/scripts/resolve-codex-delegation.js <source-agent> <route> [--json]');
    process.exit(1);
  }

  try {
    const result = resolveCodexDelegation(args.agent, args.route);
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
  loadDelegationMatrix,
  normalizeAgentInput,
  normalizeRouteInput,
  collectAliases,
  getSourceAgentConfig,
  resolveRoute,
  resolveCodexDelegation,
  parseArgs,
  formatHumanResult,
};
