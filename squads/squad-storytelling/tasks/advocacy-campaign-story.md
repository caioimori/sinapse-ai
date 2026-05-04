---
task: "advocacy-campaign-story"
responsavel: "marshall-ganz"
responsavel_type: "agent"
atomic_layer: true
elicit: true
Entrada:
  - "Advocacy issue and campaign goals"
  - "Target audience and decision-makers"
Saida:
  - "Complete advocacy campaign narrative strategy using Public Narrative"
Checklist:
  - "[ ] Campaign narrative built on Public Narrative (Self, Us, Now)"
  - "[ ] Target audiences mapped with tailored narrative approaches"
  - "[ ] Escalation narrative designed from awareness to action"
---

# Task: Design Advocacy Campaign Narrative

**Task ID:** NARR-046
**Version:** 1.0.0
**Command:** `*advocacy-campaign-story`
**Agent:** Marshall Ganz (marshall-ganz)
**Purpose:** Design the narrative strategy for an advocacy campaign using Ganz's Public Narrative methodology, creating stories that move people from awareness to organized action.

---

## Inputs

| Input | Source | Required |
|-------|--------|----------|
| `issue` | The advocacy cause or policy goal | YES |
| `campaign_goals` | What the campaign aims to achieve | YES |
| `target_audiences` | Who needs to be persuaded or mobilized | YES |
| `decision_makers` | Who has the power to create change | YES |
| `opposition` | Who or what resists the change | PREFERRED |
| `timeline` | Campaign duration and key milestones | NO |

## Execution Phases

### Phase 1: Map the Narrative Landscape

1. Identify the dominant narrative — how is this issue currently understood by the public?
2. Identify the opposition's narrative — what story do they tell about why things are fine?
3. Find the narrative gap — what truth is not being told?
4. Map the emotional landscape:
   - What do supporters feel? (anger, hope, urgency)
   - What do the undecided feel? (confusion, apathy, fear)
   - What do opponents feel? (threat, defensiveness, self-interest)
5. Define the "counter-narrative" — the story the campaign will tell to replace the dominant one

### Phase 2: Build the Campaign's Public Narrative

1. **Story of Self (for campaign leaders and spokespeople):**
   - Why does the leader care about this issue personally?
   - What experience made this issue impossible to ignore?
   - What values drive their commitment?
2. **Story of Us (for the community being mobilized):**
   - Who are "we" in this campaign?
   - What shared experience binds us?
   - What have "we" accomplished before that shows our power?
3. **Story of Now (for the immediate campaign):**
   - What is the specific threat or opportunity RIGHT NOW?
   - What is the specific ask? (policy change, public commitment, resource allocation)
   - What is the timeline? Why must we act before [date]?

### Phase 3: Create Audience-Specific Narratives

1. **For Supporters** — Energize and organize:
   - Emphasis: Story of Us (you belong, we are powerful together)
   - CTA: Specific organizing actions (attend, recruit, donate, speak up)
2. **For the Undecided** — Persuade and engage:
   - Emphasis: Story of Self (human stories that create empathy)
   - CTA: Low-barrier first steps (sign, share, learn)
3. **For Decision-Makers** — Pressure and legitimize:
   - Emphasis: Story of Now (political cost of inaction, constituent demand)
   - CTA: Specific policy or decision request
4. **For Media** — Frame and amplify:
   - Emphasis: Counter-narrative with quotable soundbites
   - CTA: Cover the story, interview affected people

### Phase 4: Design the Escalation Narrative

1. **Phase 1: Awareness** — "Did you know...?" (surprising facts, human stories)
2. **Phase 2: Empathy** — "This is happening to people like us" (Story of Self from affected people)
3. **Phase 3: Outrage** — "This is not acceptable" (moral framing, values violation)
4. **Phase 4: Hope** — "Change is possible because..." (precedent, power, plan)
5. **Phase 5: Action** — "Here's exactly what to do" (specific, immediate, collective)
6. Map each phase to campaign timeline and milestones
7. Design the "tipping point" narrative — the moment awareness becomes movement

### Phase 5: Build the Storyteller Army

1. Train 10-20 "story leaders" — people who can tell their own Story of Self about the issue
2. Create the "1-minute testimony" format — for public hearings, media, and social media
3. Design the "story circle" process — small groups where people practice telling their story
4. Build a story collection system — documented testimonies ready for deployment
5. Create media training for spokespeople — how to stay in the campaign narrative under pressure
6. Design the digital storytelling toolkit — templates for social media, video, email

## Output Format

```yaml
advocacy_campaign_narrative:
  issue: "{the cause}"
  campaign_goals: ["{specific goals}"]
  narrative_landscape:
    dominant_narrative: "{how the issue is currently understood}"
    opposition_narrative: "{the other side's story}"
    counter_narrative: "{the story we will tell}"
    narrative_gap: "{the untold truth}"
  public_narrative:
    story_of_self:
      leader: "{who}"
      challenge: "{personal experience}"
      choice: "{what they did}"
      values: ["{revealed values}"]
    story_of_us:
      community: "{who we are}"
      shared_experience: "{what binds us}"
      past_victory: "{proof of our power}"
    story_of_now:
      threat: "{what we'll lose}"
      ask: "{specific demand}"
      timeline: "{why now}"
  audience_narratives:
    supporters: {emphasis, cta, key_message}
    undecided: {emphasis, cta, key_message}
    decision_makers: {emphasis, cta, key_message}
    media: {emphasis, cta, key_message}
  escalation:
    - phase: "{awareness/empathy/outrage/hope/action}"
      narrative_focus: "{what stories to tell}"
      timeline: "{when}"
      milestones: ["{campaign events}"]
  storyteller_army:
    training_plan: "{how to prepare story leaders}"
    testimony_format: "{1-minute structure}"
    story_circle: "{small group process}"
    digital_toolkit: "{templates and tools}"
```

## Veto Conditions

- **NEVER** build an advocacy narrative on anger alone — without hope, anger burns out
- **NEVER** skip the Story of Us — individual stories without collective identity do not create movements
- **NEVER** present a vague ask — "raise awareness" is not an action; "call your representative by Friday" is
- **NEVER** ignore the opposition's narrative — if you don't counter it, it wins by default

## Completion Criteria

- [ ] Narrative landscape mapped (dominant, opposition, counter-narrative)
- [ ] Complete Public Narrative built (Self, Us, Now)
- [ ] Audience-specific narratives created for 4 audiences
- [ ] Escalation narrative designed with phases and milestones
- [ ] Storyteller army training plan created
- [ ] Digital storytelling toolkit designed
