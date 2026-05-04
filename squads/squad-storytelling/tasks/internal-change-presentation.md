---
task: "internal-change-presentation"
responsavel: "nancy-duarte"
responsavel_type: "agent"
atomic_layer: true
elicit: true
Entrada:
  - "Change initiative details"
  - "Stakeholder profiles and resistance map"
Saida:
  - "Change management presentation with Sparkline and resistance navigation"
Checklist:
  - "[ ] What Is / What Could Be contrast addresses real employee concerns"
  - "[ ] Resistance points anticipated and narratively addressed"
  - "[ ] Call to action is specific and achievable for each audience segment"
---

# Task: Internal Change Presentation

**Task ID:** NARR-032
**Version:** 1.0.0
**Command:** `*internal-change-presentation`
**Agent:** Nancy Duarte (nancy-duarte)
**Purpose:** Design presentations for internal change management using Duarte's Sparkline, helping leaders navigate resistance and inspire adoption through narrative.

---

## Inputs

| Input | Source | Required |
|-------|--------|----------|
| `change_initiative` | What is changing (process, tool, structure, strategy) | YES |
| `why_now` | Trigger for the change | YES |
| `stakeholders` | Who is affected and how | YES |
| `expected_resistance` | Anticipated objections and fears | YES |
| `desired_outcome` | What success looks like post-change | PREFERRED |
| `timeline` | Implementation timeline | NO |

## Execution Phases

### Phase 1: Map the Emotional Landscape

1. Segment stakeholders by their relationship to the change:
   - Champions (excited, early adopters)
   - Fence-sitters (open but cautious)
   - Resistors (fearful, skeptical, or threatened)
2. For each segment, identify:
   - What they stand to gain from the change
   - What they stand to lose (real or perceived)
   - Their biggest fear about the change
   - What would make them advocates
3. Design narrative paths for each segment
4. Identify the "loss aversion" triggers — what feels like it is being taken away?

### Phase 2: Design the Change Sparkline

1. **What Is** — Acknowledge the current state HONESTLY (don't minimize what works)
2. **What Could Be** — Paint the future state with specificity (not vague "better")
3. **What Is (the cost)** — What happens if nothing changes (external threats, inefficiency)
4. **What Could Be (the gain)** — Specific benefits for employees, not just the organization
5. **What Is (the fear)** — Name the resistance openly: "I know some of you are thinking..."
6. **What Could Be (the support)** — Concrete support: training, timeline, resources
7. **Call to Adventure** — The specific ask: what each person can do THIS WEEK
8. **New Bliss** — The organization 6-12 months from now, told through an employee story

### Phase 3: Address Resistance Narratively

1. Name the resistance before the audience does — this disarms it
2. Use "I know... and..." framing:
   - "I know this feels like more work. And it will be, for the first 30 days. After that..."
3. Tell a story of someone who resisted similar change and came to embrace it
4. Acknowledge what is being lost — grief is real even in organizational change
5. Provide the "safety net" narrative — what happens if the change is harder than expected
6. Design the "permission to struggle" moment — normalize difficulty during transition

### Phase 4: Structure the Presentation

1. **Opening** — Start with a shared experience that everyone relates to
2. **The Burning Platform** — Why change is necessary (external or internal pressure)
3. **The Vision** — What the changed world looks like (specific, not abstract)
4. **The Resistance Moment** — "Here's what I'm hearing from many of you..."
5. **The Bridge** — How we get from here to there (plan, resources, support)
6. **The First Step** — One specific, achievable action everyone can take immediately
7. **The New Bliss** — Close with the story of what we will become

### Phase 5: Design Cascade Communications

1. Adapt the core presentation for different audiences:
   - Executive team: Focus on strategy and metrics
   - Middle management: Focus on their role as change agents
   - Front-line employees: Focus on daily impact and support
2. Create the "manager toolkit" — talking points for team-level conversations
3. Design the FAQ narrative — answers framed as stories, not corporate speak
4. Plan the follow-up communications cadence (updates that sustain the narrative)
5. Design the "quick win" announcement template for early successes

## Output Format

```yaml
change_presentation:
  initiative: "{what is changing}"
  why_now: "{trigger}"
  sparkline:
    - moment: "What Is — Current State"
      content: "{honest acknowledgment}"
      emotional_tone: "{shared recognition}"
    - moment: "What Could Be — Vision"
      content: "{specific future state}"
      emotional_tone: "{hope, possibility}"
    - moment: "What Is — Cost of Inaction"
      content: "{what happens if we don't change}"
      emotional_tone: "{urgency}"
    - moment: "What Could Be — Personal Benefit"
      content: "{what employees gain}"
      emotional_tone: "{desire}"
    - moment: "Resistance Acknowledged"
      content: "{named fears and responses}"
      emotional_tone: "{empathy, safety}"
    - moment: "The Bridge"
      content: "{plan and support}"
      emotional_tone: "{confidence}"
    - moment: "First Step"
      content: "{immediate action}"
      emotional_tone: "{empowerment}"
    - moment: "New Bliss"
      content: "{transformed organization story}"
      emotional_tone: "{inspiration}"
  resistance_strategy:
    - segment: "{stakeholder group}"
      fear: "{what they worry about}"
      narrative_response: "{how to address it}"
  cascade:
    executive: "{adapted message}"
    management: "{adapted message}"
    frontline: "{adapted message}"
  manager_toolkit: ["{talking points}"]
  follow_up_cadence: ["{communication schedule}"]
```

## Veto Conditions

- **NEVER** pretend the change is easy — people see through false optimism
- **NEVER** ignore resistance — unaddressed fears become underground sabotage
- **NEVER** make the presentation about the company's needs — frame it as employee benefit
- **NEVER** skip the first step — people need something concrete they can do NOW
- **NEVER** use corporate jargon — "synergies" and "alignment" create distance, not buy-in

## Completion Criteria

- [ ] Sparkline designed with honest What Is / aspirational What Could Be
- [ ] Resistance mapped by stakeholder segment and narratively addressed
- [ ] Presentation includes specific, achievable first step
- [ ] Cascade communications adapted for each audience level
- [ ] Manager toolkit created for team-level conversations
- [ ] Follow-up communication cadence planned
