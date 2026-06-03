'use strict';

/**
 * Schema Validation GATE — CI wrapper
 *
 * Puts the schema meta-validation into the main jest suite so `npm test` (and
 * therefore CI) fails when:
 *   - any *.schema.json in the repo fails to compile (invalid JSON, broken
 *     $ref, invalid meta-schema), or
 *   - a known engine template kind has no schema, or
 *   - a present artifact (docs/stories, docs/epics, docs/prd) is invalid.
 *
 * In public CI there are no artifacts (docs/stories + docs/epics are gitignored),
 * so layer 3 is a clean no-op and this gate asserts the schemas themselves are
 * sound — exactly the value the meta-validation adds.
 *
 * The gate is spawned as a child process (it calls process.exit); its exit code
 * is the assertion. Mirrors tests/evals/eval-harness.test.js.
 */

const { execFileSync } = require('child_process');
const path = require('path');

const REPO_ROOT = path.resolve(__dirname, '..', '..');

function runNode(script, args = []) {
  try {
    const stdout = execFileSync('node', [path.join('scripts', script), ...args], {
      cwd: REPO_ROOT,
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'pipe'],
    });
    return { code: 0, stdout };
  } catch (err) {
    return {
      code: typeof err.status === 'number' ? err.status : 1,
      stdout: (err.stdout || '').toString(),
      stderr: (err.stderr || '').toString(),
    };
  }
}

describe('schema validation gate', () => {
  test('meta-validation: every *.schema.json compiles, known kinds covered (exit 0)', () => {
    const r = runNode('validate-schemas.js');
    expect(r.stdout).toMatch(/all schemas compile, all known kinds covered, all artifacts valid/);
    expect(r.stdout).toMatch(/schemas checked\s*:/);
    expect(r.stdout).toMatch(/kinds covered\s*:/);
    expect(r.code).toBe(0);
  }, 30000);

  test('artifacts are a clean no-op when absent (skipped, not a failure)', () => {
    const r = runNode('validate-schemas.js', ['--quiet']);
    expect(r.stdout).toMatch(/artifacts\s*:\s*0 artifacts found \(skipped\)/);
    expect(r.code).toBe(0);
  }, 30000);
});
