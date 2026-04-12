---
task: design-lead-routing
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

# Task: Design Lead Routing

## Metadata
- **Squad:** squad-commercial
- **Agent:** Vault (cs-crm-specialist)
- **Complexity:** Standard

## Objetivo
Designar sistema de lead routing — regras automatizadas para distribuir leads aos representantes certos, no tempo certo, com SLA monitorado. Lead response time < 5 minutos e o target.

## Entrada
- Sales team structure
- Territory definitions
- ICP criteria (from Cascade)
- Lead sources and volume

## Passos

### 1. Routing Rules Matrix
| Rule | Criteria | Route To | Priority |
|------|---------|---------|----------|
| Territory | Geographic region | Territory owner | 1 |
| Named Account | Target account list match | Account owner | 0 (highest) |
| Industry | Vertical specialization | Industry specialist | 2 |
| Deal Size | Estimated value threshold | SMB/Mid/Enterprise team | 3 |
| Round Robin | Default fallback | Next available rep | 4 |

### 2. Lead Source SLAs
| Source | Response SLA | Method | Priority |
|--------|-------------|--------|----------|
| Demo Request | < 5 minutes | Phone + email | Highest |
| Contact Form | < 15 minutes | Email + phone | High |
| Content Download | < 4 hours | Email sequence | Medium |
| Event/Webinar | < 24 hours | Email sequence | Medium |
| Referral | < 2 hours | Phone + email | Highest |
| Partner Lead | < 4 hours | Email + phone | High |

### 3. Routing Logic Flow
```
Lead Arrives →
  ├─ Named Account Match? → Account Owner
  ├─ ICP Score > threshold? → Territory + Size routing
  ├─ ICP Score < threshold? → Nurture (Cascade)
  └─ No match → Round Robin

After Assignment:
  → Instant notification (email + Slack/Teams)
  → Timer starts (SLA clock)
  → If no response in SLA → Escalate to manager
  → If no response in 2x SLA → Reassign to backup
```

### 4. Monitoring Dashboard
| Metric | Target | Alert Threshold |
|--------|--------|----------------|
| Avg Response Time | < 5 min | > 10 min |
| SLA Compliance | > 95% | < 90% |
| Lead-to-Contact Rate | > 80% | < 70% |
| Reassignment Rate | < 5% | > 10% |
| Lead Aging (unworked) | 0 | Any > 24h |

## Saida
- Lead routing rules documented and configured
- SLAs defined per source
- Automated notifications active
- Monitoring dashboard live

## Validacao
- [ ] All routing scenarios tested
- [ ] SLAs realistic and agreed with team
- [ ] Escalation rules configured
- [ ] Zero unassigned leads after 24h
