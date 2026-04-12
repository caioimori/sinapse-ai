---
task: run-prototype-usability-test
responsavel: "@ps-discovery-lead"
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

# Run Prototype Usability Test

## Metadata
- **Agent:** ps-discovery-lead (Quorum)
- **Complexity:** Medium
- **Estimated Time:** 1-2 hours per session + 2h synthesis
- **Produces:** Usability test results, task success rates, UX findings, design recommendations

## Purpose
Testar prototipos com usuarios reais para validar se a solucao proposta funciona antes de investir em desenvolvimento. Testar cedo e barato, falhar rapido.

## Steps

### Step 1: Define Test Objectives
**What are we testing?**
- Prototype type: Low-fi (wireframe) | Mid-fi (clickable) | High-fi (pixel-perfect)
- Core assumption: "Users can [complete task] using [this design] in [acceptable time]"

**Task List (3-5 tasks per test):**
| # | Task | Success Criteria | Max Time | Critical? |
|---|------|-----------------|----------|-----------|
| 1 | [realistic scenario] | [what defines success] | [minutes] | Yes/No |
| 2 | [realistic scenario] | [what defines success] | [minutes] | Yes/No |
| 3 | [realistic scenario] | [what defines success] | [minutes] | Yes/No |

**Task Writing Rules:**
- Frame as realistic scenarios, not instructions ("You want to..." not "Click on...")
- Do not reveal the expected path
- Include context and motivation

### Step 2: Recruit Participants (5-8)
**Nielsen Norman Rule:** 5 users find ~85% of usability problems.
- Match target persona
- Mix of experience levels
- No internal team members (they know too much)
- Screen for recent relevant behavior

### Step 3: Prepare Test Protocol
**Session Structure (45-60 min):**

**Intro (5 min):**
- "We are testing the design, not you"
- "There are no wrong answers"
- "Think aloud — tell me what you are thinking as you go"
- "I cannot help you during the task, but that is okay"

**Warm-up (5 min):**
- Background questions (role, relevant experience)
- Current behavior related to tasks

**Tasks (30-40 min):**
- Read scenario aloud, let participant attempt
- **During task observe:** Path taken, hesitations, errors, backtracking, comments
- **After each task:** "How easy or difficult was that? (1-5)" + "What were you expecting?"
- **Between tasks:** Brief debrief, then next scenario

**Post-test (10 min):**
- SUS (System Usability Scale) or SEQ (Single Ease Question)
- "What was the most confusing part?"
- "What would you change?"
- "Would you use this? Why or why not?"

### Step 4: Conduct Sessions & Capture Data
**Per Session, Record:**
| Metric | Task 1 | Task 2 | Task 3 |
|--------|--------|--------|--------|
| Completed? (Y/N) | | | |
| Time to complete | | | |
| Errors made | | | |
| Assists needed | | | |
| Ease rating (1-5) | | | |
| Path taken | | | |

**Observation Notes:**
- Exact moments of confusion (timestamp if recording)
- Verbatim quotes during think-aloud
- Facial expressions / body language
- Where they looked first (if eye-tracking or observation)

### Step 5: Analyze Results
**Quantitative Summary:**
| Task | Success Rate | Avg Time | Avg Ease | Error Rate |
|------|-------------|----------|----------|-----------|
| [task 1] | [X/N] [%] | [min:sec] | [1-5] | [errors/session] |
| [task 2] | [X/N] [%] | [min:sec] | [1-5] | [errors/session] |

**Benchmarks:**
- Task success rate target: >= 80%
- Ease rating target: >= 3.5/5
- SUS score target: >= 68 (above average)

**Qualitative Findings (prioritized):**
| Finding | Severity | Frequency | Recommendation |
|---------|----------|-----------|----------------|
| [usability issue] | Critical/Major/Minor/Cosmetic | [N/5 users] | [specific fix] |

**Severity Scale (Nielsen):**
- **Critical:** User cannot complete task, no workaround
- **Major:** User struggles significantly, may find workaround
- **Minor:** User notices issue but completes task
- **Cosmetic:** Minor annoyance, does not affect task completion

### Step 6: Generate Design Recommendations
**Per Finding:**
```
Issue: [specific usability problem]
Severity: [Critical | Major | Minor | Cosmetic]
Evidence: [N users affected, specific behaviors observed]
Root Cause: [why this happens — layout? labeling? flow?]
Recommendation: [specific design change]
Before/After: [describe current vs. proposed]
Confidence: [High — clear pattern | Medium — some evidence | Low — single observation]
```

**Decision Framework:**
- Critical + Major issues: MUST fix before development
- Minor issues: FIX in design iteration
- Cosmetic: LOG for polish phase

## Output Artifacts
- `usability-test-plan-[feature].md` | `usability-test-results.md` | `finding-cards/[id].md` | `design-recommendations.md`

## Quality Criteria
- 5-8 participants tested | Tasks realistic and scenario-based | Success rates calculated per task | All findings severity-rated | Recommendations specific (not "make it better") | Critical issues flagged for mandatory fix
