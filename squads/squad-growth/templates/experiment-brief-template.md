# Template: Experiment Brief

## Experiment ID: EXP-[YYYY]-[NNN]

### Overview
| Field | Value |
|-------|-------|
| Name | |
| Owner | |
| Status | Draft / In Review / Approved / Running / Completed |
| Created | YYYY-MM-DD |
| Start Date | YYYY-MM-DD |
| End Date | YYYY-MM-DD (estimated) |
| Page/Flow | |
| Testing Tool | Optimizely / VWO / Custom |

### Hypothesis
**Observation:** [What we see in the data]

**If we:** [Change we will make]

**Then:** [Expected result — metric + direction + magnitude]

**Because:** [Behavioral/psychological reasoning]

### Scoring
| Dimension | Score (1-10) |
|-----------|:----------:|
| Impact | |
| Confidence | |
| Ease | |
| **ICE Total** | **[I×C×E]** |

### Metrics
| Type | Metric | Current Baseline | Target |
|------|--------|-----------------|--------|
| Primary | | | |
| Secondary | | | |
| Secondary | | | |
| Guard Rail | | | Must not decrease |

### Statistical Design
| Parameter | Value |
|-----------|-------|
| Baseline Conversion Rate | % |
| Minimum Detectable Effect | % (relative) |
| Confidence Level | 95% |
| Statistical Power | 80% |
| Sample Size per Variant | |
| Estimated Duration | days |
| Traffic Split | 50/50 |

### Variants
| Variant | Description | Screenshot/Mockup |
|---------|-----------|------------------|
| Control (A) | Current experience | [link] |
| Treatment (B) | [Description of change] | [link] |

### Targeting
| Criteria | Value |
|----------|-------|
| Pages | |
| Audience | All / Segment |
| Devices | All / Mobile / Desktop |
| Geography | All / Specific |
| Exclusions | Internal IPs, bots |

### Results (post-experiment)
| Variant | Users | Conversions | Conv Rate | Uplift | p-value | Significant? |
|---------|-------|-------------|----------|--------|---------|-------------|
| Control | | | | — | — | — |
| Treatment | | | | % | | Yes/No |

### Decision
- [ ] **IMPLEMENT** — Winner found, ship to 100%
- [ ] **ITERATE** — Promising signal, refine and re-test
- [ ] **KILL** — No winner, document learnings
- [ ] **INCONCLUSIVE** — Insufficient data, extend or redesign

### Learnings
1. [Key learning 1]
2. [Key learning 2]
3. [Next hypothesis derived from this experiment]

### Approvals
| Role | Name | Date | Approved |
|------|------|------|---------|
| CRO Specialist | | | Yes/No |
| Developer | | | Yes/No |
| Stakeholder | | | Yes/No |
