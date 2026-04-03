# Codex Parity Program

## Goal

Bring SINAPSE on Codex as close as possible to the Cloud/Claude experience in:

- agent activation
- orqx naming and invocation
- squad routing and handoff behavior
- skills and command exposure
- task and workflow execution
- MCP-backed capability access
- validation, guardrails, and operator ergonomics

The default rule is strict isolation:

- improve Codex first
- preserve Cloud/Claude behavior
- touch shared surfaces only when necessary
- prove no-regression before any shared change is accepted

## Definition Of Success

Codex parity is considered high quality when all of the following are true:

- `@sinapse-orqx` and all supported orqx activate reliably with the expected identity, naming, and command surface
- `/skills` exposes the same practical entry points needed for daily SINAPSE use
- Codex can route through orqx -> squad -> specialist patterns with minimal manual glue
- tasks and workflows required by the agent system are reachable and documented for Codex operators
- MCP setup is repeatable and validated for Codex users
- validators can detect drift, broken activation, missing skills, and incomplete Codex setup early
- the resulting Codex experience is consistent enough that Cloud/Claude is not required for normal framework use

## Hard Boundaries

These surfaces are Codex-first and safe to evolve as the primary delivery area:

- `AGENTS.md`
- `.codex/**`
- Codex-specific validation scripts
- Codex-specific docs
- project-level `.mcp.json`
- global `~/.sinapse/mcp` bootstrap and linking guidance for Codex users

These surfaces are shared and must be treated as high risk:

- `.sinapse-ai/development/agents/**`
- `.sinapse-ai/development/scripts/**`
- `.sinapse-ai/core/**`
- `.claude/**`

Shared-surface changes only happen when all three conditions are true:

1. the Codex gap cannot be solved in Codex-only surfaces
2. the change improves or preserves Claude/Cloud behavior
3. the change passes explicit no-regression review

## Known Baseline Gaps

Current baseline issues observed in this repository:

1. Canonical/source-of-truth split
The official Codex sync reads `.sinapse-ai/development/agents`, but the richer Codex catalog already lives in `.codex/agents`.

2. Broken canonical `sinapse-orqx`
The shared greeting pipeline currently falls back because `.sinapse-ai/development/agents/sinapse-orqx.md` contains YAML that does not parse.

3. Codex validation drift
Resolved for the Codex local-first path in Story `7.7.6`.
`validate:codex-sync`, `validate:codex-skills`, `validate:codex-integration`, and `validate:paths`
now pass against the expanded Codex contract. Remaining parity failures are shared or non-Codex.

4. Incomplete MCP reality
This project currently has no `.mcp.json`, and the global SINAPSE MCP config is not yet bootstrapped in `~/.sinapse/mcp`.

5. Path validation mismatch
Resolved in Story `7.7.6` by teaching the validator about expanded Codex source prefixes,
fallback activation paths, and Codex-specific greeting adapters.

6. Platform limits
Codex does not fully replicate Claude lifecycle hooks. Some parity must come from instructions, validations, wrappers, and workflow discipline rather than true runtime parity.

## Program Principles

- Documentation first
- Codex-only first
- Zero accidental Claude regression
- One task at a time
- Dual review on every task
- No hidden source-of-truth splits
- No parity claim without validation

## Operating Mode

This program must run in maintainer-safe mode:

- prefer isolated feature branches and worktrees
- avoid touching files already in motion from parallel maintainer sessions unless required
- prefer additive Codex-only changes over shared refactors
- stop when a change would require speculative shared-runtime surgery

## Target Architecture

The recommended architecture for high Codex parity is not "make Codex act like Claude internally".
It is a Codex-only compatibility layer that reproduces the practical SINAPSE experience as closely as possible.

### Codex Catalog Layer

Purpose:
Represent the full usable Codex catalog of orqx, squads, and specialists.

Requirements:

- one explicit catalog source for Codex parity
- no dependence on the current 12-agent canonical subset for full Codex export
- traceability from each exported Codex artifact back to its upstream source

### Codex Skill Export Layer

Purpose:
Generate `.codex/skills` from the real Codex catalog, not from an incomplete upstream subset.

Requirements:

- full orqx coverage
- key framework agent coverage
- stable aliases and activation instructions
- validators aware of the expanded catalog

### Codex Activation Adapter

Purpose:
Make Codex activation resilient and predictable without destabilizing the shared runtime.

Requirements:

- tolerate current upstream parse issues through Codex-side fallback paths
- preserve agent identity, aliases, and starter commands
- keep Codex activation behavior explicit in `.codex/**` and `AGENTS.md`

### Codex MCP Bootstrap

Purpose:
Make MCP capability on Codex reproducible, validated, and documented.

Requirements:

