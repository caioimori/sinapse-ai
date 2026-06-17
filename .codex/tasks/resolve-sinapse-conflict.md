# Codex Conflict Resolution Task

## Purpose

Resolve cross-squad conflicts or domain overlap without relying on shared-runtime hooks.

## Required Inputs

- Conflict or overlap description

## Steps

1. Read `.codex/catalog.json`, `.codex/agents/snps-orqx.md`, and `docs/framework/codex-parity/codex-parity-program.md`.
2. Identify the squads, agents, or workflow surfaces in conflict.
3. Separate the problem into:
   - ownership conflict
   - sequencing conflict
   - shared-surface risk
   - validation gap
4. Recommend the smallest Codex-safe resolution path.
5. If a framework command is needed, resolve it through `.codex/command-registry.json`.

## Output Contract

- Conflict diagnosis
- Recommended owner and route
- Shared-surface risks, if any
- Immediate next command or handoff
