---
task: implement-hover-effect
responsavel: "@css-motion-artist"
responsavel_type: Agent
atomic_layer: Task
elicit: false

Entrada:
  - campo: hover_spec
    tipo: object
    origem: "animation_brief"
    obrigatorio: true

Saida:
  - campo: hover_effect
    tipo: code
    destino: "review-animation-quality"

Checklist:
  - "[ ] Selecionar tipo (scale, magnetic, reveal, glow, underline, 3D tilt)"
  - "[ ] Implementar com CSS transitions (compositor-only)"
  - "[ ] Adicionar easing correto por tipo"
  - "[ ] Garantir saida suave"
  - "[ ] Testar com keyboard focus tambem"
---

# Task: Implement Hover Effect

## Metadata
- **Agent:** css-motion-artist (Flux)
- **Squad:** squad-animations
- **Complexity:** LOW

## Objetivo
Criar hover effects sofisticados e performaticos — desde lifts e glows simples ate reveals de conteudo, image zoom e cursor-following. Todos devem ter fallbacks para touch e keyboard.

## Pre-Conditions
- Elemento alvo e comportamento esperado definidos
- Design tokens (cores, sombras, radii) disponiveis
- Touch device strategy definida (hover nao existe em touch)
- Performance budget: transitions em composite properties

## Passos

### 1. Classificar Hover Pattern
| Pattern | Complexidade | Exemplo |
|---------|-------------|---------|
| Property shift | Baixa | Color change, shadow lift |
| Content reveal | Media | Text appears, overlay shows |
| Image effect | Media | Zoom, filter change |
| Cursor-follow | Alta | Element follows cursor |
| Magnetic | Alta | Element attracted to cursor |

### 2. Implementar Lift Effect
```css
.card {
  transition: transform 200ms ease-out, box-shadow 200ms ease-out;
}
.card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0,0,0,0.12);
}
```

### 3. Implementar Content Reveal
```css
.card-overlay {
  opacity: 0;
  transform: translateY(10px);
  transition: opacity 200ms ease, transform 200ms ease;
}
.card:hover .card-overlay {
  opacity: 1;
  transform: translateY(0);
}
```

### 4. Implementar Image Zoom on Hover
```css
.image-container { overflow: hidden; }
.image-container img {
  transition: transform 400ms cubic-bezier(0.0, 0.0, 0.2, 1);
}
.image-container:hover img {
  transform: scale(1.05);
}
```

### 5. Implementar Underline Animation
```css
.link::after {
  content: '';
  position: absolute;
  bottom: -2px; left: 0;
  width: 100%; height: 2px;
  background: currentColor;
  transform: scaleX(0);
  transform-origin: right;
  transition: transform 250ms ease-out;
}
.link:hover::after {
  transform: scaleX(1);
  transform-origin: left;
}
```

### 6. Implementar Tilt Effect (JS-enhanced)
```javascript
element.addEventListener('mousemove', (e) => {
  const rect = element.getBoundingClientRect();
  const x = (e.clientX - rect.left) / rect.width - 0.5;
  const y = (e.clientY - rect.top) / rect.height - 0.5;
  element.style.transform =
    `perspective(800px) rotateY(${x * 10}deg) rotateX(${-y * 10}deg)`;
});
element.addEventListener('mouseleave', () => {
  element.style.transform = '';
});
```

### 7. Touch Device Handling
```css
@media (hover: none) {
  .card:hover { transform: none; box-shadow: var(--shadow-default); }
  .card:active { transform: scale(0.98); }
}
```

### 8. Focus-Visible Parity
```css
.card:focus-visible {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0,0,0,0.12);
  outline: 2px solid var(--color-focus);
  outline-offset: 2px;
}
```

### 9. Testar Exit Transition
- Hover-out deve ser suave (nao snap back)
- Exit pode ser mais lento que enter: enter 200ms, exit 300ms

### 10. Performance Audit
- Verificar que hover nao causa layout/paint
- Testar com muitos elementos hover simultaneos (card grid)
- Confirmar GPU acceleration se necessario

## Output
- CSS/SCSS com hover effects completos
- Touch device fallbacks (@media hover: none)
- Focus-visible keyboard alternatives
- Tilt/cursor JS se aplicavel
- Demo HTML com todos os patterns

## Quality Criteria
- [ ] Transition suave em enter E exit
- [ ] 60fps em todos hover effects
- [ ] Touch devices: sem hover stuck state
- [ ] Keyboard: focus-visible replica hover visual
- [ ] Sem layout shift durante hover
- [ ] Image zoom nao causa overflow visivel
- [ ] Tilt effect max 10deg (prevenir nausea)
- [ ] Consistente com design system tokens
