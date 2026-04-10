---
task: create-animation-storyboard
responsavel: "@animation-interpreter"
responsavel_type: Agent
atomic_layer: Task
elicit: true

Entrada:
  - campo: animation_brief
    tipo: document
    origem: "build-animation-brief"
    obrigatorio: true

Saida:
  - campo: storyboard
    tipo: document
    destino: "agente executor"

Checklist:
  - "[ ] Decompor animacao em frames/etapas"
  - "[ ] Descrever visualmente cada etapa"
  - "[ ] Incluir timing entre etapas"
  - "[ ] Validar com usuario"
---

# Task: Create Animation Storyboard

## Metadata
- **Agent:** animation-interpreter (Lens)
- **Squad:** squad-animations
- **Complexity:** HIGH

## Objetivo
Decompor uma animacao complexa em storyboard textual frame-by-frame — cada frame descreve visualmente o que acontece, com timing preciso. Serve como blueprint para o agente executor implementar sem ambiguidade.

## Pre-Conditions
- Animation brief completo e aprovado
- Elementos da pagina/componente conhecidos
- Trigger definido (load, scroll, click)
- Duration e easing definidos no brief

## Passos

### 1. Identificar Todos os Elementos Animados
```yaml
elements:
  - id: hero-bg
    type: image
    initial_state: { opacity: 0 }
    final_state: { opacity: 1 }

  - id: headline
    type: text
    initial_state: { opacity: 0, y: 30px }
    final_state: { opacity: 1, y: 0 }

  - id: subtitle
    type: text
    initial_state: { opacity: 0, y: 20px }
    final_state: { opacity: 1, y: 0 }

  - id: cta-button
    type: button
    initial_state: { opacity: 0, scale: 0.95 }
    final_state: { opacity: 1, scale: 1.0 }
```

### 2. Criar Timeline Frame-by-Frame
```markdown
## Storyboard: Hero Section Entrance

### T=0ms (Initial State)
- ALL elements invisible (opacity: 0)
- Page has loaded, trigger fires

### T=0-300ms (Background Fade)
- hero-bg: opacity 0→1 (300ms, ease-standard)
- Everything else still invisible

### T=200-600ms (Headline Entrance)
- headline: opacity 0→1, y: 30px→0 (400ms, ease-decelerate)
- Starts 200ms after page load (overlap with bg fade)

### T=350-700ms (Subtitle Entrance)
- subtitle: opacity 0→1, y: 20px→0 (350ms, ease-decelerate)
- 150ms stagger after headline

### T=500-800ms (CTA Entrance)
- cta-button: opacity 0→1, scale 0.95→1.0 (300ms, back.out(1.2))
- 150ms stagger after subtitle
- Slight overshoot creates "pop" feeling

### T=800ms (Complete)
- ALL elements in final state
- Animations complete, idle
- User can interact normally
```

### 3. Visualizar com ASCII Timeline
```
T(ms)  0    100   200   300   400   500   600   700   800
       |     |     |     |     |     |     |     |     |
bg     [===========]
head               [=================]
sub                      [===============]
cta                                  [===========]
       |     |     |     |     |     |     |     |     |
```

### 4. Definir Estados Intermediarios
| Elemento | T=0 | T=25% | T=50% | T=75% | T=100% |
|----------|-----|-------|-------|-------|--------|
| bg | opacity:0 | opacity:0.3 | opacity:0.6 | opacity:0.9 | opacity:1 |
| headline | hidden | opacity:0.2, y:22px | opacity:0.6, y:12px | opacity:0.9, y:3px | visible, y:0 |
| cta | hidden | hidden | opacity:0.3, scale:0.96 | opacity:0.8, scale:1.01 | visible, scale:1 |

### 5. Documentar Transicoes de Scroll (Se Scroll-Driven)
```markdown
## Scroll Storyboard: Parallax Section

### Scroll 0% (Top of section visible)
- bg-layer: position Y=0
- mid-layer: position Y=0
- fg-layer: position Y=0

### Scroll 25%
- bg-layer: Y=-25px (0.1x speed)
- mid-layer: Y=-75px (0.3x speed)
- fg-layer: Y=-125px (0.5x speed)

### Scroll 50% (Section pinned)
- Content text: opacity 0→1 (fade in)
- Counter: starts animating 0→target

### Scroll 75%
- Content text: opacity 1→0 (fade out)
- bg starts blur effect

### Scroll 100% (Section exits)
- All elements back to neutral
- Section unpins, normal scroll resumes
```

### 6. Incluir Interacao States
| State | Trigger | Visual Change | Duration |
|-------|---------|---------------|----------|
| Default | — | Normal appearance | — |
| Hover | mouseenter | Lift 2px, shadow increase | 200ms |
| Active | mousedown | Press down 1px, shadow reduce | 80ms |
| Focus | tab key | Outline visible, subtle pulse | 200ms |
| Loading | click + wait | Spinner replaces text | 150ms |
| Success | action complete | Check icon, green pulse | 300ms |

### 7. Anotar Disney Principles Aplicados
```markdown
## Principles Applied

### Frame: CTA Button Entrance (T=500-800ms)
- **Anticipation:** N/A (entrance, no pre-action)
- **Follow-through:** Slight overshoot via back.out(1.2) — scale goes to 1.01 before settling at 1.0
- **Ease in/out:** Decelerate easing — arrives fast, settles slow
- **Secondary action:** Shadow grows with scale for depth

### Frame: Headline Entrance (T=200-600ms)
- **Staging:** First text element to appear, commands attention
- **Timing:** 400ms — balanced between too fast and too slow
- **Overlap:** Starts before bg fade completes (creates rhythm)
```

### 8. Definir Reduced Motion Variant
```markdown
## Reduced Motion Storyboard

### T=0ms
- ALL elements visible immediately (no animation)
- opacity: 1, transforms: none
- OR: Simple 100ms fade-in, no movement

### Scroll
- No parallax, static layout
- Content visible without scroll trigger
- Progress indicators still work (functional)
```

### 9. Adicionar Notas para Executor
```markdown
## Implementation Notes

### For @scroll-narrative-engineer:
- Use Lenis for smooth scroll (already in project)
- ScrollTrigger scrub: 0.5 (slight lag for smoothness)
- Pin section for scroll 30%-70%
- Mobile: disable parallax, keep fade-in

### For @css-motion-artist:
- Text uses SplitType for char-level animation
- Load SplitType before animation init
- Cleanup split on resize (responsive)

### Performance Warnings:
- Max 5 elements animating simultaneously
- hero-bg image: preload, use will-change: transform
- Remove will-change after entrance complete
```

### 10. Validar com Usuario
- Apresentar storyboard textual ao usuario
- Confirmar timing e sequencia
- Ajustar se necessario (task: refine-animation-specification)
- Aprovar antes de enviar ao executor

## Output
- Storyboard frame-by-frame completo
- Timeline ASCII visualization
- Scroll storyboard (se scroll-driven)
- Interaction states documentados
- Disney principles anotados
- Reduced motion variant
- Implementation notes para executor
- Aprovacao do usuario

## Quality Criteria
- [ ] Cada frame tem timestamp preciso (ms)
- [ ] Todos elementos listados com from/to states
- [ ] Overlaps e staggers claros no timeline
- [ ] Scroll percentages mapeados (se scroll-driven)
- [ ] Interaction states documentados
- [ ] Reduced motion variant incluido
- [ ] Notes uteis para o agente executor
- [ ] Validado com usuario antes de executar
