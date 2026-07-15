# Codex Native Runtime v2

## Activating SINAPSE in Codex

Codex uses two complementary native surfaces:

- `$skill-name` selects a discoverable skill from `.agents/skills`.
- `.codex/agents/*.toml` defines custom agents used for native delegation.

Use `$snps`, `$sinapse`, `$snps-orqx`, or `$sinapse-orqx` to enter through the
supreme orchestrator. The 32 public SINAPSE activators are available directly,
including `$sinapse-architect`, `$sinapse-dev`, and `$sinapse-qa`.

For any specialist in the complete 172-agent catalog, use
`$sinapse-agent <agent-id>`. The parametric activator resolves the canonical
source at runtime and rejects unknown IDs instead of guessing. For example:

```text
$sinapse-agent meta-ads-specialist
```

`.codex/catalog.json` is the registry for this Codex activation surface. The
native `.agents/skills` tree is mirrored to `.codex/skills` for compatibility
with older Codex builds. Clean installs and upgrades reconcile managed files
idempotently without deleting valid user-owned skills.

The default tier deliberately exposes aliases, core agents, orchestrators and
the parametric activator, not one selector entry per specialist. Users who need
every agent as an individual `$` entry can opt in explicitly:

```bash
node .codex/scripts/sync-codex-native.js --expanded-skills
```

Expanded individual skills are generated only under the official
`.agents/skills` tree. They do not duplicate or alter the 172 TOML adapters.

## Purpose

The Codex native runtime makes SINAPSE planning and delivery contracts available
inside a Codex session without changing the Claude Code implementation. It is an
additive preparation layer: canonical agents, tasks, workflows, templates, and
checklists remain the source of truth, while Codex-specific files expose those
contracts through native agents, skills, hooks, and deterministic resolvers.

The supported preparation journey is:

```text
PRD -> Epic -> Story draft -> Story validation -> Spec -> Plan -> Development -> QA
```

Implementation remains blocked until the story is validated and Ready. Push,
pull-request, and release authority remains exclusive to DevOps.

## Project-local Codex configuration

`.codex/config.toml` enables hooks, multi-agent collaboration, and goals for this
project. Native delegation is bounded to six concurrent threads and one level of
subagent depth. The installer copies this file into the project; it does not edit
the user's global Codex configuration.

The project config and generated agent TOMLs intentionally omit `model` and
`model_reasoning_effort`. Model choice and reasoning effort therefore inherit the
active Codex host or user configuration instead of being frozen by SINAPSE.

## Native agents

`.codex/agents/` contains two additive surfaces:

- 172 Markdown pointers retained for backward compatibility and source lookup.
- 172 native TOML custom-agent adapters generated from those pointers.

Run `npm run sync:ide:codex` to synchronize both surfaces. Native synchronization
is deterministic and idempotent, preserves every Markdown pointer, derives safe
descriptions from canonical agent metadata, and never pins a model. The
`snps-orqx.toml` filename remains aligned with its canonical pointer while exposing
the public `sinapse-orqx` name and aliases.

Every native adapter instructs Codex to read `AGENTS.md`, load the canonical agent
definition, respect its authority, and resolve task commands from real files. An
orchestrator coordinates native subagents; it does not execute specialist work or
start a nested model process.

## Native skills

Current Codex skill entrypoints live under `.agents/skills/`:

- `sinapse-orqx` routes requests through the supreme orchestrator.
- `sinapse-spec-driven` prepares PRD, Epic, Story, Spec, and Plan delivery.
- `sinapse-loop` runs an explicitly requested bounded correction loop.

Equivalent `.codex/skills/` copies are compatibility entrypoints for existing
installations. New Codex discovery should use `.agents/skills/`; both locations
resolve the same canonical SINAPSE sources.

## Hook and apply_patch bridge

`.codex/hooks.json` registers session, prompt, subagent, compaction, tool, and stop
events. `.codex/hooks/claude-compat.cjs` translates Codex events into the existing
SINAPSE safety contract without modifying any `.claude/**` file.

After installing or updating SINAPSE, start a new Codex session and run `/hooks`
to review and trust the project hook definitions. Codex intentionally does not
activate changed project hooks until the operator has reviewed them.

For `apply_patch`, the bridge extracts every Add, Update, Delete, and Move target.
A multi-file patch is denied in full when any target is unsafe. The bridge:

- blocks L1/L2 protected-path writes;
- blocks secret-like content without echoing the secret;
- fails closed for malformed patches;
- enforces DevOps-only Git push authority and protected-branch rules;
- blocks destructive SQL such as `DROP`, `TRUNCATE`, and `ALTER ... DROP`;
- allows safe L4 edits and authorized, explicit non-protected operations.

