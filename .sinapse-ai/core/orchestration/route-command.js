/**
 * Route Command — read-only doc-first routing observability.
 *
 * Renders the deterministic routing decision for a briefing: project type →
 * workflow → required upstream docs (exist/missing) → doc-first gate verdict.
 *
 * Intentionally lightweight: requires ONLY `doc-first-resolver` (fs + constants)
 * and chalk. It does NOT pull the heavy orchestration index, so it has no side
 * effects and no agent spawning.
 *
 * NOTE: a machine-readable `--json` mode was intentionally deferred — the
 * framework emits an activation/cleanup summary to stdout on process exit
 * (the same trailing line seen on `sinapse orchestrate`), which would corrupt
 * strict JSON output. Programmatic consumers should require `doc-first-resolver`
 * directly (clean, no side effects) instead of parsing this command's stdout.
 *
 * @module core/orchestration/route-command
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
    green: id, red: id, yellow: id, cyan: Object.assign(id, { bold: id }),
    gray: id, bold: id, dim: id,
  };
}

/**
 * Execute the `route` command.
 *
 * @param {string} brief - User briefing (e.g. "criar um site pra X")
 * @param {Object} [options]
 * @param {string} [options.projectRoot] - Project root path
 * @param {string} [options.type] - Explicit project_type override
 * @returns {Promise<{success:boolean, exitCode:number, state:Object}>}
 */
async function route(brief, options = {}) {
  const projectRoot = options.projectRoot || process.cwd();
  const state = resolveDocFirstState({ projectRoot, brief, projectType: options.type });

  const ok = (b) => (b ? chalk.green('✓') : chalk.red('✗'));
  const briefLabel = brief ? `"${brief}"` : '(no brief — using project state only)';

  console.log(chalk.cyan('\n═══════════════════════════════════════════════════════════'));
  console.log(chalk.cyan.bold('  🧭 SINAPSE Doc-First Routing'));
  console.log(chalk.cyan('═══════════════════════════════════════════════════════════\n'));

  console.log(`Brief:        ${chalk.gray(briefLabel)}`);
  console.log(
    `Project type: ${chalk.bold(state.projectType)}` +
      (state.classified ? '' : chalk.gray('  (default — not matched from brief)')),
  );
  console.log(`Workflow:     ${chalk.bold(state.workflow || 'SDC (no upstream re-doc)')}\n`);

  if (state.artifacts.length) {
    console.log(chalk.bold('Required upstream documents:'));
    console.log(chalk.gray('  ┌──────────────────┬────────────────────────────────────┬────────┐'));
    console.log(chalk.gray('  │ Document         │ Path                               │ Status │'));
    console.log(chalk.gray('  ├──────────────────┼────────────────────────────────────┼────────┤'));
    for (const a of state.artifacts) {
      console.log(`  │ ${a.id.padEnd(16)} │ ${a.path.padEnd(34)} │   ${ok(a.exists)}    │`);
    }
    console.log(chalk.gray('  └──────────────────┴────────────────────────────────────┴────────┘\n'));
  }

  console.log(chalk.bold('Doc-first gate (required before code):'));
  if (state.isLightType) {
    console.log(chalk.gray('  (light task — rides on existing project; only a Ready story is required)'));
    console.log(`  ${ok(state.gate.readyStory)} Story (status >= Ready)`);
  } else {
    console.log(`  ${ok(state.gate.prd)} PRD            ${chalk.gray('docs/prd.md')}`);
    console.log(`  ${ok(state.gate.epic)} Epic           ${chalk.gray('docs/epics/')}`);
    console.log(`  ${ok(state.gate.readyStory)} Story (Ready)  ${chalk.gray('docs/stories/')}`);
  }

  console.log('');
  if (state.gate.satisfied) {
    console.log(chalk.green.bold('  ✅ GATE SATISFIED — implementation may proceed.\n'));
  } else {
    console.log(chalk.red.bold('  🚫 GATE BLOCKED — missing: ' + state.gate.missing.join(', ')));
    console.log(
      chalk.gray(`     Run the ${state.workflow || 'SDC'} flow to produce these before any code.\n`),
    );
  }

  return { success: true, exitCode: 0, state };
}

module.exports = { route };
