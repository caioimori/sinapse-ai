---
task: blitzscaling-readiness-assessment
responsavel: "@reid-hoffman"
responsavel_type: Agent
atomic_layer: Task
elicit: true

Entrada:
  - campo: company_context
    tipo: string
    origem: User Input
    obrigatorio: true

Saida:
  - campo: readiness_report
    tipo: document
    destino: Console

Checklist:
  - "[ ] Growth factors avaliados"
  - "[ ] Growth limiters identificados"
  - "[ ] Estagio atual diagnosticado"
  - "[ ] Decisao blitzscale/nao-blitzscale fundamentada"
---

# Task: Blitzscaling Readiness Assessment

## Metadata
- **Squad:** squad-council
- **Agent:** Reid Hoffman
- **Complexity:** High

## Objetivo
Avaliar se uma empresa esta pronta para blitzscaling — o crescimento a velocidade que prioriza speed sobre eficiencia em condicoes de incerteza. Determinar se o contexto justifica blitzscaling ou se e prematuro. "Blitzscaling is what you do when you need to grow really, really quickly." — Hoffman

## Pre-Condicoes
- Empresa com produto em mercado
- Metricas basicas de crescimento disponiveis
- Clareza sobre competidores e dinamica de mercado

## Passos

### 1. Identificar Estagio Atual (Hoffman Scale)
| Estagio | Employees | Analogia | Caracteristicas |
|---------|----------|---------|----------------|
| Family | 1-9 | | Founder does everything |
| Tribe | 10-99 | | Specialists emerge |
| Village | 100-999 | | Middle management |
| City | 1000-9999 | | Divisions/BUs |
| Nation | 10000+ | | Complex bureaucracy |

Onde esta a empresa? Que transicao esta proximo?

### 2. Avaliar os 4 Growth Factors
| Factor | Score (1-5) | Evidencia |
|--------|-----------|-----------|
| **Market Size** — mercado grande o suficiente para justificar? | | |
| **Distribution** — canal escalavel identificado? | | |
| **High Gross Margins** — margens permitem investir em crescimento? | | |
| **Network Effects** — produto fica melhor com mais usuarios? | | |

Regra Hoffman: precisa de pelo menos 3 de 4 strong para justificar blitzscaling.

### 3. Avaliar os 2 Growth Limiters
| Limiter | Severidade (1-5) | Status |
|---------|-----------------|--------|
| **Lack of Product-Market Fit** — mercado realmente quer isto? | | |
| **Operational Scalability** — operacoes podem escalar 10x? | | |

Se qualquer limiter e >3, blitzscaling e arriscado demais.

### 4. Analisar Condicoes de Mercado
| Condicao | Status | Favorece Blitzscaling? |
|----------|--------|----------------------|
| Winner-take-all dynamics | | |
| First-scaler advantage (nao first-mover) | | |
| Competidores levantando capital | | |
| Window of opportunity se fechando | | |
| Regulacao permitindo crescimento rapido | | |

### 5. Avaliar Riscos de Blitzscaling
| Risco | Probabilidade | Impacto | Mitigavel? |
|-------|-------------|---------|-----------|
| Cash burn insustentavel | | | |
| Cultura se dilui com crescimento rapido | | | |
| Qualidade do produto degrada | | | |
| Contratacoes ruins em massa | | | |
| Infraestrutura nao escala | | | |
| Reguladores reagem | | | |

### 6. Calcular Readiness Score
```
Readiness = (Growth Factors avg * 2) - Growth Limiters avg + Market Conditions

Resultado:
  >= 7: GO — Blitzscale now
  4-6: CONDITIONAL — Fix limiters first
  <= 3: NO-GO — Premature, focus on PMF
```

### 7. Definir Blitzscaling Playbook (se GO)
| Dimensao | Acao | Timeline |
|----------|------|---------|
| Hiring | Contratacao agressiva com standards minimos | |
| Spending | Investir antes de otimizar | |
| Management | Transicao de generalista para especialista | |
| Culture | Codificar valores antes de diluir | |
| Infrastructure | Over-provision, nao otimizar | |
| Customer service | Aceitar degradacao temporaria | |

### 8. Definir Kill Criteria
Sinais de que blitzscaling deve parar:
- Unit economics permanentemente negativos
- Churn rate crescente sem plateau
- Mercado winner-take-all ja decidido (e nao somos nos)
- Cash runway < 6 meses sem path para mais
- "It's better to be wrong at the right time than right at the wrong time"

## Output
```yaml
blitzscaling_assessment:
  company: ""
  current_stage: ""
  growth_factors_score: "/20"
  growth_limiters_score: "/10"
  market_conditions: "favorable/neutral/unfavorable"
  readiness_score: "/10"
  verdict: "GO/CONDITIONAL/NO-GO"
  prerequisites_if_conditional: []
  playbook_if_go: []
  kill_criteria: []
```

## Validacao
- [ ] Estagio atual identificado na Hoffman Scale
- [ ] 4 growth factors avaliados com evidencia
- [ ] 2 growth limiters diagnosticados
- [ ] Condicoes de mercado analisadas
- [ ] Readiness score calculado
- [ ] Playbook ou prerequisites definidos conforme verdict
- [ ] Kill criteria estabelecidos