- global `sinapse mcp setup`
- project `sinapse mcp link`
- Codex-ready `.mcp.json` strategy
- minimal and full presets

### Codex Parity Validator

Purpose:
Measure Codex against the intended Codex contract instead of the current partial assumptions.

Requirements:

- understand expanded Codex catalog
- validate skills, activation, and MCP baseline
- fail on drift relevant to Codex users

## Delivery Protocol Per Task

Every Codex parity task must follow the same sequence:

1. Define the task and acceptance criteria
2. Map affected surfaces and identify whether they are Codex-only or shared
3. Design the smallest change that improves Codex without touching Claude/Cloud
4. Implement
5. Review A: structural review
Review architecture, source-of-truth, file ownership, and unintended coupling
6. Review B: parity and regression review
Review Cloud/Claude safety, Codex UX quality, and validation coverage
7. Run the relevant smoke checks and validators
8. Update story checklist and file list
9. Only then start the next task

If either review fails, the task returns to implementation and does not advance.

## Workstreams

### W0. Safety Baseline

Purpose:
Create the safety rails for the entire program.

Outputs:

- parity story and program plan
- explicit Codex-only vs shared-surface policy
- review protocol
- no-regression checklist

### W1. Activation And Greeting Parity

Purpose:
Make agent activation, identity, and greeting behavior reliable in Codex.

Focus:

- fix canonical `sinapse-orqx` parsing
- verify greeting pipeline behavior in Codex
- ensure `@agent` and `/skills` entry points feel consistent

### W2. Catalog And Source-Of-Truth Parity

Purpose:
Resolve the split between the short canonical agent set and the large Codex catalog.

Focus:

- define the real source of truth for Codex parity
- export the full catalog cleanly
- prevent future drift

### W3. Skills Parity

Purpose:
Ensure all needed orqx and key framework agents are available through Codex skills with correct activation instructions.

Focus:

- local-first `.codex/skills`
- full orqx coverage
- clean validation
- no duplicate global/local skill confusion

### W4. Command, Task, And Workflow Parity

Purpose:
Expose the same practical working surface available in Cloud/Claude.

Focus:

- commands shown in Codex activation
- workflow discoverability
- task routing from agent persona to task artifacts
- operator instructions when runtime hooks are unavailable

Current state after Story `7.7.7`:

- a Codex-only command registry now maps the critical workflow agents to concrete tasks/resources
- Codex has a resolver CLI for `command -> task/workflow` lookup
- Codex has a validator that fails on missing targets/resources, missing minimum coverage, and alias collisions
- Imperator now has Codex-only tasks for `onboard`, `route`, `plan`, `status`, `brief`, `resolve`, and `council`
- repo-wide quality gates currently show `lint` and `typecheck` green, while `npm test` still has unrelated shared drift in `wizard/report-generator` and `validate-publish`

### W5. Orchestration And Delegation Parity

Purpose:
Bring Codex as close as possible to real multi-agent orchestration behavior.

Focus:

- orqx -> squad -> specialist routing model
- handoff artifacts and context rules
- Codex-compatible delegation patterns
- minimum-manual-glue execution model

Execution detail is now formalized in `docs/codex-total-parity-orchestration-plan.md`.

Current recommended implementation story:

- Story `7.7.8` - Codex delegation and handoff parity

Immediate next slice:

- Story `7.7.8`: Codex orchestration and delegation parity
- execution plan recorded in `docs/codex-total-parity-orchestration-plan.md`

### W6. MCP Parity

Purpose:
Make Codex MCP setup repeatable, validated, and production-ready.

Focus:

- global `sinapse mcp setup`
- project `sinapse mcp link`
- project `.mcp.json` strategy
- preset guidance for minimal/full Codex operation

### W7. Validation And Drift Control

Purpose:
Make Codex parity measurable and enforceable.

Focus:

- sync validators
- skills validators
- integration validators
- parity report
- Codex health checks

### W8. Cross-IDE Improvement Loop

Purpose:
Allow Cloud/Claude and Codex to improve each other safely without regression.

Focus:

- Codex-side docs for using Claude/Cloud to audit Codex
- strict boundary rules for shared files
- reproducible comparison and review workflow

## Handoff Matrix

This program should use the SINAPSE ecosystem itself as the operating model.

Primary orchestration:

- `@sinapse-orqx`: executive routing, cross-workstream prioritization, and final synthesis

Specialist orchestration roles:

- `@claude-orqx`: Claude/Cloud parity analysis, hook-gap mitigation, Codex-compatible replacements
- `@swarm-orqx`: multi-agent topology, handoff protocol, orchestration process design
- `@devops`: validation, CI safety, branch discipline, release-safe guardrails
- `@architect`: source-of-truth decisions, shared-vs-Codex boundary design
- `@developer`: implementation of Codex-only artifacts, sync logic, validators, docs glue
- `@quality-gate`: parity review, regression review, test and validation gatekeeping
- `@analyst`: gap mapping, benchmark of actual operator journeys, documentation clarity checks

