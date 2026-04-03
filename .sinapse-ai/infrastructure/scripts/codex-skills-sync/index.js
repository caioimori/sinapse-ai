#!/usr/bin/env node
'use strict';

const fs = require('fs-extra');
const path = require('path');
const os = require('os');

const {
  parseAllAgents,
  normalizeCommands,
  getVisibleCommands,
} = require('../ide-sync/agent-parser');
const {
  loadCodexCatalogConfig,
  getGeneratedSkillSpec,
} = require('../codex-parity/catalog');

function getCodexHome() {
  return process.env.CODEX_HOME || path.join(os.homedir(), '.codex');
}

function getDefaultOptions() {
  const projectRoot = process.cwd();
  const envLocalDir = process.env.SINAPSE_CODEX_LOCAL_SKILLS_DIR;
  const envGlobalDir = process.env.SINAPSE_CODEX_GLOBAL_SKILLS_DIR;
  return {
    projectRoot,
    sourceDir: path.join(projectRoot, '.sinapse-ai', 'development', 'agents'),
    localSkillsDir: envLocalDir || path.join(projectRoot, '.codex', 'skills'),
    globalSkillsDir: envGlobalDir || path.join(getCodexHome(), 'skills'),
    global: false,
    globalOnly: false,
    dryRun: false,
    quiet: false,
  };
}

function trimText(text, max = 220) {
  const normalized = String(text || '').replace(/\s+/g, ' ').trim();
  if (normalized.length <= max) return normalized;
  return `${normalized.slice(0, max - 3).trim()}...`;
}

function getSkillId(agentId) {
  const id = String(agentId || '').trim();
  if (id.startsWith('sinapse-')) return id;
  return `sinapse-${id}`;
}

function resolveSkillSpec(agentData, config) {
  const override = getGeneratedSkillSpec(agentData.id, config) || {};
  const sourceOfTruth = override.sourceOfTruth || `.sinapse-ai/development/agents/${agentData.filename}`;
  const fallbackSource = override.fallbackSource || (
    sourceOfTruth === `.sinapse-ai/development/agents/${agentData.filename}`
      ? `.codex/agents/${agentData.filename}`
      : null
  );

  return {
    skillId: override.skillId || getSkillId(agentData.id),
    sourceOfTruth,
    fallbackSource,
    canonicalReference: override.canonicalReference || null,
    greetingScript: override.greetingScript || '.sinapse-ai/development/scripts/generate-greeting.js',
    greetingAgentId: override.greetingAgentId || agentData.id,
  };
}

function buildSkillContent(agentData, options = {}) {
  const config = options.config || loadCodexCatalogConfig(options.projectRoot || process.cwd());
  const spec = resolveSkillSpec(agentData, config);
  const agent = agentData.agent || {};
  const name = agent.name || agentData.id;
  const title = agent.title || 'SINAPSE Agent';
  const whenToUse = trimText(agent.whenToUse || `Use @${agentData.id} for specialized tasks.`);

  const allCommands = normalizeCommands(agentData.commands || []);
  const quick = getVisibleCommands(allCommands, 'quick');
  const key = getVisibleCommands(allCommands, 'key');
  const commands = [...quick, ...key.filter(k => !quick.some(q => q.name === k.name))]
    .slice(0, 8)
    .map(c => `- \`*${c.name}\` - ${c.description || 'No description'}`)
    .join('\n');

  const skillName = spec.skillId;
  const description = trimText(`${title} (${name}). ${whenToUse}`, 180);
  const sourceOfTruthLine = spec.fallbackSource
    ? `1. Load \`${spec.sourceOfTruth}\` as source of truth (fallback: \`${spec.fallbackSource}\`)`
    : `1. Load \`${spec.sourceOfTruth}\` as source of truth`;
  const canonicalReferenceLine = spec.canonicalReference
    ? `2. Keep \`${spec.canonicalReference}\` as the shared parity reference.`
    : null;
  const greetingStepNumber = canonicalReferenceLine ? 3 : 2;
  const personaStepNumber = canonicalReferenceLine ? 4 : 3;
  const stayInPersonaStepNumber = canonicalReferenceLine ? 5 : 4;

  const activationLines = [
    `${sourceOfTruthLine}.`,
    canonicalReferenceLine,
    `${greetingStepNumber}. Generate greeting via \`node ${spec.greetingScript} ${spec.greetingAgentId}\` and show it first.`,
    `${personaStepNumber}. Adopt this agent persona and command system.`,
    `${stayInPersonaStepNumber}. If a starred command is invoked in Codex, resolve it via \`node .codex/scripts/resolve-codex-command.js ${skillName} <command>\` when a registry mapping exists.`,
    `${stayInPersonaStepNumber + 1}. Stay in this persona until the user asks to switch or exit.`,
  ].filter(Boolean);

  return `---
name: ${skillName}
description: ${description}
---

# SINAPSE ${title} Activator

## When To Use
${whenToUse}

## Activation Protocol
${activationLines.join('\n')}

## Starter Commands
${commands || '- `*help` - List available commands'}

## Non-Negotiables
- Follow \`.sinapse-ai/constitution.md\`.
- Execute workflows/tasks only from declared dependencies.
- Do not invent requirements outside the project artifacts.
`;
}

