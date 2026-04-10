---
task: build-flow-field
responsavel: "@generative-particle-engineer"
responsavel_type: Agent
atomic_layer: Task
elicit: false

Entrada:
  - campo: flow_spec
    tipo: object
    origem: "animation_brief"
    obrigatorio: true

Saida:
  - campo: flow_field
    tipo: code
    destino: "shader-artist"

Checklist:
  - "[ ] Gerar grid de vetores com noise"
  - "[ ] Configurar resolucao do grid"
  - "[ ] Implementar particulas que seguem o campo"
  - "[ ] Adicionar variacao temporal (evolucao)"
  - "[ ] Configurar interacao com mouse"
---

# Task: Build Flow Field

## Metadata
- **Agent:** generative-particle-engineer (Cloud)
- **Squad:** squad-animations
- **Complexity:** MEDIUM

## Objetivo
Criar um flow field (campo vetorial) baseado em noise que guia particulas por caminhos organicos e emergentes. Implementar grid de vetores, particulas que seguem o campo, variacao temporal e interacao com mouse.

## Pre-Conditions
- Canvas 2D ou Three.js scene configurada
- Quantidade de particulas definida (tipicamente 1K-50K)
- Noise library disponivel (simplex-noise, glsl-noise, ou custom)
- Estetica desejada definida (fluido, vento, magnetico, organico)

## Passos

### 1. Definir Grid de Vetores
```javascript
const cols = Math.ceil(width / cellSize);
const rows = Math.ceil(height / cellSize);
const field = new Float32Array(cols * rows * 2); // 2D vectors

function generateField(time) {
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      const angle = noise3D(x * scale, y * scale, time) * Math.PI * 2;
      const idx = (y * cols + x) * 2;
      field[idx]     = Math.cos(angle); // vx
      field[idx + 1] = Math.sin(angle); // vy
    }
  }
}
```

### 2. Configurar Noise Parameters
| Parametro | Range | Efeito |
|-----------|-------|--------|
| scale (frequency) | 0.001-0.01 | Baixo = curvas suaves, alto = caotico |
| octaves | 1-4 | Mais = mais detalhe fino |
| time increment | 0.001-0.01 | Velocidade da evolucao |
| amplitude | 0.5-2.0 | Quanto o campo influencia |
| lacunarity | 2.0 | Gap entre octaves |
| persistence | 0.5 | Peso de octaves superiores |

### 3. Implementar Particulas
```javascript
class FlowParticle {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.prevX = x;
    this.prevY = y;
    this.speed = 1 + Math.random() * 2;
    this.life = maxLife;
  }
  update(field, cols, cellSize) {
    const col = Math.floor(this.x / cellSize);
    const row = Math.floor(this.y / cellSize);
    const idx = (row * cols + col) * 2;
    const vx = field[idx];
    const vy = field[idx + 1];
    this.prevX = this.x;
    this.prevY = this.y;
    this.x += vx * this.speed;
    this.y += vy * this.speed;
    this.life--;
  }
}
```

### 4. Rendering (Canvas 2D)
```javascript
// Trail effect: semi-transparent overlay instead of clear
ctx.fillStyle = 'rgba(0, 0, 0, 0.02)'; // Low alpha = long trails
ctx.fillRect(0, 0, width, height);

particles.forEach(p => {
  ctx.beginPath();
  ctx.moveTo(p.prevX, p.prevY);
  ctx.lineTo(p.x, p.y);
  ctx.strokeStyle = `hsla(${p.hue}, 70%, 60%, ${p.life / maxLife})`;
  ctx.lineWidth = 1;
  ctx.stroke();
});
```

### 5. Rendering (Three.js / WebGL)
```javascript
// Store positions in BufferGeometry, update per frame
const geometry = new THREE.BufferGeometry();
const positions = new Float32Array(particleCount * 3);
geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

// In animation loop:
particles.forEach((p, i) => {
  positions[i * 3]     = p.x;
  positions[i * 3 + 1] = p.y;
  positions[i * 3 + 2] = 0;
});
geometry.attributes.position.needsUpdate = true;
```

### 6. Variacao Temporal (Evolucao)
- Incrementar `time` no noise a cada frame
- Pequeno incremento (0.001-0.005): campo evolui lentamente, particulas seguem caminhos suaves
- Grande incremento (0.01-0.05): campo muda rapido, movimento mais caotico
- Opcao: pulse o time increment com sin() para breathing effect

### 7. Interacao com Mouse
```javascript
canvas.addEventListener('pointermove', (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
});

// In field generation, blend mouse influence:
function getFieldVector(x, y, time) {
  const baseAngle = noise3D(x * scale, y * scale, time) * Math.PI * 2;
  const dx = x * cellSize - mouseX;
  const dy = y * cellSize - mouseY;
  const dist = Math.sqrt(dx * dx + dy * dy);
  const mouseInfluence = Math.max(0, 1 - dist / mouseRadius);
  // Attract or repel from mouse
  const mouseAngle = Math.atan2(-dy, -dx); // Attract
  const finalAngle = baseAngle + (mouseAngle - baseAngle) * mouseInfluence;
  return { vx: Math.cos(finalAngle), vy: Math.sin(finalAngle) };
}
```

### 8. Variantes de Campo
| Tipo | Tecnica | Visual |
|------|---------|--------|
| Curl noise | curl(noise2D) | Incompressivel, sem convergencia |
| Multi-layer | 2+ noise layers somados | Complexidade organica |
| Attractor | Blend noise + point attractors | Convergencia para pontos |
| Image-based | Sample image luminance como angle | Field segue imagem |
| Magnetic | Dipole field + noise | Linhas de campo magnetico |

### 9. Performance e Lifecycle
- Particulas fora do canvas: respawn em posicao aleatoria
- Lifetime: respawn apos N frames para variar trails
- Buffer size: pre-alocar, nao criar/destruir particulas
- Para > 10K particulas em 2D: considerar offscreen canvas ou WebGL
- Para > 50K: mover field computation para shader (GPGPU)

### 10. Reduced Motion e Cleanup
```javascript
// Reduced motion: show static field visualization (arrows) or disable
if (prefersReducedMotion) {
  drawStaticFieldArrows(field, cols, rows, cellSize);
  return; // No animation loop
}

// Cleanup
function dispose() {
  cancelAnimationFrame(animId);
  particles.length = 0;
  field = null;
}
```

## Output
- Flow field grid funcional com noise
- Particulas que seguem o campo com trails
- Variacao temporal (campo evolui no tempo)
- Mouse interaction (attract/repel/distort)
- Pelo menos 2 variantes de campo (curl, attractor, image-based)
- Performance otimizada para target particle count
- Cleanup e reduced motion

## Quality Criteria
- [ ] Noise parameters configuráveis (scale, octaves, speed)
- [ ] Particulas seguem campo suavemente (sem jitter)
- [ ] Trails visiveis e esteticamente agradaveis
- [ ] Campo evolui no tempo (nao estatico)
- [ ] Mouse interacao responsiva (< 16ms latency)
- [ ] Particulas recicladas (sem memory leak)
- [ ] 60fps no target particle count
- [ ] Reduced motion: alternativa estatica ou desabilitado
