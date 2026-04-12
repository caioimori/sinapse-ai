---
task: present-product-metrics-to-client
responsavel: "@ps-client-product-manager"
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

# Present Product Metrics to Client

## Metadata
- **Agent:** ps-client-product-manager (Proxy)
- **Complexity:** Medium
- **Estimated Time:** 2-3 hours
- **Produces:** Client metrics presentation, narrative report, discussion points

## Purpose
Apresentar metricas de produto para clientes de forma que gere confianca e direcione conversas estrategicas. Clientes nao querem dashboards — querem entender se seu investimento esta gerando resultado.

## Steps

### Step 1: Select Client-Appropriate Metrics
**Filter Rule:** Only show metrics the client can understand and act on.

**Client-Facing Metrics (show these):**
| Category | Metric | Why Client Cares |
|----------|--------|-----------------|
| Growth | Active users trend | "Is the product growing?" |
| Engagement | Usage frequency | "Are people actually using it?" |
| Satisfaction | NPS or CSAT | "Are users happy?" |
| Performance | Uptime, page speed | "Is it reliable?" |
| Business | Conversion, revenue | "Is it making money?" |
| Progress | Features shipped | "Are we getting what we paid for?" |

**Internal-Only Metrics (never show):**
- Sprint velocity / story points
- Bug count / defect density
- Code coverage %
- Tech debt ratio
- Individual developer performance
- Internal team satisfaction

### Step 2: Build Metric Narrative
**Per Metric, Create Story:**
```
METRIC: [name]
VALUE: [current] (was [previous period])
TREND: [up/down/stable] — [% change]
CONTEXT: [why this happened — connect to actions taken]
SO WHAT: [what this means for client business]
NEXT: [what we are doing about it]
```

**Example:**
```
METRIC: Monthly Active Users
VALUE: 12,500 (was 10,200 last month)
TREND: Up 22.5%
CONTEXT: New onboarding flow launched mid-month reduced friction
SO WHAT: More users reaching value, supporting retention goals
NEXT: Optimizing activation funnel to convert more signups
```

### Step 3: Presentation Structure
**Client Metrics Presentation (15-20 min):**

**Slide 1: Health Overview**
- Overall product health score (simple gauge: green/yellow/red)
- 3 key metrics with trend arrows
- One-sentence summary

**Slide 2-3: Growth & Engagement**
- User growth trend (line chart, 3-month view)
- Engagement metrics (usage frequency, session depth)
- Narrative: what drove growth, what to watch

**Slide 4: User Satisfaction**
- NPS or CSAT trend
- Top positive feedback theme
- Top improvement area
- Action being taken

**Slide 5: Business Impact**
- Revenue-related metrics (if applicable)
- Conversion rates
- Cost efficiencies gained

**Slide 6: Delivery Progress**
- What shipped this period (outcome language)
- Current sprint focus
- Upcoming milestones

**Slide 7: Discussion**
- Open questions
- Client input needed on priorities
- Upcoming decisions

### Step 4: Prepare for Tough Questions
**Common Client Questions About Metrics:**
| Question | How to Answer |
|----------|--------------|
| "Why is [metric] down?" | Data + root cause + action plan (never defensive) |
| "How do we compare to competitors?" | Share benchmarks if available, caveat differences |
| "When will we see improvement?" | Specific actions + realistic timeline (not promises) |
| "What is the ROI?" | Frame in terms they care about (time saved, users gained, revenue) |
| "Why are we paying for tech debt?" | Explain as investment in speed and reliability |

### Step 5: Client Communication Principles
**Do:**
- Start with wins (positive momentum)
- Use simple language (no jargon)
- Connect metrics to their business goals
- Be honest about challenges
- Offer options, not excuses
- Show progress over time (trends matter more than snapshots)

**Do Not:**
- Overwhelm with data (max 7 metrics per presentation)
- Show metrics without context
- Hide bad news (erodes trust when discovered)
- Promise specific metric targets you cannot control
- Compare to internal benchmarks client cannot relate to

### Step 6: Follow-Up
**Post-Presentation:**
- [ ] Send metrics summary email within 24h
- [ ] Document client questions and concerns
- [ ] Update metrics dashboard access (if shared)
- [ ] Log any priority changes from discussion
- [ ] Schedule next metrics review

## Output Artifacts
- `client-metrics-presentation-[date].md` | `metrics-narrative-[client].md` | `client-questions-log.md`

## Quality Criteria
- Only client-appropriate metrics shown | Every metric has narrative (not just number) | Trends shown (not just current value) | Wins highlighted alongside challenges | Discussion time allocated | Follow-up within 24h
