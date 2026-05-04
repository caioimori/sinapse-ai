---
task: design-spacing-scale
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

# Task: Design Spacing Scale

## Metadata
- **Squad:** squad-design
- **Agent:** Stratum (dx-design-system-architect)
- **Complexity:** Standard

## Objetivo
Projetar a escala de spacing do design system — definir valores, naming e regras de uso que garantem consistencia espacial em todo o produto.

## Entrada
- Grid system (de Canvas)
- Content density requirements
- Typography scale (para harmonizar)
- Platform conventions

## Passos

### 1. Definir Base Unit
| Opcao | Base | Escala | Quando usar |
|-------|------|--------|------------|
| 4px | 4px | 4,8,12,16,20,24,32,40,48,64,80,96 | Tight spacing, compact UIs |
| 8px | 8px | 8,16,24,32,40,48,64,80,96,128 | Standard, spacious |

Recomendacao: **4px base** com emphasis em multiplos de 8px.

### 2. Definir Spacing Scale
```yaml
spacing_scale:
  base: "4px"

  values:
    - token: "space-0"
      value: "0px"
      usage: "No spacing"

    - token: "space-0.5"
      value: "2px"
      usage: "Hairline gaps"

    - token: "space-1"
      value: "4px"
      usage: "Tight inline spacing"

    - token: "space-2"
      value: "8px"
      usage: "Related elements, icon gaps"

    - token: "space-3"
      value: "12px"
      usage: "Intra-component padding"

    - token: "space-4"
      value: "16px"
      usage: "Default padding, form gaps"

    - token: "space-5"
      value: "20px"
      usage: "Card padding"

    - token: "space-6"
      value: "24px"
      usage: "Section padding (compact)"

    - token: "space-8"
      value: "32px"
      usage: "Section gaps"

    - token: "space-10"
      value: "40px"
      usage: "Large section gaps"

    - token: "space-12"
      value: "48px"
      usage: "Major section padding"

    - token: "space-16"
      value: "64px"
      usage: "Page section separation"

    - token: "space-20"
      value: "80px"
      usage: "Hero padding"

    - token: "space-24"
      value: "96px"
      usage: "Maximum section spacing"
```

### 3. Definir Usage Patterns
| Contexto | Token Range | Exemplo |
|----------|------------|---------|
| Inline elements | space-1 to space-2 | Icon + text gap |
| Form elements | space-2 to space-4 | Label to input, input to help text |
| Cards | space-4 to space-6 | Internal padding |
| Sections | space-8 to space-16 | Between page sections |
| Pages | space-12 to space-24 | Page padding, hero spacing |

### 4. Spacing Relationships
| Relacao | Regra | Exemplo |
|---------|-------|---------|
| Intra-component | Menor | space-2 to space-3 inside a card |
| Inter-component | Medio | space-4 to space-6 between cards |
| Section gaps | Maior | space-8 to space-16 between sections |

Principio: **Lei da Proximidade (Gestalt)** — elementos mais proximos sao percebidos como relacionados.

### 5. Responsive Spacing
| Breakpoint | Adjustment | Exemplo |
|-----------|-----------|---------|
| Mobile | 75% of desktop | section gap: space-8 → space-6 |
| Tablet | 85% of desktop | section gap: space-8 → space-6 |
| Desktop | 100% (base) | section gap: space-8 |

### 6. Negative Space Guidelines
- **Whitespace e intencional** — nao e espaco vazio
- **Mais whitespace = mais premium** (luxury brands)
- **Menos whitespace = mais density** (dashboards, tools)
- **Consistencia > quantidade** — spacing irregular causa desconforto

## Saida
- Spacing scale definition
- Usage guidelines por contexto
- Responsive adjustments
- Token documentation
- Handoff para Canvas (layouts) e Scaffold (implementation)

## Validacao
- [ ] Escala baseada em 4px
- [ ] Naming claro e sequencial
- [ ] Usage por contexto documentado
- [ ] Responsive adjustments definidos
- [ ] Alinhado com grid system
- [ ] Nao tem gaps na escala
