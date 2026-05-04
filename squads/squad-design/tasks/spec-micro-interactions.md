---
task: spec-micro-interactions
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

# Task: Spec Micro-Interactions

## Metadata
- **Squad:** squad-design
- **Agent:** Kinetic (dx-interaction-designer)
- **Complexity:** Standard

## Objetivo
Especificar micro-interacoes para cada componente interativo — definir feedback visual e animado para hover, press, toggle e state changes.

## Entrada
- Component visual states (de Canvas)
- Duration scale e easing curves
- Motion principles
- Accessibility requirements

## Passos

### 1. Micro-Interaction Anatomy
Cada micro-interacao tem 4 partes:
| Parte | Descricao | Exemplo |
|-------|-----------|---------|
| Trigger | O que inicia | Hover, click, focus, scroll |
| Rules | O que acontece | Feedback visual, state change |
| Feedback | Resposta visual/haptica | Cor muda, escala, bounce |
| Loops & Modes | Repetição ou estado | Loading spinner, toggle |

### 2. Button Micro-Interactions
```yaml
button:
  hover:
    trigger: "mouseenter"
    animation:
      background: "lighten 5%"
      duration: "var(--duration-fast)"
      easing: "var(--ease-standard)"
    reduced_motion: "instant color change"

  active:
    trigger: "mousedown"
    animation:
      transform: "scale(0.97)"
      duration: "var(--duration-instant)"
      easing: "var(--ease-sharp)"
    reduced_motion: "instant color change"

  focus:
    trigger: "focus-visible"
    animation:
      outline: "2px solid, offset 2px"
      duration: "0ms"  # Instant, never delay
    reduced_motion: "same"

  loading:
    trigger: "async action"
    animation:
      content: "fade to spinner"
      spinner: "rotate 1s linear infinite"
      width: "maintain (no layout shift)"
    reduced_motion: "spinner only, no content fade"
```

### 3. Toggle/Switch
```yaml
switch:
  toggle_on:
    trigger: "click/space"
    animation:
      thumb: "translateX(100%)"
      track: "background-color change"
      duration: "var(--duration-fast)"
      easing: "var(--ease-spring)"
    reduced_motion: "instant position change"

  toggle_off:
    trigger: "click/space"
    animation:
      thumb: "translateX(0)"
      track: "background-color change"
      duration: "var(--duration-fast)"
      easing: "var(--ease-spring)"
    reduced_motion: "instant position change"
```

### 4. Input Fields
```yaml
input:
  focus:
    animation:
      border: "color change to brand"
      label: "float up (if floating label)"
      duration: "var(--duration-fast)"
    reduced_motion: "instant"

  error:
    animation:
      border: "color change to error"
      shake: "translateX([-4, 4, -4, 4, 0]px)"
      duration: "400ms"
      icon: "fade in"
    reduced_motion: "instant color change, no shake"

  success:
    animation:
      icon: "scale(0) → scale(1) with spring"
      border: "color change to success"
      duration: "var(--duration-normal)"
    reduced_motion: "instant"
```

### 5. Catalog por Componente
| Componente | Triggers | Spec Needed? |
|-----------|---------|-------------|
| Button | hover, active, focus, loading | SIM |
| Input | focus, blur, error, success | SIM |
| Switch/Toggle | toggle on/off | SIM |
| Checkbox | check/uncheck | SIM |
| Link | hover, focus | SIM |
| Card | hover (if interactive) | SIM |
| Toast | enter, exit, auto-dismiss | SIM |
| Modal | enter, exit | SIM |
| Dropdown | open, close, item hover | SIM |
| Accordion | expand, collapse | SIM |
| Tabs | switch content | SIM |

### 6. Implementation Notes
- Use `transform` and `opacity` only (GPU-accelerated)
- Avoid animating `width`, `height`, `top`, `left` (causes layout)
- Use `will-change` sparingly and remove after animation

## Saida
- Micro-interaction spec per component
- Animation property reference
- Reduced motion alternatives
- Implementation guide
- Handoff para Scaffold (implementation)

## Validacao
- [ ] Spec para cada componente interativo
- [ ] Duracoes usando scale tokens
- [ ] Easing usando curve tokens
- [ ] Reduced motion alternatives
- [ ] GPU-only properties (transform, opacity)
- [ ] No layout-triggering animations
