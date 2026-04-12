---
task: "movement-building-narrative"
responsavel: "marshall-ganz"
responsavel_type: "agent"
atomic_layer: true
elicit: true
Entrada:
  - "Movement cause and vision"
  - "Community profile and context"
Saida:
  - "Complete movement narrative using Public Narrative (Story of Self, Us, Now)"
Checklist:
  - "[ ] Story of Self crafted with authentic challenge-choice-outcome"
  - "[ ] Story of Us builds shared identity and values"
  - "[ ] Story of Now creates urgent call to action"
---

# Task: Build Movement Narrative

**Task ID:** NARR-045
**Version:** 1.0.0
**Command:** `*movement-building-narrative`
**Agent:** Marshall Ganz (marshall-ganz)
**Purpose:** Build a movement-building narrative using Ganz's Public Narrative framework, creating the Story of Self, Us, and Now that mobilizes people to action.

---

## Inputs

| Input | Source | Required |
|-------|--------|----------|
| `cause` | The movement's purpose and vision | YES |
| `leader_story` | Leader's personal connection to the cause | YES |
| `community` | Who the movement aims to mobilize | YES |
| `urgency` | Why action is needed NOW | YES |
| `desired_action` | What people should DO (specific, achievable) | PREFERRED |
| `opposition` | What forces resist the movement | NO |

## Execution Phases

### Phase 1: Craft the Story of Self

1. The Story of Self answers: "Why am I called to this cause?"
2. Identify the leader's **challenge moment** — the experience that made this cause personal
3. Map the **choice** — what did the leader decide to do in that moment?
4. Articulate the **outcome** — what happened as a result, and what was learned?
5. Identify the **values** revealed by this story — courage, justice, compassion, dignity
6. Ensure vulnerability: the story must show a real person, not a perfect leader
7. Test: Does this story make others think "I see myself in you"?

### Phase 2: Craft the Story of Us

1. The Story of Us answers: "What values do we share? What community are we?"
2. Identify the **shared experience** — what do community members have in common?
3. Find the **shared challenge** — what obstacle does the community face together?
4. Articulate the **shared values** — what does this community believe is right?
5. Create the "founding story" of the community — the moment that defines who "we" are
6. Design the **identity statement** — "We are the people who..."
7. Include a **celebration moment** — a time when the community already demonstrated its values
8. Test: Does this story make individuals feel they belong to something larger?

### Phase 3: Craft the Story of Now

1. The Story of Now answers: "What urgent challenge demands action right now?"
2. Identify the **urgent threat** — what will be lost if action is not taken?
3. Articulate the **hope** — what is possible if the community acts together?
4. Present the **choice** — the specific action the community can take NOW
5. Make the choice binary and immediate — "We can either X or we can Y. I choose X."
6. Design the **first step** — something everyone can do TODAY (not next month)
7. Create the **accountability moment** — how will people commit publicly?
8. Test: Does this story create the feeling "I must act, and I must act now"?

### Phase 4: Weave Self, Us, Now Together

1. Practice the transition from Self → Us: "My story is not just mine. It's OUR story."
2. Practice the transition from Us → Now: "We've always been people who X. And right now, X is under threat."
3. Ensure the values thread is consistent: the same value drives Self, connects Us, and demands Now
4. Time the complete narrative: Self (2-3 min), Us (2-3 min), Now (2-3 min)
5. Design the "crescendo" — emotional intensity should build from Self (personal) through Us (collective) to Now (urgent)

### Phase 5: Design the Movement Architecture

1. Create the **narrative training** — how do others learn to tell their own Story of Self?
2. Design **house meetings** format — small groups where community members practice the narrative
3. Build the **story collection** system — gathering Stories of Self from community members
4. Create the **public narrative** for different contexts:
   - Rally/protest version (high energy, call to action)
   - One-on-one version (intimate, relationship-building)
   - Media version (soundbite-optimized, quotable)
   - Written version (social media, email, letter)
5. Design the **narrative cascade** — how the story spreads from leader to organizers to community

## Output Format

```yaml
movement_narrative:
  cause: "{the movement's purpose}"
  story_of_self:
    challenge: "{the personal experience}"
    choice: "{what the leader decided}"
    outcome: "{what resulted}"
    values_revealed: ["{courage, justice, etc}"]
    narrative: "{the complete story (2-3 min spoken)}"
  story_of_us:
    shared_experience: "{what we have in common}"
    shared_challenge: "{what we face together}"
    shared_values: ["{what we believe}"]
    identity_statement: "We are the people who..."
    founding_moment: "{the story that defines us}"
    narrative: "{the complete story (2-3 min spoken)}"
  story_of_now:
    urgent_threat: "{what will be lost}"
    hope: "{what is possible}"
    choice: "{the binary decision}"
    first_step: "{what to do TODAY}"
    accountability: "{how to commit publicly}"
    narrative: "{the complete story (2-3 min spoken)}"
  woven_narrative: "{full Self → Us → Now narrative}"
  movement_architecture:
    narrative_training: "{how others learn to tell their story}"
    house_meeting_format: "{small group practice design}"
    versions:
      rally: "{high-energy version}"
      one_on_one: "{intimate version}"
      media: "{soundbite version}"
      written: "{social/email version}"
    cascade: "{how the narrative spreads}"
```

## Veto Conditions

- **NEVER** craft a Story of Self without genuine vulnerability — sanitized stories do not move people
- **NEVER** skip the Story of Us — without shared identity, there is no community, only individuals
- **NEVER** present the Story of Now without a specific, immediate action — urgency without action is anxiety
- **NEVER** tell people WHAT to think — show them WHY to care and let them choose to act

## Completion Criteria

- [ ] Story of Self crafted with authentic challenge-choice-outcome
- [ ] Story of Us builds shared identity with founding moment and values
- [ ] Story of Now creates urgency with specific immediate action
- [ ] All three stories woven together with consistent values thread
- [ ] Narrative versions created for different contexts (rally, 1:1, media, written)
- [ ] Movement architecture designed for narrative cascade
