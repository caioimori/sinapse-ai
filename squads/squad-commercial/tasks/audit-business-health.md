---
task: audit-business-health
responsavel: "@cs-business-auditor"
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

# Task: Audit Business Health

## Metadata
- **Squad:** squad-commercial
- **Agent:** Audit (cs-business-auditor)
- **Complexity:** Standard

## Objetivo
Conduzir auditoria completa de saude do negocio usando os 6 pilares Hormozi: oferta, funil, vendas, fulfillment, retencao, referral. Identificar o pilar mais fraco (constraint) e gerar recomendacoes priorizadas.

## Entrada
- Business overview (modelo de negocio, mercado, segmento)
- Revenue data (MRR/ARR, growth rate, churn)
- Funnel metrics (traffic, conversion rates por estagio)
- Sales data (win rate, cycle time, deal size)
- Client data (NPS, retention rate, LTV)
- Current offer portfolio

## Passos

### 1. Pillar Assessment (Score 1-10 each)
| Pillar | Score | Evidence | Critical Issue |
|--------|-------|----------|---------------|
| 1. Offer | /10 | | |
| 2. Funnel | /10 | | |
| 3. Sales | /10 | | |
| 4. Fulfillment | /10 | | |
| 5. Retention | /10 | | |
| 6. Referral | /10 | | |
| **TOTAL** | **/60** | | |

### 2. Constraint Identification (Theory of Constraints)
```
1. Which pillar scored lowest? → This is your primary constraint
2. What is the throughput at this constraint? (leads/deals/clients per month)
3. What would happen if this constraint was removed? (revenue impact)
4. What is currently limiting this constraint? (root cause)
5. What is the cost of NOT fixing it? (per month)
```

### 3. Revenue Leak Analysis
| Leak Point | Monthly Impact | Root Cause | Fix Difficulty |
|-----------|---------------|-----------|---------------|
| | R$ | | H/M/L |

### 4. Growth Opportunity Map
| Opportunity | Revenue Potential | Time to Impact | Investment | Priority |
|------------|------------------|---------------|-----------|----------|
| | R$/month | weeks/months | R$ | P0/P1/P2 |

### 5. Recommendations (Top 5)
| # | Recommendation | Pillar | Impact | Effort | Priority |
|---|---------------|--------|--------|--------|----------|
| 1 | | | | H/M/L | P0 |
| 2 | | | | H/M/L | P0 |
| 3 | | | | H/M/L | P1 |
| 4 | | | | H/M/L | P1 |
| 5 | | | | H/M/L | P2 |

## Saida
- Business Health Score (/60)
- Pillar-by-pillar assessment
- Primary constraint identified with revenue impact
- Revenue leak analysis (quantified)
- Top 5 prioritized recommendations

## Validacao
- [ ] All 6 pillars scored with evidence
- [ ] Primary constraint identified and quantified
- [ ] Revenue leaks estimated in R$/month
- [ ] Recommendations are actionable (not generic)
- [ ] Total health score calculated
