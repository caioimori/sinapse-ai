---
task: "craft-logline"
responsavel: "blake-snyder"
responsavel_type: "agent"
atomic_layer: true
elicit: true
Entrada:
  - "Story concept or idea"
Saida:
  - "Polished logline with irony, mental picture, and primal test"
Checklist:
  - "[ ] Logline is one sentence with built-in irony"
  - "[ ] Mental picture conjured — a stranger can 'see' the story"
  - "[ ] Primal test passed"
---

# Task: Craft Logline

**Task ID:** NARR-008
**Version:** 1.0.0
**Command:** `*craft-logline`
**Agent:** Blake Snyder (blake-snyder)
**Purpose:** Craft a compelling one-sentence logline that sells the story.

---

## Inputs

| Input | Source | Required |
|-------|--------|----------|
| `story_concept` | User description | YES |
| `genre` | If known | NO |
| `target_audience` | Who this is for | NO |

## Execution Phases

### Phase 1: Extract Core Elements

1. Who is the hero? (adjective + noun, not a name)
2. What is the inciting incident? (the catalyst)
3. What is the goal? (clear, external, visual)
4. What is the opposition? (stakes, antagonist, obstacle)

### Phase 2: Build Logline

Formula: **On the verge of [status quo], a [flawed hero] must [do something difficult] when [catalyst occurs], or [consequence].**

Check for:
- **Irony:** Is there a built-in contradiction or twist?
- **Mental picture:** Can a stranger visualize the whole story?
- **Audience + genre:** Does it imply who watches and what genre?
- **Killer title pairing:** Does it work with a great title?

### Phase 3: Primal Test

Does it connect to: survival, hunger, sex, protection of loved ones, or fear of death?

### Phase 4: Iterate

Generate 3-5 variations, test each against the criteria, select the strongest.

## Veto Conditions

- **NEVER** accept a logline that is not one sentence
- **NEVER** accept a logline without irony
- **NEVER** accept a logline that fails the primal test

## Completion Criteria

- [ ] Logline is one compelling sentence
- [ ] Built-in irony creates emotional hook
- [ ] Mental picture is clear and vivid
- [ ] Primal test passed
- [ ] Multiple variations generated and best selected
