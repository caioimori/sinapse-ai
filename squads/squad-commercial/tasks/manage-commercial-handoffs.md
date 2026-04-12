---
task: manage-commercial-handoffs
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

# Task: Manage Commercial Handoffs

## Metadata
- **Squad:** squad-commercial
- **Agent:** Pipeline (commercial-orqx)
- **Complexity:** Standard

## Objetivo
Gerenciar handoffs entre agentes comerciais e entre squads — garantindo que informacoes criticas fluam sem perda entre demand gen, sales, onboarding e success.

## Entrada
- Current handoff pain points
- Agent workflows
- Cross-squad integration requirements

## Passos

### 1. Critical Handoff Points
| Handoff | From | To | Critical Info | SLA |
|---------|------|-----|--------------|-----|
| Lead → MQL | Cascade | Vault | Score, source, behavior | Real-time |
| MQL → SQL | Vault | Edge | MEDDIC partial, context | < 4 hours |
| SQL → Opportunity | Edge | Vault + Mint | Qualification, needs | Same day |
| Won → Onboarding | Vault | Bond | Deal context, outcomes | 24 hours |
| At-Risk → Save | Bond | Pipeline + Edge | Health data, history | Immediate |
| Expansion → Deal | Bond | Mint + Vault | Trigger, opportunity | 48 hours |

### 2. Handoff Artifact Template
```yaml
handoff:
  type: "{lead_to_mql|mql_to_sql|won_to_onboarding|...}"
  from_agent: "{agent_id}"
  to_agent: "{agent_id}"
  timestamp: "{ISO 8601}"
  deal_context:
    account: "{company name}"
    contact: "{primary contact}"
    value: "{estimated deal value}"
    urgency: "{high|medium|low}"
  key_info:
    - "{critical piece 1}"
    - "{critical piece 2}"
  next_action: "{what the receiving agent should do first}"
  sla: "{response time expectation}"
```

### 3. Cross-Squad Handoff Map
| Direction | Squad | What Flows | Frequency |
|-----------|-------|-----------|-----------|
| IN | @growth-analytics | Lead data, attribution | Real-time |
| IN | @content-intelligence | Funnel content assets | Per campaign |
| IN | @copywriting-persuasion | Proposal copy, email scripts | Per project |
| OUT | @product-systems | Feature requests, NPS data | Monthly |
| OUT | @operations-hub | Process requirements | Quarterly |

### 4. Handoff Quality Audit
| Metric | Target | Current |
|--------|--------|---------|
| Info completeness at handoff | 90%+ fields | |
| Time to first action post-handoff | Within SLA | |
| Drop-off at handoff point | <5% | |
| Handoff satisfaction (internal) | 4.5/5 | |

## Saida
- Handoff protocol document
- SLA definitions per handoff point
- Automated triggers configured
- Quality monitoring dashboard

## Validacao
- [ ] All critical handoffs documented
- [ ] SLAs defined and agreed
- [ ] No information loss at handoff points
- [ ] Cross-squad handoffs mapped
