#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');
const Ajv2020 = require('ajv/dist/2020');
const {
  buildHandoffPacket,
  loadDelegationMatrix,
} = require(path.join(__dirname, '..', '..', '..', '.codex', 'scripts', 'resolve-codex-delegation'));
const {
  loadRegistry: loadCommandRegistryFile,
} = require('./validate-codex-command-registry');

const REQUIRED_ORCHESTRATORS = Object.freeze([
  'sinapse-orqx',
  'brand-orqx',
  'commercial-orqx',
  'content-orqx',
  'copy-orqx',
  'animations-orqx',
  'design-orqx',
  'finance-orqx',
  'growth-orqx',
  'paidmedia-orqx',
  'product-orqx',
  'research-orqx',
  'claude-orqx',
  'council-orqx',
  'storytelling-orqx',
  'cyber-orqx',
  'cloning-orqx',
  'courses-orqx',
  'swarm-orqx',
]);

function parseArgs(argv = process.argv.slice(2)) {
  const args = new Set(argv);
  return {
    quiet: args.has('--quiet') || args.has('-q'),
    json: args.has('--json'),
  };
}

function validateCodexDelegation(options = {}) {
  const projectRoot = options.projectRoot || process.cwd();
  const errors = [];
  const warnings = [];
  const requiredOrchestrators =
    options.requiredOrchestrators === false
      ? null
      : options.requiredOrchestrators || REQUIRED_ORCHESTRATORS;

  let matrix;
  try {
    matrix = loadDelegationMatrix(projectRoot);
  } catch (error) {
    errors.push(`Unable to load Codex delegation matrix: ${error.message}`);
    return {
      ok: false,
      errors,
      warnings,
      metrics: { orchestrators: 0, routes: 0 },
    };
  }

  const matrixPath = path.join(projectRoot, '.codex', 'delegation-matrix.json');
  const schemaPath = path.join(projectRoot, matrix.handoffSchema || '.codex/handoff-packet.schema.json');
  if (!fs.existsSync(schemaPath)) {
    errors.push(`Missing handoff schema ${path.relative(projectRoot, schemaPath)}`);
  }

  let schema = null;
  if (fs.existsSync(schemaPath)) {
    try {
      schema = JSON.parse(fs.readFileSync(schemaPath, 'utf8'));
    } catch (error) {
      errors.push(`Unable to parse handoff schema: ${error.message}`);
    }
  }

  const { registry: commandRegistry, error: commandRegistryError } = loadCommandRegistryFile(projectRoot);
  if (commandRegistryError) {
    errors.push(commandRegistryError);
  }

  const orchestrators = matrix.orchestrators || {};
  const frameworkAgents = matrix.frameworkAgents || {};
  const routes = matrix.routes || {};

  if (requiredOrchestrators) {
    for (const orchestratorId of requiredOrchestrators) {
      if (!orchestrators[orchestratorId]) {
        errors.push(`missing required orchestrator coverage: ${orchestratorId}`);
      }
    }
  }

  for (const [orchestratorId, orchestratorSpec] of Object.entries(orchestrators)) {
    const sourceOfTruth = path.join(projectRoot, orchestratorSpec.sourceOfTruth || '');
    if (!fs.existsSync(sourceOfTruth)) {
      errors.push(`${orchestratorId}: missing source of truth ${path.relative(projectRoot, sourceOfTruth)}`);
    }

    if (orchestratorSpec.squadDir) {
      const squadDir = path.join(projectRoot, orchestratorSpec.squadDir);
      if (!fs.existsSync(squadDir)) {
        errors.push(`${orchestratorId}: missing squad dir ${path.relative(projectRoot, squadDir)}`);
      }
    }

    if (orchestratorSpec.tasksDir) {
      const tasksDir = path.join(projectRoot, orchestratorSpec.tasksDir);
      if (!fs.existsSync(tasksDir)) {
        errors.push(`${orchestratorId}: missing tasks dir ${path.relative(projectRoot, tasksDir)}`);
      }
    }

    for (const routeId of orchestratorSpec.approvedRoutes || []) {
      if (!routes[routeId]) {
        errors.push(`${orchestratorId}: missing approved route ${routeId}`);
      }
    }
  }

  const routeAliases = new Map();
  const ajv = schema ? new Ajv2020({ allErrors: true, strict: false }) : null;
  const validatePacket = schema ? ajv.compile(schema) : null;
  let routeCount = 0;
  let validatorBackedCount = 0;
  let shimCount = 0;
  let exploratoryCount = 0;

  for (const [routeId, routeSpec] of Object.entries(routes)) {
    routeCount += 1;
    if (routeSpec.classification === 'validator-backed') validatorBackedCount += 1;
    if (routeSpec.classification === 'codex-only-shim') shimCount += 1;
    if (routeSpec.classification === 'exploratory') exploratoryCount += 1;

    if (!orchestrators[routeSpec.owner]) {
      errors.push(`${routeId}: unknown route owner ${routeSpec.owner}`);
    }

    if (!(matrix.routingClasses || []).includes(routeSpec.classification)) {
      errors.push(`${routeId}: invalid classification ${routeSpec.classification}`);
    }

    if (!(matrix.requestTypes || []).includes(routeSpec.requestType)) {
      errors.push(`${routeId}: invalid request type ${routeSpec.requestType}`);
    }

    for (const alias of [routeId, ...(routeSpec.aliases || [])]) {
      const normalized = String(alias || '').trim().toLowerCase();
      const owner = routeAliases.get(normalized);
      if (owner && owner !== routeId) {
        errors.push(`duplicate delegation route alias "${normalized}" claimed by ${owner} and ${routeId}`);
      } else {
        routeAliases.set(normalized, routeId);
      }
    }

    for (const resource of routeSpec.resources || []) {
      const resourcePath = path.join(projectRoot, resource);
      if (!fs.existsSync(resourcePath)) {
        errors.push(`${routeId}: missing resource ${path.relative(projectRoot, resourcePath)}`);
      }
    }

    if (!Array.isArray(routeSpec.delegationChain) || routeSpec.delegationChain.length === 0) {
      errors.push(`${routeId}: missing delegation chain`);
      continue;
    }

    if (routeSpec.delegationChain[0].from !== routeSpec.owner) {
      errors.push(`${routeId}: first delegation step must start from the route owner`);
    }

    for (const [index, step] of routeSpec.delegationChain.entries()) {
      const stepLabel = `${routeId}.step${index + 1}`;

      if (step.fromType === 'orqx' && !orchestrators[step.from]) {
        errors.push(`${stepLabel}: unknown from orchestrator ${step.from}`);
      }
      if (step.fromType === 'framework-agent' && !frameworkAgents[step.from]) {
        errors.push(`${stepLabel}: unknown from framework agent ${step.from}`);
      }

      if (step.toType === 'orqx') {
        if (!orchestrators[step.to]) {
          errors.push(`${stepLabel}: unknown target orchestrator ${step.to}`);
        }
      } else if (step.toType === 'framework-agent') {
        if (!frameworkAgents[step.to]) {
          errors.push(`${stepLabel}: unknown target framework agent ${step.to}`);
        }
        if (step.resolver !== 'command-registry') {
          errors.push(`${stepLabel}: framework-agent steps must use resolver "command-registry"`);
        }
        const registryAgent = commandRegistry?.agents?.[frameworkAgents[step.to]?.registryAgentId || step.to];
        if (!registryAgent) {
          errors.push(`${stepLabel}: missing command registry entry for ${step.to}`);
        } else if (!registryAgent.commands?.[step.command]) {
          errors.push(`${stepLabel}: missing command registry command ${step.to}.${step.command}`);
        }
      } else if (step.toType === 'specialist') {
        const specialistPath = step.path
          ? path.join(projectRoot, step.path)
          : path.join(projectRoot, '.codex', 'agents', `${step.to}.md`);
        if (!fs.existsSync(specialistPath)) {
          errors.push(`${stepLabel}: missing specialist path ${path.relative(projectRoot, specialistPath)}`);
        }
      }

      if (step.path) {
        const stepPath = path.join(projectRoot, step.path);
        if (!fs.existsSync(stepPath)) {
          errors.push(`${stepLabel}: missing path ${path.relative(projectRoot, stepPath)}`);
        }
      }

      if (step.task) {
        const taskPath = path.join(projectRoot, step.task);
        if (!fs.existsSync(taskPath)) {
          errors.push(`${stepLabel}: missing task ${path.relative(projectRoot, taskPath)}`);
        }
      }
    }

    if (validatePacket) {
      const packet = buildHandoffPacket(routeId, projectRoot, matrix);
      const valid = validatePacket(packet);
      if (!valid) {
        errors.push(
          `${routeId}: handoff packet failed schema validation ${ajv.errorsText(validatePacket.errors, { separator: '; ' })}`,
        );
      }
    }
  }

  return {
    ok: errors.length === 0,
    errors,
    warnings,
    metrics: {
      matrixPath: path.relative(projectRoot, matrixPath),
      orchestrators: Object.keys(orchestrators).length,
      routes: routeCount,
      validatorBackedRoutes: validatorBackedCount,
      codexOnlyShimRoutes: shimCount,
      exploratoryRoutes: exploratoryCount,
    },
  };
}

function formatHumanReport(result) {
  if (result.ok) {
    return `OK Codex delegation validation passed (orchestrators: ${result.metrics.orchestrators}, routes: ${result.metrics.routes})`;
  }

  return [
    `X Codex delegation validation failed (${result.errors.length} issue(s))`,
    ...result.errors.map((error) => `- ${error}`),
  ].join('\n');
}

function main() {
  const args = parseArgs();
  const result = validateCodexDelegation(args);

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
  validateCodexDelegation,
  formatHumanReport,
  REQUIRED_ORCHESTRATORS,
};
