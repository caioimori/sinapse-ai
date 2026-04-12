---
task: build-opportunity-solution-tree
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

# Build Opportunity Solution Tree

## Metadata
- **Agent:** ps-product-strategist (Charter)
- **Complexity:** High
- **Estimated Time:** 3-4 hours (workshop), ongoing
- **Produces:** OST diagram, prioritized opportunities, experiment backlog

## Purpose
Construir Opportunity Solution Tree (Teresa Torres) conectando desired outcome com oportunidades, solucoes e experimentos.

## Steps

### Step 1: Define Desired Outcome (top of tree)
Specific, measurable, within team influence, connected to business goal.

### Step 2: Map Opportunities (from research)
Format: "[Segment] struggles with [challenge] because [reason]"
Evidence required: 3+ users or data support. Organize hierarchically.

### Step 3: Generate Solutions (min 3 per opportunity)
Mix build, buy, integrate, partner, process solutions. Involve Product Trio.

### Step 4: Design Experiments
**Ladder (least to most effort):** Assumption Test (hours) > Survey (days) > Fake Door (days) > Prototype (1wk) > Concierge (1-2wk) > Wizard of Oz (2wk) > MVP (2-4wk)

**Experiment Card:** Hypothesis > Experiment method > Metric > Success threshold > Duration > Effort

### Step 5: Prioritize with RICE
Priority = Opportunity RICE x Solution Confidence

### Step 6: Maintain Weekly
Add new opportunities from interviews, update with experiment results, prune invalidated branches, promote validated solutions to roadmap.

## Output Artifacts
- `opportunity-solution-tree.md` | `experiment-backlog.md` | `ost-visual.md`

## Quality Criteria
- Min 5 opportunities from real evidence | 3+ solutions per priority opportunity | Top solutions have experiments | Updated weekly
