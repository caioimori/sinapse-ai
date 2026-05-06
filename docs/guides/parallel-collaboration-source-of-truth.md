# Parallel Collaboration Source Of Truth

**Status:** Active  
**Audience:** Caio, Sawyer/Soier, maintainers, and AI agents operating with SINAPSE  
**Purpose:** Single source of truth for safe parallel collaboration in `sinapse-ai` and in any other repository that adopts the same setup

---

## Why This Document Exists

This document defines the canonical operating model for two or more people evolving the same repository in parallel without overwriting code, weakening quality, or depending on informal memory.

It exists for two reasons:

1. `sinapse-ai` is a critical framework and must be protected with professional repository discipline.
2. The same collaboration model must be portable to other projects that Caio and Sawyer/Soier maintain together.

If another document says something different about parallel collaboration, this file wins.

---

## Core Principle

**Nobody works directly on `main`.**

All meaningful work must happen in an isolated branch, preferably inside an isolated worktree, and must reach `main` only through pull request review plus repository protections.

That one rule removes the main source of accidental overwrite.

---

## Non-Negotiables

These rules apply to `sinapse-ai` and to any project using this collaboration model.

1. No direct work on `main`.
2. No direct push to `main`.
3. Every collaborator uses an isolated branch.
4. Prefer one isolated worktree per feature, story, or scoped task.
5. Every merge to `main` happens through PR review.
6. Branches must be up to date with `origin/main` before push or merge.
7. Obvious secrets must be blocked before commit.
8. Quality gates must run before merge.
9. Ownership and reviewer routing must use real GitHub users with write access.
10. Destructive Git operations are blocked by default.

---

## What Problem This Solves

This model is designed to prevent four common failure modes:

1. Two people edit the same branch and silently overwrite each other.
2. Someone starts work on `main`, mixes unrelated changes, and makes later recovery difficult.
3. A branch is pushed while behind `origin/main`, making conflicts appear too late.
4. Sensitive changes reach the repository without the other maintainer seeing them first.

The goal is not "zero conflicts ever."  
The goal is: **conflicts are detected early, contained safely, and never land invisibly in `main`.**

---

## Canonical Workflow

### 1. Starting new work from a clean default branch

Use:

```bash
npm run collab:start -- <story-id> <slug>
```

Example:

```bash
npm run collab:start -- 7.7.4 codex-collab-hardening
```

This command is the standard way to begin work safely. It:

- checks that the current branch is the default branch
- checks that the working tree is clean
- fetches from `origin`
- fast-forwards from `origin/main` when needed
- detects the maintainer prefix
- creates a dedicated worktree
- creates a dedicated branch for that work item

### 2. Recovering work that already started on `main`

Use:

```bash
npm run collab:adopt -- <story-id> <slug>
```

Example:

```bash
npm run collab:adopt -- codex-runtime codex-functional-upgrade
```

This is the migration bridge when someone already has local work in `main`. It keeps the current files as they are and moves the work to a safe branch.

### 3. Auditing the current state

Use:

```bash
npm run collab:check
```

This tells the maintainer:

- current branch
- default branch
- detected owner prefix
- whether the tree is clean

---

## Branch Strategy

### Canonical human maintainer branch format

```text
{owner}/{type}/{story-and-slug}
```

Examples:

- `caio/feat/7-7-4-codex-collab-hardening`
- `soier/refactor/framework-codex-runtime-hardening`
- `caio/docs/parallel-collaboration-sot`

### Owner detection

The bootstrap detects the owner from local Git identity and environment:

- `caio` -> `caio/`
- `matheus`, `soier`, or `sawyer` -> `soier/`
- anything else -> `dev/`

### Important note about legacy internal worktree flow

`sinapse-ai` still has an internal ADE worktree model using:

```text
auto-claude/{storyId}
```

That flow is still valid for internal engine-driven work.

The rule is:

- use `auto-claude/{storyId}` for the existing internal ADE worktree pipeline
- use `npm run collab:start` for human maintainer collaboration

Do not mix both branch styles in the same change.

---

## Worktree Policy

The preferred policy is:

- one worktree per active feature or story
- one branch per worktree
- one branch owner

Why worktrees matter:

- each collaborator gets a physically separate working directory
- switching context becomes safer
- uncommitted work from one feature does not leak into another
- `main` can stay clean while several efforts run in parallel

For `sinapse-ai`, the standard location is under:

```text
.sinapse/worktrees/
```

---

## What Each Person Does

### Caio

- starts work with `collab:start` or `collab:adopt`
- works inside his own branch or worktree
- opens PRs for review
- reviews Soier's PRs

### Sawyer/Soier

- starts work with `collab:start` or `collab:adopt`
- works inside his own branch or worktree
- opens PRs for review
- reviews other maintainers' PRs

### Shared rule

The coordination point is the PR, not synchronous chat memory.

---

## Local Safety Rails

The local repository should enforce these protections:

### Pre-commit

- block commits on `main`
- block obvious secret leakage from staged files
- keep existing framework protection checks

### Pre-push

- block push from `main`
- block direct push to `main`
- block push when the branch is behind `origin/main`

These protections make the safe path the easiest path.

---

## GitHub Protection Baseline

Every repo using this model should configure the default branch with the following minimum protections:

### Required

- PR required before merge
- at least 1 approval required
- dismiss stale reviews
- require the most recent pusher to be approved by someone else
- require conversation resolution
- block force push
- block branch deletion
- require a validation check or CI summary check

### Recommended

