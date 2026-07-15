#!/usr/bin/env node
'use strict';

/**
 * Generate native Codex custom-agent adapters from the existing Markdown
 * pointers and restore authoritative native workflow skills after the legacy
 * Codex sync. Canonical agent definitions remain in `.sinapse-ai/` and
 * `squads/`; generated files only teach Codex how to activate them.
 */

const fs = require('fs');
const path = require('path');

const { PROJECT_ROOT, loadCodexAgentIndex } = require('./resolve-codex-agent');

const CODEX_AGENTS_DIR = '.codex/agents';
const NATIVE_SKILLS_DIR = '.agents/skills';
const COMPATIBILITY_SKILLS_DIR = '.codex/skills';
const NATIVE_WORKFLOW_SKILLS = Object.freeze([
  'sinapse-orqx',
  'sinapse-spec-driven',
  'sinapse-loop',
]);
const CODEX_CATALOG_PATH = '.codex/catalog.json';
const SUPREME_ORCHESTRATOR_ID = 'snps-orqx';
const SUPREME_ORCHESTRATOR_NAME = 'sinapse-orqx';
const MAX_DESCRIPTION_LENGTH = 240;

function normalizePath(filePath) {
  return filePath.replace(/\\/g, '/');
}

function isPathInside(parentPath, candidatePath) {
  const relative = path.relative(parentPath, candidatePath);
  return relative === '' || (!relative.startsWith('..') && !path.isAbsolute(relative));
}

function readCanonicalSource(projectRoot, sourcePath) {
  if (!sourcePath) {
    throw new Error('Codex agent pointer does not declare a canonical source');
  }

  const root = path.resolve(projectRoot);
  const absoluteSource = path.resolve(root, sourcePath);
  if (!isPathInside(root, absoluteSource)) {
    throw new Error(`Codex agent source escapes the project root: ${sourcePath}`);
  }
  if (!fs.existsSync(absoluteSource) || !fs.statSync(absoluteSource).isFile()) {
    throw new Error(`Canonical agent source does not exist: ${sourcePath}`);
  }

  return fs.readFileSync(absoluteSource, 'utf8');
}

