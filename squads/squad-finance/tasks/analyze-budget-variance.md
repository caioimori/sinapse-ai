---
task: analyze-budget-variance
responsavel: "@budget-controller"
responsavel_type: Agent
atomic_layer: Task
elicit: true

Entrada:
  - campo: period
    tipo: string
    origem: "usuario"
    obrigatorio: true
  - campo: variance_data
    tipo: object
    origem: "track-monthly-budget"
    obrigatorio: true

Saida:
  - campo: variance_analysis
    tipo: document
    destino: "finance-orqx, diretoria"

Checklist:
  - "[ ] Identificar desvios significativos"
  - "[ ] Root cause analysis para cada desvio"
  - "[ ] Classificar: one-time vs recorrente"
  - "[ ] Recomendar acoes corretivas"
---

# Task: Analyze Budget Variance

## Metadata
- **Agent:** budget-controller (Vault)
- **Squad:** squad-finance
- **Complexity:** COMPLEX

## Objetivo
Analisar variacoes de budget com root cause analysis para entender se sao pontuais ou sistemicas.

## Steps

1. **Filtrar desvios significativos** (> 10% ou > R$ X valor absoluto)
2. **Root cause analysis para cada:**
   ```
   Volume variance: mudou a quantidade? (mais projetos, mais pessoas)
   Price variance: mudou o custo unitario? (reajuste, inflacao)
   Mix variance: mudou a composicao? (mais senior, mais ferramenta cara)
   Timing variance: antecipou ou atrasou? (vai normalizar)
   ```
3. **Classificar:**
   - One-time: nao vai se repetir (ajustar forecast)
   - Recorrente: vai continuar (ajustar budget)
   - Estrutural: mudanca permanente (replanejar)
4. **Recomendar acoes corretivas** com impacto estimado

## Output
- Lista de desvios significativos com root cause
- Classificacao one-time vs recorrente vs estrutural
- Acoes corretivas com responsavel e prazo
- Impacto no forecast anual

## Quality Gates
- [ ] Root cause identificado para cada desvio > 10%
- [ ] Classificacao consistente
- [ ] Acoes corretivas viáveis

## Quando Usar
- Budget variance > 10% em qualquer rubrica
- Review trimestral
- Antes de reforecast
