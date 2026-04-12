# Task: Design Color System

## Metadata
- **ID:** design-color-system
- **Version:** 1.0.0
- **Agent:** color-psychologist (Spectrum)
- **Squad:** squad-artdir

## Description

Create a complete color system with tokens, semantics, and neuropsychological justification. Includes WCAG verification, dark/light mode support, and Von Restorff application strategy.

## Inputs

| Input | Type | Required | Description |
|-------|------|----------|-------------|
| visual_language | object | required | Visual language decisions from Prism (mood, mode, temperature) |
| audience | string | required | Target audience description |
| emotion_target | string | required | Primary emotion to evoke (urgency, trust, innovation, etc.) |
| brand_colors | array | optional | Existing brand colors to incorporate |
| mode | string | required | dark, light, or adaptive |

## Steps

1. **map-emotion-to-color**
   - Use emotion-to-color mapping from knowledge base
   - Cross-reference with audience expectations
   - Consider category conventions

2. **select-accent**
   - Choose accent hue with neuropsychological rationale
   - Generate full scale (50-900)
   - Verify contrast on target backgrounds

3. **select-neutral**
   - Choose neutral base (true neutral, warm, cool)
   - Generate full scale (0-950)
   - Design surface hierarchy (primary, secondary, tertiary)

4. **define-semantics**
   - Select success, warning, error, info colors
   - Ensure functional differentiation from accent
   - Verify WCAG compliance for each

5. **verify-wcag**
   - Check AAA (7:1) for accent on surfaces (CTAs)
   - Check AA (4.5:1) for body text
   - Check AA (3:1) for large text and UI components
   - Document all contrast ratios

6. **plan-von-restorff**
   - Map exactly where accent appears (CTAs, badges, highlights)
   - Ensure everything else is neutral
   - Verify isolation effect is achieved

7. **design-mode-variants**
   - If dark mode: design luminance-based surface hierarchy
   - If light mode: design shadow-based elevation
   - If adaptive: design both systems with shared accent

8. **generate-tokens**
   - Produce CSS custom properties
   - Produce design token YAML
   - Include usage guidelines per token

## Outputs

| Output | Type | Description |
|--------|------|-------------|
| color_system | document | Complete color system specification |
| color_tokens | code | CSS custom properties and YAML tokens |
| contrast_report | document | WCAG verification for all critical pairs |
| von_restorff_map | document | Where accent appears and why |

## Quality Criteria

- Max 1 accent + 1 neutral (hard rule)
- WCAG AAA (7:1) for all CTAs — no exceptions
- Every color choice MUST cite neuropsychological rationale
- Dark mode MUST be redesigned (not inverted)
- Color-blindness safety MUST be verified
