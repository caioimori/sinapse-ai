---
task: monitor-pipeline-health
responsavel: "@cs-crm-specialist"
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

# Task: Monitor Pipeline Health

## Metadata
- **Squad:** squad-commercial
- **Agent:** Vault (cs-crm-specialist)
- **Complexity:** Standard

## Objetivo
Monitorar saude do pipeline continuamente — detectar anomalias, tendencias preocupantes e oportunidades de otimizacao antes que impactem o forecast.

## Entrada
- Real-time CRM data
- Historical pipeline metrics
- Stage benchmarks
- Alert thresholds

## Passos

### 1. Health Indicators
| Indicator | Formula | Healthy | Warning | Critical |
|-----------|---------|---------|---------|----------|
| Pipeline Coverage | Total Pipeline / Quota | > 4x | 3-4x | < 3x |
| Pipeline Velocity | (Opps × WR × ACV) / Cycle | Growing | Flat | Declining |
| Stage Distribution | % deals per stage | Pyramid shape | Top-heavy | Bottom-heavy |
| Deal Aging | % deals > 2x avg cycle | < 10% | 10-20% | > 20% |
| Win Rate (30d) | Won / (Won + Lost) | > 25% | 15-25% | < 15% |
| New Pipeline Created | New opps $ this period | On pace | Behind 20% | Behind 40% |
| Activity Level | Activities / deal | Above benchmark | At benchmark | Below benchmark |

### 2. Weekly Pipeline Pulse
```
PIPELINE PULSE — Week of [Date]

HEALTH: [Green / Yellow / Red]

Coverage: [X]x (target: 4x) [↑↓→]
Velocity: R$[X]/day (target: R$Y) [↑↓→]
Win Rate: [X]% (30d rolling) [↑↓→]
New Created: R$[X] (pace for R$Y target) [↑↓→]

TOP CONCERNS:
1. [Concern + data point]
2. [Concern + data point]

ACTION ITEMS:
1. [Action + owner]
2. [Action + owner]
```

### 3. Anomaly Detection
| Anomaly | Detection | Response |
|---------|----------|----------|
| Sudden coverage drop | Pipeline $ drops > 20% WoW | Investigate: lost deals? stage changes? |
| Win rate spike/drop | > 2 standard deviations | Analyze: sample quality? methodology? |
| Stage bottleneck | Time in stage > 2x average | Identify: stuck deals, common blocker |
| Activity cliff | Team activity drops > 30% | Investigate: holidays? tool issues? morale? |
| Concentration risk | Top 3 deals > 40% of pipeline | Alert: diversify pipeline sources |

### 4. Monthly Pipeline Trending
| Metric | M-3 | M-2 | M-1 | Current | Trend |
|--------|-----|-----|-----|---------|-------|
| Total Pipeline | R$ | R$ | R$ | R$ | |
| Coverage Ratio | x | x | x | x | |
| Win Rate | % | % | % | % | |
| Avg Deal Size | R$ | R$ | R$ | R$ | |
| Avg Cycle Length | d | d | d | d | |
| # New Opps | | | | | |

## Saida
- Weekly pipeline pulse report
- Anomaly alerts configured
- Monthly trending analysis
- Corrective actions documented

## Validacao
- [ ] All health indicators tracked
- [ ] Alerts configured for critical thresholds
- [ ] Weekly pulse automated
- [ ] Trending shows 3+ months of data
