---
task: run-pmf-assessment
responsavel: "@ps-product-strategist"
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

# Run Product-Market Fit Assessment

## Metadata
- **Agent:** ps-product-strategist (Charter)
- **Complexity:** High
- **Estimated Time:** 1-2 weeks
- **Produces:** PMF assessment report, score, action plan

## Purpose
Avaliar Product-Market Fit usando Sean Ellis Test e metricas complementares.

## Steps

### Step 1: Sean Ellis Test
**Question:** "How would you feel if you could no longer use [product]?"
Very disappointed | Somewhat disappointed | Not disappointed | N/A

**PMF Threshold:** >40% "Very Disappointed" = PMF achieved
**Methodology:** Active users (last 2 weeks), min 40 responses, post-activation timing

**Scoring:** >40% PMF ACHIEVED | 25-40% APPROACHING | 15-25% NOT YET | <15% FAR FROM PMF

### Step 2: Complementary Indicators
Organic Growth Rate (>30% strong signal) | DAU/MAU (>0.2 good) | NRR (>100% expansion) | Viral k (>0.5 growth) | Time to Value (decreasing = improving) | Word of Mouth referral %

### Step 3: Segment Analysis
PMF varies by segment - identify which segment has strongest PMF and double down.

### Step 4: Very Disappointed User Analysis
Profile them: demographics, behavior, use case, features used, how they found us, benefit described.
This profile = ideal customer. Build more for them.

### Step 5: Action Plan by Score
**>40%:** Document formula, identify ICP, focus growth, protect core value
**25-40%:** Narrow focus to highest-PMF segment, reduce activation friction
**<25%:** Return to discovery, interview Not Disappointed users, consider pivot

## Output Artifacts
- `pmf-assessment-[date].md` | `pmf-survey-results.md` | `pmf-action-plan.md`

## Quality Criteria
- Min 40 survey responses from active users | Segment analysis performed | Action plan specific to score band
