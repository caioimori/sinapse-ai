# Clinical Audit — Dimension 13: Gitflows

> **Epic:** `docs/epics/epic-clinical-audit-pre-ga.md`
> **Phase:** 1 (infra, low-risk)
> **Executor:** @devops (this pass)
> **Date:** 2026-04-19
> **Verdict:** **PASS** — zero CRITICAL/HIGH findings

## Scope

Branch protection, PR automation, safe-collaboration enforcement, pre-commit / pre-push validators, required CI contexts, merge policy.

## 1. Inventory

### Workflows (`.github/workflows/`)

```
22 workflows total: bob-integration, ci, codeql, cross-platform-bob,
install-matrix, issue-labeler, macos-testing, manifest-parity,
npm-publish, pr-automation, pr-labeling, pr-size-check (+ 10 more)
```

### Husky hooks (`.husky/`)

| Hook | Path | Runs |
|---|---|---|
| pre-commit | `.husky/pre-commit:3` | `bin/utils/git-branch-guard.js` |
| pre-commit | `.husky/pre-commit:4` | `bin/utils/staged-secret-scan.js` |
| pre-commit | `.husky/pre-commit:9` | `bin/utils/framework-guard.js` (L1/L2 protection) |
| pre-commit | `.husky/pre-commit:13` | `scripts/ensure-manifest.js --validate-only` |
| pre-push | `.husky/pre-push:22` | `bin/utils/pre-push-safety.js` |
| pre-push | `.husky/pre-push:31` | `npm run validate:no-external-refs` |
| post-commit | `.husky/post-commit` | (IDS manifest regen hook — confirmed during this audit's commits) |

### Branch protection on `main` (via `gh api`)

| Setting | Value | Source |
|---|---|---|
| `required_status_checks.contexts` | `["Validation Summary"]` | GitHub API |
| `required_status_checks.strict` | `true` (must be up-to-date) | GitHub API |
| `enforce_admins` | `false` | GitHub API |
| `required_pull_request_reviews.required_approving_review_count` | `1` | GitHub API |
| `allow_force_pushes` | `false` | GitHub API |
| `allow_deletions` | `false` | GitHub API |
| `required_linear_history` | `false` | GitHub API |

## 2. Contract

Authoritative rule sources:

| Claim | Source |
|---|---|
| "Users never touch git directly" | `.claude/rules/safe-collaboration.md:18-22` (Golden Rule) |
| "Never start work on main — always branch" | `.claude/rules/safe-collaboration.md:32` |
| Branch naming patterns (caio/*, soier/*, agent/*) | `.claude/rules/safe-collaboration.md:58-63` |
| Pre-commit secret scan mandatory | `.claude/rules/safe-collaboration.md:98-106` |
| Force push requires explicit user confirmation | `.claude/rules/safe-collaboration.md:177-184` |
| Caio can self-approve his own PRs (admin bypass) | `.claude/rules/safe-collaboration.md:144` |
| Other user's PR requires @caioimori review | `.claude/rules/safe-collaboration.md:145` |
| `@devops` exclusive `git push` / `gh pr merge` | `~/.claude/rules/agent-authority.md:9-14` |
| External-reference guard runs pre-push | `.husky/pre-push:24-41` |

## 3. Reality

Observed behavior during this audit (file:line citations only):

- Husky `pre-push:22` invokes `bin/utils/pre-push-safety.js` → confirms safety check exists.
- Husky `pre-push:31` invokes `validate:no-external-refs` → blocked this session's first CHANGELOG push with `[forbidden-ref]` reference, confirming the guard fires on content (not filename). See also PR #106 pre-push block on 2026-04-19 (session log).
- Husky `pre-commit:4` invokes `bin/utils/staged-secret-scan.js` → design intent matches contract (secret scan on pre-commit, not pre-push).
- Husky `pre-commit:9` invokes `bin/utils/framework-guard.js` → protects L1/L2 paths per Framework Boundary (CLAUDE.md).
- `post-commit` hook regenerated `install-manifest.yaml` automatically during PR #100 commit (observed in commit output `[IDS-Hook] install-manifest.yaml regenerated`).
- Branch protection on main allows admin bypass: merges of PRs #98–#107 were admin-squashed by Caio via `gh pr merge --admin` because auto-merge reported `mergeStateStatus: BLOCKED` (required review count = 1, self-PR). This matches `safe-collaboration.md:144`.
- Force push allowed only with `--force-with-lease` in runtime rules but server `allow_force_pushes: false` overrides this globally — any force push attempt to main fails at server side.

## 4. Delta

| Claim | Contract | Reality | Status |
|---|---|---|---|
| Solo dev can merge own PR | `safe-collaboration.md:144` "Caio can merge directly (admin bypass)" | `enforce_admins: false` + admin flag on `gh pr merge` works end-to-end | **ALIGNED** |
| 1 approval required | Implicit from "PR creation assigns reviewer" | `required_approving_review_count: 1` | **ALIGNED** |
| Secret scan runs on commit | `safe-collaboration.md:98-106` | `.husky/pre-commit:4` invokes `staged-secret-scan.js` | **ALIGNED** |
| External ref guard runs on push | `.husky/pre-push:24-41` comment block | Blocked 1 push this session with `[forbidden-ref]` match | **ALIGNED** (working as designed) |
| Force push blocked by default | `safe-collaboration.md:177-184` | `allow_force_pushes: false` at server level | **ALIGNED** (belt + suspenders: rule + server enforcement) |
| Branch deletion blocked | Implicit | `allow_deletions: false` | **ALIGNED** |
| Linear history | Not required by contract | `required_linear_history: false` | **ALIGNED** (squash-merge produces linear anyway) |
| Required status checks | Not explicitly listed | 1 context: `Validation Summary` (aggregator) | **ALIGNED** — aggregator pattern is standard GitHub practice; individual gates evaluated inside CI |
| Session start auto-fetch | `safe-collaboration.md:32` "git fetch origin at session start" | No hook enforces this client-side | **MEDIUM DRIFT** — documented expectation but no technical enforcement |

## 5. Severity (single finding)

**MEDIUM — Session-start auto-fetch is a convention, not an enforced hook.**

The `safe-collaboration.md` protocol states agents MUST `git fetch` before any work begins in a session. The repo has no pre-agent-invocation hook that guarantees this. In practice the rule is followed because every agent's memory carries the pattern, but a fresh agent spinning up without memory could start work on a stale main.

## 6. Recommendation

1. **Primary (low priority, post-GA):** Consider a pre-`Write|Edit` PreToolUse hook that runs `git fetch origin --quiet` on any work branch, paired with a warning if local main is behind by > N commits. Warn-only, fail-open. Estimated effort: 2h.
2. **Otherwise: no action.** Gitflow posture is healthy and enforced through multiple redundant layers (rules → husky hooks → server branch protection → agent memory).

## 7. Gate Decision

| Dimension | Verdict | Rationale |
|---|---|---|
| **13. Gitflows** | **PASS** | Zero CRITICAL/HIGH. One MEDIUM (convention without hook) — logged as potential post-GA story, NOT a GA blocker. Enforcement stack is defense-in-depth: rules documented, husky guards pre-commit + pre-push, server-side branch protection catches anything that slips through. Observed during session: external-refs guard blocked a real violation (`[forbidden-ref]` in CHANGELOG) before CI. Admin-bypass flow exercised 7 times this session (PRs #98–#107), all merged cleanly. |

## 8. Post-GA follow-up (optional, not blocking)

- Story candidate: `gitflow-fetch-guard.story.md` — PreToolUse hook for stale-main detection. Defer until post-GA; not worth the churn window.

## Change Log

- 2026-04-19 — Dimension 13 audit executed as first pass of clinical audit Phase 1. PASS verdict. No GA blocker.
