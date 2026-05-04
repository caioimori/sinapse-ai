# Customer Success Operations

## Customer Health Score Framework

### Composite Health Score Model (Gainsight-inspired)
```
HEALTH SCORE = Weighted average of 6 dimensions

Dimension weights (customizable):
  Engagement (25%): Touchpoint frequency and quality
  Adoption (20%): Service utilization vs contracted scope
  Support (15%): Ticket volume, sentiment, resolution
  Satisfaction (15%): NPS, CSAT, qualitative feedback
  Contract (15%): Renewal proximity, expansion signals
  Outcomes (10%): ROI achievement vs success plan

Scoring: Each dimension 0-100, weighted total 0-100

Health Bands:
  Green (80-100): Healthy — expansion opportunity
  Yellow (50-79): At risk — intervention needed
  Red (0-49): Critical — save play required
```

### Dimension Breakdown

#### Engagement Score (25%)
| Factor | Weight | Green | Yellow | Red |
|--------|--------|-------|--------|-----|
| Executive sponsor contact | 30% | Monthly+ | Quarterly | None in 90+ days |
| Day-to-day contact | 30% | Weekly | Bi-weekly | Monthly or less |
| Meeting attendance | 20% | >80% | 50-80% | <50% |
| Response time to CSM | 20% | <24h | 24-72h | >72h |

#### Adoption Score (20%)
| Factor | Weight | Green | Yellow | Red |
|--------|--------|-------|--------|-----|
| Services utilized vs contracted | 40% | >90% | 60-90% | <60% |
| Feature/capability adoption | 30% | >80% | 50-80% | <50% |
| Active users vs licensed | 30% | >80% | 50-80% | <50% |

#### Outcomes Score (10%)
| Factor | Weight | Green | Yellow | Red |
|--------|--------|-------|--------|-----|
| Success plan milestones on track | 50% | >80% | 50-80% | <50% |
| ROI demonstrated | 50% | >target | On track | Below target |

---

## Desired Outcome Framework (Lincoln Murphy)

### Components
```
DESIRED OUTCOME = Required Outcome + Appropriate Experience

Required Outcome (RO):
  The functional job they hired you to do
  → What they NEED to achieve (measurable)
  → Example: "Increase qualified leads by 50%"

Appropriate Experience (AX):
  HOW they need to achieve it
  → The experience of working with you
  → Example: "With strategic partnership feel, not vendor treatment.
     Proactive insights, not just execution. Seamless communication."

Key insight: Two clients may have the same Required Outcome
but completely different Appropriate Experiences.

Client A: Startup CTO
  RO: "Launch product website"
  AX: "Fast, scrappy, iterate together, Slack-first, no bureaucracy"

Client B: Enterprise VP Marketing
  RO: "Launch product website"
  AX: "Process-driven, documented, weekly status reports, formal review gates"

SAME deliverable, DIFFERENT success criteria.
Failure to understand AX is a leading cause of "surprise churn."
```

---

## Trust Equation (David Maister)

### The Formula
```
              Credibility + Reliability + Intimacy
TRUST = ─────────────────────────────────────────────
                    Self-Orientation

Credibility: "I believe what they say" (expertise, credentials)
  Build via: Thought leadership, case studies, accurate predictions

Reliability: "I can count on them" (consistency, dependability)
  Build via: On-time delivery, proactive communication, keeping promises

Intimacy: "I feel safe sharing with them" (emotional safety)
  Build via: Empathy, vulnerability, confidentiality, personal connection

Self-Orientation: "They care about me, not just the deal" (inverse)
  Reduce via: Listening more than talking, challenging assumptions,
              recommending against your interest when appropriate

The denominator (Self-Orientation) has the biggest impact.
A brilliant, reliable team that seems self-serving will have LOW trust.
A less impressive team that genuinely prioritizes the client will have HIGH trust.
```

---

## NPS (Net Promoter Score)

### Implementation
```
THE QUESTION:
  "On a scale of 0-10, how likely are you to recommend
  [company/service] to a colleague or friend?"

FOLLOW-UP:
  "What is the primary reason for your score?" (open text)

SEGMENTS:
  Promoters (9-10): Loyal enthusiasts, fuel growth
  Passives (7-8): Satisfied but unenthusiastic, vulnerable to competition
  Detractors (0-6): Unhappy, can damage brand through negative word-of-mouth

CALCULATION:
  NPS = % Promoters - % Detractors
  Range: -100 to +100

BENCHMARKS (B2B Services):
  Below 0: Critical problem
  0-30: Needs improvement
  30-50: Good (industry average)
  50-70: Excellent
  70+: World-class
```

### NPS Action Framework
| Segment | Action | Timeline | Owner |
|---------|--------|----------|-------|
| Promoter (9-10) | Thank + referral/testimonial ask | 24-48h | CSM |
| Passive (7-8) | "What would make us a 10?" conversation | 1 week | CSM |
| Detractor (0-6) | Immediate outreach + escalation | 24h | CSM + Manager |

