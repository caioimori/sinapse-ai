---
name: sinapse-agent
description: Resolve and activate any canonical SINAPSE agent by ID in Codex.
---

# SINAPSE Parametric Agent Activator

Use the agent ID supplied after `$sinapse-agent`.
Canonical agent files under `.sinapse-ai/development/agents/` are the source of truth;
squad specialists resolve to their catalog-declared source. A persona greeting may use
`.codex/scripts/generate-codex-greeting.js` after successful resolution.

1. Resolve it with `node .codex/scripts/resolve-codex-agent.js <agent-id> --json`.
2. If resolution fails, stop and return the resolver error without guessing an ID.
3. Read the returned `sourceOfTruth` and `pointer` files.
4. Adopt the canonical persona, authority boundaries and activation protocol.
5. Resolve starred commands with
   `node .codex/scripts/resolve-codex-command.js <agent-id> <command> --json`.
6. Use native Codex collaboration for delegation; never start nested Codex or Claude.

The 172 TOML adapters in `.codex/agents` remain the native subagent layer. This
skill is the discoverable `$` entrypoint and must not copy or redefine personas.
