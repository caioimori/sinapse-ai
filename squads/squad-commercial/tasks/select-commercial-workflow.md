---
task: select-commercial-workflow
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

# Task: Select Commercial Workflow

## Metadata
- **Squad:** squad-commercial
- **Agent:** Pipeline (commercial-orqx)
- **Complexity:** Standard

## Objetivo
Selecionar o workflow comercial adequado para cada situacao — novo lancamento de oferta, ciclo de forecasting, onboarding, prevencao de churn, expansao ou revisao trimestral.

## Entrada
- Situation description
- Business objectives
- Timeline constraints
- Available resources

## Passos

### 1. Workflow Selection Matrix
| Situacao | Workflow Recomendado | Agents Envolvidos | Duracao |
|----------|---------------------|-------------------|---------|
| Lancar nova oferta/servico | New Offer Launch | Mint → Cascade → Vault → Ledger | 2-4 semanas |
| Ciclo de forecasting mensal | Revenue Forecasting Cycle | Vault → Bond → Ledger | 1 semana |
| Novo cliente assinou contrato | Client Onboarding & Activation | Bond → Vault → Edge | 30-90 dias |
| Cliente em risco de churn | Churn Prevention Protocol | Bond → Pipeline → Edge | Imediato |
| Oportunidade de expansao | Expansion Revenue Cycle | Bond → Mint → Vault → Ledger | 2-4 semanas |
| Revisao trimestral | Quarterly Commercial Review | ALL | 1 semana |

### 2. Workflow Prerequisite Check
| Workflow | Prerequisites | Missing? |
|----------|-------------|----------|
| New Offer Launch | Market research, positioning done | |
| Revenue Forecasting | Clean CRM data, pipeline updated | |
| Client Onboarding | Contract signed, brief completed | |
| Churn Prevention | Health score active, data current | |
| Expansion | Trigger identified, health Green | |
| Quarterly Review | All agent reports submitted | |

### 3. Custom Workflow Assembly
Se nenhum workflow padrao se aplica, montar workflow customizado:
1. Identificar objetivo final
2. Mapear agentes necessarios
3. Definir sequencia de tasks
4. Estabelecer quality gates
5. Definir timeline e checkpoints

## Saida
- Selected workflow with rationale
- Prerequisites confirmed
- Timeline established
- Kickoff communication sent

## Validacao
- [ ] Workflow matches situation accurately
- [ ] All prerequisites met or plan to meet
- [ ] Timeline realistic given resources
- [ ] All involved agents notified
