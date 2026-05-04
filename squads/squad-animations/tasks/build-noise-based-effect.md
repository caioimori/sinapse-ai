---
task: build-noise-based-effect
responsavel: "@shader-artist"
responsavel_type: Agent
atomic_layer: Task
elicit: false

Entrada:
  - campo: effect_spec
    tipo: object
    origem: "animation_brief"
    obrigatorio: true

Saida:
  - campo: noise_shader
    tipo: code
    destino: "threejs-architect ou generative-particle-engineer"

Checklist:
  - "[ ] Selecionar tipo de noise (Perlin, Simplex, Worley, Value)"
  - "[ ] Implementar FBM com octaves configuravel"
  - "[ ] Adicionar domain warping se necessario"
  - "[ ] Animar com time uniform"
  - "[ ] Mapear output para efeito desejado"
---

# Task: Build Noise-Based Effect

## Metadata
- **Agent:** shader-artist (Fragment)
- **Squad:** squad-animations
- **Complexity:** MEDIUM

## Objetivo
Criar efeitos visuais baseados em noise functions — backgrounds organicos, terrain generation, displacement, fog, e texturas procedurais. Noise e a base de quase todo efeito generativo.

## Pre-Conditions
- Tipo de efeito visual desejado definido no brief
- Dimensao: 2D (background/texture) ou 3D (volume/displacement)
- Performance target (fullscreen noise e GPU-intensive)
- Color palette ou mapping definido

## Passos

### 1. Selecionar Tipo de Noise
| Tipo | Caracteristica | Melhor Para |
|------|---------------|-------------|
| Perlin | Suave, gradiente | Terrain, clouds, displacement |
| Simplex | Perlin otimizado, menos artifacts | Default para 3D+, mobile |
| Worley (Cellular) | Celulas, voronoi-like | Celulas organicas, caustics, cracks |
| Value | Blocky, rapido | Low-fi effects, base para FBM |
| Curl | Divergence-free | Flow fields, particulas |

### 2. Implementar Noise Base (Simplex 2D)
```glsl
// Simplex noise - incluir como funcao utility
vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec3 permute(vec3 x) { return mod289(((x * 34.0) + 1.0) * x); }
// ... (full simplex implementation)
float snoise(vec2 v) { /* ... */ }
```

### 3. Implementar FBM (Fractal Brownian Motion)
```glsl
float fbm(vec2 p, int octaves) {
  float value = 0.0;
  float amplitude = 0.5;
  float frequency = 1.0;
  for (int i = 0; i < octaves; i++) {
    value += amplitude * snoise(p * frequency);
    frequency *= 2.0;
    amplitude *= 0.5;
  }
  return value;
}
```

### 4. Implementar Domain Warping
```glsl
// Warp coordinates using noise to create organic distortion
vec2 warp(vec2 p, float time) {
  vec2 q = vec2(
    fbm(p + vec2(0.0, 0.0), 4),
    fbm(p + vec2(5.2, 1.3), 4)
  );
  vec2 r = vec2(
    fbm(p + 4.0 * q + vec2(1.7, 9.2) + 0.15 * time, 4),
    fbm(p + 4.0 * q + vec2(8.3, 2.8) + 0.126 * time, 4)
  );
  return r;
}
```

### 5. Animar com Time
```glsl
uniform float uTime;
void main() {
  vec2 uv = vUv * 3.0; // Scale
  float n = fbm(uv + uTime * 0.1, 6);
  // Map noise to visual
}
```

### 6. Mapear Noise para Visual
| Mapping | Resultado |
|---------|----------|
| `mix(colorA, colorB, n)` | Color gradient |
| `step(threshold, n)` | Binary mask |
| `smoothstep(a, b, n)` | Soft threshold |
| Vertex `position += normal * n` | Surface displacement |
| `vec2(n1, n2)` como offset UV | Distortion effect |

### 7. Configurar Parametros via Uniforms
```glsl
uniform float uScale;     // Noise scale (1.0-10.0)
uniform float uSpeed;     // Animation speed (0.01-0.5)
uniform int uOctaves;     // FBM detail (1-8)
uniform float uIntensity; // Effect strength (0.0-1.0)
```

### 8. Implementar Worley Noise (Cellular)
```glsl
float worley(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  float minDist = 1.0;
  for (int y = -1; y <= 1; y++) {
    for (int x = -1; x <= 1; x++) {
      vec2 neighbor = vec2(float(x), float(y));
      vec2 point = hash22(i + neighbor);
      float dist = length(neighbor + point - f);
      minDist = min(minDist, dist);
    }
  }
  return minDist;
}
```

### 9. Otimizar para Performance
- Reduzir octaves em mobile (4 max vs 8 desktop)
- Pre-compute noise em texture (bake para casos estaticos)
- Usar noise texture lookup em vez de procedural quando possivel
- Lower resolution render target para fullscreen effects

### 10. Combinar Noise Types
- Layer Perlin + Worley para efeitos complexos
- Use noise como mascara para misturar outros efeitos
- Domain warp com diferentes noise types para cada layer

## Output
- GLSL shader com noise functions implementadas
- FBM configuravel (octaves, amplitude, frequency)
- Domain warping se solicitado
- Uniforms para controle em runtime
- Fallback de octaves para mobile
- Documentacao de parametros e ranges

## Quality Criteria
- [ ] Noise suave sem artifacts visiveis
- [ ] FBM octaves configuravel via uniform
- [ ] Animacao temporal fluida (sem pulos)
- [ ] 60fps em desktop, 30fps em mobile
- [ ] Domain warping organico (sem patterns repetitivos)
- [ ] Color mapping correto (sem banding)
- [ ] Parametros documentados com ranges
- [ ] Funciona em WebGL1 e WebGL2
