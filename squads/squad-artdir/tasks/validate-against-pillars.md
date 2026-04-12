# Task: Validate Against Pillars

## Metadata
- **ID:** validate-against-pillars
- **Version:** 1.0.0
- **Agent:** artdir-orqx (Canvas) orchestrates; accessibility-guardian (Shield) validates accessibility
- **Squad:** squad-artdir

## Description

Final validation checklist against all 7 pillars, WCAG compliance, and performance targets. This is the quality gate that determines if the art direction is ready for implementation handoff.

## Inputs

| Input | Type | Required | Description |
|-------|------|----------|-------------|
| art_direction_brief | document | required | The complete Art Direction Brief |
| design_tokens | document | required | Design Token System |
| motion_spec | document | required | Motion Specification |
| wireflow | document | required | Annotated Wireflow |
| cro_map | document | required | CRO Patterns Map |

## Steps

1. **validate-pillar-1** (Visual Hierarchy)
   - [ ] Clear focal point per viewport
   - [ ] Consistent heading hierarchy (h1 → h6 in order)
   - [ ] Von Restorff applied to CTAs (single accent color)
   - [ ] Reading pattern matches content type (F, Z, or layer cake)
   - [ ] Hick's Law respected (max 3 options per viewport)
   - [ ] Fitts's Law respected (CTAs large, well-positioned)
   - Score: _/10

2. **validate-pillar-2** (Color System)
   - [ ] Max 1 accent + 1 neutral enforced
   - [ ] WCAG AAA (7:1) on all CTAs
   - [ ] WCAG AA (4.5:1) on all body text
   - [ ] WCAG AA (3:1) on large text and UI components
   - [ ] Semantic colors functional and distinct from accent
   - [ ] Color-blindness safe (no color-only indicators)
   - [ ] Dark/light mode properly designed (not inverted)
   - Score: _/10

3. **validate-pillar-3** (Typography)
   - [ ] Font pairing justified by positioning
   - [ ] Type scale consistent and modular
   - [ ] Fluid typography with clamp() implemented
   - [ ] Tracking appropriate per level (tight headings, normal body, wide labels)
   - [ ] Line-height appropriate per context
   - [ ] Font loading optimized (swap, preload, subset)
   - Score: _/10

4. **validate-pillar-4** (Motion)
   - [ ] Every animation cites psychological/Disney principle
   - [ ] Only GPU properties animated (transform, opacity)
   - [ ] 60fps target for desktop
   - [ ] 30fps minimum for mobile
   - [ ] prefers-reduced-motion covers 100% of animations
   - [ ] No animation > 5 seconds without pause control
   - [ ] Easing is never linear for UI motion
   - [ ] Duration ranges specified per category
   - Score: _/10

5. **validate-pillar-5** (Information Architecture)
   - [ ] Every section has documented cognitive role
   - [ ] Section sequence justified by psychological principle
   - [ ] Progressive disclosure implemented (L1-L4)
   - [ ] At least 2 Zeigarnik loops identified
   - [ ] Peak moment is mid-page (not first or last)
   - [ ] End moment (footer) is meaningful
   - [ ] Self-qualification point exists
   - Score: _/10

6. **validate-pillar-6** (CRO Patterns)
   - [ ] Social proof present and verifiable
   - [ ] Multiple CTAs at different intent levels
   - [ ] Risk reversal addresses top 3 objections
   - [ ] Comparison framed favorably (if applicable)
   - [ ] All impact hypotheses documented (metric + direction + %)
   - [ ] Sticky CTA present after hero
   - Score: _/10

7. **validate-pillar-7** (Layout & Spacing)
   - [ ] 4px/8px baseline grid enforced
   - [ ] Section spacing creates cognitive breathing (96-192px between sections)
   - [ ] Full-bleed vs contained justified per section
   - [ ] Responsive breakpoints tested (320px, 640px, 1024px, 1440px)
   - [ ] Max content width enforced (65ch for body text)
   - [ ] Mobile-first layout explicit
   - Score: _/10

8. **validate-wcag** (Shield)
   - [ ] All contrast ratios verified (tools used)
   - [ ] Keyboard navigation complete (Tab, Enter, Escape)
   - [ ] Focus states visible on all interactive elements
   - [ ] Skip link present and functional
   - [ ] Alt text on all meaningful images
   - [ ] Form labels present and associated
   - [ ] aria-live for dynamic content
   - [ ] Language attribute on html element
   - [ ] No keyboard traps (except modal focus trap)
   - [ ] Touch targets min 44x44px
   - Score: _/10

9. **validate-performance**
   - [ ] Lighthouse target > 90
   - [ ] FCP target < 1.5s
   - [ ] LCP target < 2.5s
   - [ ] CLS target < 0.1
   - [ ] Total animation JS < 100KB gzipped
   - [ ] Font files optimized (subset, woff2)
   - Score: _/10

10. **calculate-verdict**
    - Average all pillar scores
    - Identify any pillar below 6/10 (BLOCKER)
    - Generate verdict: PASS / CONCERNS / FAIL

## Outputs

| Output | Type | Description |
|--------|------|-------------|
| validation_report | document | Complete validation with all checks |
| pillar_scores | array | Score for each pillar + WCAG + performance |
| blockers | array | Any pillar below 6/10 |
| verdict | string | PASS, CONCERNS, or FAIL |
| remediation | array | Required fixes for CONCERNS/FAIL verdict |

## Verdict Criteria

| Verdict | Criteria | Action |
|---------|----------|--------|
| PASS | All pillars >= 7/10, no WCAG violations | Ready for implementation handoff |
| CONCERNS | All pillars >= 6/10, minor WCAG issues | Ready with documented concerns |
| FAIL | Any pillar < 6/10 OR critical WCAG violation | Must fix before handoff |

## Quality Criteria

- Every check MUST be binary (pass/fail) with specific observation
- Scores MUST be justified (not subjective)
- WCAG checks MUST use tools (not visual inspection alone)
- Performance targets MUST be based on project type and audience
- Verdict MUST be actionable — if FAIL, specify exactly what to fix
