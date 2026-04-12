---
task: calculate-ltv-projection
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

# Task: Calculate LTV Projection

## Metadata
- **Squad:** squad-growth
- **Agent:** Insight (ga-data-analyst)
- **Complexity:** Advanced

## Objetivo
Calcular e projetar Customer Lifetime Value (LTV) — estimar o valor total que um cliente gera ao longo de todo seu relacionamento, usando modelos probabilisticos e historicos para decisoes de aquisicao e retencao.

## Entrada
- Transaction/revenue data per user
- Retention/churn data
- Acquisition cost data
- Customer segmentation
- Historical data (12+ months ideal)

## Passos

### 1. LTV Calculation Methods
| Metodo | Formula | Quando Usar |
|--------|---------|-------------|
| Historic | Sum(revenue per customer) | Baseline simples |
| Average | ARPU × Avg Lifetime | Estimativa rapida |
| Cohort-based | Sum(revenue per cohort period) | Com dados de cohort |
| Predictive (BG/NBD) | Probabilistic purchase frequency | Contractual/non-contractual |
| Predictive (Pareto/NBD) | Probabilistic with dropout | Non-contractual |
| Unit Economics | (ARPU × Gross Margin) / Churn Rate | SaaS subscription |

### 2. Core Formulas
| Formula | Calculo | Notas |
|---------|---------|-------|
| Simple LTV | ARPU × Average Customer Lifespan | Rapido mas impreciso |
| SaaS LTV | (ARPU × Gross Margin%) / Monthly Churn Rate | Para modelos subscription |
| E-commerce LTV | AOV × Purchase Frequency × Avg Customer Lifespan | Para retail/e-commerce |
| Discounted LTV | Sum(Revenue_t / (1 + d)^t) for t=1 to T | Valor presente do LTV |
| LTV:CAC Ratio | LTV / CAC | Target: >= 3:1 |
| Payback Period | CAC / Monthly Margin per Customer | Target: < 12 months |

### 3. SQL Implementation
```sql
-- LTV calculation by cohort
WITH customer_metrics AS (
  SELECT
    user_id,
    DATE_TRUNC('month', MIN(purchase_date)) AS cohort_month,
    COUNT(DISTINCT order_id) AS total_orders,
    SUM(revenue) AS total_revenue,
    SUM(gross_profit) AS total_margin,
    DATE_DIFF('month', MIN(purchase_date), MAX(purchase_date)) AS lifetime_months,
    DATE_DIFF('month', MAX(purchase_date), CURRENT_DATE) AS months_since_last
  FROM orders
  WHERE status = 'completed'
  GROUP BY user_id
),
cohort_ltv AS (
  SELECT
    cohort_month,
    COUNT(DISTINCT user_id) AS customers,
    AVG(total_revenue) AS avg_ltv,
    PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY total_revenue) AS median_ltv,
    AVG(total_orders) AS avg_orders,
    AVG(lifetime_months) AS avg_lifetime_months,
    AVG(total_revenue / NULLIF(total_orders, 0)) AS avg_order_value,
    -- Segment by value tier
    COUNT(CASE WHEN total_revenue > avg_ltv * 2 THEN 1 END) AS high_value_count
  FROM customer_metrics
  GROUP BY cohort_month
)
SELECT
  cohort_month,
  customers,
  ROUND(avg_ltv, 2) AS avg_ltv,
  ROUND(median_ltv, 2) AS median_ltv,
  ROUND(avg_orders, 1) AS avg_orders,
  ROUND(avg_lifetime_months, 1) AS avg_lifetime_months,
  ROUND(avg_order_value, 2) AS aov,
  ROUND(high_value_count * 100.0 / customers, 1) AS pct_high_value
FROM cohort_ltv
ORDER BY cohort_month;
```

### 4. LTV Segmentation
| Segmento | % Usuarios | % Revenue | LTV Medio | Estrategia |
|---------|-----------|----------|----------|-----------|
| Champions | 5-10% | 30-40% | Highest | VIP program, retention |
| Loyal | 15-20% | 25-30% | High | Upsell, cross-sell |
| Potential | 20-30% | 15-20% | Medium | Activation, engagement |
| At Risk | 15-20% | 8-10% | Below avg | Win-back campaigns |
| Churned | 20-30% | 2-5% | Low | Re-engagement or let go |

### 5. LTV Projection Model
| Input | Valor | Source |
|-------|-------|--------|
| Current ARPU | R$ | Revenue / Active Users |
| Gross Margin | % | Finance data |
| Monthly Churn Rate | % | Cohort analysis |
| Monthly Discount Rate | % | Typically 10% annually |
| Expansion Revenue Rate | % | Upsell/cross-sell growth |
| Contraction Rate | % | Downgrade rate |

**Projected LTV Formula (with expansion):**
```
LTV = Sum over t=1 to T of:
  ARPU_t × Gross_Margin × Survival_t / (1 + monthly_discount)^t

Where:
  ARPU_t = ARPU_0 × (1 + expansion_rate - contraction_rate)^t
  Survival_t = (1 - churn_rate)^t
```

### 6. Benchmarks & Ratios
| Metrica | Target | Saudavel | Preocupante |
|---------|--------|---------|-------------|
| LTV:CAC | >= 3:1 | 3:1 - 5:1 | < 3:1 |
| CAC Payback | < 12 months | 6-12 months | > 18 months |
| Gross Margin | > 60% (SaaS) | 50-70% | < 40% |
| Net Revenue Retention | > 100% | 100-120% | < 90% |
| Logo Churn | < 5% monthly | 3-5% | > 7% |

### 7. Sensitivity Analysis
| Variavel | -20% | Base | +20% | Impacto no LTV |
|----------|------|------|------|---------------|
| ARPU | | | | |
| Churn Rate | | | | |
| Gross Margin | | | | |
| Expansion Revenue | | | | |

## Saida
- LTV calculation per segment
- LTV:CAC analysis
- Projection model (12-24 months)
- Sensitivity analysis
- Recommendations for LTV improvement

## Validacao
- [ ] LTV calculado com pelo menos 2 metodos
- [ ] Segmentacao por valor implementada
- [ ] LTV:CAC ratio analisado
- [ ] Payback period calculado
- [ ] Projection model com sensitivity
- [ ] Benchmarks comparados
- [ ] Acoes para melhorar LTV documentadas
