---
task: build-sdf-visualization
responsavel: "@shader-artist"
responsavel_type: Agent
atomic_layer: Task
elicit: false

Entrada:
  - campo: sdf_spec
    tipo: object
    origem: "animation_brief"
    obrigatorio: true

Saida:
  - campo: sdf_shader
    tipo: code
    destino: "threejs-architect"

Checklist:
  - "[ ] Implementar SDFs primitivos necessarios"
  - "[ ] Aplicar operacoes booleanas (union, subtraction, intersection)"
  - "[ ] Implementar ray marching loop"
  - "[ ] Calcular normais e iluminacao"
  - "[ ] Adicionar smooth blending entre formas"
  - "[ ] Animar morfologia com time"
---

# Task: Build SDF Visualization

## Metadata
- **Agent:** shader-artist (Fragment)
- **Squad:** squad-animations
- **Complexity:** HIGH

## Objetivo
Criar visualizacoes usando Signed Distance Functions — formas 3D procedurais renderizadas via ray marching, sem geometria mesh. Permite formas organicas, smooth morphing e operacoes booleanas impossveis com mesh tradicional.

## Pre-Conditions
- Formas desejadas definidas (esferas, boxes, toruses, combinacoes)
- Estilo visual (realista, stylized, wireframe, glow)
- Animation type (morph, rotate, pulse)
- Performance target (ray marching e GPU-intensive)

## Passos

### 1. Implementar SDF Primitivos
```glsl
float sdSphere(vec3 p, float r) {
  return length(p) - r;
}
float sdBox(vec3 p, vec3 b) {
  vec3 q = abs(p) - b;
  return length(max(q, 0.0)) + min(max(q.x, max(q.y, q.z)), 0.0);
}
float sdTorus(vec3 p, vec2 t) {
  vec2 q = vec2(length(p.xz) - t.x, p.y);
  return length(q) - t.y;
}
```

### 2. Implementar Operacoes Booleanas
```glsl
float opUnion(float d1, float d2) { return min(d1, d2); }
float opSubtraction(float d1, float d2) { return max(-d1, d2); }
float opIntersection(float d1, float d2) { return max(d1, d2); }
// Smooth union - organic blending
float opSmoothUnion(float d1, float d2, float k) {
  float h = clamp(0.5 + 0.5 * (d2 - d1) / k, 0.0, 1.0);
  return mix(d2, d1, h) - k * h * (1.0 - h);
}
```

### 3. Implementar Scene SDF
```glsl
float sceneSDF(vec3 p) {
  float sphere = sdSphere(p - vec3(0.0, 0.0, 0.0), 0.5);
  float box = sdBox(p - vec3(1.0, 0.0, 0.0), vec3(0.3));
  return opSmoothUnion(sphere, box, 0.3);
}
```

### 4. Implementar Ray Marching
```glsl
float rayMarch(vec3 ro, vec3 rd) {
  float t = 0.0;
  for (int i = 0; i < 100; i++) {
    vec3 p = ro + rd * t;
    float d = sceneSDF(p);
    if (d < 0.001) break;
    if (t > 20.0) break;
    t += d;
  }
  return t;
}
```

### 5. Calcular Normais
```glsl
vec3 calcNormal(vec3 p) {
  vec2 e = vec2(0.001, 0.0);
  return normalize(vec3(
    sceneSDF(p + e.xyy) - sceneSDF(p - e.xyy),
    sceneSDF(p + e.yxy) - sceneSDF(p - e.yxy),
    sceneSDF(p + e.yyx) - sceneSDF(p - e.yyx)
  ));
}
```

### 6. Implementar Iluminacao
```glsl
vec3 lighting(vec3 p, vec3 normal, vec3 rd) {
  vec3 lightDir = normalize(vec3(1.0, 1.0, -1.0));
  float diff = max(dot(normal, lightDir), 0.0);
  float spec = pow(max(dot(reflect(-lightDir, normal), -rd), 0.0), 32.0);
  vec3 ambient = vec3(0.1);
  return ambient + diff * vec3(0.8) + spec * vec3(0.3);
}
```

### 7. Animar com Time
```glsl
float sceneSDF(vec3 p) {
  // Morph between shapes
  float t = sin(uTime * 0.5) * 0.5 + 0.5;
  float sphere = sdSphere(p, 0.5);
  float box = sdBox(p, vec3(0.4));
  return mix(sphere, box, t);
}
```

### 8. Configurar Camera
```glsl
void main() {
  vec2 uv = (gl_FragCoord.xy - 0.5 * uResolution) / uResolution.y;
  vec3 ro = vec3(0.0, 0.0, 3.0); // Camera position
  vec3 rd = normalize(vec3(uv, -1.0)); // Ray direction
  float t = rayMarch(ro, rd);
  // Render
}
```

### 9. Adicionar Post Effects (AO, Glow)
```glsl
// Simple AO
float ao = 0.0;
for (int i = 0; i < 5; i++) {
  float h = 0.01 + 0.12 * float(i);
  ao += (h - sceneSDF(p + normal * h));
}
ao = clamp(1.0 - ao, 0.0, 1.0);
```

### 10. Otimizar Ray Marching
- Max steps: 64-100 (mais = mais lento)
- Early exit distance: 20.0 (ajustar por cena)
- Hit threshold: 0.001 (0.01 para mobile)
- Render em resolucao menor e upscale se necessario
- Mobile: reduzir max steps para 48

## Output
- Fragment shader completo com ray marching
- SDF scene com primitivos e operacoes
- Iluminacao e normais calculados
- Animacao temporal (morph, rotation)
- Camera setup e controls
- Performance notes para mobile

## Quality Criteria
- [ ] Ray marching converge sem artifacts
- [ ] Normais corretas (iluminacao realista)
- [ ] Smooth union sem descontinuidades
- [ ] Morph animation fluida
- [ ] 30fps minimo em GPU integrada
- [ ] Sem banding em gradients de iluminacao
- [ ] Camera responsiva ao resize
- [ ] Max steps otimizado por complexidade da cena
