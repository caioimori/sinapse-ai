# Codex Total Parity Orchestration Plan

## Mission

Drive SINAPSE-AI in Codex to the closest practical equivalent of the Claude Code experience while preserving:

- the same squad and orqx names
- the same specialist naming model
- the same starred command surface
- the same skills entry points
- the same workflow/task availability
- the same MCP-backed capability model where Codex can support it

Hard constraint:

- no regression in `.claude/**`
- no speculative shared-runtime surgery
- prefer Codex-only compatibility layers until a shared change is provably required

## Truth Constraint

Exact runtime identity with Claude Code is not mechanically achievable in every area because Codex does not expose the same lifecycle hooks.

The working target is therefore:

- exact naming parity
- exact command discoverability
- exact catalog availability
- exact practical workflow reachability
- equivalent operator outcomes for normal usage
- explicit Codex replacements wherever runtime parity is impossible

## Current Baseline

Already in place:

- expanded Codex catalog in `.codex/catalog.json`
- local-first Codex skill/export path
- Codex greeting fallback for `sinapse-orqx`
- validated command/task registry for the core workflow agents
- Codex-only Imperator tasks for `onboard`, `route`, `plan`, `status`, `brief`, `resolve`, and `council`

Still missing for practical total parity:

- true delegation parity for orqx -> squad -> specialist execution
- full specialist routing contract across the expanded catalog
- Codex-ready MCP bootstrap and health verification
- golden-journey validation for end-to-end operator flows
- cross-IDE diffing between Codex outputs and Claude reference behavior

## Phases

### Phase 1 - Delegation Matrix Parity

Objective:
Make `sinapse-orqx` and the squad orqx delegate predictably in Codex using explicit, validator-backed handoff contracts.

Outputs:

- Codex delegation matrix
- handoff artifact format
- resolver-backed orqx -> workflow -> specialist routing rules
- smoke tests for the master workflow agents

Primary owner:

- `@swarm-orqx`

Supporting handoffs:

- `@sinapse-orqx` -> orchestration priorities and final routing policy
- `@architect` -> Codex-only versus shared-surface boundary
- `@developer` -> delegation artifacts and resolver/runtime glue
- `@quality-gate` -> parity and regression review

Exit criteria:

- Codex can route from `sinapse-orqx` to the correct orqx and workflow path without manual file hunting
- direct specialist routing rules are explicit and validated where supported
- unsupported delegation paths degrade clearly instead of silently failing

### Phase 2 - Specialist Activation Parity

Objective:
Close the gap between the expanded `.codex/agents` catalog and the practical activation surface available to Codex operators.

Outputs:

- specialist coverage matrix
- specialist activation rules by squad
- explicit fallback policy for specialists without validator-backed execution paths

Primary owner:

- `@architect`

Supporting handoffs:

- `@brand-orqx`, `@content-orqx`, `@copy-orqx`, `@research-orqx`, `@product-orqx`, `@design-orqx`, `@animations-orqx`, `@cyber-orqx`, `@finance-orqx`, `@paidmedia-orqx`, `@growth-orqx`, `@commercial-orqx`, `@courses-orqx`, `@cloning-orqx`, `@storytelling-orqx`, `@council-orqx`, `@claude-orqx`

Exit criteria:

- same orqx names and specialist names are cataloged and callable in Codex
- each specialist is classified as `validated`, `exploratory`, or `blocked-by-runtime`
- no hidden source-of-truth split remains between catalog, skills, and routing docs

### Phase 3 - Workflow Chain Parity

Objective:
Make stories, epics, subtasks, checklists, and quality gates execute in Codex with the same practical chain available in Claude.

Outputs:

- story lifecycle matrix
- epic workflow matrix
- subtask and QA handoff rules
- golden-path walkthroughs for PM -> PO -> SM -> Dev -> QA

Primary owner:

- `@product-orqx`

Supporting handoffs:

- `@project-lead`
- `@product-lead`
- `@sprint-lead`
- `@developer`
- `@quality-gate`

Exit criteria:

- the core delivery loop is validator-backed end-to-end
- command mappings and handoff artifacts stay aligned with operator-visible commands
- no critical workflow step requires guessing repository paths

### Phase 4 - MCP Parity

Objective:
Make Codex MCP setup reproducible and equivalent enough for normal SINAPSE operation.

Outputs:

- project-level `.mcp.json`
- Codex bootstrap guide for `sinapse mcp setup` and `sinapse mcp link`
- minimal/full presets
- MCP health validator and smoke checks

Primary owner:

- `@claude-orqx`

Supporting handoffs:

- `@devops`
- `@developer`
- `@quality-gate`

Exit criteria:

- a clean Codex environment can be bootstrapped repeatably
- required MCPs are classified as `required`, `recommended`, or `optional`
- missing MCPs fail loudly with fallback guidance

