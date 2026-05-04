---
task: facilitate-product-retrospective
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

# Facilitate Product Retrospective

## Metadata
- **Agent:** product-orqx (Vector)
- **Complexity:** Medium
- **Estimated Time:** 1.5-2 hours
- **Produces:** Retrospective findings, action items, process improvements

## Purpose
Retrospectiva focada em produto — avalia "como entregamos" E "estamos construindo a coisa certa?". Combina sprint retro com product learning review.

## Steps

### Step 1: Pre-Retro Data (Sprint + Product + Discovery metrics)

### Step 2: Facilitation (90 min)
**Part 1: Traditional 4Ls (30min):** Liked, Learned, Lacked, Longed For
**Part 2: Product Learning Review (30min):**
1. What did we learn about users this sprint?
2. Did shipped features solve intended problem?
3. Were any assumptions invalidated?
4. What surprised us in the data?
5. Are we confident in roadmap direction?
**Part 3: Action Items (30min):** Specific action, single owner, due date, success criteria

### Step 3: Document
Key Wins → Key Learnings → Issues + Actions (owner, by when, success criteria) → Product Direction Check → Previous Actions Follow-Up

## Output Artifacts
- `retro-sprint-[N].md` | Action items in next sprint

## Quality Criteria
- Delivery AND product learning covered
- Every action item has owner and deadline
- Previous retro actions reviewed
- Insights feed back into roadmap/discovery
