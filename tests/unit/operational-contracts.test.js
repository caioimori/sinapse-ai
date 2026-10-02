'use strict';

const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const crypto = require('node:crypto');
const e = require('../../scripts/expert-evolution/expertise.cjs');
const resolver = require('../../.codex/scripts/resolve-codex-agent.js');
const commands = require('../../.codex/scripts/resolve-codex-command.js');
const catalog = require('../../scripts/expert-evolution/catalog.cjs');
const nativeAdapters = require('../../.codex/scripts/sync-codex-native.js');
const root = path.resolve(__dirname, '../..');
const read = relative => JSON.parse(fs.readFileSync(path.join(root, relative), 'utf8'));
const review = read('docs/framework/expert-evolution-2026-10/priority-contracts-review.json');
const completion = read('docs/framework/expert-evolution-2026-10/design-task-completion.json');
const digest = value => crypto.createHash('sha256').update(value).digest('hex');

describe('explicit priority contracts without expertise promotion', () => {
  test('preserves the previous seven functions and eighteen bindings byte-equivalently as JSON', () => {
    const current = e.loadProgram(root);
    expect(review.baseline.reviewedFunctions).toBe(7);
    expect(review.baseline.reviewedCommands).toBe(18);
    expect(digest(JSON.stringify(current.bindings.bindings.slice(0, 18))))
      .toBe(review.baseline.bindingsSha256);
    for (const old of review.baseline.preservedProfiles) {
      const profile = current.profiles.profiles.find(p => p.agentId === old.agentId);
      expect(digest(JSON.stringify(profile))).toBe(old.sha256);
    }
  });

  test('T08 preserves the T03 receipt, prior 29 reviewed functions and all 43 bindings', () => {
    const current = e.loadProgram(root);
    expect(completion.baseline.reviewedFunctions).toBe(29);
    expect(completion.baseline.reviewedCommands).toBe(43);
    expect(digest(JSON.stringify(current.bindings.bindings.slice(0, 43))))
      .toBe(completion.baseline.bindingsSha256);
    for (const previous of completion.baseline.preservedProfiles) {
      expect(digest(JSON.stringify(current.profiles.profiles.find(p => p.agentId === previous.agentId))))
        .toBe(previous.sha256);
    }
    for (const previous of [completion.baseline.historicalReceipt, completion.baseline.historicalMarkdown]) {
      expect(digest(fs.readFileSync(path.join(root, previous.path)))).toBe(previous.sha256);
    }
    expect(digest(JSON.stringify(current.sources.references))).toBe(completion.baseline.sourcesSha256);
  });

  test.each([...review.contracts, ...completion.contracts].map(contract => [contract.agentId, contract.command, contract]))(
    '%s/%s emits every required critical criterion and the actual bounded task',
    (agentId, command, contract) => {
      const binding = e.resolveTaskBinding({root, agentId, command});
      const profile = e.getProfile({root, agentId, compact: true, maxChars: 3000, task: {command}});
      const resolved = commands.resolveCodexCommand(agentId, command, root);
      expect(binding.taskPath).toBe(contract.taskRef.path);
      expect(resolved.target).toBe(binding.taskPath);
      expect(digest(fs.readFileSync(path.join(root, resolved.target)))).toBe(binding.taskSha256);
      expect(profile.selectionEvidence.status).toBe('bound');
      expect(profile.criteriaComplete).toBe(true);
      expect(profile.deliverables.flatMap(d => d.criteria.map(c => c.id)))
        .toEqual(expect.arrayContaining(binding.requiredCriterionIds));
      expect(profile.competencies).toEqual([contract.competency]);
      expect(JSON.stringify(profile).length).toBeLessThanOrEqual(3000);
      expect(profile.validatedExpertise).toBe(false);
      expect(profile.status).toBe('planned');
      expect(binding.contract).toMatchObject({
        family: contract.family, input: expect.any(String), output: expect.any(String),
        negative: {input: expect.any(String), expected: expect.any(String)}, evaluation: 'pending',
      });
    },
  );

  test('unknown or another function task cannot borrow a reviewed contract', () => {
    for (const [agentId, command] of [
      ['dx-ui-designer', 'audit-core-web-vitals'],
      ['motion-choreographer', 'create-custom-shader'],
      ['brand-sonic-designer', 'create-video-templates'],
      ['content-governor', 'analyze-performance'],
    ]) {
      const profile = e.getProfile({root, agentId, compact: true, task: {command}});
      expect(profile.selectionEvidence.status).toBe('gap');
      expect(profile.deliverables).toEqual([]);
      expect(profile.competencies).toEqual([]);
    }
  });

  test('new mappings remain semantic when order changes and fail on missing protected criteria', () => {
    const program = e.loadProgram(root);
    program.profiles.profiles.reverse();
    for (const profile of program.profiles.profiles) profile.deliverables.reverse();
    program.bindings.bindings.reverse();
    expect(e.validateTaskBindings(program, {root})).toEqual({valid: true, errors: []});
    const binding = program.bindings.bindings.find(b => b.agentId === 'brand-motion-vfx');
    binding.requiredCriterionIds.pop();
    expect(e.validateTaskBindings(program, {root}).valid).toBe(false);
  });

  test('stale source and task hashes fail instead of emitting an old contract', () => {
    for (const field of ['sourceSha256', 'taskSha256']) {
      const program = e.loadProgram(root);
      program.bindings.bindings.find(b => b.agentId === 'dx-accessibility-specialist')[field] = 'f'.repeat(64);
      expect(e.validateTaskBindings(program, {root}).valid).toBe(false);
    }
  });

  test('budget shortage defers the whole minimum contract, not only its negative/critical gates', () => {
    const agentId = 'brand-sonic-designer', command = 'create-audio-beds';
    const binding = e.resolveTaskBinding({root, agentId, command});
    const profile = e.getProfile({root, agentId, compact: true, maxChars: 1600, task: {command}});
    expect(profile.criteriaComplete).toBe(false);
    expect(profile.selectionEvidence.status).toBe('deferred-budget');
    expect(profile.deliverables).toEqual([]);
    expect(profile.omittedCriterionIds).toEqual(binding.requiredCriterionIds);
    expect(JSON.stringify(profile).length).toBeLessThanOrEqual(1600);
  });

  test('six historical rejections gain explicit T08 tasks while candidates and acquisition stay unobserved', () => {
    const program = e.loadProgram(root);
    expect(e.validateProgram(program, {root})).toEqual({valid: true, errors: []});
    expect(program.profiles.profiles).toHaveLength(172);
    expect(program.profiles.profiles.filter(p => p.contractReviewed)).toHaveLength(35);
    expect(program.bindings.bindings).toHaveLength(51);
    expect(program.profiles.profiles.filter(p => !p.contractReviewed)).toHaveLength(137);
    expect(program.profiles.profiles.every(p => !p.validatedExpertise && p.status === 'planned')).toBe(true);
    expect(program.sources.references.filter(r => r.status === 'READ')).toHaveLength(2);
    expect(program.sources.references.filter(r => r.status === 'CANDIDATE')).toHaveLength(88);
    for (const rejected of review.rejected) {
      const profile = program.profiles.profiles.find(p => p.agentId === rejected.agentId);
      const contract = completion.contracts.find(c => c.agentId === rejected.agentId && c.command === rejected.command);
      expect(contract).toBeDefined();
      expect(profile.contractReviewed).toBe(true);
      expect(profile.candidateContracts.status).toBe('unreviewed');
      expect(profile.competencies).toEqual([contract.competency]);
      expect(e.resolveTaskBinding({root, agentId: rejected.agentId, command: rejected.command}).taskPath)
        .toBe(contract.taskRef.path);
    }
  });

  test.each(completion.contracts.map(contract => [contract.agentId, contract]))(
    '%s has a bounded owned workflow and preserves the public aliases with complete criteria',
    (agentId, contract) => {
      const task = fs.readFileSync(path.join(root, contract.taskRef.path), 'utf8');
      expect(task).toContain('responsavel: "@' + agentId + '"');
      expect(task).toContain('task: ' + contract.command + '\n');
      expect(task).toContain('max_iterations: 3');
      expect(task).toContain('max_attempts: 2');
      for (const section of ['Entradas', 'Passos', 'Saídas', 'Critérios observáveis', 'Caso negativo', 'Freio e falha', 'Rollback']) {
        expect(task).toContain('## ' + section);
      }
      for (const criterion of contract.criteria) expect(task).toContain('**' + criterion.id + ':**');
      for (const command of [contract.command, ...contract.aliases]) {
        const resolved = commands.resolveCodexCommand(agentId, command, root);
        const binding = e.resolveTaskBinding({root, agentId, command});
        expect(resolved.target).toBe(contract.taskRef.path);
        expect(binding.requiredCriterionIds).toEqual(contract.criteria.map(c => c.id));
        const profile = e.getProfile({root, agentId, compact: true, maxChars: 3000, task: {command}});
        expect(profile.criteriaComplete).toBe(true);
        expect(profile.validatedExpertise).toBe(false);
      }
      // A reviewed principal task cannot lend its criteria to another design owner.
      for (const other of completion.contracts.filter(c => c.agentId !== agentId)) {
        expect(e.resolveTaskBinding({root, agentId: other.agentId, command: contract.command})).toBeNull();
      }
    },
  );

  test('all five existing deliverable routes still resolve their original contracts', () => {
    for (const term of ['interface', 'motion', 'Reel', 'carrossel', 'anúncio']) {
      expect(catalog.queryDeliverable(term, {root})).toMatchObject({
        status: 'resolved-navigation', expertisePromotion: false,
        canonical: {taskPath: expect.any(String), taskSha256: expect.stringMatching(/^[a-f0-9]{64}$/)},
      });
    }
  });
});

