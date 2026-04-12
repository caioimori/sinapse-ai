---
task: map-competitive-positioning
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

# Map Competitive Positioning

## Metadata
- **Agent:** ps-product-strategist (Charter)
- **Complexity:** Medium
- **Estimated Time:** 3-4 hours
- **Produces:** Competitive positioning map, battle cards, differentiation strategy

## Purpose
Mapear posicionamento competitivo usando April Dunford framework (Obviously Awesome). Define como somos diferentes, para quem, e por que importa.

## Steps

### Step 1: April Dunford 5 Components
1. **Competitive Alternatives:** What would customers use if we did not exist? (direct, indirect, status quo)
2. **Unique Attributes:** What do we have that alternatives do not?
3. **Value (so what?):** What value do those attributes enable?
4. **Target Customer Characteristics:** Who cares most about that value?
5. **Market Category:** What frame makes our value obvious?

### Step 2: Competitive Intelligence Matrix
Per Competitor: Target segment, Core value prop, Pricing model, Key strength, Key weakness, Win rate against, Common objection

### Step 3: Battle Cards (per major competitor)
Quick Facts > Their Pitch > Our Advantage (with proof points) > Their Advantage (honest + our mitigation) > Common Objections + Responses > Landmine Questions (highlight our advantage) > Win Story

### Step 4: Positioning Statement
```
[Product] is the only [category] that [unique value]
for [target customer] who need [specific outcome].
Unlike [alternative], we [key differentiator].
```

## Output Artifacts
- `competitive-positioning.md` | `battle-cards/` (per-competitor) | `positioning-statement.md`

## Quality Criteria
- All 5 Dunford components completed | Min 3 competitors analyzed | Battle cards honest (include their advantages) | Positioning defensible
