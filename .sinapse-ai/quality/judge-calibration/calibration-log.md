# LLM-Judge Calibration Log

Versioned record of semantic (v2) calibration runs. Each entry measures the real LLM judge's
agreement with the human-labeled scenarios in `scenarios.json`, using the production
`_parseVerdict` for extraction. Labels are law; a systematic miss becomes rubric analysis here,
never a label edit to inflate agreement.

---

## Run 2026-07-06 — first recorded measurement

| Field | Value |
|-------|-------|
| Date | 2026-07-06 |
| Judge model | frontier tier (Opus-class), via the QA executor prompt contract + quality-gate severity rubric |
| Scenarios | 14 (human-labeled: 4 approved, 5 blocked, 5 needs_revision) |
| Judgments | 42 (3 blind independent judgments per scenario) |
| Extraction | production `Epic6Executor.prototype._parseVerdict` (no re-implementation) |
| **Agreement** | **40/42 = 95.2%** |
| Scenarios majority-correct | 13/14 |
| Target (README v2) | ≥ 90% — **met** |

### Confusion matrix (expected → predicted)

| Expected \ Predicted | approved | needs_revision | blocked |
|---|---|---|---|
| **approved** (12) | 12 | 0 | 0 |
| **needs_revision** (13) | 2 | 13 | 0 |
| **blocked** (15) | 0 | 0 | 15 |

Read: every `blocked` scenario (all 15 judgments across 5 critical scenarios — SQL injection,
hardcoded secret, RLS dropped, auth bypass, destructive migration) was caught with **zero misses**.
Every clear `approved` and `needs_revision` scenario was unanimous. The only divergence is a single
borderline scenario, below.

### Divergences (2 of 42)

**`stale-todo-and-debug-logs`** — human label `needs_revision`, judge said `approved` on 2 of 3
independent judgments (the 3rd agreed: `needs_revision`).

- Scenario: implementation meets all ACs and 34 tests pass, but the diff leaves 6
  `console.log('DEBUG cart=', cart)` in the payment path and 2 unresolved `TODO: 3DS fallback` on
  code that throws a generic error.
- Judge reasoning (approvers): treated both as **MEDIUM technical debt** — "remove the debug logs in
  a fast-follow cleanup and open a tracked story… since ACs are met, tests green, no security/data
  risk, this does not block completion."
- Judge reasoning (the dissenter): "the payment-path debug logs are a cheap fix I expect done before
  merge, which puts this just short of approval."
- **Analysis:** this is a legitimate **MEDIUM-vs-HIGH severity boundary call**, not a miscalibration.
  The human label treats "ship debug noise + unresolved TODOs in the changed lines" as fix-before-merge
  (HIGH → needs_revision); the judge majority treats it as document-as-debt (MEDIUM → approved). The
  split judgment (2 approve / 1 revise) shows the model itself sees the case as borderline. Reasonable
  human reviewers disagree here too.

### Verdict on this run

The judge is **well-calibrated** at 95.2%, comfortably above the 90% target, with a **perfect record
on all CRITICAL/blocking cases** — the highest-stakes class. The one divergence is a known-ambiguous
MEDIUM/HIGH boundary, not a systematic gap. **No rubric change is warranted from this run.** If a
future run shows the judge systematically down-grading fix-before-merge issues to debt (a pattern, not
a single borderline case), that would justify a story to sharpen the severity rubric's MEDIUM/HIGH
line — captured here as a watch item, not an action.

### Method notes

- Judgments were **blind**: scenarios were fed without their expected labels; each of the 3 judgments
  per scenario ran as an independent agent with no shared context.
- Prompt contract mirrors production (`epic-6-executor.js` `_reviewViaAgent`): free-form review prose
  ending in a single `VERDICT:` line, plus the quality-gate severity policy.
- Raw judgment outputs are not committed (bulk); this log is the durable aggregate.
