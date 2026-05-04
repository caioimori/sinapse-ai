#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');
const { loadCodexCatalogConfig } = require('./codex-parity/catalog');
const { validateCodexCommandRegistry } = require('./validate-codex-command-registry');
const { validateCodexDelegation } = require('./validate-codex-delegation');
const { validateCodexIntegration } = require('./validate-codex-integration');
const { validateCodexSkills } = require('./codex-skills-sync/validate');
const { validatePaths } = require('./validate-paths');

function parseArgs(argv = process.argv.slice(2)) {
  const args = new Set(argv);
  return {
    quiet: args.has('--quiet') || args.has('-q'),
    json: args.has('--json'),
  };
}

function runLegacyCodexValidate(projectRoot, options = {}) {
  const args = [
    path.join('.sinapse-ai', 'infrastructure', 'scripts', 'ide-sync', 'index.js'),
    'validate',
    '--ide',
    'codex',
    '--strict',
  ];

  if (options.quiet) args.push('--quiet');

  const result = spawnSync(process.execPath, args, {
    cwd: projectRoot,
    encoding: 'utf8',
  });

  return {
    ok: result.status === 0,
    mode: 'canonical',
    checks: [],
    errors: result.status === 0 ? [] : ['Legacy Codex sync validation failed'],
    warnings: [],
    raw: [result.stdout, result.stderr].filter(Boolean).join('\n').trim(),
  };
}

function normalizeCheck(id, input) {
  return {
    id,
    ok: Boolean(input?.ok),
    errors: Array.isArray(input?.errors) ? input.errors : [],
    warnings: Array.isArray(input?.warnings) ? input.warnings : [],
    metrics: input?.metrics || {},
  };
}

function validateCodexSync(options = {}, deps = {}) {
  const projectRoot = options.projectRoot || process.cwd();
  const config = loadCodexCatalogConfig(projectRoot);
  const runLegacyValidate = deps.runLegacyCodexValidate || runLegacyCodexValidate;
  const runCodexCommands = deps.validateCodexCommandRegistry || validateCodexCommandRegistry;
  const runCodexDelegation = deps.validateCodexDelegation || validateCodexDelegation;
  const runCodexIntegration = deps.validateCodexIntegration || validateCodexIntegration;
  const runCodexSkills = deps.validateCodexSkills || validateCodexSkills;
  const runPaths = deps.validatePaths || validatePaths;

  if (config.catalogMode !== 'expanded') {
    return runLegacyValidate(projectRoot, options);
  }

  const catalogPath = path.join(projectRoot, '.codex', 'catalog.json');
  const checks = [
    normalizeCheck('codex-integration', runCodexIntegration({ projectRoot, quiet: true })),
    normalizeCheck('codex-commands', runCodexCommands({ projectRoot, quiet: true })),
    normalizeCheck('codex-delegation', runCodexDelegation({ projectRoot, quiet: true })),
    normalizeCheck('codex-skills', runCodexSkills({ projectRoot, strict: true, quiet: true })),
    normalizeCheck('paths', runPaths({ projectRoot, quiet: true })),
  ];

  if (!fs.existsSync(catalogPath)) {
    checks.unshift({
      id: 'codex-catalog',
      ok: false,
      errors: ['Missing Codex catalog file: .codex/catalog.json'],
      warnings: [],
      metrics: {},
    });
  } else {
    checks.unshift({
      id: 'codex-catalog',
      ok: true,
      errors: [],
      warnings: [],
      metrics: {},
    });
  }

  return {
    ok: checks.every((check) => check.ok),
    mode: 'expanded',
    checks,
    errors: checks.flatMap((check) => check.errors.map((error) => `${check.id}: ${error}`)),
    warnings: checks.flatMap((check) => check.warnings.map((warning) => `${check.id}: ${warning}`)),
  };
}

function formatHumanReport(result) {
  if (result.mode === 'canonical' && result.raw) {
    return result.raw;
  }

  const lines = [
    result.ok
      ? 'OK Codex sync validation passed'
      : `X Codex sync validation failed (${result.errors.length} issue(s))`,
  ];

  for (const check of result.checks || []) {
    lines.push(`${check.ok ? 'OK' : 'X'} ${check.id}`);
    if (check.errors.length > 0) {
      lines.push(...check.errors.map((error) => `- ${error}`));
    }
    if (check.warnings.length > 0) {
      lines.push(...check.warnings.map((warning) => `! ${warning}`));
    }
  }

  return lines.join('\n');
}

function main() {
  const args = parseArgs();
  const result = validateCodexSync(args);

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
  parseArgs,
  validateCodexSync,
  formatHumanReport,
  runLegacyCodexValidate,
  normalizeCheck,
};
