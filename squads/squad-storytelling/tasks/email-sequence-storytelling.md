---
task: "email-sequence-storytelling"
responsavel: "park-howell"
responsavel_type: "agent"
atomic_layer: true
elicit: true
Entrada:
  - "Brand context and BrandScript (or inputs to create one)"
  - "Email sequence goal and audience"
Saida:
  - "Complete email sequence using SB7 storytelling framework"
Checklist:
  - "[ ] Each email follows ABT structure"
  - "[ ] Sequence maps to SB7 framework progression"
  - "[ ] Open loops maintain engagement across emails"
---

# Task: Email Sequence Storytelling

**Task ID:** NARR-039
**Version:** 1.0.0
**Command:** `*email-sequence-storytelling`
**Agent:** Park Howell (park-howell)
**Purpose:** Design email sequences that use the ABT framework and SB7 principles to tell a progressive story, turning subscribers into engaged customers.

---

## Inputs

| Input | Source | Required |
|-------|--------|----------|
| `brand_context` | Brand, product, BrandScript | YES |
| `sequence_goal` | Welcome, nurture, launch, re-engagement, onboarding | YES |
| `audience` | Who receives the sequence | YES |
| `email_count` | Number of emails in sequence | PREFERRED (default: 7) |
| `frequency` | Sending cadence | NO (default: every 2-3 days) |

## Execution Phases

### Phase 1: Map Sequence to SB7 Story Arc

1. Each email corresponds to an SB7 element, creating a progressive narrative:
   - Email 1: **Character** — "We see you. Here's what we know about your world."
   - Email 2: **Problem** — "Here's what's really going on (external + internal problem)"
   - Email 3: **Guide** — "We've been where you are. Here's how we can help."
   - Email 4: **Plan** — "Here are the 3 simple steps."
   - Email 5: **Call to Action** — "Here's what to do next."
   - Email 6: **Failure** — "Here's what happens if you don't act."
   - Email 7: **Success** — "Here's what life looks like on the other side."
2. Adjust mapping based on sequence type (launch sequences front-load urgency)
3. Ensure each email can stand alone while building the larger arc

### Phase 2: Write Each Email with ABT

For each email, apply the ABT (And, But, Therefore) structure:
1. **Subject line** — Must create an open loop or promise a revelation
2. **Opening (And)** — Establish shared context, rapport, or continue previous email's story
3. **Conflict (But)** — Introduce tension, problem, or challenge relevant to this email's SB7 element
4. **Resolution (Therefore)** — Provide insight, action step, or preview of next email
5. **CTA** — One clear action per email (reply, click, read, share)
6. **Open loop** — Final line that creates anticipation for the next email

### Phase 3: Design Open Loop Architecture

1. Each email opens a loop that the NEXT email closes (maintaining binge-readability)
2. Types of open loops:
   - Story cliffhanger: "Tomorrow I'll tell you what happened next..."
   - Question hook: "But there's one thing most people get wrong about this. I'll reveal it next time."
   - Promise hook: "In the next email, I'll share the exact framework that..."
3. Map the loop chain: Email 1 opens loop A → Email 2 closes A, opens B → etc.
4. The final email closes all remaining loops and resolves the narrative

### Phase 4: Optimize for Engagement

1. Write 3 subject line variations per email (for A/B testing)
2. Keep each email focused on ONE idea (the SB7 element it represents)
3. Use "you" more than "we" — the subscriber is the character
4. Include one story per email — personal anecdote, case study, or analogy
5. Design the P.S. line as a secondary hook (highest-read element after subject line)
6. Optimize preview text to complement the subject line

### Phase 5: Create Sequence Mechanics

1. Define trigger/enrollment criteria (when does someone enter this sequence?)
2. Design exit conditions (what action moves them to the next sequence?)
3. Create segmentation points — where behavior splits the audience
4. Plan the "rescue" emails — what to send if someone stops opening
5. Design the handoff — where this sequence connects to the next one
6. Document A/B test plan for subject lines and CTAs

## Output Format

```yaml
email_sequence:
  name: "{sequence name}"
  goal: "{what the sequence achieves}"
  audience: "{who receives it}"
  frequency: "{cadence}"
  sb7_mapping:
    - email: 1
      sb7_element: "Character"
      subject_line: "{primary}"
      subject_variations: ["{alt 1}", "{alt 2}"]
      abt:
        and: "{shared context}"
        but: "{tension}"
        therefore: "{insight/action}"
      story: "{email's narrative element}"
      cta: "{one clear action}"
      open_loop: "{hook for next email}"
      ps: "{secondary hook}"
    # ... all emails
  loop_architecture:
    - email: 1
      opens: "{loop A}"
    - email: 2
      closes: "{loop A}"
      opens: "{loop B}"
  mechanics:
    trigger: "{enrollment criteria}"
    exit: "{success condition}"
    segmentation_points: ["{where behavior splits}"]
    rescue_emails: "{re-engagement plan}"
    handoff: "{next sequence connection}"
  ab_test_plan: ["{what to test}"]
```

## Veto Conditions

- **NEVER** send emails without a narrative arc — isolated emails are noise
- **NEVER** make every email a sales pitch — the sequence is a STORY, not a sales funnel
- **NEVER** write subject lines that don't connect to the email body — clickbait destroys trust
- **NEVER** skip the open loop — without anticipation, subscribers stop opening

## Completion Criteria

- [ ] Complete sequence mapped to SB7 elements
- [ ] Each email structured with ABT and clear CTA
- [ ] Open loop architecture chains emails together
- [ ] Subject line variations provided for A/B testing
- [ ] Sequence mechanics documented (triggers, exits, segmentation)
- [ ] Each email stands alone while contributing to the arc
