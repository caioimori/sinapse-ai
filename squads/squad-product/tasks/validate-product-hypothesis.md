---
task: validate-product-hypothesis
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

# Validate Product Hypothesis

## Metadata
- **Agent:** ps-product-strategist (Charter)
- **Complexity:** Medium-High
- **Estimated Time:** 1-2 weeks per hypothesis
- **Produces:** Validation report, go/no-go decision, evidence log

## Purpose
Validar hipotese de produto com evidencia antes de investir em desenvolvimento. Framework de Assumption Testing (Teresa Torres).

## Steps

### Step 1: Hypothesis Formulation
```
We believe that [specific change/feature/action]
will result in [measurable outcome]
for [target user segment]
because [rationale based on evidence].
We will know this is true when [specific metric] reaches [threshold] within [timeframe].
```

### Step 2: Assumption Mapping
Break hypothesis into testable assumptions across 4 dimensions:
- **Desirability:** Do users want it? (problem frequency, willingness to switch, preference over alternatives)
- **Viability:** Does business benefit? (willingness to pay, metric improvement, unit economics)
- **Feasibility:** Can we build it? (technology, timeline, regulatory)
- **Usability:** Can users use it? (comprehension, task completion)

Priority: Test lowest confidence + highest risk first.

### Step 3: Experiment Design (Strategyzer Test Card)
Hypothesis > Test method > Metric > Success criteria > Duration > Cost

### Step 4: Run Experiment (document all results)

### Step 5: Analyze (Strategyzer Learning Card)
Observation > Learning > Decision: VALIDATED / INVALIDATED / INCONCLUSIVE > Action

### Step 6: Decision & Next Steps
Validated > proceed to delivery planning
Invalidated > pivot or explore alternatives
Inconclusive > better experiment or more data

## Output Artifacts
- `hypothesis-validation-[id].md` | `experiment-results.md` | `evidence-log.md`

## Quality Criteria
- Hypothesis specific and falsifiable | Assumptions mapped across 4 dimensions | Threshold defined BEFORE running | Results documented regardless of outcome
