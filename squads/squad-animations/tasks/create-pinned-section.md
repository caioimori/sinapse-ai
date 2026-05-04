---
task: create-pinned-section
responsavel: "@scroll-narrative-engineer"
responsavel_type: Agent
atomic_layer: Task
elicit: false

Entrada:
  - campo: pin_spec
    tipo: object
    origem: "animation_brief"
    obrigatorio: true

Saida:
  - campo: pinned_section
    tipo: code
    destino: "review-animation-quality"

Checklist:
  - "[ ] Configurar ScrollTrigger pin"
  - "[ ] Definir duracao do pin (scroll distance)"
  - "[ ] Implementar animacoes durante pin"
  - "[ ] Configurar pinSpacing"
  - "[ ] Testar unpin transition"
  - "[ ] Validar em mobile"
---

# Task: Create Pinned Section

## Metadata
- **Agent:** scroll-narrative-engineer (Parallax)
- **Squad:** squad-animations
- **Complexity:** HIGH

## Objetivo
Criar secoes pinned — elementos que ficam fixos na tela enquanto o scroll continua, com animacoes que progridem durante o pin. Tecnica essencial para storytelling, feature showcases e experiencias imersivas.

## Pre-Conditions
- Secao a ser pinned definida no layout
- Animacoes durante o pin planejadas
- Duracao do pin definida (quanto scroll distance)
- Conteudo antes e depois do pin definido

## Passos

### 1. Setup ScrollTrigger Pin Basico
```javascript
gsap.to('.pinned-content', {
  scrollTrigger: {
    trigger: '.pinned-section',
    start: 'top top',
    end: '+=200%',      // Pin por 2x viewport heights
    pin: true,
    pinSpacing: true,    // Adiciona espaco automaticamente
    scrub: 1,
    markers: DEV,
  }
});
```

### 2. Animar Durante o Pin
```javascript
const tl = gsap.timeline({
  scrollTrigger: {
    trigger: '.pinned-section',
    start: 'top top',
    end: '+=300%',
    pin: true,
    scrub: 1,
  }
});
tl.from('.step-1', { opacity: 0, y: 50 })
  .from('.step-2', { opacity: 0, y: 50 })
  .from('.step-3', { opacity: 0, y: 50 })
  .to('.step-1', { opacity: 0 }, '+=0.5');
```

### 3. Feature Showcase (Pinned Image + Changing Text)
```javascript
const features = gsap.utils.toArray('.feature');
features.forEach((feature, i) => {
  gsap.to(feature, {
    opacity: 1, y: 0,
    scrollTrigger: {
      trigger: feature,
      start: 'top center',
      end: 'bottom center',
      toggleActions: 'play reverse play reverse',
      containerAnimation: horizontalScroll, // se dentro de scroll horizontal
    }
  });
});
```

### 4. Configurar Pin Spacing
| pinSpacing | Comportamento | Quando Usar |
|-----------|--------------|-------------|
| `true` | Adiciona espaco abaixo (default) | Maioria dos casos |
| `false` | Sem espaco extra | Overlap desejado |
| `"margin"` | Usa margin em vez de padding | Layouts especificos |

### 5. Animacao de Progresso no Pin
```javascript
// Barra de progresso durante o pin
gsap.to('.pin-progress', {
  scaleX: 1,
  transformOrigin: 'left center',
  scrollTrigger: {
    trigger: '.pinned-section',
    start: 'top top',
    end: '+=200%',
    scrub: true,
  }
});
```

### 6. Snap entre Steps
```javascript
ScrollTrigger.create({
  trigger: '.pinned-section',
  start: 'top top',
  end: '+=400%',
  pin: true,
  snap: {
    snapTo: [0, 0.25, 0.5, 0.75, 1], // Snap a cada 25%
    duration: 0.3,
    ease: 'power2.inOut',
  },
});
```

### 7. Mobile Pin Strategy
```javascript
const isMobile = ScrollTrigger.isTouch === 1;
if (isMobile) {
  // Reduzir pin duration
  // Ou converter para scroll normal com entrance animations
  ScrollTrigger.create({
    trigger: '.pinned-section',
    start: 'top top',
    end: '+=100%', // Menor que desktop
    pin: true,
    scrub: 1,
  });
}
```

### 8. Pin com Background Change
```javascript
const tl = gsap.timeline({ scrollTrigger: { /* pin config */ } });
tl.to('.pinned-section', { backgroundColor: '#1a1a2e' }, 0)
  .to('.pinned-section', { backgroundColor: '#16213e' }, 0.33)
  .to('.pinned-section', { backgroundColor: '#0f3460' }, 0.66);
```

### 9. Cleanup e Refresh
```javascript
// Apos DOM changes, recalcular posicoes
ScrollTrigger.refresh();
// Em SPA: kill pins ao sair
function cleanup() {
  ScrollTrigger.getAll().forEach(st => st.kill(true)); // true = revert pin
}
```

### 10. Testar Edge Cases
- Scroll rapido: animacao nao deve pular
- Resize durante pin: deve recalcular
- Browser back: posicao de scroll restaurada corretamente
- Mobile keyboard: nao deve quebrar pin

## Output
- Pinned section com ScrollTrigger
- Timeline de animacoes durante pin
- Pin progress indicator
- Snap points se solicitado
- Mobile-adapted pin duration
- Cleanup functions

## Quality Criteria
- [ ] Pin suave (sem jank no ponto de pin/unpin)
- [ ] Animacoes scrub 60fps durante pin
- [ ] Pin spacing correto (sem sobreposicao de conteudo)
- [ ] Snap funciona se configurado
- [ ] Mobile: pin funciona com touch scroll
- [ ] Cleanup reverte pin corretamente
- [ ] Resize recalcula posicoes (ScrollTrigger.refresh)
- [ ] Reduced motion: conteudo visivel sem pin
