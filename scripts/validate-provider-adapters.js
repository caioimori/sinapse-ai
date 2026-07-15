#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');

const { validateNativeCodex } = require('../.codex/scripts/validate-codex-native');

const PROJECT_ROOT = path.resolve(__dirname, '..');

function parseFrontmatter(content) {
  const match = String(content).match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!match) throw new Error('missing YAML frontmatter');
  const metadata = yaml.load(match[1]);
  if (!metadata || typeof metadata !== 'object') throw new Error('invalid YAML frontmatter');
  return metadata;
}

function validateClaudeNative(projectRoot = PROJECT_ROOT) {
  const errors = [];
  const agentsDir = path.join(projectRoot, '.claude', 'agents');
  const agentFiles = fs.existsSync(agentsDir)
    ? fs.readdirSync(agentsDir).filter((file) => /^sinapse-.+\.md$/.test(file)).sort()
    : [];
  const manifestPath = path.join(projectRoot, '.claude', 'skill-manifest.json');
  let expectedSkills = [];
  try {
    const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
    expectedSkills = (manifest.skillIds || []).map((skillId) => ({ skillId }));
    if (expectedSkills.length !== 36) errors.push(`Claude skill manifest must contain 36 IDs, found ${expectedSkills.length}`);
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

module.exports = { parseFrontmatter, validateClaudeNative, validateProviderAdapters };
