---
task: plan-ux-research-sprint
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

# Task: Plan UX Research Sprint

## Metadata
- **Squad:** squad-design
- **Agent:** Compass (dx-ux-strategist)
- **Complexity:** Standard

## Objetivo
Planejar e configurar um sprint de pesquisa UX — definir objetivos, selecionar metodos, recrutar participantes e preparar protocolos.

## Entrada
- Research questions (do DX Brief ou stakeholders)
- Budget e timeline disponivel
- Recursos de pesquisa (ferramentas, acesso a usuarios)
- Estagio do projeto (discovery, validation, optimization)

## Passos

### 1. Definir Research Questions
| # | Question | Tipo | Prioridade |
|---|---------|------|-----------|
| RQ1 | | [Exploratoria/Validacao/Avaliacao] | |

### 2. Selecionar Metodos
| Metodo | Quando usar | Participantes | Duracao |
|--------|------------|--------------|---------|
| User Interviews | Discovery, compreensao profunda | 5-8 | 45-60min each |
| Usability Testing | Validar prototipos/produto | 5-7 | 30-45min each |
| Card Sorting | Definir IA | 15-30 | 15-20min each |
| Tree Testing | Validar IA | 30-50 | 10-15min each |
| Survey | Dados quantitativos, escala | 100+ | 5-10min |
| A/B Testing | Comparar alternativas | 1000+ | 1-2 semanas |
| Diary Study | Comportamento longitudinal | 10-15 | 1-4 semanas |
| Analytics Review | Baseline, patterns | N/A | 2-3 dias |

### 3. Configurar Sprint
```yaml
research_sprint:
  name: ""
  duration: ""
  goal: ""

  methods:
    - method: ""
      participants: 0
      sessions: 0
      duration_per_session: ""
      tools: []

  recruitment:
    criteria:
      include: []
      exclude: []
    source: "[user base / panel / intercept / social]"
    incentive: ""

  schedule:
    week_1: []
    week_2: []

  deliverables:
    - ""

  risks:
    - risk: ""
      mitigation: ""
```

### 4. Preparar Protocolos
Para cada metodo:
- Script/guia de moderacao
- Cenarios de teste
- Metricas a coletar
- Recording/consent forms

### 5. Setup de Ferramentas
| Ferramenta | Uso |
|-----------|-----|
| Maze | Unmoderated usability testing |
| UserTesting | Moderated sessions |
| Optimal Workshop | Card sorting, tree testing |
| Hotjar | Heatmaps, recordings |
| Google Analytics | Quantitative data |
| Lookback | Moderated remote testing |

## Saida
- Research sprint plan completo
- Protocolos de pesquisa por metodo
- Recruitment criteria e screening
- Schedule de sessoes
- Tool setup checklist

## Validacao
- [ ] Research questions claras e priorizadas
- [ ] Metodos adequados selecionados
- [ ] Numero de participantes suficiente
- [ ] Protocolos preparados
- [ ] Ferramentas configuradas
- [ ] Timeline realista
