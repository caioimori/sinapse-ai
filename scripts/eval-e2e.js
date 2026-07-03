#!/usr/bin/env node

/**
 * eval-e2e.js — behavioral regression eval for the epic GateEvaluator.
 *
 * Story onda3-s4-behavioral-eval-regression (AF-20260702 item 3.1).
 *
 * Two layers:
 *
 *   DETERMINISTIC (always runs, merge gate): replays the versioned golden set
 *   (tests/evals/epic-gates/cases.json) against the REAL orchestration
 *   GateEvaluator with the DEFAULT gate config pinned (repo-local overrides in
 *   core-config.yaml never bend the baseline). Every case is a measured bug
 *   from the 2026-06-30 checkpoints — or a control case. Any mismatch = exit 1.
 *
 *   LLM ARM PREFLIGHT (opt-in: --llm or SINAPSE_EVAL_LLM=1): verifies that a
 *   `claude` binary is spawnable and prints the exact 2-arm measurement
 *   protocol commands (tests/evals/epic-gates/PROTOCOL.md). When the spawn is
 *   unavailable (known Windows nested-spawn limitation, KNOWN-LIMITATIONS of
 *   epic-orchestration-consolidation) it reports EVAL_LLM_SKIPPED with the
 *   reason — an explicit skip, never a fake pass.
 *
 * Usage:
 *   npm run eval:e2e
 *   node scripts/eval-e2e.js [--llm]
 */

'use strict';

const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const ROOT = path.resolve(__dirname, '..');
const CASES_PATH = path.join(ROOT, 'tests', 'evals', 'epic-gates', 'cases.json');
const PROTOCOL_PATH = path.join('tests', 'evals', 'epic-gates', 'PROTOCOL.md');

const {
  GateEvaluator,
  DEFAULT_GATE_CONFIG,
} = require(path.join(ROOT, '.sinapse-ai', 'core', 'orchestration', 'gate-evaluator'));

/**
 * Assert one golden case against a live gate result.
 * @returns {string[]} List of mismatch descriptions (empty = pass)
 */
function assertCase(caseObj, result) {
  const failures = [];
  const expect = caseObj.expect || {};

  if (expect.verdict && result.verdict !== expect.verdict) {
    failures.push(`verdict: expected "${expect.verdict}", got "${result.verdict}"`);
  }

  if (typeof expect.scoreEquals === 'number' && Math.abs(result.score - expect.scoreEquals) > 0.01) {
    failures.push(`score: expected ${expect.scoreEquals}, got ${result.score}`);
  }

  for (const name of expect.failedChecks || []) {
    const check = result.checks.find((c) => c.name === name);
    if (!check) failures.push(`failed check "${name}": not evaluated at all`);
    else if (check.passed) failures.push(`failed check "${name}": expected FAIL, got PASS`);
  }

  for (const name of expect.passedChecks || []) {
    const check = result.checks.find((c) => c.name === name);
    if (!check) failures.push(`passed check "${name}": not evaluated at all`);
    else if (!check.passed) failures.push(`passed check "${name}": expected PASS, got FAIL (${check.message})`);
  }

  for (const name of expect.issues || []) {
    if (!result.issues.some((i) => i.check === name)) {
      failures.push(`issue "${name}": expected present, not found`);
    }
  }

  return failures;
}

async function runDeterministicLayer() {
  const suite = JSON.parse(fs.readFileSync(CASES_PATH, 'utf8'));
  console.log(`=== eval:e2e — ${suite.suite} (${suite.cases.length} cases) ===`);

  let failedCases = 0;
  for (const caseObj of suite.cases) {
    // Fresh evaluator per case; DEFAULT config pinned so repo-local
    // core-config.yaml overrides can never bend the behavioral baseline.
    const evaluator = new GateEvaluator({
      projectRoot: ROOT,
      strictMode: Boolean(caseObj.strictMode),
      gateConfig: DEFAULT_GATE_CONFIG,
    });

    const result = await evaluator.evaluate(caseObj.gate.from, caseObj.gate.to, caseObj.epicResult);
    const failures = assertCase(caseObj, result);

    if (failures.length === 0) {
      console.log(`  PASS  ${caseObj.id}`);
    } else {
      failedCases += 1;
      console.log(`  FAIL  ${caseObj.id}`);
      for (const f of failures) console.log(`        - ${f}`);
    }
  }

  console.log('');
  if (failedCases > 0) {
    console.log(`eval:e2e: FAIL — ${failedCases}/${suite.cases.length} behavioral case(s) regressed.`);
    return false;
  }
  console.log(`eval:e2e: OK — all ${suite.cases.length} behavioral cases passed.`);
  return true;
}

function runLlmArmPreflight() {
  console.log('');
  console.log('=== eval:e2e — LLM arm preflight ===');
  try {
    const version = execFileSync('claude', ['--version'], {
      encoding: 'utf8',
      timeout: 30000,
      shell: process.platform === 'win32',
    }).trim();
    console.log(`claude spawnable: ${version}`);
    console.log(`Protocolo de medição 2 braços: ${PROTOCOL_PATH}`);
    console.log('Execute os braços conforme o protocolo e registre o scoreboard no checkpoint.');
    return true;
  } catch (error) {
    console.log(`EVAL_LLM_SKIPPED: claude não spawnável daqui (${error.message.split('\n')[0]}).`);
    console.log('Motivo conhecido no Windows: spawn aninhado falha (KNOWN-LIMITATIONS,');
    console.log('epic-orchestration-consolidation). Rode o braço LLM via harness ou em');
    console.log(`ambiente com spawn direto, seguindo ${PROTOCOL_PATH}.`);
    return true; // skip explícito não é falha — mas nunca é reportado como PASS do braço
  }
}

async function main() {
  const wantLlm = process.argv.includes('--llm') || process.env.SINAPSE_EVAL_LLM === '1';

  const deterministicOk = await runDeterministicLayer();
  if (wantLlm) runLlmArmPreflight();

  process.exit(deterministicOk ? 0 : 1);
}

main().catch((error) => {
  console.error(`eval:e2e crashed: ${error.message}`);
  process.exit(1);
});
