---
task: negotiate-scope-change-request
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

# Negotiate Scope Change Request

## Metadata
- **Agent:** ps-client-product-manager (Proxy)
- **Complexity:** Medium
- **Estimated Time:** 1-2 hours
- **Produces:** Scope change assessment, trade-off options, updated agreement, communication

## Purpose
Gerenciar mudancas de escopo de forma profissional e transparente, protegendo a equipe de scope creep enquanto mantendo a relacao com o cliente positiva. Escopo muda — a questao e COMO gerenciar a mudanca.

## Steps

### Step 1: Document the Change Request
**Change Request Form:**
```
CHANGE REQUEST: CR-[ID]
Date: [date]
Client: [client name]
Requester: [person + role]
Priority: [URGENT/HIGH/MEDIUM/LOW]

CURRENT SCOPE: [what was agreed]
REQUESTED CHANGE: [what client wants to add/modify/remove]
REASON FOR CHANGE: [why — business context]
```

### Step 2: Impact Assessment
**Effort Impact:**
| Dimension | Estimate |
|-----------|---------|
| Additional effort | [T-shirt / story points / days] |
| Additional cost | [$ or hours × rate] |
| Timeline impact | [N days/weeks added] |
| Team impact | [who is affected, availability] |

**Scope Impact:**
| Aspect | Before Change | After Change |
|--------|-------------|-------------|
| Total scope (points/hours) | [N] | [N + delta] |
| Sprint/cycle end date | [date] | [new date if delayed] |
| Quality risk | [level] | [new level if rushed] |
| Other features affected | [none/list] | [what gets impacted] |

**Risk Assessment:**
| Risk | Probability | Impact | Mitigation |
|------|------------|--------|-----------|
| Delivery delay | [%] | [description] | [how to manage] |
| Quality compromise | [%] | [description] | [how to manage] |
| Team burnout | [%] | [description] | [how to manage] |
| Budget overrun | [%] | [description] | [how to manage] |

### Step 3: Generate Trade-off Options
**Always present options, never just "yes" or "no":**

**Option A: Accept and Extend**
```
Accept change + extend timeline by [N days/weeks]
Cost: [additional $]
Timeline: New deadline [date]
Risk: Low (clean approach)
```

**Option B: Accept and Trade**
```
Accept change BUT remove/defer [item X] from scope
Cost: Neutral (within original budget)
Timeline: Maintained
Risk: Medium (what we lose by deferring X)
Trade: "[Added item] replaces [removed item]"
```

**Option C: Accept and Compress**
```
Accept change within original timeline
Cost: [additional $ for more resources or overtime]
Timeline: Maintained
Risk: HIGH (quality risk, team fatigue)
Note: Not recommended if quality is non-negotiable
```

**Option D: Defer to Next Phase**
```
Log the request for next sprint/quarter
Cost: None now
Timeline: Maintained for current scope
Risk: Low (but client may be disappointed)
Benefit: Proper planning, no disruption
```

### Step 4: Recommendation
**Decision Template:**
```
RECOMMENDATION: [Option A/B/C/D]

RATIONALE:
[Why this option is best for client AND for delivery quality]

TRADE-OFFS:
[What we gain and what we sacrifice with this choice]

IF CLIENT DISAGREES:
[Fallback option + what that would mean]
```

### Step 5: Client Communication
**Scope Change Discussion Script:**
```
1. ACKNOWLEDGE: "I understand this is important because [their reason]."
2. ASSESS: "Let me share what this would involve..."
3. OPTIONS: "I see [N] ways we could handle this..."
4. RECOMMEND: "I recommend [option] because..."
5. DECIDE: "What would you prefer?"
6. DOCUMENT: "Let me document this decision for our records."
```

**Communication Principles:**
- Never say "no" — always offer alternatives
- Frame as trade-offs, not limitations
- Use data (effort, timeline) not emotions
- Let the client choose (with your recommendation)
- Document everything (protects both parties)

### Step 6: Formalize Change
**Change Order (if contract requires):**
```
CHANGE ORDER: CO-[ID]
Related to CR: [change request ID]
Date Approved: [date]
Approved by: [client name + agency lead]

CHANGE DESCRIPTION:
[Specific scope change]

IMPACT:
  Additional effort: [hours/points]
  Additional cost: [$ — if billable]
  Timeline change: [new milestone dates]

ITEMS TRADED (if Option B):
  Added: [new items]
  Removed/Deferred: [traded items]

SIGNATURES:
  Client: _____________ Date: _____
  Agency: _____________ Date: _____
```

**Update Tracking:**
- [ ] Backlog updated with new/modified items
- [ ] Timeline/roadmap updated
- [ ] Team informed of change
- [ ] Change logged in decision log
- [ ] Contract/SOW amended if needed

## Output Artifacts
- `change-request-[id].md` | `scope-impact-assessment.md` | `change-order-[id].md` | `scope-change-log.md`

## Quality Criteria
- Change documented before acting | Impact quantified (effort + timeline + cost) | Multiple options presented | Recommendation clear with rationale | Client chose (not forced) | Decision documented formally | Team informed
