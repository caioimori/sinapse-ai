'use strict';

const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { execFileSync } = require('node:child_process');
const crypto = require('node:crypto');
const { deliverFrameworkEvolution, installedPath, PAYLOAD, EXPERT_PAYLOAD, OPTIONAL_EXPERT_PAYLOAD } = require('../../bin/lib/framework-evolution-delivery');
const { deliverGlobalProviderAdapters } = require('../../bin/lib/global-provider-adapters');
const { inventory } = require('../../scripts/framework-evolution/inventory.cjs');
const root = path.resolve(__dirname, '../..');
const digest = (bytes) => crypto.createHash('sha256').update(bytes).digest('hex');

describe('framework evolution distribution into isolated destinations', () => {
  let temporary;
  beforeEach(() => { temporary = fs.mkdtempSync(path.join(os.tmpdir(), 'sinapse runtime spaces ')); });
  afterEach(() => { fs.rmSync(temporary, { recursive: true, force: true }); });
  function copy(relative, destination) {
    fs.mkdirSync(path.dirname(destination), { recursive: true });
    fs.copyFileSync(path.join(root, relative), destination);
  }
  function query(script, agent, task) {
    return JSON.parse(execFileSync(process.execPath, [script, agent, '--task', task, '--json'], { encoding: 'utf8' }));
  }
  test('real global adapter delivery makes an executable confined runtime with spaced HOME and receipt', () => {
    const packageFixture=path.join(temporary,'frozen package');
    const index=require('../../.codex/scripts/resolve-codex-agent.js').loadCodexAgentIndex(root);
    const bindings=JSON.parse(fs.readFileSync(path.join(root,'research/expert-evolution/task-bindings.json'))).bindings;
    const native=JSON.parse(fs.readFileSync(path.join(root,'research/expert-evolution/native-availability-receipt.json')));
    const registry=JSON.parse(fs.readFileSync(path.join(root,'.codex/command-registry.json')));
    const assets=[...PAYLOAD,...EXPERT_PAYLOAD,...OPTIONAL_EXPERT_PAYLOAD,'.codex/scripts/resolve-codex-agent.js','.codex/scripts/resolve-codex-command.js','.codex/command-registry.json','research/expert-evolution/native-availability-receipt.json',...native.evidence.map(ref=>ref.path),...Object.values(index).flatMap(entry=>[entry.pointerPath,entry.sourcePath]),...bindings.map(binding=>binding.taskPath),...Object.values(registry.agents).flatMap(agent=>Object.values(agent.commands).filter(command=>command.target.startsWith('.codex/tasks/')).map(command=>command.target)),'.sinapse-ai/development/tasks/dev-develop-story.md'];
    for(const relative of new Set(assets))copy(relative,path.join(packageFixture,relative));
    const home = path.join(temporary, 'home with spaces');
    const installed = path.join(home, '.sinapse');
    const commandDir = path.join(installed, '.generated/agents');
    for (const source of inventory(root).assets.sourceAgents) {
      const destination=path.join(installed,installedPath(source));
      fs.mkdirSync(path.dirname(destination),{recursive:true});
      fs.copyFileSync(path.join(packageFixture,source),destination);
    }
    for (const source of ['.sinapse-ai/development/tasks/dev-develop-story.md', 'squads/squad-copy/tasks/write-ad-copy-variations.md']) copy(source, path.join(installed, installedPath(source)));
    fs.mkdirSync(commandDir, { recursive: true });
    for (const id of ['developer', 'ad-copywriter', 'snps-orqx']) fs.writeFileSync(path.join(commandDir, `${id}.md`), `---\nname: ${id}\ndescription: Canonical test stub\n---\nRead canonical source.\n`);
    const delivered = deliverGlobalProviderAdapters({ llmChoice: 'both', home, commandsDir: commandDir,frameworkEvolutionPackageRoot:packageFixture });
    expect(delivered.frameworkEvolution.status).toBe('delivered');
    for (const entry of delivered.frameworkEvolution.files) expect(digest(fs.readFileSync(path.join(installed, entry.path)))).toBe(entry.sha256);
    const toml = fs.readFileSync(path.join(home, '.codex/agents/developer.toml'), 'utf8');
    const instruction = JSON.parse(toml.match(/^developer_instructions = (.+)$/m)[1]);
    expect(instruction).toContain(path.join(installed, 'scripts/framework-evolution/runtime.cjs'));
    const hookCommand = instruction.match(/run (node .+? --knowledge-max-chars 6000)\./)[1].replace('<command>', 'dev-develop-story');
    const shellResult = process.platform === 'win32'
      ? execFileSync('powershell.exe', ['-NoProfile', '-Command', hookCommand], { encoding: 'utf8' })
      : execFileSync('/bin/sh', ['-c', hookCommand], { encoding: 'utf8' });
    expect(JSON.parse(shellResult).capsule.agentId).toBe('developer');
    const script = path.join(installed, 'scripts/framework-evolution/runtime.cjs');
    expect(query(script, 'developer', 'dev-develop-story').capsule.sourceOfTruth).toBe('core/agents/developer.md');
    expect(query(script, 'ad-copywriter', 'write-ad-copy-variations').capsule.task.target).toBe('squad-copy/tasks/write-ad-copy-variations.md');
    const expertise = require('../../scripts/expert-evolution/expertise.cjs');
    const installedProgram = expertise.loadProgram(installed);
    expect(installedProgram.bindings.bindings).toHaveLength(18);
    expect(expertise.validateTaskBindings(installedProgram, {root:installed})).toEqual({valid:true,errors:[]});
    for(const binding of bindings){
      const relative=installedPath(binding.taskPath);
      expect(fs.readFileSync(path.join(installed,relative))).toEqual(fs.readFileSync(path.join(packageFixture,binding.taskPath)));
      expect(delivered.frameworkEvolution.files).toContainEqual({path:relative,sha256:binding.taskSha256});
    }
    expect(query(script, 'ad-copywriter', 'create-ugc-script').profile.selectionEvidence.status).toBe('bound');
    expect(query(script, 'dx-frontend-engineer', 'implement-component-library').profile.selectionEvidence.status).toBe('bound');
    expect(()=>query(script,'ad-copywriter','invented-task')).toThrow();
    expect(query(script, 'sinapse-orqx', 'route').capsule.agentId).toBe('snps-orqx');
    const second = deliverGlobalProviderAdapters({ llmChoice: 'both', home, commandsDir: commandDir,frameworkEvolutionPackageRoot:packageFixture });
    expect(second.frameworkEvolution.changedFiles).toBe(0);
    fs.appendFileSync(path.join(installed, 'scripts/framework-evolution/runtime.cjs'), '\n// user edit\n');
    expect(() => deliverFrameworkEvolution({ packageRoot: packageFixture, targetRoot: installed, layout: 'global' })).toThrow('Preserving modified');
  });
  test('project payload delivery runs against the existing project canonical layout', () => {
    const project = path.join(temporary, 'project');
    for (const source of ['.codex/scripts/resolve-codex-agent.js', '.codex/scripts/resolve-codex-command.js', '.codex/command-registry.json', '.codex/agents/developer.md', '.sinapse-ai/development/agents/developer.md', '.sinapse-ai/development/tasks/dev-develop-story.md']) copy(source, path.join(project, source));
    const delivered = deliverFrameworkEvolution({ packageRoot: root, targetRoot: project });
    const native=JSON.parse(fs.readFileSync(path.join(root,'research/expert-evolution/native-availability-receipt.json')));
    const expected=[...PAYLOAD,...EXPERT_PAYLOAD,...OPTIONAL_EXPERT_PAYLOAD.filter(relative=>fs.existsSync(path.join(root,relative))),'research/expert-evolution/native-availability-receipt.json',...native.evidence.map(ref=>ref.path)];
    expect(delivered.files.map(entry=>entry.path).sort()).toEqual([...new Set(expected)].sort());
    const context = query(path.join(project, 'scripts/framework-evolution/runtime.cjs'), 'developer', 'dev-develop-story');
    expect(context.charsUsed).toBeLessThanOrEqual(context.maxChars);
    expect(context.capsule.sourceOfTruth).toBe('.sinapse-ai/development/agents/developer.md');
    expect(context.profile.agentId).toBe('developer');
    expect(context.profile.validatedExpertise).toBe(false);
    expect(deliverFrameworkEvolution({ packageRoot: root, targetRoot: project }).changedFiles).toBe(0);
  });
  test('the public project installer delivers and executes the runtime without external dependency calls', async () => {
    const childProcess = require('node:child_process');
    const execSpy = jest.spyOn(childProcess, 'exec').mockImplementation((command, options, callback) => {
      if (!command.startsWith('npm install')) throw new Error(`Unexpected external command ${command}`);
      callback(null, '', '');
      return { on: () => {} };
    });
    const project = path.join(temporary, 'actual installer project');
    try {
      const { installSinapseCore } = require('../../packages/installer/src/installer/sinapse-ai-installer');
      const result = await installSinapseCore({ targetDir: project, includeCodex: true });
      expect(result.success).toBe(true);
      expect(result.frameworkEvolution.status).toBe('delivered');
      expect(result.installedFiles).toContain('scripts/framework-evolution/runtime.cjs');
      expect(query(path.join(project, 'scripts/framework-evolution/runtime.cjs'), 'developer', 'dev-develop-story').capsule.agentId).toBe('developer');
    } finally { execSpy.mockRestore(); }
  }, 120000);
  test('partial package and unmanaged destination corruption fail before overwriting user data', () => {
    const partial = path.join(temporary, 'partial');
    copy('scripts/framework-evolution/runtime.cjs', path.join(partial, 'scripts/framework-evolution/runtime.cjs'));
    expect(() => deliverFrameworkEvolution({ packageRoot: partial, targetRoot: path.join(temporary, 'target') })).toThrow('Partial');
    const project = path.join(temporary, 'dirty project');
    fs.mkdirSync(path.join(project, 'scripts/framework-evolution'), { recursive: true });
    const file = path.join(project, 'scripts/framework-evolution/runtime.cjs');
    fs.writeFileSync(file, 'user-owned');
    expect(() => deliverFrameworkEvolution({ packageRoot: root, targetRoot: project })).toThrow('Preserving modified/unmanaged');
    expect(fs.readFileSync(file, 'utf8')).toBe('user-owned');
    expect(fs.existsSync(path.join(project, 'research/framework-evolution/sources.json'))).toBe(false);
  });
  test('linked destination directory cannot write the corpus outside its target', () => {
    const project = path.join(temporary, 'linked project');
    const outside = path.join(temporary, 'outside');
    fs.mkdirSync(project);
    fs.mkdirSync(outside);
    fs.symlinkSync(outside, path.join(project, 'research'), process.platform === 'win32' ? 'junction' : 'dir');
    expect(() => deliverFrameworkEvolution({ packageRoot: root, targetRoot: project })).toThrow('Unsafe evolution destination directory');
    expect(fs.readdirSync(outside)).toEqual([]);
  });
  test('a managed payload upgrade keeps an exact recoverable backup before overwrite', () => {
    const packageFixture = path.join(temporary, 'package fixture');
    const project = path.join(temporary, 'upgrade target');
    for (const relative of PAYLOAD) copy(relative, path.join(packageFixture, relative));
    deliverFrameworkEvolution({ packageRoot: packageFixture, targetRoot: project });
    const relative = 'scripts/framework-evolution/runtime.cjs';
    const previous = fs.readFileSync(path.join(project, relative));
    fs.appendFileSync(path.join(packageFixture, relative), '\n// package upgrade\n');
    const result = deliverFrameworkEvolution({ packageRoot: packageFixture, targetRoot: project });
    expect(result.changedFiles).toBe(1);
    expect(fs.readFileSync(path.join(project, '.framework-evolution-backups', digest(previous), relative))).toEqual(previous);
    expect(fs.readFileSync(path.join(project, relative), 'utf8')).toContain('// package upgrade');
  });
  test('an edit between delivery preflight and atomic publication preserves user content and prior receipt', () => {
    const packageFixture = path.join(temporary, 'race package');
    const project = path.join(temporary, 'race target');
    for (const relative of PAYLOAD) copy(relative, path.join(packageFixture, relative));
    deliverFrameworkEvolution({ packageRoot: packageFixture, targetRoot: project });
    const relative = 'scripts/framework-evolution/runtime.cjs';
    const destination = path.join(project, relative);
    const priorReceipt = fs.readFileSync(path.join(project, '.framework-evolution-delivery.json'));
    fs.appendFileSync(path.join(packageFixture, relative), '\n// package upgrade\n');
    const provider = require('../../bin/lib/global-provider-adapters');
    const original = provider.writeFileAtomically;
    const spy = jest.spyOn(provider, 'writeFileAtomically').mockImplementation((file, ...args) => {
      if (file === destination) fs.writeFileSync(destination, 'concurrent user edit');
      return original(file, ...args);
    });
    try {
      expect(() => deliverFrameworkEvolution({ packageRoot: packageFixture, targetRoot: project })).toThrow('concurrently modified');
      expect(fs.readFileSync(destination, 'utf8')).toBe('concurrent user edit');
      expect(fs.readFileSync(path.join(project, '.framework-evolution-delivery.json'))).toEqual(priorReceipt);
    } finally { spy.mockRestore(); }
  });
  test('atomic publication rechecks an in-place edit after the temporary payload was written', () => {
    const provider = require('../../bin/lib/global-provider-adapters');
    const file = path.join(temporary, 'existing.txt');
    fs.writeFileSync(file, 'managed previous');
    expect(() => provider.writeFileAtomically(file, 'managed next', temporary, {
      expectedContentSha256: digest(Buffer.from('managed previous')),
      beforePublish: () => fs.writeFileSync(file, 'late user edit'),
    })).toThrow('concurrently modified');
    expect(fs.readFileSync(file, 'utf8')).toBe('late user edit');
  });
});
