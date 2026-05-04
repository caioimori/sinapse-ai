---
task: analyze-retention-churn
responsavel: "@ga-data-analyst"
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

# Task: Analyze Retention & Churn

## Metadata
- **Squad:** squad-growth
- **Agent:** Insight (ga-data-analyst)
- **Complexity:** Advanced

## Objetivo
Analisar retencao e churn — diagnosticar padroes de retencao, identificar leading indicators de churn e construir framework preditivo para intervencao proativa.

## Entrada
- User activity data (sessions, events, transactions)
- Subscription/account data
- Support ticket data
- Feature usage data

## Passos

### 1. Retention Metrics Framework
| Metrica | Formula | Tipo |
|---------|---------|------|
| Gross Retention | (Start - Churned) / Start × 100 | Logo retention |
| Net Retention | (Start - Churned + Expanded) / Start × 100 | Revenue retention |
| DAU/MAU Ratio | Daily Active / Monthly Active | Stickiness |
| WAU/MAU Ratio | Weekly Active / Monthly Active | Engagement frequency |
| Resurrection Rate | Reactivated / Total Churned × 100 | Win-back success |
| Time to Value | Days from signup to "aha moment" | Activation speed |

### 2. Churn Types & Detection
| Tipo | Definicao | Detection Signal | Window |
|------|----------|-----------------|--------|
| Voluntary churn | User cancela ativamente | Cancel event | Immediate |
| Involuntary churn | Falha de pagamento | Payment failed | 3-7 days grace |
| Silent churn | User para de usar | No activity | 30-60 days |
| Downgrade churn | Reduz plano/spend | Plan change | Immediate |
| Competitive churn | Migra para concorrente | Survey/exit interview | Post-churn |

### 3. Churn Prediction Signals
| Signal | Tipo | Peso | Threshold |
|--------|------|------|----------|
| Login frequency decrease | Behavioral | Alto | -50% vs 30d avg |
| Feature usage decline | Behavioral | Alto | -40% weekly |
| Support tickets increase | Service | Medio | > 3 in 30 days |
| NPS/CSAT drop | Sentiment | Alto | NPS < 6 |
| Payment failure | Financial | Alto | > 1 failed |
| Contract approaching end | Temporal | Medio | < 30 days |
| Key user departure | Organizational | Alto | Admin/power user left |
| Competitor page visits | Intent | Alto | Pricing/competitor pages |

### 4. SQL — Churn Risk Scoring
```sql
-- Churn risk score calculation
WITH user_activity AS (
  SELECT
    user_id,
    -- Activity recency
    DATE_DIFF('day', MAX(event_date), CURRENT_DATE) AS days_since_last_activity,
    -- Activity frequency (last 30 days vs prior 30 days)
    COUNT(CASE WHEN event_date >= CURRENT_DATE - 30 THEN 1 END) AS events_last_30d,
    COUNT(CASE WHEN event_date BETWEEN CURRENT_DATE - 60 AND CURRENT_DATE - 31 THEN 1 END) AS events_prior_30d,
    -- Feature breadth
    COUNT(DISTINCT CASE WHEN event_date >= CURRENT_DATE - 30 THEN event_name END) AS features_used_30d,
    -- Session depth
    AVG(CASE WHEN event_date >= CURRENT_DATE - 30 THEN session_duration END) AS avg_session_duration_30d
  FROM events
  GROUP BY user_id
),
risk_scores AS (
  SELECT
    user_id,
    days_since_last_activity,
    events_last_30d,
    events_prior_30d,
    -- Recency score (0-100, higher = more risk)
    LEAST(100, days_since_last_activity * 3) AS recency_risk,
    -- Frequency decline score
    CASE
      WHEN events_prior_30d = 0 THEN 50
      ELSE LEAST(100, GREATEST(0,
        (1 - events_last_30d::FLOAT / events_prior_30d) * 100
      ))
    END AS frequency_decline_risk,
    -- Feature breadth score
    CASE
      WHEN features_used_30d >= 5 THEN 0
      WHEN features_used_30d >= 3 THEN 30
      WHEN features_used_30d >= 1 THEN 60
      ELSE 100
    END AS feature_breadth_risk
  FROM user_activity
)
SELECT
  user_id,
  ROUND((recency_risk * 0.4 + frequency_decline_risk * 0.4 + feature_breadth_risk * 0.2), 1) AS churn_risk_score,
  CASE
    WHEN churn_risk_score >= 75 THEN 'Critical'
    WHEN churn_risk_score >= 50 THEN 'High'
    WHEN churn_risk_score >= 25 THEN 'Medium'
    ELSE 'Low'
  END AS risk_tier
FROM risk_scores
ORDER BY churn_risk_score DESC;
```

### 5. Retention Improvement Levers
| Lever | Impacto | Custo | Timeframe |
|-------|--------|-------|----------|
| Onboarding optimization | Alto | Medio | 1-2 months |
| Proactive outreach (at-risk) | Alto | Baixo | Immediate |
| Feature education emails | Medio | Baixo | 2-4 weeks |
| Loyalty/rewards program | Alto | Alto | 2-3 months |
| Product improvements (top requests) | Alto | Alto | 1-3 months |
| Customer success touchpoints | Alto | Medio | Ongoing |
| Payment recovery automation | Medio | Baixo | 1-2 weeks |
| Win-back campaigns | Medio | Baixo | 2-4 weeks |

### 6. Churn Post-Mortem
| Dimensao | Analise |
|----------|--------|
| When | Em qual ponto do lifecycle churnam mais? |
| Who | Quais segmentos churnam mais? |
| Why | Motivos declarados (survey) vs comportamentais |
| What | Ultima acao antes do churn |
| Where | Em qual feature/pagina a jornada termina |
| How much | Revenue impact per churn segment |

## Saida
- Retention analysis report
- Churn risk scoring model
- Leading indicators identificados
- Retention improvement roadmap
- Win-back strategy

## Validacao
- [ ] Retention metrics calculados (gross e net)
- [ ] Churn types definidos e quantificados
- [ ] Churn risk score implementado
- [ ] Leading indicators validados
- [ ] Retention levers priorizados por impacto
- [ ] Win-back strategy definida