Domain squads can be consulted to validate their own Codex activators:

- `@brand-orqx`
- `@content-orqx`
- `@copy-orqx`
- `@research-orqx`
- `@product-orqx`
- `@design-orqx`
- `@animations-orqx`
- `@claude-orqx`
- `@swarm-orqx`

## Initial Execution Order

The recommended first sequence is:

1. W0: safety baseline and formal program docs
2. W1: repair `sinapse-orqx` activation/greeting parity
3. W2: resolve Codex source-of-truth and export strategy
4. W3: restore clean Codex skills parity for orqx and core agents
5. W7: make validators reflect the intended Codex reality
6. W6: establish reliable MCP bootstrap for Codex users
7. W4: tighten command/task/workflow exposure in Codex
8. W5: deepen orchestration and delegation parity
9. W8: add the Cloud/Claude-assisted improvement loop

## Phase Model

### Phase 0 - Governance Boundary

Objective:
Freeze the Codex-only perimeter and define what must not regress in Claude/Cloud.

Primary handoffs:

- `@sinapse-orqx` -> `@architect` -> `@devops`

Exit criteria:

- every relevant repo area is classified as `Codex-only`, `shared`, or `Claude-only`
- no-regression rule is documented
- protected/shared surfaces are explicit

### Phase 1 - Baseline And Parity Contract

Objective:
Turn the Claude/Cloud reference behavior into a verifiable Codex contract.

Primary handoffs:

- `@claude-orqx` -> `@quality-gate` -> `@product-lead`

Exit criteria:

- parity checklist exists for activation, commands, orchestration, workflows, MCP, handoffs, stories, and epics
- current Codex baseline gaps are documented

### Phase 2 - Activation And Catalog Parity

Objective:
Align activation paths, naming, greeting, orqx catalog, and source-of-truth rules.

Primary handoffs:

- `@architect` -> `@developer` -> `@quality-gate`

Exit criteria:

- `sinapse-orqx` activation is reliable in Codex
- catalog export is deterministic
- no ambiguous split remains between intended source and exported Codex catalog

Current state after Story `7.7.6`:

- `@sinapse-orqx` greeting is recovered in Codex via `.codex/scripts/generate-codex-greeting.js`
- the expanded Codex catalog is explicit in `.codex/catalog.json`
- Codex local-first sync is isolated from the legacy multi-IDE sync pipeline
- Codex validators now validate the expanded contract instead of the 12-agent assumption
- remaining red status in `validate:parity` is outside Codex scope and currently comes from Claude sync plus compatibility-contract drift for other IDEs

### Phase 3 - Commands, Skills, And Orchestration Parity

Objective:
Make Imperator and the squad orchestrators behave consistently in Codex.

Primary handoffs:

- `@sinapse-orqx` -> `@swarm-orqx` -> `@developer` -> `@quality-gate`

Exit criteria:

- commands matrix exists
- delegation matrix exists
- core orqx handoff smoke tests pass

### Phase 4 - Workflow, Task, Story, And Epic Parity

Objective:
Bring the process rigor of stories, subtasks, checklists, and workflow chains into Codex operation.

Primary handoffs:

- `@product-lead` -> `@sprint-lead` -> `@sinapse-orqx` -> `@quality-gate`

Exit criteria:

- critical workflows exercised end-to-end
- story lifecycle in Codex respects constitution, handoffs, and validation

### Phase 5 - MCP And Tooling Parity

Objective:
Make Codex MCP setup reproducible and dependable.

Primary handoffs:

- `@devops` -> `@claude-orqx` -> `@quality-gate`

Exit criteria:

- reproducible setup on a clean machine
- MCP health checks documented and passing
- fallback rules are explicit

### Phase 6 - Hardening, CI, And Release Safety

Objective:
Prevent silent drift and make Codex parity safe to evolve.

Primary handoffs:

- `@devops` -> `@quality-gate` -> `@sinapse-orqx`

Exit criteria:

- Codex-only validation pipeline exists
- golden output checks exist for critical flows
- release checklist exists

## Phase 1 Backlog

Phase 1 is the foundation phase. It should improve confidence and operator safety before deeper parity work begins.

### Task 1.1 - Baseline And Boundaries

Goal:
Freeze the initial Codex parity contract and the non-regression rules.

Outputs:

- story
- parity program doc
- Codex-only boundary rules
- review protocol

Review focus:

- structural completeness
- shared-surface risk audit

