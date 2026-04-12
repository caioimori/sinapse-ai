---
task: calculate-sprint-velocity
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

# Calculate Sprint Velocity

## Metadata
- **Agent:** ps-delivery-manager (Tempo)
- **Complexity:** Low-Medium
- **Estimated Time:** 1-2 hours
- **Produces:** Velocity report, trend analysis, capacity forecast, predictability metrics

## Purpose
Calcular e analisar velocidade de sprint para melhorar previsibilidade de delivery. Velocidade nao e meta de performance — e ferramenta de planejamento.

## Steps

### Step 1: Calculate Raw Velocity
**Sprint Velocity:**
```
Velocity = Sum of story points COMPLETED in the sprint
(Only fully completed items count — partial completion = 0 points)

Sprint [N]: [X] points completed
Sprint [N-1]: [X] points completed
Sprint [N-2]: [X] points completed

Rolling Average (last 3 sprints): [avg] points
Rolling Average (last 6 sprints): [avg] points
```

**Completion Rate:**
```
Completion Rate = Points Completed / Points Committed × 100

Target: 80-90% (consistently >100% means undercommitting)
```

### Step 2: Velocity Trend Analysis
**Sprint-over-Sprint:**
| Sprint | Committed | Completed | Velocity | Completion % | Notes |
|--------|-----------|-----------|----------|-------------|-------|
| [N-5] | [pts] | [pts] | [pts] | [%] | [context] |
| [N-4] | [pts] | [pts] | [pts] | [%] | [context] |
| [N-3] | [pts] | [pts] | [pts] | [%] | [context] |
| [N-2] | [pts] | [pts] | [pts] | [%] | [context] |
| [N-1] | [pts] | [pts] | [pts] | [%] | [context] |
| [N] | [pts] | [pts] | [pts] | [%] | [context] |

**Trend Assessment:**
| Pattern | What It Means | Action |
|---------|-------------|--------|
| Stable (±10% variation) | Healthy, predictable | Use for planning confidently |
| Increasing | Team improving or estimates shrinking | Verify: real improvement or estimate inflation? |
| Decreasing | Impediments, complexity, or team changes | Investigate root cause |
| Volatile (>20% variation) | Unpredictable, planning is unreliable | Focus on estimation consistency |

### Step 3: Velocity Decomposition
**Where Did Points Go?**
| Category | Points | % of Total | Target % |
|----------|--------|-----------|----------|
| New features | [pts] | [%] | 60-70% |
| Tech debt | [pts] | [%] | 15-20% |
| Bug fixes | [pts] | [%] | 5-10% |
| Discovery | [pts] | [%] | 10-15% |
| Unplanned | [pts] | [%] | <10% |

**Unplanned Work Analysis:**
```
Unplanned Ratio = Unplanned Points / Total Points × 100

If > 20%: Investigate sources of unplanned work
Common sources: Production incidents, client urgencies, scope creep, dependencies
```

### Step 4: Predictability Metrics
**Velocity Variability:**
```
Standard Deviation = σ of last 6 sprint velocities
Coefficient of Variation = σ / Mean × 100

Predictability Rating:
  CV < 15%: Highly predictable (GREEN)
  CV 15-25%: Moderately predictable (YELLOW)
  CV > 25%: Unpredictable (RED — focus on stabilization)
```

**Forecast Ranges:**
```
Optimistic (P10): [mean + 1.28σ] points per sprint
Expected (P50): [mean] points per sprint
Conservative (P80): [mean - 0.84σ] points per sprint
Pessimistic (P95): [mean - 1.65σ] points per sprint

For N sprints ahead:
  Expected delivery: N × P50 = [X] points
  Range: [N × P95] to [N × P10] points
```

### Step 5: Capacity Adjustments
**Factors Affecting Next Sprint Velocity:**
| Factor | Impact | Adjusted Velocity |
|--------|--------|------------------|
| Team member on vacation | -[X] pts (proportional) | [adjusted] |
| New team member (onboarding) | -50% of their capacity | [adjusted] |
| Holidays in sprint | -[X] pts per day lost | [adjusted] |
| High unplanned work expected | -15-20% buffer | [adjusted] |
| Complex/unknown work | -10-15% uncertainty buffer | [adjusted] |

**Next Sprint Capacity Forecast:**
```
Base velocity (3-sprint avg): [X] points
Adjustments: [detail]
Forecast velocity: [X] points
Recommended commitment: [90% of forecast] = [X] points
```

### Step 6: Report & Recommendations
**Velocity Report:**
```
SPRINT VELOCITY REPORT — Sprint [N]
────────────────────────────────────
Velocity This Sprint: [X] points
Rolling Average (3): [X] points
Completion Rate: [%]
Predictability: [CV%] — [GREEN/YELLOW/RED]

TREND: [Stable / Improving / Declining / Volatile]
DECOMPOSITION: Features [%] | Debt [%] | Bugs [%] | Discovery [%] | Unplanned [%]

NEXT SPRINT FORECAST:
  Recommended commitment: [X] points
  Range: [low] — [high] points

RECOMMENDATIONS:
- [specific recommendation based on analysis]
```

## Output Artifacts
- `velocity-report-sprint-[N].md` | `velocity-trend-analysis.md` | `capacity-forecast.md`

## Quality Criteria
- Only completed items counted | Rolling average over 3+ sprints | Trend identified and contextualized | Decomposition by work type | Predictability (CV) calculated | Next sprint forecast with range | Recommendations actionable
