# Audit 1.2 — Agent Invocation

**Verdict:** 🟡 CONCERNS
**Scope:** Sample 30 agents cross-squad. Verify frontmatter `name` ↔ filename ↔ entity-registry parity.

## Numbers (Reality vs Briefing)

| Metric | Briefing claim | Real | Source |
|---|---|---|---|
| Squads | 19 | **19** ✓ | `ls squads/` |
| Squad orqx | 21 | **21** ✓ | `find squads -name '*orqx*.md'` |
| Master orqx | 1 | **1** ✓ | `.sinapse-ai/development/agents/sinapse-orqx.md` |
| Total agents | 200 | **200** ✓ (188 squad + 12 framework) | `find ... -path '*/agents/*'` |
| Tasks | 1237 | **213 task .md files**; entity-registry has 753 total entities (tasks=213, modules=216, scripts=70, etc.) | `find .sinapse-ai/development/tasks` |
| Entity registry | — | 753 entities, but **only 12 agents indexed** (framework only) — 188 squad agents NOT in registry | `.sinapse-ai/data/entity-registry.yaml` (loaded via js-yaml) |

## Agent Frontmatter Heterogeneity

Sampled 4 orqx + 12 squad-brand agents. **No single frontmatter contract.** Three observed formats:

1. **YAML fenced block** (`brand-orqx.md`):
   ```yaml
   agent:
     name: "Meridian"
     id: "squad-brand/brand-orqx"
   ```
2. **Markdown bullet list** (`design-orqx.md`):
   `- **ID:** design-orqx`
   `- **Nome:** Nexus`
3. **Markdown table** (`swarm-orqx.md`):
   `| **Name** | Swarm |`

`grep -m1 'name:'` returns empty for some files (e.g. `brand-culture-architect.md`, `brand-growth-strategist.md`) — name is buried in alternate format.

## Name Collisions Cross-Squad

4 names collide across squads (greeting/routing ambiguity risk):

| Name | Files |
|------|-------|
| **Nexus** | `claude-code-mastery/swarm-orqx.md`, `squad-content/content-orqx.md` |
| **Lens** | `squad-content/content-analyst.md`, `squad-courses/production-director.md` |
| **Forge** | `squad-brand/brand-creative-engineer.md`, `squad-cloning/agent-forger.md`, `squad-copy/copy-orqx.md` (3 collisions) |
| **Arc** | `squad-brand/brand-archetype-strategist.md`, `squad-cloning/kb-architect.md`, `squad-content/content-engineer.md`, `squad-storytelling/storytelling-orqx.md` (4 collisions) |

## Findings

| ID | Sev | Finding | Evidence |
|----|-----|---------|----------|
| AG-1 | **P1** | Entity registry indexes only 12 framework agents — 188 squad agents are not catalogued. Tools relying on registry for discovery will miss 94% of agents | `.sinapse-ai/data/entity-registry.yaml` agents block |
| AG-2 | P1 | No enforced frontmatter schema — 3+ formats coexist; no validator script. Doctor reports 11 hooks found but doesn't validate agent metadata | sample of 16 agent files |
| AG-3 | **P1** | 4 agent names collide cross-squad (Nexus, Lens, Forge, Arc). Forge appears 3x, Arc 4x. User saying "@arc" is ambiguous | name extraction grep |
| AG-4 | P2 | "1237 tasks" in briefing != 213 actual task files (briefing was counting all entities) — docs/comms drift | grep |
| AG-5 | P3 | `swarm-orqx.md` exists in 2 squads (`claude-code-mastery` and `squad-claude`) — possible duplicate or intentional alias | find -name 'swarm-orqx.md' |

## Recommendation
CONCERNS. Functional invocation works (CLI list + slash commands), but the registry is incomplete and name collisions can cause UX confusion. AG-1 and AG-3 should produce GA-fix stories. AG-2 (schema) is foundational — defer to post-GA but track.
