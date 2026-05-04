---
task: create-forecasting-model
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

# Task: Create Forecasting Model

## Metadata
- **Squad:** squad-growth
- **Agent:** Insight (ga-data-analyst)
- **Complexity:** Advanced

## Objetivo
Criar modelo de forecasting — projetar metricas-chave (revenue, traffic, conversions) para planejamento estrategico, budget allocation e goal-setting com intervalos de confianca.

## Entrada
- Historical data (12-24+ months ideal)
- Seasonality patterns
- Known business events (launches, campaigns)
- External factors (market trends, competition)

## Passos

### 1. Forecasting Methods
| Metodo | Complexidade | Quando Usar | Dados Minimos |
|--------|-------------|-------------|--------------|
| Moving Average | Baixa | Dados estaveis, sem trend | 3+ months |
| Exponential Smoothing | Media | Dados com trend leve | 6+ months |
| ARIMA/SARIMA | Alta | Dados com sazonalidade | 24+ months |
| Prophet (Meta) | Media | Dados com holidays e changepoints | 12+ months |
| Linear Regression | Media | Relacao clara com variaveis | 12+ months |
| Monte Carlo Simulation | Alta | Cenarios com incerteza | Historical distributions |
| Bottom-up (driver-based) | Media | Quando drivers sao claros | Driver metrics available |

### 2. Driver-Based Forecasting Model
```
Revenue = Traffic × Conversion Rate × AOV

Where:
  Traffic = Organic + Paid + Direct + Referral + Social + Email
  Conversion Rate = f(landing page, funnel, CRO efforts)
  AOV = f(product mix, pricing, upsell/cross-sell)
```

| Driver | Historical Trend | Forecast Method | Assumptions |
|--------|-----------------|----------------|-------------|
| Organic Traffic | | Growth rate + seasonality | SEO efforts maintain |
| Paid Traffic | | Budget-driven | CPM/CPC stable |
| Conversion Rate | | Regression + CRO impact | Tests continue |
| AOV | | Moving average + pricing | No major price changes |

### 3. Seasonal Decomposition
| Componente | Descricao | Metodo |
|-----------|----------|--------|
| Trend (T) | Direcao de longo prazo | Moving average, regression |
| Seasonality (S) | Padroes repetitivos | Seasonal indices |
| Cyclical (C) | Ciclos de negocio | Domain knowledge |
| Residual (R) | Variacao aleatoria | Time series = T × S × C + R |

### 4. Seasonal Indices
| Mes | Indice (exemplo) | Ajuste |
|-----|-----------------|--------|
| Jan | 0.85 | -15% (pos-festas) |
| Feb | 0.90 | -10% |
| Mar | 0.95 | -5% |
| Apr | 1.00 | Base |
| May | 1.05 | +5% (Dia das Maes) |
| Jun | 1.10 | +10% (Dia dos Namorados) |
| Jul | 0.95 | -5% (ferias) |
| Aug | 1.00 | Base (Dia dos Pais) |
| Sep | 1.00 | Base |
| Oct | 1.05 | +5% (Dia das Criancas) |
| Nov | 1.35 | +35% (Black Friday) |
| Dec | 1.20 | +20% (Natal) |

### 5. Confidence Intervals
| Nivel | Interpretacao | Uso |
|-------|-------------|-----|
| 50% CI | Cenario mais provavel | Planning target |
| 80% CI | Cenario razoavel | Budget planning |
| 95% CI | Cenario conservador | Risk assessment |

**Forecast Output Template:**
| Periodo | Low (P10) | Base (P50) | High (P90) | Previous Year |
|---------|----------|-----------|-----------|-------------|
| Q2 2026 | | | | |
| Q3 2026 | | | | |
| Q4 2026 | | | | |
| Q1 2027 | | | | |

### 6. Scenario Planning
| Cenario | Assumptions | Revenue Impact | Probability |
|---------|-----------|---------------|------------|
| Bull case | Market grows, campaigns outperform | +20-30% | 20% |
| Base case | Current trends continue | +5-10% | 60% |
| Bear case | Market slowdown, increased competition | -5-10% | 20% |

### 7. Model Validation
| Metodo | Descricao | Threshold |
|--------|----------|----------|
| MAPE | Mean Absolute Percentage Error | < 15% |
| MAE | Mean Absolute Error | Context-dependent |
| RMSE | Root Mean Square Error | Context-dependent |
| Backtesting | Apply model to historical data | Within CI bounds |
| Holdout validation | Train on 80%, test on 20% | MAPE < 15% |

### 8. Forecast Review Cadence
| Frequencia | Atividade |
|-----------|----------|
| Monthly | Compare actuals vs forecast, adjust if > 10% deviation |
| Quarterly | Full model re-calibration with new data |
| Annually | Complete model review, method evaluation |
| Ad-hoc | When major business events occur (launch, crisis) |

## Saida
- Forecasting model (12-month projection)
- Seasonal indices calibrados
- Confidence intervals (50%, 80%, 95%)
- Scenario analysis (bull/base/bear)
- Validation metrics
- Dashboard com actuals vs forecast

## Validacao
- [ ] Metodo de forecasting adequado selecionado
- [ ] Sazonalidade identificada e calibrada
- [ ] Confidence intervals calculados
- [ ] Scenarios definidos com probabilidades
- [ ] Backtesting realizado com MAPE < 15%
- [ ] Review cadence estabelecido
- [ ] Dashboard de tracking implementado
