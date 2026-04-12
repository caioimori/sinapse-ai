---
task: compose-screen-layouts
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

# Task: Compose Screen Layouts

## Metadata
- **Squad:** squad-design
- **Agent:** Canvas (dx-ui-designer)
- **Complexity:** Complex

## Objetivo
Compor layouts de tela high-fidelity que traduzem wireframes em composicoes visuais finais — aplicando grid system, tipografia, cores e hierarquia visual.

## Entrada
- Wireframe briefs (de Compass)
- Brand tokens (de squad-brand)
- Design system tokens (de Stratum)
- Content hierarchy
- Responsive requirements

## Passos

### 1. Aplicar Grid System
| Breakpoint | Colunas | Gutter | Margin | Max Width |
|-----------|---------|--------|--------|-----------|
| Mobile (< 640px) | 4 | 16px | 16px | 100% |
| Tablet (640-1024px) | 8 | 24px | 32px | 100% |
| Desktop (1024-1280px) | 12 | 24px | 48px | 1280px |
| Wide (> 1280px) | 12 | 32px | auto | 1440px |

### 2. Compor por Regioes
Para cada screen layout:

```yaml
screen_layout:
  name: ""
  page_template: ""
  breakpoint: "desktop"  # Design-first breakpoint

  regions:
    - name: "header"
      grid_span: "1-12"
      height: "[fixed/auto]"
      components: []

    - name: "hero"
      grid_span: "1-12"
      height: ""
      components: []
      visual_weight: "heavy"

    - name: "content"
      grid_span: "[varies]"
      components: []

    - name: "sidebar"
      grid_span: "[varies]"
      components: []
      responsive_behavior: "collapse-below-content on mobile"

    - name: "footer"
      grid_span: "1-12"
      components: []
```

### 3. Estabelecer Hierarquia Visual
| Nivel | Tratamento | Uso |
|-------|-----------|-----|
| Display | 48-72px, heavy weight | Hero headlines |
| H1 | 32-40px, bold | Page titles |
| H2 | 24-32px, semibold | Section headings |
| H3 | 20-24px, medium | Subsections |
| Body | 16-18px, regular | Main content |
| Small | 14px, regular | Captions, metadata |
| Micro | 12px, medium | Labels, badges |

### 4. Aplicar Principios de Composicao
- **Proximity:** Elementos relacionados agrupados
- **Alignment:** Anchorar em grid lines
- **Contrast:** Peso visual diferenciado por importancia
- **Repetition:** Padroes visuais consistentes
- **White Space:** Breathing room proporcional ao nivel

### 5. Documentar Spacing System
Usar escala baseada em 8px:
| Token | Valor | Uso |
|-------|-------|-----|
| space-1 | 4px | Intra-component |
| space-2 | 8px | Tight grouping |
| space-3 | 16px | Related elements |
| space-4 | 24px | Section padding |
| space-5 | 32px | Section gaps |
| space-6 | 48px | Major sections |
| space-8 | 64px | Page sections |
| space-10 | 80px | Hero padding |

### 6. Responsive Adaptation
Documentar como cada regiao se adapta:
- Reflow order (source order vs visual order)
- Breakpoint-specific overrides
- Touch target adjustments (>= 44x44px)
- Typography scale adjustments

## Saida
- High-fidelity screen layouts por template
- Grid specifications
- Spacing documentation
- Responsive behavior notes
- Handoff para Scaffold (implementation)

## Validacao
- [ ] Grid system aplicado consistentemente
- [ ] Hierarquia visual clara (squint test)
- [ ] Spacing system seguido (8px base)
- [ ] Responsive behavior documentado
- [ ] Touch targets >= 44x44px (mobile)
- [ ] Alinhado com brand tokens
