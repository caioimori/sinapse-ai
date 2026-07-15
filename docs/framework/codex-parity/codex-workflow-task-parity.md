# Codex Workflow And Task Parity

## Goal

Make the core SINAPSE workflow commands in Codex resolve to concrete repository artifacts without manual file hunting.

## Command Registry

The Codex workflow bridge now lives in:

- `.codex/command-registry.json`

This registry is the deterministic Codex contract for the critical workflow path:

- `sinapse-orqx`
- `sinapse-pm`
- `sinapse-po`
- `sinapse-sm`
- `sinapse-dev`
- `sinapse-qa`
- `sinapse-architect`
- `sinapse-analyst`
- `sinapse-devops`

Agents and commands outside this curated path fall through to the parametric
resolver, which reads their real source definitions and task dependencies.

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

- Imperator: `onboard`, `route`, `plan`, `status`, `brief`, `resolve`, `council`
- PM: `create-prd`, `create-brownfield-prd`, `create-epic`, `create-story`, `research`, `execute-epic`, `gather-requirements`, `write-spec`, `clarify-spec`, `create-spec`, `shard-prd`
- PO: `validate-story`, `validate-story-draft`, `backlog-review`, `backlog-prioritize`, `backlog-schedule`, `close-story`, `execute-checklist-po`, `sync-story`, `pull-story`, `stories-index`
- SM: `draft`, `story-checklist`
- Developer: `develop`, `run-tests`, `apply-qa-fixes`, `execute-subtask`, `verify-subtask`, `backlog-debt`, build commands
- Architect: `assess-complexity`, `create-plan`, `create-context`
- Analyst: `research-deps`
- QA: `review`/`review-story`/`code-review`, `gate`, `critique-spec`, `analyze-spec`, `review-build`, `create-fix-request`, `test-design`, `run-tests`, `nfr-assess`, `validate-libraries`, `security-check`, `validate-migrations`, `evidence-check`, `false-positive-check`, `console-check`
- DevOps: `pre-push`, `push`, `create-pr`

## Validation

The registry is enforced by:

- `npm run validate:codex-commands`
- `npm run validate:codex-sync`
- `npm run validate:codex-native`

The validator checks that:

- the registry exists and parses
- each mapped agent points to a real Codex skill
- each mapped target exists
- each declared resource exists
- the critical workflow agents keep their minimum required command coverage
- agent aliases and in-agent command aliases do not collide

## Imperator Tasks

Because the shared `sinapse-orqx` runtime is still partially broken upstream, Codex now has explicit local tasks for:

- `.codex/tasks/onboard-sinapse-codex.md`
- `.codex/tasks/route-sinapse-request.md`
- `.codex/tasks/plan-sinapse-initiative.md`
- `.codex/tasks/status-sinapse-capabilities.md`
- `.codex/tasks/create-sinapse-strategic-brief.md`
- `.codex/tasks/resolve-sinapse-conflict.md`
- `.codex/tasks/convene-sinapse-council.md`

These keep the workflow Codex-only and avoid risky shared-runtime edits.

## Current Coverage

The curated registry provides deterministic mappings for the critical delivery
path, while the parametric resolver and native TOML adapters cover all 172 current
agents. Spec, plan, and orchestrate preparation is resolved from canonical task
and workflow files by `.codex/scripts/resolve-codex-workflow.js`.

MCP capabilities remain separate from agent and workflow parity. Provider output
can differ, but authority, source artifacts, gates, and delivery order are shared.
