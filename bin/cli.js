#!/usr/bin/env node

// ══════════════════════════════════════════════════════════════════════════════
// Sinapse CLI — Global + Local installer for Claude Code agent squads
// ══════════════════════════════════════════════════════════════════════════════
// Story GA-1.2 — modular refactor. This file is now a thin router.
// All command logic lives in bin/commands/*. Helpers in bin/lib/*.
// Module.exports preserved for backward compat (tests import from here).

const path = require('path');

// Story A.2 — unified logger. Levels: error/warn/info/debug.
// Flags: --verbose, --debug, --quiet, --json. Default level: warn.
const { getLogger } = require('../.sinapse-ai/core/logger');
const logger = getLogger();

const { CYAN, RED, NC, SINAPSE_HOME, HOME } = require('./lib/constants');
const { closestMatch } = require('./lib/fuzzy');

// Story GA-1.3 — canonical command list shared by router + fuzzy match.
const KNOWN_COMMANDS = [
  'install',
  'update',
  'uninstall',
  'init',
  'list',
  'status',
  'doctor',
  'chrome-brain',
  'help',
];
const {
  syncDirSync,
} = require('./lib/fs-utils');
const {
  detectExistingInstall,
  detectStaleness,
  detectInteractiveMode,
  isFirstRun,
} = require('./lib/detection');
const {
  promptLlmChoice,
  promptGroundingSections,
} = require('./lib/prompts');
const { header } = require('./lib/header');
const { cmdHelp } = require('./commands/help');
const { cmdStatus, cmdList } = require('./commands/status');
const { cmdInstallLocal, cmdUpdateLocal } = require('./commands/local');
const { cmdInstallGlobal } = require('./commands/install');
const { cmdUpdateGlobal } = require('./commands/update');
const { cmdDoctor } = require('./commands/doctor');
const {
  cmdUninstall,
  recordInstalledAgents,
  readInstalledAgentsManifest,
  removeInstalledAgentsFrom,
  removeOrqxAgentsFrom,
  cleanClaudeSettingsJson,
  INSTALLED_AGENTS_MANIFEST,
} = require('./commands/uninstall');

// ── Router ───────────────────────────────────────────────────────────────────

// Story 10.20 — Export helpers for unit tests. Router only runs when this
// file is invoked directly by Node; importing it from a test gets the
// helpers without triggering the switch statement.
module.exports = {
  syncDirSync,
  detectExistingInstall,
  cmdDoctor,
  promptLlmChoice,
  SINAPSE_HOME,
  HOME,
  // Story 10.40 — exported for tests
  detectStaleness,
  removeOrqxAgentsFrom,
  cleanClaudeSettingsJson,
  cmdUninstall,
  // Audit 1 P0 (UN-1) — exported for tests
  removeInstalledAgentsFrom,
  recordInstalledAgents,
  readInstalledAgentsManifest,
  INSTALLED_AGENTS_MANIFEST,
  // Story 10.46 — exported for tests
  detectInteractiveMode,
  isFirstRun,
  // Story 10.47 — exported for tests
  promptGroundingSections,
};

if (require.main === module) {
  runRouter();
}

