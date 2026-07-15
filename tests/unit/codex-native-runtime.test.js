'use strict';

const fs = require('fs');
const os = require('os');
const path = require('path');
const yaml = require('js-yaml');

const {
  resolveCodexAgent,
} = require('../../.codex/scripts/resolve-codex-agent');
const {
  resolveCodexCommand,
} = require('../../.codex/scripts/resolve-codex-command');
const {
  resolveCodexWorkflow,
} = require('../../.codex/scripts/resolve-codex-workflow');
const {
  buildDoctorReport,
  buildLoopStatus,
  advanceLoop,
  detectProjectRoot,
  prepareLoop,
  resolveRequest,
} = require('../../.codex/scripts/sinapse-codex');

const PROJECT_ROOT = path.resolve(__dirname, '..', '..');

function readJson(relativePath) {
  return JSON.parse(
    fs.readFileSync(path.join(PROJECT_ROOT, relativePath), 'utf8'),
  );
}

function parseSkill(relativePath) {
  const content = fs.readFileSync(path.join(PROJECT_ROOT, relativePath), 'utf8');
  const frontmatter = content.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!frontmatter) throw new Error(`Missing skill frontmatter: ${relativePath}`);
  return { content, metadata: yaml.load(frontmatter[1]) };
}

describe('Codex native runtime preparation', () => {
  test.each([
    ['sinapse-architect', 'architect'],
    ['sinapse-analyst', 'analyst'],
    ['sinapse-devops', 'devops'],
    ['sinapse-brand', 'brand-orqx'],
    ['sinapse-animations', 'animations-orqx'],
    ['sinapse-swarm', 'swarm-orqx'],
  ])('normalizes %s to %s', (alias, expectedAgentId) => {
    expect(resolveCodexAgent(alias).agentId).toBe(expectedAgentId);
  });

  test.each([
    ['sinapse-pm', 'create-prd', '.sinapse-ai/development/tasks/create-doc.md'],
    ['sinapse-pm', 'create-epic', '.sinapse-ai/development/tasks/brownfield-create-epic.md'],
    ['sinapse-pm', 'create-spec', '.sinapse-ai/development/workflows/spec-pipeline.yaml'],
    ['sinapse-pm', 'clarify-spec', '.sinapse-ai/development/tasks/spec-clarify.md'],
    ['sinapse-sm', 'draft', '.sinapse-ai/development/tasks/create-next-story.md'],
    ['sinapse-po', 'validate-story', '.sinapse-ai/development/tasks/validate-next-story.md'],
    ['sinapse-architect', 'assess-complexity', '.sinapse-ai/development/tasks/spec-assess-complexity.md'],
    ['sinapse-architect', 'create-plan', '.sinapse-ai/development/tasks/plan-create-implementation.md'],
    ['sinapse-analyst', 'research-deps', '.sinapse-ai/development/tasks/spec-research-dependencies.md'],
    ['sinapse-qa', 'critique-spec', '.sinapse-ai/development/tasks/spec-critique.md'],
    ['sinapse-qa', 'analyze-spec', '.sinapse-ai/development/tasks/spec-analyze.md'],
    ['sinapse-devops', 'push', '.sinapse-ai/development/agents/devops.md'],
  ])('resolves %s %s to an existing target', (agent, command, target) => {
    const resolved = resolveCodexCommand(agent, command);
    expect(resolved.target).toBe(target);
    expect(fs.existsSync(path.join(PROJECT_ROOT, target))).toBe(true);
  });

  test('resolves canonical spec and plan phases with task-first contracts', () => {
    const spec = resolveCodexWorkflow('spec', { complexity: 'STANDARD' });
    expect(spec.phases.map((phase) => phase.id)).toEqual([
      'gather',
      'assess',
      'research',
      'spec',
      'clarify',
      'critique',
    ]);
    expect(spec.phases.every((phase) => phase.taskFirst.outputs)).toBe(true);

    const plan = resolveCodexWorkflow('plan', { complexity: 'STANDARD' });
    expect(plan.phases.map((phase) => phase.id)).toEqual([
      'gather',
      'assess',
      'research',
      'spec',
      'clarify',
      'critique',
      'plan',
      'analyze',
    ]);
    expect(plan.phases.find((phase) => phase.id === 'plan').outputs[0].path)
      .toBe('docs/stories/{storyId}/plan/implementation.yaml');
  });

  test('orchestrate preparation appends the canonical SDC delegation chain', () => {
    const orchestration = resolveCodexWorkflow('orchestrate', {
      complexity: 'STANDARD',
    });
    expect(orchestration.delivery.chain.map((step) => step.to)).toEqual([
      'sinapse-pm',
      'sinapse-sm',
      'sinapse-po',
      'sinapse-dev',
      'sinapse-qa',
      'sinapse-devops',
    ]);
  });

  test('delegation matrix and parity document remain equivalent', () => {
    const matrix = readJson('.codex/delegation-matrix.json');
    const parity = readJson('.codex/delegation-parity.json');
    expect(parity).toEqual(matrix);
    expect(
      matrix.routes['framework-story-delivery'].delegationChain.map(
        (step) => `${step.to}:${step.command}`,
      ),
    ).toEqual([
      'sinapse-pm:create-prd',
      'sinapse-sm:draft',
      'sinapse-po:validate-story',
      'sinapse-dev:develop',
      'sinapse-qa:gate',
      'sinapse-devops:push',
    ]);
  });

  test('supports direct workflow aliases and preserves the optional subject', () => {
    const spec = resolveRequest([
      'spec',
      'STORY-42',
      '--complexity',
      'SIMPLE',
    ]);
    expect(spec.request).toBe('spec');
    expect(spec.subject).toBe('STORY-42');
    expect(spec.complexity).toBe('SIMPLE');

    const plan = resolveRequest(['plan', 'EPIC-7']);
    expect(plan.request).toBe('plan');
    expect(plan.subject).toBe('EPIC-7');

    const orchestration = resolveRequest(['orchestrate', 'new-product']);
    expect(orchestration.request).toBe('orchestrate');
    expect(orchestration.subject).toBe('new-product');
  });

  test('doctor and loop commands are bounded, deterministic preparation only', () => {
    const firstDoctor = buildDoctorReport();
    const secondDoctor = buildDoctorReport();
    expect(firstDoctor).toEqual(secondDoctor);
    expect(firstDoctor.ok).toBe(true);
    expect(firstDoctor.checks.codexConfig).toBe(true);
    expect(firstDoctor.checks.codexHooks).toBe(true);
    expect(firstDoctor.checks.nativeAgentParity).toBe(true);
    expect(firstDoctor.metrics.agentSurfaces.toml)
      .toBe(firstDoctor.metrics.agentSurfaces.markdown);

    expect(buildLoopStatus()).toMatchObject({
      optIn: true,
      active: false,
      currentIteration: 0,
      maxIterations: 3,
      completionCriterionRequired: true,
    });
    expect(prepareLoop('all focused tests pass')).toMatchObject({
      active: true,
      currentIteration: 0,
      completionCriterion: 'all focused tests pass',
    });
    expect(() => prepareLoop('')).toThrow('completion criterion');

    const helperSource = fs.readFileSync(
      path.join(PROJECT_ROOT, '.codex/scripts/sinapse-codex.js'),
      'utf8',
    );
    expect(helperSource).not.toMatch(
      /child_process|spawnSync|execSync|execFileSync|fork\s*\(/,
    );
  });

  test('persisted loop state deterministically stops at iteration three', () => {
    const projectRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'sinapse-loop-'));
    try {
      prepareLoop('quality gate passes', { persist: true, projectRoot });
      expect(buildLoopStatus(projectRoot).active).toBe(true);
      expect(advanceLoop(projectRoot, 'continue')).toMatchObject({ active: true, currentIteration: 1 });
      expect(advanceLoop(projectRoot, 'continue')).toMatchObject({ active: true, currentIteration: 2 });
      expect(advanceLoop(projectRoot, 'continue')).toMatchObject({
        active: false,
        currentIteration: 3,
        stopReason: 'max-iterations-reached',
      });
      expect(() => advanceLoop(projectRoot, 'continue')).toThrow(/No active SINAPSE loop/);
    } finally {
      fs.rmSync(projectRoot, { recursive: true, force: true });
    }
  });

  test('the installed sinapse-codex bin resolves the caller project, including nested cwd', () => {
    expect(detectProjectRoot(path.join(PROJECT_ROOT, 'packages', 'installer')))
      .toBe(PROJECT_ROOT);
  });

  test('workflow skills are valid, unique, and exposed only through the native root', () => {
    const skillIds = ['sinapse-orqx', 'sinapse-spec-driven', 'sinapse-loop'];
    const names = [];

    for (const skillId of skillIds) {
      const nativePath = `.agents/skills/${skillId}/SKILL.md`;
      const native = parseSkill(nativePath);
      names.push(native.metadata.name);
      expect(native.metadata.name).toBe(skillId);
      expect(fs.existsSync(path.join(PROJECT_ROOT, '.codex', 'skills', skillId, 'SKILL.md')))
        .toBe(false);
    }

    expect(new Set(names).size).toBe(skillIds.length);
    expect(parseSkill('.agents/skills/sinapse-loop/SKILL.md').content)
      .toMatch(/maximum of 3 iterations/i);
  });

  test('catalog points sinapse-orqx and workflow skills to valid surfaces', () => {
    const catalog = readJson('.codex/catalog.json');
    const generated = catalog.generatedSkillMap['snps-orqx'];
    const canonical = catalog.canonicalSkillMap['sinapse-orqx'];

    expect(fs.existsSync(path.join(PROJECT_ROOT, generated.sourceOfTruth)))
      .toBe(true);
    expect(fs.existsSync(path.join(PROJECT_ROOT, generated.canonicalReference)))
      .toBe(true);
    expect(
      fs.existsSync(
        path.join(PROJECT_ROOT, '.codex/agents', canonical.filename),
      ),
    ).toBe(true);
    expect(catalog.expectedSkillIds).toEqual(
      expect.arrayContaining(['sinapse-spec-driven', 'sinapse-loop']),
    );
    expect(catalog.generatedSkillMap['sinapse-orqx']).toBeUndefined();
  });
});