---

## CS Maturity Model

### Five Levels
```
LEVEL 1: REACTIVE
  CS = Support escalation handler
  Metric: Response time
  Trigger: Client complains
  Value: Cost center (saves some churn)

LEVEL 2: PROACTIVE
  CS = Relationship manager with health scores
  Metric: Health score, NPS
  Trigger: Health score drops
  Value: Churn reduction

LEVEL 3: STRATEGIC
  CS = Business partner with success plans
  Metric: NRR, expansion rate
  Trigger: QBR insights, expansion signals
  Value: Revenue contributor

LEVEL 4: TRANSFORMATIONAL
  CS = Growth engine with advocacy programs
  Metric: NRR > 120%, referral revenue, advocacy metrics
  Trigger: Proactive opportunity detection
  Value: Revenue multiplier

LEVEL 5: PRODUCT-LED CS
  CS = Data-driven at scale with product analytics
  Metric: Usage-driven health, automated interventions
  Trigger: Behavioral signals in product/platform
  Value: Scalable growth engine
```

### Maturity Assessment
| Dimension | L1 | L2 | L3 | L4 | L5 |
|-----------|----|----|----|----|-----|
| Health Scoring | None | Basic | Multi-dimensional | Predictive | ML-driven |
| Segmentation | None | By ARR | By health + ARR | By potential | Dynamic |
| Playbooks | None | 1-2 reactive | 5+ proactive | Complete library | Automated |
| Expansion | None | Ad-hoc | Systematic | Proactive | Product-led |
| Advocacy | None | None | Ad-hoc testimonials | Formal program | Community |
| Tech Stack | Spreadsheet | CRM | CS platform | Integrated stack | AI-augmented |

---

## QBR (Quarterly Business Review) Framework

### Structure
```
QBR AGENDA — 60 minutes

1. LOOK BACK (20 min)
   a. Success plan progress review
   b. Key metrics: what moved, what didn't
   c. Wins to celebrate (specific, measurable)
   d. Challenges addressed and how

2. CURRENT STATE (15 min)
   a. Health score review (transparent with client)
   b. Team/stakeholder update
   c. Open items or concerns
   d. Satisfaction temperature check

3. LOOK FORWARD (20 min)
   a. Next quarter priorities and milestones
   b. Success plan adjustments
   c. New opportunities or initiatives
   d. Resource or scope alignment

4. STRATEGIC ALIGNMENT (5 min)
   a. Business direction changes
   b. Budget cycle awareness
   c. Expansion conversation (if appropriate)
   d. Introductions to additional stakeholders

CLOSE: Recap action items, owners, dates
```

### QBR Best Practices
```
PREPARATION:
  □ Review all metrics 1 week before
  □ Pre-align with client champion on hot topics
  □ Prepare custom deck (no generic template fill-in)
  □ Invite right stakeholders (both sides)

DURING:
  □ Let client talk >50% of the time
  □ Use their language, not yours
  □ Be transparent about what didn't work
  □ Present data visually (charts, not tables)

AFTER:
  □ Send summary email within 24h
  □ Update success plan with new milestones
  □ Log all action items in CRM
  □ Brief internal team on key insights
```

---

## Churn Prevention Tiers

### Response Escalation
```
TIER 1: EARLY WARNING (Health Score 65-79)
  Signal: Declining engagement, minor dissatisfaction signals
  Response: CSM-led intervention
  Actions:
    □ Schedule check-in call
    □ Review recent deliverables for quality
    □ Address small issues before they compound
  Timeline: Action within 1 week
  Goal: Return to Green within 30 days

TIER 2: AT RISK (Health Score 50-64)
  Signal: Active dissatisfaction, missed milestones, champion disengagement
  Response: CSM + Manager intervention
  Actions:
    □ Root cause analysis
    □ Recovery plan with specific actions
    □ Executive alignment if needed
    □ Quick-win delivery
  Timeline: Action within 48 hours
  Goal: Stabilize within 2 weeks, recover within 60 days

TIER 3: CRITICAL (Health Score <50)
  Signal: Formal complaint, non-renewal signal, executive escalation
  Response: CSM + Director + Executive sponsor
  Actions:
    □ Emergency assessment (4-hour SLA)
    □ Executive-to-executive call
    □ Concession authority activated
    □ Dedicated recovery resources assigned
  Timeline: Action within 4 hours
  Goal: Save the account, any terms necessary

TIER 4: SAVE PLAY (Active churn request)
  Signal: Client communicates intent to leave
  Response: Full save protocol
  Actions:
    □ Understand true reason (exit interview)
    □ Calculate retention offer ROI
    □ Present retention proposal
    □ If lost: graceful offboarding + win-back plan
  Timeline: Immediate
  Goal: 30-40% save rate on activated save plays
```