function runRouter() {
  const args = process.argv.slice(2);
  // Story 10.46 — empty invocation on a fresh machine routes to a first-run
  // hint instead of the bare help screen, so new users discover `install`.
  let command = args[0];
  if (!command) {
    command = isFirstRun() ? 'first-run' : 'help';
  }
  const isLocal = args.includes('--local');
  const isForce = args.includes('--force');
  const isReconfigure = args.includes('--reconfigure');

  switch (command) {
    case 'install':  isLocal ? cmdInstallLocal() : cmdInstallGlobal({ force: isForce, reconfigure: isReconfigure }).catch(e => { logger.error(`${RED}Erro ao instalar:${NC} ${e.message}`); logger.error(`Tente: ${CYAN}npx sinapse-ai doctor${NC}`); process.exit(1); }); break;
    case 'update':   isLocal ? cmdUpdateLocal()  : cmdUpdateGlobal().catch(e => { logger.error(`${RED}Erro ao atualizar:${NC} ${e.message}`); logger.error(`Tente: ${CYAN}npx sinapse-ai doctor${NC}`); process.exit(1); });  break;
    case 'uninstall': {
      const isYes = args.includes('--yes') || args.includes('-y');
      cmdUninstall({ yes: isYes }).catch(e => { logger.error(`${RED}Erro ao desinstalar:${NC} ${e.message}`); process.exit(1); });
      break;
    }
    case 'init': {
      // Story 10.43 — greenfield project scaffold at the canonical CLI entry.
      // Delegates to bin/sinapse.js (which already owns the init wizard for
      // the legacy binary) via a synchronous child process so both entry
      // points share one source of truth and flag behavior stays identical.
      const { spawnSync } = require('child_process');
      const initArgs = args.slice(1);
      const result = spawnSync(
        process.execPath,
        [path.join(__dirname, 'sinapse.js'), 'init', ...initArgs],
        { stdio: 'inherit' },
      );
      if (result.error) {
        logger.error(`${RED}Erro ao iniciar projeto:${NC} ${result.error.message}`);
        logger.error(`Tente: ${CYAN}npx sinapse-ai init --help${NC}`);
        process.exit(1);
      }
      process.exit(result.status ?? 0);
    }
    // eslint-disable-next-line no-fallthrough -- process.exit above terminates; Story 10.45 piggyback fix.
    case 'list':     cmdList(); break;
    case 'status':   cmdStatus(); break;
    case 'doctor': {
      // Story 10.21 — wires the modular doctor into the canonical CLI
      const doctorArgs = args.slice(1);
      const doctorOpts = {
        help: doctorArgs.includes('--help') || doctorArgs.includes('-h'),
        fix: doctorArgs.includes('--fix'),
        json: doctorArgs.includes('--json'),
        dryRun: doctorArgs.includes('--dry-run'),
        quiet: doctorArgs.includes('--quiet'),
        deep: doctorArgs.includes('--deep'),
      };
      cmdDoctor(doctorOpts).catch(e => { logger.error(`${RED}Erro no doctor:${NC} ${e.message}`); process.exit(1); });
      break;
    }
    case 'chrome-brain': {
    // Story 10.13 — chrome-brain is the canonical sub-capability for browser
    // automation. Delegating to the shared chrome-brain-installer module keeps
    // `npx sinapse-ai chrome-brain <install|uninstall|status>` working without
    // requiring users to fall back to legacy binaries.
      const chromeBrainArgs = args.slice(1);
      (async () => {
        try {
          const { runChromeBrain } = require('./modules/chrome-brain-installer');
          await runChromeBrain(chromeBrainArgs);
        } catch (e) {
          logger.error(`${RED}Erro no chrome-brain:${NC} ${e.message}`);
          logger.error(`Tente: ${CYAN}npx sinapse-ai chrome-brain status${NC}`);
          process.exit(1);
        }
      })();
      break;
    }
    case 'first-run': {
      // Story 10.46 — friendly hint on bare `npx sinapse-ai` for a fresh machine.
      header();
      const { BOLD, DIM } = require('./lib/constants');
      logger.always(`${BOLD}  Bem-vindo ao SINAPSE AI!${NC}`);
      logger.always(`${DIM}  Detectei que ainda nao ha instalacao nesta maquina.${NC}`);
      logger.always('');
      logger.always('  Pra comecar, rode:');
      logger.always(`    ${CYAN}npx sinapse-ai install${NC}`);
      logger.always('');
      logger.always(`  Outras opcoes:  ${CYAN}npx sinapse-ai help${NC}`);
      logger.always('');
      break;
    }
    case 'help':
    case '--help':
    case '-h':       cmdHelp(); break;
    default: {
      // Story GA-1.3 — fuzzy match suggestion. If the typed command is within
      // 2 edits of a known command, hint at the closest match (e.g. `insta` →
      // `install`). Otherwise fall back to listing the canonical commands so
      // the user can copy one. Never crash on the suggestion path — the goal
      // is to recover, not to lecture.
      logger.error(`${RED}Comando desconhecido:${NC} ${command}`);
      const suggestion = closestMatch(command, KNOWN_COMMANDS, { maxDistance: 2 });
      if (suggestion) {
        logger.error(`Você quis dizer ${CYAN}${suggestion}${NC}?`);
        logger.error(`Tente: ${CYAN}npx sinapse-ai ${suggestion}${NC}`);
      } else {
        logger.error('Comandos disponíveis:');
        for (const cmd of KNOWN_COMMANDS) {
          logger.error(`  ${CYAN}${cmd}${NC}`);
        }
        logger.error(`Detalhes: ${CYAN}npx sinapse-ai help${NC}`);
      }
      process.exit(1);
    }
  }
}
