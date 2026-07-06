#!/usr/bin/env node
/**
 * Lint guard: Constitution consistency across CLAUDE.md ⇄ AGENTS.md (+ source,
 * install template, rules). Story rodada2-m5 (AF-20260704 Mesa #7).
 *
 * The Mesa item framed CLAUDE.md and AGENTS.md as "twins that drift" and asked
 * to generate both from one source. Verification REFUTED that premise: the two
 * files serve different surfaces (Claude Code vs Codex), share almost no verbatim
 * body, and their only shared canon — the ecosystem counts and the Constitution
 * article set — is already single-sourced. Counts are guarded by
 * `validate:agents-md`; the article agreement is validated by the
 * `constitution-consistency` doctor check.
 *
 * The real, narrow gap this guard closes: that doctor check ran only under
 * `sinapse doctor` and the install matrix — NOT on the PR gate. So article drift
 * between CLAUDE.md and AGENTS.md could merge unnoticed. This wraps the SAME
 * existing check (no new logic, no twin-generator) so it runs on every push/PR.
 *
 * Exit 0 = consistent (PASS/WARN) · Exit 1 = FAIL (a consumer is missing a
 * canonical article, or the source/rules are missing).
 *
 * @module scripts/validate-constitution
 */

'use strict';

const path = require('path');

const check = require('../.sinapse-ai/core/doctor/checks/constitution-consistency');

async function main() {
  const projectRoot = path.resolve(__dirname, '..');
  let result;
  try {
    result = await check.run({ projectRoot });
  } catch (err) {
    // The check declares onError:'fail' — a thrown error is a real problem.
    console.error(`FAIL — constitution-consistency threw: ${err.message}`);
    process.exit(1);
  }

  const status = result.status || 'FAIL';
  if (status === 'PASS') {
    console.log(`OK — ${result.message}`);
    process.exit(0);
  }
  if (status === 'WARN') {
    // Minor divergence (≤2 issues) — surface it but do not block (matches the
    // doctor severity gradation; Art. XI, avoid over-tightening the gate).
    console.warn(`WARN — ${result.message}`);
    process.exit(0);
  }
  console.error(`FAIL — ${result.message}`);
  if (result.fixCommand) console.error(`  fix: ${result.fixCommand}`);
  process.exit(1);
}

main();
