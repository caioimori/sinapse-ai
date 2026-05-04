---
task: calculate-roas-optimization
responsavel: "@ga-campaign-analyst"
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

# Task: Calculate ROAS Optimization

## Metadata
- **Squad:** squad-growth
- **Agent:** Pulse (ga-campaign-analyst)
- **Complexity:** Standard

## Objetivo
Calcular e otimizar ROAS (Return on Ad Spend) — medir eficiencia de investimento em ads, identificar campanhas sub/super-performantes e otimizar alocacao de budget para maximizar retorno.

## Entrada
- Ad spend data by campaign/adset/ad
- Revenue attribution data
- Conversion data
- Target ROAS by campaign type

## Passos

### 1. ROAS Calculation
```
ROAS = Revenue Attributed to Ads / Ad Spend

Examples:
- ROAS 3.0x = R$3 revenue per R$1 spent
- ROAS 1.0x = Break-even (excluding COGS)
- ROAS < 1.0x = Losing money on ads
```

| Metrica Relacionada | Formula | Uso |
|-------------------|---------|-----|
| ROAS | Revenue / Ad Spend | Overall ad efficiency |
| Net ROAS | (Revenue - COGS) / Ad Spend | Profitability-adjusted |
| Blended ROAS | Total Revenue / Total Ad Spend | Cross-channel efficiency |
| Incremental ROAS | Incremental Revenue / Ad Spend | True attributed value |
| Target ROAS | Required ROAS for profitability | Planning & bidding |

### 2. Target ROAS Calculation
```
Target ROAS = 1 / Maximum Acceptable Cost Ratio

Where:
  Cost Ratio = Ad Spend / Revenue

Example:
  If Gross Margin = 60%
  And Marketing can use 30% of revenue for ads
  Then Max Cost Ratio = 30%
  Target ROAS = 1 / 0.30 = 3.33x

Breakeven ROAS = 1 / Gross Margin %
  Example: 1 / 0.60 = 1.67x (minimum to not lose money)
```

### 3. ROAS by Campaign Level
| Nivel | Campanha | Spend | Revenue | ROAS | vs Target | Acao |
|-------|---------|-------|---------|------|----------|------|
| Campaign | | | | | Above/Below | |
| Ad Set | | | | | | |
| Ad Creative | | | | | | |
| Keyword | | | | | | |
| Audience | | | | | | |

### 4. ROAS Optimization Levers
| Lever | Impacto em ROAS | Como Implementar |
|-------|----------------|-----------------|
| Audience refinement | Alto | Remove low-converting audiences |
| Creative optimization | Alto | Test new creatives, pause losers |
| Bid strategy | Medio | Switch to tROAS bidding |
| Landing page CRO | Alto | Improve conversion rate |
| Dayparting | Baixo-Medio | Shift budget to best hours |
| Geo-targeting | Medio | Focus on high-ROAS regions |
| Device bidding | Baixo | Adjust bids by device performance |
| Negative keywords | Medio | Block wasteful search terms |
| Retargeting | Alto | Higher ROAS on warm audiences |
| Lookalike audiences | Medio | Scale with similar high-value users |

### 5. Campaign Segmentation by Performance
| Quadrante | ROAS | Volume | Acao |
|----------|------|--------|------|
| Stars | Alto ROAS + Alto volume | Scale | Increase budget 20-50% |
| Cash cows | Alto ROAS + Baixo volume | Expand | Test new audiences/creatives |
| Question marks | Baixo ROAS + Alto volume | Optimize | CRO, audience, creative tests |
| Dogs | Baixo ROAS + Baixo volume | Cut | Pause or dramatically restructure |

### 6. ROAS Trend Analysis
| Periodo | Spend | Revenue | ROAS | MoM Change | Nota |
|---------|-------|---------|------|-----------|------|
| Month -3 | | | | — | |
| Month -2 | | | | | |
| Month -1 | | | | | |
| Current | | | | | |

**Declining ROAS signals:**
- Audience fatigue (frequency too high)
- Creative fatigue (same ads too long)
- Market saturation (diminishing returns)
- Competition increase (higher CPMs)
- Seasonality effects

### 7. Budget Optimization Model
```
Objective: Maximize total revenue given fixed budget

For each campaign i:
  Marginal ROAS_i = ΔRevenue_i / ΔSpend_i

Optimal allocation:
  Marginal ROAS should be equal across all campaigns

Process:
  1. Calculate marginal ROAS for each campaign at current spend
  2. Shift budget from low marginal ROAS to high marginal ROAS
  3. Continue until marginal ROAS equalizes (or practical limits hit)
  4. Test new allocation for 2-4 weeks
  5. Re-evaluate and adjust
```

| Campanha | Current Spend | Current ROAS | Marginal ROAS | Recommended Spend | Expected ROAS |
|---------|-------------|-------------|--------------|------------------|-------------|
| | | | | | |

### 8. ROAS Reporting Template
| Metrica | Meta | Paid Search | Paid Social | Display | Total |
|---------|------|-----------|------------|---------|-------|
| Spend | | | | | |
| Impressions | | | | | |
| Clicks | | | | | |
| CTR | | | | | |
| CPC | | | | | |
| Conversions | | | | | |
| Revenue | | | | | |
| **ROAS** | | | | | |
| **vs Target** | | | | | |

## Saida
- ROAS analysis by campaign/channel
- Target ROAS calculation
- Performance segmentation (stars/dogs)
- Budget optimization recommendations
- Trend analysis with diagnostics

## Validacao
- [ ] ROAS calculado em todos os niveis (campaign, adset, ad)
- [ ] Target ROAS definido baseado em margins
- [ ] Campanhas segmentadas por performance
- [ ] Optimization levers identificados
- [ ] Budget reallocation proposta
- [ ] Trend analysis com 3+ months
- [ ] Reporting template preenchido
