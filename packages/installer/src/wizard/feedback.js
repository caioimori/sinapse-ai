/**
 * Visual Feedback Helpers
 *
 * Spinners, progress bars, and status indicators using SINAPSE Color System v4.0.4
 *
 * @module wizard/feedback
 */

const ora = require('ora');
const cliProgress = require('cli-progress');
const { colors, status, headings } = require('../utils/sinapse-colors');
const { t } = require('./i18n');

/**
 * Canonical ecosystem counts — single, documented source of truth.
 *
 * The numbers come from `scripts/sync-counts.js` (run `npm run sync:counts`):
 * the total is 172 agents — 160 distributed across the 17 squads, plus 12
 * framework core agents. Cross-document consistency is enforced by
 * `npm run validate:article-vii` (Constitution Article VII — Metrics Accuracy).
 *
 * Do NOT inline these numbers elsewhere in this file — reference `ECOSYSTEM`
 * so there is exactly one place to update when `sync:counts` changes.
 */
const ECOSYSTEM = Object.freeze({ squads: 17, agents: 172, tasks: '1,411' });

/**
 * Create and start a spinner with SINAPSE styling
 *
 * @param {string} text - Spinner text
 * @param {Object} options - Spinner options
 * @returns {Object} Ora spinner instance
 */
function createSpinner(text, options = {}) {
  return ora({
    text,
    color: 'cyan',
    spinner: 'dots',
    ...options,
  });
}

/**
 * Show success message with checkmark
 *
 * @param {string} message - Success message
 */
function showSuccess(message) {
  console.log(status.success(message));
}

/**
 * Show error message with cross mark
 *
 * @param {string} message - Error message
 */
function showError(message) {
  console.log(status.error(message));
}

/**
 * Show warning message with warning symbol
 *
 * @param {string} message - Warning message
 */
function showWarning(message) {
  console.log(status.warning(message));
}

/**
 * Show info message
 *
 * @param {string} message - Info message
 */
function showInfo(message) {
  console.log(status.info(message));
}

/**
 * Show tip message
 *
 * @param {string} message - Tip message
 */
function showTip(message) {
  console.log(status.tip(message));
}

/**
 * Create progress bar with SINAPSE styling
 *
 * @param {number} total - Total steps
 * @param {Object} options - Progress bar options
 * @returns {Object} Progress bar instance
 */
function createProgressBar(total, options = {}) {
  const progressBar = new cliProgress.SingleBar(
    {
      format:
        colors.primary('Progress |') +
        colors.tertiary('{bar}') +
        colors.primary('| {percentage}% | {value}/{total} | {task}'),
      barCompleteChar: '\u2588',
      barIncompleteChar: '\u2591',
      hideCursor: true,
      ...options,
    },
    cliProgress.Presets.shades_classic,
  );

  progressBar.start(total, 0, { task: 'Initializing...' });
  return progressBar;
}

/**
 * Update progress bar
 *
 * @param {Object} progressBar - Progress bar instance
 * @param {number} current - Current step
 * @param {string} taskName - Current task name
 */
function updateProgress(progressBar, current, taskName) {
  progressBar.update(current, { task: taskName });
}

/**
 * Complete and hide progress bar
 *
 * @param {Object} progressBar - Progress bar instance
 */
function completeProgress(progressBar) {
  progressBar.stop();
}

/**
 * ASCII Art Banner for SINAPSE
 */
const BANNER = `
 ███████╗██╗███╗   ██╗ █████╗ ██████╗ ███████╗███████╗     █████╗ ██╗
 ██╔════╝██║████╗  ██║██╔══██╗██╔══██╗██╔════╝██╔════╝    ██╔══██╗██║
 ███████╗██║██╔██╗ ██║███████║██████╔╝███████╗█████╗      ███████║██║
 ╚════██║██║██║╚██╗██║██╔══██║██╔═══╝ ╚════██║██╔══╝      ██╔══██║██║
 ███████║██║██║ ╚████║██║  ██║██║     ███████║███████╗    ██║  ██║██║
 ╚══════╝╚═╝╚═╝  ╚═══╝╚═╝  ╚═╝╚═╝     ╚══════╝╚══════╝    ╚═╝  ╚═╝╚═╝
`;

