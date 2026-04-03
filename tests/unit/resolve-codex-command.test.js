'use strict';

const fs = require('fs');
const os = require('os');
const path = require('path');

const {
  resolveCodexCommand,
} = require('../../.codex/scripts/resolve-codex-command');

describe('resolve-codex-command', () => {
  let tmpRoot;

  beforeEach(() => {
    tmpRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'sinapse-resolve-codex-command-'));
    fs.mkdirSync(path.join(tmpRoot, '.codex'), { recursive: true });
    fs.writeFileSync(
      path.join(tmpRoot, '.codex', 'command-registry.json'),
      JSON.stringify({
        version: 1,
        agents: {
          'sinapse-dev': {
            skillId: 'sinapse-dev',
            aliases: ['dev', 'developer'],
            sourceOfTruth: '.codex/agents/dev.md',
            commands: {
              develop: {
                aliases: ['*develop'],
                kind: 'task',
                target: '.sinapse-ai/development/tasks/dev-develop-story.md',
                resources: ['.sinapse-ai/product/checklists/story-dod-checklist.md'],
              },
            },
          },
        },
      }),
      'utf8',
    );
  });

  afterEach(() => {
    fs.rmSync(tmpRoot, { recursive: true, force: true });
  });

  it('resolves a command by agent alias and starred command alias', () => {
    const result = resolveCodexCommand('developer', '*develop', tmpRoot);

    expect(result.agentId).toBe('sinapse-dev');
    expect(result.commandId).toBe('develop');
    expect(result.target).toBe('.sinapse-ai/development/tasks/dev-develop-story.md');
  });

  it('throws when agent is unknown', () => {
    expect(() => resolveCodexCommand('unknown', 'develop', tmpRoot)).toThrow('Unknown Codex agent');
  });

  it('throws when command is unknown for a known agent', () => {
    expect(() => resolveCodexCommand('sinapse-dev', 'unknown', tmpRoot)).toThrow('Unknown Codex command');
  });
});
