#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');

const PROJECT_ROOT = path.resolve(__dirname, '..', '..');
const SPEC_WORKFLOW_PATH = '.sinapse-ai/development/workflows/spec-pipeline.yaml';
const TASKS_DIR = '.sinapse-ai/development/tasks';
const DELEGATION_MATRIX_PATH = '.codex/delegation-matrix.json';

const WORKFLOW_ALIASES = Object.freeze({
  spec: 'spec',
  'create-spec': 'spec',
  'spec-pipeline': 'plan',
  plan: 'plan',
  orchestrate: 'orchestrate',
});

const PHASE_ALIASES = Object.freeze({
  critique_1: 'critique',
});

const PHASE_TASK_FALLBACKS = Object.freeze({
  revise: 'spec-write-spec.md',
});

const PHASE_COMMANDS = Object.freeze({
  gather: { agent: 'sinapse-pm', command: 'gather-requirements' },
  assess: { agent: 'sinapse-architect', command: 'assess-complexity' },
  research: { agent: 'sinapse-analyst', command: 'research-deps' },
  spec: { agent: 'sinapse-pm', command: 'write-spec' },
  clarify: { agent: 'sinapse-pm', command: 'clarify-spec' },
  critique: { agent: 'sinapse-qa', command: 'critique-spec' },
  critique_1: { agent: 'sinapse-qa', command: 'critique-spec' },
  revise: { agent: 'sinapse-pm', command: 'write-spec' },
  critique_2: { agent: 'sinapse-qa', command: 'critique-spec' },
  plan: { agent: 'sinapse-architect', command: 'create-plan' },
  analyze: { agent: 'sinapse-qa', command: 'analyze-spec' },
});

function projectFile(projectRoot, relativePath) {
  const root = path.resolve(projectRoot);
  const absolute = path.resolve(root, relativePath);
  if (absolute !== root && !absolute.startsWith(`${root}${path.sep}`)) {
    throw new Error(`Path escapes project root: ${relativePath}`);
  }
  if (!fs.existsSync(absolute) || !fs.statSync(absolute).isFile()) {
    throw new Error(`Missing workflow dependency: ${relativePath}`);
  }
  return absolute;
}

function loadYamlFile(projectRoot, relativePath) {
  const raw = fs.readFileSync(projectFile(projectRoot, relativePath), 'utf8');
  return yaml.load(raw);
}

function extractAutoClaudeContract(taskPath) {
  const raw = fs.readFileSync(taskPath, 'utf8');
  const fencedYaml = /```ya?ml\s*([\s\S]*?)```/gi;
  let match;

  while ((match = fencedYaml.exec(raw)) !== null) {
    try {
      const document = yaml.load(match[1]);
      if (document && document.autoClaude) {
        return document.autoClaude;
      }
    } catch {
      // Keep looking: task files may contain unrelated illustrative YAML blocks.
    }
  }

  return null;
}

function normalizeWorkflowName(value) {
  const normalized = String(value || '').trim().toLowerCase();
  const workflowName = WORKFLOW_ALIASES[normalized];
  if (!workflowName) {
    throw new Error(`Unknown Codex workflow "${value}"`);
  }
  return workflowName;
}

function normalizeComplexity(value) {
  const normalized = String(value || 'STANDARD').trim().toUpperCase();
  if (!['SIMPLE', 'STANDARD', 'COMPLEX'].includes(normalized)) {
    throw new Error(`Unknown complexity "${value}"`);
  }
  return normalized;
}

function loadSpecWorkflow(projectRoot = PROJECT_ROOT) {
  const document = loadYamlFile(projectRoot, SPEC_WORKFLOW_PATH);
  if (!document || !document.workflow) {
    throw new Error(`Invalid workflow document: ${SPEC_WORKFLOW_PATH}`);
  }
  return document.workflow;
}

function resolvePhaseDefinition(workflow, phaseId) {
  const sourceStep = PHASE_ALIASES[phaseId] || phaseId;
  const definition = (workflow.sequence || []).find(
    (candidate) => candidate.step === sourceStep,
  );
  if (!definition) {
    throw new Error(`Workflow phase has no sequence definition: ${phaseId}`);
  }
  return definition;
}

