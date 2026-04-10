---
task: build-css-3d-transform
responsavel: "@css-motion-artist"
responsavel_type: Agent
atomic_layer: Task
elicit: false

Entrada:
  - campo: transform_spec
    tipo: object
    origem: "animation_brief"
    obrigatorio: true

Saida:
  - campo: css_3d
    tipo: code
    destino: "review-animation-quality"

Checklist:
  - "[ ] Configurar perspective no container"
  - "[ ] Implementar rotateX/Y/Z com translateZ"
  - "[ ] Configurar transform-style: preserve-3d"
  - "[ ] Adicionar backface-visibility se necessario"
  - "[ ] Testar depth ordering"
---

# Task: Build CSS 3D Transform

## Metadata
- **Agent:** css-motion-artist (Flux)
- **Squad:** squad-animations
- **Complexity:** MEDIUM

## Objetivo
Criar efeitos 3D usando CSS transforms puro — perspective, rotations, translations no eixo Z, card flips, e composicoes multi-layer com depth real. Entregar codigo limpo, performatico e cross-browser.

## Pre-Conditions
- Animation brief com tipo de efeito 3D desejado
- Design reference ou descricao do comportamento esperado
- Target browsers definidos (perspective e preserve-3d support)
- Performance budget estabelecido (60fps obrigatorio)

## Passos

### 1. Configurar Perspective Container
| Propriedade | Valor Recomendado | Uso |
|-------------|-------------------|-----|
| `perspective` | 800-1200px | Container pai — quanto menor, mais dramatico |
| `perspective-origin` | 50% 50% (default) | Ajustar para off-center effects |
| `transform-style` | preserve-3d | Obrigatorio em elementos intermediarios |

### 2. Definir Transform Stack
Ordem importa — transforms sao aplicados da direita para a esquerda:
```css
.element {
  transform: perspective(800px) rotateY(15deg) translateZ(50px);
  /* 1. translateZ primeiro, 2. rotateY, 3. perspective */
}
```

### 3. Implementar Card Flip Pattern
```css
.card-container {
  perspective: 1000px;
  width: 300px;
  height: 400px;
}
.card {
  position: relative;
  width: 100%;
  height: 100%;
  transform-style: preserve-3d;
  transition: transform 0.6s cubic-bezier(0.4, 0.0, 0.2, 1);
}
.card.flipped { transform: rotateY(180deg); }
.card-face {
  position: absolute;
  inset: 0;
  backface-visibility: hidden;
}
.card-back { transform: rotateY(180deg); }
```

### 4. Construir Multi-Layer Depth
```css
.scene { perspective: 1200px; }
.layer-back { transform: translateZ(-100px) scale(1.2); }
.layer-mid { transform: translateZ(0); }
.layer-front { transform: translateZ(100px) scale(0.8); }
```

### 5. Animar com Keyframes
```css
@keyframes rotate-3d {
  from { transform: rotateX(0) rotateY(0); }
  to { transform: rotateX(360deg) rotateY(360deg); }
}
.rotating-element {
  animation: rotate-3d 8s linear infinite;
  transform-style: preserve-3d;
}
```

### 6. Configurar Backface Visibility
- `hidden` para card flips e elementos que nao devem mostrar o verso
- `visible` para objetos 3D continuos que precisam de todas as faces

### 7. Tratar Depth Ordering (z-fighting)
- Usar `translateZ` com valores distintos para evitar z-fighting
- Adicionar `z-index` como fallback para browsers sem full 3D support
- Testar overlapping edges com anti-aliasing habilitado

### 8. Implementar Hover/Interaction 3D
```css
.tilt-card {
  transition: transform 0.3s ease-out;
  transform-style: preserve-3d;
}
.tilt-card:hover {
  transform: perspective(800px) rotateX(5deg) rotateY(-5deg) translateZ(10px);
}
```

### 9. Adicionar Reduced Motion Fallback
```css
@media (prefers-reduced-motion: reduce) {
  .card { transition: none; }
  .rotating-element { animation: none; }
  .tilt-card:hover { transform: none; }
}
```

### 10. Validar Cross-Browser
| Browser | Suporte | Nota |
|---------|---------|------|
| Chrome/Edge | Completo | — |
| Firefox | Completo | — |
| Safari | Completo | Pode precisar -webkit-perspective |
| Mobile Safari | Parcial | preserve-3d pode ter bugs em nested elements |

## Output
- Codigo CSS/SCSS com transforms 3D completos
- Fallback para browsers sem suporte a preserve-3d
- Reduced motion alternatives
- Demo HTML isolado para teste
- Documentacao de perspective values e reasoning

## Quality Criteria
- [ ] 60fps durante todas as transformacoes 3D
- [ ] Sem z-fighting visivel em nenhum angulo
- [ ] backface-visibility correto em card flips
- [ ] Funciona em Chrome, Firefox, Safari, Edge
- [ ] prefers-reduced-motion desativa animacoes
- [ ] Perspective values proporcionais ao viewport
- [ ] Sem layout shift durante transforms (CLS = 0)
- [ ] GPU-accelerated (composite-only properties)
