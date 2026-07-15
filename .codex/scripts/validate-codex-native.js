#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');

const { resolveCodexCommand } = require('./resolve-codex-command');
const {
  getManagedActivationSkillIds,
  readCodexCatalog,
} = require('./sync-codex-native');

const PROJECT_ROOT = path.resolve(__dirname, '..', '..');
const REQUIRED_AGENT_FIELDS = ['name', 'description', 'developer_instructions'];
const CRITICAL_COMMANDS = [
  ['project-lead', 'create-prd'],
  ['project-lead', 'create-epic'],
  ['sprint-lead', 'draft'],
  ['product-lead', 'validate-story-draft'],
  ['architect', 'assess-complexity'],
  ['analyst', 'research-deps'],
  ['project-lead', 'create-spec'],
  ['quality-gate', 'critique-spec'],
  ['architect', 'create-plan'],
  ['developer', 'develop'],
  ['quality-gate', 'gate'],
];

function setNested(target, section, key, value) {
  let cursor = target;
  for (const segment of section) {
    if (!Object.prototype.hasOwnProperty.call(cursor, segment)) cursor[segment] = {};
    if (!cursor[segment] || typeof cursor[segment] !== 'object' || Array.isArray(cursor[segment])) {
      throw new Error(`TOML section conflicts with a value: ${section.join('.')}`);
    }
    cursor = cursor[segment];
  }
  if (Object.prototype.hasOwnProperty.call(cursor, key)) {
    throw new Error(`Duplicate TOML key: ${[...section, key].join('.')}`);
  }
  cursor[key] = value;
}

