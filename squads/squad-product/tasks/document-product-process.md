---
task: document-product-process
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

# Document Product Process

## Metadata
- **Agent:** ps-product-ops-specialist (Mosaic)
- **Complexity:** Medium
- **Estimated Time:** 2-3 hours per process
- **Produces:** Process documentation, flow diagrams, RACI matrix, process playbook

## Purpose
Documentar processos de produto de forma que qualquer pessoa possa executá-los sem supervisao. Processos nao documentados nao existem — dependem de pessoas especificas e nao escalam.

## Steps

### Step 1: Identify Process to Document
**Process Inventory:**
| Process | Frequency | Owner | Documented? | Quality |
|---------|-----------|-------|------------|---------|
| Sprint planning | Bi-weekly | Delivery Manager | [Y/N] | [1-5] |
| Feature prioritization | Monthly | Product Lead | [Y/N] | [1-5] |
| Bug triage | Daily | Delivery Manager | [Y/N] | [1-5] |
| Client request intake | Ongoing | Client PM | [Y/N] | [1-5] |
| Release management | Per release | Delivery Manager | [Y/N] | [1-5] |
| Discovery sprint | As needed | Discovery Lead | [Y/N] | [1-5] |
| Retrospective | Bi-weekly | Delivery Manager | [Y/N] | [1-5] |
| QBR preparation | Quarterly | Client PM | [Y/N] | [1-5] |

**Priority:** Document most critical and frequent processes first.

### Step 2: Process Documentation Template
```
PROCESS: [name]
─────────────────────────────────────
Version: [v1.0]
Owner: [role/agent]
Last Updated: [date]
Review Frequency: [quarterly/annually]

PURPOSE:
[Why this process exists — what problem it solves]

TRIGGER:
[What initiates this process — event, schedule, request]

INPUTS:
[What is needed before starting]
- [Input 1]: [where to get it]
- [Input 2]: [where to get it]

STEPS:
1. [Step description]
   - Who: [role/agent]
   - How: [specific instructions]
   - Tool: [what tool to use]
   - Output: [what this step produces]
   - Time: [estimated duration]

2. [Next step...]

OUTPUTS:
[What this process produces]
- [Output 1]: [where it goes]
- [Output 2]: [where it goes]

DECISION POINTS:
[Any if/then logic within the process]
- If [condition]: [do this]
- If [other condition]: [do that]

EXCEPTIONS:
[What to do when things do not go as planned]
- [Exception 1]: [handling procedure]

METRICS:
[How to measure process effectiveness]
- [metric 1]: [target]
- [metric 2]: [target]
```

### Step 3: Create RACI Matrix
**Per Process:**
| Step | R (Responsible) | A (Accountable) | C (Consulted) | I (Informed) |
|------|----------------|-----------------|---------------|-------------|
| [step 1] | [who does it] | [who owns outcome] | [who advises] | [who is told] |
| [step 2] | [role] | [role] | [role] | [role] |

**RACI Rules:**
- Only ONE person is Accountable per step
- Responsible can be one or more people
- Consulted means two-way communication (before action)
- Informed means one-way communication (after action)

### Step 4: Flow Diagram
**Process Flow:**
```
[Trigger] → [Step 1] → [Decision?]
                           ↓ YES        ↓ NO
                      [Step 2a]    [Step 2b]
                           ↓            ↓
                      [Step 3] ←────────┘
                           ↓
                      [Output]
```

### Step 5: Process Quality Checks
**Process Documentation Checklist:**
- [ ] Steps are specific enough to follow without asking questions
- [ ] Tools and access requirements mentioned
- [ ] Decision points have clear criteria
- [ ] Exceptions handled (not just happy path)
- [ ] Estimated time per step
- [ ] RACI assigned
- [ ] Metrics defined
- [ ] Reviewed by someone who did NOT write it

### Step 6: Process Library Maintenance
**Governance:**
| Activity | Frequency | Owner |
|----------|-----------|-------|
| Review all processes | Quarterly | Product Ops |
| Update triggered by change | As needed | Process owner |
| Deprecate unused processes | Semi-annually | Product Ops |
| Onboard new team to processes | Per new member | Product Ops |
| Process effectiveness review | Quarterly | Product Ops |

## Output Artifacts
- `processes/[process-name].md` | `process-raci-matrix.md` | `process-index.md` | `process-flow-diagrams/`

## Quality Criteria
- Every step actionable without supervision | RACI assigned | Decision points documented | Exceptions handled | Time estimates included | Reviewed by non-author | Metrics defined
