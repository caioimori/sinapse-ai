---
task: create-strategy-canvas
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

# Create Strategy Canvas

## Metadata
- **Agent:** ps-product-strategist (Charter)
- **Complexity:** Medium-High
- **Estimated Time:** 3-4 hours
- **Produces:** Strategy canvas, ERRC grid, differentiation map

## Purpose
Criar Strategy Canvas (Kim & Mauborgne, Blue Ocean Strategy) visualizando posicionamento competitivo e definindo diferenciacao.

## Steps

### Step 1: Identify 6-10 Value Factors (from competitors, user interviews, analysts, sales criteria)
### Step 2: Score Competitors (1-5 scale per factor)
### Step 3: Plot Canvas (X=factors, Y=investment level, curves per player)
**Key Insight:** If curve looks like competitors, competing on their terms. Differentiation requires different curve shape.

### Step 4: ERRC Grid
**Eliminate:** Factors industry takes for granted
**Reduce:** Investment below standard
**Raise:** Above standard
**Create:** New factors never offered

### Step 5: Design Target Strategy Canvas
**Three Tests:** Focus (lead on 2-3 factors) | Divergence (curve looks different) | Compelling Tagline (one sentence)

### Step 6: Document with Roadmap Implications

## Output Artifacts
- `strategy-canvas.md` | `errc-grid.md` | `differentiation-map.md`

## Quality Criteria
- 6-10 factors from real data | Min 2 competitors + status quo | ERRC actionable | 3 tests passed
