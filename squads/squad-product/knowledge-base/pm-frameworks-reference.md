# Product Management Frameworks Reference

## Purpose
Referencia rapida dos frameworks de PM mais utilizados pela squad, com formulas, templates e quando usar cada um.

## Strategy Frameworks

### Geoffrey Moore Vision Template
```
FOR [target customer]
WHO [statement of need]
THE [product name] IS A [product category]
THAT [key benefit, reason to buy]
UNLIKE [primary competitive alternative]
OUR PRODUCT [primary differentiation]
```

### April Dunford 5 Components (Obviously Awesome)
1. Competitive Alternatives (what would they use?)
2. Unique Attributes (what do we have?)
3. Value (so what?)
4. Target Customer Characteristics (who cares?)
5. Market Category (what frame?)

### Strategy Canvas (Blue Ocean — Kim & Mauborgne)
- Plot 6-10 value factors on X axis
- Score each competitor 1-5 on Y axis
- ERRC Grid: Eliminate / Reduce / Raise / Create

### Opportunity Solution Tree (Teresa Torres)
```
Desired Outcome (metric)
├── Opportunity (user need)
│   ├── Solution A → Experiment
│   ├── Solution B → Experiment
│   └── Solution C → Experiment
└── Opportunity (user need)
    └── Solutions → Experiments
```

## Prioritization Frameworks

### RICE Scoring (Intercom)
```
RICE Score = (Reach × Impact × Confidence) / Effort

Reach: users/quarter (actual number)
Impact: 3=massive, 2=high, 1=medium, 0.5=low, 0.25=minimal
Confidence: 100%=high, 80%=medium, 50%=low
Effort: person-months
```

### MoSCoW
- **Must Have:** System fails without it
- **Should Have:** Important but not critical
- **Could Have:** Nice to have
- **Won't Have:** Explicitly out of scope

### Kano Model
- Must-Be: Expected (absence = dissatisfaction)
- One-Dimensional: More = better (linear satisfaction)
- Attractive: Surprise delight (absence ≠ dissatisfaction)
- Indifferent: No impact
- Reverse: Causes dissatisfaction

## Goal-Setting Frameworks

### OKRs (Doerr) — Deep Reference

OKRs (Objectives and Key Results) foram popularizados por John Doerr no livro "Measure What Matters" (2018), baseado no sistema criado por Andy Grove na Intel e adotado pelo Google desde 1999.

**Estrutura Completa:**
```
Objective: Qualitativo, inspiracional, time-bound (trimestral geralmente)
  KR 1: [metrica] from [X] to [Y] by [data]
  KR 2: [metrica] from [X] to [Y] by [data]
  KR 3: [metrica] from [X] to [Y] by [data]
  KR 4: (opcional, max 5 KRs por Objective)

Scoring: 0.0-1.0
  0.7 = target hit (aspiracional — se sempre 1.0, nao e ambicioso)
  0.6-0.7 = healthy average
  >0.8 = not ambitious enough (subestimou)
  <0.4 = execution or target issues (investigar)

Mix: 60-70% committed OKRs, 30-40% aspirational OKRs
```

**Criterios de bons Key Results:**
1. Quantitativos e mensuraveis (sem "melhorar", "aumentar" sem numero)
2. Outcomes, nao outputs ("Atingir NRR de 110%", nao "Lançar feature X")
3. Leading indicators preferidos a lagging quando possivel
4. Max 5 KRs por Objective (foco)
5. Geralmente 3-5 Objectives por trimestre por time

**Exemplo para squad-product:**
```
Objective: Tornar o onboarding o mais rapido do mercado

  KR1: Reduzir Time-to-First-Value de 12 minutos para 4 minutos
  KR2: Aumentar Activation Rate de 28% para 45%
  KR3: Melhorar D7 Retention de cohorts com onboarding completo de 40% para 55%
  KR4: Atingir NPS de onboarding >= 45 (hoje: 28)
```

**Cadencia:**
- Trimestral: definir OKRs, alignment com liderança
- Semanal: check-in de progresso (15-30 min)
- Mid-quarter: health check — ajustar se necessario
- Final do trimestre: scoring + retrospectiva

**CFRs — o complemento dos OKRs:**
Doerr adiciona CFRs (Conversations, Feedback, Recognition) como o lado humano dos OKRs:
- Conversations regulares (1:1s) sobre progresso
- Feedback contínuo sobre comportamento e resultados
- Recognition quando KRs sao atingidos

**KPI Tree — decompondo o Objective em metricas acionaveis:**
```
North Star Metric (ex: MRR)
├── New MRR
│   ├── Organic traffic × Conversion rate
│   ├── Paid traffic × Conversion rate
│   └── Referrals × Conversion rate
├── Expansion MRR
│   ├── Upgrade rate (PQL → Paid)
│   └── Cross-sell rate
└── Churned MRR (negativo)
    ├── Logo churn rate
    └── Downgrade rate
```

Cada folha pode ser atribuida a um sub-time ou individuo — accountability clara.

## Discovery Frameworks

### Continuous Discovery Habits (Teresa Torres)
- Weekly touchpoints with users
- Product Trio (PM + Design + Engineering)
- Interview → Synthesize → Map → Test → Decide
- Opportunity Solution Tree as central artifact

