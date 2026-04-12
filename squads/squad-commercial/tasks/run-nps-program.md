---
task: run-nps-program
responsavel: "@cs-client-success"
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

# Task: Run NPS Program

## Metadata
- **Squad:** squad-commercial
- **Agent:** Bond (cs-client-success)
- **Complexity:** Standard

## Objetivo
Operar programa NPS — coleta sistematica, segmentacao, follow-up e analise de Net Promoter Score para medir satisfacao e identificar promotores e detratores.

## Entrada
- Client portfolio
- Survey platform
- Historical NPS data
- CRM integration

## Passos

### 1. NPS Program Design
| Element | Design Decision |
|---------|----------------|
| Frequency | Quarterly (relationship NPS) + post-milestone (transactional) |
| Question | "How likely are you to recommend us to a colleague? (0-10)" |
| Follow-up | "What's the primary reason for your score?" (open text) |
| Channel | Email survey (primary), in-app (if applicable) |
| Target response rate | > 40% |

### 2. Segmentation & Follow-Up
| Segment | Score | Follow-Up Action | Timeline | Owner |
|---------|-------|-----------------|----------|-------|
| Promoters | 9-10 | Thank you + referral ask + testimonial request | 24-48h | CSM |
| Passives | 7-8 | "What would make us a 10?" conversation | 1 week | CSM |
| Detractors | 0-6 | Immediate outreach + escalation to CS Director | 24h | CSM + Dir |

### 3. NPS Calculation
```
NPS = % Promoters - % Detractors

Example:
  60% Promoters (9-10)
  25% Passives (7-8) — excluded from calculation
  15% Detractors (0-6)
  NPS = 60% - 15% = 45

Agency benchmarks: 30-50 typical, 60+ world-class
```

### 4. Verbatim Analysis
| Theme | Positive Mentions | Negative Mentions | Net | Action |
|-------|-----------------|------------------|-----|--------|
| Delivery quality | | | | |
| Communication | | | | |
| Results/ROI | | | | |
| Team expertise | | | | |
| Responsiveness | | | | |
| Value for money | | | | |

### 5. NPS Dashboard
| Metric | Current | Prior | Trend |
|--------|---------|-------|-------|
| Overall NPS | | | ↑↓→ |
| Response Rate | % | % | |
| Promoter % | % | % | |
| Passive % | % | % | |
| Detractor % | % | % | |
| Follow-up completion | % | % | |

## Saida
- NPS survey configured and scheduled
- Follow-up workflows automated
- Verbatim analysis report
- NPS dashboard and trending

## Validacao
- [ ] Survey reaches all active clients
- [ ] Response rate > 40%
- [ ] All detractors contacted within 24h
- [ ] Verbatim themes analyzed and actioned
