---
task: review-revenue-architecture
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

# Task: Review Revenue Architecture

## Metadata
- **Squad:** squad-commercial
- **Agent:** Ledger (cs-revops-analyst)
- **Complexity:** Advanced

## Objetivo
Revisar arquitetura de revenue — avaliar o Bow Tie Funnel completo, alinhamento entre motions de venda, eficiencia do sistema e identificar revenue leaks.

## Entrada
- Full pipeline data
- Retention and expansion data
- Team structure and roles
- Tech stack inventory

## Passos

### 1. Bow Tie Assessment
| Side | Stage | Health | Conversion | Leak? |
|------|-------|--------|-----------|-------|
| Left | Demand Gen → Lead | | % | |
| Left | Lead → MQL | | % | |
| Left | MQL → SQL | | % | |
| Left | SQL → Opportunity | | % | |
| Left | Opportunity → Won | | % | |
| Right | Won → Onboarded | | % | |
| Right | Onboarded → Adopted | | % | |
| Right | Adopted → Renewed | | % | |
| Right | Renewed → Expanded | | % | |
| Right | Expanded → Advocate | | % | |

### 2. Revenue Motion Alignment
| Motion | Description | Aligned? | Issues |
|--------|-----------|----------|--------|
| **Inbound** | Content → MQL → Sales | | |
| **Outbound** | SDR → Meeting → AE | | |
| **Product-Led** | Trial/Freemium → PQL → Sales | | |
| **Partner** | Referral → Warm intro → Sales | | |
| **Expansion** | CS trigger → AE/CSM upsell | | |

### 3. Revenue Leak Analysis (Clari Framework)
| Leak Source | Estimated Impact | Detection Method | Fix |
|-----------|-----------------|-----------------|-----|
| Pipeline (poor qualification) | R$/quarter | Win rate by score | Better MEDDIC |
| Pricing (unauthorized discounts) | R$/quarter | Price realization | Discount governance |
| Contracting (missed escalators) | R$/quarter | Contract audit | Renewal automation |
| Expansion (missed triggers) | R$/quarter | Health score + signals | Expansion playbooks |

Average company leaks 14.9% of potential revenue (Clari research).

### 4. System Efficiency Score
| Dimension | Score (1-10) | Evidence |
|-----------|-------------|---------|
| Data quality | | CRM completeness % |
| Process adherence | | Stage criteria compliance |
| Tool utilization | | Tech stack adoption % |
| Handoff quality | | Drop-off at transitions |
| Forecast accuracy | | Actual vs forecast variance |
| **Overall** | /50 | |

## Saida
- Revenue architecture assessment
- Revenue leak analysis with quantified impact
- System efficiency score
- Improvement roadmap

## Validacao
- [ ] Both sides of Bow Tie assessed
- [ ] Revenue leaks quantified in R$
- [ ] System efficiency scored objectively
- [ ] Top 3 improvements prioritized
