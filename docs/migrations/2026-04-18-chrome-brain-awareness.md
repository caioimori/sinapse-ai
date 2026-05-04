# Chrome Brain Awareness Propagation

**Date:** 2026-04-18
**Status:** Partial (core + orqx done, specialists pending)
**Branch:** caio/fix/nsn-chrome-brain-awareness

## Context

Agents were telling users to do manual UI work ("abra o dashboard e clique em X") instead of offering Chrome Brain browser automation. Root causes:

1. NSN rule (`.claude/rules/nsn-mode.md`) did not explicitly require offering Chrome Brain before asking for manual UI work
2. No agent (188 total) declared Chrome Brain in its tool awareness

## What Was Done (this PR)

- Added **Browser Protocol** section to `.claude/rules/nsn-mode.md`
- Created `.sinapse-ai/development/templates/agent-tools-kit.md` — shared toolkit reference
- Injected `## Tools Available` block with Chrome Brain reminder into:
  - 10 core agents at `.sinapse-ai/development/agents/*.md`
  - 21 squad orqx at `squads/*/agents/*-orqx.md`

## What Is Pending

### Specialists (168 agents) — Chrome Brain Awareness

Specialist agents inside `squads/*/agents/` (all `.md` files that are NOT `*-orqx.md`) did NOT receive the Chrome Brain awareness block in this PR.

**Rationale:** Specialists will go through a larger rename migration (SNPS naming scheme) planned separately. Propagating Chrome Brain awareness now would create churn that gets overwritten by the rename migration.

**Action item:** During the SNPS rename migration, include the Chrome Brain `## Tools Available` block (same content as `agent-tools-kit.md` reference) in every specialist agent file as part of the rename pass.

**Count to migrate:** ~168 specialist agents across 21 squads.

### Fix 3 — Hook Enforcement (post-GA)

A future fix should add a hook/gate that lints agent responses for anti-patterns like "abra o dashboard manualmente" and fails the gate when Chrome Brain wasn't offered first. Deferred to post-GA.

## Verification

Rule file updated: `.claude/rules/nsn-mode.md` (Browser Protocol section before Anti-Patterns)
Template created: `.sinapse-ai/development/templates/agent-tools-kit.md`
Core agents with block: 10
Squad orqx with block: 21
Specialists with block: 0 (pending)
