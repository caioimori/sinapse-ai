# Revenue Architecture Models

## Unit Economics Fundamentals

### Customer Acquisition Cost (CAC)
```
CAC = Total Sales & Marketing Spend / New Customers Acquired

Components:
  Sales costs: salaries, commissions, tools, travel
  Marketing costs: campaigns, content, events, tools
  Overhead allocation: management, operations support

Benchmark (B2B Services):
  CAC < R$5K: Low-touch, efficient
  CAC R$5-25K: Mid-market typical
  CAC > R$25K: Enterprise, acceptable if LTV justifies

Blended vs Organic vs Paid CAC:
  Track separately to understand channel efficiency
```

### Lifetime Value (LTV)
```
LTV = ARPA × Gross Margin % × Average Customer Lifespan

Simplified:
  LTV = ARPA × Gross Margin % / Churn Rate

Example:
  ARPA: R$10K/month
  Gross Margin: 65%
  Monthly Churn: 2%
  LTV = R$10K × 0.65 / 0.02 = R$325K
```

### LTV:CAC Ratio
```
Target: ≥ 3:1 (minimum), 5:1 (healthy), >8:1 (may be underinvesting)

Interpretation:
  < 1:1  → Losing money on every customer (crisis)
  1-3:1  → Unsustainable growth
  3-5:1  → Healthy, efficient growth
  5-8:1  → Strong unit economics
  > 8:1  → Potentially underinvesting in growth
```

### CAC Payback Period
```
CAC Payback = CAC / (ARPA × Gross Margin %)

Target: < 18 months (ideal < 12)

Example:
  CAC: R$30K
  ARPA: R$5K/month
  Gross Margin: 60%
  Payback = R$30K / (R$5K × 0.60) = 10 months ✓
```

---

## SaaS / Recurring Revenue Metrics

### ARR / MRR
```
MRR = Sum of all monthly recurring revenue
ARR = MRR × 12

MRR Components:
  New MRR: From new customers this month
  Expansion MRR: Upgrades, upsells, cross-sells
  Contraction MRR: Downgrades (negative)
  Churned MRR: Cancelled customers (negative)
  Reactivation MRR: Win-backs (positive)

Net New MRR = New + Expansion + Reactivation - Contraction - Churn
```

### Net Revenue Retention (NRR)
```
NRR = (Beginning ARR + Expansion - Contraction - Churn) / Beginning ARR × 100

Target: > 110% (world-class: 120-140%)

Interpretation:
  < 80%:  Severe retention problem
  80-100%: Growing only through new logos
  100-110%: Healthy, existing base stable
  110-130%: Excellent, base growing organically
  > 130%: Exceptional (rare, often PLG + expansion)

Agency context:
  Target NRR 110-120% through scope expansion and tier upgrades
```

### Gross Revenue Retention (GRR)
```
GRR = (Beginning ARR - Contraction - Churn) / Beginning ARR × 100

Target: > 90% (cannot exceed 100% by definition)

Difference from NRR:
  GRR excludes expansion — pure retention measure
  If GRR < 85%: fix churn BEFORE investing in expansion
```

---

## Sales Efficiency Metrics

### Magic Number
```
Magic Number = (Net New ARR this quarter - Net New ARR prior quarter) × 4 / S&M Spend (prior quarter)

Annualized formula: normalizes quarterly growth to annual rate for comparison.

Interpretation:
  > 0.75: Efficient — invest more aggressively
  0.5-0.75: Acceptable — optimize before scaling
  0.25-0.5: Inefficient — fix unit economics before scaling
  < 0.25: Broken — stop scaling, diagnose fundamentals
```

### Sales Velocity
```
Sales Velocity = (Opportunities × Win Rate × ACV) / Sales Cycle Length (days)

Example:
  50 opportunities × 25% win rate × R$60K ACV / 90 days
  = R$750K / 90 = R$8,333 per day

Levers to improve:
  1. More opportunities (pipeline generation)
  2. Higher win rate (sales enablement)
  3. Larger deal size (offer design, upsell)
  4. Shorter cycle (process optimization)
```

