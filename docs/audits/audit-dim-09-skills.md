# Clinical Audit — Dimension 9: Skills

> **Epic:** `docs/epics/epic-clinical-audit-pre-ga.md`
> **Phase:** 2 (user surfaces)
> **Executor:** @developer
> **Date:** 2026-04-19
> **Verdict:** **PASS** — one LOW observation, no GA blocker

## Scope

Skills installed and discoverable to Claude Code: SINAPSE-authored skills, plugin-supplied skills (claude-mem), and reflection of those skills in session startup.

## 1. Inventory

### Project-scoped SINAPSE skills (`.claude/skills/`, 17 entries)

Single-file markdown skills:
```
api-review.md, clone-mind.md, component-check.md,
course-generation-workflow.md, db-review.md, enhance-workflow.md,
ralph.md, squad.md, story-update.md, test-guard.md
```

Directory-packaged skills:
```
architect-first/, checklist-runner/, coderabbit-review/,
mcp-builder/, skill-creator/, synapse/, tech-search/
```

### Global SINAPSE skills (`~/.claude/skills/` via `~/.sinapse/` layer)

Empty root directory observed at `~/.claude/skills/` in this session — skills live inside the framework's project tree, not globally promoted.

### Plugin-supplied skills (via `claude-mem@thedotmack`)

Seven `claude-mem:*` skills observed in session startup:
```
claude-mem:timeline-report, claude-mem:smart-explore,
claude-mem:mem-search, claude-mem:make-plan, claude-mem:do,
claude-mem:knowledge-agent, claude-mem:version-bump
```

### Additional third-party skills

Observed in session: `hyperframes`, `hyperframes-cli`, `hyperframes-registry`, `gsap`, `sinapse-curar`, `website-to-hyperframes`, `find-skills`, `update-config`, `keybindings-help`, `simplify`, `fewer-permission-prompts`, `loop`, `schedule`, `claude-api`, plus 5 terminal-bus session skills (`checkpoint`, `inbox`, `msg`, `resume`, `session`, `sessions`).

## 2. Contract

| Claim | Source |
|---|---|
| Skills are invoked via `/skill-name` | Claude Code platform convention (Skill tool documentation) |
| SINAPSE ships skills in `.claude/skills/` | Convention confirmed by directory presence |
| No skill installer code path in SINAPSE installer | Grep of `bin/` + `packages/` shows zero skill-lifecycle logic |
| claude-mem plugin supplies additional skills | Plugin installation is user-managed, not SINAPSE |

## 3. Reality

- All 17 SINAPSE-authored skills present in `.claude/skills/`.
- All `claude-mem:*` skills and claude.ai third-party skills loaded successfully in this session (visible in skill list).
- Skills referenced from rules (e.g., `coderabbit-integration.md`, `nsn-mode.md`, `agent-handoff.md`) exist in the skills directory.
- No observed skill failures during this session's executions (PR #98-#109).

## 4. Delta

| Claim | Contract | Reality | Status |
|---|---|---|---|
| SINAPSE skills present | 17 in `.claude/skills/` | 17 confirmed present | **ALIGNED** |
| Skills invoked via slash | Platform convention | Observed: `/Skill` tool calls routed correctly through session | **ALIGNED** |
| Skill install lifecycle | None documented | None implemented (user-managed via plugin marketplaces) | **ALIGNED** (intentional) |
| Skill documentation / invocation help | No dedicated `skills.md` rule | No single rule doc listing SINAPSE skills and their invocation patterns | **LOW: DOC GAP** |

## 5. Severity

**LOW — No top-level skill index.** SINAPSE ships 17 authored skills but no top-level rule or doc enumerates them with one-liner descriptions + invocation examples. Skills are discovered either by reading `.claude/skills/` directly or via the Claude Code skill list. Users on first contact may not realize SINAPSE-specific skills exist. Post-GA docs improvement, not a runtime issue.

## 6. Recommendation

1. **GA:** no action.
2. **Post-GA (2h):** add `docs/guides/skills-reference.md` — one-liner per SINAPSE skill with invocation example. Could be auto-generated from skill frontmatter.

## 7. Gate Decision

| Dimension | Verdict | Rationale |
|---|---|---|
| **9. Skills** | **PASS** | Zero CRITICAL/HIGH, zero MEDIUM, one LOW (docs gap). All 17 authored skills present and loading; plugin-supplied and third-party skills load cleanly. No runtime defect. |

## Change Log

- 2026-04-19 — Dimension 9 audit. PASS.
