// bin/commands/install.js — `sinapse-ai install` (global) command + helpers.
// Story GA-1.2 — extracted from bin/cli.js.

const { execSync, execFileSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const { getLogger } = require('../../.sinapse-ai/core/logger');
const {
  ROOT,
  VERSION,
  HOME,
  SINAPSE_HOME,
  CLAUDE_COMMANDS_DIR,
  BIN_DIR,
  IS_WIN,
  CYAN,
  GREEN,
  YELLOW,
  RED,
  BOLD,
  DIM,
  NC,
} = require('../lib/constants');
const { header } = require('../lib/header');
const { getSquads, getAgentFiles } = require('../lib/squads');
const {
  copyDirSync,
  rmDirSync,
  syncDirSync,
  atomicWriteFileSync,
  toForwardSlash,
} = require('../lib/fs-utils');
const {
  detectExistingInstall,
  detectInteractiveMode,
  warnNonInteractive,
} = require('../lib/detection');
const { promptLlmChoice } = require('../lib/prompts');
const {
  recordInstalledAgents,
  reconcileInstalledAgents,
  removeManagedGlobalSkills,
} = require('./uninstall');
const { verifyInstall } = require('./status');
// generateCommandMd is re-exported below for backward-compat (update.js imports it
// from ./install). regenerateAgentCommands is the shared Phase 2 helper.
const {
  generateCommandMd,
  regenerateAgentCommands,
} = require('../lib/command-generator');
const { deliverGlobalProviderAdapters, getGlobalCommandStagingDir } = require('../lib/global-provider-adapters');
// Follow-up #13 — wire the transactional backup/rollback engine into the
// installer so an in-place UPGRADE (upsert) that fails mid-flight is restored
// to its previous state instead of leaving ~/.sinapse half-updated.
const { InstallTransaction } = require('../utils/install-transaction');
const { formatRollbackMessage } = require('../utils/install-errors');

// ── Global Install ───────────────────────────────────────────────────────────

async function cmdInstallGlobal(opts = {}) {
  const logger = getLogger();
  header({ force: true });

  // Story 10.20 — Upsert detection
  const force = Boolean(opts.force);
  const reconfigure = Boolean(opts.reconfigure);
  const globalOnly = Boolean(opts.globalOnly);
  const requestedLlm = opts.llm || null;
  if (requestedLlm && !['claude-code', 'codex', 'both'].includes(requestedLlm)) {
    throw new Error(`Invalid --llm value: ${requestedLlm}. Use claude-code, codex, or both.`);
  }
  const existing = force ? { upsert: false } : detectExistingInstall();
  const isUpsert = existing.upsert;

  if (force && fs.existsSync(path.join(SINAPSE_HOME, 'metadata.json'))) {
    logger.always(`${YELLOW}--force flag detected: running fresh install (overwriting any existing install).${NC}`);
    logger.always('');
  } else if (isUpsert) {
    const prevVer = existing.prevMeta && existing.prevMeta.version ? existing.prevMeta.version : 'unknown';
    logger.always(`${BOLD}  Detected existing install (v${prevVer}). Refreshing in place...${NC}`);
    logger.always(`${DIM}  Use --force to wipe and reinstall fresh. Use --reconfigure to re-prompt language/LLM.${NC}`);
    logger.always('');
  } else {
    logger.always(`${BOLD}  Bem-vindo ao SINAPSE AI!${NC}`);
    logger.always(`${DIM}  Vamos configurar seu copiloto de inteligencia artificial.${NC}`);
    logger.always('');
  }

  // Language selection (skipped in upsert mode if already known, or non-TTY)
  // Story 10.35: --reconfigure forces prompt even in upsert mode
  let language = (isUpsert && !reconfigure && existing.language) ? existing.language : null;
  let languageWasReused = false;
  if (language) {
    // Surface the silent skip so the user understands why the prompt is missing.
    languageWasReused = true;
    const labelMap = { pt: 'Portugues', portuguese: 'Portugues', en: 'English', english: 'English' };
    const label = labelMap[language] || language;
    logger.always(`${DIM}  Language: ${label} (from saved config; pass --reconfigure to change)${NC}`);
  }
  if (!language) {
    // Approved install redesign: Portuguese is the default and is NO longer
    // prompted ("Idioma: Portugues (padrao)"). The resolved language is still
    // saved to settings.language below and shown in the install preview. English
    // stays available for power users via a pre-set settings.language=english.
    language = 'pt';
    if (!detectInteractiveMode()) warnNonInteractive();
  }

  // Save language to ~/.claude/settings.json
  const claudeSettingsDir = path.join(HOME, '.claude');
  const claudeSettingsPath = path.join(claudeSettingsDir, 'settings.json');
  try {
    fs.mkdirSync(claudeSettingsDir, { recursive: true });
    let settings = {};
    let parseFailed = false;
    if (fs.existsSync(claudeSettingsPath)) {
      // Strip a UTF-8 BOM (common when the file was saved by a Windows editor)
      // before parsing. On a GENUINE parse failure, do NOT fall through to
      // overwriting with {} — that would wipe the user's existing hooks,
      // permissions, mcpServers and statusline. Preserve their file instead.
      const raw = fs.readFileSync(claudeSettingsPath, 'utf8').replace(/^\uFEFF/, '');
      try { settings = JSON.parse(raw); } catch { parseFailed = true; }
    }
    if (!parseFailed) {
      settings.language = language === 'pt' ? 'portuguese' : 'english';
      atomicWriteFileSync(claudeSettingsPath, JSON.stringify(settings, null, 2) + '\n');
    }
  } catch { /* non-critical */ }

  // LLM selection (skipped in upsert mode if previous llm known)
  // Story 10.35: --reconfigure forces prompt even in upsert mode
  let llmChoice;
  let llmWasReused = false;
  if (requestedLlm) {
    llmChoice = requestedLlm;
  } else if (isUpsert && !reconfigure && existing.llm) {
    llmChoice = existing.llm;
    llmWasReused = true;
    const ideLabel = Array.isArray(llmChoice) ? llmChoice.join(', ') : String(llmChoice);
    logger.always(`${DIM}  IDE: ${ideLabel} (from saved config; pass --reconfigure to change)${NC}`);
  } else {
    llmChoice = await promptLlmChoice();
  }
  if (languageWasReused || llmWasReused) logger.always('');

  // Validate package + compute what will be installed (squads live in squads/).
  const squadsDir = path.join(ROOT, 'squads');
  const squads = getSquads(fs.existsSync(squadsDir) ? squadsDir : ROOT);
  if (squads.length === 0) {
    logger.error(`${RED}Erro: nenhum diretório de squad encontrado no pacote.${NC}`);
    logger.error(`Tente reinstalar: ${CYAN}npm install -g sinapse-ai${NC}`);
    logger.error('Se persistir, abra um issue: https://github.com/caioimori/sinapse-ai/issues');
    process.exit(1);
  }

  // ── Didactic preview + confirmation gate ─────────────────────────
  // Surface EXACTLY what will be installed before any destructive action, and
  // (interactive mode only) require an explicit choice before writing anything.
  // Non-interactive / --yes / CI skips the gate and proceeds.
  const langLabelMap = { pt: 'Portugues', portuguese: 'Portugues', en: 'English', english: 'English' };
  const llmLabel = Array.isArray(llmChoice) ? llmChoice.join(', ') : String(llmChoice);
  const agentTotal = squads.reduce((a, s) => a + (s.agents || 0), 0);
  let hookCount = 0;
  try {
    hookCount = fs.readdirSync(path.join(ROOT, '.claude', 'hooks')).filter(f => /\.(cjs|js|py|sh)$/.test(f)).length;
  } catch { /* hooks dir optional */ }

  // Framed "o que será instalado" box (B&W). Rows are plain text so the width
  // math stays correct — inline ANSI codes would break padEnd alignment.
  const boxRows = [
    `${squads.length} squads · ${agentTotal} agentes especializados`,
    'Orquestrador master — @sinapse / @snps',
  ];
  if (hookCount) boxRows.push(`${hookCount} hooks de proteção + regras do framework`);
  boxRows.push(`Editor(es): ${llmLabel}`);
  boxRows.push(`Idioma: ${langLabelMap[language] || language}`);
  boxRows.push(`Modo: ${isUpsert ? 'atualizar instalação existente' : 'instalação nova'}`);
  boxRows.push('Destino: ~/.sinapse (núcleo) + ~/.claude/agents (agentes)');
  const boxTitle = ' o que será instalado ';
  const innerW = Math.max(boxTitle.length + 1, ...boxRows.map((r) => r.length + 1)) + 1;
  logger.always('');
  logger.always(`${DIM}  ┌─${boxTitle}${'─'.repeat(innerW - boxTitle.length - 1)}┐${NC}`);
  for (const r of boxRows) logger.always(`${DIM}  │${NC} ${r.padEnd(innerW - 1)}${DIM}│${NC}`);
  logger.always(`${DIM}  └${'─'.repeat(innerW)}┘${NC}`);

  if (detectInteractiveMode()) {
    const inquirer = require('inquirer');
    let proceed = false;
    while (!proceed) {
      const { action } = await inquirer.prompt([{
        type: 'list',
        name: 'action',
        message: 'Pronto para instalar:',
        default: 'install',
        choices: [
          { name: 'Instalar agora', value: 'install' },
          { name: 'Ver em detalhe o que será instalado', value: 'details' },
          { name: 'Cancelar (nada será alterado)', value: 'cancel' },
        ],
      }]);
      if (action === 'cancel') {
        logger.always(`\n${YELLOW}Instalação cancelada. Nada foi alterado.${NC}`);
        return;
      }
      if (action === 'details') {
        logger.always('');
        logger.always(`${BOLD}Squads e agentes:${NC}`);
        for (const s of squads) {
          logger.always(`  • ${s.name.replace(/^squad-/, '')} — ${s.agents} agentes`);
        }
        logger.always('');
        logger.always(`${DIM}Também instala: o orquestrador master, ${hookCount} hooks de proteção, as regras do framework e os comandos /SINAPSE:agents:* .${NC}`);
        logger.always(`${DIM}Onde: o núcleo vai para ~/.sinapse/ e os agentes chamáveis para ~/.claude/agents/. Nada fora disso é tocado.${NC}`);
        continue;
      }
      proceed = true;
    }
  }

  logger.always(`\n${BOLD}Instalando SINAPSE AI globalmente...${NC}\n`);

  // ── Transactional safety net for the FATAL phases (1–6) ─────────────────────
  // On an in-place UPGRADE (upsert) we snapshot the global paths these phases
  // mutate BEFORE touching anything, so a mid-flight failure is rolled back to
  // the previous install instead of leaving ~/.sinapse half-updated. A FRESH
  // install skips the snapshot — a re-run (`install --force`) self-heals, so
  // there's nothing to protect atomically. Phases 7/8/8b stay OUTSIDE the
  // transaction on purpose: they already degrade gracefully (try/catch) and a
  // project-wizard WARN must NOT revert an otherwise-good global install.
  const tx = createInstallTransaction();
  const txPaths = buildTransactionPaths(llmChoice);
  const { activeAgentCount, totalDelta, squadsRefreshed, squadsAdded, meta } =
    await runFatalPhasesTransactional({
      tx,
      isUpsert,
      paths: txPaths,
      runPhases: () => installFatalPhases({ squads, squadsDir, isUpsert, llmChoice, existing, logger }),
      // Re-throw happens inside the wrapper; this only renders the rollback
      // banner. The CLI catch (bin/cli.js) then renders formatErrorMessage.
      onRollback: (banner) => logger.error(banner),
    });

  // Story 10.20 — Upsert summary block
  if (isUpsert) {
    const prevVer = existing.prevMeta && existing.prevMeta.version ? existing.prevMeta.version : 'unknown';
    logger.always('');
    logger.always(`${BOLD}Upsert complete:${NC}`);
    logger.always(`  ${CYAN}Mode:${NC}    upsert (--force to reinstall)`);
    logger.always(`  ${CYAN}Version:${NC} ${prevVer} -> ${VERSION}`);
    logger.always(`  ${CYAN}Squads:${NC}  ${squadsRefreshed} refreshed${squadsAdded ? ', ' + squadsAdded + ' added' : ''}`);
    logger.always(`  ${CYAN}Files:${NC}   ${totalDelta.added} added, ${totalDelta.updated} updated, ${totalDelta.unchanged} unchanged${totalDelta.removed ? ', ' + totalDelta.removed + ' removed' : ''}`);
    logger.always(`  ${CYAN}First installed:${NC} ${meta.installedAt}`);
    logger.always(`  ${CYAN}Last updated:${NC}    ${meta.updatedAt}`);
  }

  // Chrome Brain: Auto-install browser automation
  if (llmChoice === 'claude-code' || llmChoice === 'both') {
    try {
      const { detectChrome, detectPlatform, installScripts, installHooks, installMcp, installKnowledgeBase } = require('../modules/chrome-brain-installer');
      const chromePath = detectChrome();
      if (chromePath) {
        logger.always(`\n${CYAN}Phase 7:${NC} Chrome Brain (browser automation)`);
        const platform = detectPlatform();
        installScripts(chromePath, platform);
        installHooks();
        installMcp(platform);
        installKnowledgeBase();
        logger.always(`  ${GREEN}OK${NC} Chrome Brain installed — all agents can control Chrome`);
      } else {
        logger.always(`\n${YELLOW}SKIP${NC} Chrome Brain — Chrome not found (install Chrome and run: npx sinapse-ai chrome-brain install)`);
      }
    } catch (error) {
      logger.always(`\n${YELLOW}SKIP${NC} Chrome Brain: ${error.message}`);
    }
  }

  // Phase 8: Install project-local files (.sinapse-ai/, .claude/, .env)
  logger.always(`\n${CYAN}Phase 8:${NC} Installing project files in current directory`);
  const skipProjectInstall = globalOnly || path.resolve(process.cwd()) === path.resolve(ROOT);
  if (skipProjectInstall) {
    logger.always(`  ${YELLOW}SKIP${NC} Project files (${globalOnly ? '--global-only' : 'source checkout detected'})`);
  } else try {
    const wizardPath = path.join(ROOT, 'packages', 'installer', 'src', 'wizard', 'index.js');
    if (fs.existsSync(wizardPath)) {
      const { runWizard: executeWizard } = require(wizardPath);
      // Story 10.46 — `quiet: true` is intentional here: language + LLM were
      // already collected by the upstream prompts above (cmdInstallGlobal).
      // The modular wizard's interactive path would re-prompt the same two
      // questions, causing a double-prompt UX. We pass the resolved values so
      // it skips its own ask. If the modular wizard ever grows additional
      // prompts (user profile, project type) that should surface here, this
      // call site needs to switch to a more granular `skipLangLLMPrompts` flag.
      await executeWizard({
        quiet: true,
        language: language,
        selectedLLM: llmChoice,
        // Phase 7 (above) already installed Chrome Brain globally — tell the wizard
        // to skip its own copy so it doesn't run twice (duplicate output + duplicate
        // optional-dep warning). The wizard still runs Chrome Brain when invoked
        // standalone (no skip flag).
        skipChromeBrain: true,
      });
      logger.always(`  ${GREEN}OK${NC} Project files installed (.sinapse-ai/, .claude/)`);
    } else {
      logger.always(`  ${YELLOW}SKIP${NC} Project installer not available`);
    }
  } catch (error) {
    logger.always(`  ${YELLOW}WARN${NC} Project files: ${error.message}`);
    logger.always(`  ${DIM}Run 'npx sinapse-ai install' in your project later to complete setup${NC}`);
  }

  // Phase 8b: Authoritative global-agent reconciliation. The project wizard invoked in
  // Phase 8 re-installs a small subset (the orqx agents) to ~/.claude/agents/ in an older
  // stale format, clobbering the rich stubs written in Phase 2b (incl. the Imperator
  // greeting on @sinapse/@snps/-orqx). Re-copy the generated command files LAST so the
  // rich, frontmatter'd stubs are always the final word. Idempotent.
  try {
    const commandsDir = getGlobalCommandStagingDir({ llmChoice, sinapseHome: SINAPSE_HOME, claudeCommandsDir: CLAUDE_COMMANDS_DIR });
    const reconciled = deliverGlobalProviderAdapters({ llmChoice, home: HOME, commandsDir });
    const total = reconciled.claude.length + reconciled.codex.length + reconciled.skills.length;
    if (total) logger.always(`  ${GREEN}OK${NC} Global provider adapters reconciled (${total} artifacts)`);
  } catch (e) {
    logger.always(`  ${YELLOW}WARN${NC} Global agent reconciliation: ${e.message}`);
  }

  // Verify
  logger.always(`\n${CYAN}Verification:${NC}`);
  verifyInstall();
  // Mirror verifyInstall()'s checks so the closing banner reflects what was just
  // printed above: if any check failed (✗), show a warning banner instead of an
  // unconditional success banner. The exit code is intentionally left unchanged —
  // this only changes the message, not the process result.
  const verificationCommandsDir = getGlobalCommandStagingDir({
    llmChoice,
    sinapseHome: SINAPSE_HOME,
    claudeCommandsDir: CLAUDE_COMMANDS_DIR,
  });
  const installVerified =
    fs.existsSync(SINAPSE_HOME) &&
    fs.existsSync(verificationCommandsDir) &&
    fs.existsSync(path.join(BIN_DIR, 'sinapse')) &&
    fs.existsSync(path.join(SINAPSE_HOME, '.claude', 'rules', 'squad-awareness.md'));

  // Closing banner (success vs. completed-with-warnings)
  let startCmd;
  if (llmChoice === 'codex') startCmd = `Run ${CYAN}codex${NC} to start`;
  else if (llmChoice === 'both') startCmd = `Run ${CYAN}sinapse${NC} or ${CYAN}codex${NC} to start`;
  else startCmd = `Run ${CYAN}sinapse${NC} to start Claude Code with all agents`;

  logger.always('');
  if (installVerified) {
    logger.always(`${GREEN}══════════════════════════════════════════════════════════════${NC}`);
    logger.always(`${GREEN}  SINAPSE AI installed successfully!${NC}`);
    logger.always(`${GREEN}══════════════════════════════════════════════════════════════${NC}`);
  } else {
    logger.always(`${YELLOW}══════════════════════════════════════════════════════════════${NC}`);
    logger.always(`${YELLOW}  Instalação concluída com avisos — rode 'sinapse doctor' para detalhes.${NC}`);
    logger.always(`${YELLOW}══════════════════════════════════════════════════════════════${NC}`);
  }
  logger.always('');
  logger.always(`  ${BOLD}${squads.length} squads${NC} | ${BOLD}${activeAgentCount} agents${NC} | ${BOLD}${activeAgentCount} native adapters${NC}`);
  logger.always(`  ${startCmd}`);
  logger.always('');
  logger.always(`  ${BOLD}Try an agent:${NC}`);
  if (llmChoice === 'codex') {
    logger.always(`    ${CYAN}$snps${NC}`);
    logger.always(`    ${CYAN}$sinapse-agent brand-orqx${NC}`);
  } else {
    logger.always(`    ${CYAN}@sinapse-orqx${NC}`);
    logger.always(`    ${CYAN}@brand-orqx${NC}`);
  }
  logger.always('');
}

// ── Transactional install helpers (follow-up #13) ────────────────────────────

/**
 * Build the InstallTransaction used to make an in-place upgrade atomic.
 *
 * Two deliberate overrides vs. the class defaults (which target process.cwd()):
 *  - logFile → ~/.sinapse/.sinapse-install.log (this is a GLOBAL install; the
 *    cwd is wherever the user happened to run `npx sinapse-ai install`).
 *  - backupDir → ~/.sinapse-backup/<timestamp>, which MUST live OUTSIDE every
 *    directory we snapshot. Putting it inside ~/.sinapse (or ~/.claude/...)
 *    would make the recursive backup copy the snapshot into itself.
 *
 * @returns {InstallTransaction}
 */
function createInstallTransaction() {
  // Same Windows-safe timestamp shape the class uses for its default backup dir.
  const timestamp = new Date().toISOString()
    .replace(/:/g, '-')
    .replace(/\./g, '-')
    .replace('T', '_');
  return new InstallTransaction({
    logFile: path.join(SINAPSE_HOME, '.sinapse-install.log'),
    backupDir: path.join(HOME, '.sinapse-backup', timestamp),
  });
}

/**
 * Enumerate the GLOBAL paths the fatal phases (1–6) mutate, so an upgrade can
 * snapshot them up-front. Only the dirs/files relevant to the selected IDE are
 * listed; backupGlobalState() further skips any that don't exist yet.
 *
 * @param {string} llmChoice - 'claude-code' | 'codex' | 'both'
 * @returns {{ dirs: string[], files: string[] }}
 */
function buildTransactionPaths(llmChoice) {
  const dirs = [
    SINAPSE_HOME,          // Phases 1, 3, 6 (+ installed-agents.json manifest)
    CLAUDE_COMMANDS_DIR,   // Phase 2 — generated /SINAPSE:agents:* command files
  ];
  if (llmChoice === 'claude-code' || llmChoice === 'both') dirs.push(path.join(HOME, '.claude', 'agents'));
  // A Claude-only provider switch removes stale Codex aliases during the fatal
  // phases, so that cleanup must be covered by the same upgrade rollback.
  if (llmChoice === 'claude-code') dirs.push(path.join(HOME, '.agents', 'skills'));
  if (llmChoice === 'codex' || llmChoice === 'both') {
    dirs.push(path.join(HOME, '.codex', 'agents'));
    dirs.push(path.join(HOME, '.agents', 'skills'));
  }
  dirs.push(BIN_DIR);      // Phase 4 — launcher(s)

  const files = [path.join(HOME, '.claude', 'settings.json')]; // language save
  // Phase 5 appends the PATH export to a shell rc on POSIX. On Windows it writes
  // the registry (HKCU\Environment) instead — that is NOT a file, so it cannot
  // be captured/rolled back here (documented limitation).
  if (!IS_WIN) {
    for (const rc of ['.zshrc', '.bashrc', '.profile']) files.push(path.join(HOME, rc));
  }
  return { dirs, files };
}

/**
 * Snapshot every existing global path before an upgrade mutates it.
 *
 * @param {InstallTransaction} tx
 * @param {{ dirs?: string[], files?: string[] }} paths
 */
async function backupGlobalState(tx, paths = {}) {
  for (const dir of paths.dirs || []) {
    if (dir && fs.existsSync(dir)) await tx.backupDirectory(dir);
  }
  for (const file of paths.files || []) {
    if (file && fs.existsSync(file)) await tx.backup(file);
  }
}

/**
 * Run the fatal install phases (1–6) under a transaction.
 *
 * UPGRADE (upsert=true): snapshot the global state, run the phases, and on
 * success commit (drop the snapshot). On ANY failure, restore the snapshot,
 * surface the rollback banner via `onRollback`, then RE-THROW so the CLI's
 * existing catch still renders formatErrorMessage.
 *
 * FRESH (upsert=false): run the phases unwrapped — a fresh install is
 * self-healing via `install --force`, so there is nothing to protect atomically
 * and behavior stays byte-for-byte identical to before this safety net.
 *
 * @returns {Promise<*>} whatever `runPhases` returns (the phase result object)
 */
async function runFatalPhasesTransactional({ tx, isUpsert, paths, runPhases, onRollback }) {
  if (!isUpsert) {
    return runPhases();
  }
  await backupGlobalState(tx, paths);
  let result;
  try {
    result = await runPhases();
  } catch (err) {
    const ok = await tx.rollback();
    if (typeof onRollback === 'function') onRollback(formatRollbackMessage(ok));
    throw err; // re-throw → bin/cli.js catch renders formatErrorMessage
  }
  await tx.commit();
  return result;
}

/**
 * The FATAL install phases (1–6): copy squads, generate + place agent commands,
 * write squad-awareness rules, create the launcher, configure PATH, and write
 * metadata.json. Extracted verbatim from cmdInstallGlobal so it can run inside
 * runFatalPhasesTransactional(). Returns the values the caller needs for the
 * upsert summary + closing banner.
 *
 * @param {Object} ctx
 * @param {Array}  ctx.squads
 * @param {string} ctx.squadsDir
 * @param {boolean} ctx.isUpsert
 * @param {string} ctx.llmChoice
 * @param {Object} ctx.existing  - detectExistingInstall() result
 * @param {Object} ctx.logger
 * @returns {{ writtenAgents: Set, activeAgentCount: number, totalDelta: Object, squadsRefreshed: number, squadsAdded: number, meta: Object }}
 */
function installFatalPhases({ squads, squadsDir, isUpsert, llmChoice, existing, logger }) {
  // Phase 1: Copy squads to ~/.sinapse/
  logger.always(`${CYAN}Phase 1:${NC} ${isUpsert ? 'Refreshing' : 'Copying'} squads to ~/.sinapse/`);
  fs.mkdirSync(SINAPSE_HOME, { recursive: true });

  const squadsSrcBase = fs.existsSync(squadsDir) ? squadsDir : ROOT;
  const totalDelta = { added: 0, updated: 0, unchanged: 0, removed: 0 };
  let squadsRefreshed = 0;
  let squadsAdded = 0;
  for (const squad of squads) {
    const src = path.join(squadsSrcBase, squad.name);
    const dest = path.join(SINAPSE_HOME, squad.name);
    if (isUpsert) {
      const existedBefore = fs.existsSync(dest);
      const delta = syncDirSync(src, dest);
      totalDelta.added += delta.added;
      totalDelta.updated += delta.updated;
      totalDelta.unchanged += delta.unchanged;
      totalDelta.removed += delta.removed;
      if (existedBefore) squadsRefreshed += 1; else squadsAdded += 1;
      logger.always(`  ${GREEN}OK${NC} ${squad.name} (${delta.added} added, ${delta.updated} updated, ${delta.unchanged} unchanged${delta.removed ? ', ' + delta.removed + ' removed' : ''})`);
    } else {
      rmDirSync(dest);
      copyDirSync(src, dest);
      logger.always(`  ${GREEN}OK${NC} ${squad.name} (${squad.agents} agents)`);
    }
  }

  // Copy sinapse/ orqx squad
  const sinapseMasterSrc = path.join(ROOT, 'sinapse');
  const sinapseMasterDest = path.join(SINAPSE_HOME, 'sinapse');
  if (fs.existsSync(sinapseMasterSrc)) {
    if (isUpsert) {
      const delta = syncDirSync(sinapseMasterSrc, sinapseMasterDest);
      totalDelta.added += delta.added;
      totalDelta.updated += delta.updated;
      totalDelta.unchanged += delta.unchanged;
      totalDelta.removed += delta.removed;
    } else {
      rmDirSync(sinapseMasterDest);
      copyDirSync(sinapseMasterSrc, sinapseMasterDest);
    }
    const masterAgents = getAgentFiles(sinapseMasterDest).length;
    logger.always(`  ${GREEN}OK${NC} sinapse (master, ${masterAgents} agents)`);
  }

  const coreDevelopmentSrc = path.join(ROOT, '.sinapse-ai', 'development');
  const coreDevelopmentDest = path.join(SINAPSE_HOME, 'core');
  if (fs.existsSync(coreDevelopmentSrc)) {
    if (isUpsert) {
      const delta = syncDirSync(coreDevelopmentSrc, coreDevelopmentDest);
      totalDelta.added += delta.added;
      totalDelta.updated += delta.updated;
      totalDelta.unchanged += delta.unchanged;
      totalDelta.removed += delta.removed;
    } else {
      rmDirSync(coreDevelopmentDest);
      copyDirSync(coreDevelopmentSrc, coreDevelopmentDest);
    }
    const coreAgents = getAgentFiles(coreDevelopmentDest).length;
    logger.always(`  ${GREEN}OK${NC} core development (${coreAgents} agents)`);
  }

  // Phase 2: Generate agent commands (shared with `update` via command-generator).
  logger.always(`\n${CYAN}Phase 2:${NC} Generating agent commands`);
  const commandStagingDir = getGlobalCommandStagingDir({ llmChoice, sinapseHome: SINAPSE_HOME, claudeCommandsDir: CLAUDE_COMMANDS_DIR });
  const { writtenAgents } = regenerateAgentCommands({
    sinapseHome: SINAPSE_HOME,
    commandsDir: commandStagingDir,
    squads,
    sinapseMasterDest,
    coreDevelopmentDest,
  });
  logger.always(`  ${GREEN}OK${NC} ${writtenAgents.size} total command files`);

  // Phase 2b: Install global agents based on LLM choice
  const globalAdapters = deliverGlobalProviderAdapters({ llmChoice, home: HOME, commandsDir: commandStagingDir });
  const activeAgentCount = Math.max(globalAdapters.claude.length, globalAdapters.codex.length);
  const installedAgentFilenames = new Set([...globalAdapters.claude, ...globalAdapters.codex]);
  const installedIdes = [];
  if (globalAdapters.claude.length) installedIdes.push('claude-code');
  if (globalAdapters.codex.length) installedIdes.push('codex');
  if (globalAdapters.claude.length) logger.always(`  ${GREEN}OK${NC} Claude Code global agents (${globalAdapters.claude.length})`);
  if (globalAdapters.codex.length) logger.always(`  ${GREEN}OK${NC} Codex global agents (${globalAdapters.codex.length} TOML, ${globalAdapters.skills.length} skills)`);

  // Audit 1 P0 (UN-1) — record manifest so uninstall can remove every file
  // we wrote (not just `*-orqx.md`). Idempotent: re-install overwrites.
  reconcileInstalledAgents(HOME, installedAgentFilenames);
  if (llmChoice === 'claude-code') removeManagedGlobalSkills(HOME, { providers: ['codex'] });
  recordInstalledAgents(installedAgentFilenames, installedIdes);

  // Phase 3: Generate squad-awareness.md
  logger.always(`\n${CYAN}Phase 3:${NC} Generating squad-awareness rules`);
  generateSquadAwareness(SINAPSE_HOME, squads);
  logger.always(`  ${GREEN}OK${NC} squad-awareness.md`);

  // Phase 4: Create launcher
  logger.always(`\n${CYAN}Phase 4:${NC} Creating launcher`);
  createLauncher();

  // Phase 5: PATH management
  logger.always(`\n${CYAN}Phase 5:${NC} Configuring PATH`);
  ensurePath();

  // Phase 6: Write metadata (Story 10.20 — preserve installedAt on upsert)
  const nowIso = new Date().toISOString();
  const meta = {
    version: VERSION,
    installedAt: isUpsert && existing.prevMeta && existing.prevMeta.installedAt
      ? existing.prevMeta.installedAt
      : nowIso,
    squads: squads.length,
    agents: activeAgentCount,
    commands: activeAgentCount,
    llm: llmChoice,
    platform: process.platform,
  };
  if (isUpsert) {
    meta.updatedAt = nowIso;
  }
  atomicWriteFileSync(path.join(SINAPSE_HOME, 'metadata.json'), JSON.stringify(meta, null, 2));

  return { writtenAgents, activeAgentCount, totalDelta, squadsRefreshed, squadsAdded, meta };
}

function generateSquadAwareness(sinapseDir, squads) {
  const rulesDir = path.join(sinapseDir, '.claude', 'rules');
  fs.mkdirSync(rulesDir, { recursive: true });

  let table = '';
  for (const s of squads) {
    table += `| \`${s.name}\` | ${s.agents} agents, ${s.tasks} tasks, ${s.kbs} KBs, ${s.workflows} workflows |\n`;
  }

  const content = `---
paths: **/*
---

# Sinapse — Orchestration Rules

> **CRITICAL:** This project has specialized AI agent squads installed. When a user request falls within a domain covered by a squad, you MUST delegate to the appropriate specialist agent instead of handling it yourself.

## Delegation Rule

When a user request matches a squad domain:
1. **Acknowledge** the domain is covered by a specialized squad
2. **Recommend** activating the appropriate agent: \`/SINAPSE:agents:{agent-id}\`
3. **Do NOT** handle the request yourself if a dedicated agent exists

## Squads Installed

| Squad | Capacity |
|-------|----------|
${table}
## How to Invoke Any Agent

All agents use a single prefix: \`/SINAPSE:agents:{agent-id}\`

Examples:
- \`/SINAPSE:agents:sinapse-orqx\` — Master orchestrator
- \`/SINAPSE:agents:brand-orqx\` — Brand strategy
- \`/SINAPSE:agents:dev\` — Development
- \`/SINAPSE:agents:research-orqx\` — Research & analysis

## Handoff Protocol

1. **Identify** the domain of the request
2. **Inform** which squad covers it and how to invoke: \`/SINAPSE:agents:{agent-id}\`
3. **Provide context** for the handoff if necessary
4. Squads are **autonomous** — the orchestrator coordinates internally
`;

  fs.writeFileSync(path.join(rulesDir, 'squad-awareness.md'), content);

  // Also create a minimal CLAUDE.md for --add-dir discovery
  const claudeDir = path.join(sinapseDir, '.claude');
  fs.mkdirSync(claudeDir, { recursive: true });
  fs.writeFileSync(path.join(claudeDir, 'CLAUDE.md'), `# Sinapse — AI Agent Squads

This directory contains Sinapse agent squads for Claude Code.
When a request matches a squad domain, delegate using \`/SINAPSE:agents:{agent-id}\`.
See \`.claude/rules/squad-awareness.md\` for the full delegation map.
`);

  // Create sinapse-orqx agent for --agent flag
  const agentsDir = path.join(claudeDir, 'agents');
  fs.mkdirSync(agentsDir, { recursive: true });

  const routingTable = squads.map(s => {
    // Find actual orqx agent name from squad's agents dir
    const sAgentsDir = path.join(SINAPSE_HOME, s.name, 'agents');
    let orqxName = `${s.name.replace('squad-', '')}-orqx`;
    try {
      const orqxFile = fs.readdirSync(sAgentsDir).find(f => f.endsWith('-orqx.md'));
      if (orqxFile) orqxName = orqxFile.replace('.md', '');
    } catch { /* fall back to the derived orqx name */ }
    return `| ${s.name} | @${orqxName} | ${s.agents} agents, ${s.tasks} tasks |`;
  }).join('\n');

  fs.writeFileSync(path.join(agentsDir, 'sinapse-orqx.md'), `---
name: sinapse-orqx
description: "Imperator — Supreme Orchestrator of SINAPSE. ${squads.length} squads, ${squads.reduce((a, s) => a + s.agents, 0)} agents."
---

You are Imperator, the Sinapse Master — supreme orchestrator of the SINAPSE ecosystem.

## ON ACTIVATION — Display this greeting FIRST

Display this EXACTLY as your first output:

\`\`\`
 ███████╗██╗███╗   ██╗ █████╗ ██████╗ ███████╗███████╗
 ██╔════╝██║████╗  ██║██╔══██╗██╔══██╗██╔════╝██╔════╝
 ███████╗██║██╔██╗ ██║███████║██████╔╝███████╗█████╗
 ╚════██║██║██║╚██╗██║██╔══██║██╔═══╝ ╚════██║██╔══╝
 ███████║██║██║ ╚████║██║  ██║██║     ███████║███████╗
 ╚══════╝╚═╝╚═╝  ╚═══╝╚═╝  ╚═╝╚═╝     ╚══════╝╚══════╝
\`\`\`

Then show:

\`\`\`
AI Agent Squads for Claude Code
v1.0 · ${squads.length} squads · ${squads.reduce((a, s) => a + s.agents, 0)} agents

👑 Imperator — Sinapse Master ativado
\`\`\`

After the greeting, check if the user provided briefing/context with the activation. If YES → proceed IMMEDIATELY: Initial State Audit → Bootstrap Classification → ORCHESTRATION PLAN (phases + squads + agents + handoffs) → execute (YOLO). NEVER ask "do you want me to plan?" — the answer is always YES for Imperator. If NO (bare activation) → await briefing, then plan automatically on receipt.

## INTELLIGENT ROUTING

- **Simple request** → route DIRECTLY to @specialist
- **Complex request** → route to @{domain}-orqx
- **Cross-domain** → coordinate multiple orqx agents
- **Dev/code** → use @developer, @quality-gate, @architect
- NEVER execute domain work yourself — ALWAYS delegate

## SQUADS

| Squad | Orchestrator | Capacity |
|-------|-------------|----------|
${routingTable}

## COMMANDS

- \`*route {request}\` — Diagnose and route
- \`*plan {initiative}\` — Multi-squad execution plan
- \`*status\` — Report on all squads
- \`*help\` — Show all commands

Signature: "— Imperator, orchestrating SINAPSE"
`);
}

function createLauncher() {
  const logger = getLogger();
  fs.mkdirSync(BIN_DIR, { recursive: true });
  const sinapsePathForBash = IS_WIN
    ? toForwardSlash(SINAPSE_HOME).replace(/^([A-Za-z]):/, (_, l) => '/' + l.toLowerCase())
    : SINAPSE_HOME;

  // Bash launcher (macOS/Linux/Git Bash)
  const bashLauncher = `#!/bin/bash
# Sinapse — Claude Code launcher (auto-generated)
exec claude --add-dir "${sinapsePathForBash}" --agent sinapse-orqx "$@"
`;
  const bashPath = path.join(BIN_DIR, 'sinapse');
  atomicWriteFileSync(bashPath, bashLauncher);
  try { fs.chmodSync(bashPath, 0o755); } catch { /* chmod is best-effort (no-op on non-POSIX) */ }
  logger.always(`  ${GREEN}OK${NC} ~/bin/sinapse`);

  // Windows CMD launcher
  if (IS_WIN) {
    const cmdLauncher = '@echo off\r\nclaude --add-dir "%USERPROFILE%\\.sinapse" --agent sinapse-orqx %*\r\n';
    atomicWriteFileSync(path.join(BIN_DIR, 'sinapse.cmd'), cmdLauncher);
    logger.always(`  ${GREEN}OK${NC} ~/bin/sinapse.cmd`);
  }
}

function ensurePath() {
  const logger = getLogger();
  const pathDirs = process.env.PATH ? process.env.PATH.split(path.delimiter) : [];
  const binNorm = path.normalize(BIN_DIR);
  const alreadyInPath = pathDirs.some(p => path.normalize(p) === binNorm);

  if (alreadyInPath) {
    logger.always(`  ${YELLOW}SKIP${NC} ~/bin already in PATH`);
    return;
  }

  if (IS_WIN) {
    ensurePathWindows();
  } else {
    ensurePathUnix();
  }

  logger.always(`  ${YELLOW}NOTE${NC} Restart your terminal for PATH changes`);
}

function ensurePathUnix() {
  const logger = getLogger();
  const marker = '# Added by Sinapse';
  const exportLine = 'export PATH="$HOME/bin:$PATH"';
  const rcFiles = ['.zshrc', '.bashrc', '.profile'];

  for (const rc of rcFiles) {
    const rcPath = path.join(HOME, rc);
    if (!fs.existsSync(rcPath)) continue;
    const content = fs.readFileSync(rcPath, 'utf8');
    if (content.includes(marker) || content.includes(exportLine)) continue;
    fs.appendFileSync(rcPath, `\n${marker}\n${exportLine}\n`);
    logger.always(`  ${GREEN}OK${NC} Updated ~/${rc}`);
    return;
  }

  // If no RC file found, create .profile
  fs.writeFileSync(path.join(HOME, '.profile'), `${marker}\n${exportLine}\n`, { flag: 'a' });
  logger.always(`  ${GREEN}OK${NC} Created ~/.profile`);
}

function ensurePathWindows() {
  const logger = getLogger();
  try {
    const result = execSync('reg query "HKCU\\Environment" /v Path', { encoding: 'utf8' });
    const match = result.match(/Path\s+REG_(?:EXPAND_)?SZ\s+(.+)/);
    const currentPath = match ? match[1].trim() : '';

    if (currentPath.includes('%USERPROFILE%\\bin') || currentPath.includes(BIN_DIR.replace(/\//g, '\\'))) {
      logger.always(`  ${YELLOW}SKIP${NC} ~/bin already in Windows PATH`);
      return;
    }

    const newPath = currentPath ? `${currentPath};%USERPROFILE%\\bin` : '%USERPROFILE%\\bin';
    if (newPath.length > 900) {
      logger.always(`  ${YELLOW}WARN${NC} PATH too long for setx. Add manually: ${BIN_DIR}`);
      return;
    }

    // execFileSync (no shell) — never interpolate the current PATH into a
    // shell command string. A PATH value containing `"`/`&`/`^` would break
    // the command or allow injection; passing args as an array avoids it.
    execFileSync('setx', ['PATH', newPath], { encoding: 'utf8', stdio: 'pipe' });
    logger.always(`  ${GREEN}OK${NC} Added ~/bin to Windows User PATH`);
  } catch {
    try {
      execFileSync('setx', ['PATH', '%USERPROFILE%\\bin'], { encoding: 'utf8', stdio: 'pipe' });
      logger.always(`  ${GREEN}OK${NC} Created Windows User PATH with ~/bin`);
    } catch {
      logger.always(`  ${YELLOW}WARN${NC} Could not modify PATH. Add manually: ${BIN_DIR}`);
    }
  }
}

module.exports = {
  cmdInstallGlobal,
  generateCommandMd,
  generateSquadAwareness,
  createLauncher,
  ensurePath,
  ensurePathUnix,
  ensurePathWindows,
  // Follow-up #13 — transactional upgrade helpers (exported for tests)
  createInstallTransaction,
  buildTransactionPaths,
  backupGlobalState,
  runFatalPhasesTransactional,
  installFatalPhases,
};
