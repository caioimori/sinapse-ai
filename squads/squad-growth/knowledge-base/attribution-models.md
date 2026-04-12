# Knowledge Base: Attribution Models

## Attribution Model Comparison

### Rule-Based Models
| Model | Credit Distribution | Strengths | Weaknesses |
|-------|-------------------|-----------|-----------|
| Last Click | 100% to last touchpoint | Simple, easy to implement | Ignores discovery channels |
| First Click | 100% to first touchpoint | Values awareness | Ignores conversion drivers |
| Linear | Equal across all touchpoints | Fair distribution | No prioritization |
| Time Decay | More to recent touchpoints | Values recency | May undervalue awareness |
| Position-Based | 40% first, 40% last, 20% middle | Balanced | Arbitrary weights |

### Algorithmic Models
| Model | Approach | Requirements | Accuracy |
|-------|---------|-------------|---------|
| Data-Driven (GA4) | Google's ML algorithm | 300+ conversions/month | High |
| Shapley Value | Game theory — marginal contribution | Moderate data | Very High |
| Markov Chains | Transition probabilities | Large dataset | Very High |
| Logistic Regression | Predictive modeling | Feature engineering | High |

## Shapley Value Attribution

### Concept
Each channel's contribution = average marginal contribution across all possible coalitions.

### Steps
1. List all possible subsets (coalitions) of channels
2. For each subset, calculate conversion probability
3. For each channel, calculate marginal contribution to every subset
4. Average marginal contributions = Shapley value

### Example (3 channels: A, B, C)
```
Coalitions and conversion rates:
  {} = 0%
  {A} = 5%
  {B} = 3%
  {C} = 2%
  {A,B} = 12%
  {A,C} = 9%
  {B,C} = 7%
  {A,B,C} = 18%

Channel A's marginal contributions:
  {} → {A}: 5% - 0% = 5%
  {B} → {A,B}: 12% - 3% = 9%
  {C} → {A,C}: 9% - 2% = 7%
  {B,C} → {A,B,C}: 18% - 7% = 11%

Shapley(A) = average = (5 + 9 + 7 + 11) / 4 = 8%
```

## Markov Chain Attribution

### Concept
Model user journeys as state transitions. Attribution = removal effect (how many conversions lost if channel removed).

### States
- Start (entry point)
- Channel states (each touchpoint)
- Conversion (success)
- Null (dropout)

### Transition Matrix
```
From\To   | Start | Google | Meta | Email | Conv | Null
----------|-------|--------|------|-------|------|-----
Start     | 0     | 0.40   | 0.35 | 0.15  | 0    | 0.10
Google    | 0     | 0.10   | 0.20 | 0.15  | 0.30 | 0.25
Meta      | 0     | 0.25   | 0.05 | 0.20  | 0.20 | 0.30
Email     | 0     | 0.10   | 0.10 | 0.05  | 0.50 | 0.25
```

### Removal Effect
1. Remove channel X (set all transitions to Null)
2. Recalculate total conversion probability
3. Removal effect = Original CR - CR without X
4. Attribution = Removal Effect(X) / Sum(All Removal Effects)

## GA4 Attribution Settings

### Configuration
| Setting | Options | Recommended |
|---------|---------|-------------|
| Reporting attribution | Data-driven (default) | Data-driven |
| Lookback window | 30/60/90 days | 90 days |
| Acquisition conversion events | First user source | First user |
| Other conversion events | Last click or data-driven | Data-driven |

### GA4 Data-Driven Attribution
- Uses Google's ML to analyze conversion paths
- Requires 300+ conversions and 3,000+ ad interactions per month
- Considers: path position, time between touchpoints, device, number of touchpoints
- Falls back to last click if insufficient data

## Cross-Device Attribution

### Challenges
| Challenge | Solution |
|-----------|---------|
| User on phone → converts on desktop | User ID matching (logged-in) |
| Multiple devices, no login | Google Signals, probabilistic matching |
| Privacy restrictions (iOS) | Server-side tracking, first-party data |
| Walled gardens | Platform-specific attribution APIs |

### User ID Implementation
```javascript
// GA4: Set user_id when user logs in
gtag('set', { user_id: 'USER_12345' });

// Also set as user property
gtag('set', 'user_properties', {
  user_id: 'USER_12345',
  user_type: 'paid'
});
```

## Incrementality Testing

### Methods
| Method | Description | Accuracy | Cost |
|--------|-----------|---------|------|
| Geo-based holdout | Stop ads in some regions, compare | High | Medium |
| Ghost ads | Show control group a blank/PSA | Very High | High |
| Budget on/off test | Turn channel on/off, measure impact | Medium | Medium |
| Matched market test | Compare similar markets | High | Medium |

### Incrementality Formula
```
Lift = (Test Group CR - Control Group CR) / Control Group CR × 100

Incremental conversions = Total conversions × (1 - (Control CR / Test CR))

iROAS = Incremental Revenue / Ad Spend
```

## Attribution Windows
| Platform | Default Click | Default View | Customizable |
|----------|-------------|-------------|-------------|
| GA4 | 30 days | 1 day (engaged) | Yes (30/60/90) |
| Google Ads | 30 days | 1 day | Yes |
| Meta Ads | 7 days | 1 day | Yes (1/7/28 click, 1 view) |
| LinkedIn | 30 days | 7 days | Yes |
| TikTok | 7 days | 1 day | Yes |

