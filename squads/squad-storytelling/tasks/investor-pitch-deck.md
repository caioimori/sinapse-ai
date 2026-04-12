---
task: "investor-pitch-deck"
responsavel: "oren-klaff"
responsavel_type: "agent"
atomic_layer: true
elicit: true
Entrada:
  - "Company/startup details and financials"
  - "Funding round and amount sought"
Saida:
  - "Complete investor pitch deck narrative using Pitch Anything framework"
Checklist:
  - "[ ] STRONG method applied to full deck structure"
  - "[ ] Frame control strategy designed for investor dynamics"
  - "[ ] Croc brain optimizations applied to every slide"
---

# Task: Build Investor Pitch Deck

**Task ID:** NARR-027
**Version:** 1.0.0
**Command:** `*investor-pitch-deck`
**Agent:** Oren Klaff (oren-klaff)
**Purpose:** Build an investor pitch deck narrative using the Pitch Anything framework, with frame control, STRONG method, and croc brain optimization.

---

## Inputs

| Input | Source | Required |
|-------|--------|----------|
| `company` | Name, stage, industry, mission | YES |
| `problem_solution` | Problem being solved and how | YES |
| `traction` | Key metrics, revenue, users, growth rate | YES |
| `funding_ask` | Amount, round type, use of funds | YES |
| `team` | Founders and key team backgrounds | YES |
| `market_size` | TAM, SAM, SOM | PREFERRED |
| `competitive_landscape` | Key competitors and differentiation | PREFERRED |

## Execution Phases

### Phase 1: Analyze Investor Psychology

1. Profile the target investor type (angel, VC, PE, strategic)
2. Identify their decision framework — what pattern do they look for?
3. Map their default frames: Analyst frame, Power frame, Time frame
4. Identify beta traps in typical pitch meetings (waiting, interruptions, phone checks)
5. Determine status dynamics — how to establish peer-level status immediately

### Phase 2: Design Frame Strategy

1. **Prize Frame** — Position the deal as scarce; investors compete for allocation
2. **Time Frame** — Create urgency without desperation (round timeline, competing interest)
3. **Authority Frame** — Establish domain expertise that investors cannot match
4. **Intrigue Frame** — Lead with a mystery or counterintuitive insight about the market
5. Design frame stacking order for maximum impact
6. Plan frame collision responses for when investors push back

### Phase 3: Build STRONG Deck Structure

1. **Set the Frame (Slides 1-2)** — Bold opening statement that reframes the market; NOT "Hi, I'm..."
2. **Tell the Story (Slides 3-5)** — Problem → failed solutions → insight that changes everything
3. **Reveal the Intrigue (Slide 6)** — The unique insight, technology, or approach nobody else has
4. **Offer the Prize (Slides 7-9)** — Traction, team, and market as proof the prize is real
5. **Nail the Hookpoint (Slide 10)** — The moment they lean in; usually a traction or vision slide
6. **Get the Deal (Slides 11-12)** — Clear ask, use of funds, terms, and immediate next step

### Phase 4: Optimize Each Slide for Croc Brain

For each slide:
1. One idea per slide — croc brain cannot process complexity
2. High contrast visuals — before/after, with/without
3. Novelty element — something they have never seen in a pitch before
4. Tension maintenance — each slide opens a loop the next slide closes
5. Remove all jargon — if it requires explanation, simplify it
6. Design the "look away" test — can someone glance at the slide and get the point?

### Phase 5: Design the Ask and Objection Handling

1. State the ask in one clear sentence (amount, valuation, terms)
2. Present use of funds as a narrative: "With this capital, we will..."
3. Prepare responses for top 7 investor objections using frame control
4. Design the "walk-away" moment — willingness to leave maintains prize frame
5. Create the post-meeting follow-up narrative (not a thank-you, a momentum piece)
6. Plan the "information drip" — what to withhold for follow-up meetings

## Output Format

```yaml
investor_pitch_deck:
  company: "{name}"
  round: "{type and amount}"
  frame_strategy:
    primary: "{Prize/Time/Authority/Intrigue}"
    stack_order: ["{frame sequence}"]
    collision_responses: ["{counter-frame techniques}"]
  deck_structure:
    - slide: 1
      strong_phase: "Set the Frame"
      headline: "{bold opening}"
      content: "{key point}"
      croc_optimization: "{simplicity/novelty/contrast}"
      tension_loop: "{what question this opens}"
    # ... all slides
  the_ask:
    amount: ""
    valuation: ""
    use_of_funds: "{narrative format}"
    terms: ""
  objection_handling:
    - objection: "{concern}"
      frame: "{which frame to use}"
      response: "{specific response}"
  post_meeting:
    follow_up: "{momentum piece, not thank-you}"
    information_drip: "{what to reveal in meeting 2}"
  status_plays:
    opening: "{how to establish status in first 30 seconds}"
    beta_trap_avoidance: ["{specific counter-moves}"]
```

## Veto Conditions

- **NEVER** open with "Hi, I'm X and we do Y" — Set the Frame first
- **NEVER** present more than one idea per slide
- **NEVER** chase after the meeting — maintain prize frame in all follow-ups
- **NEVER** reveal everything — information scarcity maintains intrigue
- **NEVER** let the investor control the frame — always have a counter-frame ready

## Completion Criteria

- [ ] Frame strategy designed with collision responses
- [ ] STRONG method applied to complete deck structure
- [ ] Every slide optimized for croc brain (simplicity, novelty, contrast)
- [ ] Ask is clear, specific, and narratively framed
- [ ] Top 7 objections handled with frame control
- [ ] Post-meeting follow-up strategy designed