function humanizeAgentId(agentId) {
  return agentId
    .split('-')
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

function unwrapSingleLineYamlScalar(value) {
  const trimmed = value.trim();
  if (!trimmed || trimmed === '|' || trimmed === '>' || /^(?:\{|\[)/.test(trimmed)) {
    return null;
  }

  if (trimmed.startsWith('"') && trimmed.endsWith('"')) {
    try {
      return JSON.parse(trimmed);
    } catch {
      return null;
    }
  }

  if (trimmed.startsWith("'") && trimmed.endsWith("'")) {
    return trimmed.slice(1, -1).replace(/''/g, "'");
  }

  return trimmed;
}

function sanitizeDescription(value) {
  if (typeof value !== 'string') return null;

  let description = value.replace(/\s+/g, ' ').trim();
  const hasControlCharacter = [...description].some((character) => {
    const codePoint = character.codePointAt(0);
    return codePoint <= 31 || codePoint === 127;
  });
  if (description.length < 12 || hasControlCharacter) {
    return null;
  }

  if (description.length > MAX_DESCRIPTION_LENGTH) {
    const maximumPrefixLength = MAX_DESCRIPTION_LENGTH - 3;
    const prefix = description.slice(0, maximumPrefixLength);
    const wordBoundary = prefix.lastIndexOf(' ');
    const safeBoundary = wordBoundary >= Math.floor(MAX_DESCRIPTION_LENGTH * 0.6)
      ? wordBoundary
      : maximumPrefixLength;
    description = `${prefix.slice(0, safeBoundary).trimEnd()}...`;
  }

  return description;
}

function getTopLevelYamlBlock(sourceText, blockName) {
  const lines = sourceText.split(/\r?\n/);
  const startIndex = lines.findIndex((line) => line === `${blockName}:`);
  if (startIndex === -1) return null;

  let endIndex = lines.length;
  for (let index = startIndex + 1; index < lines.length; index += 1) {
    const line = lines[index];
    if (line.trim() && !/^\s/.test(line)) {
      endIndex = index;
      break;
    }
  }

  return lines.slice(startIndex + 1, endIndex);
}

function getDirectFieldIndent(blockLines) {
  const indents = blockLines
    .filter((line) => line.trim() && !line.trimStart().startsWith('#'))
    .map((line) => line.match(/^\s*/)[0].length)
    .filter((indent) => indent > 0);
  return indents.length > 0 ? Math.min(...indents) : null;
}

function extractYamlFieldFromLines(blockLines, directIndent, fieldName) {
  const fieldPattern = new RegExp(`^\\s{${directIndent}}${fieldName}:\\s*(.*?)\\s*$`, 'i');
  for (let index = 0; index < blockLines.length; index += 1) {
    const match = blockLines[index].match(fieldPattern);
    if (!match) continue;

    const scalar = match[1].trim();
    if (scalar === '|' || scalar === '>') {
      const blockValue = [];
      for (let valueIndex = index + 1; valueIndex < blockLines.length; valueIndex += 1) {
        const line = blockLines[valueIndex];
        const indent = line.match(/^\s*/)[0].length;
        if (line.trim() && indent <= directIndent) break;
        if (line.trim()) blockValue.push(line.trim());
      }
      return blockValue.join(' ');
    }

    return unwrapSingleLineYamlScalar(scalar);
  }

  return null;
}

function extractDirectYamlField(sourceText, blockName, fieldName) {
  const blockLines = getTopLevelYamlBlock(sourceText, blockName);
  if (!blockLines) return null;

  const directIndent = getDirectFieldIndent(blockLines);
  if (directIndent === null) return null;

  return extractYamlFieldFromLines(blockLines, directIndent, fieldName);
}

function extractFrontmatterField(sourceText, fieldName) {
  const lines = sourceText.split(/\r?\n/);
  if (lines[0] !== '---') return null;

  const endIndex = lines.findIndex((line, index) => index > 0 && line === '---');
  if (endIndex === -1) return null;

  return extractYamlFieldFromLines(lines.slice(1, endIndex), 0, fieldName);
}

function extractMarkdownRole(sourceText) {
  const lines = sourceText.split(/\r?\n/);
  const startIndex = lines.findIndex((line) =>
    /^##\s+(?:Role|Papel|Purpose|Propósito)\s*$/i.test(line),
  );
  if (startIndex === -1) return null;

  let endIndex = lines.length;
  for (let index = startIndex + 1; index < lines.length; index += 1) {
    if (/^##\s+/.test(lines[index])) {
      endIndex = index;
      break;
    }
  }

  return (
    lines
      .slice(startIndex + 1, endIndex)
      .join('\n')
      .split(/\r?\n\r?\n/)
      .map((paragraph) => paragraph.replace(/\s+/g, ' ').trim())
      .find(Boolean) || null
  );
}

function extractInlineMarkdownRole(sourceText) {
  const bulletMatch = sourceText.match(
    /^\s*-\s+\*\*(?:Role|Papel):\*\*\s*(.+?)\s*$/im,
  );
  if (bulletMatch) return bulletMatch[1];

  const tableMatch = sourceText.match(
    /^\|\s*\*\*(?:Role|Papel)\*\*\s*\|\s*(.+?)\s*\|\s*$/im,
  );
  return tableMatch ? tableMatch[1] : null;
}

function extractSourceDescription(sourceText) {
  const candidates = [
    extractDirectYamlField(sourceText, 'agent', 'whenToUse'),
    extractDirectYamlField(sourceText, 'agent', 'description'),
    extractFrontmatterField(sourceText, 'description'),
    extractDirectYamlField(sourceText, 'persona', 'role'),
    extractMarkdownRole(sourceText),
    extractInlineMarkdownRole(sourceText),
    extractDirectYamlField(sourceText, 'agent', 'title'),
  ];

  for (const candidate of candidates) {
    const description = sanitizeDescription(candidate);
    if (description) return description;
  }

  return null;
}

function nativeAgentName(agentId) {
  return agentId === SUPREME_ORCHESTRATOR_ID ? SUPREME_ORCHESTRATOR_NAME : agentId;
}

function fallbackDescription(agentId, sourcePath) {
  return `${humanizeAgentId(nativeAgentName(agentId))} SINAPSE agent backed by ${sourcePath}.`;
}

function buildDeveloperInstructions(entry) {
  const publicName = nativeAgentName(entry.id);
  const aliasInstruction =
    entry.id === SUPREME_ORCHESTRATOR_ID
      ? ' Treat @sinapse-orqx, @snps-orqx, @sinapse, @snps, and @imperator as aliases for this same agent.'
      : '';
  const delegationInstruction = /-orqx$/.test(entry.id)
    ? ' As an orchestrator, coordinate domain work through native Codex subagents and do not perform specialist work directly.'
    : '';

  return [
    `You are the native Codex adapter for @${publicName}.${aliasInstruction}`,
    'Read the repository AGENTS.md instructions before acting.',
    `Read and follow the complete canonical agent definition at ${entry.sourcePath}.`,
    `Adopt its persona, authority boundaries, activation protocol, and task dependencies.${delegationInstruction}`,
    `Resolve requested task commands with node .codex/scripts/resolve-codex-command.js ${publicName} <command> --json, then execute only the returned canonical task target.`,
    'Use native Codex collaboration for delegation; never start a nested codex or claude process.',
    'Do not modify Claude Code configuration as part of Codex activation.',
  ].join('\n');
}

function serializeTomlString(value) {
  return JSON.stringify(value);
}

function renderNativeAgentToml(definition) {
  return [
    `name = ${serializeTomlString(definition.name)}`,
    `description = ${serializeTomlString(definition.description)}`,
    `developer_instructions = ${serializeTomlString(definition.developerInstructions)}`,
    '',
  ].join('\n');
}

function buildNativeAgentDefinition(entry, projectRoot = PROJECT_ROOT) {
  const sourceText = readCanonicalSource(projectRoot, entry.sourcePath);
  const description =
    extractSourceDescription(sourceText) || fallbackDescription(entry.id, entry.sourcePath);

  return {
    id: entry.id,
    fileName: `${entry.id}.toml`,
    name: nativeAgentName(entry.id),
    description,
    developerInstructions: buildDeveloperInstructions(entry),
    sourcePath: entry.sourcePath,
  };
}

function collectNativeAgentDefinitions(projectRoot = PROJECT_ROOT) {
  const index = loadCodexAgentIndex(projectRoot);
  return Object.keys(index)
    .sort()
    .map((agentId) => buildNativeAgentDefinition(index[agentId], projectRoot));
}

function writeFileIfChanged(filePath, content) {
  let existing = null;
  try {
    existing = fs.readFileSync(filePath, 'utf8');
  } catch (error) {
    if (error.code !== 'ENOENT') throw error;
  }

  // Git may check text files out as CRLF on Windows while generators emit LF.
  // Treat newline-only differences as identical so repeated syncs are stable.
  if (existing !== null && existing.replace(/\r\n/g, '\n') === content.replace(/\r\n/g, '\n')) {
    return 'unchanged';
  }

  const status = existing === null ? 'created' : 'updated';
  fs.writeFileSync(filePath, content, 'utf8');
  return status;
}

function readCodexCatalog(projectRoot = PROJECT_ROOT) {
  const catalogPath = path.resolve(projectRoot, CODEX_CATALOG_PATH);
  if (!isPathInside(path.resolve(projectRoot), catalogPath)) {
    throw new Error(`Codex catalog escapes the project root: ${CODEX_CATALOG_PATH}`);
  }

  const catalog = JSON.parse(fs.readFileSync(catalogPath, 'utf8'));
  if (!Array.isArray(catalog.expectedSkillIds) || catalog.expectedSkillIds.length === 0) {
    throw new Error('Codex catalog does not declare expectedSkillIds');
  }
  if (!Array.isArray(catalog.publicAliasSkillIds) || catalog.publicAliasSkillIds.length === 0) {
    throw new Error('Codex catalog does not declare publicAliasSkillIds');
  }
  if (typeof catalog.genericAgentSkillId !== 'string' || !catalog.genericAgentSkillId.trim()) {
    throw new Error('Codex catalog does not declare genericAgentSkillId');
  }
  return catalog;
}

function getManagedActivationSkillIds(catalog) {
  return [...new Set([
    ...catalog.expectedSkillIds,
    ...catalog.publicAliasSkillIds,
    catalog.genericAgentSkillId,
  ])].sort();
}

function renderSupremeAliasSkill(skillId) {
  return [
    '---',
    `name: ${skillId}`,
    'description: Activate the SINAPSE supreme orchestrator in Codex.',
    '---',
    '',
    '# SINAPSE Supreme Orchestrator Alias',
    '',
    'This is a public alias for `$sinapse-orqx`. Follow the authoritative skill at',
    '`.agents/skills/sinapse-orqx/SKILL.md` exactly. Resolve all aliases to the',
    'canonical `snps-orqx` source and preserve its delegation-only authority.',
    '',
  ].join('\n');
}

function renderGenericAgentSkill(skillId) {
  return [
    '---',
    `name: ${skillId}`,
    'description: Resolve and activate any canonical SINAPSE agent by ID in Codex.',
    '---',
    '',
    '# SINAPSE Parametric Agent Activator',
    '',
    'Use the agent ID supplied after `$sinapse-agent`.',
    'Canonical agent files under `.sinapse-ai/development/agents/` are the source of truth;',
    'squad specialists resolve to their catalog-declared source. A persona greeting may use',
    '`.codex/scripts/generate-codex-greeting.js` after successful resolution.',
    '',
    '1. Resolve it with `node .codex/scripts/resolve-codex-agent.js <agent-id> --json`.',
    '2. If resolution fails, stop and return the resolver error without guessing an ID.',
    '3. Read the returned `sourceOfTruth` and `pointer` files.',
    '4. Adopt the canonical persona, authority boundaries and activation protocol.',
    '5. Resolve starred commands with',
    '   `node .codex/scripts/resolve-codex-command.js <agent-id> <command> --json`.',
    '6. Use native Codex collaboration for delegation; never start nested Codex or Claude.',
    '',
    'The 172 TOML adapters in `.codex/agents` remain the native subagent layer. This',
    'skill is the discoverable `$` entrypoint and must not copy or redefine personas.',
    '',
  ].join('\n');
}

function renderExpandedAgentSkill(definition) {
  const skillId = `sinapse-agent-${definition.id}`;
  return {
    skillId,
    relativePath: null,
    content: [
      '---',
      `name: ${skillId}`,
      `description: Activate the canonical SINAPSE ${definition.name} agent in Codex.`,
      '---',
      '',
      `# SINAPSE Agent: ${definition.name}`,
      '',
      `This opt-in expanded activator is pinned to agent ID \`${definition.id}\`.`,
      `Resolve it with \`node .codex/scripts/resolve-codex-agent.js ${definition.id} --json\`,`,
      `then read \`${definition.sourcePath}\` as the source of truth and adopt its`,
      'persona and authority boundaries. Resolve starred commands through',
      `\`node .codex/scripts/resolve-codex-command.js ${definition.id} <command> --json\`.`,
      'Use native Codex collaboration for delegation; never start nested runtimes.',
      '',
    ].join('\n'),
  };
}

function collectCodexActivationSkills(projectRoot = PROJECT_ROOT, options = {}) {
  const root = path.resolve(projectRoot);
  const catalog = readCodexCatalog(root);
  const authoritative = new Map(
    collectNativeWorkflowSkills(root).map((skill) => [skill.skillId, skill]),
  );
  const skills = [];
  const generatedSkillIds = new Set([
    ...catalog.publicAliasSkillIds,
    catalog.genericAgentSkillId,
  ]);

  for (const skillId of [...new Set(catalog.expectedSkillIds)].sort()) {
    if (generatedSkillIds.has(skillId)) continue;
    const nativeRelativePath = `${NATIVE_SKILLS_DIR}/${skillId}/SKILL.md`;
    const nativeSourcePath = path.resolve(root, nativeRelativePath);
    if (isPathInside(root, nativeSourcePath) && fs.existsSync(nativeSourcePath)) {
      skills.push({
        skillId,
        relativePath: nativeRelativePath,
        content: fs.readFileSync(nativeSourcePath, 'utf8'),
      });
      continue;
    }
    if (authoritative.has(skillId)) {
      skills.push(authoritative.get(skillId));
      continue;
    }

    const relativePath = `${COMPATIBILITY_SKILLS_DIR}/${skillId}/SKILL.md`;
    const sourcePath = path.resolve(root, relativePath);
    if (!isPathInside(root, sourcePath) || !fs.existsSync(sourcePath)) {
      throw new Error(`Missing catalog activation skill: ${relativePath}`);
    }
    skills.push({ skillId, relativePath, content: fs.readFileSync(sourcePath, 'utf8') });
  }

  for (const skillId of catalog.publicAliasSkillIds) {
    const relativePath = `${NATIVE_SKILLS_DIR}/${skillId}/SKILL.md`;
    const sourcePath = path.resolve(root, relativePath);
    skills.push({
      skillId,
      relativePath: fs.existsSync(sourcePath) ? relativePath : null,
      content: fs.existsSync(sourcePath)
        ? fs.readFileSync(sourcePath, 'utf8')
        : renderSupremeAliasSkill(skillId),
    });
  }
  const genericRelativePath = `${NATIVE_SKILLS_DIR}/${catalog.genericAgentSkillId}/SKILL.md`;
  const genericSourcePath = path.resolve(root, genericRelativePath);
  skills.push({
    skillId: catalog.genericAgentSkillId,
    relativePath: fs.existsSync(genericSourcePath) ? genericRelativePath : null,
    content: fs.existsSync(genericSourcePath)
      ? fs.readFileSync(genericSourcePath, 'utf8')
      : renderGenericAgentSkill(catalog.genericAgentSkillId),
  });

  if (options.expandedSkills === true) {
    for (const definition of collectNativeAgentDefinitions(root)) {
      skills.push(renderExpandedAgentSkill(definition));
    }
  }

  return skills.sort((left, right) => left.skillId.localeCompare(right.skillId));
}

function syncNativeActivationSkills(projectRoot, skills = collectCodexActivationSkills(projectRoot)) {
  const outputDir = path.join(projectRoot, NATIVE_SKILLS_DIR);
  const summary = {
    total: skills.length,
    created: 0,
    updated: 0,
    unchanged: 0,
    sourceDir: COMPATIBILITY_SKILLS_DIR,
    outputDir: normalizePath(path.relative(projectRoot, outputDir)),
  };

  for (const skill of skills) {
    const skillDir = path.join(outputDir, skill.skillId);
    fs.mkdirSync(skillDir, { recursive: true });
    const status = writeFileIfChanged(path.join(skillDir, 'SKILL.md'), skill.content);
    summary[status] += 1;
  }
  return summary;
}

function collectNativeWorkflowSkills(projectRoot = PROJECT_ROOT) {
  const root = path.resolve(projectRoot);
  return NATIVE_WORKFLOW_SKILLS.map((skillId) => {
    const relativePath = `${NATIVE_SKILLS_DIR}/${skillId}/SKILL.md`;
    const sourcePath = path.resolve(root, relativePath);
    if (!isPathInside(root, sourcePath)) {
      throw new Error(`Native workflow skill escapes the project root: ${relativePath}`);
    }
    if (!fs.existsSync(sourcePath) || !fs.statSync(sourcePath).isFile()) {
      throw new Error(`Missing authoritative native workflow skill: ${relativePath}`);
    }

    return {
      skillId,
      relativePath,
      content: fs.readFileSync(sourcePath, 'utf8'),
    };
  });
}

function syncCodexWorkflowSkills(projectRoot, skills = collectNativeWorkflowSkills(projectRoot)) {
  const outputDir = path.join(projectRoot, COMPATIBILITY_SKILLS_DIR);
  const summary = {
    total: skills.length,
    created: 0,
    updated: 0,
    unchanged: 0,
    sourceDir: NATIVE_SKILLS_DIR,
    outputDir: normalizePath(path.relative(projectRoot, outputDir)),
  };

  for (const skill of skills) {
    const skillDir = path.join(outputDir, skill.skillId);
    fs.mkdirSync(skillDir, { recursive: true });
    const status = writeFileIfChanged(path.join(skillDir, 'SKILL.md'), skill.content);
    summary[status] += 1;
  }

  return summary;
}

function syncCodexNativeAgents(projectRoot = PROJECT_ROOT, options = {}) {
  const definitions = collectNativeAgentDefinitions(projectRoot);
  const activationSkills = collectCodexActivationSkills(projectRoot, options);
  const compatibilitySkills = options.expandedSkills === true
    ? collectCodexActivationSkills(projectRoot)
    : activationSkills;
  const outputDir = path.join(projectRoot, CODEX_AGENTS_DIR);
  fs.mkdirSync(outputDir, { recursive: true });

  const summary = {
    total: definitions.length,
    created: 0,
    updated: 0,
    unchanged: 0,
    outputDir: normalizePath(path.relative(projectRoot, outputDir)),
  };

  for (const definition of definitions) {
    const outputPath = path.join(outputDir, definition.fileName);
    const status = writeFileIfChanged(outputPath, renderNativeAgentToml(definition));
    summary[status] += 1;
  }

  summary.nativeSkills = syncNativeActivationSkills(projectRoot, activationSkills);
  summary.activationMode = options.expandedSkills === true ? 'expanded' : 'tiered';
  summary.skills = syncCodexWorkflowSkills(projectRoot, compatibilitySkills);

  return summary;
}

function main() {
  try {
    const expandedSkills = process.argv.slice(2).includes('--expanded-skills');
    const summary = syncCodexNativeAgents(PROJECT_ROOT, { expandedSkills });
    console.log(JSON.stringify(summary, null, 2));
  } catch (error) {
    console.error(`[sync-codex-native] ${error.message}`);
    process.exitCode = 1;
  }
}

if (require.main === module) {
  main();
}

module.exports = {
  CODEX_AGENTS_DIR,
  NATIVE_SKILLS_DIR,
  COMPATIBILITY_SKILLS_DIR,
  NATIVE_WORKFLOW_SKILLS,
  CODEX_CATALOG_PATH,
  SUPREME_ORCHESTRATOR_ID,
  SUPREME_ORCHESTRATOR_NAME,
  unwrapSingleLineYamlScalar,
  sanitizeDescription,
  extractSourceDescription,
  extractFrontmatterField,
  extractMarkdownRole,
  extractInlineMarkdownRole,
  nativeAgentName,
  buildDeveloperInstructions,
  renderNativeAgentToml,
  buildNativeAgentDefinition,
  collectNativeAgentDefinitions,
  collectNativeWorkflowSkills,
  readCodexCatalog,
  getManagedActivationSkillIds,
  renderSupremeAliasSkill,
  renderGenericAgentSkill,
  renderExpandedAgentSkill,
  collectCodexActivationSkills,
  syncNativeActivationSkills,
  syncCodexWorkflowSkills,
  syncCodexNativeAgents,
};
