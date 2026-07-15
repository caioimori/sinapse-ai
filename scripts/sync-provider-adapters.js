#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');

const {
  collectNativeAgentDefinitions,
  readCodexCatalog,
  syncCodexNativeAgents,
} = require('../.codex/scripts/sync-codex-native');
const { resolveCodexAgent } = require('../.codex/scripts/resolve-codex-agent');
const { GLOBAL_SUPPLEMENTAL_PROVIDER_SKILL_IDS } = require('../bin/lib/provider-contract');

const PROJECT_ROOT = path.resolve(__dirname, '..');
const CLAUDE_AGENTS_DIR = '.claude/agents';
const CLAUDE_SKILLS_DIR = '.claude/skills';
const SUPPLEMENTAL_PROVIDER_SKILL_IDS = GLOBAL_SUPPLEMENTAL_PROVIDER_SKILL_IDS;

function writeFileAtomically(filePath, content) {
  const temporaryPath = `${filePath}.${process.pid}.${Date.now()}.tmp`;
  let handle;
  try {
    handle = fs.openSync(temporaryPath, 'wx', 0o600);
    fs.writeFileSync(handle, content, 'utf8');
    fs.fsyncSync(handle);
    fs.closeSync(handle);
    handle = undefined;
    fs.renameSync(temporaryPath, filePath);
  } finally {
    if (handle !== undefined) fs.closeSync(handle);
    try { fs.unlinkSync(temporaryPath); } catch { /* already published or cleanup is best-effort */ }
  }
}

function writeFileIfChanged(filePath, content) {
  let existing = null;
  try {
    existing = fs.readFileSync(filePath, 'utf8');
  } catch (error) {
    if (error.code !== 'ENOENT') throw error;
  }
  if (existing !== null && existing.replace(/\r\n/g, '\n') === content.replace(/\r\n/g, '\n')) {
    return 'unchanged';
  }
  const status = existing === null ? 'created' : 'updated';
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  writeFileAtomically(filePath, content);
  return status;
}

function claudeAgentFileName(definition) {
  return `sinapse-${definition.id}.md`;
}

function renderClaudeAgent(definition) {
  const orchestratorRule = /-orqx$/.test(definition.id) || definition.id === 'snps-orqx'
    ? 'You coordinate and delegate domain execution; do not perform specialist work directly.'
    : 'Work only within the authority declared by the canonical agent.';
  return [
    '---',
    `name: ${definition.name}`,
    `description: ${JSON.stringify(definition.description)}`,
    '---',
    '',
    `# SINAPSE Claude Adapter: ${definition.name}`,
    '',
    `Read and follow \`${definition.sourcePath}\` as the canonical source of truth.`,
    'Adopt its persona, authority boundaries, activation protocol, declared dependencies,',
    'task inputs, outputs, gates and verification requirements.',
    orchestratorRule,
    'Resolve requested commands only from dependencies declared by the canonical source.',
    'Use Claude Code native subagents or teams for delegation; never start a nested CLI.',
    'Follow project CLAUDE.md and the SINAPSE Constitution before acting.',
    '',
  ].join('\n');
}

function parseSkillMetadata(content) {
  const match = String(content).match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!match) throw new Error('Skill is missing YAML frontmatter');
  const metadata = yaml.load(match[1]);
  if (!metadata?.name || !metadata?.description) throw new Error('Skill frontmatter is incomplete');
  return metadata;
}

function renderClaudeWorkflowSkill(skillId, description) {
  if (skillId === 'sinapse-loop') {
    return [
      '---', `name: ${skillId}`, `description: ${description}`, '---', '',
      '# SINAPSE Bounded Loop for Claude Code', '',
      'Activate only when the user explicitly requests this loop. Obtain a verifiable',
      'completion criterion, then repeat inspect -> delegate correction -> verify for at',
      'most three iterations. Stop on completion, block, user stop, or iteration three.',
      'Use Claude Code native subagents; never launch a nested Claude or Codex process.', '',
    ].join('\n');
  }
  return [
    '---', `name: ${skillId}`, `description: ${description}`, '---', '',
    '# SINAPSE Spec-Driven Workflow for Claude Code', '',
    'Read `.sinapse-ai/development/workflows/spec-pipeline.yaml` and its referenced task',
    'contracts. Follow PRD -> Epic -> Story -> Validation -> Implementation, delegating',
    'each phase through Claude Code native subagents. A task contract controls inputs,',
    'outputs, gates and verification. Never implement before a validated Ready story.', '',
  ].join('\n');
}

