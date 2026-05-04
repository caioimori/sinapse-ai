---
task: "case-study-beat-structure"
responsavel: "blake-snyder"
responsavel_type: "agent"
atomic_layer: true
elicit: true
Entrada:
  - "Client/customer success story details"
  - "Key metrics and outcomes"
Saida:
  - "Case study structured with Save the Cat beats for maximum engagement"
Checklist:
  - "[ ] Case study follows dramatic structure, not just chronology"
  - "[ ] Key beats (Catalyst, Midpoint, Finale) create emotional engagement"
  - "[ ] Results presented as climactic payoff, not dry data"
---

# Task: Structure Case Study with Beat Sheet

**Task ID:** NARR-025
**Version:** 1.0.0
**Command:** `*case-study-beat-structure`
**Agent:** Blake Snyder (blake-snyder)
**Purpose:** Transform standard case studies from boring chronologies into compelling narratives using Save the Cat beat structure.

---

## Inputs

| Input | Source | Required |
|-------|--------|----------|
| `client_info` | Client name, industry, size | YES |
| `challenge` | The problem they faced | YES |
| `solution` | What was implemented | YES |
| `results` | Metrics, outcomes, testimonials | YES |
| `timeline` | How long the engagement lasted | PREFERRED |
| `format` | Long-form, one-pager, video, slide deck | NO (default: long-form) |

## Execution Phases

### Phase 1: Identify the Story Genre

1. Classify the case study using Snyder's 10 genres:
   - Monster in the House (fighting a threat)
   - Golden Fleece (quest for a goal)
   - Out of the Bottle (unexpected transformation)
   - Dude with a Problem (ordinary person, extraordinary situation)
   - Rites of Passage (life transition)
   - Buddy Love (partnership story)
   - Whydunit (mystery/investigation)
   - Fool Triumphant (underdog victory)
   - Institutionalized (group vs system)
   - Superhero (extraordinary person, ordinary world)
2. Select the genre that best fits the client's story
3. This genre determines tone, pacing, and emphasis

### Phase 2: Map Client Story to 15 Beats

1. **Opening Image** — Client's world before the problem peaked (the "normal" that wasn't working)
2. **Theme Stated** — The core insight the case study will prove
3. **Set-Up** — Client background, industry context, stakes involved
4. **Catalyst** — The moment the problem became urgent (what triggered action?)
5. **Debate** — The client's hesitation, alternatives considered, internal debate
6. **Break into Two** — The decision to engage your solution
7. **B Story** — The human element: the champion inside the client org, the relationship
8. **Fun and Games** — Implementation highlights, the "promise" of the solution in action
9. **Midpoint** — Early wins OR unexpected complication (raises stakes either way)
10. **Bad Guys Close In** — Obstacles during implementation, things that almost derailed it
11. **All Is Lost** — The lowest point or biggest risk moment
12. **Dark Night** — The moment of doubt before breakthrough
13. **Break into Three** — The insight or pivot that made everything work
14. **Finale** — Results delivered, transformation complete
15. **Final Image** — Client's world now — contrasted with Opening Image

### Phase 3: Enhance Emotional Beats

1. Add a specific human quote or moment to Catalyst, Midpoint, and Finale
2. Design the "All Is Lost" moment for maximum tension (even if brief in reality)
3. Ensure the Finale SHOWS results, not just tells (data + human impact)
4. Create the contrast between Opening Image and Final Image as a single visual
5. Add the B Story human element — the person behind the numbers

### Phase 4: Write the Case Study

1. Open with the Opening Image — drop the reader into the client's world
2. Build through beats naturally — never reveal the ending early
3. Make the Debate real — show why choosing your solution was not obvious
4. Let Fun and Games deliver the core value proposition through story
5. End with the Final Image — the transformed reality, backed by data

### Phase 5: Create Format Variations

1. **Long-form** (1500-2500 words) — Full beat sheet with all 15 beats
2. **One-pager** (300-500 words) — Catalyst, Fun and Games, Finale only
3. **Slide deck** (8-12 slides) — One beat per slide, visual-first
4. **Social proof snippet** (50-100 words) — Opening Image → Final Image contrast
5. **Video script** (if applicable) — Beats timed to runtime

## Output Format

```yaml
case_study:
  client: "{name/anonymized}"
  genre: "{snyder genre}"
  theme_stated: "{core insight}"
  beat_sheet:
    opening_image: "{before state}"
    catalyst: "{trigger moment}"
    debate: "{hesitation and alternatives}"
    break_into_two: "{decision to engage}"
    b_story: "{human champion}"
    fun_and_games: "{solution in action}"
    midpoint: "{early win or complication}"
    bad_guys: "{implementation obstacles}"
    all_is_lost: "{lowest moment}"
    break_into_three: "{breakthrough insight}"
    finale: "{results and transformation}"
    final_image: "{after state}"
  results_highlight:
    metrics: ["{key numbers}"]
    testimonial: "{client quote}"
    before_after: "{contrast summary}"
  format_versions:
    long_form: "{word count and outline}"
    one_pager: "{condensed version}"
    social_snippet: "{50-100 word version}"
```

## Veto Conditions

- **NEVER** lead with results — the payoff must be earned through story
- **NEVER** skip the Debate — showing alternatives considered adds credibility
- **NEVER** omit the obstacles — case studies without struggle are unbelievable
- **NEVER** write a chronological timeline and call it a case study — it must be a STORY

## Completion Criteria

- [ ] Case study genre identified and applied
- [ ] All applicable beats mapped to client story
- [ ] Emotional beats enhanced with human quotes and moments
- [ ] Opening Image/Final Image contrast is vivid and compelling
- [ ] Multiple format variations created
- [ ] Results presented as narrative payoff, not data dump
