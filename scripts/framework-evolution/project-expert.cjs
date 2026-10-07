'use strict';

// Offline, explicitly linked project context. Never invokes an LLM or an API.
const fs = require('node:fs');
const path = require('node:path');
const os = require('node:os');
const crypto = require('node:crypto');
const {execFileSync} = require('node:child_process');
const REGISTRY = '.sinapse/project-expert/registry.json';
const GATEWAY = '.sinapse/scripts/framework-evolution/project-expert.cjs';
const DELIVERY = '.sinapse/project-expert/delivery.json';
const sha = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
const identity = root => process.platform === 'win32' ? root.toLowerCase() : root;
const inside = (root, target) => { const rel = path.relative(root, target); return rel === '' || (!rel.startsWith('..') && !path.isAbsolute(rel)); };

function safeRoot(value) {
  if (typeof value !== 'string' || !path.isAbsolute(value) || value.includes('\0')) throw new Error('An absolute project root is required');
  const absolute = path.resolve(value), parsed = path.parse(absolute);
  let cursor = parsed.root;
  for (const segment of absolute.slice(parsed.root.length).split(path.sep).filter(Boolean)) {
    cursor = path.join(cursor, segment);
    const stat = fs.lstatSync(cursor);
    if (stat.isSymbolicLink() || !stat.isDirectory()) throw new Error('Project root symlink/reparse rejected');
  }
  return fs.realpathSync.native(absolute);
}
function safeFile(root, relative, {missing = false} = {}) {
  if (typeof relative !== 'string' || !relative || path.isAbsolute(relative) || relative.includes('\\') || relative.split('/').some(s => !s || s === '.' || s === '..' || /[:\0]/.test(s) || /[. ]$/.test(s))) throw new Error('Invalid confined project path');
  let cursor = safeRoot(root);
  const parts = relative.split('/');
  for (let i = 0; i < parts.length; i++) {
    cursor = path.join(cursor, parts[i]);
    let stat;
    try { stat = fs.lstatSync(cursor); }
    catch (error) {
      if (error.code !== 'ENOENT') throw error;
      if (missing) return path.resolve(root, relative);
      throw new Error('Missing linked project input: ' + relative);
    }
    if (stat.isSymbolicLink() || (i < parts.length - 1 ? !stat.isDirectory() : !stat.isFile())) throw new Error('Linked file symlink/reparse or non-file rejected');
  }
  if (!inside(safeRoot(root), fs.realpathSync.native(cursor))) throw new Error('Linked file escaped project');
  return cursor;
}
function digest(root, relative) {
  const file = safeFile(root, relative, {missing:true});
  return fs.existsSync(file) ? sha(fs.readFileSync(file)) : null;
}
function readJson(root, relative, maxBytes = 2 * 1024 * 1024) {
  const bytes = fs.readFileSync(safeFile(root, relative));
  if (bytes.length > maxBytes) throw new Error('Linked metadata exceeds bounded size');
  return JSON.parse(bytes.toString('utf8').replace(/^\uFEFF/, ''));
}
function git(root, args) {
  return execFileSync('git', ['-C', safeRoot(root), ...args], {encoding:'utf8', windowsHide:true, timeout:10000, stdio:['ignore','pipe','pipe']}).trim();
}
function projectRoot(cwd) { return safeRoot(git(cwd, ['rev-parse', '--show-toplevel'])); }
function commonRoot(root) { return safeRoot(path.resolve(root, git(root, ['rev-parse','--git-common-dir']))); }
function projectId(root) { return sha(identity(safeRoot(root))); }
function listFiles(root, relative, expression) {
  const directory = safeRoot(path.join(root, relative));
  return fs.readdirSync(directory).filter(name => expression.test(name)).sort().map(name => {
    safeFile(root, relative + '/' + name);
    return relative + '/' + name;
  });
}
function runtimeDataFiles(root, relative) {
  const allowed = relative === 'research/framework-evolution' ? ['sources.json','heuristics.json','competencies.json','fixture.json'] : ['expert-profiles.json','source-program.json','task-bindings.json','operational-contracts.json','jev-use-cases.json','model-policy.json','competence-runtime.json','fixture.json'];
  return listFiles(root,relative,/\.json$/).filter(file => allowed.includes(file.split('/').pop()));
}
function checkManifest(manifest, activeRoot) {
  if (manifest?.schemaVersion !== 1 || manifest.kind !== 'sinapse-project-expert-link' || manifest.contextOnly !== true || manifest.privateLibrary !== 'project-local' || !/^[a-f0-9]{40}$/.test(manifest.sourceHead || '') || !Array.isArray(manifest.inputs) || !manifest.inputs.length || !Array.isArray(manifest.rosters)) throw new Error('Invalid project link manifest');
  const project = safeRoot(manifest.projectRoot), source = safeRoot(manifest.sourceRoot);
  if (identity(project) !== identity(safeRoot(activeRoot)) || manifest.projectId !== projectId(project)) throw new Error('Cross-project context rejected');
  if (identity(commonRoot(project)) !== identity(safeRoot(manifest.gitCommonRoot)) || identity(commonRoot(source)) !== identity(safeRoot(manifest.gitCommonRoot))) throw new Error('Linked roots no longer belong to the authorized repository');
  const seen = new Set();
  for (const entry of manifest.inputs) {
    if (!entry || seen.has(entry.path) || !/^[a-f0-9]{64}$/.test(entry.sha256 || '') || digest(source, entry.path) !== entry.sha256) throw new Error('Stale or modified linked project input: ' + entry?.path);
    seen.add(entry.path);
  }
  if (!seen.has('scripts/framework-evolution/runtime.cjs')) throw new Error('Missing frozen runtime');
  for (const roster of manifest.rosters) {
    if (!roster || !['md','json'].includes(roster.extension) || !Array.isArray(roster.files)) throw new Error('Invalid linked source roster');
    const actual = roster.runtimeOnly === true ? runtimeDataFiles(source,roster.path) : listFiles(source, roster.path, roster.extension === 'md' ? /\.md$/ : /\.json$/);
    if (JSON.stringify(actual) !== JSON.stringify(roster.files) || actual.some(file => !seen.has(file))) throw new Error('Stale linked source roster: ' + roster.path);
  }
  if (!manifest.library || manifest.library.path !== 'research/expert-evolution/library/overlay.json' || !(manifest.library.sha256 === null || /^[a-f0-9]{64}$/.test(manifest.library.sha256 || '')) || digest(source, manifest.library.path) !== manifest.library.sha256) throw new Error('Stale project-private knowledge overlay');
  return {project, source};
}
function checkDelivery(home,registry,receiptSha256) {
  if (digest(home,DELIVERY) === null) throw new Error('Incomplete project expert installation: delivery receipt missing');
  const receipt=readJson(home,DELIVERY);
  if (receipt.schemaVersion!==1 || receipt.kind!=='sinapse-project-expert-delivery' || receipt.status!=='installed-bounded' || receipt.transactionId!==registry.transactionId || receipt.registrySha256!==receiptSha256 || receipt.contextOnly!==true || receipt.executionObserved!==false || receipt.privateLibraryCopied!==false || !Array.isArray(receipt.files) || !Array.isArray(receipt.projectIds) || JSON.stringify(receipt.projectIds)!==JSON.stringify(registry.links.map(link=>link.projectId))) throw new Error('Incomplete project expert installation: receipt does not match the approved transaction');
  const expected=new Map(),key=(root,relative)=>identity(root)+'|'+relative;
  const add=(root,relative,knownSha256)=>expected.set(key(root,relative),{root,path:relative,knownSha256});
  add(home,GATEWAY,registry.gateway.sha256);add(home,REGISTRY,receiptSha256);
  for (const prefix of ['.agents/skills','.claude/skills']) add(home,prefix+'/sinapse-project-expert/SKILL.md');
  for (const link of registry.links) {
    if (!/^[a-f0-9]{64}$/.test(link.projectId||'') || link.path!=='.sinapse/project-expert/links/'+link.projectId+'.json' || digest(home,link.path)!==link.sha256) throw new Error('Incomplete project expert installation: linked manifest mismatch');
    add(home,link.path,link.sha256);
    const manifest=readJson(home,link.path),project=safeRoot(manifest.projectRoot),source=safeRoot(manifest.sourceRoot);
    if (manifest.projectId!==link.projectId || projectId(project)!==link.projectId) throw new Error('Incomplete project expert installation: approved root mismatch');
    if (identity(project)!==identity(source)) for (const prefix of ['.agents/skills','.claude/skills']) add(project,prefix+'/sinapse-project-expert/SKILL.md');
  }
  if (receipt.files.length!==expected.size) throw new Error('Incomplete project expert installation: write set mismatch');
  const seen=new Set();
  for (const entry of receipt.files) {
    if (typeof entry.root!=='string' || typeof entry.path!=='string') throw new Error('Incomplete project expert installation: invalid file record');
    const id=key(entry.root,entry.path),owned=expected.get(id);
    if (!owned || seen.has(id) || !/^[a-f0-9]{64}$/.test(entry.sha256||'') || (owned.knownSha256 && entry.sha256!==owned.knownSha256) || digest(owned.root,owned.path)!==entry.sha256) throw new Error('Incomplete project expert installation: missing or changed provider write set');
    seen.add(id);
  }
}
function loadLink({home = os.homedir(), cwd = process.cwd(), receiptSha256} = {}) {
  home = safeRoot(home);
  if (!/^[a-f0-9]{64}$/.test(receiptSha256 || '') || digest(home, REGISTRY) !== receiptSha256) throw new Error('Project registry trust hash mismatch');
  const registry = readJson(home, REGISTRY);
  if (registry.schemaVersion !== 1 || registry.kind !== 'sinapse-project-expert-registry' || !Array.isArray(registry.links) || !registry.links.length || registry.links.length>2 || registry.gateway?.path !== GATEWAY || digest(home, GATEWAY) !== registry.gateway.sha256) throw new Error('Project gateway trust mismatch');
  checkDelivery(home,registry,receiptSha256);
  const active = projectRoot(cwd), id = projectId(active), matches = registry.links.filter(link => link.projectId === id);
  if (matches.length !== 1) throw new Error('This project is not explicitly linked');
  const link = matches[0];
  if (link.path !== '.sinapse/project-expert/links/' + id + '.json' || digest(home, link.path) !== link.sha256) throw new Error('Project link trust hash mismatch');
  const manifest = readJson(home, link.path), verified = checkManifest(manifest, active);
  return {manifest, verified, linkSha256:link.sha256};
}
function buildProjectContext(options = {}) {
  const {manifest, verified, linkSha256} = loadLink(options);
  // Code is imported only after every frozen module/input has passed its hash.
  const runtime = require(safeFile(verified.source, 'scripts/framework-evolution/runtime.cjs'));
  const locator = relative => {
    if (!manifest.inputs.some(input=>input.path===relative)) throw new Error('Context locator is not a frozen source input');
    safeFile(verified.source,relative);return relative;
  };
  let knowledgeMaxChars = options.knowledgeMaxChars ?? 6000;
  // Reassemble optional knowledge with the exact link overhead reserved. The
  // runtime keeps criteria/vetoes intact or fails closed; never slice output.
  for (let attempt = 0; attempt < 3; attempt++) {
    const payload = runtime.buildRuntimeContext({root:verified.source, agentId:options.agentId, task:options.task, brief:options.brief || '', maxChars:options.maxChars ?? 12000, knowledgeMaxChars, contextOnly:true});
    if (payload.capsule?.model !== null || payload.executionObserved !== false || payload.contextOnly !== true) throw new Error('Runtime did not return a provider-independent context-only contract');
    payload.projectLink = {projectId:manifest.projectId,sourceHead:manifest.sourceHead,linkSha256,sourceRoot:verified.source,activeProjectRoot:verified.project,sourceInputsReadOnly:true,locators:{canonical:locator(payload.capsule.sourceOfTruth),task:locator(payload.capsule.task.target)},privateLibrary:'project-local',executionObserved:false,expertisePromotion:false};
    for (let i = 0; i < 4; i++) { const size = JSON.stringify(payload).length; if (payload.charsUsed === size) break; payload.charsUsed = size; }
    const knowledgeChars = JSON.stringify(payload.knowledge).length;
    if (knowledgeChars > Math.min(knowledgeMaxChars,6000) || (payload.profile && JSON.stringify(payload.profile).length > 3000)) throw new Error('Linked context exceeded its complete budget');
    if (payload.charsUsed <= payload.maxChars) return payload;
    knowledgeMaxChars = Math.min(knowledgeMaxChars,knowledgeChars) - (payload.charsUsed - payload.maxChars) - 8;
    if (knowledgeMaxChars < 1) break;
  }
  throw new Error('Linked context exceeded its complete budget');
}
function parseArgs(args) {
  const result = {agentId:args[0]};
  for (let i = 1; i < args.length; i++) {
    const flag = args[i];
    if (flag === '--json') continue;
    const key = {'--task':'task','--brief':'brief','--max-chars':'maxChars','--knowledge-max-chars':'knowledgeMaxChars','--receipt-sha256':'receiptSha256'}[flag];
    if (!key || !args[i + 1] || args[i + 1].startsWith('--') || result[key] !== undefined) throw new Error('Invalid project context option: ' + flag);
    result[key] = key.endsWith('Chars') ? Number(args[++i]) : args[++i];
  }
  if (typeof result.agentId !== 'string' || !/^@?[a-z0-9][a-z0-9-]*$/i.test(result.agentId) || typeof result.task !== 'string' || !/^[*/]?[a-z0-9][a-z0-9-]*$/i.test(result.task)) throw new Error('An exact existing agent and task are required');
  return result;
}
if (require.main === module) {
  try { process.stdout.write(JSON.stringify(buildProjectContext(parseArgs(process.argv.slice(2)))) + '\n'); }
  catch (error) { process.stderr.write(error.message + '\n'); process.exitCode = 1; }
}
module.exports = {REGISTRY,GATEWAY,DELIVERY,sha,identity,inside,safeRoot,safeFile,digest,readJson,git,projectRoot,commonRoot,projectId,listFiles,runtimeDataFiles,checkManifest,checkDelivery,loadLink,buildProjectContext,parseArgs};
