---
task: optimize-collection-process
responsavel: "@revenue-analyst"
responsavel_type: Agent
atomic_layer: Task
elicit: true

Entrada:
  - campo: collection_data
    tipo: object
    origem: "financeiro, billing"
    obrigatorio: true

Saida:
  - campo: collection_optimization_plan
    tipo: document
    destino: "finance-orqx, operacoes"

Checklist:
  - "[ ] Analisar collection rate atual"
  - "[ ] Identificar causas de atraso"
  - "[ ] Desenhar dunning sequence"
  - "[ ] Definir incentivos e penalidades"
  - "[ ] Projetar melhoria de DSO"
---

# Task: Optimize Collection Process

## Metadata
- **Agent:** revenue-analyst (Flow)
- **Squad:** squad-finance
- **Complexity:** COMPLEX

## Objetivo
Otimizar processo de cobranca para reduzir DSO e melhorar collection rate.

## Steps

1. **Diagnosticar:** collection rate, DSO, aging distribution
2. **Identificar causas de atraso:**
   - Processo de faturamento lento
   - Payment terms muito longos
   - Falta de follow-up
   - Disputas de escopo
   - Cliente com problema de caixa
3. **Desenhar dunning sequence:**
   ```
   D-3: Lembrete pre-vencimento (email automatico)
   D+1: Fatura vencida (email)
   D+7: Segundo lembrete (email + mensagem)
   D+15: Ligacao do account manager
   D+30: Email formal do financeiro
   D+45: Escalacao a diretoria
   D+60: Notificacao extrajudicial
   D+90: Avaliacao juridica
   ```
4. **Implementar incentivos:**
   ```
   Early payment: 2% desconto se pagar em 10 dias (2/10 Net 30)
   Auto-debit: desconto de 1% para debito automatico
   ```
5. **Projetar impacto:**
   - Reducao de DSO esperada
   - Melhoria de collection rate
   - Impacto no cash flow

## Output
- Diagnostico do processo atual
- Nova dunning sequence
- Politica de incentivos
- Projecao de melhoria de DSO

## Quality Gates
- [ ] Causas raiz identificadas
- [ ] Dunning sequence com prazos e responsaveis
- [ ] Impacto projetado em dias de DSO

## Quando Usar
- DSO acima de 60 dias
- Collection rate abaixo de 85%
- Problema recorrente de caixa
