'use strict';

const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const resolver = require('../../.codex/scripts/resolve-codex-agent.js');
const commandResolver = require('../../.codex/scripts/resolve-codex-command.js');
const repoRoot = path.resolve(__dirname, '../..');

function declaredTaskSlugs(text) {
  let section = false;
  let yamlIndent = null;
  const selected = [];
  for (const line of text.split(/\r?\n/)) {
    const trimmed = line.trim();
    const indent = line.length - line.trimStart().length;
    if (/^#{1,6}\s+Tasks?\b/i.test(trimmed)) section = true;
    else if (/^#{1,6}\s+/.test(trimmed)) section = false;
    if (/^tasks:\s*$/.test(trimmed)) yamlIndent = indent;
    else if (yamlIndent !== null && trimmed && indent <= yamlIndent) yamlIndent = null;
    if (section || yamlIndent !== null) selected.push(line);
  }
  return resolver.extractTaskSlugs(selected.join('\n'));
}

function files(root, directory) {
  const absolute = path.join(root, directory);
  if (!fs.existsSync(absolute)) return [];
  return fs.readdirSync(absolute, { withFileTypes: true }).sort((a, b) => a.name.localeCompare(b.name)).flatMap((entry) => {
    const relative = `${directory}/${entry.name}`;
    if (entry.isSymbolicLink()) return [];
    return entry.isDirectory() ? files(root, relative) : [relative];
  });
}

function inventory(root = repoRoot) {
  root = path.resolve(root);
  const index = resolver.loadCodexAgentIndex(root);
  const squadIds = fs.readdirSync(path.join(root, 'squads'), { withFileTypes: true }).filter((entry) => entry.isDirectory()).map((entry) => entry.name).sort();
  const assets = {
    sourceAgents: [...files(root, '.sinapse-ai/development/agents'), ...squadIds.flatMap((id) => files(root, `squads/${id}/agents`))].filter((file) => /\/agents\/[^/]+\.md$/.test(file)),
    tasks: [...files(root, '.sinapse-ai/development/tasks'), ...squadIds.flatMap((id) => files(root, `squads/${id}/tasks`))].filter((file) => /\/tasks\/[^/]+\.md$/.test(file)),
    taskSupportFiles: files(root, '.sinapse-ai/development/tasks').filter((file) => !/\/tasks\/[^/]+\.md$/.test(file)),
    knowledge: squadIds.flatMap((id) => files(root, `squads/${id}/knowledge-base`)),
    workflows: [...files(root, '.sinapse-ai/development/workflows'), ...squadIds.flatMap((id) => files(root, `squads/${id}/workflows`))],
    skills: [...files(root, '.agents/skills'), ...files(root, '.claude/skills')].filter((file) => file.endsWith('/SKILL.md')),
  };
  const agents = Object.keys(index).sort().map((id) => {
    const entry = index[id];
    const sourceExists = !!entry.sourcePath && fs.existsSync(path.join(root, entry.sourcePath));
    const text = sourceExists ? fs.readFileSync(path.join(root, entry.sourcePath), 'utf8') : '';
    const resolved = resolver.resolveAgentTasks(entry, root);
    const declaredTasks = declaredTaskSlugs(text);
    const legacyCandidates = resolver.extractTaskSlugs(text);
    const expectedDirs = [entry.squad && `squads/${entry.squad}/tasks`, '.sinapse-ai/development/tasks'].filter(Boolean);
    const missingDeclaredTasks = declaredTasks.filter((slug) => !expectedDirs.some((dir) => fs.existsSync(path.join(root, dir, `${slug}.md`))));
    const knowledgeFiles = assets.knowledge.filter((file) => file.startsWith(`squads/${entry.squad}/`));
    return { id, squad: entry.squad, source: entry.sourcePath, pointer: entry.pointerPath, sourceExists, bytes: Buffer.byteLength(text), sha256: crypto.createHash('sha256').update(text).digest('hex'), declaredTasks, legacyNonTaskCandidates: legacyCandidates.filter((slug) => !declaredTasks.includes(slug)), resolvedTasks: resolved, missingDeclaredTasks, fallbackTasks: resolved.filter((task) => task.scope === 'squad-pool'), knowledgeFiles, knowledgeReferenced: knowledgeFiles.filter((file) => text.includes(file) || text.includes(path.basename(file))) };
  });
  const legacyReachable = new Set(agents.flatMap((agent) => agent.resolvedTasks.map((task) => task.target)));
  const registry = commandResolver.loadCommandRegistry(root);
  const publicCommands = Object.entries(registry.agents).flatMap(([agentId, spec]) => Object.keys(spec.commands).map((command) => {
    try {
      const result = commandResolver.resolveCodexCommand(agentId, command, root);
      return { agentId, command, target: result.target, kind: result.kind, exists: fs.existsSync(path.join(root, result.target)) };
    } catch (error) { return { agentId, command, error: error.message, exists: false }; }
  }));
  const reachable = new Set([...legacyReachable, ...publicCommands.filter((entry) => entry.exists && assets.tasks.includes(entry.target)).map((entry) => entry.target)]);
  const sourcePointers = new Set(agents.map((agent) => agent.source));
  const squads = squadIds.map((id) => ({ id, agents: agents.filter((agent) => agent.squad === id).map((agent) => agent.id), tasks: assets.tasks.filter((file) => file.startsWith(`squads/${id}/`)), knowledge: assets.knowledge.filter((file) => file.startsWith(`squads/${id}/`)), workflows: assets.workflows.filter((file) => file.startsWith(`squads/${id}/`)) }));
  const workflowReferences = assets.workflows.map((file) => {
    const text = fs.readFileSync(path.join(root, file), 'utf8');
    const agentIds = [...new Set([...text.matchAll(/^\s*(?:-\s*)?agent:\s*["']?@?([a-z0-9][a-z0-9-]*)/gim)].map((match) => match[1]))];
    const taskSlugs = declaredTaskSlugs(text);
    return { file, agentIds, unresolvedAgentIds: agentIds.filter((id) => !resolver.resolveAgentId(index, id)), taskSlugs, taskFileMatches: taskSlugs.map((slug) => ({ slug, files: assets.tasks.filter((candidate) => path.basename(candidate) === `${slug}.md`) })), unresolvedTaskSlugs: taskSlugs.filter((slug) => !assets.tasks.some((candidate) => path.basename(candidate) === `${slug}.md`)) };
  });
  return {
    schemaVersion: 1,
    counts: { squads: squads.length, agents: agents.length, sourceAgents: assets.sourceAgents.length, resolvableAgents: agents.filter((agent) => agent.sourceExists).length, tasks: assets.tasks.length, legacyReachableTasks: legacyReachable.size, reachableTasks: reachable.size, publicCommands: publicCommands.length, knowledge: assets.knowledge.length, workflows: assets.workflows.length, skills: assets.skills.length },
    agents, squads, assets, publicCommands, workflowReferences,
    gaps: { missingSources: agents.filter((agent) => !agent.sourceExists).map((agent) => agent.id), unpointedSources: assets.sourceAgents.filter((file) => !sourcePointers.has(file)), tasksWithoutAgentCommand: assets.tasks.filter((file) => !reachable.has(file)), invalidPublicCommands: publicCommands.filter((entry) => !entry.exists), workflowReferencesRequiringReview: workflowReferences.filter((entry) => entry.unresolvedAgentIds.length || entry.unresolvedTaskSlugs.length), missingDeclaredTasks: agents.filter((agent) => agent.missingDeclaredTasks.length).map((agent) => ({ agentId: agent.id, tasks: agent.missingDeclaredTasks })), fallbackAgents: agents.filter((agent) => agent.fallbackTasks.length).map((agent) => agent.id), knowledgeWithoutDirectAgentReference: assets.knowledge.filter((file) => !agents.some((agent) => agent.knowledgeReferenced.includes(file))) },
    limits: ['Static references and disk existence do not prove executable workflow, installed parity, knowledge quality, or behavioral improvement.', 'Reachability is the union of legacy agent resolver and public curated command registry; generic workflow loaders may access unmapped files.', 'Knowledge reference absence means only no direct canonical-agent textual reference, not an orphan or unusable KB; task/workflow consumers may read it.', 'Only Tasks sections/YAML task dependency lists are declared tasks; legacy non-task candidates are separately retained.'],
  };
}

if (require.main === module) {
  try {
    const args = process.argv.slice(2);
    const result = inventory();
    const summary = { schemaVersion: result.schemaVersion, counts: result.counts, gaps: Object.fromEntries(Object.entries(result.gaps).map(([key, value]) => [key, value.length])), missingDeclaredTasks: result.gaps.missingDeclaredTasks, limits: result.limits };
    if (args.includes('--output')) {
      const output = args[args.indexOf('--output') + 1];
      if (!output || output.startsWith('--')) throw new Error('--output requires a file');
      fs.writeFileSync(output, `${JSON.stringify(result, null, 2)}\n`);
    }
    process.stdout.write(`${JSON.stringify(args.includes('--full') ? result : summary, null, 2)}\n`);
  } catch (error) { process.stderr.write(`${error.message}\n`); process.exitCode = 1; }
}
module.exports = { inventory, files, repoRoot, declaredTaskSlugs };
