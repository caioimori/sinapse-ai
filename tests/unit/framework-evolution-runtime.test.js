'use strict';

const fs = require('node:fs');
const path = require('node:path');
const os = require('node:os');
const { inventory, declaredTaskSlugs } = require('../../scripts/framework-evolution/inventory.cjs');
const { buildRuntimeContext, containedFile, parseArgs } = require('../../scripts/framework-evolution/runtime.cjs');
const { collectNativeAgentDefinitions, syncCodexNativeAgents } = require('../../.codex/scripts/sync-codex-native.js');
const root = path.resolve(__dirname, '../..');

describe('framework evolution runtime integration', () => {
  test('all canonical agents and squads are inventoried without counting task blocks as commands', () => {
    const result = inventory(root);
    expect(result.counts).toMatchObject({ agents: 172, sourceAgents: 172, squads: 17, resolvableAgents: 172, tasks: 1460, legacyReachableTasks: 1396 });
    expect(result.counts.reachableTasks).toBeGreaterThanOrEqual(1396);
    const reachableTargets = result.agents.flatMap(agent => agent.resolvedTasks.map(task => task.target));
    expect(reachableTargets).toEqual(expect.arrayContaining(['build-component', 'ux-create-wireframe', 'create-cro-patterns', 'consult-canon', 'premium-packaging-brief', 'design-product-surface'].map(task => `squads/squad-design/tasks/${task}.md`)));
    expect(result.gaps.missingSources).toEqual([]);
    expect(result.assets.taskSupportFiles.some((file) => file.endsWith('context-loading.md'))).toBe(true);
    expect(result.gaps.tasksWithoutAgentCommand.length).toBeLessThanOrEqual(64);
  });
  test('task declarations exclude unrelated table labels and preserve exact task scope', () => {
    expect(declaredTaskSlugs('| misleading | label |\n## Tasks\n1. real-task\n## End\n| ignored | table |')).toEqual(['real-task']);
  });
  test('all 172 agents receive cited bounded task-first context and retain coverage gaps', () => {
    for (const agent of inventory(root).agents) {
      const contract = require('../../scripts/expert-evolution/operational.cjs').loadContracts(root).contracts.find(c=>c.agentId===agent.id);
      const eligible = contract.tasks.find(t=>t.authority.executionAuthorized || contract.role==='orchestrator');
      expect(eligible).toBeDefined();
      const task = eligible.command;
      const context = buildRuntimeContext({ root, agentId: agent.id, task });
      expect(context.capsule.agentId).toBe(agent.id);
      expect(context.charsUsed).toBe(JSON.stringify(context).length);
      expect(context.charsUsed).toBeLessThanOrEqual(12000);
      expect(context.operational.task.authority.executionAuthorized || contract.role==='orchestrator').toBe(true);
      expect(context.knowledge.charsUsed).toBeLessThanOrEqual(6000);
      expect(context.knowledge.coverage).toBe('gap');
      expect(context.capsule.canonicalSha256).toMatch(/^[a-f0-9]{64}$/);
      for (const item of context.knowledge.items) expect(item.sources.length).toBeGreaterThan(0);
    }
  });
  test('aliases resolve and unknown IDs/tasks and malformed budgets fail closed', () => {
    const context = buildRuntimeContext({ agentId: 'dev', task: 'dev-develop-story' });
    expect(context.capsule.agentId).toBe('developer');
    expect(() => buildRuntimeContext({ agentId: '../developer', task: 'dev-develop-story' })).toThrow();
    expect(() => buildRuntimeContext({ agentId: 'invented', task: 'dev-develop-story' })).toThrow('Unknown');
    expect(() => buildRuntimeContext({ agentId: 'developer', task: 'invented' })).toThrow('Unknown');
    expect(() => buildRuntimeContext({ agentId: 'developer', task: 'dev-develop-story', maxChars: NaN })).toThrow('budget');
    expect(() => parseArgs(['developer', '--unknown', 'x'])).toThrow();
  });
  test('retrieval receives the resolved task title and bounded canonical text', () => {
    const knowledge = require('../../scripts/framework-evolution/knowledge.cjs');
    const spy = jest.spyOn(knowledge, 'retrieveKnowledge');
    try {
      buildRuntimeContext({ agentId: 'developer', task: 'dev-develop-story' });
      const request = spy.mock.calls[0][0];
      expect(request.task.command).toBe('dev-develop-story');
      expect(request.task.title.length).toBeGreaterThan(0);
      expect(request.task.text).toBe(fs.readFileSync(path.join(root, '.sinapse-ai/development/tasks/dev-develop-story.md'), 'utf8').slice(0, 4000));
      expect(request.task.text.length).toBeLessThanOrEqual(4000);
    } finally { spy.mockRestore(); }
  });
  test('distinct real tasks for the same specialist select different relevant knowledge', () => {
    const variations = buildRuntimeContext({ agentId: 'ad-copywriter', task: 'write-ad-copy-variations' });
    const ugc = buildRuntimeContext({ agentId: 'ad-copywriter', task: 'create-ugc-script' });
    const variationIds = variations.knowledge.items.map((item) => item.id);
    const ugcIds = ugc.knowledge.items.map((item) => item.id);
    expect(variationIds).toContain('business-one-message-action');
    expect(ugcIds).toContain('business-peer-proof');
    expect(variationIds).not.toEqual(ugcIds);
    expect(variations.knowledge.coverage).toBe('gap');
    expect(ugc.knowledge.coverage).toBe('gap');
  });
  test('canonical path traversal cannot read outside the selected project', () => {
    const temporary = fs.mkdtempSync(path.join(os.tmpdir(), 'sinapse-runtime-'));
    try {
      const inside = path.join(temporary, 'project');
      fs.mkdirSync(inside);
      fs.writeFileSync(path.join(temporary, 'outside.md'), 'outside');
      expect(() => containedFile(inside, '../outside.md')).toThrow('escapes');
    } finally { fs.rmSync(temporary, { recursive: true, force: true }); }
  });
  test('native generated adapters have optional task-only retrieval and syncing is idempotent', () => {
    const definitions = collectNativeAgentDefinitions(root);
    expect(definitions).toHaveLength(172);
    for (const definition of definitions) {
      expect(definition.developerInstructions).toContain('scripts/framework-evolution/runtime.cjs');
      expect(definition.developerInstructions).toContain('Do not retrieve during greeting');
      expect(definition.developerInstructions).toContain('If all five are absent');
    }
    const second = syncCodexNativeAgents(root);
    expect(second.updated).toBe(0);
    expect(second.nativeSkills.updated).toBe(0);
  });
  test('public corpus is packaged without broad research publication', () => {
    const entries = require('../../package.json').files;
    for (const file of ['sources', 'heuristics', 'competencies']) expect(entries).toContain(`research/framework-evolution/${file}.json`);
    expect(entries).not.toContain('research/');
  });
});
