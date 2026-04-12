---
task: run-client-product-workshop
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

# Run Client Product Workshop

## Metadata
- **Agent:** ps-client-product-manager (Proxy)
- **Complexity:** Medium-High
- **Estimated Time:** 2-3 hours (workshop) + 2-3 hours (prep)
- **Produces:** Workshop outputs, aligned priorities, action plan, relationship strengthening

## Purpose
Facilitar workshop colaborativo com cliente para alinhar prioridades, explorar oportunidades ou resolver problemas de produto. Workshops constroem alinhamento e ownership compartilhado.

## Steps

### Step 1: Define Workshop Type & Objective
**Workshop Types:**
| Type | When to Use | Duration | Participants |
|------|-----------|----------|-------------|
| Kickoff | Start of engagement | 3-4h | Full teams both sides |
| Priority Alignment | Quarterly planning | 2-3h | PMs + stakeholders |
| Problem Solving | Specific challenge | 2h | Relevant experts |
| Discovery | New opportunity | 2-3h | Product trio + client |
| Retrospective | End of phase/quarter | 1.5-2h | Full team |
| Roadmap | Strategic direction | 3-4h | PMs + leadership |

**Workshop Objective (ONE clear objective):**
```
By the end of this workshop, we will have:
[specific, tangible output]

This matters because:
[why this output is needed now]
```

### Step 2: Pre-Workshop Preparation
**Logistics:**
- [ ] Date/time confirmed with all participants
- [ ] Remote tool set up (Miro/FigJam/Notion)
- [ ] Pre-read material sent 48h in advance
- [ ] Agenda shared with participants
- [ ] Roles assigned (facilitator, note-taker, timekeeper)

**Pre-Work for Participants:**
```
Please prepare the following before the workshop:
1. [Specific preparation item — e.g., "Top 3 priorities for next quarter"]
2. [Specific preparation item — e.g., "Biggest product concern"]
3. [Specific preparation item — e.g., "One user story from recent feedback"]

This should take approximately 15-20 minutes.
```

### Step 3: Workshop Facilitation
**Universal Structure:**

**Opening (10 min):**
- Welcome and introductions (if new participants)
- Workshop objective and agenda
- Ground rules: "All ideas welcome, park debates, timebox strictly"
- Icebreaker (1 min each): "One word to describe how you feel about [product topic]"

**Core Exercise Block (60-120 min):**
*Select 2-4 exercises based on workshop type*

**Exercise Library:**
| Exercise | Purpose | Duration | Best For |
|---------|---------|----------|---------|
| Hopes & Fears | Surface expectations | 15 min | Kickoff |
| Rose/Thorn/Bud | Current state assessment | 20 min | Retro, Alignment |
| Dot Voting | Prioritize options | 10 min | Any decision point |
| How Might We | Problem reframing | 20 min | Problem Solving |
| 2x2 Matrix | Evaluate trade-offs | 20 min | Priority Alignment |
| Crazy 8s | Rapid solution generation | 15 min | Discovery |
| Impact/Effort Map | Prioritize actions | 20 min | Roadmap, Planning |
| RACI Matrix | Clarify responsibilities | 20 min | Kickoff, Alignment |
| MoSCoW | Scope definition | 20 min | Roadmap, MVP |
| Assumption Mapping | Risk identification | 20 min | Discovery |

**Synthesis (20-30 min):**
- Summarize key outputs
- Confirm decisions made
- Identify open questions
- Define next steps

**Closing (10 min):**
- Each participant: "One thing I am taking away from today"
- Thank participants
- Preview next steps and follow-up timeline

### Step 4: Facilitation Best Practices
**Remote Workshop Tips:**
- Use video ON (builds connection)
- Breakout rooms for small group work (3-4 people)
- Timer visible on screen
- Use sticky notes/cards in Miro/FigJam (individual before group)
- Call on quiet participants by name
- Take breaks every 60 min

**Managing Difficult Dynamics:**
| Situation | Response |
|-----------|---------|
| One person dominates | "Thank you [name]. Let us hear from others. [Name], what is your view?" |
| Client disagrees with recommendation | "Help me understand your perspective. What are you seeing?" |
| Conversation goes off track | "Great point. Let me park that for later. Back to our objective..." |
| No one participates | Switch to individual writing first, then share |
| Conflict between client stakeholders | "Both perspectives are valid. Let us capture both and evaluate with data." |

### Step 5: Post-Workshop Deliverables
**Within 24h:**
```
WORKSHOP SUMMARY
─────────────────
Date: [date]
Participants: [list]
Objective: [what we set out to achieve]

KEY DECISIONS:
1. [Decision + rationale]
2. [Decision + rationale]

PRIORITIES ALIGNED:
1. [Priority — agreed by consensus]
2. [Priority]
3. [Priority]

OPEN QUESTIONS:
1. [Question — owner to resolve by date]

ACTION ITEMS:
| Action | Owner | Deadline |
|--------|-------|----------|
| [action] | [name] | [date] |

NEXT STEPS:
[What happens after this workshop]
```

### Step 6: Measure Workshop Effectiveness
**Quick Post-Workshop Survey (2 questions):**
1. "How valuable was this workshop?" (1-5)
2. "What would make it better?"

**Workshop Success Criteria:**
- [ ] Objective achieved (tangible output produced)
- [ ] All key participants engaged
- [ ] Decisions documented
- [ ] Action items assigned
- [ ] Follow-up sent within 24h
- [ ] Satisfaction score >= 4/5

## Output Artifacts
- `workshop-plan-[topic].md` | `workshop-summary-[date].md` | `workshop-actions.md` | `workshop-feedback.md`

## Quality Criteria
- Clear objective stated upfront | Pre-work sent 48h before | Exercises matched to objective | All participants contributed | Decisions and actions documented | Follow-up within 24h | Feedback collected
