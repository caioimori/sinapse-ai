// bin/commands/status.js — `sinapse-ai status` and `list` commands.
// Story GA-1.2 — extracted from bin/cli.js.

const fs = require('fs');
const path = require('path');
const { getLogger } = require('../../.sinapse-ai/core/logger');
const {
  ROOT,
  SINAPSE_HOME,
  CLAUDE_COMMANDS_DIR,
  BIN_DIR,
  CYAN,
  GREEN,
  YELLOW,
  RED,
  BOLD,
  NC,
} = require('../lib/constants');
const { header } = require('../lib/header');
const { getSquads } = require('../lib/squads');

function verifyInstall() {
  const logger = getLogger();
  const checks = [
    [fs.existsSync(SINAPSE_HOME), `${getSquads(SINAPSE_HOME).length} squads in ~/.sinapse/`],
    [fs.existsSync(CLAUDE_COMMANDS_DIR), 'Commands in ~/.claude/commands/SINAPSE/agents/'],
    [fs.existsSync(path.join(BIN_DIR, 'sinapse')), 'Launcher at ~/bin/sinapse'],
    [fs.existsSync(path.join(SINAPSE_HOME, '.claude', 'rules', 'squad-awareness.md')), 'squad-awareness.md'],
  ];

  for (const [ok, msg] of checks) {
    logger.always(`  ${ok ? GREEN + '✓' : RED + '✗'}${NC} ${msg}`);
  }
}

function cmdList() {
  const logger = getLogger();
  header();
  const baseDir = fs.existsSync(SINAPSE_HOME) ? SINAPSE_HOME : ROOT;
  const squads = getSquads(baseDir);
  let totalAgents = 0, totalTasks = 0;

  logger.always(`${BOLD}Squads available:${NC}\n`);

  for (const s of squads) {
    totalAgents += s.agents;
    totalTasks += s.tasks;
    const agents = `${s.agents} agents`.padStart(10);
    const tasks = `${s.tasks} tasks`.padStart(10);
    logger.always(`  ${CYAN}${s.name.padEnd(25)}${NC} ${GREEN}${agents}${NC} ${YELLOW}${tasks}${NC}  ${s.desc}`);
  }

  logger.always('');
  logger.always(`  ${BOLD}Total: ${GREEN}${totalAgents} agents${NC} | ${YELLOW}${totalTasks} tasks${NC}`);
  logger.always(`  ${BOLD}Invoke: ${CYAN}/SINAPSE:agents:{agent-id}${NC}`);
  logger.always('');
}

function cmdStatus({ watch = false } = {}) {
  const logger = getLogger();

  // D7 — live observability panel. `--watch` drives the animated panel from
  // the runtime status sources (Bob dashboard + per-cwd session-cache).
  if (watch) {
    const { ObservabilityPanel } = require('../../.sinapse-ai/core/ui/observability-panel');
    const handle = ObservabilityPanel.watchFromStatusFile(process.cwd(), {});
    process.on('SIGINT', () => {
      handle.stop();
      process.exit(0);
    });
    return;
  }

  header();

  // Check global install
  logger.always(`${BOLD}Global Install:${NC}\n`);

  if (fs.existsSync(path.join(SINAPSE_HOME, 'metadata.json'))) {
    const meta = JSON.parse(fs.readFileSync(path.join(SINAPSE_HOME, 'metadata.json'), 'utf8'));
    logger.always(`  ${GREEN}✓${NC} Installed (v${meta.version})`);
    logger.always(`  ${GREEN}✓${NC} ${meta.squads} squads, ${meta.commands || '?'} agents`);
    logger.always(`  ${GREEN}✓${NC} Installed: ${meta.installedAt}`);
    if (meta.updatedAt) logger.always(`  ${GREEN}✓${NC} Updated: ${meta.updatedAt}`);
  } else {
    logger.always(`  ${RED}✗${NC} Not installed globally`);
    logger.always(`  ${YELLOW}Run:${NC} npx sinapse-ai install`);
  }

  verifyInstall();
  logger.always('');
}

module.exports = {
  cmdStatus,
  cmdList,
  verifyInstall,
};
