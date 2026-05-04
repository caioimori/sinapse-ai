# Codex Strategic Brief Task

## Purpose

Generate a Codex-compatible strategic brief that pulls the minimum relevant squads into scope.

## Required Inputs

- Topic or initiative to brief

## Steps

1. Read `.codex/catalog.json` and `.codex/agents/sinapse-orqx.md`.
2. Classify the topic by domains, urgency, and decision horizon.
3. Identify the minimum relevant orqx set for the brief.
4. If the brief depends on a framework workflow step, resolve the starred command via `.codex/command-registry.json`.
5. Produce a concise brief with:
   - objective
   - squads/orqx to involve
   - key unknowns
   - risks
   - recommended next action

## Output Contract

- Strategic brief
- Recommended squad/orqx set
- Key risks and unknowns
- Immediate next step
