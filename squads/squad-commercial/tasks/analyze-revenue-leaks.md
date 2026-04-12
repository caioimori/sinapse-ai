---
task: analyze-revenue-leaks
responsavel: "@cs-revops-analyst"
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

# Task: Analyze Revenue Leaks

## Metadata
- **Squad:** squad-commercial
- **Agent:** Ledger (cs-revops-analyst)
- **Complexity:** Advanced

## Objetivo
Identificar e quantificar revenue leaks — areas onde receita potencial e perdida por ineficiencia de processo, dados, pricing ou execucao. Average company leaks 14.9% of potential revenue.

## Entrada
- Pipeline data (won, lost, stalled)
- Pricing and discount data
- Contract and renewal data
- Expansion opportunity data

## Passos

### 1. Revenue Leak Sources (Clari Framework)
| Source | Description | Detection Method |
|--------|-----------|-----------------|
| **Pipeline Leak** | Deals lost due to poor qualification | Win rate by MEDDIC score |
| **Pricing Leak** | Unauthorized discounts, low realization | Price realization analysis |
| **Contracting Leak** | Missed escalators, auto-renewals forgotten | Contract audit |
| **Expansion Leak** | Upsell triggers missed, not pursued | Health score vs expansion |
| **Churn Leak** | Preventable churn not detected early | Churn post-mortems |
| **Velocity Leak** | Deals taking too long, timing out | Stage duration analysis |

### 2. Quantification Model
| Leak | Volume | Avg Value | Recovery Rate | Annual Impact |
|------|--------|----------|--------------|--------------|
| Pipeline (unqualified deals reaching proposal) | deals | R$ | % | R$ |
| Pricing (discount without approval) | deals | R$ discount | % | R$ |
| Contracting (missed price escalator) | contracts | R$ per | % | R$ |
| Expansion (missed trigger) | accounts | R$ avg upsell | % | R$ |
| Churn (preventable) | accounts | R$ ARR | % | R$ |
| Velocity (timed-out deals) | deals | R$ | % | R$ |
| **TOTAL LEAK** | | | | **R$** |
| **% of Total Potential Revenue** | | | | **%** |

### 3. Root Cause per Leak
| Leak | Root Cause | Fix Category |
|------|-----------|-------------|
| | Process / Data / People / Tool | |

### 4. Remediation Roadmap
| # | Leak | Fix | Owner | Expected Recovery | Timeline | Priority |
|---|------|-----|-------|------------------|----------|----------|
| 1 | | | | R$/quarter | | P0 |
| 2 | | | | R$/quarter | | P1 |

## Saida
- Revenue leak analysis with R$ quantification
- Root causes per leak
- Remediation roadmap with expected recovery
- Monitoring dashboard for ongoing tracking

## Validacao
- [ ] All 6 leak sources analyzed
- [ ] Impact quantified in R$
- [ ] Root causes identified (not just symptoms)
- [ ] Remediation plan has clear owners and expected impact
