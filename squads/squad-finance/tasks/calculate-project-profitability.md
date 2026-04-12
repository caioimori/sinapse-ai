---
task: calculate-project-profitability
responsavel: "@profitability-analyst"
responsavel_type: Agent
atomic_layer: Task
elicit: true

Entrada:
  - campo: project_name
    tipo: string
    origem: "usuario"
    obrigatorio: true
  - campo: project_data
    tipo: object
    origem: "timesheet, contratos, despesas"
    obrigatorio: true

Saida:
  - campo: project_pnl
    tipo: document
    destino: "finance-orqx, stakeholders"

Checklist:
  - "[ ] Coletar receita do projeto"
  - "[ ] Calcular COGS (horas × custo loaded)"
  - "[ ] Alocar overhead proporcional"
  - "[ ] Calcular gross margin e net margin"
  - "[ ] Comparar com target"
  - "[ ] Identificar drivers de desvio"
---

# Task: Calculate Project Profitability

## Metadata
- **Agent:** profitability-analyst (Margin)
- **Squad:** squad-finance
- **Complexity:** MEDIUM

## Objetivo
Calcular P&L completo de um projeto especifico, identificando margem bruta, margem liquida e drivers de rentabilidade.

## Inputs
- Nome/ID do projeto
- Receita total do projeto (contratada e reconhecida)
- Horas da equipe (timesheet) com senioridade
- Custo-hora loaded por pessoa
- Despesas diretas do projeto (ferramentas, infra, freelancers)
- Overhead allocation rate (% ou valor fixo)

## Steps

1. **Calcular receita reconhecida:**
   ```
   Receita = valor contratado × % entregue (milestone) OU horas × rate
   ```
2. **Calcular COGS:**
   ```
   COGS = Σ(horas_pessoa × custo_hora_loaded) + despesas_diretas
   Custo_hora_loaded = (salario_bruto + encargos + beneficios) / horas_disponiveis_mes
   ```
3. **Calcular Gross Margin:**
   ```
   Gross Margin = Receita - COGS
   Gross Margin % = Gross Margin / Receita × 100
   Target: >= 50%
   ```
4. **Alocar overhead:**
   ```
   Overhead = custo_fixo_empresa × (horas_projeto / horas_totais_empresa)
   OU overhead_rate × receita_projeto
   ```
5. **Calcular Net Margin:**
   ```
   Net Margin = Gross Margin - Overhead Alocado
   Net Margin % = Net Margin / Receita × 100
   Target: >= 15%
   ```
6. **Analisar drivers:** horas extras, scope creep, retrabalho, ferramentas nao previstas

## Output
- P&L do projeto completo
- Gross margin e net margin com %
- Comparacao com target e com media de projetos similares
- Top 3 drivers de custo
- Recomendacao: manter, renegociar ou descontinuar

## Quality Gates
- [ ] Todas as horas contabilizadas (sem gaps no timesheet)
- [ ] Custo loaded atualizado (ultimo 3 meses)
- [ ] Overhead allocado de forma justa
- [ ] Margem comparada com benchmark da industria (50-70% gross)

## Quando Usar
- Avaliar saude financeira de um projeto em andamento
- Pos-mortem de projeto finalizado
- Decisao de continuar ou renegociar contrato
