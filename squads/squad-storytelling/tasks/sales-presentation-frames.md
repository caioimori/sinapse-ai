---
task: "sales-presentation-frames"
responsavel: "oren-klaff"
responsavel_type: "agent"
atomic_layer: true
elicit: true
Entrada:
  - "Product/service being sold"
  - "Buyer profile and decision dynamics"
Saida:
  - "Sales presentation with frame control strategy and STRONG structure"
Checklist:
  - "[ ] Buyer frames identified and counter-frames designed"
  - "[ ] Prize frame maintained throughout presentation"
  - "[ ] Hot cognition moments designed for key decision points"
---

# Task: Sales Presentation with Frame Control

**Task ID:** NARR-028
**Version:** 1.0.0
**Command:** `*sales-presentation-frames`
**Agent:** Oren Klaff (oren-klaff)
**Purpose:** Build sales presentations that control the frame, maintain prize positioning, and drive decisions through hot cognition rather than rational analysis.

---

## Inputs

| Input | Source | Required |
|-------|--------|----------|
| `product_service` | What is being sold | YES |
| `buyer_profile` | Decision maker(s), their role, authority, motivations | YES |
| `deal_size` | Approximate value of the deal | YES |
| `sales_context` | Cold outreach, warm intro, RFP response, renewal | YES |
| `competition` | Who else is the buyer considering | PREFERRED |
| `previous_interactions` | Any prior meetings or communications | NO |

## Execution Phases

### Phase 1: Buyer Frame Analysis

1. Identify the buyer's default frames:
   - **Power Frame** — "I'm the buyer, you need me" (most common)
   - **Analyst Frame** — "Show me the data, ROI, comparisons"
   - **Time Frame** — "I'm busy, make it quick"
   - **Moral Authority Frame** — "We have high standards"
2. Map the decision-making unit — who influences, who decides, who blocks
3. Identify beta traps in the sales environment (waiting rooms, junior gatekeepers, "send a proposal")
4. Determine the buyer's hot buttons — what triggers desire vs analysis

### Phase 2: Design Counter-Frame Strategy

1. **Power Frame → Prize Frame** — "We choose our clients carefully"
2. **Analyst Frame → Intrigue Frame** — Lead with mystery, not spreadsheets
3. **Time Frame → Time Constraint** — "I have a hard stop too; let's make this count"
4. **Moral Authority → Peer Authority** — Establish domain expertise they respect
5. Design status-leveling techniques for the first 60 seconds
6. Plan "takeaway" moments — willingness to walk creates desire

### Phase 3: Build STRONG Sales Presentation

1. **Set the Frame** — Open with a bold market observation, NOT a company overview
2. **Tell the Story** — Client problem narrative: a specific story of someone like them
3. **Reveal the Intrigue** — The unique angle, approach, or insight that separates you
4. **Offer the Prize** — Results, case studies, social proof framed as exclusive access
5. **Nail the Hookpoint** — The moment the buyer shifts from evaluating to wanting
6. **Get the Deal** — Clear next steps, commitment request, timeline

### Phase 4: Design Hot Cognition Triggers

1. **Novelty** — Something the buyer has never heard from a vendor before
2. **Tension** — Unresolved question that only your solution answers
3. **Status alignment** — Showing you understand their world at their level
4. **Scarcity** — Limited availability, exclusive terms, closing window
5. **Social proof** — Competitors or peers who already chose you
6. Time each trigger to land at decision-critical moments in the presentation

### Phase 5: Objection Prevention and Close Design

1. Pre-empt the top 5 objections WITHIN the presentation (don't wait for Q&A)
2. Design the "push-pull" close — show desire but maintain willingness to walk
3. Create the "next step cascade" — if they say yes, what happens immediately?
4. Design the "no is okay" frame — removing pressure paradoxically increases desire
5. Plan the follow-up sequence maintaining frame control (no desperate check-ins)

## Output Format

```yaml
sales_presentation:
  product: "{name}"
  buyer: "{profile}"
  deal_size: ""
  frame_strategy:
    buyer_default_frames: ["{identified frames}"]
    counter_frames:
      - buyer_frame: "{power/analyst/time}"
        counter: "{prize/intrigue/constraint}"
        technique: "{specific move}"
    status_play: "{first 60 seconds strategy}"
  strong_structure:
    set_frame: "{bold opening statement}"
    tell_story: "{client problem narrative}"
    reveal_intrigue: "{unique insight}"
    offer_prize: "{exclusive proof}"
    hookpoint: "{the moment they lean in}"
    get_deal: "{clear ask and next steps}"
  hot_cognition_triggers:
    - trigger: "{type}"
      content: "{what to say/show}"
      timing: "{when in the presentation}"
  objection_prevention:
    - objection: "{anticipated concern}"
      preemptive_address: "{how it's handled in the flow}"
  close_design:
    primary_ask: "{specific next step}"
    push_pull: "{desire + willingness to walk}"
    next_step_cascade: "{if yes, then what}"
    follow_up_plan: "{frame-controlled sequence}"
```

## Veto Conditions

- **NEVER** open with a company overview slide — the buyer does not care yet
- **NEVER** enter the analyst frame willingly — data follows desire, not the other way
- **NEVER** chase after the meeting — every follow-up must maintain prize frame
- **NEVER** let a gatekeeper set your status — establish frame before the meeting starts
- **NEVER** present features without frame — features in an analyst frame become commodities

## Completion Criteria

- [ ] Buyer frames analyzed and counter-frames designed
- [ ] STRONG method applied to presentation flow
- [ ] Hot cognition triggers timed to decision moments
- [ ] Top 5 objections preemptively addressed within presentation
- [ ] Close designed with push-pull dynamics
- [ ] Follow-up sequence maintains frame control
