---
task: choreograph-stagger-sequence
responsavel: "@motion-choreographer"
responsavel_type: Agent
atomic_layer: Task
elicit: false

Entrada:
  - campo: elements
    tipo: array
    origem: "animation_brief"
    obrigatorio: true
  - campo: feeling
    tipo: string
    origem: "animation_brief"
    obrigatorio: true

Saida:
  - campo: stagger_spec
    tipo: object
    destino: "css-motion-artist ou threejs-architect"

Checklist:
  - "[ ] Definir stagger delay entre elementos"
  - "[ ] Selecionar pattern (linear, ease-in, random, from-center)"
  - "[ ] Configurar overlap entre animacoes"
  - "[ ] Testar ritmo visual"
  - "[ ] Ajustar para quantidade de elementos"
---

# Task: Choreograph Stagger Sequence

## Metadata
- **Agent:** motion-choreographer (Tempo)
- **Squad:** squad-animations
- **Complexity:** MEDIUM

## Objetivo
Coreografar sequencias stagger — definir como multiplos elementos animam em cascata com timing, pattern e ritmo que criam harmonia visual. Stagger bem feito transforma lista de items em experiencia orquestrada.

## Pre-Conditions
- Elementos a serem staggered identificados
- Numero de elementos conhecido
- Feeling desejado (elegante, energetico, dramatico)
- Layout dos elementos (lista, grid, radial)

## Stagger Patterns
- **Cascata:** delay fixo (50-100ms), elegante
- **Wave:** delay variavel, organico
- **From center:** expande do centro, impactante
- **Random:** delay aleatorio, energetico

## Passos

### 1. Selecionar Pattern por Feeling
| Feeling | Pattern | Delay | Total Max |
|---------|---------|-------|-----------|
| Elegante/premium | Cascata linear | 60-80ms | 800ms |
| Energetico/dinamico | Accelerating | 40-80ms | 600ms |
| Organico/natural | Wave (sine) | variavel | 1000ms |
| Impactante/hero | From center | dist-based | 600ms |
| Playful | Random | 30-100ms | 800ms |

### 2. Calcular Delay Otimo
```
Regra: stagger_delay = min(100ms, 800ms / num_elements)
Exemplo: 12 cards = 800/12 = ~66ms stagger
Exemplo: 4 cards = 800/4 = 200ms (cap em 100ms)
```

### 3. Implementar GSAP Stagger
```javascript
gsap.from('.card', {
  opacity: 0,
  y: 30,
  duration: 0.4,
  stagger: {
    each: 0.08,       // 80ms entre cada
    from: 'start',    // ou 'center', 'end', 'random', index
    ease: 'power2.out', // Easing do stagger timing itself
  }
});
```

### 4. Implementar Grid Stagger (2D)
```javascript
gsap.from('.grid-item', {
  opacity: 0,
  scale: 0.8,
  duration: 0.5,
  stagger: {
    grid: [rows, cols],
    from: 'center',
    amount: 0.8, // Total stagger duration
  }
});
```

### 5. CSS Variable Stagger
```css
.stagger-item {
  animation: entrance 400ms ease-out both;
  animation-delay: calc(var(--i) * 80ms);
}
```
```html
<div class="stagger-item" style="--i: 0">A</div>
<div class="stagger-item" style="--i: 1">B</div>
<div class="stagger-item" style="--i: 2">C</div>
```

### 6. Overlap entre Animacoes
```
Sem overlap:   A----| B----| C----|
50% overlap:   A----|
                 B----|
                   C----|
Full overlap:  A----|
               B----|
               C----|
```
- 50% overlap: natural, flowing
- 0% overlap: sequential, deliberate
- 70%+ overlap: energetic, fast

### 7. Ajustar para Quantidade
| Num Elements | Stagger | Per Element Duration |
|-------------|---------|---------------------|
| 2-4 | 80-100ms | 400ms |
| 5-8 | 60-80ms | 350ms |
| 9-16 | 40-60ms | 300ms |
| 17+ | 30-40ms | 250ms |

### 8. Wave/Sine Pattern
```javascript
gsap.from('.item', {
  opacity: 0,
  y: 30,
  stagger: {
    each: 0.05,
    from: 'start',
    ease: 'sine.inOut', // Wave-like timing
  }
});
```

### 9. Reduced Motion
```javascript
if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  gsap.set('.stagger-item', { opacity: 1, y: 0, scale: 1 });
}
```

### 10. Validar Ritmo Visual
- Assistir animacao em tempo real 3x
- Se parece "mecanico", adicionar easing ao stagger
- Se parece "caótico", usar pattern linear em vez de random
- Se parece "lento", reduzir delay e duration
- Total sequence nao deve exceder 1 segundo

## Output
- Stagger spec com pattern, delay e duration
- GSAP/CSS implementation
- Grid stagger se layout 2D
- Overlap configuration
- Quantity-adaptive delays
- Reduced motion variant

## Quality Criteria
- [ ] Total stagger sequence < 1 segundo
- [ ] Delay proporcional ao numero de elementos
- [ ] Pattern adequado ao feeling (cascata/wave/center)
- [ ] Overlap configurado (nao 100% sequential)
- [ ] Grid stagger para layouts 2D
- [ ] prefers-reduced-motion: items visiveis instantaneo
- [ ] Ritmo visual harmonioso (sem "mecanico")
- [ ] 60fps durante toda sequencia
