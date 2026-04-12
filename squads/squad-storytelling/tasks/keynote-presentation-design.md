---
task: "keynote-presentation-design"
responsavel: "nancy-duarte"
responsavel_type: "agent"
atomic_layer: true
elicit: true
Entrada:
  - "Keynote topic and core message"
  - "Audience profile and event context"
Saida:
  - "Complete keynote presentation designed with Sparkline and STAR moments"
Checklist:
  - "[ ] Sparkline structure oscillates between What Is and What Could Be"
  - "[ ] STAR moment designed for peak memorability"
  - "[ ] Audience positioned as hero of the transformation"
---

# Task: Design Keynote Presentation

**Task ID:** NARR-030
**Version:** 1.0.0
**Command:** `*keynote-presentation-design`
**Agent:** Nancy Duarte (nancy-duarte)
**Purpose:** Design a keynote presentation using Duarte's Sparkline structure, STAR moment methodology, and audience-as-hero philosophy from Resonate.

---

## Inputs

| Input | Source | Required |
|-------|--------|----------|
| `topic` | Keynote subject matter | YES |
| `core_message` | The single idea the audience must remember | YES |
| `audience` | Who they are, what they know, what they care about | YES |
| `event_context` | Conference, company meeting, TED-style, workshop | YES |
| `duration` | Time allotted for the keynote | YES |
| `speaker_profile` | Speaker's credibility and relationship to topic | PREFERRED |

## Execution Phases

### Phase 1: Audience Analysis (The Hero)

1. Profile the audience — demographics, knowledge level, emotional state arriving
2. Identify their "What Is" — current reality, beliefs, and frustrations
3. Define their "What Could Be" — the aspirational state the keynote will paint
4. Map the gap between What Is and What Could Be — this gap IS the keynote
5. Identify the audience's resistance: What will they push back on? What do they fear?
6. Determine the "gift" — what does the audience receive by the end?

### Phase 2: Design the Sparkline

1. **Opening: What Is** — Start in the audience's current reality (shared experience)
2. **First Contrast: What Could Be** — Paint the first glimpse of the better world
3. **What Is (deepened)** — Why the current state persists; what holds us back
4. **What Could Be (expanded)** — More evidence, stories, data for the better world
5. Continue alternating — each cycle deepens the contrast and raises stakes
6. **Call to Adventure** — The pivot where What Could Be becomes achievable
7. **New Bliss** — Close with the transformed world; the audience's future if they act
8. Design 5-7 oscillation points for a 20-minute keynote (adjust by duration)

### Phase 3: Design the STAR Moment

1. The STAR moment (Something They'll Always Remember) is the peak of the keynote
2. Choose the STAR type:
   - **Memorable Dramatization** — Live demo, physical prop, unexpected visual
   - **Repeatable Sound Bite** — A phrase so good the audience will quote it
   - **Evocative Visual** — A single image that captures the entire message
   - **Emotive Storytelling** — A personal or human story that creates catharsis
   - **Shocking Statistic** — A number presented in a way that rewires understanding
3. Place the STAR moment at approximately 2/3 through the presentation
4. Design the emotional buildup that makes the STAR moment land
5. Design the aftermath — what follows must sustain the energy, not deflate it

### Phase 4: Structure the Content

1. Craft the opening — first 30 seconds must establish relevance and credibility
2. Design 3-5 "movement" sections, each with its own What Is/What Could Be cycle
3. For each section:
   - Lead with a story or concrete example
   - Introduce the concept or insight
   - Provide evidence (data, case study, research)
   - Return to the audience: "This means for you..."
4. Design transitions between sections (callbacks, questions, visual shifts)
5. Craft the closing — end with the New Bliss and a clear call to action

### Phase 5: Slide Design Principles

1. One idea per slide — if the slide needs a second sentence, split it
2. Design for glanceability — audience should get the point in 3 seconds
3. Use full-bleed images for emotional slides, minimal text for data slides
4. Create visual contrast between What Is (darker/muted) and What Could Be (lighter/vibrant)
5. The STAR moment slide should break every pattern established so far
6. Final slide should be the call to action, not "Thank you" or "Questions?"

## Output Format

```yaml
keynote_presentation:
  topic: "{subject}"
  core_message: "{the one thing to remember}"
  duration: "{minutes}"
  audience:
    profile: "{who they are}"
    what_is: "{current reality}"
    what_could_be: "{aspirational state}"
    gap: "{what separates them}"
    gift: "{what they receive}"
  sparkline:
    - moment: "Opening — What Is"
      content: "{shared current reality}"
      emotional_tone: "{feeling}"
      duration: "{minutes}"
    - moment: "First Contrast — What Could Be"
      content: "{glimpse of better world}"
      emotional_tone: "{feeling}"
      duration: "{minutes}"
    # ... all oscillation points
    - moment: "New Bliss"
      content: "{transformed future}"
      emotional_tone: "{inspiration}"
      duration: "{minutes}"
  star_moment:
    type: "{dramatization/sound_bite/visual/story/statistic}"
    content: "{what happens}"
    placement: "{when in the presentation}"
    buildup: "{how to prepare the audience}"
  sections:
    - title: "{section name}"
      story: "{opening story}"
      insight: "{concept}"
      evidence: "{proof}"
      audience_relevance: "{why this matters to them}"
  slide_count: 0
  call_to_action: "{what the audience should do}"
```

## Veto Conditions

- **NEVER** make the speaker the hero — the AUDIENCE is always the hero
- **NEVER** start with "Today I'm going to talk about..." — start in the audience's world
- **NEVER** create slides with walls of text — one idea per slide
- **NEVER** end with "Any questions?" — end with the call to action and New Bliss
- **NEVER** skip the STAR moment — without it, the keynote is forgettable

## Completion Criteria

- [ ] Sparkline designed with clear What Is / What Could Be oscillation
- [ ] STAR moment designed and placed at optimal point
- [ ] Audience positioned as hero throughout
- [ ] Opening hooks audience in first 30 seconds
- [ ] Closing delivers clear call to action
- [ ] Slide design principles documented
