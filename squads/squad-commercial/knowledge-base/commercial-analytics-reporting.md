# Commercial Analytics & Reporting

## Key Commercial Dashboards

### 1. Revenue Dashboard
```
REVENUE OVERVIEW — [Period]

HEADLINE METRICS:
  ┌──────────────┬──────────────┬──────────────┬──────────────┐
  │ Total ARR    │ New ARR      │ Expansion    │ Churn        │
  │ R$ _______   │ R$ _______   │ R$ _______   │ R$ _______   │
  │ vs target: % │ vs target: % │ vs target: % │ vs target: % │
  └──────────────┴──────────────┴──────────────┴──────────────┘

REVENUE COMPOSITION:
  New logo revenue: __% of total
  Expansion revenue: __% of total
  Recurring base: __% of total

TREND:
  MoM growth rate: __%
  QoQ growth rate: __%
  YoY growth rate: __%

FORECAST:
  This quarter (committed): R$ ________
  This quarter (forecast): R$ ________
  This quarter (target): R$ ________
  Gap / surplus: R$ ________
```

### 2. Pipeline Dashboard
```
PIPELINE HEALTH — [Period]

PIPELINE SUMMARY:
  Total pipeline value: R$ ________
  Weighted pipeline: R$ ________
  Pipeline coverage: ___x quota
  New pipeline added (this period): R$ ________
  Pipeline removed (this period): R$ ________

STAGE DISTRIBUTION:
  │ Discovery     │ ██████████████     │ R$___K │ __% │
  │ Qualification │ ██████████         │ R$___K │ __% │
  │ Solution      │ ████████           │ R$___K │ __% │
  │ Proposal      │ ██████             │ R$___K │ __% │
  │ Negotiation   │ ████               │ R$___K │ __% │
  │ Commit        │ ██                 │ R$___K │ __% │

PIPELINE VELOCITY:
  Sales velocity: R$____/day
  Average deal size: R$________
  Average cycle length: ___ days
  Win rate: ___%

PIPELINE AGE:
  Deals > 30 days in stage: ___ (R$____K)
  Deals > 60 days in stage: ___ (R$____K)
  Deals with no activity > 14 days: ___ (R$____K)
```

### 3. Unit Economics Dashboard
```
UNIT ECONOMICS — [Period]

ACQUISITION:
  CAC (blended): R$ ________
  CAC (inbound): R$ ________
  CAC (outbound): R$ ________
  CAC (referral): R$ ________

RETENTION:
  LTV: R$ ________
  LTV:CAC ratio: ___:1
  CAC payback period: ___ months
  GRR: ___%
  NRR: ___%

EFFICIENCY:
  Magic Number: ___
  Sales efficiency ratio: ___
  Revenue per employee: R$ ________
  Gross margin: ___%

HEALTH INDICATORS:
  LTV:CAC ≥ 3:1? [✓/✗]
  CAC Payback < 18mo? [✓/✗]
  NRR > 110%? [✓/✗]
  Magic Number > 0.75? [✓/✗]
  GRR > 90%? [✓/✗]
```

### 4. Client Health Dashboard
```
CLIENT PORTFOLIO — [Period]

HEALTH DISTRIBUTION:
  Green (80-100): ___ accounts (__%  of ARR)
  Yellow (50-79): ___ accounts (__%  of ARR)
  Red (0-49):     ___ accounts (__%  of ARR)

MOVEMENT:
  Green → Yellow: ___ accounts (R$____K ARR at risk)
  Yellow → Red:   ___ accounts (R$____K ARR at risk)
  Red → Yellow:   ___ accounts (R$____K recovering)
  Yellow → Green: ___ accounts (R$____K stabilized)

NPS:
  Overall NPS: ___
  Response rate: ___%
  Promoters: ___%
  Passives: ___%
  Detractors: ___%

EXPANSION PIPELINE:
  Opportunities identified: ___
  Opportunities qualified: ___
  Expansion revenue (closed): R$ ________
  Expansion rate (% of eligible): ___%
```

---

## Reporting Cadence

### Cadence Matrix
| Report | Frequency | Audience | Owner | Format |
|--------|----------|---------|-------|--------|
| Pipeline snapshot | Daily | Sales team | Vault (CRM) | CRM dashboard |
| Activity report | Weekly | Sales manager | Vault (CRM) | Automated email |
| Pipeline review | Weekly | Sales team + leadership | Pipeline (Orchestrator) | Meeting + deck |
| Revenue report | Monthly | Leadership | Ledger (RevOps) | Dashboard + narrative |
| Unit economics | Monthly | CFO, Head of Revenue | Ledger (RevOps) | Spreadsheet + analysis |
| Client health | Monthly | CS team + leadership | Bond (CS) | Dashboard + report |
| NPS report | Quarterly | All leadership | Bond (CS) | Report + action plan |
| Forecast | Monthly | Board, leadership | Pipeline (Orchestrator) | Three-scenario model |
| QBR (per client) | Quarterly | Client + CS team | Bond (CS) | Custom deck |
| Commercial review | Quarterly | Full commercial team | Pipeline (Orchestrator) | Full-day session |

