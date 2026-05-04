---
task: map-expansion-opportunities
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

# Task: Map Expansion Opportunities

## Metadata
- **Squad:** squad-commercial
- **Agent:** Bond (cs-client-success)
- **Complexity:** Standard

## Objetivo
Mapear oportunidades de expansao no portfolio — identificar triggers de upsell e cross-sell em clientes saudaveis para contribuir ao NRR > 110%.

## Entrada
- Health Score data (Green accounts)
- Usage and adoption metrics
- QBR insights
- Service portfolio (from Mint)

## Passos

### 1. Expansion Trigger Matrix
| Trigger | Detection | Upsell or Cross-sell | Likely Offer |
|---------|----------|---------------------|-------------|
| Usage exceeding tier | Analytics threshold | Upsell | Next tier |
| New use case discovered | QBR conversation | Cross-sell | Adjacent service |
| Positive ROI at QBR | ROI calculation | Both | Expanded scope |
| Team growth at client | CRM/LinkedIn | Upsell | Tier upgrade |
| New stakeholder engaged | CS outreach | Cross-sell | New service line |
| Budget cycle approaching | Calendar | Both | Annual proposal |
| Competitor displacement | Client feedback | Cross-sell | Replace competitor |
| Strategic initiative | News/client share | Both | Custom proposal |

### 2. Portfolio Expansion Map
| Account | ARR | Health | Trigger | Opportunity | Est. Value | Next Step |
|---------|-----|--------|---------|------------|-----------|----------|
| | R$ | Green | | Upsell/Cross-sell | R$ | |

### 3. Expansion Pipeline
| Stage | Definition | Accounts |
|-------|-----------|---------|
| Signal Detected | Trigger identified, not yet validated | |
| Validated | CSM confirmed need with client | |
| Proposed | Proposal sent (via Mint) | |
| Committed | Verbal agreement | |
| Closed | Expansion signed | |

### 4. NRR Contribution Tracking
```
NRR = (Beginning ARR + Expansion - Contraction - Churn) / Beginning ARR × 100

Expansion contribution:
  Expansion ARR: R$ __________
  As % of Beginning ARR: ____%
  Accounts expanded: ____ / ____ eligible (___%)

Target: NRR > 110%, Expansion rate > 20% of eligible
```

## Saida
- Expansion opportunity map per account
- Expansion pipeline with stages
- NRR contribution tracking
- Monthly expansion forecast

## Validacao
- [ ] All Green accounts evaluated for expansion
- [ ] Triggers specific and actionable
- [ ] Pipeline staged and tracked in CRM
- [ ] Contribution to NRR calculated
