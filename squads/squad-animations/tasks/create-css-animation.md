---
task: create-css-animation
responsavel: "@css-motion-artist"
responsavel_type: Agent
atomic_layer: Task
elicit: false

Entrada:
  - campo: animation_spec
    tipo: object
    origem: "animation_brief ou motion-choreographer"
    obrigatorio: true

Saida:
  - campo: css_animation
    tipo: code
    destino: "motion-choreographer para review"

Checklist:
  - "[ ] Usar apenas propriedades compositor-friendly (transform, opacity)"
  - "[ ] Implementar @keyframes com timing correto"
  - "[ ] Aplicar will-change seletivamente"
  - "[ ] Garantir GPU acceleration"
  - "[ ] Adicionar prefers-reduced-motion fallback"
---

# Task: Create CSS Animation

## Metadata
- **Agent:** css-motion-artist (Flux)
- **Squad:** squad-animations
- **Complexity:** MEDIUM

## Objetivo
Criar animacoes CSS puras usando @keyframes, transitions e animation properties — entregar motion fluido, performatico e acessivel sem dependencia de JavaScript.

## Pre-Conditions
- Animation brief ou timing spec com comportamento desejado
- Easing curve definida (ou delegar para motion-choreographer)
- Performance budget: 60fps, composite-only properties
- Target elements identificados no DOM

## Passos

### 1. Classificar Tipo de Animacao
| Tipo | Approach | Quando Usar |
|------|----------|-------------|
| State change | `transition` | hover, focus, active, class toggle |
| Continuous | `@keyframes` + `animation` | loading, ambient, decorative |
| Entrance | `@keyframes` + trigger class | scroll-reveal, page-load |
| Exit | `@keyframes` + removal delay | modal close, element removal |

### 2. Definir Keyframes
```css
@keyframes fade-slide-up {
  0% {
    opacity: 0;
    transform: translateY(20px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}
```

### 3. Configurar Animation Properties
```css
.animated-element {
  animation-name: fade-slide-up;
  animation-duration: 400ms;
  animation-timing-function: cubic-bezier(0.0, 0.0, 0.2, 1);
  animation-delay: 0ms;
  animation-fill-mode: both;
  animation-iteration-count: 1;
}
```

### 4. Selecionar Propriedades Animaveis Seguras
| Seguro (composite) | Evitar (layout/paint) |
|--------------------|-----------------------|
| `transform` | `width`, `height` |
| `opacity` | `margin`, `padding` |
| `filter` | `top`, `left`, `right`, `bottom` |
| `clip-path` | `border-radius` (paint) |

### 5. Implementar Transitions para State Changes
```css
.button {
  transition: transform 200ms ease-out, box-shadow 200ms ease-out;
}
.button:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
}
.button:active {
  transform: translateY(0);
  transition-duration: 100ms;
}
```

### 6. Configurar will-change Corretamente
- Aplicar `will-change: transform, opacity` apenas antes da animacao
- Remover apos animacao completar (`will-change: auto`)
- NAO aplicar em muitos elementos simultaneamente (memory overhead)

### 7. Criar Stagger com CSS Custom Properties
```css
.stagger-item {
  animation: fade-slide-up 400ms ease-out both;
  animation-delay: calc(var(--index) * 80ms);
}
```

### 8. Implementar Reduced Motion
```css
@media (prefers-reduced-motion: reduce) {
  .animated-element {
    animation: none;
    opacity: 1;
    transform: none;
  }
  .button { transition: none; }
}
```

### 9. Testar Animation Composition
- Verificar que multiplas animacoes no mesmo elemento nao conflitam
- Usar `animation-composition: accumulate` quando necessario
- Testar interrupcao e re-trigger de animacoes

### 10. Validar Performance
- Chrome DevTools > Performance tab > gravar 3 segundos
- Verificar: sem frames abaixo de 16ms
- Confirmar: apenas composite layers ativas
- Checar: sem forced reflows no console

## Output
- Arquivo CSS/SCSS com @keyframes e animation rules
- Transitions para estados interativos
- Reduced motion alternatives completas
- Documentacao de timing e easing choices
- Demo HTML para validacao visual

## Quality Criteria
- [ ] 60fps constante durante toda animacao
- [ ] Apenas propriedades composite animadas
- [ ] will-change aplicado e removido corretamente
- [ ] prefers-reduced-motion implementado
- [ ] animation-fill-mode correto (sem flash de estado inicial)
- [ ] Stagger delays proporcionais ao numero de items
- [ ] Cross-browser (Chrome, Firefox, Safari, Edge)
- [ ] Sem layout shift (CLS = 0)
