/**
 * Wizard Questions Definitions
 *
 * Modular question system for SINAPSE installation wizard.
 * Only the questions actually asked by the live 2-step wizard remain here
 * (language + LLM). IDE selection helper is kept for the IDE selector module.
 *
 * @module wizard/questions
 */

const { colors } = require('../utils/sinapse-colors');
const { t, getLanguageChoices } = require('./i18n');

/**
 * Get language selection question (first question)
 * @returns {Object} Inquirer question object
 */
function getLanguageQuestion() {
  return {
    type: 'list',
    name: 'language',
    message: '🌐 Language:',
    choices: getLanguageChoices(),
    default: 'pt',
  };
}

/**
 * Get LLM selection question (simplified wizard)
 * Single interactive question for the 2-step wizard flow.
 *
 * @returns {Object} Inquirer question object
 */
function getLLMQuestion() {
  return {
    type: 'list',
    name: 'selectedLLM',
    message: colors.primary(t('llmQuestion')),
    choices: [
      {
        name: colors.highlight('Claude Code') + colors.dim(` (${t('llmRecommended')})`),
        value: 'claude-code',
      },
      {
        name: 'Codex CLI',
        value: 'codex',
      },
      {
        name: t('llmBoth'),
        value: 'both',
      },
    ],
    default: 0,
  };
}

/**
 * Get IDE selection questions (Story 1.4)
 *
 * @returns {Object[]} Array of inquirer question objects
 */
function getIDEQuestions() {
  const { getIDESelectionQuestion } = require('./ide-selector');
  return [getIDESelectionQuestion()];
}

module.exports = {
  getLanguageQuestion,
  getLLMQuestion,
  getIDEQuestions,
};