---

## Expansion Revenue Playbook

### Upsell vs. Cross-Sell
- **Upsell** — Vender mais do mesmo (mais seats, tier superior, features premium)
- **Cross-Sell** — Vender produtos complementares (módulo adicional, serviço adjacente)

### Trigger-Based Expansion (quando agir)
| Trigger | Sinal | Ação |
|---------|-------|------|
| **Uso atingiu 80%** do limite contratado | Alert automático do CS platform | Proor upgrade com desconto de antecipação |
| **ROI forte documentado** no QBR | Métricas de sucesso cumpridas | Proposta de expansão de escopo |
| **Evento de crescimento** do cliente | Funding, contratação massiva, nova unidade | Contato proativo com proposta de expansão |
| **Champion promovido** | LinkedIn, anúncio interno | Reativar conversa, nova proposta para o novo cargo |
| **Novo stakeholder** relevante | Novo VP Marketing, novo CTO | Introdução + apresentação de valor |
| **Renovação em 90 dias** | Lembrete automático | Proposta de multi-year com incentivo |
| **Produto atingiu limite** | Product analytics | PQL → PLS motion (se PLG aplicável) |

### Expansion Motion Framework
```
1. Identificar trigger (automático via CS platform ou product analytics)
2. Verificar health score (só prospectar expansão em contas Green/Yellow)
3. Construir business case baseado nos resultados já entregues
4. Levar na QBR ou agendar reunião específica de expansão
5. Proposta de 3 opções (crescimento incremental, médio, transformacional)
6. Fechar com urgência real (incentivo por Q ou capacidade limitada)
```

---

## Churn Prediction — Sinais e Modelos

### Sinais Precoces de Churn (detectar com antecedência de 30-90 dias)
| Sinal | Peso | Como Detectar |
|-------|------|--------------|
| Login frequency caiu >30% MoM | Alto | Product analytics (Mixpanel, Amplitude, Gainsight) |
| **Champion saiu** da empresa | Crítico | LinkedIn, email bounce, sem resposta a CSM |
| Support tickets críticos abertos >7 dias | Alto | CRM / helpdesk (Zendesk, Intercom) |
| Não responde CSM há >2 semanas | Alto | CRM activity tracking |
| Não participou da última QBR | Médio | Calendar records |
| **Downgrade request** ou redução de seats | Crítico | CRM deal record |
| Concorrente mencionado em calls | Alto | Gong/Chorus — competitive mention alerts |
| Pagamento atrasado | Médio | Finance / ERP integration |
| NPS caiu para <7 na última pesquisa | Alto | NPS tool (Delighted, Medallia) |
| Feature adoption caiu para <50% | Médio | Product analytics |

### Modelo de ML para Churn Prediction
```
Features tipicamente usadas:
  Comportamentais: usage patterns, login frequency, feature adoption, session duration
  Relacionamento: CSM interaction frequency, meeting attendance, email response time
  Financeiro: billing history, payment delays, contract value changes
  Engajamento: NPS trends, support ticket volume/sentiment
  Firmográfico: company size changes, funding events, leadership changes

Modelos comuns:
  Logistic Regression — baseline interpretável
  Random Forest — bom com features mistas
  Gradient Boosting (XGBoost) — melhor performance geralmente
  
Horizonte de predição: 30-90 dias de antecedência é o sweet spot
  (>90 dias: muita incerteza | <30 dias: tarde demais para salvar)

Threshold de ativação: Probabilidade >40% de churn → trigger save play
```

---

## Customer Success Maturity — Métricas por Nível
| Nível | NRR Típico | Logo Retention | NPS | Ratio CSM:Contas |
|-------|-----------|---------------|-----|-----------------|
| L1 Reactive | <85% | <80% | <20 | 1:50-100 |
| L2 Proactive | 85-100% | 80-90% | 20-40 | 1:30-50 |
| L3 Strategic | 100-115% | 90-95% | 40-55 | 1:15-30 |
| L4 Transformational | 115-130% | 95-98% | 55-70 | 1:10-20 (high-touch) |
| L5 Product-Led CS | >130% | >98% | >70 | 1:100+ (tech-touch) |

---

## References
- Murphy, L. — *Customer Success: How Innovative Companies Are Reducing Churn* (2016)
- Mehta, N., Steinman, D., Murphy, L. — *Customer Success* (2016)
- Maister, D. — *The Trusted Advisor* (2000)
- Reichheld, F. — *The Ultimate Question 2.0* (NPS)
- Gainsight — Health Score methodology e CS platform benchmarks
- Winning by Design — CS operating model (Bow Tie right side)
- Bain & Company — 5% retention uplift → 25-95% profit increase research
