/**
 * Doctor Check Registry
 *
 * Exports all 15 check modules in execution order.
 *
 * @module sinapse-ai/doctor/checks
 * @story INS-4.1, INS-4.8
 */

const settingsJson = require('./settings-json');
const rulesFiles = require('./rules-files');
const agentMemory = require('./agent-memory');
const entityRegistry = require('./entity-registry');
const gitHooks = require('./git-hooks');
const coreConfig = require('./core-config');
const claudeMd = require('./claude-md');
const ideSync = require('./ide-sync');
const graphDashboard = require('./graph-dashboard');
const codeIntel = require('./code-intel');
const nodeVersion = require('./node-version');
const npmPackages = require('./npm-packages');
const skillsCount = require('./skills-count');
const commandsCount = require('./commands-count');
const hooksClaudeCount = require('./hooks-claude-count');
const constitutionConsistency = require('./constitution-consistency');

function loadChecks(options = {}) {
  const checks = [
    settingsJson,
    rulesFiles,
    agentMemory,
    entityRegistry,
    gitHooks,
    coreConfig,
    claudeMd,
    ideSync,
    graphDashboard,
    codeIntel,
    nodeVersion,
    npmPackages,
    skillsCount,
    commandsCount,
    hooksClaudeCount,
  ];

  // Deep checks — only run with --deep flag
  if (options.deep) {
    checks.push(constitutionConsistency);
  }

  return checks;
}

module.exports = { loadChecks };
