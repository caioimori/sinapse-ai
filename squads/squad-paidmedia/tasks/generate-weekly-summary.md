---
task: generate-weekly-summary
responsavel: "@campaign-analyst"
responsavel_type: Agent
atomic_layer: Task
elicit: false
---

# Task: Generate Weekly Summary

## Metadata
- **Agent:** campaign-analyst (Pulse)
- **Squad:** squad-paidmedia
- **Complexity:** LOW

## Objetivo
Resumo semanal de performance cross-channel com highlights e anomalias.

## Steps

1. **Metricas semanais consolidadas**
   - Spend total e por canal
   - Conversoes e CPA/ROAS blended
   - WoW change para metricas-chave

2. **Highlights da semana**
   - Melhor e pior performer (campanha)
   - Anomalias detectadas (z-score >2)
   - Testes em andamento e status
   - Budget pacing status

3. **Quick insights (max 5)**
   - O que mudou e por que
   - O que precisa de acao imediata
   - O que esta no caminho certo

4. **Proximos passos**
   - Acoes para a proxima semana
   - Testes a iniciar ou concluir
   - Decisoes pendentes

## Output
Weekly summary em formato conciso (<1 pagina).

## Quality Gates
- [ ] Todos os canais ativos incluidos
- [ ] WoW comparativo presente
- [ ] Max 5 insights (conciso)
- [ ] Proximos passos claros

## Quando Usar
- Todo inicio de semana (segunda)
