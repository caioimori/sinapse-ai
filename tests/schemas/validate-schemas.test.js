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
const fs = require('fs');
const os = require('os');
const path = require('path');

const REPO_ROOT = path.resolve(__dirname, '..', '..');

// Artifact validation (layer 3) scans docs/stories|epics|prd, which are
// gitignored and therefore empty in CI but commonly populated on a developer's
// machine. To keep this gate hermetic — asserting schema soundness, not the
// state of someone's local working tree — point the validator at a throwaway
// empty directory via its built-in `--artifacts=<dir>` flag. Behaviour in CI is
// identical (artifacts were already a clean no-op there).
let EMPTY_ARTIFACTS_DIR;

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
  beforeAll(() => {
    EMPTY_ARTIFACTS_DIR = fs.mkdtempSync(path.join(os.tmpdir(), 'sinapse-schemas-'));
  });

  afterAll(() => {
    if (EMPTY_ARTIFACTS_DIR) {
      fs.rmSync(EMPTY_ARTIFACTS_DIR, { recursive: true, force: true });
    }
  });

  test('meta-validation: every *.schema.json compiles, known kinds covered (exit 0)', () => {
    const r = runNode('validate-schemas.js', [`--artifacts=${EMPTY_ARTIFACTS_DIR}`]);
    expect(r.stdout).toMatch(/all schemas compile, all known kinds covered, all artifacts valid/);
    expect(r.stdout).toMatch(/schemas checked\s*:/);
    expect(r.stdout).toMatch(/kinds covered\s*:/);
    expect(r.code).toBe(0);
  }, 30000);

  test('artifacts are a clean no-op when absent (skipped, not a failure)', () => {
    const r = runNode('validate-schemas.js', ['--quiet', `--artifacts=${EMPTY_ARTIFACTS_DIR}`]);
    expect(r.stdout).toMatch(/artifacts\s*:\s*0 artifacts found \(skipped\)/);
    expect(r.code).toBe(0);
  }, 30000);
});
