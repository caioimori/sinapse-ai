---
task: create-dark-light-themes
responsavel: "@dx-ui-designer"
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

# Task: Create Dark/Light Themes

## Metadata
- **Squad:** squad-design
- **Agent:** Canvas (dx-ui-designer)
- **Complexity:** Complex

## Objetivo
Projetar temas dark e light completos — mapear tokens semanticos para cada tema mantendo contraste, legibilidade e coerencia visual em ambos os modos.

## Entrada
- Primitive color tokens (de Stratum)
- Semantic token structure
- Brand colors
- WCAG 2.2 contrast requirements
- Content types (text, media, data viz)

## Passos

### 1. Definir Principios de Tema
| Principio | Light | Dark |
|-----------|-------|------|
| Background | Branco/neutro claro | Neutro escuro (NAO preto puro) |
| Text | Neutro-900 | Neutro-100 |
| Elevation | Shadows | Lighter surfaces |
| Vibrance | Saturated colors | Desaturated ~10-15% |
| Contrast | Standard WCAG | Standard WCAG |

### 2. Mapear Color System
```yaml
color_themes:
  light:
    background:
      default: "white"
      subtle: "neutral-50"
      muted: "neutral-100"
      emphasis: "neutral-900"
    foreground:
      default: "neutral-900"
      muted: "neutral-600"
      subtle: "neutral-400"
      on_emphasis: "white"
    border:
      default: "neutral-200"
      emphasis: "neutral-400"
    surface:
      raised: "white"  # With shadow
      overlay: "white"
    accent:
      default: "brand-500"
      emphasis: "brand-600"
      muted: "brand-100"
      subtle: "brand-50"

  dark:
    background:
      default: "neutral-950"  # #0a0a0a, NOT pure black
      subtle: "neutral-900"
      muted: "neutral-800"
      emphasis: "neutral-100"
    foreground:
      default: "neutral-50"
      muted: "neutral-400"
      subtle: "neutral-500"
      on_emphasis: "neutral-900"
    border:
      default: "neutral-800"
      emphasis: "neutral-600"
    surface:
      raised: "neutral-900"  # NO shadow, lighter surface
      overlay: "neutral-800"
    accent:
      default: "brand-400"  # Lighter for dark bg
      emphasis: "brand-300"
      muted: "brand-900"
      subtle: "brand-950"
```

### 3. Ajustar Cores para Dark Mode
Regras de adaptacao:
- **NAO usar preto puro (#000)** — causa eye strain, usar neutral-950
- **Desaturar cores 10-15%** — cores saturadas em dark bg causam vibration
- **Inverter escala de elevation** — dark mode usa lighter surfaces ao inves de shadows
- **Ajustar imagens** — reduzir brightness ~85% ou aplicar overlay sutil

### 4. Verificar Contraste (WCAG 2.2)
| Combinacao | Min Ratio | Status |
|-----------|-----------|--------|
| Body text / bg-default | 4.5:1 | |
| Heading / bg-default | 4.5:1 | |
| UI components / bg | 3:1 | |
| Focus indicator / adjacent | 3:1 | |
| Disabled text | N/A (nao requer) | |

### 5. Implementar Transicao
```yaml
theme_transition:
  duration: "200ms"
  easing: "ease-in-out"
  properties: ["background-color", "color", "border-color"]
  # NÃO animar shadows ou opacity (performance)
  preference: "prefers-color-scheme"
  default: "system"
  toggle: "manual override available"
```

### 6. Edge Cases
- Imagens em dark mode (brightness adjustment)
- Data visualizations (palettes alternativas)
- Logos (versao monotone para dark)
- User-generated content (contained, nao afetado)
- Syntax highlighting (palettes separadas)

## Saida
- Light theme token mapping completo
- Dark theme token mapping completo
- Contrast verification matrix
- Transition specifications
- Edge case documentation
- Handoff para Stratum (token implementation) e Beacon (contrast verification)

## Validacao
- [ ] Ambos os temas com contraste WCAG 2.2 AA
- [ ] Dark mode sem preto puro
- [ ] Cores desaturadas em dark mode
- [ ] Elevation invertida (surfaces vs shadows)
- [ ] Transicao entre temas suave
- [ ] Edge cases documentados
