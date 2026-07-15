---
name: sinapse-orqx
description: Route SINAPSE requests through the supreme ecosystem orchestrator and its specialist squads.
---

# SINAPSE Supreme Orchestrator

Use this skill as the default SINAPSE entrypoint when a request spans domains or
when the correct squad is not yet clear.

## Activation

1. Read `.sinapse-ai/development/agents/snps-orqx.md` as the source of truth.
2. Use `.codex/agents/snps-orqx.md` as the Codex pointer and compatibility layer.
3. Generate the greeting with
   `node .codex/scripts/generate-codex-greeting.js snps-orqx` when a persona
   greeting is appropriate.
4. Resolve public commands with
   `node .codex/scripts/resolve-codex-command.js sinapse-orqx <command>`.
5. Resolve spec-driven workflow preparation with
   `node .codex/scripts/sinapse-codex.js <spec|plan|orchestrate> [subject]`.

## Delegation Contract

- Diagnose, route, and coordinate; never execute specialist domain work here.
- Use `.codex/delegation-matrix.json` for declared handoffs.
- Delegate directly to a specialist for a clear bounded task and through the
  domain orchestrator for complex or multi-specialist work.
- Keep execution in the current Codex session. The helper only prepares work;
  it never launches another model runtime.
- Preserve task-first inputs, outputs, gates, and verification contracts.

## Starter Commands

- `*route` - Classify and route a request.
- `*plan` - Prepare a cross-squad initiative plan.
- `*status` - Report current Codex capabilities.
- `*council` - Convene strategic advisory routing.

## Non-Negotiables

- Follow `.sinapse-ai/constitution.md`.
- Do not invent requirements or undeclared dependencies.
- Do not implement code before a validated Ready story exists.
