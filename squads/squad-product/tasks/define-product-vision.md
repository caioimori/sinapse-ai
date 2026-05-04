---
task: define-product-vision
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

# Define Product Vision

## Metadata
- **Agent:** ps-product-strategist (Charter)
- **Complexity:** High
- **Estimated Time:** 4-6 hours
- **Produces:** Product vision document, vision statement, strategic narrative

## Purpose
Definir visao de produto usando Geoffrey Moore Vision Template + Product Strategy Canvas (Kim & Mauborgne).

## Steps

### Step 1: Vision Inputs
Client business objectives (Proxy) + Market landscape (research-intelligence) + User research (Quorum) + Technical constraints + Current metrics (Delta)

### Step 2: Geoffrey Moore Vision Template
```
FOR [target customer segment]
WHO [statement of need or opportunity]
THE [product name] IS A [product category]
THAT [key benefit, compelling reason]
UNLIKE [primary competitive alternative]
OUR PRODUCT [statement of primary differentiation]
```

### Step 3: Strategy Canvas (Kim & Mauborgne)
Plot 6-10 value factors for us vs 2+ competitors on 1-5 scale.
**ERRC Grid:** Eliminate (industry takes for granted) | Reduce (below standard) | Raise (above standard) | Create (never offered)

### Step 4: Vision Validation
- [ ] Target customer specific enough to be actionable
- [ ] Need validated with evidence
- [ ] Differentiation defensible
- [ ] Vision ambitious but achievable (3-5yr horizon)
- [ ] Team aligned and client stakeholders agree

### Step 5: Vision Document
Vision Statement > Strategic Narrative > Target Customer > Problem Space > Strategy Canvas > ERRC Grid > Success Metrics (North Star + supporting) > Anti-Vision (what we are NOT building)

## Output Artifacts
- `product-vision.md` | `strategy-canvas.md` | `vision-presentation.md`

## Quality Criteria
- Moore template with specific details | Strategy canvas with real competitive data | Anti-vision defined | Client validated
