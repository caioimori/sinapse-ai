---
task: audit-sales-methodology
responsavel: "@cs-sales-enablement"
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

# Task: Audit Sales Methodology

## Metadata
- **Squad:** squad-commercial
- **Agent:** Edge (cs-sales-enablement)
- **Complexity:** High

## Objetivo
Auditar a metodologia de vendas atual — avaliar adoção, eficácia e gaps para recomendar o framework ideal (ou combinação) para o contexto da agência.

## Entrada
- Current sales process documentation
- CRM data (pipeline stages, conversion rates)
- Sales team interviews/surveys
- Win/loss analysis data (from Vault)
- Industry benchmarks

## Passos

### 1. Methodology Assessment Matrix
| Framework | Currently Used? | Adoption Level | Effectiveness | Fit Score |
|-----------|----------------|----------------|---------------|-----------|
| MEDDIC/MEDDPICC | Yes/No/Partial | 1-5 | 1-5 | |
| SPIN Selling | Yes/No/Partial | 1-5 | 1-5 | |
| Challenger Sale | Yes/No/Partial | 1-5 | 1-5 | |
| Sandler System | Yes/No/Partial | 1-5 | 1-5 | |
| Solution Selling | Yes/No/Partial | 1-5 | 1-5 | |
| Value Selling | Yes/No/Partial | 1-5 | 1-5 | |
| Gap Selling (Keenan) | Yes/No/Partial | 1-5 | 1-5 | |
| Consultative Selling | Yes/No/Partial | 1-5 | 1-5 | |

**Scoring Guide:**
- Adoption: 1=Unknown, 2=Aware, 3=Sporadic, 4=Consistent, 5=Mastered
- Effectiveness: 1=No impact, 2=Marginal, 3=Moderate, 4=Strong, 5=Transformative

### 2. Process Stage Audit
```
SALES PROCESS STAGES — CURRENT STATE

Stage 1: [Name] _______________
  Duration (avg): ___ days
  Conversion to next: ___%
  Activities defined: Yes / No / Partial
  Exit criteria clear: Yes / No / Partial
  Methodology applied: [which framework]

Stage 2: [Name] _______________
  Duration (avg): ___ days
  Conversion to next: ___%
  Activities defined: Yes / No / Partial
  Exit criteria clear: Yes / No / Partial
  Methodology applied: [which framework]

[... repeat for each stage]

OVERALL:
  Total stages: ___
  Average cycle length: ___ days
  End-to-end conversion: ___%
  Stages with clear exit criteria: ___ / ___
  Stages with methodology alignment: ___ / ___
```

### 3. Framework Fit Analysis (Agency Context)
| Dimension | Weight | MEDDIC | SPIN | Challenger | Sandler | Gap |
|-----------|--------|--------|------|-----------|---------|-----|
| Complex B2B fit | 25% | 5 | 4 | 4 | 3 | 4 |
| Services (vs product) fit | 20% | 3 | 5 | 5 | 4 | 4 |
| Consultative relationship | 20% | 3 | 5 | 4 | 4 | 5 |
| Multi-stakeholder | 15% | 5 | 3 | 4 | 3 | 3 |
| Teachable to team | 10% | 4 | 4 | 3 | 5 | 3 |
| CRM integrability | 10% | 5 | 3 | 3 | 4 | 3 |
| **Weighted Score** | 100% | | | | | |

**Agency-specific recommendation:**
- Discovery phase → SPIN (Situation, Problem, Implication, Need-Payoff)
- Qualification → MEDDIC (Metrics, Economic Buyer, Decision Criteria, Decision Process, Identify Pain, Champion)
- Presentation → Challenger (Teach, Tailor, Take Control)
- Negotiation → Sandler (No mutual mystification, upfront contracts)

### 4. Adoption Gap Analysis
| Gap Category | Finding | Severity | Recommendation |
|-------------|---------|----------|----------------|
| No common language | Team uses different terms | High | Standardize vocabulary |
| CRM not aligned | Stages don't match methodology | High | Reconfigure pipeline |
| No qualification criteria | Deals enter pipeline unqualified | Critical | Implement MEDDIC scorecard |
| Inconsistent discovery | Each rep asks different questions | Medium | Standardize with SPIN |
| No coaching framework | Managers review results, not method | High | Implement call review process |
| Training gaps | No ongoing methodology reinforcement | Medium | Monthly methodology clinics |

### 5. Hybrid Framework Recommendation
```
RECOMMENDED METHODOLOGY STACK

Primary Framework: [Recommendation]
  Why: [Justification based on fit analysis]

Supplementary Frameworks:
  Discovery: [Framework] — for needs identification
  Qualification: [Framework] — for deal evaluation
  Presentation: [Framework] — for value communication
  Negotiation: [Framework] — for commercial discussions

Implementation Phases:
  Phase 1 (Month 1-2): Foundation
    □ Define common sales language
    □ Align CRM stages to methodology
    □ Create qualification scorecard

  Phase 2 (Month 3-4): Training
    □ Initial training workshops
    □ Role-play sessions per stage
    □ Manager coaching enablement

  Phase 3 (Month 5-6): Reinforcement
    □ Call review with methodology lens
    □ Pipeline reviews using framework
    □ Win/loss tied to methodology adherence

  Phase 4 (Ongoing): Optimization
    □ Monthly methodology clinics
    □ A/B test approaches
    □ Quarterly effectiveness measurement

Success Metrics:
  - Methodology adoption rate: ≥ 80% within 6 months
  - Win rate improvement: ≥ 5pp
  - Sales cycle reduction: ≥ 10%
  - Forecast accuracy improvement: ≥ 15pp
```

## Saida
- Methodology audit report
- Framework fit analysis with scores
- Hybrid methodology recommendation
- Implementation roadmap (6 months)

## Validacao
- [ ] All major frameworks evaluated objectively
- [ ] Current state gaps documented with severity
- [ ] Recommendation justified with data and fit scores
- [ ] Implementation plan phased and actionable
- [ ] Success metrics defined and measurable
