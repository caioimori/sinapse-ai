// bin/commands/update.js — `sinapse-ai update` (global) command.
// Story GA-1.2 — extracted from bin/cli.js.

const fs = require('fs');
const path = require('path');
const { getLogger } = require('../../.sinapse-ai/core/logger');
const {
  ROOT,
  VERSION,
  HOME,
  SINAPSE_HOME,
  CLAUDE_COMMANDS_DIR,
  CYAN,
  GREEN,
  YELLOW,
  BOLD,
  DIM,
  NC,
} = require('../lib/constants');
const { header } = require('../lib/header');
const { getSquads } = require('../lib/squads');
const {
  rmDirSync,
  syncDirSync,
} = require('../lib/fs-utils');
const {
  detectExistingInstall,
  detectStaleness,
} = require('../lib/detection');
const { promptLlmChoice } = require('../lib/prompts');
const { generateSquadAwareness } = require('./install');
const {
  recordInstalledAgents,
  reconcileInstalledAgents,
  removeManagedGlobalSkills,
} = require('./uninstall');
const { regenerateAgentCommands } = require('../lib/command-generator');
const { deliverGlobalProviderAdapters, getGlobalCommandStagingDir } = require('../lib/global-provider-adapters');
const { assertProviderAdapterParity } = require('../lib/provider-parity');
const { execSync } = require('child_process');

// Query the latest version published to npm. Returns null when npm is unreachable.
function fetchLatestVersion() {
  try {
    const out = execSync('npm view sinapse-ai version', {
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore'],
      timeout: 15000,
    });
    return (out || '').trim() || null;
  } catch {
    return null;
  }
}

function isNewerVersion(candidate, current) {
  try {
    return require('semver').gt(candidate, current);
  } catch {
    return candidate !== current;
  }
}

