---
task: "partnership-pitch-narrative"
responsavel: "oren-klaff"
responsavel_type: "agent"
atomic_layer: true
elicit: true
Entrada:
  - "Partnership opportunity details"
  - "Both parties' profiles and motivations"
Saida:
  - "Partnership pitch narrative with status alignment and mutual frame design"
Checklist:
  - "[ ] Status dynamics mapped for both parties"
  - "[ ] Mutual prize framing established (both sides gain)"
  - "[ ] STRONG method adapted for collaborative rather than transactional pitch"
---

# Task: Partnership Pitch Narrative

**Task ID:** NARR-029
**Version:** 1.0.0
**Command:** `*partnership-pitch-narrative`
**Agent:** Oren Klaff (oren-klaff)
**Purpose:** Craft partnership proposals using Pitch Anything's frame control and status alignment, adapted for collaborative dynamics where both parties must see themselves as gaining.

---

## Inputs

| Input | Source | Required |
|-------|--------|----------|
| `your_organization` | Company, strengths, assets, goals | YES |
| `target_partner` | Partner company, strengths, needs, goals | YES |
| `partnership_type` | Co-marketing, technology, distribution, strategic alliance | YES |
| `mutual_benefit` | What each party gains from the partnership | YES |
| `context` | How the opportunity arose | PREFERRED |
| `decision_makers` | Who approves on each side | NO |

## Execution Phases

### Phase 1: Map Status Dynamics

1. Assess relative status — who needs whom more? (be honest)
2. Identify power asymmetries (brand size, market position, resource disparity)
3. Map each party's "prize" — what unique value does each bring that the other cannot get elsewhere?
4. Identify potential frame conflicts: who will try to set the terms?
5. Design status equilibrium — partnerships require peer-level framing, not dominance

### Phase 2: Design Mutual Prize Frame

1. Unlike sales, partnership pitches require BOTH parties to feel like the prize
2. Articulate your unique prize: "What we bring that nobody else can"
3. Acknowledge their unique prize: "What you bring that we value specifically"
4. Design the "together" frame: "What becomes possible only through this combination"
5. Create the "exclusivity" angle — why this partnership, why now, why these two
6. Avoid the "we need you" trap — express desire without neediness

### Phase 3: Apply STRONG for Partnerships

1. **Set the Frame** — Open with a market observation that makes the partnership obvious
2. **Tell the Story** — Narrative of what both organizations have been building toward
3. **Reveal the Intrigue** — The specific opportunity that exists ONLY if both parties act together
4. **Offer the Prize** — Your unique assets, results, and capabilities as contribution
5. **Nail the Hookpoint** — The vision moment: what this partnership looks like at full potential
6. **Get the Deal** — Propose a specific, low-risk first step (pilot, co-project, trial)

### Phase 4: Design Collaboration Narrative

1. Create a "shared enemy" — the market problem neither can solve alone
2. Design the origin story of the partnership: "How we came to see this opportunity"
3. Build the "future state" narrative: what the partnership achieves in 6, 12, 24 months
4. Identify and address the "what could go wrong" openly — transparency builds trust
5. Design mutual accountability language — partner, not vendor-client

### Phase 5: Structure the Proposal

1. Executive summary using partnership ABT (And we each have X, But the market needs Y, Therefore together we Z)
2. Mutual value map — clear visual of what each party contributes and receives
3. Proposed structure — governance, decision-making, IP, revenue split
4. Pilot program design — low-risk first engagement that proves the concept
5. Success metrics — how both parties will measure whether it is working
6. Clear next steps — specific actions, owners, timeline

## Output Format

```yaml
partnership_pitch:
  your_org: "{name}"
  target_partner: "{name}"
  partnership_type: "{type}"
  status_dynamics:
    relative_status: "{assessment}"
    your_prize: "{unique value you bring}"
    their_prize: "{unique value they bring}"
    combined_prize: "{what only this partnership creates}"
  frame_strategy:
    mutual_prize: "{how both sides feel valued}"
    exclusivity: "{why this combination is special}"
    shared_enemy: "{market problem neither can solve alone}"
  strong_narrative:
    set_frame: "{market observation}"
    tell_story: "{convergence narrative}"
    intrigue: "{unique opportunity}"
    prize: "{your contribution}"
    hookpoint: "{full potential vision}"
    get_deal: "{proposed first step}"
  proposal_structure:
    executive_summary: "{partnership ABT}"
    mutual_value_map: "{contributions and benefits}"
    governance: "{decision-making framework}"
    pilot: "{low-risk first engagement}"
    success_metrics: ["{how to measure success}"]
    next_steps: ["{specific actions and owners}"]
```

## Veto Conditions

- **NEVER** pitch a partnership as if pitching a sale — the dynamic is peer, not buyer-seller
- **NEVER** downplay your own value to seem accommodating — both parties must feel the prize
- **NEVER** propose big commitments first — start with a pilot that proves the concept
- **NEVER** ignore status asymmetry — address it directly or it undermines the partnership

## Completion Criteria

- [ ] Status dynamics honestly assessed and equilibrium designed
- [ ] Mutual prize frame established (both sides see unique value)
- [ ] STRONG method adapted for collaborative framing
- [ ] Proposal includes pilot program with low-risk first step
- [ ] Success metrics defined for both parties
- [ ] Clear next steps with specific actions and owners
