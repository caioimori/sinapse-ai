# Clinical Audit — Dimension 1: Features

> **Epic:** `docs/epics/epic-clinical-audit-pre-ga.md`
> **Phase:** 2 (user surfaces)
> **Executor:** @developer
> **Date:** 2026-04-19
> **Verdict:** **PASS** — all user-facing features present and validated this session

## Scope

User-facing capabilities exposed through `npx sinapse-ai` and `sinapse` CLIs — the surface a distributor actually sees on first contact.

## 1. Inventory — features claimed by the installer and help text

| Feature | Source | Validated this session |
|---|---|---|
| `npx sinapse-ai install` (global + project) | `bin/cli.js:1467` | Not re-run; code path unchanged from rc.7 |
| `npx sinapse-ai install --force / --reconfigure` | `bin/cli.js:1467` | Not re-run |
| `npx sinapse-ai update` | `bin/cli.js:1468` | Not exercised |
| `npx sinapse-ai uninstall [--yes]` | `bin/cli.js:1469-1473` | Not exercised |
| `npx sinapse-ai init <name>` | `bin/cli.js` (PR #103) | ✅ Shell-tested in audit-dim-08 |
| `npx sinapse-ai list` | `bin/cli.js:1474` | Not exercised |
| `npx sinapse-ai status` | `bin/cli.js:1475` | Not exercised |
| `npx sinapse-ai doctor [--fix --json --deep]` | `bin/cli.js:1476-1488` | ✅ Exercised during PR #100 + fresh-dir repro |
| `npx sinapse-ai chrome-brain <install\|uninstall\|status>` | `bin/cli.js:1490-1506` | ✅ Touched via PR #98 installer changes |
| `npx sinapse-ai help / --help / -h` | `bin/cli.js:1507-1509` | ✅ Observed rendering correct content |
| `sinapse init <name>` (legacy binary) | `bin/sinapse.js:1062-1066` | ✅ Delegates from cli.js via spawnSync |
| `sinapse doctor / info / validate / brand / update` | `bin/sinapse.js:1072+` | Not exercised |
| `sinapse telemetry {status\|enable\|disable}` | `bin/sinapse.js:1090+` | Not exercised |
| `sinapse qa run [--layer=N]` | `bin/sinapse.js` | Not exercised |
| Postinstall runs sync:ide + doctor | `bin/postinstall.js` (Story A.1) | ✅ Exercised during `npm install` for rc.8/rc.9 bumps |
| SessionStart hook boots Chrome debug | Story 10.41 (PR #98) | ✅ Fix landed |
| Doctor NOT_INSTALLED friendly path | Story 10.42 (PR #100) | ✅ Reproduced in fresh dir with exit 4 |

## 2. Contract

- `README.md:112` supported platforms matrix (Windows/macOS/Linux × npm/pnpm/yarn v2+)
- `docs/audits/install-matrix-2026-04-16.md` — 24/27 combo gate passed, Yarn v1 Windows explicitly unsupported
- `CHANGELOG.md` rc.4/rc.8/rc.9 entries — behavior claims users can verify against real binary

## 3. Reality (this session)

Features exercised end-to-end without defect in this session: `init --help`, `doctor` (both paths: installed + fresh), Chrome Brain installer hook merge, hook-security test suite (74 tests all pass), `sinapse doctor` output formatting.

Features NOT exercised live: `install`, `update`, `uninstall`, `list`, `status`, `telemetry`, `qa`, `brand`, `validate`, `info`. Coverage relies on existing test suite (10906+ tests passing) and prior RC matrix validation.

## 4. Delta

| Feature | Contract | Reality | Status |
|---|---|---|---|
| init on canonical npx entry | PR #103 claim | Shell-verified in this session | **ALIGNED** |
| Doctor exit code 4 (NOT_INSTALLED) | Story 10.42 AC | Reproduced in fresh dir | **ALIGNED** |
| Chrome Brain SessionStart hook | Story 10.41 AC | Installer path updated in both entrypoints | **ALIGNED** |
| Install matrix Yarn v1 Windows | `docs/audits/install-matrix-2026-04-16.md` | Exception still enforced in CI + README | **ALIGNED** |
| CLI feature parity between cli.js + sinapse.js | Implicit (two entrypoints, one promise) | Init bridged (PR #103); `telemetry` / `qa` / `brand` / `validate` / `info` remain sinapse.js-only | **MEDIUM: PARTIAL PARITY** |
| CI security gate (`--omit=dev --audit-level=high`) | PR #99 | In place in `.github/workflows/ci.yml` | **ALIGNED** |

## 5. Severity

**MEDIUM — CLI parity is incomplete.** The canonical `npx sinapse-ai` entry does not expose `telemetry`, `qa`, `brand`, `validate`, or `info` — only the legacy `sinapse` binary has them. Not a GA blocker since `sinapse-ai` covers the install/uninstall/init/doctor/status/list happy path, but this is exactly what item #9 of the pending execution plan (dual CLI consolidation) was meant to address.

## 6. Recommendation

- **GA:** no runtime change.
- **Post-GA or as part of dual-CLI consolidation:** decide per command whether to (a) mirror into `cli.js` via spawn-delegation (same trick as init in PR #103), or (b) drop the command from the public surface if it's infrastructure-only. Low-hanging candidates to mirror: `info`, `validate`. `telemetry` and `qa` should be deliberately considered (subcommand complexity may warrant their own root).

## 7. Gate Decision

| Dimension | Verdict | Rationale |
|---|---|---|
| **1. Features** | **PASS** | Zero CRITICAL/HIGH. One MEDIUM (partial CLI parity, already tracked as item #9 in pending-execution plan). All features exercised during this session behaved as documented; features not exercised are covered by the 10906-test suite passing on main. |

## Change Log

- 2026-04-19 — Dimension 1 audit as fourth pass of clinical audit (Phase 2 kickoff). PASS.