function buildPhase(workflow, phaseId, projectRoot) {
  const definition = resolvePhaseDefinition(workflow, phaseId);
  const taskFile =
    definition.task ||
    PHASE_TASK_FALLBACKS[phaseId] ||
    PHASE_TASK_FALLBACKS[definition.step];

  if (!taskFile) {
    throw new Error(`Workflow phase has no task contract: ${phaseId}`);
  }

  const taskTarget = `${TASKS_DIR}/${taskFile}`;
  const contract = extractAutoClaudeContract(projectFile(projectRoot, taskTarget));
  if (!contract) {
    throw new Error(`Task has no autoClaude contract: ${taskTarget}`);
  }

  const command = PHASE_COMMANDS[phaseId] || PHASE_COMMANDS[definition.step];
  if (!command) {
    throw new Error(`Workflow phase has no Codex command mapping: ${phaseId}`);
  }

  return {
    id: phaseId,
    sourceStep: definition.step,
    phase: definition.phase,
    name: definition.phase_name,
    agent: command.agent,
    command: command.command,
    task: taskTarget,
    condition: definition.condition || null,
    skipIf: definition.skip_if || null,
    gate: Boolean(definition.gate || contract.verification?.type === 'gate'),
    readOnly: Boolean(contract.readOnly || definition.read_only),
    elicit: Boolean(contract.elicit),
    deterministic: Boolean(contract.deterministic),
    inputs: contract.inputs || [],
    outputs: contract.outputs || [],
    verification: contract.verification || null,
    taskFirst: {
      inputs: true,
      outputs: true,
      verification: true,
    },
  };
}

function loadDeliveryPreparation(projectRoot = PROJECT_ROOT) {
  const matrixPath = projectFile(projectRoot, DELEGATION_MATRIX_PATH);
  const matrix = JSON.parse(fs.readFileSync(matrixPath, 'utf8'));
  const route = matrix.routes?.['framework-story-delivery'];
  if (!route) {
    throw new Error('Missing framework-story-delivery delegation route');
  }

  return {
    routeId: 'framework-story-delivery',
    source: DELEGATION_MATRIX_PATH,
    preparationOnly: true,
    chain: route.delegationChain.map((step) => ({
      from: step.from,
      to: step.to,
      agent: step.to,
      command: step.command,
      target: step.path,
    })),
  };
}

function resolveCodexWorkflow(name, options = {}) {
  const projectRoot = options.projectRoot || PROJECT_ROOT;
  const workflowName = normalizeWorkflowName(name);
  const complexity = normalizeComplexity(options.complexity);
  const workflow = loadSpecWorkflow(projectRoot);
  const profile = workflow.phases?.[complexity];
  if (!profile || !Array.isArray(profile.steps)) {
    throw new Error(`Workflow has no ${complexity} phase profile`);
  }

  let phaseIds = [...profile.steps];
  if (workflowName === 'spec') {
    const firstPlanPhase = phaseIds.findIndex((phase) =>
      ['plan', 'analyze'].includes(phase),
    );
    if (firstPlanPhase >= 0) {
      phaseIds = phaseIds.slice(0, firstPlanPhase);
    }
  }

  const result = {
    workflowId: workflow.id,
    request: workflowName,
    subject: options.subject ? String(options.subject) : null,
    complexity,
    source: SPEC_WORKFLOW_PATH,
    sourceVersion: workflow.version,
    preparationOnly: true,
    taskFirst: true,
    phases: phaseIds.map((phaseId) =>
      buildPhase(workflow, phaseId, projectRoot),
    ),
  };

  if (workflowName === 'orchestrate') {
    result.delivery = loadDeliveryPreparation(projectRoot);
  }

  return result;
}

function parseArgs(argv = process.argv.slice(2)) {
  const positional = [];
  let complexity = 'STANDARD';

  for (let index = 0; index < argv.length; index += 1) {
    const argument = argv[index];
    if (argument === '--complexity') {
      complexity = argv[index + 1];
      index += 1;
    } else if (argument.startsWith('--complexity=')) {
      complexity = argument.slice('--complexity='.length);
    } else if (!argument.startsWith('--')) {
      positional.push(argument);
    }
  }

  return { name: positional[0], complexity };
}

function main() {
  const args = parseArgs();
  if (!args.name) {
    console.error(
      'Usage: node .codex/scripts/resolve-codex-workflow.js <spec|plan|orchestrate> [--complexity STANDARD]',
    );
    process.exitCode = 1;
    return;
  }

  try {
    console.log(
      JSON.stringify(
        resolveCodexWorkflow(args.name, { complexity: args.complexity }),
        null,
        2,
      ),
    );
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
  SPEC_WORKFLOW_PATH,
  DELEGATION_MATRIX_PATH,
  extractAutoClaudeContract,
  normalizeWorkflowName,
  normalizeComplexity,
  loadSpecWorkflow,
  loadDeliveryPreparation,
  resolveCodexWorkflow,
  parseArgs,
};
