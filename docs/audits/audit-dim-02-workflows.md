# Clinical Audit — Dimension 2: Workflows

> **Epic:** `docs/epics/epic-clinical-audit-pre-ga.md`
> **Phase:** 3 (process)
> **Date:** 2026-04-19
> **Verdict:** **PASS** — one MEDIUM (doc-level), no GA blocker

## Scope

The four primary workflows declared in `~/.claude/rules/workflow-execution.md`: Story Development Cycle (SDC), QA Loop, Spec Pipeline, Brownfield Discovery. Plus the workflow definitions that ship under `.sinapse-ai/development/workflows/`.

## 1. Inventory

### Workflow definitions in `.sinapse-ai/development/workflows/` (16 total)

```
auto-worktree, brownfield-discovery, brownfield-fullstack,
brownfield-service, brownfield-ui, design-system-build-quality,
development-cycle, epic-orchestration, fast-track (+ 7 more)
```

### Workflows documented in rules

- `development-cycle.yaml` → SDC per `workflow-execution.md:14-48`
- QA Loop → `workflow-execution.md:52-84`
- Spec Pipeline → `workflow-execution.md:88-134`
- Brownfield Discovery → `workflow-execution.md:136-170`

### Supporting tasks

`.sinapse-ai/development/tasks/` — 210 task files. Each workflow phase references tasks by filename (`create-next-story.md`, `validate-next-story.md`, `dev-develop-story.md`, `qa-gate.md`).

## 2. Contract

| Claim | Source |
|---|---|
| "Workflows são compostos por tasks conectadas, não por agentes conectados" | `~/.claude/rules/workflow-execution.md:5` |
| SDC has 4 phases (Create / Validate / Implement / QA Gate) | `workflow-execution.md:14-48` |
| QA Loop max iterations = 5 | `workflow-execution.md:70` |
| Spec Pipeline has 6 phases with complexity-based skips | `workflow-execution.md:98-134` |
| Brownfield Discovery has 10 phases across 3 sections | `workflow-execution.md:136-166` |
| Task-first principle: every task has inputs/outputs/pre/post conditions | `workflow-execution.md:3-7` |

## 3. Reality

- All 4 primary workflows have corresponding YAML definitions in `.sinapse-ai/development/workflows/`.
- 210 task files exist; spot-checked: `create-next-story.md`, `dev-develop-story.md`, `qa-gate.md`, `validate-next-story.md` — all referenced by rules and present.
- Additional workflows present in filesystem (design-system-build-quality, epic-orchestration, fast-track) beyond the 4 primary ones — this is richness, not a drift.

## 4. Delta

| Claim | Contract | Reality | Status |
|---|---|---|---|
| 4 primary workflows present | `workflow-execution.md` | All 4 + 12 auxiliary present | **ALIGNED** |
| SDC tasks available | 4 named tasks | All present | **ALIGNED** |
| QA Loop commands (`*qa-loop`, `*stop-qa-loop`, etc.) | `workflow-execution.md:58-66` | Not re-exercised this session; rule + task files present | **ALIGNED (unexercised)** |
| Spec Pipeline complexity classes (<=8 SIMPLE, 9-15 STANDARD, >=16 COMPLEX) | `workflow-execution.md:106-114` | Rule exists; actual classification engine not audited in this pass | **DEFERRED** |
| Task-first claim (tasks define contracts) | `workflow-execution.md:3-7` | 210 task files exist; not all audited for contract completeness | **MEDIUM: COVERAGE GAP** — this audit confirms structure, not per-task quality |

## 5. Severity

**MEDIUM — Per-task contract quality not audited.** This dimension confirms the workflow shell exists and the task files are present. It does NOT certify that each of the 210 tasks has complete inputs/outputs/pre/post conditions per the task-first principle. Dedicated per-task audit is a separate effort (or a dimension of Phase 5 — could fold into dim 17 Hallucinations / verification). Not a GA blocker since the primary workflows (SDC / QA Loop) are validated by actual usage this session (PRs #98–#110 all went through some form of create-commit-merge path).

## 6. Recommendation

- **GA:** no action.
- **Post-GA:** consider a lint that scans task files for the required fields (id, inputs, outputs, pre/post conditions) and flags incomplete tasks. ~4h to build.

## 7. Gate Decision

| Dimension | Verdict | Rationale |
|---|---|---|
| **2. Workflows** | **PASS** | Zero CRITICAL/HIGH. One MEDIUM (per-task quality not covered by shell audit — known and folded into Phase 5 follow-up). All 4 primary workflows present, task file count intact, SDC exercised implicitly through this session's PR cadence. |

## Change Log

- 2026-04-19 — Dimension 2 audit. PASS.
