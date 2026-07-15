// bin/commands/help.js — `sinapse-ai help` command.
// Story GA-1.2 — extracted from bin/cli.js.

const { getLogger } = require('../../.sinapse-ai/core/logger');
const { CYAN, BOLD, DIM, NC } = require('../lib/constants');
const { header } = require('../lib/header');

function cmdHelp() {
  const logger = getLogger();
  header();
  logger.always(`${BOLD}Comandos:${NC}\n`);
  logger.always(`  ${CYAN}npx sinapse-ai init <nome>${NC}           Cria um novo projeto SINAPSE (greenfield)`);
  logger.always(`  ${CYAN}npx sinapse-ai install${NC}               Instala SINAPSE (idempotente — re-runs são upserts)`);
  logger.always(`  ${CYAN}npx sinapse-ai install --force${NC}       Reinstala do zero, mesmo se já instalado`);
  logger.always(`  ${CYAN}npx sinapse-ai install --reconfigure${NC} Re-pergunta idioma/LLM sem apagar instalação`);
  logger.always(`  ${CYAN}npx sinapse-ai install --llm=both --global-only${NC} Instala Claude + Codex sem alterar o projeto atual`);
  logger.always(`  ${CYAN}npx sinapse-ai update${NC}           Atualiza SINAPSE para a última versão`);
  logger.always(`  ${CYAN}npx sinapse-ai uninstall${NC}        Remove SINAPSE globalmente (pede confirmação)`);
  logger.always(`  ${CYAN}npx sinapse-ai uninstall --yes${NC}  Remove SINAPSE globalmente (sem prompt — exigido em CI)`);
  logger.always('');
  logger.always(`  ${DIM}Funciona em CI / ambientes não-interativos (usa defaults sensatos).${NC}`);
  logger.always('');
  logger.always(`${BOLD}Motor de orquestração (avançado — 1 story por vez):${NC}\n`);
  logger.always(`  ${CYAN}npx sinapse-ai spec <story-id>${NC}        Gera a spec REAL de uma story (para antes de plano/build/QA)`);
  logger.always(`  ${CYAN}npx sinapse-ai plan <story-id>${NC}        Spec + plano de implementação REAL (para antes de build/QA)`);
  logger.always(`  ${CYAN}npx sinapse-ai orchestrate <story-id>${NC} Pipeline completo de 1 story (${DIM}--dry-run pra prever${NC})`);
  logger.always('');
  logger.always(`${BOLD}Diagnóstico:${NC}\n`);
  logger.always(`  ${CYAN}npx sinapse-ai status${NC}           Mostra estado da instalação`);
  logger.always(`  ${CYAN}npx sinapse-ai doctor${NC}           Roda health checks (--fix --dry-run --json --deep)`);
  logger.always(`  ${CYAN}npx sinapse-ai list${NC}             Lista todos squads e agents`);
  logger.always(`  ${CYAN}npx sinapse-ai help${NC}             Mostra esta ajuda`);
  logger.always(`  ${CYAN}npx sinapse-ai --version${NC}        Mostra versão instalada (semver puro)`);
  logger.always('');
  logger.always(`${BOLD}Após instalar:${NC}\n`);
  logger.always(`  ${CYAN}sinapse${NC}                      Inicia Claude Code com todos os agents`);
  logger.always(`  ${CYAN}sinapse --continue${NC}           Continua última sessão`);
  logger.always('');
  logger.always(`${BOLD}Agents:${NC}\n`);
  logger.always(`  Invocação canônica:  ${CYAN}$sinapse-agent <agent-id>${NC}`);
  logger.always(`  Exemplo:             ${CYAN}$sinapse-agent brand-orqx${NC}`);
  logger.always(`  Master orchestrator: ${CYAN}@sinapse-orqx${NC} (alias: ${DIM}@snps-orqx${NC})`);
  logger.always('');
  logger.always(`${BOLD}Ajuda extra:${NC}\n`);
  logger.always(`  Erros comuns + remediação: ${CYAN}docs/guides/cli-errors.md${NC}`);
  logger.always(`  Quickstart (recording):    ${CYAN}docs/examples/quickstart-recording.md${NC}`);
  logger.always('');
}

module.exports = { cmdHelp };