### Jobs-to-Be-Done (Christensen/Moesta)
```
Job Statement: "When I [situation], I want to [motivation], so I can [outcome]"
Three layers: Functional / Emotional / Social
Switch Interview: Timeline → Forces → Decision → Outcomes
Four Forces: Push (current pain) + Pull (new solution) vs Habit + Anxiety
```

### The Mom Test (Rob Fitzpatrick)
1. Talk about their life, not your idea
2. Ask about specifics in the past, not generics about the future
3. Talk less, listen more
4. Never pitch

## Delivery Frameworks

### Shape Up (Ryan Singer)
- Fixed time, variable scope
- Appetite (how much time?) not Estimate (how long?)
- Betting Table instead of backlog grooming
- 6-week cycles + 2-week cooldown
- No carry-over by default

### Sprint Capacity Formula
```
Individual Capacity = Available Days × Focus Factor × Velocity Factor
Team Capacity = Sum(Individual Capacities)
Buffer = Team Capacity × 0.10
Committable = Team Capacity - Buffer
```

## Metrics Frameworks

### AARRR Pirate Metrics (Dave McClure)
Acquisition → Activation → Retention → Revenue → Referral

### Product Health Score (Composite)
```
Score = (Product Metrics × 0.30) + (Delivery × 0.25) + (Client × 0.25) + (Strategic × 0.20)
Bands: 80-100 GREEN | 60-79 YELLOW | 40-59 ORANGE | 0-39 RED
```

### Sean Ellis PMF Test
- Survey: "How would you feel if you could no longer use [product]?"
- >40% "Very Disappointed" = PMF achieved

## Roadmap Frameworks

### Now / Next / Later (Janna Bastow — ProdPad)

O framework de roadmap mais adequado para contextos de agencia e quando ha incerteza. Evita falsas promessas de data.

```
NOW (este trimestre):
  - Features em desenvolvimento ativo
  - Commitment real com o time
  - Alta confianca de delivery

NEXT (proximo trimestre):
  - Features planejadas e priorizadas
  - Hipoteses validadas, detalhes ainda definindo
  - Confianca media — pode mudar com nova informacao

LATER (futuro, sem data):
  - Ideias e direcoes estrategicas
  - Dependem de validacao ou pre-requisitos
  - Baixa confianca de timing
```

**Regras:**
- Nunca mostrar datas para itens em NEXT ou LATER (promessa que nao pode cumprir)
- Mover items de LATER → NEXT apenas quando houver evidencia de discovery
- Items em NOW devem ter criterios de saida claros (Definition of Done)

### Roadmap Formats por Audiencia

| Audiencia | Formato | Nivel de Detalhe |
|-----------|---------|-----------------|
| Time de produto | NOW/NEXT/LATER interno com user stories | Alto |
| Stakeholders internos | NOW/NEXT/LATER com themes e metricas | Medio |
| Clientes / externos | NOW/NEXT/LATER com outcomes, sem datas | Baixo |
| Board / investidores | Themes e metas estrategicas, sem features | Muito baixo |

### Weighted Scoring — Priorizacao Avancada

Para quando RICE simples nao captura todas as variaveis relevantes:

```
Score = (Business Value × W1) + (User Value × W2) + (Strategic Fit × W3)
         - (Effort × W4) - (Risk × W5)

Exemplo de pesos (ajustar para cada contexto):
  W1 (Business Value): 30%
  W2 (User Value): 25%
  W3 (Strategic Fit): 20%
  W4 (Effort — negativo): 15%
  W5 (Risk — negativo): 10%

Como pontuar (1-5 para cada criterio):
  Business Value: ARR potential, retention impact, NRR impact
  User Value: # users impacted, intensity of pain resolved
  Strategic Fit: alignment with product vision e OKRs
  Effort: story points estimate, complexity, unknowns
  Risk: technical risk, market risk, dependency risk
```

**Quando usar:**
- Portfolio de features com muitas dimensoes de valor
- Quando stakeholders de diferentes areas precisam de transparencia na priorizacao
- Para justificar decisoes de roadmap com evidencia numerica

## Client Management Frameworks

### Dual Roadmap System
- Internal: Full detail, sprint-level, technical
- Client-Facing: Outcomes, Now/Next/Later, confidence levels

### Rich Mironov Reframe
Client says feature → PM asks 5 questions → Finds underlying problem

## Reference Authors
| Author | Framework | Book/Source |
|--------|-----------|------------|
| Teresa Torres | Continuous Discovery | Continuous Discovery Habits |
| Marty Cagan | Empowered Teams | Inspired / Empowered |
| Ryan Singer | Shape Up | Shape Up (Basecamp) |
| April Dunford | Positioning | Obviously Awesome |
| Clayton Christensen | JTBD | Competing Against Luck |
| Bob Moesta | Switch Interview | Demand-Side Sales 101 |
| John Doerr | OKRs | Measure What Matters |
| Kim & Mauborgne | Blue Ocean | Blue Ocean Strategy |
| Sean Ellis | PMF Test | Hacking Growth |
| Rob Fitzpatrick | Customer Interviews | The Mom Test |
| Rich Mironov | Agency PM | The Art of Product Management |
| Wes Bush | PLG | Product-Led Growth |
| Martin Fowler | Tech Debt | Technical Debt Quadrant |
| Janna Bastow | Roadmapping | Now/Next/Later (ProdPad) |
