---
task: conduct-cohort-analysis
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

# Task: Conduct Cohort Analysis

## Metadata
- **Squad:** squad-growth
- **Agent:** Insight (ga-data-analyst)
- **Complexity:** Advanced

## Objetivo
Conduzir analise de cohorts — segmentar usuarios por periodo de aquisicao e rastrear comportamento ao longo do tempo para identificar padroes de retencao, engajamento e monetizacao.

## Entrada
- User event data (GA4 / data warehouse)
- User acquisition date
- Key actions/events to track
- Analysis timeframe

## Passos

### 1. Cohort Definition
| Tipo de Cohort | Base | Exemplo |
|---------------|------|---------|
| Acquisition cohort | Data do primeiro acesso | Users de Jan 2026 |
| Behavioral cohort | Acao especifica realizada | Users que fizeram onboarding completo |
| Spend cohort | Valor gasto | Users com LTV > R$500 |
| Channel cohort | Canal de aquisicao | Users de organic search |
| Feature cohort | Feature adotada | Users que usaram feature X |

### 2. Cohort Matrix Template
| Cohort | Week 0 | Week 1 | Week 2 | Week 3 | Week 4 | Week 8 | Week 12 |
|--------|--------|--------|--------|--------|--------|--------|---------|
| Jan W1 | 100% | | | | | | |
| Jan W2 | 100% | | | | | | |
| Jan W3 | 100% | | | | | | |
| Feb W1 | 100% | | | | | | |

### 3. Retention Curve Analysis
| Metrica | Formula | Benchmark |
|---------|---------|-----------|
| D1 Retention | Users day 1 / Users day 0 | 25-40% (SaaS) |
| D7 Retention | Users day 7 / Users day 0 | 15-25% |
| D30 Retention | Users day 30 / Users day 0 | 8-15% |
| D90 Retention | Users day 90 / Users day 0 | 5-10% |
| Churn Rate | 1 - Retention Rate | Varies |
| Half-Life | Days until 50% churn | Industry-specific |

### 4. SQL Query Pattern
```sql
-- Cohort retention analysis
WITH cohort_base AS (
  SELECT
    user_id,
    DATE_TRUNC('week', MIN(event_date)) AS cohort_week,
    MIN(event_date) AS first_event_date
  FROM events
  WHERE event_name = 'session_start'
  GROUP BY user_id
),
activity AS (
  SELECT
    cb.user_id,
    cb.cohort_week,
    DATE_DIFF('week', cb.first_event_date, e.event_date) AS weeks_since_acquisition
  FROM events e
  JOIN cohort_base cb ON e.user_id = cb.user_id
  WHERE e.event_name = 'session_start'
)
SELECT
  cohort_week,
  weeks_since_acquisition,
  COUNT(DISTINCT user_id) AS active_users,
  COUNT(DISTINCT user_id) * 100.0 /
    FIRST_VALUE(COUNT(DISTINCT user_id)) OVER (
      PARTITION BY cohort_week ORDER BY weeks_since_acquisition
    ) AS retention_pct
FROM activity
GROUP BY cohort_week, weeks_since_acquisition
ORDER BY cohort_week, weeks_since_acquisition;
```

### 5. Cohort Comparison Dimensions
| Dimensao | Segmentos | Insight Esperado |
|----------|----------|-----------------|
| Canal de aquisicao | Organic, Paid, Direct, Referral | Qual canal traz users mais retidos |
| Plano/Tier | Free, Basic, Pro, Enterprise | Retencao por nivel de investimento |
| Onboarding completude | 0-25%, 26-50%, 51-75%, 76-100% | Impacto do onboarding na retencao |
| Geografia | BR, US, EU, LATAM | Retencao por regiao |
| Device | Mobile, Desktop, Tablet | Retencao por plataforma |
| First action | Feature A, Feature B, Feature C | Qual acao inicial prediz retencao |

### 6. Visualization
| Chart | Dados | Uso |
|-------|-------|-----|
| Heatmap | Retention matrix colorida | Overview rapido de tendencias |
| Line chart | Retention curves sobrepostas | Comparar cohorts |
| Bar chart | Cohort size over time | Volume de aquisicao |
| Triangle chart | Classic cohort triangle | Apresentacao executiva |
| Waterfall | Churn decomposition | Diagnosticar onde users saem |

### 7. Actionable Insights Framework
| Pattern | Significado | Acao Recomendada |
|---------|-----------|-----------------|
| Curve flattening | Retention estabiliza | Investir em aquisicao (product-market fit) |
| Improving cohorts | Cohorts mais recentes retêm melhor | Identificar o que mudou, replicar |
| Declining cohorts | Cohorts recentes piorando | Investigar mudancas recentes |
| High early churn | Grande queda D1-D7 | Melhorar onboarding |
| Gradual late churn | Queda lenta apos D30 | Criar retention hooks |

## Saida
- Cohort analysis report com retention matrix
- Retention curves por segmento
- Cohort comparison insights
- Recomendacoes acionaveis
- SQL queries reutilizaveis

## Validacao
- [ ] Cohorts definidos com criterio claro
- [ ] Retention matrix calculada
- [ ] Curves visualizadas
- [ ] Segmentacao por dimensoes relevantes
- [ ] Padroes identificados e documentados
- [ ] Acoes recomendadas com base nos dados
