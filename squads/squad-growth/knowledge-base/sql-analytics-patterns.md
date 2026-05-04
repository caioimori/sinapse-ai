# Knowledge Base: SQL Analytics Patterns

## Common Analytics Queries

### 1. Cohort Retention
```sql
WITH first_activity AS (
  SELECT
    user_id,
    DATE_TRUNC('month', MIN(event_date)) AS cohort_month
  FROM events
  GROUP BY user_id
),
monthly_activity AS (
  SELECT DISTINCT
    user_id,
    DATE_TRUNC('month', event_date) AS activity_month
  FROM events
)
SELECT
  f.cohort_month,
  DATE_DIFF('month', f.cohort_month, m.activity_month) AS months_since,
  COUNT(DISTINCT m.user_id) AS active_users,
  COUNT(DISTINCT m.user_id) * 100.0 /
    MAX(COUNT(DISTINCT m.user_id)) OVER (PARTITION BY f.cohort_month) AS retention_pct
FROM first_activity f
JOIN monthly_activity m ON f.user_id = m.user_id
GROUP BY f.cohort_month, months_since
ORDER BY f.cohort_month, months_since;
```

### 2. Funnel Analysis
```sql
WITH funnel AS (
  SELECT
    user_id,
    MAX(CASE WHEN event_name = 'page_view' THEN 1 ELSE 0 END) AS step_1_view,
    MAX(CASE WHEN event_name = 'add_to_cart' THEN 1 ELSE 0 END) AS step_2_atc,
    MAX(CASE WHEN event_name = 'begin_checkout' THEN 1 ELSE 0 END) AS step_3_checkout,
    MAX(CASE WHEN event_name = 'purchase' THEN 1 ELSE 0 END) AS step_4_purchase
  FROM events
  WHERE event_date BETWEEN '2026-01-01' AND '2026-03-31'
  GROUP BY user_id
)
SELECT
  COUNT(*) AS total_users,
  SUM(step_1_view) AS viewed,
  SUM(step_2_atc) AS added_to_cart,
  SUM(step_3_checkout) AS started_checkout,
  SUM(step_4_purchase) AS purchased,
  ROUND(SUM(step_2_atc) * 100.0 / NULLIF(SUM(step_1_view), 0), 1) AS view_to_atc_pct,
  ROUND(SUM(step_3_checkout) * 100.0 / NULLIF(SUM(step_2_atc), 0), 1) AS atc_to_checkout_pct,
  ROUND(SUM(step_4_purchase) * 100.0 / NULLIF(SUM(step_3_checkout), 0), 1) AS checkout_to_purchase_pct,
  ROUND(SUM(step_4_purchase) * 100.0 / NULLIF(SUM(step_1_view), 0), 1) AS overall_cvr
FROM funnel;
```

### 3. RFM Segmentation
```sql
WITH rfm AS (
  SELECT
    user_id,
    DATE_DIFF('day', MAX(order_date), CURRENT_DATE) AS recency,
    COUNT(DISTINCT order_id) AS frequency,
    SUM(revenue) AS monetary
  FROM orders
  WHERE order_date >= CURRENT_DATE - INTERVAL '12 months'
  GROUP BY user_id
),
scored AS (
  SELECT *,
    NTILE(5) OVER (ORDER BY recency DESC) AS r,
    NTILE(5) OVER (ORDER BY frequency) AS f,
    NTILE(5) OVER (ORDER BY monetary) AS m
  FROM rfm
)
SELECT *,
  CASE
    WHEN r >= 4 AND f >= 4 THEN 'Champions'
    WHEN r >= 4 AND f >= 2 THEN 'Loyal'
    WHEN r >= 3 AND f <= 2 THEN 'Promising'
    WHEN r <= 2 AND f >= 4 THEN 'At Risk'
    WHEN r <= 1 AND f <= 1 THEN 'Lost'
    ELSE 'Others'
  END AS segment
FROM scored;
```

