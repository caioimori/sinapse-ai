---
task: run-product-operations-audit
responsavel: "@ps-product-ops-specialist"
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

# Run Product Operations Audit

## Metadata
- **Agent:** ps-product-ops-specialist (Mosaic)
- **Complexity:** Medium-High
- **Estimated Time:** 4-6 hours
- **Produces:** Ops audit report, maturity assessment, improvement roadmap, efficiency metrics

## Purpose
Auditar maturidade e eficiencia das operacoes de produto para identificar gargalos, ineficiencias e oportunidades de melhoria sistematica.

## Steps

### Step 1: Ops Maturity Assessment
**Product Ops Maturity Model (5 levels):**

| Level | Name | Characteristics |
|-------|------|----------------|
| 1 | Ad-hoc | No standard processes, tribal knowledge, reactive |
| 2 | Defined | Core processes documented, basic tools, some consistency |
| 3 | Managed | Processes followed consistently, metrics tracked, templates used |
| 4 | Optimized | Data-driven improvement, cross-client learning, automation |
| 5 | Strategic | Ops as competitive advantage, predictive, self-improving |

**Assessment per Dimension:**
| Dimension | Score (1-5) | Evidence | Gap to Next Level |
|-----------|------------|---------|-------------------|
| Process Documentation | | [what exists] | [what is missing] |
| Tool Utilization | | [tools and usage] | [underused/gaps] |
| Template Library | | [templates available] | [missing templates] |
| Metric Standardization | | [consistency across clients] | [inconsistencies] |
| Knowledge Management | | [KB state] | [gaps/findability] |
| Onboarding Efficiency | | [time to productive] | [bottlenecks] |
| Cross-Client Learning | | [sharing mechanisms] | [silos] |
| Automation | | [automated vs manual] | [automation opportunities] |

### Step 2: Process Efficiency Audit
**Per Core Process:**
| Process | Cycle Time | Quality | Bottleneck | Waste |
|---------|-----------|---------|-----------|-------|
| Sprint planning | [hours] | [defects/rework] | [where it slows] | [unnecessary steps] |
| Feature prioritization | [days] | [decision reversals] | [waiting for...] | [redundant reviews] |
| Client request intake | [hours to response] | [reframe rate] | [approval delays] | [duplicate logging] |
| Release process | [hours] | [rollback rate] | [testing bottleneck] | [manual steps] |
| Research synthesis | [days] | [actionability] | [data gathering] | [unused findings] |
| QBR preparation | [hours] | [client satisfaction] | [data collection] | [custom formatting] |

**Waste Identification (Lean):**
| Waste Type | Examples Found | Impact |
|-----------|--------------|--------|
| Waiting | [approval delays, dependency waits] | [hours/sprint wasted] |
| Overprocessing | [unnecessary reviews, extra formatting] | [hours/sprint wasted] |
| Defects | [rework, miscommunication] | [hours/sprint wasted] |
| Motion | [context switching, tool hopping] | [hours/sprint wasted] |
| Inventory | [unused docs, stale backlogs] | [maintenance overhead] |
| Overproduction | [reports no one reads, unused templates] | [time wasted creating] |
| Transport | [handoffs between tools, copy-paste] | [error risk + time] |

### Step 3: Team Efficiency Metrics
**Operational KPIs:**
| KPI | Current | Target | Gap |
|-----|---------|--------|-----|
| Time to onboard new client | [days] | [target days] | [delta] |
| Time to onboard new PM | [days] | [target days] | [delta] |
| Sprint planning time | [hours] | [target hours] | [delta] |
| Report generation time | [hours] | [target hours] | [delta] |
| Information retrieval time | [minutes] | <2 min | [delta] |
| Process adherence rate | [%] | >90% | [delta] |
| Template usage rate | [%] | >80% | [delta] |
| Tool utilization score | [%] | >70% | [delta] |

### Step 4: Improvement Prioritization
**Improvement Opportunities:**
| Opportunity | Impact (1-5) | Effort (1-5) | Priority Score | Category |
|------------|-------------|-------------|---------------|----------|
| [improvement 1] | [score] | [score] | Impact/Effort | Quick Win/Strategic/Deprioritize |
| [improvement 2] | [score] | [score] | Impact/Effort | Quick Win/Strategic/Deprioritize |

**Priority Matrix:**
```
HIGH IMPACT │ STRATEGIC    │ QUICK WINS
            │ (Plan these) │ (Do these first!)
            │              │
────────────┼──────────────┼─────────────
            │ DEPRIORITIZE │ FILL-INS
LOW IMPACT  │ (Skip)       │ (If time allows)
            │              │
            LOW EFFORT      HIGH EFFORT
```

### Step 5: Improvement Roadmap
**Phased Improvement Plan:**
| Phase | Timeline | Improvements | Expected Impact |
|-------|----------|-------------|----------------|
| Quick Wins | Next 2 weeks | [list of low-effort, high-impact] | [metric improvement] |
| Foundation | Month 1-2 | [process and template improvements] | [metric improvement] |
| Optimization | Month 3-4 | [automation, advanced tooling] | [metric improvement] |
| Strategic | Quarter 2+ | [cross-client learning, predictive ops] | [metric improvement] |

### Step 6: Audit Report
**Report Structure:**
1. Executive Summary (current maturity + top 3 recommendations)
2. Maturity Assessment (per dimension with evidence)
3. Process Efficiency (per process with metrics)
4. Waste Analysis (Lean waste types found)
5. Improvement Opportunities (prioritized)
6. Improvement Roadmap (phased plan)
7. Success Metrics (how to measure improvement)
8. Next Audit Date (typically quarterly)

## Output Artifacts
- `ops-audit-report-[date].md` | `maturity-assessment.md` | `improvement-roadmap.md` | `efficiency-metrics.md`

## Quality Criteria
- All dimensions assessed with evidence | Process cycle times measured | Waste types identified | Improvements prioritized by impact/effort | Roadmap phased and realistic | Success metrics defined | Next audit scheduled
