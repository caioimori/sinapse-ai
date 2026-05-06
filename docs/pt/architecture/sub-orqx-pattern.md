# Sub-Orqx 3-Level Pattern

> **Status:** Documented pattern — intentional architectural choice.
> **Scope:** Currently only `claude-code-mastery`. Do NOT normalize elsewhere without justification.
> **Related:** Constitution Article XI (Conservative Default)

## Overview

SINAPSE default is a 2-level orchestration topology:

```
sinapse-orqx (Imperator)
    |
    +-- squad-orqx (e.g. @brand-orqx, @growth-orqx, @copy-orqx)
            |
            +-- specialist agents
```

`claude-code-mastery` breaks this pattern intentionally with a **3-level** topology:

```
sinapse-orqx (Imperator)
    |
    +-- claude-orqx (squad orchestrator)
            |
            +-- swarm-orqx (sub-orchestrator for orchestration specialists)
            |       |
            |       +-- hooks-architect, mcp-integrator, config-engineer,
            |           project-integrator, roadmap-sentinel
            |
            +-- tools-orqx (sub-orchestrator for tool-crafters)
            |       |
            |       +-- skill-craftsman, db-sage
            |
            +-- (direct specialists, when domain is narrow enough to skip sub-orqx)
```

## Why This Exists

The Claude Code mastery domain has two internally coherent sub-domains that each warrant their own routing layer:

| Sub-orqx | Sub-domain | Rationale |
|----------|-----------|-----------|
| `swarm-orqx` | Orchestration specialists (hooks, MCP, config, project, roadmap) | Fan-out parallel: these agents often work in parallel on independent pieces (a hook setup AND an MCP integration AND a config audit). A sub-orchestrator coordinates the swarm. |
| `tools-orqx` | Tool-crafters (skill-craftsman, db-sage) | These agents PRODUCE reusable artifacts (skills, database patterns) consumed by other squads. Isolating them behind `tools-orqx` keeps the production pipeline independent from the consumption pipeline. |

## When to Use This Pattern

Only add a sub-orqx layer when ALL of these hold:

1. **Clear subdomain boundary** — the sub-group has a coherent, nameable shared context (e.g. "everything about hooks + MCP + config" is "Claude runtime integration").
2. **Real fan-out parallelism** — specialists in the sub-group often work concurrently on independent tasks.
3. **Stable membership** — the sub-group is not a temporary grouping; agents inside share lifecycle and release cadence.
4. **>= 4 specialists** — below that, routing overhead dominates.

## When NOT to Use This Pattern

- Small squads (< 6 agents total) — flat topology is cheaper.
- Squads where all specialists are sequential handoffs rather than parallel fan-out.
- "Virtual grouping" for documentation only — docs can group without adding a routing layer.

## Examples

### swarm-orqx routing

```
User: "Configure hooks + MCP servers + settings for this project"
  -> sinapse-orqx
  -> claude-orqx
  -> swarm-orqx (detects multi-specialist parallel work)
  -> hooks-architect | mcp-integrator | config-engineer (parallel)
  -> results merged back through swarm-orqx -> claude-orqx -> user
```

### tools-orqx routing

```
User: "Create a reusable skill for X and document the DB access pattern"
  -> sinapse-orqx
  -> claude-orqx
  -> tools-orqx (detects tool-crafting work)
  -> skill-craftsman | db-sage (parallel or sequential depending on dependency)
```

## Non-Normalization Rule

**Do NOT remove this pattern or replicate it to other squads during audits unless ALL of the following are true:**

1. The 4 "when to use" criteria above hold for the target squad.
2. The change is proposed as its own Story (not as a side effect of another refactor).
3. A specialist on the affected squad has reviewed the impact.

**Rationale:** This pattern was introduced because the flat topology was causing routing confusion inside `claude-code-mastery`. Collapsing back to 2 levels would re-introduce that confusion. Constitution Article XI (Conservative Default) applies.

## Historical Context

- Established: Story 10.23 (claude-code-mastery dual register + orchestration refactor).
- Audited: Pre-GA audit 2026-04-18 — pattern validated, retained.

## See Also

- `docs/architecture/dual-register-pattern.md` — Related: why claude-code-mastery and claude-code-mastery coexist.
- `.sinapse-ai/constitution.md` — Article XI (Conservative Default).
