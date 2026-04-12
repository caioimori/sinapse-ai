---
task: coordinate-revenue-cycle
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

# Task: Coordinate Revenue Cycle

## Metadata
- **Squad:** squad-commercial
- **Agent:** Pipeline (commercial-orqx)
- **Complexity:** Advanced

## Objetivo
Coordenar o ciclo completo de revenue — desde demand generation ate expansion revenue, garantindo que todos os agentes comerciais operem em sincronia e que o pipeline flua com velocidade previsivel.

## Entrada
- Revenue targets and quotas
- Current pipeline snapshot
- Agent status reports
- Commercial calendar

## Passos

### 1. Revenue Cycle Assessment
| Fase | Owner | Health | Bottleneck? |
|------|-------|--------|-------------|
| Demand Gen | Cascade | Green/Yellow/Red | |
| Pipeline | Vault | Green/Yellow/Red | |
| Offers | Mint | Green/Yellow/Red | |
| Closing | Edge | Green/Yellow/Red | |
| Onboarding | Bond | Green/Yellow/Red | |
| Expansion | Bond + Mint | Green/Yellow/Red | |

### 2. Bow Tie Funnel Status
```
LEFT SIDE (Acquisition):
Prospect [___] → Lead [___] → MQL [___] → SQL [___] → Opp [___] → Won [___]

RIGHT SIDE (Retention):
Customer [___] → Adopted [___] → Renewed [___] → Expanded [___] → Advocate [___]

Key Principle: Right side = equal value to left side
NRR > 100% = right side compensates for CAC
```

### 3. Sprint Planning
| Agent | This Sprint Focus | Target Metric | Status |
|-------|------------------|---------------|--------|
| Vault | Pipeline hygiene audit | Data completeness 95%+ | |
| Cascade | MOFU nurture optimization | MQL→SQL +5pp | |
| Mint | Q2 offer refresh | Win rate +3pp | |
| Ledger | Forecast model update | Accuracy 90%+ | |
| Bond | Yellow account recovery | Save 70%+ | |
| Edge | Discovery framework rollout | Call score 80%+ | |

### 4. Cross-Squad Coordination
| Dependency | From Squad | Status | SLA |
|-----------|-----------|--------|-----|
| Funnel content | @content-intelligence | | Weekly |
| Landing pages | @digital-experience | | Per campaign |
| Email copy | @copywriting-persuasion | | 48h turnaround |
| Analytics data | @growth-analytics | | Real-time |
| Market intel | @research-intelligence | | Monthly |

## Saida
- Revenue cycle status report
- Sprint priorities per agent
- Cross-squad dependency map
- Escalation list (if any)

## Validacao
- [ ] All agents have clear sprint targets
- [ ] Pipeline velocity trend is positive
- [ ] No critical bottlenecks unaddressed
- [ ] Cross-squad SLAs documented
