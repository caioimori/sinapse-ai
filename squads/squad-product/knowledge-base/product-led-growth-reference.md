# Product-Led Growth (PLG) Reference

## Purpose
Referencia para metricas e praticas de Product-Led Growth, para quando clientes tem (ou querem ter) motion de crescimento liderado pelo produto.

## PLG Fundamentals (Wes Bush)
Product-Led Growth = using your product as the primary vehicle to acquire, activate, and retain customers.

**5 Principios Fundamentais do PLG:**
1. O produto e o canal — usuario experimenta valor antes de falar com vendas
2. Self-serve first — onboarding sem friccao, sem demo obrigatoria
3. Time-to-value minimo — atingir "aha moment" o mais rapido possivel
4. Bottom-up adoption — individuos adotam, organizacao compra depois
5. Data-driven expansion — upsell baseado em comportamento, nao em pitch

### Three Growth Motions
| Motion | Acquisition | Conversion | Best For |
|--------|-----------|-----------|---------|
| Sales-Led | Outbound, events, demos | Sales team closes | Enterprise, high ACV |
| Marketing-Led | Content, ads, SEO | Nurture → Sales | Mid-market |
| Product-Led | Free trial/freemium | Self-serve → upsell | SMB, developer tools |

### PLG Metrics
```
Self-Serve Funnel:
  Visitor → Signup → Activated → Engaged → Converted → Expanded

Key Metrics:
  Time to Value (TTV): How fast users see value
  PQL Rate: % of signups that become product-qualified
  Natural Rate of Revenue: % revenue from self-serve (no sales touch)
  Viral Coefficient (K): Invites × Conversion per invite
  Quick Ratio: (New + Expansion) / (Contraction + Churn)
```

### PQL Scoring Model
```
Behavioral Score (0-100) × 0.7:
  + Completed onboarding
  + Used core feature N times
  + Invited team members
  + Hit usage threshold
  + Visited pricing page
  - Inactive periods

Firmographic Score (0-100) × 0.3:
  + Company size match
  + Industry match
  + Role match

PQL = Score >= threshold
```

**Sinais tipicos de PQL (OpenView):**
- Atingiu limite do plano free
- Convidou >= 5 colegas para o workspace
- Usou feature premium durante trial
- Excedeu volume de uso definido
- Visitou pagina de pricing >= 2 vezes em 7 dias
- Exportou dados (sinal de que o dado e valioso)

## Modelos de Precificacao em PLG

### Freemium vs. Free Trial vs. Reverse Trial

| Modelo | Conversao Tipica | Ideal Para | Risco |
|--------|-----------------|------------|-------|
| **Freemium** | 2-5% para paid | Alto volume, low touch | "Free forever" consumers recursos sem converter |
| **Free Trial** | 15-25% (maior urgencia) | Produtos complexos, demonstracao de valor | Pressao temporal pode frustrar |
| **Reverse Trial** | 10-15% | Produtos onde valor premium e claro | Requer produto maduro com clear differentiation |
| **Hybrid PLG + Sales** | Variavel | SMB self-serve + Enterprise sales-assist | Requer dois motores distintos |

**Reverse Trial (modelo emergente):** Usuario comeca com funcionalidades premium → apos periodo faz downgrade para free. Funciona bem quando o valor do plano premium e obvio logo de cara.

## Growth Loops

### Acquisition Loops (como novos usuarios chegam)

**1. Viral Loop**
```
User → Uses product → Invites/shares → New User → Activates → Invites → ...
K > 1 = viral growth
K 0.5-1.0 = supported growth (amplifica outros canais)
```
Exemplos: Slack, Zoom, Calendly

**2. User-Generated Content Loop**
```
User creates content → Content indexed → New user discovers → Activates → Creates content → ...
```
Exemplos: Pinterest, Reddit, Notion templates

**3. Paid Loop (funciona se LTV > CAC com margem)**
```
Revenue → Invest in ads → New users → Revenue → Reinvest → ...
```

**4. Sales Loop (B2B enterprise)**
```
Revenue → Hire sales → New clients → Revenue → Hire more → ...
```

### Engagement Loops (como usuarios continuam usando)

**Personal Utility Loop:**
```
User creates/stores data → Data becomes more valuable → User returns → Creates more data → ...
```
Exemplos: Notion, Google Drive, Evernote

**Social Loop:**
```
User posts → Gets feedback (likes, comments) → Motivated → Posts more → ...
```

**Notification Loop:**
```
Event happens → Push/email sent → User returns → Generates activity → Event happens → ...
```

### Monetization Loop
```
User uses more → Hits limits → Upgrades → Uses more → Expands further → ...
```