### Phase 5 - Golden Journey And Diff Parity

Objective:
Prove parity claims with repeatable, operator-facing journeys and Claude/Codex output comparison.

Outputs:

- golden journeys for activation, routing, planning, delegation, workflow execution, and MCP usage
- Codex vs Claude comparison rubric
- release-safe parity checklist

Primary owner:

- `@quality-gate`

Supporting handoffs:

- `@claude-orqx`
- `@swarm-orqx`
- `@analyst`
- `@devops`

Exit criteria:

- Codex parity is measured by outcome, not just by docs or file presence
- gaps are categorized as `fixed`, `Codex-limited but compensated`, or `still blocked`

## Handoff Matrix

| From | To | Purpose | Artifact |
|------|----|---------|----------|
| `@sinapse-orqx` | `@swarm-orqx` | Define delegation topology and handoff protocol | delegation matrix |
| `@sinapse-orqx` | `@architect` | Approve Codex-only vs shared boundary per phase | boundary decision log |
| `@sinapse-orqx` | `@claude-orqx` | Map Claude-only runtime behaviors to Codex-compatible replacements | parity gap map |
| `@sinapse-orqx` | `@product-orqx` | Sequence work into stories, phases, and acceptance criteria | phased delivery plan |
| `@swarm-orqx` | `@developer` | Implement Codex handoff artifacts, resolvers, and routing helpers | code/doc patches |
| `@architect` | `@developer` | Keep implementation inside safe surfaces | architecture constraints |
| `@claude-orqx` | `@developer` | Provide exact naming/behavior parity targets from Claude | reference behavior notes |
| `@developer` | `@devops` | Add validators, smoke checks, and release-safe guardrails | validation scripts |
| `@developer` | `@quality-gate` | Request structural and parity review | review findings |
| `@devops` | `@quality-gate` | Verify CI/release safety of the Codex layer | gate verdict |
| `@quality-gate` | `@sinapse-orqx` | Approve or bounce the phase based on parity evidence | phase gate decision |

## Lowest-Blast-Radius Sequence

1. Story `7.7.8`: Delegation matrix and handoff artifact contract
2. Story `7.7.9`: Specialist coverage classification and activation matrix
3. Story `7.7.10`: Orqx delegation resolver and handoff smoke tests
4. Story `7.7.11`: MCP bootstrap parity for Codex
5. Story `7.7.12`: Golden journey suite and Codex-vs-Claude diff rubric

Rationale:

- start with routing contracts before runtime mechanics
- classify catalog reality before promising specialist parity
- delay MCP and cross-IDE assertions until the delegation surface is stable
- preserve the option to stop at a clean Codex-only layer if a shared change becomes too risky

## Handoff Packet Standard

Every execution slice in this plan should move with the same handoff packet so the orqx can delegate consistently in Codex.

Required fields:

1. `mission`
2. `phase`
3. `owner`
4. `inputs`
5. `outputs`
6. `validators`
7. `shared-surface-risk`
8. `next-handoff`

This keeps delegation explicit, reviewable, and validator-friendly even where Codex lacks Claude-style lifecycle hooks.

## Risks And Mitigations

### Risk 1 - Shared Runtime Pressure

Risk:
Pursuing exact parity may tempt changes in `.sinapse-ai/development/**` or `.claude/**` before the Codex-only layer is exhausted.

Mitigation:

- require an explicit "Codex-only path exhausted" note before any shared change
- force Review A + Review B before touching shared surfaces

### Risk 2 - Catalog/Skill Drift

Risk:
Expanded `.codex/agents`, `.agents/skills`, and command/delegation registries can drift apart.

Mitigation:

- keep one explicit Codex catalog
- extend validators to cover delegation and specialist classification

### Risk 3 - False Parity Claims

Risk:
Docs and registry may look complete while real operator journeys still fail.

Mitigation:

- add golden journeys
- gate claims on smoke tests and comparison rubrics, not only on file existence

### Risk 4 - MCP Fragility

Risk:
Codex parity may remain partial if MCP bootstrap is manual or inconsistent.

Mitigation:

- define required MCP presets
- validate health at the project level and in user guidance

### Risk 5 - Story Tracking Drift

Risk:
`docs/stories/` is currently git-ignored, which weakens long-term traceability of story artifacts.

Mitigation:

- keep the tracked plan in `docs/`
- treat the story file as workspace process support until story tracking policy is revisited

## Done Condition

This initiative is only "100% pronto" for practical Codex use when all of the following are true:

- all required orqx names, aliases, and skills are available in Codex
- the master workflow agents resolve commands deterministically
- orqx -> squad -> specialist handoffs are explicit and validated where supported
- MCP bootstrap is reproducible
- golden journeys pass
- remaining gaps are only true Codex platform limits with explicit compensating behavior
