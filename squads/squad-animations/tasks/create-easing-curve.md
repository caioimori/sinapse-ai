---
task: create-easing-curve
responsavel: "@motion-choreographer"
responsavel_type: Agent
atomic_layer: Task
elicit: false

Entrada:
  - campo: feeling
    tipo: string
    origem: "animation_brief"
    obrigatorio: true

Saida:
  - campo: easing_curve
    tipo: object
    destino: "agente executor"

Checklist:
  - "[ ] Consultar feeling-to-parameters-mapping"
  - "[ ] Selecionar ou criar cubic-bezier"
  - "[ ] Considerar spring physics se aplicavel"
  - "[ ] Testar curva com preview mental"
  - "[ ] Documentar rational da escolha"
---

# Task: Create Easing Curve

## Metadata
- **Agent:** motion-choreographer (Tempo)
- **Squad:** squad-animations
- **Complexity:** MEDIUM

## Objetivo
Selecionar ou criar easing curves que traduzem o feeling desejado em parametros matematicos — cubic-bezier, spring physics ou custom curves. A curva de easing e o DNA da personalidade da animacao.

## Pre-Conditions
- Feeling/mood desejado definido no brief
- Tipo de animacao (entrance, exit, hover, continuous)
- Consultar KB: feeling-to-parameters-mapping
- Consultar KB: easing-functions-reference

## Passos

### 1. Mapear Feeling para Familia de Easing
| Feeling | Familia | Exemplo Bezier |
|---------|---------|---------------|
| Snappy/decisive | Sharp decelerate | (0.0, 0.0, 0.2, 1) |
| Smooth/premium | Standard ease | (0.4, 0.0, 0.2, 1) |
| Bouncy/playful | Overshoot | (0.175, 0.885, 0.32, 1.275) |
| Heavy/powerful | Slow start | (0.7, 0.0, 0.2, 1) |
| Light/delicate | Quick start | (0.1, 0.0, 0.2, 1) |
| Dramatic/cinematic | Extreme ease | (0.86, 0, 0.07, 1) |
| Mechanical/robotic | Linear | (0, 0, 1, 1) |

### 2. Entender Cubic-Bezier Anatomy
```
cubic-bezier(x1, y1, x2, y2)
  x1, y1 = control point 1 (start shape)
  x2, y2 = control point 2 (end shape)

  y > 1.0 = overshoot (bounce past target)
  x1 = 0, y1 = 0 = starts fast (decelerate)
  x2 = 1, y2 = 1 = ends slow (accelerate)
```

### 3. Selecionar Presets por Contexto
| Contexto | Preset | Bezier |
|----------|--------|--------|
| UI entrance | ease-out | (0, 0, 0.2, 1) |
| UI exit | ease-in | (0.4, 0, 1, 1) |
| UI state change | ease-in-out | (0.4, 0, 0.2, 1) |
| Hover response | quick ease-out | (0, 0, 0.15, 1) |
| Modal open | decelerate | (0, 0, 0.2, 1) |
| Bounce back | overshoot | (0.34, 1.56, 0.64, 1) |

### 4. Criar Spring Easing (GSAP)
```javascript
// Spring physics para animacoes organicas
gsap.to(element, {
  y: 0,
  ease: 'elastic.out(1, 0.3)', // amplitude, period
  duration: 0.8,
});
// Ou custom spring:
gsap.to(element, {
  y: 0,
  ease: CustomEase.create('custom', 'M0,0 C0.05,0.7 0.14,1.12 0.3,1.08 0.45,1.04 0.65,1 1,1'),
});
```

### 5. Criar CSS Spring Approximation
```css
/* Spring-like with overshoot */
.spring-bounce {
  transition-timing-function: cubic-bezier(0.175, 0.885, 0.32, 1.275);
}
/* Multiple bounces need @keyframes */
@keyframes spring-in {
  0% { transform: scale(0); }
  60% { transform: scale(1.08); }
  80% { transform: scale(0.97); }
  100% { transform: scale(1); }
}
```

### 6. Easing para Scroll-Driven
- Scroll-driven: geralmente `ease: 'none'` (linear)
- Ou `ease: 'power1.out'` para feeling suave
- Scrub com smoothing: `scrub: 1` (1 segundo catch-up)

### 7. Testar Curva Mentalmente
- Imaginar o objeto acelerando/desacelerando
- A curva deve "sentir" como o feeling descrito
- Se parece com ease-in-out padrao, provavelmente e boring
- Customizar pelo menos um control point para dar personalidade

### 8. Documentar Easing Token
```yaml
easing_curves:
  name: "premium-decelerate"
  css: "cubic-bezier(0.0, 0.0, 0.2, 1)"
  gsap: "power3.out"
  feeling: "Premium, controlled, confident"
  use_for: ["entrances", "modals", "page transitions"]
  avoid_for: ["exits", "micro-interactions"]
```

### 9. Consistencia no Projeto
- Max 3-5 easing curves por projeto
- Cada curve tem um nome semantico
- Evitar curvas diferentes para o mesmo tipo de animacao
- Brand personality refletida na escolha de curvas

### 10. Reduced Motion Easing
- prefers-reduced-motion: nao precisa de easing (instant)
- Se manter animacao reduzida: usar linear ou ease padrao
- Spring/bounce: eliminar completamente

## Output
- Easing curve(s) selecionadas com valores
- CSS cubic-bezier e GSAP ease equivalente
- Spring parameters se aplicavel
- Documentacao de feeling e uso
- Token name para design system
- Reduced motion alternative

## Quality Criteria
- [ ] Easing traduz o feeling descrito no brief
- [ ] Bezier values documentados (CSS e GSAP)
- [ ] Contexto de uso definido (entrance/exit/hover)
- [ ] Consistente com outras curvas do projeto
- [ ] Max 5 curvas unicas por projeto
- [ ] Spring physics parametros documentados
- [ ] Token name semantico atribuido
- [ ] Reduced motion: linear ou instant
