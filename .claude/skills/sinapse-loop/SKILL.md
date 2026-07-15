---
name: sinapse-loop
description: Run an explicitly requested bounded SINAPSE inspect-fix-verify loop with a completion criterion.
---

# SINAPSE Bounded Loop for Claude Code

Activate only when the user explicitly requests this loop. Obtain a verifiable
completion criterion, then repeat inspect -> delegate correction -> verify for at
most three iterations. Stop on completion, block, user stop, or iteration three.
Use Claude Code native subagents; never launch a nested Claude or Codex process.
