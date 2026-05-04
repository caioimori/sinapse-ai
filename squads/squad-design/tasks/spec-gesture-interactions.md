---
task: spec-gesture-interactions
responsavel: "@dx-interaction-designer"
responsavel_type: Agent
atomic_layer: Task
elicit: false

Entrada:
  - campo: context
    tipo: object
    origem: "workflow ou manual"
    obrigatorio: true

Saida:
  - campo: resultado
    tipo: document
    destino: "stakeholders"

Checklist:
  - "[ ] Validar inputs e pre-condicoes"
  - "[ ] Executar steps conforme documentado"
  - "[ ] Verificar criterios de qualidade"
  - "[ ] Gerar output no formato especificado"
---

# Task: Spec Gesture Interactions

## Metadata
- **Squad:** squad-design
- **Agent:** Kinetic (dx-interaction-designer)
- **Complexity:** Standard

## Objetivo
Especificar interacoes por gesto para dispositivos touch — swipe, pinch, long-press e drag com alternativas acessiveis.

## Entrada
- Mobile-first designs
- User flows em mobile
- WCAG 2.5.7 (Dragging Movements)
- Touch interaction patterns

## Passos

### 1. Gesture Catalog
| Gesto | Acao | Alternativa (a11y) |
|-------|------|-------------------|
| Tap | Primary action | Click/Enter |
| Long press | Context menu | Right-click |
| Swipe left | Delete/archive | Button action |
| Swipe right | Complete/favorite | Button action |
| Pull down | Refresh | Refresh button |
| Pinch | Zoom | Zoom controls |
| Drag | Reorder | Arrow buttons |
| Double tap | Zoom/select | Button |

### 2. WCAG 2.5.7 Compliance (Dragging)
Todas as funcionalidades drag DEVEM ter alternativa non-drag:
```yaml
drag_alternative:
  drag_to_reorder:
    gesture: "Drag item up/down"
    alternative: "Up/down arrow buttons per item"
    aria: "aria-grabbed, aria-dropeffect"

  drag_to_sort:
    gesture: "Drag between columns"
    alternative: "Move to... dropdown menu"

  drag_to_resize:
    gesture: "Drag handle to resize"
    alternative: "Width/height input fields"
```

### 3. Swipe Interactions
```yaml
swipe_spec:
  direction: "horizontal"
  threshold: "30% of item width or 80px"
  velocity_threshold: "0.5px/ms"

  visual_feedback:
    swipe_progress:
      - at: "0-30%": "background reveals action color"
      - at: "30-70%": "action icon appears, elasticity"
      - at: "70-100%": "snap to action, icon enlarges"
      - at: "release < 30%": "spring back to original"
      - at: "release > 30%": "complete action"

  animation:
    snap_back:
      duration: "var(--duration-normal)"
      easing: "var(--ease-spring)"
    complete:
      duration: "var(--duration-slow)"
      easing: "var(--ease-accelerate)"

  reduced_motion:
    snap_back: "instant"
    complete: "instant"
```

### 4. Pull-to-Refresh
```yaml
pull_to_refresh:
  threshold: "80px pull distance"
  states:
    pulling: "Arrow rotates with pull distance"
    threshold_reached: "Arrow becomes spinner"
    refreshing: "Spinner animates"
    complete: "Success icon, then hide"
  animation:
    spinner: "rotate 1s linear infinite"
    duration: "300ms for state transitions"
  reduced_motion: "Text-only indicator"
```

### 5. Touch Feedback
```yaml
touch_feedback:
  tap:
    visual: "Ripple effect from tap point"
    duration: "400ms"
    opacity: "0.12"
    reduced_motion: "Instant background color change"

  long_press:
    delay: "500ms"
    feedback: "Haptic + scale(0.97)"
    reduced_motion: "Background color change only"
```

### 6. Accessibility Requirements
| Requisito | Implementacao |
|-----------|--------------|
| WCAG 2.5.1 Pointer Gestures | Alternativa single-pointer |
| WCAG 2.5.7 Dragging | Non-drag alternative |
| Touch targets | >= 44x44px (WCAG 2.5.8: >= 24x24px) |
| Cancel on release | up-event cancellation |
| No path-based gestures required | Simple tap alternatives |

## Saida
- Gesture interaction specifications
- Swipe behavior specs
- Pull-to-refresh specs
- Touch feedback patterns
- A11y alternatives for every gesture
- Handoff para Scaffold (implementation)

## Validacao
- [ ] Toda funcionalidade gesture tem alternativa tap/click
- [ ] Drag functions tem alternativa non-drag (WCAG 2.5.7)
- [ ] Touch targets >= 44x44px
- [ ] Reduced motion alternatives
- [ ] Swipe thresholds definidos
- [ ] Cancel-on-release implementado
