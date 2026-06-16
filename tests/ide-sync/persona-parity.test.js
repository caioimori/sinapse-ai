/**
 * PARIDADE-IDE-002 — persona-renderer preserves the persona contract.
 *
 * These tests assert the role/identity/style/focus + core principles are
 * rendered into the shared persona block consumed by the IDE transformers.
 */

const {
  renderPersona,
  renderCorePrinciples,
} = require('../../.sinapse-ai/infrastructure/scripts/ide-sync/persona-renderer');

describe('persona-renderer', () => {
  test('renderCorePrinciples handles strings and {KEY: value} objects', () => {
    const md = renderCorePrinciples([
      'plain principle',
      { CRITICAL: 'do the thing' },
    ]);
    expect(md).toContain('- plain principle');
    expect(md).toContain('- **CRITICAL:** do the thing');
  });

  test('renderCorePrinciples caps the list', () => {
    const many = Array.from({ length: 30 }, (_, i) => `p${i}`);
    const md = renderCorePrinciples(many, 5);
    expect(md.split('\n').length).toBe(5);
  });

  test('renderPersona emits role/identity/style/focus when present', () => {
    const agentData = {
      yaml: {
        persona: {
          role: 'Senior Engineer',
          identity: 'Implements stories',
          style: 'concise',
          focus: 'precision',
        },
        core_principles: [{ CRITICAL: 'test first' }],
      },
    };
    const md = renderPersona(agentData);
    expect(md).toContain('**Role:** Senior Engineer');
    expect(md).toContain('**Identity:** Implements stories');
    expect(md).toContain('**Style:** concise');
    expect(md).toContain('**Focus:** precision');
    expect(md).toContain('## Core Principles');
    expect(md).toContain('**CRITICAL:** test first');
  });

  test('renderPersona is empty for an agent without rich YAML', () => {
    expect(renderPersona({ yaml: {} })).toBe('');
    expect(renderPersona({})).toBe('');
  });
});

describe('claude-code transformer keeps the persona (PARIDADE-IDE-002)', () => {
  const path = require('path');
  const { parseAgentFile } = require('../../.sinapse-ai/infrastructure/scripts/ide-sync/agent-parser');
  const claudeCode = require('../../.sinapse-ai/infrastructure/scripts/ide-sync/transformers/claude-code');

  const DEV_AGENT = path.resolve(
    __dirname, '..', '..', '.sinapse-ai', 'development', 'agents', 'developer.md',
  );

  test('claude-code output includes role + identity + focus + core principles', () => {
    const r = parseAgentFile(DEV_AGENT);
    const out = claudeCode.transform(r);
    // claude-code is an identity transform: the full agent definition (with the
    // persona YAML + body) reaches the IDE verbatim.
    expect(/Role|role:/i.test(out)).toBe(true);
    expect(out).toMatch(/Identity|identity:/i);
    expect(out).toMatch(/Focus|focus:/i);
    expect(out).toMatch(/Core Principles|core_principles:/i);
    expect(out.length).toBeGreaterThan(1200);
  });
});
