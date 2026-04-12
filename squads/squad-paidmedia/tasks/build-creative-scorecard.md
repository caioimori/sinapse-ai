---
task: build-creative-scorecard
responsavel: "@pm-creative-performance-analyst"
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

# Task: Build Creative Scorecard

## Metadata
- **Squad:** squad-paidmedia
- **Agent:** Lens (pm-creative-performance-analyst)
- **Complexity:** Standard

## Objetivo
Projetar scorecard para avaliar criativos de ads ANTES do lancamento (pre-flight) e DURANTE a campanha (in-flight). O scorecard combina criterios qualitativos (review pre-lancamento) com dados quantitativos (metricas pos-lancamento).

## Entrada
- Brand guidelines
- Historical creative performance data
- Platform best practices
- Campaign objectives
- Target audience profiles

## Passos

### 1. Pre-Flight Scorecard (before launch)
| Dimension | Criteria | Score (1-5) | Weight |
|-----------|---------|------------|--------|
| Hook Strength | Captures attention in 3s? Pattern interrupt? | | 20% |
| Message Clarity | Core message clear without sound? In 1 sentence? | | 15% |
| Visual Quality | Professional? On-brand? Platform-native? | | 15% |
| CTA Strength | Clear, specific, compelling action? | | 15% |
| Brand Consistency | Follows guidelines? Recognizable? | | 10% |
| Audience Relevance | Speaks to target's pain/desire? | | 10% |
| Emotional Trigger | Evokes emotion? Which one? | | 10% |
| Differentiation | Different from competitors? Own voice? | | 5% |
| **WEIGHTED TOTAL** | | **/5.0** | **100%** |

```
LAUNCH DECISION:
- 4.0-5.0: Launch with confidence
- 3.0-3.9: Launch with monitoring
- 2.0-2.9: Revise before launch
- < 2.0: Do not launch
```

### 2. In-Flight Scorecard (during campaign)
| Metric | Source | Green | Yellow | Red |
|--------|--------|-------|--------|-----|
| Hook Rate (3-5s) | Platform | > 40% | 25-40% | < 25% |
| CTR | Platform | > 1.5% | 0.8-1.5% | < 0.8% |
| CPA | Platform | < Target | Target-1.5x | > 1.5x Target |
| ROAS | Platform | > 3x | 2-3x | < 2x |
| Frequency (7d) | Platform | < 2 | 2-3 | > 3 |
| Relevance/Quality | Platform | Above avg | Average | Below avg |

```
ACTION TRIGGERS:
- All Green: Scale budget +20%
- Any Yellow: Monitor, prepare variants
- Any Red: Pause, diagnose, iterate
- 2+ Red: Kill immediately
```

### 3. Competitive Benchmark
| Element | Our Creative | Competitor A | Competitor B | Industry Avg |
|---------|-------------|-------------|-------------|-------------|
| Ad format used | | | | |
| Hook style | | | | |
| CTA approach | | | | |
| Visual style | | | | |
| Message angle | | | | |

### 4. Scorecard Template (ready to use)
```
CREATIVE SCORECARD — [Creative ID]
Date: [YYYY-MM-DD]
Reviewer: [name]
Platform: [Meta / Google / YouTube / LinkedIn]
Format: [Image / Video / Carousel / Story]

PRE-FLIGHT SCORE: [X/5.0] — [Launch / Revise / Block]

IN-FLIGHT STATUS (Day [X]):
- Hook Rate: [X]% [🟢/🟡/🔴]
- CTR: [X]% [🟢/🟡/🔴]
- CPA: R$[X] [🟢/🟡/🔴]
- ROAS: [X]x [🟢/🟡/🔴]
- Frequency: [X] [🟢/🟡/🔴]

ACTION: [Scale / Monitor / Iterate / Kill]
```

### 5. Implementation Guide
| Step | Action | Owner | Timing |
|------|--------|-------|--------|
| 1 | Score all creatives pre-flight | Creative team | Before launch |
| 2 | Review scores in creative standup | Team | Weekly |
| 3 | Update in-flight scores | Analyst | 3x/week |
| 4 | Trigger actions based on thresholds | Campaign manager | As needed |
| 5 | Archive and learn | Analyst | Monthly |

## Saida
- Pre-flight scorecard template (weighted)
- In-flight scorecard with RAG thresholds
- Competitive benchmark template
- Ready-to-use scorecard template
- Implementation guide with process

## Validacao
- [ ] Pre-flight scorecard has weighted dimensions
- [ ] In-flight scorecard has clear green/yellow/red thresholds
- [ ] Launch decision criteria defined
- [ ] Action triggers documented (scale/monitor/iterate/kill)
- [ ] Template is practical (can be used immediately)
- [ ] Implementation guide defines who/when/how