- enforce admins
- auto-delete merged branches
- auto-merge when checks and approval are complete
- CODEOWNERS enforcement after valid ownership is present in the default branch
- secret scanning and push protection

### Important sequencing rule

Only enable GitHub's `require_code_owner_reviews` after the `CODEOWNERS` file already merged into the default branch is valid and references real collaborators with write access.

Otherwise the repository can lock itself into a broken review state.

---

## CODEOWNERS Policy

`CODEOWNERS` is not just documentation. It is operational ownership.

Rules:

1. Use real GitHub usernames only.
2. Every listed owner must already have write access.
3. Critical surfaces should require both maintainers as owners.
4. Broad fallback ownership is acceptable, but sensitive paths must still be explicit.

Recommended critical paths:

- `.github/`
- `.husky/`
- `.claude/hooks/`
- `.claude/rules/`
- `.sinapse-ai/core/`
- `.sinapse-ai/infrastructure/`
- `bin/`
- `packages/`
- `package.json`
- `package-lock.json`

---

## Merge And Review Model

The standard model is:

1. Maintainer opens feature branch or worktree
2. Maintainer works locally
3. Maintainer pushes only their feature branch
4. Maintainer opens PR to `main`
5. The other maintainer reviews
6. CI and repository rules pass
7. PR merges into `main`
8. Local branches and worktrees are cleaned up

### Review expectations

The reviewer checks:

- scope matches the branch intent
- no unrelated files leaked in
- required sync commands were run
- docs and manifests stayed aligned when needed
- the branch is safe to merge

---

## Conflict Handling

### If both collaborators edit different files

Usually there is no issue. Separate branches and PRs are enough.

### If both collaborators edit the same file, different sections

Git usually merges this automatically or the PR detects it safely before merge.

### If both collaborators edit the same lines

This becomes a visible branch or PR conflict and must be resolved before merge.

That is acceptable. The point of this model is that the conflict appears in a contained place instead of silently overwriting someone else's work.

---

## Quality Gates

For `sinapse-ai`, the baseline quality gates remain:

```bash
npm run lint
npm run typecheck
npm test
```

Additional sync or validation commands should run when relevant:

```bash
npm run sync:ide
npm run validate:codex-sync
npm run sync:skills:codex
npm run validate:codex-skills
npm run generate:manifest
npm run validate:manifest
```

Projects that reuse this model should define their own equivalent minimum gates, but the principle remains the same:

- no merge without local validation
- no merge without remote validation

---

## `sinapse-ai` Specific Additions

Inside `sinapse-ai`, collaboration also interacts with framework boundaries.

### Autonomous lane

Changes can usually proceed without waiting for the other maintainer when they stay within supported extension surfaces like:

- `.sinapse-ai/development/agents/`
- `.sinapse-ai/development/tasks/`
- `.sinapse-ai/development/workflows/`
- `.sinapse-ai/product/`
- `docs/guides/`
- `docs/framework/`

### Coordinated lane

Changes should be aligned first when they affect:

- `.sinapse-ai/core/**`
- `.sinapse-ai/infrastructure/**`
- `bin/**`
- `.husky/**`
- `.claude/hooks/**`
- release/versioning behavior
- global framework policy

This distinction is specific to `sinapse-ai`, but the same idea can be reused in other repos: define "safe solo surfaces" and "coordinate-first surfaces."

---

## How To Reuse This In Other Projects

When applying this model to another repo, keep the following portable baseline:

### Portable baseline

- branch per maintainer
- worktree per feature or story
- no work on `main`
- no direct push to `main`
- PR review required
- CI required
- CODEOWNERS with real users
- secret scan before commit
- behind-main check before push

### Repo-specific pieces to customize

- branch owner prefixes
- quality gates
- critical paths in `CODEOWNERS`
- CI check names
- file sync commands
- release rules

### Adoption checklist for another repo

1. Add maintainer bootstrap command
2. Add pre-commit and pre-push safety hooks
3. Add `CODEOWNERS`
4. Configure GitHub branch protection
5. Define repo-specific quality gates
6. Document autonomous vs coordinated paths if the repo has a framework layer

---

## Anti-Patterns

These are forbidden:

- starting serious work directly on `main`
- pushing directly to `main`
- sharing one long-lived branch between two people
- opening PRs from outdated branches
- relying on memory instead of explicit PR handoff
- committing `.env` files or obvious secrets
- using force push as a normal workflow
- changing critical repository policy without coordinated review

---

## Recovery Rules

### If someone already started in `main`

Use `collab:adopt`.

### If a branch is behind `origin/main`

Update it before push or merge.

### If a conflict appears

Resolve it in the feature branch or PR, never by bypassing protections on `main`.

### If `CODEOWNERS` or GitHub protections are misconfigured

Fix ownership first, then activate stricter review enforcement.

---

## Decision Summary

The canonical answer to "how do two maintainers work in sync without overwriting code?" is:

- isolated branch
- isolated worktree
- no work on `main`
- PR review before merge
- GitHub protection on `main`
- local safety hooks
- quality gates before merge

Everything else is optimization on top of that base.

---

## Related Documents

These documents support this source of truth, but do not override it:

- [Framework Contributor Mode](./framework-contributor-mode.md)
- [Parallel Workflow](./parallel-workflow.md)
- [Safe Collaboration Rule](../../.claude/rules/safe-collaboration.md)
- [Safe Collaboration Template README](../../.sinapse-ai/infrastructure/templates/safe-collab/README.md)
