# Codex Workflow And Task Parity

## Goal

Make the core SINAPSE workflow commands in Codex resolve to concrete repository artifacts without manual file hunting.

## Command Registry

The Codex workflow bridge now lives in:

- `.codex/command-registry.json`

This registry is the Codex-only contract for the critical workflow path:

- `sinapse-orqx`
- `sinapse-pm`
- `sinapse-po`
- `sinapse-sm`
- `sinapse-dev`
- `sinapse-qa`

For each agent, it maps:

- command
- command aliases
- target task or Codex-only task
- supporting resources
- source reference used for parity

## Resolver

Use the resolver to inspect a command before executing it:

```bash
node .codex/scripts/resolve-codex-command.js sinapse-dev develop
node .codex/scripts/resolve-codex-command.js sinapse-sm draft --json
node .codex/scripts/resolve-codex-command.js sinapse-orqx onboard
```

This is especially useful in Codex when a command exists in the agent persona but the execution path is spread across tasks, checklists, templates, and workflows.

## Covered Flow

Critical workflow coverage now includes:

- Imperator: `onboard`, `route`, `plan`, `status`
- PM: `create-prd`, `create-brownfield-prd`, `create-epic`, `create-story`, `research`, `execute-epic`
- PO: `validate-story`, backlog operations, story sync/pull/index
- SM: `draft`, `story-checklist`
- Developer: `develop`, `execute-subtask`, `verify-subtask`, build commands
- QA: `review-story`, `gate`, `review-build`, `create-fix-request`, `test-design`, `run-tests`

## Validation

The registry is enforced by:

- `npm run validate:codex-commands`
- `npm run validate:codex-sync`

The validator checks that:

- the registry exists and parses
- each mapped agent points to a real Codex skill
- each mapped target exists
- each declared resource exists

## Imperator Tasks

Because the shared `sinapse-orqx` runtime is still partially broken upstream, Codex now has explicit local tasks for:

- `.codex/tasks/onboard-sinapse-codex.md`
- `.codex/tasks/route-sinapse-request.md`
- `.codex/tasks/plan-sinapse-initiative.md`
- `.codex/tasks/status-sinapse-capabilities.md`

These keep the workflow Codex-only and avoid risky shared-runtime edits.

## Current Limit

This layer solves deterministic command discovery and routing for the critical workflow path.
It does not yet provide full specialist coverage across all 178 agents, and it does not replace MCP parity.
