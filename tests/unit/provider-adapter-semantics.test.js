'use strict';

const fs = require('fs');
const os = require('os');
const path = require('path');

const {
  validateClaudeAliasTargets,
  validateClaudeHookSettings,
} = require('../../scripts/validate-provider-adapters');

describe('Claude provider semantic contracts', () => {
  let root;

  beforeEach(() => {
    root = fs.mkdtempSync(path.join(os.tmpdir(), 'sinapse-claude-semantics-'));
  });

  afterEach(() => fs.rmSync(root, { recursive: true, force: true }));

  function write(relativePath, content = '') {
    const filePath = path.join(root, relativePath);
    fs.mkdirSync(path.dirname(filePath), { recursive: true });
    fs.writeFileSync(filePath, content, 'utf8');
  }

  test('rejects an unregistered governance hook', () => {
    for (const hook of [
      'doc-first-gate.cjs',
      'enforce-delegation.cjs',
      'enforce-framework-boundary.cjs',
      'enforce-git-push-authority.sh',
      'verify-packages.cjs',
    ]) write(path.join('.claude', 'hooks', hook));
    write('.claude/settings.json', JSON.stringify({ hooks: {} }));

    expect(validateClaudeHookSettings(root)).toContain(
      'Claude governance hook is not registered: doc-first-gate.cjs',
    );
  });

  test('rejects a Claude installation without hook settings', () => {
    expect(validateClaudeHookSettings(root)).toEqual([
      'Claude hook settings are missing: expected .claude/settings.json or .claude/settings.local.json',
    ]);
  });

  test('aggregates hook registrations across both Claude settings files', () => {
    const hooks = [
      'doc-first-gate.cjs',
      'enforce-delegation.cjs',
      'enforce-framework-boundary.cjs',
      'enforce-git-push-authority.sh',
      'verify-packages.cjs',
    ];
    for (const hook of hooks) write(path.join('.claude', 'hooks', hook));
    const registration = (hook) => ({ hooks: [{ command: `node .claude/hooks/${hook}` }] });
    write('.claude/settings.json', JSON.stringify({ hooks: { PreToolUse: hooks.slice(0, 2).map(registration) } }));
    write('.claude/settings.local.json', JSON.stringify({ hooks: { PreToolUse: hooks.slice(2).map(registration) } }));

    expect(validateClaudeHookSettings(root)).toEqual([]);
  });

  test('rejects duplicate hook registrations across Claude settings files', () => {
    write(path.join('.claude', 'hooks', 'doc-first-gate.cjs'));
    const settings = { hooks: { PreToolUse: [{ hooks: [{ command: 'node .claude/hooks/doc-first-gate.cjs' }] }] } };
    write('.claude/settings.json', JSON.stringify(settings));
    write('.claude/settings.local.json', JSON.stringify(settings));

    expect(validateClaudeHookSettings(root).some((error) => error.startsWith(
      'Claude hook is registered more than once across settings: doc-first-gate.cjs',
    ))).toBe(true);
  });

  test('rejects a public alias with a divergent canonical target', () => {
    const canonical = [
      '# SINAPSE Claude Activation: sinapse-orqx',
      'Read `.sinapse-ai/development/agents/snps-orqx.md`.',
    ].join('\n');
    for (const alias of ['sinapse', 'sinapse-orqx', 'snps', 'snps-orqx']) {
      write(path.join('.claude', 'skills', alias, 'SKILL.md'), canonical);
    }
    write(
      path.join('.claude', 'skills', 'sinapse-agent', 'SKILL.md'),
      '# SINAPSE Parametric Agent Activator for Claude Code\nUse `.claude/agents/sinapse-*.md`.\n',
    );
    write(path.join('.claude', 'skills', 'snps', 'SKILL.md'), '# divergent target\n');

    expect(validateClaudeAliasTargets(root)).toContain(
      path.join('.claude', 'skills', 'snps', 'SKILL.md')
        + ' does not resolve to its canonical target',
    );
  });

  test('rejects a divergent parametric sinapse-agent alias', () => {
    const canonical = [
      '# SINAPSE Claude Activation: sinapse-orqx',
      'Read `.sinapse-ai/development/agents/snps-orqx.md`.',
    ].join('\n');
    for (const alias of ['sinapse', 'sinapse-orqx', 'snps', 'snps-orqx']) {
      write(path.join('.claude', 'skills', alias, 'SKILL.md'), canonical);
    }
    write(path.join('.claude', 'skills', 'sinapse-agent', 'SKILL.md'), '# wrong target\n');

    expect(validateClaudeAliasTargets(root)).toContain(
      path.join('.claude', 'skills', 'sinapse-agent', 'SKILL.md')
        + ' does not resolve to its canonical target',
    );
  });
});
