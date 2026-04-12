---
task: define-quarterly-okrs
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

# Define Quarterly OKRs

## Metadata
- **Agent:** ps-product-strategist (Charter)
- **Complexity:** High
- **Estimated Time:** 3-4 hours
- **Produces:** Quarterly OKR set, measurement plan, cascade alignment

## Purpose
Definir OKRs trimestrais traduzindo visao em metas mensuraveis. Andy Grove/John Doerr methodology.

## Steps

### Step 1: Review Previous Quarter (Scorecard with scores 0.0-1.0 per KR)
### Step 2: Strategic Context (company priorities, vision, discovery pipeline, market changes, client feedback)
### Step 3: OKR Drafting
2-4 Objectives, 2-5 KRs each. Max 15 KRs total.
Mix: 60% committed (target 1.0) + 40% aspirational (target 0.6-0.7)

**Quality per KR:** Specific number | Has baseline | Within influence | Outcome-based | 60-70% confidence | Measurable with existing tools

### Step 4: Cascade Alignment
Vertical: Client Goal > Product OKR > Sprint Goals
Horizontal: Product <> Design <> Engineering OKRs

### Step 5: Measurement Plan
Per KR: Baseline, Target, Data Source, Frequency, Owner

### Step 6: Communication
Full team | Client (via Proxy) | Adjacent squads | Leadership

## Output Artifacts
- `okrs-Q[N]-[year].md` | `okr-measurement-plan.md` | `okr-cascade-map.md`

## Quality Criteria
- Every KR has baseline and specific target | Mix committed/aspirational | Alignment verified
