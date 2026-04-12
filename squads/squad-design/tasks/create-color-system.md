---
task: create-color-system
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

# Task: Create Color System

## Metadata
- **Squad:** squad-design
- **Agent:** Stratum (dx-design-system-architect)
- **Complexity:** Complex

## Objetivo
Projetar o sistema de cores do design system — definir paletas, escalas de luminosidade, roles semanticas e garantir acessibilidade em todos os contextos.

## Entrada
- Brand colors (de squad-brand)
- WCAG 2.2 contrast requirements
- Dark mode requirements
- Data visualization needs
- Accessibility guidelines

## Passos

### 1. Definir Paletas Base
| Paleta | Cor Seed | Uso Principal |
|--------|---------|--------------|
| Neutral | — | Backgrounds, text, borders |
| Primary | Brand primary | Actions, brand identity |
| Secondary | Brand secondary | Supporting elements |
| Success | Green | Positive feedback |
| Warning | Amber/Orange | Caution |
| Error/Danger | Red | Errors, destructive |
| Info | Blue | Informational |

### 2. Gerar Escalas (11 Steps)
Para cada paleta, gerar steps com luminosidade progressiva:

| Step | Lightness Range | Uso Tipico |
|------|----------------|-----------|
| 50 | ~97% | Subtle backgrounds |
| 100 | ~93% | Light backgrounds |
| 200 | ~86% | Hover backgrounds |
| 300 | ~76% | Borders (light) |
| 400 | ~62% | Placeholder text |
| 500 | ~50% | Default shade (light bg) |
| 600 | ~40% | Default shade (interactive) |
| 700 | ~32% | Hover state (dark) |
| 800 | ~24% | Active state |
| 900 | ~17% | High emphasis text |
| 950 | ~10% | Maximum contrast |

### 3. Garantir Contrast Ratios
| Combinacao | WCAG Level | Min Ratio |
|-----------|-----------|-----------|
| Text (small) on background | AA | 4.5:1 |
| Text (large, >=18px bold) on background | AA | 3:1 |
| UI components on background | AA | 3:1 |
| Focus indicator on adjacent | AA | 3:1 |
| Text on colored backgrounds | AA | 4.5:1 |

### 4. Definir Color Roles
```yaml
color_roles:
  backgrounds:
    - name: "canvas"
      light: "white"
      dark: "neutral-950"
      usage: "Page background"

    - name: "surface"
      light: "white"
      dark: "neutral-900"
      usage: "Card, modal backgrounds"

    - name: "subtle"
      light: "neutral-50"
      dark: "neutral-800"
      usage: "Secondary backgrounds"

  text:
    - name: "primary"
      light: "neutral-900"
      dark: "neutral-50"
      usage: "Main text"

    - name: "secondary"
      light: "neutral-600"
      dark: "neutral-400"
      usage: "Supporting text"

  interactive:
    - name: "primary-action"
      light: "primary-500"
      dark: "primary-400"
      usage: "Buttons, links"

    - name: "primary-hover"
      light: "primary-600"
      dark: "primary-300"
      usage: "Hover state"

  feedback:
    success: "green-500/400"
    warning: "amber-500/400"
    error: "red-500/400"
    info: "blue-500/400"

  borders:
    default: "neutral-200/800"
    emphasis: "neutral-400/600"
    focus: "primary-500/400"
```

### 5. Data Visualization Palette
Cores para graficos e data viz:
- 6-8 cores distintas
- Distinguíveis por pessoas com daltonismo
- Funcionam em light e dark mode
- Ordered e categorical variants

### 6. Validar Acessibilidade
- Testar TODAS as combinacoes fg/bg
- Simular protanopia, deuteranopia, tritanopia
- Verificar com ferramenta de contraste (APCA recomendado)
- Documentar combinacoes que passam/falham

## Saida
- Color system documentation
- Palette definitions (11 steps each)
- Color roles mapping
- Contrast matrix
- Data visualization palette
- Accessibility verification report
- Handoff para Canvas (application) e Beacon (verification)

## Validacao
- [ ] Todas as paletas com 11 steps
- [ ] Contrast ratios WCAG 2.2 AA em todas as combinacoes
- [ ] Color roles definidos para light e dark
- [ ] Data visualization palette color-blind safe
- [ ] Nenhuma informacao comunicada apenas por cor
- [ ] APCA scores documentados
