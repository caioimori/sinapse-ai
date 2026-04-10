# Task: identify-website-animation

## Metadata
- **Agent:** animation-interpreter (Lens) | animations-orqx (Kinetic)
- **Complexity:** Medium
- **Dependencies:** Chrome DevTools MCP (or CDP via websockets)

## Description

Analyze any website URL and identify 100% of animation technologies, libraries, and implementation details used. Reverse-engineer the animation stack to enable replication.

## Inputs

| Input | Required | Description |
|-------|----------|-------------|
| `url` | YES | Website URL to analyze |
| `section` | NO | Specific section/selector to focus on |
| `depth` | NO | `quick` (libs only), `full` (libs + params + assets) |

## Steps

### 1. Load Page
- Navigate to URL via Chrome DevTools MCP or CDP websockets
- Wait for full page load (including lazy-loaded content)
- Take initial screenshot for reference

### 2. Detect Animation Libraries
Scan for these in scripts, globals, and DOM:

| Library | Detection Method |
|---------|-----------------|
| GSAP | `window.gsap`, script src containing `gsap` |
| Framer Motion | `data-framer-*` attributes, `motion.` components |
| Lottie | `lottie-player` elements, `bodymovin` |
| Three.js | `window.THREE`, canvas with WebGL context |
| Unicorn Studio | `data-us-project` attribute, `UnicornStudio` global |
| Spline | `spline-viewer` element, spline runtime |
| Rive | `rive-canvas`, `.riv` file loads |
| Anime.js | `window.anime` |
| ScrollTrigger | `ScrollTrigger` in GSAP plugins |
| Lenis | `window.Lenis`, lenis script |
| Swiper | `swiper-container`, `Swiper` global |
| PixiJS | `PIXI` global |
| p5.js | `p5` global |
| Babylon.js | `BABYLON` global |
| WebGL raw | Canvas with `webgl`/`webgl2` context, no lib |

### 3. Extract Animation Details (depth: full)
For each detected animation:

**If Unicorn Studio:**
- Extract projectId from `data-us-project`
- Fetch scene JSON from public endpoint
- Parse layer stack (effect types, images, parameters)
- Save JSON locally

**If GSAP:**
- Find ScrollTrigger pins, tweens, timelines
- Extract easing functions, durations, targets

**If Lottie:**
- Extract animation JSON URL
- Download animation data

**If Three.js:**
- Identify scene type (particles, models, shaders)
- Extract shader code if accessible

**If Canvas-based (unknown):**
- Check for known library patterns
- Capture animation frames for visual analysis
- Inspect JS for animation loop patterns

### 4. Capture Assets
- Download images, spritesheets, SVGs used in animations
- Save shader code (GLSL) if accessible
- Record animation parameters (timing, easing, colors)

### 5. Generate Report

```yaml
url: "https://example.com"
section: "#hero"
libraries:
  - name: "Unicorn Studio"
    version: "1.4.20"
    elements: [".hero-animation"]
    details:
      projectId: "abc123"
      layers: ["gradient", "image", "mouse", "ascii"]
      scene_json: "saved to ./captured/scene.json"
animations:
  - element: ".hero-animation"
    type: "webgl-shader"
    library: "Unicorn Studio"
    effect_stack: ["gradient", "image", "mouse", "blinds", "progressiveBlur", "duotone", "ascii"]
    parameters:
      ascii_scale: 0.308
      mouse_radius: 0.43
    assets:
      - "image.png (1083x1030)"
      - "ascii_spritesheet_larger.png"
    replicable: true
    replication_method: "template-based JSON modification"
```

## Output

- Animation identification report (YAML)
- Captured scene data (JSON files)
- Downloaded assets (images, sprites)
- Replication assessment (can we clone it? how?)

## Quality Checklist

- [ ] All animation libraries detected
- [ ] No false positives (library detected but not used for animation)
- [ ] Scene data captured for replicable animations
- [ ] Assets downloaded and accessible
- [ ] Report is actionable (another agent can use it to replicate)
