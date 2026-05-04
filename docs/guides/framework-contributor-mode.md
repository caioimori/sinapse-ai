# Framework Contributor Mode

This guide defines how Caio and Soier should evolve the `sinapse-ai` framework in parallel without stepping on each other and without relying on informal memory.

It is optimized for the current repository state and reuses the infrastructure that already exists in SINAPSE.

## Goal

Enable a collaborator to add supported framework features safely and autonomously.

The main target is simple:

- no work starts directly on `main`
- autonomous framework changes do not depend on Caio explaining the structure
- coordinated framework changes are explicit before edits begin

## Source Documents

**Canonical policy:** [Parallel Collaboration Source Of Truth](./parallel-collaboration-source-of-truth.md)

- [Parallel Workflow](./parallel-workflow.md)
- [Source Tree Standard](../framework/source-tree.md)
- [Component Creation Guide](../../.sinapse-ai/core/docs/component-creation-guide.md)
- [Safe Collaboration Rule](../../.claude/rules/safe-collaboration.md)

## Current Repository Reality

The repository already has the foundations needed for contributor autonomy:

- contributor mode is currently enabled via `boundary.frameworkProtection: false`
- worktree support exists
- component creation guidance exists
- IDE sync and Codex skills sync exist
- safe collaboration guidance exists

What was missing was a short operational model. This document fills that gap.

## Golden Rules

1. Do not start framework work on `main`.
2. If the change is in an autonomous lane, proceed without waiting for Caio.
3. If the change is in a coordinated lane, align before editing.
4. Prefer existing generators, templates, and standard locations over manual invention.
5. Every framework change must finish with the correct sync and validation steps.
6. Use the maintainer bootstrap command before opening new work.

## Change Lanes

## Autonomous Lane

Soier can proceed alone when the change stays within supported framework extension surfaces such as:

- `.sinapse-ai/development/agents/`
- `.sinapse-ai/development/tasks/`
- `.sinapse-ai/development/workflows/`
- `.sinapse-ai/product/templates/`
- `.sinapse-ai/product/checklists/`
- `docs/framework/`
- `docs/guides/`
- squad extensions that follow existing structure

Typical examples:

- create or update an agent
- create or update a task
- create or update a workflow
- create or update a template/checklist
- add supporting documentation for a framework capability

## Coordinated Lane

These changes require alignment before implementation because they affect framework behavior or collaboration safety:

- `.sinapse-ai/core/**`
- `.sinapse-ai/infrastructure/**`
- `bin/**`
- `.sinapse-ai/constitution.md`
- `package.json`
- `.husky/**`
- `.claude/hooks/**`
- release/versioning mechanics

Typical examples:

- changing Git enforcement behavior
- changing manifest generation behavior
- changing CLI entry points
- changing framework boundaries or contributor mode rules

## Protected Lane

These remain under explicit authority and must not be treated as normal framework edits:

- remote push authority
- PR merge authority
- release/tag flows
- destructive Git operations

## Isolation Strategy

## Preferred mode

Use a dedicated work area for each unit of work.

### Canonical maintainer bootstrap

From a clean `main`, start work with:

- `npm run collab:start -- <story-id> <slug>`

Examples:

- `npm run collab:start -- 7.7.4 codex-collab-hardening`
- `npm run collab:start -- framework-codex codex-runtime-hardening --type=refactor`

Useful audit command:

- `npm run collab:check`

If you already have uncommitted work on `main` and need to move it to a safe branch without losing anything:

- `npm run collab:adopt -- <story-id> <slug>`

This bootstrap does four things:

- verifies you are on a clean default branch
- fetches and fast-forwards from `origin/main`
- detects the maintainer prefix (`caio` or `soier`)
- creates an isolated worktree with an owner-prefixed branch

The `collab:adopt` command is the migration bridge for an already-dirty `main`. It keeps the current files exactly where they are and only moves the work onto a safe owner-prefixed branch.

### If you are using the built-in worktree flow

Use the existing worktree tooling and let SINAPSE manage the `auto-claude/{storyId}` branch model.

This is the safest option when working in parallel on larger framework changes.

### If you are working manually without the worktree tooling

Use a human-readable feature branch:

- `caio/{type}/{desc}`
- `soier/{type}/{desc}`

Examples:

- `caio/feat/installer-sync`
- `soier/feat/new-agent-template`

