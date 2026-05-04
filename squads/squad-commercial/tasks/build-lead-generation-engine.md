---
task: build-lead-generation-engine
responsavel: "@cs-lead-generation-strategist"
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

# Task: Build Lead Generation Engine

## Metadata
- **Squad:** squad-commercial
- **Agent:** Magnet (cs-lead-generation-strategist)
- **Complexity:** Complex

## Objetivo
Arquitetar um sistema completo de geracao de leads usando os 4 metodos Hormozi (warm outreach, cold outreach, content, paid ads). O engine deve gerar volume previsivel de leads qualificados com unit economics sustentaveis.

## Entrada
- ICP definition
- Current lead sources and volumes
- Budget (monthly)
- Sales team capacity
- Existing content/assets

## Passos

### 1. Current State Assessment
| Method | Active? | Leads/mo | Cost/Lead | SQL Rate | Notes |
|--------|---------|----------|-----------|----------|-------|
| Warm Outreach | Y/N | | R$ | % | |
| Cold Outreach | Y/N | | R$ | % | |
| Content (Organic) | Y/N | | R$ | % | |
| Paid Ads | Y/N | | R$ | % | |
| **TOTAL** | | | | | |

### 2. Lead Gen Engine Architecture
```
VOLUME TARGETS:
- Monthly lead target: [X]
- Monthly SQL target: [Y]
- Monthly revenue target: [R$]
- Required close rate: [%]
- Average deal size: [R$]

CHANNEL MIX:
- Warm outreach: [X]% of leads, [R$] budget
- Cold outreach: [X]% of leads, [R$] budget
- Content/organic: [X]% of leads, [R$] budget
- Paid ads: [X]% of leads, [R$] budget
```

### 3. Channel Playbooks (per method)
For each of the 4 methods:
| Element | Details |
|---------|---------|
| Target audience | |
| Key message | |
| Channels/platforms | |
| Cadence | |
| Tools needed | |
| KPIs | |
| Owner | |

### 4. Lead Scoring & Qualification
| Score Range | Classification | Action |
|-------------|---------------|--------|
| 0-30 | Cold | Nurture sequence |
| 31-60 | Warm | MQL — marketing nurture |
| 61-80 | Hot | SQL — sales outreach |
| 81-100 | On Fire | Immediate sales contact |

### 5. Tech Stack Requirements
| Function | Tool | Status |
|----------|------|--------|
| CRM | | |
| Email automation | | |
| Cold outreach | | |
| Landing pages | | |
| Analytics | | |
| Lead scoring | | |

### 6. 90-Day Launch Plan
| Week | Method | Action | Target |
|------|--------|--------|--------|
| 1-2 | Setup | CRM, tools, tracking | Foundation |
| 3-4 | Warm | Launch warm outreach | First leads |
| 5-6 | Cold | Launch cold campaigns | Pipeline building |
| 7-8 | Content | Publish lead magnets | Organic traction |
| 9-12 | Paid | Launch paid campaigns | Scale volume |

## Saida
- Lead gen engine architecture document
- Channel mix with budget allocation
- 4 channel playbooks
- Lead scoring framework
- Tech stack recommendations
- 90-day launch plan

## Validacao
- [ ] All 4 methods addressed (even if deprioritized)
- [ ] Unit economics validated (CPL < target)
- [ ] Volume targets achievable with budget
- [ ] Lead scoring framework defined
- [ ] 90-day plan is actionable
