// bin/commands/help.js — `sinapse-ai help` command.
// Story GA-1.2 — extracted from bin/cli.js.

const { getLogger } = require('../../.sinapse-ai/core/logger');
const { CYAN, BOLD, DIM, NC } = require('../lib/constants');
const { header } = require('../lib/header');

function cmdHelp() {
  const logger = getLogger();
  header();
  logger.always(`${BOLD}Commands:${NC}\n`);
  logger.always(`  ${CYAN}npx sinapse-ai init <name>${NC}           Scaffold a new SINAPSE project (greenfield)`);
  logger.always(`  ${CYAN}npx sinapse-ai install${NC}               Install SINAPSE (idempotent — re-runs are upserts)`);
  logger.always(`  ${CYAN}npx sinapse-ai install --force${NC}       Wipe and reinstall fresh, even if already installed`);
  logger.always(`  ${CYAN}npx sinapse-ai install --reconfigure${NC} Re-prompt language/LLM without wiping existing install`);
  logger.always(`  ${CYAN}npx sinapse-ai update${NC}           Update SINAPSE to the latest version`);
  logger.always(`  ${CYAN}npx sinapse-ai uninstall${NC}        Remove SINAPSE globally (prompts for confirmation)`);
  logger.always(`  ${CYAN}npx sinapse-ai uninstall --yes${NC}  Remove SINAPSE globally (no prompt — required in CI)`);
  logger.always('');
  logger.always(`  ${DIM}Works in CI / non-interactive environments (uses sensible defaults).${NC}`);
  logger.always('');
  logger.always(`${BOLD}Diagnostics:${NC}\n`);
  logger.always(`  ${CYAN}npx sinapse-ai status${NC}           Check installation status`);
  logger.always(`  ${CYAN}npx sinapse-ai doctor${NC}           Run health checks (--fix --dry-run --json --deep)`);
  logger.always(`  ${CYAN}npx sinapse-ai list${NC}             List all squads and agents`);
  logger.always(`  ${CYAN}npx sinapse-ai help${NC}             Show this help`);
  logger.always('');
  logger.always(`${BOLD}After install:${NC}\n`);
  logger.always(`  ${CYAN}sinapse${NC}                      Start Claude Code with all agents`);
  logger.always(`  ${CYAN}sinapse --continue${NC}           Continue last session`);
  logger.always('');
  logger.always(`${BOLD}Agents:${NC}\n`);
  logger.always(`  All agents use: ${CYAN}/SINAPSE:agents:{agent-id}${NC}`);
  logger.always(`  Example: ${CYAN}/SINAPSE:agents:brand-orqx${NC}`);
  logger.always('');
}

module.exports = { cmdHelp };
