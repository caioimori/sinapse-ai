# Template: Growth Experiment Report

## Experiment Metadata
| Field | Value |
|-------|-------|
| Experiment ID | EXP-[YYYY]-[NNN] |
| Name | |
| Growth Loop/Stage | Acquisition / Activation / Retention / Revenue / Referral |
| Owner | |
| Duration | YYYY-MM-DD to YYYY-MM-DD |
| Status | Completed / Stopped Early |

## Hypothesis Recap
**If we:** [change made]
**Then:** [expected outcome]
**Because:** [reasoning]

**ICE Score:** I[_] × C[_] × E[_] = [total]

## Experiment Design
| Parameter | Value |
|-----------|-------|
| Type | A/B / A/B/n / MVT / Feature Flag |
| Variants | Control, Treatment [B, C...] |
| Traffic Split | % per variant |
| Target Audience | |
| Primary Metric | |
| Sample Size (planned) | per variant |
| MDE | % relative |
| Confidence Level | 95% |

## Results

### Primary Metric
| Variant | Users | Events | Metric Value | vs Control | p-value | CI (95%) |
|---------|-------|--------|-------------|-----------|---------|---------|
| Control | | | | — | — | — |
| Treatment B | | | | +/-% | | [low, high] |

### Secondary Metrics
| Metric | Control | Treatment | Delta | Significant? |
|--------|---------|----------|-------|-------------|
| | | | % | Yes/No |
| | | | % | |

### Guard-Rail Metrics
| Metric | Control | Treatment | Delta | Acceptable? |
|--------|---------|----------|-------|------------|
| | | | | Yes/No |

### Segment Analysis
| Segment | Control | Treatment | Delta | Significant? | Notes |
|---------|---------|----------|-------|-------------|-------|
| Mobile | | | | | |
| Desktop | | | | | |
| New Users | | | | | |
| Returning | | | | | |

## Business Impact
| Metric | Calculation | Value |
|--------|-----------|-------|
| Incremental conversions/month | (Treatment CR - Control CR) × monthly traffic | |
| Incremental revenue/month | Incremental conversions × AOV | R$ |
| Annualized impact | Monthly × 12 | R$ |
| Implementation cost | Dev time + design | R$ |
| ROI | (Annual impact - Cost) / Cost | x |

## Decision
- [ ] **SHIP IT** — Implement for 100% of users
- [ ] **ITERATE** — Promising, refine and re-test
- [ ] **KILL** — No meaningful improvement
- [ ] **INCONCLUSIVE** — Need more data or different approach

**Rationale:** [Explain decision]

## Key Learnings
1. **[Learning 1]** — What we learned and why it matters
2. **[Learning 2]** — [detail]
3. **[Learning 3]** — [detail]

## Next Steps
| # | Action | Owner | Deadline |
|---|--------|-------|----------|
| 1 | | | |
| 2 | | | |

## Follow-Up Hypotheses
| # | New Hypothesis | Derived From | ICE |
|---|---------------|-------------|-----|
| 1 | If we [change], then [metric] because [learning from this experiment] | Learning #1 | |
| 2 | | | |
