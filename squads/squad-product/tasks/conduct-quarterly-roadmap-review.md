---
task: conduct-quarterly-roadmap-review
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

# Conduct Quarterly Roadmap Review

## Metadata
- **Agent:** product-orqx (Vector)
- **Complexity:** High
- **Estimated Time:** 4-6 hours (prep + session)
- **Depends On:** Quarter metrics available, strategic context current
- **Produces:** Updated roadmap, quarter retro, next quarter plan

## Purpose
Review trimestral de roadmap que avalia progresso, atualiza prioridades e alinha expectativas com visão interna e do cliente.

## Steps

### Step 1: Quarter Performance Review
Planned vs Delivered items, OKR Scores (0.0-1.0, target avg 0.6-0.7), Discovery sprints completed, Hypotheses validated

### Step 2: Roadmap Retrospective
What Went Well → What Didn't → What We Learned

### Step 3: Update Roadmap (Now/Next/Later — Janna Bastow)
```
NOW (Current Quarter): Committed, >80% confidence
NEXT (Next Quarter): Shaped, 50-80% confidence
LATER (Future): Opportunities, <50% confidence
```
Move completed → Done, NEXT → NOW, new opportunities → LATER, remove irrelevant

### Step 4: Dual Roadmap
Internal: Full detail, technical items, tech debt, dependencies
Client-facing: Outcomes-focused, business impact, no internal jargon

### Step 5: Next Quarter Planning
**Investment Split (70/20/10):** Core 70% | Adjacent 20% | Transformational 10%

## Output Artifacts
- `quarterly-review-Q[N].md` | `roadmap-updated.md` | `okrs-Q[N+1]-draft.md` | `client-roadmap-Q[N+1].md`

## Quality Criteria
- Every planned item accounted for
- OKRs scored with real data
- Roadmap reflects latest evidence
- Client version prepared and reviewed by Proxy
