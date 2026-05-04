---
task: "improvised-content-creation"
responsavel: "keith-johnstone"
responsavel_type: "agent"
atomic_layer: true
elicit: true
Entrada:
  - "Content topic or brand context"
  - "Platform and audience"
Saida:
  - "Content pieces created using improv techniques for authenticity and spontaneity"
Checklist:
  - "[ ] Yes-And technique applied to build on ideas generatively"
  - "[ ] Status transactions used for engaging content dynamics"
  - "[ ] Content feels spontaneous and authentic, not scripted"
---

# Task: Improvised Content Creation

**Task ID:** NARR-042
**Version:** 1.0.0
**Command:** `*improvised-content-creation`
**Agent:** Keith Johnstone (keith-johnstone)
**Purpose:** Apply improv theatre techniques to content creation, producing authentic, spontaneous-feeling content that breaks through the sameness of polished marketing.

---

## Inputs

| Input | Source | Required |
|-------|--------|----------|
| `topic` | Content subject or brand context | YES |
| `platform` | Where the content will live | YES |
| `audience` | Who will consume it | YES |
| `tone` | Desired energy level (playful, serious, vulnerable, bold) | PREFERRED |
| `constraints` | Brand guidelines, topics to avoid | NO |

## Execution Phases

### Phase 1: Apply "Yes, And" to Idea Generation

1. Start with the core topic and "Yes, And" through 10 iterations:
   - Topic: "Our product saves time"
   - Yes, And: "...and time is what people waste most on meaningless admin"
   - Yes, And: "...and meaningless admin makes smart people feel stupid"
   - Continue until you find the REAL story buried beneath the surface topic
2. Use "Yes, And" to combine unexpected ideas:
   - Your product + an unlikely metaphor
   - Your audience's problem + an absurd comparison
   - Your value prop + a personal confession
3. Select the 3 most surprising "Yes, And" pathways for content development

### Phase 2: Use Status Transactions for Engagement

1. Identify the status dynamic in the content:
   - **High-status content**: Authoritative, definitive, "here's how it's done"
   - **Low-status content**: Vulnerable, questioning, "here's what I got wrong"
   - **Status flip**: Start one way, switch mid-content (the surprise)
2. Design status-play content formats:
   - "Confession" posts: Brand/founder lowers status intentionally (builds trust)
   - "Expert drop" posts: Brand raises status with a bold claim (builds authority)
   - "Status flip" posts: Start humble, end authoritative (or vice versa)
3. Map audience status: Are they feeling high-status (confident) or low-status (struggling)?
4. Content that acknowledges audience's true status creates immediate connection

### Phase 3: Create "Spontaneous" Content Formats

1. **The Unscripted Take** — A seemingly off-the-cuff thought about the topic
   - Actually structured: Hook → Observation → Insight → Callback
   - Feels spontaneous because the language is conversational, not polished
2. **The Failed Experiment** — Share something that went wrong, in real-time
   - Improv principle: mistakes are gifts; they create the best content
3. **The Unexpected Connection** — Link two unrelated things to create insight
   - Improv principle: "obvious" connections bore; surprising connections delight
4. **The Live Reaction** — Respond to something in your industry in the moment
   - Improv principle: the best scenes happen when you react authentically
5. **The Callback** — Reference something from previous content in a new context
   - Improv principle: callbacks reward loyal audience and create inside-joke energy

### Phase 4: Apply Theatresports Techniques

1. **Word-at-a-time storytelling** — Build content by adding one idea at a time, letting each idea inform the next (prevents overthinking)
2. **Emotional rollercoaster** — Alternate between emotional states within one piece
3. **Offer and accept** — Each section of content makes an offer; the next section accepts and builds
4. **Break routine** — After establishing a pattern in content, deliberately break it
5. **The tilt** — Shift perspective unexpectedly mid-content (first person → second person, serious → playful)

### Phase 5: Produce and Refine

1. Create 5 content pieces using the techniques above
2. For each piece, rate:
   - Spontaneity score (1-5): Does it feel unscripted?
   - Surprise score (1-5): Does it contain something unexpected?
   - Connection score (1-5): Does it create intimacy with the audience?
3. Edit for clarity without editing out the spontaneity
4. Add structural elements (headlines, CTAs) without killing the energy
5. Create a "content improv" practice for the team — weekly exercises that generate content ideas

## Output Format

```yaml
improvised_content:
  topic: "{subject}"
  platform: "{channel}"
  yes_and_pathways:
    - pathway: "{unexpected direction}"
      content_potential: "{what it could become}"
  content_pieces:
    - title: "{piece title}"
      technique: "{yes-and/status-play/spontaneous/callback}"
      status_dynamic: "{high/low/flip}"
      content: "{the actual content piece}"
      spontaneity_score: "{1-5}"
      surprise_score: "{1-5}"
      connection_score: "{1-5}"
  team_exercises:
    - exercise: "{name}"
      description: "{how to run it}"
      content_output: "{what it generates}"
      frequency: "{how often}"
```

## Veto Conditions

- **NEVER** over-polish improv content — the rough edges ARE the appeal
- **NEVER** use improv techniques to be random — spontaneity serves the message
- **NEVER** ignore status dynamics — every piece of content has status, whether you design it or not
- **NEVER** skip the "Yes, And" process — jumping to the obvious idea misses the gold

## Completion Criteria

- [ ] Yes-And technique applied to generate unexpected content angles
- [ ] Status transactions designed for engagement dynamics
- [ ] 5 content pieces created using distinct improv techniques
- [ ] Each piece scored for spontaneity, surprise, and connection
- [ ] Team improv exercises designed for ongoing content generation
- [ ] Content feels authentic and spontaneous while serving the brand message
