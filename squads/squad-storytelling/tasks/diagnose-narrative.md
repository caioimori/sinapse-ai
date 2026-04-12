---
task: "diagnose-narrative"
responsavel: "storytelling-orqx"
responsavel_type: "agent"
atomic_layer: true
elicit: true
Entrada:
  - "User message with storytelling/narrative request"
  - "Routing catalog (knowledge-base/routing-catalog.md)"
Saida:
  - "Narrative diagnosis with routing recommendation"
Checklist:
  - "[ ] User intent parsed and categorized"
  - "[ ] Cross-cutting answer delivered to user"
  - "[ ] Routing suggestion provided with confidence level"
---

# Task: Diagnose & Route — Narrative Masters Squad

**Task ID:** NARR-001
**Version:** 1.0.0
**Command:** `*diagnose-narrative`
**Agent:** Arc (storytelling-orqx)
**Purpose:** Analyze the user's storytelling or narrative question, provide an immediate cross-cutting answer, and determine whether specialist routing is needed.

---

## Inputs

| Input | Source | Required |
|-------|--------|----------|
| `user_message` | User prompt | YES |
| `routing_catalog` | `knowledge-base/routing-catalog.md` | YES |
| `conversation_history` | Session context | NO |

## Preconditions

1. User message is not empty
2. Routing catalog is loaded and accessible

## Execution Phases

### Phase 1: Parse Request

1. Extract the core question or intent from the user message
2. Identify keywords, narrative domains, and storytelling context
3. Determine the story scale: micro (anecdote, post), meso (presentation, episode), macro (screenplay, novel), or meta (movement, cultural)
4. Determine the narrative domain: mythic, structural, personal, business, performative, or movement

### Phase 2: Match Routing Catalog

1. Load `knowledge-base/routing-catalog.md`
2. Match extracted keywords against domain keyword lists
3. Score each domain by keyword overlap and contextual relevance
4. Identify `primary_agent` and `secondary_agent` for the top-scoring domain
5. If multiple domains score equally, consider the story scale to break ties:
   - Micro scale: prefer kindra-hall, park-howell
   - Meso scale: prefer nancy-duarte, oren-klaff, dan-harmon, blake-snyder
   - Macro scale: prefer blake-snyder, joseph-campbell
   - Meta scale: prefer marshall-ganz, joseph-campbell

### Phase 3: Cross-Cutting Answer

**MANDATORY — Always execute this phase before any routing.**

1. Provide an immediate, useful answer to the user's question
2. The answer should be actionable and demonstrate narrative domain competence
3. Include relevant context: frameworks mentioned, quick storytelling guidance
4. Reference the applicable narrative principle or framework by name
5. This answer must stand alone — even if the user never follows the routing suggestion

### Phase 4: Confidence Assessment

| Level | Criteria | Action |
|-------|---------|--------|
| HIGH | Clear keyword match, single domain, unambiguous | Route to primary agent |
| MEDIUM | Multiple domains match, slight ambiguity | Suggest primary + secondary |
| LOW | No clear match, vague request, cross-domain | Stay with orchestrator, ask clarifying questions |

## Output Format

```yaml
diagnosis:
  intent: "{parsed user intent}"
  narrative_domain: "mythic | structural | personal | business | performative | movement"
  story_scale: "micro | meso | macro | meta"
  matched_domain: "{domain from routing catalog}"
  confidence: "HIGH | MEDIUM | LOW"
  primary_agent: "{agent-id}"
  secondary_agent: "{agent-id}"
  cross_cutting_answer: |
    {The immediate answer provided to the user}
  routing_suggestion: |
    {Why this specialist was chosen and what they can add}
```

## Veto Conditions

- **NEVER** route without providing a cross-cutting answer first
- **NEVER** route when confidence is LOW — stay with orchestrator and ask clarifying questions
- **NEVER** load a specialist agent file during diagnosis — only identify the route
- **NEVER** default to joseph-campbell for every question — match the actual domain

## Completion Criteria

- [ ] User intent parsed and categorized
- [ ] Narrative domain and story scale identified
- [ ] Routing catalog consulted and domain matched
- [ ] Cross-cutting answer delivered to user
- [ ] Confidence level assessed
- [ ] Routing suggestion provided (if confidence >= MEDIUM)