---

## KPI Reference Guide

### Revenue KPIs
| KPI | Formula | Target | Warning |
|-----|---------|--------|---------|
| ARR | MRR × 12 | Growing MoM | Declining |
| MRR Growth Rate | (MRR_new - MRR_old) / MRR_old | > 5% MoM | < 2% |
| New Logo Revenue | Sum of new customer MRR | Per plan | Below 50% plan |
| Expansion Revenue | Sum of upsell + cross-sell MRR | > 30% of new | < 10% |
| Average Revenue Per Account | Total ARR / Total Accounts | Growing | Declining |

### Sales KPIs
| KPI | Formula | Target | Warning |
|-----|---------|--------|---------|
| Win Rate | Won / (Won + Lost) | > 25% | < 15% |
| Sales Cycle | Avg days from opportunity to close | < 90 days | > 120 days |
| Pipeline Coverage | Pipeline / Quota | 3-5x | < 2.5x |
| Average Deal Size | Won Revenue / Won Deals | Growing | Declining |
| Activities per Rep | Calls + emails + meetings per week | Per benchmark | < 50% of benchmark |
| Quota Attainment | Revenue / Quota | > 80% | < 60% |

### Marketing KPIs
| KPI | Formula | Target | Warning |
|-----|---------|--------|---------|
| MQL Volume | Leads meeting MQL criteria | Per plan | < 70% plan |
| MQL → SQL Rate | SQLs / MQLs | > 30% | < 15% |
| Cost per MQL | Marketing spend / MQLs | Decreasing | Increasing MoM |
| Marketing Sourced Pipeline | Pipeline from marketing leads | > 40% | < 20% |
| Content Engagement | Views, downloads, shares | Growing | Declining |

### CS KPIs
| KPI | Formula | Target | Warning |
|-----|---------|--------|---------|
| NRR | (Start ARR + Expansion - Contraction - Churn) / Start ARR | > 110% | < 100% |
| GRR | (Start ARR - Contraction - Churn) / Start ARR | > 90% | < 85% |
| Logo Retention | (Start Logos - Churned) / Start Logos | > 90% | < 85% |
| NPS | % Promoters - % Detractors | > 50 | < 30 |
| Time to Value | Days from contract to first milestone | < 30 days | > 60 days |
| Health Score (avg) | Average across portfolio | > 80 | < 65 |
| Expansion Rate | Accounts expanded / Eligible accounts | > 20% | < 10% |

---

## Attribution Models

### Multi-Touch Attribution Options
| Model | Description | Best For |
|-------|-----------|---------|
| **First Touch** | 100% credit to first interaction | Understanding awareness channels |
| **Last Touch** | 100% credit to last interaction | Understanding conversion drivers |
| **Linear** | Equal credit across all touches | Simple, fair distribution |
| **Time Decay** | More credit to recent touches | Longer sales cycles |
| **U-Shaped** | 40% first, 40% last, 20% middle | Balanced acquisition view |
| **W-Shaped** | 30% first, 30% MQL, 30% SQL, 10% middle | Full-funnel visibility |
| **Custom/Data-Driven** | ML-based weighting | Large data sets, sophisticated teams |

### Recommended Approach (Agency)
```
START WITH: U-Shaped (first touch + last touch emphasis)
  → Understand what GENERATES awareness
  → Understand what CONVERTS to pipeline

EVOLVE TO: W-Shaped when MQL/SQL processes are mature
  → Add visibility to middle-of-funnel influence

GOAL: Understand which investments drive pipeline, not just traffic
```

---

## Win/Loss Analysis

### Metodologia Estruturada
A win/loss analysis é pesquisa sistemática para entender POR QUE deals são ganhos ou perdidos — não achismos.

**Processo:**
1. Selecionar 3-5 wins e 3-5 losses por mês para análise
2. Entrevistar dentro de 30 dias da decisão (memória fresca)
3. Conduzir entrevistas de 30-45 min com script estruturado
4. Categorizar e pontuar (scoring framework abaixo)
5. Análise trimestral de padrões agregados

