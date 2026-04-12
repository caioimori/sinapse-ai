---
task: "review-narrative-output"
responsavel: "storytelling-orqx"
responsavel_type: "agent"
atomic_layer: true
elicit: true
Entrada:
  - "Specialist agent output (narrative deliverable)"
  - "Original user request"
Saida:
  - "Review report with verdict (APPROVE/REVISE/REJECT)"
Checklist:
  - "[ ] All quality items evaluated and scored"
  - "[ ] Verdict rendered (APPROVE/REVISE/REJECT)"
  - "[ ] Specific feedback provided for any failures"
---

# Task: Review Narrative Output

**Task ID:** NARR-002
**Version:** 1.0.0
**Command:** `*review-narrative-output`
**Agent:** Arc (storytelling-orqx)
**Purpose:** Review specialist output against quality criteria, score, and approve or request revision.

---

## Inputs

| Input | Source | Required |
|-------|--------|----------|
| `specialist_output` | Specialist agent | YES |
| `original_request` | User prompt | YES |
| `specialist_id` | Routing | YES |

## Execution Phases

### Phase 1: Understand Context

1. Re-read the original user request
2. Identify what was asked vs what was delivered
3. Note the specialist who produced the output
4. Identify the narrative purpose: brand story, pitch, content, origin story, presentation, manifesto
5. Determine the target audience and emotional destination

### Phase 2: Apply Quality Criteria

Evaluate each dimension (1-5 scale):

| Dimension | Weight | Criteria |
|-----------|--------|----------|
| Structure | HIGH | Clear beginning/middle/end, beats present, framework followed |
| Emotional Arc | HIGH | Feelings progression, tension/release, transformation earned |
| Opening Hook | HIGH | First 30 seconds capture attention, establish stakes |
| Audience Alignment | MEDIUM | Resonates with intended audience, appropriate tone |
| Theme Integration | MEDIUM | Central message woven throughout, not just stated |
| Specificity | MEDIUM | Concrete details, not vague generalizations |
| Call to Action | MEDIUM | Clear next step (if applicable) |
| Framework Fidelity | LOW | Follows the specialist's methodology correctly |

### Phase 3: Score and Decide

| Score | Verdict | Action |
|-------|---------|--------|
| All HIGH dimensions >= 4, average >= 3.5 | APPROVE | Deliver to user |
| All HIGH dimensions >= 3, average >= 3.0 | REVISE | Return to specialist with specific feedback |
| Any HIGH dimension < 3 | REJECT | Return to specialist, block delivery |

### Phase 4: Output

```markdown
## Review Report

**Specialist:** {name} ({id})
**Verdict:** {APPROVE | REVISE | REJECT}
**Score:** {average}/5.0

### Strengths
- {items that scored well}

### Issues Found
- [{CRITICAL|WARN}] {description} — {recommendation}

### Narrative-Specific Notes
- Emotional arc strength: {assessment}
- Opening hook effectiveness: {assessment}
- Resolution satisfaction: {assessment}

### Recommendation
{Next step: deliver / revise specific items / redo}
```

## Veto Conditions

- **NEVER** approve output with any HIGH dimension below 3
- **NEVER** reject without providing specific, actionable feedback
- **NEVER** modify the specialist's output — only review and provide feedback
- **NEVER** approve narratives without a clear structure (beginning, middle, end)
- **NEVER** approve stories that lack emotional engagement or feel flat

## Completion Criteria

- [ ] Original request re-read and understood
- [ ] Narrative purpose and audience identified
- [ ] All quality dimensions evaluated and scored
- [ ] Verdict rendered (APPROVE/REVISE/REJECT)
- [ ] Specific feedback provided for any failures
- [ ] Emotional arc, structure, and hook individually assessed
