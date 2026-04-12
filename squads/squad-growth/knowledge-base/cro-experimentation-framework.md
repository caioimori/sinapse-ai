# Knowledge Base: CRO Experimentation Framework

## Experimentation Hierarchy

### 1. Observation → Hypothesis → Experiment → Learning
```
DATA SOURCES:
  Analytics → Heatmaps → Session Recordings → Surveys → User Tests
      │
      ▼
INSIGHT:
  "Users on mobile abandon cart at payment step (68% drop-off)"
      │
      ▼
HYPOTHESIS:
  "If we add Apple Pay to mobile checkout,
   then conversion rate will increase by 15%,
   because reducing payment friction addresses the #1 drop-off reason"
      │
      ▼
EXPERIMENT:
  A/B test: Control (current) vs Variant (Apple Pay added)
  Sample: 5,000 users per variant, 14-day duration
      │
      ▼
LEARNING:
  Result + next hypothesis → Knowledge Base
```

## Hypothesis Framework

### ICE Scoring
```
Score = Impact × Confidence × Ease (each 1-10)

Impact:     How much will this move the metric? (1=minimal, 10=massive)
Confidence: How sure are we this will work? (1=guess, 10=proven)
Ease:       How easy is it to implement? (1=months, 10=hours)
```

### RICE Scoring (for larger teams)
```
Score = (Reach × Impact × Confidence) / Effort

Reach:      Users affected per quarter
Impact:     0.25 (minimal), 0.5 (low), 1 (medium), 2 (high), 3 (massive)
Confidence: 100% (high), 80% (medium), 50% (low)
Effort:     Person-weeks to implement
```

### Hypothesis Template
```
HYPOTHESIS #[ID]
  Page/Flow: [where]
  Observation: [what we see in data]
  If we: [change we will make]
  Then: [expected result + metric + magnitude]
  Because: [psychological/behavioral reasoning]
  ICE Score: I[_] × C[_] × E[_] = [total]
  Primary Metric: [conversion rate, revenue, etc.]
  Secondary Metrics: [engagement, bounce, etc.]
  Guard Rails: [metrics that should NOT decrease]
```

## Statistical Foundations

### Sample Size Calculation
```
n = (Z² × p × (1-p)) / E²

Where:
  Z = Z-score (1.96 for 95% confidence)
  p = baseline conversion rate
  E = minimum detectable effect (MDE)

Practical formula:
  n per variant = 16 × p × (1-p) / MDE²

Example:
  Baseline CR = 3% (p = 0.03)
  MDE = 15% relative (0.45% absolute)
  n = 16 × 0.03 × 0.97 / 0.0045² ≈ 22,963 per variant
```

### Statistical Significance
| Concept | Threshold | Meaning |
|---------|----------|---------|
| Confidence level | 95% (α = 0.05) | 5% chance of false positive |
| Statistical power | 80% (β = 0.20) | 20% chance of false negative |
| p-value | < 0.05 | Reject null hypothesis |
| MDE | 10-20% relative | Minimum meaningful change |

### Common Pitfalls
| Pitfall | Problem | Prevention |
|---------|---------|-----------|
| Peeking | Checking results too early | Pre-set duration, use sequential testing |
| Multiple testing | Testing many variants inflates false positives | Bonferroni correction |
| Simpson's Paradox | Aggregate hides segment-level effects | Always segment results |
| Novelty effect | Users react to newness, not improvement | Run for 2+ weeks |
| Selection bias | Non-random assignment | Use proper randomization |
| Survivorship bias | Only analyzing completers | Intent-to-treat analysis |

## Test Types

### A/B Test
- **What:** Two variants (control vs treatment)
- **When:** Clear hypothesis, one variable change
- **Duration:** Until statistical significance
- **Traffic:** 50/50 split

### A/B/n Test
- **What:** Multiple variants (3-5 max)
- **When:** Testing different approaches
- **Caution:** Need more traffic (sample size per variant)

