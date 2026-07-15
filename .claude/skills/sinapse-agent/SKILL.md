---
name: sinapse-agent
description: Resolve and activate any canonical SINAPSE agent by ID in Claude Code.
---

# SINAPSE Parametric Agent Activator for Claude Code

Use the agent ID supplied with this skill. Find the matching project subagent by its
`name` frontmatter under `.claude/agents/sinapse-*.md`. Reject unknown IDs instead
of guessing. Invoke that native subagent with `@<name>` when delegation is
appropriate, and preserve its canonical authority and task contracts.
