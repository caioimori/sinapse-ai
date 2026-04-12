---
task: intake-and-reframe-client-request
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

# Intake and Reframe Client Request

## Metadata
- **Agent:** ps-client-product-manager (Proxy)
- **Complexity:** Medium
- **Estimated Time:** 1-2 hours
- **Produces:** Reframed request, problem statement, impact assessment, recommendation

## Purpose
Receber pedidos de clientes e reframeá-los de features para problemas. Baseado em Rich Mironov: "Client says feature, PM finds problem." Transformar pedidos reativos em oportunidades de produto.

## Steps

### Step 1: Capture Raw Request
**Request Intake Form:**
```
REQUEST ID: [auto-generated]
Date: [date received]
Client: [client name]
Requester: [person name + role]
Channel: [email/meeting/Slack/ticket]
Urgency Stated: [ASAP/This Sprint/This Quarter/Flexible]

RAW REQUEST (exact words):
"[verbatim what the client asked for]"
```

### Step 2: Reframe (Rich Mironov Method)
**5 Reframing Questions:**
1. **What problem are you trying to solve?** (not "what feature do you want?")
2. **Who specifically is affected?** (which users, how many)
3. **How are they handling it today?** (current workaround)
4. **What happens if we do nothing?** (real impact)
5. **How would you know the problem is solved?** (success criteria from their perspective)

**Reframe Template:**
```
CLIENT SAID: "[verbatim request — usually a feature]"

REFRAMED PROBLEM: "[the underlying problem, not the solution]"

CONTEXT:
  Who is affected: [specific users/roles]
  Current workaround: [how they manage today]
  Frequency: [how often this problem occurs]
  Impact if unsolved: [business/user impact]
  Success criteria: [how client would measure success]
```

### Step 3: Classify Request Type
**Request Classification Matrix:**
| Type | Definition | Typical Route | SLA |
|------|-----------|--------------|------|
| Bug Report | Something is broken | Engineering → Triage → Fix | 24-48h response |
| Feature Request | New capability desired | Product → Evaluate → Backlog | 1 week evaluation |
| Enhancement | Improvement to existing | Product → Prioritize | Sprint-level |
| Strategic Initiative | Large new direction | Product → Strategy → Roadmap | Quarter-level |
| Scope Change | Change to agreed scope | Delivery → Scope process | Per contract |

### Step 4: Impact & Effort Assessment
**Quick T-Shirt Sizing:**
| Dimension | XS | S | M | L | XL |
|-----------|-----|-----|-----|-----|------|
| User Impact | <10 users | 10-50 | 50-500 | 500-5K | >5K |
| Revenue Risk | None | <$1K | $1K-10K | $10K-100K | >$100K |
| Effort | <1 day | 1-3 days | 1-2 weeks | 2-6 weeks | >6 weeks |
| Urgency | Flexible | This quarter | Next sprint | This sprint | Hotfix |

**Combined Assessment:**
```
Impact: [HIGH/MEDIUM/LOW]
Effort: [XS/S/M/L/XL]
Urgency: [CRITICAL/HIGH/MEDIUM/LOW]
Strategic Alignment: [HIGH/MEDIUM/LOW/NONE]
```

### Step 5: Generate Recommendation
**Decision Framework:**
| Impact | Effort | Urgency | Recommendation |
|--------|--------|---------|---------------|
| HIGH | XS-S | Any | DO NOW (quick win) |
| HIGH | M-L | HIGH | PRIORITIZE (schedule this sprint/next) |
| HIGH | L-XL | MEDIUM | ROADMAP (plan for quarter) |
| MEDIUM | XS-S | Any | BATCH (group with similar requests) |
| MEDIUM | M+ | LOW | BACKLOG (evaluate at next planning) |
| LOW | Any | LOW | DECLINE (with explanation) |

**Recommendation Template:**
```
RECOMMENDATION: [DO NOW / PRIORITIZE / ROADMAP / BATCH / BACKLOG / DECLINE]

SUMMARY:
[1-2 sentences explaining the recommendation]

IF APPROVED:
  Effort estimate: [T-shirt size]
  Target sprint/quarter: [when]
  Team needed: [who]
  Dependencies: [if any]

IF DECLINED:
  Reason: [why this is not the best use of resources now]
  Alternative: [what we suggest instead]
  Revisit: [when we will reconsider]
```

### Step 6: Client Communication
**Response to Client:**
```
Hi [Client Name],

Thank you for raising [brief description of their request].

I want to make sure I understand the underlying need:
[Reframed problem statement — confirm with them]

Here is our assessment:
- Impact: [summary]
- Our recommendation: [action]
- Timeline: [when they can expect resolution or next update]

[If declined: explain WHY and offer alternative]
[If approved: explain next steps]

I will keep you updated on progress. Let me know if I have
captured the problem correctly.

Best,
[Name]
```

## Output Artifacts
- `client-request-[id].md` | `reframed-problem.md` | `request-recommendation.md`

## Quality Criteria
- Raw request captured verbatim | Reframing questions answered | Problem stated (not just feature) | Impact and effort assessed | Clear recommendation with rationale | Client responded within SLA | If declined, explanation and alternative provided