### Pipeline Coverage
```
Pipeline Coverage = Total Weighted Pipeline / Quota

Target: 3-5x coverage

Example:
  Quota: R$500K
  Pipeline: R$2M weighted
  Coverage: 4x ✓

If coverage < 3x: Pipeline generation is the bottleneck
If coverage > 5x: May indicate poor qualification (bloated pipeline)
```

---

## Revenue Leak Analysis (Clari Framework)

### Six Categories of Revenue Leaks
| Leak Category | Description | Typical Loss | Detection |
|--------------|-------------|-------------|-----------|
| **Pipeline Leaks** | Deals slipping, going dark, or dying | 3-5% of pipeline | CRM stage aging analysis |
| **Pricing Leaks** | Excessive discounting, poor negotiation | 2-4% of revenue | Discount analysis vs list price |
| **Contracting Leaks** | Scope creep, unfavorable terms | 1-3% of margin | Contract vs proposal comparison |
| **Expansion Leaks** | Missed upsell/cross-sell opportunities | 3-5% of base ARR | Health score vs expansion rate |
| **Churn Leaks** | Preventable churn, save-play failures | 2-5% of ARR | Churn reason analysis |
| **Velocity Leaks** | Slow cycles reducing time-value of money | 1-2% of revenue | Cycle time vs benchmark |

### Total Revenue Leak
```
Industry average: ~14.9% revenue leaked (Clari research)

Revenue Leak Assessment:
  Gross Revenue: R$ __________
  Pipeline Leaks: - R$ __________ (__)%
  Pricing Leaks: - R$ __________ (__)%
  Contracting Leaks: - R$ __________ (__)%
  Expansion Leaks: - R$ __________ (__)%
  Churn Leaks: - R$ __________ (__)%
  Velocity Leaks: - R$ __________ (__)%
  ─────────────────────────────────
  Total Leakage: - R$ __________ (__)%
  Recoverable Revenue: R$ __________ (__)%
```

---

## Revenue Architecture Models

### Bow Tie Funnel (Jacco van der Kooij)
```
Traditional Funnel (one-way):
  Awareness → Interest → Decision → Purchase → END

Bow Tie Funnel (full lifecycle):
  LEFT SIDE (Acquisition):
    Awareness → Education → Selection → Purchase

  CENTER (Land):
    Contract signed — the "knot" of the bow tie

  RIGHT SIDE (Expansion):
    Onboarding → Adoption → Expansion → Advocacy

Key insight: Revenue doesn't stop at "Purchase" — the right side
of the bow tie (retention + expansion) is where most revenue lives
for recurring business models.
```

### Predictable Revenue Model (Aaron Ross)
```
Three specialized roles:
  1. SDR (Sales Development Rep): Outbound prospecting
  2. AE (Account Executive): Closing deals
  3. CSM (Customer Success Manager): Retention + expansion

Pipeline sources:
  Seeds: Referrals, word-of-mouth (highest conversion)
  Nets: Inbound marketing (medium conversion)
  Spears: Outbound prospecting (lowest conversion, most scalable)

Key principle: Separate prospecting from closing.
Never have closers doing their own prospecting.
```

### Sales Acceleration Formula (Mark Roberge)
```
Four formulas:
  1. Hiring Formula: Traits that predict success → scorecard-based hiring
  2. Training Formula: Methodology-based onboarding → predictable ramp
  3. Management Formula: Metrics-driven coaching → consistent performance
  4. Demand Gen Formula: Content-led inbound → scalable pipeline

Revenue = Headcount × Ramp × Quota × Attainment × ACV
```

---

## Forecasting Models

### Weighted Pipeline Forecast
```
For each deal:
  Weighted Value = Deal Value × Stage Probability

Stage Probabilities (typical):
  Discovery: 10%
  Qualification: 20%
  Solution Design: 40%
  Proposal: 60%
  Negotiation: 80%
  Verbal Commit: 90%

Total Forecast = Sum of all weighted values
```

### Three-Scenario Forecast
```
Conservative (60% confidence):
  Only committed deals + historical minimum new

Base (50% confidence):
  Committed + weighted pipeline + trend extrapolation

Optimistic (30% confidence):
  Base + upside deals + expansion potential

Report all three. Manage to base, plan resources for conservative.
```

