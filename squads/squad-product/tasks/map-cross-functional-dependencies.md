---
task: map-cross-functional-dependencies
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

# Map Cross-Functional Dependencies

## Metadata
- **Agent:** ps-delivery-manager (Tempo)
- **Complexity:** Medium
- **Estimated Time:** 2-3 hours
- **Produces:** Dependency map, critical path analysis, risk mitigation plan, coordination schedule

## Purpose
Mapear dependencias entre equipes, sistemas e entregas para evitar bloqueios e garantir coordenacao eficiente. Em contexto de agencia, dependencias com cliente sao tao criticas quanto dependencias tecnicas.

## Steps

### Step 1: Identify Dependencies
**Dependency Types:**
| Type | Description | Example |
|------|-----------|---------|
| Technical | Code/API/data dependency | Backend API needed before frontend |
| Design | Design deliverable needed | UI mockups before implementation |
| Content | Content from client/team | Copy, images, data files |
| Approval | Stakeholder sign-off | Client approval before launch |
| Infrastructure | Environment/service needed | Staging env, API keys, DNS |
| External | Third-party dependency | API access, vendor delivery |
| Knowledge | Information/decision needed | Technical decision, business rule clarification |

**Dependency Inventory:**
| ID | Dependency | Type | Provider | Consumer | Needed By | Status |
|----|-----------|------|----------|----------|-----------|--------|
| D1 | [what is needed] | [type] | [who provides] | [who needs it] | [date] | Pending/In Progress/Done/Blocked |

### Step 2: Dependency Risk Assessment
**Per Dependency:**
| Risk Factor | Score (1-5) | Criteria |
|-------------|------------|---------|
| Likelihood of delay | | 5=very likely late, 1=very reliable |
| Impact if delayed | | 5=blocks critical path, 1=minor inconvenience |
| Control | | 5=zero control (external), 1=full control (internal) |
| **Risk Score** | **/15** | Likelihood × Impact adjusted by Control |

**Risk Bands:**
| Score | Risk Level | Action Required |
|-------|-----------|----------------|
| 12-15 | Critical | Daily monitoring + backup plan |
| 8-11 | High | Weekly check-in + escalation plan |
| 4-7 | Medium | Bi-weekly check, track in standup |
| 1-3 | Low | Monitor passively |

### Step 3: Critical Path Analysis
**Map the dependency chain:**
```
[Start] → [Task A (3d)] → [Task B (2d)] → [Task C (5d)] → [Launch]
                             ↑
              [Task D (4d)] ─┘ (D must complete before B starts)
                ↑
    [External Dep X] ─── (X must deliver before D starts)

Critical Path: Start → A → B → C → Launch = [N days]
External Dependencies on Critical Path: [list]
Buffer on Critical Path: [days of slack]
```

**Critical Path Rule:** Any delay on the critical path delays the entire delivery. Focus risk mitigation here.

### Step 4: Coordination Plan
**Communication Cadence per Dependency:**
| Dependency | Risk Level | Check-in Frequency | Channel | Escalation Trigger |
|-----------|-----------|-------------------|---------|-------------------|
| [dep 1] | Critical | Daily | Standup + DM | Any delay signal |
| [dep 2] | High | 2x/week | Sync meeting | 1 day late |
| [dep 3] | Medium | Weekly | Async update | 3 days late |
| [dep 4] | Low | Bi-weekly | Status report | 1 week late |

**Client Dependencies (Agency-Specific):**
| Deliverable from Client | Needed By | Requested On | Reminder Schedule | Fallback |
|------------------------|-----------|-------------|-------------------|---------|
| [content/approval/data] | [date] | [date] | [cadence] | [what we do if late] |

### Step 5: Mitigation Strategies
**Per Critical/High Risk Dependency:**
```
DEPENDENCY: [description]
RISK: [what could go wrong]
MITIGATION:
  - Plan A: [primary approach to ensure delivery]
  - Plan B: [backup if Plan A fails]
  - Plan C: [minimal viable alternative if both fail]
TRIGGER FOR PLAN B: [specific condition that activates backup]
OWNER: [who monitors and decides]
```

**Common Mitigation Patterns:**
| Pattern | When to Use |
|---------|-----------|
| Start with mock/stub | API dependency — build against contract, integrate later |
| Parallel development | Design dependency — start with wireframe, refine with final design |
| Buffer in timeline | External dependency — add 50% buffer to external estimates |
| Early commitment | Approval dependency — get client to commit to review date |
| Reduce scope | Content dependency — launch with placeholder, update later |

### Step 6: Dependency Dashboard
**Weekly Dependency Status:**
| ID | Dependency | Provider | Due | Status | Risk | Action Needed |
|----|-----------|----------|-----|--------|------|--------------|
| D1 | [dep] | [who] | [date] | On Track/At Risk/Blocked | H/M/L | [if any] |

## Output Artifacts
- `dependency-map-[project].md` | `critical-path-analysis.md` | `dependency-risk-register.md` | `coordination-plan.md`

## Quality Criteria
- All dependency types covered | Risk assessed per dependency | Critical path identified | Mitigation plan for critical/high risks | Client dependencies explicit | Coordination cadence defined | Dashboard maintained weekly