describe('canonical command task aliases cannot escape their declared editorial domain', () => {
  let temporary;
  const put = (relative, text) => {
    const file = path.join(temporary, relative);
    fs.mkdirSync(path.dirname(file), {recursive: true});
    fs.writeFileSync(file, text);
  };
  const source = task => 'commands:\n  - name: "*analyze-performance"\n    task: "' + task + '"\n';
  beforeEach(() => {
    temporary = fs.mkdtempSync(path.join(os.tmpdir(), 'operational-contract '));
    put('.codex/agents/content-analyst.md', 'Read the agent definition at: squads/squad-content/agents/content-analyst.md\nSquad: squad-content\n');
    put('squads/squad-content/agents/content-analyst.md', source('analyze-content-performance'));
    put('squads/squad-content/tasks/analyze-content-performance.md', '---\ntask: analyze-content-performance\nresponsavel: "@content-analyst"\n---\nMetrics for actual published editorial content.\n');
    // A colliding core task remains available to other owners but is not chosen.
    put('.sinapse-ai/development/tasks/analyze-performance.md', 'SQL EXPLAIN/hotpaths; not content analytics.\n');
  });
  afterEach(() => {
    const resolved = path.resolve(temporary);
    expect(resolved.startsWith(path.resolve(os.tmpdir()) + path.sep)).toBe(true);
    fs.rmSync(resolved, {recursive: true, force: true});
  });

  test('all 172 native definitions and core legacy syntax remain available', () => {
    const definitions = nativeAdapters.collectNativeAgentDefinitions(root);
    expect(definitions).toHaveLength(172);
    expect(new Set(definitions.map(definition => definition.id)).size).toBe(172);
    for (const definition of definitions) {
      expect(resolver.resolveCodexAgent(definition.id, root).sourceOfTruth).toBe(definition.sourcePath);
    }
    const core = resolver.resolveCodexAgent('squad-creator', root);
    expect(core.taskCount).toBeGreaterThan(0);
    expect(core.tasks.every(task => task.scope !== 'declared-binding')).toBe(true);
  });

  test.each([
    ['content-analyst', 'analyze-performance', 'analyze-content-performance'],
    ['content-analyst', 'analyze-content-performance', 'analyze-content-performance'],
    ['editorial-strategist', 'create-calendar', 'create-editorial-calendar'],
    ['editorial-strategist', 'create-editorial-calendar', 'create-editorial-calendar'],
  ])('real %s/%s preserves alias and resolves its exact squad task', (agentId, command, task) => {
    const resolved = commands.resolveCodexCommand(agentId, command, root);
    expect(resolved.target).toBe('squads/squad-content/tasks/' + task + '.md');
    expect(resolved.target.startsWith('.sinapse-ai/')).toBe(false);
  });

  test('same-named SQL task cannot replace an explicit content target', () => {
    for (const command of ['analyze-performance', 'analyze-content-performance']) {
      expect(resolver.resolveCodexAgentCommand('content-analyst', command, temporary).target)
        .toBe('squads/squad-content/tasks/analyze-content-performance.md');
    }
  });

  test('wrong-owner target rejects instead of falling back to SQL', () => {
    put('squads/squad-content/tasks/analyze-content-performance.md', '---\ntask: analyze-content-performance\nresponsavel: "@editorial-strategist"\n---\n');
    expect(() => resolver.resolveCodexAgentCommand('content-analyst', 'analyze-performance', temporary))
      .toThrow('task/owner');
  });

  test('wrong task ID or absent explicit file rejects before generic fallback', () => {
    put('squads/squad-content/tasks/analyze-content-performance.md', '---\ntask: analyze-performance\nresponsavel: "@content-analyst"\n---\n');
    expect(() => resolver.resolveCodexAgentCommand('content-analyst', 'analyze-performance', temporary))
      .toThrow('task/owner');
    put('squads/squad-content/agents/content-analyst.md', source('nonexistent-content-task'));
    expect(() => resolver.resolveCodexAgentCommand('content-analyst', 'analyze-performance', temporary))
      .toThrow('task/owner');
  });

  test('traversal, duplicate command task and a task without command are rejected', () => {
    for (const text of [
      source('../development/tasks/analyze-performance'),
      source('analyze-content-performance') + '    task: "another-task"\n',
      'commands:\n    task: "analyze-content-performance"\n',
    ]) expect(() => resolver.extractDeclaredCommandBindings(text)).toThrow('explicit');
    expect(resolver.extractDeclaredCommandBindings(source('analyze-content-performance') + '\nintegration:\n  task: unrelated\n'))
      .toEqual([{command: 'analyze-performance', task: 'analyze-content-performance'}]);
  });
});
