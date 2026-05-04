---
task: build-motion-guidelines
responsavel: "@motion-choreographer"
responsavel_type: Agent
atomic_layer: Task
elicit: false

Entrada:
  - campo: animation_system
    tipo: document
    origem: "create-animation-system"
    obrigatorio: true
  - campo: brand_context
    tipo: object
    origem: "brand system"
    obrigatorio: false

Saida:
  - campo: motion_guidelines
    tipo: document
    destino: "animations-orqx e squads externas"

Checklist:
  - "[ ] Documentar principios de motion do projeto"
  - "[ ] Listar do/dont para cada tipo de animacao"
  - "[ ] Incluir exemplos visuais (descritivos)"
  - "[ ] Definir hierarquia de motion"
  - "[ ] Alinhar com brand personality"
---

# Task: Build Motion Guidelines

## Metadata
- **Agent:** motion-choreographer (Tempo)
- **Squad:** squad-animations
- **Complexity:** MEDIUM

## Objetivo
Criar documento de motion guidelines — principios, regras, do/dont e exemplos que governam como animacao e usada no projeto. Este documento serve como referencia para todos agentes e desenvolvedores.

## Pre-Conditions
- Animation system criado (tokens, presets)
- Brand personality definida
- Componentes e interacoes do projeto mapeados
- Exemplos de animacoes ja implementadas (reference)

## Passos

### 1. Definir Motion Principles (3-5)
```markdown
## Motion Principles

1. **Purposeful** — Every animation serves a purpose (feedback, guidance, delight)
2. **Natural** — Motion follows physics and feels organic
3. **Swift** — Animations are quick; never make the user wait
4. **Consistent** — Same action = same animation everywhere
5. **Accessible** — Respects user preferences and disabilities
```

### 2. Alinhar com Brand Personality
| Brand Trait | Motion Translation |
|-------------|-------------------|
| Professional | Subtle, clean, no overshoot |
| Playful | Bouncy, spring easing, overshoot |
| Premium/Luxury | Slow, dramatic, smooth |
| Energetic | Fast, snappy, bold |
| Minimalist | Fade only, minimal movement |

### 3. Do / Don't por Categoria
| Categoria | DO | DON'T |
|-----------|-----|-------|
| Entrances | Fade + subtle slide (20-30px) | Slide > 100px, rotate, bounce |
| Hover | Lift, color shift, scale 1.02 | Scale > 1.1, complex transforms |
| Loading | Subtle shimmer, branded spinner | Animated characters, progress lies |
| Page transitions | Fade crossfade, shared element | Full-page wipe, slow dissolve |
| Scroll | Entrance reveals, parallax layers | Scroll hijacking, horizontal scroll default |

### 4. Timing Guidelines
```markdown
## Timing Rules

- Micro-interactions: 100-200ms (user should not wait)
- Standard transitions: 200-400ms (noticeable but quick)
- Dramatic reveals: 400-800ms (reserved for heroes)
- NEVER exceed 1 second for any single animation
- Exit animations = 70% of entrance duration
```

### 5. Easing Guidelines
```markdown
## Easing Rules

- Entrances: ease-out (decelerate) — ALWAYS
- Exits: ease-in (accelerate) — ALWAYS
- State changes: ease-in-out — ALWAYS
- Scroll-driven: linear — ALWAYS
- NEVER use linear for UI animations
- NEVER use ease-in for entrances
```

### 6. Performance Rules
```markdown
## Performance

- ONLY animate: transform, opacity, filter, clip-path
- NEVER animate: width, height, margin, padding, top, left
- Max simultaneous animations: 10 elements
- will-change: apply before, remove after
- Target: 60fps on desktop, 30fps minimum on mobile
```

### 7. Accessibility Rules
```markdown
## Accessibility

- ALWAYS implement prefers-reduced-motion
- Reduced motion: instant state change, no movement
- Animation must NOT be the only way to convey information
- Auto-playing animations: provide pause control
- Flashing: NEVER flash more than 3 times per second
```

### 8. Component-Specific Guidelines
```markdown
## Button
- Hover: translateY(-1px), subtle shadow
- Active: scale(0.98), remove shadow
- Duration: 150ms hover, 80ms active

## Modal
- Open: scale(0.95→1) + fade, 300ms, ease-decelerate
- Close: fade-out, 200ms, ease-accelerate
- Backdrop: fade 200ms
```

### 9. Stagger Guidelines
```markdown
## Stagger Rules

- Max total sequence: 800ms
- Stagger delay: 60-100ms per element
- For 10+ elements: reduce delay (40-60ms)
- Pattern: cascade for lists, center for grids
- NEVER stagger more than 20 elements
```

### 10. Review Process
- Toda nova animacao deve seguir guidelines
- Review by motion-choreographer antes de merge
- Exceptions documentadas e aprovadas
- Guidelines atualizadas quando novos patterns surgem

## Output
- Motion guidelines document completo
- Principles (3-5 core)
- Do/Don't tables por categoria
- Timing e easing rules
- Performance constraints
- Accessibility rules
- Component-specific guidelines
- Stagger rules

## Quality Criteria
- [ ] 3-5 motion principles definidos
- [ ] Alinhados com brand personality
- [ ] Do/Don't claros por categoria
- [ ] Timing ranges documentados
- [ ] Easing rules sem ambiguidade
- [ ] Performance constraints explcitos
- [ ] Accessibility rules completas
- [ ] Aplicavel por qualquer desenvolvedor
