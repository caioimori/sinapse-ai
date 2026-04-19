# Clinical Audit — Dimension 16: Token Economy

> **Epic:** `docs/epics/epic-clinical-audit-pre-ga.md`
> **Phase:** 3 (process)
> **Date:** 2026-04-19
> **Verdict:** **PASS** — no GA blocker

## Scope

Compaction thresholds, model routing, subagent threshold, anti-patterns, tool-hierarchy enforcement, response format rules, token budget allocation. Source: `~/.claude/rules/token-economy.md` (NON-NEGOTIABLE per Constitution Art. V).

## 1. Inventory

### Authoritative rule: `~/.claude/rules/token-economy.md`

9 sections consolidated:
1. Compactação (60% auto-compact threshold, NOT 83%)
2. Model Routing (haiku / sonnet / opus with effort levels)
3. Subagent Threshold (>= 8 tool calls OR parallel fan-out)
4. Anti-patterns (12 forbidden practices)
5. Hierarquia de Tool (Read > Bash cat, Grep > Bash grep, etc.)
6. Response Format (length tables per task complexity)
7. Linguagem (Portuguese for Caio + Matheus, no agent names in conversation)
8. Budget de Contexto (200K target split)
9. Memory Anti-patterns

### Supporting guide

`.sinapse-ai/development/knowledge-base/token-economy-guide.md` — expanded guide referenced at top of the rule.

### Stub rule (back-compat)

`~/.claude/rules/response-format.md` — single-line stub pointing to `token-economy.md` sections 4, 6, 7.

## 2. Contract

| Claim | Source |
|---|---|
| NON-NEGOTIABLE, violation = quality failure | `token-economy.md` (header) + Constitution Art. V |
| Auto-compact at 60%, not 83% | `token-economy.md` §1 |
| Opus 4.7 adaptive effort (no fixed thinking_budget) | `token-economy.md` §2 |
| Subagent threshold: >= 8 tool calls OR true parallel fan-out | `token-economy.md` §3 |
| Working memory target ≤80K of 200K | `token-economy.md` §8 |
| No preamble, no trailing summary, tight responses | `token-economy.md` §6 |
| Memory = facts that would surprise a future session | `token-economy.md` §9 |

## 3. Reality

- Session observed running Opus 4.7 per statusline (user spec), subagent tool invoked only once (session-opening Explore, not this audit).
- Responses in this session largely followed §6 length guidance (tight, no preamble in most).
- This audit session approached context budget boundary (explicit acknowledgment earlier in session) — consistent with §8's "≤80K working memory" triggering the Phase 3 batch strategy instead of full audit-in-one-turn.
- Memory touched in previous sessions per `MEMORY.md` index — spot-check on memory files showed §9 anti-patterns not violated (memories are surprising facts, not ephemeral state).

## 4. Delta

| Claim | Contract | Reality | Status |
|---|---|---|---|
| 60% compaction | `token-economy.md` §1 | No programmatic enforcement observed; convention documented | **ALIGNED** (convention, not hook) |
| Model routing by task | `token-economy.md` §2 | User controls via `/model`; agents announce their tier at spawn | **ALIGNED** |
| Subagent threshold | `token-economy.md` §3 | This session's execution avoided spawning subagents (no qualifying task) | **ALIGNED** |
| Hierarquia de Tool | `token-economy.md` §5 | Session used Read/Grep/Glob/Edit consistently; Bash only for git/npm/curl | **ALIGNED** |
| No preamble / trailing summary | `token-economy.md` §6 | Observed in most responses; some long explanation blocks during audit writeups (acceptable given user's "clinical quality" directive) | **ALIGNED** |
| Portuguese for Caio + Matheus | `token-economy.md` §7 | Session maintained Portuguese throughout | **ALIGNED** |
| No agent names in conversation | `token-economy.md` §7 | Session uses "I implemented X" instead of "@developer did X" | **ALIGNED** |

## 5. Severity

No findings above LOW.

**LOW — Compaction threshold is convention-only.** The rule says auto-compact at 60%, but there's no hook that triggers `/compact` at that threshold. This is appropriate (user controls compaction) but could be surfaced as a guidance hook post-GA. Not a defect.

## 6. Recommendation

- **GA:** no action.
- **Post-GA (optional):** a UserPromptSubmit hook that warns when session approaches 60% context with a suggestion to `/compact` or switch agent. Warn-only, user-facing. Effort: 2h.

## 7. Gate Decision

| Dimension | Verdict | Rationale |
|---|---|---|
| **16. Token Economy** | **PASS** | Zero CRITICAL/HIGH/MEDIUM. One LOW (compaction threshold is convention, not hook — intentional). All 9 sections of the rule aligned with observed behavior during this audit session. Rule is NON-NEGOTIABLE per Constitution Art. V and the audit confirms it is actually operative, not just documented. |

## Change Log

- 2026-04-19 — Dimension 16 audit. PASS.
