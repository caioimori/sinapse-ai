/**
 * Regression guard for AF-20260629 finding #2.
 *
 * `.github/workflows/lint-guards.yml` shipped with a duplicated mapping key
 * (the "Cross-IDE Parity" block lost its job key, so its `name:`/`runs-on:`/
 * `steps:` collided with the previous job). js-yaml rejects that, so the
 * workflow failed 100% of the time in 0s and showed a red X publicly on GitHub
 * for days. This test turns that failure mode into a local + CI test failure
 * instead of a silently broken badge.
 *
 * @module tests/ci/github-workflows-syntax
 */

const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');

const WORKFLOWS_DIR = path.join(__dirname, '..', '..', '.github', 'workflows');

const workflowFiles = fs
  .readdirSync(WORKFLOWS_DIR)
  .filter((f) => /\.ya?ml$/.test(f));

describe('GitHub Actions workflows — YAML integrity', () => {
  it('finds at least one workflow file', () => {
    expect(workflowFiles.length).toBeGreaterThan(0);
  });

  it.each(workflowFiles)('%s parses as valid YAML (no duplicated keys)', (file) => {
    const content = fs.readFileSync(path.join(WORKFLOWS_DIR, file), 'utf8');
    expect(() => yaml.load(content)).not.toThrow();
  });

  it.each(workflowFiles)('%s defines at least one job', (file) => {
    const doc = yaml.load(fs.readFileSync(path.join(WORKFLOWS_DIR, file), 'utf8'));
    expect(doc).toBeTruthy();
    expect(doc.jobs).toBeTruthy();
    expect(Object.keys(doc.jobs).length).toBeGreaterThan(0);
  });
});
