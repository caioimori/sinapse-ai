'use strict';

const fs = require('fs');
const path = require('path');

const {
  syncClaudeNative,
  syncProviderAdapters,
} = require('../../scripts/sync-provider-adapters');
const {
  validateClaudeNative,
  validateProviderAdapters,
} = require('../../scripts/validate-provider-adapters');
const { resolveCodexAgent } = require('../../.codex/scripts/resolve-codex-agent');

const PROJECT_ROOT = path.resolve(__dirname, '..', '..');

describe('cross-provider native adapters', () => {
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
    const manifest = JSON.parse(fs.readFileSync(path.join(PROJECT_ROOT, '.claude', 'skill-manifest.json'), 'utf8'));
    expect(manifest.skillIds).toHaveLength(37);
    expect(manifest.optionalSkillIds).toEqual(['sinapse-project-expert']);
    expect(fs.readFileSync(path.join(PROJECT_ROOT, '.claude', 'skills', 'sinapse-project-expert', 'SKILL.md')))
      .toEqual(fs.readFileSync(path.join(PROJECT_ROOT, '.agents', 'skills', 'sinapse-project-expert', 'SKILL.md')));
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
