---
task: conduct-growth-retrospective
responsavel: "@growth-orqx"
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

# Task: Conduct Growth Retrospective

## Metadata
- **Squad:** squad-growth
- **Agent:** Catalyst (growth-orqx)
- **Complexity:** Standard

## Objetivo
Conduzir retrospectiva de growth — consolidar learnings de experimentos, avaliar metricas vs targets, identificar padroes e atualizar knowledge base.

## Entrada
- Experiment results (all completed)
- Growth OKRs and targets
- Pipeline execution data
- Agent feedback

## Passos

### 1. Metrics Review
| Metrica | Target | Actual | Delta | Status |
|---------|--------|--------|-------|--------|
| North Star Metric | | | | On/Above/Below track |
| Acquisition rate | | | | |
| Activation rate | | | | |
| Retention (D30) | | | | |
| Revenue growth | | | | |
| Experiment velocity | | | | |
| Win rate | | | | |

### 2. Experiment Portfolio Review
| Experiment | Hypothesis | Result | Impact | Learning |
|-----------|-----------|--------|--------|---------|
| | | Win/Lose/Inconclusive | +X% metric | |
| | | | | |
| | | | | |

### 3. What Worked
| Area | Success | Replicable? |
|------|---------|------------|
| | | Yes/Partial/No |

### 4. What Didn't Work
| Area | Issue | Root Cause | Fix |
|------|-------|-----------|-----|
| | | | |

### 5. Pattern Recognition
| Pattern | Frequency | Implication |
|---------|----------|-------------|
| | How often seen | Strategic adjustment |

### 6. Knowledge Base Updates
| Entry | Type | Source | Action |
|-------|------|--------|--------|
| | New/Update/Archive | Experiment/Analysis | Add to KB |

### 7. Next Cycle Planning
| Priority | Rationale | Assigned To |
|----------|----------|-------------|
| 1. | Based on retrospective findings | Agent |
| 2. | | |
| 3. | | |

## Saida
- Growth retrospective document
- Experiment portfolio summary
- Pattern analysis
- Knowledge base updates
- Next cycle priorities

## Validacao
- [ ] Todas as metricas comparadas com targets
- [ ] Experimentos revisados com learnings
- [ ] Padroes identificados
- [ ] Knowledge base atualizada
- [ ] Proximas prioridades definidas
- [ ] Time alinhado nos learnings
