---
task: "video-script-beat-sheet"
responsavel: "blake-snyder"
responsavel_type: "agent"
atomic_layer: true
elicit: true
Entrada:
  - "Video concept, purpose, and target audience"
  - "Video length and platform"
Saida:
  - "Complete video script structured with Save the Cat beat sheet"
Checklist:
  - "[ ] All 15 beats mapped to video timeline"
  - "[ ] Opening hook captures attention in first 5 seconds"
  - "[ ] Emotional beats timed for audience retention"
---

# Task: Video Script Using Beat Sheet

**Task ID:** NARR-024
**Version:** 1.0.0
**Command:** `*video-script-beat-sheet`
**Agent:** Blake Snyder (blake-snyder)
**Purpose:** Create compelling video scripts using Save the Cat's 15-beat structure, adapted for marketing, educational, and brand videos of any length.

---

## Inputs

| Input | Source | Required |
|-------|--------|----------|
| `video_concept` | What the video is about | YES |
| `video_purpose` | Brand awareness, conversion, education, testimonial | YES |
| `target_audience` | Who will watch | YES |
| `video_length` | Duration (30s, 60s, 2min, 5min, 10min+) | YES |
| `platform` | YouTube, Instagram, TikTok, LinkedIn, website | PREFERRED |
| `brand_guidelines` | Tone, visual style, do/don't | NO |

## Execution Phases

### Phase 1: Adapt Beat Sheet to Video Length

Map the 15 beats to the video's runtime:

| Beat | % of Runtime | 60s Video | 5min Video |
|------|-------------|-----------|------------|
| Opening Image | 0-1% | 0-1s | 0-3s |
| Theme Stated | 5% | 3s | 15s |
| Set-Up | 1-10% | 1-6s | 3-30s |
| Catalyst | 10% | 6s | 30s |
| Debate | 10-25% | 6-15s | 30-75s |
| Break into Two | 25% | 15s | 75s |
| B Story | 30% | 18s | 90s |
| Fun and Games | 30-50% | 18-30s | 90-150s |
| Midpoint | 50% | 30s | 150s |
| Bad Guys Close In | 50-75% | 30-45s | 150-225s |
| All Is Lost | 75% | 45s | 225s |
| Dark Night of the Soul | 75-80% | 45-48s | 225-240s |
| Break into Three | 80% | 48s | 240s |
| Finale | 80-99% | 48-59s | 240-297s |
| Final Image | 99-100% | 59-60s | 297-300s |

### Phase 2: Write Each Beat

For each beat, define:
1. **Visual** — What does the viewer see?
2. **Audio** — Narration, dialogue, music, sound effects
3. **Text overlay** — On-screen text (if applicable)
4. **Emotional target** — What should the viewer feel?
5. **Retention hook** — Why they keep watching past this point

### Phase 3: Optimize the Critical Beats

1. **Opening Image** — Must hook in 3-5 seconds; pattern interrupt or bold statement
2. **Catalyst** — The moment the viewer's problem is named; they lean in
3. **Fun and Games** — The "promise of the premise"; deliver what they came for
4. **Midpoint** — False victory or false defeat; raises stakes
5. **All Is Lost** — The emotional low that makes the resolution satisfying
6. **Final Image** — Mirror of opening but transformed; the CTA lives here

### Phase 4: Platform Optimization

1. Adapt pacing for platform attention spans (TikTok: rapid beats; YouTube: can breathe)
2. Design thumbnail moment (the single most visually compelling frame)
3. Place retention hooks at algorithm-critical moments (30s for YouTube, 3s for TikTok)
4. Design the "scroll-stopper" — first 1-2 seconds that prevent scrolling past
5. Optimize for sound-off viewing (captions, visual storytelling)

### Phase 5: Script Assembly

1. Write the complete script with timecodes
2. Add stage directions for filming/animation
3. Include music/mood notes for each section
4. Write 3 title/thumbnail options
5. Create a shot list derived from the beat sheet

## Output Format

```yaml
video_script:
  title: "{video title}"
  platform: "{platform}"
  duration: "{length}"
  purpose: "{goal}"
  logline: "{one-sentence summary}"
  beat_sheet:
    - beat: "Opening Image"
      timecode: "0:00-0:03"
      visual: "{what viewer sees}"
      audio: "{narration/music}"
      text_overlay: "{on-screen text}"
      emotional_target: "{feeling}"
    # ... all 15 beats
  scroll_stopper: "{first 1-2 seconds description}"
  thumbnail_moment: "{most compelling visual frame}"
  retention_hooks:
    - timecode: ""
      hook: "{why they keep watching}"
  cta: "{call to action and placement}"
  title_options: ["{option 1}", "{option 2}", "{option 3}"]
  shot_list: ["{derived from beats}"]
```

## Veto Conditions

- **NEVER** start a video without a hook in the first 3-5 seconds
- **NEVER** skip the Catalyst — the audience must know why they should care
- **NEVER** treat Fun and Games as filler — it is the core value delivery
- **NEVER** bury the CTA — it must feel like the natural Final Image, not an afterthought

## Completion Criteria

- [ ] All 15 beats mapped to video timeline with timecodes
- [ ] Opening hook designed for platform-specific attention span
- [ ] Each beat has visual, audio, and emotional specifications
- [ ] Platform optimization applied (retention hooks, sound-off design)
- [ ] Script assembled with stage directions and music notes
- [ ] Title/thumbnail options provided
