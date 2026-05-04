---
task: triage-technical-debt-backlog
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

# Triage Technical Debt Backlog

## Metadata
- **Agent:** ps-delivery-manager (Tempo)
- **Complexity:** Medium
- **Estimated Time:** 2-3 hours
- **Produces:** Prioritized tech debt backlog, severity classification, sprint allocation plan

## Purpose
Classificar e priorizar divida tecnica para alocar budget de sprint de forma eficiente. Baseado em Martin Fowler Technical Debt Quadrant e framework de severidade pragmatico.

## Steps

### Step 1: Inventory Technical Debt
**Debt Collection Sources:**
| Source | Method | Frequency |
|--------|--------|-----------|
| Engineering team | Debt cards durante desenvolvimento | Continuous |
| Code reviews | Flagged during PR reviews | Per PR |
| Incidents | Post-mortem action items | Per incident |
| Performance monitoring | Degradation alerts | Weekly |
| Security scans | Vulnerability reports | Monthly |
| Dependency audits | Outdated package checks | Monthly |

**Debt Card Template:**
```
DEBT: [short title]
Location: [file/module/system affected]
Type: [code/architecture/infrastructure/testing/documentation]
Description: [what the debt is]
Impact: [what happens if not addressed]
Origin: [how this debt was created]
Reporter: [who identified it]
Date Identified: [when]
```

### Step 2: Classify Using Fowler Quadrant
**Martin Fowler Technical Debt Quadrant:**
```
              DELIBERATE                    INADVERTENT
         ┌──────────────────────┬──────────────────────┐
RECKLESS │ "We know this is     │ "What is layered     │
         │  wrong but ship it"  │  architecture?"       │
         │                      │                      │
         │ Quick-fix shortcuts  │ Knowledge gaps        │
         │ Known tech debt      │ Unknown tech debt     │
         ├──────────────────────┼──────────────────────┤
PRUDENT  │ "We must ship now    │ "Now we know how we  │
         │  and deal with it"   │  should have done it"│
         │                      │                      │
         │ Strategic debt       │ Evolutionary debt    │
         │ Conscious tradeoff   │ Natural learning     │
         └──────────────────────┴──────────────────────┘
```

**Classification per Debt Item:**
| Debt | Quadrant | Implication |
|------|---------|-------------|
| Deliberate-Reckless | Should not have been created, fix ASAP |
| Deliberate-Prudent | Strategic, track and schedule payback |
| Inadvertent-Reckless | Training issue, fix + prevent recurrence |
| Inadvertent-Prudent | Natural evolution, address when relevant |

### Step 3: Severity Assessment
**Per Debt Item:**
| Dimension | Score (1-5) | Criteria |
|-----------|------------|---------|
| User Impact | | 5=blocks users, 1=invisible to users |
| Velocity Impact | | 5=slows every sprint, 1=no dev impact |
| Risk Level | | 5=security/data loss risk, 1=cosmetic |
| Spread | | 5=affects entire codebase, 1=isolated |
| Growth Rate | | 5=getting worse rapidly, 1=stable |
| **Total** | **/25** | |

**Severity Bands:**
| Score | Severity | Sprint Allocation |
|-------|----------|------------------|
| 20-25 | Critical | Immediate (this sprint) |
| 15-19 | High | Next 1-2 sprints |
| 10-14 | Medium | Scheduled within quarter |
| 5-9 | Low | Opportunistic (when touching related code) |
| Below 5 | Cosmetic | Document but do not allocate time |

### Step 4: Calculate Debt Ratio
**Tech Debt Ratio:**
```
Debt Ratio = Time to Fix All Debt / Time to Rebuild System

Healthy: < 10%
Manageable: 10-20%
Concerning: 20-40%
Critical: > 40%
```

**Debt Velocity:**
```
New Debt per Sprint: [items added]
Debt Resolved per Sprint: [items fixed]
Net Debt Change: New - Resolved
Trend: Increasing / Stable / Decreasing
```

### Step 5: Prioritized Backlog
**Priority Order:**
| Priority | Debt Item | Severity | Effort | Sprint Target | Owner |
|----------|----------|----------|--------|--------------|-------|
| P1 | [item] | Critical | [pts] | Current sprint | [who] |
| P2 | [item] | High | [pts] | Next sprint | [who] |
| P3 | [item] | Medium | [pts] | This quarter | [who] |
| ... | | | | | |

**Sprint Allocation Rule:**
```
Minimum 15% of sprint capacity dedicated to tech debt
Allocation increases if Debt Ratio > 20%:
  - 20-30% ratio: allocate 20% of capacity
  - 30-40% ratio: allocate 25% of capacity
  - > 40% ratio: allocate 30%+ (or dedicated debt sprint)
```

### Step 6: Prevention Measures
**Debt Prevention Practices:**
| Practice | Description | Who |
|----------|-----------|-----|
| Definition of Done includes debt check | Every story reviewed for new debt | Dev team |
| Debt card creation mandatory | When shortcuts taken, create card | Developer |
| Quarterly debt review | Full backlog triage | Delivery manager |
| Refactoring budget protected | 15% minimum enforced | Delivery manager |
| Architecture decision records | Document trade-offs | Architect |

## Output Artifacts
- `tech-debt-backlog-[date].md` | `debt-severity-assessment.md` | `sprint-debt-allocation.md` | `debt-health-report.md`

## Quality Criteria
- All known debt inventoried | Fowler quadrant classified | Severity scored per item | Debt ratio calculated | Sprint allocation follows minimum 15% rule | Prevention measures documented | Trend tracked over time
