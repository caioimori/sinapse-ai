---
task: scope-agency-mvp
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

# Scope Agency MVP

## Metadata
- **Agent:** ps-delivery-manager (Tempo)
- **Complexity:** Medium-High
- **Estimated Time:** 3-4 hours
- **Produces:** MVP scope document, feature matrix, timeline estimate, trade-off decisions

## Purpose
Definir escopo de MVP para contexto de agencia onde tempo e orcamento sao fixos (fixed-bid ou retainer). Aplicar Shape Up (Ryan Singer) para scoping baseado em appetite, nao em estimativa aberta.

## Steps

### Step 1: Define Appetite (Shape Up)
**Appetite vs Estimate:**
```
ESTIMATE (traditional): "How long will this take?" → open-ended
APPETITE (Shape Up): "How much time are we willing to spend?" → fixed constraint

Appetite for this MVP: [N weeks]
Team size: [N people]
Total investment: [N person-weeks]
```

**Appetite Calibration:**
| Appetite | Typical Scope | When to Use |
|----------|-------------|-----------|
| Small Batch (1-2 weeks) | Single feature, well-defined | Quick win, proof of concept |
| Big Batch (4-6 weeks) | Multi-feature MVP | New product launch, major initiative |
| Extended (6-8 weeks) | Complex MVP with integrations | Enterprise, multi-stakeholder |

### Step 2: Identify Core Job-to-be-Done
**The ONE job this MVP must complete:**
```
When [user type] is in [situation],
they want to [motivation/action],
so they can [desired outcome].

This is the job. Everything in MVP serves THIS job.
If a feature does not serve this job, it is out.
```

### Step 3: Feature Scoping (MoSCoW for MVP)
**Must Have (MVP = only these):**
| Feature | User Job | Complexity | Notes |
|---------|---------|-----------|-------|
| [feature 1] | [which job it serves] | S/M/L | [essential because...] |

**Should Have (v1.1 — next iteration):**
| Feature | User Job | Complexity | Notes |
|---------|---------|-----------|-------|
| [feature 1] | [job] | [size] | [deferred because...] |

**Could Have (v2.0 — if validated):**
| Feature | User Job | Complexity | Notes |
|---------|---------|-----------|-------|
| [feature 1] | [job] | [size] | [nice to have because...] |

**Will Not Have (explicitly out of scope):**
| Feature | Reason Out | When Revisit |
|---------|-----------|-------------|
| [feature 1] | [why excluded] | [condition for reconsideration] |

### Step 4: Scope Hammering (Shape Up)
**For each Must Have, ask:**
1. "What is the simplest version that still works?" (reduce)
2. "Can we use an existing solution instead of building?" (reuse)
3. "Can this be manual first and automated later?" (defer automation)
4. "What edge cases can we handle with a message instead of code?" (simplify)
5. "Does this need to be perfect or just functional?" (lower fidelity)

**Scope Decisions (document trade-offs):**
| Feature | Full Version | MVP Version | What We Cut | Trade-off |
|---------|-------------|-------------|-----------|-----------|
| [feature] | [ideal scope] | [reduced scope] | [what was removed] | [impact of cut] |

### Step 5: Technical Approach for Speed
**Build vs Buy vs Borrow:**
| Component | Build | Buy/Use Existing | Decision | Rationale |
|-----------|-------|-----------------|----------|-----------|
| Auth | Custom auth | Auth0/Supabase Auth | [choice] | [why] |
| Payments | Custom | Stripe | [choice] | [why] |
| Email | Custom | SendGrid/Resend | [choice] | [why] |
| Analytics | Custom | Mixpanel/Amplitude | [choice] | [why] |
| CMS | Custom | Contentful/Sanity | [choice] | [why] |

**Technical Shortcuts (acceptable for MVP):**
| Shortcut | Risk | Mitigation | Technical Debt Created |
|---------|------|-----------|----------------------|
| [shortcut 1] | [risk level] | [how we manage] | [debt to repay later] |

### Step 6: Timeline & Milestones
**MVP Timeline (within appetite):**
| Week | Focus | Deliverable | Demo |
|------|-------|------------|------|
| Week 1 | Foundation + core flow | [deliverable] | Internal demo |
| Week 2 | Core features complete | [deliverable] | Client check-in |
| Week 3 | Polish + edge cases | [deliverable] | Stakeholder demo |
| Week 4 | Testing + launch prep | [deliverable] | Go-live |

**Hill Chart (Shape Up):**
```
Each feature plotted on:
  Left side (uphill) = Figuring out → uncertainty, exploration
  Right side (downhill) = Making it happen → execution, known work
  Top of hill = Approach figured out, execution clear

Feature A: [position on hill]
Feature B: [position on hill]
Feature C: [position on hill]
```

### Step 7: MVP Success Criteria
**How do we know the MVP succeeded?**
| Metric | Target | Measurement Method | Timeline |
|--------|--------|-------------------|----------|
| [primary metric] | [threshold] | [how measured] | [when measured] |
| [secondary metric] | [threshold] | [how measured] | [when measured] |
| [qualitative signal] | [what to observe] | [how observed] | [when checked] |

**Go/No-Go for v1.1:**
```
If [metric] >= [threshold] within [timeframe]:
  → Proceed to v1.1 (add Should Have features)
If [metric] < [threshold]:
  → Diagnose: Is it a product problem or a market problem?
  → Decide: Iterate / Pivot / Kill
```

## Output Artifacts
- `mvp-scope-[project].md` | `feature-matrix.md` | `scope-trade-offs.md` | `mvp-timeline.md` | `mvp-success-criteria.md`

## Quality Criteria
- Appetite defined (not open-ended estimate) | Core JTBD identified | MoSCoW applied rigorously | Scope hammered (simplest version) | Build vs buy decided | Timeline within appetite | Success criteria defined before building | Explicit out-of-scope list
