---
task: run-monthly-p-and-l
responsavel: "@profitability-analyst"
responsavel_type: Agent
atomic_layer: Task
elicit: false

Entrada:
  - campo: month
    tipo: string
    origem: "usuario"
    obrigatorio: true
  - campo: financial_data
    tipo: object
    origem: "contabilidade, billing, RH"
    obrigatorio: true

Saida:
  - campo: monthly_pnl
    tipo: document
    destino: "finance-orqx, diretoria"

Checklist:
  - "[ ] Consolidar receita do mes"
  - "[ ] Consolidar COGS"
  - "[ ] Calcular gross margin"
  - "[ ] Consolidar despesas operacionais"
  - "[ ] Calcular EBITDA"
  - "[ ] Comparar com mes anterior e budget"
---

# Task: Run Monthly P&L

## Metadata
- **Agent:** profitability-analyst (Margin)
- **Squad:** squad-finance
- **Complexity:** CRITICAL

## Objetivo
Executar P&L mensal consolidado da empresa com todas as linhas de receita e despesa.

## Steps

1. **Receita:**
   ```
   Receita Bruta
   (-) Impostos sobre receita (ISS, PIS, COFINS)
   = Receita Liquida
   ```
2. **COGS (Custo de Servicos):**
   ```
   Folha da equipe de delivery (loaded)
   + Ferramentas diretas de projetos
   + Freelancers e terceirizados
   + Infra direta de projetos
   = COGS
   ```
3. **Gross Profit:**
   ```
   Gross Profit = Receita Liquida - COGS
   Gross Margin % = Gross Profit / Receita Liquida × 100
   ```
4. **Despesas Operacionais:**
   ```
   Folha administrativa e comercial
   + Aluguel e facilities
   + Marketing e vendas
   + SaaS e ferramentas corporativas
   + Contabilidade e juridico
   + Outros (viagens, eventos, etc.)
   = OpEx
   ```
5. **EBITDA:**
   ```
   EBITDA = Gross Profit - OpEx
   EBITDA % = EBITDA / Receita Liquida × 100
   ```
6. **Comparacoes:**
   - vs mes anterior (MoM)
   - vs mesmo mes ano anterior (YoY)
   - vs budget

## Output
- P&L completo no template padrao (monthly-p-and-l-template)
- Comparacoes MoM, YoY e vs budget
- Destaques e alertas
- Anexo: P&L por projeto e por cliente

## Quality Gates
- [ ] Receita reconciliada com billing
- [ ] COGS reconciliado com folha e despesas
- [ ] Gross margin dentro do range esperado (ou justificativa)
- [ ] EBITDA comparado com target

## Quando Usar
- Fechamento mensal (obrigatorio)
- Toda primeira semana do mes seguinte
