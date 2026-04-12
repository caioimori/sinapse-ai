---
task: build-retention-cohort-analysis
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

# Build Retention Cohort Analysis

## Metadata
- **Agent:** ps-product-analyst (Delta)
- **Complexity:** Medium-High
- **Estimated Time:** 3-4 hours
- **Produces:** Retention cohort tables, cohort curves, retention insights, improvement recommendations

## Purpose
Analisar retencao por coortes para entender como diferentes grupos de usuarios se comportam ao longo do tempo. Cohort analysis e o metodo mais confiavel para medir retencao real vs metricas agregadas que mascaram tendencias.

## Steps

### Step 1: Define Cohort Parameters
**Cohort Definition:**
| Parameter | Value | Rationale |
|-----------|-------|-----------|
| Cohort Type | Time-based / Behavior-based / Acquisition-based | [why this type] |
| Cohort Period | Daily / Weekly / Monthly | [based on usage frequency] |
| Retention Event | [what counts as "active"] | [the core action that = value] |
| Observation Window | [N periods to track] | [how long to observe] |

**Common Retention Events by Product Type:**
| Product Type | Retention Event | Period |
|-------------|----------------|--------|
| SaaS Tool | Logged in + completed core action | Weekly |
| E-commerce | Made a purchase | Monthly |
| Content Platform | Consumed content | Weekly |
| Social/Community | Posted or engaged | Daily/Weekly |
| Enterprise | Active usage by org | Monthly |

### Step 2: Build Cohort Table
**Standard Retention Table:**
```
         | Period 0 | Period 1 | Period 2 | Period 3 | ... | Period N |
Cohort A | 100%     | [%]      | [%]      | [%]      |     | [%]      |
Cohort B | 100%     | [%]      | [%]      | [%]      |     | [%]      |
Cohort C | 100%     | [%]      | [%]      | [%]      |     | [%]      |
...      |          |          |          |          |     |          |
```

**Retention Types to Calculate:**
| Type | Definition | Best For |
|------|-----------|---------|
| **Classic (N-day)** | % active on exactly day N | Daily products |
| **Rolling (N-day)** | % active within N-day window | Weekly/monthly products |
| **Unbounded** | % active on day N or after | Understanding total retained |
| **Bracket** | % active in period bracket (D7-D14) | Flexible analysis |

### Step 3: Calculate Key Retention Metrics
**Per Cohort:**
```
D1 Retention: [%] — immediate value perception
D7 Retention: [%] — habit formation
D14 Retention: [%] — sustained engagement
D30 Retention: [%] — true retention (benchmark)
D60 Retention: [%] — long-term health
D90 Retention: [%] — loyal user base

Retention Curve Shape: [J-curve / flat / declining / smile]
Stabilization Point: [where curve flattens — your "floor"]
Floor Value: [% — long-term retained users]
```

**Benchmarks (industry averages):**
| Product Category | D1 | D7 | D30 | D90 |
|-----------------|-----|-----|------|------|
| Top SaaS | 50% | 35% | 25% | 20% |
| Average SaaS | 35% | 20% | 12% | 8% |
| Top Consumer | 40% | 25% | 15% | 10% |
| Average Consumer | 25% | 12% | 6% | 3% |

### Step 4: Segment Analysis
**Compare Retention Across Segments:**
| Segment | D1 | D7 | D30 | Floor | Insight |
|---------|-----|-----|------|-------|---------|
| By acquisition channel | | | | | [which channels bring sticky users] |
| By plan type | | | | | [free vs paid retention delta] |
| By persona | | | | | [which persona retains best] |
| By activation status | | | | | [activated vs not — the biggest lever] |
| By feature usage | | | | | [which features correlate with retention] |
| By onboarding completion | | | | | [onboarding impact on retention] |

**Activation Impact Analysis:**
```
Activated users D30 retention: [%]
Non-activated users D30 retention: [%]
Delta: [percentage points]
Activation rate: [% of users who activate]
Opportunity: If we increase activation by X%, retention improves by Y%
```

### Step 5: Trend Analysis (Cohort-over-Cohort)
**Is Retention Improving?**
| Metric | 3 months ago | 2 months ago | Last month | This month | Trend |
|--------|-------------|-------------|-----------|-----------|-------|
| D7 retention | [%] | [%] | [%] | [%] | Up/Down/Flat |
| D30 retention | [%] | [%] | [%] | [%] | Up/Down/Flat |
| Time to activate | [days] | [days] | [days] | [days] | Up/Down/Flat |
| Floor retention | [%] | [%] | [%] | [%] | Up/Down/Flat |

### Step 6: Recommendations
**Priority Actions Based on Analysis:**
| Finding | Impact | Recommendation | Effort |
|---------|--------|----------------|--------|
| [retention gap identified] | [users/revenue at risk] | [specific action] | [T-shirt] |

**Retention Improvement Levers:**
1. **Activation optimization** — fastest impact on D7
2. **Habit loop creation** — improves D14-D30
3. **Re-engagement campaigns** — recovers dormant users
4. **Feature depth** — improves long-term floor
5. **Churn prediction** — proactive intervention

## Output Artifacts
- `retention-cohort-analysis.md` | `cohort-tables/[period].md` | `segment-retention-comparison.md` | `retention-recommendations.md`

## Quality Criteria
- Cohort parameters clearly defined | Min 3 months of cohort data | Segmented analysis (min 3 dimensions) | Benchmarks included for context | Trend over time analyzed | Activation impact quantified | Recommendations specific and prioritized
