# Task: Create Art Direction Brief

## Metadata
- **ID:** create-art-direction-brief
- **Version:** 1.0.0
- **Agent:** artdir-orqx (Canvas) orchestrates; visual-strategist (Prism), type-systemist (Kern) contribute
- **Squad:** squad-artdir

## Description

Generate a complete Art Direction Brief with psychological justification for every aesthetic decision. This is the primary deliverable of the squad — the master document that guides all downstream design and development work.

## Inputs

| Input | Type | Required | Description |
|-------|------|----------|-------------|
| briefing | string | required | Project briefing from user or client |
| audience | string | required | Target audience description |
| category | string | required | Market category |
| objective | string | required | Primary conversion objective |
| references | array | optional | Reference URLs or mood references |
| brand_guidelines | string | optional | Existing brand guidelines to respect |
| diagnostic | object | optional | Output from diagnose-visual-language (if existing site) |

## Steps

1. **parse-briefing**
   - Extract project type, audience, category, objective
   - Identify constraints from brand guidelines (if any)
   - Determine which pillars need highest attention

2. **define-visual-language** (Prism)
   - Analyze audience expectations
   - Research category visual conventions
   - Define mood (adjectives, references, territory)
   - Decide dark/light mode with justification
   - Set density, temperature, weight, contrast, movement levels

3. **design-color-system** (Spectrum)
   - Select accent color with neuropsychological rationale
   - Define neutral palette
   - Create semantic colors
   - Verify WCAG compliance
   - Map Von Restorff application

4. **define-typography** (Kern)
   - Select font pairing with positioning rationale
   - Define type scale (modular, fluid)
   - Set tracking and leading per context
   - Plan font loading strategy

5. **specify-motion** (Tempo)
   - Define motion philosophy
   - Select libs
   - Specify hero technique
   - Set easing and timing defaults
   - Plan prefers-reduced-motion fallbacks

6. **design-ia** (Flow)
   - Define section sequence with cognitive roles
   - Plan progressive disclosure levels
   - Identify Zeigarnik loops and curiosity gaps
   - Mark peak and end moments

7. **map-cro-patterns** (Convert)
   - Select patterns by page type
   - Position social proof elements
   - Define CTA strategy (primary, secondary, sticky)
   - Plan risk reversal approach

8. **define-layout** (Grid)
   - Set grid system and spacing scale
   - Decide full-bleed vs contained per section
   - Define responsive breakpoints
   - Set section pacing

9. **validate-accessibility** (Shield)
   - Verify contrast ratios
   - Confirm reduced-motion plan
   - Check semantic structure plan
   - Validate keyboard nav approach

10. **compile-brief**
    - Consolidate all sections into Art Direction Brief
    - Ensure every decision cites psychological principle
    - Add impact hypotheses per section
    - Generate the remaining 7 deliverables

## Outputs

| Output | Type | Description |
|--------|------|-------------|
| art_direction_brief | document | Complete Art Direction Brief (Deliverable 1) |
| design_tokens | document | Design Token System (Deliverable 2) |
| motion_spec | document | Motion Spec (Deliverable 3) |
| wireflow | document | Annotated Wireflow (Deliverable 4) |
| component_spec | document | Component Library Spec (Deliverable 5) |
| cro_map | document | CRO Patterns Map (Deliverable 6) |
| implementation_guide | document | Implementation Guide (Deliverable 7) |
| validation_checklist | document | Validation Checklist (Deliverable 8) |

## Quality Criteria

- EVERY aesthetic decision MUST cite a psychological principle
- Brief MUST be > 500 lines (comprehensive)
- All 7 pillars MUST be addressed
- WCAG AAA for CTAs, AA for body text — verified
- Impact hypotheses MUST specify metric + direction + rationale
- prefers-reduced-motion fallbacks MUST be defined
- Mobile-first layout MUST be explicit
