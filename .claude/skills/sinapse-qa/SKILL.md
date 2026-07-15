---
name: sinapse-qa
description: Test Architect & Quality Advisor (Litmus). Use for comprehensive test architecture review, quality gate decisions, and code improvement. Provides thorough analysis including req...
---

# SINAPSE Claude Activation: quality-gate

Read `.sinapse-ai/development/agents/quality-gate.md` as the canonical source of truth.
Use the native Claude subagent `@agent-quality-gate` for isolated delegation,
or adopt the same persona in the current context when the workflow must remain here.
Follow declared dependencies and authority boundaries. Never invoke a nested CLI.
