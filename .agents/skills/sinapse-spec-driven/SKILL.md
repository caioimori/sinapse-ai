---
name: sinapse-spec-driven
description: Prepare and coordinate SINAPSE PRD, epic, story, specification, and implementation-plan workflows in Codex.
---

# SINAPSE Spec-Driven Workflow

Use this skill for documentation-first delivery: PRDs, epics, stories, specs,
implementation plans, and the transition into the Story Development Cycle.
Use `.sinapse-ai/development/agents/snps-orqx.md` as the orchestration source of truth;
the optional greeting helper is `.codex/scripts/generate-codex-greeting.js`.

## Workflow Preparation

1. Select `spec`, `plan`, or `orchestrate` from the user's requested outcome.
2. Prepare the canonical phase graph with
   `node .codex/scripts/sinapse-codex.js <spec|plan|orchestrate> [subject] --complexity STANDARD`.
3. Treat `.sinapse-ai/development/workflows/spec-pipeline.yaml` as the canonical
   sequence and each referenced task Markdown contract as authoritative for
   inputs, outputs, gates, and verification.
4. Delegate each phase to the mapped agent in the current Codex session.
5. Stop at blocking gates, missing inputs, or required user elicitation.

## Delivery Rules

- Follow PRD to Epic to Story to Validation to Implementation.
- Use the complexity profile selected by the Architect: SIMPLE, STANDARD, or
  COMPLEX.
- A task contract overrides conflicting output or verification metadata in the
  workflow file.
- `orchestrate` appends the declared SDC handoff chain from
  `.codex/delegation-matrix.json`.
- The helper prepares deterministic work packets only; it does not launch a
  nested model process or execute domain work.
- No implementation begins before the story is validated and Ready.
