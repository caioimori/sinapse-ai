# Financas para Startups & Venture Capital

> Rodadas de financiamento, unit economics, cap table, diluicao, VCs brasileiros, valuation de startups, metricas SaaS. Referencia completa para o ecossistema brasileiro.

---

## 1. O Ecossistema de Venture Capital no Brasil

| Ano | Investimento VC BR | Deals | Observacao |
|-----|-------------------|-------|------------|
| 2019 | ~US$ 2.7B | ~280 | Pre-pandemia |
| 2020 | ~US$ 3.5B | ~300 | Aceleracao digital |
| 2021 | ~US$ 9.4B (pico) | ~700+ | Boom pos-pandemia |
| 2022 | ~US$ 3.9B | ~500 | Inicio do funding winter |
| 2023 | ~US$ 1.8B | ~228 | Fundo do ciclo |
| 2024 | ~US$ 2.3B / R$9B | ~123 | Recuperacao, ticket medio sobe; Q4 forte (+59% YoY) |
| 2025-26 | Estimativa US$3-4B | Crescente | Foco em IA, fintechs, agtech |

**Brasil + Mexico = 70% do VC LATAM.**

Fonte: LAVCA, Distrito, Crunchbase, Finsiders

---

## 2. Rodadas de Financiamento

| Rodada | Investimento Tipico (BR) | Valuation Tipico (BR) | Investidores | Metricas-Chave |
|--------|--------------------------|----------------------|-------------|----------------|
| **Pre-Seed** | R$ 200K - 1M | R$ 1-5M | Anjos, aceleradoras (Y Combinator, Distrito, Liga) | Equipe, problema, TAM |
| **Seed** | R$ 1-5M | R$ 5-20M | Micro VCs, angels, aceleradoras | MVP, early traction, unit economics |
| **Series A** | R$ 10-40M | R$ 40-150M | VCs (Kaszek, Monashees, QED) | PMF, revenue growth >2x, CAC/LTV |
| **Series B** | R$ 40-150M | R$ 150-500M | VCs + growth equity | Escala, eficiencia, path to profitability |
| **Series C+** | R$ 150M+ | R$ 500M+ | Growth equity, PE, crossover (Tiger, SoftBank) | Dominancia de mercado, unit economics provados |
| **IPO / Direct Listing** | Variavel | R$ 1B+ (unicorn) | Mercado publico (B3, NYSE, NASDAQ) | Sustentabilidade, governance, disclosure |

### Instrumentos de Investimento

| Instrumento | Descricao | Quando Usar |
|-------------|-----------|-------------|
| **SAFE** (Simple Agreement for Future Equity) | Acordo de equity futuro sem juros, sem prazo | Pre-seed, seed — padrao Y Combinator |
| **Nota Conversivel** | Divida que converte em equity (com desconto/valuation cap) | Seed — quando fundadores querem adiar valuation |
| **Preferred Stock** | Acoes preferenciais com liquidation preference | Series A em diante |
| **ESOP** | Employee Stock Option Plan — pool de opcoes para equipe | 10-15% do cap table reservado |
| **Warrants** | Direito de comprar acoes a preco pre-definido | Investidores estrategicos, dívida conversivel |

---

## 3. Metricas SaaS — Referencia Completa

| Metrica | Formula | Benchmark Early Stage | Benchmark Growth Stage |
|---------|---------|----------------------|------------------------|
| **MRR** | Soma das assinaturas mensais | Crescimento > 15% MoM | Crescimento > 5-10% MoM |
| **ARR** | MRR × 12 | US$1M ARR = milestone relevante | > US$10M (Series A) |
| **Churn Rate** | Clientes perdidos / Total | < 5% mensal (SMB) | < 1% mensal (Enterprise) |
| **Net Revenue Retention** | MRR final da coorte / MRR inicial | > 100% (nao encolhe) | > 120% (excelente) |
| **Gross Margin** | (Receita - COGS) / Receita | > 60% | > 70% (SaaS saudavel) |
| **CAC** | (Sales + Marketing) / Novos Clientes | — | Payback < 18 meses |
| **LTV** | ARPA × GM / Churn | — | LTV/CAC > 3x |
| **CAC Payback** | CAC / (ARPA × GM) | < 24 meses | < 18 meses |
| **Rule of 40** | Growth % + EBITDA Margin % | > 40% (excelente) | > 40% |
| **Burn Multiple** | Net Burn / Net New ARR | < 2x (eficiente) | < 1x (excelente) |
| **Runway** | Caixa / Monthly Burn | > 18 meses (seguro) | > 12 meses |
| **Magic Number** | Net New ARR / S&M spend (q anterior) | > 0.75 (eficiente) | > 1.0 (escalar) |

---

## 4. Unit Economics — Formula Completa

