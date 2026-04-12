---
task: initiate-product-handoff
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

# Initiate Product Handoff

## Metadata
- **Agent:** product-orqx (Vector)
- **Complexity:** High
- **Estimated Time:** 2-4 weeks
- **Produces:** Handoff package, knowledge transfer plan, transition timeline

## Purpose
Orquestrar handoff completo de produto da agência para equipe do cliente com todo conhecimento, contexto e assets transferidos.

## Steps

### Step 1: Handoff Readiness Scorecard (6 dimensions, 1-5 each, threshold ≥3.5)
Documentation completeness | Code quality & test coverage | Analytics instrumentation | Client team capability | Open issues resolved | Knowledge transfer plan

### Step 2: Handoff Package Assembly
| Document | Owner |
|----------|-------|
| Product Backlog | Vector |
| Decision Log | Mosaic |
| Analytics Setup Guide | Delta |
| Roadmap (Now/Next/Later) | Charter |
| Tech Debt Register | Tempo |
| Operations Runbook | Mosaic |
| Research Repository | Quorum |
| Feature Flag Inventory | Tempo |
| Stakeholder Map | Proxy |
| OKR History | Charter |

### Step 3: Knowledge Transfer Sessions (7 sessions)
Vision & OKRs (Charter, 2h) → Discovery findings (Quorum, 2h) → Analytics & metrics (Delta, 2h) → Delivery process (Tempo, 1.5h) → Client communication (Proxy, 1.5h) → Operations & tools (Mosaic, 1.5h) → Q&A + shadow planning (Vector, 1h)

### Step 4: Shadow Period (2-4 weeks)
Week 1: Agency leads, client shadows | Week 2: Co-lead | Week 3: Client leads, agency shadows | Week 4: Client independent, agency on-call

### Step 5: Handoff Gate
- [ ] All documentation delivered and reviewed
- [ ] KT sessions completed (100%)
- [ ] Client can run ceremonies independently
- [ ] No critical open issues
- [ ] Client sign-off obtained

## Output Artifacts
- `handoff-package/` | `knowledge-transfer-plan.md` | `handoff-gate-report.md` | `client-signoff.md`

## Quality Criteria
- All 10 documents complete | KT recorded | Client operates independently | Formal sign-off obtained
