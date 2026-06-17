#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');
const {
  loadCodexCatalogConfig,
  getConfiguredSkillIds,
} = require('./codex-parity/catalog');
const { resolveCatalog } = require('./codex-parity/resolve');

function getDefaultOptions() {
  const projectRoot = process.cwd();
  return {
    projectRoot,
    instructionsFile: path.join(projectRoot, 'AGENTS.md'),
    agentsDir: path.join(projectRoot, '.codex', 'agents'),
    skillsDir: path.join(projectRoot, '.codex', 'skills'),
    sourceAgentsDir: path.join(projectRoot, '.sinapse-ai', 'development', 'agents'),
    quiet: false,
    json: false,
  };
}

function parseArgs(argv = process.argv.slice(2)) {
  const args = new Set(argv);
  return {
    quiet: args.has('--quiet') || args.has('-q'),
    json: args.has('--json'),
  };
}

function countMarkdownFiles(dirPath) {
  if (!fs.existsSync(dirPath)) return 0;
  return fs.readdirSync(dirPath).filter((f) => f.endsWith('.md')).length;
}

function countSkillFiles(skillsDir) {
  if (!fs.existsSync(skillsDir)) return 0;
  const entries = fs.readdirSync(skillsDir, { withFileTypes: true });
  return entries
    .filter((entry) => entry.isDirectory() && entry.name.startsWith('sinapse-'))
    .filter((entry) => fs.existsSync(path.join(skillsDir, entry.name, 'SKILL.md')))
    .length;
}

function validateCodexIntegration(options = {}) {
  const projectRoot = options.projectRoot || process.cwd();
  const config = loadCodexCatalogConfig(projectRoot);
  const resolved = {
    ...getDefaultOptions(),
    ...options,
    projectRoot,
    instructionsFile: options.instructionsFile || path.join(projectRoot, 'AGENTS.md'),
    agentsDir: options.agentsDir || path.join(projectRoot, config.codexAgentsDir || '.codex/agents'),
    skillsDir: options.skillsDir || path.join(projectRoot, config.skillsDir || '.codex/skills'),
    sourceAgentsDir: options.sourceAgentsDir || path.join(projectRoot, config.canonicalAgentsDir || '.sinapse-ai/development/agents'),
  };
  const errors = [];
  const warnings = [];

  if (!fs.existsSync(resolved.instructionsFile)) {
    warnings.push(
      `Codex instructions file not found yet: ${path.relative(resolved.projectRoot, resolved.instructionsFile)}`,
    );
  }

  if (!fs.existsSync(resolved.agentsDir)) {
    errors.push(`Missing Codex agents dir: ${path.relative(resolved.projectRoot, resolved.agentsDir)}`);
  }

  if (!fs.existsSync(resolved.skillsDir)) {
    errors.push(`Missing Codex skills dir: ${path.relative(resolved.projectRoot, resolved.skillsDir)}`);
  }

  const sourceCount = countMarkdownFiles(resolved.sourceAgentsDir);
  const codexAgentsCount = countMarkdownFiles(resolved.agentsDir);
  const codexSkillsCount = countSkillFiles(resolved.skillsDir);
  const expectedSkillIds = getConfiguredSkillIds(config);

  // --- Behavioral resolution (anti-fachada) --------------------------------
  // Open every Codex agent pointer and RESOLVE it against the real
  // source-of-truth set. A present file is not parity; a resolving pointer is.
  const catalog = resolveCatalog(resolved.projectRoot, {
    canonicalAgentsDir: config.canonicalAgentsDir || '.sinapse-ai/development/agents',
    codexAgentsDir: config.codexAgentsDir || '.codex/agents',
    squadsDir: config.squadsDir || 'squads',
  });

  for (const broken of catalog.brokenPointers) {
    errors.push(
      `Broken Codex pointer: ${broken.id} -> ${broken.target || '(no target)'} (${broken.reason})`,
    );
  }

  for (const orphan of catalog.orphans) {
    errors.push(
      `Orphan Codex agent: ${orphan.id} has no source-of-truth in the canonical agent set`,
    );
  }

  // --- Count parity: MISMATCH is now an ERROR, not a soft warning ----------
  // In expanded mode the Codex catalog is the full ecosystem (172), which is
  // intentionally larger than the dev/core agents dir. Parity is measured
  // against the resolvable source set, not the dev dir.
  if (config.catalogMode === 'expanded') {
    if (codexAgentsCount !== catalog.resolved.length) {
      errors.push(
        `Codex agent count mismatch: ${codexAgentsCount} catalog file(s) but only ${catalog.resolved.length} resolve cleanly`,
      );
    }
  } else if (sourceCount > 0 && codexAgentsCount !== sourceCount) {
    errors.push(`Codex agent count differs from source (${codexAgentsCount}/${sourceCount})`);
  }

  if (expectedSkillIds && codexSkillsCount !== expectedSkillIds.length) {
    errors.push(`Codex skill count differs from configured catalog (${codexSkillsCount}/${expectedSkillIds.length})`);
  } else if (!expectedSkillIds && sourceCount > 0 && codexSkillsCount !== sourceCount) {
    errors.push(`Codex skill count differs from source (${codexSkillsCount}/${sourceCount})`);
  }

  return {
    ok: errors.length === 0,
    errors,
    warnings,
    metrics: {
      canonicalAgents: sourceCount,
      codexAgents: codexAgentsCount,
      codexSkills: codexSkillsCount,
      expectedSkills: expectedSkillIds ? expectedSkillIds.length : sourceCount,
      resolvedPointers: catalog.resolved.length,
      brokenPointers: catalog.brokenPointers.length,
      orphans: catalog.orphans.length,
      sourceAgents: catalog.sourceCount,
    },
  };
}

function formatHumanReport(result) {
  if (result.ok) {
    const lines = [
      `✅ Codex integration validation passed (agents: ${result.metrics.codexAgents} resolve, ${result.metrics.orphans} orphans, ${result.metrics.brokenPointers} broken pointers, skills: ${result.metrics.codexSkills})`,
    ];
    if (result.warnings.length > 0) {
      lines.push(...result.warnings.map((w) => `⚠️ ${w}`));
    }
    return lines.join('\n');
  }
  const lines = [
    `❌ Codex integration validation failed (${result.errors.length} issue(s))`,
    ...result.errors.map((e) => `- ${e}`),
  ];
  if (result.warnings.length > 0) {
    lines.push(...result.warnings.map((w) => `⚠️ ${w}`));
  }
  return lines.join('\n');
}

function main() {
  const args = parseArgs();
  const result = validateCodexIntegration(args);

  if (!args.quiet) {
    if (args.json) {
      console.log(JSON.stringify(result, null, 2));
    } else {
      console.log(formatHumanReport(result));
    }
  }

  if (!result.ok) {
    process.exitCode = 1;
  }
}

if (require.main === module) {
  main();
}

module.exports = {
  validateCodexIntegration,
  parseArgs,
  getDefaultOptions,
  countMarkdownFiles,
  countSkillFiles,
};
