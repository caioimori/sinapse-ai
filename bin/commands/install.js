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
const { getSquads, getAgentFiles, extractAgentMeta } = require('../lib/squads');
const {
  copyDirSync,
  rmDirSync,
  syncDirSync,
  toForwardSlash,
} = require('../lib/fs-utils');
const {
  detectExistingInstall,
  detectInteractiveMode,
  warnNonInteractive,
} = require('../lib/detection');
const {
  promptLlmChoice,
  promptGroundingSections,
} = require('../lib/prompts');
const { recordInstalledAgents } = require('./uninstall');
const { verifyInstall } = require('./status');
const { registerGroundingHooks, HOOK_FILENAMES } = require('../lib/register-grounding-hooks');

// ── Global Install ───────────────────────────────────────────────────────────

async function cmdInstallGlobal(opts = {}) {
  const logger = getLogger();
  header();

  // Story 10.20 — Upsert detection
  const force = Boolean(opts.force);
  const reconfigure = Boolean(opts.reconfigure);
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
    logger.always(`${BOLD}  Bem-vindo ao SNPS AI!${NC}`);
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
    language = 'pt';
    // Story 10.46 — multi-signal gate replaces the old `process.stdin.isTTY`
    // check that silently defaulted to `pt` in Git Bash + Windows.
    if (detectInteractiveMode()) {
      try {
        const inquirer = require('inquirer');
        const langAnswer = await inquirer.prompt([{
          type: 'list',
          name: 'language',
          message: 'Language / Idioma:',
          choices: [
            { name: 'Portugues', value: 'pt' },
            { name: 'English', value: 'en' },
          ],
          default: 'pt',
        }]);
        language = langAnswer.language;
      } catch {
        // Fallback: readline
        const readline = require('readline');
        const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
        language = await new Promise((resolve) => {
          logger.always(`  ${CYAN}Language / Idioma:${NC}`);
          logger.always(`    ${GREEN}1${NC}) Portugues`);
          logger.always(`    ${GREEN}2${NC}) English`);
          rl.question(`  ${BOLD}[1/2]:${NC} `, (answer) => {
            rl.close();
            resolve((answer || '1').trim() === '2' ? 'en' : 'pt');
          });
        });
      }
    } else {
      // Story 10.46 — surface the silent default so users on CI / pipes know.
      warnNonInteractive();
    }
  }

  // Save language to ~/.claude/settings.json
  const claudeSettingsDir = path.join(HOME, '.claude');
  const claudeSettingsPath = path.join(claudeSettingsDir, 'settings.json');
  try {
    fs.mkdirSync(claudeSettingsDir, { recursive: true });
    let settings = {};
    if (fs.existsSync(claudeSettingsPath)) {
      try { settings = JSON.parse(fs.readFileSync(claudeSettingsPath, 'utf8')); } catch { settings = {}; }
    }
    settings.language = language === 'pt' ? 'portuguese' : 'english';
    fs.writeFileSync(claudeSettingsPath, JSON.stringify(settings, null, 2) + '\n');
  } catch { /* non-critical */ }

  // LLM selection (skipped in upsert mode if previous llm known)
  // Story 10.35: --reconfigure forces prompt even in upsert mode
  let llmChoice;
  let llmWasReused = false;
  if (isUpsert && !reconfigure && existing.llm) {
    llmChoice = existing.llm;
    llmWasReused = true;
    const ideLabel = Array.isArray(llmChoice) ? llmChoice.join(', ') : String(llmChoice);
    logger.always(`${DIM}  IDE: ${ideLabel} (from saved config; pass --reconfigure to change)${NC}`);
  } else {
    llmChoice = await promptLlmChoice();
  }
  if (languageWasReused || llmWasReused) logger.always('');

  // Story 10.47 — grounding (vault / design system / brand) opt-in BYO.
  // Each section is independently optional; empty answer = skip = no-op hook.
  // Honors upsert + --reconfigure semantics established by Stories 10.20/10.35.
  await promptGroundingSections({ isUpsert, reconfigure });

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

  logger.always('');
  logger.always(`${BOLD}──── O que será instalado ────${NC}`);
  logger.always(`  ${BOLD}${squads.length}${NC} squads · ${BOLD}${agentTotal}${NC} agentes especializados`);
  logger.always(`  Orquestrador master (Imperator) — chamável por ${CYAN}@sinapse${NC} / ${CYAN}@snps${NC}`);
  if (hookCount) logger.always(`  ${hookCount} hooks de proteção + regras do framework`);
  logger.always(`  Editor(es): ${BOLD}${llmLabel}${NC}`);
  logger.always(`  Idioma: ${langLabelMap[language] || language}`);
  logger.always(`  Modo: ${isUpsert ? 'atualizar instalação existente' : 'instalação nova'}`);
  logger.always(`  Destino: ${DIM}~/.sinapse/${NC} (núcleo) + ${DIM}~/.claude/agents/${NC} (agentes)`);
  logger.always(`${BOLD}──────────────────────────────${NC}`);

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

  logger.always(`\n${BOLD}Instalando Sinapse globalmente...${NC}\n`);

  // Phase 1: Copy squads to ~/.sinapse/
  logger.always(`${CYAN}Phase 1:${NC} ${isUpsert ? 'Refreshing' : 'Copying'} squads to ~/.sinapse/`);
  fs.mkdirSync(SINAPSE_HOME, { recursive: true });

  const squadsSrcBase = fs.existsSync(squadsDir) ? squadsDir : ROOT;
  let totalAgents = 0;
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
    totalAgents += squad.agents;
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
    totalAgents += masterAgents;
    logger.always(`  ${GREEN}OK${NC} sinapse (master, ${masterAgents} agents)`);
  }

  // Phase 2: Generate orqx commands
  logger.always(`\n${CYAN}Phase 2:${NC} Generating agent commands`);
  fs.mkdirSync(CLAUDE_COMMANDS_DIR, { recursive: true });

  // Clear old commands
  try {
    for (const f of fs.readdirSync(CLAUDE_COMMANDS_DIR)) {
      fs.unlinkSync(path.join(CLAUDE_COMMANDS_DIR, f));
    }
  } catch { /* dir may not exist on a fresh install */ }

  const sinapseBase = toForwardSlash(SINAPSE_HOME);
  const writtenAgents = new Set();

  // Generate commands for orqx agents from squads (dynamic paths, always correct)
  for (const squad of squads) {
    const squadPath = `${sinapseBase}/${squad.name}`;
    const agentsDir = path.join(SINAPSE_HOME, squad.name, 'agents');
    if (!fs.existsSync(agentsDir)) continue;

    // agent-invocation fix: generate a command/subagent for EVERY agent (not only -orqx),
    // so every specialist is invokable via @agent and /SINAPSE:agents:agent.
    const squadAgents = fs.readdirSync(agentsDir).filter(f => f.endsWith('.md'));
    for (const file of squadAgents) {
      const agentId = file.replace('.md', '');
      const meta = extractAgentMeta(path.join(agentsDir, file));
      const cmdContent = generateCommandMd(agentId, meta.name, meta.icon, squad.name, squadPath, file);
      fs.writeFileSync(path.join(CLAUDE_COMMANDS_DIR, `${agentId}.md`), cmdContent);
      writtenAgents.add(file);
    }
  }

  // Generate commands for sinapse/ orqx squad agents
  if (fs.existsSync(sinapseMasterDest)) {
    const masterAgentsDir = path.join(sinapseMasterDest, 'agents');
    if (fs.existsSync(masterAgentsDir)) {
      for (const file of fs.readdirSync(masterAgentsDir).filter(f => f.endsWith('.md'))) {
        if (writtenAgents.has(file)) continue;
        const agentId = file.replace('.md', '');
        const meta = extractAgentMeta(path.join(masterAgentsDir, file));
        const squadPath = `${sinapseBase}/sinapse`;
        const cmdContent = generateCommandMd(agentId, meta.name, meta.icon, 'sinapse', squadPath, file);
        fs.writeFileSync(path.join(CLAUDE_COMMANDS_DIR, `${agentId}.md`), cmdContent);
        writtenAgents.add(file);
      }
    }
  }

  // Master entry points (@sinapse, @snps, @sinapse-orqx, @snps-orqx) → rich Imperator stub.
  // Overwrites the generic command file for the orqx names and adds the short aliases the
  // user actually types. All four carry the baked-in greeting + auto-plan mandate.
  if (fs.existsSync(sinapseMasterDest)) {
    const masterSquadPath = `${sinapseBase}/sinapse`;
    const masterEntryPoints = [
      ['sinapse-orqx', 'sinapse-orqx.md'],
      ['snps-orqx', 'snps-orqx.md'],
      ['sinapse', 'sinapse-orqx.md'],
      ['snps', 'snps-orqx.md'],
    ];
    for (const [id, personaFile] of masterEntryPoints) {
      const personaPath = `${masterSquadPath}/agents/${personaFile}`;
      const stub = generateMasterStub(id, personaPath, masterSquadPath, squads);
      fs.writeFileSync(path.join(CLAUDE_COMMANDS_DIR, `${id}.md`), stub);
      writtenAgents.add(`${id}.md`);
    }
  }
  logger.always(`  ${GREEN}OK${NC} ${writtenAgents.size} total command files`);

  // Phase 2b: Install global agents based on LLM choice
  const installedAgentFilenames = new Set();
  const installedIdes = [];
  if (llmChoice === 'claude-code' || llmChoice === 'both') {
    const globalAgentsDir = path.join(HOME, '.claude', 'agents');
    fs.mkdirSync(globalAgentsDir, { recursive: true });
    for (const f of fs.readdirSync(CLAUDE_COMMANDS_DIR).filter(f => f.endsWith('.md'))) {
      fs.copyFileSync(path.join(CLAUDE_COMMANDS_DIR, f), path.join(globalAgentsDir, f));
      installedAgentFilenames.add(f);
    }
    installedIdes.push('claude-code');
    logger.always(`  ${GREEN}OK${NC} Claude Code global agents (${writtenAgents.size})`);
  }

  if (llmChoice === 'codex' || llmChoice === 'both') {
    const codexAgentsDir = path.join(HOME, '.codex', 'agents');
    fs.mkdirSync(codexAgentsDir, { recursive: true });
    for (const f of fs.readdirSync(CLAUDE_COMMANDS_DIR).filter(f => f.endsWith('.md'))) {
      fs.copyFileSync(path.join(CLAUDE_COMMANDS_DIR, f), path.join(codexAgentsDir, f));
      installedAgentFilenames.add(f);
    }
    installedIdes.push('codex');
    logger.always(`  ${GREEN}OK${NC} Codex global agents (${writtenAgents.size})`);
  }

  // Audit 1 P0 (UN-1) — record manifest so uninstall can remove every file
  // we wrote (not just `*-orqx.md`). Idempotent: re-install overwrites.
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
    agents: totalAgents,
    commands: writtenAgents.size,
    llm: llmChoice,
    platform: process.platform,
  };
  if (isUpsert) {
    meta.updatedAt = nowIso;
  }
  fs.writeFileSync(path.join(SINAPSE_HOME, 'metadata.json'), JSON.stringify(meta, null, 2));

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

  // Phase 6b — Story GA-1.6: copy framework grounding hooks to a stable
  // location and register them in ~/.claude/settings.json. Idempotent and
  // non-destructive: existing personal hooks (user's vault-grounding,
  // terminal-bus, etc.) are preserved.
  if (llmChoice === 'claude-code' || llmChoice === 'both') {
    try {
      logger.always(`\n${CYAN}Phase 6b:${NC} Grounding hooks (vault / DS / brand)`);
      const srcHooksDir = path.join(ROOT, '.sinapse-ai', 'hooks');
      const destHooksDir = path.join(SINAPSE_HOME, 'hooks');
      fs.mkdirSync(destHooksDir, { recursive: true });
      let copied = 0;
      for (const hookName of HOOK_FILENAMES) {
        const src = path.join(srcHooksDir, hookName);
        if (!fs.existsSync(src)) continue;
        fs.copyFileSync(src, path.join(destHooksDir, hookName));
        copied++;
      }
      const settingsPath = path.join(HOME, '.claude', 'settings.json');
      const result = registerGroundingHooks({
        settingsPath,
        hooksDir: destHooksDir,
        notify: (msg) => logger.always(`  ${DIM}${msg}${NC}`),
      });
      const summary = `${result.added.length} added, ${result.skipped.length} already present`;
      logger.always(`  ${GREEN}OK${NC} ${copied} hook files copied — ${summary}`);
      if (result.errors.length > 0) {
        for (const err of result.errors) logger.always(`  ${YELLOW}WARN${NC} ${err}`);
      }
    } catch (error) {
      logger.always(`  ${YELLOW}SKIP${NC} Grounding hooks: ${error.message}`);
    }
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
  try {
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
    const reTargets = [];
    if (llmChoice === 'claude-code' || llmChoice === 'both') reTargets.push(path.join(HOME, '.claude', 'agents'));
    if (llmChoice === 'codex' || llmChoice === 'both') reTargets.push(path.join(HOME, '.codex', 'agents'));
    if (reTargets.length && fs.existsSync(CLAUDE_COMMANDS_DIR)) {
      const cmdFiles = fs.readdirSync(CLAUDE_COMMANDS_DIR).filter(f => f.endsWith('.md'));
      for (const dir of reTargets) {
        fs.mkdirSync(dir, { recursive: true });
        for (const f of cmdFiles) {
          fs.copyFileSync(path.join(CLAUDE_COMMANDS_DIR, f), path.join(dir, f));
        }
      }
      logger.always(`  ${GREEN}OK${NC} Global agents reconciled (${cmdFiles.length} files — rich stubs authoritative)`);
    }
  } catch (e) {
    logger.always(`  ${YELLOW}WARN${NC} Global agent reconciliation: ${e.message}`);
  }

  // Verify
  logger.always(`\n${CYAN}Verification:${NC}`);
  verifyInstall();

  // Success message
  let startCmd;
  if (llmChoice === 'codex') startCmd = `Run ${CYAN}codex${NC} to start`;
  else if (llmChoice === 'both') startCmd = `Run ${CYAN}sinapse${NC} or ${CYAN}codex${NC} to start`;
  else startCmd = `Run ${CYAN}sinapse${NC} to start Claude Code with all agents`;

  logger.always('');
  logger.always(`${GREEN}══════════════════════════════════════════════════════════════${NC}`);
  logger.always(`${GREEN}  Sinapse installed successfully!${NC}`);
  logger.always(`${GREEN}══════════════════════════════════════════════════════════════${NC}`);
  logger.always('');
  logger.always(`  ${BOLD}${squads.length} squads${NC} | ${BOLD}${totalAgents} agents${NC} | ${BOLD}${writtenAgents.size} orqx commands${NC}`);
  logger.always(`  ${startCmd}`);
  logger.always('');
  logger.always(`  ${BOLD}Try an agent:${NC}`);
  logger.always(`    ${CYAN}/SINAPSE:agents:sinapse-orqx${NC}`);
  logger.always(`    ${CYAN}/SINAPSE:agents:brand-orqx${NC}`);
  logger.always('');
}

