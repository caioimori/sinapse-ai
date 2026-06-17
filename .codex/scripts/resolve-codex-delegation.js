#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');

const PROJECT_ROOT = path.resolve(__dirname, '..', '..');
const MATRIX_PATH = path.join('.codex', 'delegation-matrix.json');

function loadDelegationMatrix(projectRoot = PROJECT_ROOT) {
  const matrixPath = path.join(projectRoot, MATRIX_PATH);
  const raw = fs.readFileSync(matrixPath, 'utf8');
  return JSON.parse(raw);
}

function normalizeRouteInput(value) {
  return String(value || '')
    .trim()
    .replace(/^[@*]/, '')
    .toLowerCase();
}

function normalizeActorInput(value) {
  return String(value || '')
    .trim()
    .replace(/^@/, '')
    .toLowerCase();
}

function collectRouteAliases(routeId, routeSpec) {
  return [routeId, ...(routeSpec.aliases || [])]
    .map((alias) => normalizeRouteInput(alias))
    .filter(Boolean);
}

function resolveDelegationRoute(routeInput, projectRoot = PROJECT_ROOT, matrix = loadDelegationMatrix(projectRoot)) {
  const normalized = normalizeRouteInput(routeInput);
  const matches = Object.entries(matrix.routes || {}).filter(([routeId, routeSpec]) =>
    collectRouteAliases(routeId, routeSpec).includes(normalized),
  );

  if (matches.length > 1) {
    throw new Error(`Ambiguous Codex delegation route "${routeInput}"`);
  }

  if (matches.length === 0) {
    throw new Error(`Unknown Codex delegation route "${routeInput}"`);
  }

  const [routeId, routeSpec] = matches[0];
  return { routeId, routeSpec };
}

function resolveRouteRecord(routeInput, projectRoot = PROJECT_ROOT, matrix = loadDelegationMatrix(projectRoot)) {
  if (
    routeInput &&
    typeof routeInput === 'object' &&
    typeof routeInput.routeId === 'string' &&
    routeInput.routeSpec &&
    typeof routeInput.routeSpec === 'object'
  ) {
    return routeInput;
  }

  return resolveDelegationRoute(routeInput, projectRoot, matrix);
}

function routeMentionsSource(routeSpec, sourceInput) {
  const normalizedSource = normalizeActorInput(sourceInput);
  if (!normalizedSource) {
    return true;
  }

  if (normalizeActorInput(routeSpec.owner) === normalizedSource) {
    return true;
  }

  return (routeSpec.delegationChain || []).some(
    (step) =>
      normalizeActorInput(step.from) === normalizedSource ||
      normalizeActorInput(step.to) === normalizedSource,
  );
}

function buildHandoffPacket(routeInput, projectRoot = PROJECT_ROOT, matrix = loadDelegationMatrix(projectRoot)) {
  const { routeId, routeSpec } = resolveRouteRecord(routeInput, projectRoot, matrix);
  const chain = routeSpec.delegationChain || [];
  // The next handoff is the immediate next actor the owner hands the work to,
  // i.e. the target of the first delegation step.
  const nextStep = chain[0] || null;

  return {
    routeId,
    mission: routeSpec.mission,
    phase: matrix.phase || 'W5 / Delegation Matrix Parity',
    owner: routeSpec.owner,
    classification: routeSpec.classification,
    summary: routeSpec.summary || '',
    inputs: routeSpec.inputs || [],
    outputs: routeSpec.outputs || [],
    validators: routeSpec.validators || [],
    sharedSurfaceRisk: routeSpec.sharedSurfaceRisk || 'low',
    nextHandoff: {
      to: nextStep?.to || routeSpec.owner,
      artifact: routeSpec.outputs?.[0] || 'handoff-packet',
    },
    delegationChain: chain,
    resources: routeSpec.resources || [],
    notes: routeSpec.notes || [],
  };
}

function resolveCodexDelegation(routeInput, projectRoot = PROJECT_ROOT, options = {}) {
  const matrix = options.matrix || loadDelegationMatrix(projectRoot);
  const { routeId, routeSpec } = resolveDelegationRoute(routeInput, projectRoot, matrix);

  if (options.source && !routeMentionsSource(routeSpec, options.source)) {
    throw new Error(
      `Codex delegation route "${routeId}" is not available from source "${options.source}"`,
    );
  }

  return {
    routeId,
    owner: routeSpec.owner,
    requestType: routeSpec.requestType,
    classification: routeSpec.classification,
    mission: routeSpec.mission,
    summary: routeSpec.summary || '',
    inputs: routeSpec.inputs || [],
    outputs: routeSpec.outputs || [],
    validators: routeSpec.validators || [],
    sharedSurfaceRisk: routeSpec.sharedSurfaceRisk || 'low',
    resources: routeSpec.resources || [],
    delegationChain: routeSpec.delegationChain || [],
    handoffPacket: buildHandoffPacket({ routeId, routeSpec }, projectRoot, matrix),
  };
}

function parseArgs(argv = process.argv.slice(2)) {
  const flags = new Set(argv.filter((arg) => arg.startsWith('--')));
  const args = argv.filter((arg) => !arg.startsWith('--'));

  return {
    // Route is always the last positional. An optional leading positional is a
    // source-agent filter, kept for backward compatibility with the legacy
    // `<source> <route>` CLI shape.
    source: args.length > 1 ? args[0] : null,
    route: args.length > 1 ? args[1] : args[0],
    json: flags.has('--json'),
    packet: flags.has('--packet'),
  };
}

function formatHumanResult(result) {
  const nextHandoff = result.handoffPacket?.nextHandoff?.to || 'n/a';
  const delegationPath = (result.delegationChain || [])
    .map((step) => `${step.from} -> ${step.to}`)
    .join(' | ');

  return [
    `Route: ${result.routeId}`,
    `Owner: ${result.owner}`,
    `Request Type: ${result.requestType}`,
    `Classification: ${result.classification}`,
    `Next Handoff: ${nextHandoff}`,
    `Delegation Chain: ${delegationPath || 'n/a'}`,
  ].join('\n');
}

function main() {
  const args = parseArgs();
  if (!args.route) {
    console.error(
      'Usage: node .codex/scripts/resolve-codex-delegation.js <route> [--json] [--packet]\n' +
        '   or: node .codex/scripts/resolve-codex-delegation.js <source-agent> <route> [--json] [--packet]',
    );
    process.exit(1);
  }

  try {
    const result = resolveCodexDelegation(args.route, PROJECT_ROOT, {
      source: args.source,
    });
    const payload = args.packet ? result.handoffPacket : result;

    if (args.json || args.packet) {
      console.log(JSON.stringify(payload, null, 2));
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
  MATRIX_PATH,
  loadDelegationMatrix,
  normalizeRouteInput,
  normalizeActorInput,
  collectRouteAliases,
  resolveDelegationRoute,
  resolveRouteRecord,
  routeMentionsSource,
  buildHandoffPacket,
  resolveCodexDelegation,
  parseArgs,
  formatHumanResult,
};
