---
task: analyze-cac-by-channel
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

# Task: Analyze CAC by Channel

## Metadata
- **Squad:** squad-growth
- **Agent:** Pulse (ga-campaign-analyst)
- **Complexity:** Standard

## Objetivo
Analisar CAC (Customer Acquisition Cost) por canal — calcular custo de aquisicao de clientes em cada canal de marketing para otimizar alocacao de investimento e garantir unit economics saudaveis.

## Entrada
- Marketing spend by channel (detailed)
- Customer acquisition data by source
- Revenue/LTV data per customer
- Attribution model

## Passos

### 1. CAC Components
```
CAC = Total Acquisition Cost / New Customers Acquired

Where Total Acquisition Cost includes:
  + Ad spend (platform costs)
  + Agency fees
  + Tool/software costs (allocated)
  + Content production costs
  + Team salaries (allocated % to acquisition)
  = Fully Loaded CAC

Simple CAC (more common) = Ad Spend Only / New Customers
```

### 2. CAC by Channel
| Canal | Ad Spend | Other Costs | Total Cost | New Customers | CAC | vs Target |
|-------|---------|------------|-----------|-------------|-----|----------|
| Paid Search (Brand) | | | | | | |
| Paid Search (Non-Brand) | | | | | | |
| Meta Ads | | | | | | |
| LinkedIn Ads | | | | | | |
| Google Display | | | | | | |
| YouTube | | | | | | |
| TikTok | | | | | | |
| Organic Search | R$0 | Content cost | | | | |
| Email | R$0 | Tool + content | | | | |
| Referral | Reward cost | | | | | |
| **Blended** | | | | | | |

### 3. CAC vs LTV Analysis
| Canal | CAC | LTV (12mo) | LTV:CAC | Payback (months) | Verdict |
|-------|-----|-----------|---------|-----------------|---------|
| | | | Ratio | Months | Healthy/Warning/Critical |

**Health Thresholds:**
| LTV:CAC Ratio | Status | Interpretacao |
|--------------|--------|-------------|
| > 5:1 | Under-investing | Could spend more to grow |
| 3:1 - 5:1 | Healthy | Sweet spot |
| 2:1 - 3:1 | Warning | Margins getting thin |
| 1:1 - 2:1 | Critical | Near break-even |
| < 1:1 | Unsustainable | Losing money per customer |

### 4. CAC Trend Analysis
| Canal | 3 Months Ago | 2 Months Ago | Last Month | Current | Trend |
|-------|-------------|-------------|-----------|---------|-------|
| Paid Search | | | | | ↑↓→ |
| Meta Ads | | | | | ↑↓→ |
| LinkedIn | | | | | ↑↓→ |
| Blended | | | | | ↑↓→ |

**Rising CAC Causes:**
| Causa | Diagnostico | Solucao |
|-------|-----------|---------|
| Market saturation | Frequency increasing, CTR decreasing | New audiences, new channels |
| Competition | CPM/CPC increasing | Creative differentiation, new channels |
| Audience exhaustion | Lookalike quality declining | Refresh seed audiences |
| Creative fatigue | Same ads running too long | New creative production |
| Seasonality | Predictable annual patterns | Adjust budget by season |
| Platform changes | Algorithm/policy changes | Adapt strategy, diversify |

### 5. Marginal CAC Analysis
```
Marginal CAC = ΔSpend / ΔCustomers

As spend increases on a channel:
- Initial: Low marginal CAC (efficient)
- Middle: Stable marginal CAC
- Later: Rising marginal CAC (diminishing returns)

Optimal spend point: Where Marginal CAC = Target CAC
```

| Canal | Current Spend | Current CAC | Marginal CAC | Optimal Spend | Delta |
|-------|-------------|-----------|-------------|--------------|-------|
| | | | | | +/- R$ |

### 6. Blended CAC Optimization
```
Blended CAC = Sum(All Channel Spend) / Sum(All New Customers)

Optimization strategy:
1. Rank channels by CAC (lowest first)
2. Identify channels with Marginal CAC < Blended CAC
3. Shift budget from high CAC to low CAC channels
4. Monitor for diminishing returns
5. Target Blended CAC < LTV / 3
```

### 7. CAC by Customer Segment
| Segmento | CAC | LTV | LTV:CAC | % of Customers | Strategy |
|---------|-----|-----|---------|---------------|----------|
| Enterprise | Alto | Muito Alto | | Low | Sales-driven |
| Mid-Market | Medio | Alto | | Medium | Mixed |
| SMB | Baixo | Medio | | High | Product-led |
| Consumer | Muito Baixo | Baixo | | Very High | Self-serve |

### 8. CAC Dashboard Widgets
| Widget | Tipo | Dados |
|--------|------|-------|
| Blended CAC | Big number + trend | Total CAC, MoM change |
| CAC by channel | Horizontal bar | Ranked from lowest to highest |
| CAC vs LTV | Scatter plot | Per channel, bubble = volume |
| CAC trend | Multi-line | 6-month trend per channel |
| Payback period | Bar chart | Months to recover CAC per channel |
| CAC composition | Stacked bar | Ad spend vs other costs |
| Marginal CAC | Line chart | CAC vs spend level per channel |

## Saida
- CAC analysis by channel
- LTV:CAC analysis
- Trend analysis with diagnostics
- Marginal CAC estimation
- Budget optimization recommendations
- CAC dashboard specification

## Validacao
- [ ] CAC calculado para todos os canais ativos
- [ ] LTV:CAC ratio analisado
- [ ] Trend de CAC (3+ months) documentado
- [ ] Causas de rising CAC identificadas
- [ ] Marginal CAC estimado
- [ ] Budget optimization proposto
- [ ] Segmentation por customer type incluida
