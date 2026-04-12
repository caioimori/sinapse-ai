---
task: plan-sales-capacity
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

# Task: Plan Sales Capacity

## Metadata
- **Squad:** squad-commercial
- **Agent:** Ledger (cs-revops-analyst)
- **Complexity:** Standard

## Objetivo
Planejar capacidade de vendas — modelar quantos reps sao necessarios para atingir targets de revenue, considerando ramp, attainment e attrition.

## Entrada
- Revenue targets (annual)
- Current team size and performance
- Ramp curves
- Attrition rates
- Quota model (from design-quota-model)

## Passos

### 1. Capacity Model
```
Required Capacity = Revenue Target / (Quota per Rep × Expected Attainment)

Example:
  Revenue Target: R$ 10M
  Quota per Rep: R$ 1.5M
  Expected Attainment: 75%
  Effective Capacity per Rep: R$ 1.5M × 75% = R$ 1.125M
  Required Reps: R$ 10M / R$ 1.125M = 8.9 → 9 ramped reps

Adjust for ramp:
  If avg ramp = 5 months
  And 2 new hires expected
  Effective capacity of new hires = 50% × (months remaining / 12) × quota
```

### 2. Capacity Timeline
| Quarter | Ramped Reps | Ramping Reps | Total FTE | Effective Capacity |
|---------|-----------|-------------|----------|-------------------|
| Q1 | | | | R$ |
| Q2 | | | | R$ |
| Q3 | | | | R$ |
| Q4 | | | | R$ |

### 3. Attrition Buffer
```
Expected Attrition: ___% annual (industry: 20-30% for sales)
Reps Lost/Year: ___ (current team × attrition rate)
Backfill Lead Time: ___ months (hiring + ramp)
Capacity Lost: ___ months × quota/12

Buffer: Hire ___ additional reps to maintain target capacity
```

### 4. Hiring Plan
| Role | Current | Needed | Gap | Start Date | Ramp Date | Cost |
|------|---------|--------|-----|-----------|----------|------|
| AE | | | | | | R$ |
| SDR | | | | | | R$ |
| CSM | | | | | | R$ |
| Manager | | | | | | R$ |

### 5. Investment vs Revenue
| Metric | Current | Planned | Change |
|--------|---------|---------|--------|
| Team Cost (annual) | R$ | R$ | +R$ |
| Expected Revenue | R$ | R$ | +R$ |
| Revenue per Rep | R$ | R$ | |
| Cost per Rep | R$ | R$ | |
| ROI of Additional Headcount | | x | |

## Saida
- Sales capacity model
- Hiring plan with timelines
- Investment vs revenue projection
- Quarterly capacity forecast

## Validacao
- [ ] Capacity matches revenue target
- [ ] Ramp time factored in
- [ ] Attrition buffer included
- [ ] Hiring timeline realistic
