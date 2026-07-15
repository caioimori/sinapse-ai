---
name: sinapse-spec-driven
description: Prepare and coordinate SINAPSE PRD, epic, story, specification, and implementation-plan workflows in Codex.
---

# SINAPSE Spec-Driven Workflow for Claude Code

Read `.sinapse-ai/development/workflows/spec-pipeline.yaml` and its referenced task
contracts. Follow PRD -> Epic -> Story -> Validation -> Implementation, delegating
each phase through Claude Code native subagents. A task contract controls inputs,
outputs, gates and verification. Never implement before a validated Ready story.
