---
task: design-exit-animation
responsavel: "@motion-choreographer"
responsavel_type: Agent
atomic_layer: Task
elicit: false

Entrada:
  - campo: element_spec
    tipo: object
    origem: "animation_brief"
    obrigatorio: true

Saida:
  - campo: exit_animation
    tipo: object
    destino: "css-motion-artist ou scroll-narrative-engineer"

Checklist:
  - "[ ] Definir estado de saida"
  - "[ ] Exit mais rapido que entrance (regra 70%)"
  - "[ ] Selecionar tipo (fade, collapse, slide-out)"
  - "[ ] Garantir que nao interrompe fluxo"
  - "[ ] Cleanup apos animacao (display:none, remove)"
---

# Task: Design Exit Animation

## Metadata
- **Agent:** motion-choreographer (Tempo)
- **Squad:** squad-animations
- **Complexity:** LOW

## Objetivo
Projetar animacoes de saida — como elementos desaparecem da tela. Exits devem ser mais rapidos que entrances, nao chamar atencao para si e garantir cleanup DOM correto apos completar.

## Pre-Conditions
- Elemento e contexto definidos
- Entrance animation definida (exit deve ser complementar)
- Cleanup behavior definido (remove, hide, collapse)
- Next state do layout apos exit

## Passos

### 1. Regra de Assimetria
- Exit = 70% da duration do entrance
- Entrada 400ms -> Saida 280ms
- Razao: usuario quer ver o proximo, nao esperar a saida

### 2. Selecionar Tipo de Exit
| Tipo | To State | Melhor Para |
|------|----------|-------------|
| Fade-out | opacity: 0 | Universal |
| Slide-away | y: -20px, opacity: 0 | Cards, content |
| Collapse | height: 0, opacity: 0 | Lists, accordion |
| Scale-out | scale: 0.9, opacity: 0 | Modals, popups |
| Slide-lateral | x: +-100%, opacity: 0 | Page transitions |
| Dissolve | filter: blur(5px), opacity: 0 | Dramatic exits |

### 3. Easing para Exits
- SEMPRE ease-in (accelerate) para exits
- Objeto "comeca devagar e vai embora rapido"
- Complementar ao ease-out do entrance

### 4. Duration Guidelines
| Elemento | Exit Duration | = Entrance * 0.7 |
|----------|-------------|-------------------|
| Modal | 200ms | (300ms entrance) |
| Toast/notification | 200ms | (300ms entrance) |
| Card dismiss | 250ms | (350ms entrance) |
| Page transition out | 250ms | (400ms entrance) |
| Dropdown | 150ms | (200ms entrance) |

### 5. Exit Direction
- Oposto ao entrance OU na direcao da proxima acao
- Entrance de baixo (slideUp) -> Exit para cima (slideUp) ou fade
- Dismiss swipe: sair na direcao do swipe
- NUNCA sair na mesma direcao que entrou (parece yoyo)

### 6. Cleanup Apos Exit
```javascript
// Framer Motion
<AnimatePresence>
  {isVisible && <motion.div exit={{ opacity: 0, y: -20 }} />}
</AnimatePresence>

// GSAP
gsap.to(element, {
  opacity: 0, y: -20,
  duration: 0.25,
  ease: 'power2.in',
  onComplete: () => element.remove(),
});
```

### 7. Collapse Animation
```css
.collapsing {
  display: grid;
  grid-template-rows: 1fr;
  transition: grid-template-rows 250ms ease-in, opacity 200ms ease-in;
}
.collapsing.hidden {
  grid-template-rows: 0fr;
  opacity: 0;
}
.collapsing > .content { overflow: hidden; }
```

### 8. Stagger Exit (Reverse Order)
```javascript
gsap.to('.card', {
  opacity: 0, y: -20,
  duration: 0.25,
  ease: 'power2.in',
  stagger: {
    each: 0.04,
    from: 'end', // Ultimo sai primeiro, ou 'start'
  }
});
```

### 9. Prevent Layout Shift
- Animar opacity + transform (nao remove do flow)
- Apos animacao: mudar display/remove
- Considerar `position: absolute` durante exit
- Proximo conteudo deve ocupar espaco suavemente

### 10. Reduced Motion
- Exit instantaneo (display: none, sem animacao)
- Ou fade rapido (100ms)
- Cleanup deve acontecer mesmo sem animacao

## Output
- Exit spec: to state, duration, easing
- Cleanup behavior (remove, hide, collapse)
- Reverse stagger se grupo
- Layout shift prevention
- Reduced motion variant
- Relationship com entrance animation

## Quality Criteria
- [ ] Exit = 70% da duration do entrance
- [ ] Ease-in (accelerate) para todos exits
- [ ] Cleanup DOM apos animacao completar
- [ ] Sem layout shift durante exit
- [ ] Exit nao chama atencao (deve ser discreto)
- [ ] Stagger reverse order funciona
- [ ] Reduced motion: exit instantaneo
- [ ] Complementar a animacao de entrada
