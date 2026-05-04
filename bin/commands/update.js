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
const { getSquads, extractAgentMeta } = require('../lib/squads');
const {
  rmDirSync,
  syncDirSync,
  toForwardSlash,
} = require('../lib/fs-utils');
const {
  detectExistingInstall,
  detectStaleness,
} = require('../lib/detection');
const { promptLlmChoice } = require('../lib/prompts');
const { generateCommandMd, generateSquadAwareness } = require('./install');
const { registerGroundingHooks, HOOK_FILENAMES } = require('../lib/register-grounding-hooks');

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

  // Welcome back screen
  logger.always(`${BOLD}  Que bom que voce voltou!${NC}`);
  logger.always(`${DIM}  Atualizando SNPS AI: v${prevVer} -> v${VERSION}${NC}`);
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
  logger.always(`${BOLD}Atualizando SNPS AI...${NC}\n`);

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

  // Phase 2: Regenerate commands (reuse install logic)
  logger.always(`\n${CYAN}Phase 2:${NC} Regenerating commands`);
  // Clear and regenerate
  rmDirSync(CLAUDE_COMMANDS_DIR);
  fs.mkdirSync(CLAUDE_COMMANDS_DIR, { recursive: true });

  const sinapseBase = toForwardSlash(SINAPSE_HOME);
  const writtenAgents = new Set();

  // Generate commands for orqx agents from squads (dynamic paths)
  let totalAgents = 0;
  for (const squad of squads) {
    const agentsDir = path.join(SINAPSE_HOME, squad.name, 'agents');
    if (!fs.existsSync(agentsDir)) continue;
    const allAgents = fs.readdirSync(agentsDir).filter(f => f.endsWith('.md'));
    totalAgents += allAgents.length;
    const orqxAgents = allAgents.filter(f => f.includes('-orqx'));
    for (const file of orqxAgents) {
      const agentId = file.replace('.md', '');
      const meta = extractAgentMeta(path.join(agentsDir, file));
      const squadPath = `${sinapseBase}/${squad.name}`;
      fs.writeFileSync(path.join(CLAUDE_COMMANDS_DIR, file), generateCommandMd(agentId, meta.name, meta.icon, squad.name, squadPath, file));
      writtenAgents.add(file);
    }
  }

  // Generate commands for sinapse/ orqx squad agents
  const sinapseAgentsDir = path.join(SINAPSE_HOME, 'sinapse', 'agents');
  if (fs.existsSync(sinapseAgentsDir)) {
    const masterAgents = fs.readdirSync(sinapseAgentsDir).filter(f => f.endsWith('.md'));
    totalAgents += masterAgents.length;
    for (const file of masterAgents) {
      if (writtenAgents.has(file)) continue;
      const agentId = file.replace('.md', '');
      const meta = extractAgentMeta(path.join(sinapseAgentsDir, file));
      const squadPath = `${sinapseBase}/sinapse`;
      fs.writeFileSync(path.join(CLAUDE_COMMANDS_DIR, file), generateCommandMd(agentId, meta.name, meta.icon, 'sinapse', squadPath, file));
      writtenAgents.add(file);
    }
  }
  logger.always(`  ${GREEN}OK${NC} ${writtenAgents.size} command files (${totalAgents} agents total)`);

  // Phase 2b: Install global agents based on LLM choice
  if (llmChoice === 'claude-code' || llmChoice === 'both') {
    const globalAgentsDir = path.join(HOME, '.claude', 'agents');
    fs.mkdirSync(globalAgentsDir, { recursive: true });
    // Copy orqx commands as global agents
    for (const f of fs.readdirSync(CLAUDE_COMMANDS_DIR).filter(f => f.endsWith('.md'))) {
      fs.copyFileSync(path.join(CLAUDE_COMMANDS_DIR, f), path.join(globalAgentsDir, f));
    }
    logger.always(`  ${GREEN}OK${NC} Claude Code global agents (${writtenAgents.size})`);
  }

  if (llmChoice === 'codex' || llmChoice === 'both') {
    const codexAgentsDir = path.join(HOME, '.codex', 'agents');
    fs.mkdirSync(codexAgentsDir, { recursive: true });
    // Generate orqx agents for Codex
    for (const f of fs.readdirSync(CLAUDE_COMMANDS_DIR).filter(f => f.endsWith('.md'))) {
      fs.copyFileSync(path.join(CLAUDE_COMMANDS_DIR, f), path.join(codexAgentsDir, f));
    }
    logger.always(`  ${GREEN}OK${NC} Codex global agents (${writtenAgents.size})`);
  }

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
  meta.commands = writtenAgents.size;
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

  // Phase 3b — Story GA-1.6: ensure grounding hooks are present + registered.
  if (llmChoice === 'claude-code' || llmChoice === 'both') {
    try {
      logger.always(`\n${CYAN}Phase 3b:${NC} Refreshing grounding hooks`);
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
      logger.always(`  ${GREEN}OK${NC} ${copied} hook files refreshed — ${summary}`);
      if (result.errors.length > 0) {
        for (const err of result.errors) logger.always(`  ${YELLOW}WARN${NC} ${err}`);
      }
    } catch (error) {
      logger.always(`  ${YELLOW}SKIP${NC} Grounding hooks: ${error.message}`);
    }
  }

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
  logger.always(`${GREEN}  SNPS AI atualizado para v${VERSION}!${NC}`);
  logger.always(`${GREEN}══════════════════════════════════════════════════════════════${NC}`);
  logger.always('');
  logger.always(`  ${BOLD}${squads.length} squads${NC} | ${BOLD}${totalAgents} agents${NC} | ${BOLD}${writtenAgents.size} orqx commands${NC}`);
  logger.always(`  ${startCmd}`);
  logger.always('');
}

module.exports = { cmdUpdateGlobal };
