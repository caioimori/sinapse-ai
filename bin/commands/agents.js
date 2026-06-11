// bin/commands/agents.js — `sinapse agents` command.
//
// Lists the full agent roster with uniform, derived metadata (id, name, squad,
// type) via SquadAgentResolver.list(). This is the consumer that makes the
// unified agent schema (SCHEMA-001) useful: one place to discover every agent
// regardless of how its source file is structured.

'use strict';

const { getLogger } = require('../../.sinapse-ai/core/logger');
const { CYAN, GREEN, YELLOW, BOLD, DIM, RED, NC } = require('../lib/constants');

/**
 * Parse `agents` CLI args.
 * @param {string[]} argv
 * @returns {{help:boolean, json:boolean, squad:string|undefined, type:string|undefined}}
 */
function parseAgentsArgs(argv = []) {
  const o = { help: false, json: false, squad: undefined, type: undefined };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--help' || a === '-h') o.help = true;
    else if (a === '--json') o.json = true;
    else if (a === '--squad') { o.squad = argv[++i]; }
    else if (a.startsWith('--squad=')) o.squad = a.slice('--squad='.length);
    else if (a === '--type') { o.type = argv[++i]; }
    else if (a.startsWith('--type=')) o.type = a.slice('--type='.length);
  }
  return o;
}

function printHelp(logger) {
  logger.always(`${BOLD}sinapse agents${NC} — lista os agentes do framework\n`);
  logger.always(`${BOLD}Uso:${NC}`);
  logger.always(`  ${CYAN}sinapse agents${NC}                    todos os agentes, agrupados por squad`);
  logger.always(`  ${CYAN}sinapse agents --squad squad-copy${NC} só de um squad`);
  logger.always(`  ${CYAN}sinapse agents --type orchestrator${NC} só orquestradores`);
  logger.always(`  ${CYAN}sinapse agents --json${NC}             saída JSON (pra tooling)`);
}

/**
 * Run the agents listing.
 * @param {object} [opts]
 * @param {string[]} [opts.argv]
 * @returns {number} exit code
 */
function cmdAgents(opts = {}) {
  const logger = getLogger();
  const parsed = parseAgentsArgs(opts.argv || []);
  if (parsed.help) {
    printHelp(logger);
    return 0;
  }

  let SquadAgentResolver;
  try {
    SquadAgentResolver = require('../../.sinapse-ai/core/registry/squad-agent-resolver');
  } catch (e) {
    logger.error(`${RED}Resolver de agentes indisponível:${NC} ${e.message}`);
    return 1;
  }

  const resolver = new SquadAgentResolver(process.cwd());
  let agents = resolver.list();

  if (parsed.squad) agents = agents.filter((a) => a.squad === parsed.squad);
  if (parsed.type) agents = agents.filter((a) => a.type === parsed.type);

  if (parsed.json) {
    logger.always(JSON.stringify(agents, null, 2));
    return 0;
  }

  if (agents.length === 0) {
    logger.always(`${YELLOW}Nenhum agente encontrado com esse filtro.${NC}`);
    return 0;
  }

  // Group by squad for a scannable view.
  const bySquad = {};
  for (const a of agents) (bySquad[a.squad] ||= []).push(a);
  const squads = Object.keys(bySquad).sort();

  logger.always(`${BOLD}${agents.length} agentes${NC} em ${squads.length} grupos\n`);
  for (const squad of squads) {
    logger.always(`${CYAN}${squad}${NC} ${DIM}(${bySquad[squad].length})${NC}`);
    for (const a of bySquad[squad].sort((x, y) => x.id.localeCompare(y.id))) {
      const tag = a.type === 'orchestrator' ? `${GREEN}◆${NC}` : `${DIM}·${NC}`;
      logger.always(`  ${tag} ${a.id} ${DIM}— ${a.name}${NC}`);
    }
    logger.always('');
  }
  return 0;
}

module.exports = { cmdAgents, parseAgentsArgs };