### Multivariate Test (MVT)
- **What:** Multiple elements changed simultaneously
- **When:** Optimizing combinations (headline × image × CTA)
- **Requirement:** Very high traffic volume

### Split URL Test
- **What:** Different pages/URLs entirely
- **When:** Major redesigns, different flows
- **Implementation:** Server-side redirect

### Bandit Testing
- **What:** Dynamically allocates more traffic to winning variant
- **When:** Short campaigns, e-commerce promotions
- **Trade-off:** Less statistical rigor, more revenue

## CRO Audit Framework

### Quantitative Analysis
| Source | What to Look For |
|--------|-----------------|
| GA4 Funnel | Drop-off points per stage |
| GA4 Path | Common user paths vs ideal path |
| Heatmaps | Click distribution, scroll depth |
| Session Recordings | Rage clicks, u-turns, confusion |
| Form Analytics | Field-level abandonment |
| Speed Metrics | LCP, INP correlation with conversion |

### Qualitative Analysis
| Method | What to Learn |
|--------|-------------|
| User surveys | Why did you not complete X? |
| Exit surveys | What stopped you today? |
| User tests | Task completion observation |
| Customer interviews | Deep understanding of barriers |
| Support tickets | Common complaints and confusion |
| Review mining | Competitor reviews for friction insights |

### Heuristic Evaluation (LIFT Model)
| Factor | Question | Priority |
|--------|---------|----------|
| Value proposition | Is the value clear and compelling? | Highest |
| Relevance | Does this match what brought the user here? | High |
| Clarity | Is the message/action crystal clear? | High |
| Urgency | Is there reason to act now? | Medium |
| Anxiety | Are there trust/security concerns? | Medium |
| Distraction | Are there competing actions/elements? | Medium |

## Experiment Lifecycle

### 1. Discovery (Week 1)
- Review analytics data
- Conduct heuristic evaluation
- Prioritize opportunities

### 2. Hypothesis (Week 2)
- Write formal hypotheses
- Score with ICE/RICE
- Select top 2-3 for sprint

### 3. Design (Week 2-3)
- Create mockups/wireframes
- Get stakeholder alignment
- Technical feasibility check

### 4. Implementation (Week 3-4)
- Build variants in testing tool
- QA across devices/browsers
- Validate tracking

### 5. Execution (Week 4-6+)
- Launch experiment
- Monitor for data quality issues
- DO NOT peek at results

### 6. Analysis (End of test)
- Statistical significance check
- Segment analysis
- Revenue impact calculation

### 7. Documentation (Post-test)
- Record in experiment knowledge base
- Share learnings
- Generate next hypotheses

## Frequentist vs. Bayesian A/B Testing

| Aspecto | Frequentist | Bayesian |
|---------|-------------|----------|
| Pergunta | "Qual a prob de ver esses dados se H0 e verdadeira?" | "Qual a prob de A ser melhor que B?" |
| Resultado | p-value + intervalo de confianca | Probabilidade posterior |
| Sample size | Fixo (calculado antecipadamente) | Pode parar mais cedo |
| Interpretacao | Tecnica (frequentemente mal interpretada) | Intuitiva ("90% chance de A ser melhor") |
| Peeking | Proibido (infla false positives) | Permitido com sequencial testing |
| Ferramentas | VWO (frequentist), Google Optimize (descontinuado) | Optimizely STATS Engine, Statsig |

**Recomendacao pratica:** Bayesian e mais intuitivo e permite parar cedo sem penalidade estatistica quando usando sequential testing. Frequentist e o padrao da industria — use com poder estatistico pre-calculado e nunca pare early.

## Multi-Armed Bandit (MAB)

Alternativa ao A/B test classico que otimiza durante o experimento. Aloca progressivamente mais trafego para a variante com melhor performance.

**Algoritmos:**
- **Epsilon-greedy:** Explora X% do trafego, explota (1-X)%
- **UCB (Upper Confidence Bound):** Balanceia incerteza e performance
- **Thompson Sampling:** Amostra de distribuicao posterior (Bayesian)

