---
task: maintain-decision-log-system
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

# Maintain Decision Log System

## Metadata
- **Agent:** ps-product-ops-specialist (Mosaic)
- **Complexity:** Low-Medium
- **Estimated Time:** 1 hour/week (ongoing maintenance)
- **Produces:** Updated decision log, decision patterns analysis, governance compliance report

## Purpose
Manter sistema de registro de decisoes operacional e util. Decision logs morrem quando ninguem mantem — este task garante manutencao ativa.

## Steps

### Step 1: Weekly Log Review
**Review Checklist (15 min/week):**
- [ ] All decisions from this week captured?
- [ ] Each entry has rationale documented?
- [ ] Decision status current (active/superseded/reversed)?
- [ ] Cross-references updated (related decisions linked)?
- [ ] Review dates checked (any decisions due for revisit?)

### Step 2: Decision Quality Metrics
**Monthly Health Check:**
| Metric | Target | Current | Status |
|--------|--------|---------|--------|
| Decisions logged this month | >= 3 | [N] | [status] |
| % with rationale documented | 100% | [%] | [status] |
| % with options considered | >= 80% | [%] | [status] |
| Avg time to document | < 48h after decision | [hours] | [status] |
| Decisions revisited on schedule | 100% | [%] | [status] |
| Team aware of log location | 100% | [%] | [status] |

### Step 3: Pattern Analysis (Monthly)
**Decision Patterns:**
| Pattern | Frequency | Insight |
|---------|-----------|---------|
| Decisions reversed within 30 days | [N] | [rushing? insufficient data?] |
| Same decision revisited 3+ times | [N] | [unclear ownership? changing context?] |
| Decisions without data | [N] | [gut-feel culture? lack of analytics?] |
| Decisions overruled by client | [N] | [alignment issue? authority unclear?] |
| Decisions blocked by dependencies | [N] | [dependency management issue?] |

### Step 4: Governance Compliance
**Decision Governance Rules:**
| Rule | Compliance | Corrective Action |
|------|-----------|-------------------|
| All strategic decisions have exec approval | [Y/N] | [if no, escalate] |
| Scope changes follow change process | [Y/N] | [if no, enforce] |
| Technical decisions have architect input | [Y/N] | [if no, involve] |
| Client-impacting decisions communicated | [Y/N] | [if no, communicate] |
| Decisions with deadlines reviewed on time | [Y/N] | [if no, schedule] |

### Step 5: Decision Log Maintenance Tasks
**Ongoing:**
| Task | Frequency | Action |
|------|-----------|--------|
| Archive old decisions | Quarterly | Move >12 month decisions to archive |
| Update superseded links | As decisions change | Link old → new decision |
| Index update | Monthly | Refresh master index |
| Access review | Quarterly | Verify right people have access |
| Template update | Semi-annually | Improve template based on usage |
| New member onboarding | Per new member | Show log, explain importance |

## Output Artifacts
- `decision-log-health-[month].md` | `decision-patterns-[quarter].md` | `governance-compliance-[month].md`

## Quality Criteria
- Weekly review conducted | All decisions have rationale | Patterns analyzed monthly | Governance compliance checked | Archive maintained | New members onboarded to system
