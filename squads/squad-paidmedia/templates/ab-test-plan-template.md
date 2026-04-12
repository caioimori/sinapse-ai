# A/B Test Plan

## Test ID: [TEST-YYYY-MM-###]
- **Date Created:** [YYYY-MM-DD]
- **Agent:** [agent name]
- **Platform:** [Meta / Google / Landing Page]
- **Status:** [Planning / Running / Completed / Cancelled]

---

## Hypothesis
**IF** [mudamos X (variavel especifica)]
**THEN** [metrica Y muda em Z% (direcao e magnitude)]
**BECAUSE** [racional baseado em dados ou heuristica]

---

## Test Design

### Variable Being Tested
- **Variable:** [hook / headline / CTA / image / format / form field / page layout]
- **Level:** [Concept / Hook / Format / Messaging / CTA]

### Variants
| Variant | Description | Visual/Copy |
|---------|------------|-------------|
| Control (A) | [current winner] | [descricao ou screenshot] |
| Variant (B) | [mudanca isolada] | [descricao ou screenshot] |

### What is NOT changing (held constant)
- Audience: [mesma]
- Budget: [mesmo]
- Landing page: [mesma]
- Other ads: [mesmos]

---

## Statistical Parameters

| Parameter | Value |
|-----------|-------|
| Baseline conversion rate (p1) | [X%] |
| Minimum Detectable Effect (MDE) | [X%] |
| Expected conversion rate (p2) | [X%] |
| Confidence level | 95% (α = 0.05) |
| Statistical power | 80% (β = 0.20) |
| **Required sample size per variant** | **[X]** |
| **Total sample required** | **[X]** |
| Estimated daily traffic | [X] |
| **Estimated test duration** | **[X] days** |

---

## Metrics

### Primary Metric
- [CTR / CVR / CPA / ROAS — a metrica que define o winner]

### Secondary Metrics
- [metrica 2]
- [metrica 3]

### Guardrail Metrics
- [metrica que NAO pode piorar — ex: CPA nao pode subir >10%]

---

## Execution

### Setup
- [ ] Control configurado e ativo
- [ ] Variant configurado e ativo
- [ ] Traffic split: 50/50
- [ ] Tracking validado em ambas variantes
- [ ] Start date: [YYYY-MM-DD]
- [ ] Min end date: [YYYY-MM-DD]

### Monitoring Schedule
- Day 1: verificar delivery (ambos recebendo impressions?)
- Day 3: verificar pacing (budget sendo gasto?)
- Day 7: mid-test check (sample size progress)
- Day [X]: end of test (sample size atingido)

---

## Results

### Raw Data
| Metric | Control (A) | Variant (B) | Difference | % Change |
|--------|-------------|-------------|-----------|----------|
| Impressions | | | | |
| Clicks | | | | |
| CTR | | | | |
| Conversions | | | | |
| CVR | | | | |
| CPA | | | | |
| ROAS | | | | |

### Statistical Analysis
| Parameter | Value |
|-----------|-------|
| P-value | [X] |
| Confidence interval | [X% to X%] |
| Statistically significant? | [Yes / No] |
| Practical significance? | [Yes / No] |

### Segmentation
| Segment | Control CVR | Variant CVR | Significant? |
|---------|-------------|-------------|-------------|
| Mobile | | | |
| Desktop | | | |
| New users | | | |
| Returning | | | |

---

## Decision
- [ ] **Winner: [Control / Variant]** — implementar permanentemente
- [ ] **Inconclusive** — re-testar com [maior budget / mais tempo / variacao maior]
- [ ] **No winner** — documentar learning, testar nova hipotese

## Learning
[O que aprendemos com este teste? Que insight aplicar em futuros criativos/paginas?]

## Next Steps
1. [acao 1]
2. [acao 2]
