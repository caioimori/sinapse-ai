---
task: optimize-youtube-ad-creative
responsavel: "@pm-youtube-ads-specialist"
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

# Task: Optimize YouTube Ad Creative

## Metadata
- **Squad:** squad-paidmedia
- **Agent:** Tube (pm-youtube-ads-specialist)
- **Complexity:** Standard

## Objetivo
Otimizar criativos de YouTube Ads baseado em dados de performance. Analisar hook rate, hold rate, drop-off points e propor iteracoes criativas para melhorar resultados.

## Entrada
- Current YouTube ad performance data
- Video analytics (audience retention curve)
- Campaign metrics (CPV, view rate, CTR, conversions)
- Current creative assets
- Competitor creative examples (optional)

## Passos

### 1. Performance Diagnosis
| Metric | Current | Benchmark | Gap | Priority |
|--------|---------|-----------|-----|----------|
| Hook Rate (5s) | % | 40%+ | | |
| View Rate (30s) | % | 15-30% | | |
| Hold Rate (50%) | % | 15-25% | | |
| CTR | % | 0.5-2% | | |
| CPV | R$ | < R$0.10 | | |
| Conversion Rate | % | Varies | | |

### 2. Audience Retention Analysis
```
RETENTION CURVE ANALYSIS:
- 0-5s: [X]% retained → Hook effectiveness
- 5-15s: [X]% retained → Interest building
- 15-30s: [X]% retained → Value delivery
- 30s+: [X]% retained → Engagement depth

DROP-OFF POINTS:
- Major drop at [X]s → Cause: [hypothesis]
- Major drop at [X]s → Cause: [hypothesis]

COMPARISON:
- vs. account average: [better/worse]
- vs. industry benchmark: [better/worse]
```

### 3. Hook Optimization
| Current Hook | Performance | New Hook Variant | Hypothesis |
|-------------|------------|-----------------|-----------|
| [current] | [hook rate]% | Variant A: [description] | [why it should improve] |
| | | Variant B: [description] | [why it should improve] |
| | | Variant C: [description] | [why it should improve] |

### 4. Creative Iteration Plan
| Element | Current | Proposed Change | Expected Impact | Priority |
|---------|---------|----------------|----------------|----------|
| Hook (0-5s) | | | +X% hook rate | P0 |
| Body (5-30s) | | | +X% view rate | P1 |
| CTA | | | +X% CTR | P1 |
| Thumbnail | | | +X% CTR (in-feed) | P1 |
| Companion Banner | | | +X% CTR | P2 |

### 5. A/B Test Setup
| Test | Control | Variant | Budget | Duration | Win Criteria |
|------|---------|---------|--------|----------|-------------|
| Hook | Current | New hook A | R$ | 7 days | +20% hook rate |
| CTA | Current | New CTA | R$ | 7 days | +15% CTR |
| Thumbnail | Current | New thumb | R$ | 7 days | +10% CTR |

### 6. Creative Fatigue Check
```
FATIGUE SIGNALS:
- [ ] CTR declining > 20% from peak
- [ ] Frequency > 3 in 7 days
- [ ] CPV increasing without external factors
- [ ] View rate declining steadily

RECOMMENDED ACTION:
- [ ] Refresh creative (new hook, same message)
- [ ] New creative (entirely new concept)
- [ ] Rotate existing library
- [ ] Pause and relaunch after cool-down
```

## Saida
- Performance diagnosis report
- Retention curve analysis with drop-off insights
- 3 hook variants for testing
- Creative iteration plan with priorities
- A/B test setup specs
- Fatigue assessment and recommendations

## Validacao
- [ ] Performance diagnosis based on actual data
- [ ] Drop-off points identified with hypotheses
- [ ] Minimum 3 hook variants proposed
- [ ] A/B tests have clear win criteria
- [ ] Fatigue check completed
