---
task: conduct-jtbd-interviews
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

# Conduct JTBD Interviews

## Metadata
- **Agent:** ps-product-strategist (Charter)
- **Complexity:** High
- **Estimated Time:** 1-2h per interview + 2h synthesis
- **Produces:** JTBD findings, job map, forces of progress diagram

## Purpose
Entrevistas Jobs-to-Be-Done (Christensen/Moesta) para entender por que usuarios contratam um produto.

## Steps

### Step 1: Preparation
Target: People who recently made a decision (adopted/switched/churned) within 90 days.

### Step 2: Switch Interview (Bob Moesta)
**Timeline (work backward from purchase):**
Phase 1: First Thought (10min) - When did you first start thinking about finding a solution?
Phase 2: Passive Looking (10min) - What did you do after that first thought?
Phase 3: Active Looking (10min) - When did you start actively looking?
Phase 4: Decision (10min) - What made you decide?
Phase 5: Experience (10min) - What happened after you started using it?

### Step 3: Four Forces of Progress
```
PUSHING toward new: Push 1 (Situation problems) + Push 2 (Pull of new solution)
HOLDING in current: Hold 1 (Habit/comfort) + Hold 2 (Anxiety of new)
Switching happens when: Push + Pull > Habit + Anxiety
```

### Step 4: Job Statement
```
When [situation/trigger], I want to [motivation], so I can [outcome].
Functional Job: [what to accomplish]
Emotional Job: [how to feel]
Social Job: [how to be perceived]
```

### Step 5: Job Map (8 Universal Steps)
DEFINE > LOCATE > PREPARE > CONFIRM > EXECUTE > MONITOR > MODIFY > CONCLUDE

### Step 6: Synthesize (after 5+ interviews)
Common triggers, shared jobs, recurring forces, switching patterns, underserved steps.

## Output Artifacts
- `jtbd-interview-[N].md` | `jtbd-synthesis.md` | `job-map.md` | `forces-of-progress.md`

## Quality Criteria
- Min 5 interviews | Switch format followed | All 4 forces captured | Job includes functional+emotional+social
