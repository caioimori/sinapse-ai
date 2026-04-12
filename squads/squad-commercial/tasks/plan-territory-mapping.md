---
task: plan-territory-mapping
responsavel: "@cs-revops-analyst"
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

# Task: Plan Territory Mapping

## Metadata
- **Squad:** squad-commercial
- **Agent:** Ledger (cs-revops-analyst)
- **Complexity:** Standard

## Objetivo
Planejar mapeamento de territorios — segmentar mercado e alocar contas/regioes a representantes de forma equitativa e estrategica, maximizando cobertura e minimizando conflitos.

## Entrada
- Total addressable accounts
- Account data (size, industry, location)
- Sales team structure
- Historical performance by segment

## Passos

### 1. Territory Segmentation Options
| Method | Best For | Pros | Cons |
|--------|---------|------|------|
| Geographic | Field sales, local markets | Clear boundaries | Unequal opportunity |
| Industry/Vertical | Specialized knowledge | Deep expertise | Limited TAM per vertical |
| Company Size | Different sales motions | Aligned GTM | Size changes over time |
| Named Accounts | ABM, enterprise | Focused attention | Manual, not scalable |
| Hybrid | Most orgs | Balanced | Complex to manage |

### 2. Territory Design Criteria
| Criterion | Weight | Description |
|----------|--------|-------------|
| Revenue potential | 30% | Equal opportunity per territory |
| Account count | 20% | Manageable workload |
| Historical performance | 20% | Past territory productivity |
| Growth potential | 15% | Net new opportunity in territory |
| Complexity | 15% | Sales cycle, competition, needs |

### 3. Territory Assignment
| Territory | Rep | Accounts | Revenue Potential | Existing Revenue | Coverage % |
|-----------|-----|---------|------------------|-----------------|-----------|
| | | # | R$ | R$ | |

### 4. Conflict Resolution Rules
| Scenario | Rule |
|----------|------|
| Account moves HQ | Territory follows account for 6 months |
| Inbound from another territory | Route to territory owner, not source |
| Named account overlap | Named account takes priority |
| New account (no territory) | Round robin or best-fit assignment |
| Rep leaves | Territory held for 30 days, then reassigned |

## Saida
- Territory map with assignments
- Conflict resolution rules
- Territory performance targets
- Quarterly rebalancing schedule

## Validacao
- [ ] Revenue potential balanced across territories (within 15%)
- [ ] Account load manageable per rep
- [ ] Conflict rules documented and agreed
- [ ] Rebalancing cadence established
