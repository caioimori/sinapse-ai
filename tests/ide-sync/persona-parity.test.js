/**
 * PARIDADE-IDE-002 — IDE stubs now preserve the persona contract.
 *
 * Before: cursor/antigravity emitted only name/title/whenToUse + commands
 * (~8% of the agent). These tests assert the role/identity/style/focus + core
 * principles now reach every IDE format.
 */

const path = require('path');
const {
  renderPersona,
  renderCorePrinciples,
} = require('../../.sinapse-ai/infrastructure/scripts/ide-sync/persona-renderer');
const { parseAgentFile } = require('../../.sinapse-ai/infrastructure/scripts/ide-sync/agent-parser');

const DEV_AGENT = path.resolve(
  __dirname, '..', '..', '.sinapse-ai', 'development', 'agents', 'developer.md',
);

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

describe('IDE transformers keep the persona (PARIDADE-IDE-002)', () => {
  const r = parseAgentFile(DEV_AGENT);

  for (const t of ['cursor', 'antigravity', 'github-copilot']) {
    test(`${t} stub includes role + identity + focus + core principles`, () => {
      const transformer = require(`../../.sinapse-ai/infrastructure/scripts/ide-sync/transformers/${t}.js`);
      const out = transformer.transform(r);
      // Role appears either as "**Role:**" (cursor/antigravity) or "expert <role>" (copilot).
      expect(/Role|expert /i.test(out)).toBe(true);
      expect(out).toMatch(/Identity/i);
      expect(out).toMatch(/Focus/i);
      expect(out).toMatch(/Core Principles/i);
      // Materially richer than the old label-only stub.
      expect(out.length).toBeGreaterThan(1200);
    });
  }
});
