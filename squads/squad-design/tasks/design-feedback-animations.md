---
task: design-feedback-animations
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

# Task: Design Feedback Animations

## Metadata
- **Squad:** squad-design
- **Agent:** Kinetic (dx-interaction-designer)
- **Complexity:** Standard

## Objetivo
Projetar animacoes de feedback — definir como o sistema comunica visualmente sucesso, erro, warning e progresso ao usuario.

## Entrada
- Feedback states (de Canvas)
- Toast/notification patterns
- Motion tokens
- A11y requirements

## Passos

### 1. Feedback Animation Types
| Tipo | Visual | Duracao | Easing |
|------|--------|---------|--------|
| Success | Checkmark draw + scale | 500ms | decelerate |
| Error | Shake + error icon | 400ms | sharp |
| Warning | Pulse attention | 300ms | standard |
| Info | Fade-in | 200ms | decelerate |
| Loading | Spinner/pulse | continuous | linear |
| Progress | Fill bar | proportional | standard |

### 2. Success Animation
```yaml
success:
  checkmark:
    animation: "stroke-dashoffset draw"
    duration: "400ms"
    delay: "100ms after container appears"
    easing: "var(--ease-decelerate)"
    color: "success-500"
  container:
    animation: "scale(0.8) → scale(1)"
    duration: "300ms"
    easing: "var(--ease-spring)"
  reduced_motion: "Instant checkmark, no animation"
```

### 3. Error Animation
```yaml
error:
  shake:
    animation: "translateX [-4, 4, -4, 4, 0]px"
    duration: "400ms"
    easing: "var(--ease-sharp)"
    apply_to: "form field or container"
  icon:
    animation: "scale(0) → scale(1)"
    duration: "200ms"
    easing: "var(--ease-spring)"
  border:
    animation: "color change to error"
    duration: "var(--duration-fast)"
  reduced_motion: "Instant color change, no shake"
```

### 4. Toast/Notification Animations
```yaml
toast:
  enter:
    from: "translateY(100%) opacity(0)"
    to: "translateY(0) opacity(1)"
    duration: "var(--duration-slow)"
    easing: "var(--ease-decelerate)"
  exit:
    from: "translateY(0) opacity(1)"
    to: "translateY(-20px) opacity(0)"
    duration: "var(--duration-normal)"
    easing: "var(--ease-accelerate)"
  auto_dismiss:
    delay: "5000ms"
    countdown: "progress bar width 100% → 0%"
  stacking: "newer pushes older up by toast height + 8px gap"
  reduced_motion: "instant appear/disappear"
```

### 5. Progress Animations
```yaml
progress:
  determinate:
    animation: "width 0% → target%"
    easing: "var(--ease-standard)"
    transition: "width var(--duration-normal)"
  indeterminate:
    animation: "translateX(-100%) → translateX(100%)"
    duration: "1.5s"
    iteration: "infinite"
    easing: "var(--ease-standard)"
  reduced_motion:
    determinate: "instant width change"
    indeterminate: "pulse opacity"
```

### 6. Haptic Patterns (Mobile)
| Feedback | Haptic | Quando |
|----------|--------|--------|
| Success | Light impact | Action completed |
| Error | Notification | Validation failed |
| Warning | Warning | Destructive action |
| Toggle | Selection | Switch/checkbox |

## Saida
- Feedback animation specifications
- Success/error/warning animation specs
- Toast animation specs
- Progress animation specs
- Haptic feedback guide
- Reduced motion alternatives

## Validacao
- [ ] Cada tipo de feedback tem animacao definida
- [ ] Duracoes usando motion tokens
- [ ] Reduced motion alternatives
- [ ] Toast auto-dismiss timing
- [ ] No flashing > 3/second
- [ ] Screen readers anunciam feedback (aria-live)
