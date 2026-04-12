---
task: "spontaneous-presentation-skills"
responsavel: "keith-johnstone"
responsavel_type: "agent"
atomic_layer: true
elicit: true
Entrada:
  - "Presentation context (meetings, Q&A, impromptu talks)"
  - "Speaker profile and comfort level"
Saida:
  - "Improv-based presentation skills toolkit with exercises and frameworks"
Checklist:
  - "[ ] Core improv techniques adapted for business presentations"
  - "[ ] Fear and blocking patterns identified with counter-techniques"
  - "[ ] Practice exercises designed for progressive skill building"
---

# Task: Spontaneous Presentation Skills

**Task ID:** NARR-044
**Version:** 1.0.0
**Command:** `*spontaneous-presentation-skills`
**Agent:** Keith Johnstone (keith-johnstone)
**Purpose:** Develop improvisational presentation skills using Johnstone's techniques, enabling speakers to handle Q&A, impromptu talks, and unscripted moments with confidence and authenticity.

---

## Inputs

| Input | Source | Required |
|-------|--------|----------|
| `speaker_profile` | Role, experience level, comfort with public speaking | YES |
| `presentation_contexts` | Where they need to speak (meetings, stage, Q&A, media) | YES |
| `challenges` | What they struggle with (freezing, rambling, nervousness) | YES |
| `goals` | What improved skill looks like for them | PREFERRED |
| `team_or_individual` | Training one person or a group | NO |

## Execution Phases

### Phase 1: Diagnose Blocking Patterns

1. Identify the speaker's primary "blocks" (Johnstone's concept of self-censorship):
   - **Originality block**: Trying to be clever instead of obvious (kills spontaneity)
   - **Judgment block**: Fear of saying the wrong thing (causes freezing)
   - **Status block**: Trying to maintain high status at all times (prevents vulnerability)
   - **Control block**: Over-preparing to prevent surprises (kills authenticity)
2. Map the speaker's fear hierarchy — what presentation situations cause the most anxiety?
3. Identify their "comfort moves" — what they default to when nervous (filler words, rushing, humor deflection)
4. Assess their natural status tendency — do they default to high or low status?

### Phase 2: Teach Core Improv Techniques for Presentations

1. **"Be Obvious"** — Johnstone's #1 rule: say the first thing that comes to mind, not the clever thing
   - In presentations: Answer questions directly before elaborating
   - Exercise: Practice giving one-sentence answers before expanding
2. **"Yes, And"** — Accept what's given and build on it
   - In presentations: Acknowledge the question before redirecting
   - Exercise: Take hostile questions and "Yes, And" them into your message
3. **"Make Your Partner Look Good"** — Focus on the audience, not yourself
   - In presentations: Frame answers in terms of audience benefit
   - Exercise: Reframe every answer to start with "What matters for you is..."
4. **Status Flexibility** — Move between high and low status intentionally
   - In presentations: Use low status to connect ("I don't have all the answers")
   - Use high status to lead ("What I know for certain is...")
5. **"Fail Cheerfully"** — Treat mistakes as gifts
   - In presentations: When you stumble, acknowledge it and move on
   - Exercise: Practice intentionally "forgetting" and recovering

### Phase 3: Build Spontaneous Response Frameworks

1. **The Triangle Response** — For unexpected questions:
   - Point 1: Acknowledge the question (Yes, And)
   - Point 2: Share what you know (Be Obvious)
   - Point 3: Bridge to your message (Make Your Partner Look Good)
2. **The Story Launch** — For "tell me about..." prompts:
   - Start with a specific moment, not an abstract answer
   - Use present tense to create immediacy
   - End with the insight, not the chronology
3. **The Redirect** — For questions you cannot answer:
   - Acknowledge: "That's an important question"
   - Bridge: "What I can tell you is..."
   - Offer: "And I'll get you the specific answer by [time]"
4. **The Emotional Pivot** — For hostile or loaded questions:
   - Lower status first: "I understand why that concerns you"
   - Share honestly: "Here's what I believe is true"
   - Raise status: "And here's what we're doing about it"

### Phase 4: Design Practice Exercises

Progressive difficulty (beginner → advanced):
1. **Level 1: One-Word Story** — Build a story one word at a time with a partner
   - Develops: surrendering control, building on offers
2. **Level 2: Three-Sentence Expert** — Become an "expert" on any random topic for 60 seconds
   - Develops: confidence in uncertainty, Be Obvious muscle
3. **Level 3: Status Switch** — Present the same content in high and low status
   - Develops: range, intentional status use
4. **Level 4: Hostile Q&A** — Field deliberately difficult questions
   - Develops: composure, redirect skills, emotional management
5. **Level 5: The Blank Stage** — Walk up with no topic and present for 2 minutes
   - Develops: trust in spontaneity, elimination of blocking

### Phase 5: Create the Personal Toolkit

1. Build a "pocket story" library — 5 stories the speaker can reach for in any situation
2. Create a "first sentence" library — 10 opening lines for different situations
3. Design a pre-presentation warm-up routine (2 minutes of improv exercises)
4. Create a "recovery phrases" cheat sheet for when things go wrong
5. Design a 30-day practice plan with daily 5-minute exercises
6. Set up accountability: weekly practice partner or group session

## Output Format

```yaml
spontaneous_presentation_toolkit:
  speaker: "{profile}"
  blocking_patterns:
    primary: "{main block}"
    secondary: "{secondary block}"
    comfort_moves: ["{default behaviors}"]
    status_tendency: "{high/low}"
  techniques:
    - technique: "{name}"
      principle: "{Johnstone's principle}"
      application: "{how to use in presentations}"
      exercise: "{practice activity}"
  response_frameworks:
    triangle: "{acknowledge + know + bridge}"
    story_launch: "{moment + present tense + insight}"
    redirect: "{acknowledge + bridge + offer}"
    emotional_pivot: "{lower + share + raise}"
  practice_exercises:
    - level: "{1-5}"
      name: "{exercise name}"
      description: "{how to do it}"
      develops: "{which skill}"
      duration: "{time}"
  personal_toolkit:
    pocket_stories: ["{5 go-to stories}"]
    first_sentences: ["{10 opening lines}"]
    warm_up_routine: "{2-minute pre-presentation ritual}"
    recovery_phrases: ["{when things go wrong}"]
  thirty_day_plan:
    - week: 1
      focus: "{which skill}"
      daily_exercise: "{5-minute activity}"
```

## Veto Conditions

- **NEVER** tell a speaker to "just relax" — provide specific techniques instead
- **NEVER** encourage memorization — it is the enemy of spontaneity
- **NEVER** skip the progressive difficulty — jumping to Level 5 creates trauma, not skill
- **NEVER** ignore status dynamics — most presentation anxiety is actually status anxiety

## Completion Criteria

- [ ] Blocking patterns diagnosed with specific counter-techniques
- [ ] Core improv techniques adapted for business presentation contexts
- [ ] Response frameworks created for common spontaneous situations
- [ ] Progressive practice exercises designed (5 levels)
- [ ] Personal toolkit built (stories, openers, recovery phrases)
- [ ] 30-day practice plan created with daily exercises
