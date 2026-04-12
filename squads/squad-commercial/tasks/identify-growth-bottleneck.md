---
task: identify-growth-bottleneck
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

# Task: Identify Growth Bottleneck

## Metadata
- **Squad:** squad-commercial
- **Agent:** Audit (cs-business-auditor)
- **Complexity:** Standard

## Objetivo
Aplicar Teoria das Restricoes para identificar o gargalo #1 que limita o crescimento do negocio. Nao e sobre encontrar todos os problemas — e sobre encontrar O problema que, se resolvido, desbloqueia o maximo de crescimento.

## Entrada
- Business Health Audit (se disponivel)
- Revenue and conversion data
- Team capacity information
- Current growth initiatives

## Passos

### 1. Revenue Chain Mapping
```
Traffic → Leads → MQLs → SQLs → Opportunities → Closed Won → Onboarding → Active → Expansion → Referral

For each stage:
- Volume (how many per month)
- Conversion rate to next stage
- Time in stage (days)
- Cost per unit at this stage
```

### 2. Bottleneck Identification
| Stage | Volume/mo | Conv Rate | Time (days) | Benchmark | Gap |
|-------|----------|-----------|-------------|-----------|-----|
| Traffic | | | | | |
| Leads | | | | | |
| MQLs | | | | | |
| SQLs | | | | | |
| Opportunities | | | | | |
| Closed Won | | | | | |
| Active Clients | | | | | |

### 3. Constraint Analysis
```
PRIMARY CONSTRAINT: [stage]
- Current throughput: [X per month]
- Benchmark throughput: [Y per month]
- Gap: [Z per month = R$ impact]
- Root cause: [specific reason]
- Upstream impact: Everything before this stage is wasted if this doesn't convert
- Downstream impact: Everything after is starved for volume
```

### 4. Exploit vs Elevate Decision
| Strategy | Description | Cost | Time | Impact |
|----------|------------|------|------|--------|
| Exploit (optimize current) | | R$ | weeks | % improvement |
| Elevate (invest to remove) | | R$ | months | % improvement |

### 5. Action Plan
| # | Action | Owner | Timeline | Expected Impact |
|---|--------|-------|----------|----------------|
| 1 | | | | |
| 2 | | | | |
| 3 | | | | |

## Saida
- Revenue chain map with conversion rates
- Primary bottleneck identified
- Root cause analysis
- Exploit vs Elevate recommendation
- 3-step action plan

## Validacao
- [ ] Revenue chain mapped end-to-end
- [ ] Bottleneck supported by data (not opinion)
- [ ] Revenue impact quantified
- [ ] Action plan is specific and time-bound
