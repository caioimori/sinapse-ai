#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');

const {
  buildEcosystemStats,
} = require('./resolve-codex-agent');
const {
  loadCommandRegistry,
  resolveCodexAgentEntry,
  resolveCodexCommand,
} = require('./resolve-codex-command');
const {
  resolveCodexWorkflow,
} = require('./resolve-codex-workflow');

const DISTRIBUTION_ROOT = path.resolve(__dirname, '..', '..');

function isSinapseProject(candidate) {
  return relativeFileExists(candidate, '.codex/catalog.json') &&
    relativeFileExists(candidate, '.sinapse-ai/constitution.md');
}

function detectProjectRoot(cwd = process.cwd()) {
  let current = path.resolve(cwd);
  while (true) {
    if (isSinapseProject(current)) return current;
    const parent = path.dirname(current);
    if (parent === current) break;
    current = parent;
  }
  return DISTRIBUTION_ROOT;
}

const PROJECT_ROOT = detectProjectRoot();
const LOOP_MAX_ITERATIONS = 3;
const LOOP_STATE_PATH = '.sinapse/workflow-state/codex-loop.json';
const WORKFLOW_SKILLS = Object.freeze([
  'sinapse-orqx',
  'sinapse-spec-driven',
  'sinapse-loop',
]);

function relativeFileExists(projectRoot, relativePath) {
  try {
    return fs.statSync(path.join(projectRoot, relativePath)).isFile();
  } catch {
    return false;
  }
}

function loadJson(projectRoot, relativePath) {
  return JSON.parse(fs.readFileSync(path.join(projectRoot, relativePath), 'utf8'));
}

function countRegistryCommands(registry) {
  return Object.values(registry.agents || {}).reduce(
    (total, agent) => total + Object.keys(agent.commands || {}).length,
    0,
  );
}

function countAgentSurfaces(projectRoot) {
  const agentsDir = path.join(projectRoot, '.codex', 'agents');
  const entries = fs.readdirSync(agentsDir);
  return {
    markdown: entries.filter((entry) => entry.endsWith('.md')).length,
    toml: entries.filter((entry) => entry.endsWith('.toml')).length,
  };
}

function buildDoctorReport(projectRoot = PROJECT_ROOT) {
  const registry = loadCommandRegistry(projectRoot);
  const delegationMatrix = loadJson(projectRoot, '.codex/delegation-matrix.json');
  const delegationParity = loadJson(projectRoot, '.codex/delegation-parity.json');
  const agentSurfaces = countAgentSurfaces(projectRoot);
  const skills = WORKFLOW_SKILLS.map((skillId) => ({
    skillId,
    native: relativeFileExists(
      projectRoot,
      `.agents/skills/${skillId}/SKILL.md`,
    ),
    legacy: relativeFileExists(
      projectRoot,
      `.codex/skills/${skillId}/SKILL.md`,
    ),
  }));
  const delegationEquivalent =
    JSON.stringify(delegationMatrix) === JSON.stringify(delegationParity);

  const checks = {
    commandRegistry: true,
    codexConfig: relativeFileExists(projectRoot, '.codex/config.toml'),
    codexHooks: relativeFileExists(projectRoot, '.codex/hooks.json'),
    delegationEquivalent,
    nativeAgentParity: agentSurfaces.markdown === agentSurfaces.toml,
    nativeWorkflowSkills: skills.every((skill) => skill.native),
    legacyWorkflowSkills: skills.every((skill) => skill.legacy),
    workflowResolver: relativeFileExists(
      projectRoot,
      '.codex/scripts/resolve-codex-workflow.js',
    ),
  };

  return {
    ok: Object.values(checks).every(Boolean),
    runtime: 'native-session-preparation',
    preparationOnly: true,
    checks,
    metrics: {
      ecosystem: buildEcosystemStats(projectRoot),
      agentSurfaces,
      registryAgents: Object.keys(registry.agents || {}).length,
      registryCommands: countRegistryCommands(registry),
      workflowSkills: skills.length,
    },
    skills,
  };
}

function inactiveLoopStatus() {
  return {
    optIn: true,
    active: false,
    currentIteration: 0,
    maxIterations: LOOP_MAX_ITERATIONS,
    completionCriterionRequired: true,
    statePath: LOOP_STATE_PATH,
  };
}

function loopStateFile(projectRoot = PROJECT_ROOT) {
  return path.join(projectRoot, LOOP_STATE_PATH);
}

function buildLoopStatus(projectRoot = null) {
  if (!projectRoot || !fs.existsSync(loopStateFile(projectRoot))) return inactiveLoopStatus();
  const state = JSON.parse(fs.readFileSync(loopStateFile(projectRoot), 'utf8'));
  return { ...inactiveLoopStatus(), ...state };
}

function persistLoopState(projectRoot, state) {
  const stateFile = loopStateFile(projectRoot);
  fs.mkdirSync(path.dirname(stateFile), { recursive: true });
  fs.writeFileSync(stateFile, `${JSON.stringify(state, null, 2)}\n`, 'utf8');
  return state;
}

