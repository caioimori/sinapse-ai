---
task: design-quota-model
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

# Task: Design Quota Model

## Metadata
- **Squad:** squad-commercial
- **Agent:** Ledger (cs-revops-analyst)
- **Complexity:** Advanced

## Objetivo
Modelar quotas individuais e de equipe — baseado em revenue targets, capacidade, historico de attainment e ramp-up, garantindo metas ambiciosas mas atingiveis.

## Entrada
- Annual/quarterly revenue targets
- Team structure and headcount
- Historical attainment data
- Ramp-up curves for new hires
- Pipeline coverage data

## Passos

### 1. Quota Setting Framework (Mark Roberge)
```
Step 1: Start with total revenue target
  Annual Target: R$ __________

Step 2: Allocate between new logo and expansion
  New Logo: R$ __________ (___%)
  Expansion: R$ __________ (___%)

Step 3: Calculate required team productivity
  New Logo quota per AE = New Logo Target / # Ramped AEs
  Expansion quota per CSM = Expansion Target / # CSMs

Step 4: Apply attainment buffer
  If expected team attainment = 75%
  Then quota per rep = Target per rep / 0.75

Step 5: Validate against historical data
  Is this quota achievable based on past performance?
  Are top performers achieving 150%+? (sign of good quota)
  Are bottom performers below 50%? (normal distribution)
```

### 2. Quota Types
| Type | Description | Best For |
|------|-----------|----------|
| Revenue quota | Total ARR/MRR closed | AEs |
| Activity quota | Meetings, proposals, calls | SDRs |
| Retention quota | GRR target | CSMs |
| Expansion quota | Expansion MRR | CSMs / AMs |
| Pipeline quota | Pipeline generated | SDRs, Marketing |

### 3. Ramp Schedule
| Month | New Hire Quota % | Expected Productivity |
|-------|-----------------|---------------------|
| 1 | 0% | Training |
| 2 | 25% | Shadowing + first calls |
| 3 | 50% | Assisted selling |
| 4 | 75% | Semi-independent |
| 5 | 100% | Fully ramped |
| 6+ | 100% | Independent |

### 4. Quota Allocation Model
| Rep | Role | Tenure | Ramp % | Base Quota | Adjusted Quota |
|-----|------|--------|--------|-----------|---------------|
| | AE | months | % | R$ | R$ |
| | SDR | months | % | meetings | meetings |
| | CSM | months | % | R$ NRR | R$ NRR |
| **Team Total** | | | | R$ | R$ |

### 5. Quota Validation Checks
| Check | Target | Status |
|-------|--------|--------|
| Pipeline coverage vs quota | 3-5x | |
| Historical attainment (team avg) | 70-80% | |
| Top performers at 150%+ | Yes | |
| Quota increase YoY | < 20% | |
| Quota-to-OTE ratio | 4-6x | |

## Saida
- Quota model with individual allocations
- Ramp schedule for new hires
- Validation checks passed
- Compensation alignment recommendations

## Validacao
- [ ] Quotas roll up to company target
- [ ] Ramp schedule applied for new hires
- [ ] Pipeline coverage supports quota
- [ ] Historical data validates achievability
