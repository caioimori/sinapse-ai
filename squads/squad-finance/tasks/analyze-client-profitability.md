---
task: analyze-client-profitability
responsavel: "@profitability-analyst"
responsavel_type: Agent
atomic_layer: Task
elicit: true

Entrada:
  - campo: client_name
    tipo: string
    origem: "usuario"
    obrigatorio: true
  - campo: period
    tipo: string
    origem: "usuario"
    obrigatorio: true

Saida:
  - campo: client_profitability_report
    tipo: document
    destino: "finance-orqx, diretoria"

Checklist:
  - "[ ] Listar todos os projetos do cliente"
  - "[ ] Calcular P&L de cada projeto"
  - "[ ] Consolidar P&L do cliente"
  - "[ ] Posicionar na Client Profitability Matrix"
  - "[ ] Gerar recomendacao estrategica"
---

# Task: Analyze Client Profitability

## Metadata
- **Agent:** profitability-analyst (Margin)
- **Squad:** squad-finance
- **Complexity:** COMPLEX

## Objetivo
Analisar rentabilidade total de um cliente considerando todos os projetos, custo de servicing e oportunidade de crescimento.

## Inputs
- Nome do cliente
- Periodo de analise
- Todos os projetos do cliente no periodo
- Custo de account management e pre-venda

## Steps

1. **Mapear projetos:** listar todos os projetos ativos e finalizados no periodo
2. **Calcular P&L por projeto:** usar calculate-project-profitability para cada
3. **Adicionar custos de servicing:**
   ```
   Custo_servicing = horas_account_manager × custo_hora_loaded
                   + horas_pre_venda × custo_hora_loaded
                   + custos_relacionamento (viagens, eventos)
   ```
4. **Consolidar P&L do cliente:**
   ```
   Receita_total = Σ receita_projetos
   COGS_total = Σ COGS_projetos + custo_servicing
   Gross_Margin_cliente = Receita_total - COGS_total
   ```
5. **Posicionar na Client Profitability Matrix:**
   ```
   | Alta Receita + Alta Margem | → STAR (investir, expandir)
   | Alta Receita + Baixa Margem | → CASH COW em risco (renegociar)
   | Baixa Receita + Alta Margem | → QUESTION MARK (expandir escopo)
   | Baixa Receita + Baixa Margem | → DOG (descontinuar ou reestruturar)
   ```
6. **Gerar recomendacao:** investir, renegociar, expandir ou descontinuar

## Output
- P&L consolidado do cliente
- Posicao na Client Profitability Matrix
- Historico de rentabilidade (trending up/down/stable)
- Recomendacao estrategica com justificativa numerica

## Quality Gates
- [ ] Todos os projetos do periodo incluidos
- [ ] Custo de servicing contabilizado
- [ ] Comparacao com outros clientes no portfolio
- [ ] Recomendacao com impacto financeiro quantificado

## Quando Usar
- Review anual de portfolio de clientes
- Decisao de renovacao de contrato
- Planejamento de account expansion
