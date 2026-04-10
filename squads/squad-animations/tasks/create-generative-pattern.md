---
task: create-generative-pattern
responsavel: "@generative-particle-engineer"
responsavel_type: Agent
atomic_layer: Task
elicit: false

Entrada:
  - campo: pattern_spec
    tipo: object
    origem: "animation_brief"
    obrigatorio: true

Saida:
  - campo: generative_pattern
    tipo: code
    destino: "review-animation-quality"

Checklist:
  - "[ ] Selecionar algoritmo (noise, voronoi, L-system, reaction-diffusion)"
  - "[ ] Implementar com parametros configuráveis"
  - "[ ] Adicionar seed para reproducibilidade"
  - "[ ] Animar evolucao do pattern"
  - "[ ] Mapear para cores do brand system"
---

# Task: Create Generative Pattern

## Metadata
- **Agent:** generative-particle-engineer (Cloud)
- **Squad:** squad-animations
- **Complexity:** MEDIUM

## Objetivo
Criar patterns generativos animados usando algoritmos procedurais — noise, Voronoi, L-systems, reaction-diffusion, ou fractais. O pattern deve ser configuravel, reproduzivel via seed, animado e mapeado para o brand system.

## Pre-Conditions
- Tipo de pattern definido no brief (organic, geometric, cellular, branching)
- Cores do brand system disponiveis
- Canvas 2D ou WebGL context configurado
- Seed strategy definida (random vs fixed)
- Resolucao e aspect ratio do output

## Passos

### 1. Selecionar Algoritmo por Estetica
| Algoritmo | Visual | Complexidade | Uso |
|-----------|--------|-------------|-----|
| Perlin/Simplex noise | Organico, fluido | Baixa | Backgrounds, terrain |
| Voronoi diagram | Celular, mosaico | Media | Organic textures, glass |
| L-system | Branching, fractal | Media | Trees, networks, veins |
| Reaction-diffusion | Biological, Turing | Alta | Coral, fingerprint, organic |
| Delaunay triangulation | Geometric mesh | Media | Low-poly, crystal |
| Wave function collapse | Tiled, structured | Alta | Patterns, tile maps |
| Circle packing | Organic fill | Baixa | Infographics, abstract |

### 2. Implementar Noise Pattern
```javascript
// Multi-octave noise with domain warping
function warpedNoise(x, y, time) {
  const warpX = noise3D(x * 0.5, y * 0.5, time) * 2;
  const warpY = noise3D(x * 0.5 + 100, y * 0.5 + 100, time) * 2;
  return noise3D((x + warpX) * freq, (y + warpY) * freq, time * 0.3);
}

// Render as color field
for (let y = 0; y < height; y++) {
  for (let x = 0; x < width; x++) {
    const val = warpedNoise(x, y, time);
    const color = colorRamp(val); // Map [-1,1] to brand colors
    setPixel(x, y, color);
  }
}
```

### 3. Implementar Voronoi Pattern
```javascript
// Generate seed points
const seeds = Array.from({ length: numCells }, () => ({
  x: seededRandom() * width,
  y: seededRandom() * height,
  vx: (seededRandom() - 0.5) * speed, // Animated
  vy: (seededRandom() - 0.5) * speed,
}));

// For each pixel, find nearest seed (or use Fortune's algorithm for edges)
function voronoiValue(px, py, seeds) {
  let minDist = Infinity;
  let secondDist = Infinity;
  for (const s of seeds) {
    const d = Math.hypot(px - s.x, py - s.y);
    if (d < minDist) { secondDist = minDist; minDist = d; }
    else if (d < secondDist) { secondDist = d; }
  }
  return secondDist - minDist; // Edge detection
}
```

### 4. Implementar L-System
```javascript
const rules = {
  'F': 'FF+[+F-F-F]-[-F+F+F]', // Branching tree
};
function iterate(axiom, rules, iterations) {
  let current = axiom;
  for (let i = 0; i < iterations; i++) {
    current = current.split('').map(c => rules[c] || c).join('');
  }
  return current;
}
// Render with turtle graphics
function drawLSystem(ctx, instructions, stepSize, angle) {
  const stack = [];
  for (const char of instructions) {
    switch (char) {
      case 'F': ctx.lineTo(turtle.x += Math.cos(turtle.angle) * stepSize,
                            turtle.y += Math.sin(turtle.angle) * stepSize); break;
      case '+': turtle.angle += angle; break;
      case '-': turtle.angle -= angle; break;
      case '[': stack.push({ ...turtle }); break;
      case ']': Object.assign(turtle, stack.pop()); ctx.moveTo(turtle.x, turtle.y); break;
    }
  }
}
```

