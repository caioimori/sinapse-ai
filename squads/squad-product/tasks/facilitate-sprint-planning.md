---
task: facilitate-sprint-planning
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

# Facilitate Sprint Planning

## Metadata
- **Agent:** product-orqx (Vector)
- **Complexity:** Medium
- **Estimated Time:** 2-3 hours (session) + 1 hour (prep)
- **Depends On:** Prioritized backlog, team capacity known
- **Produces:** Sprint plan, committed items, capacity allocation

## Purpose
Facilitar sessão de sprint planning que equilibra discovery, delivery e tech debt. Coordena Tempo, Quorum e Delta para sprint bem balanceado.

## Steps

### Step 1: Pre-Planning (1 hour before)
**Capacity Calculation:**
```
Available = Team Size × Sprint Days × Focus Factor
Focus: Dev=0.7, Designer=0.65, PM=0.5
```
**Sprint Budget:** Delivery 60-70% | Tech Debt 15-20% | Discovery 10-15% | Buffer 5-10%

### Step 2: Planning Session (2-3h)
**Agenda:**
1. Context Setting (20min): Sprint goal, capacity, carryover, constraints
2. Item Selection (60min): Walk prioritized items, estimate, commit/defer
3. Discovery Allocation (15min): Active sprints, interviews, prototypes
4. Tech Debt Selection (15min): Top items fitting 20% budget
5. Risk & Dependencies (15min): External deps, mitigations
6. Commitment (10min): Team confidence vote, sprint backlog finalized

**Sprint Goal Template:**
"By end of Sprint [N], [user] will be able to [outcome], resulting in [impact]."
Confidence vote: Fist of Five, threshold ≥3.5

### Step 3: Sprint Plan Documentation
Sprint Goal → Committed Items (ID, Story, Points, Owner, Dependencies) → Tech Debt Items → Discovery Support → Risks → Sprint Metrics Targets

## Output Artifacts
- `sprint-[N]-plan.md` | Sprint board configured | Calendar invites

## Quality Criteria
- Sprint goal is outcome-focused
- Capacity math documented
- Tech debt ≥15% of capacity
- No item committed without estimate
- Dependencies explicitly identified
