---
task: create-product-playbook
responsavel: "@ps-product-ops-specialist"
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

# Create Product Playbook

## Metadata
- **Agent:** ps-product-ops-specialist (Mosaic)
- **Complexity:** High
- **Estimated Time:** 8-12 hours
- **Produces:** Comprehensive product playbook, operational guides, best practices library

## Purpose
Compilar playbook operacional de produto que codifica como a agencia faz product management. O playbook e a "inteligencia coletiva" — o que aprendemos funciona, padronizado e replicavel.

## Steps

### Step 1: Playbook Structure
```
PRODUCT PLAYBOOK
════════════════
Version: [v1.0]
Last Updated: [date]
Owner: ps-product-ops-specialist (Mosaic)

TABLE OF CONTENTS:
1. How We Do Product Management
2. Client Engagement Model
3. Discovery & Research Playbook
4. Delivery & Sprint Playbook
5. Analytics & Metrics Playbook
6. Client Communication Playbook
7. Tool Stack & Setup Guide
8. Templates & Artifacts
9. Escalation & Decision Guide
10. Onboarding Guide for New PMs
```

### Step 2: Core Sections Content

**Section 1: How We Do Product**
```
OUR PRODUCT PRINCIPLES:
1. Evidence over opinion — data and research drive decisions
2. Outcomes over outputs — measure value, not features shipped
3. Continuous discovery — discovery is a habit, not a phase
4. Client as partner — collaborative, not order-taking
5. Quality over speed — tech debt is paid, not ignored
6. Transparency — share good and bad news equally

OUR FRAMEWORKS:
- Discovery: Continuous Discovery Habits (Teresa Torres)
- Strategy: Strategy Canvas + Positioning (Dunford)
- Prioritization: RICE + MoSCoW
- Delivery: Shape Up appetite + Scrum sprints
- Metrics: AARRR Pirate Metrics + Product Health Score
- Client Management: Dual Roadmap + QBR Cycle
```

**Section 2: Client Engagement Model**
```
ENGAGEMENT LIFECYCLE:
1. Onboarding (Week 1-2): Setup, discovery, quick win
2. Foundation (Month 1-2): Strategy, roadmap, processes
3. Delivery (Ongoing): Sprint execution, continuous discovery
4. Optimization (Quarterly): QBR, metrics review, strategy refresh
5. Handoff/Renewal: Package preparation, transition or continuation

ROLES PER ENGAGEMENT:
| Role | Responsibility | Allocation |
|------|---------------|-----------|
| Product Strategist | Vision, strategy, OKRs | 10-20% |
| Discovery Lead | Research, validation | 20-30% |
| Product Analyst | Metrics, data, experiments | 15-25% |
| Delivery Manager | Sprints, releases, tech debt | 20-30% |
| Client PM | Communication, scope, relationship | 15-25% |
| Product Ops | Processes, tools, templates | 5-10% |
```

### Step 3: Situational Plays
**Playbook Plays (specific situations):**

**Play: New Client Kickoff**
```
Trigger: New client engagement starts
Timeline: First 2 weeks
Steps:
1. Stakeholder mapping (Day 1)
2. Product health baseline (Day 2-3)
3. Quick win identification (Day 3-5)
4. Discovery sprint plan (Day 5-7)
5. Roadmap draft (Day 7-10)
6. Kickoff presentation (Day 10-14)
Success: Client has clear vision of engagement direction
```

**Play: Metric Decline Response**
```
Trigger: Key metric drops >10% WoW
Timeline: Within 48 hours
Steps:
1. Verify data accuracy (is tracking correct?)
2. Check for external factors (seasonality, outage)
3. Segment analysis (which users affected?)
4. Recent changes review (did we ship something?)
5. Root cause hypothesis
6. Communicate to stakeholders
7. Action plan
Success: Root cause identified, action in progress
```

**Play: Client Escalation**
```
Trigger: Client expresses dissatisfaction
Timeline: Same day
Steps:
1. Acknowledge immediately (never defensive)
2. Gather full context from all sides
3. Internal alignment on response
4. Client meeting within 24h
5. Written action plan within 48h
6. Weekly check-ins until resolved
Success: Client satisfaction restored
```

**Play: Feature Launch**
```
Trigger: Feature ready for production
Timeline: Per launch checklist
Steps: [reference execute-feature-launch-checklist task]
```

### Step 4: Best Practices Library
**Curated from experience across clients:**
| Practice | Category | When to Apply | Evidence |
|----------|----------|--------------|---------|
| Weekly user interviews | Discovery | Always | Teresa Torres - reduces risk |
| 15% tech debt allocation | Delivery | Every sprint | Prevents velocity decline |
| Now/Next/Later roadmap | Client | All roadmap presentations | Reduces false commitments |
| Dual roadmap system | Client | All engagements | Internal alignment + client clarity |
| Sprint confidence vote | Delivery | Every planning | Improves commitment accuracy |
| Feature flag rollouts | Delivery | All launches | Reduces launch risk |
| Monthly NPS pulse | Analytics | All products | Early churn detection |

### Step 5: Anti-Patterns (What NOT to Do)
| Anti-Pattern | Why It Fails | Better Approach |
|-------------|-------------|-----------------|
| Building without validating | Wasted effort, wrong solution | Validate problem first |
| Promising dates to clients | Creates false expectations | Use confidence levels |
| Skipping tech debt | Velocity decreases over time | Protect 15% budget |
| Output-focused metrics | Measures effort, not value | Measure outcomes |
| Single point of contact | Knowledge risk, burnout | Cross-train team |
| No retrospectives | Same mistakes repeated | Bi-weekly retros |
| Verbal scope changes | Leads to disputes | Always document |

### Step 6: Playbook Maintenance
**Update Triggers:**
| Trigger | Action | Owner |
|---------|--------|-------|
| New best practice confirmed | Add to practices library | PM who discovered |
| Play fails in practice | Update or remove play | Team retrospective |
| New framework adopted | Add to frameworks section | Product Ops |
| Client feedback pattern | Update relevant plays | Product Ops |
| Quarterly review | Full playbook review | Product Ops |

## Output Artifacts
- `product-playbook.md` (master document) | `plays/[play-name].md` (individual plays) | `best-practices-library.md` | `anti-patterns.md`

## Quality Criteria
- All core processes documented | Situational plays have clear triggers and steps | Best practices based on evidence (not opinion) | Anti-patterns included (what NOT to do) | Onboarding path clear | Quarterly review scheduled | Team contributed to content