### 5. Implementar Reaction-Diffusion (Gray-Scott)
```javascript
// Two chemical concentrations: A and B
// dA/dt = Da * laplacian(A) - A*B*B + f*(1-A)
// dB/dt = Db * laplacian(B) + A*B*B - (k+f)*B
const Da = 1.0, Db = 0.5, f = 0.055, k = 0.062;

function step(gridA, gridB, nextA, nextB, w, h) {
  for (let y = 1; y < h - 1; y++) {
    for (let x = 1; x < w - 1; x++) {
      const i = y * w + x;
      const lapA = laplacian(gridA, x, y, w);
      const lapB = laplacian(gridB, x, y, w);
      const a = gridA[i], b = gridB[i];
      nextA[i] = a + (Da * lapA - a * b * b + f * (1 - a));
      nextB[i] = b + (Db * lapB + a * b * b - (k + f) * b);
    }
  }
}
```

### 6. Seed para Reproducibilidade
```javascript
// Seeded PRNG (mulberry32)
function mulberry32(seed) {
  return function() {
    let t = seed += 0x6D2B79F5;
    t = Math.imul(t ^ t >>> 15, t | 1);
    t ^= t + Math.imul(t ^ t >>> 7, t | 61);
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
}
const seededRandom = mulberry32(42); // Fixed seed = same pattern
```

### 7. Animar Evolucao do Pattern
| Tecnica | Aplicavel a | Efeito |
|---------|------------|--------|
| Time dimension no noise | Noise patterns | Morphing suave |
| Seed point movement | Voronoi | Celulas se movem |
| Growth iterations | L-system | Arvore crescendo |
| Simulation steps | Reaction-diffusion | Pattern emergindo |
| Parameter interpolation | Todos | Transicao entre estados |

### 8. Mapear Cores do Brand System
```javascript
function colorRamp(value, brandColors) {
  // value: 0-1, brandColors: array of hex
  const stops = brandColors.map((c, i) => ({
    pos: i / (brandColors.length - 1),
    color: hexToRgb(c),
  }));
  // Find two surrounding stops and interpolate
  for (let i = 0; i < stops.length - 1; i++) {
    if (value >= stops[i].pos && value <= stops[i+1].pos) {
      const t = (value - stops[i].pos) / (stops[i+1].pos - stops[i].pos);
      return lerpColor(stops[i].color, stops[i+1].color, t);
    }
  }
}
```

### 9. GPU Acceleration (Shader-Based)
- Para patterns em tempo real (noise, voronoi): implementar no fragment shader
- Reaction-diffusion: ping-pong FBOs para simulation
- L-systems: pre-compute em CPU, render em GPU
- Vantagem: resolucao full sem per-pixel CPU loop

### 10. Export e Reduced Motion
```javascript
// Export static frame as image
function exportPattern(canvas) {
  return canvas.toDataURL('image/png');
}

// Reduced motion: show final static pattern, skip evolution animation
if (prefersReducedMotion) {
  // Run algorithm to completion, render final state
  renderFinalState();
  return;
}
```

## Output
- Pattern generativo funcional com algoritmo selecionado
- Parametros configuraveis (seed, scale, colors, speed)
- Seed-based reproducibilidade
- Animacao de evolucao do pattern
- Cores mapeadas para brand system
- Export capability (static frame)
- Reduced motion variant

## Quality Criteria
- [ ] Algoritmo correto para estetica desejada
- [ ] Parametros configuraveis e documentados
- [ ] Seed fixa produz resultado identico
- [ ] Animacao de evolucao suave (sem pops)
- [ ] Cores do brand system aplicadas corretamente
- [ ] 60fps na resolucao target
- [ ] Sem artefatos visuais nas bordas
- [ ] Reduced motion: pattern estatico final
