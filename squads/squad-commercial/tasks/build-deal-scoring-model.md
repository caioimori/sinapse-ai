---
task: build-deal-scoring-model
responsavel: "@cs-crm-specialist"
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

# Task: Build Deal Scoring Model

## Metadata
- **Squad:** squad-commercial
- **Agent:** Vault (cs-crm-specialist)
- **Complexity:** Advanced

## Objetivo
Construir modelo de scoring de deals baseado em MEDDIC — quantificar a qualidade de cada oportunidade para melhorar forecast accuracy e priorizar onde investir tempo comercial.

## Entrada
- MEDDIC framework definition (from Edge)
- Historical win/loss data
- CRM deal data
- Sales cycle benchmarks

## Passos

### 1. MEDDIC Scoring Dimensions
| Dimension | Weight | Score 0 | Score 1 | Score 2 |
|-----------|--------|---------|---------|---------|
| **M**etrics | 15% | No value quantified | Vague value mentioned | Specific ROI calculated |
| **E**conomic Buyer | 20% | Not identified | Identified, no access | Met and engaged |
| **D**ecision Criteria | 10% | Unknown | Informal understanding | Formal criteria documented |
| **D**ecision Process | 10% | Unknown | General understanding | Steps/timeline/approvers mapped |
| **I**dentify Pain | 20% | No pain articulated | Pain acknowledged | Pain quantified + urgent |
| **C**hampion | 15% | No champion | Potential champion | Active champion with influence |
| **P**aper Process | 5% | Unknown | General understanding | Legal/procurement mapped |
| **C**ompetition | 5% | Unknown | Competitors identified | Competitive strategy defined |

### 2. Score Calculation
```
Deal Score = Σ (Dimension Score × Weight) / Max Score × 100

Tiers:
  A (80-100): Strong deal — high priority
  B (60-79): Good deal — on track
  C (40-59): Needs work — gaps to address
  D (20-39): Weak — consider de-prioritizing
  F (0-19): Unqualified — kill or restart
```

### 3. Historical Calibration
| Score Range | Historical Win Rate | Forecast Weight |
|-------------|-------------------|----------------|
| A (80-100) | % | 80-90% |
| B (60-79) | % | 50-60% |
| C (40-59) | % | 20-30% |
| D (20-39) | % | 5-10% |
| F (0-19) | % | 0% |

### 4. CRM Implementation
```
For each MEDDIC dimension:
  - CRM custom property (dropdown: 0/1/2)
  - Tooltip with scoring criteria
  - Mandatory update at stage transitions

Calculated fields:
  - Deal Score (auto-calculated)
  - Deal Tier (A/B/C/D/F auto-assigned)
  - Score Trend (improving/declining/stable)

Dashboard:
  - Score distribution chart
  - Win rate by score tier
  - Score vs. stage alignment
```

## Saida
- MEDDIC scoring model documented
- CRM properties configured
- Historical calibration completed
- Scoring dashboard live

## Validacao
- [ ] All 8 MEDDIC dimensions scored
- [ ] Weights calibrated against historical data
- [ ] CRM fields configured and mandatory
- [ ] Team trained on scoring criteria
