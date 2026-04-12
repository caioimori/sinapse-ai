---
task: run-quarterly-commercial-review
responsavel: "@commercial-orqx"
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

# Task: Run Quarterly Commercial Review

## Metadata
- **Squad:** squad-commercial
- **Agent:** Pipeline (commercial-orqx)
- **Complexity:** Advanced

## Objetivo
Conduzir revisao trimestral completa do sistema comercial — performance de cada agente, saude do pipeline, unit economics, retencao e iniciativas de melhoria para o proximo trimestre.

## Entrada
- Q-over-Q performance data
- Pipeline reports (Vault)
- Revenue metrics (Ledger)
- CS portfolio review (Bond)
- Funnel metrics (Cascade)
- Offer performance (Mint)
- Methodology adherence (Edge)

## Passos

### 1. Executive Scorecard
| Metric | Q Target | Q Actual | Variance | Trend |
|--------|---------|---------|----------|-------|
| New ARR | R$ | R$ | % | ↑↓→ |
| Expansion ARR | R$ | R$ | % | |
| Total ARR | R$ | R$ | % | |
| NRR | % | % | pp | |
| GRR | % | % | pp | |
| CAC | R$ | R$ | % | |
| LTV:CAC | x | x | | |
| Magic Number | | | | |
| Win Rate | % | % | pp | |
| Avg Deal Size | R$ | R$ | % | |
| Sales Cycle | days | days | | |

### 2. Agent Performance Review
| Agent | Key Metric | Target | Actual | Grade |
|-------|-----------|--------|--------|-------|
| Vault | CRM data completeness | 95% | | A-F |
| Cascade | MQL→SQL conversion | 14% | | |
| Mint | Proposal win rate | 45% | | |
| Ledger | Forecast accuracy | 90% | | |
| Bond | NRR | 120% | | |
| Edge | Methodology adherence | 80% | | |

### 3. Pipeline Health Inspection
| Stage | Deals | Value | Avg Age | Coverage |
|-------|-------|-------|---------|----------|
| Discovery | | R$ | days | |
| Qualification | | R$ | days | |
| Proposal | | R$ | days | |
| Negotiation | | R$ | days | |
| **Total Pipeline** | | R$ | | x quota |

### 4. Top 3 Wins / Top 3 Losses Analysis
**Wins:**
| # | Deal | Value | Key Factor |
|---|------|-------|-----------|
| 1 | | R$ | |
| 2 | | R$ | |
| 3 | | R$ | |

**Losses:**
| # | Deal | Value | Loss Reason | Learning |
|---|------|-------|------------|---------|
| 1 | | R$ | | |
| 2 | | R$ | | |
| 3 | | R$ | | |

### 5. Next Quarter Priorities
| # | Initiative | Owner | Expected Impact | Priority |
|---|-----------|-------|----------------|----------|
| 1 | | | R$ / % | P0 |
| 2 | | | | P1 |
| 3 | | | | P1 |

## Saida
- Quarterly Commercial Review report
- Agent performance grades
- Next quarter priorities and targets
- Action items with owners and deadlines

## Validacao
- [ ] All metrics have actual vs target comparison
- [ ] Win/loss analysis completed
- [ ] Next quarter priorities defined
- [ ] Each agent has specific improvement goals
