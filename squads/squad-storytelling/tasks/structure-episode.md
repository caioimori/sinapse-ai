---
task: "structure-episode"
responsavel: "dan-harmon"
responsavel_type: "agent"
atomic_layer: true
elicit: true
Entrada:
  - "Episode concept, series context, or theme"
Saida:
  - "Complete TV episode structure with A/B stories and beat breakdown"
Checklist:
  - "[ ] A-story and B-story defined with thematic rhyme"
  - "[ ] Cold open through tag structured with circle mapping"
  - "[ ] Fractal circles identified (episode, act, scene levels)"
---

# Task: Structure TV Episode

**Task ID:** NARR-006
**Version:** 1.0.0
**Command:** `*structure-episode`
**Agent:** Dan Harmon (dan-harmon)
**Purpose:** Structure a TV episode using the Story Circle, with A/B story integration and fractal narrative mapping.

---

## Inputs

| Input | Source | Required |
|-------|--------|----------|
| `episode_concept` | User prompt | YES |
| `series_context` | Ongoing series details | PREFERRED |
| `characters` | Available characters | PREFERRED |
| `episode_format` | 22min/30min/60min | NO (default: 30min) |

## Execution Phases

### Phase 1: Define A-Story and B-Story

1. **A-Story:** The main plot (what happens)
2. **B-Story:** The thematic mirror (what the episode is actually about)
3. Verify thematic rhyme — both stories explore the same theme from different angles

### Phase 2: Map Episode Circle

| Section | Circle Steps | Content |
|---------|-------------|---------|
| Cold Open | Step 1 (You) | Establish status quo |
| Act 1 | Steps 2-3 (Need, Go) | Disruption and commitment |
| Act 2a | Step 4 (Search) | Complications, fun and games |
| Midpoint | Step 5 (Find) | The turn, the discovery |
| Act 3a | Step 6 (Take) | Consequences, the price |
| Act 3b | Steps 7-8 (Return, Change) | Resolution, new status quo |
| Tag | Coda | For the audience's unconscious |

### Phase 3: Beat Breakdown

For each section, define 3-5 beats with:
- What happens (action)
- Emotional state of protagonist
- How it connects to theme
- A/B story toggle

### Phase 4: Fractal Verification

Verify nested circles work at scene level within each act.

## Veto Conditions

- **NEVER** let A and B stories be thematically disconnected
- **NEVER** skip the midpoint turn — it drives everything after
- **NEVER** resolve the B-story before it informs the A-story climax

## Completion Criteria

- [ ] A-story and B-story defined with thematic connection
- [ ] Full episode structure mapped to Story Circle
- [ ] Beat breakdown complete for each section
- [ ] Emotional arc tracked throughout
