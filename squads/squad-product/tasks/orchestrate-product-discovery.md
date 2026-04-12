---
task: orchestrate-product-discovery
responsavel: "@product-orqx"
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

# Orchestrate Product Discovery

## Metadata
- **Agent:** product-orqx (Vector)
- **Complexity:** High
- **Estimated Time:** 2-4 hours (setup), 1-2 weeks (sprint)
- **Depends On:** Client brief or opportunity identified
- **Produces:** Discovery sprint plan, team assignments, timeline

## Purpose
Orquestrar um sprint de discovery completo — desde a identificação do problema até a validação de hipóteses. Coordena Quorum (Discovery Lead), Delta (Analytics), Charter (Strategy) e Proxy (Client PM) para garantir que nenhuma solução entre em delivery sem evidência validada.

## Steps

### Step 1: Discovery Trigger Assessment
**Discovery Trigger Matrix:**
| Trigger Type | Examples | Sprint Type | Duration |
|-------------|---------|-------------|----------|
| Client request | "Users need feature X" | Validation Sprint | 1 week |
| Metric signal | Activation rate dropping | Diagnostic Sprint | 1-2 weeks |
| Strategic opportunity | New market segment | Exploration Sprint | 2 weeks |
| User feedback pattern | 5+ similar complaints | Problem Sprint | 1 week |
| Competitive threat | Competitor launched X | Rapid Assessment | 3 days |

**Go/No-Go Criteria:**
- [ ] Problem affects >20% of users OR >10% revenue impact
- [ ] Insufficient existing evidence
- [ ] Client stakeholder available for collaboration
- [ ] Team capacity available (min 40% of Product Trio)

### Step 2: Discovery Sprint Design
**Sprint Configuration:**
```
Sprint Name: [CLIENT]-DISC-[YYYY-MM]-[TOPIC]
Type: [Validation | Diagnostic | Exploration | Problem | Rapid]
Duration: [3 days | 1 week | 2 weeks]

Product Trio:
  PM: [Name] (Proxy or Charter)
  Designer: [Name] (from squad-design)
  Tech Lead: [Name] (from delivery team)

Support:
  Discovery Lead: Quorum | Analyst: Delta | Client PM: Proxy
```

**Weekly Interview Cadence (Teresa Torres):**
- Minimum: 1 user interview per week
- Target: 2-3 interviews per week during sprint

### Step 3: Team Assignment Distribution
| Agent | Assignment | Deliverable |
|-------|-----------|-------------|
| Quorum | Lead user interviews + synthesis | Research findings doc |
| Delta | Baseline metrics + tracking setup | Metrics brief |
| Charter | Strategic context + hypothesis framing | Opportunity brief |
| Proxy | Client alignment + stakeholder mgmt | Communication plan |

### Step 4: Discovery Kickoff Facilitation (60-90 min)
**Agenda:** Problem Framing (20min) → Assumption Mapping (20min) → Research Plan (15min) → Success Criteria (10min) → Timeline (10min)

**Assumption Map:**
```
HIGH RISK (Unknown + Critical): Test first
MEDIUM RISK (Partially Known): Validate during sprint
LOW RISK (Known): Confirm during regular interviews
```

### Step 5: Progress Monitoring
**Daily Checkpoint (15 min):** What learned? What testing today? Blockers?
**Mid-Sprint Review (30 min):** Evidence so far, assumptions status, adjust plan

**Discovery Health Indicators:**
| Indicator | Green | Yellow | Red |
|-----------|-------|--------|-----|
| Interviews conducted | On pace | 1 behind | 2+ behind |
| Assumptions tested | >50% midpoint | 30-50% | <30% |
| Team engagement | All attending | 1 missing | 2+ missing |

### Step 6: Synthesis Orchestration (2-3 hours)
Evidence Wall → Pattern Identification → Opportunity Mapping → Recommendations → Next Steps

### Step 7: Discovery Gate
**Gate Criteria (ALL must be true):**
- [ ] Problem validated with ≥5 user interviews
- [ ] At least 1 critical assumption tested
- [ ] Evidence documented and accessible
- [ ] Opportunity sized (reach × impact estimate)
- [ ] Client stakeholder aligned on findings
- [ ] Delivery team briefed on context

**Decision:** PASS → delivery stories | CONDITIONAL → specific gaps | FAIL → return to discovery or kill

## Output Artifacts
- `discovery-sprint-plan.md` | `discovery-progress-tracker.md` | `discovery-synthesis-report.md` | `discovery-gate-decision.md`

## Quality Criteria
- Sprint has clear problem statement (not solution statement)
- Minimum 5 user interviews conducted
- All critical assumptions explicitly tested
- Discovery gate applied before any delivery commitment