**Perguntas-chave da entrevista:**
| Área | Pergunta |
|------|---------|
| Processo decisório | "Caminhe por como vocês tomaram essa decisão. Quem estava envolvido?" |
| Critérios de avaliação | "Quais foram os 3 principais fatores na decisão?" |
| Nossos pontos fortes | "O que fizemos bem durante o processo?" |
| Nossas fraquezas | "Onde ficamos aquém das expectativas?" |
| Comparação competitiva | "O que [concorrente] ofereceu que foi atraente?" |
| Momento decisivo | "Houve um momento que definiu a decisão?" |

**Scoring por dimensão (1-5):**
- Fit da solução
- Competitividade do preço
- Qualidade do relacionamento
- Qualidade da proposta/apresentação
- References e provas
- Velocidade de resposta
- Brand e reputação

**Insights típicos (e como interpretar):**
- "Ganhamos pelo relacionamento com o AE" → bom, mas não escalável
- "Perdemos por pricing" → frequentemente mascara falha de value selling
- "O concorrente tinha feature X" → validar se é real ou desculpa para não comprar
- "O processo de compra com vocês foi confuso" → problema de sales process, não produto

### Pattern Detection Trimestral
Agregar dados para detectar:
- **Win patterns:** O que nossos wins têm em comum? (ICP, deal size, situação competitiva)
- **Loss patterns:** Onde perdemos consistentemente? (concorrente, faixa de preço, gap de feature)
- **Trending:** Os padrões estão mudando? Por quê?

---

## Cohort Analysis

### Para que Serve
Cohort analysis agrupa clientes por data de aquisição para medir comportamento ao longo do tempo — revela se a qualidade dos clientes está melhorando ou piorando.

### Cohort de Revenue
```
Pergunta: O MRR do cohort cresce (NRR>100%) ou diminui (churn)?

| Cohort     | Mês 1   | Mês 3   | Mês 6   | Mês 12  |
|------------|---------|---------|---------|---------|
| Jan/2025   | R$100K  | R$105K  | R$115K  | R$125K  | → NRR ~125% (excelente)
| Mar/2025   | R$80K   | R$78K   | R$72K   | R$65K   | → NRR ~81% (problema)
| Jun/2025   | R$120K  | R$126K  | R$135K  | —       | → On track

Comparar cohorts: clientes de 2024 vs 2025 — melhorando?
```

### Cohort de Win Rate
```
Win rate de deals criados em Q1 vs Q2 vs Q3:
  → Identificar tendências (win rate melhorando ou piorando?)
  → Correlacionar com mudanças (novo pitch, novo produto, nova concorrência)
  → Cohort que entra no pipeline em Dezembro tende a fechar em Março?
```

---

## AI Forecasting

### Como Funciona
Modelos de AI para forecasting usam sinais além do que humanos conseguem processar manualmente.

**Sinais usados por plataformas como Clari, Aviso, BoostUp:**
- CRM data (stage, value, age, activities)
- Email engagement (opens, replies, sentiment analysis)
- Calendar data (meetings scheduled, rescheduled, cancelled)
- Call data via Gong/Chorus (duration, sentiment, next steps mentioned, competitor mentions)
- Website activity (pricing page views, documentation access, frequency)
- Champion engagement level (responsiveness, meeting attendance)
- Historical patterns (similar deals no passado, sazonalidade)

**Acurácia comparada:**
| Método | MAPE Típico |
|--------|------------|
| Rep call (gut feeling) | 25-35% |
| Stage-based weighted | 20-30% |
| Historical patterns | 15-25% |
| AI multi-signal | 8-15% |

**MAPE (Mean Absolute Percentage Error):**
```
MAPE = (1/n) × SUM(|Forecast - Actual| / Actual) × 100

  < 10%: Excelente
  10-20%: Bom
  20-30%: Razoável
  > 30%: Problemático — investigar processo de forecasting
```

### Forecast Categories
| Categoria | Definição | Confiança | Inclui no Forecast? |
|-----------|-----------|-----------|---------------------|
| **Commit** | Rep garante que fecha no período | >90% | Sim — base |
| **Best Case** | Pode fechar se tudo der certo | 50-80% | Sim — upside |
| **Pipeline** | Em trabalho, sem comprometimento | 20-50% | Com desconto |
| **Upside** | Possível mas não provável | <20% | Não |

---

## References
- SaaStr — SaaS metrics benchmarks
- Winning by Design — Revenue architecture metrics
- ChartMogul — Subscription analytics methodology
- Baremetrics — MRR and churn calculation standards
- Clari — Revenue operations analytics (MAPE research)
- Gong Labs — Conversation intelligence data (gong.io/labs)
- Jordan, J. — *Cracking the Sales Management Code* (McGraw-Hill, 2011)