/**
 * Show immersive welcome banner
 */
function showWelcome() {
  console.log(BANNER);
  console.log('');
  console.log(`  ${t('welcomeMessage')}`);
  console.log(`  ${t('welcomeSubtitle')}`);
  console.log('');
  console.log(`  ${ECOSYSTEM.squads} squads · ${ECOSYSTEM.agents} agents · ${ECOSYSTEM.tasks} tasks`);
  console.log(`  ${t('welcomeDesc1')}`);
  console.log(`  ${t('welcomeDesc2')}`);
  console.log('');
  console.log(`  ${t('welcomePreparing')}`);
  console.log('');
  console.log('═'.repeat(80));
  console.log('');
}

/**
 * Show completion message with summary
 *
 * @param {Object} [context={}] - Installation context for dynamic summary
 * @param {string} [context.llmLabel] - LLM label (e.g., 'Claude Code', 'Codex CLI', 'Ambos')
 */
function showCompletion(context = {}) {
  const llmLabel = context.llmLabel || 'Claude Code';
  const llmValue = context.llmValue || 'claude-code';
  // Prefer a real count from the caller (manifest/registry) when provided;
  // otherwise fall back to the canonical ECOSYSTEM total (never a magic literal).
  const agentCount = context.agentCount || ECOSYSTEM.agents;

  let startCommand;
  if (llmValue === 'codex') {
    startCommand = t('startCommandCodex');
  } else if (llmValue === 'both') {
    startCommand = t('startCommandBoth');
  } else {
    startCommand = t('startCommandClaude');
  }

  // Honest completion: only claim "ready" when dependencies actually installed.
  const depsInstalled = context.depsInstalled !== false;

  console.log('\n' + headings.divider());
  console.log('');
  console.log(status.success(t('completionInstalled')));
  console.log(status.success(`${llmLabel} ${t('completionConfigured')}`));
  console.log(status.success(`${agentCount} ${t('completionAgents')}`));
  if (depsInstalled) {
    console.log(status.success(`${t('completionReady')} ${startCommand}`));
  } else {
    console.log(status.warning(t('completionDepsMissing')));
    console.log(status.info(`${t('completionReady')} ${startCommand}`));
  }
  console.log('');
  console.log(headings.divider() + '\n');
}

/**
 * Show section header
 *
 * @param {string} title - Section title
 */
function showSection(title) {
  console.log('\n' + headings.h2(title));
}

/**
 * Show cancellation message
 */
function showCancellation() {
  console.log('\n' + colors.warning(t('cancelled')));
  console.log(colors.info(t('tryAgain') + '\n'));
}

/**
 * Estimate time remaining for progress
 *
 * @param {number} current - Current step
 * @param {number} total - Total steps
 * @param {number} startTime - Start timestamp
 * @returns {string} Formatted time estimate
 */
function estimateTimeRemaining(current, total, startTime) {
  if (current === 0) return 'Calculating...';

  const elapsed = Date.now() - startTime;
  const avgTimePerStep = elapsed / current;
  const remaining = (total - current) * avgTimePerStep;

  const seconds = Math.ceil(remaining / 1000);

  if (seconds < 60) {
    return `~${seconds}s remaining`;
  }

  const minutes = Math.ceil(seconds / 60);
  return `~${minutes}m remaining`;
}

module.exports = {
  createSpinner,
  showSuccess,
  showError,
  showWarning,
  showInfo,
  showTip,
  createProgressBar,
  updateProgress,
  completeProgress,
  showWelcome,
  showCompletion,
  showSection,
  showCancellation,
  estimateTimeRemaining,
};