function prepareLoop(completionCriterion, options = {}) {
  const criterion = String(completionCriterion || '').trim();
  if (!criterion) {
    throw new Error('Loop preparation requires a completion criterion');
  }

  const state = {
    ...inactiveLoopStatus(),
    active: true,
    completionCriterion: criterion,
    startedAt: new Date().toISOString(),
    phases: ['inspect', 'delegate', 'verify'],
    stopConditions: [
      'completion-criterion-met',
      'max-iterations-reached',
      'blocked',
      'user-stop',
    ],
  };
  return options.persist
    ? persistLoopState(options.projectRoot || PROJECT_ROOT, state)
    : state;
}

function advanceLoop(projectRoot = PROJECT_ROOT, outcome = 'continue') {
  const normalizedOutcome = String(outcome || '').trim().toLowerCase();
  if (!['continue', 'complete', 'blocked', 'user-stop'].includes(normalizedOutcome)) {
    throw new Error(`Unknown loop outcome "${outcome}"`);
  }
  const current = buildLoopStatus(projectRoot);
  if (!current.active || !current.completionCriterion) {
    throw new Error('No active SINAPSE loop; run loop prepare first');
  }

  const currentIteration = Number(current.currentIteration || 0) + 1;
  const reachedLimit = currentIteration >= LOOP_MAX_ITERATIONS;
  const stopReason = normalizedOutcome === 'complete'
    ? 'completion-criterion-met'
    : normalizedOutcome === 'blocked'
      ? 'blocked'
      : normalizedOutcome === 'user-stop'
        ? 'user-stop'
        : reachedLimit
          ? 'max-iterations-reached'
          : null;
  const next = {
    ...current,
    active: !stopReason,
    currentIteration,
    lastOutcome: normalizedOutcome,
    stopReason,
    updatedAt: new Date().toISOString(),
  };
  return persistLoopState(projectRoot, next);
}

function parseArgs(argv = process.argv.slice(2)) {
  const positional = [];
  const options = {};

  for (let index = 0; index < argv.length; index += 1) {
    const argument = argv[index];
    if (argument === '--complexity') {
      options.complexity = argv[index + 1];
      index += 1;
    } else if (argument.startsWith('--complexity=')) {
      options.complexity = argument.slice('--complexity='.length);
    } else if (argument === '--criterion') {
      options.criterion = argv[index + 1];
      index += 1;
    } else if (argument.startsWith('--criterion=')) {
      options.criterion = argument.slice('--criterion='.length);
    } else if (argument === '--outcome') {
      options.outcome = argv[index + 1];
      index += 1;
    } else if (argument.startsWith('--outcome=')) {
      options.outcome = argument.slice('--outcome='.length);
    } else if (!argument.startsWith('--')) {
      positional.push(argument);
    }
  }

  return { positional, options };
}

function resolveRequest(argv = process.argv.slice(2), projectRoot = PROJECT_ROOT) {
  const { positional, options } = parseArgs(argv);
  const [operation, first, second] = positional;

  switch (operation) {
    case 'doctor':
      return buildDoctorReport(projectRoot);
    case 'agent':
      if (!first) throw new Error('Agent id is required');
      return resolveCodexAgentEntry(first, projectRoot);
    case 'command':
      if (!first || !second) {
        throw new Error('Agent id and command are required');
      }
      return resolveCodexCommand(first, second, projectRoot);
    case 'workflow':
      if (!first) throw new Error('Workflow name is required');
      return resolveCodexWorkflow(first, {
        complexity: options.complexity,
        projectRoot,
        subject: second,
      });
    case 'spec':
    case 'plan':
    case 'orchestrate':
      return resolveCodexWorkflow(operation, {
        complexity: options.complexity,
        projectRoot,
        subject: first,
      });
    case 'loop':
      if (!first || first === 'status') return buildLoopStatus(projectRoot);
      if (first === 'prepare') {
        return prepareLoop(options.criterion, { persist: true, projectRoot });
      }
      if (first === 'advance') return advanceLoop(projectRoot, options.outcome);
      throw new Error(`Unknown loop operation "${first}"`);
    default:
      throw new Error(
        'Usage: sinapse-codex <doctor|agent|command|workflow|spec|plan|orchestrate|loop> [...args]',
      );
  }
}

function main() {
  try {
    console.log(JSON.stringify(resolveRequest(), null, 2));
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  }
}

if (require.main === module) {
  main();
}

module.exports = {
  PROJECT_ROOT,
  DISTRIBUTION_ROOT,
  LOOP_MAX_ITERATIONS,
  LOOP_STATE_PATH,
  WORKFLOW_SKILLS,
  isSinapseProject,
  detectProjectRoot,
  countRegistryCommands,
  countAgentSurfaces,
  buildDoctorReport,
  buildLoopStatus,
  prepareLoop,
  advanceLoop,
  parseArgs,
  resolveRequest,
};
