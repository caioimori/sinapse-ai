'use strict';

const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const resolver = require('../../.codex/scripts/resolve-codex-agent.js');
const { resolveCodexCommand } = require('../../.codex/scripts/resolve-codex-command.js');
const repoRoot = path.resolve(__dirname, '../..');

function containedFile(root, relative) {
  if (typeof relative !== 'string' || path.isAbsolute(relative)) throw new Error('Invalid canonical path');
  const base = fs.realpathSync(root);
  const candidate = path.resolve(base, relative);
  const lexical = path.relative(base, candidate);
  if (lexical.startsWith('..') || path.isAbsolute(lexical)) throw new Error('Canonical path escapes project');
  let cursor = base;
  for (const segment of lexical.split(path.sep)) { cursor = path.join(cursor, segment); if (fs.lstatSync(cursor).isSymbolicLink()) throw new Error('Canonical symlink rejected'); }
  const absolute = fs.realpathSync(candidate);
  const rel = path.relative(base, absolute);
  if (rel.startsWith('..') || path.isAbsolute(rel) || !fs.statSync(absolute).isFile()) throw new Error('Canonical path escapes project');
  return absolute;
}

function buildRuntimeContext({ root = repoRoot, agentId, task, brief = '', competencies = [], maxChars = 12000, knowledgeMaxChars = 6000, model, contextOnly = false } = {}) {
  if (typeof contextOnly !== 'boolean') throw new Error('Invalid context-only flag');
  if (contextOnly && model !== undefined && model !== null) throw new Error('Context-only assembly cannot select an execution model');
  model = contextOnly ? null : (model === undefined ? 'gpt-6.1-sol' : model);
  if(typeof brief!=='string'||brief.length>4000||brief.includes('\u0000')) throw new Error('Invalid bounded user brief (0..4000 characters)');
  if (!Number.isSafeInteger(maxChars) || maxChars < 2000 || maxChars > 12000) throw new Error('Invalid context budget (2000..12000)');
  if (!Number.isSafeInteger(knowledgeMaxChars) || knowledgeMaxChars < 1 || knowledgeMaxChars > Math.min(maxChars, 6000)) throw new Error('Invalid knowledge budget');
  const expertPayload = ['scripts/expert-evolution/expertise.cjs','scripts/expert-evolution/model-policy.cjs','scripts/framework-evolution/jev.cjs',...['expert-profiles','source-program','jev-use-cases','model-policy','task-bindings'].map(name => `research/expert-evolution/${name}.json`)];
  const availability = expertPayload.map(relative => fs.existsSync(path.join(root, relative)));
  const withExpertise = availability.some(Boolean);
  const operationalPayload = ['scripts/expert-evolution/operational.cjs','research/expert-evolution/operational-contracts.json'];
  const operationalAvailability = operationalPayload.map(relative => fs.existsSync(path.join(root,relative)));
  const withOperational = operationalAvailability.some(Boolean);
  if (withOperational && !operationalAvailability.every(Boolean)) throw new Error('Partial operational authority installation');
  if (withOperational) operationalPayload.forEach(relative => containedFile(root,relative));
  if (withExpertise && !availability.every(Boolean)) throw new Error('Partial expert evolution installation');
  if (withExpertise) {
    expertPayload.forEach(relative => containedFile(root, relative));
    if (!contextOnly) {
      const policy = require('../expert-evolution/model-policy.cjs');
      const selected = policy.assessModel(policy.loadPolicy(root), model, {root});
      if (!selected.allowed) throw new Error(`Model policy blocked: ${selected.reasons.join('; ')}`);
    }
  } else if (!contextOnly && model !== 'gpt-6.1-sol') throw new Error('Unsupported requested model');
  if (typeof agentId !== 'string' || !/^@?[a-z0-9][a-z0-9-]*$/i.test(agentId)) throw new Error('Invalid agent ID');
  if (typeof task !== 'string' || !/^[*/]?[a-z0-9][a-z0-9-]*$/i.test(task)) throw new Error('An exact task command is required');
  const agent = resolver.resolveCodexAgent(agentId, root);
  const command = resolveCodexCommand(agent.agentId === 'snps-orqx' ? 'sinapse-orqx' : agent.agentId, task, root);
  const canonicalPath = containedFile(root, agent.sourceOfTruth);
  containedFile(root, agent.pointer);
  const taskPath = containedFile(root, command.target);
  const operational = withOperational ? require('../expert-evolution/operational.cjs').getOperationalContract({root,agentId:agent.agentId,command:command.commandId,target:command.target,resolvedBy:command.resolvedBy,requireExecution:!contextOnly}) : null;
  const text = fs.readFileSync(canonicalPath, 'utf8');
  const taskText = fs.readFileSync(taskPath, 'utf8').slice(0, 4000);
  const taskTitle = taskText.match(/^#{1,6}\s+(.+)$/m)?.[1] || command.commandId;
  const taskPointer = agent.tasks.find((entry) => entry.command === command.commandId) || { scope: command.resolvedBy === 'registry' ? 'registry' : 'declared' };
  const capsule = { agentId: agent.agentId, squad: agent.squad, model, task: { command: command.commandId, target: command.target, scope: taskPointer.scope }, sourceOfTruth: agent.sourceOfTruth, canonicalSha256: crypto.createHash('sha256').update(text).digest('hex'), pointer: agent.pointer, authority: 'Routing metadata only. Read the canonical definition and exact task before execution; existing story, security, delegation and human approval gates retain authority.', fallback: taskPointer.scope === 'squad-pool' };
  const profile = withExpertise ? require('../expert-evolution/expertise.cjs').getProfile({root, agentId:agent.agentId, maxChars:Math.min(3000, maxChars - 1000), compact:true, task:{command:command.commandId,title:taskTitle,text:taskText}}) : null;
  const routingPath = 'scripts/expert-evolution/routing.cjs';
  if (withOperational && agent.isOrchestrator && agent.squad && agent.squad !== 'core' && !fs.existsSync(path.join(root, routingPath))) throw new Error('Partial squad routing installation: missing routing.cjs');
  if (withOperational && agent.isOrchestrator && fs.existsSync(path.join(root, routingPath))) {
    containedFile(root, routingPath);
    const routing = require('../expert-evolution/routing.cjs').getRoutingMap({root, agentId:agent.agentId, command:command.commandId, target:command.target, resolvedBy:command.resolvedBy, compact:true});
    if (routing) capsule.routing = routing;
  }
  // Reserve complete routing/profile/authority metadata before selecting knowledge.
  // A source is selected whole or rejected; no budget fallback truncates it.
  const effectiveKnowledgeMaxChars = capsule.routing ? Math.min(knowledgeMaxChars, maxChars - JSON.stringify(capsule).length - JSON.stringify(profile).length - JSON.stringify(operational).length - brief.length - 1400) : knowledgeMaxChars;
  if (effectiveKnowledgeMaxChars < 256) throw new Error('Complete routing metadata leaves insufficient knowledge budget');
  const competenceFiles=['scripts/expert-evolution/competence.cjs','research/expert-evolution/competence-runtime.json'];
  const competenceAvailability=competenceFiles.map(relative=>fs.existsSync(path.join(root,relative)));
  if(competenceAvailability.some(Boolean)&&!competenceAvailability.every(Boolean))throw new Error('Partial competence runtime installation');
  const knowledgeRequest={root,agentId:agent.agentId,squad:agent.squad,competencies,brief,task:{command:command.commandId,title:taskTitle,text:taskText},maxItems:3,maxChars:effectiveKnowledgeMaxChars};
  let knowledge=require('./knowledge.cjs').retrieveKnowledge(knowledgeRequest);
  let competence=null;
  if(competenceAvailability.every(Boolean)){
    competenceFiles.forEach(relative=>containedFile(root,relative));
    if(effectiveKnowledgeMaxChars-JSON.stringify(knowledge).length-24<1800)knowledge=require('./knowledge.cjs').retrieveKnowledge({...knowledgeRequest,maxItems:1});
    competence=require('../expert-evolution/competence.cjs').selectCompetenceKnowledge({root,agentId:agent.agentId,command:command.commandId,brief,maxChars:Math.min(effectiveKnowledgeMaxChars-JSON.stringify(knowledge).length-24,5000)});
  }
  if(competence)knowledge.competence=competence;
  knowledge.maxChars=effectiveKnowledgeMaxChars;
  for(let i=0;i<4;i++)knowledge.charsUsed=JSON.stringify(knowledge).length;
  if(JSON.stringify(knowledge).length>effectiveKnowledgeMaxChars)throw new Error('Complete knowledge exceeds reserved character budget');
  const payload = { schemaVersion: 1, capsule, contextOnly, executionObserved:false, execution:{mode:contextOnly?'context-only':'policy-checked-assembly',observed:false,provider:null}, brief, knowledge, ...(profile ? {profile} : {}), ...(operational ? {operational} : {}), sources: [agent.sourceOfTruth, agent.pointer, command.target], gaps: [...(knowledge.gaps || []), ...(profile ? ['Expert program coverage is planned; source inventory does not establish validated expertise.'] : []), ...(capsule.fallback ? ['Task is exposed for delegation discovery; operational authority is separately explicit.'] : [])], charsUsed: 0, maxChars, limits: ['Offline assembly only; no model execution or global settings change.', 'Structural assembly is not proof of behavioral improvement.'] };
  for (let iteration = 0; iteration < 4; iteration++) {
    const length = JSON.stringify(payload).length;
    if (length === payload.charsUsed) break;
    payload.charsUsed = length;
  }
  if (payload.charsUsed > maxChars) throw new Error(`Context budget exceeded: ${payload.charsUsed} > ${maxChars}`);
  return payload;
}

function parseArgs(args) {
  const options = { agentId: args[0] };
  for (let i = 1; i < args.length; i++) {
    const flag = args[i];
    if (flag === '--json') continue;
    if (flag === '--context-only') { options.contextOnly = true; continue; }
    const key = { '--task': 'task', '--brief': 'brief', '--max-chars': 'maxChars', '--knowledge-max-chars': 'knowledgeMaxChars', '--model': 'model' }[flag];
    if (!key || !args[i + 1] || args[i + 1].startsWith('--')) throw new Error(`Invalid option ${flag}`);
    options[key] = key.includes('Chars') ? Number(args[++i]) : args[++i];
  }
  return options;
}
if (require.main === module) {
  try { process.stdout.write(`${JSON.stringify(buildRuntimeContext(parseArgs(process.argv.slice(2))))}\n`); } catch (error) { process.stderr.write(`${error.message}\n`); process.exitCode = 1; }
}
module.exports = { buildRuntimeContext, containedFile, parseArgs };