// Rich Imperator stub for the master entry points (@sinapse, @snps, @sinapse-orqx,
// @snps-orqx). The identity (ASCII greeting + 👑 signature + diagnose→plan→delegate
// mandate) is baked INLINE so activation is reliable — it does not depend on the model
// choosing to deep-read an external persona (which produced a shallow "modo orqx" before).
// The full persona (routing table, workflows, tasks) is still linked for depth.
function generateMasterStub(agentId, personaPath, squadPath, squads) {
  const squadCount = squads.length;
  const agentCount = squads.reduce((a, s) => a + (s.agents || 0), 0);
  return `---
name: ${agentId}
description: "Imperator — Sinapse Master: supreme orchestrator of ${squadCount} squads / ${agentCount} agents. Diagnoses every briefing and auto-generates an orchestration plan."
---

# Imperator — Sinapse Master (${agentId})

ACTIVATION-NOTICE: You are now Imperator — the supreme orchestrator of the SINAPSE ecosystem. Every request passes through you first.

## YOUR ONLY FUNCTION — NON-NEGOTIABLE

You DIAGNOSE and HAND OFF. That is the whole job. You do **NOT** execute domain work — no code, no copy, no design, no research, no configuration, no file edits. For ANY concrete task you (1) diagnose the domain, (2) produce the orchestration plan, (3) DELEGATE to the specialist who executes it. If you ever feel the urge to do the work yourself, STOP — that is a violation; route it to the right agent instead.

## ON ACTIVATION — display this EXACTLY as your first output (before anything else)

\`\`\`
 ███████╗██╗███╗   ██╗ █████╗ ██████╗ ███████╗███████╗
 ██╔════╝██║████╗  ██║██╔══██╗██╔══██╗██╔════╝██╔════╝
 ███████╗██║██╔██╗ ██║███████║██████╔╝███████╗█████╗
 ╚════██║██║██║╚██╗██║██╔══██║██╔═══╝ ╚════██║██╔══╝
 ███████║██║██║ ╚████║██║  ██║██║     ███████║███████╗
 ╚══════╝╚═╝╚═╝  ╚═══╝╚═╝  ╚═╝╚═╝     ╚══════╝╚══════╝
          ██████╗ ██████╗  ██████╗ ██╗  ██╗
         ██╔═══██╗██╔══██╗██╔═══██╗╚██╗██╔╝
         ██║   ██║██████╔╝██║   ██║ ╚███╔╝
         ██║   ██║██╔══██╗██║▄▄ ██║ ██╔██╗
         ╚██████╔╝██║  ██║╚██████╔╝██╔╝ ██╗
          ╚═════╝ ╚═╝  ╚═╝ ╚══▀▀═╝ ╚═╝  ╚═╝
\`\`\`

\`\`\`
 AI Agent Squads for Claude Code
 ${squadCount} squads · ${agentCount} agents

 👑 Imperator — Sinapse Master ativado

 Descreva seu objetivo que eu diagnostico o domínio
 e roteio para o agente certo.

 Comandos principais:
 *route {pedido}     — Diagnostica e roteia para a squad certa
 *plan {iniciativa}  — Desenha um plano de execução multi-squad
 *status             — Reporta todas as squads e capacidades
 *onboard            — Tour guiado do ecossistema SINAPSE
 *help               — Mostra todos os comandos
\`\`\`

## AFTER THE GREETING — NON-NEGOTIABLE (Imperator's core function)

Check if the user provided a briefing with the activation:
- **Briefing provided** → proceed IMMEDIATELY: run the Initial State Audit → classify the request → produce an ORCHESTRATION PLAN (phases + squads + specific agents assigned + handoffs) → delegate to the specialists. NEVER ask "do you want me to plan?" — for Imperator the answer is always YES.
- **Bare activation** → await the briefing, then apply the same flow automatically on receipt.

You diagnose and DELEGATE — never execute domain work yourself. Route simple, well-defined requests directly to @specialist; complex ones to @{domain}-orqx; cross-domain ones by coordinating multiple orchestrators.

## FULL OPERATING PARAMETERS

For your complete persona — the routing table of all squads, the Initial State Audit, the Documentation-First gate, NSN enforcement, and every workflow and task — read and ADOPT:
\`${personaPath}\`
Tasks: \`${squadPath}/tasks/\` · Workflows: \`${squadPath}/workflows/\` · Manifest: \`${squadPath}/squad.yaml\`

— Imperator, orchestrating SINAPSE
`;
}

