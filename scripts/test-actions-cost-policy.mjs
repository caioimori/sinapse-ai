import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';

const require = createRequire(import.meta.url);
const YAML = require('yaml');
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const workflowPath = (name) => path.join(root, '.github', 'workflows', name);
const readWorkflow = (name) => YAML.parse(fs.readFileSync(workflowPath(name), 'utf8'));

const invariantHashes = {
  'ci.yml': 'd2cdb90fffc4982cd12e802e0d2fed0e95ea3cafbd1fe39fb9966cd6db41ddd5',
  'codeql.yml': 'ed4e2b57e3b6e6655fcc0308b39f74e8e67244fc0c22f3ebb4ecdf41787bc63a',
  'manifest-parity.yml': 'af477742506a3199d6904d6e8d05308ac1a243858c0ec730202a0b91832c7cd3',
  'article-gates.yml': 'e9be0045aca13798759d32fa987a8198d976a094dc0a3e01ba7f0e0aca724d00',
  'lint-guards.yml': '71f01d470d7a32da6e9915557b4c64bceef8e70f3235f139b10e1e54a4f34273',
  'test.yml': 'bf160d533d435b91f890b380647cf5ac894bd5c2993812443a82279c8f2ff69e',
  'release-prepare.yml': '940ad69e19efc757a47b56d3cd8f0975ef5a71ed2be4f030b492a2738ed067b2',
};

for (const [name, expected] of Object.entries(invariantHashes)) {
  const actual = crypto.createHash('sha256').update(fs.readFileSync(workflowPath(name))).digest('hex');
  assert.equal(actual, expected, `${name} changed despite being an invariant workflow`);
}

const macos = readWorkflow('macos-testing.yml');
assert.deepEqual(Object.keys(macos.on), ['workflow_dispatch'], 'macOS must be dispatch-only');
assert.equal(macos.on.workflow_dispatch.inputs.candidate_sha.required, true);
assert.equal(macos.on.workflow_dispatch.inputs.candidate_sha.type, 'string');
assert.match(macos['run-name'], /inputs\.candidate_sha/);
assert.equal(Object.keys(macos.jobs).length, 6, 'candidate validation and all macOS jobs must remain');
assert.equal(macos.env.TESTED_HEAD_SHA, '${{ inputs.candidate_sha }}');
for (const jobName of ['test-intel-mac', 'test-apple-silicon', 'test-error-recovery']) {
  assert.equal(macos.jobs[jobName].needs, 'validate-candidate');
}
const macosValidationScript = macos.jobs['validate-candidate'].steps
  .filter((step) => step.run)
  .map((step) => step.run)
  .join('\n');
assert.match(macosValidationScript, /\^\[0-9a-f\]\{40\}\$/);
assert.match(macosValidationScript, /DISPATCH_SHA/);
assert.match(macosValidationScript, /git rev-parse HEAD/);
const macosCheckoutSteps = Object.values(macos.jobs)
  .flatMap((job) => job.steps ?? [])
  .filter((step) => step.uses?.startsWith('actions/checkout@'));
assert.equal(macosCheckoutSteps.length, 4);
for (const step of macosCheckoutSteps) {
  assert.equal(step.with.ref, '${{ env.TESTED_HEAD_SHA }}');
}

const install = readWorkflow('install-matrix.yml');
assert.deepEqual(Object.keys(install.on).sort(), ['pull_request', 'workflow_dispatch']);
assert.equal(install.on.workflow_dispatch.inputs.candidate_sha.required, true);
assert.equal(install.on.workflow_dispatch.inputs.candidate_sha.type, 'string');
assert.match(install['run-name'], /inputs\.candidate_sha/);
assert.deepEqual(install.on.pull_request.types, ['labeled']);
assert.equal(install.jobs.gate, undefined, 'ordinary PRs must not create the former gate job');

const releaseGuard =
  "github.event_name == 'workflow_dispatch' || github.event.label.name == 'release'";
for (const jobName of [
  'validate-candidate',
  'install-matrix',
  'provider-install-matrix',
  'provider-upgrade-matrix',
]) {
  assert.equal(install.jobs[jobName].if, releaseGuard, `${jobName} must require dispatch or release label`);
}
assert.match(install.jobs.summary.if, /github\.event\.label\.name == 'release'/);
assert.equal(
  install.env.TESTED_HEAD_SHA,
  '${{ github.event.pull_request.head.sha || inputs.candidate_sha }}',
);
const installValidationScript = install.jobs['validate-candidate'].steps
  .filter((step) => step.run)
  .map((step) => step.run)
  .join('\n');
assert.match(installValidationScript, /\^\[0-9a-f\]\{40\}\$/);
assert.match(installValidationScript, /workflow_dispatch/);
assert.match(installValidationScript, /DISPATCH_SHA/);
assert.match(installValidationScript, /git rev-parse HEAD/);
const installCheckoutSteps = Object.values(install.jobs)
  .flatMap((job) => job.steps ?? [])
  .filter((step) => step.uses?.startsWith('actions/checkout@'));
