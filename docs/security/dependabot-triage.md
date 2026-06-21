# Dependabot Triage

> Authoritative log of security alerts that are **knowingly accepted** as tolerable risk with rationale.
> Every entry MUST be reviewed at each GA release.

## Scope

This document applies to `caioimori/sinapse-ai` and covers advisories surfaced by:

- GitHub Dependabot alerts (https://github.com/caioimori/sinapse-ai/security/dependabot)
- `npm audit` run locally or in CI

## Current state (2026-06-21)

### GitHub Dependabot

Open alerts: **0**. The 3 `undici` alerts surfaced on 2026-06-21 (#36, #41, #43) were dismissed as `tolerable_risk` with rationale (see below). The earlier `picomatch` / `brace-expansion` advisories are gone — the bundled `npm` tarball advanced to `11.17.0`, which ships patched versions.

### Local `npm audit` — full dev tree

One advisory family remains surfaced by `npm audit` even after applying root `overrides` in `package.json`:

| Severity | Package | Advisories | Path |
|---|---|---|---|
| HIGH (aggregate) | undici@6.26.0 | GHSA-p88m-4jfj-68fv, GHSA-g8m3-5g58-fq7m, GHSA-35p6-xmwp-9g52, GHSA-vxpw-j846-p89q | `semantic-release > @semantic-release/npm > npm > node-gyp > undici` |

It originates from the `npm@11.17.0` tarball that `@semantic-release/npm@13.1.5` bundles. `npm` reports it literally as *"undici@6.26.0 is a bundled dependency of npm@11.17.0 ... It cannot be fixed automatically."* It is frozen inside npm's bundled dependency tree and cannot be replaced via root `overrides` (overrides do not reach into `bundleDependencies` — verified: a targeted `undici@<6.27.0` override has no effect).

## Triage decision

Status: **Accepted — tolerable risk.**

Rationale:

1. **Scope:** `undici` here is a transitive dev-only dependency. It is reached only through `semantic-release`, which runs in CI release automation and never in user-installed code paths. `npm audit --omit=dev --audit-level=high` on the root returns `0 vulns`.
2. **Reachability:** `node-gyp` invokes `undici` only when downloading Node headers to build native addons during install. None of the undici advisories (header injection, SameSite downgrade, queue poisoning, WebSocket DoS) is reachable from any code path that executes when a user runs `npx sinapse-ai install` or any runtime agent command.
3. **Shipped package:** `npm pack --dry-run` confirms `semantic-release` and its `node_modules` do not ship to the published `sinapse-ai` tarball (`devDependency` only).
4. **Upstream fix dependency:** The fix lives upstream — a new `npm` tarball that embeds `undici >= 6.27.0`, followed by a `@semantic-release/npm` bump. Blocked on external release timing; the SINAPSE project cannot accelerate it.

## CI gate policy

Two-tier audit enforcement in `.github/workflows/ci.yml`:

1. **Production-dep gate (hard block, Article X Tier 1 #7):**
   `npm audit --omit=dev --audit-level=high` MUST pass — any HIGH or CRITICAL in production dependencies blocks merge.
2. **Full-tree gate (critical-only):**
   `npm audit --audit-level=critical` MUST pass — CRITICAL anywhere (incl. dev) blocks merge. HIGH/MODERATE in dev with a triage entry in this document is accepted.

If a new HIGH/MODERATE in dev deps emerges and is not yet in this document, CI does NOT block it (tier 2 only flags critical). The maintainer must review `npm audit` at each RC and either upgrade or add a row below.

## Accepted advisories

| Advisory | Package | Severity | Reason | Expires |
|---|---|---|---|---|
| GHSA-p88m-4jfj-68fv | undici | MODERATE | Bundled inside `npm@11.17.0` within `semantic-release` dev dep. Not reachable from user runtime. Upstream fix pending. | Next GA re-review |
| GHSA-g8m3-5g58-fq7m | undici | LOW | Bundled inside `npm@11.17.0` within `semantic-release` dev dep. Not reachable from user runtime. Upstream fix pending. | Next GA re-review |
| GHSA-35p6-xmwp-9g52 | undici | LOW | Bundled inside `npm@11.17.0` within `semantic-release` dev dep. Not reachable from user runtime. Upstream fix pending. | Next GA re-review |
| GHSA-vxpw-j846-p89q | undici | LOW | WebSocket DoS, surfaced by `npm audit` only. Same bundled-in-npm origin. Not reachable from user runtime. | Next GA re-review |

## Proactive hardening in place

Even though overrides do not reach the bundled tree, `package.json` carries root `overrides` (`diff`, `serialize-javascript`, `picomatch`, `brace-expansion`, `fast-uri`, `ip-address`, `@babel/core`, `js-yaml`). When upstream `npm` / `@semantic-release/npm` releases a tarball with `undici >= 6.27.0`, the advisory clears with no action needed. A defensive `undici` override was evaluated and intentionally NOT added — it has zero effect on a bundled dependency and would be dead config.

## Review cadence

- Re-audit at every RC tag
- Re-audit mandatory before promoting `rc` to `latest` (GA)
- Remove accepted advisories as soon as upstream fixes land

## History

| Date | Actor | Change |
|---|---|---|
| 2026-04-19 | Story 10.34 execution | Triage created. rc.1-era 12 alerts confirmed closed on GitHub. 2 remaining `npm audit` advisories (picomatch + brace-expansion inside bundled npm) accepted as tolerable risk. Root `overrides` added defensively. CI gate hardened with `--omit=dev --audit-level=high` job. |
| 2026-06-21 | Session audit | npm bundled tarball advanced to `11.17.0` → picomatch + brace-expansion advisories resolved upstream and removed. New `undici@6.26.0` advisory family surfaced (3 Dependabot alerts + 1 audit-only). Confirmed bundled-in-npm and unfixable via overrides; dismissed the 3 Dependabot alerts as `tolerable_risk` and accepted here. Production audit remains `0 vulns`. |
