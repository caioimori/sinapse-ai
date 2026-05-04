---
task: brief-ux-research-sprint
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

# Brief UX Research Sprint

## Metadata
- **Agent:** ps-discovery-lead (Quorum)
- **Complexity:** Medium
- **Estimated Time:** 2-3 hours
- **Produces:** UX research brief, methodology recommendation, timeline, deliverables definition

## Purpose
Criar brief estruturado para sprint de pesquisa UX, definindo escopo, metodologia, participantes e entregas esperadas. O brief serve como contrato entre discovery lead e equipe de pesquisa/design.

## Steps

### Step 1: Research Brief Header
```
UX RESEARCH BRIEF
────────────────────────────────────────
Project: [research project name]
Requester: [who needs this research and why]
Discovery Lead: ps-discovery-lead (Quorum)
UX Researcher: [assigned or TBD]
Priority: HIGH | MEDIUM | LOW
Deadline: [when decisions depend on this]
────────────────────────────────────────
```

### Step 2: Research Context
**Background:**
- What product/feature is this about?
- What do we already know? (existing data, previous research)
- What triggered this research need? (metric decline, new feature, client request)

**Business Context:**
- What business decision depends on this research?
- What is the cost of deciding without research?
- Who are the stakeholders for the results?

**Existing Knowledge Inventory:**
| What We Know | Source | Confidence | Gaps |
|-------------|--------|-----------|------|
| [existing insight] | [where from] | High/Med/Low | [what is missing] |

### Step 3: Research Questions
**Primary Question (ONE):**
"[The single most important question this research must answer]"

**Secondary Questions (max 3):**
1. [Supporting question]
2. [Supporting question]
3. [Supporting question]

**Out of Scope:**
- [Questions we are NOT trying to answer this sprint]
- [Topics that should be deferred to future research]

### Step 4: Methodology Recommendation
**Method Selection Matrix:**
| Research Question | Recommended Method | Alternative | Rationale |
|-------------------|-------------------|-------------|-----------|
| [primary Q] | [method] | [backup method] | [why this method fits] |
| [secondary Q1] | [method] | [backup method] | [why] |
| [secondary Q2] | [method] | [backup method] | [why] |

**Method Details:**
```
PRIMARY METHOD: [name]
─────────────────────
Type: Generative | Evaluative | Quantitative
Participants: [N needed] from [segment]
Sessions: [N sessions] × [duration each]
Setting: Remote | In-person | Unmoderated
Tools: [specific tools needed]
Stimuli: [prototype/wireframe/current product/none]
```

**Method Selection Guide:**
| Need to Learn | Best Method |
|--------------|-------------|
| Why users behave a certain way | Contextual inquiry / In-depth interviews |
| If a design works | Usability testing (moderated) |
| What users do (not say) | Analytics + Session recordings |
| How users organize information | Card sorting / Tree testing |
| Which design performs better | A/B testing / Preference testing |
| What users want (stated) | Survey / Concept testing |
| How users feel about experience | Diary study / Experience sampling |

### Step 5: Participant Criteria
**Recruitment Screener:**
| Criteria | Required | Nice-to-Have |
|----------|----------|-------------|
| [behavioral criterion] | Must have done X in last Y days | |
| [segment criterion] | Must be [type of user] | |
| [demographic criterion] | [if relevant] | Mix of [attribute] |
| [exclusion] | NOT [type to exclude] | |

**Sample Plan:**
| Segment | Target N | Recruitment Source | Incentive |
|---------|---------|-------------------|-----------|
| [segment A] | [N] | [where to recruit] | [$X or equivalent] |
| [segment B] | [N] | [where to recruit] | [$X or equivalent] |

### Step 6: Timeline & Deliverables
**Sprint Plan:**
| Phase | Duration | Activities | Deliverable |
|-------|----------|-----------|-------------|
| Setup | [N days] | Recruit, prepare stimuli, pilot | Screener + guide + prototype |
| Fieldwork | [N days] | Conduct [N] sessions | Raw notes + recordings |
| Analysis | [N days] | Synthesis, affinity mapping | Findings + recommendations |
| Report | [N days] | Compile, present | Final report + presentation |

**Expected Deliverables:**
- [ ] Research findings report (structured per finding template)
- [ ] Highlight reel (key moments from sessions, if recorded)
- [ ] Recommendations with priority and confidence level
- [ ] Raw data archive (notes, recordings, transcripts)
- [ ] Presentation for stakeholders (10-15 min)

### Step 7: Success Criteria
**This research sprint is successful when:**
- [ ] Primary research question is answered with evidence
- [ ] Confidence level is HIGH or MEDIUM for key findings
- [ ] Recommendations are specific enough to act on
- [ ] Stakeholders can make the pending decision
- [ ] Results are documented and accessible for future reference

**This research sprint fails if:**
- [ ] Questions remain unanswered after fieldwork
- [ ] Sample is too small or biased for reliable findings
- [ ] Findings are vague ("users want it to be better")
- [ ] Results arrive after the decision deadline

## Output Artifacts
- `ux-research-brief-[project].md` | `recruitment-screener.md` | `research-timeline.md` | `methodology-rationale.md`

## Quality Criteria
- One clear primary question | Methodology matches questions | Participant criteria specific and recruitble | Timeline realistic with buffer | Deliverables defined upfront | Success criteria measurable | Stakeholders identified