function parseTomlValue(rawValue, lineNumber) {
  const value = rawValue.trim();
  if (!value) throw new Error(`Missing TOML value at line ${lineNumber}`);

  if (value.startsWith('"')) {
    try {
      return JSON.parse(value);
    } catch (error) {
      throw new Error(`Invalid TOML string at line ${lineNumber}: ${error.message}`);
    }
  }
  if (value.startsWith("'") && value.endsWith("'")) return value.slice(1, -1);
  if (value === 'true') return true;
  if (value === 'false') return false;
  if (/^[+-]?\d+$/.test(value)) return Number(value);
  if (value.startsWith('[')) {
    try {
      return JSON.parse(value.replace(/'/g, '"'));
    } catch (error) {
      throw new Error(`Invalid TOML array at line ${lineNumber}: ${error.message}`);
    }
  }
  throw new Error(`Unsupported or malformed TOML value at line ${lineNumber}`);
}

/**
 * Strict parser for the deliberately small TOML subset distributed by this
 * project: tables plus strings, integers, booleans and scalar arrays. Rejecting
 * unsupported syntax is intentional so a partially understood agent config
 * can never be reported as valid.
 */
function parseTomlDocument(content) {
  const document = {};
  let section = [];
  const lines = String(content).replace(/^\uFEFF/, '').split(/\r?\n/);

  for (let index = 0; index < lines.length; index += 1) {
    const rawLine = lines[index];
    const line = rawLine.trim();
    if (!line || line.startsWith('#')) continue;

    const tableMatch = line.match(/^\[([A-Za-z0-9_.-]+)]$/);
    if (tableMatch) {
      section = tableMatch[1].split('.');
      continue;
    }

    const assignment = rawLine.match(/^\s*([A-Za-z0-9_-]+)\s*=\s*(.+?)\s*$/);
    if (!assignment) throw new Error(`Malformed TOML at line ${index + 1}`);
    setNested(document, section, assignment[1], parseTomlValue(assignment[2], index + 1));
  }

  return document;
}

function stableJson(value) {
  if (Array.isArray(value)) return `[${value.map(stableJson).join(',')}]`;
  if (value && typeof value === 'object') {
    return `{${Object.keys(value).sort().map((key) => `${JSON.stringify(key)}:${stableJson(value[key])}`).join(',')}}`;
  }
  return JSON.stringify(value);
}

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function parseSkillFrontmatter(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!match) throw new Error('missing YAML frontmatter');
  const metadata = yaml.load(match[1]);
  if (!metadata || typeof metadata !== 'object') throw new Error('frontmatter is not a mapping');
  if (!String(metadata.name || '').trim()) throw new Error('missing name');
  if (!String(metadata.description || '').trim()) throw new Error('missing description');
  return metadata;
}

function collectSkillFiles(skillsRoot) {
  if (!fs.existsSync(skillsRoot)) return [];
  return fs.readdirSync(skillsRoot, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => path.join(skillsRoot, entry.name, 'SKILL.md'))
    .filter((filePath) => fs.existsSync(filePath));
}

function validateNativeCodex(projectRoot = PROJECT_ROOT) {
  const errors = [];
  const metrics = {
    markdownAgents: 0,
    nativeAgents: 0,
    compatibilitySkills: 0,
    nativeSkills: 0,
    commands: 0,
  };
  const check = (condition, message) => {
    if (!condition) errors.push(message);
  };
  const capture = (label, operation) => {
    try {
      return operation();
    } catch (error) {
      errors.push(`${label}: ${error.message}`);
      return null;
    }
  };

  const configPath = path.join(projectRoot, '.codex', 'config.toml');
  const config = capture('Codex project config', () => parseTomlDocument(fs.readFileSync(configPath, 'utf8')));
  if (config) {
    check(config.features?.multi_agent === true, 'Codex project config must enable features.multi_agent');
    check(config.features?.hooks === true, 'Codex project config must enable features.hooks');
    check(Number.isInteger(config.agents?.max_threads) && config.agents.max_threads >= 2 && config.agents.max_threads <= 6,
      'agents.max_threads must be an integer between 2 and 6');
    check(config.agents?.max_depth === 1, 'agents.max_depth must remain 1');
    check(!Object.prototype.hasOwnProperty.call(config, 'model'), 'Project config must inherit the host model');
    check(!Object.prototype.hasOwnProperty.call(config, 'model_reasoning_effort'), 'Project config must inherit host reasoning effort');
  }

  const agentsDir = path.join(projectRoot, '.codex', 'agents');
  const markdownAgents = fs.existsSync(agentsDir)
    ? fs.readdirSync(agentsDir).filter((file) => file.endsWith('.md')).sort()
    : [];
  const nativeAgents = fs.existsSync(agentsDir)
    ? fs.readdirSync(agentsDir).filter((file) => file.endsWith('.toml')).sort()
    : [];
  metrics.markdownAgents = markdownAgents.length;
  metrics.nativeAgents = nativeAgents.length;
  check(markdownAgents.length === 172,
    `Expected exactly 172 Markdown Codex adapters, found ${markdownAgents.length}`);
  check(nativeAgents.length === 172,
    `Expected exactly 172 native TOML agents, found ${nativeAgents.length}`);
  check(nativeAgents.length === markdownAgents.length,
    `Native agent count ${nativeAgents.length} does not match Markdown count ${markdownAgents.length}`);
  check(stableJson(nativeAgents.map((file) => file.replace(/\.toml$/, ''))) === stableJson(markdownAgents.map((file) => file.replace(/\.md$/, ''))),
    'Native TOML and Markdown agent IDs are not aligned');

  const nativeNames = new Set();
  for (const file of nativeAgents) {
    const parsed = capture(`Native agent ${file}`, () => parseTomlDocument(fs.readFileSync(path.join(agentsDir, file), 'utf8')));
    if (!parsed) continue;
    for (const field of REQUIRED_AGENT_FIELDS) {
      check(typeof parsed[field] === 'string' && parsed[field].trim().length > 0, `${file} is missing required string ${field}`);
    }
    check(!Object.prototype.hasOwnProperty.call(parsed, 'model'), `${file} must inherit the host model`);
    check(!Object.prototype.hasOwnProperty.call(parsed, 'model_reasoning_effort'), `${file} must inherit host reasoning effort`);
    if (typeof parsed.name === 'string') {
      check(!nativeNames.has(parsed.name), `Duplicate native agent name: ${parsed.name}`);
      nativeNames.add(parsed.name);
    }
  }
  check(nativeNames.has('sinapse-orqx'), 'Native supreme orchestrator must be named sinapse-orqx');

  const skillIdsByRoot = {};
  for (const [label, relativeRoot] of [['Compatibility skill', '.codex/skills'], ['Native skill', '.agents/skills']]) {
    const files = collectSkillFiles(path.join(projectRoot, relativeRoot));
    skillIdsByRoot[relativeRoot] = new Set(files.map((file) => path.basename(path.dirname(file))));
    if (label === 'Compatibility skill') metrics.compatibilitySkills = files.length;
    else metrics.nativeSkills = files.length;
    for (const file of files) capture(`${label} ${path.relative(projectRoot, file)}`, () => {
      const metadata = parseSkillFrontmatter(file);
      check(metadata.name === path.basename(path.dirname(file)),
        `${path.relative(projectRoot, file)} frontmatter name must match its directory`);
      return metadata;
    });
  }
  const catalog = capture('Codex activation catalog', () => readCodexCatalog(projectRoot));
  if (catalog) {
    const managedSkillIds = getManagedActivationSkillIds(catalog);
    for (const skillId of managedSkillIds) {
      check(skillIdsByRoot['.agents/skills'].has(skillId),
        `Missing native activation skill .agents/skills/${skillId}/SKILL.md`);
      check(skillIdsByRoot['.codex/skills'].has(skillId),
        `Missing compatibility activation skill .codex/skills/${skillId}/SKILL.md`);
      const nativePath = path.join(projectRoot, '.agents', 'skills', skillId, 'SKILL.md');
      const compatibilityPath = path.join(projectRoot, '.codex', 'skills', skillId, 'SKILL.md');
      if (fs.existsSync(nativePath) && fs.existsSync(compatibilityPath)) {
        check(fs.readFileSync(nativePath, 'utf8') === fs.readFileSync(compatibilityPath, 'utf8'),
          `Native and compatibility activation skill differ: ${skillId}`);
      }
    }
  }

  const hooksPath = path.join(projectRoot, '.codex', 'hooks.json');
  const hooksConfig = capture('Codex hooks config', () => readJson(hooksPath));
  if (hooksConfig) {
    const serialized = JSON.stringify(hooksConfig);
    check(!/[A-Za-z]:[\\/]/.test(serialized) && !/\\\\[^\\]/.test(serialized), 'Codex hooks must not contain personal absolute paths');
    check(serialized.includes('PreToolUse'), 'Codex hooks must define PreToolUse guards');
    check(serialized.includes('apply_patch'), 'Codex hooks must match apply_patch payloads');
  }

  const matrixPath = path.join(projectRoot, '.codex', 'delegation-matrix.json');
  const parityPath = path.join(projectRoot, '.codex', 'delegation-parity.json');
  const matrix = capture('Delegation matrix', () => readJson(matrixPath));
  const parity = capture('Delegation parity', () => readJson(parityPath));
  if (matrix && parity) check(stableJson(matrix) === stableJson(parity), 'Delegation matrix and parity artifact diverge');

  for (const [agent, command] of CRITICAL_COMMANDS) {
    const resolved = capture(`Command @${agent} *${command}`, () => resolveCodexCommand(agent, command, projectRoot));
    if (!resolved) continue;
    metrics.commands += 1;
    check(fs.existsSync(path.join(projectRoot, resolved.target)), `Command @${agent} *${command} points to missing ${resolved.target}`);
  }

  const helperPath = path.join(projectRoot, '.codex', 'scripts', 'sinapse-codex.js');
  if (fs.existsSync(helperPath)) {
    const helperSource = fs.readFileSync(helperPath, 'utf8');
    check(!/\bclaude(?:\.exe)?\b/i.test(helperSource), 'sinapse-codex must not depend on the Claude runtime');
    check(!/\bcodex(?:\.exe)?\s+exec\b/i.test(helperSource), 'sinapse-codex must not start nested Codex execution');
  } else {
    errors.push('Missing additive .codex/scripts/sinapse-codex.js helper');
  }

  return { ok: errors.length === 0, errors, metrics };
}

function parseArgs(argv = process.argv.slice(2)) {
  const flags = new Set(argv);
  return { json: flags.has('--json'), quiet: flags.has('--quiet') || flags.has('-q') };
}

function main() {
  const args = parseArgs();
  const result = validateNativeCodex();
  if (!args.quiet) {
    if (args.json) console.log(JSON.stringify(result, null, 2));
    else if (result.ok) console.log(`OK Codex native validation (${result.metrics.nativeAgents} agents, ${result.metrics.nativeSkills} native skills, ${result.metrics.commands} critical commands)`);
    else console.error(['X Codex native validation failed', ...result.errors.map((error) => `- ${error}`)].join('\n'));
  }
  if (!result.ok) process.exitCode = 1;
}

if (require.main === module) main();

module.exports = {
  CRITICAL_COMMANDS,
  parseTomlDocument,
  parseSkillFrontmatter,
  stableJson,
  validateNativeCodex,
  parseArgs,
};
