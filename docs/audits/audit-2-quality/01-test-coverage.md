# Audit 2 — Sub-Report 1: Test Coverage

**Date:** 2026-04-28
**Verdict:** YELLOW
**Method:** `npm run test:coverage` (Jest, full run)

## Executive Numbers

| Metric | Value | GA Target | Verdict |
|---|---:|---:|---|
| Statements | 35.58% | >=70% | RED |
| Branches | 33.12% | >=60% | RED |
| Functions | 38.62% | >=70% | RED |
| Lines | 35.69% | >=70% | RED |
| Test suites passing | 337/360 | — | YELLOW (23 skipped) |
| Tests passing | 11003/11228 | — | YELLOW (225 skipped) |
| Snapshots | 0 | — | OK |
| Wall time | 75.6s | <120s | OK |

## Critical Path Coverage

Files in critical-path with **0%** coverage (P0):

| File | LOC | Coverage | Risk |
|---|---:|---:|---|
| `packages/sinapse-install/src/capabilities/chrome-brain.js` | 1145 | 0% | P0 — Chrome Brain install path totally untested |
| `packages/sinapse-pro-cli/bin/sinapse-pro.js` | 232 | 0% | P0 — Pro CLI entrypoint untested |
| `scripts/apply-persona-disclaimer.js` | 117 | 0% | P2 |
| `scripts/code-intel-health-check.js` | 343 | 0% | P1 — health check itself untested |
| `scripts/package-synapse.js` | 324 | 0% | P1 |
| `scripts/reconcile-squad-manifests.js` | 218 | 0% | P1 |
| `scripts/sinapse-patch.js` | 218 | 0% | P2 |
| `scripts/sync-counts.js` | 159 | 0% | P1 — Article VII metric integrity |
| `scripts/validate-package-completeness.js` | 317 | 0% | P1 — publish gate |
| `scripts/validate-sinapse-ai-deps.js` | 161 | 0% | P1 |

Files with **<30%** coverage in critical path (P1):

| File | Coverage | Notes |
|---|---:|---|
| `scripts/validate-manifest.js` | 6.30% | Manifest validation gate (Audit 1 P1) |
| `scripts/ensure-manifest.js` | 28.94% | Pre-commit hook entry |
| `packages/sinapse-install/src/edmcp/index.js` | 21.23% | MCP installation |

## Skipped Tests (P2)

23 test suites and 225 tests are skipped. These should be either:
- Re-enabled with fixes, OR
- Deleted with rationale

Risk: skipped tests rot silently and become deadweight.

## Findings

| ID | Sev | Finding | Evidence |
|---|---|---|---|
| Q1.1 | P1 | Coverage 35.58% (statements) — far below industry-standard 70% for GA | jest output |
| Q1.2 | P0 | `chrome-brain.js` (1145 LOC) — flagship capability, **0%** coverage | coverage report |
| Q1.3 | P0 | `sinapse-pro.js` (232 LOC) — Pro CLI entrypoint, **0%** coverage | coverage report |
| Q1.4 | P1 | `validate-manifest.js` 6.3% — publish-blocking gate barely exercised | coverage report |
| Q1.5 | P2 | 225 skipped tests, no central rationale doc | jest summary |
| Q1.6 | P1 | `sync-counts.js` 0% — Article VII (metric integrity) untested | coverage report |
| Q1.7 | P2 | No coverage threshold enforced in `jest.config` (couldn't be verified to fail PR) | jest config |

## Reproducibility

```bash
npm run test:coverage 2>&1 | tail -10
# => 35.58% statements, 33.12% branches
```

## Recommended Stories (Bloco Fix)

- **Story Q1-A (P0):** Add smoke tests for `chrome-brain.js` (install path happy + 2 error branches)
- **Story Q1-B (P0):** Add smoke tests for `sinapse-pro.js` CLI entrypoint
- **Story Q1-C (P1):** Add tests for `validate-manifest.js` (raise to >=60%)
- **Story Q1-D (P1):** Add tests for `sync-counts.js` (Article VII protection)
- **Story Q1-E (P2):** Audit 225 skipped tests — re-enable or delete with rationale doc
- **Story Q1-F (P2):** Add `coverageThreshold` to `jest.config` at conservative `{statements: 35, branches: 30}` to prevent regression; raise per quarter