function buildSkillPlan(agents, skillsDir, options = {}) {
  const config = options.config || loadCodexCatalogConfig(options.projectRoot || process.cwd());
  return agents
    .filter(a => !a.error || a.error === 'YAML parse failed, using fallback extraction')
    .map(agentData => {
      const spec = resolveSkillSpec(agentData, config);
      const skillId = spec.skillId;
      const targetDir = path.join(skillsDir, skillId);
      const targetFile = path.join(targetDir, 'SKILL.md');
      return {
        agentId: agentData.id,
        skillId,
        targetDir,
        targetFile,
        content: buildSkillContent(agentData, { config, projectRoot: options.projectRoot }),
      };
    });
}

function writeSkillPlan(plan, options) {
  for (const item of plan) {
    if (!options.dryRun) {
      try {
        fs.ensureDirSync(item.targetDir);
        fs.writeFileSync(item.targetFile, item.content, 'utf8');
      } catch (error) {
        throw new Error(`Failed to write skill ${item.skillId} at ${item.targetFile}: ${error.message}`);
      }
    }
  }
}

function syncSkills(options = {}) {
  const resolved = { ...getDefaultOptions(), ...options };
  if (resolved.globalOnly) {
    resolved.global = true;
  }
  const config = resolved.config || loadCodexCatalogConfig(resolved.projectRoot);
  const agents = parseAllAgents(resolved.sourceDir);
  const plan = buildSkillPlan(agents, resolved.localSkillsDir, {
    config,
    projectRoot: resolved.projectRoot,
  });

  if (!resolved.globalOnly) {
    writeSkillPlan(plan, resolved);
  }

  if (resolved.global) {
    const globalPlan = buildSkillPlan(agents, resolved.globalSkillsDir, {
      config,
      projectRoot: resolved.projectRoot,
    });
    writeSkillPlan(globalPlan, resolved);
  }

  return {
    generated: plan.length,
    localSkillsDir: resolved.localSkillsDir,
    globalSkillsDir: resolved.global || resolved.globalOnly ? resolved.globalSkillsDir : null,
    dryRun: resolved.dryRun,
  };
}

function parseArgs(argv = process.argv.slice(2)) {
  const args = new Set(argv);
  return {
    global: args.has('--global'),
    globalOnly: args.has('--global-only'),
    dryRun: args.has('--dry-run'),
    quiet: args.has('--quiet') || args.has('-q'),
  };
}

function main() {
  const options = parseArgs();
  const result = syncSkills(options);

  if (!options.quiet) {
    if (!options.globalOnly) {
      console.log(`✅ Generated ${result.generated} Codex skills in ${result.localSkillsDir}`);
    }
    if (result.globalSkillsDir) {
      console.log(`✅ Installed ${result.generated} Codex skills in ${result.globalSkillsDir}`);
    }
    if (result.dryRun) {
      console.log('ℹ️ Dry-run mode: no files written');
    }
  }
}

if (require.main === module) {
  main();
}

module.exports = {
  buildSkillContent,
  buildSkillPlan,
  syncSkills,
  parseArgs,
  getCodexHome,
  getSkillId,
};
