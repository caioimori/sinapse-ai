# Documentation-First Development (NON-NEGOTIABLE)

> **Constitution Article III — Elevated to NON-NEGOTIABLE**
> Applies to ALL agents, ALL projects, ALL requests. No exceptions.
> This is the always-on CORE (the law + the gates). Operational detail
> (classification matrix, upstream-artifact tables, workflow files, examples)
> lives in `documentation-first-reference.md` and loads when you work on code.

## Rule

Before ANY code implementation begins, the documentation pipeline MUST be completed —
AUTOMATIC behavior, never something the user requests:

```
User briefing → Epic (if new initiative) → Story → Validation → Implementation
```

If the user says "faz rapidinho", "pula a documentação", or "só quero o código":
create the story anyway — the agent REFUSES shortcuts. This is NON-NEGOTIABLE.

## Gate: BLOCK

No implementation proceeds without ALL of these:
- Story file exists in `docs/stories/`
- Story has acceptance criteria defined
- Story has scope (IN/OUT) documented
- Story status is `Ready` or higher (validated by @product-lead)

**Attempting to write code without a valid story → BLOCKED.**

## Project Type Gate (NON-NEGOTIABLE)

A bare `epic + story` is NOT sufficient for large projects. On every briefing the
agent FIRST classifies the project type; for `site / lp / app / platform / saas /
api / service` with no epic in `docs/epics/` → **BLOCK execution and invoke the
required greenfield workflow** (project-brief → PRD → spec/architecture → stories).
No "implement first, document later" — ever. Ambiguous or large briefings
(complexity ≥ 16 COMPLEX) ALSO trigger the Spec Pipeline first.

Enforcement is a deterministic reactive floor: `sinapse route` classifies and
blocks when required artifacts are missing — it holds even if the agent forgets.

## Exception

ONLY framework governance work by @sinapse-orqx (constitutional amendments,
ecosystem health) operates above the story layer. Even then, changes SHOULD be documented.

## Anti-Patterns (FORBIDDEN)

- Writing ANY code without a story; "quick fix" without documentation
- Starting implementation with a Draft story (must be Ready); skipping validation
- Routing a large-project request to a domain orchestrator before the greenfield
  workflow produces project-brief.md + prd.md
- Skipping the Spec Pipeline on COMPLEX briefings (score ≥ 16)
- Treating documentation as "optional" or "we'll do it later"

> **Detail (loads on code work):** classification matrix (triggers per project
> type), required upstream artifacts per type, complexity dimensions, correct /
> forbidden flows, examples, enforcement-model notes — see
> `documentation-first-reference.md`.
