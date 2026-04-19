# Dependabot Triage

> Authoritative log of security alerts that are **knowingly accepted** as tolerable risk with rationale.
> Every entry MUST be reviewed at each GA release.

## Scope

This document applies to `caioimori/sinapse-ai` and covers advisories surfaced by:

- GitHub Dependabot alerts (https://github.com/caioimori/sinapse-ai/security/dependabot)
- `npm audit` run locally or in CI

## Current state (2026-04-19)

### GitHub Dependabot

Open alerts: **0**. All 12 alerts from the rc.1 era (2026-04-13) have been closed.

### Local `npm audit` — full dev tree

Two advisories remain surfaced by `npm audit` even after applying root `overrides` in `package.json`:

| Severity | Package | Advisory | Path |
|---|---|---|---|
| HIGH | picomatch@4.0.3 | GHSA-c2c7-rcm5-vvqj (ReDoS via extglob quantifiers) | `semantic-release > @semantic-release/npm > npm > node-gyp > tinyglobby > picomatch` |
| MODERATE | brace-expansion@5.0.4 | GHSA-f886-m6hf-6m8v (zero-step DoS) | `semantic-release > @semantic-release/npm > npm > minimatch > brace-expansion` |

Both originate from the `npm@11.12.1` tarball that `@semantic-release/npm@13.1.3` bundles. They are frozen inside npm's bundled dependency tree and cannot be replaced via root `overrides` (overrides do not reach into `bundleDependencies`).

## Triage decision

Status: **Accepted — tolerable risk.**

Rationale:

1. **Scope:** These packages are transitive dev-only dependencies. They are reached only through `semantic-release`, which runs in CI release automation and never in user-installed code paths. `npm audit --omit=dev --audit-level=high` on the root returns `0 vulns`.
2. **Reachability:** `node-gyp` is only invoked when building native Node addons during install. Neither picomatch ReDoS nor brace-expansion DoS is reachable from any code path that executes when a user runs `npx sinapse-ai install` or any runtime agent command.
3. **Shipped package:** `npm pack --dry-run` confirms `semantic-release` and its `node_modules` do not ship to the published `sinapse-ai` tarball (it is `devDependency` only).
4. **Upstream fix dependency:** The fix lives upstream — a new `npm` tarball that embeds patched picomatch/brace-expansion, followed by a `@semantic-release/npm` bump. Blocked on external release timing; the SINAPSE project cannot accelerate it.

GitHub Dependabot already confirms this judgement: these advisories are NOT surfaced as open alerts at `https://github.com/caioimori/sinapse-ai/security/dependabot`.

## CI gate policy

Two-tier audit enforcement in `.github/workflows/ci.yml`:

1. **Production-dep gate (hard block, Article X Tier 1 #7):**
   `npm audit --omit=dev --audit-level=high` MUST pass — any HIGH or CRITICAL in production dependencies blocks merge.
2. **Full-tree gate (critical-only):**
   `npm audit --audit-level=critical` MUST pass — CRITICAL anywhere (incl. dev) blocks merge. HIGH/MODERATE in dev with triage entry in this document is accepted.

If a new HIGH/MODERATE in dev deps emerges and is not yet in this document, CI does NOT block it (tier 2 only flags critical). The maintainer must review `npm audit` at each RC and either upgrade or add a row below.

## Accepted advisories

| Advisory | Package | Severity | Reason | Expires |
|---|---|---|---|---|
| GHSA-c2c7-rcm5-vvqj | picomatch | HIGH | Bundled inside `npm@11.12.1` within `semantic-release` dev dep. Not reachable from user runtime. Upstream fix pending. | Next GA re-review |
| GHSA-f886-m6hf-6m8v | brace-expansion | MODERATE | Bundled inside `npm@11.12.1` within `semantic-release` dev dep. Not reachable from user runtime. Upstream fix pending. | Next GA re-review |

## Proactive hardening in place

Even though overrides do not reach the bundled tree, `package.json` carries root `overrides` for `picomatch: ^4.0.4` and `brace-expansion: ^5.0.5`. When upstream `npm` / `@semantic-release/npm` releases a patched tarball, these overrides will ensure the patched versions deduplicate everywhere they can.

## Review cadence

- Re-audit at every RC tag
- Re-audit mandatory before promoting `rc` to `latest` (GA)
- Remove accepted advisories as soon as upstream fixes land

## History

| Date | Actor | Change |
|---|---|---|
| 2026-04-19 | Story 10.34 execution | Triage created. rc.1-era 12 alerts confirmed closed on GitHub. 2 remaining `npm audit` advisories (picomatch + brace-expansion inside bundled npm) accepted as tolerable risk. Root `overrides` added defensively. CI gate hardened with `--omit=dev --audit-level=high` job. |
