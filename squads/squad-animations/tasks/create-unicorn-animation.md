# Task: create-unicorn-animation

## Metadata
- **Agent:** shader-artist (Fragment) | animations-orqx (Kinetic)
- **Complexity:** Medium
- **Dependencies:** Knowledge base `unicorn-studio-pipeline`

## Description

Create a WebGL animation using the Unicorn Studio template pipeline. Takes an image and optional brand context, selects/modifies a JSON template, and integrates into the target project.

## Inputs

| Input | Required | Description |
|-------|----------|-------------|
| `image` | YES | Path or URL to source image |
| `target_element` | YES | CSS selector or component name where animation renders |
| `effect_style` | NO | Desired effect (ascii, halftone, gradient, etc.) — auto-recommended if omitted |
| `brand_context` | NO | Brand colors, tone, positioning — informs parameter selection |
| `colors` | NO | Duotone color pair (shadow, highlight) — derived from brand if omitted |
| `responsive` | NO | Breakpoint overrides (default: auto Desktop/Tablet/Mobile) |

## Steps

### 1. Analyze Image
- Read image dimensions (naturalWidth, naturalHeight)
- Assess contrast, complexity, subject type
- Recommend effect style if not specified

### 2. Select Template
- Match effect_style to available JSON templates
- Default: ASCII halftone (most versatile)

### 3. Modify JSON
- Swap `src`, `naturalWidth`, `naturalHeight` in image layer
- If brand_context provided: adjust duotone colors, speed, mouse tracking
- If colors provided: replace GLSL vec3 values in duotone shader
- Set responsive breakpoints

### 4. Integrate
- Save modified JSON to project's `public/scenes/` directory
- Create or update React component with UnicornStudio SDK loader
- Add SDK script to layout (if not already present)
- Verify rendering in browser

## Output

- Modified scene JSON file
- React component with SDK integration
- Working animation in browser

## Quality Checklist

- [ ] Animation renders without errors
- [ ] Image displays correctly through effect stack
- [ ] Mouse tracking works on desktop
- [ ] Responsive breakpoints set for tablet/mobile
- [ ] Colors match brand system (if brand_context provided)
- [ ] Performance acceptable (target: 60fps desktop, 30fps mobile)
- [ ] Lazy loading enabled for below-fold placements
- [ ] prefers-reduced-motion respected
