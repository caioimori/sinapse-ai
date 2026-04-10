---
task: build-micro-interaction
responsavel: "@css-motion-artist"
responsavel_type: Agent
atomic_layer: Task
elicit: false

Entrada:
  - campo: interaction_spec
    tipo: object
    origem: "animation_brief"
    obrigatorio: true

Saida:
  - campo: micro_interaction
    tipo: code
    destino: "review-animation-quality"

Checklist:
  - "[ ] Identificar trigger (hover, focus, click, state change)"
  - "[ ] Implementar feedback visual imediato (menor que 100ms)"
  - "[ ] Adicionar transicao suave de saida"
  - "[ ] Testar em touch devices"
  - "[ ] Validar contraste e visibilidade"
---

# Task: Build Micro-Interaction

## Metadata
- **Agent:** css-motion-artist (Flux)
- **Squad:** squad-animations
- **Complexity:** LOW

## Objetivo
Criar micro-interactions — pequenos feedbacks visuais que respondem a acoes do usuario (hover, click, toggle, focus). Devem ser sutis, rapidos e comunicar estado de forma clara.

## Pre-Conditions
- Elemento alvo e trigger definidos no brief
- Timing guidelines do motion-choreographer (defaults: 100-300ms)
- Design system colors/tokens disponiveis
- Estado inicial e final do elemento claros

## Passos

### 1. Classificar Tipo de Micro-Interaction
| Tipo | Trigger | Duration | Exemplo |
|------|---------|----------|---------|
| Hover feedback | mouseenter | 150-200ms | Button lift, color shift |
| Click feedback | click/active | 100-150ms | Button press, ripple |
| Toggle state | click | 200-300ms | Switch, checkbox, like |
| Focus ring | focus-visible | instant | Outline, glow |
| Loading | async action | indefinido | Spinner, progress |
| Success/Error | state change | 300-400ms | Checkmark, shake |

### 2. Implementar Button Micro-Interaction
```css
.btn {
  transition: transform 150ms ease-out, box-shadow 150ms ease-out;
}
.btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(0,0,0,0.12);
}
.btn:active {
  transform: translateY(0) scale(0.98);
  transition-duration: 80ms;
}
```

### 3. Implementar Toggle Animation
```css
.toggle-thumb {
  transition: transform 200ms cubic-bezier(0.4, 0.0, 0.2, 1);
}
.toggle.active .toggle-thumb {
  transform: translateX(24px);
}
```

### 4. Criar Ripple Effect
```css
@keyframes ripple-expand {
  to { transform: scale(4); opacity: 0; }
}
.ripple::after {
  content: '';
  position: absolute;
  border-radius: 50%;
  background: rgba(255,255,255,0.3);
  transform: scale(0);
  animation: ripple-expand 400ms ease-out forwards;
}
```

### 5. Implementar Like/Heart Animation
```css
@keyframes heart-pop {
  0% { transform: scale(1); }
  30% { transform: scale(1.3); }
  50% { transform: scale(0.9); }
  100% { transform: scale(1); }
}
.heart.liked {
  animation: heart-pop 400ms cubic-bezier(0.175, 0.885, 0.32, 1.275);
}
```

### 6. Feedback de Erro (Shake)
```css
@keyframes shake {
  0%, 100% { transform: translateX(0); }
  20%, 60% { transform: translateX(-6px); }
  40%, 80% { transform: translateX(6px); }
}
.input-error { animation: shake 300ms ease-in-out; }
```

### 7. Configurar Timing por Contexto
| Contexto | Duration | Easing |
|----------|----------|--------|
| Immediate feedback | 80-150ms | ease-out |
| State transition | 200-300ms | ease-in-out |
| Celebratory | 400-600ms | spring-like bezier |
| Error/warning | 200-300ms | ease-in-out |

### 8. Implementar Reduced Motion
```css
@media (prefers-reduced-motion: reduce) {
  .btn, .toggle-thumb { transition: none; }
  .heart.liked, .input-error { animation: none; }
}
```

### 9. Testar Keyboard Navigation
- `:focus-visible` deve replicar hover feedback
- Tab order logico mantido
- Enter/Space triggeram click interactions

### 10. Validar Sutileza
- Micro-interactions NAO devem chamar atencao para si
- Se o usuario percebe conscientemente, esta exagerada
- Regra: se nao tiver certeza, reduza 30% o movimento

## Output
- Codigo CSS/SCSS com todas micro-interactions
- Variantes para hover, active, focus-visible
- Reduced motion alternatives
- Demo interativo para cada micro-interaction
- Tabela de triggers e timings

## Quality Criteria
- [ ] Feedback imediato (< 100ms para hover, < 50ms para click)
- [ ] 60fps em todas interacoes
- [ ] Funciona com mouse E keyboard
- [ ] prefers-reduced-motion implementado
- [ ] Visualmente sutil — nao distrai do conteudo
- [ ] Consistente com design system tokens
- [ ] Sem interference com click areas
- [ ] Testado em touch devices
