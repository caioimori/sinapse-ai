---
task: "founder-story-craft"
responsavel: "kindra-hall"
responsavel_type: "agent"
atomic_layer: true
elicit: true
Entrada:
  - "Founder background and company context"
  - "Key moments in founding journey"
Saida:
  - "Compelling founder story crafted with vulnerability and strategic purpose"
Checklist:
  - "[ ] Founder story follows Normal → Explosion → New Normal arc"
  - "[ ] Vulnerability present without self-indulgence"
  - "[ ] Story bridges founder's 'why' to customer's 'why'"
---

# Task: Craft Founder Story

**Task ID:** NARR-036
**Version:** 1.0.0
**Command:** `*founder-story-craft`
**Agent:** Kindra Hall (kindra-hall)
**Purpose:** Craft a compelling founder story that builds trust and emotional connection by revealing the human behind the brand, using Hall's methodology.

---

## Inputs

| Input | Source | Required |
|-------|--------|----------|
| `founder_background` | Personal history, career, motivations | YES |
| `founding_moment` | What triggered the creation of the company | YES |
| `company_context` | What the company does and who it serves | YES |
| `struggles` | Difficulties faced before and during founding | PREFERRED |
| `current_state` | Where the company is today | PREFERRED |

## Execution Phases

### Phase 1: Find the Defining Moment

1. Interview/analyze the founder's life for the catalytic moment — when did everything change?
2. Look for the "explosion" — not the business plan, but the EMOTIONAL breaking point
3. Identify the pattern of three:
   - What the founder WAS doing (Normal)
   - What happened that made it IMPOSSIBLE to continue (Explosion)
   - What they BECAME by starting this company (New Normal)
4. Find the "unlikely" detail — the thing that makes this story uniquely theirs
5. Identify the vulnerability — the fear, doubt, failure, or struggle that makes them human

### Phase 2: Structure the Founder Story

1. **Normal (The Before):**
   - Paint the founder's world before the company with specific, sensory details
   - Show what was good about it — what they were giving up
   - Establish their competence subtly — credibility without bragging
   - Include a hint of dissatisfaction or calling
2. **Explosion (The Catalyst):**
   - The specific moment that changed everything (day, place, feeling)
   - Make this visceral — what did they see, hear, feel?
   - Show the stakes — what was at risk?
   - Include the "almost didn't" moment — they nearly chose the safe path
3. **New Normal (The After):**
   - The decision to act and its immediate aftermath
   - Early struggles that tested the commitment
   - The first sign it was going to work
   - Where they are now — but framed through what they learned, not what they achieved

### Phase 3: Calibrate Vulnerability

1. Vulnerability builds trust — but must be calibrated:
   - Too little: Sounds like a press release (no connection)
   - Too much: Sounds like therapy (uncomfortable)
   - Just right: Sounds like a conversation with a wise friend (trust)
2. Include ONE significant failure or fear — no more, no less
3. Show the founder as a real person, not a superhero
4. Ensure the vulnerability serves the audience: "Here's what I learned that helps YOU"
5. Test: Would the founder be comfortable sharing this at a dinner party?

### Phase 4: Bridge Founder to Customer

1. Identify the shared "why" — what the founder cares about that the customer also cares about
2. Show how the founder's struggle mirrors the customer's struggle
3. Create the "I built this for you" moment — the bridge from founder pain to customer solution
4. Ensure the founder story ENDS with the customer, not the founder
5. The last paragraph should implicitly say: "And that's why this exists for you"

### Phase 5: Create Deployment Versions

1. **Keynote version** (5-8 minutes) — Full emotional arc with pauses and audience connection
2. **About page version** (400-600 words) — Web-optimized with scannable structure
3. **Elevator version** (60 seconds) — The core arc compressed to its essence
4. **Social media version** (280 characters) — The single most powerful sentence
5. **Bio version** (100 words) — Third-person with the defining moment woven in
6. **Podcast/interview version** — Key beats and prompts for when the founder is interviewed

## Output Format

```yaml
founder_story:
  founder: "{name}"
  defining_moment: "{the explosion}"
  narrative:
    normal: "{before — specific and sensory}"
    explosion: "{catalyst — visceral and stakes-driven}"
    new_normal: "{after — lessons and current state}"
  vulnerability_point: "{the honest struggle that builds trust}"
  founder_customer_bridge: "{shared why — their pain → your solution}"
  unlikely_detail: "{the unique element that makes this memorable}"
  versions:
    keynote: "{5-8 minute version}"
    about_page: "{400-600 words}"
    elevator: "{60-second version}"
    social: "{one powerful sentence}"
    bio: "{100-word third-person version}"
    interview_beats: ["{key moments to hit when telling live}"]
  deployment:
    website: "{where and how}"
    pitch_deck: "{which slide}"
    social_media: "{which platforms, which version}"
    media_kit: "{version for press}"
```

## Veto Conditions

- **NEVER** write a founder story that reads like a resume — chronology is not story
- **NEVER** skip the vulnerability — perfect founders are not trusted
- **NEVER** end with the founder — end with the customer and the mission
- **NEVER** fabricate or embellish the founding moment — authenticity is the entire point

## Completion Criteria

- [ ] Defining moment identified with specific, sensory detail
- [ ] Story follows Normal → Explosion → New Normal arc
- [ ] Vulnerability calibrated (present but not self-indulgent)
- [ ] Founder-to-customer bridge created
- [ ] All deployment versions written (keynote, about page, elevator, social, bio)
- [ ] Interview beats documented for live storytelling situations
