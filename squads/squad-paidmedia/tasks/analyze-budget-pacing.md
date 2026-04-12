---
task: analyze-budget-pacing
responsavel: "@google-ads-specialist"
responsavel_type: Agent
atomic_layer: Task
elicit: false

Entrada:
  - campo: budget_data
    tipo: data
    origem: "Google Ads"
    obrigatorio: true

Saida:
  - campo: pacing_report
    tipo: document
    destino: "Apex + Query"
---

# Task: Analyze Budget Pacing

## Metadata
- **Agent:** google-ads-specialist (Query)
- **Squad:** squad-paidmedia
- **Complexity:** LOW

## Objetivo
Analisar pacing de budget para identificar underspend, overspend e projetar spend ao final do periodo.

## Steps

1. **Calcular pacing atual**
   - Dias decorridos no mes / dias totais = % do periodo
   - Spend ate agora / budget mensal = % do budget gasto
   - Pacing ratio = % budget gasto / % periodo decorrido
   - Ideal: pacing ratio entre 0.9 e 1.1

2. **Classificar por campanha**
   - Overpacing (ratio >1.15): vai gastar mais que o budget — reduzir daily budget
   - On-pace (ratio 0.9-1.1): saudavel
   - Underpacing (ratio <0.85): vai sobrar budget — investigar restricoes
   - Severely underpacing (ratio <0.6): problema grave — algo bloqueando delivery

3. **Diagnosticar underspend**
   - Limited by bid: CPC muito baixo, nao ganha leiloes
   - Limited by targeting: audience muito pequena
   - Limited by ad strength: ads reprovados ou com baixa qualidade
   - Limited by competition: vertical muito competitivo para o budget
   - Limited by schedule: day parting muito restritivo

4. **Projetar spend ao final do mes**
   - Projecao linear: spend_atual * (dias_totais / dias_decorridos)
   - Projecao ajustada: considerar dia da semana patterns (weekday vs weekend)
   - Gap: projecao vs budget (positivo = overspend, negativo = underspend)

5. **Recomendacoes de ajuste**
   - Overpacing: reduzir daily budget ou shared budget
   - Underpacing: investigar causa, aumentar bids, expandir targeting, melhorar ads
   - Manter buffer de 5% para variacoes de final de mes

## Output
Pacing report por campanha com status, projecao e recomendacoes.

## Quality Gates
- [ ] Todas as campanhas ativas analisadas
- [ ] Projecao de end-of-month calculada
- [ ] Causa de under/overspend diagnosticada
- [ ] Recomendacoes com acao especifica

## Quando Usar
- Revisao semanal de budget
- Mid-month check
- Quando spend pattern muda subitamente