### Task 1.2 - Catalog Baseline Audit

Goal:
Map the real Codex catalog, its upstreams, and current drift.

Outputs:

- inventory of `.codex/agents`
- inventory of `.codex/skills`
- inventory of canonical sync sources
- gap matrix between exported Codex artifacts and official sync assumptions

Review focus:

- source-of-truth clarity
- export traceability

### Task 1.3 - `sinapse-orqx` Activation Recovery

Goal:
Restore reliable Codex activation for Imperator with the smallest safe blast radius.

Preferred path:

- Codex-only fallback or wrapper first
- shared canonical repair only if required and proven safe

Success checks:

- `sinapse-orqx` greeting path works predictably for Codex
- fallback path is documented
- no `.claude/**` changes required

### Task 1.4 - Full Orqx Skill Coverage

Goal:
Ensure every squad orchestrator and key framework agent is reachable in Codex through the intended activation paths.

Outputs:

- skill coverage matrix
- export rules for orqx and core agents
- clean local-first `.codex/skills` state

Success checks:

- no missing critical orqx skills
- no duplicate/confusing activation paths
- validator reflects intended Codex reality

### Task 1.5 - Codex Validation Reset

Goal:
Make the Codex validation suite measure the right thing.

Outputs:

- corrected Codex validation assumptions
- smoke test contract for critical agents
- documented validation workflow

Success checks:

- validators no longer assume the full Codex catalog equals the 12-agent canonical subset
- validation errors point to real operator-impacting drift

## Review Pairing Model

Each task should explicitly assign two review perspectives.

Recommended pairings:

- architecture + quality-gate
- claude-orqx + developer
- swarm-orqx + quality-gate
- devops + quality-gate

This keeps every task checked for both structure and practical operator parity.

## Mandatory Gates Per Task

- Gate A: scope, blast radius, and rollback are documented
- Gate B: implementation stays inside approved surfaces
- Gate C: automatic validations for the task pass
- Gate D: structural review passes
- Gate E: parity and regression review passes
- Gate F: manual smoke test for the affected operator flow passes
- Gate G: handoff artifact for the next task is recorded

No task advances if any gate is red.

## Mandatory Validation Set

The baseline validation suite for Codex parity is:

- `npm run validate:codex-sync`
- `npm run validate:codex-integration`
- `npm run validate:codex-skills`
- `npm run validate:paths`
- `npm run validate:parity`

Additional flow smoke tests should be run per task for:

- activation
- greeting
- handoff
- workflow execution
- MCP bootstrap
- fallback behavior

## Cloud-Assisted Improvement Loop

The user also wants Claude/Cloud to help improve Codex safely.

Recommended loop:

1. define a Codex parity task in story form
2. implement in Codex-safe surfaces
3. ask Claude/Cloud to audit the task against the reference experience
4. import only validated recommendations
5. re-run Codex validators and smoke tests

This allows Cloud/Claude to act as a reference system without making Cloud/Claude the execution target for Codex-specific changes.

## Review Checklists

### Review A: Structural

- Is the change confined to Codex-only surfaces where possible?
- Did we avoid creating a second hidden source of truth?
- Are generated artifacts traceable to a canonical upstream?
- Did we reduce drift rather than relocate it?

### Review B: Parity And Regression

- Does this make Codex meaningfully closer to Cloud/Claude?
- Did we preserve existing Cloud/Claude semantics?
- Are there explicit validation steps for the new parity claim?
- Is the operator experience clear when Codex platform limits apply?

## Non-Regression Policy

The following rules apply to every parity task:

- never edit `.claude/**` for a Codex-only improvement unless explicitly required
- never degrade an existing Claude/Cloud capability in exchange for Codex convenience
- never claim parity based only on docs; parity must be validated
- never let generated Codex artifacts outrun their documented source of truth

## Definition Of Ready

A Codex parity task is ready to implement only when:

- the task has acceptance criteria
- affected surfaces are classified
- review expectations are explicit
- the no-regression check is defined

## Definition Of Done

A Codex parity task is done only when:

- implementation is complete
- Review A passed
- Review B passed
- relevant validators and smoke checks passed
- docs/story checklist and file list are updated

## Global Done Criteria

The overall Codex parity initiative is only considered successful when:

- the user can use the same agent names, orqx names, aliases, and practical activation patterns expected from Claude
- Imperator delegates and orchestrates predictably under the constitution
- the Codex catalog is regenerable and validated
- MCP setup is reproducible
- Claude/Cloud Code shows no functional regression caused by the initiative

## Execution Artifacts

Execution planning for the next delivery wave is now formalized in:

- `docs/codex-total-parity-orchestration-plan.md`
- Story `7.7.8` for delegation and handoff parity
