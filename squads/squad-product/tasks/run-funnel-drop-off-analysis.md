---
task: run-funnel-drop-off-analysis
responsavel: "@ps-product-analyst"
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

# Run Funnel Drop-off Analysis

## Metadata
- **Agent:** ps-product-analyst (Delta)
- **Complexity:** Medium
- **Estimated Time:** 2-3 hours
- **Produces:** Funnel analysis report, drop-off diagnosis, conversion optimization recommendations

## Purpose
Analisar funis de conversao para identificar onde e por que usuarios abandonam. Cada ponto de drop-off e uma oportunidade de melhoria de conversao.

## Steps

### Step 1: Define Funnel
**Funnel Specification:**
```
Funnel Name: [e.g., Signup-to-Activation, Purchase, Onboarding]
Business Goal: [what success looks like at the end]
Date Range: [analysis period]
Segment: [all users or specific segment]
Platform: [web/mobile/all]
```

**Steps Definition:**
| Step | Event | Description | Time Limit |
|------|-------|-------------|-----------|
| 1 | [event_name] | [user action] | — |
| 2 | [event_name] | [user action] | within [N hours/days] of step 1 |
| 3 | [event_name] | [user action] | within [N hours/days] of step 2 |
| ... | | | |
| Final | [event_name] | [conversion event] | within [N hours/days] |

### Step 2: Calculate Conversion Rates
**Step-by-Step Conversion:**
```
Step 1: [event] .............. [N users] (100%)
    ↓ [X% convert, Y% drop]
Step 2: [event] .............. [N users] ([%])
    ↓ [X% convert, Y% drop]
Step 3: [event] .............. [N users] ([%])
    ↓ [X% convert, Y% drop]
Step N: [event] .............. [N users] ([%])

Overall Conversion: [%]
Biggest Drop-off: Step [X] → Step [Y] ([Z% lost])
```

**Benchmark Comparison:**
| Step Transition | Current Rate | Industry Benchmark | Gap |
|----------------|-------------|-------------------|------|
| Step 1 → 2 | [%] | [%] | [pp] |
| Step 2 → 3 | [%] | [%] | [pp] |
| Overall | [%] | [%] | [pp] |

### Step 3: Diagnose Drop-off Points
**For each major drop-off (>20% loss), investigate:**

**Quantitative Diagnosis:**
| Factor | Analysis | Finding |
|--------|----------|---------|
| Time spent at step | [avg time before dropping] | [too fast = confusion, too slow = friction] |
| Device/browser | [conversion by device] | [mobile vs desktop gap?] |
| Traffic source | [conversion by acquisition channel] | [quality issue?] |
| User segment | [conversion by persona/plan] | [segment-specific issue?] |
| Day/time | [conversion by day of week] | [timing pattern?] |
| Error rate | [errors at this step] | [technical issue?] |
| Page load time | [performance at this step] | [speed issue?] |

**Qualitative Diagnosis:**
| Source | Method | What to Look For |
|--------|--------|-----------------|
| Session recordings | Watch 20+ drop-off sessions | Confusion, rage clicks, back button |
| Heatmaps | Click/scroll maps at drop-off page | Missed CTAs, dead clicks, scroll depth |
| User interviews | Ask users who dropped off | "Why did you stop?" |
| Support tickets | Filter by related complaints | Common friction themes |
| Exit surveys | Micro-survey at drop-off point | Stated reasons for leaving |

### Step 4: Root Cause Classification
**Per Drop-off Point:**
| Root Cause Category | Indicators | Example |
|--------------------|-----------|---------|
| **UX Friction** | Confusion, wrong clicks, back button | Unclear form labels |
| **Value Gap** | Quick exit, no engagement | Users do not see why to continue |
| **Trust Issue** | Hesitation at payment/data entry | No security indicators |
| **Technical** | Errors, slow load, broken elements | Payment gateway timeout |
| **Motivation** | Gradual disengagement | Too many steps, fatigue |
| **External** | Drop-off correlates with external factor | Competitor promo, seasonality |

### Step 5: Quantify Opportunity
**Revenue/User Impact per Drop-off Fix:**
```
Drop-off Point: Step [X] → Step [Y]
Current conversion: [%]
Users lost per month: [N]
If improved by [X percentage points]:
  Additional conversions/month: [N]
  Revenue impact: [$ estimate]
  Annual impact: [$ estimate]
```

**Priority Matrix:**
| Drop-off | Users Lost | Revenue Impact | Fix Complexity | Priority |
|---------|-----------|---------------|---------------|----------|
| [point 1] | [N/month] | [$] | Low/Med/High | P1/P2/P3 |
| [point 2] | [N/month] | [$] | Low/Med/High | P1/P2/P3 |

### Step 6: Recommendations
**Per Priority Drop-off:**
```
DROP-OFF: Step [X] → Step [Y] ([Z% loss])
ROOT CAUSE: [category + specific diagnosis]
RECOMMENDATION: [specific change to implement]
EXPECTED LIFT: [% improvement estimate]
VALIDATION: [how to test — A/B test, prototype test, etc.]
EFFORT: [T-shirt size]
```

## Output Artifacts
- `funnel-analysis-[name].md` | `drop-off-diagnosis.md` | `conversion-opportunities.md` | `funnel-optimization-recommendations.md`

## Quality Criteria
- Funnel steps clearly defined with events | Conversion rates calculated per step | Biggest drop-offs diagnosed with multi-source evidence | Root causes classified | Revenue impact quantified | Recommendations specific with expected lift | Min 20 session recordings reviewed per drop-off
