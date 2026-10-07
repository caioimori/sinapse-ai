'use strict';
const fs = require('node:fs');
const path = require('node:path');
const os = require('node:os');
const {execFileSync} = require('node:child_process');
const gateway = require('../../scripts/framework-evolution/project-expert.cjs');
const installer = require('../../scripts/framework-evolution/project-expert-install.cjs');
const upgrader = require('../../scripts/framework-evolution/project-expert-upgrade.cjs');
const REPO = path.resolve(__dirname,'../..');

describe('explicit provider-independent project expert delivery', () => {
  let base, source, home, other, plan;
  const write = (root,relative,bytes) => {const file = path.join(root,relative);fs.mkdirSync(path.dirname(file),{recursive:true});fs.writeFileSync(file,bytes);};
  const git = (root,args) => execFileSync('git',['-C',root,...args],{windowsHide:true,stdio:'pipe'});
  beforeEach(() => {
    base = fs.mkdtempSync(path.join(os.tmpdir(),'sinapse-project-expert-test-'));
    [source,home,other] = ['source','home','other-client'].map(name => {const dir = path.join(base,name);fs.mkdirSync(dir);return dir;});
    for (const root of [source,other]) {git(root,['init','--initial-branch=fixture']);write(root,'seed.txt','owned fixture');git(root,['add','seed.txt']);git(root,['-c','user.name=Fixture','-c','user.email=fixture@example.invalid','commit','-m','fixture']);}
    for (const relative of ['scripts/framework-evolution/project-expert.cjs','scripts/framework-evolution/project-expert-install.cjs','bin/lib/global-provider-adapters.js']) write(source,relative,fs.readFileSync(path.join(REPO,relative)));
    // This fixture tests delivery isolation, not the existing framework's resolver.
    write(source,'scripts/framework-evolution/runtime.cjs',"'use strict';module.exports={buildRuntimeContext:o=>{if(o.agentId!=='fixture-agent'||o.task!=='fixture-task')throw new Error('Unknown fixture authority');return {schemaVersion:1,capsule:{model:null,agentId:o.agentId,sourceOfTruth:'.sinapse-ai/development/agents/fixture-agent.md',pointer:'.codex/agents/fixture.md',task:{command:o.task,target:'.sinapse-ai/development/workflows/fixture.yaml'}},contextOnly:true,executionObserved:false,knowledge:{items:[{id:'owned-fixture-mechanism'}],gaps:[]},profile:{criteriaComplete:true},charsUsed:0,maxChars:o.maxChars};}};\n");
    write(source,'.sinapse-ai/development/agents/fixture-agent.md','owned verified source canonical');
    write(source,'.codex/command-registry.json','{"schemaVersion":1,"agents":{"fixture-agent":{"commands":{"fixture-task":{"target":".sinapse-ai/development/workflows/fixture.yaml"}}}}}');
    write(source,'.sinapse-ai/development/workflows/fixture.yaml','owned readable registry workflow');
    for (const relative of ['.codex/agents','research/framework-evolution','research/expert-evolution']) {fs.mkdirSync(path.join(source,relative),{recursive:true});write(source,relative + '/fixture.' + (relative === '.codex/agents' ? 'md' : 'json'),relative === '.codex/agents' ? 'fixture pointer' : '{"schemaVersion":1}');}
    write(source,'research/expert-evolution/library/overlay.json','{"fixturePrivate":"never delivered"}');
    write(source,'squads/claude-code-mastery/agents/fixture-claude.md','owned non-squad-prefixed canonical');
    write(source,'squads/claude-code-mastery/tasks/fixture-claude-task.md','owned non-squad-prefixed task');
    write(home,'.codex/agents/keep.toml','existing Codex adapter');write(home,'.claude/agents/keep.md','existing Claude adapter');write(home,'.agents/skills/keep/SKILL.md','existing skill');write(home,'.claude/settings.json','{"existing":true}');
    plan = installer.prepareProjectPlan({sourceRoot:source,projectRoots:[source],home,transactionId:'fixture',authorization:'Explicit owned fixture test'});
  });
  afterEach(() => {
    if (path.dirname(path.resolve(base)) !== path.resolve(os.tmpdir()) || !/^sinapse-project-expert-test-/.test(path.basename(base))) throw new Error('Unsafe fixture cleanup');
    fs.rmSync(base,{recursive:true,force:true});
  });
  const install = () => installer.applyProjectPlan(plan);
  const context = extra => gateway.buildProjectContext({home,cwd:source,agentId:'fixture-agent',task:'fixture-task',receiptSha256:plan.registrySha256,...extra});
  const upgradePlan = () => upgrader.prepareUpgrade({sourceRoot:source,projectRoots:[source],home,expectedOldRegistrySha256:plan.registrySha256,expectedOldTransactionId:plan.transactionId,transactionId:'upgrade-fixture',authorization:'Explicit owned upgrade fixture'});
  test('explicit upgrade requires old/new CAS, snapshots provider parity, and rolls back only owned writes',()=>{
    install();const oldSkill=fs.readFileSync(path.join(home,'.agents/skills/sinapse-project-expert/SKILL.md'));
    const upgrade=upgradePlan();
    expect(()=>upgrader.applyUpgrade(upgrade,{expectedNewRegistrySha256:'0'.repeat(64)})).toThrow('CAS');
    const receipt=upgrader.applyUpgrade(upgrade,{expectedNewRegistrySha256:upgrade.expectedNewRegistrySha256});
    expect(receipt.status).toBe('upgraded-bounded');
    expect(gateway.loadLink({home,cwd:source,receiptSha256:upgrade.expectedNewRegistrySha256}).manifest.sourceRoot).toBe(gateway.safeRoot(source));
    expect(fs.readFileSync(path.join(home,'.agents/skills/sinapse-project-expert/SKILL.md')).equals(fs.readFileSync(path.join(home,'.claude/skills/sinapse-project-expert/SKILL.md')))).toBe(true);
    write(home,'foreign-work.txt','preserved concurrent work');
    expect(upgrader.rollbackUpgrade(upgrade,{expectedJournalSha256:receipt.journalSha256,expectedSnapshotSha256:receipt.snapshotSha256}).status).toBe('rolled-back');
    expect(gateway.digest(home,gateway.REGISTRY)).toBe(plan.registrySha256);
    expect(fs.readFileSync(path.join(home,'.agents/skills/sinapse-project-expert/SKILL.md')).equals(oldSkill)).toBe(true);
    expect(fs.readFileSync(path.join(home,'foreign-work.txt'),'utf8')).toBe('preserved concurrent work');
    expect(context().contextOnly).toBe(true);
  });
  test('upgrade preserves concurrent destination edits during failure and records blocked rollback',()=>{
    install();const upgrade=upgradePlan();let error;
    try{upgrader.applyUpgrade(upgrade,{expectedNewRegistrySha256:upgrade.expectedNewRegistrySha256,afterWrite:entry=>{if(entry.path===gateway.REGISTRY){write(home,gateway.REGISTRY,'foreign registry');throw new Error('fixture failure');}}});}catch(caught){error=caught;}
    expect(error.recovery.status).toBe('recovery-blocked');
    expect(error.recovery.blockedFiles).toContain(gateway.REGISTRY);
    expect(fs.readFileSync(path.join(home,gateway.REGISTRY),'utf8')).toBe('foreign registry');
    expect(fs.readFileSync(path.join(home,'.claude/settings.json'),'utf8')).toBe('{"existing":true}');
  });
  test('interrupted upgrade restores the complete old write set and old gateway readback',()=>{
    install();const upgrade=upgradePlan();let failure;
    try{upgrader.applyUpgrade(upgrade,{expectedNewRegistrySha256:upgrade.expectedNewRegistrySha256,afterWrite:entry=>{if(entry.path===gateway.REGISTRY)throw new Error('bounded interruption');}});}catch(error){failure=error;}
    expect(failure.recovery).toEqual({status:'rolled-back',blockedFiles:[]});
    expect(gateway.digest(home,gateway.REGISTRY)).toBe(plan.registrySha256);
    expect(context().contextOnly).toBe(true);
    expect(fs.existsSync(path.join(home,'.sinapse/project-expert/backups/upgrade-fixture/upgrade-snapshots.json'))).toBe(true);
  });
  test('upgrade rejects tampered snapshots, old transaction, occupied lock and source drift',()=>{
    install();const upgrade=upgradePlan(),corrupt=structuredClone(upgrade);
    corrupt.snapshots[0].content=Buffer.from('foreign injected script').toString('base64');
    expect(()=>upgrader.applyUpgrade(corrupt,{expectedNewRegistrySha256:corrupt.expectedNewRegistrySha256})).toThrow('trusted');
    expect(()=>upgrader.prepareUpgrade({...upgrade.plan,expectedOldRegistrySha256:plan.registrySha256,expectedOldTransactionId:'foreign'})).toThrow('transaction');
    write(home,'.sinapse/project-expert/installation.lock','another installation');
    expect(()=>upgrader.applyUpgrade(upgrade,{expectedNewRegistrySha256:upgrade.expectedNewRegistrySha256})).toThrow();
    expect(fs.readFileSync(path.join(home,'.sinapse/project-expert/installation.lock'),'utf8')).toBe('another installation');
    fs.unlinkSync(path.join(home,'.sinapse/project-expert/installation.lock'));
    write(source,'scripts/framework-evolution/runtime.cjs','foreign source drift');
    expect(()=>upgrader.applyUpgrade(upgrade,{expectedNewRegistrySha256:upgrade.expectedNewRegistrySha256})).toThrow('trusted');
    expect(gateway.digest(home,gateway.REGISTRY)).toBe(plan.registrySha256);
  });
  test('both providers receive identical skills and deterministic context without copying the private library', () => {
    const receipt = install();
    const codex = fs.readFileSync(path.join(home,'.agents/skills/sinapse-project-expert/SKILL.md'));
    const claude = fs.readFileSync(path.join(home,'.claude/skills/sinapse-project-expert/SKILL.md'));
    expect(codex.equals(claude)).toBe(true);
    expect(JSON.stringify(context())).toBe(JSON.stringify(context()));
    expect(context()).toMatchObject({contextOnly:true,executionObserved:false,capsule:{model:null},projectLink:{privateLibrary:'project-local',expertisePromotion:false}});
    expect(receipt.privateLibraryCopied).toBe(false);
    expect(receipt.files.every(f => !f.path.includes('/library/'))).toBe(true);
    expect(fs.existsSync(path.join(home,'.sinapse/research/expert-evolution/library'))).toBe(false);
    expect(fs.readFileSync(path.join(home,'.codex/agents/keep.toml'),'utf8')).toBe('existing Codex adapter');
    expect(fs.readFileSync(path.join(home,'.claude/agents/keep.md'),'utf8')).toBe('existing Claude adapter');
    expect(fs.readFileSync(path.join(home,'.agents/skills/keep/SKILL.md'),'utf8')).toBe('existing skill');
    expect(fs.readFileSync(path.join(home,'.claude/settings.json'),'utf8')).toBe('{"existing":true}');
  });
  test('another client and a cwd outside a repository cannot retrieve private context', () => {
    install();
    expect(() => context({cwd:other})).toThrow('not explicitly linked');
    expect(() => context({cwd:home})).toThrow();
  });
  test('a same-repository linked worktree is admitted only when explicitly present', () => {
    const secondary = path.join(base,'secondary');git(source,['worktree','add','--detach',secondary]);
    const linked = installer.prepareProjectPlan({sourceRoot:source,projectRoots:[source,secondary],home,transactionId:'fixture',authorization:'Explicit owned fixture test'});
    installer.applyProjectPlan(linked);
    const result = gateway.buildProjectContext({home,cwd:secondary,agentId:'fixture-agent',task:'fixture-task',receiptSha256:linked.registrySha256});
    expect(result.knowledge.items[0].id).toBe('owned-fixture-mechanism');
    expect(fs.readFileSync(path.join(secondary,'.agents/skills/sinapse-project-expert/SKILL.md')).equals(fs.readFileSync(path.join(secondary,'.claude/skills/sinapse-project-expert/SKILL.md')))).toBe(true);
  });
  test('divergent active checkout reads approved source locators and produces output only in its own root', () => {
    const secondary=path.join(base,'secondary');git(source,['worktree','add','--detach',secondary]);
    write(secondary,'.sinapse-ai/development/agents/fixture-agent.md','preserved divergent active canonical');write(secondary,'.codex/agents/fixture.md','preserved divergent active pointer');
    const linked=installer.prepareProjectPlan({sourceRoot:source,projectRoots:[source,secondary],home,transactionId:'fixture',authorization:'Explicit owned fixture test'});installer.applyProjectPlan(linked);
    const observations=[[source,'.sinapse-ai/development/agents/fixture-agent.md'],[source,'.sinapse-ai/development/workflows/fixture.yaml'],[source,'.codex/agents/fixture.md'],[secondary,'.sinapse-ai/development/agents/fixture-agent.md'],[secondary,'.codex/agents/fixture.md']].map(([root,relative])=>({root,relative,sha256:gateway.digest(root,relative),mtime:fs.statSync(path.join(root,relative)).mtimeMs}));
    const result=gateway.buildProjectContext({home,cwd:secondary,agentId:'fixture-agent',task:'fixture-task',receiptSha256:linked.registrySha256});
    expect(result.projectLink.sourceRoot).toBe(gateway.safeRoot(source));expect(result.projectLink.activeProjectRoot).toBe(gateway.safeRoot(secondary));expect(result.projectLink.sourceInputsReadOnly).toBe(true);
    expect(fs.readFileSync(path.join(result.projectLink.sourceRoot,result.projectLink.locators.canonical),'utf8')).toBe('owned verified source canonical');
    expect(fs.readFileSync(path.join(result.projectLink.sourceRoot,result.projectLink.locators.task),'utf8')).toBe('owned readable registry workflow');
    write(result.projectLink.activeProjectRoot,'generated/owned-output.md','owned output');expect(fs.existsSync(path.join(source,'generated/owned-output.md'))).toBe(false);
    expect(fs.readFileSync(path.join(secondary,'.sinapse-ai/development/agents/fixture-agent.md'),'utf8')).toBe('preserved divergent active canonical');expect(fs.readFileSync(path.join(secondary,'.codex/agents/fixture.md'),'utf8')).toBe('preserved divergent active pointer');expect(fs.existsSync(path.join(secondary,'.sinapse-ai/development/workflows/fixture.yaml'))).toBe(false);
    for(const observation of observations){expect(gateway.digest(observation.root,observation.relative)).toBe(observation.sha256);expect(fs.statSync(path.join(observation.root,observation.relative)).mtimeMs).toBe(observation.mtime);}
  });
  test.each(['../outside.md','/outside.md'])('a capsule locator outside the frozen source is rejected: %s', location => {
    const runtime=fs.readFileSync(path.join(source,'scripts/framework-evolution/runtime.cjs'),'utf8').replace("sourceOfTruth:'.sinapse-ai/development/agents/fixture-agent.md'",'sourceOfTruth:'+JSON.stringify(location));write(source,'scripts/framework-evolution/runtime.cjs',runtime);
    plan=installer.prepareProjectPlan({sourceRoot:source,projectRoots:[source],home,transactionId:'fixture',authorization:'Explicit owned fixture test'});install();expect(()=>context()).toThrow('Context locator is not a frozen source input');
  });
  test('an active source root permits new output while frozen input bytes and mtimes are preserved', () => {
    install();const observations=plan.sources.map(input=>({path:input.path,sha256:gateway.digest(source,input.path),mtime:fs.statSync(path.join(source,input.path)).mtimeMs}));
    const result=context();expect(result.projectLink.sourceRoot).toBe(result.projectLink.activeProjectRoot);expect(result.projectLink.sourceInputsReadOnly).toBe(true);
    write(result.projectLink.activeProjectRoot,'generated/new-owned-output.md','new output outside frozen inputs');
    for(const input of observations){expect(gateway.digest(source,input.path)).toBe(input.sha256);expect(fs.statSync(path.join(source,input.path)).mtimeMs).toBe(input.mtime);}
    expect(context().projectLink.activeProjectRoot).toBe(gateway.safeRoot(source));
  });
  test('missing completion receipt or one provider skill blocks runtime import before any side effect', () => {
    const marker=path.join(base,'runtime-import-observed.txt'),relative='scripts/framework-evolution/runtime.cjs';write(source,relative,'require("node:fs").writeFileSync('+JSON.stringify(marker)+',"unexpected import");\n'+fs.readFileSync(path.join(source,relative),'utf8'));
    plan=installer.prepareProjectPlan({sourceRoot:source,projectRoots:[source],home,transactionId:'fixture',authorization:'Explicit owned fixture test'});install();
    const receipt=fs.readFileSync(path.join(home,gateway.DELIVERY));fs.unlinkSync(path.join(home,gateway.DELIVERY));expect(()=>context()).toThrow('Incomplete project expert installation');expect(fs.existsSync(marker)).toBe(false);
    write(home,gateway.DELIVERY,receipt);fs.unlinkSync(path.join(home,'.claude/skills/sinapse-project-expert/SKILL.md'));expect(()=>context()).toThrow('Incomplete project expert installation');expect(fs.existsSync(marker)).toBe(false);
  });
  test('registry pin, link bytes, executable bytes, source roster and private overlay drift fail closed', () => {
    install();
    expect(() => context({receiptSha256:'0'.repeat(64)})).toThrow('registry trust');
    const manifest = plan.entries.find(e => e.path.includes('/links/'));
    const bytes = fs.readFileSync(path.join(home,manifest.path));write(home,manifest.path,'{}');expect(() => context()).toThrow('linked manifest mismatch');write(home,manifest.path,bytes);
    const frozenRuntime = fs.readFileSync(path.join(source,'scripts/framework-evolution/runtime.cjs'));
    write(source,'scripts/framework-evolution/runtime.cjs','throw new Error("untrusted code was executed");');expect(() => context()).toThrow('Stale or modified');
    write(source,'scripts/framework-evolution/runtime.cjs',frozenRuntime);
    write(source,'.codex/agents/extra.md','unexpected pointer');expect(() => context()).toThrow('roster');fs.unlinkSync(path.join(source,'.codex/agents/extra.md'));
    write(source,'research/expert-evolution/library/overlay.json','{"changed":true}');expect(() => context()).toThrow('overlay');
  });
  test('unknown authority, excessive complete context and malformed flags are rejected', () => {
    install();expect(() => context({agentId:'another-agent'})).toThrow('Unknown fixture authority');expect(() => context({maxChars:20})).toThrow('budget');
    expect(() => gateway.parseArgs(['fixture-agent','--task','fixture-task','--root',other])).toThrow('Invalid project context option');
    expect(() => gateway.parseArgs(['fixture-agent','--task','fixture-task','--task','other'])).toThrow();
  });
  test('linked metadata reserves complete budget while critical criteria, vetoes and authority remain intact', () => {
    const relative='scripts/framework-evolution/runtime.cjs';
    write(source,relative,"module.exports={buildRuntimeContext:o=>{const knowledge={optional:'',maxChars:o.knowledgeMaxChars};knowledge.optional='x'.repeat(o.knowledgeMaxChars-JSON.stringify(knowledge).length);return {capsule:{model:null,sourceOfTruth:'.sinapse-ai/development/agents/fixture-agent.md',task:{target:'.sinapse-ai/development/workflows/fixture.yaml'}},contextOnly:true,executionObserved:false,knowledge,profile:{criteria:['critical criterion'],vetoes:['critical veto']},operational:{authority:'delegate to exact task owner',mandatory:'m'.repeat(800)},charsUsed:0,maxChars:o.maxChars};}};");
    plan=installer.prepareProjectPlan({sourceRoot:source,projectRoots:[source],home,transactionId:'fixture',authorization:'Explicit owned budget regression'});install();
    const result=context({maxChars:7500});
    expect(result.charsUsed).toBe(JSON.stringify(result).length);
    expect(result.charsUsed).toBeLessThanOrEqual(7500);
    expect(result.knowledge.maxChars).toBeLessThan(6000);
    expect(result.profile).toEqual({criteria:['critical criterion'],vetoes:['critical veto']});
    expect(result.operational).toEqual({authority:'delegate to exact task owner',mandatory:'m'.repeat(800)});
    expect(()=>context({maxChars:1000,knowledgeMaxChars:100})).toThrow('budget');
  });
  test('non-squad-prefixed domain canonical and task bytes are frozen before import', () => {
    expect(plan.sources.some(input=>input.path==='squads/claude-code-mastery/agents/fixture-claude.md')).toBe(true);
    expect(plan.sources.some(input=>input.path==='squads/claude-code-mastery/tasks/fixture-claude-task.md')).toBe(true);
    install();write(source,'squads/claude-code-mastery/agents/fixture-claude.md','changed canonical');
    expect(()=>context()).toThrow('Stale or modified');
  });
  test('registry YAML targets outside Markdown task rosters are frozen before import', () => {
    expect(plan.sources.some(input=>input.path==='.sinapse-ai/development/workflows/fixture.yaml')).toBe(true);
    install();write(source,'.sinapse-ai/development/workflows/fixture.yaml','changed workflow');expect(()=>context()).toThrow('Stale or modified');
  });
  test('committing unchanged frozen bytes preserves the approved project link', () => {
    install();const previous=git(source,['rev-parse','HEAD']).toString().trim();
    git(source,['-c','user.name=Fixture','-c','user.email=fixture@example.invalid','commit','--allow-empty','-m','unchanged frozen inputs']);
    expect(git(source,['rev-parse','HEAD']).toString().trim()).not.toBe(previous);
    expect(context().projectLink.sourceHead).toBe(previous);
  });
  test('the private review reference graph and consumed original segment are frozen without copying their bytes', () => {
    const library='research/expert-evolution/library',segmentId='b'.repeat(64);
    const observation=JSON.stringify({owned:'observed fixture'}),review=JSON.stringify({observations:[{evidence:{path:'examples/owned-observation.json',sha256:gateway.sha(observation)}}]}),candidate=JSON.stringify({provenance:{segmentId}});
    write(source,'examples/owned-observation.json',observation);write(source,library+'/review.json',review);write(source,library+'/candidate.json',candidate);write(source,library+'/'+segmentId+'.json','{"text":"owned segment"}');write(source,library+'/manifest.json','{"owned":"capture manifest"}');
    write(source,library+'/overlay.json',JSON.stringify({entries:[{candidateRef:{path:library+'/candidate.json',sha256:gateway.sha(candidate)},reviewRef:{path:library+'/review.json',sha256:gateway.sha(review)}}]}));
    plan=installer.prepareProjectPlan({sourceRoot:source,projectRoots:[source],home,transactionId:'fixture',authorization:'Explicit owned fixture test'});
    for(const relative of ['examples/owned-observation.json',library+'/manifest.json',library+'/'+segmentId+'.json']) expect(plan.sources.some(input=>input.path===relative)).toBe(true);
    install();expect(fs.existsSync(path.join(home,library))).toBe(false);write(source,'examples/owned-observation.json','{"changed":true}');expect(()=>context()).toThrow('Stale or modified');
  });
  test('source change after freeze and tampered plan payload install nothing', () => {
    const corrupt = structuredClone(plan), entry = corrupt.entries[0];entry.content = Buffer.from('arbitrary code').toString('base64');entry.sha256 = gateway.sha('arbitrary code');
    expect(() => installer.applyProjectPlan(corrupt)).toThrow('does not match');
    write(source,'.codex/command-registry.json','{"changed":true}');expect(() => install()).toThrow('does not match');
    expect(fs.existsSync(path.join(home,gateway.GATEWAY))).toBe(false);
  });
  test('a destination appearing after plan freeze is preserved', () => {
    write(home,gateway.GATEWAY,'someone else');expect(() => install()).toThrow('Preserving an existing');expect(fs.readFileSync(path.join(home,gateway.GATEWAY),'utf8')).toBe('someone else');
  });
  test('a failed delivery rolls back only newly owned bytes and preserves preexisting work', () => {
    let error;try {installer.applyProjectPlan(plan,{afterWrite:entry => {if(entry.path === gateway.REGISTRY) throw new Error('simulated bounded failure');}});} catch (caught) {error = caught;}
    expect(error.recovery.status).toBe('rolled-back');expect(fs.existsSync(path.join(home,gateway.GATEWAY))).toBe(false);expect(fs.readFileSync(path.join(home,'.claude/settings.json'),'utf8')).toBe('{"existing":true}');
  });
  test('rollback preserves concurrent edits and records a blocked recovery', () => {
    let error;try {installer.applyProjectPlan(plan,{afterWrite:entry => {if(entry.path === gateway.GATEWAY){write(home,gateway.GATEWAY,'concurrent owner');throw new Error('simulated concurrent ownership');}}});} catch (caught) {error = caught;}
    expect(error.recovery.status).toBe('recovery-blocked');expect(error.recovery.blockedFiles).toContain(gateway.GATEWAY);expect(fs.readFileSync(path.join(home,gateway.GATEWAY),'utf8')).toBe('concurrent owner');
  });
  test('symlink/reparse traversal is rejected before reading a linked root', () => {
    const link = path.join(base,'linked-source');fs.symlinkSync(source,link,process.platform === 'win32' ? 'junction' : 'dir');
    expect(() => gateway.safeRoot(link)).toThrow('symlink/reparse');
    expect(() => installer.prepareProjectPlan({sourceRoot:link,projectRoots:[source],home,authorization:'fixture'})).toThrow('symlink/reparse');
  });
  test('a dangling symlink/reparse is preserved rather than treated as a missing destination', () => {
    const target = path.join(home,gateway.GATEWAY);fs.mkdirSync(path.dirname(target),{recursive:true});
    fs.symlinkSync(path.join(base,'absent-target'),target,process.platform === 'win32' ? 'junction' : 'file');
    expect(() => gateway.digest(home,gateway.GATEWAY)).toThrow('symlink/reparse');
    expect(() => install()).toThrow('symlink/reparse');expect(fs.lstatSync(target).isSymbolicLink()).toBe(true);
  });
  test('a completed installation can be rolled back by its pinned journal without deleting private knowledge', () => {
    const receipt = install();
    expect(() => installer.rollbackProjectPlan(plan,{expectedJournalSha256:'0'.repeat(64)})).toThrow('journal trust');
    const undone = installer.rollbackProjectPlan(plan,{expectedJournalSha256:receipt.journalSha256});
    expect(undone.status).toBe('uninstalled-bounded');expect(fs.existsSync(path.join(home,gateway.GATEWAY))).toBe(false);
    expect(fs.readFileSync(path.join(source,'research/expert-evolution/library/overlay.json'),'utf8')).toBe('{"fixturePrivate":"never delivered"}');
    expect(fs.readFileSync(path.join(home,'.agents/skills/keep/SKILL.md'),'utf8')).toBe('existing skill');
  });
  test('completed-installation rollback preserves an entry changed by another owner', () => {
    const receipt = install(), skill = '.claude/skills/sinapse-project-expert/SKILL.md';write(home,skill,'another owner');
    const undone = installer.rollbackProjectPlan(plan,{expectedJournalSha256:receipt.journalSha256});
    expect(undone.status).toBe('recovery-blocked');expect(undone.blockedFiles).toContain(skill);expect(fs.readFileSync(path.join(home,skill),'utf8')).toBe('another owner');
  });
  test.each(['../outside.json','.codex/config.toml','.claude/agents/keep.md','.agents/skills/keep/SKILL.md','.sinapse/core/agents/devops.md'])('unowned destination %s is rejected', relative => {
    const corrupt = structuredClone(plan);corrupt.entries[0].path = relative;expect(() => installer.validatePlan(corrupt)).toThrow();
  });
});