## Content Loop
User creates content → Content indexed → New users discover → Activate → Create content → ...

## Usage Loop (Network Effects)
More users → Product improves (data effects) → More value → More users → ...

## Efeitos de Rede

**Lei de Metcalfe:** Valor da rede proporcional ao quadrado de usuarios (n²)
**Lei de Reed:** Para redes com grupos, valor cresce exponencialmente (2^n)

| Tipo | Descricao | Exemplo |
|------|-----------|---------|
| **Direto** | Mais usuarios = mais valor para cada um | WhatsApp, telefone |
| **Indireto (cross-side)** | Mais de um lado = mais valor para o outro | Uber (riders/drivers) |
| **Data network effects** | Mais uso = produto melhor (via ML) | Waze, Google Search |
| **Marketplace liquidity** | Mais vendedores e compradores = melhor mercado | Airbnb, Amazon |

## Onboarding como Alavanca de PLG

Samuel Hulick (UserOnboard.com) demonstrou que a maioria dos produtos perde 40-60% dos usuarios no primeiro uso.

```
Framework de Onboarding:
  1. Sign-up Flow: minimo campos, social login, sem cartao de credito
  2. Welcome Survey: 2-3 perguntas para personalizar (JTBD, role, objetivo)
  3. Setup Checklist: passos claros com progresso visual
  4. Quick Win: primeiro valor em < 5 minutos
  5. Celebrate: reforco positivo ao atingir marcos
  6. Ongoing Education: tooltips contextuais, emails educacionais

Metricas criticas:
  Time-to-First-Value (TTFV): mediana do tempo ate o "aha moment"
  Activation Rate: % que completa setup critico em D7
  Day 1 / Day 7 / Day 30 Retention por cohort de onboarding
  Setup Completion Rate: % que completa cada etapa do checklist
```

## Product-Led Sales (PLS)

PLS combina PLG com sales-assist: o produto gera leads qualificados pelo uso, e vendedores entram para converter/expandir. Modelo hibrido adotado por Slack, Atlassian, MongoDB, Twilio, Datadog.

**Quando PLG precisa de Sales:**
- Free tier atingiu limites → Sales ajuda no upgrade
- Single user → Sales ajuda a expandir para team/company
- PQL score alto → Sales faz outreach proativo
- Enterprise features (SSO, admin controls, compliance) → Sales necessario
- Negociacao de contrato anual / volume deal

**PLS Workflow:**
```
User signs up → Uses product → PQL score threshold reached
→ CS/Sales alert → Personalized outreach → Upgrade/expansion
```

**Segmentacao por motion:**
| Segmento | Motion | Owner |
|---------|--------|-------|
| Individuos / solopreneurs | Full PLG | Produto |
| SMB (<50 pessoas) | PLG + light-touch CS | CS + Produto |
| Mid-market (50-500) | PLS — PQL alert + SDR | Sales + CS |
| Enterprise (>500) | Sales-led com PLG assist | AE + CS |

## PLG Maturity Model
| Score | Stage | Characteristics |
|-------|-------|----------------|
| 80-100 | PLG-Native | Product is primary growth engine |
| 60-79 | PLG-Supported | Product assists, sales still drives |
| 40-59 | PLG-Emerging | Self-serve exists but underperforms |
| 0-39 | Sales-Led | Minimal product-led motion |

## PLG Benchmarks (OpenView 2024)

| Metrica | Median | Top Quartile |
|---------|--------|-------------|
| Signup → Activation Rate | 20-35% | 40-60% |
| Activation → PQL Rate | 10-20% | 25-40% |
| PQL → Paid Conversion | 15-25% | 30-50% |
| Free-to-Paid (geral) | 2-5% | 8-15% |
| Time-to-First-Value | 3-7 dias | <1 dia |
| Viral Coefficient (K) | 0.1-0.3 | 0.5+ |

## Key PLG Authors
| Author | Focus | Key Work |
|--------|-------|---------|
| Wes Bush | PLG strategy | Product-Led Growth (book, 2019) |
| Elena Verna | Growth strategy, PLG advising | Miro, Amplitude, Dropbox, Malwarebytes |
| Kyle Poyar | PLG metrics, pricing | OpenView PLG benchmarks |
| Hiten Shah | Product analytics | FYI, KISSmetrics, Crazy Egg |
| Chamath Palihapitiya | Growth, social | Facebook original growth team |
| Andrew Chen | Network effects, cold start | The Cold Start Problem (a16z) |
| Brian Balfour | Growth loops, RARRA | Reforge (ex-HubSpot VP Growth) |
| Lenny Rachitsky | PLG metrics, benchmarks | Lenny's Newsletter (ex-Airbnb) |
