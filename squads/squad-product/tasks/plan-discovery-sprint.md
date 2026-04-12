---
task: plan-discovery-sprint
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

# Plan Discovery Sprint

## Metadata
- **Agent:** ps-discovery-lead (Quorum)
- **Complexity:** Medium
- **Estimated Time:** 2-3 hours
- **Produces:** Discovery sprint plan, research questions, team assignments, timeline

## Purpose
Planejar sprint de discovery focado em reduzir risco antes de investir em desenvolvimento. Baseado em Continuous Discovery Habits (Teresa Torres) — discovery nao e uma fase, e um habito continuo.

## Steps

### Step 1: Define Discovery Trigger & Scope
**Trigger Matrix:**
| Trigger | Scope | Typical Duration |
|---------|-------|-----------------|
| New product/feature opportunity | Full discovery (problem + solution) | 2-4 weeks |
| Metric decline or anomaly | Diagnostic discovery (root cause) | 1-2 weeks |
| Client strategic request | Validation discovery (feasibility + value) | 1-2 weeks |
| Quarterly planning input | Exploratory discovery (landscape scan) | 2-3 weeks |
| Usability complaints | Evaluative discovery (UX audit) | 1 week |

**Scope Statement:**
```
We need to learn [specific insight]
about [user segment / problem space]
to decide [specific decision we need to make]
by [date] so that [what depends on this decision].
```

### Step 2: Formulate Research Questions
**Primary Question:** The ONE question this sprint must answer.
**Secondary Questions (max 3):** Supporting questions that build context.

**Quality Check per Question:**
- [ ] Specific enough to be answerable
- [ ] Not leading (does not assume the answer)
- [ ] Connected to a real decision
- [ ] Answerable within sprint timeframe

### Step 3: Select Discovery Methods
| Method | Best For | Effort | Evidence Strength |
|--------|----------|--------|-------------------|
| User interviews (5-8) | Problem understanding | Medium | High |
| Survey (50+ responses) | Quantitative validation | Medium | Medium |
| Analytics deep dive | Behavior patterns | Low | High |
| Prototype testing (5-8) | Solution validation | High | High |
| Competitor analysis | Market context | Low | Medium |
| Diary study | Context & habits | High | High |
| Card sorting | Information architecture | Medium | Medium |
| A/B experiment | Causal validation | High | Very High |

**Method Selection Rule:** Use minimum 2 methods for triangulation. Never rely on a single data source.

### Step 4: Assign Product Trio + Roles
**Core Team (Teresa Torres Product Trio):**
- **Product (ps-product-strategist):** Owns decisions, defines success criteria
- **Design (ps-discovery-lead):** Plans research, conducts interviews, synthesizes
- **Engineering (ps-delivery-manager):** Feasibility input, technical constraints

**Extended Team (as needed):**
- ps-product-analyst — Data pull, metric analysis
- ps-client-product-manager — Client context, stakeholder access

### Step 5: Build Sprint Timeline
**Week 1: Explore**
- Days 1-2: Desk research, analytics review, recruit participants
- Days 3-5: First round interviews/tests (min 3 sessions)

**Week 2: Validate**
- Days 6-8: Second round interviews/tests, prototype if needed
- Days 9-10: Synthesis, pattern identification, report draft

**Key Milestones:**
| Milestone | Day | Gate Criteria |
|-----------|-----|---------------|
| Research plan approved | Day 1 | Scope + questions + methods confirmed |
| First insights shared | Day 5 | Min 3 sessions completed, early patterns |
| Synthesis complete | Day 9 | All data collected and analyzed |
| Decision made | Day 10 | Go/No-Go with evidence |

### Step 6: Define Decision Framework
**Before starting, agree on:**
- What evidence would make us GO? (threshold)
- What evidence would make us NO-GO? (threshold)
- What happens if evidence is INCONCLUSIVE? (next step)

**Discovery Exit Criteria:**
- [ ] Primary research question answered with evidence
- [ ] Min 5 user data points collected
- [ ] Assumptions validated or invalidated
- [ ] Clear recommendation with confidence level
- [ ] Next steps documented regardless of outcome

## Output Artifacts
- `discovery-sprint-plan-[name].md` | `research-questions.md` | `team-assignments.md` | `discovery-timeline.md`

## Quality Criteria
- Scope statement specific and time-bound | Research questions not leading | Min 2 methods selected | Product Trio assigned | Decision framework pre-defined | Exit criteria clear
