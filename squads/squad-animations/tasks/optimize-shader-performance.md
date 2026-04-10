---
task: optimize-shader-performance
responsavel: "@shader-artist"
responsavel_type: Agent
atomic_layer: Task
elicit: false

Entrada:
  - campo: shader_code
    tipo: code
    origem: "qualquer task de shader"
    obrigatorio: true

Saida:
  - campo: optimized_shader
    tipo: code
    destino: "animation-performance-engineer"

Checklist:
  - "[ ] Eliminar branches desnecessarios"
  - "[ ] Substituir por step/smoothstep/mix"
  - "[ ] Pre-computar valores constantes"
  - "[ ] Reduzir texture lookups"
  - "[ ] Usar lowp/mediump onde possivel"
  - "[ ] Verificar overdraw"
  - "[ ] Testar em mobile GPU"
---

# Task: Optimize Shader Performance

## Metadata
- **Agent:** shader-artist (Fragment)
- **Squad:** squad-animations
- **Complexity:** MEDIUM

## Objetivo
Otimizar shaders GLSL para performance maxima — eliminar branches, reduzir ALU operations, minimizar texture lookups, ajustar precision e garantir 60fps em desktop e 30fps em mobile.

## Pre-Conditions
- Shader funcional entregue por outra task
- Performance baseline medida (FPS atual)
- Target devices definidos (desktop, mobile, GPU integrada)
- Aceitavel vs inaceitavel visual degradation definida

## Passos

### 1. Auditar Shader Atual
| Metrica | Como Medir | Target |
|---------|-----------|--------|
| FPS | Chrome DevTools Performance | 60fps desktop, 30fps mobile |
| Draw calls | Three.js renderer.info | Minimo possivel |
| Texture lookups | Contar texture2D() calls | < 4 por fragment |
| Branch count | Contar if/else | 0 (usar step/mix) |
| Loop iterations | Contar for loops | Minimo necessario |

### 2. Eliminar Branches
```glsl
// RUIM - branch
if (x > 0.5) { color = red; } else { color = blue; }

// BOM - branchless
color = mix(blue, red, step(0.5, x));
```

### 3. Otimizar Operacoes Matematicas
| Operacao Cara | Alternativa Barata |
|---------------|-------------------|
| `pow(x, 2.0)` | `x * x` |
| `length(v)` (para comparacao) | `dot(v, v)` |
| `mod(x, y)` | `x - y * floor(x / y)` |
| `sin(x)` repetido | Cache em variavel |
| `normalize(v)` repetido | Calcular uma vez |

### 4. Reduzir Texture Lookups
```glsl
// RUIM - 3 lookups da mesma textura
float r = texture2D(tex, uv + offset).r;
float g = texture2D(tex, uv).g;
float b = texture2D(tex, uv - offset).b;

// MELHOR - 2 lookups (se offset pequeno)
vec4 center = texture2D(tex, uv);
vec4 shifted = texture2D(tex, uv + offset);
vec3 color = vec3(shifted.r, center.g, center.b); // Approximation
```

### 5. Ajustar Precision
```glsl
precision mediump float; // Default - suficiente para maioria
// Use highp apenas para:
// - UV calculations com zoom extremo
// - Depth/shadow computations
// - Acumulos de tempo longos
```

### 6. Otimizar Loops
```glsl
// RUIM - loop dinamico
for (int i = 0; i < uOctaves; i++) { ... }

// MELHOR - unroll com limite fixo
#define MAX_OCTAVES 6
for (int i = 0; i < MAX_OCTAVES; i++) {
  if (i >= uOctaves) break; // Compilador pode otimizar
  // ...
}
```

### 7. Reduzir Resolucao de Render
```javascript
// Render em resolucao menor para efeitos fullscreen
const renderTarget = new THREE.WebGLRenderTarget(
  window.innerWidth * 0.5,  // Half resolution
  window.innerHeight * 0.5
);
// Upscale com bilinear filtering
```

### 8. Pre-Computar no Vertex Shader
```glsl
// Mover calculos por-vertex do fragment para vertex
// VERTEX:
varying float vFresnel;
void main() {
  vec3 viewDir = normalize(cameraPosition - worldPosition);
  vFresnel = pow(1.0 - dot(viewDir, normal), 3.0);
}
// FRAGMENT usa vFresnel (interpolado, nao calculado)
```

### 9. Implementar LOD para Shaders
| Distancia/Device | Shader Version |
|-----------------|----------------|
| Close/Desktop | Full quality (all effects) |
| Medium | Reduced octaves, simpler lighting |
| Far/Mobile | Minimal (no post-effects, flat shading) |

### 10. Profiling Final
- Spector.js para GPU profiling detalhado
- Chrome DevTools > Performance > GPU rasterize
- Comparar antes/depois com metricas
- Documentar tradeoffs visuais aceitos

## Output
- Shader otimizado com mesma funcionalidade visual
- Documentacao de otimizacoes aplicadas
- Before/after FPS comparison
- Mobile-specific version se necessario
- Precision adjustments documentados
- LOD variants se aplicavel

## Quality Criteria
- [ ] 60fps em desktop GPU dedicada
- [ ] 30fps em mobile / GPU integrada
- [ ] Zero branches condicionais no fragment shader
- [ ] Precision mediump como default
- [ ] Texture lookups minimizados (< 4 por fragment)
- [ ] Calculos movidos para vertex shader onde possivel
- [ ] Nenhuma regressao visual perceptivel em desktop
- [ ] Documentacao de tradeoffs visuais em mobile
