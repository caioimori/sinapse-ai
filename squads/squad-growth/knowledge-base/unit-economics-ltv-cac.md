# Knowledge Base: Unit Economics — LTV, CAC & Growth Finance

> Fonte: Bessemer Venture Partners benchmarks, SaaStr, Lenny Rachitsky, OpenView Partners

## Por que Unit Economics Importa para Growth

Unit economics e a analise da rentabilidade de cada unidade de negocio (tipicamente, um cliente). Growth sem unit economics saudavel e crescimento insustentavel — a empresa perde dinheiro a cada cliente adquirido e escalar piora o problema.

**Regra fundamental:** LTV/CAC >= 3:1 para growth sustentavel. Payback < 12 meses para SaaS.

---

## Metricas Fundamentais

### CAC — Customer Acquisition Cost

```
CAC = Total gasto em aquisicao (marketing + sales) / Numero de novos clientes

CAC Blended = Inclui todos os canais (organico + pago + sales)
CAC Paid = Apenas canais pagos
CAC por canal = Gasto no canal / Clientes adquiridos pelo canal
```

**O que incluir no calculo de CAC:**
- Gasto em ads (Google, Meta, LinkedIn, etc.)
- Salarios de marketing e sales
- Software de marketing (HubSpot, Salesforce, etc.)
- Eventos, conferencias, PR
- Overhead de times de aquisicao

**CAC benchmarks (SaaS, 2025 — Bessemer/OpenView):**
| Segmento | CAC tipico | Payback tipico |
|----------|-----------|----------------|
| SMB (ACV < $5K) | $200–$500 | 6–12 meses |
| Mid-Market (ACV $5K–$50K) | $2K–$10K | 12–24 meses |
| Enterprise (ACV > $50K) | $20K–$100K+ | 18–36 meses |
| PLG (self-serve) | $50–$200 | 3–6 meses |

---

### LTV — Lifetime Value

```
LTV = ARPU × Gross Margin × (1 / Monthly Churn Rate)

ou para calculos mais precisos:
LTV = ARPU × Gross Margin × Average Customer Lifetime

onde:
Average Customer Lifetime = 1 / Annual Churn Rate (em anos)
```

**Variantes do LTV:**
| Variante | Formula | Quando usar |
|----------|---------|-------------|
| **Simple LTV** | ARPU / Churn Rate | Estimativa rapida |
| **Gross Margin LTV** | (ARPU × Gross Margin) / Churn | Inclui margem — mais preciso |
| **LTV com expansion** | Inclui upsell/cross-sell projetado | Para negocio com NRR > 100% |
| **Predictive LTV** | ML sobre dados historicos de cohort | Mais preciso, requer dados |
| **BG/NBD Model** | Modelo probabilistico (Peter Fader) | E-commerce nao subscricao |

**Exemplo de calculo:**
```
ARPU = R$500/mes
Gross Margin = 75%
Monthly Churn = 2%

LTV = R$500 × 0.75 / 0.02 = R$18.750
CAC = R$2.000
LTV/CAC = 9.4 (excelente)
Payback = R$2.000 / (R$500 × 0.75) = 5.3 meses
```

---

### LTV/CAC Ratio

```
LTV/CAC Ratio = LTV / CAC

Benchmarks:
  < 1:1    = Destroi valor (perde dinheiro a cada cliente)
  1:1 – 3:1 = Sustentavel mas tight (pouca margem)
  >= 3:1   = Saudavel (regra de ouro de SaaS)
  >= 5:1   = Potencial de crescimento acelerado
```

**Interpretacao por fase da empresa:**
| Fase | LTV/CAC ideal | Contexto |
|------|--------------|----------|
| Seed | 1:1–2:1 aceitavel | Ainda aprendendo o canal |
| Serie A | >= 2:1 | Precisa mostrar caminho para 3:1 |
| Serie B+ | >= 3:1 | Esperado para levantamento |
| Growth maduro | >= 5:1 | Pode pisar no acelerador |

---

### Payback Period

```
Payback Period = CAC / (ARPU × Gross Margin)

Em meses. Meta: < 12 meses para SaaS (< 6 meses para PLG self-serve)
```

**Por que payback importa:**
- Empresas com payback curto precisam de menos capital para crescer
- Payback > 24 meses requer muito capital externo para escalar
- Em mercados capitais apertados (2023-2025), payback < 12 meses e exigido por investidores

---

### MRR/ARR e Crescimento

```
MRR = Monthly Recurring Revenue
ARR = Annual Recurring Revenue = MRR × 12

MRR = New MRR + Expansion MRR - Churned MRR - Contracted MRR

MRR Growth Rate = (MRR atual - MRR periodo anterior) / MRR periodo anterior × 100
```

**Benchmarks de crescimento ARR (SaaS — Bessemer Cloud Index):**
| ARR Stage | Target YoY Growth |
|-----------|------------------|
| $1M–$5M ARR | >200% |
| $5M–$20M ARR | >100% |
| $20M–$50M ARR | >75% |
| $50M–$100M ARR | >50% |
| $100M+ ARR | >30% |

