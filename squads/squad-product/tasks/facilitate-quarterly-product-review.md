---
task: facilitate-quarterly-product-review
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

# Facilitate Quarterly Product Review

## Metadata
- **Agent:** ps-client-product-manager (Proxy)
- **Complexity:** Medium-High
- **Estimated Time:** 3-4 hours (prep) + 1-2 hours (session)
- **Produces:** QBR deck, performance summary, strategic alignment review, next quarter plan

## Purpose
Facilitar Quarterly Business Review (QBR) de produto com cliente para demonstrar valor entregue, alinhar estrategia e planejar proximo trimestre. O QBR e o momento de fortalecer a relacao e renovar confianca.

## Steps

### Step 1: Pre-QBR Data Collection
**Performance Metrics Summary:**
| Category | Metric | Q Start | Q End | Change | Target | Status |
|----------|--------|---------|-------|--------|--------|--------|
| Product Health | Health Score | [N] | [N] | [+/-] | [N] | Met/Missed |
| Growth | [key metric] | [N] | [N] | [+/-] | [N] | Met/Missed |
| Engagement | [key metric] | [N] | [N] | [+/-] | [N] | Met/Missed |
| Retention | [key metric] | [N] | [N] | [+/-] | [N] | Met/Missed |
| Delivery | Velocity avg | [N] | [N] | [+/-] | [N] | Met/Missed |

**Deliverables Scorecard:**
| Committed | Delivered | Carried Over | Cut | Unplanned Added |
|-----------|-----------|-------------|-----|----------------|
| [N items] | [N] ([%]) | [N] ([%]) | [N] | [N] |

### Step 2: QBR Presentation Structure
**Agenda (90-120 min):**

**Part 1: Quarter in Review (30 min)**
- Delivered outcomes (value language, not feature list)
- Key metrics movement (with context)
- Client requests addressed vs deferred (with rationale)
- Wins celebration (start positive)

**Part 2: Challenges & Learnings (20 min)**
- What did not go as planned (transparent)
- Root causes and what we learned
- How we are addressing for next quarter
- Any systemic issues to resolve together

**Part 3: Strategic Alignment (30 min)**
- Revisit product vision alignment
- OKR progress review (if OKRs set)
- Market/competitive changes since last QBR
- Client strategic priorities (have these changed?)

**Part 4: Next Quarter Planning (30 min)**
- Proposed focus areas and roadmap
- Investment allocation recommendation (features/debt/discovery)
- Decisions needed from client
- Success criteria for next quarter

### Step 3: Client Value Story
**For Each Major Deliverable, Create Value Story:**
```
THE CHALLENGE: [what problem existed before]
WHAT WE DID: [brief description of work — outcome language]
THE RESULT: [measurable impact]
QUOTE (if available): "[client feedback or user feedback]"
```

**ROI Narrative (if applicable):**
```
Investment this quarter: [hours × rate or retainer amount]
Value delivered:
  - [Metric improvement]: [estimated business value]
  - [Time saved]: [hours × cost per hour]
  - [Risk avoided]: [potential cost of not doing]
Effective ROI: [value / investment ratio]
```

### Step 4: Honest Challenges Section
**Transparency Framework:**
```
CHALLENGE: [what went wrong or underperformed]
ROOT CAUSE: [honest assessment]
IMPACT: [how it affected delivery/metrics]
OUR RESPONSE: [what we did to address]
PREVENTION: [what changes for next quarter]
CLIENT ACTION NEEDED: [if any — e.g., faster approvals, clearer requirements]
```

**Rules for Challenges Section:**
- Be specific, not vague ("we had some delays" is useless)
- Own internal issues (do not blame client unless truly client-caused)
- If client-caused, frame constructively ("Faster approval would help us...")
- Always pair problems with solutions/prevention

### Step 5: Next Quarter Proposal
**Recommended Focus Areas:**
| Priority | Area | Rationale | Investment | Expected Outcome |
|----------|------|-----------|-----------|-----------------|
| 1 | [area] | [why this matters now] | [% of capacity] | [measurable goal] |
| 2 | [area] | [why] | [%] | [goal] |
| 3 | [area] | [why] | [%] | [goal] |

**Decisions Needed from Client:**
| Decision | Options | Our Recommendation | Deadline |
|----------|---------|-------------------|----------|
| [decision 1] | [A or B] | [which and why] | [when needed] |
| [decision 2] | [options] | [recommendation] | [when needed] |

### Step 6: Post-QBR Actions
**Within 48h:**
- [ ] Send QBR summary document
- [ ] Document all decisions made
- [ ] Log client feedback and concerns
- [ ] Update roadmap with agreed priorities
- [ ] Schedule monthly check-ins for next quarter
- [ ] Set next QBR date
- [ ] Create action items with owners

## Output Artifacts
- `qbr-[client]-Q[N].md` | `quarterly-performance-summary.md` | `next-quarter-plan.md` | `qbr-action-items.md`

## Quality Criteria
- Data-driven (metrics reviewed, not just opinions) | Value story per major deliverable | Challenges addressed honestly | Next quarter priorities agreed | Client decisions documented | Follow-up within 48h | All action items have owners
