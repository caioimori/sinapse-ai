---
task: manage-cost-centers
responsavel: "@budget-controller"
responsavel_type: Agent
atomic_layer: Task
elicit: true

Entrada:
  - campo: organizational_structure
    tipo: object
    origem: "usuario, RH"
    obrigatorio: true

Saida:
  - campo: cost_center_structure
    tipo: document
    destino: "finance-orqx, financeiro"

Checklist:
  - "[ ] Definir cost centers"
  - "[ ] Alocar despesas por center"
  - "[ ] Definir budget por center"
  - "[ ] Atribuir responsaveis"
---

# Task: Manage Cost Centers

## Metadata
- **Agent:** budget-controller (Vault)
- **Squad:** squad-finance
- **Complexity:** MEDIUM

## Objetivo
Estruturar e gerenciar cost centers para controle orcamentario granular.

## Steps

1. **Definir cost centers tipicos para agencia:**
   ```
   CC01 - Delivery (equipe de producao)
   CC02 - Comercial (vendas e account)
   CC03 - Marketing (demand gen, brand)
   CC04 - Administrativo (RH, financeiro, juridico)
   CC05 - Tecnologia (infra, ferramentas, SaaS)
   CC06 - Lideranca (C-level, gestao)
   ```
2. **Alocar despesas:** cada gasto vai para um cost center
3. **Alocar receita:** receita e alocada ao CC01 (delivery) ou ao CC da area geradora
4. **Budget por center** com responsavel
5. **Regras de alocacao para custos compartilhados:**
   ```
   Aluguel: proporcional ao headcount por CC
   Ferramentas compartilhadas: proporcional ao uso
   Lideranca: rateio por receita gerada
   ```

## Output
- Estrutura de cost centers
- Regras de alocacao
- Budget por cost center
- Responsaveis por center

## Quality Gates
- [ ] Todos os gastos tem cost center atribuido
- [ ] Regras de alocacao sao justas e documentadas
- [ ] Nenhum gasto orphao

## Quando Usar
- Estruturacao inicial de controle orcamentario
- Reestruturacao organizacional
- Planejamento orcamentario anual
