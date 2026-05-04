---
task: design-duration-scale
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

# Task: Design Duration Scale

## Metadata
- **Squad:** squad-design
- **Agent:** Kinetic (dx-interaction-designer)
- **Complexity:** Standard

## Objetivo
Projetar escala de duracao de animacoes — definir tempos padronizados que criam ritmo consistente e respeitam o Doherty Threshold (< 400ms).

## Entrada
- Motion principles
- Interaction types
- Performance requirements
- Accessibility (max duration)

## Passos

### 1. Duration Scale
```json
{
  "motion": {
    "duration": {
      "instant": { "$value": "50ms", "$type": "duration", "$description": "Hover states, opacity changes" },
      "fast": { "$value": "100ms", "$type": "duration", "$description": "Button states, small reveals" },
      "normal": { "$value": "200ms", "$type": "duration", "$description": "Default UI transitions" },
      "slow": { "$value": "300ms", "$type": "duration", "$description": "Complex transitions, panels" },
      "slower": { "$value": "500ms", "$type": "duration", "$description": "Page transitions, large reveals" },
      "deliberate": { "$value": "700ms", "$type": "duration", "$description": "Attention-grabbing, onboarding" }
    }
  }
}
```

### 2. Duration by Context
| Contexto | Duration | Rationale |
|----------|----------|-----------|
| Hover feedback | 50-100ms | Immediate response |
| Focus ring | 0ms (instant) | Never delay focus |
| Button state change | 100ms | Quick feedback |
| Tooltip appear | 100ms delay + 100ms fade | Brief wait |
| Dropdown open | 200ms | Smooth reveal |
| Modal enter | 200-300ms | Comfortable appearance |
| Modal exit | 150-200ms | Faster exit than enter |
| Tab content switch | 150-200ms | Quick swap |
| Page transition | 300-500ms | Noticeable but not slow |
| Loading skeleton | continuous | Until content loads |
| Notification auto-dismiss | 5000ms | Time to read |

### 3. Rules
| Regra | Descricao |
|-------|-----------|
| **Doherty Threshold** | Resposta total < 400ms para sentir "instantaneo" |
| **Exit < Enter** | Animacao de saida 20-30% mais rapida que entrada |
| **Larger = Slower** | Elementos maiores precisam de mais tempo |
| **Closer = Faster** | Movimentos curtos sao mais rapidos |
| **Max decorative** | 800ms maximo para animacoes decorativas |
| **No infinite** | Exceto loading spinners, nada infinito |

### 4. Size-Duration Relationship
| Tamanho do movimento | Duration |
|---------------------|----------|
| Micro (< 100px) | 100-200ms |
| Small (100-300px) | 200-300ms |
| Medium (300-600px) | 300-500ms |
| Large (> 600px) | 500-700ms |

### 5. Staggering (Sequencing)
Para listas animadas:
```yaml
stagger:
  delay_between_items: "50ms"
  max_total_duration: "500ms"  # Cap total stagger
  max_items: 10  # Stop staggering after 10
  direction: "[top-down/left-right/center-out]"
```

### 6. CSS Custom Properties
```css
:root {
  --duration-instant: 50ms;
  --duration-fast: 100ms;
  --duration-normal: 200ms;
  --duration-slow: 300ms;
  --duration-slower: 500ms;
  --duration-deliberate: 700ms;
}
```

## Saida
- Duration scale (W3C DTCG tokens)
- Duration by context guide
- Size-duration relationship
- Staggering rules
- CSS custom properties

## Validacao
- [ ] Scale progressiva e consistente
- [ ] Doherty Threshold respeitado (< 400ms para feedback)
- [ ] Exit < Enter rule documentada
- [ ] Max duration 800ms para decorativas
- [ ] Stagger capped em 500ms total
- [ ] Tokens em formato W3C DTCG