## Choosing the Right Model
| Situation | Recommended Model |
|-----------|------------------|
| Low data volume (< 300 conv/mo) | Last click or position-based |
| Medium volume (300-1000 conv/mo) | GA4 data-driven |
| High volume (1000+ conv/mo) | Shapley or Markov |
| B2B long sales cycle | Position-based or time decay |
| B2C impulse purchase | Last click or data-driven |
| Multi-channel campaigns | Data-driven or Shapley |
| Single channel dominant | Last click is fine |

## Multi-Touch Attribution Implementation

### Model Selection Guide
- **First-touch:** credits acquisition channel, best for top-of-funnel optimization
- **Last-touch:** credits closing channel, best for bottom-of-funnel optimization
- **Linear:** equal credit across all touchpoints, best for balanced view
- **Time-decay:** more credit to recent touchpoints, best for short sales cycles
- **Position-based (U-shaped):** 40% first, 40% last, 20% distributed middle
- **Data-driven (GA4):** algorithmic, uses Shapley values

## Platform-Specific Attribution

### GA4
- Data-driven attribution as default, cross-channel, 90-day lookback

### Meta Attribution
- 7-day click / 1-day view default, Meta Attribution API for server-side

### Google Ads
- Data-driven bidding, conversion modeling for privacy gaps

## Incrementality Testing

### Methods
- **Geo-holdout:** split by geography, measure lift vs control
- **PSA tests:** show non-branded ads to control group
- **Ghost ads:** log would-have-shown impressions
- **Conversion lift studies:** platform-native (Meta Lift, Google Experiments)

## Media Mix Modeling (MMM)

### O que e MMM
MMM e uma tecnica estatistica (regressao) que usa dados agregados de gasto e resultados para estimar a contribuicao de cada canal de marketing — sem depender de cookies ou tracking individual.

**Por que MMM ganhou relevancia (2023-2026):**
- iOS 14.5+: reducao de 40-60% em tracking de conversoes mobile
- LGPD/GDPR: restricoes crescentes a cookies de terceiros
- Walled gardens (Meta, Google): cada plataforma reporta seu proprio attribution
- MMM usa dados agregados = privacy-safe por design

### Como funciona
```
Receita = f(
  TV_spend,
  Google_spend,
  Meta_spend,
  Email_sends,
  Seasonality,
  Price,
  External_factors
) + error

Coeficiente de cada variavel = contribuicao marginal daquele canal
```

### Quando usar MMM vs MTA
| Dimensao | MMM | MTA (Multi-Touch Attribution) |
|----------|-----|------------------------------|
| Dados necessarios | Historico agregado (2+ anos) | Individual touchpoints |
| Granularidade | Nivel de canal | Nivel de usuario |
| Latencia | Semanal/mensal | Near real-time |
| Privacidade | Privacy-safe | Requer consentimento |
| Canais offline | Sim (TV, radio, OOH) | Limitado |
| Custo de implementacao | Alto (data science) | Medio |
| Melhor para | Planejamento estrategico | Otimizacao tatica |

### Ferramentas de MMM
| Ferramenta | Tipo | Notas |
|-----------|------|-------|
| **Meta Robyn** | Open-source | Meta/Facebook; R package |
| **Google Meridian** | Open-source | Substitui LightweightMMM |
| **Google LightweightMMM** | Open-source | Python, Bayesian |
| **Analytic Edge (Commerzbank)** | Consultoria/SaaS | Enterprise |
| **Neustar MarketShare** | Enterprise | Lider historico |
| **Nielsen Attribution** | Enterprise | Forte em CPG |

---

## Incrementality Testing — O Gold Standard

Incrementality mede o impacto CAUSAL de um canal (o que nao teria acontecido sem o canal).

```
Incrementality Lift = (Test Group CR - Control Group CR) / Control Group CR × 100

Incremental conversions = Total conversions × (1 - (Control CR / Test CR))

iROAS = Incremental Revenue / Ad Spend
```

**Interpretacao critica:** Se iROAS < 1, o canal esta gastando mais que gera incrementalmente — mesmo que o ROAS total aparente seja alto (credito a conversoes organicas).

**Metodos por ordem de precisao:**
| Metodo | Precisao | Custo | Quando usar |
|--------|----------|-------|-------------|
| Geo-based holdout | Alta | Medio | Canal com escala geografica |
| Ghost ads | Muito alta | Alto | Meta, Google tem ferramentas nativas |
| Budget on/off | Media | Baixo | Teste rapido |
| Matched market | Alta | Medio | Comparar mercados similares |
| Randomized Controlled Trial | Maxima | Alto | Quando vale o investimento |

---

## Decision Matrix

| Scenario | Recommended Model |
|----------|------------------|
| Brand awareness campaigns | First-touch |
| Performance/conversion campaigns | Last-touch or data-driven |
| Multi-channel, long sales cycle | Position-based or data-driven |
| Limited data (<300 conversions/month) | Position-based |
| Sufficient data (300+ conversions) | Data-driven |
| Privacy-constrained environment | MMM |
| Strategic budget planning | MMM |
| Tactical channel optimization | MTA (data-driven) |
| Validar se canal realmente incrementa | Incrementality test |
