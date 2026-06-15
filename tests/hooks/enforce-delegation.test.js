/**
 * Tests for the Article VIII enforce-delegation hook.
 *
 * Proves the block logic is real and the active-agent signal works via
 * SINAPSE_ACTIVE_AGENT (audit 2026-06-11 — the hook was inert because nothing
 * populated the signal; the logic itself must be correct + testable).
 */

const path = require('path');
const { execFileSync } = require('child_process');

const HOOK = path.resolve(__dirname, '..', '..', '.claude', 'hooks', 'enforce-delegation.cjs');
const ROOT = path.resolve(__dirname, '..', '..');

/**
 * Run the hook with a given tool input and active-agent env signal.
 * @returns {{ code: number, stderr: string }}
 */
function runHook(toolInput, activeAgent) {
  const env = { ...process.env, CLAUDE_PROJECT_DIR: ROOT };
  if (activeAgent === undefined) delete env.SINAPSE_ACTIVE_AGENT;
  else env.SINAPSE_ACTIVE_AGENT = activeAgent;

  try {
    execFileSync('node', [HOOK], {
      input: JSON.stringify(toolInput),
      env,
      encoding: 'utf8',
      stdio: ['pipe', 'pipe', 'pipe'],
    });
    return { code: 0, stderr: '' };
  } catch (err) {
    return { code: err.status == null ? 1 : err.status, stderr: (err.stderr || '').toString() };
  }
}

describe('enforce-delegation hook (Article VIII)', () => {
  test('blocks an orchestrator from using Write (exit 2)', () => {
    const r = runHook(
      { tool_name: 'Write', tool_input: { file_path: 'src/app.js' } },
      'copy-orqx',
    );
    expect(r.code).toBe(2);
    expect(r.stderr).toMatch(/MANDATORY DELEGATION BLOCK/);
  });

  test('blocks an orchestrator from using Bash (exit 2)', () => {
    const r = runHook({ tool_name: 'Bash', tool_input: { command: 'ls' } }, 'design-orqx');
    expect(r.code).toBe(2);
  });

  test('allows a non-orchestrator agent (exit 0)', () => {
    const r = runHook({ tool_name: 'Write', tool_input: { file_path: 'src/app.js' } }, 'developer');
    expect(r.code).toBe(0);
  });

  test('fails open when no active-agent signal is present (exit 0)', () => {
    const r = runHook({ tool_name: 'Write', tool_input: { file_path: 'src/app.js' } }, undefined);
    expect(r.code).toBe(0);
  });

  test('does not intercept non-blocked tools (exit 0)', () => {
    const r = runHook({ tool_name: 'Read', tool_input: { file_path: 'src/app.js' } }, 'copy-orqx');
    expect(r.code).toBe(0);
  });

  describe('sinapse-orqx framework-governance exception', () => {
    test('allows sinapse-orqx to Write framework paths (exit 0)', () => {
      const r = runHook(
        { tool_name: 'Write', tool_input: { file_path: '.sinapse-ai/core/x.js' } },
        'sinapse-orqx',
      );
      expect(r.code).toBe(0);
    });

    test('blocks sinapse-orqx from Writing non-governance paths (exit 2)', () => {
      const r = runHook(
        { tool_name: 'Write', tool_input: { file_path: 'src/feature.js' } },
        'sinapse-orqx',
      );
      expect(r.code).toBe(2);
    });
  });
});
