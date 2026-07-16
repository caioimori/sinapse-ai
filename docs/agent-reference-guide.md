# Agent Reference

> **English** | [Português](pt/agent-reference-guide.md)

SINAPSE includes **172 specialized agents**: **12 framework roles** and **160
specialists in the squad layer** across **17 squads**. The ecosystem includes
**18 orchestrators**: one supreme
orchestrator and one orchestrator per squad.

The task inventory currently contains **1,201 squad tasks**, **211 development
tasks**, **1,412 task files**, and **1,348 pointers resolvable** by the
Codex runtime. These numbers are measured from source and validated in CI.

| Provider surface | Claude Code | Codex |
|---|:---:|:---:|
| Installed skills | 37 | 37 |
| Registered hooks | 20 native registrations | 9 lifecycle events |

## Start with the orchestrator

| Provider | Activation |
|---|---|
| Claude Code | `@sinapse-orqx` |
| Codex | `$snps` |

The orchestrator classifies the request and delegates execution. Use a direct
activation only when the responsible role is already clear.

## Framework agents

| Role | Claude Code | Codex | Authority |
|---|---|---|---|
| Developer | `@developer` | `$sinapse-agent developer` | Implementation and fixes |
| Architect | `@architect` | `$sinapse-agent architect` | System architecture |
| Quality Gate | `@quality-gate` | `$sinapse-agent quality-gate` | Testing and gate decisions |
| DevOps | `@devops` | `$sinapse-agent devops` | Push, pull requests, and releases |
| Sprint Lead | `@sprint-lead` | `$sinapse-agent sprint-lead` | Story drafting |
| Product Lead | `@product-lead` | `$sinapse-agent product-lead` | Story validation and backlog |
| Project Lead | `@project-lead` | `$sinapse-agent project-lead` | Product requirements and epics |
| Analyst | `@analyst` | `$sinapse-agent analyst` | Research and analysis |
| Data Engineer | `@data-engineer` | `$sinapse-agent data-engineer` | Data architecture and migrations |
| UX Design Expert | `@ux-design-expert` | `$sinapse-agent ux-design-expert` | UX, UI, and accessibility |
| Squad Creator | `@squad-creator` | `$sinapse-agent squad-creator` | Squad design and validation |
| Supreme Orchestrator | `@sinapse-orqx` | `$snps` | Cross-squad routing |

Agent authority remains exclusive. In particular, only DevOps may push, open or
merge a pull request, or execute a release.

## Discover every agent and task

The complete catalog is resolved from source at runtime, so this document does
not maintain a second list that can drift.

```bash
# Exact ecosystem counts
node .codex/scripts/resolve-codex-agent.js --stats

# Agent definition and every task it can resolve
node .codex/scripts/resolve-codex-agent.js <agent-id>

# A specific command or task pointer
node .codex/scripts/resolve-codex-agent.js <agent-id> <command>
```

Examples:

```bash
node .codex/scripts/resolve-codex-agent.js brand-orqx
node .codex/scripts/resolve-codex-agent.js meta-ads-specialist
node .codex/scripts/resolve-codex-agent.js developer develop
```

## Operating contract

- Orchestrators route and coordinate; specialists execute.
- Code implementation normally starts from a validated story.
- Claude Code and Codex resolve the same canonical agent and task sources.
- Agent definitions live in `.sinapse-ai/development/agents/` and `squads/`.
- Provider adapters are validated with `npm run validate:parity`.

Continue with [Getting Started](getting-started.md), the
[workflow catalog](sinapse-workflows/README.md), or the
[squads overview](guides/squads-overview.md).
