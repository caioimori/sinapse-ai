'use strict';

// Task-first routing metadata. Discovery membership never grants execution.
const fs = require('node:fs');
const path = require('node:path');
const resolver = require('../../.codex/scripts/resolve-codex-agent.js');
const commands = require('../../.codex/scripts/resolve-codex-command.js');
const operational = require('./operational.cjs');
const ROOT = path.resolve(__dirname, '../..');
const BINDINGS = 'research/expert-evolution/task-bindings.json';
const slug = value => typeof value === 'string' && /^[a-z0-9][a-z0-9-]*$/.test(value);

function checkedAgent(root, id) {
  if (typeof id !== 'string' || !/^@?[a-z0-9][a-z0-9-]*$/.test(id)) throw new Error('Invalid routing agent ID');
  const agent = resolver.resolveCodexAgent(id, root);
  operational.safeFile(root, agent.pointer);
  operational.safeFile(root, agent.sourceOfTruth);
  return agent;
}

function resolveExecutorTask({root = ROOT, orchestratorId, ownerId, command} = {}) {
  const orchestrator = checkedAgent(root, orchestratorId), owner = checkedAgent(root, ownerId);
  if (!orchestrator.isOrchestrator) throw new Error('Routing requires an orchestrator');
  if (owner.isOrchestrator || !orchestrator.squad || orchestrator.squad === 'core' || owner.squad !== orchestrator.squad) throw new Error('Executor outside canonical squad routing boundary');
  if (!slug(command)) throw new Error('An exact executor command is required');
  const matches = owner.tasks.filter(task => task.command === command);
  if (new Set(matches.map(task => task.target)).size > 1) throw new Error('Ambiguous executor command');
  const resolved = commands.resolveCodexCommand(owner.agentId, command, root);
  const contract = operational.getOperationalContract({root, agentId:owner.agentId, command:resolved.commandId, target:resolved.target, resolvedBy:resolved.resolvedBy, requireExecution:true});
  const authority = contract.task.authority;
  if (!authority.executionAuthorized || authority.ownerId !== owner.agentId) throw new Error('Executor requires exact canonical task ownership');
  const bindings = JSON.parse(fs.readFileSync(operational.safeFile(root, BINDINGS), 'utf8'));
  if (bindings.schemaVersion !== 1 || !Array.isArray(bindings.bindings)) throw new Error('Invalid routing task bindings');
  const selected = bindings.bindings.filter(binding => binding.agentId === owner.agentId && binding.command === resolved.commandId);
  if (selected.length > 1) throw new Error('Ambiguous routing task binding');
  const binding = selected[0];
  if (binding && (binding.sourceSha256 !== contract.canonical.sha256 || binding.taskPath !== resolved.target || binding.taskSha256 !== contract.task.sha256)) throw new Error('Stale routing task binding');
  return {ownerId:owner.agentId, command:resolved.commandId, target:resolved.target, taskSha256:contract.task.sha256, canonical:contract.canonical, ownershipBasis:authority.basis, mode:'delegate', executionAuthorized:false};
}

function getRoutingMap({root = ROOT, agentId, command, target, resolvedBy, maxChars = 6000, compact = false} = {}) {
  if (!Number.isSafeInteger(maxChars) || maxChars < 256 || maxChars > 6000) throw new Error('Invalid routing budget');
  if (typeof compact !== 'boolean') throw new Error('Invalid routing compact flag');
  const agent = checkedAgent(root, agentId);
  if (!agent.isOrchestrator) return null;
  // Verify the exact current task first. Never preload on cold activation.
  operational.getOperationalContract({root, agentId:agent.agentId, command, target, resolvedBy});
  if (!agent.squad || agent.squad === 'core') return null;
  const program = operational.loadContracts(root);
  if (program.schemaVersion !== 1 || program.expertisePromoted !== false || !Array.isArray(program.contracts)) throw new Error('Invalid routing operational program');
  const bindings = JSON.parse(fs.readFileSync(operational.safeFile(root, BINDINGS), 'utf8'));
  if (bindings.schemaVersion !== 1 || !Array.isArray(bindings.bindings)) throw new Error('Invalid routing task bindings');
  const ids = Object.values(resolver.loadCodexAgentIndex(root)).filter(entry => entry.squad === agent.squad && entry.id !== agent.agentId).map(entry => entry.id).sort();
  const routes = [], gaps = [];
  for (const id of ids) {
    const owner = checkedAgent(root, id);
    if (owner.isOrchestrator) continue;
    const contracts = program.contracts.filter(contract => contract.agentId === id);
    if (contracts.length !== 1) throw new Error('Ambiguous/missing routing operational owner '+id);
    const candidates = contracts[0].tasks.filter(task => task.authority?.executionAuthorized && task.authority.ownerId === id);
    if (new Set(candidates.map(task => task.command)).size !== candidates.length) throw new Error('Ambiguous routing operational command '+id);
    const bound = new Set(bindings.bindings.filter(binding => binding.agentId === id).map(binding => binding.command));
    candidates.sort((a,b) => Number(bound.has(b.command))-Number(bound.has(a.command)) || a.command.localeCompare(b.command, 'en'));
    if (!candidates.length) { gaps.push({ownerId:id, reason:'No exact owned executable task'}); continue; }
    const route = resolveExecutorTask({root, orchestratorId:agent.agentId, ownerId:id, command:candidates[0].command});
    if (route.target !== candidates[0].path || route.taskSha256 !== candidates[0].sha256 || JSON.stringify(route.canonical) !== JSON.stringify(contracts[0].canonical)) throw new Error('Stale routing operational owner '+id);
    routes.push({...route, additionalTasks:candidates.length-1});
  }
  const result = {schemaVersion:1, squad:agent.squad, mode:'delegate', executionAuthorized:false, selection:'One exact owned task per specialist; bound commands first, then lexical order. Query routing.cjs for another exact command.', routes, gaps, maxChars};
  if (compact) {
    const basePath = `squads/${agent.squad}/`;
    if (routes.some(route => !route.target.startsWith(basePath) || !route.canonical.path.startsWith(basePath))) throw new Error('Compact routing source outside squad');
    result.basePath = basePath;
    result.columns = ['ownerId','command','target','taskSha256','canonicalPath','canonicalSha256','ownershipBasis','additionalTasks'];
    result.routes = routes.map(route => [route.ownerId, route.command, route.target.slice(basePath.length), route.taskSha256, route.canonical.path.slice(basePath.length), route.canonical.sha256, route.ownershipBasis, route.additionalTasks]);
  }
  if (JSON.stringify(result).length > maxChars) throw new Error('Complete routing map exceeds reserved budget');
  return result;
}

if (require.main === module) {
  try {
    const [orchestratorId, ownerId, command, ...extra] = process.argv.slice(2);
    if (extra.length) throw new Error('Usage: routing.cjs <orchestrator> <owner> <exact-command>');
    process.stdout.write(JSON.stringify(resolveExecutorTask({orchestratorId, ownerId, command}))+'\n');
  } catch (error) { process.stderr.write(error.message+'\n'); process.exitCode=1; }
}
module.exports = {getRoutingMap, resolveExecutorTask};
