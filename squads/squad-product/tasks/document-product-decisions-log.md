---
task: document-product-decisions-log
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

# Document Product Decisions Log

## Metadata
- **Agent:** ps-client-product-manager (Proxy)
- **Complexity:** Low-Medium
- **Estimated Time:** 30 min per decision (ongoing)
- **Produces:** Decision log entries, decision context archive, rationale documentation

## Purpose
Manter registro formal de todas as decisoes de produto para rastreabilidade, onboarding de novos membros e prevencao de re-debates. Decisoes nao documentadas sao decisoes perdidas.

## Steps

### Step 1: Decision Log Entry Template
**Per Decision:**
```
DECISION: DEC-[sequential ID]
──────────────────────────────
Title: [concise decision title]
Date: [when decided]
Status: DECIDED | SUPERSEDED | REVERSED
Superseded By: [DEC-XXX if applicable]

CONTEXT:
[What situation or question led to this decision?
What was happening that required a decision?]

OPTIONS CONSIDERED:
  Option A: [description]
    Pros: [benefits]
    Cons: [drawbacks]

  Option B: [description]
    Pros: [benefits]
    Cons: [drawbacks]

  Option C: [description] (if applicable)
    Pros: [benefits]
    Cons: [drawbacks]

DECISION: [Which option was chosen]

RATIONALE: [WHY this option was chosen over others.
This is the most important field — future readers need to understand
the reasoning, not just the outcome]

DECIDED BY: [who made the decision — person/role]
STAKEHOLDERS CONSULTED: [who was involved]
IMPACT: [what changes as a result of this decision]
REVIEW DATE: [when to revisit — if applicable]
```

### Step 2: Decision Categories
**Tag Each Decision:**
| Category | Examples |
|----------|---------|
| Strategy | Vision, positioning, target market |
| Product | Feature scope, prioritization, roadmap |
| Technical | Architecture, tech stack, integrations |
| Design | UX patterns, design system, interaction models |
| Process | Workflow changes, ceremony modifications |
| Commercial | Pricing, packaging, licensing |
| Scope | What is in/out, scope changes |

### Step 3: Decision Governance
**Who Can Decide What:**
| Decision Type | Decision Maker | Consulted | Informed |
|--------------|---------------|-----------|---------|
| Product vision/strategy | Client + Product Lead | All | All |
| Feature prioritization | Product Lead + Client PO | Dev Lead, Delivery | Team |
| Technical approach | Tech Lead | Product Lead | Client |
| UX/Design direction | Design Lead | Product, Dev | Client |
| Scope changes | Client + PM | Dev, QA | All |
| Process changes | Delivery Lead | Team | Client |

### Step 4: Maintenance Practices
**When to Log:**
- Every meeting where a decision is made
- Every scope change (approved or rejected)
- Every strategic pivot
- Every significant trade-off
- Every "let us decide later" (log as DEFERRED with review date)

**When to Review:**
- When someone asks "why did we do X?"
- When onboarding new team members
- When similar decision arises
- Quarterly: scan for decisions that need revisiting

**Decision Log Health:**
| Indicator | Healthy | Unhealthy |
|-----------|---------|-----------|
| New entries per month | 3-10 (depending on pace) | 0 (decisions not being logged) |
| Entries with rationale | 100% | Missing rationale = useless |
| Review dates set | All time-sensitive decisions | None set = never revisited |
| Searchable | Categorized + indexed | Unstructured dump |

### Step 5: Decision Index
**Master Index (top of log):**
| ID | Date | Title | Category | Status | Impact |
|----|------|-------|----------|--------|--------|
| DEC-001 | [date] | [title] | [cat] | DECIDED | [brief impact] |
| DEC-002 | [date] | [title] | [cat] | DECIDED | [brief impact] |
| DEC-003 | [date] | [title] | [cat] | SUPERSEDED | See DEC-007 |

## Output Artifacts
- `decision-log.md` (master document) | `decisions/DEC-[id].md` (individual entries if preferred)

## Quality Criteria
- Every decision has rationale documented | Options considered are listed | Decision maker identified | Log maintained consistently (no gaps) | Searchable by category and date | Superseded decisions linked to new decision
