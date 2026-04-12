---
task: create-commercial-brief
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

# Task: Create Commercial Brief

## Metadata
- **Squad:** squad-commercial
- **Agent:** Pipeline (commercial-orqx)
- **Complexity:** Standard

## Objetivo
Criar brief comercial para cada novo cliente ou projeto — documento que alinha todos os agentes comerciais sobre contexto, objetivos, restricoes e metricas de sucesso.

## Entrada
- Client/prospect information
- Business context and goals
- Revenue targets
- Timeline constraints

## Passos

### 1. Brief Structure
```
COMMERCIAL BRIEF — [Client/Project Name]
Date: YYYY-MM-DD
Owner: Pipeline (commercial-orqx)

1. CLIENT CONTEXT
   - Company:
   - Industry/Vertical:
   - Size (employees/revenue):
   - Current situation:
   - Decision timeline:

2. COMMERCIAL OBJECTIVES
   - Primary goal:
   - Revenue target: R$
   - Deal type: New / Expansion / Renewal
   - Strategic importance: High / Medium / Low

3. STAKEHOLDER MAP
   | Role | Name | Influence | Engagement |
   |------|------|-----------|-----------|
   | Economic Buyer | | High | |
   | Champion | | High | |
   | Technical Evaluator | | Medium | |
   | End User | | Low | |

4. COMPETITIVE CONTEXT
   - Current solution/vendor:
   - Alternatives being evaluated:
   - Our differentiation:
   - Key objections expected:

5. COMMERCIAL STRATEGY
   - Recommended approach:
   - Offer tier: Starter / Growth / Enterprise
   - Pricing guidance:
   - Risk factors:

6. AGENT ASSIGNMENTS
   | Agent | Responsibility | Deadline |
   |-------|--------------|----------|
   | Vault | CRM setup, pipeline config | |
   | Cascade | Funnel stage mapping | |
   | Mint | Offer design, pricing | |
   | Edge | Discovery/demo prep | |
   | Bond | Success plan draft | |
   | Ledger | Unit economics model | |

7. SUCCESS METRICS
   | Metric | Target | Measured By |
   |--------|--------|-------------|
   | Win probability | % | Vault |
   | Deal value | R$ | Mint |
   | Sales cycle | days | Vault |
   | Time-to-value | days | Bond |
```

### 2. Agent Kickoff
- Share brief with all assigned agents
- Confirm responsibilities and deadlines
- Identify dependencies between agents
- Schedule first checkpoint

## Saida
- Completed commercial brief document
- Agent assignments confirmed
- First checkpoint scheduled
- Brief archived in CRM

## Validacao
- [ ] All sections completed
- [ ] Stakeholder map has at least Economic Buyer and Champion
- [ ] Revenue target defined
- [ ] Agent assignments clear
