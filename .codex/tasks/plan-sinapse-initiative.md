# Codex Plan Task

## Purpose

Produce a Codex-compatible multi-agent execution plan for a complex initiative.

## Required Inputs

- Initiative description

## Steps

1. Read `.codex/catalog.json`.
2. Break the initiative into domains, risks, and dependencies.
3. Choose the minimum agent/orqx set required for execution.
4. For framework workflow steps, resolve commands via `.codex/command-registry.json`.
5. Structure the plan in phases:
   - diagnosis
   - preparation
   - execution
   - validation
6. For each phase, define:
   - owner agent/orqx
   - expected artifact or outcome
   - validation step
7. Keep the plan Codex-only unless a shared-surface risk is explicitly flagged.

## Output Contract

- Phase-by-phase execution plan
- Ownership and handoffs
- Validation gates
- Shared-surface risks, if any
