---
id: react-bits-distribution-parity
type: feature
status: InReview
epic: frontend-capability-expansion
owner: devops
executor: developer
quality_gate: quality-gate
quality_gate_tools:
  - npm
  - node
  - jest
created: 2026-07-15
---

# Story: React Bits distribution parity

## Status

InReview

## Story

As a SINAPSE user on Claude Code or Codex, I want the React Bits operational
corpus and skill delivered by installation and update so that agent routing works
from a project, the published package, or a global installation without relying on
the framework repository.

## Context

The repository already contains a source-grounded React Bits corpus, task and
knowledge-base entry. The installer currently exposes the skill only to Codex and
does not prove selective corpus delivery to project or global destinations. This
creates a provider and installation-mode gap.

## Scope

**In:** provider-neutral React Bits skill delivery; selective recursive corpus
delivery for project, update and global-only flows; deterministic corpus discovery;
animations orchestrator routing; squad inventory accuracy; validators, package and
isolated-install tests.

**Out:** vendoring upstream React Bits source, changing application pages, modifying
protected framework paths, deleting user customizations, or publishing before the
quality gate accepts package-install evidence.

## Acceptance Criteria

- [x] **AC1.** Given a package source containing the nine-file React Bits corpus, when Claude Code, Codex or both are selected for a project install or update, then the canonical `react-bits-frontend` skill and the complete corpus are available at the documented deterministic location and existing custom files remain intact.
- [x] **AC2.** Given an installation made with `--global-only`, when Claude Code, Codex or both are selected, then the provider-neutral React Bits skill and corpus are available from `~/.sinapse` without requiring a project checkout.
- [x] **AC3.** Given a project, packaged installation or global SINAPSE home, when the React Bits skill resolves its corpus, then discovery prefers project, then package, then `~/.sinapse`, and fails with actionable guidance only after those locations are exhausted.
- [x] **AC4.** Given the canonical animation orchestrator and squad manifest, when React Bits frontend work is routed, then `animations-orqx` exposes the task and knowledge base and all manifest count fields equal the files declared on disk.
- [x] **AC5.** Given the provider and package validators, when the React Bits skill or any required corpus file is absent, then validation fails; when the repository is correct, then Claude and Codex each report the same skill inventory.
- [x] **AC6.** Given a packed tarball, when it is installed into isolated clean and upgrade fixtures for Claude Code, Codex, both and global-only modes, then the complete corpus and skill are delivered, no legacy provider duplicate is created and user customizations are preserved.
- [x] **AC7.** Given the final change, when lint, typecheck, focused tests, provider parity, manifest validation and package checks run, then all pass and no protected path is modified.

## Tasks

- [x] T1. Add provider-neutral skill and selective corpus distribution helpers.
- [x] T2. Integrate project install, update and global-only delivery with preservation semantics.
- [x] T3. Make corpus discovery deterministic and document the installed contract.
- [x] T4. Expose React Bits from `animations-orqx` and reconcile squad inventory.
- [x] T5. Extend validators and isolated tarball clean/upgrade coverage.
- [ ] T6. Run QA, package evidence and DevOps review; record release evidence after publication.

## Validation Record

- Date: 2026-07-15
- Validator: Product Lead (Axis)
- Verdict: **GO - Ready for implementation**
- Evidence: Scope is additive, measurable across all supported provider/install modes,
  preserves customizations, and explicitly excludes protected paths and release prior
  to quality evidence.

## Planned Validation

```powershell
npm run lint
npm run typecheck
npm run validate:parity
npm run validate:manifest
npm test -- --runInBand <focused React Bits/install suites>
npm pack --dry-run
```

## Dev Agent Record

- Implemented provider-neutral skill delivery and selective nine-file corpus copy.
- Provider parity is 172 agents and 37 skills for both Claude Code and Codex.
- `animations-orqx` resolves `orchestrate-react-bits-frontend`; the squad workflow inventory is reconciled.

## QA Results

- Date: 2026-07-15
- Reviewer: Quality Gate (Litmus)
- Verdict: **PASS**
- Evidence: `npm run lint` completed with 0 errors (29 pre-existing warnings),
  `npm run typecheck`, `npm run validate:parity`, `npm run validate:providers`,
  `npm run validate:codex-native`, `npm run validate:squad-orqx`, and the 41 focused
  React Bits/install/provider tests all passed. `npm pack --dry-run` produced the
  package payload with the React Bits skill and nine-file corpus. `npm run validate:paths`
  passed. The CI manifest gate passed; the local standalone manifest check correctly
  reports only the pre-existing, unstaged `data/entity-registry.yaml` modification,
  which is excluded from this work and preserved unchanged.
- Release evidence remains pending under DevOps authority.
