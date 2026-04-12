# Task: generate-agent-handoff

**Canonical executor of the SINAPSE agent-handoff compaction protocol.**
**Reference rule:** `.claude/rules/agent-handoff.md`
**Reference template:** `.sinapse-ai/development/templates/agent-handoff-tmpl.yaml`
**Storage:** `.sinapse/handoffs/handoff-{from}-to-{to}-{timestamp}.yaml` (gitignored)

---

## Purpose

Produce a structured, compact handoff artifact (< 500 tokens) when one SINAPSE agent hands off work to another. This task is the **operational enforcement** of the compaction claim documented in Article VIII of the constitution and the `agent-handoff.md` rule — without this task, the compaction protocol is a suggestion; with it, the protocol is a repeatable, auditable step.

**Why this matters:** On every `@agent` switch, a naive session retains the outgoing agent's full persona (~3-5K tokens) alongside the incoming agent's full persona (~3-5K tokens). Repeated 3-4 times per story, a session loses 15-20K tokens to duplicated persona content. The handoff artifact collapses this to ~379 tokens per switch — a 90%+ compaction.

## When to Invoke

Run this task **before** activating a new agent via `@agent-name` or `/SINAPSE:agents:agent-name` when an agent is already active.

Automatic trigger points (from `agent-handoff.md`):

1. User types a new `@agent` command in a session that already has an active agent.
2. An orchestrator agent (sinapse-orqx, *-orqx) delegates to a specialist.
3. A task in `story-development-cycle.yaml` transitions between phases (create → validate → implement → qa).
4. Any cross-squad routing per `cross-squad-routing.md`.

## Inputs

| Field | Type | Source | Required | Validation |
|-------|------|--------|----------|------------|
| `from_agent` | string | session state / caller | yes | Must be a known agent id (e.g. `developer`, `quality-gate`, `sprint-lead`, `sinapse-orqx`) |
| `to_agent` | string | caller (the `@agent` invocation) | yes | Same validation as `from_agent` |
| `story_id` | string | session state / story file | yes | Must match a story file under `docs/stories/` |
| `story_path` | string | session state / story file | yes | Relative path from repo root |
| `story_status` | enum | story file header | yes | One of: `Draft`, `Ready`, `InProgress`, `InReview`, `Done` |
| `current_task` | string | outgoing agent's last action | yes | Free text, max 120 chars |
| `branch` | string | `git branch --show-current` | yes | Active git branch |
| `decisions` | list[string] | outgoing agent | no | Max 5 entries, each max 160 chars |
| `files_modified` | list[string] | outgoing agent (reconcile vs `git diff --name-only`) | no | Max 10 entries |
| `blockers` | list[string] | outgoing agent | no | Max 3 entries |
| `next_action` | string | outgoing agent's recommendation | yes | Max 2 sentences |
| `scratchpad_path` | string | session state | no | Path to cross-agent scratchpad if used (`.sinapse/scratchpad/{story_id}/`) |

## Outputs

| Field | Type | Destination | Persisted |
|-------|------|-------------|-----------|
| `handoff_yaml` | YAML block | `.sinapse/handoffs/handoff-{from}-to-{to}-{ISO-timestamp}.yaml` | yes |
| `handoff_token_count` | integer | logged in output | transient |
| `validation_status` | enum `PASS`/`FAIL` | return value | transient |

## Preconditions

- [ ] `.sinapse-ai/development/templates/agent-handoff-tmpl.yaml` exists on disk (verify with `Read` before starting)
- [ ] `.sinapse/handoffs/` directory exists (create if missing — the folder is gitignored but the path must be reachable)
- [ ] `from_agent` and `to_agent` are valid agent ids registered in the agent registry
- [ ] `story_id` exists under `docs/stories/` (or the task runs in framework-governance mode where no story is active, see Failure Mode F4)

## Steps

### Step 1 — Read the template

Use `Read` tool on `.sinapse-ai/development/templates/agent-handoff-tmpl.yaml`. Cache the template structure. Do **not** mutate the template.

### Step 2 — Gather story context

If `story_id` is provided, read the target story file header to populate `story_path`, `story_status`, `branch` (via `git branch --show-current`), and `current_task`. If reading from session state, cross-check against the story file; story file wins on conflict.

### Step 3 — Collect decisions, files, blockers from outgoing agent

The outgoing agent MUST provide:

- Up to 5 decisions (strategic or technical) made during its execution
- Up to 10 files created or modified (verify with `git diff --name-only HEAD` if the agent is unsure)
- Up to 3 active blockers

If the outgoing agent provides more than the limit, **truncate to the limit** and log a warning. Do not emit more than the documented caps — the 500-token budget depends on them.

### Step 4 — Compose `next_action`

The outgoing agent MUST specify what the incoming agent should do next. Max 2 sentences. Format: `{imperative verb} {target}. {optional constraint or follow-up}.`.

Examples:
- `Run QA gate on story fw-v2.1. Verify the handoff preserves story context.`
- `Implement the cross-surface token KB per AC1. Do not touch the dx-* personas yet.`

### Step 5 — Populate the YAML

Using the template shape, create the handoff YAML with all fields filled. Use the exact field names from `agent-handoff-tmpl.yaml` (version, timestamp, from_agent, to_agent, story_context, decisions, files_modified, blockers, next_action, scratchpad_path).

Timestamp format: ISO 8601 UTC (e.g., `2026-04-12T14:30:00Z`).

### Step 6 — Token budget check (CRITICAL)

Estimate token count of the composed YAML. Rule of thumb: 1 token ≈ 4 characters or 0.75 words. If estimated token count > 500:

1. Drop `scratchpad_path` if present
2. Drop `decisions` to the most critical 3 (was max 5)
3. Trim `files_modified` to the most recent 5 (was max 10)
4. If still over budget, escalate to Failure Mode F1

