---
task: build-forecasting-model
responsavel: "@cs-revops-analyst"
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

# Task: Build Forecasting Model

## Metadata
- **Squad:** squad-commercial
- **Agent:** Ledger (cs-revops-analyst)
- **Complexity:** Advanced

## Objetivo
Construir modelo de forecasting de receita usando 3 metodos complementares — bottom-up (pipeline), top-down (mercado) e run-rate (tendencia) para projecao com intervalos de confianca.

## Entrada
- CRM pipeline data
- Historical revenue data
- Market size data
- Team capacity data

## Passos

### 1. Method 1: Bottom-Up (Pipeline-Based)
```
For each deal in pipeline:
  Weighted Value = Deal Value × Stage Probability × Judgment Factor

Forecast = Σ Weighted Values for all deals

Judgment Factors:
  - MEDDIC score ≥ 6: Factor = 1.0
  - MEDDIC score 4-5: Factor = 0.8
  - MEDDIC score < 4: Factor = 0.5

Commit: Σ deals with ≥ 90% weighted probability
Best Case: Commit + Σ deals with 50-89% weighted
Pipeline: Total weighted pipeline
```

### 2. Method 2: Top-Down (Market-Based)
```
TAM (Total Addressable Market) = [market size in R$]
SAM (Serviceable Available) = TAM × [% we can reach]
SOM (Serviceable Obtainable) = SAM × [realistic market share]

Forecast = SOM × expected win rate × average conversion

Best for: Annual planning and board projections
```

### 3. Method 3: Run-Rate (Trend-Based)
```
Run-Rate ARR = Current MRR × 12
Growth-Adjusted = Run-Rate × (1 + Monthly Growth Rate)^12

Seasonal Adjustment:
  Apply seasonal indices from historical data
  Q4 typically strongest, Q1 weakest (varies)

Best for: Quick sanity checks and baseline expectations
```

### 4. Forecast Consolidation
| Method | Q Current | Q+1 | Q+2 | Q+3 |
|--------|----------|-----|-----|-----|
| Bottom-Up (Commit) | R$ | R$ | — | — |
| Bottom-Up (Best Case) | R$ | R$ | — | — |
| Top-Down | R$ | R$ | R$ | R$ |
| Run-Rate | R$ | R$ | R$ | R$ |
| **Blended Forecast** | R$ | R$ | R$ | R$ |

### 5. Confidence Intervals
| Scenario | Q Current | Probability | Assumptions |
|----------|----------|------------|------------|
| Bear (P10) | R$ | 10% chance below | Worst: high churn, low win rate |
| Base (P50) | R$ | 50/50 | Expected: historical averages |
| Bull (P90) | R$ | 90% chance above | Best: all initiatives land |

### 6. Forecast Accuracy Tracking
| Quarter | Method | Forecast | Actual | Variance | MAPE |
|---------|--------|---------|--------|----------|------|
| | Bottom-Up | R$ | R$ | % | |
| | Top-Down | R$ | R$ | % | |
| | Blended | R$ | R$ | % | |

Target MAPE (Mean Absolute Percentage Error): < 10%

## Saida
- Three-method forecasting model
- Blended forecast with confidence intervals
- Board-ready forecast presentation
- Accuracy tracking system

## Validacao
- [ ] Three methods calculated independently
- [ ] Confidence intervals defined (Bear/Base/Bull)
- [ ] Historical accuracy tracked
- [ ] Assumptions documented per scenario
