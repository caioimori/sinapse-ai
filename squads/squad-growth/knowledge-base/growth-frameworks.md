# Knowledge Base: Growth Frameworks

## AARRR — Pirate Metrics (Dave McClure)

Framework criado por Dave McClure (500 Startups) em 2007. Lingua franca de growth para startups.

```
ACQUISITION → ACTIVATION → RETENTION → REVENUE → REFERRAL
```

| Stage | Question | Key Metric | Example |
|-------|---------|-----------|---------|
| Acquisition | How do users find us? | CAC, traffic by channel | 10K monthly visitors |
| Activation | Do users have a great first experience? | Activation rate, time-to-value | 40% reach aha moment |
| Retention | Do users come back? | D1/D7/D30 retention | 25% return after 30 days |
| Revenue | How do we make money? | ARPU, LTV, conversion to paid | R$50 ARPU |
| Referral | Do users tell others? | K-factor, NPS, referral rate | K=0.3 |

### RARRA — Reordenamento de Brian Balfour (Reforge)

Brian Balfour e a comunidade Reforge revisitaram o AARRR e propuseram a ordem RARRA — priorizando Retention primeiro porque nao adianta adquirir usuarios que nao ficam.

```
RETENTION → ACTIVATION → REVENUE → REFERRAL → ACQUISITION
```

**Logica da inversao:**
1. Retention valida product-market fit — se a curva nao estabiliza, pare tudo
2. Activation sem retention e desperdicio — o usuario experimenta mas nao volta
3. Revenue sem retention e churn disfarçado
4. Referral sem retention leva users ruins ao produto
5. Acquisition e a ultima alavanca — so escale quando o produto retém

**Regra prática:** Se DAU/MAU < 15% para SaaS B2B ou D30 retention < 20%, nao investir em aquisicao paid — resolver retencao primeiro.

## North Star Metric Framework (Sean Ellis)

### Definition
One metric that best captures the core value your product delivers to customers.

### Criteria
1. Reflects value delivered (not vanity)
2. Leading indicator of revenue
3. Actionable by teams
4. Measurable and timely
5. Non-gameable

### Input Metrics
```
North Star Metric
├── Breadth (reach — how many users)
├── Depth (engagement — how much they use)
├── Frequency (how often they return)
└── Efficiency (how well acquisition works)
```

## Growth Loops (Brian Balfour / Reforge)

### Viral Loop
```
User gets value → User shares → New user signs up → New user gets value → repeats
K-factor = invites × conversion rate
```

### Content Loop
```
Expert creates content → Content indexed (SEO) → Organic visitor → Visitor converts → User creates content → repeats
```

### Paid Loop
```
Spend on ads → Acquire customer → Customer generates revenue → Reinvest revenue → Spend more → repeats
Condition: ROAS > 1 / reinvestment rate
```

### Product Loop
```
User uses product → Usage creates value for others → Others join → Network grows → More value → repeats
```

### Sales Loop
```
Revenue funds sales team → Sales closes deals → Revenue grows → Fund more sales → repeats
```

## Hook Model (Nir Eyal)
```
TRIGGER → ACTION → VARIABLE REWARD → INVESTMENT
```

| Phase | Description | Design Principle |
|-------|-----------|-----------------|
| Trigger | External (push, email) or Internal (emotion, habit) | Graduate from external to internal |
| Action | Simplest behavior in anticipation of reward | B = MAT (Motivation × Ability × Trigger) |
| Variable Reward | Unpredictable reward (Tribe, Hunt, Self) | Variability sustains engagement |
| Investment | User puts something in (data, time, social) | Increases switching costs |

## Fogg Behavior Model (BJ Fogg)
```
B = MAP (Behavior = Motivation × Ability × Prompt)
```

| Factor | Increase By |
|--------|-----------|
| Motivation | Social proof, scarcity, anticipation, pleasure |
| Ability | Reduce steps, simplify UI, pre-fill data, defaults |
| Prompt | Right time, right context, clear CTA |

**Key insight:** If motivation is low, make it incredibly easy. If ability is high, a lighter prompt works.

## Bullseye Framework (Gabriel Weinberg)

### 19 Traction Channels
1. Viral Marketing
2. Public Relations
3. Unconventional PR
4. Search Engine Marketing
5. Social/Display Ads
6. Offline Ads
7. Search Engine Optimization
8. Content Marketing
9. Email Marketing
10. Engineering as Marketing
11. Targeting Blogs
12. Business Development
13. Sales
14. Affiliate Programs
15. Existing Platforms
16. Trade Shows
17. Offline Events
18. Speaking Engagements
19. Community Building

### Process
```
Outer Ring: Brainstorm ALL 19 channels
Middle Ring: Run cheap tests on top 6
Inner Ring: Focus on proven 1-3 channels (BULLSEYE)
```

## ICE / RICE Scoring

### ICE (simpler)
```
Score = Impact × Confidence × Ease (each 1-10)
```

### RICE (more rigorous)
```
Score = (Reach × Impact × Confidence) / Effort

Reach: Users affected per quarter (number)
Impact: 0.25 (minimal), 0.5 (low), 1 (medium), 2 (high), 3 (massive)
Confidence: 100% (high), 80% (medium), 50% (low)
Effort: Person-weeks
```

