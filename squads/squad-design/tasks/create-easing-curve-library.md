---
task: create-easing-curve-library
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

# Task: Create Easing Curve Library

## Metadata
- **Squad:** squad-design
- **Agent:** Kinetic (dx-interaction-designer)
- **Complexity:** Standard

## Objetivo
Criar biblioteca de easing curves — definir curvas de aceleracao padronizadas como design tokens para consistencia de motion em todo o produto.

## Entrada
- Motion principles
- UI interaction types
- Performance considerations

## Passos

### 1. Easing Categories
| Categoria | Cubic Bezier | Uso |
|-----------|-------------|-----|
| **ease-in** | cubic-bezier(0.4, 0, 1, 1) | Elementos saindo da tela |
| **ease-out** | cubic-bezier(0, 0, 0.2, 1) | Elementos entrando na tela |
| **ease-in-out** | cubic-bezier(0.4, 0, 0.2, 1) | Elementos que mudam de posicao |
| **linear** | cubic-bezier(0, 0, 1, 1) | Progress bars, opacity fades |

### 2. Semantic Easing Tokens
```json
{
  "motion": {
    "easing": {
      "standard": {
        "$value": [0.4, 0, 0.2, 1],
        "$type": "cubicBezier",
        "$description": "Default for most transitions"
      },
      "decelerate": {
        "$value": [0, 0, 0.2, 1],
        "$type": "cubicBezier",
        "$description": "Elements entering the screen"
      },
      "accelerate": {
        "$value": [0.4, 0, 1, 1],
        "$type": "cubicBezier",
        "$description": "Elements leaving the screen"
      },
      "sharp": {
        "$value": [0.4, 0, 0.6, 1],
        "$type": "cubicBezier",
        "$description": "Quick, snappy interactions"
      },
      "spring": {
        "$value": [0.175, 0.885, 0.32, 1.275],
        "$type": "cubicBezier",
        "$description": "Playful overshoot (use sparingly)"
      },
      "bounce": {
        "$value": [0.34, 1.56, 0.64, 1],
        "$type": "cubicBezier",
        "$description": "Bouncy feel (attention-grabbing)"
      }
    }
  }
}
```

### 3. Usage Guide
| Interacao | Easing | Por que |
|-----------|--------|---------|
| Modal/dialog enter | decelerate | Chega suavemente |
| Modal/dialog exit | accelerate | Sai rapidamente |
| Hover state | standard | Transicao natural |
| Tab switch | standard | Mudanca de estado |
| Button press | sharp | Resposta imediata |
| Notification enter | decelerate + spring | Atrai atencao |
| Page transition | standard | Confortavel |
| Dropdown open | decelerate | Revela conteudo |
| Tooltip appear | sharp | Rapido e sutil |

### 4. CSS Custom Properties
```css
:root {
  --ease-standard: cubic-bezier(0.4, 0, 0.2, 1);
  --ease-decelerate: cubic-bezier(0, 0, 0.2, 1);
  --ease-accelerate: cubic-bezier(0.4, 0, 1, 1);
  --ease-sharp: cubic-bezier(0.4, 0, 0.6, 1);
  --ease-spring: cubic-bezier(0.175, 0.885, 0.32, 1.275);
}
```

### 5. Framer Motion Spring Config
```typescript
const springConfig = {
  gentle: { type: 'spring', stiffness: 120, damping: 14 },
  quick: { type: 'spring', stiffness: 300, damping: 25 },
  bouncy: { type: 'spring', stiffness: 400, damping: 10 },
  slow: { type: 'spring', stiffness: 100, damping: 20 },
};
```

## Saida
- Easing curve library (W3C DTCG tokens)
- CSS custom properties
- Framer Motion spring configs
- Usage guide per interaction type
- Visual curve reference

## Validacao
- [ ] Todas as categorias definidas
- [ ] Tokens em formato W3C DTCG
- [ ] CSS custom properties geradas
- [ ] Usage guide com exemplos
- [ ] Spring configs para Framer Motion
- [ ] Sem curvas que causem motion sickness
