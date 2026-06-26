/**
 * Build Command — executable sibling of `sinapse route`.
 *
 * `route()` SHOWS the deterministic doc-first decision for a briefing (type →
 * workflow → required docs → gate). `build()` RUNS it: it drives the
 * BobOrchestrator decision-tree engine (Projeto Bob) from a briefing in GUIDED
 * mode — it detects project state, routes to the greenfield / brownfield /
 * existing-project handler, and surfaces the next action/checkpoint instead of
 * spawning agents headlessly.
 *
 * Congruence guarantee: both `route()` and `build()` start from
 * `resolveDocFirstState`, so the conversation, the doc-first gate hook, `route`
 * and `build` can never disagree about type/workflow/gate.
 *
 * The heavy orchestration index (locks, observability panel, status writer) is
 * required LAZILY — `--dry-run` never constructs it, so it stays side-effect-free.
 *
 * @module core/orchestration/build-command
 * @version 1.0.0
 */

'use strict';

const { resolveDocFirstState } = require('./doc-first-resolver');

let chalk;
try {
  chalk = require('chalk');
} catch {
  const id = (s) => s;
  chalk = {
    green: id, red: id, yellow: Object.assign(id, { bold: id }),
    cyan: Object.assign(id, { bold: id }), gray: id, bold: id, dim: id,
  };
}

/**
 * Render the compact doc-first routing header (the "plan"), shared with `route`
 * so `build` is visibly congruent with it.
 * @param {string} brief
 * @param {object} state - resolveDocFirstState() result
 */
function printPlanHeader(brief, state) {
  const ok = (b) => (b ? chalk.green('✓') : chalk.red('✗'));
  const briefLabel = brief ? `"${brief}"` : '(no brief — using project state only)';

  console.log(chalk.cyan('\n═══════════════════════════════════════════════════════════'));
  console.log(chalk.cyan.bold('  🛠️  SINAPSE Build — guided orchestration'));
  console.log(chalk.cyan('═══════════════════════════════════════════════════════════\n'));

  console.log(`Brief:        ${chalk.gray(briefLabel)}`);
  console.log(`Project type: ${chalk.bold(state.projectType)}`);
  console.log(`Workflow:     ${chalk.bold(state.workflow || 'SDC (no upstream re-doc)')}`);
  console.log(
    `Doc-first:    ${state.gate.satisfied
      ? chalk.green('✅ gate satisfied')
      : chalk.red('🚫 gate blocked — missing: ' + state.gate.missing.join(', '))}\n`,
  );
  void ok;
}

/**
 * Render the BobOrchestrator result in a guided, scannable way.
 * @param {object} result - OrchestrationResult from BobOrchestrator.orchestrate
 */
function printEngineResult(result) {
  const r = result || {};
  console.log(chalk.bold('Engine decision:'));
  console.log(`  Project state: ${chalk.bold(r.projectState || 'unknown')}`);
  console.log(`  Action:        ${chalk.bold(r.action || 'n/a')}`);

  const data = r.data || {};
  const nextStep = r.nextStep || data.nextStep;
  const message = data.formattedMessage || data.message || data.summary;
  if (message) {
    console.log('\n' + chalk.gray(String(message).trim()));
  }
  if (nextStep) {
    console.log(`\n${chalk.cyan('▶ Next step:')} ${chalk.bold(nextStep)}`);
  }

  console.log('');
  if (r.success) {
    console.log(chalk.green.bold('  ✅ Orchestration step completed.\n'));
  } else {
    console.log(chalk.red.bold(`  🚫 Orchestration did not complete: ${r.error || r.action || 'unknown'}\n`));
  }
}

/**
 * Execute the `build` command.
 *
 * @param {string} brief - User briefing (e.g. "criar um site pra X")
 * @param {Object} [options]
 * @param {string} [options.projectRoot] - Project root path
 * @param {string} [options.type] - Explicit project_type override
 * @param {boolean} [options.dryRun] - Show the plan + engine entry without running it
 * @returns {Promise<{success:boolean, exitCode:number, state:object, result?:object}>}
 */
async function build(brief, options = {}) {
  const projectRoot = options.projectRoot || process.cwd();
  const state = resolveDocFirstState({ projectRoot, brief, projectType: options.type });

  printPlanHeader(brief, state);

  if (options.dryRun) {
    console.log(chalk.yellow.bold('  (dry-run) '), 'would run BobOrchestrator.orchestrate({ userGoal })');
    console.log(
      chalk.gray('  No engine constructed — no locks, no panel, no side effects.\n'),
    );
    return { success: true, exitCode: 0, state };
  }

  // Lazily require the heavy orchestration index ONLY for the real run.
  let BobOrchestrator;
  try {
    ({ BobOrchestrator } = require('./index'));
  } catch (error) {
    console.log(chalk.red(`  ✗ Could not load orchestration engine: ${error.message}\n`));
    return { success: false, exitCode: 1, state };
  }

  const bob = new BobOrchestrator(projectRoot, { userGoal: brief });
  const result = await bob.orchestrate({ userGoal: brief, storyPath: options.storyPath });

  printEngineResult(result);

  return {
    success: !!(result && result.success),
    exitCode: result && result.success === false ? 1 : 0,
    state,
    result,
  };
}

module.exports = { build };
