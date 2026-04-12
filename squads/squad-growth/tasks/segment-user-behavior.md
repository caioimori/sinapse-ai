---
task: segment-user-behavior
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

# Task: Segment User Behavior

## Metadata
- **Squad:** squad-growth
- **Agent:** Insight (ga-data-analyst)
- **Complexity:** Standard

## Objetivo
Segmentar comportamento de usuarios — criar segmentos comportamentais baseados em padroes de uso, engajamento e valor para personalizar experiencias e otimizar estrategias de growth.

## Entrada
- User event data (sessions, events, features used)
- Transaction/revenue data
- User attributes (demographics, firmographics)
- Product interaction data

## Passos

### 1. Segmentation Frameworks
| Framework | Base | Dimensoes | Melhor Para |
|-----------|------|----------|------------|
| Behavioral | Acoes no produto | Features, frequency, depth | Product teams |
| Value-based | Revenue/LTV | Spend, potential, growth | Revenue teams |
| Engagement | Nivel de uso | DAU/MAU, session depth, breadth | Retention teams |
| Lifecycle | Estagio do usuario | New, active, at-risk, churned | Marketing teams |
| Needs-based | Jobs-to-be-done | Use cases, goals | Product strategy |
| Technographic | Stack/platform | Device, browser, integrations | Engineering |

### 2. Behavioral Segmentation Dimensions
| Dimensao | Metricas | Segmentos Tipicos |
|----------|---------|------------------|
| Usage frequency | Sessions/week | Power (7+), Regular (3-6), Light (1-2), Dormant (0) |
| Feature breadth | Distinct features used | Broad (80%+), Moderate (40-79%), Narrow (< 40%) |
| Session depth | Events per session, time | Deep (15+ min), Normal (5-14), Shallow (< 5) |
| Content consumption | Pages, downloads, reads | Consumer, Browser, Skipper |
| Social behavior | Shares, invites, comments | Evangelists, Participants, Lurkers |
| Monetization | Purchases, plan tier | Premium, Standard, Free, Trial |

### 3. Engagement Scoring Model
| Acao | Peso | Exemplo |
|------|------|---------|
| Login | 1 | Cada login no periodo |
| Core feature use | 3 | Usar funcionalidade principal |
| Content creation | 5 | Criar/publicar conteudo |
| Social interaction | 2 | Comentar, compartilhar |
| Integration setup | 4 | Conectar ferramentas externas |
| Upgrade/purchase | 5 | Transacao financeira |
| Invite sent | 4 | Convidar outro usuario |
| Support contact | -1 | Ticket de suporte (friction) |

```
Engagement Score = Sum(action_weight × action_count) / days_active
```

### 4. SQL Implementation
```sql
-- Behavioral user segmentation
WITH user_behavior AS (
  SELECT
    user_id,
    -- Usage frequency
    COUNT(DISTINCT event_date) AS active_days_30d,
    COUNT(DISTINCT DATE_TRUNC('week', event_date)) AS active_weeks,
    -- Feature breadth
    COUNT(DISTINCT event_name) AS features_used,
    (SELECT COUNT(DISTINCT event_name) FROM events) AS total_features,
    -- Session depth
    COUNT(*) AS total_events,
    AVG(session_duration) AS avg_session_seconds,
    -- Value
    SUM(CASE WHEN event_name = 'purchase' THEN event_value ELSE 0 END) AS total_spend,
    -- Recency
    DATE_DIFF('day', MAX(event_date), CURRENT_DATE) AS days_since_last
  FROM events
  WHERE event_date >= CURRENT_DATE - 30
  GROUP BY user_id
),
segments AS (
  SELECT
    user_id,
    active_days_30d,
    features_used,
    total_events,
    avg_session_seconds,
    total_spend,
    days_since_last,
    -- Frequency segment
    CASE
      WHEN active_days_30d >= 20 THEN 'Power User'
      WHEN active_days_30d >= 10 THEN 'Regular'
      WHEN active_days_30d >= 3 THEN 'Light'
      ELSE 'Dormant'
    END AS frequency_segment,
    -- Feature breadth segment
    CASE
      WHEN features_used::FLOAT / total_features >= 0.8 THEN 'Explorer'
      WHEN features_used::FLOAT / total_features >= 0.4 THEN 'Focused'
      ELSE 'Single-Feature'
    END AS breadth_segment,
    -- Value segment
    CASE
      WHEN total_spend >= PERCENTILE_CONT(0.9) WITHIN GROUP (ORDER BY total_spend) OVER () THEN 'High Value'
      WHEN total_spend >= PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY total_spend) OVER () THEN 'Mid Value'
      WHEN total_spend > 0 THEN 'Low Value'
      ELSE 'Non-Paying'
    END AS value_segment
  FROM user_behavior
)
SELECT * FROM segments;
```

### 5. Segment Personas
| Persona | Freq | Breadth | Value | % Base | Strategy |
|---------|------|---------|-------|--------|----------|
| Power Champions | Power | Explorer | High | 5% | Advocate program, beta access |
| Engaged Regulars | Regular | Focused | Mid | 20% | Feature education, upsell |
| Casual Users | Light | Single | Low | 30% | Activation campaigns |
| High-Value Narrow | Regular | Single | High | 10% | Feature discovery |
| At-Risk Power | Dormant | Explorer | High | 5% | Urgente win-back |
| Free Explorers | Light | Explorer | Non | 15% | Conversion offers |
| Dormant | Dormant | Single | Non | 15% | Re-engagement or sunset |

### 6. Segmentation Activation
| Canal | Uso | Ferramenta |
|-------|-----|-----------|
| Email | Campaigns segmentadas por behavior | ESP (Mailchimp, Brevo) |
| In-app | Mensagens contextuais por segmento | Product tours (Appcues, Userflow) |
| Ads | Custom audiences por segmento | Meta, Google Ads |
| Support | Prioridade por valor | CRM (HubSpot, Zendesk) |
| Product | Feature gating por segmento | Feature flags (LaunchDarkly) |

## Saida
- Behavioral segmentation model
- Segment definitions com criterios
- User distribution por segmento
- Strategy per segment
- Activation plan por canal

## Validacao
- [ ] Framework de segmentacao definido
- [ ] Scoring model calibrado
- [ ] Segmentos mutuamente exclusivos
- [ ] Distribuicao validada (nenhum segmento > 40%)
- [ ] Estrategia por segmento documentada
- [ ] Ativacao em pelo menos 2 canais planejada
