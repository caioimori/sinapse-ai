---
task: audit-funnel-conversions
responsavel: "@cs-funnel-architect"
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

# Task: Audit Funnel Conversions

## Metadata
- **Squad:** squad-commercial
- **Agent:** Cascade (cs-funnel-architect)
- **Complexity:** Standard

## Objetivo
Auditar conversoes em cada estagio do funil — identificar leaks, bottlenecks e oportunidades de otimizacao com dados quantitativos.

## Entrada
- Funnel map (from map-full-funnel)
- Analytics data (GA4, CRM)
- Historical conversion rates
- Industry benchmarks

## Passos

### 1. Stage-by-Stage Conversion Audit
| Stage Transition | Volume In | Volume Out | Conversion | Benchmark | Gap | Priority |
|-----------------|----------|-----------|-----------|-----------|-----|----------|
| Visit → Lead | | | % | 2-5% | pp | |
| Lead → MQL | | | % | 25-35% | pp | |
| MQL → SQL | | | % | 13-15% | pp | |
| SQL → Opportunity | | | % | 50-70% | pp | |
| Opportunity → Proposal | | | % | 60-80% | pp | |
| Proposal → Close | | | % | 20-30% | pp | |

### 2. Leak Identification
| Leak Point | Drop-off % | Volume Lost | Revenue Impact | Root Cause Hypothesis |
|-----------|-----------|------------|---------------|---------------------|
| | | | R$ /month | |

### 3. Conversion by Segment
| Segment | Visit→Lead | Lead→MQL | MQL→SQL | SQL→Close | Overall |
|---------|-----------|---------|---------|----------|---------|
| Channel: Organic | | | | | |
| Channel: Paid | | | | | |
| Channel: Referral | | | | | |
| Segment: SMB | | | | | |
| Segment: Mid-Market | | | | | |
| Segment: Enterprise | | | | | |

### 4. Improvement Prioritization (PIE Framework)
| Funnel Stage | Potential | Importance | Ease | PIE Score | Priority |
|-------------|----------|-----------|------|-----------|----------|
| | 1-10 | 1-10 | 1-10 | avg | |

Potential: How much improvement is achievable?
Importance: How much traffic/value flows through this stage?
Ease: How easy is it to optimize?

## Saida
- Funnel conversion audit report
- Top 3 leaks identified with root causes
- Improvement opportunities prioritized (PIE)
- Action plan per bottleneck

## Validacao
- [ ] All stages audited with actual data
- [ ] Benchmarks applied for gap analysis
- [ ] Segmentation analysis completed
- [ ] PIE prioritization done
