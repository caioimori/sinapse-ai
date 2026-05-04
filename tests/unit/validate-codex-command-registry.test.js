'use strict';

const fs = require('fs');
const os = require('os');
const path = require('path');

const {
  REQUIRED_COMMAND_COVERAGE,
  validateCodexCommandRegistry,
} = require('../../.sinapse-ai/infrastructure/scripts/validate-codex-command-registry');

describe('validate-codex-command-registry', () => {
  let tmpRoot;
  const devCoverage = { 'sinapse-dev': ['develop'] };

  beforeEach(() => {
    tmpRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'sinapse-validate-codex-command-registry-'));
  });

  afterEach(() => {
    fs.rmSync(tmpRoot, { recursive: true, force: true });
  });

  function write(relativePath, content = '# file') {
    const filePath = path.join(tmpRoot, relativePath);
    fs.mkdirSync(path.dirname(filePath), { recursive: true });
    fs.writeFileSync(filePath, content, 'utf8');
  }

  it('passes when registry targets and resources exist', () => {
    write('.codex/skills/sinapse-dev/SKILL.md');
    write('.codex/agents/dev.md');
    write('.sinapse-ai/development/tasks/dev-develop-story.md');
    write('.sinapse-ai/product/checklists/story-dod-checklist.md');
    write(
      '.codex/command-registry.json',
      JSON.stringify({
        version: 1,
        agents: {
          'sinapse-dev': {
            skillId: 'sinapse-dev',
            sourceOfTruth: '.codex/agents/dev.md',
            commands: {
              develop: {
                kind: 'task',
                target: '.sinapse-ai/development/tasks/dev-develop-story.md',
                resources: ['.sinapse-ai/product/checklists/story-dod-checklist.md'],
              },
            },
          },
        },
      }),
    );

    const result = validateCodexCommandRegistry({
      projectRoot: tmpRoot,
      requiredCoverage: devCoverage,
    });

    expect(result.ok).toBe(true);
    expect(result.metrics.agents).toBe(1);
    expect(result.metrics.commands).toBe(1);
  });

  it('fails when a command target is missing', () => {
    write('.codex/skills/sinapse-dev/SKILL.md');
    write('.codex/agents/dev.md');
    write(
      '.codex/command-registry.json',
      JSON.stringify({
        version: 1,
        agents: {
          'sinapse-dev': {
            skillId: 'sinapse-dev',
            sourceOfTruth: '.codex/agents/dev.md',
            commands: {
              develop: {
                kind: 'task',
                target: '.sinapse-ai/development/tasks/dev-develop-story.md',
                resources: [],
              },
            },
          },
        },
      }),
    );

    const result = validateCodexCommandRegistry({
      projectRoot: tmpRoot,
      requiredCoverage: devCoverage,
    });

    expect(result.ok).toBe(false);
    expect(result.errors.some((error) => error.includes('missing target'))).toBe(true);
  });

  it('fails when a declared resource is missing', () => {
    write('.codex/skills/sinapse-dev/SKILL.md');
    write('.codex/agents/dev.md');
    write('.sinapse-ai/development/tasks/dev-develop-story.md');
    write(
      '.codex/command-registry.json',
      JSON.stringify({
        version: 1,
        agents: {
          'sinapse-dev': {
            skillId: 'sinapse-dev',
            sourceOfTruth: '.codex/agents/dev.md',
            commands: {
              develop: {
                kind: 'task',
                target: '.sinapse-ai/development/tasks/dev-develop-story.md',
                resources: ['.sinapse-ai/product/checklists/story-dod-checklist.md'],
              },
            },
          },
        },
      }),
    );

    const result = validateCodexCommandRegistry({
      projectRoot: tmpRoot,
      requiredCoverage: devCoverage,
    });

    expect(result.ok).toBe(false);
    expect(result.errors.some((error) => error.includes('missing resource'))).toBe(true);
  });

  it('fails when the mapped skill or source file is missing', () => {
    write('.sinapse-ai/development/tasks/dev-develop-story.md');
    write(
      '.codex/command-registry.json',
      JSON.stringify({
        version: 1,
        agents: {
          'sinapse-dev': {
            skillId: 'sinapse-dev',
            sourceOfTruth: '.codex/agents/dev.md',
            commands: {
              develop: {
                kind: 'task',
                target: '.sinapse-ai/development/tasks/dev-develop-story.md',
                resources: [],
              },
            },
          },
        },
      }),
    );

    const result = validateCodexCommandRegistry({
      projectRoot: tmpRoot,
      requiredCoverage: devCoverage,
    });

    expect(result.ok).toBe(false);
    expect(result.errors.some((error) => error.includes('missing skill file'))).toBe(true);
    expect(result.errors.some((error) => error.includes('missing source of truth'))).toBe(true);
  });

  it('fails when required coverage is missing', () => {
    write('.codex/skills/sinapse-dev/SKILL.md');
    write('.codex/agents/dev.md');
    write('.sinapse-ai/development/tasks/dev-develop-story.md');
    write(
      '.codex/command-registry.json',
      JSON.stringify({
        version: 1,
        agents: {
          'sinapse-dev': {
            skillId: 'sinapse-dev',
            sourceOfTruth: '.codex/agents/dev.md',
            commands: {
              develop: {
                kind: 'task',
                target: '.sinapse-ai/development/tasks/dev-develop-story.md',
                resources: [],
              },
            },
          },
        },
      }),
    );

    const result = validateCodexCommandRegistry({
      projectRoot: tmpRoot,
      requiredCoverage: { 'sinapse-dev': ['develop', 'run-tests'] },
    });

    expect(result.ok).toBe(false);
    expect(result.errors).toContain('sinapse-dev: missing required command coverage for run-tests');
  });

  it('fails when agent aliases collide', () => {
    write('.codex/skills/sinapse-dev/SKILL.md');
    write('.codex/skills/sinapse-qa/SKILL.md');
    write('.codex/agents/dev.md');
    write('.codex/agents/qa.md');
    write('.sinapse-ai/development/tasks/dev-develop-story.md');
    write('.sinapse-ai/development/tasks/qa-run-tests.md');
    write(
      '.codex/command-registry.json',
      JSON.stringify({
        version: 1,
        agents: {
          'sinapse-dev': {
            skillId: 'sinapse-dev',
            aliases: ['builder'],
            sourceOfTruth: '.codex/agents/dev.md',
            commands: {
              develop: {
                kind: 'task',
                target: '.sinapse-ai/development/tasks/dev-develop-story.md',
                resources: [],
              },
            },
          },
          'sinapse-qa': {
            skillId: 'sinapse-qa',
            aliases: ['builder'],
            sourceOfTruth: '.codex/agents/qa.md',
            commands: {
              'run-tests': {
                kind: 'task',
                target: '.sinapse-ai/development/tasks/qa-run-tests.md',
                resources: [],
              },
            },
          },
        },
      }),
    );

    const result = validateCodexCommandRegistry({
      projectRoot: tmpRoot,
      requiredCoverage: {
        'sinapse-dev': ['develop'],
        'sinapse-qa': ['run-tests'],
      },
    });

    expect(result.ok).toBe(false);
    expect(result.errors.some((error) => error.includes('duplicate agent alias'))).toBe(true);
  });

  it('fails when command aliases collide inside an agent', () => {
    write('.codex/skills/sinapse-dev/SKILL.md');
    write('.codex/agents/dev.md');
    write('.sinapse-ai/development/tasks/dev-develop-story.md');
    write('.sinapse-ai/development/tasks/qa-run-tests.md');
    write(
      '.codex/command-registry.json',
      JSON.stringify({
        version: 1,
        agents: {
          'sinapse-dev': {
            skillId: 'sinapse-dev',
            sourceOfTruth: '.codex/agents/dev.md',
            commands: {
              develop: {
                aliases: ['*build'],
                kind: 'task',
                target: '.sinapse-ai/development/tasks/dev-develop-story.md',
                resources: [],
              },
              build: {
                aliases: ['*build'],
                kind: 'task',
                target: '.sinapse-ai/development/tasks/qa-run-tests.md',
                resources: [],
              },
            },
          },
        },
      }),
    );

    const result = validateCodexCommandRegistry({
      projectRoot: tmpRoot,
      requiredCoverage: { 'sinapse-dev': ['develop', 'build'] },
    });

    expect(result.ok).toBe(false);
    expect(result.errors.some((error) => error.includes('duplicate command alias'))).toBe(true);
  });

  it('exports the default required coverage contract', () => {
    expect(REQUIRED_COMMAND_COVERAGE['sinapse-orqx']).toEqual(
      expect.arrayContaining(['onboard', 'brief', 'resolve', 'council']),
    );
    expect(REQUIRED_COMMAND_COVERAGE['sinapse-qa']).toEqual(
      expect.arrayContaining(['review', 'nfr-assess', 'console-check']),
    );
  });
});
