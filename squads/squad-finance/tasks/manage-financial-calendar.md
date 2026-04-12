---
task: manage-financial-calendar
responsavel: "@finance-orqx"
responsavel_type: Agent
atomic_layer: Task
elicit: false

Entrada:
  - campo: year
    tipo: string
    origem: "usuario"
    obrigatorio: true

Saida:
  - campo: financial_calendar
    tipo: document
    destino: "todos os agentes da squad"

Checklist:
  - "[ ] Definir datas de fechamento mensal"
  - "[ ] Definir datas de review trimestral"
  - "[ ] Mapear deadlines de cada agente"
  - "[ ] Alinhar com calendario fiscal"
---

# Task: Manage Financial Calendar

## Metadata
- **Agent:** finance-orqx (Ledger)
- **Squad:** squad-finance
- **Complexity:** SIMPLE

## Objetivo
Gerenciar o calendario de entregas financeiras da squad, garantindo que todos os agentes entreguem nos prazos corretos.

## Inputs
- Ano fiscal
- Calendario fiscal da empresa (se diferente do calendario civil)

## Steps

1. **Definir cadencia mensal:**
   - D+1 a D+3: Coleta de dados (Flow)
   - D+3 a D+5: P&L e profitability (Margin)
   - D+5 a D+7: Budget review (Vault)
   - D+7 a D+8: Pricing review (Mint)
   - D+8 a D+10: Dashboard executivo (Ledger)
2. **Definir cadencia trimestral:**
   - Semana 1: Analises individuais (todos os agentes)
   - Semana 2: Consolidacao e board report (Ledger)
3. **Definir marcos anuais:**
   - Outubro-Novembro: Planejamento orcamentario proximo ano
   - Janeiro: Kick-off financeiro
   - Dezembro: Fechamento anual

## Output
- Calendario financeiro completo do ano
- Deadlines por agente e por entrega
- Lembretes automaticos por fase

## Quality Gates
- [ ] Todos os meses tem fechamento definido
- [ ] Reviews trimestrais agendados
- [ ] Planejamento anual mapeado

## Quando Usar
- Inicio de ano fiscal
- Reestruturacao de processos financeiros
- Onboarding de novo membro na squad