---

## Pipeline Velocity Formula (Completa)

### Formula e Componentes
```
Pipeline Velocity = (# Oportunidades × Win Rate × Deal Size Médio) / Ciclo de Venda (dias)

Resultado: R$ gerados por dia

Exemplo:
  100 oportunidades × 25% win rate × R$50.000 ACV / 60 dias = R$20.833/dia

Para atingir R$1M/mês (R$33.333/dia):
  Com 100 opps, 25% win rate → precisa de ACV R$80K ou ciclo de 40 dias
  Com R$50K ACV, 25% win rate → precisa de 160 opps ou ciclo de 37 dias
```

### Os 4 Alavancas da Pipeline Velocity
| Alavanca | Impacto | Dificuldade | Tática |
|---------|---------|-------------|--------|
| # Oportunidades | +20% pipeline = +20% receita | Média | Pipeline generation, outbound, inbound |
| Win Rate | +5pp win rate ≠ +5% receita (multiplicativo) | Alta | Sales methodology, enablement, qualification |
| Deal Size (ACV) | Mais impacto que parece | Alta | Upsell strategy, offer design, value selling |
| Ciclo de Venda | Redução de 30 dias = aceleração de caixa | Média | Process optimization, champion activation, urgency |

### Diagnóstico de Gargalo
```
Se pipeline baixo → problema de GERAÇÃO (outbound, inbound, referral)
Se win rate baixo → problema de QUALIFICATION ou METODOLOGIA
Se ACV baixo → problema de OFERTA ou VALUE SELLING
Se ciclo longo → problema de PROCESSO ou CHAMPION
```

---

## RevOps Framework

### O que é RevOps
Revenue Operations é a função que alinha processos, sistemas e dados de Sales, Marketing e Customer Success sob uma estrutura operacional única. Empresas com RevOps formalizado reportam **36% maior crescimento de receita** (Forrester/UnifyGTM 2025). Em 2025, 79% das organizações B2B possuem alguma forma de RevOps (84% em enterprise, 52% em mid-market). O título "VP of Revenue Operations" cresceu 300% nos últimos 18 meses.

### Os 3 Pilares do RevOps

**Pilar 1 — Process**
Padronizar e otimizar o revenue cycle completo:
- Lead-to-Close (Marketing → Sales)
- Close-to-Onboard (Sales → CS)
- Onboard-to-Expand (CS → Sales/Marketing)
- Churn-to-Winback (CS → Marketing)

**Pilar 2 — Platform (Tech Stack)**
Unificar ou integrar as ferramentas:
- CRM como single source of truth (Salesforce, HubSpot)
- Marketing automation (HubSpot, Marketo, Pardot)
- Sales engagement (Outreach, Salesloft, Apollo)
- CS platform (Gainsight, Totango, ChurnZero)
- Revenue intelligence (Gong, Clari, 6sense)
- Data warehouse (Snowflake, BigQuery) para analytics unificado

**Pilar 3 — People**
Estrutura organizacional:
- **VP/Head of RevOps** — Reports para CRO ou CEO
- **Sales Ops** — CRM admin, territory planning, comp plans, forecasting
- **Marketing Ops** — Campaign ops, lead scoring, attribution, tech stack
- **CS Ops** — Health scoring, renewals ops, expansion ops
- **Revenue Analytics** — Cross-functional analytics, dashboards, BI

### Data Model Unificado — Definições Críticas
| Definição | Exemplo | Quem Define |
|-----------|---------|-------------|
| Lead | Indivíduo que demonstrou interesse | Marketing + Sales conjuntamente |
| MQL | Lead com score >= X e fit >= Y | Marketing Ops com validação de Sales |
| SQL | MQL aceito por Sales + qualificado via MEDDIC | Sales com critérios de RevOps |
| Opportunity | Deal com Champion + Budget + Timeline mapeados | Sales Ops |
| Customer | Contrato assinado, onboarding iniciado | CS Ops |
| Expansion | Upsell/cross-sell de cliente ativo | CS + Sales |
| Churn | Contrato não renovado ou cancelado | CS Ops |

