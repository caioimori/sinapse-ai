---
task: create-product-onboarding-runbook
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

# Create Product Onboarding Runbook

## Metadata
- **Agent:** ps-product-ops-specialist (Mosaic)
- **Complexity:** Medium
- **Estimated Time:** 3-4 hours
- **Produces:** PM onboarding runbook, learning path, checklist, 30-60-90 day plan

## Purpose
Criar runbook de onboarding para novos Product Managers que entram na agencia, garantindo produtividade rapida e alinhamento com nossos padroes e frameworks.

## Steps

### Step 1: Onboarding Timeline
**30-60-90 Day Plan:**

**Days 1-7: Orient**
- [ ] Meet the team (all squad members + key stakeholders)
- [ ] Access setup (all tools, channels, documents)
- [ ] Read product playbook (core framework understanding)
- [ ] Review current client portfolio (active engagements)
- [ ] Shadow experienced PM on 3+ client meetings
- [ ] Review 2-3 completed projects (understand our output quality)

**Days 8-30: Learn**
- [ ] Deep dive on assigned client(s) (product, metrics, stakeholders)
- [ ] Review decision log for assigned client(s)
- [ ] Attend all sprint ceremonies (planning, demo, retro)
- [ ] Conduct 3+ internal interviews (dev, design, QA perspectives)
- [ ] Complete frameworks quiz (validate understanding)
- [ ] Lead first client meeting (with experienced PM observing)
- [ ] Write first sprint status report

**Days 31-60: Contribute**
- [ ] Lead sprint planning independently
- [ ] Prepare and present first metrics review
- [ ] Conduct first user interview
- [ ] Handle first client request (intake + reframe)
- [ ] Create first roadmap update
- [ ] Identify first improvement opportunity

**Days 61-90: Own**
- [ ] Full ownership of assigned client(s)
- [ ] Lead first QBR independently
- [ ] Contribute to product playbook (add learning)
- [ ] Mentor next new PM (if applicable)
- [ ] 90-day review with leadership

### Step 2: Essential Knowledge Modules
**Learning Path:**
| Module | Content | Duration | Assessment |
|--------|---------|----------|-----------|
| 1. Squad Framework | Squad structure, agents, workflows | 2h | Quiz |
| 2. Product Principles | Our principles, frameworks, standards | 2h | Discussion |
| 3. Client Management | Engagement model, communication, QBRs | 2h | Role play |
| 4. Discovery Methods | Interviews, research, validation | 3h | Practice session |
| 5. Delivery Process | Sprints, estimation, launch, tech debt | 2h | Observe + lead |
| 6. Analytics | Metrics, dashboards, experiments | 2h | Dashboard review |
| 7. Tools | Tool stack, setup, best practices | 1h | Self-paced |
| 8. Templates | Template library, when to use each | 1h | Practice |

### Step 3: Critical Frameworks Reference
**Frameworks Every PM Must Know:**
| Framework | Author | Use Case | Reference |
|-----------|--------|----------|-----------|
| Continuous Discovery | Teresa Torres | Weekly research habits | discovery-methodology-playbook |
| JTBD Interviews | Bob Moesta | Understanding user motivations | conduct-jtbd-interviews task |
| RICE Scoring | Intercom | Prioritization | run-backlog-prioritization task |
| OKRs | Doerr | Goal setting | define-quarterly-okrs task |
| Strategy Canvas | Kim & Mauborgne | Competitive positioning | create-strategy-canvas task |
| Shape Up | Ryan Singer | Scoping and betting | run-shape-up-betting-table task |
| Dual Roadmap | Industry practice | Client communication | prepare-client-roadmap task |
| Product Health Score | Composite | Product monitoring | calculate-product-health-metrics task |

### Step 4: Common Mistakes to Avoid
**New PM Pitfalls:**
| Mistake | Why It Happens | Prevention |
|---------|---------------|-----------|
| Taking client feature requests at face value | Want to please client | Always reframe with Mironov method |
| Committing to dates too early | Pressure from client | Use confidence levels, not dates |
| Skipping discovery | Urgency pressure | Minimum: 3 interviews before building |
| Not documenting decisions | "I will remember" | Log every decision within 24h |
| Ignoring tech debt | Not visible to client | Protect 15% budget always |
| Over-engineering solutions | Want to impress | MVP first, iterate from data |
| Solo decision-making | Efficiency temptation | Consult Product Trio always |
| Not tracking metrics | "We will do it later" | Baseline from Day 1 |

### Step 5: Support System
**Who to Ask for What:**
| Need | Go To | How |
|------|-------|-----|
| Product strategy question | ps-product-strategist (Charter) | Async or scheduled |
| Research methodology | ps-discovery-lead (Quorum) | Async or pair session |
| Analytics help | ps-product-analyst (Delta) | Async or dashboard walkthrough |
| Delivery/sprint question | ps-delivery-manager (Tempo) | Daily standup or async |
| Client situation advice | ps-client-product-manager (Proxy) | Immediate (Slack DM) |
| Process/template question | ps-product-ops-specialist (Mosaic) | Async |
| Escalation | product-orqx (Vector) | Immediate |

**Buddy System:**
- Every new PM is paired with experienced PM for first 60 days
- Weekly 30-min check-in with buddy
- Buddy reviews first 3 client deliverables before sending

### Step 6: Onboarding Success Criteria
**Assessment at Each Stage:**
| Checkpoint | Criteria | Assessor | Pass/Fail |
|-----------|---------|----------|-----------|
| Day 7 | Can explain our product approach | Buddy | |
| Day 14 | Tools set up, access confirmed | Ops | |
| Day 30 | Led first client meeting successfully | PM Lead | |
| Day 60 | Operating independently on client work | PM Lead | |
| Day 90 | Full ownership, contributing to team knowledge | Leadership | |

**Feedback Collection:**
- Day 7: "What is confusing so far?"
- Day 30: "What is missing from onboarding?"
- Day 90: "What would you change for the next person?"
- Use feedback to improve this runbook continuously

## Output Artifacts
- `pm-onboarding-runbook.md` | `30-60-90-plan-template.md` | `frameworks-reference-card.md` | `onboarding-checklist.md`

## Quality Criteria
- 30-60-90 plan comprehensive | Learning modules defined with assessments | Common mistakes documented | Support system clear | Success criteria measurable | Feedback loop built in | Runbook updated based on each onboarding experience
