# SINAPSE Collaboration Autonomy Plan

**Date:** 2026-04-02
**Author:** @sinapse-orqx
**Status:** Approved with scope reduction
**Decision Type:** Orchestration plan

---

## Executive Decision

The previous "safe collaboration" suggestions should be **partially approved**, not adopted wholesale.

### Approved now

- Standardize how two collaborators work in parallel inside the same repository
- Create a clear contributor operating model for framework changes
- Define which changes a contributor can make autonomously without waiting for the maintainer
- Reuse the existing SINAPSE infrastructure already present in the repository

### Not approved now

- Turning `safe-collab` into a universal template product for all repositories
- Investing first in cross-platform bootstrap polish for the template
- Building a dedicated test suite for the reusable template before the internal workflow is stable
- Enabling automation flags that are not yet proven in the current operating model

---

## Critical Assessment

The core need is **not only Git safety**.

The real requirement is:

1. Two collaborators must be able to work in sync without overwriting each other.
2. A contributor must be able to add framework features without depending on the maintainer to explain where things go or how to wire them in.

The repository already contains strong building blocks for this:

- Safe collaboration rule: `.claude/rules/safe-collaboration.md`
- Reusable safe-collab template: `.sinapse-ai/infrastructure/templates/safe-collab/`
- Human parallel guide: `docs/guides/parallel-workflow.md`
- Worktree isolation: `.sinapse-ai/infrastructure/scripts/worktree-manager.js`
- Component creation scaffolding: `.sinapse-ai/core/docs/component-creation-guide.md`
- Source tree standard: `docs/framework/source-tree.md`
- Contributor mode already enabled: `.sinapse-ai/core-config.yaml` with `boundary.frameworkProtection: false`

This means the framework is **not missing raw capability**.

What is missing is a **single operating model** that tells a collaborator:

- where they can move fast alone
- when they must coordinate
- which commands and sync steps are mandatory
- how to hand work off safely

---

## Why Scope Reduction Is Correct

If the team prioritizes generic template hardening first, it will improve portability but **not solve the immediate bottleneck**: a contributor still may not know when a framework change is autonomous, coordinated, or blocked.

If the team prioritizes contributor autonomy first, the outcome is immediately useful inside the active repository and can later be extracted into a stronger reusable template.

Therefore the correct order is:

1. Fix the operating model inside `sinapse-ai`
2. Prove it with both collaborators
3. Only then generalize it into the reusable template

---

## Real Gaps To Solve

### Gap 1: Divergent branch strategy

There are two branch models in the repository context:

- Safe collaboration rule suggests human prefixes like `alice/feat/...` and `bob/fix/...`
- Worktree infrastructure currently creates `auto-claude/{storyId}`

This divergence creates ambiguity and weakens adoption.

### Gap 2: Contributor autonomy is implicit, not explicit

The repo has generators, tasks, workflows, and standards, but there is no short operational guide saying:

- "A contributor can do these classes of framework changes alone"
- "These paths require coordination first"
- "After this type of change, run these sync commands"

### Gap 3: Current session behavior does not match the intended safe model

The current repository state is still on `main` with local modifications, which shows the desired collaboration protocol is not yet the lived default.

### Gap 4: Reviewer automation exists in principle, but not in default config

Reviewer auto-assignment is documented, but `auto_assign_reviewers` is still `false` in the current config.

---

## Orchestration Objective

Create a **framework contributor mode** for two collaborators with these outcomes:

- A contributor can add supported framework features end-to-end without waiting for the maintainer
- Git collisions are minimized by isolation plus coordination rules
- Core-risk edits are routed through a tighter review path
- Sync steps are deterministic for agent, workflow, template, and manifest changes

---

## Orchestration Plan

## Phase 1: Normalize the collaboration operating model

**Lead:** @sinapse-orqx
**Execution:** @architect + @developer + @devops
**Goal:** define a single way of working for framework contributors

### Deliverables

- A contributor guide specific to framework work
- Explicit change lanes: autonomous, coordinated, protected
- A temporary rule for resolving the current branch/worktree strategy mismatch
- A mandatory sync matrix for common change types

### Exit Criteria

- Two collaborators can classify any proposed change in under 1 minute
- Both know whether they can proceed alone or need coordination
- No feature work starts directly on `main`

---

## Phase 2: Establish self-service feature lanes

**Lead:** @architect
**Execution:** @developer + @quality-gate
**Goal:** make supported framework changes easy to add without tribal knowledge

### Autonomous Lane

Changes a contributor should be able to make without waiting for the maintainer, as long as the story and quality gates are respected:

- new or updated agent definitions
- new or updated tasks
- new or updated workflows
- new or updated templates and checklists
- documentation for supported framework capabilities
- squad-level extensions that use existing conventions

### Coordinated Lane

Changes that should require alignment before implementation:

- `.sinapse-ai/core/**`
- `.sinapse-ai/infrastructure/**`
- `bin/**`
- `.sinapse-ai/constitution.md`
- package/release/versioning behavior
- hook behavior and Git enforcement logic

### Protected Lane

Changes that should stay under explicit authority:

- remote push and PR merge authority
- branch protection and release flow
- destructive Git operations

### Exit Criteria

- A contributor can add a framework feature from story to PR inside the Autonomous Lane without asking where things belong
- Coordinated Lane is clearly documented and followed

---

## Phase 3: Harden only the pieces that unblock the team

**Lead:** @devops
**Execution:** @developer + @quality-gate
**Goal:** implement only the automation hardening that materially reduces team friction now

### Recommended hardening now

- enforce "no work on main" as team habit and documented rule
- make reviewer routing explicit for the maintainer/contributor handoff
- standardize when to use worktrees versus plain feature branches
- ensure manifest and sync steps are part of the contribution workflow

### Hardening to defer

- full productization of the safe-collab template
- universal GitHub ruleset automation
- template-specific automated test suite
- broader cross-project portability work

### Exit Criteria

- daily collaboration no longer depends on ad hoc verbal coordination
- PR handoff between two collaborators is predictable
- no accidental drift in agent/config sync for framework changes

---

## Proposed Routing

### Strategic routing

- `@sinapse-orqx`: orchestration, policy, lane design
- `@architect`: define change boundaries and supported extension surfaces
- `@developer`: implement contributor docs and any supporting workflow changes
- `@quality-gate`: validate that the operating model is enforceable and testable
- `@devops`: own reviewer routing, branch/PR discipline, and release-safe collaboration

---

## Success Metrics

- A contributor can independently ship a framework feature inside the Autonomous Lane
- Fewer edits start on `main`
- Fewer handoffs depend on the maintainer explaining structure manually
- Reduced accidental omissions in `sync:ide`, skills sync, and manifest updates
- PR review becomes the coordination point instead of synchronous chat

---

## Immediate Recommendation

Approve the initiative, but with this narrowed scope:

**Do not start by polishing the generic safe-collab template.**

Start by formalizing the contributor operating model inside `sinapse-ai`, because that is the shortest path to real autonomy for contributors and safe parallel optimization for the team.

---

## Next Artifacts

- `docs/guides/framework-contributor-mode.md`
- optional follow-up story to operationalize the highest-value automation gaps after the guide is proven in use
