---
task: map-growth-loops
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

# Task: Map Growth Loops

## Metadata
- **Squad:** squad-growth
- **Agent:** Lever (ga-growth-hacker)
- **Complexity:** Advanced

## Objetivo
Mapear growth loops — identificar e documentar ciclos auto-reforçantes que geram crescimento composto, diferenciando de funnels lineares e priorizando loops por potencial de impacto.

## Entrada
- Product/service model
- Current acquisition channels
- User behavior data
- Revenue model

## Passos

### 1. Growth Loops vs Funnels
| Aspecto | Funnel (Linear) | Loop (Composto) |
|---------|----------------|----------------|
| Estrutura | Topo → Fundo | Circular, auto-alimenta |
| Crescimento | Linear com investimento | Exponencial (compounding) |
| Input | Constante (investimento continuo) | Diminui com maturidade |
| Defensibilidade | Baixa (qualquer um compra ads) | Alta (network effects, data) |
| Exemplo | Ads → Landing → Signup | User → Content → SEO → New User |

### 2. Growth Loop Types
| Loop | Mecanismo | Exemplo | Compound Factor |
|------|----------|---------|----------------|
| Viral | User convida users | Dropbox referral | Users per invite cycle |
| Content | User gera conteudo indexavel | Reddit, Quora, YouTube | Pages indexed × CTR |
| Paid | Revenue reinvestida em ads | E-commerce DTC | ROAS × reinvestment rate |
| Product | Uso do produto gera valor para outros | Slack, marketplace | Cross-side network effect |
| Sales | Revenue funded sales team | Enterprise SaaS B2B | ACV × sales efficiency |
| Data | Mais users = melhor produto | Google, Netflix | Accuracy improvement rate |

### 3. Loop Mapping Template
```
LOOP NAME: [Nome do loop]
TYPE: [Viral/Content/Paid/Product/Sales/Data]

┌──────────────────────────────────────────────────────┐
│                                                      │
│  [Step 1: Input/Trigger]                             │
│       │                                              │
│       ▼                                              │
│  [Step 2: User Action]                               │
│       │                                              │
│       ▼                                              │
│  [Step 3: Value Creation]                            │
│       │                                              │
│       ▼                                              │
│  [Step 4: Distribution/Amplification]                │
│       │                                              │
│       ▼                                              │
│  [Step 5: New User Acquisition] ───────► Back to 1   │
│                                                      │
└──────────────────────────────────────────────────────┘

METRICS:
- Cycle time: [days per loop iteration]
- Conversion per step: [%]
- Output ratio: [new users per loop cycle]
- Compound rate: [monthly growth from loop]
```

### 4. Loop Efficiency Metrics
| Metrica | Formula | Target |
|---------|---------|--------|
| Loop Cycle Time | Time from input to output | Minimize |
| Step Conversion | Users completing each step / entering | Maximize |
| Output Ratio | New inputs generated per cycle | > 1.0 for viral |
| Loop Contribution | % of new users from this loop | Track growth share |
| Compound Rate | MoM growth attributable to loop | Increasing |
| CAC of Loop | Total cost / users from loop | < other channels |

### 5. Example Loops Mapped
**Content Loop (SaaS/Blog):**
```
Expert creates content
    → Content indexed by Google
        → Organic visitor finds content
            → Visitor signs up (freemium)
                → User creates content/data
                    → Public profiles/pages indexed
                        → New organic visitors (loop repeats)

Metrics:
- Cycle time: 30-90 days (SEO indexing)
- Content → Signup: 2-5%
- Signup → Creates content: 20-40%
- Content → Indexed → Visitor: varies
```

**Viral Loop (Referral):**
```
User experiences value
    → User invited to share/refer
        → Invitation sent to contacts
            → Contact receives invite
                → Contact signs up
                    → New user experiences value (loop repeats)

Metrics:
- Cycle time: 3-7 days
- Invite rate: 20-40%
- Avg invites sent: 2-5
- Accept rate: 10-30%
- K-factor: invite_rate × invites × accept_rate
```

### 6. Loop Prioritization
| Loop | Cycle Time | Output Ratio | CAC | Defensibility | Score |
|------|-----------|-------------|-----|-------------|-------|
| | Days | Ratio | R$ | High/Med/Low | 1-10 |

**Scoring criteria:**
- Short cycle time = higher score
- Output ratio > 1 = highest priority
- Low/zero CAC = higher score
- High defensibility = long-term priority

### 7. Loop Optimization Levers
| Step do Loop | Lever de Otimizacao | Impacto |
|-------------|-------------------|---------|
| Input trigger | Reduce friction to enter loop | More inputs |
| User action | Simplify core action | Higher completion |
| Value creation | Increase value per cycle | Better retention |
| Distribution | Amplify reach per cycle | More outputs |
| Conversion | Optimize signup/activation | Higher ratio |

## Saida
- Growth loop map (visual)
- Loop metrics per loop identified
- Prioritization matrix
- Optimization recommendations
- Loop health dashboard spec

## Validacao
- [ ] Pelo menos 3 loops potenciais identificados
- [ ] Cada loop mapeado com steps e metricas
- [ ] Loops priorizados por potencial
- [ ] Diferenciaciao clara de loops vs funnels
- [ ] Optimization levers identificados por loop
- [ ] Metricas de tracking definidas
