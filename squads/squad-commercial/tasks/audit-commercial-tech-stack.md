---
task: audit-commercial-tech-stack
responsavel: "@cs-revops-analyst"
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

# Task: Audit Commercial Tech Stack

## Metadata
- **Squad:** squad-commercial
- **Agent:** Ledger (cs-revops-analyst)
- **Complexity:** Standard

## Objetivo
Auditar tech stack comercial — avaliar cada ferramenta em uso, adocao, ROI, integracoes e identificar gaps ou redundancias no stack.

## Entrada
- Current tool inventory
- License costs
- Usage/adoption data
- Integration map
- Team feedback

## Passos

### 1. Tech Stack Inventory
| Category | Tool | License Cost/yr | Users | Adoption % | Contract End |
|----------|------|----------------|-------|-----------|-------------|
| CRM | | R$ | | % | |
| Sales Engagement | | R$ | | % | |
| Revenue Intelligence | | R$ | | % | |
| Marketing Automation | | R$ | | % | |
| Customer Success | | R$ | | % | |
| Analytics/BI | | R$ | | % | |
| CPQ/Proposals | | R$ | | % | |
| Data Enrichment | | R$ | | % | |
| Communication | | R$ | | % | |
| **Total** | | **R$** | | | |

### 2. ROI Assessment
| Tool | Annual Cost | Value Delivered | ROI | Verdict |
|------|-----------|----------------|-----|---------|
| | R$ | Time saved, revenue influenced | % | Keep/Replace/Eliminate |

### 3. Integration Health
| Integration | Systems | Status | Data Quality | Issues |
|------------|---------|--------|-------------|--------|
| | A ↔ B | Active/Broken/Missing | High/Med/Low | |

### 4. Gap Analysis
| Need | Current Solution | Gap | Recommended Tool |
|------|-----------------|-----|-----------------|
| | | Missing feature / no solution | |

### 5. Stack Score
```
Stack Health = (Adoption × 0.3) + (Integration × 0.3) + (ROI × 0.2) + (Coverage × 0.2)

A (90-100): Optimized stack
B (80-89): Good with minor gaps
C (70-79): Needs optimization
D (<70): Significant issues
```

## Saida
- Tech stack audit report
- ROI per tool
- Integration health status
- Optimization recommendations

## Validacao
- [ ] All tools inventoried
- [ ] Costs and adoption tracked
- [ ] Integration health assessed
- [ ] Redundancies and gaps identified