```
LTV (Lifetime Value):
  LTV = ARPA × Gross Margin × Average Lifetime
  LTV = ARPA × Gross Margin × (1 / Monthly Churn Rate)

  Exemplo:
    ARPA: R$ 500/mes
    Gross Margin: 80%
    Monthly Churn: 3%
    LTV = 500 × 0.80 × (1/0.03) = R$ 13.333

CAC (Customer Acquisition Cost):
  CAC = (Sales Cost + Marketing Cost) / New Customers Acquired

  Incluir:
    - Salarios do time de vendas e marketing (loaded)
    - Ferramentas (CRM, ads, automacao)
    - Comissoes
    - Eventos e conferences

Payback Period:
  Payback = CAC / (ARPA × Gross Margin)

LTV/CAC Ratio:
  < 1:1 → Destruindo valor (parar de investir em aquisicao)
  1-3:1 → Insustentavel (melhorar retencao ou CAC)
  3-5:1 → Saudavel (manter e otimizar)
  > 5:1 → Sub-investindo em growth (investir mais)

Exemplo completo:
  CAC: R$ 5.000
  LTV: R$ 13.333 (do exemplo acima)
  LTV/CAC: 2.67x (precisa melhorar — abaixo de 3x)
  Payback: 5.000 / (500 × 0.80) = 12.5 meses (ok)
```

---

## 5. Cap Table & Diluicao

O capitalization table registra quem possui o que na startup ao longo das rodadas.

### Exemplo de Evolucao do Cap Table

```
FUNDACAO:
  Fundadores: 100%

PRE-SEED:
  Fundadores: 85%
  Angels: 15%

SEED (R$3M a R$12M post-money):
  Fundadores: 68%
  Angels: 12%
  Seed VC: 20%

SERIES A (R$20M a R$80M post-money):
  Fundadores: 51%
  Angels: 9%
  Seed VC: 15%
  Series A VC: 25%

SERIES B (R$60M a R$250M post-money):
  Fundadores: 38%
  Angels: 7%
  Seed VC: 11%
  Series A VC: 19%
  Series B VC: 25%

+ ESOP (opcoes para funcionarios) = dilui todos proporcionalmente
Tipicamente 10-15% do cap table reservado para ESOP
```

### Conceitos de Cap Table

```
PRE-MONEY VALUATION: valor da empresa ANTES do investimento
POST-MONEY VALUATION: valor APOS o investimento
  Post-money = Pre-money + Investimento

LIQUIDATION PREFERENCE (Preferred Stock):
  1x: investidor recebe de volta seu investimento antes dos fundadores
  2x: investidor recebe 2× seu investimento antes dos fundadores
  Participating: recebe LP + ainda participa pro-rata do restante
  Non-participating: escolhe entre LP ou conversao — padrao saudavel

PRO-RATA RIGHTS: direito de participar de rodadas futuras para evitar diluicao

ANTI-DILUTION: protecao em caso de down round (rodada com valuation menor)
  Broad-based weighted average: mais justo para fundadores
  Full ratchet: mais favoravel para investidor, punitivo para fundadores
```

---

## 6. Valuation de Startups

Valuation de startups e mais arte que ciencia, especialmente em estagios iniciais.

| Metodo | Estagio | Base |
|--------|---------|------|
| **Berkus Method** | Pre-revenue | 5 fatores qualitativos, ate US$500K-2M cada |
| **Scorecard Method** | Pre-revenue | Comparacao com startups similares financiadas |
| **Comparable Transactions** | Seed/Series A | Multiplos de deals recentes (ARR multiple) |
| **Revenue Multiple** | Series A+ | ARR × multiplo do setor (SaaS 2024: 5-15x ARR) |
| **VC Method** | Qualquer | Post-money = Exit Value / (1 + IRR)^anos |
| **DCF** | Growth/Late stage | FCF projetado (alta incerteza, muito sensivel) |

### VC Method — Formula

```
Terminal Value = Receita_n × Multiple_saida
Ou: Lucro_n × P/E esperado na saida

Post-money Valuation = Terminal Value / (1 + IRR_alvo)^anos_ate_saida

IRR alvo por estagio:
  Pre-seed: 50-100%+
  Seed: 35-50%
  Series A: 25-35%
  Series B: 20-25%
  Growth: 15-20%

Exemplo:
  Startup SaaS, Series A
  ARR projetado ano 5: US$30M
  Multiple de saida: 8× ARR = US$240M (exit value)
  IRR alvo VC: 30% ao ano
  Horizonte: 5 anos

  Post-money = 240M / (1.30)^5 = 240M / 3.71 = US$64.7M
  Se investindo US$15M: participa de 23% (15M/64.7M)
  Pre-money = 64.7M - 15M = US$49.7M
```

---

## 7. Principais VCs Atuando no Brasil (2026)

