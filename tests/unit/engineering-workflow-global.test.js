'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { spawnSync } = require('node:child_process');
const test = typeof global.it === 'function' ? global.it : require('node:test');
const ROOT = path.resolve(__dirname, '../..');
const { copyEngineeringWorkflowCapabilitySync } = require(path.join(ROOT, 'packages/installer/src/installer/engineering-workflow-capability'));
const { deliverGlobalProviderAdapters } = require(path.join(ROOT, 'bin/lib/global-provider-adapters'));

function fixture(run) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'engineering-global-'));
  try { run(root); }
  finally {
    const resolved = path.resolve(root);
    assert.equal(path.dirname(resolved), path.resolve(os.tmpdir()));
    assert.ok(path.basename(resolved).startsWith('engineering-global-'));
    fs.rmSync(resolved, { recursive: true, force: true });
  }
}

test('global payload supplies a runnable offline CLI and preserves destination-only files', () => fixture((home) => {
  const destination = path.join(home, '.sinapse');
  const copied = copyEngineeringWorkflowCapabilitySync(ROOT, destination);
  assert.ok(copied.files.includes('packages/engineering-workflows/runtime.js'));
  const userFile = path.join(destination, 'packages/engineering-workflows/user-notes.txt');
  fs.writeFileSync(userFile, 'Preserve user notes');
  copyEngineeringWorkflowCapabilitySync(ROOT, destination);
  assert.equal(fs.readFileSync(userFile, 'utf8'), 'Preserve user notes');
  const result = spawnSync(process.execPath, [path.join(destination, 'bin/engineering-workflows.js'), 'show', 'wave-08-w27', '--json'], { encoding: 'utf8', timeout: 10000, windowsHide: true });
  assert.equal(result.status, 0, result.stderr);
  assert.equal(JSON.parse(result.stdout).workflow.id, 'wave-08-w27');
}));

for (const llmChoice of ['claude-code', 'codex', 'both']) {
  test(`engineering global skill is delivered correctly for ${llmChoice}`, () => fixture((home) => {
    const capability = copyEngineeringWorkflowCapabilitySync(ROOT, path.join(home, '.sinapse'));
    const commandsDir = path.join(home, 'commands');
    fs.mkdirSync(commandsDir);
    fs.writeFileSync(path.join(commandsDir, 'developer.md'), '---\nname: developer\ndescription: test specialist\n---\n');
    const delivered = deliverGlobalProviderAdapters({ llmChoice, home, commandsDir, engineeringSkillPath: capability.skillPath });
    const providers = llmChoice === 'both' ? ['codex', 'claude-code'] : [llmChoice];
    for (const provider of providers) {
      const folder = provider === 'codex' ? '.agents' : '.claude';
      const skill = fs.readFileSync(path.join(home, folder, 'skills/sinapse-engineering/SKILL.md'), 'utf8');
      assert.match(skill, /SINAPSE-MANAGED:global-skill/);
      assert.match(skill, /use `sinapse-engineering`/);
      assert.match(skill, /~\/\.sinapse\//);
      assert.match(skill, /não prova correção semântica/);
    }
    if (providers.includes('codex')) assert.ok(delivered.availableSkills.includes('sinapse-engineering'));
    if (providers.includes('claude-code')) assert.ok(delivered.claudeAvailableSkills.includes('sinapse-engineering'));
  }));
}

test('global reconciliation preserves a user-owned skill without reporting it as managed', () => fixture((home) => {
  const capability = copyEngineeringWorkflowCapabilitySync(ROOT, path.join(home, '.sinapse'));
  const skill = path.join(home, '.agents/skills/sinapse-engineering/SKILL.md');
  fs.mkdirSync(path.dirname(skill), { recursive: true });
  fs.writeFileSync(skill, 'User-owned content');
  const commandsDir = path.join(home, 'commands');
  fs.mkdirSync(commandsDir);
  const delivered = deliverGlobalProviderAdapters({ llmChoice: 'codex', home, commandsDir, engineeringSkillPath: capability.skillPath });
  assert.equal(fs.readFileSync(skill, 'utf8'), 'User-owned content');
  assert.ok(!delivered.availableSkills.includes('sinapse-engineering'));
}));

test('missing source fails before publishing any partial capability', () => fixture((home) => {
  const source = path.join(home, 'empty');
  const destination = path.join(home, 'destination');
  fs.mkdirSync(source);
  assert.throws(() => copyEngineeringWorkflowCapabilitySync(source, destination));
  assert.ok(!fs.existsSync(destination));
}));

test('global payload rejects a linked destination directory', () => fixture((home) => {
  const destination = path.join(home, '.sinapse');
  const outside = path.join(home, 'outside');
  fs.mkdirSync(destination);
  fs.mkdirSync(outside);
  fs.symlinkSync(outside, path.join(destination, 'packages'), process.platform === 'win32' ? 'junction' : 'dir');
  assert.throws(() => copyEngineeringWorkflowCapabilitySync(ROOT, destination), /unsafe|link|reparse/);
  assert.equal(fs.readdirSync(outside).length, 0);
}));
