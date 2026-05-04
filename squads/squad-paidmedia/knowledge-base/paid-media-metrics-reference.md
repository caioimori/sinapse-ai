# Paid Media Metrics Reference

## Core Metrics & Formulas

### Engagement Metrics
| Metrica | Formula | Benchmark (avg) |
|---------|---------|----------------|
| **CPM** (Cost per Mille) | (Spend / Impressions) × 1000 | $5-$15 (Meta), $2-$8 (Google Display) |
| **CPC** (Cost per Click) | Spend / Clicks | $0.50-$3 (Meta), $1-$5 (Google Search) |
| **CTR** (Click-Through Rate) | (Clicks / Impressions) × 100 | 0.9-1.5% (Meta), 3-6% (Google Search) |
| **Frequency** | Impressions / Reach | <3 (Cold), <5 (Warm), <7 (Hot) |
| **Reach** | Unique users who saw the ad | - |
| **Impression Share** | Impressions / Total eligible impressions | >80% (Brand), >40% (Non-brand) |

### Conversion Metrics
| Metrica | Formula | Benchmark (avg) |
|---------|---------|----------------|
| **CVR** (Conversion Rate) | (Conversions / Clicks) × 100 | 2-5% (e-comm), 5-15% (lead gen) |
| **CPA** (Cost per Acquisition) | Spend / Conversions | Vertical dependent |
| **CPL** (Cost per Lead) | Spend / Leads | $5-$50 (B2C), $20-$200 (B2B) |
| **ROAS** (Return on Ad Spend) | Revenue / Spend | 3-5x (e-comm), varies (B2B) |
| **AOV** (Average Order Value) | Revenue / Orders | Vertical dependent |

### Efficiency Metrics
| Metrica | Formula | Interpretacao |
|---------|---------|--------------|
| **CPA Marginal** | Spend incremental / Conversions incrementais | Custo da PROXIMA conversao |
| **ROAS Marginal** | Revenue incremental / Spend incremental | Retorno do PROXIMO real investido |
| **CAC** (Customer Acquisition Cost) | Total marketing + sales cost / New customers | Custo total de aquisicao |
| **LTV** (Lifetime Value) | AOV × Purchase frequency × Customer lifespan | Valor total do cliente |
| **LTV:CAC Ratio** | LTV / CAC | Alvo: >3:1 |

### Quality Metrics (Google)
| Metrica | Formula | Target |
|---------|---------|--------|
| **Quality Score** | Expected CTR + Ad Relevance + LP Experience | >=7 |
| **Ad Strength** | Asset diversity + relevance + volume | Good ou Excellent |
| **Optimization Score** | Google's recommended actions | >80% |

### Video Metrics
| Metrica | Formula | Benchmark |
|---------|---------|-----------|
| **VTR** (View-Through Rate) | (Views / Impressions) × 100 | 15-30% (YouTube) |
| **Hook Rate** | (3s views / Impressions) × 100 | >30% (Meta) |
| **Avg Watch Time** | Total watch time / Views | >50% of duration |
| **CPV** (Cost per View) | Spend / Views | $0.01-$0.05 |
| **CPCV** (Cost per Completed View) | Spend / Completed Views | $0.05-$0.20 |

### CRO Metrics
| Metrica | Formula | Benchmark |
|---------|---------|-----------|
| **Bounce Rate** | Single-page sessions / Sessions | <50% (LP) |
| **Engagement Rate** (GA4) | Engaged sessions / Sessions | >50% |
| **Form Start Rate** | Form starts / Page views | >20% |
| **Form Completion Rate** | Submits / Form starts | >40% |
| **Cart Abandonment** | 1 - (Purchases / ATC) | ~70% (industry avg) |
| **Activation Rate** | Activated users / Signups | 20-40% |

## Industry Benchmarks by Vertical

### Meta Ads (Facebook/Instagram)
| Vertical | CTR | CPC | CVR | CPA |
|----------|-----|-----|-----|-----|
| E-commerce (geral) | 1.0% | $1.20 | 3.5% | $35 |
| SaaS/Software | 0.8% | $2.50 | 5.0% | $50 |
| Education | 0.9% | $1.80 | 8.0% | $22 |
| Finance/Insurance | 0.7% | $3.50 | 4.5% | $78 |
| Health/Fitness | 1.2% | $1.50 | 4.0% | $38 |
| Real Estate | 0.8% | $2.00 | 3.0% | $67 |
| B2B Services | 0.7% | $3.00 | 6.0% | $50 |
| Retail | 1.3% | $0.80 | 4.0% | $20 |

### Google Search Ads
| Vertical | CTR | CPC | CVR | CPA |
|----------|-----|-----|-----|-----|
| E-commerce | 4.5% | $1.50 | 3.0% | $50 |
| Legal | 3.5% | $8.00 | 5.0% | $160 |
| Education | 5.0% | $3.00 | 6.0% | $50 |
| Finance | 4.0% | $5.00 | 4.0% | $125 |
| Healthcare | 3.8% | $4.00 | 5.0% | $80 |
| SaaS | 3.5% | $5.00 | 4.0% | $125 |
| Real Estate | 4.5% | $2.50 | 3.5% | $71 |
| Home Services | 5.0% | $3.50 | 6.0% | $58 |

*Nota: benchmarks sao referencias gerais. Variam significativamente por mercado, pais e maturidade da conta.*

## Formulas Compostas Uteis

### Break-Even ROAS
```
Break-Even ROAS = 1 / Profit Margin

Se margin = 30% → Break-Even ROAS = 1/0.30 = 3.33x
Se margin = 50% → Break-Even ROAS = 1/0.50 = 2.0x
```

