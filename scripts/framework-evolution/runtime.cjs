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
  const absolute = fs.realpathSync(path.resolve(base, relative));
  const rel = path.relative(base, absolute);
  if (rel.startsWith('..') || path.isAbsolute(rel) || !fs.statSync(absolute).isFile()) throw new Error('Canonical path escapes project');
  return absolute;
}

function buildRuntimeContext({ root = repoRoot, agentId, task, competencies = [], maxChars = 12000, knowledgeMaxChars = 6000, model = 'gpt-6.1-sol' } = {}) {
  if (!Number.isSafeInteger(maxChars) || maxChars < 2000 || maxChars > 64000) throw new Error('Invalid context budget (2000..64000)');
  if (!Number.isSafeInteger(knowledgeMaxChars) || knowledgeMaxChars < 1 || knowledgeMaxChars > maxChars) throw new Error('Invalid knowledge budget');
  if (model !== 'gpt-6.1-sol') throw new Error('Unsupported requested model');
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
  const payload = { schemaVersion: 1, capsule, knowledge, sources: [agent.sourceOfTruth, agent.pointer, command.target], gaps: [...(knowledge.gaps || []), ...(capsule.fallback ? ['Task is exposed by squad pool fallback, not explicitly bound to this specialist.'] : [])], charsUsed: 0, maxChars, limits: ['Offline assembly only; no model execution or global settings change.', 'Structural assembly is not proof of behavioral improvement.'] };
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