The bridge is a Node compatibility adapter, not a Claude subprocess. Existing
Claude guards may be invoked as policy checks when present, but the Claude runtime
is never launched. Codex documents `PreToolUse` as a guardrail rather than a
complete security boundary, so repository permissions and normal human review
remain required for equivalent execution paths that hooks do not intercept.

## Direct sinapse-codex commands

The additive helper emits deterministic JSON work packets from project-local
sources. It prepares work for native delegation; it does not execute domain work.

When installed as an npm binary, `sinapse-codex` discovers the caller's SINAPSE
project from the current directory (including nested project folders). The
project-local Node path below remains available for source checkouts.

```powershell
node .codex/scripts/sinapse-codex.js doctor
node .codex/scripts/sinapse-codex.js agent sinapse-pm
node .codex/scripts/sinapse-codex.js command project-lead create-prd

node .codex/scripts/sinapse-codex.js spec <subject> --complexity STANDARD
node .codex/scripts/sinapse-codex.js plan <subject> --complexity STANDARD
node .codex/scripts/sinapse-codex.js orchestrate <subject> --complexity STANDARD
```

The same operations are available as `sinapse-codex doctor`, `sinapse-codex
spec <subject>`, `sinapse-codex plan <subject>`, and `sinapse-codex orchestrate
<subject>` after package installation.

`SIMPLE`, `STANDARD`, and `COMPLEX` select the phase profile declared by the
canonical spec workflow. The older `workflow <spec|plan|orchestrate>` form remains
available as a compatibility alias.

`spec` emits specification phases only. `plan` includes the applicable spec phases
and the implementation-plan and analysis gates. `orchestrate` also appends the
declared story-delivery chain:

```text
Project Lead -> Sprint Lead draft -> Product Lead validate
-> Developer -> Quality Gate -> DevOps
```

The helper contains no `claude` invocation and never starts `codex exec`.

## Task-first precedence

`.sinapse-ai/development/workflows/spec-pipeline.yaml` selects phase order,
conditions, and complexity profiles. Each referenced task Markdown file is the
authoritative contract for inputs, outputs, elicitation, gates, and verification.

When workflow metadata and a task contract differ, the task contract wins for
inputs, outputs, and verification. Resolved phase packets expose this decision as
`taskFirst: true`, so delegation does not silently invent or replace canonical
requirements.

## Bounded loop

The loop is opt-in. It activates only when the user explicitly requests `@loop` or
the `sinapse-loop` skill and supplies a verifiable completion criterion.

```powershell
node .codex/scripts/sinapse-codex.js loop status
node .codex/scripts/sinapse-codex.js loop prepare --criterion "focused tests pass"
node .codex/scripts/sinapse-codex.js loop advance --outcome continue
```

Each iteration is `inspect -> delegate -> verify`. The loop stops immediately when
the criterion is met, the work is blocked, the user stops it, or iteration three
finishes. Project-local state in `.sinapse/workflow-state/codex-loop.json`
enforces the cap and rejects a fourth advance. It never runs silently or without
a maximum.

## Install, synchronize, and validate

Install from the target project and select Codex support in the installer:

```powershell
npx sinapse-ai install
```

For framework development or a source checkout:

```powershell
npm run sync:ide:codex
npm run validate:codex-native
npm run validate:codex-sync
npm run validate:codex-commands
npm run validate:codex-delegation
npm run validate:codex-skills
npx jest tests/integration/codex-native-golden-journey.test.js --runInBand
```

`validate:codex-native` checks project TOML, 1:1 native-agent parity, native and
compatibility skills, command targets, delegation equivalence, hooks, and the
absence of nested Claude/Codex execution. `validate:codex-sync` runs both the
legacy synchronization validator and the stricter native validator.

Use the project-local doctor for a machine-readable summary:

```powershell
node .codex/scripts/sinapse-codex.js doctor
```

## Claude compatibility boundary

The Codex runtime is additive and must not edit `.claude/**`, protected framework
core files, or the shared Claude-backed master orchestrator. Claude Code continues
to use its existing agents, commands, hooks, and workflows unchanged. Canonical
SINAPSE task and workflow files are read at runtime by both integrations, so fixes
to project-local Codex adapters do not fork business rules or replace the Claude
surface.

Codex parity means equivalent authority, reachability, gates, and operator
outcomes. It does not promise identical model prose or provider-specific lifecycle
behavior.
