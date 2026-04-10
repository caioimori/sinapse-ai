---
task: create-svg-animation
responsavel: "@css-motion-artist"
responsavel_type: Agent
atomic_layer: Task
elicit: false

Entrada:
  - campo: svg_spec
    tipo: object
    origem: "animation_brief"
    obrigatorio: true

Saida:
  - campo: svg_animation
    tipo: code
    destino: "review-animation-quality"

Checklist:
  - "[ ] Selecionar tecnica (stroke-dashoffset, morphing, masking)"
  - "[ ] Implementar com CSS ou GSAP DrawSVGPlugin"
  - "[ ] Calcular stroke-dasharray correto"
  - "[ ] Sequenciar multiplos paths"
  - "[ ] Testar em todos browsers"
---

# Task: Create SVG Animation

## Metadata
- **Agent:** css-motion-artist (Flux)
- **Squad:** squad-animations
- **Complexity:** MEDIUM

## Objetivo
Animar elementos SVG — line draws, morph paths, animated icons, logo reveals e ilustracoes interativas. SVG permite animacao vetorial precisa em qualquer resolucao.

## Pre-Conditions
- SVG limpo exportado (sem layers desnecessarios, IDs descritivos)
- viewBox configurado corretamente
- Paths otimizados (SVGO ou manual cleanup)
- Tipo de animacao definido no brief

## Passos

### 1. Classificar Tipo de SVG Animation
| Tipo | Tecnica | Exemplo |
|------|---------|---------|
| Line draw | stroke-dasharray/dashoffset | Logo reveal, icon draw |
| Path morph | CSS/JS path interpolation | Shape-shifting icons |
| Icon animation | CSS transforms no SVG group | Menu hamburger to X |
| Illustration | Sequenced CSS animations | Animated hero |
| Chart/data | JS-driven attribute animation | Bar chart entrance |

### 2. Preparar SVG para Animacao
```xml
<svg viewBox="0 0 100 100" role="img" aria-labelledby="svg-title">
  <title id="svg-title">Animated logo</title>
  <g id="logo-main">
    <path id="stroke-1" d="M10 50 L90 50" />
  </g>
</svg>
```

### 3. Implementar Line Draw
```css
.line-draw {
  stroke-dasharray: 200;
  stroke-dashoffset: 200;
  animation: draw-line 1.5s ease-out forwards;
}
@keyframes draw-line {
  to { stroke-dashoffset: 0; }
}
```
Calcular path length: `path.getTotalLength()`

### 4. Implementar Path Morph
```css
.morphing {
  clip-path: polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%);
  transition: clip-path 500ms cubic-bezier(0.4, 0.0, 0.2, 1);
}
.morphing:hover {
  clip-path: polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%);
}
```

### 5. Animar Icon (Hamburger to X)
```css
.menu-icon line {
  transition: transform 300ms ease, opacity 200ms ease;
  transform-origin: center;
}
.menu-icon.open .line-1 { transform: rotate(45deg); }
.menu-icon.open .line-2 { opacity: 0; }
.menu-icon.open .line-3 { transform: rotate(-45deg); }
```

### 6. Sequenciar Animacoes em Ilustracao
```css
#element-1 { animation: fade-in 400ms ease both 0ms; }
#element-2 { animation: fade-in 400ms ease both 100ms; }
#element-3 { animation: slide-up 400ms ease both 200ms; }
```

### 7. Configurar Responsividade SVG
- `width: 100%; height: auto; max-width: ...`
- transform-origin em SVG usa coordenadas do viewBox, nao percentuais
- Testar em diferentes aspect ratios

### 8. Acessibilidade SVG
- `<title>` e `<desc>` dentro do SVG
- `role="img"` e `aria-labelledby` para SVGs informativos
- `aria-hidden="true"` para decorativos
- Nao depender apenas de animacao para transmitir informacao

### 9. Implementar Reduced Motion
```css
@media (prefers-reduced-motion: reduce) {
  .line-draw, [class*="svg-anim"] {
    animation: none;
    stroke-dashoffset: 0;
    opacity: 1;
  }
}
```

### 10. Otimizar SVG
- SVGO para comprimir e remover metadata de editor
- `currentColor` para herdar cores do CSS
- Minificar IDs se nao usados para animacao
- Inline SVG para animacao (nao `<img>`)

## Output
- SVG animado com CSS/JS conforme tipo
- Reduced motion fallback
- SVG acessivel (title, desc, aria)
- Demo HTML com SVG responsivo
- Notas de path lengths para line-draw

## Quality Criteria
- [ ] SVG responsivo (escala sem distorcao)
- [ ] Line draw: path length calculado corretamente
- [ ] Transforms usam transform-origin correto (SVG coordinates)
- [ ] Acessivel: role, title, aria-labelledby
- [ ] prefers-reduced-motion implementado
- [ ] 60fps durante animacoes
- [ ] SVG otimizado (SVGO, sem metadata)
- [ ] Cross-browser (Chrome, Firefox, Safari)