assert.equal(installCheckoutSteps.length, 4);
for (const step of installCheckoutSteps) {
  assert.equal(step.with.ref, '${{ env.TESTED_HEAD_SHA }}', 'checkout must test the recorded SHA');
}

const matrix = install.jobs['install-matrix'].strategy.matrix;
const totalInstallCombinations =
  matrix.os.length * matrix.pm.length * matrix.method.length - matrix.exclude.length;
assert.equal(totalInstallCombinations, 24);
assert.equal(install.jobs['provider-install-matrix'].strategy.matrix.provider.length, 3);
assert.equal(install.jobs['provider-upgrade-matrix'].strategy.matrix.provider.length, 3);

const shouldCreateExpensiveJobs = ({ event, label }) =>
  event === 'workflow_dispatch' || (event === 'pull_request:labeled' && label === 'release');
const eventTable = [
  { event: 'pull_request:opened', label: null, expected: false },
  { event: 'pull_request:synchronize', label: 'release', expected: false },
  { event: 'pull_request:reopened', label: 'release', expected: false },
  { event: 'pull_request:labeled', label: 'documentation', expected: false },
  { event: 'pull_request:labeled', label: 'release', expected: true },
  { event: 'workflow_dispatch', label: null, expected: true },
];
for (const fixture of eventTable) {
  assert.equal(shouldCreateExpensiveJobs(fixture), fixture.expected, JSON.stringify(fixture));
}

const evidenceMatchesCandidate = (evidenceSha, candidateSha) =>
  /^[0-9a-f]{40}$/.test(evidenceSha) && evidenceSha === candidateSha;
const oldSha = '1111111111111111111111111111111111111111';
const candidateSha = '2222222222222222222222222222222222222222';
assert.equal(evidenceMatchesCandidate(oldSha, candidateSha), false);
assert.equal(evidenceMatchesCandidate(candidateSha, candidateSha), true);

const articleNames = new Set(
  Object.values(readWorkflow('article-gates.yml').jobs).map((job) => job.name),
);
for (const required of [
  'Article VII (Metrics Accuracy)',
  'Article VIII (Mandatory Delegation)',
  'Article XI (Conservative Default)',
]) {
  assert(articleNames.has(required), `required check is missing: ${required}`);
}
const ciNames = new Set(Object.values(readWorkflow('ci.yml').jobs).map((job) => job.name));
assert(ciNames.has('Validation Summary'), 'required Validation Summary check is missing');

const semanticReleaseSource = fs.readFileSync(workflowPath('semantic-release.yml'), 'utf8');
const semanticRelease = YAML.parse(semanticReleaseSource);
assert.equal(semanticRelease.permissions.checks, 'read');
const releaseGate = semanticRelease.jobs.release.steps.find(
  (step) => step.name === 'Require candidate compatibility checks',
);
assert(releaseGate, 'semantic release must fail closed on candidate compatibility checks');
assert.equal(releaseGate.if, '${{ inputs.dry_run == false }}');
assert.match(releaseGate.run, /commits\/\$RELEASE_SHA\/check-runs/);
assert.match(releaseGate.run, /Gate Summary \(24 combos \+ 3 clean \+ 3 upgrades\)/);
assert.match(releaseGate.run, /macOS Validation Gate/);
assert.match(releaseGate.run, /\[ "\$STATUS" != "completed" \]/);
assert.match(releaseGate.run, /\[ "\$CONCLUSION" != "success" \]/);
const semanticReleaseWithoutGate = semanticReleaseSource
  .replace('  checks: read\n', '')
  .replace(
    / {6}- name: Require candidate compatibility checks\n[\s\S]*?(?= {6}- name: Setup Node\.js\n)/,
    '',
  );
assert.equal(
  crypto.createHash('sha256').update(semanticReleaseWithoutGate).digest('hex'),
  '86f8dc08ecf1f4b0feb450343bc8ee55b3006170dd83d32c64426bedfd99c374',
  'semantic-release.yml changed outside the approved quality gate',
);

for (const file of fs.readdirSync(path.dirname(workflowPath('ci.yml')))) {
  if (!/\.ya?ml$/.test(file)) continue;
  const source = fs.readFileSync(workflowPath(file), 'utf8');
  for (const match of source.matchAll(/^\s*uses:\s*([^\s#]+)(?:\s+#.*)?$/gm)) {
    const action = match[1];
    if (action.startsWith('./') || action.startsWith('docker://')) continue;
    assert.match(action, /@[0-9a-f]{40}$/, `${file} has an unpinned action: ${action}`);
  }
}

console.log('Actions cost policy: PASS');
console.log('Ordinary PR expensive jobs: 0 (minimum reduction: 3 macOS + 1 former gate job)');
console.log('Explicit coverage retained: 3 macOS checks + 24 install + 3 clean + 3 upgrades');
