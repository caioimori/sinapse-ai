---
task: design-ab-experiment
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

# Design A/B Experiment

## Metadata
- **Agent:** ps-product-analyst (Delta)
- **Complexity:** Medium-High
- **Estimated Time:** 2-3 hours (design) + 1-4 weeks (run)
- **Produces:** Experiment design doc, sample size calculation, analysis plan, results report

## Purpose
Desenhar experimento A/B rigoroso para validar hipotese de produto com significancia estatistica. Evitar armadilhas comuns que invalidam resultados (peeking, underpowered tests, wrong metrics).

## Steps

### Step 1: Define Experiment Hypothesis
**Template:**
```
HYPOTHESIS: Changing [specific element]
from [current state — Control]
to [proposed change — Variant]
will [increase/decrease] [primary metric]
by [minimum detectable effect]
for [user segment]
because [rationale based on evidence].
```

**Pre-Experiment Checklist:**
- [ ] Hypothesis is specific and falsifiable
- [ ] Change is isolated (one variable only)
- [ ] Primary metric is measurable and available
- [ ] Minimum detectable effect is meaningful for business
- [ ] There is genuine uncertainty about the outcome

### Step 2: Select Metrics
**Primary Metric (ONE only):**
| Attribute | Value |
|-----------|-------|
| Metric name | [e.g., conversion rate, activation rate] |
| Current value (baseline) | [%] or [absolute] |
| Minimum detectable effect (MDE) | [% relative change or pp absolute change] |
| Direction | Increase / Decrease |

**Secondary Metrics (2-4):**
| Metric | Current Value | Expected Direction | Purpose |
|--------|-------------|-------------------|---------|
| [metric 2] | [value] | [up/down/neutral] | [guardrail / supporting] |
| [metric 3] | [value] | [up/down/neutral] | [guardrail / supporting] |

**Guardrail Metrics (DO NOT HARM):**
| Metric | Current Value | Threshold | If violated |
|--------|-------------|-----------|-----------|
| [revenue metric] | [value] | [no decrease > X%] | Stop experiment |
| [UX metric] | [value] | [no decrease > X%] | Stop experiment |

### Step 3: Calculate Sample Size
**Inputs:**
```
Baseline conversion rate: [p1 = current %]
Minimum detectable effect: [MDE = % improvement to detect]
Expected conversion (variant): [p2 = p1 × (1 + MDE)]
Statistical significance: [alpha = 0.05 (standard)]
Statistical power: [1-beta = 0.80 (standard)]
Tails: [two-tailed (standard) or one-tailed]
```

**Sample Size Formula (per variant):**
```
n = (Z_alpha/2 + Z_beta)^2 × [p1(1-p1) + p2(1-p2)] / (p2-p1)^2

Where:
  Z_alpha/2 = 1.96 (for 95% confidence)
  Z_beta = 0.84 (for 80% power)
```

**Duration Estimate:**
```
Total sample needed: [N per variant] × [number of variants] = [N total]
Daily eligible traffic: [N users/day who enter experiment]
Estimated duration: [N total] / [daily traffic] = [N days]
Recommended minimum: 7 days (capture weekly cycle)
```

**Duration Reality Check:**
| Duration | Verdict |
|----------|---------|
| < 7 days | Too short — extend (weekly pattern effects) |
| 7-28 days | Typical — proceed |
| > 28 days | Consider: Is MDE too small? Can we narrow segment? |
| > 60 days | Likely impractical — increase MDE or find proxy metric |

### Step 4: Design Experiment
**Experiment Spec:**
```
Name: [descriptive experiment name]
ID: [tracking identifier]
Start Date: [planned]
End Date: [planned based on sample size]
Owner: ps-product-analyst (Delta)

VARIANTS:
  Control (A): [description of current experience]
  Variant (B): [description of changed experience]
  [Variant C: if testing multiple options]

TARGETING:
  Segment: [who enters the experiment]
  Exclusions: [who is excluded and why]
  Randomization: [user-level / session-level]
  Split: [50/50 or other ratio + rationale]

TRIGGERING:
  Entry event: [when user enters experiment]
  Exposure event: [when user actually sees the change]
```

### Step 5: Pre-Launch Validation
**Before Going Live:**
- [ ] A/A test run (both variants identical) shows no false signal
- [ ] Tracking events fire correctly for control and variant
- [ ] Sample ratio mismatch (SRM) check planned
- [ ] No other experiments conflicting with same users/metrics
- [ ] Rollback plan documented
- [ ] Guardrail monitoring set up
- [ ] Analysis plan written BEFORE seeing results

### Step 6: Analysis Plan (Write Before Running)
**Analysis Protocol:**
```
1. Check SRM (Sample Ratio Mismatch):
   Expected split: [50/50]
   Alert if: chi-square p < 0.01 (indicates randomization problem)

2. Primary metric analysis:
   Test: [two-proportion z-test / t-test / Mann-Whitney]
   Significance threshold: p < 0.05
   Confidence interval: 95%

3. Secondary metrics analysis:
   Apply Bonferroni correction for multiple comparisons
   Adjusted alpha = 0.05 / [number of secondary metrics]

4. Segment analysis (post-hoc):
   - By persona / user type
   - By device / platform
   - By tenure (new vs existing users)
   Note: Segment results are exploratory, not confirmatory

5. Decision framework:
   | Result | p-value | Effect | Decision |
   |--------|---------|--------|----------|
   | Significant + positive | <0.05 | >= MDE | SHIP |
   | Significant + negative | <0.05 | <= -MDE | DO NOT SHIP |
   | Not significant | >0.05 | — | INCONCLUSIVE |
   | Significant + small | <0.05 | < MDE | EVALUATE cost/benefit |
```

### Step 7: Results Documentation
**Experiment Results Card:**
```
EXPERIMENT: [name]
DURATION: [start] — [end] ([N days])
SAMPLE: Control [N] | Variant [N]
SRM CHECK: [PASS / FAIL]

PRIMARY METRIC:
  Control: [value] | Variant: [value]
  Relative change: [+/- X%]
  p-value: [X]
  Confidence interval: [lower, upper]
  VERDICT: SIGNIFICANT / NOT SIGNIFICANT

DECISION: SHIP / DO NOT SHIP / ITERATE / EXTEND
RATIONALE: [why this decision]
LEARNINGS: [what we learned regardless of outcome]
```

## Output Artifacts
- `experiment-design-[name].md` | `sample-size-calculation.md` | `experiment-results-[name].md` | `experiment-learnings.md`

## Quality Criteria
- One primary metric defined | Sample size calculated before launch | Duration includes full weekly cycle | Analysis plan written before results | SRM checked | Guardrail metrics monitored | Results documented regardless of outcome | No peeking before planned end date
