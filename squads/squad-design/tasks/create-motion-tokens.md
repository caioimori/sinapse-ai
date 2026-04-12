---
task: create-motion-tokens
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

# Task: Create Motion Tokens

## Metadata
- **Squad:** squad-design
- **Agent:** Kinetic (dx-interaction-designer)
- **Complexity:** Standard

## Objetivo
Criar design tokens de motion — consolidar duracoes, easing curves e demais valores de animacao como tokens reutilizaveis no design system.

## Entrada
- Duration scale (de design-duration-scale)
- Easing curve library (de create-easing-curve-library)
- Token taxonomy (de Stratum)
- W3C DTCG spec

## Passos

### 1. Motion Token Categories
```json
{
  "motion": {
    "duration": {
      "instant": { "$value": "50ms", "$type": "duration" },
      "fast": { "$value": "100ms", "$type": "duration" },
      "normal": { "$value": "200ms", "$type": "duration" },
      "slow": { "$value": "300ms", "$type": "duration" },
      "slower": { "$value": "500ms", "$type": "duration" },
      "deliberate": { "$value": "700ms", "$type": "duration" }
    },
    "easing": {
      "standard": { "$value": [0.4, 0, 0.2, 1], "$type": "cubicBezier" },
      "decelerate": { "$value": [0, 0, 0.2, 1], "$type": "cubicBezier" },
      "accelerate": { "$value": [0.4, 0, 1, 1], "$type": "cubicBezier" },
      "sharp": { "$value": [0.4, 0, 0.6, 1], "$type": "cubicBezier" },
      "spring": { "$value": [0.175, 0.885, 0.32, 1.275], "$type": "cubicBezier" }
    },
    "delay": {
      "none": { "$value": "0ms", "$type": "duration" },
      "short": { "$value": "50ms", "$type": "duration" },
      "medium": { "$value": "100ms", "$type": "duration" },
      "long": { "$value": "200ms", "$type": "duration" }
    }
  }
}
```

### 2. Semantic Motion Tokens
```json
{
  "motion": {
    "transition": {
      "hover": {
        "duration": { "$value": "{motion.duration.fast}" },
        "easing": { "$value": "{motion.easing.standard}" }
      },
      "focus": {
        "duration": { "$value": "{motion.duration.instant}" },
        "easing": { "$value": "{motion.easing.sharp}" }
      },
      "expand": {
        "duration": { "$value": "{motion.duration.normal}" },
        "easing": { "$value": "{motion.easing.decelerate}" }
      },
      "collapse": {
        "duration": { "$value": "{motion.duration.fast}" },
        "easing": { "$value": "{motion.easing.accelerate}" }
      },
      "modal-enter": {
        "duration": { "$value": "{motion.duration.slow}" },
        "easing": { "$value": "{motion.easing.decelerate}" }
      },
      "modal-exit": {
        "duration": { "$value": "{motion.duration.normal}" },
        "easing": { "$value": "{motion.easing.accelerate}" }
      },
      "page": {
        "duration": { "$value": "{motion.duration.slower}" },
        "easing": { "$value": "{motion.easing.standard}" }
      }
    }
  }
}
```

### 3. CSS Custom Properties Export
```css
:root {
  /* Duration */
  --motion-duration-instant: 50ms;
  --motion-duration-fast: 100ms;
  --motion-duration-normal: 200ms;
  --motion-duration-slow: 300ms;
  --motion-duration-slower: 500ms;
  --motion-duration-deliberate: 700ms;

  /* Easing */
  --motion-ease-standard: cubic-bezier(0.4, 0, 0.2, 1);
  --motion-ease-decelerate: cubic-bezier(0, 0, 0.2, 1);
  --motion-ease-accelerate: cubic-bezier(0.4, 0, 1, 1);
  --motion-ease-sharp: cubic-bezier(0.4, 0, 0.6, 1);
  --motion-ease-spring: cubic-bezier(0.175, 0.885, 0.32, 1.275);

  /* Semantic */
  --motion-hover: var(--motion-duration-fast) var(--motion-ease-standard);
  --motion-expand: var(--motion-duration-normal) var(--motion-ease-decelerate);
  --motion-modal-enter: var(--motion-duration-slow) var(--motion-ease-decelerate);
}

/* Reduced motion override */
@media (prefers-reduced-motion: reduce) {
  :root {
    --motion-duration-instant: 0ms;
    --motion-duration-fast: 0ms;
    --motion-duration-normal: 0ms;
    --motion-duration-slow: 0ms;
    --motion-duration-slower: 0ms;
    --motion-duration-deliberate: 0ms;
  }
}
```

### 4. Integration com Token Pipeline
Adicionar motion tokens ao Style Dictionary config de Stratum.

## Saida
- Motion tokens JSON (W3C DTCG format)
- Semantic motion tokens
- CSS custom properties
- Reduced motion overrides
- Integration guide para token pipeline

## Validacao
- [ ] W3C DTCG compliant ($type: duration, cubicBezier)
- [ ] Semantic tokens referenciam primitives
- [ ] CSS custom properties geradas
- [ ] Reduced motion: todas duracoes = 0ms
- [ ] Integrado com token pipeline do Stratum
