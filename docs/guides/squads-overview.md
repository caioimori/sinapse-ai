# Squads Overview

A squad is a bounded team of agents, tasks, workflows, and knowledge for one
domain. SINAPSE ships 17 squads in this repository; their canonical counts are
measured from disk rather than maintained in a static table.

```bash
node .codex/scripts/resolve-codex-agent.js --stats
```

## Operating model

- An orchestrator (`*-orqx`) routes and coordinates domain work.
- Specialists execute within distinct authority boundaries.
- Tasks define reusable delivery contracts.
- Claude Code and Codex adapters resolve the same canonical source.
- Cross-squad work is coordinated through explicit handoffs.

## Activation

```text
Claude Code: @animations-orqx
Codex:       $sinapse-agent animations-orqx
```

Use `@sinapse-orqx` or `$snps` when the correct squad is not obvious.

## Extension

Bundled squads live under `squads/` and use `squad.yaml`. New squads require a
proposal, distinct authority, resolvable task pointers, provider parity, tests,
documentation, and maintenance ownership. See
[contributing-squads.md](contributing-squads.md).
