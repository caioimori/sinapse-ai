---
task: manage-sprint-capacity-planning
responsavel: "@ps-delivery-manager"
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

# Manage Sprint Capacity Planning

## Metadata
- **Agent:** ps-delivery-manager (Tempo)
- **Complexity:** Medium
- **Estimated Time:** 1-2 hours per sprint
- **Produces:** Capacity plan, allocation matrix, availability calendar, utilization report

## Purpose
Gerenciar capacidade de sprint considerando realidade de agencia: times compartilhados entre clientes, disponibilidade variavel, e necessidade de balancear multiplos projetos simultaneamente.

## Steps

### Step 1: Team Availability Matrix
**Per Team Member:**
| Member | Role | Total Days | Vacation/PTO | Client A (%) | Client B (%) | Internal (%) | Available Days |
|--------|------|-----------|-------------|-------------|-------------|-------------|---------------|
| [name] | [role] | [sprint days] | [days off] | [%] | [%] | [%] | [calculated] |

**Availability Calculation:**
```
Available Days = (Sprint Days - PTO Days) × Client Allocation %
Productive Hours = Available Days × Hours/Day × Focus Factor

Focus Factor by Context:
  - Dedicated to one project: 0.80
  - Split 2 projects: 0.65
  - Split 3+ projects: 0.50
  - Context-switching penalty: -15% per additional project
```

### Step 2: Capacity Calculation
**Sprint Capacity Formula:**
```
Individual Capacity = Available Days × Focus Factor × Velocity Factor

Where:
  Velocity Factor = Individual historical velocity / Team average velocity
  (accounts for seniority, domain knowledge, speed differences)

Team Capacity = Sum of Individual Capacities
Buffer = Team Capacity × 0.10 (minimum 10%)
Committable Capacity = Team Capacity - Buffer
```

**Capacity by Skill:**
| Skill | Available Capacity | Demand This Sprint | Gap |
|-------|-------------------|-------------------|------|
| Frontend dev | [days/points] | [days/points needed] | [surplus/deficit] |
| Backend dev | [days/points] | [days/points needed] | [surplus/deficit] |
| Design | [days/points] | [days/points needed] | [surplus/deficit] |
| QA | [days/points] | [days/points needed] | [surplus/deficit] |
| Product | [days/points] | [days/points needed] | [surplus/deficit] |

### Step 3: Budget Allocation
**Sprint Budget Distribution:**
```
Total Committable: [N points/days]

ALLOCATION:
├── Delivery (60-70%): [N] points
│   ├── Client A features: [N] points
│   ├── Client B features: [N] points
│   └── Internal product: [N] points
├── Tech Debt (15-20%): [N] points
│   ├── Critical debt: [N] points
│   └── Scheduled debt: [N] points
├── Discovery (10-15%): [N] points
│   ├── User research: [N] points
│   └── Prototyping: [N] points
└── Buffer (5-10%): [N] points
    ├── Unplanned work: [N] points
    └── Meeting overhead: [N] points
```

**Multi-Client Allocation (Agency-Specific):**
| Client | Retainer Hours | Sprint Allocation | Priority |
|--------|---------------|-------------------|----------|
| Client A | [N hours/month] | [N hours this sprint] | P1 |
| Client B | [N hours/month] | [N hours this sprint] | P2 |
| Internal | [flexible] | [N hours this sprint] | P3 |

### Step 4: Load Balancing
**Individual Load Check:**
| Member | Allocated Points | Capacity | Load % | Status |
|--------|-----------------|----------|--------|--------|
| [name] | [pts] | [pts] | [%] | Under/Balanced/Over |

**Load Status:**
| Load % | Status | Action |
|--------|--------|--------|
| < 70% | Underloaded | Can take more work or help others |
| 70-90% | Balanced | Optimal zone |
| 90-100% | Full | No additional commitments |
| > 100% | Overloaded | MUST redistribute — unsustainable |

**Rebalancing Options:**
1. Move work items to less loaded members
2. Defer lower-priority items to next sprint
3. Request additional resource (if critical)
4. Reduce scope of specific items
5. Pair junior with senior to build capacity

### Step 5: Risk Factors
**Capacity Risks:**
| Risk | Probability | Impact | Mitigation |
|------|------------|--------|-----------|
| Key person unavailable | [%] | [high/med/low] | Cross-train, document knowledge |
| Scope creep | [%] | [high/med/low] | Strict change process, buffer |
| External dependency delay | [%] | [high/med/low] | Start with mockable interfaces |
| Production incident | [%] | [high/med/low] | Incident rotation, buffer allocation |
| Client adds urgent request | [%] | [high/med/low] | Buffer + triage process |

### Step 6: Capacity Report
**Sprint Capacity Summary:**
```
CAPACITY PLAN — Sprint [N]
─────────────────────────
Period: [start] — [end]
Team Size: [N members]
Total Capacity: [N points/days]
Committable (after buffer): [N points/days]
Committed: [N points/days] ([% of committable])

ALLOCATION:
  Delivery: [N pts] ([%])
  Tech Debt: [N pts] ([%])
  Discovery: [N pts] ([%])
  Buffer: [N pts] ([%])

TEAM LOAD:
  Average load: [%]
  Highest load: [name] at [%]
  Lowest load: [name] at [%]

RISKS:
  [Top risk and mitigation]

UTILIZATION TREND:
  Last 3 sprints: [%] → [%] → [%]
  Target range: 70-90%
```

## Output Artifacts
- `capacity-plan-sprint-[N].md` | `availability-matrix.md` | `allocation-budget.md` | `load-balance-report.md`

## Quality Criteria
- Every team member accounted for | Focus factor adjusted for multi-project | Buffer minimum 10% | No one >100% loaded | Skill-based capacity checked | Multi-client allocation documented | Trend tracked over sprints
