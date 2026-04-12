---
task: conduct-win-loss-analysis
responsavel: "@cs-crm-specialist"
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

# Task: Conduct Win/Loss Analysis

## Metadata
- **Squad:** squad-commercial
- **Agent:** Vault (cs-crm-specialist)
- **Complexity:** Standard

## Objetivo
Conduzir analise sistematica de win/loss — identificar padroes de vitoria e derrota para informar estrategia de vendas, positioning, offer design e methodology.

## Entrada
- Closed deals (won and lost) from CRM
- Deal notes and MEDDIC scores
- Client/prospect feedback (when available)
- Competitor intelligence

## Passos

### 1. Win/Loss Data Collection
| Field | Source | Required |
|-------|--------|---------|
| Deal name and value | CRM | Yes |
| Win/Loss | CRM | Yes |
| Stage where lost | CRM | Yes (losses) |
| Loss reason (primary) | CRM dropdown | Yes (losses) |
| Competitor (if applicable) | CRM | Yes |
| MEDDIC score at close | CRM | Yes |
| Sales cycle length | CRM | Yes |
| Key decision factor | Rep debrief | Yes |
| Client feedback | Survey/interview | Preferred |

### 2. Loss Reason Categories
| Category | Subcategories |
|----------|-------------|
| **Price** | Too expensive, no budget, competitor cheaper |
| **Product/Service Fit** | Missing feature, wrong solution, capability gap |
| **Timing** | Not ready, project delayed, budget cycle |
| **Competition** | Lost to specific competitor, incumbent advantage |
| **Relationship** | No champion, EB not engaged, trust deficit |
| **Process** | Too slow, too complex, internal bureaucracy |
| **No Decision** | Status quo won, deprioritized, ghost |

### 3. Pattern Analysis
| Pattern | Wins | Losses | Insight |
|---------|------|--------|---------|
| Avg MEDDIC score | /8 | /8 | Threshold for winning |
| Champion present? | % | % | Champion impact |
| EB engaged? | % | % | EB access importance |
| Avg sales cycle | days | days | Speed correlation |
| Avg deal value | R$ | R$ | Sweet spot identification |
| Most common loss stage | — | Stage | Where deals die |
| Top competitor | — | | Who we lose to most |

### 4. Competitive Win/Loss Matrix
| Competitor | We Win | We Lose | Win Rate | Key Differentiator |
|-----------|--------|---------|----------|-------------------|
| Competitor A | | | % | |
| Competitor B | | | % | |
| No competitor | | | % | |
| Status quo | — | | — | |

### 5. Action Items
| Insight | Action | Owner | Impact |
|---------|--------|-------|--------|
| | Update offer/pricing (→ Mint) | | |
| | Adjust methodology (→ Edge) | | |
| | Improve qualification (→ Vault) | | |
| | Create competitive content (→ @content) | | |

## Saida
- Win/loss analysis report
- Pattern identification
- Competitive win matrix
- Action items distributed to agents

## Validacao
- [ ] All closed deals in period analyzed
- [ ] Loss reasons categorized consistently
- [ ] Patterns identified with statistical backing
- [ ] Actions assigned with clear owners
