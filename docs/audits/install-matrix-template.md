# Install Matrix — {DATE}

> **Story:** A.5 — Windows Wrapper & Cross-Platform Test Matrix
> **Gate:** rc → `latest` (all 27 combos MUST be PASS before promotion)
> **Execution:** filled in after `.github/workflows/install-matrix.yml` runs on the release PR
> **Template** — copy this file to `docs/audits/install-matrix-{YYYY-MM-DD}.md` and fill in results.

## How to fill this file

1. Open the release PR (label `release` or touching `package.json` / `CHANGELOG.md`).
2. Wait for the `install-matrix.yml` workflow to complete on all three OSes.
3. For each row, copy the `PASS`/`FAIL` verdict from the corresponding matrix job.
4. For any `FAIL`, link the relevant GitHub Actions log URL and open a blocking issue.
5. Gate: all 27 combos MUST be `PASS` before the rc is promoted to `latest`.

## Environment

| Field | Value |
|-------|-------|
| SINAPSE version | `v10.0.0-rc.X` |
| Workflow run URL | https://github.com/SinapseAI/sinapse-ai/actions/runs/XXXXXXXXXX |
| Executed by | @devops (Pipeline) |
| Node versions tested | 18.x, 20.x (matrix) |

## Results

Each row records: OS, package manager, install method, `sinapse`-in-PATH, `@developer`-callable, `doctor` exit code, output line count, verdict.

### Windows 11

| # | PM | Method | in-PATH | `@developer` | `doctor` exit | output lines | Verdict |
|---|----|--------|---------|--------------|---------------|--------------|---------|
| 1 | npm | global | ? | ? | ? | ? | PENDING |
| 2 | npm | npx | ? | ? | ? | ? | PENDING |
| 3 | npm | local | ? | ? | ? | ? | PENDING |
| 4 | pnpm | global | ? | ? | ? | ? | PENDING |
| 5 | pnpm | dlx | ? | ? | ? | ? | PENDING |
| 6 | pnpm | local | ? | ? | ? | ? | PENDING |
| 7 | yarn | global | ? | ? | ? | ? | PENDING |
| 8 | yarn | dlx | ? | ? | ? | ? | PENDING |
| 9 | yarn | local | ? | ? | ? | ? | PENDING |

### macOS (latest)

| # | PM | Method | in-PATH | `@developer` | `doctor` exit | output lines | Verdict |
|---|----|--------|---------|--------------|---------------|--------------|---------|
| 10 | npm | global | ? | ? | ? | ? | PENDING |
| 11 | npm | npx | ? | ? | ? | ? | PENDING |
| 12 | npm | local | ? | ? | ? | ? | PENDING |
| 13 | pnpm | global | ? | ? | ? | ? | PENDING |
| 14 | pnpm | dlx | ? | ? | ? | ? | PENDING |
| 15 | pnpm | local | ? | ? | ? | ? | PENDING |
| 16 | yarn | global | ? | ? | ? | ? | PENDING |
| 17 | yarn | dlx | ? | ? | ? | ? | PENDING |
| 18 | yarn | local | ? | ? | ? | ? | PENDING |

### Linux (Ubuntu 22.04 LTS)

| # | PM | Method | in-PATH | `@developer` | `doctor` exit | output lines | Verdict |
|---|----|--------|---------|--------------|---------------|--------------|---------|
| 19 | npm | global | ? | ? | ? | ? | PENDING |
| 20 | npm | npx | ? | ? | ? | ? | PENDING |
| 21 | npm | local | ? | ? | ? | ? | PENDING |
| 22 | pnpm | global | ? | ? | ? | ? | PENDING |
| 23 | pnpm | dlx | ? | ? | ? | ? | PENDING |
| 24 | pnpm | local | ? | ? | ? | ? | PENDING |
| 25 | yarn | global | ? | ? | ? | ? | PENDING |
| 26 | yarn | dlx | ? | ? | ? | ? | PENDING |
| 27 | yarn | local | ? | ? | ? | ? | PENDING |

## Summary

| Metric | Value |
|--------|-------|
| Total combos | 27 |
| PASS | 0 / 27 |
| FAIL | 0 / 27 |
| PENDING | 27 / 27 |
| Gate clear? | NO |

## Failures

(None yet — fill in if any combos report FAIL.)

| Combo | OS | PM | Method | Symptom | Log URL | Blocking issue |
|-------|----|----|--------|---------|---------|----------------|

## Sign-off

- [ ] All 27 combos PASS
- [ ] No blocking issues open
- [ ] rc → `latest` promotion approved by @devops

---

*Template version 1.0 — created 2026-04-15 as part of Story A.5.*
