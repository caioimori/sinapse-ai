---
task: "organizational-story-of-us"
responsavel: "marshall-ganz"
responsavel_type: "agent"
atomic_layer: true
elicit: true
Entrada:
  - "Organization context, history, and values"
  - "Current cultural challenges or aspirations"
Saida:
  - "Complete organizational Story of Us with shared identity narrative"
Checklist:
  - "[ ] Shared values identified from actual organizational behavior, not just posters"
  - "[ ] Founding story and defining moments woven into collective narrative"
  - "[ ] Story of Us adaptable for onboarding, all-hands, and external communication"
---

# Task: Create Organizational Story of Us

**Task ID:** NARR-047
**Version:** 1.0.0
**Command:** `*organizational-story-of-us`
**Agent:** Marshall Ganz (marshall-ganz)
**Purpose:** Create a powerful organizational "Story of Us" that builds shared identity, reinforces values, and creates a sense of belonging and collective purpose.

---

## Inputs

| Input | Source | Required |
|-------|--------|----------|
| `organization` | Company, non-profit, team, or group | YES |
| `history` | Key milestones, founding story, pivotal moments | YES |
| `values` | Stated and lived values | YES |
| `culture_challenges` | Current cultural issues or aspirations | PREFERRED |
| `stories_from_members` | Anecdotes from employees/members | PREFERRED |
| `external_perception` | How outsiders see the organization | NO |

## Execution Phases

### Phase 1: Discover the Lived Values

1. Distinguish between "poster values" (what's on the wall) and "lived values" (what people actually do)
2. Collect stories that reveal what the organization ACTUALLY values:
   - "Tell me about a time someone went above and beyond here"
   - "What would someone be fired for, even if they were a top performer?"
   - "What gets celebrated here? What gets ignored?"
3. Identify the 3-5 values that emerge from STORIES, not from mission statements
4. Find the tension between stated and lived values — this is where growth happens
5. Name the organization's "sacred" behaviors — things that are non-negotiable in the culture

### Phase 2: Identify Defining Moments

1. **Founding moment** — The origin story (why this organization was created)
2. **Crucible moment** — A crisis that revealed who the organization truly is
3. **Victory moment** — An achievement that proved the collective power of the group
4. **Values moment** — A time when the organization chose values over convenience/profit
5. **Welcome moment** — The story new members most commonly hear (the "initiation" narrative)
6. For each moment, apply Ganz's challenge-choice-outcome framework:
   - What challenge did the organization face?
   - What choice did they make?
   - What did they learn about themselves?

### Phase 3: Craft the Story of Us

1. **Who are we?** — Name the collective identity: "We are the people who..."
2. **Where did we come from?** — The founding story as shared origin
3. **What have we survived?** — The crucible that forged our identity
4. **What do we stand for?** — Values expressed through stories, not statements
5. **What have we achieved together?** — Evidence of our collective power
6. **What makes us different?** — The quality that is ours and no one else's
7. **Where are we going?** — The shared aspiration that pulls us forward
8. Weave these elements into a 5-minute narrative that can be told by any member

### Phase 4: Create Ritual and Reinforcement

1. **Onboarding ritual** — How new members hear the Story of Us in their first week
2. **All-hands storytelling** — A recurring moment where members share stories that reinforce the "Us"
3. **Recognition framework** — How achievements are celebrated through the narrative lens
4. **Conflict resolution narrative** — "When we disagree, we..." (values-based resolution)
5. **Departure ritual** — How members who leave are honored and their stories preserved
6. Design the "annual story" — each year's defining moment added to the collective narrative

### Phase 5: Create Adaptable Versions

1. **Onboarding version** (10 minutes) — Full narrative with all defining moments, told with warmth
2. **All-hands version** (3 minutes) — Core identity + current challenge + call to action
3. **External version** (2 minutes) — For clients, partners, and recruits
4. **Crisis version** (1 minute) — "Remember who we are" reminder during difficult times
5. **Individual prompt** — "In my Story of Self within our Story of Us, I..."
6. **Social media version** — The single most powerful paragraph that captures "Us"

### Phase 6: Design Story of Us Evolution

1. The Story of Us must evolve — it is alive, not a historical document
2. Create a "story council" — 3-5 members who steward the narrative
3. Design the quarterly "story check" — is the Story of Us still true? What has changed?
4. Plan how new defining moments are added to the narrative
5. Design how the Story of Us accommodates growth (new teams, acquisitions, pivots)

## Output Format

```yaml
organizational_story_of_us:
  organization: "{name}"
  lived_values: ["{values from stories, not posters}"]
  defining_moments:
    founding: "{challenge-choice-outcome}"
    crucible: "{challenge-choice-outcome}"
    victory: "{challenge-choice-outcome}"
    values: "{challenge-choice-outcome}"
    welcome: "{the story new members hear}"
  narrative:
    who_we_are: "We are the people who..."
    where_we_came_from: "{founding story}"
    what_we_survived: "{crucible story}"
    what_we_stand_for: "{values through stories}"
    what_we_achieved: "{collective victory}"
    what_makes_us_different: "{unique quality}"
    where_we_are_going: "{shared aspiration}"
    full_narrative: "{5-minute woven Story of Us}"
  rituals:
    onboarding: "{how new members hear the story}"
    all_hands: "{recurring storytelling moment}"
    recognition: "{how achievements are narrated}"
    conflict: "{values-based resolution narrative}"
    departure: "{how departing members are honored}"
    annual_story: "{yearly defining moment addition}"
  versions:
    onboarding: "{10-minute version}"
    all_hands: "{3-minute version}"
    external: "{2-minute version}"
    crisis: "{1-minute version}"
    social_media: "{single paragraph}"
  governance:
    story_council: "{who stewards the narrative}"
    quarterly_check: "{is the story still true?}"
    evolution_plan: "{how the narrative grows}"
```

## Veto Conditions

- **NEVER** build the Story of Us from mission statements alone — it must come from lived experience
- **NEVER** sanitize the crucible moment — the hardship is what makes the identity real
- **NEVER** create a static narrative — the Story of Us must evolve with the organization
- **NEVER** exclude voices — the Story of Us must reflect the whole organization, not just leadership

## Completion Criteria

- [ ] Lived values discovered through stories (not just stated values)
- [ ] 5 defining moments identified with challenge-choice-outcome
- [ ] Full Story of Us narrative crafted (5-minute version)
- [ ] Rituals designed for reinforcement (onboarding, all-hands, recognition)
- [ ] Adaptable versions created (onboarding, all-hands, external, crisis, social)
- [ ] Story governance established with evolution plan