async function cmdUpdateGlobal() {
  const logger = getLogger();
  header();

  if (!fs.existsSync(path.join(SINAPSE_HOME, 'metadata.json'))) {
    logger.always(`${YELLOW}Sinapse not installed globally. Run: npx sinapse-ai install${NC}\n`);
    process.exit(1);
  }

  // Story 10.22 — reuse settings from existing install
  const existing = detectExistingInstall();
  const prevVer = existing.prevMeta && existing.prevMeta.version ? existing.prevMeta.version : 'unknown';

  // Real update (like `claude update`): fetch the latest published version and, if
  // it is newer than what is running, download + apply it, then hand off to the
  // freshly installed binary to re-sync. `--local` / `--no-fetch` skip this (used by
  // the handoff to avoid a loop, and for offline re-sync of the running version).
  const skipFetch = process.argv.includes('--local') || process.argv.includes('--no-fetch');
  if (!skipFetch) {
    const latest = fetchLatestVersion();
    if (latest && isNewerVersion(latest, VERSION)) {
      logger.always(`${BOLD}  Nova versão disponível: v${latest}${NC} ${DIM}(você está na v${VERSION})${NC}`);
      logger.always(`${DIM}  Baixando e aplicando a versão nova...${NC}\n`);
      try {
        execSync('npm install -g sinapse-ai@latest', { stdio: 'inherit' });
        // Hand off to the new version to apply it. No loop: once installed, the new
        // run sees latest === running and falls through to the local re-sync.
        execSync('sinapse-ai update --local', { stdio: 'inherit' });
        logger.always(`\n${GREEN}Atualizado para v${latest}.${NC}`);
        return;
      } catch (e) {
        const reason = (e && e.message ? e.message.split('\n')[0] : 'erro desconhecido');
        logger.always(`\n${YELLOW}Não consegui atualizar automaticamente (${reason}).${NC}`);
        logger.always(`${DIM}  Rode manualmente: ${CYAN}! npm install -g sinapse-ai@latest${NC} e depois ${CYAN}sinapse update${NC}.${NC}`);
        logger.always(`${DIM}  Seguindo com a versão atual por enquanto...${NC}\n`);
        // fall through to local re-sync below
      }
    } else if (latest) {
      logger.always(`${GREEN}  Você já está na versão mais recente (v${VERSION}).${NC}\n`);
    }
  }

  // Welcome back screen
  logger.always(`${BOLD}  Que bom que voce voltou!${NC}`);
  logger.always(`${DIM}  Atualizando SINAPSE AI: v${prevVer} -> v${VERSION}${NC}`);
  logger.always('');

  // Story 10.40 — Staleness warning (installed vs executing version)
  const staleness = detectStaleness(prevVer, VERSION);
  if (staleness.kind === 'stale') {
    logger.always(`${YELLOW}WARN:${NC} Versao instalada (${prevVer}) mais antiga que a executada (${VERSION}). Atualizando agora...`);
    logger.always('');
  } else if (staleness.kind === 'ahead') {
    logger.always(`${YELLOW}WARN:${NC} Versao instalada (${prevVer}) mais nova que a executada (${VERSION}). Seu cache npx pode estar velho — rode: ${CYAN}npx clear-npx-cache${NC} ou use ${CYAN}@latest${NC}.`);
    logger.always('');
  }

  // Story 10.22 — skip LLM prompt when previous llm known. To re-prompt,
  // run `npx sinapse-ai install --force`.
  const llmChoice = existing.llm || await promptLlmChoice();

  logger.always('');
  logger.always(`${BOLD}Atualizando SINAPSE AI...${NC}\n`);

  const squadsDir = path.join(ROOT, 'squads');
  const squadsSrcBase = fs.existsSync(squadsDir) ? squadsDir : ROOT;
  const squads = getSquads(squadsSrcBase);

  // Phase 1: Sync squads (Story 10.22 — replaces rmDir+copy with syncDirSync)
  logger.always(`${CYAN}Phase 1:${NC} Refreshing squads`);
  const totalDelta = { added: 0, updated: 0, unchanged: 0, removed: 0 };
  for (const squad of squads) {
    const src = path.join(squadsSrcBase, squad.name);
    const dest = path.join(SINAPSE_HOME, squad.name);
    const delta = syncDirSync(src, dest);
    totalDelta.added += delta.added;
    totalDelta.updated += delta.updated;
    totalDelta.unchanged += delta.unchanged;
    totalDelta.removed += delta.removed;
    logger.always(`  ${GREEN}OK${NC} ${squad.name} (${delta.added} added, ${delta.updated} updated, ${delta.unchanged} unchanged${delta.removed ? ', ' + delta.removed + ' removed' : ''})`);
  }

  const sinapseMasterSrc = path.join(ROOT, 'sinapse');
  if (fs.existsSync(sinapseMasterSrc)) {
    const delta = syncDirSync(sinapseMasterSrc, path.join(SINAPSE_HOME, 'sinapse'));
    totalDelta.added += delta.added;
    totalDelta.updated += delta.updated;
    totalDelta.unchanged += delta.unchanged;
    totalDelta.removed += delta.removed;
    logger.always(`  ${GREEN}OK${NC} sinapse (orqx)`);
  }

  const coreDevelopmentSrc = path.join(ROOT, '.sinapse-ai', 'development');
  const coreDevelopmentDest = path.join(SINAPSE_HOME, 'core');
  if (fs.existsSync(coreDevelopmentSrc)) {
    const delta = syncDirSync(coreDevelopmentSrc, coreDevelopmentDest);
    totalDelta.added += delta.added;
    totalDelta.updated += delta.updated;
    totalDelta.unchanged += delta.unchanged;
    totalDelta.removed += delta.removed;
    logger.always(`  ${GREEN}OK${NC} core development`);
  }

  // Phase 2: Regenerate commands — shared with `install` so `update` produces the
  // SAME complete set (every specialist command + the rich master Imperator stubs),
  // not just the `-orqx` subset it used to write.
  logger.always(`\n${CYAN}Phase 2:${NC} Regenerating commands`);
  const commandStagingDir = getGlobalCommandStagingDir({ llmChoice, sinapseHome: SINAPSE_HOME, claudeCommandsDir: CLAUDE_COMMANDS_DIR });
  rmDirSync(commandStagingDir);
  const { writtenAgents, canonicalAgents, totalAgents } = regenerateAgentCommands({
    sinapseHome: SINAPSE_HOME,
    commandsDir: commandStagingDir,
    squads,
    sinapseMasterDest: path.join(SINAPSE_HOME, 'sinapse'),
    coreDevelopmentDest,
  });
  logger.always(`  ${GREEN}OK${NC} ${writtenAgents.size} command files (${totalAgents} agents total)`);

  // Phase 2b: Install global agents based on LLM choice
  const globalAdapters = deliverGlobalProviderAdapters({ llmChoice, home: HOME, commandsDir: commandStagingDir });
  const activeAgentCount = assertProviderAdapterParity(
    llmChoice,
    globalAdapters,
    canonicalAgents,
  );
  if (globalAdapters.claude.length) logger.always(`  ${GREEN}OK${NC} Claude Code global agents (${globalAdapters.claude.length})`);
  if (globalAdapters.codex.length) logger.always(`  ${GREEN}OK${NC} Codex global agents (${globalAdapters.codex.length} TOML, ${globalAdapters.skills.length} skills)`);

  const installedAgentFilenames = new Set([...globalAdapters.claude, ...globalAdapters.codex]);
  reconcileInstalledAgents(HOME, installedAgentFilenames);
  if (llmChoice === 'claude-code') removeManagedGlobalSkills(HOME, { providers: ['codex'] });
  if (llmChoice === 'codex') removeManagedGlobalSkills(HOME, { providers: ['claude-code'] });
  const installedIdes = [];
  if (globalAdapters.claude.length) installedIdes.push('claude-code');
  if (globalAdapters.codex.length) installedIdes.push('codex');
  recordInstalledAgents(installedAgentFilenames, installedIdes);

  // Phase 3: Regenerate awareness
  logger.always(`\n${CYAN}Phase 3:${NC} Updating squad-awareness`);
  generateSquadAwareness(SINAPSE_HOME, squads);
  logger.always(`  ${GREEN}OK${NC} squad-awareness.md`);

  // Update metadata (Story 10.22 — preserve installedAt, bump version + updatedAt)
  const metaPath = path.join(SINAPSE_HOME, 'metadata.json');
  const meta = JSON.parse(fs.readFileSync(metaPath, 'utf8'));
  // installedAt preserved by NOT touching it
  meta.updatedAt = new Date().toISOString();
  meta.version = VERSION;
  meta.squads = squads.length;
  meta.agents = activeAgentCount;
  meta.commands = activeAgentCount;
  meta.llm = llmChoice;
  fs.writeFileSync(metaPath, JSON.stringify(meta, null, 2));

  // Story 10.22 — Update summary block (mirrors Story 10.20 install upsert)
  logger.always('');
  logger.always(`${BOLD}Update complete:${NC}`);
  logger.always(`  ${CYAN}Version:${NC} ${prevVer} -> ${VERSION}`);
  logger.always(`  ${CYAN}Squads:${NC}  ${squads.length} refreshed`);
  logger.always(`  ${CYAN}Files:${NC}   ${totalDelta.added} added, ${totalDelta.updated} updated, ${totalDelta.unchanged} unchanged${totalDelta.removed ? ', ' + totalDelta.removed + ' removed' : ''}`);
  logger.always(`  ${CYAN}First installed:${NC} ${meta.installedAt}`);
  logger.always(`  ${CYAN}Last updated:${NC}    ${meta.updatedAt}`);

  // Phase 4: Update project-local files (.sinapse-ai/, .claude/)
  logger.always(`\n${CYAN}Phase 4:${NC} Updating project files in current directory`);
  try {
    const wizardPath = path.join(ROOT, 'packages', 'installer', 'src', 'wizard', 'index.js');
    if (fs.existsSync(wizardPath)) {
      const { runWizard: executeWizard } = require(wizardPath);
      await executeWizard({
        quiet: true,
        language: meta.language || 'pt',
        selectedLLM: llmChoice,
      });
      logger.always(`  ${GREEN}OK${NC} Project files updated (.sinapse-ai/, .claude/)`);
    } else {
      logger.always(`  ${YELLOW}SKIP${NC} Project installer not available`);
    }
  } catch (error) {
    logger.always(`  ${YELLOW}WARN${NC} Project files: ${error.message}`);
    logger.always(`  ${DIM}Run 'npx sinapse-ai install' in your project later to complete update${NC}`);
  }

  let startCmd;
  if (llmChoice === 'codex') startCmd = `Digite ${CYAN}codex${NC} para comecar`;
  else if (llmChoice === 'both') startCmd = `Digite ${CYAN}sinapse${NC} ou ${CYAN}codex${NC} para comecar`;
  else startCmd = `Digite ${CYAN}sinapse${NC} para comecar`;

  logger.always('');
  logger.always(`${GREEN}══════════════════════════════════════════════════════════════${NC}`);
  logger.always(`${GREEN}  SINAPSE AI atualizado para v${VERSION}!${NC}`);
  logger.always(`${GREEN}══════════════════════════════════════════════════════════════${NC}`);
  logger.always('');
  logger.always(`  ${BOLD}${squads.length} squads${NC} | ${BOLD}${activeAgentCount} agents${NC} | ${BOLD}${activeAgentCount} native adapters${NC}`);
  logger.always(`  ${startCmd}`);
  logger.always('');
}

module.exports = { cmdUpdateGlobal, assertProviderAdapterParity };
