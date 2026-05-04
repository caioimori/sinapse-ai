// bin/lib/prompts.js — interactive prompts (LLM, grounding, uninstall).
// Story GA-1.2 — extracted from bin/cli.js.

const path = require('path');
const { getLogger } = require('../../.sinapse-ai/core/logger');
const { ROOT, CYAN, GREEN, BOLD, DIM, YELLOW, NC } = require('./constants');
const { detectInteractiveMode, warnNonInteractive } = require('./detection');

/**
 * Prompt user to select LLM(s) — inquirer checkbox with readline fallback.
 * @returns {Promise<string>} 'claude-code' | 'codex' | 'both'
 */
async function promptLlmChoice() {
  const logger = getLogger();
  // Story 10.46 — multi-signal gate replaces the old `!process.stdin.isTTY`
  // check that silently skipped this prompt in Git Bash + Windows.
  if (!detectInteractiveMode()) {
    warnNonInteractive();
    return 'claude-code';
  }
  try {
    const inquirer = require('inquirer');
    const { llms } = await inquirer.prompt([{
      type: 'checkbox',
      name: 'llms',
      message: 'Escolha sua LLM (espaco seleciona, enter confirma):',
      choices: [
        { name: 'Claude Code (Recomendado)', value: 'claude-code', checked: true },
        { name: 'Codex CLI', value: 'codex' },
      ],
    }]);
    if (llms.length === 0) return 'claude-code'; // default if none selected
    if (llms.length === 2) return 'both';
    return llms[0];
  } catch {
    // Fallback: readline numbered choice
    const readline = require('readline');
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
    return new Promise((resolve) => {
      logger.always(`${CYAN}  Escolha sua LLM:${NC}`);
      logger.always(`    ${GREEN}1${NC}) Claude Code ${DIM}(Recomendado)${NC}`);
      logger.always(`    ${GREEN}2${NC}) Codex CLI`);
      logger.always(`    ${GREEN}3${NC}) Ambos`);
      logger.always('');
      rl.question(`  ${BOLD}Opcao [1/2/3]:${NC} `, (answer) => {
        rl.close();
        const choice = (answer || '1').trim();
        if (choice === '2') resolve('codex');
        else if (choice === '3') resolve('both');
        else resolve('claude-code');
      });
    });
  }
}

// Story 10.47 — collect optional grounding paths (vault / design system /
// brand). Empty answers leave the section disabled and the shipped hook
// stays a no-op. Reuses the multi-signal interactive detector from Story
// 10.46 so CI / non-TTY runs skip silently with the consolidated warning
// already emitted by lang/LLM helpers.
async function promptGroundingSections({ isUpsert = false, reconfigure = false } = {}) {
  const logger = getLogger();
  const groundingConfig = require(path.join(
    ROOT, 'packages', 'installer', 'src', 'wizard', 'grounding-config',
  ));
  const existing = groundingConfig.readGroundingConfig();
  const pending = isUpsert && !reconfigure
    ? groundingConfig.pendingGroundingSections(existing)
    : { askVault: true, askDesignSystem: true, askBrand: true };

  if (!pending.askVault && !pending.askDesignSystem && !pending.askBrand) {
    return existing;
  }

  if (!detectInteractiveMode()) {
    warnNonInteractive();
    // Persist defaults so the file exists with a documented schema even on
    // headless installs (helps users discover it later via `--reconfigure`).
    const merged = groundingConfig.buildGroundingFromAnswers({}, existing);
    groundingConfig.writeGroundingConfig(merged);
    return merged;
  }

  const questions = require(path.join(
    ROOT, 'packages', 'installer', 'src', 'wizard', 'questions',
  ));
  const inquirer = require('inquirer');

  const ask = [];
  if (pending.askVault) ask.push(questions.getVaultGroundingQuestion());
  if (pending.askDesignSystem) ask.push(questions.getDesignSystemGroundingQuestion());
  if (pending.askBrand) ask.push(questions.getBrandGroundingQuestion());

  logger.always('');
  logger.always(`${CYAN}Grounding semantico (opt-in):${NC}`);
  logger.always(`${DIM}  Pular qualquer pergunta ativa o fallback generico do framework.${NC}`);

  let answers = {};
  try {
    answers = await inquirer.prompt(ask);
  } catch {
    // Fallback: minimal readline loop if inquirer fails (e.g. exotic shells).
    const readline = require('readline');
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
    const askLine = (msg) => new Promise((resolve) => rl.question(msg, resolve));
    if (pending.askVault) answers.vaultPath = (await askLine('  Vault path (Enter pra pular): ')).trim();
    if (pending.askDesignSystem) answers.designSystemPath = (await askLine('  Design system path (Enter pra pular): ')).trim();
    if (pending.askBrand) answers.brandbookPath = (await askLine('  Brandbook path (Enter pra pular): ')).trim();
    rl.close();
  }

  const merged = groundingConfig.buildGroundingFromAnswers(answers, existing);
  groundingConfig.writeGroundingConfig(merged);
  return merged;
}

// Story 10.40 — Confirmation prompt for destructive uninstall.
// Returns true if user confirmed, false otherwise.
async function confirmUninstall() {
  return new Promise((resolve) => {
    const readline = require('readline');
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
    rl.question(`${YELLOW}Remove SINAPSE completely from this machine?${NC} [y/${BOLD}N${NC}] `, (answer) => {
      rl.close();
      const a = (answer || '').trim().toLowerCase();
      resolve(a === 'y' || a === 'yes');
    });
  });
}

module.exports = {
  promptLlmChoice,
  promptGroundingSections,
  confirmUninstall,
};
