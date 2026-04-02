#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');

const DEFAULT_CONFIG = {
  version: 1,
  catalogMode: 'canonical',
  canonicalAgentsDir: '.sinapse-ai/development/agents',
  codexAgentsDir: '.codex/agents',
  skillsDir: '.codex/skills',
  expectedSkillIds: null,
  generatedSkillMap: {},
  canonicalSkillMap: {},
  pathConventions: {
    allowedSourcePrefixes: ['.sinapse-ai/development/agents/'],
    allowedGreetingScriptPrefixes: ['.sinapse-ai/development/scripts/generate-greeting.js'],
    greetingOptionalSourcePrefixes: [],
    requiredFallbackBySourcePrefix: {},
  },
};

function isPlainObject(value) {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
}

function mergeConfig(base, override) {
  const result = { ...base };
  for (const [key, value] of Object.entries(override || {})) {
    if (Array.isArray(value)) {
      result[key] = [...value];
      continue;
    }
    if (isPlainObject(value) && isPlainObject(base[key])) {
      result[key] = mergeConfig(base[key], value);
      continue;
    }
    result[key] = value;
  }
  return result;
}

function getCatalogConfigPath(projectRoot = process.cwd()) {
  return path.join(projectRoot, '.codex', 'catalog.json');
}

function loadCodexCatalogConfig(projectRoot = process.cwd()) {
  const configPath = getCatalogConfigPath(projectRoot);
  if (!fs.existsSync(configPath)) {
    return mergeConfig(DEFAULT_CONFIG, {});
  }

  const raw = fs.readFileSync(configPath, 'utf8');
  const parsed = JSON.parse(raw);
  return mergeConfig(DEFAULT_CONFIG, parsed);
}

function getConfiguredSkillIds(config) {
  if (!Array.isArray(config.expectedSkillIds) || config.expectedSkillIds.length === 0) {
    return null;
  }
  return [...config.expectedSkillIds].sort();
}

function getGeneratedSkillSpec(agentId, config) {
  return config.generatedSkillMap?.[agentId] || null;
}

function hasAllowedPrefix(content, prefixes = []) {
  return prefixes.some((prefix) => content.includes(prefix));
}

function detectMatchedSourcePrefix(content, prefixes = []) {
  let matchedPrefix = null;
  let matchedIndex = Number.POSITIVE_INFINITY;

  for (const prefix of prefixes) {
    const index = content.indexOf(prefix);
    if (index === -1) continue;
    if (index < matchedIndex) {
      matchedIndex = index;
      matchedPrefix = prefix;
    }
  }

  return matchedPrefix;
}

function validateSkillActivationPaths(content, filePath, config) {
  const rules = config.pathConventions || DEFAULT_CONFIG.pathConventions;
  const errors = [];

  const matchedSourcePrefix = detectMatchedSourcePrefix(content, rules.allowedSourcePrefixes);
  if (!matchedSourcePrefix) {
    errors.push(`${filePath} missing approved source path`);
    return errors;
  }

  const requiredFallback = rules.requiredFallbackBySourcePrefix?.[matchedSourcePrefix];
  if (requiredFallback && !content.includes(requiredFallback)) {
    errors.push(`${filePath} missing fallback activation path "${requiredFallback}"`);
  }

  const greetingOptional = (rules.greetingOptionalSourcePrefixes || [])
    .some((prefix) => matchedSourcePrefix.startsWith(prefix));

  if (!greetingOptional && !hasAllowedPrefix(content, rules.allowedGreetingScriptPrefixes)) {
    errors.push(`${filePath} missing approved greeting script path`);
  }

  return errors;
}

module.exports = {
  DEFAULT_CONFIG,
  mergeConfig,
  getCatalogConfigPath,
  loadCodexCatalogConfig,
  getConfiguredSkillIds,
  getGeneratedSkillSpec,
  validateSkillActivationPaths,
};