| VC | Origem | Foco | Deals Notaveis | Cheque Tipico |
|----|--------|------|---------------|----------------|
| **Kaszek** | LATAM | Early-to-growth, tech | Nubank, Creditas, Kavak, MadeiraMadeira | US$5-50M |
| **Monashees** | LATAM | Early, tech diversificado | 99, Rappi, Nuvemshop, iFood | US$1-15M |
| **Canary** | Brasil | Early stage, pre-seed/seed | Alice, Caju, Clara | R$500K-5M |
| **Maya Capital** | Brasil | Early stage, seed | Pipefy, Cora, Cumbuca | R$1-8M |
| **QED Investors** | USA | FinTech especialista | Nubank, Loft, Creditas, Brex | US$5-30M |
| **Ribbit Capital** | USA | FinTech global | Nubank, Brex | US$10-50M |
| **SoftBank Latam** | LATAM (JP) | Growth | Gympass, Creditas, MadeiraMadeira | US$50-200M |
| **Valor Capital** | EUA/BR | Cross-border | Gympass, Loft, CloudWalk | US$5-30M |
| **General Atlantic** | EUA | Growth/late, tech | Arco Educacao, Locaweb, Nubank (early) | US$30-100M |
| **Patria/Advent** | BR/EUA | Late/PE | VTEX, Stone, Dasa | US$50M+ |

---

## 8. Metricas de Saude Financeira por Estagio

### Pre-Seed / Seed

```
Foco: Produto e Market Fit
Metricas criticas:
  - NPS > 50 (clientes amam o produto)
  - Retention rate > 70% (clientes ficam)
  - Organic growth rate > 20% MoM (produto cresce sozinho)
  - Weekly Active Users trend (up e to the right)

Financeiro:
  - Burn rate < R$50K/mes (pre-seed) | < R$200K/mes (seed)
  - Runway > 18 meses
```

### Series A

```
Foco: Provar escalabilidade do modelo
Metricas criticas:
  - ARR > R$2-5M (ou US$500K-1M)
  - Growth rate > 100% YoY
  - LTV/CAC > 3x
  - Gross Margin > 60% (SaaS)
  - NRR > 100%

Financeiro:
  - Burn Multiple < 2x
  - Runway > 18 meses com dinheiro novo
  - Path to profitability visivel em 18-24 meses
```

### Series B+

```
Foco: Eficiencia e dominancia de mercado
Metricas criticas:
  - ARR > R$20-50M
  - Growth rate > 50% YoY
  - Rule of 40 > 40%
  - NRR > 120%
  - Payback < 12 meses

Financeiro:
  - EBITDA margin positivo ou caminho claro para isso
  - Burn Multiple < 1x (eficiente)
  - Unit economics provados em escala
```

---

## 9. Erros Comuns de Founders em Financas

```
1. CONFUNDIR RECEITA COM CAIXA
   MRR alto nao significa caixa disponivel
   Runway e o que mata startups — monitorar semanalmente

2. SUBESTIMAR CAC
   Incluir TODOS os custos de marketing e vendas (loaded)
   CAC real > CAC calculado na maioria dos casos

3. DILUICAO EXCESSIVA NO EARLY STAGE
   Seed round com 30%+ diluicao = problema nas rodadas seguintes
   Preservar equity para Series A e B

4. LIQUIDATION PREFERENCE AGRESSIVA
   2x participating preference = fundadores podem nao receber nada num exit mediano
   Negociar 1x non-participating sempre que possivel

5. ESOP INSUFICIENTE
   Pool de 5% nao atrai talentos senior
   Padrao: 10-15% reservado antes da Series A

6. SEM CONTROLE DO BURN
   Contratar antes de ter product-market fit = runway desperdicado
   Regra: so contratar quando o proximo milestone e claro

7. PROJECOES IRREALISTAS PARA VCs
   VCs veem centenas de decks — exageros sao detectados
   Bottoms-up mais credivel que tops-down sempre
```

---

## 10. Aceleradoras e Ecossistema Brasileiro

| Aceleradora/Programa | Foco | O Que Oferece |
|---------------------|------|--------------|
| **Y Combinator** | Global (aceita BR) | US$500K + rede global + Demo Day |
| **Distrito** | Brasil | Comunidade, matchmaking investidores, research |
| **Liga Ventures** | Brasil | Aceleracao corporativa, coneccao com grandes empresas |
| **Startup Farm** | Brasil | Early stage, mentoria, comunidade |
| **Endeavor** | LATAM | Scale-ups, mentoria de alta qualidade |
| **SEBRAE** | Brasil | PMEs e startups, recursos educacionais |
| **BNDES Garagem** | Brasil | Fintech e impacto, recursos do BNDES |
| **Cubo (Itau)** | Brasil | Fintech, ecossistema corporativo |
| **InovaBra (Bradesco)** | Brasil | Fintech, corporativo |

---

## 11. Referencias

- **"Venture Deals"** — Brad Feld & Jason Mendelson (biblia de VC)
- **"The Lean Startup"** — Eric Ries
- **"Zero to One"** — Peter Thiel
- **"Blitzscaling"** — Reid Hoffman & Chris Yeh
- **"Mastering the VC Game"** — Jeffrey Bussgang
- **"Crossing the Chasm"** — Geoffrey Moore
- **LAVCA** — lavca.org (dados de VC na LATAM)
- **Distrito Fintech Report** — distrito.me (ecossistema brasileiro)
- **Firstround Capital** — firstround.com/review (melhores artigos para founders)
