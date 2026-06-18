# Agent Reference — SINAPSE-AI

> Reference for the **10 framework agents** ship-loaded by SINAPSE-AI.
> For the wider squad agent universe (172 agents across 17 squads), see
> the squads source-of-truth at `squads/` or run
> `npx sinapse-ai list` after install.

## Framework agents (core)

These 10 agents are framework-level — they implement the SINAPSE
development workflow (SDC, QA Loop, Spec Pipeline) and ship as full
Claude Code subagents (not stubs). All carry frontmatter, all are
spawn-eligible via the `Task` tool.

| Activation | Persona (codename) | Domain |
|------------|--------------------|--------|
| `@developer` | Pixel | Code implementation, bug fixes, refactoring |
| `@quality-gate` | Litmus | Tests, quality gates, code review, gate decisions |
| `@architect` | Stratum | System design, technology selection, complexity assessment |
| `@project-lead` | Beacon | PRDs, epic creation, strategic direction |
| `@product-lead` | Axis | Backlog management, story validation, prioritization |
| `@sprint-lead` | Sync | Story creation from epics, sprint planning |
| `@analyst` | Scope | Market research, competitive analysis, brainstorming |
| `@data-engineer` | Tensor | Schema design, migrations, RLS, query optimization |
| `@ux-design-expert` | Mosaic | UI/UX design, wireframes, accessibility |
| `@devops` | Pipeline | Git push (EXCLUSIVE), PRs, CI/CD, releases |

## Squad orqx (21)

Each of the 19 squads ships a master orchestrator (`*-orqx`) plus
inner specialists. The orqx is the entry point — invoke it first
and it routes intra-squad. Examples:

- `@brand-orqx` (Meridian) — branding, identidade visual
- `@copy-orqx` (Quill) — copywriting, persuasão
- `@design-orqx` (Nexus) — UX/UI, design system
- `@growth-orqx` (Catalyst) — growth, SEO, analytics
- `@paidmedia-orqx` (Apex) — mídia paga, ads
- `@finance-orqx` (Ledger) — financeiro, pricing
- ... (full list: `ls squads/` or see `entity-registry.yaml`)

Plus the master orchestrator:

- `@snps-orqx` (Imperator) — framework governance, cross-squad routing _(alias: `@sinapse-orqx` until v1.3.0)_

## Squad specialists (~170)

Loaded on demand via the squad orqx routing. Documented inside each
squad: `squads/SQUAD/agents/SPECIALIST.md`.

## Quick links

- Activation patterns: see `.claude/agents/README.md` (activator vs full subagent)
- Codex CLI configuration for these agents: see [`codex-config.md`](codex-config.md)
- Workflow that uses these agents: see `docs/guides/getting-started.md`

---

*Last updated: 2026-05-02 (Audit 3 P0-4 fix).*
