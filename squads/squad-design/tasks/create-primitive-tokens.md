---
task: create-primitive-tokens
responsavel: "@dx-design-system-architect"
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

# Task: Create Primitive Tokens

## Metadata
- **Squad:** squad-design
- **Agent:** Stratum (dx-design-system-architect)
- **Complexity:** Standard

## Objetivo
Criar o nivel L1 de design tokens — valores primitivos (raw) que servem como foundation para todo o sistema de design.

## Entrada
- Token taxonomy (de define-token-taxonomy)
- Brand color palette
- Typography selections
- Spacing/sizing decisions

## Passos

### 1. Definir Color Primitives
```json
{
  "color": {
    "blue": {
      "50": { "$value": "#EFF6FF", "$type": "color" },
      "100": { "$value": "#DBEAFE", "$type": "color" },
      "200": { "$value": "#BFDBFE", "$type": "color" },
      "300": { "$value": "#93C5FD", "$type": "color" },
      "400": { "$value": "#60A5FA", "$type": "color" },
      "500": { "$value": "#3B82F6", "$type": "color" },
      "600": { "$value": "#2563EB", "$type": "color" },
      "700": { "$value": "#1D4ED8", "$type": "color" },
      "800": { "$value": "#1E40AF", "$type": "color" },
      "900": { "$value": "#1E3A8A", "$type": "color" },
      "950": { "$value": "#172554", "$type": "color" }
    }
  }
}
```

Paletas necessarias:
| Paleta | Steps | Uso |
|--------|-------|-----|
| Neutral | 50-950 (11) | Backgrounds, text, borders |
| Brand Primary | 50-950 (11) | Primary actions, brand |
| Brand Secondary | 50-950 (11) | Secondary elements |
| Success | 50-950 (11) | Positive feedback |
| Warning | 50-950 (11) | Caution states |
| Error | 50-950 (11) | Error states |
| Info | 50-950 (11) | Informational |
| White | single | #FFFFFF |
| Black | single | #000000 |

### 2. Definir Spacing Primitives
Base: 4px
```json
{
  "spacing": {
    "0": { "$value": "0px", "$type": "dimension" },
    "1": { "$value": "4px", "$type": "dimension" },
    "2": { "$value": "8px", "$type": "dimension" },
    "3": { "$value": "12px", "$type": "dimension" },
    "4": { "$value": "16px", "$type": "dimension" },
    "5": { "$value": "20px", "$type": "dimension" },
    "6": { "$value": "24px", "$type": "dimension" },
    "8": { "$value": "32px", "$type": "dimension" },
    "10": { "$value": "40px", "$type": "dimension" },
    "12": { "$value": "48px", "$type": "dimension" },
    "16": { "$value": "64px", "$type": "dimension" },
    "20": { "$value": "80px", "$type": "dimension" },
    "24": { "$value": "96px", "$type": "dimension" }
  }
}
```

### 3. Definir Typography Primitives
```json
{
  "font": {
    "family": {
      "sans": { "$value": "Inter, system-ui, sans-serif", "$type": "fontFamily" },
      "mono": { "$value": "JetBrains Mono, monospace", "$type": "fontFamily" }
    },
    "weight": {
      "regular": { "$value": 400, "$type": "fontWeight" },
      "medium": { "$value": 500, "$type": "fontWeight" },
      "semibold": { "$value": 600, "$type": "fontWeight" },
      "bold": { "$value": 700, "$type": "fontWeight" },
      "extrabold": { "$value": 800, "$type": "fontWeight" }
    },
    "size": {
      "xs": { "$value": "0.75rem", "$type": "dimension" },
      "sm": { "$value": "0.875rem", "$type": "dimension" },
      "base": { "$value": "1rem", "$type": "dimension" },
      "lg": { "$value": "1.125rem", "$type": "dimension" },
      "xl": { "$value": "1.25rem", "$type": "dimension" },
      "2xl": { "$value": "1.5rem", "$type": "dimension" },
      "3xl": { "$value": "1.875rem", "$type": "dimension" },
      "4xl": { "$value": "2.25rem", "$type": "dimension" },
      "5xl": { "$value": "3rem", "$type": "dimension" },
      "6xl": { "$value": "3.75rem", "$type": "dimension" }
    },
    "line-height": {
      "none": { "$value": "1", "$type": "number" },
      "tight": { "$value": "1.25", "$type": "number" },
      "snug": { "$value": "1.375", "$type": "number" },
      "normal": { "$value": "1.5", "$type": "number" },
      "relaxed": { "$value": "1.625", "$type": "number" },
      "loose": { "$value": "1.75", "$type": "number" }
    }
  }
}
```

### 4. Definir Primitives Restantes
- **Radius:** 0, 2px, 4px, 6px, 8px, 12px, 16px, full (9999px)
- **Shadow:** None, sm, md, lg, xl, 2xl
- **Z-index:** 0, 10, 20, 30, 40, 50
- **Opacity:** 0, 5, 10, 20, 40, 60, 80, 100
- **Duration:** 50ms, 100ms, 150ms, 200ms, 300ms, 500ms, 700ms, 1000ms
- **Easing:** linear, ease-in, ease-out, ease-in-out

## Saida
- Primitive tokens JSON (W3C DTCG format)
- Token inventory count
- Documentation per category
- Handoff para create-semantic-tokens

## Validacao
- [ ] Todos os valores sao raw (sem referencias)
- [ ] W3C DTCG $type em cada token
- [ ] Color palettes com 11 steps (50-950)
- [ ] Spacing em multiplos de 4px
- [ ] Typography scale consistente
- [ ] Total de primitives documentado
