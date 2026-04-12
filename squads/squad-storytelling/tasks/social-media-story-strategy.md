---
task: "social-media-story-strategy"
responsavel: "park-howell"
responsavel_type: "agent"
atomic_layer: true
elicit: true
Entrada:
  - "Brand context and social media presence"
  - "Target audience and platform strategy"
Saida:
  - "Social media storytelling strategy with ABT content frameworks per platform"
Checklist:
  - "[ ] ABT framework adapted for each platform's format"
  - "[ ] Content pillars aligned with Story Cycle System"
  - "[ ] 30-day content plan with story-structured posts"
---

# Task: Social Media Story Strategy

**Task ID:** NARR-041
**Version:** 1.0.0
**Command:** `*social-media-story-strategy`
**Agent:** Park Howell (park-howell)
**Purpose:** Create a social media storytelling strategy using ABT framework and Story Cycle System, turning social content from noise into narrative.

---

## Inputs

| Input | Source | Required |
|-------|--------|----------|
| `brand_context` | Brand, values, BrandScript | YES |
| `platforms` | Which social media channels | YES |
| `audience` | Target audience per platform | YES |
| `current_content` | Existing social media content | PREFERRED |
| `goals` | Awareness, engagement, conversion, community | PREFERRED |
| `frequency` | Posting cadence per platform | NO |

## Execution Phases

### Phase 1: Diagnose Current Social Content

1. Audit existing content for narrative quality:
   - AAA content: "We launched X and it has Y features and Z benefits" (boring)
   - ABT content: "You face X, BUT Y makes it hard, THEREFORE here's Z" (engaging)
2. Calculate the narrative ratio — what percentage tells a story?
3. Identify which posts got highest engagement — do they share narrative patterns?
4. Find the "story gap" on social — what stories are missing?

### Phase 2: Define Story-Based Content Pillars

Map content pillars to Story Cycle stages:
1. **Backstory pillar** — Behind-the-scenes, origins, the "why" behind the brand
2. **Desire pillar** — Aspirational content showing the transformed state
3. **Resistance pillar** — Naming the obstacles the audience faces (empathy)
4. **Adventure pillar** — Educational content, tips, how-tos (the solution journey)
5. **Trial pillar** — Case studies, results, proof (overcoming challenges)
6. **Rebirth pillar** — Customer transformations, testimonials, celebrations

### Phase 3: Adapt ABT for Each Platform

1. **LinkedIn ABT:**
   - And: Professional context or industry observation (2-3 lines)
   - But: Counterintuitive insight or challenge (1-2 lines)
   - Therefore: Key lesson or recommendation (1-2 lines)
   - Format: 150-300 words, text-first, CTA to comment
2. **Instagram ABT:**
   - And: Visual showing the situation (image/reel)
   - But: Caption hook that names the tension (first line)
   - Therefore: The insight or story resolution (caption body)
   - Format: Carousel (ABT across slides) or Reel (ABT in 30-60s)
3. **Twitter/X ABT:**
   - And: Thread opener establishing context (tweet 1)
   - But: The twist or problem (tweet 2-3)
   - Therefore: The lesson or resolution (final tweet)
   - Format: Thread of 5-7 tweets or single tweet with contrast
4. **TikTok ABT:**
   - And: Visual hook in first 1-2 seconds
   - But: The tension or reveal at 3-5 seconds
   - Therefore: Resolution/transformation by end
   - Format: 15-60 second video, text overlay, trending audio

### Phase 4: Create Story Templates

For each pillar, create reusable post templates:
1. **The Origin Post** — "Here's why we started..." (ABT: We were doing X, But Y happened, Therefore we built Z)
2. **The Customer Post** — "Meet [name]..." (ABT: They faced X, But struggled with Y, Therefore with our help Z)
3. **The Lesson Post** — "I used to think X..." (ABT: Everyone says X, But actually Y, Therefore do Z)
4. **The Behind-the-Scenes Post** — "Here's what you don't see..." (ABT: It looks like X, But really Y, Therefore we do Z)
5. **The Challenge Post** — "Most people get this wrong..." (ABT: You try X, But Y happens, Therefore try Z instead)

### Phase 5: Build 30-Day Content Plan

1. Map 30 days of content across pillars and platforms
2. Ensure each week has a narrative arc (mini Story Cycle across 5-7 posts)
3. Include a "serial story" — a multi-post narrative that builds over the month
4. Plan engagement triggers (questions, polls, challenges) within the narrative
5. Design the content creation workflow (batch creation using ABT templates)
6. Define success metrics per pillar and platform

## Output Format

```yaml
social_media_story_strategy:
  brand: "{name}"
  platforms: ["{channels}"]
  narrative_audit:
    current_abt_ratio: "{percentage}"
    top_performing_pattern: "{what works now}"
    story_gap: "{what's missing}"
  content_pillars:
    - pillar: "{name}"
      story_cycle_stage: "{which stage}"
      frequency: "{per week}"
      platform_adaptation: "{how it changes per platform}"
  platform_abt:
    linkedin:
      format: "{text structure}"
      ideal_length: "{word count}"
      example_post: "{ABT example}"
    instagram:
      format: "{visual + caption}"
      ideal_length: "{caption length}"
      example_post: "{ABT example}"
    # ... per platform
  templates:
    - name: "{template name}"
      abt_structure: "{And/But/Therefore}"
      pillar: "{which content pillar}"
      example: "{complete post example}"
  thirty_day_plan:
    - week: 1
      theme: "{weekly narrative arc}"
      posts:
        - day: 1
          platform: "{channel}"
          pillar: "{content pillar}"
          template: "{which template}"
          topic: "{specific subject}"
  serial_story: "{multi-post narrative description}"
  metrics:
    - pillar: "{name}"
      kpi: "{what to measure}"
      target: "{benchmark}"
```

## Veto Conditions

- **NEVER** post content without ABT structure — random facts are noise, not narrative
- **NEVER** use the same format across all platforms — each platform has its own ABT
- **NEVER** create a content plan without a weekly narrative arc — isolated posts don't build
- **NEVER** make the brand the hero of every post — the customer and their story come first

## Completion Criteria

- [ ] Current content audited for narrative quality
- [ ] Content pillars mapped to Story Cycle stages
- [ ] ABT adapted for each platform with format specifications
- [ ] Reusable story templates created (5+ templates)
- [ ] 30-day content plan with weekly narrative arcs
- [ ] Success metrics defined per pillar and platform
