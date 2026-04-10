---
task: implement-transition-shader
responsavel: "@shader-artist"
responsavel_type: Agent
atomic_layer: Task
elicit: false

Entrada:
  - campo: transition_spec
    tipo: object
    origem: "scroll-narrative-engineer ou animation_brief"
    obrigatorio: true

Saida:
  - campo: transition_shader
    tipo: code
    destino: "scroll-narrative-engineer ou css-motion-artist"

Checklist:
  - "[ ] Definir progress uniform (0 a 1)"
  - "[ ] Implementar pattern de transicao (noise, geometric, directional)"
  - "[ ] Adicionar textura de transicao se necessario"
  - "[ ] Configurar edge softness"
  - "[ ] Testar com conteudos reais"
---

# Task: Implement Transition Shader

## Metadata
- **Agent:** shader-artist (Fragment)
- **Squad:** squad-animations
- **Complexity:** MEDIUM

## Objetivo
Criar shaders de transicao entre dois estados visuais — dissolve, wipe, noise-based reveal, geometric patterns. Controlados por um uniform de progress (0 a 1) para integracao com scroll, click ou timeline.

## Pre-Conditions
- Dois estados visuais definidos (imagem A/B, cor A/B, cena A/B)
- Tipo de transicao desejado no brief
- Driver do progress (scroll position, timeline, click)
- Edge softness preference (hard cut vs soft blend)

## Passos

### 1. Classificar Tipo de Transicao
| Tipo | Visual | Complexidade |
|------|--------|-------------|
| Fade/dissolve | Crossfade simples | Baixa |
| Directional wipe | Left-to-right, top-to-bottom | Baixa |
| Noise dissolve | Organic dissolve pattern | Media |
| Geometric | Circles, hexagons, diamonds | Media |
| Texture-based | Custom grayscale mask | Alta |
| Morph | Distortion + dissolve | Alta |

### 2. Implementar Progress Uniform
```glsl
uniform float uProgress; // 0.0 = state A, 1.0 = state B
uniform float uEdge;     // Edge softness (0.01 = hard, 0.2 = soft)
```

### 3. Implementar Fade Dissolve
```glsl
void main() {
  vec4 colorA = texture2D(uTextureA, vUv);
  vec4 colorB = texture2D(uTextureB, vUv);
  gl_FragColor = mix(colorA, colorB, uProgress);
}
```

### 4. Implementar Directional Wipe
```glsl
void main() {
  vec4 colorA = texture2D(uTextureA, vUv);
  vec4 colorB = texture2D(uTextureB, vUv);
  float mask = smoothstep(uProgress - uEdge, uProgress + uEdge, vUv.x);
  gl_FragColor = mix(colorA, colorB, mask);
}
```

### 5. Implementar Noise Dissolve
```glsl
uniform sampler2D uNoiseTexture;

void main() {
  vec4 colorA = texture2D(uTextureA, vUv);
  vec4 colorB = texture2D(uTextureB, vUv);
  float noise = texture2D(uNoiseTexture, vUv).r;
  float mask = smoothstep(uProgress - uEdge, uProgress + uEdge, noise);
  gl_FragColor = mix(colorA, colorB, mask);
}
```

### 6. Implementar Geometric Pattern
```glsl
// Circle wipe from center
float dist = distance(vUv, vec2(0.5));
float mask = smoothstep(uProgress * 0.75 - uEdge, uProgress * 0.75 + uEdge, dist);
gl_FragColor = mix(colorB, colorA, mask);
```

### 7. Adicionar Edge Glow
```glsl
// Highlight at transition edge
float edgeGlow = smoothstep(uEdge, 0.0, abs(noise - uProgress));
vec3 glowColor = vec3(1.0, 0.8, 0.2);
color.rgb += glowColor * edgeGlow * 0.5;
```

### 8. Integrar com ScrollTrigger / Timeline
```javascript
// GSAP ScrollTrigger
gsap.to(material.uniforms.uProgress, {
  value: 1,
  scrollTrigger: {
    trigger: '.section',
    start: 'top center',
    end: 'bottom center',
    scrub: 1,
  }
});
```

### 9. Criar Texture de Transicao Custom
- Grayscale image onde branco = transiciona primeiro
- Gerar com noise, gradients ou patterns geometricos
- 256x256 sufficient para maioria dos casos

### 10. Performance e Fallback
- Transicao shader e leve (2 texture lookups + math)
- Mobile: funciona bem, sem necessidade de reduzir qualidade
- Fallback CSS: `opacity` crossfade ou `clip-path` wipe
- Pre-carregar ambas texturas antes de iniciar

## Output
- Fragment shader com transition logic
- Progress uniform (0-1) integration
- Noise/pattern texture se necessario
- ScrollTrigger ou timeline hookup
- Edge softness configuravel
- CSS fallback para sem WebGL

## Quality Criteria
- [ ] Progress 0 = estado A puro, 1 = estado B puro
- [ ] Transicao suave sem artifacts em qualquer progress value
- [ ] Edge softness configuravel (uEdge uniform)
- [ ] 60fps durante scroll-driven transition
- [ ] Noise texture nao mostra tiling visivel
- [ ] Funciona com qualquer par de texturas
- [ ] Fallback CSS disponivel
- [ ] Transition reversivel (scroll back funciona)
