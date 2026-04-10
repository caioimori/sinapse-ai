---
task: apply-disney-principles
responsavel: "@motion-choreographer"
responsavel_type: Agent
atomic_layer: Task
elicit: false

Entrada:
  - campo: animation_code
    tipo: code
    origem: "agente executor"
    obrigatorio: true
  - campo: animation_brief
    tipo: document
    origem: "animation-interpreter"
    obrigatorio: true

Saida:
  - campo: enhanced_animation
    tipo: code
    destino: "review-animation-quality"

Checklist:
  - "[ ] Avaliar quais principios se aplicam"
  - "[ ] Adicionar anticipation se necessario"
  - "[ ] Implementar follow-through"
  - "[ ] Ajustar ease in/out (slow in/slow out)"
  - "[ ] Adicionar secondary action se relevante"
  - "[ ] Verificar staging e appeal"
---

# Task: Apply Disney Principles

## Metadata
- **Agent:** motion-choreographer (Tempo)
- **Squad:** squad-animations
- **Complexity:** HIGH

## Objetivo
Aplicar os 12 principios Disney de animacao ao codigo — transformar animacao funcional em animacao com vida, personalidade e polish. Selecionar principios relevantes para web e aplicar com moderacao.

## Pre-Conditions
- Animacao funcional implementada por outro agente
- Animation brief com feeling desejado
- Consultar KB: disney-12-principles-web
- Contexto: web animation, nao cartoon (sutileza e chave)

## Principios Mais Usados na Web
1. Ease in/Ease out (SEMPRE)
2. Anticipation (buttons, modals)
3. Follow-through (listas, cards)
4. Staging (hero sections)
5. Secondary action (micro-interactions)

## Passos

### 1. Avaliar Quais Principios se Aplicam
| Principio | Aplicavel na Web? | Quando |
|-----------|-------------------|--------|
| Squash & Stretch | Raramente | Bouncy icons, playful UI |
| Anticipation | Frequente | Before major action |
| Staging | Frequente | Hero, focal points |
| Straight Ahead / Pose to Pose | Conceptual | — |
| Follow-Through / Overlap | Frequente | Lists, multi-element |
| Slow In / Slow Out | SEMPRE | Easing curves |
| Arcs | Ocasional | Curved motion paths |
| Secondary Action | Frequente | Supporting animations |
| Timing | SEMPRE | Duration choices |
| Exaggeration | Com cuidado | Creative/playful sites |
| Solid Drawing | N/A | — |
| Appeal | SEMPRE | Overall animation quality |

### 2. Implementar Anticipation
```javascript
// Button press: slight scale down before action
gsap.timeline()
  .to('.btn', { scale: 0.95, duration: 0.1, ease: 'power2.in' })
  .to('.btn', { scale: 1, duration: 0.3, ease: 'back.out(2)' });
```
Onde usar: buttons antes de acao, modal antes de abrir, drag antes de mover

### 3. Implementar Follow-Through
```javascript
// Card list: items overshoot slightly then settle
gsap.from('.card', {
  y: 40,
  opacity: 0,
  duration: 0.5,
  ease: 'back.out(1.2)', // Slight overshoot
  stagger: 0.08,
});
```
Onde usar: elementos que chegam a uma posicao, listas, accordions

### 4. Ajustar Slow In / Slow Out
```css
/* Replace linear with proper easing */
/* BAD */  transition: transform 300ms linear;
/* GOOD */ transition: transform 300ms cubic-bezier(0.4, 0.0, 0.2, 1);
```
REGRA: NUNCA usar `linear` para UI animations (exceto scroll scrub)

### 5. Adicionar Secondary Action
```javascript
// Primary: modal opens (scale + fade)
// Secondary: backdrop fades in
// Secondary: content inside modal fades in with delay
gsap.timeline()
  .to('.backdrop', { opacity: 1, duration: 0.2 })
  .from('.modal', { scale: 0.9, opacity: 0, duration: 0.3 })
  .from('.modal-content', { opacity: 0, y: 10, duration: 0.2 });
```

### 6. Verificar Staging
- O elemento principal da animacao deve ser o foco visual
- Reduzir distracao de elementos secundarios durante animacao principal
- Usar contraste de timing: hero move, rest is still

### 7. Aplicar Arcos (Curved Paths)
```javascript
// Instead of straight line, use motionPath
gsap.to('.element', {
  motionPath: {
    path: [{x: 0, y: 0}, {x: 100, y: -50}, {x: 200, y: 0}],
    curviness: 1.5,
  },
  duration: 0.8,
});
```
Onde usar: tooltips, notifications que fly in, floating elements

### 8. Exaggeration (Com Cuidado)
```css
/* Subtle exaggeration for hover */
@keyframes wobble {
  0% { transform: rotate(0); }
  25% { transform: rotate(3deg); }
  75% { transform: rotate(-3deg); }
  100% { transform: rotate(0); }
}
```
REGRA: max 10-20% exaggeration para web (nao e cartoon)

### 9. Overlap e Offset
```javascript
// Elementos nao comecam/terminam juntos
gsap.timeline()
  .from('.title', { opacity: 0, y: 20 }, 0)
  .from('.subtitle', { opacity: 0, y: 20 }, 0.15) // Offset
  .from('.image', { opacity: 0, scale: 0.95 }, 0.1); // Overlaps
```

### 10. Validar Appeal
- Assistir animacao completa 3x
- Perguntar: "isso tem personalidade?"
- Se parece generico, adicionar UM principio (anticipation ou follow-through)
- Se parece exagerado, reduzir 30%
- O objetivo e que a animacao "sinta" certa, nao que seja notada

## Output
- Animacao enhanced com principios Disney aplicados
- Notas de quais principios foram usados e onde
- Before/after comparison descritivo
- Easing curves atualizadas
- Secondary actions adicionadas
- Warnings de exaggeration se aplicavel

## Quality Criteria
- [ ] Slow in/slow out em todas animacoes (nunca linear)
- [ ] Anticipation sutil (max 100ms, scale 0.95-0.98)
- [ ] Follow-through natural (overshoot < 5%)
- [ ] Secondary action NAO compete com primary
- [ ] Exaggeration < 20% (web, nao cartoon)
- [ ] Staging: focal point claro
- [ ] Appeal: animacao tem "vida" mas nao distrai
- [ ] prefers-reduced-motion: todos enhancements removidos
