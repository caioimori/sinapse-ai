# Audit 2 — Sub-Report 6: Lint Baseline

**Date:** 2026-04-28
**Verdict:** GREEN (zero errors) / YELLOW (warning hygiene)
**Method:** `npm run lint`

## Numbers

| Metric | Audit 1 (handoff) | Audit 2 (now) | Delta |
|---|---:|---:|---:|
| Errors | 0 | **0** | 0 |
| Warnings | 358 | **359** | +1 |
| Auto-fixable warnings | unknown | **329** | — |
| Manual-fix warnings | unknown | **30** | — |

## Verdict

**Zero errors = GA-blocker absent.** Warnings count drifted +1 since Audit 1 baseline (358→359), suggesting no enforcement gate on warning count.

## Warning Composition (sample analysis)

Most warnings are stylistic:
- `comma-dangle` (missing trailing commas in test files) — auto-fixable
- `prefer-const` (let → const) — auto-fixable
- Other minor — auto-fixable

The 30 manual-fix warnings are not yet categorized but represent the harder hygiene work.

## Findings

| ID | Sev | Finding | Evidence |
|---|---|---|---|
| Q6.1 | P2 | 329 of 359 warnings are auto-fixable via `eslint --fix` — one PR could clear 92% of the noise | `npm run lint` output |
| Q6.2 | P2 | Warning count drifted +1 since Audit 1 (358→359) — no enforcement gate prevents regression | comparison |
| Q6.3 | P3 | No `--max-warnings` constraint in lint script. Could pin at current baseline to stop drift. | `package.json:64` |
| Q6.4 | P3 | 30 manual warnings not yet triaged into "fix" vs "rule-disable with rationale" | manual review needed |

## Recommended Stories (Bloco Fix)

- **Story Q6-A (P2):** Run `eslint --fix` on entire repo, commit cleanup (one PR, ~329 warning reduction)
- **Story Q6-B (P2):** Triage remaining ~30 manual warnings: fix in-place or document rule exception
- **Story Q6-C (P3):** Pin `--max-warnings` baseline in `npm run lint` to prevent drift (after Q6-A/B brings to target)
