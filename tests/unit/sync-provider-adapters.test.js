'use strict';

const fs = require('fs');
const path = require('path');

const {
  syncClaudeNative,
  syncProviderAdapters,
  collectClaudeSkills,
} = require('../../scripts/sync-provider-adapters');
const { collectCodexActivationSkills } = require('../../.codex/scripts/sync-codex-native');
const {
  validateClaudeNative,
  validateProviderAdapters,
} = require('../../scripts/validate-provider-adapters');
const { resolveCodexAgent } = require('../../.codex/scripts/resolve-codex-agent');

const PROJECT_ROOT = path.resolve(__dirname, '..', '..');

describe('cross-provider native adapters', () => {
  it('preserves the engineering workflow contract in both providers', () => {
    const claude = collectClaudeSkills(PROJECT_ROOT).find((skill) => skill.skillId === 'sinapse-engineering');
    const codex = collectCodexActivationSkills(PROJECT_ROOT).find((skill) => skill.skillId === 'sinapse-engineering');
    expect(claude.content).toBe(codex.content);
    expect(claude.content).toContain('node bin/engineering-workflows.js');
    expect(claude.content).toContain('não prova correção semântica');
  });

  it('keeps the Claude renderer deterministic and complete', () => {
    const first = syncClaudeNative(PROJECT_ROOT);
    const second = syncClaudeNative(PROJECT_ROOT);
    expect(first.agents.total).toBe(172);
    expect(first.skills.total).toBe(38);
    expect(second).toMatchObject({
      agents: { updated: 0, unchanged: 172 },
      skills: { updated: 0, unchanged: 38 },
    });
    expect(validateClaudeNative(PROJECT_ROOT)).toMatchObject({ ok: true, errors: [] });
  });

  it('resolves Claude mastery to the declared entry agent, not swarm', () => {
    expect(resolveCodexAgent('sinapse-claude', PROJECT_ROOT).agentId).toBe('claude-mastery-chief');
    expect(resolveCodexAgent('sinapse-swarm', PROJECT_ROOT).agentId).toBe('swarm-orqx');
    const skill = fs.readFileSync(
      path.join(PROJECT_ROOT, '.claude', 'skills', 'sinapse-claude', 'SKILL.md'),
      'utf8',
    );
    expect(skill).toContain('claude-mastery-chief.md');
    expect(skill).not.toContain('swarm-orqx.md');
  });

  it('synchronizes and validates both provider surfaces together', () => {
    const result = syncProviderAdapters(PROJECT_ROOT);
    expect(result.codex.total).toBe(172);
    expect(result.claude.agents.total).toBe(172);
    expect(validateProviderAdapters(PROJECT_ROOT)).toMatchObject({ ok: true, errors: [] });
  });
});
