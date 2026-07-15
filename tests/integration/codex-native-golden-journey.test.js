'use strict';

const fs = require('fs');
const path = require('path');

const PROJECT_ROOT = path.resolve(__dirname, '..', '..');

const {
  buildEcosystemStats,
  resolveCodexAgent,
} = require('../../.codex/scripts/resolve-codex-agent');
const {
  resolveCodexCommand,
} = require('../../.codex/scripts/resolve-codex-command');
const {
  resolveCodexWorkflow,
} = require('../../.codex/scripts/resolve-codex-workflow');
const {
  resolveRequest,
} = require('../../.codex/scripts/sinapse-codex');

function expectProjectFile(relativePath) {
  const absolutePath = path.resolve(PROJECT_ROOT, relativePath);
  expect(absolutePath.startsWith(`${PROJECT_ROOT}${path.sep}`)).toBe(true);
  expect(fs.statSync(absolutePath).isFile()).toBe(true);
}

function expectCommandTarget(agentId, commandId) {
  const result = resolveCodexCommand(agentId, commandId, PROJECT_ROOT);
  expectProjectFile(result.target);
  for (const resource of result.resources || []) expectProjectFile(resource);
  return result;
}

function expectWorkflowTargets(workflow) {
  expectProjectFile(workflow.source);
  expect(workflow.preparationOnly).toBe(true);
  expect(workflow.taskFirst).toBe(true);
  expect(workflow.phases.length).toBeGreaterThan(0);

  for (const phase of workflow.phases) {
    expectProjectFile(phase.task);
    expect(phase.taskFirst).toEqual({
      inputs: true,
      outputs: true,
      verification: true,
    });
    expect(Array.isArray(phase.inputs)).toBe(true);
    expect(Array.isArray(phase.outputs)).toBe(true);
  }
}

