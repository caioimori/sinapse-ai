# Task: Specify Motion System

## Metadata
- **ID:** specify-motion-system
- **Version:** 1.0.0
- **Agent:** motion-architect (Tempo), interaction-designer (Pulse) contributes
- **Squad:** squad-artdir

## Description

Create a complete motion specification with timing, easing, library selection, and kinesthetic justification for every animation. Includes performance budget, prefers-reduced-motion fallbacks, and implementation-ready specs.

## Inputs

| Input | Type | Required | Description |
|-------|------|----------|-------------|
| art_direction_brief | object | required | The Art Direction Brief with visual language decisions |
| section_map | array | required | List of sections with cognitive roles |
| project_type | string | required | landing_page, website, campaign, product_page |
| hero_preference | string | optional | Preferred hero technique (frame_sequence, text_reveal, parallax, static) |

## Steps

1. **define-philosophy**
   - Translate visual language mood into motion personality
   - Map motion intensity to project type and audience

2. **select-libraries**
   - Choose primary animation library (GSAP, Framer Motion, CSS)
   - Choose scroll library (Lenis, native)
   - Justify each selection with technical and aesthetic rationale

3. **specify-hero**
   - Define hero animation technique
   - Specify implementation details (frames, timing, trigger)
   - Create reduced-motion fallback

4. **specify-sections**
   - For each section: define entrance animation, scroll behavior, interactions
   - Set stagger patterns for groups
   - Define scrub vs triggered behavior

5. **specify-interactions** (Pulse)
   - Define hover states for all interactive elements
   - Define click/tap feedback
   - Define focus states
   - Plan custom cursor (if applicable)

6. **define-transitions**
   - Specify page transition technique (if multi-page)
   - Define modal/overlay transitions
   - Define accordion/expand transitions

7. **set-performance-budget**
   - Define FPS targets
   - Set max simultaneous animations
   - Define will-change strategy
   - Set JS bundle budget for animation

8. **create-reduced-motion-plan**
   - Map every animation to its reduced-motion fallback
   - Ensure content remains accessible without motion
   - Test conceptual flow without any animation

9. **compile-spec**
   - Produce Motion Spec document (Deliverable 3)
   - Include CSS custom properties for timing/easing
   - Include JS configuration snippets

## Outputs

| Output | Type | Description |
|--------|------|-------------|
| motion_spec | document | Complete Motion Spec (Deliverable 3) |
| css_tokens | code | CSS custom properties for motion tokens |
| reduced_motion_map | document | Every animation + its fallback |

## Quality Criteria

- Every animation MUST cite Disney principle or psychological justification
- Performance budget MUST be explicit (FPS, bundle size, max elements)
- prefers-reduced-motion MUST cover 100% of animations
- Easing MUST never be linear for UI motion
- Duration ranges MUST be specified, not exact (allows dev flexibility)