**Quando usar MAB vs A/B classico:**
| Situacao | Recomendacao |
|----------|-------------|
| Campanha com prazo curto | MAB — minimiza regret |
| Decisao permanente de produto | A/B classico — mais rigor estatistico |
| Otimizacao continua (ads creative) | MAB |
| Teste de hipotese de produto | A/B classico |
| Dados escassos | MAB (adapta-se mais rapido) |

## Experimentation Velocity Metrics

| Metrica | Definicao | Benchmark |
|---------|-----------|-----------|
| Tests per month | Numero de experimentos iniciados | >10 para times maduros |
| Time to launch | Tempo da ideia ao lancamento | <1 semana (ideal) |
| Win rate | % de testes com resultado positivo | 15-30% (normal) |
| Impact per test | Impacto medio na metrica-alvo | 5-15% uplift nos winners |
| Coverage | % de features/pages com tests ativos | >50% para lideres |

**Compound growth de experimentacao:**
```
Compound = (1 + avg_uplift)^wins_per_year

Exemplo: 20% win rate, 4 tests/month, 5% avg uplift nos winners
= (1.05)^(0.20 × 48) ≈ (1.05)^9.6 ≈ 1.59 = +59% ao ano
```

## CRO — Checkout Optimization

Taxa media de abandono de carrinho: ~70.2% (Baymard Institute, media de 50 estudos, 2025-2026)

| Causa de abandono | % | Solucao |
|-------------------|---|---------|
| Custos extras inesperados | 48% | Transparencia total de custos desde o inicio |
| Obrigacao de criar conta | 26% | Guest checkout |
| Processo muito complexo | 22% | Reduzir steps, progress indicator |
| Nao confia no site | 18% | Selos de seguranca, SSL, reviews |
| Demora na entrega | 16% | Opcoes claras de frete |
| Erros/crash no site | 13% | Performance, error handling |

**Para Brasil:** Oferecer PIX reduz abandono de checkout em 30-40% vs boleto bancario.

## Social Proof Framework (Cialdini)

| Tipo | Exemplo | Eficacia |
|------|---------|----------|
| **Expert** | "Recomendado por [autoridade]" | Alta para YMYL |
| **Celebrity** | Endorsement de figura publica | Alta para B2C |
| **User** | Testimonials, reviews, ratings | Alta universal |
| **Wisdom of crowds** | "50.000+ empresas confiam" | Alta para B2B |
| **Wisdom of friends** | "3 dos seus amigos usam" | Altissima (social) |
| **Certification** | Selos, premios, certificacoes | Media-alta |

## Pricing Page Best Practices

1. **3 tiers** — Ancora, opcao principal (highlighted), premium
2. **Highlight do plano recomendado** — Visual diferenciado
3. **Anual vs. Mensal toggle** — Mostrar economia claramente ("Economize 20%")
4. **Feature comparison table** — Transparencia sobre o que cada plano inclui
5. **FAQ** — Responder objecoes comuns

**Psicologia de pricing:**
- **Anchoring** — Plano mais caro primeiro faz o medio parecer razoavel
- **Decoy effect** — Plano que existe apenas para fazer outro parecer melhor
- **Charm pricing** — R$97 vs R$100 (efeito psicologico documentado)
- **Value-based framing** — "R$3 por dia" vs "R$90 por mes"

## Tools Reference
| Category | Tools |
|----------|-------|
| A/B Testing (enterprise) | Optimizely (STATS Engine), VWO, AB Tasty |
| A/B Testing (full-stack) | Statsig, LaunchDarkly, PostHog, Growthbook |
| Heatmaps | Hotjar, FullStory, Microsoft Clarity (free) |
| Surveys | Hotjar, Typeform, SurveyMonkey |
| Analytics | GA4, Amplitude, Mixpanel |
| Session Recording | FullStory, Hotjar, LogRocket |
| Statistical calculators | Evan Miller calculator, AB Test Guide |
| Open-source | Growthbook (Bayesian, warehouse-native), PostHog |
