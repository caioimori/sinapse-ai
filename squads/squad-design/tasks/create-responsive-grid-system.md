---
task: create-responsive-grid-system
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

# Task: Create Responsive Grid System

## Metadata
- **Squad:** squad-design
- **Agent:** Canvas (dx-ui-designer)
- **Complexity:** Complex

## Objetivo
Projetar o sistema de grid responsivo do projeto — definir breakpoints, colunas, gutters, margins e comportamentos de reflow que funcionam em todos os viewports.

## Entrada
- Project requirements (devices alvo)
- Content types e complexity
- Brand guidelines (se existentes)
- Performance considerations
- Accessibility requirements

## Passos

### 1. Definir Abordagem
| Abordagem | Quando | Vantagem |
|-----------|--------|----------|
| Mobile-First | Default, consumer-facing | Progressiva, performatica |
| Desktop-First | Admin panels, data-heavy | Funcionalidade completa first |
| Content-First | Content sites, editorial | Otimizado para leitura |

### 2. Configurar Breakpoints
```yaml
grid_system:
  approach: "mobile-first"

  breakpoints:
    - name: "sm"
      min_width: "640px"
      columns: 4
      gutter: "16px"
      margin: "16px"
      container: "100%"

    - name: "md"
      min_width: "768px"
      columns: 8
      gutter: "24px"
      margin: "32px"
      container: "100%"

    - name: "lg"
      min_width: "1024px"
      columns: 12
      gutter: "24px"
      margin: "48px"
      container: "1024px"

    - name: "xl"
      min_width: "1280px"
      columns: 12
      gutter: "32px"
      margin: "auto"
      container: "1280px"

    - name: "2xl"
      min_width: "1536px"
      columns: 12
      gutter: "32px"
      margin: "auto"
      container: "1440px"
```

### 3. Definir Layout Patterns
| Pattern | Grid Spans | Uso |
|---------|-----------|-----|
| Full Width | 12 cols | Heroes, full-bleed sections |
| Centered Content | 8-10 cols centered | Articles, text content |
| Sidebar + Content | 3+9 or 4+8 | Dashboards, docs |
| 2-Column Equal | 6+6 | Feature comparisons |
| 3-Column | 4+4+4 | Card grids |
| 4-Column | 3+3+3+3 | Product grids |
| Asymmetric | 5+7 or 7+5 | Hero + content |

### 4. Container Queries
Para components que devem responder ao container:
```yaml
container_queries:
  enabled: true
  components:
    - name: "card"
      breakpoints:
        - at: "< 300px"
          layout: "stacked"
        - at: ">= 300px"
          layout: "horizontal"
    - name: "navigation"
      breakpoints:
        - at: "< 768px"
          layout: "hamburger"
        - at: ">= 768px"
          layout: "horizontal"
```

### 5. Fluid Typography
Definir fluid type scaling:
```css
/* Fluid scale example */
--fluid-body: clamp(1rem, 0.5vw + 0.875rem, 1.125rem);
--fluid-h1: clamp(2rem, 3vw + 1rem, 3.5rem);
```

### 6. Documentar Reflow Rules
| Breakpoint | Reflow Behavior |
|-----------|-----------------|
| xl → lg | Sidebar collapses to top |
| lg → md | 3-col becomes 2-col |
| md → sm | 2-col becomes 1-col |
| sm | Full width, stack everything |

## Saida
- Grid system specification completa
- Breakpoint definitions
- Layout pattern library
- Container query specs
- Fluid typography configuration
- Reflow rules documentation

## Validacao
- [ ] Breakpoints testados em todos os viewports
- [ ] Grid math correto (colunas + gutters = container)
- [ ] Layout patterns cobrem todos os use cases
- [ ] Container queries para components adaptativos
- [ ] Fluid typography configurada
- [ ] Touch targets >= 44x44px em mobile
