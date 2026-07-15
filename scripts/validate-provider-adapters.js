#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const yaml = require('js-yaml');
const legacyClaudeCommandHashes = require('../packages/installer/src/migrations/legacy-claude-agent-command-hashes.json');

const { validateNativeCodex } = require('../.codex/scripts/validate-codex-native');
const {
  REACT_BITS_CORPUS_RELATIVE_PATH,
  REQUIRED_REACT_BITS_CORPUS_FILES,
  hasCompleteReactBitsCorpus,
} = require('../packages/installer/src/installer/react-bits-corpus');

const PROJECT_ROOT = path.resolve(__dirname, '..');

function parseFrontmatter(content) {
  const match = String(content).match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!match) throw new Error('missing YAML frontmatter');
  const metadata = yaml.load(match[1]);
  if (!metadata || typeof metadata !== 'object') throw new Error('invalid YAML frontmatter');
  return metadata;
}

const REQUIRED_CLAUDE_HOOKS = [
  { event: 'PreToolUse', matcher: 'Write|Edit', filename: 'doc-first-gate.cjs' },
  { event: 'PreToolUse', matcher: 'Write|Edit|Bash', filename: 'enforce-delegation.cjs' },
  { event: 'PreToolUse', matcher: 'Write|Edit', filename: 'enforce-framework-boundary.cjs' },
  { event: 'PreToolUse', matcher: 'Bash', filename: 'enforce-git-push-authority.sh' },
  { event: 'PreToolUse', matcher: 'Bash', filename: 'verify-packages.cjs' },
];

