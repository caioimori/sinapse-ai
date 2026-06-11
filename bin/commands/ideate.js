// bin/commands/ideate.js — `sinapse ideate` command.
//
// Wires the IdeationEngine (.sinapse-ai/core/ideation) into the CLI so the
// framework's self-improvement analyzers (performance, security, code quality,
// UX, architecture) are actually reachable. Before this, the engine had zero
// consumers (VAPORWARE-1, audit 2026-06-11). Per "potentiate, don't cut", the
// fix is a real entry point, not deletion.

'use strict';

const path = require('path');
const { getLogger } = require('../../.sinapse-ai/core/logger');
const { CYAN, GREEN, YELLOW, RED, BOLD, NC } = require('../lib/constants');

const VALID_AREAS = ['performance', 'security', 'codeQuality', 'ux', 'architecture'];

/**
 * Parse `ideate` CLI args into options.
 * @param {string[]} argv - args after the `ideate` token
 * @returns {{ help: boolean, json: boolean, save: boolean, focus: string[]|undefined }}
 */
function parseIdeateArgs(argv = []) {
  const opts = { help: false, json: false, save: true, focus: undefined };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--help' || a === '-h') opts.help = true;
    else if (a === '--json') opts.json = true;
    else if (a === '--no-save') opts.save = false;
    else if (a === '--focus' || a === '-f') {
      const val = argv[i + 1];
      if (val && !val.startsWith('-')) {
        opts.focus = val.split(',').map((s) => s.trim()).filter(Boolean);
        i++;
      }
    } else if (a.startsWith('--focus=')) {
      opts.focus = a.slice('--focus='.length).split(',').map((s) => s.trim()).filter(Boolean);
    }
  }
  return opts;
}

/** Print usage. */
function printHelp(logger) {
  logger.always(`${BOLD}sinapse ideate${NC} — análise de melhorias do projeto\n`);
  logger.always('Analisa o código e sugere melhorias priorizadas (quick wins primeiro)');
  logger.always('nas áreas: performance, security, codeQuality, ux, architecture.\n');
  logger.always(`${BOLD}Uso:${NC}`);
  logger.always(`  ${CYAN}sinapse ideate${NC}                      analisa todas as áreas`);
  logger.always(`  ${CYAN}sinapse ideate --focus security${NC}     só uma área (ou lista: perf,security)`);
  logger.always(`  ${CYAN}sinapse ideate --no-save${NC}            não grava o relatório em disco`);
  logger.always(`  ${CYAN}sinapse ideate --json${NC}               saída JSON (pra pipelines)\n`);
  logger.always(`Relatório salvo em ${CYAN}.sinapse/ideation/${NC} (suggestions.json + .md).`);
}

/**
 * Run the ideation analysis and present results.
 * @param {object} [opts]
 * @param {string[]} [opts.argv] - raw args after `ideate`
 * @returns {Promise<number>} exit code
 */
async function cmdIdeate(opts = {}) {
  const logger = getLogger();
  const parsed = parseIdeateArgs(opts.argv || []);

  if (parsed.help) {
    printHelp(logger);
    return 0;
  }

  // Validate focus areas early with a friendly message.
  if (parsed.focus) {
    const invalid = parsed.focus.filter((a) => !VALID_AREAS.includes(a));
    if (invalid.length) {
      logger.error(`${RED}Área inválida:${NC} ${invalid.join(', ')}`);
      logger.error(`Áreas válidas: ${VALID_AREAS.join(', ')}`);
      return 1;
    }
  }

  let IdeationEngine;
  try {
    IdeationEngine = require('../../.sinapse-ai/core/ideation/ideation-engine');
  } catch (e) {
    logger.error(`${RED}Motor de ideação indisponível:${NC} ${e.message}`);
    return 1;
  }

  const engine = new IdeationEngine({ rootPath: process.cwd() });

  if (!parsed.json) {
    logger.always(`${CYAN}›${NC} Analisando o projeto${parsed.focus ? ` (${parsed.focus.join(', ')})` : ''}...`);
  }

  let result;
  try {
    result = await engine.ideate({ focus: parsed.focus, save: parsed.save });
  } catch (e) {
    logger.error(`${RED}Falha na análise:${NC} ${e.message}`);
    return 1;
  }

  if (parsed.json) {
    logger.always(JSON.stringify(result, null, 2));
    return 0;
  }

  const { summary } = result;
  logger.always('');
  logger.always(`${BOLD}${summary.totalSuggestions} sugestões${NC} · ${GREEN}${summary.quickWins} quick wins${NC} · ${YELLOW}${summary.highImpact} alto impacto${NC}`);

  const top = result.allSuggestions.slice(0, 8);
  if (top.length) {
    logger.always('');
    for (const s of top) {
      const tag = s.category === 'quick-win' ? `${GREEN}[quick win]${NC}` : `${YELLOW}[${s.area}]${NC}`;
      logger.always(`  ${tag} ${s.title || s.description}`);
    }
  } else {
    logger.always(`\n${GREEN}Nenhuma sugestão pendente — o código está limpo nas áreas analisadas.${NC}`);
  }

  if (parsed.save) {
    const out = path.join('.sinapse', 'ideation');
    logger.always(`\nRelatório completo salvo em ${CYAN}${out}/${NC} (suggestions.md)`);
  }
  return 0;
}

module.exports = { cmdIdeate, parseIdeateArgs, VALID_AREAS };
