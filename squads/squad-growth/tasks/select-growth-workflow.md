---
task: select-growth-workflow
responsavel: "@growth-orqx"
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

# Task: Select Growth Workflow

## Metadata
- **Squad:** squad-growth
- **Agent:** Catalyst (growth-orqx)
- **Complexity:** Standard

## Objetivo
Selecionar o workflow de growth adequado — com base na maturidade de analytics, objetivos e contexto, determinar qual fluxo de trabalho otimiza resultados.

## Entrada
- Analytics maturity level (0-4)
- Growth brief
- Business priorities
- Timeline constraints

## Passos

### 1. Workflow Selection Matrix
| Situacao | Workflow | Agentes Primarios |
|----------|---------|-------------------|
| Sem tracking | Analytics Instrumentation Pipeline | Signal |
| Tracking OK, sem otimizacao | Full Growth Analytics Cycle | All |
| Conversao baixa | CRO Experimentation Sprint | Convert + Insight |
| SEO fraco | SEO Audit & Optimization Cycle | Rank |
| Growth estagnado | Growth Experiment Loop | Lever + Convert |
| Campanhas sem medicao | Campaign Performance Review | Pulse + Insight |

### 2. Criterios de Selecao
| Criterio | Peso | Avaliacao |
|----------|------|----------|
| Maturity alignment | 30% | Workflow compativel com nivel atual? |
| Business impact | 25% | Maior impacto potencial no curto prazo? |
| Data readiness | 20% | Dados suficientes para executar? |
| Resource fit | 15% | Time e ferramentas disponiveis? |
| Time to results | 10% | Prazo compativel com expectativas? |

### 3. Workflow Combinations
| Cenario | Combinacao Recomendada |
|---------|----------------------|
| Greenfield | Instrumentation → Full Cycle |
| Quick win | CRO Sprint (2-4 semanas) |
| Organic growth | SEO Cycle + Content loop |
| Paid optimization | Campaign Review + CRO Sprint |
| Product-led growth | Growth Experiment Loop |
| Comprehensive | Full Growth Analytics Cycle |

## Saida
- Selected workflow(s)
- Justification document
- Timeline estimate
- Agent allocation plan

## Validacao
- [ ] Workflow alinhado com maturity level
- [ ] Justificativa documentada
- [ ] Timeline definido
- [ ] Agentes alocados
- [ ] Dependencias identificadas
