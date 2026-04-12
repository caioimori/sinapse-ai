---
task: define-north-star-metric
responsavel: "@ga-growth-hacker"
responsavel_type: Agent
atomic_layer: Task
elicit: false

Entrada:
  - campo: context
    tipo: object
    origem: "workflow ou manual"
    obrigatorio: true

Saida:
  - campo: resultado
    tipo: document
    destino: "stakeholders"

Checklist:
  - "[ ] Validar inputs e pre-condicoes"
  - "[ ] Executar steps conforme documentado"
  - "[ ] Verificar criterios de qualidade"
  - "[ ] Gerar output no formato especificado"
---

# Task: Define North Star Metric

## Metadata
- **Squad:** squad-growth
- **Agent:** Lever (ga-growth-hacker)
- **Complexity:** Standard

## Objetivo
Definir North Star Metric — identificar a metrica unica que melhor captura o core value entregue aos clientes e serve como bussola de alinhamento para todas as equipes e decisoes de growth.

## Entrada
- Business model
- Product value proposition
- Current KPIs
- Customer success definition

## Passos

### 1. North Star Metric Criteria
| Criterio | Descricao | Peso |
|----------|----------|------|
| Value-driven | Reflete valor entregue ao cliente | Essencial |
| Leading indicator | Prediz revenue/growth futura | Essencial |
| Actionable | Times podem influenciar diretamente | Essencial |
| Measurable | Pode ser medida com precisao | Essencial |
| Understandable | Toda a empresa entende | Importante |
| Non-gameable | Dificil de manipular artificialmente | Importante |
| Timely | Muda rapido o suficiente para feedback | Importante |

### 2. North Star por Tipo de Negocio
| Modelo | North Star Metric | Exemplos Reais |
|--------|------------------|---------------|
| SaaS B2B | Weekly Active Teams using core feature | Slack: Messages sent |
| SaaS B2C | Daily Active Users performing key action | Spotify: Time spent listening |
| E-commerce | Weekly purchases from repeat customers | Amazon: Purchase frequency |
| Marketplace | Weekly transactions completed | Airbnb: Nights booked |
| Content/Media | Daily engaged reading time | Medium: Total reading time |
| Ad-supported | Daily Active Users × Engagement time | Facebook: DAU |
| Freemium | Free-to-Paid conversion within 30 days | Dropbox: Files synced |
| Fintech | Weekly active transacting users | Nubank: Monthly transactions |
| Gaming | Daily Active Users × Session length | Any game: DAU + time |

### 3. North Star Discovery Process
| Step | Atividade | Output |
|------|----------|--------|
| 1 | Map value moments | Lista de "aha moments" por persona |
| 2 | Correlate with retention | Qual acao prediz retencao D30+? |
| 3 | Correlate with revenue | Qual acao prediz revenue growth? |
| 4 | Candidate selection | 3-5 metricas candidatas |
| 5 | Validation | Testar correlacao estatistica |
| 6 | Team alignment | Apresentar e alinhar com lideranca |
| 7 | Instrumentation | Implementar tracking confiavel |

### 4. North Star Validation
| Teste | Metodo | Criterio de Aprovacao |
|-------|--------|---------------------|
| Correlation with revenue | Pearson/Spearman correlation | r > 0.7 |
| Leading indicator test | Granger causality | p < 0.05 |
| Team alignment test | Survey all team leads | > 80% agree |
| Actionability test | Can teams define experiments to improve it? | Yes |
| Anti-gaming test | Can it be artificially inflated without value? | No |

### 5. Input Metrics (Drivers)
```
North Star Metric: [Definir]
    │
    ├── Input 1: [Reach/Acquisition]
    │   What: Number of users exposed
    │   Owner: Marketing
    │
    ├── Input 2: [Activation]
    │   What: % reaching aha moment
    │   Owner: Product
    │
    ├── Input 3: [Engagement Depth]
    │   What: Frequency/intensity of usage
    │   Owner: Product
    │
    └── Input 4: [Retention]
        What: Users continuing to derive value
        Owner: Product + CS
```

### 6. Counter-Metrics
| North Star | Counter-Metric | Por que |
|-----------|---------------|---------|
| DAU | Revenue per user | Evita crescimento sem monetizacao |
| Revenue | Customer satisfaction (NPS) | Evita short-term revenue extraction |
| Transactions | Customer support tickets | Evita volume sem qualidade |
| Signups | Activation rate | Evita vanity signups |
| Time in app | Task completion rate | Evita engagement sem valor |

### 7. Communication Template
```
OUR NORTH STAR METRIC

[Metric Name]: [Definition in plain language]

WHY THIS METRIC:
- It reflects the core value we deliver: [explanation]
- It correlates with [revenue/retention/growth] (r = X.XX)
- Every team can influence it through their work

CURRENT STATE:
- Current value: [X]
- 90-day trend: [up/down/flat]
- Target (6 months): [Y]

HOW EACH TEAM CONTRIBUTES:
- Marketing: Drive [input 1]
- Product: Improve [input 2] and [input 3]
- Engineering: Enable [supporting metric]
- Customer Success: Maintain [input 4]

COUNTER-METRIC:
We also track [counter-metric] to ensure healthy growth.
```

## Saida
- North Star Metric definition
- Validation evidence (correlations)
- Input metrics framework
- Counter-metric selection
- Communication document
- Tracking implementation plan

## Validacao
- [ ] NSM atende todos os 7 criterios
- [ ] Correlacao com revenue validada (r > 0.7)
- [ ] Input metrics definidos com owners
- [ ] Counter-metric selecionado
- [ ] Lideranca alinhada (> 80% concordancia)
- [ ] Tracking implementado e confiavel
- [ ] Communication template distribuido
