---
task: score-okrs-retrospective
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

# Score OKRs Retrospective

## Metadata
- **Agent:** ps-product-strategist (Charter)
- **Complexity:** Medium
- **Estimated Time:** 2-3 hours
- **Produces:** OKR scores, retrospective analysis, learnings for next quarter

## Purpose
Scoring formal dos OKRs do quarter e retrospectiva dos resultados para entender por que atingimos ou nao, e o que aprender.

## Steps

### Step 1: Data Collection (per KR)
Baseline (quarter start) > Target > Actual (quarter end) > Score (0.0-1.0)

**Scoring:** 1.0=Exceeded (rare, may indicate sandbagging) | 0.7=Target hit (ideal for aspirational) | 0.5=Significant progress but short | 0.3=Some progress | 0.0=No progress

### Step 2: Score Each Objective
Objective Score = Average of KR Scores. Overall = average of all objectives.
**Health Check:** 0.6-0.7 healthy | >0.8 not ambitious enough | <0.4 execution or target issues

### Step 3: Root Cause Analysis (for KRs scoring <0.5)
Target unrealistic | External factor changed | Execution issue | Wrong metric | Dependency failed | Strategy wrong
For KRs >0.9: Sandbagged | External tailwind | Exceptional execution | Market favor

### Step 4: Pattern Analysis
Themes across strongest/weakest KRs | Were objectives aligned with what mattered? | Did we measure right things? | Important outcomes NOT tracked?

### Step 5: Learnings for Next Quarter
**Continue:** Practices that worked
**Stop:** Practices that did not contribute
**Start:** New practices based on learnings
**Unfinished Business:** KRs that carry forward (adjusted)

## Output Artifacts
- `okr-scores-Q[N].md` | `okr-retrospective-Q[N].md` | `okr-learnings-for-Q[N+1].md`

## Quality Criteria
- Every KR scored with actual data | Root cause for every KR below 0.5 | Pattern analysis identifies systemic issues | Learnings feed into next quarter planning
