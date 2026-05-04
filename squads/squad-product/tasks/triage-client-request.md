---
task: triage-client-request
responsavel: "@product-orqx"
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

# Triage Client Request

## Metadata
- **Agent:** product-orqx (Vector)
- **Complexity:** Low-Medium
- **Estimated Time:** 30-60 minutes
- **Depends On:** Client request received (via Proxy)
- **Produces:** Triage decision, routing, initial sizing

## Purpose
Triagem rápida de requests de cliente para determinar rota correta: Discovery, Delivery ou Backlog. Evita que requests entrem direto em desenvolvimento sem validação adequada.

## Steps

### Step 1: Request Classification
| Type | Signal | Route | SLA |
|------|--------|-------|-----|
| Bug/Issue | "Something is broken" | Delivery (hotfix) | 24-48h |
| Enhancement | "Can you add/change X?" | Triage → Backlog | 5 days |
| New Feature | "We need capability Y" | Discovery | 2 weeks |
| Strategic | "We want to enter market Z" | Strategy → Discovery | 1 month |
| Urgent | "We need this by Friday" | Assess urgency validity | 4 hours |

### Step 2: Apply Reframe Test (Rich Mironov)
1. What problem is the client trying to solve?
2. Who specifically is affected?
3. How are they working around it today?
4. What happens if we don't do this?
5. How will we know it's solved?

**Output:** Original Request → Reframed Problem Statement → Affected Users → Current Workaround → Cost of Inaction → Success Metric

### Step 3: Quick Sizing (T-shirt)
| Size | Effort | Timeline | Team |
|------|--------|----------|------|
| XS | <1 day | This sprint | 1 person |
| S | 1-3 days | This sprint | 1 person |
| M | 1-2 weeks | Next sprint | 2 people |
| L | 2-4 weeks | Needs planning | 3+ people |
| XL | 1+ month | Needs discovery | Squad |

### Step 4: Route Decision
```
IF bug AND severity ≥ High → Delivery (hotfix), notify Tempo
IF enhancement AND size ≤ S → Delivery (add to sprint)
IF new feature OR size ≥ M → Backlog; IF no evidence → Discovery first
IF strategic → Charter assessment → Discovery sprint
IF urgent claim → Validate urgency (real vs artificial deadline)
```

## Output Artifacts
- `request-triage-[id].md` | Backlog item or Discovery brief created

## Quality Criteria
- Reframe applied (not just accepting request as-is)
- Size estimate within 24 hours
- Route decision documented with rationale