function renderClaudeGenericSkill(skillId, description) {
  return [
    '---', `name: ${skillId}`, `description: ${description.replace(/Codex/g, 'Claude Code')}`, '---', '',
    '# SINAPSE Parametric Agent Activator for Claude Code', '',
    'Use the agent ID supplied with this skill. Find the matching project subagent by its',
    '`name` frontmatter under `.claude/agents/sinapse-*.md`. Reject unknown IDs instead',
    'of guessing. Invoke that native subagent with `@<name>` when delegation is',
    'appropriate, and preserve its canonical authority and task contracts.', '',
  ].join('\n');
}

function renderClaudeAgentSkill(skillId, description, projectRoot) {
  const resolved = resolveCodexAgent(skillId, projectRoot);
  const publicName = resolved.agentId === 'snps-orqx' ? 'sinapse-orqx' : resolved.agentId;
  return [
    '---', `name: ${skillId}`, `description: ${description.replace(/Codex/g, 'Claude Code')}`, '---', '',
    `# SINAPSE Claude Activation: ${publicName}`, '',
    `Read \`${resolved.sourceOfTruth}\` as the canonical source of truth.`,
    `Use the native Claude subagent \`@agent-${publicName}\` for isolated delegation,`,
    'or adopt the same persona in the current context when the workflow must remain here.',
    'Follow declared dependencies and authority boundaries. Never invoke a nested CLI.', '',
  ].join('\n');
}

function collectClaudeSkills(projectRoot = PROJECT_ROOT) {
  const catalog = readCodexCatalog(projectRoot);
  const skillIds = [...new Set([
    ...catalog.expectedSkillIds,
    ...catalog.publicAliasSkillIds,
    catalog.genericAgentSkillId,
  ])].sort();

  return [...new Set([...skillIds, ...SUPPLEMENTAL_PROVIDER_SKILL_IDS])].sort().map((skillId) => {
    const nativePath = path.join(projectRoot, '.agents', 'skills', skillId, 'SKILL.md');
    const metadata = parseSkillMetadata(fs.readFileSync(nativePath, 'utf8'));
    let content;
    if (SUPPLEMENTAL_PROVIDER_SKILL_IDS.includes(skillId)) {
      content = fs.readFileSync(nativePath, 'utf8');
    } else if (skillId === catalog.genericAgentSkillId) {
      content = renderClaudeGenericSkill(skillId, metadata.description);
    } else if (skillId === 'sinapse-loop' || skillId === 'sinapse-spec-driven') {
      content = renderClaudeWorkflowSkill(skillId, metadata.description);
    } else {
      content = renderClaudeAgentSkill(skillId, metadata.description, projectRoot);
    }
    return { skillId, content };
  });
}

function syncClaudeNative(projectRoot = PROJECT_ROOT) {
  const definitions = collectNativeAgentDefinitions(projectRoot);
  const skills = collectClaudeSkills(projectRoot);
  const summary = {
    agents: { total: definitions.length, created: 0, updated: 0, unchanged: 0 },
    skills: { total: skills.length, created: 0, updated: 0, unchanged: 0 },
  };

  for (const definition of definitions) {
    const target = path.join(projectRoot, CLAUDE_AGENTS_DIR, claudeAgentFileName(definition));
    summary.agents[writeFileIfChanged(target, renderClaudeAgent(definition))] += 1;
  }
  for (const skill of skills) {
    const target = path.join(projectRoot, CLAUDE_SKILLS_DIR, skill.skillId, 'SKILL.md');
    summary.skills[writeFileIfChanged(target, skill.content)] += 1;
  }
  writeFileIfChanged(
    path.join(projectRoot, '.claude', 'skill-manifest.json'),
    `${JSON.stringify({ version: 1, skillIds: skills.map((skill) => skill.skillId).sort() }, null, 2)}\n`,
  );
  return summary;
}

function syncProviderAdapters(projectRoot = PROJECT_ROOT, options = {}) {
  const codex = syncCodexNativeAgents(projectRoot, options);
  const claude = syncClaudeNative(projectRoot);
  return { codex, claude };
}

function main() {
  try {
    const expandedSkills = process.argv.slice(2).includes('--expanded-skills');
    console.log(JSON.stringify(syncProviderAdapters(PROJECT_ROOT, { expandedSkills }), null, 2));
  } catch (error) {
    console.error(`[sync-provider-adapters] ${error.message}`);
    process.exitCode = 1;
  }
}

if (require.main === module) main();

module.exports = {
  CLAUDE_AGENTS_DIR,
  CLAUDE_SKILLS_DIR,
  SUPPLEMENTAL_PROVIDER_SKILL_IDS,
  claudeAgentFileName,
  renderClaudeAgent,
  collectClaudeSkills,
  syncClaudeNative,
  syncProviderAdapters,
};
