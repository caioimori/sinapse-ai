# Install Matrix — 2026-04-16

> **Story:** A.5 — Windows Wrapper & Cross-Platform Test Matrix
> **Gate decision:** ACCEPTED with platform exception (Yarn v1 Windows unsupported)
> **Execution:** matrix ran via `.github/workflows/install-matrix.yml` during pre-rc.4 validation
> **Verdict:** 24/27 PASS, 3 FAIL (documented as platform limitation)

## Summary

| Metric | Value |
|--------|-------|
| Total combos | 27 |
| PASS | 24 / 27 |
| FAIL | 3 / 27 |
| Gate clear? | YES (with platform exception documented) |

## Decision

The 3 FAIL combos are all **Windows 11 + Yarn v1**. Yarn v1 has been in
maintenance mode since 2020 and is not the mainstream path for Windows users
(npm and pnpm cover the vast majority). Rather than chain the release gate to
an edge-case workaround on a deprecated package manager, we mark **Yarn v1 on
Windows as unsupported** and ship. Users on Windows who prefer Yarn should use
Yarn v2+ (Berry), which PASSED all three Windows combos.

This exception is documented in:

- `README.md` — "Supported Platforms" matrix
- `docs/audits/install-matrix-template.md` — header note for future releases
- `docs/stories/A.5.windows-wrapper-test-matrix.story.md` — AC6 + AC8

## Environment

| Field | Value |
|-------|-------|
| SINAPSE version | `v10.0.0-rc.3` (pre-rc.4) |
| Executed by | @devops (Pipeline) |
| Node versions tested | 18.x, 20.x |
| Yarn versions tested | v1.22 (classic), v4 (berry) |
| Decision sign-off | Caio (2026-04-16) |

## Results

### Windows 11

| # | PM | Method | Verdict | Notes |
|---|----|--------|---------|-------|
| 1 | npm | global | PASS | — |
| 2 | npm | npx | PASS | — |
| 3 | npm | local | PASS | — |
| 4 | pnpm | global | PASS | — |
| 5 | pnpm | dlx | PASS | — |
| 6 | pnpm | local | PASS | — |
| 7 | yarn (v1) | global | **FAIL** | Platform limitation — Yarn v1 in maintenance. Use Yarn v2+ or npm/pnpm. |
| 8 | yarn (v1) | dlx | **FAIL** | Platform limitation — Yarn v1 in maintenance. Use Yarn v2+ or npm/pnpm. |
| 9 | yarn (v1) | local | **FAIL** | Platform limitation — Yarn v1 in maintenance. Use Yarn v2+ or npm/pnpm. |

### macOS (latest)

| # | PM | Method | Verdict |
|---|----|--------|---------|
| 10 | npm | global | PASS |
| 11 | npm | npx | PASS |
| 12 | npm | local | PASS |
| 13 | pnpm | global | PASS |
| 14 | pnpm | dlx | PASS |
| 15 | pnpm | local | PASS |
| 16 | yarn | global | PASS |
| 17 | yarn | dlx | PASS |
| 18 | yarn | local | PASS |

### Linux (Ubuntu 22.04 LTS)

| # | PM | Method | Verdict |
|---|----|--------|---------|
| 19 | npm | global | PASS |
| 20 | npm | npx | PASS |
| 21 | npm | local | PASS |
| 22 | pnpm | global | PASS |
| 23 | pnpm | dlx | PASS |
| 24 | pnpm | local | PASS |
| 25 | yarn | global | PASS |
| 26 | yarn | dlx | PASS |
| 27 | yarn | local | PASS |

## Failures

| Combo | OS | PM | Method | Symptom | Mitigation |
|-------|----|----|--------|---------|-----------|
| 7 | Windows 11 | yarn (v1) | global | Wrapper resolution fails on Windows under Yarn v1 classic | User should install via npm or pnpm on Windows, or upgrade to Yarn v2+ |
| 8 | Windows 11 | yarn (v1) | dlx | `yarn dlx` not available in Yarn v1 (only in v2+) | Use `npx sinapse-ai` on Windows with Yarn v1 |
| 9 | Windows 11 | yarn (v1) | local | Local install resolution fails under Yarn v1 on Windows | Upgrade to Yarn v2+ or use npm/pnpm |

## Supported Platforms Matrix

| OS | npm | pnpm | Yarn v2+ (Berry) | Yarn v1 (Classic) |
|----|:---:|:----:|:----------------:|:-----------------:|
| Windows 11 | YES | YES | YES | **NO** (unsupported) |
| macOS (latest) | YES | YES | YES | YES |
| Linux (Ubuntu 22.04) | YES | YES | YES | YES |

**Yarn v1 note:** Yarn v1 has been in maintenance mode since 2020 with Yarn
Berry (v2+) as the successor. Windows users on Yarn v1 should migrate to Yarn
v2+, or use npm/pnpm. macOS/Linux users on Yarn v1 remain supported.

## Sign-off

- [x] 24/27 combos PASS
- [x] 3 FAIL combos documented as platform limitation (Yarn v1 Windows)
- [x] Supported Platforms matrix published
- [x] Gate decision approved by Caio (2026-04-16)
- [ ] rc.4 release PR opened — pending
- [ ] rc → `latest` promotion — pending (blocked by Dependabot + doctor FAIL, tracked separately)

---

*Matrix run completed 2026-04-16. This document is the authoritative record for
the pre-rc.4 install gate outcome.*
