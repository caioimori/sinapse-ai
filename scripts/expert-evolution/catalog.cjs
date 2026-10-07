'use strict';
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const {execFileSync} = require('node:child_process');
const ROOT = path.resolve(__dirname, '../..');
const SOURCE = 'research/expert-evolution/repository-map.json';
const RESPONSIBILITIES = ['canonicalAgents','canonicalDomain','canonicalRuntime','workflows','providerAdapters','compatibility','tests','delivery','documentation','research','governance','history','operations'];
const OWNERS = {canonicalAgents:'agent-authority',canonicalDomain:'domain-squad',canonicalRuntime:'framework-runtime',workflows:'workflow-owner',providerAdapters:'provider-delivery',compatibility:'compatibility',tests:'quality-gate',delivery:'devops',documentation:'documentation',research:'research',governance:'governance',history:'records',operations:'operations'};
const digest = value => crypto.createHash('sha256').update(value).digest('hex');
const compare = (a,b) => a < b ? -1 : a > b ? 1 : 0;
function git(root, args) { return execFileSync('git', ['-C', root, ...args], {encoding:'utf8', maxBuffer:32 * 1024 * 1024}).trim(); }
function exactRoot(root) {
  let cursor = path.resolve(root);
  while (cursor !== path.dirname(cursor)) {
    if (fs.lstatSync(cursor).isSymbolicLink()) throw new Error('Catalog symlink root rejected');
    cursor = path.dirname(cursor);
  }
  const actual = fs.realpathSync.native(path.resolve(root));
  const repository = fs.realpathSync.native(git(actual, ['rev-parse','--show-toplevel']));
  const identity = value => process.platform === 'win32' ? value.toLowerCase() : value;
  if (identity(actual) !== identity(repository)) throw new Error('Catalog requires the exact Git root');
  return actual;
}
function safeFile(root, relative) {
  if (typeof relative !== 'string' || !relative || relative.includes('\\') || path.isAbsolute(relative) || /^[A-Za-z]:/.test(relative) || relative.split('/').some(segment => !segment || segment === '.' || segment === '..')) throw new Error(`Unsafe catalog path: ${relative}`);
  let current = root;
  for (const segment of relative.split('/')) {
    current = path.join(current, segment);
    if (fs.lstatSync(current).isSymbolicLink()) throw new Error(`Catalog symlink rejected: ${relative}`);
  }
  if (!fs.statSync(current).isFile()) throw new Error(`Catalog path is not a file: ${relative}`);
  const real = fs.realpathSync(current);
  const rel = path.relative(fs.realpathSync(root), real);
  if (rel.startsWith('..') || path.isAbsolute(rel)) throw new Error(`Catalog path escapes root: ${relative}`);
  return real;
}
function trackedPaths(root) { return execFileSync('git', ['-C', root, 'ls-files','-z'], {encoding:'utf8', maxBuffer:32 * 1024 * 1024}).split('\0').filter(Boolean).sort(compare); }
function classifyPath(relative) {
  if (/(^|\/)(_archive|_deprecated|archived)(\/|$)/.test(relative) || relative.startsWith('docs/stories/')) return 'history';
  if (/(^|\/)(__tests__|tests|fixtures)(\/|$)/.test(relative) || /\.(test|spec)\.[^/]+$/.test(relative)) return 'tests';
  if (/^(squads\/[^/]+\/agents\/|\.sinapse-ai\/development\/agents\/)/.test(relative) && relative.endsWith('.md')) return 'canonicalAgents';
  if (/^(\.codex\/agents\/|\.claude\/agents\/|\.agents\/skills\/|\.claude\/skills\/)/.test(relative)) return 'providerAdapters';
  if (/^sinapse\/agents\//.test(relative) || /migrations?\//.test(relative)) return 'compatibility';
  if (/(^|\/)(tasks|workflows)(\/|$)/.test(relative)) return 'workflows';
  if (/^(squads\/|sinapse\/knowledge-base\/)/.test(relative)) return 'canonicalDomain';
  if (relative.startsWith('.sinapse-ai/')) return 'canonicalRuntime';
  if (/^(bin\/|scripts\/|packages\/)/.test(relative)) return 'delivery';
  if (relative.startsWith('research/')) return 'research';
  if (/^(governance\/|audits\/)/.test(relative)) return 'governance';
  if (relative.startsWith('docs/') || /^[^/]+\.md$/.test(relative)) return 'documentation';
  return 'operations';
}
function loadCatalog({root = ROOT, source = SOURCE} = {}) { return JSON.parse(fs.readFileSync(safeFile(exactRoot(root), source),'utf8').replace(/^\uFEFF/,'')); }
function clusterDigest(files) { return digest(files.map(file => `${file.path}\0${file.sha256}`).join('\n')); }
function buildCatalog({root = ROOT, source = SOURCE, include = [], baseline} = {}) {
  root = exactRoot(root);
  const prior = baseline || loadCatalog({root, source});
  if (!Array.isArray(include) || new Set(include).size !== include.length) throw new Error('Invalid/duplicate explicit includes');
  const tracked = trackedPaths(root);
  const trackedSet = new Set(tracked);
  const all = [...new Set([...tracked, ...include])].sort(compare);
  const priorFiles = new Map((prior.files || []).map(file => [file.path,file]));
  const files = all.map(relative => {
    const bytes = fs.readFileSync(safeFile(root, relative));
    const responsibility = priorFiles.get(relative)?.responsibility || classifyPath(relative);
    return {path:relative, responsibility, owner:priorFiles.get(relative)?.owner || OWNERS[responsibility], bytes:bytes.length, sha256:digest(bytes), ...(trackedSet.has(relative) ? {} : {explicitInclude:true})};
  });
  const index = require('../../.codex/scripts/resolve-codex-agent.js').loadCodexAgentIndex(root);
  const byPath = new Map(files.map(file => [file.path,file]));
  const texts = new Map(files.filter(file => file.bytes < 1024 * 1024 && /\.(md|js|cjs|mjs|json|toml|yaml|yml|html|sh|ps1)$/.test(file.path)).map(file => [file.path,fs.readFileSync(safeFile(root,file.path),'utf8')]));
  const sources = [...new Set([...Object.values(index).map(entry => entry.sourcePath), ...(prior.sourceConsumerManifest || []).map(entry => entry.source)].filter(Boolean))];
  const sourceSet = new Set(sources);
  const consumerIndex = new Map(sources.map(source => [source, new Set()]));
  const literalPattern = new RegExp(sources.sort((a,b) => b.length - a.length || compare(a,b)).map(source => source.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')).join('|'),'g');
  // Parse each text once. Re-scanning every file for every agent scales poorly.
  for (const [relative, text] of texts) {
    for (const match of text.matchAll(literalPattern)) if (match[0] !== relative) consumerIndex.get(match[0]).add(relative);
    for (const match of text.matchAll(/(?:require\(\s*|from\s+|import\(\s*)['"](\.[^'"\n]+)['"]/g)) {
      const target = path.posix.normalize(path.posix.join(path.posix.dirname(relative), match[1]));
      for (const candidate of [target,`${target}.js`,`${target}.cjs`,`${target}.json`,`${target}/index.js`]) if (sourceSet.has(candidate) && candidate !== relative) consumerIndex.get(candidate).add(relative);
    }
  }
  function consumers(sourcePath) {
    return [...(consumerIndex.get(sourcePath) || [])].sort(compare);
  }
  const agents = Object.values(index).sort((a,b) => compare(a.id,b.id)).map(entry => ({id:entry.id,squad:entry.squad || 'core',sourcePath:entry.sourcePath,pointerPath:entry.pointerPath,sourceTracked:trackedSet.has(entry.sourcePath),consumers:consumers(entry.sourcePath),adapters:[entry.pointerPath,`.codex/agents/${entry.id}.toml`,`.claude/agents/sinapse-${entry.id}.md`]}));
  const squadIds = [...new Set(agents.map(agent => agent.squad).filter(squad => squad !== 'core'))].sort(compare);
  const squads = squadIds.map(id => ({id,manifest:`squads/${id}/squad.yaml`,agents:agents.filter(agent => agent.squad === id).map(agent => agent.id),knowledgePaths:all.filter(relative => relative.startsWith(`squads/${id}/knowledge-base/`)),taskPaths:all.filter(relative => relative.startsWith(`squads/${id}/tasks/`)),workflowPaths:all.filter(relative => relative.startsWith(`squads/${id}/workflows/`)),fileCount:all.filter(relative => relative.startsWith(`squads/${id}/`)).length}));
  const registryPath = '.codex/command-registry.json';
  const registry = JSON.parse(fs.readFileSync(safeFile(root,registryPath),'utf8'));
  const publicRegistry = Object.entries(registry.agents).sort(([a],[b]) => compare(a,b)).map(([id,entry]) => ({id,sourceOfTruth:entry.sourceOfTruth,sourceTracked:trackedSet.has(entry.sourceOfTruth),commands:Object.entries(entry.commands).sort(([a],[b]) => compare(a,b)).map(([command,spec]) => ({command,target:spec.target,kind:spec.kind,targetTracked:trackedSet.has(spec.target)}))}));
  const clusters = RESPONSIBILITIES.map(id => { const members = files.filter(file => file.responsibility === id); return {id,label:prior.clusters?.find(cluster => cluster.id === id)?.label || id,files:members.length,sha256:clusterDigest(members)}; });
  const equalBytes = new Map();
  for (const file of files) { if (!equalBytes.has(file.sha256)) equalBytes.set(file.sha256,[]); equalBytes.get(file.sha256).push(file); }
  const duplicateClusters = [...equalBytes].filter(([,members]) => members.length > 1).sort(([a],[b]) => compare(a,b)).map(([sha256,members]) => ({sha256,paths:members.map(file => file.path),action:'review-only-preserve',responsibilities:[...new Set(members.map(file => file.responsibility))].sort(compare),clusterHash:clusterDigest(members)}));
  return {...prior,scope:{...prior.scope,inventoryMode:'git-ls-files-explicit-includes',currentSha:git(root,['rev-parse','HEAD']),hashMode:'sha256-raw-checkout-bytes',clusterHashMode:'path-null-sha256-newline',baselineSha:prior.scope.baseSha,explicitIncludes:include.filter(relative => !trackedSet.has(relative)).sort(compare),evidence:'Current checkout refresh; canonical inventory is not installed-state or expert-performance evidence.'},files,agents,squads,publicRegistry,clusters,duplicateClusters,sourceConsumerManifest:(prior.sourceConsumerManifest || []).map(entry => ({...entry,consumers:consumers(entry.source),tracked:byPath.has(entry.source)})),coreAgents:agents.filter(agent => agent.squad === 'core').map(agent => agent.id),counts:{trackedFiles:tracked.length,coveredFiles:files.length,explicitIncludedFiles:all.length - tracked.length,agents:agents.length,squads:squads.length,publicRegistryAgents:publicRegistry.length,publicRegistryCommands:publicRegistry.reduce((sum,entry) => sum + entry.commands.length,0),duplicateClusters:duplicateClusters.length,duplicateFileMembers:duplicateClusters.reduce((sum,cluster) => sum + cluster.paths.length,0),byResponsibility:Object.fromEntries(clusters.map(cluster => [cluster.id,cluster.files]))}};
}
function validateCatalog(catalog, {root = ROOT, verifyHashes = true, checkCoverage = true, expectedCounts = {agents:172,squads:17,publicRegistryAgents:9,publicRegistryCommands:66}} = {}) {
  const errors = [];
  root = exactRoot(root);
  if (catalog?.schemaVersion !== 1 || !Array.isArray(catalog.files) || !Array.isArray(catalog.agents) || !Array.isArray(catalog.squads) || !Array.isArray(catalog.publicRegistry)) return {valid:false,errors:['Invalid catalog schema']};
  const byPath = new Map();
  for (const file of catalog.files) {
    if (byPath.has(file.path)) errors.push(`Duplicate path: ${file.path}`);
    byPath.set(file.path,file);
    if (!RESPONSIBILITIES.includes(file.responsibility) || !/^[a-f0-9]{64}$/.test(file.sha256 || '') || !Number.isSafeInteger(file.bytes) || file.bytes < 0) errors.push(`Invalid file record: ${file.path}`);
    try { const bytes = verifyHashes ? fs.readFileSync(safeFile(root,file.path)) : (safeFile(root,file.path),null); if (bytes && (digest(bytes) !== file.sha256 || bytes.length !== file.bytes)) errors.push(`Baseline hash drift: ${file.path}`); } catch(error) { errors.push(error.message); }
  }
  if (checkCoverage) {
    const tracked = trackedPaths(root), trackedSet = new Set(tracked);
    for (const relative of tracked) if (!byPath.has(relative)) errors.push(`Omitted tracked file: ${relative}`);
    for (const file of catalog.files) if (!trackedSet.has(file.path) && file.explicitInclude !== true) errors.push(`Untracked path requires explicit include: ${file.path}`);
    if (catalog.counts?.trackedFiles !== tracked.length) errors.push('Tracked count mismatch');
  }
  const canonicalIndex = require('../../.codex/scripts/resolve-codex-agent.js').loadCodexAgentIndex(root);
  const seenIds = new Set();
  for (const agent of catalog.agents) {
    if (seenIds.has(agent.id)) errors.push(`Duplicate agent: ${agent.id}`);
    seenIds.add(agent.id);
    if (!canonicalIndex[agent.id] || canonicalIndex[agent.id].sourcePath !== agent.sourcePath || (canonicalIndex[agent.id].squad || 'core') !== agent.squad) errors.push(`Canonical identity mismatch: ${agent.id}`);
    const file = byPath.get(agent.sourcePath);
    if (!file || file.responsibility !== 'canonicalAgents' || !byPath.has(agent.pointerPath) || agent.adapters?.length !== 3 || agent.adapters.some(relative => !byPath.has(relative))) errors.push(`Incomplete canonical source/adapters: ${agent.id}`);
    try {
      const pointer = fs.readFileSync(safeFile(root,agent.pointerPath),'utf8');
      if (pointer.match(/Read the agent definition at:\s*(\S+)/i)?.[1] !== agent.sourcePath) errors.push(`Canonical pointer mismatch: ${agent.id}`);
    } catch(error) { errors.push(error.message); }
  }
  const squadIds = new Set();
  for (const squad of catalog.squads) {
    if (squadIds.has(squad.id) || !byPath.has(squad.manifest) || squad.agents.some(id => !catalog.agents.some(agent => agent.id === id && agent.squad === squad.id))) errors.push(`Invalid squad: ${squad.id}`);
    squadIds.add(squad.id);
  }
  const currentRegistry = JSON.parse(fs.readFileSync(safeFile(root,'.codex/command-registry.json'),'utf8'));
  const publicIds = new Set();
  for (const entry of catalog.publicRegistry) {
    if (publicIds.has(entry.id) || !currentRegistry.agents[entry.id] || currentRegistry.agents[entry.id].sourceOfTruth !== entry.sourceOfTruth) errors.push(`Public identity mismatch: ${entry.id}`);
    publicIds.add(entry.id);
    if (!byPath.has(entry.sourceOfTruth)) errors.push(`Public source missing: ${entry.id}`);
    const commands = new Set();
    for (const command of entry.commands || []) {
      if (!byPath.has(command.target)) errors.push(`Public target missing: ${entry.id}/${command.command}`);
      if (commands.has(command.command) || currentRegistry.agents[entry.id]?.commands?.[command.command]?.target !== command.target) errors.push(`Public command mismatch: ${entry.id}/${command.command}`);
      commands.add(command.command);
    }
  }
  const actual = {coveredFiles:catalog.files.length,agents:catalog.agents.length,squads:catalog.squads.length,publicRegistryAgents:catalog.publicRegistry.length,publicRegistryCommands:catalog.publicRegistry.reduce((sum,entry) => sum + entry.commands.length,0)};
  for (const [key,value] of Object.entries({...expectedCounts,...actual})) if (catalog.counts?.[key] !== value || (expectedCounts[key] !== undefined && actual[key] !== expectedCounts[key])) errors.push(`Count mismatch: ${key}`);
  const clusterIds = new Set();
  for (const cluster of catalog.clusters || []) { const members = catalog.files.filter(file => file.responsibility === cluster.id); if (clusterIds.has(cluster.id) || !RESPONSIBILITIES.includes(cluster.id) || catalog.counts?.byResponsibility?.[cluster.id] !== members.length || cluster.files !== members.length || (catalog.scope?.clusterHashMode === 'path-null-sha256-newline' && cluster.sha256 !== clusterDigest(members))) errors.push(`Cluster mismatch: ${cluster.id}`); clusterIds.add(cluster.id); }
  for (const responsibility of RESPONSIBILITIES) if (!clusterIds.has(responsibility)) errors.push(`Missing responsibility cluster: ${responsibility}`);
  for (const cluster of catalog.duplicateClusters || []) if (cluster.paths.length < 2 || cluster.paths.some(relative => byPath.get(relative)?.sha256 !== cluster.sha256) || cluster.action !== 'review-only-preserve') errors.push('Invalid preserved duplicate cluster');
  return {valid:errors.length === 0, errors, evidence:catalog.scope?.inventoryMode === 'git-ls-files-explicit-includes' ? 'current-checkout' : 'baseline', counts:actual};
}
function queryAgent(catalog, id) {
  const aliases = require('../../.codex/scripts/resolve-codex-agent.js').STATIC_ALIASES;
  const normalized = String(id || '').replace(/^@/,'').toLowerCase();
  const agent = catalog.agents.find(entry => entry.id === normalized || entry.id === aliases[normalized]);
  if (!agent) throw new Error(`Unknown agent: ${id}`);
  return agent;
}
function querySquad(catalog, id) { const squad = catalog.squads.find(entry => entry.id === id); if (!squad) throw new Error(`Unknown squad: ${id}`); return squad; }
function queryPaths(catalog, responsibility) { if (!RESPONSIBILITIES.includes(responsibility)) throw new Error(`Unknown responsibility: ${responsibility}`); return catalog.files.filter(file => file.responsibility === responsibility); }
function queryDeliverable(term, {root = ROOT} = {}) {
  const index = JSON.parse(fs.readFileSync(safeFile(root, 'research/expert-evolution/deliverable-index.json'), 'utf8'));
  if (index.schemaVersion !== 1 || index.status !== 'navigation-not-expertise' || !Array.isArray(index.deliverables)) throw new Error('Invalid deliverable navigation index');
  const normalize = value => String(value || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();
  const seen = new Map();
  for (const item of index.deliverables) {
    if (!item.id || !item.family || !item.gap || !Array.isArray(item.aliases)) throw new Error('Incomplete deliverable navigation');
    for (const key of [item.id, ...item.aliases]) { const normalized = normalize(key); if (seen.has(normalized) && seen.get(normalized) !== item.id) throw new Error('Duplicate deliverable alias'); seen.set(normalized,item.id); }
  }
  const selected = index.deliverables.filter(item => [item.id, ...item.aliases].some(key => normalize(key) === normalize(term)));
  if (selected.length !== 1) throw new Error(`Unknown or ambiguous deliverable: ${term}`);
  const item = selected[0];
  const resolved = require('../../.codex/scripts/resolve-codex-command.js').resolveCodexCommand(item.agentId,item.command,root);
  const binding = require('./expertise.cjs').resolveTaskBinding({root,agentId:item.agentId,command:item.command});
  if (!binding || resolved.agentId !== item.agentId || resolved.target !== binding.taskPath) throw new Error('Deliverable does not match exact canonical task binding');
  return {...item,status:'resolved-navigation',canonical:{agentId:resolved.agentId,sourceOfTruth:resolved.sourceOfTruth,taskPath:resolved.target,taskSha256:binding.taskSha256,competencyIds:binding.competencyIds,deliverableIds:binding.deliverableIds},expertisePromotion:false};
}
function main(args = process.argv.slice(2), root = ROOT) {
  const command = args[0] || 'summary';
  const options = {root,include:[]};
  let subject, refresh = false;
  for (let i = 1; i < args.length; i++) {
    const flag = args[i];
    if (flag === '--refresh') { refresh = true; continue; }
    if (flag === '--json') continue;
    if (['--source','--include','--responsibility'].includes(flag)) { if (!args[i + 1] || args[i + 1].startsWith('--')) throw new Error(`Missing option: ${flag}`); const value = args[++i]; if (flag === '--include') options.include.push(value); else if (flag === '--source') options.source = value; else options.responsibility = value; }
    else if (!flag.startsWith('--') && !subject) subject = flag;
    else throw new Error(`Unknown option: ${flag}`);
  }
  const catalog = command === 'deliverable' ? null : refresh || options.include.length ? buildCatalog(options) : loadCatalog(options);
  let result;
  if (command === 'validate') result = validateCatalog(catalog,{root});
  else if (command === 'summary') result = {schemaVersion:1,scope:catalog.scope,counts:catalog.counts,limits:catalog.limits};
  else if (command === 'agent') result = queryAgent(catalog,subject);
  else if (command === 'squad') result = querySquad(catalog,subject);
  else if (command === 'paths') result = queryPaths(catalog,options.responsibility);
  else if (command === 'deliverable') result = queryDeliverable(subject,{root});
  else throw new Error('Usage: catalog.cjs summary|agent <id>|squad <id>|paths --responsibility <class>|validate [--source <path>] [--include <path>] [--refresh]');
  if (['agent','squad','paths'].includes(command)) {
    const selected = command === 'agent' ? [result.sourcePath,result.pointerPath,...result.adapters] : command === 'squad' ? [result.manifest,...result.knowledgePaths,...result.taskPaths,...result.workflowPaths] : result.map(file => file.path);
    for (const relative of selected) { const file = catalog.files.find(entry => entry.path === relative); const bytes = fs.readFileSync(safeFile(exactRoot(root),relative)); if (!file || digest(bytes) !== file.sha256) throw new Error(`Baseline hash drift: ${relative}; use --refresh for current evidence`); }
  }
  process.stdout.write(`${JSON.stringify(result,null,2)}\n`);
  if (result.valid === false) process.exitCode = 1;
  return result;
}
if (require.main === module) { try { main(); } catch(error) { process.stderr.write(`${error.message}\n`); process.exitCode = 1; } }
module.exports = {classifyPath,buildCatalog,validateCatalog,queryAgent,querySquad,queryPaths,queryDeliverable,loadCatalog,safeFile,exactRoot,main};