## Important note about branch naming

The repository still has two branch models in circulation:

- worktree flow: `auto-claude/{storyId}`
- safe-collab guide: `caio/...` and `soier/...`

For maintainer collaboration, the canonical workflow is now:

- `npm run collab:start -- <story-id> <slug>`
- branch format: `{owner}/{type}/{story-and-slug}`

Examples:

- `caio/feat/7-7-4-codex-collab-hardening`
- `soier/refactor/framework-codex-runtime-hardening`

The older `auto-claude/{storyId}` branches remain valid for the internal ADE worktree flow.

Until all internals are migrated, use this rule:

- use `auto-claude/{storyId}` when the built-in worktree tooling is driving the work
- use `npm run collab:start` for human maintainer work

Do not mix both styles inside the same change.

## Standard Workflow

1. Start from a story or explicit scoped task.
2. Create an isolated work area with `npm run collab:start`.
3. Classify the change lane before editing.
4. Use the source tree guide to place files correctly.
5. Prefer component creation and modification workflows over ad hoc manual structure.
6. Run the required sync commands for the changed artifact types.
7. Run quality gates.
8. Hand off through PR review rather than chat memory.

## Local Safety Net

The repository now enforces three local safety rules:

- pre-commit blocks commits on `main`
- pre-commit scans staged files for obvious secrets
- pre-push blocks direct pushes to `main` and branches that are behind `origin/main`

This is intentionally strict. The goal is to make the safe path the default path.

## Self-Service Feature Workflow

When Soier wants to add a framework feature inside the Autonomous Lane, this is the expected path:

1. Define the change scope from the story or request.
2. Confirm the target location using [Source Tree Standard](../framework/source-tree.md).
3. Create or modify the component using the relevant standard flow:
   - agent
   - task
   - workflow
   - template
   - checklist
   - docs
4. Run the sync matrix below.
5. Run quality gates.
6. Open PR for Caio review when the change is ready.

This avoids asking Caio where things go unless the change leaves the Autonomous Lane.

## Sync Matrix

Run the sync commands that match the kind of change you made.

### Agent definition changes

- `npm run sync:ide`
- `npm run validate:codex-sync`

### Codex skill changes

- `npm run sync:skills:codex`
- `npm run validate:codex-skills`

### Framework file graph or install surface changes

- `npm run generate:manifest`
- `npm run validate:manifest`

### Always after meaningful framework changes

- `npm run lint`
- `npm run typecheck`
- `npm test`

## When To Stop And Coordinate

Pause and align before continuing if any of these is true:

- the change touches both an Autonomous Lane file and a Coordinated Lane file
- the change alters framework behavior, not just framework content
- the change modifies hooks, installer behavior, CLI entry points, or config contracts
- the change requires a new policy, authority rule, or repo-wide convention
- the work started in one lane and now spills into `.sinapse-ai/core/` or `.sinapse-ai/infrastructure/`

## Review Contract Between Caio And Soier

Use PR review as the main handoff mechanism.

### Reviewer expectations

- reviewer checks lane compliance
- reviewer checks sync commands were run
- reviewer checks no unrelated files leaked into the change
- reviewer checks if docs and manifests stayed aligned

### Escalate instead of guessing

If a change affects framework contracts, record the concern in the PR and route it for coordinated review instead of silently deciding.

## Suggested Division Of Responsibility

This is a practical default, not a rigid rule.

### Caio default lead

- installer
- CLI surface
- hooks
- release/versioning behavior
- framework-wide policy

### Soier default lead

- new framework features within the existing structure
- agents, tasks, workflows, templates, and supporting docs
- squad-level expansion that follows current conventions

### Shared with review

- infrastructure scripts
- core behavior
- repo-wide conventions

## Definition Of Done For Autonomous Changes

An autonomous framework change is done when:

- it stayed inside the Autonomous Lane
- file placement followed the source tree standard
- required sync commands were executed
- quality gates passed
- the PR clearly explains what was added and why

## What This Guide Intentionally Does Not Do

This guide does not try to productize the reusable `safe-collab` template for every external repository.

Its purpose is narrower and more urgent:

- make collaboration inside `sinapse-ai` predictable
- let Soier ship supported framework changes without waiting on Caio for structure

That broader template hardening should happen only after this workflow proves itself in real use.
