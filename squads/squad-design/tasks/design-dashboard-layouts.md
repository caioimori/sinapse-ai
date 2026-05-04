---
task: design-dashboard-layouts
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

# Task: Design Dashboard Layouts

## Metadata
- **Squad:** squad-design
- **Agent:** Canvas (dx-ui-designer)
- **Complexity:** Complex

## Objetivo
Projetar layouts de dashboard que comunicam informacao densa de forma clara — organizar widgets, KPIs, graficos e acoes em composicoes escaneabeis e acionaveis.

## Entrada
- User personas (quem usa dashboards)
- KPIs e metricas relevantes
- Data types e volumes
- User tasks no dashboard
- Device priorities

## Passos

### 1. Classificar Tipo de Dashboard
| Tipo | Proposito | Densidade | Interatividade |
|------|----------|-----------|---------------|
| Strategic | Visao executiva | Baixa | Drill-down |
| Analytical | Explorar dados | Alta | Filtros, slicing |
| Operational | Monitorar em tempo real | Media | Alertas, acoes |
| Informational | Reportar status | Media-baixa | Minimal |

### 2. Definir Layout Structure
```yaml
dashboard_layout:
  type: ""
  grid: "12-column"

  regions:
    - name: "header"
      span: "1-12"
      content: ["title", "date_range", "filters", "actions"]

    - name: "kpi_bar"
      span: "1-12"
      content: ["kpi_card x 4-6"]
      height: "auto"

    - name: "primary_chart"
      span: "1-8"
      content: ["main visualization"]
      height: "400px"

    - name: "secondary_panel"
      span: "9-12"
      content: ["supporting data", "recent activity"]
      height: "400px"

    - name: "detail_grid"
      span: "1-12"
      content: ["table or card grid"]
      height: "auto"
```

### 3. Projetar Widget System
| Widget | Uso | Tamanho Grid |
|--------|-----|-------------|
| KPI Card | Single metric + trend | 2-3 cols |
| Line Chart | Trends over time | 4-8 cols |
| Bar Chart | Comparacoes | 4-8 cols |
| Donut/Pie | Distribuicao | 3-4 cols |
| Table | Data detalhada | 6-12 cols |
| Activity Feed | Eventos recentes | 3-4 cols |
| Map | Dados geograficos | 6-8 cols |
| Sparkline | Inline trends | 2-3 cols |

### 4. Information Hierarchy
| Nivel | Conteudo | Visual Treatment |
|-------|----------|-----------------|
| L1 | KPIs principais (3-5) | Grande, topo, bold |
| L2 | Trends e charts | Meio, graficos |
| L3 | Detalhes e tabelas | Abaixo, menor |
| L4 | Filtros e acoes | Header ou sidebar |

### 5. Responsive Adaptation
| Viewport | KPIs | Charts | Tables |
|----------|------|--------|--------|
| Desktop | 4-6 em linha | Full-size | Full columns |
| Tablet | 3 em linha | Reduced | Key columns |
| Mobile | 2 em linha, stacked | Simplified | Card view |

### 6. Data Visualization Principles
- **Escolher chart type pelo tipo de dado** (nao por estetica)
- **Manter ratio informacao/tinta alto** (Tufte)
- **Evitar 3D, shadows em charts**
- **Labels diretos** (nao legendas separadas quando possivel)
- **Cores acessiveis** para daltonismo (nao apenas cor)
- **Loading states** para dados asincrono (skeleton)

## Saida
- Dashboard layout templates
- Widget design specifications
- Data visualization guidelines
- Responsive adaptation rules
- Loading/empty state specs
- Handoff para Scaffold (implementation)

## Validacao
- [ ] Hierarquia de informacao clara
- [ ] KPIs visiveis acima do fold
- [ ] Charts adequados ao tipo de dado
- [ ] Responsive em todos os breakpoints
- [ ] Loading states para dados async
- [ ] Color-blind safe palette
