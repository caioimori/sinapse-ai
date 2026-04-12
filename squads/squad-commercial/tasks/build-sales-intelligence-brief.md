---
task: build-sales-intelligence-brief
responsavel: "@cs-sales-enablement"
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

# Task: Build Sales Intelligence Brief

## Metadata
- **Squad:** squad-commercial
- **Agent:** Edge (cs-sales-enablement)
- **Complexity:** Intermediate

## Objetivo
Create a pre-call intelligence brief for the sales team — company profile, recent news, tech stack, decision-maker mapping, and competitive landscape. Preparation is the unfair advantage. A well-briefed rep closes at 2-3x the rate of an unprepared one.

## Entrada
- Target company name and domain
- Known contacts and their roles
- CRM history (previous interactions, if any)
- Deal context (inbound vs. outbound, source, initial interest)
- Meeting type (discovery, demo, proposal, negotiation)

## Passos

### 1. Research Company
| Research Area | Sources | Key Data Points |
|--------------|---------|-----------------|
| **Company Overview** | Website, LinkedIn, Crunchbase | Mission, products/services, founding year, HQ |
| **Financial Health** | Crunchbase, press, annual reports | Revenue range, funding, growth trajectory |
| **Recent News** | Google News, PR, social media | Last 90 days: launches, hires, partnerships, challenges |
| **Industry Context** | Industry reports, analyst briefings | Market trends affecting the company |
| **Tech Stack** | BuiltWith, Wappalyzer, job postings | Current tools, platforms, infrastructure |
| **Culture & Values** | Glassdoor, careers page, social | Work culture, priorities, pain points from reviews |

### 2. Map Org Chart and Decision Makers
| Role Type | Information Needed | Source |
|-----------|-------------------|--------|
| **Economic Buyer** | Name, title, priorities, tenure | LinkedIn, CRM |
| **Champion** | Internal advocate, their goals, influence level | Sales interactions, LinkedIn |
| **Technical Evaluator** | Name, role, technical concerns | LinkedIn, job postings |
| **End Users** | Team size, daily workflow, pain points | Discovery call, LinkedIn |
| **Blocker** | Potential objectors, their concerns | CRM notes, org chart analysis |

### 3. Identify Triggers and Timing
| Trigger Type | Signal | Relevance |
|-------------|--------|-----------|
| **Growth Trigger** | Hiring spree, new office, funding round | Budget available, scaling needs |
| **Pain Trigger** | Negative reviews, support complaints, tech issues | Problem awareness high |
| **Change Trigger** | New CXO, reorg, M&A, strategic pivot | New priorities, open to new vendors |
| **Competitive Trigger** | Competitor contract expiring, dissatisfaction signals | Switching window open |
| **Seasonal Trigger** | Budget cycle, fiscal year end, planning season | Decision timing |

### 4. Compile Intelligence Brief
| Section | Content |
|---------|---------|
| **1-Pager Summary** | Company snapshot, key contacts, deal context, recommended approach |
| **Company Profile** | Overview, financials, tech stack, recent news |
| **Stakeholder Map** | Decision makers with roles, priorities, and communication style |
| **Trigger Analysis** | Active triggers and their implications for timing/messaging |
| **Competitive Landscape** | Known competitors in the deal, their strengths/weaknesses |
| **Recommended Talk Track** | Key talking points, questions to ask, objections to prepare for |
| **Risk Factors** | Potential deal killers and mitigation strategies |

## Saida
- Sales intelligence brief (1-pager + detailed sections)
- Stakeholder map with decision-making roles
- Recommended talk track and discovery questions
- Competitive positioning notes
- Risk assessment with mitigations

## Validacao
- [ ] Company research covers all 6 areas
- [ ] Decision-maker map identifies economic buyer and champion
- [ ] At least 2 active triggers identified
- [ ] Competitive landscape documented
- [ ] Talk track tailored to meeting type and stakeholders
- [ ] Brief delivered to sales team at least 24h before meeting