## Product-Market Fit Indicators

### Sean Ellis Survey
> "How would you feel if you could no longer use [product]?"
- Very disappointed → PMF signal if > 40%
- Somewhat disappointed
- Not disappointed

### Quantitative Signals
| Signal | Threshold | Source |
|--------|----------|--------|
| Retention curve flattening | D60+ retention > 0% | Cohort analysis |
| NPS | > 40 | User survey |
| Organic growth | > 50% of new users | Attribution data |
| DAU/MAU | > 20% | Product analytics |
| Payback period | < 12 months | Finance data |
| LTV:CAC | > 3:1 | Finance + acquisition data |

## Experimentation Velocity

### Metrics
| Metric | Target | Meaning |
|--------|--------|---------|
| Tests per week | 1-3 | Experimentation pace |
| Win rate | 20-30% | Percentage of tests that win |
| Average uplift | 5-15% | Average improvement from wins |
| Compound growth | (1 + avg_uplift)^wins_per_year | Annual impact |

### Growth Team Cadence
| Day | Activity |
|-----|---------|
| Monday | Review last week's experiments |
| Tuesday | Prioritize hypothesis backlog (ICE) |
| Wednesday | Design + build experiments |
| Thursday | Launch experiments |
| Friday | Analyze running experiments, plan next week |

## Jobs-to-be-Done (JTBD) Aplicado a Growth

Framework de Clayton Christensen adaptado por Bob Moesta para entender por que usuarios adotam ou abandonam produtos.

| Dimensao | Descricao | Aplicacao em Growth |
|----------|-----------|---------------------|
| **Functional Job** | O que o usuario quer fazer ("enviar arquivo grande") | Define o "aha moment" correto |
| **Emotional Job** | Como quer se sentir ("parecer profissional") | Informa messaging e onboarding tone |
| **Social Job** | Como quer ser visto ("tech-savvy") | Orienta social proof e testimonials |

**Aplicacao pratica:**
1. Identificar o aha moment correto — quando o functional job e cumprido pela primeira vez
2. Segmentar usuarios por job, nao por demografia
3. Posicionar vs alternativas incluindo "nao fazer nada"
4. Criar messaging que ressoa com motivacao real

## OKRs para Growth (John Doerr)

```
Objective: Tornar-se a plataforma preferida de designers no Brasil

Key Results:
  KR1: Aumentar MAU de 5K para 15K
  KR2: Melhorar NRR de 95% para 110%
  KR3: Reduzir time-to-first-value de 15min para 5min
  KR4: Atingir K-factor de 0.5 no referral program
```

**Principios:**
- Objectives sao qualitativos e inspiracionais
- Key Results sao quantitativos e mensuraveis (3-5 por Objective)
- 60-70% de atingimento = "saudavel" (stretch goals)
- Cadencia trimestral com check-ins semanais

## KPI Tree — Decomposicao da North Star

```
MRR
├── New MRR
│   ├── Leads
│   │   ├── Organic traffic × Conversion rate
│   │   ├── Paid traffic × Conversion rate
│   │   └── Referrals × Conversion rate
│   ├── Trial-to-Paid rate
│   └── Average deal size
├── Expansion MRR
│   ├── Upgrade rate
│   └── Cross-sell rate
└── Churned MRR (negativo)
    ├── Logo churn rate
    └── Downgrade rate
```

Cada folha da arvore pode ser atribuida a um time, criando accountability clara.

## Vanity Metrics vs. Metricas Acionaveis (Eric Ries)

| Vanity Metric | Metrica Acionavel |
|---------------|-------------------|
| Total de usuarios registrados | MAU (usuarios ativos mensais) |
| Page views totais | Engagement rate, time on site |
| Downloads do app | DAU/MAU ratio |
| Seguidores em social media | Engagement rate, click-through |
| Total de receita | MRR growth rate, NRR |
| "Impressoes" | CTR, conversoes |

**Teste para vanity metric:** Se a metrica subiu, voce sabe o que fazer diferente? Se nao, provavelmente e vanity.

## Key Growth References
| Author | Contribution |
|--------|-------------|
| Sean Ellis | Growth Hacking, North Star Metric, PMF survey |
| Andrew Chen | Growth loops, network effects, The Cold Start Problem |
| Brian Balfour | Reforge, growth models, RARRA, loops vs funnels |
| Nir Eyal | Hook Model, habit formation (Hooked) |
| BJ Fogg | Behavior Model (B=MAP) |
| Gabriel Weinberg | Bullseye Framework, Traction (19 channels) |
| Alistair Croll | Lean Analytics, One Metric That Matters |
| Casey Winters | Growth strategy, Greylock (Grubhub, Pinterest) |
| Lenny Rachitsky | Growth benchmarks, retention curves (Lenny's Newsletter) |
| Elena Verna | PLG advising, retention-first framework (Miro, Amplitude, Dropbox) |
| Wes Bush | Product-Led Growth book, PLG framework (OpenView) |
| Peep Laja | CRO, experimentation (CXL Institute) |
| Dave McClure | AARRR/Pirate Metrics (500 Startups) |
| Chamath Palihapitiya | Facebook original growth team, "7 friends in 10 days" |
| Reforge | Growth series, advanced growth frameworks |