function generateCommandMd(agentId, agentName, agentIcon, squadName, squadPath, agentFile) {
  // Detecta se é orquestrador: id termina em -orqx OU é Imperator (snps-orqx/sinapse-orqx)
  // ou um dos apelidos curtos do master (sinapse/snps).
  const isOrchestrator = /-orqx$/.test(agentId) || agentId === 'snps-orqx' || agentId === 'sinapse-orqx' || agentId === 'sinapse' || agentId === 'snps';

  const step4 = isOrchestrator
    ? `4. Briefing-on-activation check (this agent is an ORCHESTRATOR):
   - If user provided briefing/context with the activation → proceed IMMEDIATELY: absorb → diagnose → plan with phases + agents + handoffs → execute (YOLO). NEVER ask "do you want me to plan?".
   - If bare activation only → await briefing. On receipt, apply same flow automatically.`
    : '4. HALT and await user input';

  const step6 = isOrchestrator
    ? `6. Briefing-on-activation check (ORCHESTRATOR):
   - If user provided briefing → proceed IMMEDIATELY: absorb → diagnose → plan → execute
   - If bare activation → await briefing, then plan automatically. NEVER ask "do you want me to plan?".`
    : '6. HALT and await user input';

  // Frontmatter (name + description) is REQUIRED so the file resolves as a Claude Code
  // subagent (@id) — without it, @id matches nothing. The same file doubles as a slash
  // command (/SINAPSE:agents:id); extra frontmatter is harmless there.
  const fmDesc = (isOrchestrator
    ? `${agentName || agentId} — orchestrator for ${squadName}; diagnoses, routes to specialists and auto-generates an orchestration plan`
    : `${agentName || agentId} — ${squadName} specialist`).replace(/["\n\r]/g, ' ').trim();

  return `---
name: ${agentId}
description: "${fmDesc}"
---

# ${agentId}

ACTIVATION-NOTICE: This command activates an agent from ${squadName}.

CRITICAL: Read the agent definition file at \`${squadPath}/agents/${agentFile}\` to understand your full operating parameters. Then:
1. Adopt the persona defined in that file (name: ${agentName}, icon: ${agentIcon})
2. Load the squad manifest at \`${squadPath}/squad.yaml\` for context
3. Display a greeting showing your agent name, role, and available commands
${step4}

## Agent Reference
- **Agent ID:** ${agentId}
- **Squad:** ${squadName}
- **Definition:** \`${squadPath}/agents/${agentFile}\`
- **Squad Manifest:** \`${squadPath}/squad.yaml\`
- **Tasks:** \`${squadPath}/tasks/\`
- **Knowledge Bases:** \`${squadPath}/knowledge-base/\`
- **Workflows:** \`${squadPath}/workflows/\`

## Activation Instructions
1. Read the full agent definition: \`${squadPath}/agents/${agentFile}\`
2. Adopt the persona (name, icon, communication style, principles)
3. Show greeting: "{icon} {name} — {role} ativado"
4. Show: "Squad: ${squadName} | Invoke: /SINAPSE:agents:${agentId}"
5. List your key tasks from the agent definition
${step6}

## How to Execute Tasks
When the user requests a task:
1. Find the matching task in \`${squadPath}/tasks/\`
2. Read the task file completely
3. Execute following the task checklist step by step
4. Consult knowledge bases in \`${squadPath}/knowledge-base/\` as needed

## Cross-Squad Handoff
If the task requires expertise outside this squad:
1. Identify which squad covers the needed domain
2. Recommend: /SINAPSE:agents:{appropriate-agent}
3. Provide handoff context
`;
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
  fs.writeFileSync(bashPath, bashLauncher);
  try { fs.chmodSync(bashPath, 0o755); } catch { /* chmod is best-effort (no-op on non-POSIX) */ }
  logger.always(`  ${GREEN}OK${NC} ~/bin/sinapse`);

  // Windows CMD launcher
  if (IS_WIN) {
    const cmdLauncher = '@echo off\r\nclaude --add-dir "%USERPROFILE%\\.sinapse" --agent sinapse-orqx %*\r\n';
    fs.writeFileSync(path.join(BIN_DIR, 'sinapse.cmd'), cmdLauncher);
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
};
