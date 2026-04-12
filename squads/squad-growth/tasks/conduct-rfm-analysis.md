---
task: conduct-rfm-analysis
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

# Task: Conduct RFM Analysis

## Metadata
- **Squad:** squad-growth
- **Agent:** Insight (ga-data-analyst)
- **Complexity:** Standard

## Objetivo
Conduzir analise RFM (Recency, Frequency, Monetary) — segmentar base de clientes por comportamento de compra para personalizar estrategias de marketing, retencao e growth.

## Entrada
- Transaction data (user_id, date, value)
- Minimum data: 6+ months of transactions
- Customer metadata (optional: segment, channel)

## Passos

### 1. RFM Dimensions
| Dimensao | Definicao | Calculo |
|----------|----------|---------|
| Recency (R) | Quao recente foi a ultima compra | Dias desde ultima transacao |
| Frequency (F) | Quantas vezes comprou | Total de transacoes no periodo |
| Monetary (M) | Quanto gastou | Valor total no periodo |

### 2. RFM Scoring
| Score | Recency (dias) | Frequency (qtd) | Monetary (valor) |
|-------|---------------|-----------------|-----------------|
| 5 | 0-30 | 12+ | Top 20% |
| 4 | 31-60 | 8-11 | 60-80th pctile |
| 3 | 61-90 | 5-7 | 40-60th pctile |
| 2 | 91-180 | 2-4 | 20-40th pctile |
| 1 | 181+ | 1 | Bottom 20% |

*Nota: Limites devem ser calibrados por quintis da distribuicao real.*

### 3. SQL Implementation
```sql
-- RFM Analysis
WITH rfm_raw AS (
  SELECT
    user_id,
    DATE_DIFF('day', MAX(order_date), CURRENT_DATE) AS recency_days,
    COUNT(DISTINCT order_id) AS frequency,
    SUM(order_value) AS monetary
  FROM orders
  WHERE order_date >= CURRENT_DATE - INTERVAL '12 months'
    AND status = 'completed'
  GROUP BY user_id
),
rfm_scores AS (
  SELECT
    user_id,
    recency_days,
    frequency,
    monetary,
    NTILE(5) OVER (ORDER BY recency_days DESC) AS r_score,
    NTILE(5) OVER (ORDER BY frequency ASC) AS f_score,
    NTILE(5) OVER (ORDER BY monetary ASC) AS m_score
  FROM rfm_raw
)
SELECT
  user_id,
  recency_days,
  frequency,
  monetary,
  r_score,
  f_score,
  m_score,
  CONCAT(r_score, f_score, m_score) AS rfm_segment,
  r_score + f_score + m_score AS rfm_total,
  CASE
    WHEN r_score >= 4 AND f_score >= 4 AND m_score >= 4 THEN 'Champions'
    WHEN r_score >= 4 AND f_score >= 3 THEN 'Loyal Customers'
    WHEN r_score >= 4 AND f_score <= 2 THEN 'New Customers'
    WHEN r_score >= 3 AND f_score >= 3 AND m_score >= 3 THEN 'Potential Loyalists'
    WHEN r_score >= 3 AND f_score <= 2 AND m_score <= 2 THEN 'Promising'
    WHEN r_score <= 2 AND f_score >= 4 THEN 'At Risk'
    WHEN r_score <= 2 AND f_score >= 3 AND m_score >= 3 THEN 'Need Attention'
    WHEN r_score <= 2 AND f_score <= 2 AND m_score >= 3 THEN 'About to Sleep'
    WHEN r_score <= 1 AND f_score >= 3 THEN 'Cant Lose Them'
    WHEN r_score <= 1 AND f_score <= 2 AND m_score <= 2 THEN 'Hibernating'
    WHEN r_score <= 1 AND f_score <= 1 THEN 'Lost'
    ELSE 'Others'
  END AS rfm_label
FROM rfm_scores
ORDER BY rfm_total DESC;
```

### 4. RFM Segments & Strategies
| Segmento | RFM Pattern | % Base | Estrategia |
|---------|------------|--------|-----------|
| Champions | 5-5-5, 5-4-5 | 5-10% | Reward, advocate program, early access |
| Loyal Customers | 4-4-4, 5-3-4 | 10-15% | Upsell, loyalty program, referral |
| Potential Loyalists | 4-3-3, 3-3-3 | 15-20% | Engagement campaigns, offers |
| New Customers | 5-1-1, 4-1-1 | 10-15% | Onboarding, welcome series |
| Promising | 3-1-1, 3-2-1 | 10-15% | Nurture, education content |
| Need Attention | 2-3-3, 2-2-3 | 10-15% | Limited offers, re-engagement |
| At Risk | 2-4-4, 1-4-4 | 5-10% | Win-back campaign, personal outreach |
| Can't Lose | 1-5-5, 1-4-5 | 3-5% | Urgente: personal call, special offer |
| Hibernating | 1-1-2, 1-2-1 | 10-15% | Low-cost re-engagement or sunset |
| Lost | 1-1-1 | 5-10% | Survey, final attempt or archive |

### 5. RFM Dashboard Widgets
| Widget | Visualization | Dados |
|--------|-------------|-------|
| Segment distribution | Treemap / Donut | % users por segmento |
| Migration matrix | Heatmap | Fluxo entre segmentos (periodo) |
| Revenue by segment | Stacked bar | Revenue contribution |
| Segment trends | Line chart | Tamanho de segmento ao longo do tempo |
| RFM scatter | 3D scatter / Bubble | R vs F vs M |

### 6. Segment Migration Tracking
| De → Para | Positivo | Neutro | Negativo |
|-----------|---------|--------|---------|
| New → Potential Loyalist | ✅ | | |
| Potential → Loyal | ✅ | | |
| Loyal → Champion | ✅ | | |
| Loyal → Need Attention | | | ❌ |
| At Risk → Lost | | | ❌ |
| Hibernating → Promising | ✅ | | |

## Saida
- RFM analysis report
- Customer segmentation com labels
- Strategy per segment
- Migration tracking setup
- Dashboard specification

## Validacao
- [ ] RFM scores calculados por quintis
- [ ] Segmentos nomeados e classificados
- [ ] Estrategia definida por segmento
- [ ] Revenue contribution por segmento
- [ ] Migration tracking implementado
- [ ] Dashboard com widgets essenciais
