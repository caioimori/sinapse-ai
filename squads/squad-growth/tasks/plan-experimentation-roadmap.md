---
task: plan-experimentation-roadmap
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

# Task: Plan Experimentation Roadmap

## Metadata
- **Squad:** squad-growth
- **Agent:** Catalyst (growth-orqx)
- **Complexity:** Standard

## Objetivo
Planejar roadmap de experimentacao — definir cadencia de testes, alocacao de resources, prioridades por quarter e meta de velocity de experimentacao.

## Entrada
- Growth brief and OKRs
- Hypothesis backlog
- Team capacity
- Tool availability

## Passos

### 1. Experimentation Velocity Target
| Metrica | Current | Target Q1 | Target Q2 | Target Mature |
|---------|---------|----------|----------|-------------|
| Experiments/month | | 2-4 | 4-8 | 8-12 |
| Avg duration (weeks) | | 2-4 | 2-3 | 1-2 |
| Win rate | | 20-30% | 25-35% | 30-40% |
| Ideas in backlog | | 20+ | 30+ | 50+ |

### 2. Quarterly Themes
| Quarter | Theme | Focus Area | Key Experiments |
|---------|-------|-----------|----------------|
| Q1 | Foundation | Instrumentation + first tests | Tracking, baseline, 2-4 experiments |
| Q2 | Optimization | CRO + SEO | Landing pages, funnels, 4-8 experiments |
| Q3 | Growth | Activation + retention | Onboarding, hooks, 6-10 experiments |
| Q4 | Scale | Viral + automation | Referral, ML-driven, 8-12 experiments |

### 3. Resource Allocation
| Resource | % Time | Focus |
|----------|--------|-------|
| Signal (Analytics) | 20% | Experiment tracking setup |
| Convert (CRO) | 40% | Experiment design + analysis |
| Insight (Data) | 20% | Deep analysis, segmentation |
| Lever (Growth) | 15% | Growth mechanism testing |
| Pulse (Campaigns) | 5% | Campaign experiments |

### 4. Experiment Prioritization Process
| Step | Action |
|------|--------|
| 1 | Collect ideas from all sources (data, qualitative, competitors) |
| 2 | Score with ICE framework (1-10 each) |
| 3 | Rank by ICE score |
| 4 | Check for test conflicts (audience overlap) |
| 5 | Assign to sprint (max 2-3 concurrent tests) |
| 6 | Execute, analyze, document |

### 5. Review Cadence
| Cadencia | Atividade |
|----------|----------|
| Weekly | Experiment status review (15 min) |
| Bi-weekly | Results review + next sprint planning |
| Monthly | Velocity report + roadmap adjustment |
| Quarterly | Strategy review + next quarter planning |

## Saida
- Experimentation roadmap by quarter
- Velocity targets
- Resource allocation plan
- Prioritization process
- Review cadence

## Validacao
- [ ] Velocity targets definidos
- [ ] Quarterly themes alinhados com OKRs
- [ ] Resources alocados
- [ ] Prioritization process documentado
- [ ] Review cadence estabelecido
