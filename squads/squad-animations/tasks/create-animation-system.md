---
task: create-animation-system
responsavel: "@motion-choreographer"
responsavel_type: Agent
atomic_layer: Task
elicit: true

Entrada:
  - campo: brand_context
    tipo: object
    origem: "brand system ou animation_brief"
    obrigatorio: true

Saida:
  - campo: animation_system
    tipo: document
    destino: "todos os agentes"

Checklist:
  - "[ ] Definir tokens de duration (fast, normal, slow, dramatic)"
  - "[ ] Definir tokens de easing por categoria"
  - "[ ] Criar stagger presets"
  - "[ ] Mapear animacoes por componente"
  - "[ ] Documentar regras de composicao"
  - "[ ] Incluir prefers-reduced-motion tokens"
---

# Task: Create Animation System

## Metadata
- **Agent:** motion-choreographer (Tempo)
- **Squad:** squad-animations
- **Complexity:** CRITICAL

## Objetivo
Criar um sistema de animacao completo e consistente para todo o projeto — duration tokens, easing curves, stagger presets, component animation map e reduced motion strategy. Este documento governa toda animacao do projeto.

## Pre-Conditions
- Brand personality definida (ou briefing com feeling do projeto)
- Design system tokens existentes (cores, spacing, typography)
- Componentes principais do projeto identificados
- Target audience e dispositivos conhecidos

## Passos

### 1. Definir Duration Tokens
```css
:root {
  --duration-instant: 0ms;
  --duration-fast: 150ms;
  --duration-normal: 300ms;
  --duration-slow: 500ms;
  --duration-dramatic: 800ms;
}
```
| Token | Value | Uso |
|-------|-------|-----|
| instant | 0ms | Reduced motion, state toggle |
| fast | 150ms | Micro-interactions, hover |
| normal | 300ms | Standard transitions |
| slow | 500ms | Entrances, modals |
| dramatic | 800ms | Hero, page transitions |

### 2. Definir Easing Tokens
```css
:root {
  --ease-standard: cubic-bezier(0.4, 0.0, 0.2, 1);
  --ease-decelerate: cubic-bezier(0.0, 0.0, 0.2, 1);
  --ease-accelerate: cubic-bezier(0.4, 0.0, 1, 1);
  --ease-sharp: cubic-bezier(0.4, 0.0, 0.6, 1);
  --ease-spring: cubic-bezier(0.175, 0.885, 0.32, 1.275);
}
```

### 3. Mapear Easing por Contexto
| Contexto | Easing Token | GSAP Equivalent |
|----------|-------------|----------------|
| Entrance | --ease-decelerate | power3.out |
| Exit | --ease-accelerate | power2.in |
| State change | --ease-standard | power2.inOut |
| Hover | --ease-sharp | power1.out |
| Bounce | --ease-spring | back.out(1.7) |

### 4. Criar Stagger Presets
```javascript
const staggerPresets = {
  cascade: { each: 0.08, from: 'start' },
  wave: { each: 0.05, from: 'start', ease: 'sine.inOut' },
  center: { grid: 'auto', from: 'center', amount: 0.6 },
  random: { each: 0.06, from: 'random' },
};
```

### 5. Component Animation Map
| Component | Entrance | Exit | Hover | Active |
|-----------|---------|------|-------|--------|
| Button | — | — | lift (2px) | press (scale 0.98) |
| Card | slideUp + fade | fade-out | lift (4px) | — |
| Modal | scale + fade | scale + fade (70%) | — | — |
| Toast | slideRight | slideRight (reverse) | — | — |
| Dropdown | slideDown + fade | fade (fast) | — | — |
| Tab content | fade | fade (fast) | — | — |

### 6. Definir Regras de Composicao
- Max 2 propriedades animadas simultaneamente
- Animacoes nao devem competir por atencao
- Entrada de conteudo tem prioridade sobre decorativo
- Staggers respeitam hierarquia visual

### 7. Motion Hierarchy
```
Level 1: Page transitions (mais dramatico)
Level 2: Section entrances
Level 3: Component animations
Level 4: Micro-interactions (mais sutil)
Level 5: Continuous/ambient (mais sutil ainda)
```

### 8. Reduced Motion Strategy
```css
@media (prefers-reduced-motion: reduce) {
  :root {
    --duration-fast: 0ms;
    --duration-normal: 0ms;
    --duration-slow: 0ms;
    --duration-dramatic: 0ms;
  }
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

### 9. CSS Custom Properties Export
```css
/* Animation system tokens */
:root {
  /* Durations */
  --duration-fast: 150ms;
  --duration-normal: 300ms;
  --duration-slow: 500ms;
  /* Easings */
  --ease-standard: cubic-bezier(0.4, 0.0, 0.2, 1);
  --ease-decelerate: cubic-bezier(0.0, 0.0, 0.2, 1);
  --ease-accelerate: cubic-bezier(0.4, 0.0, 1, 1);
  /* Stagger */
  --stagger-fast: 40ms;
  --stagger-normal: 80ms;
}
```

### 10. Validacao e Teste
- Aplicar system em 3 componentes diferentes
- Verificar consistencia visual
- Testar reduced motion mode
- Confirmar que tokens cobrem todos use cases
- Validar que nao ha conflitos entre animacoes

## Output
- Animation system document completo
- Duration tokens (CSS custom properties)
- Easing tokens (CSS + GSAP)
- Stagger presets
- Component animation map
- Reduced motion strategy
- Regras de composicao e hierarquia

## Quality Criteria
- [ ] Tokens cobrem todos duration ranges
- [ ] Max 5 easing curves (consistencia)
- [ ] Component map cobre todos componentes core
- [ ] Reduced motion strategy completa
- [ ] CSS custom properties exportadas
- [ ] GSAP equivalents documentados
- [ ] Motion hierarchy definida
- [ ] Regras de composicao claras
