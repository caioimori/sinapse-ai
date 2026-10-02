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

function buildRuntimeContext({ root = repoRoot, agentId, task, competencies = [], maxChars = 12000, knowledgeMaxChars = 6000, model = 'gpt-6.1-sol' } = {}) {
  if (!Number.isSafeInteger(maxChars) || maxChars < 2000 || maxChars > 12000) throw new Error('Invalid context budget (2000..12000)');
  if (!Number.isSafeInteger(knowledgeMaxChars) || knowledgeMaxChars < 1 || knowledgeMaxChars > Math.min(maxChars, 6000)) throw new Error('Invalid knowledge budget');
  const expertPayload = ['scripts/expert-evolution/expertise.cjs','scripts/expert-evolution/model-policy.cjs','scripts/framework-evolution/jev.cjs',...['expert-profiles','source-program','jev-use-cases','model-policy'].map(name => `research/expert-evolution/${name}.json`)];
  const availability = expertPayload.map(relative => fs.existsSync(path.join(root, relative)));
  const withExpertise = availability.some(Boolean);
  if (withExpertise && !availability.every(Boolean)) throw new Error('Partial expert evolution installation');
  if (withExpertise) {
    expertPayload.forEach(relative => containedFile(root, relative));
    const policy = require('../expert-evolution/model-policy.cjs');
    const selected = policy.assessModel(policy.loadPolicy(root), model);
    if (!selected.allowed) throw new Error(`Model policy blocked: ${selected.reasons.join('; ')}`);
  } else if (model !== 'gpt-6.1-sol') throw new Error('Unsupported requested model');
  if (typeof agentId !== 'string' || !/^@?[a-z0-9][a-z0-9-]*$/i.test(agentId)) throw new Error('Invalid agent ID');
  if (typeof task !== 'string' || !/^[*/]?[a-z0-9][a-z0-9-]*$/i.test(task)) throw new Error('An exact task command is required');
  const agent = resolver.resolveCodexAgent(agentId, root);
  const command = resolveCodexCommand(agent.agentId === 'snps-orqx' ? 'sinapse-orqx' : agent.agentId, task, root);
  const canonicalPath = containedFile(root, agent.sourceOfTruth);
  containedFile(root, agent.pointer);
  const taskPath = containedFile(root, command.target);
  const text = fs.readFileSync(canonicalPath, 'utf8');
  const taskText = fs.readFileSync(taskPath, 'utf8').slice(0, 4000);
  const taskTitle = taskText.match(/^#{1,6}\s+(.+)$/m)?.[1] || command.commandId;
  const taskPointer = agent.tasks.find((entry) => entry.command === command.commandId) || { scope: command.resolvedBy === 'registry' ? 'registry' : 'declared' };
  const capsule = { agentId: agent.agentId, squad: agent.squad, model, task: { command: command.commandId, target: command.target, scope: taskPointer.scope }, sourceOfTruth: agent.sourceOfTruth, canonicalSha256: crypto.createHash('sha256').update(text).digest('hex'), pointer: agent.pointer, authority: 'Routing metadata only. Read the canonical definition and exact task before execution; existing story, security, delegation and human approval gates retain authority.', fallback: taskPointer.scope === 'squad-pool' };
  const knowledge = require('./knowledge.cjs').retrieveKnowledge({ root, agentId: agent.agentId, squad: agent.squad, competencies, task: { command: command.commandId, title: taskTitle, text: taskText }, maxItems: 3, maxChars: knowledgeMaxChars });
  const profile = withExpertise ? require('../expert-evolution/expertise.cjs').getProfile({root, agentId:agent.agentId, maxChars:Math.min(3000, maxChars - 1000), compact:true, task:{command:command.commandId,title:taskTitle,text:taskText}}) : null;
  const payload = { schemaVersion: 1, capsule, knowledge, ...(profile ? {profile} : {}), sources: [agent.sourceOfTruth, agent.pointer, command.target], gaps: [...(knowledge.gaps || []), ...(profile ? ['Expert program coverage is planned; source inventory does not establish validated expertise.'] : []), ...(capsule.fallback ? ['Task is exposed by squad pool fallback, not explicitly bound to this specialist.'] : [])], charsUsed: 0, maxChars, limits: ['Offline assembly only; no model execution or global settings change.', 'Structural assembly is not proof of behavioral improvement.'] };
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
    const key = { '--task': 'task', '--max-chars': 'maxChars', '--knowledge-max-chars': 'knowledgeMaxChars', '--model': 'model' }[flag];
    if (!key || !args[i + 1] || args[i + 1].startsWith('--')) throw new Error(`Invalid option ${flag}`);
    options[key] = key.includes('Chars') ? Number(args[++i]) : args[++i];
  }
  return options;
}
if (require.main === module) {
  try { process.stdout.write(`${JSON.stringify(buildRuntimeContext(parseArgs(process.argv.slice(2))))}\n`); } catch (error) { process.stderr.write(`${error.message}\n`); process.exitCode = 1; }
}
module.exports = { buildRuntimeContext, containedFile, parseArgs };
