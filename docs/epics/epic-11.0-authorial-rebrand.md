# Epic 11.0 — Authorial Rebrand (APSE-* naming)

**Status:** Planned
**Priority:** P2 (deferred)
**Complexity:** COMPLEX (estimated 20+ stories when fully planned)
**Prerequisite:** Epic 10.0 MUST be 100% complete with 'extrema qualidade' before starting. Do not execute until explicitly approved.

---

## Gate

Epic 10.0 MUST be 100% complete with 'extrema qualidade' before starting. Do not execute until explicitly approved by the project owner.

This epic is a **parking lot placeholder**. No stories defined yet. This file is a parking lot placeholder.

---

## Objective

Transition agent, squad, and framework surface naming to the authorial APSE-* convention (e.g., APSE Copy, APSE Orqx, APSE Content, APSE PaidMedia, APSE Copy Chief) so that the SINAPSE ecosystem presents a single, coherent, fully authorial brand system across all 186 agents, 18 squads, framework docs, CI job names, memory paths, and vault grounding rules.

---

## Preliminary Scope

### Naming Migration

- **186 agents** renamed to the APSE-* convention (e.g., APSE Pixel, APSE Stratum, APSE Litmus, etc.)
- **18 squads** renamed (squad-brand → apse-brand, squad-copy → apse-copy, and so on)
- Deprecated aliases kept for backwards compatibility during a transition window

### Documentation

- README.md, root docs, installation guides, PT/EN/ES/ZH translations updated
- All references in `.sinapse-ai/development/agents/**` regenerated with new names
- Constitution updates if the framework name itself is touched
- Agent memory paths migrated (`.sinapse-ai/development/agents/{id}/MEMORY.md` → new path)

### CI/CD & Infrastructure

- CI job names updated to APSE-* convention where they reference agents
- Skills, MCP configs, and tool registry entries updated
- `.claude/commands/SINAPSE/agents/*` and `.codex/agents/*` regenerated
- Sync pipelines (`sync:ide`, `sync:skills:codex`) must remain green throughout

### Governance

- Vault routing rules updated (`~/.claude/vault-routing.json`)
- Vault grounding rules updated
- Constitutional amendments if required (Article on agent naming)

### User-Facing

- Migration path for existing users (aliases + `sinapse migrate-names`)
- Deprecation warnings on old names for N minor versions
- Release notes explaining the transition

---

## Non-Goals

- Any changes to framework runtime behavior (this is purely a naming/identity pass)
- Changes to the squad capability matrix
- New features disguised as "rebrand"
- Constitutional changes unrelated to naming

---

## Stories

**No stories defined yet.** This file is a parking lot placeholder. When Epic 10.0 is closed and the project owner explicitly approves Epic 11.0, stories 11.1+ will be drafted by @sprint-lead following the Story Development Cycle.

---

## Notes

- This epic represents the authorial finalization of SINAPSE AI after foundational maturity is achieved.
- Do not start any implementation before explicit approval from project owner.
- The SINAPSE voice rule (enforced by the `external-refs-validation` CI job introduced by Story 10.17) will continue to apply throughout Epic 11.0 — authorial hygiene is a non-negotiable ground rule, not a phase.

---

## Change Log

| Date | Version | Description | Author |
|------|---------|-------------|--------|
| 2026-04-11 | 0.1.0 | Placeholder created by Story 10.17 (Phase 0 Foundation) | @developer (Dex) |
