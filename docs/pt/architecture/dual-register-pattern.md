# Dual-Register Pattern: claude-code-mastery + claude-code-mastery

> **Status:** Intentional architectural choice — established by Story 10.23.
> **Scope:** `squads/claude-code-mastery/` + `squads/claude-code-mastery/`.
> **Rule:** Do NOT merge. Do NOT normalize. Do NOT rewrite one to match the other.
> **Related:** Constitution Article XI (Conservative Default).

## Overview

Two squads in the SINAPSE codebase share the Claude Code domain but serve fundamentally different purposes:

| Register | Path | Purpose | Size |
|----------|------|---------|------|
| **SINAPSE-voice** | `squads/claude-code-mastery/agents/*.md` | Personas with SINAPSE brand voice, integrated into the orchestration graph | 60–100 lines per agent |
| **Extended persona** | `squads/claude-code-mastery/agents/*.md` | Long-form activation blocks with external references (books, tools, external frameworks) | 800–1250 lines per agent |

They intentionally describe overlapping territory with **different contracts**.

## Why Two Registers?

### SINAPSE-voice register (`claude-code-mastery/`)

- **Reader:** SINAPSE runtime + users working inside a SINAPSE-governed project.
- **Voice:** Short, Portuguese-first, brand-consistent persona definitions.
- **Contract:** Plug into `sinapse-orqx` routing, respect SINAPSE commands (`*help`, `*task {name}`, etc.), respect Constitution.
- **External refs:** None — self-contained inside the framework.

### Extended persona register (`claude-code-mastery/`)

- **Reader:** Operators wanting deep Claude Code mastery with external canonical references.
- **Voice:** Long-form activation blocks (English, with explicit YAML headers).
- **Contract:** Reference external authoritative sources (Anthropic docs, MCP spec, Claude Code changelog).
- **External refs:** Allowed and expected — this register is the bridge to the external ecosystem.

## Why Not Merge?

Three independent audits (2026-04-18, pre-GA 1.0.0) proposed collapsing one into the other. All three were aborted because:

1. **Capability loss:** Merging would delete either ~6500 lines of operational content OR the SINAPSE persona layer that users interact with daily.
2. **Contract mismatch:** SINAPSE-voice has constraints the extended register explicitly rejects (no external refs, short form). Forcing either contract on the other breaks the target audience.
3. **Tooling support:** `scripts/validate-no-external-refs.js` already has `HARDCODED_ALLOW_LIST` at line 119 for `skill-craftsman` — this is the codified acknowledgment that the two registers have different validation rules.
4. **Story 10.23:** The dual register was an explicit design decision, documented as a story. Undoing it without a counter-story is a constitutional violation (Article IV: No Invention).

## How to Distinguish (for future auditors)

| Clue | SINAPSE-voice | Extended persona |
|------|---------------|------------------|
| Path prefix | `squads/claude-code-mastery/` | `squads/claude-code-mastery/` |
| File size | 60–100 lines | 800–1250 lines |
| Frontmatter | Minimal YAML, SINAPSE fields | Large YAML, extended `activation` block |
| Presence of `ACTIVATION-NOTICE` | No | Yes (first 10 lines) |
| External URL refs | No (blocked by validator) | Yes (allowed) |
| Language | Portuguese-first | English-first |
| Persona depth | Short identity + routing | Full Extended persona block |

If a file has `ACTIVATION-NOTICE` at the top and is > 500 lines, it belongs to `claude-code-mastery/` and MUST NOT be normalized to the SINAPSE-voice register.

## Validator Support

`scripts/validate-no-external-refs.js` (line 119):

```js
const HARDCODED_ALLOW_LIST = [
  // ...
  'skill-craftsman', // dual register — Extended persona block allowed
];
```

This allow-list is the concrete mechanism that keeps the two registers from conflicting in CI. **Do NOT remove entries without removing the corresponding register.**

## Rules for Future Audits

1. **Never propose a "merge" PR** — file it as a story with Article XI review if you believe it's warranted.
2. **Treat differences as features** — if the two registers diverge on a concept, that divergence is intentional until proven otherwise.
3. **Respect the allow-list** — the validator's allow-list is the single source of truth for which files escape standard rules.
4. **If adding a new agent** that could plausibly live in either register, decide by target audience:
   - SINAPSE users inside a project → `claude-code-mastery/`
   - Operators wanting deep Claude mastery docs → `claude-code-mastery/`

## Historical Context

- **Story 10.23:** Established dual register.
- **2026-04-18 audit:** Proposed merger aborted (3 false positives). Constitution Article XI formalized as a direct outcome.

## See Also

- `docs/pt/architecture/sub-orqx-pattern.md` — related pattern inside `claude-code-mastery`.
- `.sinapse-ai/constitution.md` — Article XI (Conservative Default).
- `scripts/validate-no-external-refs.js:119` — HARDCODED_ALLOW_LIST.