### 4. Moving Averages
```sql
SELECT
  event_date,
  daily_revenue,
  AVG(daily_revenue) OVER (
    ORDER BY event_date
    ROWS BETWEEN 6 PRECEDING AND CURRENT ROW
  ) AS revenue_7d_ma,
  AVG(daily_revenue) OVER (
    ORDER BY event_date
    ROWS BETWEEN 29 PRECEDING AND CURRENT ROW
  ) AS revenue_30d_ma
FROM daily_metrics
ORDER BY event_date;
```

### 5. Year-over-Year Comparison
```sql
SELECT
  current.month,
  current.revenue AS current_year,
  prior.revenue AS prior_year,
  ROUND((current.revenue - prior.revenue) * 100.0 /
    NULLIF(prior.revenue, 0), 1) AS yoy_growth_pct
FROM (
  SELECT DATE_TRUNC('month', order_date) AS month, SUM(revenue) AS revenue
  FROM orders WHERE EXTRACT(YEAR FROM order_date) = 2026
  GROUP BY 1
) current
LEFT JOIN (
  SELECT DATE_TRUNC('month', order_date) + INTERVAL '1 year' AS month, SUM(revenue) AS revenue
  FROM orders WHERE EXTRACT(YEAR FROM order_date) = 2025
  GROUP BY 1
) prior ON current.month = prior.month
ORDER BY current.month;
```

### 6. Session Attribution
```sql
WITH sessions AS (
  SELECT
    session_id,
    user_id,
    MIN(event_timestamp) AS session_start,
    MAX(event_timestamp) AS session_end,
    FIRST_VALUE(source) OVER (PARTITION BY session_id ORDER BY event_timestamp) AS source,
    FIRST_VALUE(medium) OVER (PARTITION BY session_id ORDER BY event_timestamp) AS medium,
    FIRST_VALUE(campaign) OVER (PARTITION BY session_id ORDER BY event_timestamp) AS campaign,
    MAX(CASE WHEN event_name = 'purchase' THEN 1 ELSE 0 END) AS converted,
    SUM(CASE WHEN event_name = 'purchase' THEN revenue ELSE 0 END) AS revenue
  FROM events
  GROUP BY session_id, user_id
)
SELECT
  source,
  medium,
  COUNT(DISTINCT session_id) AS sessions,
  COUNT(DISTINCT user_id) AS users,
  SUM(converted) AS conversions,
  SUM(revenue) AS total_revenue,
  ROUND(SUM(converted) * 100.0 / COUNT(DISTINCT session_id), 2) AS cvr
FROM sessions
GROUP BY source, medium
ORDER BY total_revenue DESC;
```

### 7. Percentile Analysis
```sql
SELECT
  PERCENTILE_CONT(0.10) WITHIN GROUP (ORDER BY order_value) AS p10,
  PERCENTILE_CONT(0.25) WITHIN GROUP (ORDER BY order_value) AS p25,
  PERCENTILE_CONT(0.50) WITHIN GROUP (ORDER BY order_value) AS median,
  PERCENTILE_CONT(0.75) WITHIN GROUP (ORDER BY order_value) AS p75,
  PERCENTILE_CONT(0.90) WITHIN GROUP (ORDER BY order_value) AS p90,
  PERCENTILE_CONT(0.95) WITHIN GROUP (ORDER BY order_value) AS p95,
  AVG(order_value) AS mean
FROM orders
WHERE order_date >= CURRENT_DATE - 90;
```

## dbt Model Patterns

### Three-Layer Architecture
```
raw (sources)          → staging (cleaned)      → marts (business logic)
  raw.ga4_events         stg_ga4__events          fct_sessions
  raw.orders             stg_shop__orders          fct_orders
  raw.users              stg_app__users            dim_users
                                                   dim_products
                                                   rpt_daily_revenue
```

### dbt Naming Conventions
| Layer | Prefix | Example |
|-------|--------|---------|
| Staging | stg_ | stg_ga4__events |
| Intermediate | int_ | int_sessions__pivoted |
| Fact | fct_ | fct_orders |
| Dimension | dim_ | dim_users |
| Report | rpt_ | rpt_daily_revenue |
| Metric | mtc_ | mtc_revenue |