### RevOps Maturity Model (5 Níveis)
| Nível | Descrição | Sinais Reconhecíveis |
|-------|-----------|---------------------|
| **1 — Ad Hoc** | Sem estrutura. Cada time opera independente | Planilhas, CRM subutilizado, dados conflitantes |
| **2 — Defined** | Processos básicos, CRM implementado | SLA Marketing-Sales existe mas não é medido |
| **3 — Managed** | RevOps formalizado, métricas consistentes | Dashboards compartilhados, forecast regular |
| **4 — Optimized** | Data-driven, automation avançada | Propensity scoring, automated routing, alertas |
| **5 — Predictive** | AI-powered revenue engine | Predictive forecasting, dynamic territories, AI coaching |

### Métricas RevOps — Leading vs. Lagging
**Leading Indicators (controle agora = impacto em 3-6 meses):**
- Pipeline Generation Rate (valor novo de pipeline/semana)
- Pipeline Coverage Ratio (pipeline/quota — meta: 3-4x)
- Lead Velocity Rate (crescimento MoM de leads qualificados)
- Activity Metrics (calls, emails, meetings — por rep)
- Discovery Meetings Booked (proxy de pipeline futuro)

**Lagging Indicators (resultado do trabalho passado):**
- Win Rate
- Average Deal Size (ACV)
- Sales Cycle Length
- Net Revenue Retention (NRR) — meta: >110% (idealmente 110-130%)
- CAC Payback Period — meta: <18 meses
- LTV:CAC Ratio — meta: >3:1

**Princípio:** Gerencie leading indicators. Celebre (ou lamente) lagging indicators.

---

## CPQ & Discount Governance

### O que é CPQ
Configure, Price, Quote — processo/sistema que automatiza a geração de propostas e contratos.

**Quando implementar CPQ:**
- Produto tem muitas opções/configurações (bundles, tiers, add-ons)
- Pricing é complexo (volumes, descontos por volume, contratos multi-year)
- Aprovações de desconto precisam de workflow auditável
- Contratos precisam de termos padronizados
- Quando contratos customizados > 30% dos deals
- Quando o processo de aprovação atrasa deals em dias

**Ferramentas CPQ:** Salesforce CPQ, DealHub, PandaDoc, Proposify, Qwilr

### Discount Governance Framework
Descontos destroem margem se não governados. A regra de ouro: **nunca dar desconto sem pedir algo em troca**.

| Desconto | Autoridade | Requer | Em Troca (exigir) |
|----------|-----------|--------|-------------------|
| 0-10% | AE pode aprovar | Justificativa no CRM | Assinatura rápida, referral |
| 11-20% | Sales Manager deve aprovar | Business case escrito | Multi-year, case study |
| 21-30% | VP Sales deve aprovar | CFO awareness | Prepayment, co-marketing |
| >30% | CRO/CEO deve aprovar | Exceção documentada, precedente | Referência estratégica, exclusividade |

**Regras adicionais:**
- Primeiro desconto define o "piso" para todas as renovações futuras — cuidado
- Medir "Discount Rate" médio por rep, por segmento, por trimestre
- Desconto não é estratégia — é falha de Value Selling
- Análise de impacto: 10% de desconto em deal de R$100K = R$10K de margem destruída

### Deal Desk
Função centralizada que revisa e aprova deals complexos.

**Funções do Deal Desk:**
- Aprovação de pricing não-standard
- Estruturação de contratos complexos (multi-year, ramp deals, custom terms)
- Alinhamento entre Sales, Finance, Legal e Product
- Manter consistência de termos e precedentes
- Analytics de deal profitability

---

## References
- Van der Kooij, J. — *Revenue Architecture* (Winning by Design, 2024)
- Ross, A. — *Predictable Revenue* (2011)
- Roberge, M. — *The Sales Acceleration Formula* (2015)
- Clari — Revenue Leak research (2023)
- Diorio, S. & Hummel, C. — *Revenue Operations* (Wiley, 2022)
- Forrester/UnifyGTM — RevOps Revenue Impact Study (2025)
- Tunguz, T. & Blossom, F. — *Winning with Data* (SaaS benchmarks)
- SaaStr — Industry benchmark data
