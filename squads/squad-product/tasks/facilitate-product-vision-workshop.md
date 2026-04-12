---
task: facilitate-product-vision-workshop
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

# Facilitate Product Vision Workshop

## Metadata
- **Agent:** ps-product-strategist (Charter)
- **Complexity:** High
- **Estimated Time:** 3-4 hours (workshop) + 2 hours (prep)
- **Produces:** Shared product vision, strategic priorities, alignment commitment

## Purpose
Facilitar workshop colaborativo para definir ou refinar visao de produto com stakeholders do cliente e equipe interna.

## Steps

### Step 1: Pre-Workshop (2h)
**Participants:** Max 8 (Client decision maker, Client PO, Agency product lead, Agency delivery lead + valuable additions)
**Pre-Work:** Market context brief, each participant prepares 3 things product MUST achieve in 12 months

### Step 2: Workshop Agenda (3-4h)
**Part 1: Context (30min):** Market overview, Current state, User insights
**Part 2: Vision Exploration (60min):**
- Exercise 1: Newspaper Headline (15min) - 18 months from now, what headline?
- Exercise 2: What Will Not Change (15min) - Fundamental user needs in 5 years (Jeff Bezos invariants)
- Exercise 3: Best Customer (15min) - Ideal customer in 3 years, what do they love?
- Exercise 4: Anti-Vision (15min) - What are we NOT building?

**Part 3: Prioritization (45min):**
- Exercise 5: 100 Points Budget across Growth/Retention/Efficiency/Innovation/Quality
- Exercise 6: Must Win Battles - Top 3, dot-vote for consensus

**Part 4: Synthesis (45min):**
- Exercise 7: Collaborative Vision Statement using Moore template (30min)
- Exercise 8: Commitment - each participant states commitment (15min)

### Step 3: Post-Workshop
Within 24h: Summary + draft vision. Within 1 week: Finalize, translate to priorities, create initial roadmap.

## Output Artifacts
- `vision-workshop-notes.md` | `product-vision-draft.md` | `strategic-priorities.md` | `vision-commitment-log.md`

## Quality Criteria
- All essential stakeholders attended | Concrete vision statement produced | Priorities ranked | Anti-vision defined | Follow-up within 1 week
