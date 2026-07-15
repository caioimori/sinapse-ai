---
name: sinapse-loop
description: Run an explicitly requested bounded SINAPSE inspect-fix-verify loop with a completion criterion.
---

# SINAPSE Bounded Loop

Activate only when the user explicitly requests `@loop` or names this skill.
Never infer loop mode from words such as retry, improve, or continue.
Use `.sinapse-ai/development/agents/snps-orqx.md` as the orchestration source of truth;
the optional greeting helper is `.codex/scripts/generate-codex-greeting.js`.

## Required Setup

1. Obtain a concrete, verifiable completion criterion before iteration one.
2. Prepare the loop with
   `node .codex/scripts/sinapse-codex.js loop prepare --criterion "<criterion>"`.
3. Confirm the hard maximum of 3 iterations.

## Iteration Contract

Each iteration is exactly:

1. Inspect current evidence against the completion criterion.
2. Delegate the smallest in-scope correction to the authorized agent.
3. Verify with relevant deterministic checks.

After verification, record exactly one outcome with
`node .codex/scripts/sinapse-codex.js loop advance --outcome <continue|complete|blocked|user-stop>`.
The project-local state under `.sinapse/workflow-state/` rejects a fourth
iteration even if another continuation is requested.

Stop immediately when the criterion is met, after iteration 3, when blocked,
or when the user asks to stop. Report the final evidence and stop reason. Never
run an unbounded or silent loop, and never launch a nested model runtime.
