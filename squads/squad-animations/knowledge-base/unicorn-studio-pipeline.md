# Unicorn Studio Pipeline — Template-Based WebGL Animation Creation

## Overview

Pipeline programatico para criar animacoes WebGL usando Unicorn Studio JSON templates,
sem depender do editor visual. Claude Code pode gerar, modificar e integrar animacoes
diretamente via manipulacao de JSON + SDK embed.

## Architecture

```
Image Input → Template Selection → JSON Modification → SDK Render
     ↑              ↑                    ↑                ↑
  User sends    Based on image     Swap image/colors   UnicornStudio.addScene()
  any image     + brand context    + parameters        via filePath
```

## Endpoints (Public, No Auth)

| Purpose | URL Pattern |
|---------|-------------|
| Scene data (dev) | `https://storage.googleapis.com/unicornstudio-production/embeds/{projectId}` |
| Scene data (CDN) | `https://assets.unicorn.studio/embeds/{projectId}` |
| Image assets | `https://assets.unicorn.studio/images/{userId}/{filename}` |
| Media assets | `https://assets.unicorn.studio/media/{filename}` |

## Scene JSON Format

```json
{
  "history": [<layers>],
  "options": {
    "name": "string",
    "fps": 60,
    "dpi": 1.5,
    "scale": 1,
    "includeLogo": false,
    "isProduction": false,
    "freePlan": false
  },
  "version": "1.4.33",
  "id": "projectId"
}
```

## Layer Types

| layerType | type (for effects) | Description |
|-----------|-------------------|-------------|
| `effect` | `gradient` | Background gradient |
| `effect` | `mouse` | Mouse tracking distortion |
| `effect` | `blinds` | Line/stripe pattern overlay |
| `effect` | `progressiveBlur` | Gradient-masked blur |
| `effect` | `duotone` | Two-tone color reduction |
| `effect` | `ascii` | ASCII/dot-matrix character grid |
| `effect` | `noise` | Noise-based effects |
| `effect` | `displacement` | Displacement mapping |
| `image` | — | Image layer with src URL |
| `text` | — | Text layer |
| `shape` | — | Vector shape |
| `model` | — | 3D model (v2+) |

## Key Layer Properties

```yaml
# Common to all layers
visible: boolean
opacity: number (0-1)
blendMode: "NORMAL" | "MULTIPLY" | "SCREEN" | etc.
speed: number
trackMouse: number (0 = off)
trackAxes: "xy" | "x" | "y"
mouseMomentum: number
breakpoints: [{name, min, max, props}]
states: {appear: [], scroll: [], hover: []}

# Image layers
src: "URL to image"
naturalWidth: number (original image width in px)
naturalHeight: number (original image height in px)
width: number
height: number
left: number (0-1 relative)
top: number (0-1 relative)

# Effect layers
compiledFragmentShaders: ["GLSL code"]
compiledVertexShaders: ["GLSL code"]
data:
  uniforms: {paramName: {name, type, value}}
  isBackground: boolean
  texture: {src, sampler}  # optional sprite/texture
```

## Image Swap Protocol

To replace the image in a template, modify these 3 fields in the `layerType: "image"` layer:

```json
{
  "src": "/path/to/new/image.png",
  "naturalWidth": 1920,
  "naturalHeight": 1080
}
```

The shader effects stack applies identically regardless of image content.

## Color Modification in GLSL

### Duotone colors
In the duotone layer's `compiledFragmentShaders`, find and replace:
- `vec3(0, 0, 0)` → shadow color (dark)
- `vec3(1, 1, 1)` → highlight color (light)

Values are normalized RGB (0-1). To convert from hex:
- `#1A1A1A` → `vec3(0.102, 0.102, 0.102)`
- `#F4F1EC` → `vec3(0.957, 0.945, 0.925)`

### Gradient colors
In the gradient layer's `compiledFragmentShaders`, replace `getColor` return values.

## SDK Integration

### Script tag (vanilla)
```html
<script src="https://cdn.jsdelivr.net/gh/hiunicornstudio/unicornstudio.js@v1.4.20/dist/unicornStudio.umd.js"></script>
```

### Dynamic loading (React/Next.js)
```jsx
UnicornStudio.addScene({
  elementId: "container-id",
  filePath: "/scenes/animation.json",  // Local JSON, NOT projectId
  fps: 60,
  scale: 1,
  dpi: 1.5,
  lazyLoad: true,
  interactivity: { mouse: { disableMobile: false } }
})
```

### HTML attribute method
```html
<div data-us-project-src="/scenes/animation.json"></div>
```

### React package
```bash
npm install unicornstudio-react
# or
npm install @nicekiwi/unicorn-studio-react
```

## Reference Effect Stacks

### ASCII Halftone (from NYO reference)
```
Layer 0: gradient          → white background
Layer 1: image             → source photo
Layer 2: mouse             → cursor tracking (radius: 0.43)
Layer 3: blinds            → line pattern (freq: 0.01, gradient: 0.59)
Layer 4: progressiveBlur   → gradient blur (amount: 1.286, angle: 0.0459)
Layer 5: duotone           → B&W reduction
Layer 6: ascii             → character grid (scale: 0.308 desktop)
```

## Brand-Aware Parameter Mapping

| Brand Attribute | Parameter | Value Range |
|----------------|-----------|-------------|
| Premium/luxury | ASCII scale | 0.1-0.2 (smaller dots) |
| Playful/bold | ASCII scale | 0.3-0.5 (bigger dots) |
| Subtle/elegant | Mouse tracking | 0-0.2 |
| Interactive/fun | Mouse tracking | 0.3-0.6 |
| Slow/confident | Speed | 0.1-0.3 |
| Energetic | Speed | 0.5-1.0 |
| Clean/minimal | Blur amount | 0.5-1.0 |
| Mysterious | Blur amount | 1.5-3.0 |
| Monochrome | Duotone | black + white |
| Brand-colored | Duotone | brand dark + brand light |

## Template Collection Strategy

To expand the template library:
1. Find public Unicorn Studio scenes (any published embed)
2. Extract projectId from `data-us-project` attribute
3. Fetch JSON from public endpoint
4. Catalog the effect stack and parameters
5. Store as named template

## Limitations

- GLSL shaders are pre-compiled; creating truly new effects requires writing GLSL from scratch
- Image assets must be accessible via URL (local file paths work in dev, need hosting in prod)
- The SDK is ~150KB — consider lazy loading for performance
- Canvas rendering uses GPU; mobile devices may need reduced quality (`scale: 0.5`)