---

## Net Revenue Retention (NRR) — A Metrica Mais Poderosa

```
NRR = (MRR inicio do periodo - Churn MRR - Contraction MRR + Expansion MRR) / MRR inicio × 100

NRR > 100% = Crescimento mesmo sem adquirir novos clientes
```

**Por que NRR > 100% e o Santo Graal:**
Uma empresa com NRR de 120% e churn de 0 cresceria 20% ao ano apenas com clientes existentes. Isso significa que sales pode focar em crescimento incremental, nao so em reposicao de churn.

**Decomposicao do NRR:**
```
NRR = GRR + Expansion Rate - 100%

GRR (Gross Revenue Retention) = 1 - Revenue Churn Rate
Expansion Rate = Expansion MRR / MRR inicio
```

**Benchmarks NRR (Bessemer, 2025):**
| Tier | NRR |
|------|-----|
| World-class | > 130% |
| Excelente | 120%–130% |
| Bom | 100%–120% |
| Aceitavel (SMB) | 90%–100% |
| Sinal de alerta | < 90% |

---

## Rule of 40

Metrica de eficiencia para SaaS que balanceia crescimento e rentabilidade.

```
Rule of 40 = Revenue Growth Rate (%) + EBITDA Margin (%)

>= 40 = Saudavel
>= 60 = Excelente
>= 80 = Excepcional (Stripe, Snowflake pre-IPO)
```

**Interpretacao:** Uma empresa pode escolher entre crescer mais e ter margens menores, ou crescer menos e ter margens maiores. A Rule of 40 permite comparar empresas com estrategias diferentes.

**Armadilha:** Crescer 100% com -60% EBITDA = 40. Mas uma empresa com -60% EBITDA esta destruindo caixa — a sustentabilidade importa.

---

## Cohort Analysis para CAC/LTV

Calcular LTV por cohort de aquisicao revela quais canais e periodos geraram os melhores clientes.

```sql
-- LTV historico por canal de aquisicao
SELECT
  u.acquisition_channel,
  DATE_TRUNC('month', u.created_at) AS cohort_month,
  COUNT(DISTINCT u.id) AS users,
  SUM(p.amount) / COUNT(DISTINCT u.id) AS ltv_per_user,
  SUM(p.amount) / NULLIF(SUM(u.acquisition_cost), 0) AS ltv_cac_ratio
FROM users u
LEFT JOIN payments p ON u.id = p.user_id
GROUP BY 1, 2
ORDER BY 1, 2;
```

**Analise de cohort de LTV revela:**
- Quais canais trazem clientes com maior LTV
- Sazonalidade: cohorts de dezembro vs marco
- Impacto de mudancas de produto na retencao de receita
- Tendencia: LTV de cohorts recentes vs historicos

---

## Unit Economics por Segmento

Segmentar unit economics por tipo de cliente evita decisoes baseadas em medias que escondem heterogeneidade.

**Segmentacoes recomendadas:**
1. **Tamanho da empresa** (SMB vs Mid-Market vs Enterprise)
2. **Vertical/setor** (fintech vs edtech vs ecommerce)
3. **Canal de aquisicao** (PLG self-serve vs sales vs partner)
4. **Regiao** (Brasil vs LATAM vs global)
5. **Plano** (freemium → basic → pro → enterprise)

**Insight chave:** Muitas empresas descobrem que 20% dos clientes geram 80% do LTV. Identificar esse segmento e direcionar CAC para ele e o maior alavancador de unit economics.

---

## Churn Rate Benchmarks (Bessemer/SaaStr — 2025)

| Segmento | Monthly Logo Churn | Annual Logo Churn |
|----------|-------------------|------------------|
| Enterprise (>$100K ACV) | <0.5% | <5% |
| Mid-Market | 0.5%–1.0% | 5%–10% |
| SMB | 1%–3% | 10%–30% |
| Consumer subscription | 3%–8% | 30%–70% |

**Regra pratica:** Se churn mensal > 3% em SaaS B2B, nao vale investir pesado em aquisicao — o balde esta furado.

---

## ARPU e Expansao de Receita

```
ARPU = Receita total / Total de clientes ativos

MoM ARPU change = (ARPU atual - ARPU mes anterior) / ARPU mes anterior × 100
```

**Estrategias de expansao de ARPU:**
| Estrategia | Descricao | Exemplo |
|-----------|-----------|---------|
| **Upsell** | Upgrade para plano superior | Basic → Pro → Enterprise |
| **Cross-sell** | Vender produto complementar | CRM + Email marketing |
| **Seat expansion** | Mais usuarios na conta | 5 seats → 20 seats |
| **Usage expansion** | Mais consumo | API calls, storage, transacoes |
| **Feature unlock** | Add-ons premium | Advanced analytics, white-label |
