---
task: "testimonial-story-framework"
responsavel: "kindra-hall"
responsavel_type: "agent"
atomic_layer: true
elicit: true
Entrada:
  - "Raw testimonials or customer feedback"
  - "Product/service context"
Saida:
  - "Testimonials transformed into structured stories using Stories That Stick framework"
Checklist:
  - "[ ] Each testimonial follows Normal → Explosion → New Normal arc"
  - "[ ] Emotional specificity added to generic praise"
  - "[ ] Stories ready for deployment across channels"
---

# Task: Transform Testimonials into Stories

**Task ID:** NARR-035
**Version:** 1.0.0
**Command:** `*testimonial-story-framework`
**Agent:** Kindra Hall (kindra-hall)
**Purpose:** Transform flat customer testimonials into compelling stories using Hall's narrative structure, extracting the drama and emotion that make testimonials persuasive.

---

## Inputs

| Input | Source | Required |
|-------|--------|----------|
| `raw_testimonials` | Existing reviews, feedback, quotes | YES |
| `product_service` | What was purchased/used | YES |
| `customer_profiles` | Who these customers are | PREFERRED |
| `target_channels` | Where stories will be deployed | PREFERRED |
| `interview_access` | Can customers be re-interviewed? | NO (default: no) |

## Execution Phases

### Phase 1: Audit Existing Testimonials

1. Collect all existing testimonials and customer quotes
2. Rate each on the "story spectrum":
   - Level 1: Generic praise ("Great product!")
   - Level 2: Feature mention ("The dashboard saved us time")
   - Level 3: Outcome mention ("We increased revenue 30%")
   - Level 4: Emotional specificity ("I finally stopped dreading Monday reports")
   - Level 5: Full narrative (before/problem/after with feeling)
3. Identify the top 10 testimonials with the most story potential
4. Note what is MISSING from each — usually the "before" and the "explosion"

### Phase 2: Extract the Story from Each Testimonial

For each high-potential testimonial:
1. **Find the Normal** — What was life like before? Ask: "What were you doing before?"
2. **Find the Explosion** — What broke, frustrated, or motivated them to change? "What was the last straw?"
3. **Find the New Normal** — What is different now? "What can you do now that you couldn't before?"
4. **Find the Feeling** — What emotion was present at each stage? (stressed, relieved, proud, free)
5. **Find the Specific Detail** — The one concrete image that makes the story vivid
6. If interview is possible, use these 5 extraction questions directly

### Phase 3: Structure Each Story

1. Write each testimonial as a 3-part narrative:
   - **Normal** (2-3 sentences): Set the scene with specificity and relatability
   - **Explosion** (2-3 sentences): The problem at its worst, the moment of "enough"
   - **New Normal** (2-3 sentences): Life transformed, with a specific proof point
2. Include the customer's own words wherever possible — authenticity is non-negotiable
3. Add the "universal moment" — the line where any prospect would think "that's me"
4. End with the single most powerful quote from the customer

### Phase 4: Create Format Variations

For each story, create:
1. **Full narrative** (150-250 words) — Website, case study, email
2. **Social proof snippet** (50-75 words) — Landing page, social media
3. **Pull quote** (1-2 sentences) — Ad copy, hero section, email subject line
4. **Video script** (30-60 seconds) — If video testimonial is planned
5. **Carousel format** (3-5 slides) — Instagram/LinkedIn carousel

### Phase 5: Deploy and Systematize

1. Map each story to the funnel stage it best serves:
   - Awareness: Stories that name the problem (resonance)
   - Consideration: Stories that show the process (trust)
   - Decision: Stories that prove the outcome (confidence)
2. Tag stories by persona, industry, use case, and emotional tone
3. Create a testimonial interview template for future story collection
4. Design a quarterly "story harvest" process for ongoing collection
5. Create guidelines for the team: how to spot, request, and capture testimonial stories

## Output Format

```yaml
testimonial_stories:
  stories:
    - customer: "{name/anonymized}"
      persona_match: "{which audience persona}"
      raw_testimonial: "{original quote}"
      structured_story:
        normal: "{before state with specificity}"
        explosion: "{breaking point}"
        new_normal: "{transformed state with proof}"
        core_feeling: "{emotional journey}"
        universal_moment: "{the 'that's me' line}"
      formats:
        full_narrative: "{150-250 words}"
        social_snippet: "{50-75 words}"
        pull_quote: "{1-2 sentences}"
      funnel_stage: "{awareness/consideration/decision}"
      tags: ["{persona, industry, emotion}"]
  interview_template: ["{5 extraction questions}"]
  collection_process: "{quarterly story harvest design}"
  deployment_map:
    website: ["{which stories where}"]
    social_media: ["{which stories where}"]
    email: ["{which stories where}"]
    ads: ["{which stories where}"]
```

## Veto Conditions

- **NEVER** fabricate or embellish customer quotes — authenticity is sacred
- **NEVER** accept "Great product!" as a usable testimonial — extract the real story
- **NEVER** strip the emotion from testimonials to sound "professional" — feeling IS persuasion
- **NEVER** use testimonials without the "before" — outcomes without context are unconvincing

## Completion Criteria

- [ ] Existing testimonials audited and rated on story spectrum
- [ ] Top stories structured with Normal → Explosion → New Normal
- [ ] Each story has universal moment and core feeling identified
- [ ] Format variations created for each story (full, snippet, quote)
- [ ] Stories mapped to funnel stages and tagged by persona
- [ ] Collection process designed for ongoing testimonial harvesting
