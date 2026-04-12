---
task: analyze-funnel-segmented
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

# Task: Analyze Funnel Segmented

## Metadata
- **Squad:** squad-growth
- **Agent:** Insight (ga-data-analyst)
- **Complexity:** Standard

## Objetivo
Analisar funis segmentados — decompor conversion funnels por dimensoes (canal, device, regiao, cohort) para identificar onde e por que usuarios abandonam em cada segmento.

## Entrada
- Funnel definition (stages and events)
- Segmentation dimensions
- Date range
- Baseline conversion rates

## Passos

### 1. Funnel Definition
| Stage | Evento GA4 | Descricao |
|-------|-----------|----------|
| Awareness | page_view (landing) | Primeiro contato |
| Interest | scroll > 50% OR time > 30s | Engajamento inicial |
| Consideration | add_to_cart OR sign_up_start | Intent signal |
| Intent | begin_checkout OR form_start | Alta intencao |
| Conversion | purchase OR sign_up_complete | Conversao |
| Retention | return_visit (D7+) | Retorno |

### 2. Segmented Funnel Matrix
| Stage | Overall | Organic | Paid | Social | Email | Direct |
|-------|---------|---------|------|--------|-------|--------|
| Awareness | 100% | 100% | 100% | 100% | 100% | 100% |
| Interest | | | | | | |
| Consideration | | | | | | |
| Intent | | | | | | |
| Conversion | | | | | | |
| Drop-off total | | | | | | |

### 3. Drop-off Analysis
| De → Para | Rate | Top Motivo | Acao |
|-----------|------|-----------|------|
| Awareness → Interest | | Bounce alto | Melhorar landing page |
| Interest → Consideration | | Falta de CTA claro | CRO na pagina |
| Consideration → Intent | | Friction no processo | Simplificar form |
| Intent → Conversion | | Custo/trust | Otimizar checkout |

### 4. SQL Query Pattern
```sql
-- Segmented funnel analysis
WITH funnel_events AS (
  SELECT
    user_pseudo_id,
    event_name,
    event_timestamp,
    -- Segmentation dimensions
    traffic_source.medium AS channel,
    device.category AS device_type,
    geo.country AS country,
    -- Funnel stage mapping
    CASE
      WHEN event_name = 'page_view' THEN 1
      WHEN event_name IN ('scroll', 'user_engagement') THEN 2
      WHEN event_name IN ('add_to_cart', 'sign_up_start') THEN 3
      WHEN event_name IN ('begin_checkout', 'form_start') THEN 4
      WHEN event_name IN ('purchase', 'sign_up_complete') THEN 5
    END AS stage_number
  FROM `project.dataset.events_*`
  WHERE _TABLE_SUFFIX BETWEEN '20260101' AND '20260331'
    AND event_name IN (
      'page_view', 'scroll', 'user_engagement',
      'add_to_cart', 'sign_up_start',
      'begin_checkout', 'form_start',
      'purchase', 'sign_up_complete'
    )
),
user_max_stage AS (
  SELECT
    user_pseudo_id,
    channel,
    device_type,
    country,
    MAX(stage_number) AS max_stage_reached
  FROM funnel_events
  GROUP BY user_pseudo_id, channel, device_type, country
)
SELECT
  channel,
  device_type,
  COUNT(DISTINCT CASE WHEN max_stage_reached >= 1 THEN user_pseudo_id END) AS stage_1_awareness,
  COUNT(DISTINCT CASE WHEN max_stage_reached >= 2 THEN user_pseudo_id END) AS stage_2_interest,
  COUNT(DISTINCT CASE WHEN max_stage_reached >= 3 THEN user_pseudo_id END) AS stage_3_consideration,
  COUNT(DISTINCT CASE WHEN max_stage_reached >= 4 THEN user_pseudo_id END) AS stage_4_intent,
  COUNT(DISTINCT CASE WHEN max_stage_reached >= 5 THEN user_pseudo_id END) AS stage_5_conversion
FROM user_max_stage
GROUP BY channel, device_type
ORDER BY channel, device_type;
```

### 5. Key Segmentation Dimensions
| Dimensao | Segmentos | Por que Segmentar |
|----------|----------|------------------|
| Channel | organic, paid, social, email, direct | Diferentes intencoes e expectativas |
| Device | mobile, desktop, tablet | UX e friction variam |
| New vs Returning | first visit, returning | Familiaridade com o produto |
| Geography | pais, estado, cidade | Preferencias regionais |
| Landing page | homepage, product, blog, LP | Contexto de entrada |
| Time of day | morning, afternoon, evening, night | Comportamento temporal |

### 6. Statistical Comparison
| Comparacao | Metodo | Significancia |
|-----------|--------|-------------|
| Segment A vs B conversion | Chi-squared test | p < 0.05 |
| Drop-off rate difference | Z-test for proportions | p < 0.05 |
| Trend over time | Linear regression | R² > 0.7 |
| Segment contribution | Weighted average | By volume |

## Saida
- Segmented funnel analysis report
- Drop-off analysis por segmento
- Statistical comparisons
- Opportunity sizing (revenue impact)
- Prioritized recommendations

## Validacao
- [ ] Funnel stages definidos e mapeados para eventos
- [ ] Pelo menos 3 dimensoes de segmentacao analisadas
- [ ] Drop-off points identificados por segmento
- [ ] Significancia estatistica verificada
- [ ] Oportunidades quantificadas (impacto em revenue)
- [ ] Acoes priorizadas por impacto
