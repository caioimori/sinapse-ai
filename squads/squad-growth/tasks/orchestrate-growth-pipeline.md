---
task: orchestrate-growth-pipeline
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

# Task: Orchestrate Growth Pipeline

## Metadata
- **Squad:** squad-growth
- **Agent:** Catalyst (growth-orqx)
- **Complexity:** Complex

## Objetivo
Orquestrar execucao do pipeline de growth — coordenar agentes, gerenciar dependencias, monitorar progresso e garantir qualidade dos deliverables.

## Entrada
- Selected workflow
- Growth brief
- Agent allocation
- Timeline

## Passos

### 1. Pipeline Execution Plan
```yaml
pipeline:
  workflow: "{selected workflow}"
  phases:
    - phase: 1
      name: ""
      agents: []
      start_date: ""
      end_date: ""
      dependencies: []
      deliverables: []
      gate: ""
    # ... repeat per phase
```

### 2. Agent Coordination Matrix
| Agent | Phase | Tasks | Dependencies | Status |
|-------|-------|-------|-------------|--------|
| Signal | 1, 2 | Tracking setup | None | |
| Rank | 2 | SEO audit | Phase 1 complete | |
| Insight | 3 | Data analysis | Tracking verified | |
| Convert | 3, 4 | CRO + experiments | Data available | |
| Lever | 4 | Growth mechanisms | Analysis complete | |
| Pulse | 3, 4 | Campaign analytics | Tracking verified | |

### 3. Progress Monitoring
| Metrica | Target | Cadencia |
|---------|--------|---------|
| Phase completion | On schedule | Daily check |
| Deliverable quality | Meets standards | Per deliverable |
| Gate passage | First attempt | Per gate |
| Blocker count | Zero | Real-time |
| Cross-squad handoffs | On time | Weekly check |

### 4. Quality Checkpoints
| Checkpoint | Quando | Criterio |
|-----------|--------|---------|
| Tracking verification | After Phase 2 | Accuracy >= 98% |
| Data quality | Before analysis | Completeness >= 95% |
| Statistical validity | After experiments | p < 0.05 |
| Privacy compliance | Continuous | LGPD/GDPR adherent |

### 5. Escalation Protocol
| Situacao | Acao |
|----------|------|
| Gate failure | Fix → re-test → escalate if 2nd failure |
| Agent blocker | Unblock or reallocate |
| Timeline slip | Adjust scope or extend |
| Quality issue | Stop, fix, resume |
| Cross-squad delay | Notify, adjust, compensate |

## Saida
- Pipeline execution tracker
- Agent coordination matrix
- Progress reports
- Quality checkpoint results
- Escalation log

## Validacao
- [ ] Pipeline plan definido
- [ ] Agentes coordenados
- [ ] Dependencias mapeadas
- [ ] Quality checkpoints passados
- [ ] Deliverables completos