### Step 7 — Write to disk

Path: `.sinapse/handoffs/handoff-{from_agent}-to-{to_agent}-{YYYYMMDDTHHMMSSZ}.yaml`

Use the `Write` tool. Do not use `Edit` — every handoff is a new file, never an overwrite.

### Step 8 — Return summary

Return to the caller:
```
handoff_path: .sinapse/handoffs/handoff-{from}-to-{to}-{ts}.yaml
handoff_token_count: {estimated}
validation_status: PASS
```

## Postconditions

- [ ] Exactly one new file exists at `.sinapse/handoffs/handoff-{from}-to-{to}-{timestamp}.yaml`
- [ ] The YAML parses successfully (no syntax errors)
- [ ] All required fields (`from_agent`, `to_agent`, `story_context.story_id`, `story_context.story_path`, `story_context.branch`, `next_action`) are populated with non-empty strings
- [ ] Estimated token count <= 500
- [ ] `decisions` <= 5, `files_modified` <= 10, `blockers` <= 3

## Failure Modes

### F1 — Oversized handoff (even after trimming)

**Cause:** The outgoing agent accumulated too much context that cannot compress below 500 tokens.
**Resolution:** Emit the minimal-viable handoff (only `from_agent`, `to_agent`, `story_context`, `next_action`, 1 blocker = "context overflow, see story file"). Log a warning. Flag the story for context compaction via `/compact` on next session start.

### F2 — Template drift

**Cause:** `agent-handoff-tmpl.yaml` has been edited and no longer matches the rule's spec.
**Resolution:** Abort the task. Emit an error: `TEMPLATE_DRIFT: template and rule are out of sync. Reconcile before proceeding.` Do not attempt to populate a drifted template.

### F3 — Missing required input

**Cause:** Caller did not provide `from_agent`, `to_agent`, `story_id`, `current_task`, or `next_action`.
**Resolution:** Abort the task. Return `validation_status: FAIL` with a specific field-level error.

### F4 — Framework governance mode (no active story)

**Cause:** The handoff is between orchestrators doing framework governance (e.g., `@sinapse-orqx` → `@architect` for a core engine decision), with no active user story.
**Resolution:** Allow `story_id = "framework-governance"` and `story_path = ""`. All other fields must still be populated. This is the only legitimate exemption from the story-id precondition.

### F5 — Handoffs directory missing

**Cause:** `.sinapse/handoffs/` does not exist.
**Resolution:** Create the directory before writing. Do not fail the handoff — the directory is ephemeral/runtime and may be missing on a fresh checkout.

## Examples

### Example 1 — Developer hands off to quality-gate

```yaml
handoff:
  version: "1.0"
  timestamp: "2026-04-12T16:45:00Z"
  from_agent: "developer"
  to_agent: "quality-gate"
  story_context:
    story_id: "fw-v2.6"
    story_path: "docs/stories/fw-v2.6-core-engine-handoff-enforcer.story.md"
    story_status: "InReview"
    current_task: "AC1 complete — task file created"
    branch: "caio/feat/framework-upgrade-v2"
  decisions:
    - "Used 'framework-governance' escape hatch for story_id when no active user story"
    - "Capped token budget at 500 strictly; decisions cap at 5"
    - "Wrote task under .sinapse-ai/development/tasks/ (L2 mutable) not core/ (L1 frozen)"
  files_modified:
    - ".sinapse-ai/development/tasks/generate-agent-handoff.md"
    - ".sinapse-ai/development/workflows/story-development-cycle.yaml"
  blockers: []
  next_action: "Run QA gate on fw-v2.6. Verify AC1-AC5 all pass and no L1 core files were touched."
  scratchpad_path: ""
```

### Example 2 — Imperator delegates to architect (framework governance)

```yaml
handoff:
  version: "1.0"
  timestamp: "2026-04-12T14:30:00Z"
  from_agent: "sinapse-orqx"
  to_agent: "architect"
  story_context:
    story_id: "framework-governance"
    story_path: ""
    story_status: "InProgress"
    current_task: "Evaluate core engine intervention candidates for epic-framework-upgrade-v2"
    branch: "caio/feat/framework-upgrade-v2"
  decisions:
    - "Selected handoff compaction enforcer as Phase C core intervention"
    - "Deferred SYNAPSE context engine refresh to next round"
  files_modified: []
  blockers: []
  next_action: "Design the task file schema and confirm L2 mutability boundary. Return a spec for the executor implementation."
```

## Integration Points

| Workflow | Phase | Trigger |
|----------|-------|---------|
| `story-development-cycle.yaml` | Between any phase transition (create → validate → implement → qa) | Post-phase hook |
| Cross-squad routing | Before squad orqx invokes specialist | Pre-delegation hook |
| `sinapse-orqx` orchestration plans | On every `*plan` multi-agent execution | Per-agent transition |

## Notes

- This task operates in **L2 Templates** layer (mutable config), never in **L1 Core**. It MUST NOT trigger any L1 code change.
- The 500-token limit is hard. The template, the procedure, and the failure modes all conspire to enforce it.
- If two agents are swapping context 3+ times per story, consider whether the story is too large and should be split — handoff compaction is a mitigation, not an excuse to write mega-stories.
- The handoffs directory (`.sinapse/handoffs/`) is runtime-only. It is listed in `.gitignore` per the rule file. Never commit handoff artifacts.

---

**Task authored by:** @architect (Stratum) via @sinapse-orqx (Imperator) orchestration
**Epic:** EPIC-framework-upgrade-v2
**Story:** fw-v2.6
**Created:** 2026-04-12
**Article III compliance:** Story-first (fw-v2.6 Ready before this task file was authored)
