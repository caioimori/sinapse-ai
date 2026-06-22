// bin/lib/prompts.js — interactive prompts (LLM, uninstall).
// Story GA-1.2 — extracted from bin/cli.js.

const { getLogger } = require('../../.sinapse-ai/core/logger');
const { CYAN, GREEN, BOLD, DIM, YELLOW, NC } = require('./constants');
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
  confirmUninstall,
};