### dbt Test Patterns
```yaml
# schema.yml
models:
  - name: fct_orders
    columns:
      - name: order_id
        tests:
          - unique
          - not_null
      - name: user_id
        tests:
          - not_null
          - relationships:
              to: ref('dim_users')
              field: user_id
      - name: revenue
        tests:
          - not_null
          - dbt_utils.accepted_range:
              min_value: 0
              max_value: 100000
```

## Window Function Reference
| Function | Use Case | Example |
|----------|---------|---------|
| ROW_NUMBER | Ranking, deduplication | First event per session |
| RANK/DENSE_RANK | Ranking with ties | Top products by revenue |
| LAG/LEAD | Previous/next row comparison | MoM change |
| FIRST_VALUE/LAST_VALUE | First/last in window | Entry/exit page |
| SUM() OVER | Running total | Cumulative revenue |
| AVG() OVER | Moving average | 7-day rolling average |
| NTILE | Percentile bucketing | RFM scoring |
| PERCENT_RANK | Relative ranking | Top X% of users |

## Advanced Analytics Queries

### 8. Cohort Analysis
```sql
-- Weekly signup cohorts with retention
SELECT
  DATE_TRUNC('week', u.created_at) AS cohort_week,
  FLOOR(EXTRACT(EPOCH FROM e.event_date - u.created_at) / 86400 / 7) AS weeks_since_signup,
  COUNT(DISTINCT e.user_id)::float / COUNT(DISTINCT u.user_id) AS retention_rate
FROM users u
LEFT JOIN events e ON u.id = e.user_id
GROUP BY 1, 2
ORDER BY 1, 2;
```

### 9. Funnel Analysis
```sql
-- Multi-step funnel with drop-off
WITH steps AS (
  SELECT user_id,
    MAX(CASE WHEN event = 'page_view' THEN 1 END) AS step1,
    MAX(CASE WHEN event = 'add_to_cart' THEN 1 END) AS step2,
    MAX(CASE WHEN event = 'checkout' THEN 1 END) AS step3,
    MAX(CASE WHEN event = 'purchase' THEN 1 END) AS step4
  FROM events WHERE event_date >= CURRENT_DATE - 30
  GROUP BY 1
)
SELECT
  COUNT(*) AS total_users,
  SUM(step1) AS page_view, SUM(step2) AS add_to_cart,
  SUM(step3) AS checkout, SUM(step4) AS purchase,
  ROUND(SUM(step2)::numeric / NULLIF(SUM(step1), 0) * 100, 1) AS step1_to_2_pct
FROM steps;
```

### 10. LTV Calculation
```sql
-- Historical LTV by acquisition channel
SELECT
  u.acquisition_channel,
  DATE_TRUNC('month', u.created_at) AS cohort_month,
  COUNT(DISTINCT u.id) AS users,
  SUM(p.amount) / COUNT(DISTINCT u.id) AS ltv_per_user,
  SUM(p.amount) / NULLIF(SUM(u.acquisition_cost), 0) AS ltv_cac_ratio
FROM users u
LEFT JOIN payments p ON u.id = p.user_id
GROUP BY 1, 2;
```

### 11. Churn Analysis
```sql
-- Monthly churn rate by segment
WITH active AS (
  SELECT user_id, DATE_TRUNC('month', event_date) AS month
  FROM events GROUP BY 1, 2
)
SELECT a.month, u.segment,
  COUNT(DISTINCT a.user_id) AS active_users,
  COUNT(DISTINCT CASE WHEN b.user_id IS NULL THEN a.user_id END) AS churned,
  ROUND(COUNT(DISTINCT CASE WHEN b.user_id IS NULL THEN a.user_id END)::numeric
    / COUNT(DISTINCT a.user_id) * 100, 1) AS churn_rate
FROM active a
JOIN users u ON a.user_id = u.id
LEFT JOIN active b ON a.user_id = b.user_id AND b.month = a.month + INTERVAL '1 month'
GROUP BY 1, 2;
```
