---
task: run-backlog-prioritization
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

# Run Backlog Prioritization

## Metadata
- **Agent:** product-orqx (Vector)
- **Complexity:** Medium
- **Estimated Time:** 2-3 hours
- **Depends On:** Product backlog exists, strategic context available
- **Produces:** Prioritized backlog, scoring rationale, priority matrix

## Purpose
Executar sessão de priorização do backlog usando frameworks quantitativos (RICE, ICE, Weighted Scoring) combinados com alinhamento estratégico. Garante que o time trabalha nas coisas certas, na ordem certa.

## Steps

### Step 1: Backlog Inventory
| Category | Source | Typical Volume |
|----------|--------|---------------|
| Client requests | Proxy intake | 5-15/month |
| Discovery opportunities | Quorum findings | 3-8/sprint |
| Technical debt | Tempo triage | 5-10 items |
| Bug fixes | QA/Support | 2-8/sprint |
| Strategic initiatives | Charter OKRs | 2-5/quarter |

### Step 2: Apply RICE Scoring
**RICE = (Reach × Impact × Confidence) / Effort**
```
Reach: Users affected/quarter (100+=3, 50-100=2, 10-50=1, <10=0.5)
Impact: Per user (Massive=3, High=2, Medium=1, Low=0.5, Minimal=0.25)
Confidence: Data-backed=100%, Some evidence=80%, Gut feel=50%, Wild guess=20%
Effort: Person-months (fibonacci: 0.5, 1, 2, 3, 5, 8, 13)
```

### Step 3: Strategic Alignment Overlay
**Alignment Score (1-5):** 5=Primary OKR, 4=Secondary OKR, 3=Roadmap theme, 2=Loosely connected, 1=No connection
**Combined: Final Priority = (RICE × 0.7) + (Strategic Alignment × 0.3)**

### Step 4: Apply Constraints & MoSCoW
| Band | RICE Score | Classification |
|------|-----------|---------------|
| Top 20% | Highest | Must Have (this sprint) |
| Next 30% | High | Should Have (next 1-2 sprints) |
| Next 30% | Medium | Could Have (backlog) |
| Bottom 20% | Low | Won't Have (this quarter) |

### Step 5: Handle Conflicts
1. Data wins over opinions (RICE >2× difference → higher wins)
2. Client-critical overrides → escalate
3. Tech debt 20% reserved (non-negotiable)
4. Quick wins (Effort <0.5, Impact ≥Medium) → batch immediately

### Step 6: Communicate Decisions
**Internal:** Prioritized list with rationale, sprint candidates highlighted
**Client (via Proxy):** Outcomes-framed, deferred items with "why" and "when"

## Output Artifacts
- `backlog-prioritization-[date].md` | `sprint-candidates.md` | `priority-communication.md`

## Quality Criteria
- All items scored with same framework
- Strategic alignment explicitly evaluated
- Tech debt 20% budget respected
- Client communication prepared before sharing
