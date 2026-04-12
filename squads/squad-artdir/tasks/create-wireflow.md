# Task: Create Wireflow

## Metadata
- **ID:** create-wireflow
- **Version:** 1.0.0
- **Agent:** ia-architect (Flow), layout-engineer (Grid) contributes
- **Squad:** squad-artdir

## Description

Create an annotated wireflow with the cognitive role of each section, psychological justification for the sequence, and layout specifications. This is a strategic document — not a visual wireframe.

## Inputs

| Input | Type | Required | Description |
|-------|------|----------|-------------|
| art_direction_brief | object | required | Visual language and IA decisions |
| content_inventory | array | optional | Available content blocks and copy |
| project_type | string | required | landing_page, website, campaign, product_page |
| objective | string | required | Primary conversion objective |

## Steps

1. **define-cognitive-journey**
   - Map the ideal cognitive sequence for the objective
   - Select cognitive roles per section (HOOK, PROMISE, PROOF, etc.)
   - Justify sequence with retention principles

2. **plan-progressive-disclosure**
   - Define what shows at L1 (scan), L2 (skim), L3 (read), L4 (deep dive)
   - Identify expandable content areas
   - Plan reveal triggers (scroll, click, hover)

3. **insert-retention-devices**
   - Place Zeigarnik loops (incomplete patterns that drive scroll)
   - Create curiosity gaps between sections
   - Identify peak moment position
   - Design end moment (footer) with value

4. **plan-self-qualification**
   - Identify where audience self-selects
   - Design persona match or use case tabs
   - Position qualification before hard sell

5. **define-section-layout** (Grid)
   - Full-bleed vs contained per section
   - Column distribution per section
   - Spacing between sections (pacing)
   - Responsive behavior per section

6. **position-cta-flow**
   - Primary CTA position (above fold)
   - Secondary CTA positions (mid-page, contextual)
   - Sticky CTA trigger point
   - Final CTA section design

7. **annotate-wireflow**
   - For each section: cognitive role + principle + content + layout + motion + CTA
   - Add transition rationale between sections
   - Mark scroll depth expectations

8. **validate-flow**
   - Read wireflow as narrative — does it build to conversion?
   - Check: can user convert at any point?
   - Check: are objections resolved before final CTA?
   - Estimate scroll depth at each CTA

## Outputs

| Output | Type | Description |
|--------|------|-------------|
| wireflow | document | Annotated Wireflow (Deliverable 4) with all sections |
| section_roles | array | Mapping of sections to cognitive roles |
| retention_map | document | All retention devices with positions |
| cta_flow | document | CTA positions with intent levels |

## Quality Criteria

- Every section MUST have a documented cognitive role
- Section sequence MUST be justified by psychological principle
- Progressive disclosure MUST be explicit (what shows at each level)
- At least 2 Zeigarnik loops identified
- Peak moment MUST be mid-page, not first or last
- All CTAs MUST be positioned with conversion rationale
