---
task: create-wireframe-brief
responsavel: "@dx-ux-strategist"
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

# Task: Create Wireframe Brief

## Metadata
- **Squad:** squad-design
- **Agent:** Compass (dx-ux-strategist)
- **Complexity:** Standard

## Objetivo
Criar wireframes low-fidelity que traduzem a arquitetura de informacao e user flows em layouts estruturais — foco em hierarquia de conteudo, fluxo e funcionalidade, sem decisoes visuais.

## Entrada
- Information architecture (sitemap, navigation)
- User flows e journey maps
- Content hierarchy
- Personas e scenarios
- Business requirements

## Passos

### 1. Definir Escopo de Wireframing
| Tipo | Quando | Fidelidade |
|------|--------|-----------|
| Sketch (papel/digital) | Exploracao inicial | Muito baixa |
| Lo-fi wireframe | Validacao de estrutura | Baixa |
| Mid-fi wireframe | Handoff para UI design | Media |

### 2. Aplicar Layout Principles
- **F-Pattern / Z-Pattern:** Baseado em eye-tracking research
- **Visual Hierarchy:** Tamanho, contraste, posicao
- **Progressive Disclosure:** Complexidade gradual
- **Gestalt Principles:** Proximidade, similaridade, continuidade

### 3. Wireframe por Template
Para cada page template unico:

```yaml
wireframe_brief:
  page: ""
  template_type: ""  # Landing, Content, Dashboard, Form, etc

  layout:
    grid: "[12-col / flexible]"
    regions:
      - name: "header"
        content: []
        priority: ""
      - name: "hero"
        content: []
        priority: ""
      - name: "main"
        content: []
        priority: ""
      - name: "sidebar"
        content: []
        priority: ""
      - name: "footer"
        content: []
        priority: ""

  responsive_behavior:
    mobile: ""
    tablet: ""
    desktop: ""

  interactions:
    - element: ""
      action: ""
      result: ""

  content_requirements:
    - slot: ""
      type: "[text/image/component/dynamic]"
      character_limit: ""
      notes: ""
```

### 4. Documentar Decisoes
Para cada decisao de layout:
- Rationale (por que esta estrutura?)
- Alternativas consideradas
- Trade-offs aceitos

### 5. Anotar para Handoff
Cada wireframe deve incluir:
- Hierarquia de conteudo numerada
- Responsive breakpoints indicados
- Interacoes-chave anotadas
- Content slots dimensionados
- Notas de acessibilidade

## Saida
- Wireframe briefs por page template
- Annotations de layout e hierarquia
- Responsive behavior notes
- Interaction notes
- Handoff para Canvas (UI design)

## Validacao
- [ ] Todos os page templates wireframed
- [ ] Hierarquia de conteudo definida
- [ ] Responsive behavior documentado
- [ ] Interacoes-chave mapeadas
- [ ] Content slots dimensionados
- [ ] Alinhado com IA e user flows
