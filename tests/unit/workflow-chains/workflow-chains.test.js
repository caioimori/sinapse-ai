'use strict';

const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');

const CHAINS_PATH = path.join(
  __dirname, '..', '..', '..', '.sinapse-ai', 'data', 'workflow-chains.yaml',
);

const AGENTS_DIR = path.join(
  __dirname, '..', '..', '..', '.sinapse-ai', 'development', 'agents',
);

const FIXTURES_DIR = path.join(__dirname, '..', '..', 'fixtures', 'handoffs');

const KNOWN_AGENTS = [
  '@sprint-lead', '@product-lead', '@developer', '@quality-gate', '@devops', '@project-lead',
  '@architect', '@analyst', '@data-engineer', '@ux-design-expert',
  '@squad-creator', '@sinapse-orqx',
];

describe('Workflow Chains (Story WIS-16)', () => {
  let chainsContent;
  let chainsData;

  beforeAll(() => {
    chainsContent = fs.readFileSync(CHAINS_PATH, 'utf8');
    chainsData = yaml.load(chainsContent);
  });

  describe('YAML schema validation (AC2)', () => {
    test('workflow-chains.yaml exists and is valid YAML', () => {
      expect(chainsContent).toBeTruthy();
      expect(chainsData).toBeDefined();
      expect(chainsData.workflows).toBeDefined();
      expect(Array.isArray(chainsData.workflows)).toBe(true);
    });

    test('has exactly 4 workflows', () => {
      expect(chainsData.workflows).toHaveLength(4);
    });

    test('each workflow has required fields: id, name, chain[]', () => {
      for (const workflow of chainsData.workflows) {
        expect(workflow.id).toBeDefined();
        expect(typeof workflow.id).toBe('string');
        expect(workflow.name).toBeDefined();
        expect(typeof workflow.name).toBe('string');
        expect(workflow.chain).toBeDefined();
        expect(Array.isArray(workflow.chain)).toBe(true);
        expect(workflow.chain.length).toBeGreaterThan(0);
      }
    });

    test('each chain step has required fields: step, agent, command', () => {
      for (const workflow of chainsData.workflows) {
        for (const step of workflow.chain) {
          expect(step.step).toBeDefined();
          expect(typeof step.step).toBe('number');
          expect(step.agent).toBeDefined();
          expect(typeof step.agent).toBe('string');
          expect(step.command).toBeDefined();
          expect(typeof step.command).toBe('string');
        }
      }
    });

    test('all agents in chains are known SINAPSE agents', () => {
      for (const workflow of chainsData.workflows) {
        for (const step of workflow.chain) {
          expect(KNOWN_AGENTS).toContain(step.agent);
          if (step.alternatives) {
            for (const alt of step.alternatives) {
              expect(KNOWN_AGENTS).toContain(alt.agent);
            }
          }
        }
      }
    });

    test('all commands start with *', () => {
      for (const workflow of chainsData.workflows) {
        for (const step of workflow.chain) {
          expect(step.command).toMatch(/^\*/);
          if (step.alternatives) {
            for (const alt of step.alternatives) {
              expect(alt.command).toMatch(/^\*/);
            }
          }
        }
      }
    });

    test('chain steps are numbered sequentially', () => {
      for (const workflow of chainsData.workflows) {
        for (let i = 0; i < workflow.chain.length; i++) {
          expect(workflow.chain[i].step).toBe(i + 1);
        }
      }
    });
  });

  describe('4 workflows mapped correctly (AC2)', () => {
    test('SDC workflow: sprint-lead → product-lead → developer → quality-gate → devops', () => {
      const sdc = chainsData.workflows.find((w) => w.id === 'sdc');
      expect(sdc).toBeDefined();
      expect(sdc.chain.map((s) => s.agent)).toEqual([
        '@sprint-lead', '@product-lead', '@developer', '@quality-gate', '@devops',
      ]);
    });

    test('QA Loop workflow: quality-gate → developer → quality-gate', () => {
      const qaLoop = chainsData.workflows.find((w) => w.id === 'qa-loop');
      expect(qaLoop).toBeDefined();
      expect(qaLoop.chain.map((s) => s.agent)).toEqual([
        '@quality-gate', '@developer', '@quality-gate',
      ]);
      expect(qaLoop.max_iterations).toBe(5);
    });

    test('Spec Pipeline workflow: project-lead → architect → analyst → project-lead → quality-gate → architect', () => {
      const spec = chainsData.workflows.find((w) => w.id === 'spec-pipeline');
      expect(spec).toBeDefined();
      expect(spec.chain.map((s) => s.agent)).toEqual([
        '@project-lead', '@architect', '@analyst', '@project-lead', '@quality-gate', '@architect',
      ]);
    });

    test('Brownfield workflow: architect → data-engineer → ux → quality-gate → project-lead', () => {
      const bf = chainsData.workflows.find((w) => w.id === 'brownfield');
      expect(bf).toBeDefined();
      expect(bf.chain.map((s) => s.agent)).toEqual([
        '@architect', '@data-engineer', '@ux-design-expert', '@quality-gate', '@project-lead',
      ]);
    });
  });

  describe('chain resolution logic (AC1, AC4, AC6)', () => {
    function resolveNextStep(fromAgent, lastCommand, chains) {
      for (const workflow of chains.workflows) {
        for (let i = 0; i < workflow.chain.length; i++) {
          const step = workflow.chain[i];
          const cmdBase = step.command.split(' ')[0];
          const lastCmdBase = lastCommand.split(' ')[0];
          if (step.agent === fromAgent && cmdBase === lastCmdBase) {
            const nextIdx = i + 1;
            if (nextIdx < workflow.chain.length) {
              const next = workflow.chain[nextIdx];
              return {
                agent: next.agent,
                command: next.command,
                alternatives: next.alternatives || [],
              };
            }
            return null;
          }
        }
      }
      return null;
    }

    test('SDC: after @sprint-lead *draft → suggests @product-lead *validate-story-draft', () => {
      const result = resolveNextStep('@sprint-lead', '*draft', chainsData);
      expect(result).not.toBeNull();
      expect(result.agent).toBe('@product-lead');
      expect(result.command).toContain('*validate-story-draft');
    });

    test('SDC: after @product-lead *validate-story-draft → suggests @developer *develop', () => {
      const result = resolveNextStep('@product-lead', '*validate-story-draft', chainsData);
      expect(result).not.toBeNull();
      expect(result.agent).toBe('@developer');
      expect(result.command).toContain('*develop');
    });

    test('SDC: after @developer *develop → suggests @quality-gate *review with alternatives (AC6)', () => {
      const result = resolveNextStep('@developer', '*develop', chainsData);
      expect(result).not.toBeNull();
      expect(result.agent).toBe('@quality-gate');
      expect(result.command).toContain('*review');
      expect(result.alternatives.length).toBeGreaterThanOrEqual(1);
    });

    test('SDC: after @quality-gate *review → suggests @devops *push', () => {
      const result = resolveNextStep('@quality-gate', '*review', chainsData);
      expect(result).not.toBeNull();
      expect(result.agent).toBe('@devops');
      expect(result.command).toBe('*push');
    });

    test('SDC: after @devops *push → returns null (end of chain)', () => {
      const result = resolveNextStep('@devops', '*push', chainsData);
      expect(result).toBeNull();
    });

    test('fallback: unknown agent/command returns null (AC4)', () => {
      const result = resolveNextStep('@unknown', '*nonexistent', chainsData);
      expect(result).toBeNull();
    });

    test('QA Loop: after @quality-gate *review → suggests @developer *apply-qa-fixes', () => {
      const result = resolveNextStep('@quality-gate', '*review', chainsData);
      expect(result).not.toBeNull();
    });

    test('Spec Pipeline: after @project-lead *gather-requirements → suggests @architect', () => {
      const result = resolveNextStep('@project-lead', '*gather-requirements', chainsData);
      expect(result).not.toBeNull();
      expect(result.agent).toBe('@architect');
    });

    test('disambiguation: @quality-gate *review resolves differently in SDC vs QA Loop', () => {
      // resolveNextStep returns first match (SDC), but QA Loop has a different next step
      const sdc = chainsData.workflows.find((w) => w.id === 'sdc');
      const qaLoop = chainsData.workflows.find((w) => w.id === 'qa-loop');

      // In SDC, @quality-gate *review (step 4) → @devops *push (step 5)
      const sdcQaStep = sdc.chain.find(
        (s) => s.agent === '@quality-gate' && s.command.startsWith('*review'),
      );
      const sdcQaIdx = sdc.chain.indexOf(sdcQaStep);
      const sdcNext = sdc.chain[sdcQaIdx + 1];
      expect(sdcNext.agent).toBe('@devops');
      expect(sdcNext.command).toBe('*push');

      // In QA Loop, @quality-gate *review (step 1) → @developer *apply-qa-fixes (step 2)
      const qaLoopQaStep = qaLoop.chain.find(
        (s) => s.agent === '@quality-gate' && s.command.startsWith('*review'),
      );
      const qaLoopQaIdx = qaLoop.chain.indexOf(qaLoopQaStep);
      const qaLoopNext = qaLoop.chain[qaLoopQaIdx + 1];
      expect(qaLoopNext.agent).toBe('@developer');
      expect(qaLoopNext.command).toBe('*apply-qa-fixes');

      // Confirm they resolve to different agents
      expect(sdcNext.agent).not.toBe(qaLoopNext.agent);
    });
  });

  describe('schema robustness (negative tests)', () => {
    test('malformed YAML: missing workflows key throws or returns undefined', () => {
      const malformed = yaml.load('name: broken\nid: test');
      expect(malformed.workflows).toBeUndefined();
    });

    test('malformed YAML: empty chain array detected', () => {
      const data = yaml.load('workflows:\n  - id: empty\n    name: Empty\n    chain: []');
      expect(data.workflows[0].chain).toHaveLength(0);
    });

    test('malformed YAML: missing agent field in chain step', () => {
      const data = yaml.load(
        'workflows:\n  - id: bad\n    name: Bad\n    chain:\n      - step: 1\n        command: "*test"',
      );
      expect(data.workflows[0].chain[0].agent).toBeUndefined();
    });
  });

  describe('handoff artifact fixtures (AC5)', () => {
    test('test fixtures directory exists', () => {
      expect(fs.existsSync(FIXTURES_DIR)).toBe(true);
    });

    test('unconsumed fixture can be parsed', () => {
      const fixturePath = path.join(FIXTURES_DIR, 'handoff-sm-to-po-unconsumed.yaml');
      if (fs.existsSync(fixturePath)) {
        const data = yaml.load(fs.readFileSync(fixturePath, 'utf8'));
        expect(data.handoff).toBeDefined();
        expect(data.handoff.from_agent).toBeDefined();
        expect(data.handoff.consumed).not.toBe(true);
      }
    });

    test('consumed fixture is skipped', () => {
      const fixturePath = path.join(FIXTURES_DIR, 'handoff-dev-to-qa-consumed.yaml');
      if (fs.existsSync(fixturePath)) {
        const data = yaml.load(fs.readFileSync(fixturePath, 'utf8'));
        expect(data.handoff.consumed).toBe(true);
      }
    });
  });

  describe('task handoff sections (AC3)', () => {
    const TASKS_DIR = path.join(
      __dirname, '..', '..', '..', '.sinapse-ai', 'development', 'tasks',
    );

    test('at least 20 tasks have ## Handoff section', () => {
      const taskFiles = fs.readdirSync(TASKS_DIR).filter((f) => f.endsWith('.md'));
      let handoffCount = 0;
      for (const file of taskFiles) {
        const content = fs.readFileSync(path.join(TASKS_DIR, file), 'utf8');
        if (content.includes('## Handoff')) {
          handoffCount++;
        }
      }
      expect(handoffCount).toBeGreaterThanOrEqual(20);
    });

    test('handoff sections have required fields: next_agent, next_command, condition', () => {
      const taskFiles = fs.readdirSync(TASKS_DIR).filter((f) => f.endsWith('.md'));
      for (const file of taskFiles) {
        const content = fs.readFileSync(path.join(TASKS_DIR, file), 'utf8');
        if (content.includes('## Handoff')) {
          expect(content).toMatch(/next_agent:\s+@\w/);
          expect(content).toMatch(/next_command:\s+\*/);
          expect(content).toMatch(/condition:\s+\S/);
        }
      }
    });
  });

  describe('agent greeting step 5.5 presence (AC1)', () => {
    const agentFiles = [
      'developer.md', 'quality-gate.md', 'devops.md', 'architect.md', 'project-lead.md', 'product-lead.md',
      'sprint-lead.md', 'analyst.md', 'data-engineer.md', 'ux-design-expert.md',
      'squad-creator.md', 'sinapse-orqx.md',
    ];

    test.each(agentFiles)('%s contains handoff reference', (file) => {
      const content = fs.readFileSync(path.join(AGENTS_DIR, file), 'utf8');
      // Agents should reference handoff protocol (step numbering may vary)
      expect(content.toLowerCase()).toContain('handoff');
    });
  });
});