### Max CPA Permitido
```
Max CPA = LTV × Target Profit Margin

Se LTV = $500, profit margin target = 30%:
Max CPA = $500 × 0.30 = $150
```

### Budget Necessario para Teste
```
Test Budget = (Sample Size × 2) × CPC

Se sample = 10,000 por variante, CPC = $2:
Test Budget = 20,000 × $2 = $40,000
```

### MER (Marketing Efficiency Ratio)
```
MER = Total Revenue / Total Marketing Spend

Alternativa holistica ao ROAS (inclui organic + brand effect)
Target: depends on business model (DTC tipicamente 3-5x)
```

## Dashboard KPIs por Role

### Para Executivos
- Spend total, Revenue, ROAS, CPA, Volume de conversoes, MoM trend

### Para Media Managers
- CPA por canal, ROAS por canal, Budget utilization, Creative performance, Quality Score

### Para Analistas
- Attribution paths, Funnel rates, Anomalies, Cohort analysis, Incrementality

### Para Creative Team
- CTR por criativo, Hook rate, VTR, Creative fatigue status, Winner/loser patterns

---

## Benchmarks Brasil (BRL) — CPM por Plataforma

| Plataforma | Formato | CPM Médio Brasil |
|-----------|---------|----------------|
| **Meta — Feed (Foto/Video)** | — | R$15-40 |
| **Meta — Reels** | — | R$10-25 |
| **Meta — Stories** | — | R$10-25 |
| **Google Search** | CPC | R$5-30 por clique |
| **Google Display** | CPM | R$3-10 |
| **YouTube Pre-Roll** | CPM | R$15-35 |
| **YouTube Shorts** | CPM | R$8-20 |
| **TikTok In-Feed** | CPM | R$8-25 |
| **LinkedIn Sponsored** | CPM | R$40-120 |
| **Facebook Feed** | CPM | R$8-20 |

*Valores variam por indústria, audiência e sazonalidade. Black Friday pode subir CPMs em 50-200%.*

---

## Métricas de Social Algorithms (Para Organic Synergy)

### Instagram

| Métrica | Fórmula | Benchmark 2025 |
|---------|---------|----------------|
| **Hook Rate (Reels)** | 3s views / Impressões | >30% bom, >50% excelente |
| **Completion Rate** | Vídeos completos / Impressões | >50% bom |
| **Save Rate** | Saves / Reach | >2% conteúdo de referência |
| **Share Rate (DM)** | DM Shares / Reach | >1% excelente |
| **Engagement Rate (Reach-based)** | (Likes+Comm+Saves+Shares) / Reach | 1.5-3% Brasil |

### TikTok

| Métrica | Fórmula | Benchmark |
|---------|---------|-----------|
| **Completion Rate** | Vídeos completos / Impressões | >50% bom para algoritmo |
| **Watch Time Total** | Soma de segundos assistidos | Relativo ao tamanho do vídeo |
| **Share Rate** | Shares / Views | >0.5% excelente |
| **ER TikTok** | (Likes+Comm+Shares) / Views | 5-9% Brasil |
| **Pool Progression** | Pool 1 → 2 → 3 completion rate | >50% CR cada pool |

### YouTube

| Métrica | Fórmula | Benchmark |
|---------|---------|-----------|
| **CTR (Thumbnail)** | Cliques / Impressões | 2-10% dependendo do nicho |
| **AVD (Avg View Duration)** | Total watch time / Views | >50% do vídeo |
| **Session Start Rate** | Vídeos que iniciaram sessões | Alto = boost no Browse |
| **Shorts Loop Rate** | Views com loop / Total views | Sinal positivo forte |

### LinkedIn

| Métrica | Fórmula | Benchmark |
|---------|---------|-----------|
| **Dwell Time** | Segundos médios no post | 30s+ = alta qualidade |
| **ER LinkedIn** | (Reactions+Comm+Reposts) / Impressões | 2-5% bom, >5% excelente |
| **SSI Score** | Índice 0-100 LinkedIn | >70 para creators |

---

## Formulas de Atribuição

### MER (Marketing Efficiency Ratio)
```
MER = Receita Total do Negócio / Custo Total de Marketing

Alvo DTC: 3-5x
```

### Break-Even ROAS (com Margem)
```
Break-Even ROAS = 1 / Margem Bruta

Se margem = 30% → Break-Even ROAS = 3.33x
Se margem = 50% → Break-Even ROAS = 2.0x
```

### LTV:CAC e Payback Period
```
LTV:CAC = Lifetime Value / Customer Acquisition Cost
Alvo: >3:1

Payback Period = CAC / (Receita mensal por cliente × Margem)
Alvo: <12 meses (SaaS), <6 meses (e-commerce)
```

### Contribution Margin por Pedido
```
Contribution Margin = Receita - COGS - Ads - Shipping - Payment fees - Returns

Métrica mais honesta de lucratividade por pedido
```

---

## Métricas de Video Ads — Hierarquia de Importância

```
1. CPA / ROAS (resultado final)
   ↑ determinado por:
2. CVR (landing page + offer)
   ↑ influenciado por:
3. CTR (relevância do criativo + audiência)
   ↑ influenciado por:
4. Hook Rate (primeiros 3 segundos)
   ↑ determinado por:
5. Completion Rate (retenção do vídeo)
```

**Para diagnóstico de underperformance:**
- CPA alto + CVR baixo = problema de landing page/oferta
- CPA alto + CVR ok + CTR baixo = problema de criativo ou audiência
- CTR baixo + Hook Rate baixo = problema de hook (primeiros 3s)
- CTR ok + Completion baixo = o vídeo não entrega o que o hook promete
