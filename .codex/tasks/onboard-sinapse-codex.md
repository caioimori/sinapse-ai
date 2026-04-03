# Codex Onboard Task

## Purpose

Guide the user through the real Codex operating surface for SINAPSE in this repository.

## Required Inputs

- Optional focus area or domain

## Steps

1. Read `AGENTS.md` and `.codex/catalog.json`.
2. Explain the preferred activation path in Codex:
   - `/skills` -> `sinapse-<agent>`
   - `@agent` aliases from `AGENTS.md`
3. Explain the two Codex layers:
   - `.codex/skills` for activation
   - `.codex/agents` for expanded catalog and specialist context
4. Explain the validated operator commands:
   - `npm run sync:ide:codex`
   - `npm run validate:codex-sync`
   - `npm run validate:codex-integration`
   - `npm run validate:codex-commands`
   - `npm run validate:codex-skills`
   - `npm run validate:paths`
5. If the user asks how commands map to tasks/workflows, consult `.codex/command-registry.json`.
6. Tailor the final walkthrough to the requested focus area, if provided.

## Output Contract

- Short explanation of how to activate agents in Codex
- Short explanation of how workflows/tasks are resolved in Codex
- Concrete next step for the user based on the requested focus
