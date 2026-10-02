'use strict';
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const {execFileSync} = require('node:child_process');
const catalog = require('../../scripts/expert-evolution/catalog.cjs');
describe('expert catalog exact scope and reproducible current evidence', () => {
  let root;
  const baseline = {schemaVersion:1,scope:{baseSha:'baseline'},files:[],clusters:[],sourceConsumerManifest:[{source:'bin/lib/contract.js'}],limits:['Not a performance evaluation']};
  function put(relative,content) { const target=path.join(root,relative); fs.mkdirSync(path.dirname(target),{recursive:true}); fs.writeFileSync(target,content); }
  beforeEach(() => {
    root=fs.mkdtempSync(path.join(os.tmpdir(),'expert catalog '));
    execFileSync('git',['init',root],{stdio:'ignore'});
    put('.sinapse-ai/development/agents/developer.md','# Developer\n');
    put('.codex/agents/developer.md','Activate agent: developer\nSquad: core\nRead the agent definition at: .sinapse-ai/development/agents/developer.md\n');
    put('.codex/agents/developer.toml','name="developer"\n');
    put('.claude/agents/sinapse-developer.md','Read .sinapse-ai/development/agents/developer.md\n');
    put('.codex/command-registry.json',JSON.stringify({agents:{'sinapse-dev':{sourceOfTruth:'.codex/agents/developer.md',commands:{develop:{target:'.sinapse-ai/development/agents/developer.md',kind:'task'}}}}}));
    put('bin/lib/contract.js','module.exports = 1;\n');
    put('scripts/consumer.js',"require('../bin/lib/contract');\n");
    put('scripts/equal.js',"require('../bin/lib/contract');\n");
    execFileSync('git',['-C',root,'add','.'],{stdio:'ignore'});
    // Only this disposable fixture has a commit; the shared worktree is untouched.
    execFileSync('git',['-C',root,'-c','user.name=Fixture','-c','user.email=fixture@example.invalid','commit','--no-verify','-m','fixture'],{stdio:'ignore'});
  });
  afterEach(() => fs.rmSync(root,{recursive:true,force:true}));
  const build = options => catalog.buildCatalog({root,baseline,...options});
  const validate = result => catalog.validateCatalog(result,{root,expectedCounts:{}});
  test('classification preserves history and fixtures before delivery and domain paths', () => {
    expect(catalog.classifyPath('_archive/tests/example.test.js')).toBe('history');
    expect(catalog.classifyPath('squads/squad-design/fixtures/button.md')).toBe('tests');
    expect(catalog.classifyPath('squads/squad-design/agents/design-orqx.md')).toBe('canonicalAgents');
    expect(catalog.classifyPath('squads/squad-design/tasks/a.md')).toBe('workflows');
    expect(catalog.classifyPath('.codex/agents/developer.toml')).toBe('providerAdapters');
  });
  test('stable refresh resolves imports, sources, aliases and preserves consumed duplicates', () => {
    const first=build();
    expect(build()).toEqual(first);
    expect(validate(first)).toMatchObject({valid:true,evidence:'current-checkout'});
    expect(first.sourceConsumerManifest[0].consumers).toEqual(['scripts/consumer.js','scripts/equal.js']);
    expect(first.duplicateClusters.find(cluster=>cluster.paths.includes('scripts/equal.js'))).toMatchObject({action:'review-only-preserve',paths:['scripts/consumer.js','scripts/equal.js']});
    expect(catalog.queryAgent(first,'dev').sourcePath).toBe('.sinapse-ai/development/agents/developer.md');
    expect(()=>catalog.queryAgent(first,'invented')).toThrow('Unknown');
    expect(()=>catalog.querySquad(first,'invented')).toThrow('Unknown');
    expect(()=>catalog.queryPaths(first,'invented')).toThrow('Unknown');
  });
  test('omitted and duplicate records, corrupted hashes and swapped canonical pointers fail', () => {
    const first=build();
    const omitted=structuredClone(first); omitted.files.pop(); expect(validate(omitted).valid).toBe(false);
    const duplicate=structuredClone(first); duplicate.files.push(first.files[0]); expect(validate(duplicate).errors.join(' ')).toContain('Duplicate path');
    put('bin/lib/contract.js','module.exports = 2;\n'); expect(validate(first).errors.join(' ')).toContain('Baseline hash drift');
    put('.codex/agents/developer.md','Read the agent definition at: scripts/consumer.js\n'); expect(validate(first).errors.join(' ')).toContain('Canonical pointer mismatch');
  });
  test('only explicit new paths enter refresh; missing includes and traversal fail', () => {
    put('research/new.json','{}');
    expect(build().files.some(file=>file.path==='research/new.json')).toBe(false);
    expect(build({include:['research/new.json']}).files.find(file=>file.path==='research/new.json')).toMatchObject({explicitInclude:true,responsibility:'research'});
    expect(()=>build({include:['missing.json']})).toThrow();
    expect(()=>build({include:['../external.json']})).toThrow('Unsafe');
    expect(()=>build({include:['research/new.json','research/new.json']})).toThrow('duplicate');
  });
  test('nested Git root and symlink redirects are rejected even if destination remains internal', () => {
    expect(()=>catalog.exactRoot(path.join(root,'scripts'))).toThrow('exact Git root');
    fs.symlinkSync(path.join(root,'scripts'),path.join(root,'linked'),process.platform==='win32'?'junction':'dir');
    expect(()=>build({include:['linked/consumer.js']})).toThrow('symlink');
  });
});
