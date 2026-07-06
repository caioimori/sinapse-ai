# LLM-Judge Calibration

> Story `mesa2-llm-judge-calibration` · AF-20260704 Mesa #2.
> Addresses the finding "the LLM judge decides Done without calibration" — the literal
> gap (no golden set, no documented process) is now closed; the semantic layer (v2) has a
> baseline + procedure but no recorded agreement number yet (it has not been run).

## What the judge is

The agent that decides whether a story is **Done** is `@quality-gate`, invoked by
`Epic6Executor` (`.sinapse-ai/core/orchestration/executors/epic-6-executor.js`). It emits
free-form review prose ending in a line `VERDICT: APPROVED | NEEDS_REVISION | BLOCKED`.
`_parseVerdict(output)` turns that prose into the binary verdict — and `APPROVED` is what
marks the work Done. So there are **two layers** to a correct verdict:

1. **Semantic judgment (the LLM):** did the agent reach the *right* verdict for the change?
2. **Verdict extraction (deterministic code):** did `_parseVerdict` correctly read the verdict
   the agent expressed? This is the seam where "LLM prose" becomes "system decides Done."

## The golden set

`golden-set.json` is the **human baseline**: realistic review outputs, each labeled with the
verdict a human considers correct, with a rationale. It is balanced across all three verdicts and
includes the tricky edges (no explicit `VERDICT:` line, spaced/hyphenated tokens, conflicting
signals where an explicit verdict must win, empty output that must never read as approval, and the
"a blocker dominates" precedence).

A golden label is **law**. If a case is ambiguous, fix the label — do not loosen the gate.

## v1 — deterministic calibration (automated, CI-gated)

`npm run calibrate:judge` runs the **real** `_parseVerdict` (imported via
`Epic6Executor.prototype`, never re-implemented) over every golden output and requires **100%**
agreement with the human labels. It reports an expected→predicted confusion map. Because
`_parseVerdict` is deterministic, any disagreement means one of two things — the parser regressed,
or a label is wrong — and both demand action. This is also enforced in CI by
`tests/scripts/calibrate-judge.test.js`.

What this layer guarantees is the **safe direction** of the extraction seam: for the recognized
verdict vocabulary it reads the expressed verdict faithfully, and outside it, it **never fabricates
approval and never silently flips an explicit verdict** — out-of-vocabulary or prose-only approvals
fall to the safe non-approving default by design.

## v2 — semantic calibration (live, periodic, NOT in CI)

Calibrating the LLM's *judgment* requires running the real `@quality-gate` agent, which is
non-deterministic and costly (and spawns a nested `claude` process that is unreliable on some
platforms — see the executor's Windows note). It is therefore a **documented periodic procedure**,
not a CI gate:

1. Take the `scenario` behind each golden case (the code change + test state that would produce
   such a review) from `scenarios.json`, feed it to the real `@quality-gate` judge.
2. Compare the agent's emitted verdict (extracted with the production `_parseVerdict`) to the
   golden `expected`.
3. Track agreement over time. Target: **≥ 90%** agreement on the golden scenarios; below that, the
   judge prompt/rubric needs work.

### Latest measurement

**First recorded run — 2026-07-06: 40/42 = 95.2% agreement** (13/14 scenarios majority-correct;
**perfect 15/15 on all CRITICAL/blocking cases**). Above the 90% target; the single divergence is a
known-ambiguous MEDIUM-vs-HIGH severity boundary, not a systematic gap. Full breakdown, confusion
matrix, and divergence analysis in [`calibration-log.md`](./calibration-log.md).

> **Honesty note.** v1 does not auto-calibrate the LLM's judgment — it locks the deterministic seam
> and provides the human baseline + procedure for the semantic layer. Do not claim the LLM judge is
> "calibrated" from a green CI alone. The v2 number above is a point-in-time live measurement, not a
> CI-enforced guarantee; re-run periodically (labels are law — a systematic miss becomes rubric work,
> never a label edit).

## Feedback loop

When the judge decides Done **wrongly** in production (approves broken work, or blocks good work),
capture that review output as a **new golden case** with the correct human label. The golden set
grows from real misses, so the calibration tracks reality instead of a frozen synthetic snapshot.
