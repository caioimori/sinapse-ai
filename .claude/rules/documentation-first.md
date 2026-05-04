# Documentation-First Development (NON-NEGOTIABLE)

> **Constitution Article III — Elevated to NON-NEGOTIABLE**
> Applies to ALL agents, ALL projects, ALL requests. No exceptions.

## Rule

Before ANY code implementation begins, the full documentation pipeline MUST be completed. This is AUTOMATIC behavior — no user needs to request it.

### Required Pipeline

```
User briefing → Epic (if new initiative) → Story → Validation → Implementation
```

1. **Epic** — The initiative MUST have an epic defined (or an existing one identified)
2. **Story** — Each work unit MUST have a story file in `docs/stories/` with:
   - Clear acceptance criteria (Given/When/Then preferred)
   - Defined scope (IN/OUT)
   - Dependencies mapped
   - Complexity estimate
3. **Validation** — Story MUST be validated (@product-lead) before implementation starts
4. **Status** — Story status MUST be >= `Ready` before any code is written

## Automatic Behavior (NON-NEGOTIABLE)

This is NOT something the user needs to request. It happens AUTOMATICALLY on every briefing:

| User Says | Agent Does |
|-----------|-----------|
| "Implementa feature X" | Creates story FIRST, then implements |
| "Corrige esse bug" | Creates bug-fix story FIRST, then fixes |
| "Faz isso rapidinho" | Creates story anyway — no shortcuts |
| "Pula a documentacao" | REFUSES. Explains this is NON-NEGOTIABLE |
| "So quero o codigo" | Routes to @sprint-lead for story, then @developer |

## Gate: BLOCK

No implementation proceeds without ALL of these:
- Story file exists in `docs/stories/`
- Story has acceptance criteria defined
- Story has scope (IN/OUT) documented
- Story status is `Ready` or higher (validated by @product-lead)

**Attempting to write code without a valid story → BLOCKED.**

## Workflow Enforcement

### CORRECT Flow (always)
```
User briefing
  → @sprint-lead *draft (create story)
  → @product-lead *validate (validate story)
  → @developer *develop (implement)
  → @quality-gate *qa-gate (quality check)
  → @devops *push (deploy)
```

### FORBIDDEN Flow (never)
```
User briefing → @developer *develop (BLOCKED — no story)
User briefing → Direct code writing (BLOCKED — no story)
```

## Exception

The ONLY exception is framework governance work by @sinapse-orqx (constitutional amendments, ecosystem health), which operates above the story layer. Even then, changes SHOULD be documented.

## Anti-Patterns (FORBIDDEN)

- Writing ANY code without a story
- "Quick fix" without documentation
- Implementing features based only on verbal description
- Skipping story validation
- Starting implementation with a Draft story (must be Ready)
- Treating documentation as "optional" or "we'll do it later"
- Any agent accepting implementation work without verifying story exists
