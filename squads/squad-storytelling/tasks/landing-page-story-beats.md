---
task: "landing-page-story-beats"
responsavel: "blake-snyder"
responsavel_type: "agent"
atomic_layer: true
elicit: true
Entrada:
  - "Product/service and value proposition"
  - "Target audience and conversion goal"
Saida:
  - "Landing page structure mapped to Save the Cat beats with copy direction"
Checklist:
  - "[ ] Page sections follow beat sheet dramatic structure"
  - "[ ] Each scroll section has clear emotional purpose"
  - "[ ] CTA placement aligned with Finale beat timing"
---

# Task: Landing Page Story Beats

**Task ID:** NARR-026
**Version:** 1.0.0
**Command:** `*landing-page-story-beats`
**Agent:** Blake Snyder (blake-snyder)
**Purpose:** Structure landing page copy as a beat sheet narrative, turning a scroll into a story that builds emotional momentum toward conversion.

---

## Inputs

| Input | Source | Required |
|-------|--------|----------|
| `product_service` | What is being offered | YES |
| `value_proposition` | Core benefit and differentiator | YES |
| `target_audience` | Who the page is for | YES |
| `conversion_goal` | Sign-up, purchase, demo, download | YES |
| `page_length` | Short (hero + CTA), medium, long-form | PREFERRED |
| `existing_copy` | Current landing page content | NO |

## Execution Phases

### Phase 1: Map Page Sections to Beats

| Scroll Position | Beat | Page Section | Purpose |
|----------------|------|-------------|---------|
| Above the fold | Opening Image | Hero section | Establish world + hook |
| Above the fold | Theme Stated | Subheadline | State the promise |
| First scroll | Set-Up | Problem section | Show the pain/context |
| First scroll | Catalyst | Trigger statement | Name the breaking point |
| Second scroll | Debate | Objection handling | Address "why not" |
| Second scroll | Break into Two | Solution reveal | Introduce the product |
| Mid-page | B Story | Social proof | Human validation |
| Mid-page | Fun and Games | Features/benefits | Core value delivery |
| Third scroll | Midpoint | Key differentiator | Raise stakes or contrast |
| Third scroll | Bad Guys Close In | Risk of inaction | What happens if they don't act |
| Near bottom | All Is Lost → Break 3 | Guarantee/reversal | Remove final risk |
| Bottom | Finale | CTA section | The conversion moment |
| Footer | Final Image | Transformed vision | Life after conversion |

### Phase 2: Write Each Section

For each beat/section:
1. **Headline** — The single sentence that carries the beat's emotional purpose
2. **Body copy** — Supporting text (2-4 sentences max per section)
3. **Visual direction** — What image, icon, or graphic supports this beat
4. **Emotional target** — What the reader should feel at this scroll point
5. **Transition** — How this section flows into the next (scroll motivation)

### Phase 3: Optimize Critical Beats

1. **Opening Image (Hero)** — Must pass the 5-second test: visitor knows what, who, and why
2. **Catalyst** — The "that's me" moment where visitors recognize their pain
3. **Fun and Games** — Features presented as story beats, not bullet lists
4. **Midpoint** — The single most compelling differentiator or proof point
5. **Finale (CTA)** — Framed as resolution, not request; button text = transformation verb

### Phase 4: Design Emotional Scroll Arc

1. Map the emotional intensity at each scroll percentage (0% to 100%)
2. Ensure rising tension from Set-Up through Bad Guys Close In
3. Design the "relief" moment at Break into Three (guarantee, testimonial, proof)
4. Place micro-CTAs at emotional peaks (after Fun and Games, after Midpoint)
5. Primary CTA at the Finale — the narrative resolution point

### Phase 5: Create Copy Variations

1. Write 3 headline variations for the Opening Image (test different hooks)
2. Write 2 CTA button text variations (transformation verbs, not "Submit")
3. Create urgency version (with Time frame) and evergreen version
4. Adapt for mobile: prioritize beats that work in shorter scroll
5. Write meta title and description that reflect the page's story arc

## Output Format

```yaml
landing_page_beats:
  product: "{name}"
  conversion_goal: "{action}"
  page_structure:
    - section: "Hero"
      beat: "Opening Image + Theme Stated"
      headline: "{headline}"
      subheadline: "{subheadline}"
      body: "{supporting copy}"
      visual: "{image/graphic direction}"
      emotional_target: "{feeling}"
    # ... all sections
  emotional_arc:
    above_fold: "{curiosity, recognition}"
    mid_page: "{desire, validation}"
    near_bottom: "{urgency, confidence}"
    cta: "{resolution, empowerment}"
  cta_design:
    primary_text: "{button text}"
    supporting_text: "{below-button reassurance}"
    placement: ["{locations on page}"]
  headline_variations: ["{option 1}", "{option 2}", "{option 3}"]
  cta_variations: ["{option 1}", "{option 2}"]
  mobile_priority_beats: ["{beats that must survive mobile}"]
```

## Veto Conditions

- **NEVER** lead with features — the Opening Image must establish the WORLD, not the product
- **NEVER** place the CTA without earning it — the Finale beat requires preceding emotional buildup
- **NEVER** skip the Debate section — unaddressed objections kill conversions
- **NEVER** use "Submit" as CTA text — the button is the Finale beat, it must transform

## Completion Criteria

- [ ] Page sections mapped to beat sheet with clear emotional purpose
- [ ] Each section has headline, body, visual direction, and emotional target
- [ ] Critical beats optimized (hero, catalyst, fun and games, CTA)
- [ ] Emotional scroll arc designed with rising tension
- [ ] Multiple headline and CTA variations provided
- [ ] Mobile adaptation considered
