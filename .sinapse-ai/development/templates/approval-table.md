# Approval Table — Shared Terminal Presentation Convention

> **Reusable presentation protocol.** Any task that asks the user to review or approve a
> set of artifacts (requirements, epics, stories, tasks, risks, open questions) MUST render
> them through this convention BEFORE asking for a decision. This is the single source of
> truth for "scannable terminal table + verdict", so the experience is identical across
> PRD, epic, story, and spec flows. Do not duplicate ad-hoc formats per task — reference
> this file.

## Why this exists

Lists decided during planning (FRs, NFRs, epics, stories) used to be reported as counts or
prose ("✅ 8 FR, 3 NFR"). That forces the user to open a file to actually review. This
convention renders the real items as a scannable table the user can approve row by row,
right in the terminal. Output language follows the project's language (PT-BR for the user
when applicable); the schemas below are language-agnostic.

## The protocol (3 parts, always in this order)

1. **Verdict header** — one scannable line stating what is being reviewed and the current
   status. Format:
   ```
   ── {ARTIFACT} REVIEW · {n} item(s) · status: {DRAFT|READY|APPROVED|NEEDS REVISION} ──
   ```
2. **The table** — render the items using the matching schema below. Keep it scannable:
   one row per item, truncate long cells to ~60 chars with `…`, never wrap a cell across
   lines. Use the priority/severity emoji legend when the schema has one.
3. **The decision prompt** — after the table, ask for the decision in the form the calling
   task requires (the 1-9 elicitation menu, or a GO / NO-GO, or `[GO] [PAUSE] [REVISE] [ABORT]`).
   Never ask for approval without showing the table first.

## Standard schemas

Use the schema that matches the artifact. Add/trim columns only when the data genuinely
requires it — keep the core columns stable so the experience is consistent.

### Requirements (gather / spec)
```
| ID    | Description                          | Priority | Source            |
| ----- | ------------------------------------ | -------- | ----------------- |
| FR-1  | {functional requirement}             | 🔴 P0    | requirements.json |

| ID    | Category    | Requirement              | Metric / Target   |
| ----- | ----------- | ------------------------ | ----------------- |
| NFR-1 | {category}  | {non-functional req}     | {measurable}      |

| ID    | Type     | Constraint               | Impact            |
| ----- | -------- | ------------------------ | ----------------- |
| CON-1 | {type}   | {constraint}             | {impact}          |
```

### Epic list (PRD epic-list approval)
```
| #  | Epic                          | Goal (1 line)                         | Stories |
| -- | ----------------------------- | ------------------------------------- | ------- |
| 1  | Foundation & Core Infra       | {one-sentence goal}                   | ~{n}    |
```

### Epic detail — stories within an epic
```
| Story | As a … / I want …                 | ACs | Depends on |
| ----- | --------------------------------- | --- | ---------- |
| 1.1   | {user} wants {action}             | {n} | —          |
```

### Story summary (create / validate story)
```
| Field        | Value                                            |
| ------------ | ------------------------------------------------ |
| Story        | {epicNum}.{storyNum} — {title}                   |
| Status       | {Draft \| Ready \| InProgress \| Done}           |
| Acceptance   | {n} criteria                                     |
| Tasks        | {n} (linked to AC: {list})                       |
| Dependencies | {list or —}                                      |

| AC# | Criterion                                  | Tasks      |
| --- | ------------------------------------------ | ---------- |
| 1   | {given/when/then}                          | T1, T3     |
```

### Risks & open questions (spec / plan)
```
| Risk            | Probability   | Impact        | Mitigation        |
| --------------- | ------------- | ------------- | ----------------- |
| {risk}          | 🟢/🟡/🔴      | 🟢/🟡/🔴      | {mitigation}      |

| ID   | Question                  | Blocking | Assigned To |
| ---- | ------------------------- | -------- | ----------- |
| OQ-1 | {open question}           | Yes / No | @{agent}    |
```

## Legends

- **Priority:** 🔴 P0 (must) · 🟠 P1 (should) · 🟡 P2 (could) · 🟢 P3 (won't-now)
- **Severity / level:** 🔴 High · 🟡 Medium · 🟢 Low
- **Status glyphs (optional inline):** ✓ done · ● in progress · ○ pending · ✗ blocked

## Rules

- Always render the table for a list ≥ 2 items. For a single item, a compact field table is
  still preferred over prose.
- The table is in addition to writing the artifact file — never replace the file, and never
  replace the table with a count.
- Keep within terminal width: prefer fewer, tighter columns over a wide table that wraps.
- When iterating (NEEDS REVISION), re-render the full table with the changed rows marked
  (prefix the changed cell with `» `), so the user sees what moved.