describe('Codex native golden preparation journey', () => {
  it('resolves PRD through QA in the canonical preparation order', () => {
    const prd = expectCommandTarget('project-lead', 'create-prd');
    const epic = expectCommandTarget('project-lead', 'create-epic');
    const storyDraft = expectCommandTarget('sprint-lead', 'draft');
    const storyValidation = expectCommandTarget('product-lead', 'validate-story-draft');
    const spec = resolveCodexWorkflow('spec', {
      complexity: 'STANDARD',
      projectRoot: PROJECT_ROOT,
    });
    const plan = resolveCodexWorkflow('plan', {
      complexity: 'STANDARD',
      projectRoot: PROJECT_ROOT,
    });
    const development = expectCommandTarget('developer', 'develop');
    const qualityGate = expectCommandTarget('quality-gate', 'gate');

    expectWorkflowTargets(spec);
    expectWorkflowTargets(plan);
    expect(spec.phases.map((phase) => phase.id)).toEqual([
      'gather',
      'assess',
      'research',
      'spec',
      'clarify',
      'critique',
    ]);
    expect(plan.phases.slice(0, spec.phases.length).map((phase) => phase.task)).toEqual(
      spec.phases.map((phase) => phase.task),
    );
    expect(plan.phases.slice(-2).map((phase) => phase.id)).toEqual(['plan', 'analyze']);

    const milestones = [
      ['prd', prd.agentId, prd.commandId],
      ['epic', epic.agentId, epic.commandId],
      ['story-draft', storyDraft.agentId, storyDraft.commandId],
      ['story-validate', storyValidation.agentId, storyValidation.commandId],
      ['spec-workflow', spec.request, spec.workflowId],
      ['plan-workflow', plan.request, plan.workflowId],
      ['development', development.agentId, development.commandId],
      ['quality-gate', qualityGate.agentId, qualityGate.commandId],
    ];

    expect(milestones.map(([milestone]) => milestone)).toEqual([
      'prd',
      'epic',
      'story-draft',
      'story-validate',
      'spec-workflow',
      'plan-workflow',
      'development',
      'quality-gate',
    ]);
    expect(prd.target).toBe('.sinapse-ai/development/tasks/create-doc.md');
    expect(epic.target).toBe('.sinapse-ai/development/tasks/brownfield-create-epic.md');
    expect(storyDraft.target).toBe('.sinapse-ai/development/tasks/create-next-story.md');
    expect(storyValidation.target).toBe('.sinapse-ai/development/tasks/validate-next-story.md');
    expect(development.target).toBe('.sinapse-ai/development/tasks/dev-develop-story.md');
    expect(qualityGate.target).toBe('.sinapse-ai/development/tasks/qa-gate.md');
  });

  it('prepares the same workflows through the additive sinapse-codex helper', () => {
    const spec = resolveRequest(['spec', 'checkout-flow', '--complexity', 'STANDARD'], PROJECT_ROOT);
    const plan = resolveRequest(['plan', 'checkout-flow', '--complexity', 'STANDARD'], PROJECT_ROOT);
    const orchestrate = resolveRequest(
      ['orchestrate', 'checkout-flow', '--complexity', 'STANDARD'],
      PROJECT_ROOT,
    );

    expect(spec.request).toBe('spec');
    expect(plan.request).toBe('plan');
    expect(orchestrate.request).toBe('orchestrate');
    expect(orchestrate.delivery.chain.map((step) => step.command)).toEqual([
      'create-prd',
      'draft',
      'validate-story',
      'develop',
      'gate',
      'push',
    ]);
    for (const step of orchestrate.delivery.chain) expectProjectFile(step.target);
  });

  it('has exactly 172 native agents aligned with the resolvable catalog', () => {
    const stats = buildEcosystemStats(PROJECT_ROOT);
    const agentFiles = fs.readdirSync(path.join(PROJECT_ROOT, '.codex', 'agents'));
    const markdownIds = agentFiles
      .filter((file) => file.endsWith('.md'))
      .map((file) => file.replace(/\.md$/, ''))
      .sort();
    const tomlIds = agentFiles
      .filter((file) => file.endsWith('.toml'))
      .map((file) => file.replace(/\.toml$/, ''))
      .sort();

    expect(stats.totalAgents).toBe(172);
    expect(stats.resolvableAgents).toBe(172);
    expect(markdownIds).toHaveLength(172);
    expect(tomlIds).toEqual(markdownIds);
  });

  it('discovers public dollar aliases and resolves specialists parametrically', () => {
    const catalog = JSON.parse(
      fs.readFileSync(path.join(PROJECT_ROOT, '.codex', 'catalog.json'), 'utf8'),
    );
    const managedSkillIds = [
      ...catalog.expectedSkillIds,
      ...catalog.publicAliasSkillIds,
      catalog.genericAgentSkillId,
    ];

    for (const skillId of managedSkillIds) {
      expectProjectFile(path.join('.agents', 'skills', skillId, 'SKILL.md'));
      expect(fs.existsSync(
        path.join(PROJECT_ROOT, '.codex', 'skills', skillId, 'SKILL.md'),
      )).toBe(false);
    }
    for (const alias of catalog.publicAliasSkillIds) {
      const content = fs.readFileSync(
        path.join(PROJECT_ROOT, '.agents', 'skills', alias, 'SKILL.md'),
        'utf8',
      );
      expect(content).toContain('`$sinapse-orqx`');
      expect(content).toContain('canonical `snps-orqx`');
    }

    expect(resolveCodexAgent('architect', PROJECT_ROOT)).toMatchObject({
      agentId: 'architect',
      sourceOfTruth: '.sinapse-ai/development/agents/architect.md',
    });
    expect(resolveCodexAgent('meta-ads-specialist', PROJECT_ROOT)).toMatchObject({
      agentId: 'meta-ads-specialist',
      squad: 'squad-paidmedia',
    });
    expect(() => resolveCodexAgent('invented-agent-id', PROJECT_ROOT)).toThrow(/Unknown Codex agent/);
  });

  it('does not start Claude or a nested Codex process from sinapse-codex', () => {
    const helperSource = fs.readFileSync(
      path.join(PROJECT_ROOT, '.codex', 'scripts', 'sinapse-codex.js'),
      'utf8',
    );

    expect(helperSource).not.toMatch(/require\(['"]child_process['"]\)/);
    expect(helperSource).not.toMatch(/\b(?:spawn|spawnSync|exec|execFile|execSync)\s*\(/);
    expect(helperSource).not.toMatch(/\bclaude(?:\.exe)?\b/i);
    expect(helperSource).not.toMatch(/\bcodex(?:\.exe)?\s+exec\b/i);
  });
});
