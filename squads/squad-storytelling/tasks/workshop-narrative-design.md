---
task: "workshop-narrative-design"
responsavel: "nancy-duarte"
responsavel_type: "agent"
atomic_layer: true
elicit: true
Entrada:
  - "Workshop topic and learning objectives"
  - "Participant profile and group size"
Saida:
  - "Workshop design with narrative arc, Sparkline structure, and participatory moments"
Checklist:
  - "[ ] Workshop follows Sparkline arc with experiential learning moments"
  - "[ ] Each module has its own What Is / What Could Be cycle"
  - "[ ] Participatory STAR moments designed for knowledge retention"
---

# Task: Design Workshop Narrative

**Task ID:** NARR-033
**Version:** 1.0.0
**Command:** `*workshop-narrative-design`
**Agent:** Nancy Duarte (nancy-duarte)
**Purpose:** Design workshop experiences using Duarte's narrative principles, creating learning journeys that transform participants through story, not just information transfer.

---

## Inputs

| Input | Source | Required |
|-------|--------|----------|
| `topic` | Workshop subject matter | YES |
| `learning_objectives` | What participants should be able to do after | YES |
| `participants` | Profile, knowledge level, motivation | YES |
| `duration` | Workshop length (half-day, full-day, multi-day) | YES |
| `format` | In-person, virtual, hybrid | PREFERRED |
| `group_size` | Number of participants | NO |

## Execution Phases

### Phase 1: Design the Workshop Sparkline

1. **Opening What Is** — Where participants are NOW with this topic (acknowledge their reality)
2. **What Could Be** — Where they will be by the end (the transformation promise)
3. Design 3-5 learning modules, each with its own Sparkline cycle:
   - Module What Is: Current understanding/capability
   - Module What Could Be: New understanding/capability after this module
4. Build progressive complexity — each module raises the ceiling
5. Design the "workshop STAR moment" — the single activity they will remember forever
6. Close with "New Bliss" — participants practice the full transformed capability

### Phase 2: Design Experiential Moments

1. For each module, design a hands-on exercise that embodies the concept:
   - Not "I'll explain X" but "You'll experience X and then we'll debrief"
2. Apply the 70-20-10 rule to workshop time:
   - 70% doing (exercises, practice, creation)
   - 20% discussing (debrief, Q&A, peer sharing)
   - 10% presenting (facilitator input)
3. Design "failure forward" exercises — safe spaces to get it wrong and learn
4. Create paired and group exercises that build social learning
5. Design the "showcase" moment — participants share what they created

### Phase 3: Structure the Narrative Arc

1. **Act 1: Departure (First 15%)** — Hook, establish the gap, create urgency to learn
   - Opening exercise that reveals the gap between What Is and What Could Be
   - Brief framing of the journey ahead
2. **Act 2: Initiation (Middle 70%)** — Progressive learning through experience
   - Module 1: Foundation concept + exercise + debrief
   - Module 2: Building concept + exercise + debrief
   - Module 3: Advanced concept + exercise + debrief
   - Workshop STAR moment (between Module 2 and 3 for maximum impact)
3. **Act 3: Return (Final 15%)** — Integration, application, commitment
   - Synthesis exercise: combine all concepts into one deliverable
   - Personal action planning: "What will you do Monday?"
   - Closing ritual: sharing commitments with the group

### Phase 4: Design Facilitation Guide

1. For each module, document:
   - Facilitator talking points (script or bullets)
   - Exercise instructions (step-by-step for participants)
   - Debrief questions (5 questions that extract learning)
   - Timing (with buffer for discussion overflow)
   - Materials needed (physical or digital)
2. Design energy management — high-energy and reflective moments alternate
3. Plan "rescue patterns" — what to do if an exercise falls flat or runs long
4. Create transition narratives between modules (not just "okay, next topic")

### Phase 5: Design Retention Mechanisms

1. Create a "workshop artifact" — something tangible participants take home
2. Design the post-workshop follow-up narrative (email sequence, check-in)
3. Create a one-page "cheat sheet" that captures the workshop's core frameworks
4. Design peer accountability pairing (participants commit to check in on each other)
5. Plan the 30-day "Return" touchpoint — revisit the transformation promise

## Output Format

```yaml
workshop_design:
  topic: "{subject}"
  duration: "{hours}"
  participants: "{profile and count}"
  transformation_promise: "{What Is → What Could Be}"
  sparkline:
    opening: "{participant reality acknowledgment}"
    modules:
      - title: "{module name}"
        what_is: "{current capability}"
        what_could_be: "{new capability}"
        exercise: "{hands-on activity}"
        debrief: ["{key questions}"]
        duration: "{minutes}"
    star_moment:
      activity: "{unforgettable exercise}"
      placement: "{when in the workshop}"
    closing: "{new bliss — full capability practice}"
  facilitation_guide:
    - module: "{name}"
      talking_points: ["{key messages}"]
      exercise_instructions: "{step by step}"
      timing: "{minutes with buffer}"
      materials: ["{what's needed}"]
      rescue_pattern: "{if it goes wrong}"
  retention:
    artifact: "{what they take home}"
    cheat_sheet: "{one-page framework}"
    follow_up: "{post-workshop sequence}"
    accountability: "{peer check-in design}"
  energy_map:
    - time: "{timestamp}"
      energy: "[high/medium/reflective]"
      activity: "{what's happening}"
```

## Veto Conditions

- **NEVER** lecture for more than 10 minutes without an interactive element
- **NEVER** skip the debrief after exercises — the learning happens in reflection
- **NEVER** start with theory — start with experience that creates hunger for theory
- **NEVER** end without personal action planning — workshops without commitment fade
- **NEVER** design without energy management — afternoon slumps kill workshops

## Completion Criteria

- [ ] Workshop follows Sparkline arc with clear transformation promise
- [ ] Each module has exercise, debrief, and clear learning outcome
- [ ] STAR moment designed for maximum retention
- [ ] Facilitation guide complete with timing, materials, and rescue patterns
- [ ] Retention mechanisms designed (artifact, follow-up, accountability)
- [ ] Energy map ensures engagement throughout
