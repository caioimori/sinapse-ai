---
task: model-multi-touch-attribution
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

# Task: Model Multi-Touch Attribution

## Metadata
- **Squad:** squad-growth
- **Agent:** Insight (ga-data-analyst)
- **Complexity:** Advanced

## Objetivo
Modelar atribuicao multi-touch — distribuir credito de conversao entre todos os touchpoints da jornada do usuario para entender o verdadeiro impacto de cada canal e campanha.

## Entrada
- User journey data (all touchpoints)
- Conversion events
- Channel/campaign metadata
- Lookback window definition

## Passos

### 1. Attribution Models Overview
| Modelo | Distribuicao de Credito | Quando Usar |
|--------|----------------------|-------------|
| Last Click | 100% ultimo touchpoint | Baseline simples |
| First Click | 100% primeiro touchpoint | Entender discovery |
| Linear | Igual entre todos | Jornadas curtas |
| Time Decay | Mais peso para recentes | Ciclos longos |
| Position-Based (U-shape) | 40/20/40 (first/middle/last) | B2B com jornada media |
| Data-Driven | Algoritmico (Shapley/Markov) | Volume alto, precisao maxima |

### 2. Data-Driven Attribution Methods
| Metodo | Abordagem | Requisitos |
|--------|----------|-----------|
| Shapley Value | Teoria dos jogos — contribuicao marginal | Volume moderado |
| Markov Chains | Probabilidade de transicao entre estados | Volume alto |
| Logistic Regression | Modelo preditivo de conversao | Feature engineering |
| LSTM/Sequence Models | Deep learning em sequencias | Grande volume + ML infra |

### 3. Shapley Value Implementation
```sql
-- Simplified Shapley Value calculation
-- Step 1: Get all conversion paths
WITH paths AS (
  SELECT
    user_id,
    STRING_AGG(channel, ' > ' ORDER BY touchpoint_time) AS path,
    ARRAY_AGG(DISTINCT channel ORDER BY touchpoint_time) AS channels,
    MAX(CASE WHEN converted = 1 THEN 1 ELSE 0 END) AS converted,
    MAX(conversion_value) AS value
  FROM touchpoints
  GROUP BY user_id
),
-- Step 2: Count conversions per channel combination
coalitions AS (
  SELECT
    channels,
    COUNT(*) AS total_paths,
    SUM(converted) AS conversions,
    SUM(value) AS total_value,
    AVG(converted) AS conversion_rate
  FROM paths
  GROUP BY channels
)
-- Step 3: Marginal contribution per channel
-- (Full Shapley requires iterating all subsets —
--  use Python/dbt for complete implementation)
SELECT * FROM coalitions ORDER BY conversion_rate DESC;
```

### 4. Markov Chain Model
| Componente | Descricao |
|-----------|----------|
| States | Canais/touchpoints + Start + Conversion + Null |
| Transition Matrix | Probabilidade de ir de estado A para B |
| Removal Effect | Impacto de remover um canal (conversoes perdidas) |
| Attribution | Proporcional ao removal effect de cada canal |

### 5. Attribution Report Template
| Canal | Last Click | First Click | Linear | Time Decay | Data-Driven | Delta vs Last Click |
|-------|-----------|------------|--------|-----------|-------------|-------------------|
| Organic Search | | | | | | |
| Paid Search | | | | | | |
| Social Paid | | | | | | |
| Email | | | | | | |
| Direct | | | | | | |
| Referral | | | | | | |

### 6. Cross-Device & Cross-Channel Considerations
| Desafio | Solucao |
|---------|---------|
| Cross-device journeys | User ID matching, Google Signals |
| Offline touchpoints | CRM integration, call tracking |
| View-through conversions | Impression tracking com window |
| Walled gardens (Meta, Google) | API de conversoes, server-side |
| Cookie deprecation | First-party data, consent-based |
| Attribution window | 30-day click, 1-day view (padrao) |

### 7. Validation Framework
| Teste | Metodo | Criterio |
|-------|--------|---------|
| Incrementality test | Geo-based holdout | Lift > 0 com significancia |
| A/B attribution | Split traffic, compare models | Consistent with business logic |
| Budget reallocation | Follow model recs, measure result | ROI improvement |
| Cross-validation | Train/test split | Model accuracy > baseline |

## Saida
- Attribution model comparison report
- Data-driven attribution scores per channel
- Channel efficiency analysis
- Budget reallocation recommendations
- SQL/Python queries reutilizaveis

## Validacao
- [ ] Pelo menos 3 modelos comparados
- [ ] Data-driven model implementado
- [ ] Cross-device considerations documentados
- [ ] Incrementality validation planejada
- [ ] Budget recommendations com ROI estimado
- [ ] Report entregue com visualizacoes