function validateClaudeHookSettings(projectRoot) {
  const errors = [];
  const settingsCandidates = [
    path.join(projectRoot, '.claude', 'settings.json'),
    path.join(projectRoot, '.claude', 'settings.local.json'),
  ];
  const settingsPaths = settingsCandidates.filter((candidate) => fs.existsSync(candidate));
  if (settingsPaths.length === 0) {
    return ['Claude hook settings are missing: expected .claude/settings.json or .claude/settings.local.json'];
  }
  const commands = [];
  for (const settingsPath of settingsPaths) {
    try {
      const settings = JSON.parse(fs.readFileSync(settingsPath, 'utf8'));
      for (const [event, groups] of Object.entries(settings.hooks || {})) {
        for (const group of groups || []) {
          commands.push(...(group.hooks || []).map((hook) => ({
            command: String(hook.command || ''),
            event,
            matcher: group.matcher ?? null,
            source: path.relative(projectRoot, settingsPath),
          })));
        }
      }
    } catch (error) {
      errors.push(`Claude hook settings (${path.relative(projectRoot, settingsPath)}): ${error.message}`);
    }
  }
  const registered = new Set();
  for (const entry of commands) {
    const match = entry.command.replace(/\\/g, '/').match(/\.claude\/hooks\/([^"'\s]+)/);
    if (!match) continue;
    const registrationKey = JSON.stringify([entry.event, entry.matcher, match[1]]);
    if (registered.has(registrationKey)) {
      errors.push(`Claude hook is registered more than once for the same event and matcher: ${match[1]} (${entry.source})`);
      continue;
    }
    registered.add(registrationKey);
    if (!fs.existsSync(path.join(projectRoot, '.claude', 'hooks', match[1]))) {
      errors.push(`Claude settings points to missing hook: .claude/hooks/${match[1]}`);
    }
  }
  for (const hook of REQUIRED_CLAUDE_HOOKS) {
    const requiredKey = JSON.stringify([hook.event, hook.matcher, hook.filename]);
    if (!registered.has(requiredKey)) {
      errors.push(`Claude governance hook is not registered at ${hook.event}/${hook.matcher}: ${hook.filename}`);
    }
  }
  return errors;
}

function validateClaudeAliasTargets(projectRoot) {
  const errors = [];
  const aliases = {
    sinapse: ['# SINAPSE Claude Activation: sinapse-orqx', 'development/agents/snps-orqx.md'],
    'sinapse-orqx': ['# SINAPSE Claude Activation: sinapse-orqx', 'development/agents/snps-orqx.md'],
    snps: ['# SINAPSE Claude Activation: sinapse-orqx', 'development/agents/snps-orqx.md'],
    'snps-orqx': ['# SINAPSE Claude Activation: sinapse-orqx', 'development/agents/snps-orqx.md'],
    'sinapse-agent': ['# SINAPSE Parametric Agent Activator for Claude Code', '.claude/agents/sinapse-'],
  };
  for (const [alias, [heading, canonicalTarget]] of Object.entries(aliases)) {
    const relativePath = path.join('.claude', 'skills', alias, 'SKILL.md');
    try {
      const content = fs.readFileSync(path.join(projectRoot, relativePath), 'utf8');
      if (!content.includes(heading) || !content.includes(canonicalTarget)) {
        errors.push(`${relativePath} does not resolve to its canonical target`);
      }
    } catch (error) {
      errors.push(`${relativePath}: ${error.message}`);
    }
  }
  return errors;
}

function validateClaudeNative(projectRoot = PROJECT_ROOT) {
  const errors = [];
  const legacyCommandsDir = path.join(projectRoot, '.claude', 'commands', 'SINAPSE', 'agents');
  if (fs.existsSync(legacyCommandsDir)) {
    const legacyCommands = fs.readdirSync(legacyCommandsDir).filter((file) => file.endsWith('.md'));
    const managedLegacyCommands = legacyCommands.filter((file) => {
      const content = fs.readFileSync(path.join(legacyCommandsDir, file));
      const digest = crypto.createHash('sha256').update(content).digest('hex');
      return (legacyClaudeCommandHashes.files[file] || []).includes(digest)
        || content.includes(Buffer.from('SINAPSE-MANAGED:claude-command'));
    });
    if (managedLegacyCommands.length > 0) {
      errors.push(`Legacy Claude agent command surface contains ${managedLegacyCommands.length} managed duplicates`);
    }
  }
  const agentsDir = path.join(projectRoot, '.claude', 'agents');
  const agentFiles = fs.existsSync(agentsDir)
    ? fs.readdirSync(agentsDir).filter((file) => /^sinapse-.+\.md$/.test(file)).sort()
    : [];
  const manifestPath = path.join(projectRoot, '.claude', 'skill-manifest.json');
  let expectedSkills = [];
  try {
    const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
    expectedSkills = (manifest.skillIds || []).map((skillId) => ({ skillId }));
    if (expectedSkills.length !== 37) errors.push(`Claude skill manifest must contain 37 IDs, found ${expectedSkills.length}`);
    for (const alias of ['sinapse', 'sinapse-orqx', 'snps', 'snps-orqx', 'sinapse-agent']) {
      if (!manifest.skillIds.includes(alias)) errors.push(`Claude skill manifest is missing public alias ${alias}`);
    }
    if (!manifest.skillIds.includes('react-bits-frontend')) {
      errors.push('Claude skill manifest is missing react-bits-frontend');
    }
  } catch (error) {
    errors.push(`Claude skill manifest: ${error.message}`);
  }

  if (agentFiles.length !== 172) errors.push(`Claude native inventory must contain 172 agents, found ${agentFiles.length}`);
  const claudeNames = new Set();
  let claudeAgents = 0;
  for (const file of agentFiles) {
    const relativePath = path.join('.claude', 'agents', file);
    const filePath = path.join(projectRoot, relativePath);
    claudeAgents += 1;
    try {
      const content = fs.readFileSync(filePath, 'utf8');
      const metadata = parseFrontmatter(content);
      if (!String(metadata.name || '').trim()) errors.push(`${relativePath} has no name`);
      if (!String(metadata.description || '').trim()) errors.push(`${relativePath} has no description`);
      if (claudeNames.has(metadata.name)) errors.push(`Duplicate Claude native agent name: ${metadata.name}`);
      claudeNames.add(metadata.name);
      const sourceMatch = content.match(/`((?:\.sinapse-ai\/development\/agents|squads\/[^/]+\/agents)\/[^`]+\.md)`/);
      if (!sourceMatch) errors.push(`${relativePath} does not declare a canonical source`);
      else if (!fs.existsSync(path.join(projectRoot, sourceMatch[1]))) errors.push(`${relativePath} points to missing ${sourceMatch[1]}`);
      if (/[A-Za-z]:[\\/]/.test(content)) errors.push(`${relativePath} contains a personal absolute path`);
    } catch (error) {
      errors.push(`${relativePath}: ${error.message}`);
    }
  }

  let claudeSkills = 0;
  for (const expected of expectedSkills) {
    const relativePath = path.join('.claude', 'skills', expected.skillId, 'SKILL.md');
    const filePath = path.join(projectRoot, relativePath);
    if (!fs.existsSync(filePath)) {
      errors.push(`Missing Claude native skill: ${relativePath}`);
      continue;
    }
    claudeSkills += 1;
    try {
      const metadata = parseFrontmatter(fs.readFileSync(filePath, 'utf8'));
      if (metadata.name !== expected.skillId) errors.push(`${relativePath} has incorrect name ${metadata.name}`);
    } catch (error) {
      errors.push(`${relativePath}: ${error.message}`);
    }
  }

  for (const name of ['claude-mastery-chief', 'swarm-orqx', 'sinapse-orqx', 'meta-ads-specialist']) {
    if (!claudeNames.has(name)) errors.push(`Claude native inventory is missing ${name}`);
  }

  const hooksDir = path.join(projectRoot, '.claude', 'hooks');
  for (const hook of REQUIRED_CLAUDE_HOOKS) {
    if (!fs.existsSync(path.join(hooksDir, hook.filename))) {
      errors.push(`Missing Claude governance hook: .claude/hooks/${hook.filename}`);
    }
  }
  errors.push(...validateClaudeHookSettings(projectRoot));
  errors.push(...validateClaudeAliasTargets(projectRoot));

  return {
    ok: errors.length === 0,
    errors,
    metrics: {
      canonicalAgents: agentFiles.length,
      claudeAgents,
      claudeSkills,
    },
  };
}

function validateProviderAdapters(projectRoot = PROJECT_ROOT) {
  const claude = validateClaudeNative(projectRoot);
  const codex = validateNativeCodex(projectRoot);
  const errors = [
    ...claude.errors.map((error) => `Claude: ${error}`),
    ...codex.errors.map((error) => `Codex: ${error}`),
  ];
  const pkg = JSON.parse(fs.readFileSync(path.join(projectRoot, 'package.json'), 'utf8'));
  for (const entry of ['.claude/agents/', '.claude/skills/', '.agents/skills/', '.codex/agents/']) {
    if (!pkg.files.includes(entry)) errors.push(`package.json files[] is missing ${entry}`);
  }
  if (pkg.files.includes('.codex/skills/')) errors.push('package.json must not publish the legacy .codex/skills root');
  if (!hasCompleteReactBitsCorpus(projectRoot)) {
    errors.push(`React Bits corpus is incomplete: expected ${REQUIRED_REACT_BITS_CORPUS_FILES.length} files under ${REACT_BITS_CORPUS_RELATIVE_PATH}`);
  }
  for (const relativePath of [
    path.join('.agents', 'skills', 'react-bits-frontend', 'SKILL.md'),
    path.join('.claude', 'skills', 'react-bits-frontend', 'SKILL.md'),
  ]) {
    if (!fs.existsSync(path.join(projectRoot, relativePath))) {
      errors.push(`React Bits provider skill is missing: ${relativePath}`);
    }
  }
  return {
    ok: errors.length === 0,
    errors,
    metrics: {
      ...claude.metrics,
      codexAgents: codex.metrics.nativeAgents,
      codexSkills: codex.metrics.nativeSkills,
    },
  };
}

function main() {
  const json = process.argv.slice(2).includes('--json');
  const result = validateProviderAdapters();
  if (json) console.log(JSON.stringify(result, null, 2));
  else if (result.ok) {
    console.log(`OK provider adapters (${result.metrics.canonicalAgents} agents; Claude ${result.metrics.claudeSkills} skills; Codex ${result.metrics.codexSkills} skills)`);
  } else {
    console.error(['Provider adapter validation failed', ...result.errors.map((error) => `- ${error}`)].join('\n'));
  }
  if (!result.ok) process.exitCode = 1;
}

if (require.main === module) main();

module.exports = {
  parseFrontmatter,
  validateClaudeAliasTargets,
  validateClaudeHookSettings,
  validateClaudeNative,
  validateProviderAdapters,
  REQUIRED_REACT_BITS_CORPUS_FILES,
};
