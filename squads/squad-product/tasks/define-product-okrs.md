---
task: define-product-okrs
responsavel: "@product-orqx"
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

# Define Product OKRs

## Metadata
- **Agent:** product-orqx (Vector)
- **Complexity:** High
- **Estimated Time:** 3-4 hours
- **Depends On:** Strategic context, product vision, baseline metrics
- **Produces:** Quarterly OKRs, measurement plan, alignment map

## Purpose
Definir OKRs trimestrais conectando visão estratégica com execução diária. Framework de John Doerr adaptado para agência multi-cliente.

## Steps

### Step 1: Strategic Input Collection
Product vision (Charter) + Client priorities (Proxy) + Market context (research-intelligence) + Previous OKR scores + Discovery pipeline (Quorum)

### Step 2: OKR Drafting Workshop (2h)
**Quality Criteria (Doerr):**
```
Objective: Qualitative, inspirational, actionable, time-bound, NOT a metric
Key Result: Quantitative, specific number, outcome-based, 60-70% confidence, 2-5 per Objective
```
**Avoid:** ❌ "Improve retention" → ✅ "Make onboarding so good users can't wait to come back"
**Avoid:** ❌ "Launch 3 features" → ✅ "Increase D7 retention from 35% to 50%"

### Step 3: Alignment Check
**Vertical:** Company OKRs → Product OKRs → Sprint Goals
**Horizontal:** Product ↔ Design ↔ Engineering OKRs

### Step 4: Scoring Plan (0.0-1.0)
0.7 = Target hit (ideal) | 0.6-0.7 healthy average | <0.4 = unrealistic | >0.8 = sandbagging

### Step 5: Communication
Internal: Full OKRs + measurement plan | Client (via Proxy): Outcomes version | Leadership: Strategy alignment

## Output Artifacts
- `okrs-Q[N].md` | `okr-measurement-plan.md` | `okr-alignment-map.md`

## Quality Criteria
- Objectives are inspirational, not metrics
- KRs measurable with specific numbers
- Baseline documented for every KR
- 60-70% confidence targets
- Alignment verified
