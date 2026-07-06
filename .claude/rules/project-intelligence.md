# Project Intelligence — Auto-Detection (NON-NEGOTIABLE)

> Applies to ALL agents, ALL sessions. Users NEVER configure project type manually.
> This is the always-on CORE (the law). The per-dimension signals, per-state
> behaviors (greenfield / continuation / brownfield / SINAPSE-managed) and examples
> live in `project-intelligence-reference.md` and load when you work on
> project-setup files.

## Initial State Audit (ALWAYS FIRST — NON-NEGOTIABLE preflight)

Before classifying anything, silently audit **8 dimensions** (existence + summary):
**Docs · Brand · Design system · Components · Code · Tests · Infra · Git history.**
Never skip it "because it looks empty" — partial work (brand without code, a
half-written PRD, abandoned epics) is exactly what the audit protects.

## Maturity Classification (from the 8 signals)

| Level | Meaning | Path |
|---|---|---|
| `EMPTY` | 0/8 signals | Full greenfield workflow |
| `BOOTSTRAPPED` | only Infra present | Greenfield from Phase 1 (skip Bootstrap) |
| `PARTIAL` | some Docs/Brand/DS without Code, or Code without Docs | **Continue** — never overwrite, merge with existing |
| `MATURE` | Code + Tests + (Docs OR Infra) | Brownfield Discovery before any change |
| `SINAPSE_MANAGED` | `.sinapse-ai/` + `core-config.yaml` | Resume SDC from active story |

**Audit output is always presented to the user before proceeding** (one structured
PT-BR paragraph: estado detectado · já existe · faltando · recomendação). Only
after this report does the framework classify + invoke workflows.

## The Law

- **Auto-detect, never ask** "is this a new or existing project?" or make the user
  set `projectType`.
- **Brownfield:** understand existing code BEFORE changing anything; respect
  existing conventions; never impose SINAPSE conventions forcefully.
- **Partial work is sacred:** inventory first, merge — never replace; preserve
  epic/story state from previous sessions.
- **Greenfield is NOT "setup → story → implement":** sub-classify the project type
  and run the required greenfield workflow with its upstream artifacts.

## Anti-Patterns (FORBIDDEN)

- Skipping the audit; calling a directory greenfield/brownfield from one signal
- Overwriting existing partial work without listing it to the user first
- Ignoring `docs/epics/` and `docs/stories/` from a previous session
- Applying greenfield templates over an existing project's CI/configs

> **Detail (loads on setup work):** signals checked per dimension, quick tech scan
> table, per-state behaviors (greenfield steps 1-4, continuation, brownfield,
> SINAPSE-managed), examples — see `project-intelligence-reference.md`.
