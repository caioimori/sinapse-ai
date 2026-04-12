---
task: conduct-commercial-retrospective
responsavel: "@commercial-orqx"
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

# Task: Conduct Commercial Retrospective

## Metadata
- **Squad:** squad-commercial
- **Agent:** Pipeline (commercial-orqx)
- **Complexity:** Standard

## Objetivo
Conduzir retrospectiva comercial — analisar o que funcionou, o que nao funcionou, e o que mudar no sistema comercial. Foco em aprendizado sistemico, nao em culpa individual.

## Entrada
- Quarterly performance data
- Win/loss analysis (Vault)
- Churn post-mortems (Bond)
- Agent feedback

## Passos

### 1. Performance Against Commitments
| Commitment (Last Quarter) | Result | Learning |
|--------------------------|--------|---------|
| [Initiative 1] | Achieved / Missed / Partial | |
| [Initiative 2] | | |
| [Initiative 3] | | |

### 2. Retrospective Framework
| Category | What Happened | Impact | Action |
|----------|-------------|--------|--------|
| **Start Doing** | | | |
| **Stop Doing** | | | |
| **Keep Doing** | | | |
| **Do More** | | | |
| **Do Less** | | | |

### 3. System-Level Analysis
| System Component | Health | Bottleneck? | Improvement Idea |
|-----------------|--------|-------------|-----------------|
| Lead generation | Green/Yellow/Red | | |
| Qualification process | | | |
| Offer/pricing | | | |
| Sales methodology | | | |
| CRM/tooling | | | |
| Onboarding | | | |
| Retention/expansion | | | |
| Reporting/analytics | | | |

### 4. Experiment Results
| Experiment | Hypothesis | Result | Decision |
|-----------|-----------|--------|---------|
| | "If we X, then Y because Z" | +/-% on metric | Scale/Iterate/Kill |

### 5. Next Quarter Experiments
| # | Experiment | Owner | Metric | Target |
|---|-----------|-------|--------|--------|
| 1 | | | | |
| 2 | | | | |
| 3 | | | | |

## Saida
- Retrospective report with learnings
- Start/Stop/Keep/More/Less decisions
- Next quarter experiments defined
- Action items assigned

## Validacao
- [ ] All agents contributed feedback
- [ ] System-level bottlenecks identified
- [ ] At least 3 experiments planned
- [ ] Action items have clear owners and deadlines
