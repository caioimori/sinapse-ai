---
task: "transformation-arc-design"
responsavel: "joseph-campbell"
responsavel_type: "agent"
atomic_layer: true
elicit: true
Entrada:
  - "Subject of transformation (person, brand, product, audience)"
  - "Context and desired outcome"
Saida:
  - "Complete transformation arc with before/after states and mythic structure"
Checklist:
  - "[ ] Before and after states clearly defined with emotional depth"
  - "[ ] Transformation arc follows mythic death/rebirth pattern"
  - "[ ] Arc adaptable to multiple content formats"
---

# Task: Design Transformation Arc

**Task ID:** NARR-020
**Version:** 1.0.0
**Command:** `*transformation-arc-design`
**Agent:** Joseph Campbell (joseph-campbell)
**Purpose:** Design a complete transformation arc for marketing, using Campbell's death-and-rebirth pattern to create compelling before/after narratives.

---

## Inputs

| Input | Source | Required |
|-------|--------|----------|
| `transformation_subject` | Who/what is being transformed (customer, brand, product) | YES |
| `before_state` | Current state, pain points, limitations | YES |
| `after_state` | Desired outcome, aspirational identity | YES |
| `catalyst` | What triggers the transformation (product, service, event) | YES |
| `medium` | Where the arc will be used (ad, case study, landing page) | PREFERRED |

## Execution Phases

### Phase 1: Map the Before State (Death Territory)

1. Define the subject's Ordinary World in vivid detail — what does daily life look like?
2. Identify the core suffering or dissatisfaction — what is endured but not accepted?
3. Name the false beliefs or coping mechanisms that maintain the status quo
4. Quantify the cost of staying (emotional, financial, relational, opportunity cost)
5. Identify the "last straw" — the moment tolerance breaks

### Phase 2: Design the Threshold Moment

1. What specific event, encounter, or realization triggers the shift?
2. What is the emotional quality of this moment? (revelation, desperation, hope, anger)
3. What must the subject give up to cross? (comfort, identity, money, time)
4. Design the "symbolic death" — what part of the old self must die?
5. What is the irreversible action that marks commitment?

### Phase 3: Map the Transformation Process

1. **First Trial** — The immediate challenge after committing (buyer's remorse, learning curve)
2. **Deepening** — Progressive mastery, small wins, growing confidence
3. **Dark Night** — The moment of doubt where the subject almost reverts
4. **Breakthrough** — The insight or achievement that makes the transformation real
5. **Integration** — The new identity solidifies; old patterns no longer fit

### Phase 4: Map the After State (Rebirth Territory)

1. Define the new Ordinary World — what does daily life look like now?
2. Identify the new beliefs that replaced the old false beliefs
3. Quantify the gains (emotional, financial, relational, capability)
4. Describe the "elixir" — what wisdom or capability can they now share with others?
5. Design the "freedom to live" moment — the scene that captures the transformed life

### Phase 5: Craft Arc Variations

1. **30-second version** — For ads and social: one sentence before, catalyst, one sentence after
2. **2-minute version** — For testimonials and case studies: emotional detail at each stage
3. **Long-form version** — For landing pages and keynotes: full mythic arc with all phases
4. Identify the single most powerful contrast point (before vs after in one image/sentence)
5. Design the "mirror moment" — where the audience sees themselves in the before state

## Output Format

```yaml
transformation_arc:
  subject: "{who is being transformed}"
  before_state:
    ordinary_world: "{daily reality}"
    core_suffering: "{main pain}"
    false_beliefs: ["{limiting beliefs}"]
    cost_of_staying: "{quantified cost}"
    last_straw: "{breaking point}"
  threshold:
    trigger: "{catalyst event}"
    emotional_quality: "{feeling}"
    sacrifice: "{what must be given up}"
    symbolic_death: "{what dies}"
    irreversible_action: "{commitment point}"
  transformation_process:
    first_trial: "{immediate challenge}"
    deepening: "{progressive mastery}"
    dark_night: "{moment of doubt}"
    breakthrough: "{turning point}"
    integration: "{new identity solidifies}"
  after_state:
    new_world: "{transformed daily reality}"
    new_beliefs: ["{empowering beliefs}"]
    gains: "{quantified gains}"
    elixir: "{wisdom to share}"
    freedom_moment: "{scene of transformed life}"
  arc_versions:
    thirty_second: "{ad version}"
    two_minute: "{testimonial version}"
    long_form: "{full narrative}"
  power_contrast: "{single most powerful before/after image}"
  mirror_moment: "{where audience sees themselves}"
```

## Veto Conditions

- **NEVER** skip the struggle — transformation without ordeal is advertising, not story
- **NEVER** present transformation as instant — the process must be visible and earned
- **NEVER** fabricate transformation outcomes — arc must be grounded in reality
- **NEVER** ignore the "dark night" — the doubt moment is what makes the arc credible

## Completion Criteria

- [ ] Before and after states defined with emotional and quantitative depth
- [ ] Threshold moment designed with clear symbolic death
- [ ] Full transformation process mapped (trial through integration)
- [ ] Three arc versions created (30s, 2min, long-form)
- [ ] Power contrast and mirror moment identified
- [ ] Arc tested for audience identification and emotional resonance
