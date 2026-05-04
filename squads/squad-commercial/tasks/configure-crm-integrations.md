---
task: configure-crm-integrations
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

# Task: Configure CRM Integrations

## Metadata
- **Squad:** squad-commercial
- **Agent:** Vault (cs-crm-specialist)
- **Complexity:** Advanced

## Objetivo
Configurar integracoes entre CRM e todo o tech stack comercial — garantindo single source of truth com data flow bidirecional, sync confiavel e zero silos de dados.

## Entrada
- CRM platform (HubSpot/Salesforce/Pipedrive)
- Commercial tech stack inventory
- Data flow requirements
- Integration budget

## Passos

### 1. Integration Map
| System | Direction | Data Flow | Sync Method | Priority |
|--------|-----------|-----------|-------------|----------|
| Marketing Automation | Bi-directional | Leads, scores, activities | Native/API | P0 |
| Sales Engagement (SEP) | Bi-directional | Sequences, activities, replies | Native | P0 |
| Revenue Intelligence | CRM → RI | Calls, deals, outcomes | API | P1 |
| Customer Success | Bi-directional | Health, usage, tickets | API | P1 |
| Analytics (GA4) | Analytics → CRM | Attribution, source | Webhook | P1 |
| Billing/Payment | CRM ← Billing | Invoices, payments | API | P2 |
| Project Management | CRM → PM | Won deals, scope | Webhook | P2 |
| Communication (Slack) | CRM → Slack | Notifications, alerts | Native | P1 |

### 2. Data Sync Rules
| Rule | Description | Example |
|------|-----------|---------|
| **Primary Key** | What identifies records across systems | Email for contacts, Deal ID for deals |
| **Conflict Resolution** | Which system wins on conflict | CRM = source of truth for contact data |
| **Sync Direction** | One-way vs bi-directional | Activities: SEP → CRM (one-way) |
| **Sync Frequency** | Real-time vs batch | Lead scoring: real-time; Analytics: daily |
| **Field Mapping** | How fields correspond | GA4 source → CRM lead_source |

### 3. Integration Health Monitoring
| Metric | Target | Alert |
|--------|--------|-------|
| Sync success rate | > 99% | < 95% |
| Sync latency | < 5 min | > 15 min |
| Error rate | < 0.1% | > 1% |
| Data completeness post-sync | > 98% | < 95% |
| Duplicate creation rate | 0% | Any |

### 4. API & Webhook Management
| Integration | Auth Method | Rate Limits | Retry Policy |
|------------|-----------|-------------|-------------|
| | OAuth 2.0 / API Key | X req/min | Exponential backoff |

## Saida
- Integration architecture documented
- All P0 integrations configured and tested
- Data sync rules defined
- Health monitoring dashboard active

## Validacao
- [ ] No data silos between systems
- [ ] Sync success rate > 99%
- [ ] Conflict resolution rules tested
- [ ] Error alerting configured
