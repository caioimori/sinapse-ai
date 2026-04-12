---
task: manage-pipeline-forecast
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

# Task: Manage Pipeline Forecast

## Metadata
- **Squad:** squad-commercial
- **Agent:** Pipeline (commercial-orqx)
- **Complexity:** Advanced

## Objetivo
Gerenciar forecast de pipeline — consolidar inputs de todos os agentes comerciais em projecao unica de revenue, com cenarios e nivel de confianca.

## Entrada
- Pipeline data (Vault)
- Retention/expansion forecast (Bond)
- Revenue models (Ledger)
- Deal review verdicts

## Passos

### 1. Forecast Components
| Component | Source | Period | Confidence |
|-----------|--------|--------|-----------|
| New Logo Pipeline | Vault + Edge | Q current + Q+1 | By deal stage |
| Expansion Pipeline | Bond | Q current + Q+1 | By health score |
| Renewal Expected | Bond | Rolling 12 months | By renewal date |
| Churn Risk | Bond | Rolling 12 months | By health score |

### 2. Three-Scenario Forecast
| Scenario | Methodology | Assumptions |
|----------|------------|-------------|
| **Bear** | Only Commit deals + 70% of renewals | Conservative: churn at 2x average |
| **Base** | Commit + weighted Best Case + 90% renewals | Expected: historical averages |
| **Bull** | Base + 50% of Pipeline + expansion | Optimistic: all initiatives land |

### 3. Forecast Consolidation
```
REVENUE FORECAST — Q[X] [Year]

                    Bear        Base        Bull
New Logo ARR:       R$          R$          R$
Expansion ARR:      R$          R$          R$
Renewal ARR:        R$          R$          R$
(Churn):            (R$)        (R$)        (R$)
(Contraction):      (R$)        (R$)        (R$)
────────────────────────────────────────────────
NET ARR:            R$          R$          R$

Pipeline Coverage:  Xx          Xx          Xx
Confidence Level:   %           %           %
```

### 4. Forecast vs Actual Tracking
| Month | Forecast | Actual | Variance | Cause |
|-------|---------|--------|----------|-------|
| M1 | R$ | R$ | % | |
| M2 | R$ | R$ | % | |
| M3 | R$ | R$ | % | |
| **Q Total** | R$ | R$ | % | |

Target forecast accuracy: 90-95%

## Saida
- Consolidated revenue forecast (Bear/Base/Bull)
- Pipeline coverage analysis
- Forecast accuracy tracking
- Monthly variance explanation

## Validacao
- [ ] All forecast components included
- [ ] Three scenarios with explicit assumptions
- [ ] Pipeline coverage >= 3x for Base case
- [ ] Historical accuracy tracked for calibration
