---
task: "identify-archetypes"
responsavel: "joseph-campbell"
responsavel_type: "agent"
atomic_layer: true
elicit: true
Entrada:
  - "Narrative, brand, or situation to analyze"
Saida:
  - "Archetype analysis with character/force mapping"
Checklist:
  - "[ ] All characters/forces mapped to archetypes"
  - "[ ] Shadow and Trickster identified (often overlooked)"
  - "[ ] Recommendations for strengthening archetypal resonance"
---

# Task: Identify Archetypes

**Task ID:** NARR-004
**Version:** 1.0.0
**Command:** `*identify-archetypes`
**Agent:** Joseph Campbell (joseph-campbell)
**Purpose:** Identify and analyze archetypal patterns in any narrative, brand, or situation.

---

## Inputs

| Input | Source | Required |
|-------|--------|----------|
| `narrative` | Story, brand description, or situation | YES |
| `context` | Literary, brand, personal, organizational | PREFERRED |

## Execution Phases

### Phase 1: Map Characters to Archetypes

For each character or force, determine which archetype(s) they embody:

| Archetype | Function | Question |
|-----------|----------|----------|
| Hero | Undergoes transformation | Who is changed by this story? |
| Mentor | Provides wisdom/tools | Who guides the hero? |
| Threshold Guardian | Tests readiness | What barriers test commitment? |
| Herald | Announces change | What signals the call to adventure? |
| Shapeshifter | Creates uncertainty | Who cannot be fully trusted? |
| Shadow | Represents darkness | What is the hero's dark mirror? |
| Trickster | Breaks rules | Who brings chaos and humor? |
| Allies | Provide support | Who stands with the hero? |

### Phase 2: Analyze Archetypal Dynamics

1. Is the Shadow a true dark mirror of the Hero?
2. Does the Mentor withdraw at the right moment?
3. Are Threshold Guardians testing the right qualities?
4. Does the Shapeshifter create genuine uncertainty?
5. Is the Trickster serving the story or just providing comic relief?

### Phase 3: Assess Gaps and Recommendations

1. Which archetypes are missing or underserved?
2. Where could archetypal resonance be strengthened?
3. What mythological parallels illuminate the story?

## Veto Conditions

- **NEVER** force an archetype where none exists — not every story uses all 8
- **NEVER** reduce characters to single archetypes — real characters blend multiple
- **NEVER** ignore cultural context when assigning archetypal meaning

## Completion Criteria

- [ ] All characters/forces mapped to archetypes with reasoning
- [ ] Shadow and Trickster identified (or noted as absent)
- [ ] Archetypal dynamics analyzed for effectiveness
- [ ] Gaps identified with recommendations for strengthening
