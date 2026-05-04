---
task: analyze-revenue-concentration
responsavel: "@revenue-analyst"
responsavel_type: Agent
atomic_layer: Task
elicit: false

Entrada:
  - campo: revenue_by_client
    tipo: object
    origem: "financeiro"
    obrigatorio: true

Saida:
  - campo: concentration_report
    tipo: document
    destino: "finance-orqx, diretoria"

Checklist:
  - "[ ] Calcular % receita por cliente"
  - "[ ] Calcular Herfindahl Index"
  - "[ ] Classificar risco"
  - "[ ] Recomendar diversificacao"
---

# Task: Analyze Revenue Concentration

## Metadata
- **Agent:** revenue-analyst (Flow)
- **Squad:** squad-finance
- **Complexity:** MEDIUM

## Objetivo
Analisar concentracao de receita por cliente para avaliar risco de dependencia.

## Steps

1. **Revenue breakdown por cliente:**
   ```
   | Cliente | Receita | % do Total | Acumulado |
   | Cliente A | R$ 100K | 25% | 25% |
   | Cliente B | R$ 80K | 20% | 45% |
   | ... | ... | ... | ... |
   ```
2. **Herfindahl Index:**
   ```
   HHI = Σ(share_i²)
   HHI < 0.15: Diversificado
   0.15 <= HHI < 0.25: Moderadamente concentrado
   HHI >= 0.25: Altamente concentrado
   ```
3. **Regras de risco:**
   ```
   Nenhum cliente > 15%: VERDE
   1 cliente 15-30%: AMARELO
   1 cliente > 30% ou top 3 > 60%: VERMELHO
   ```
4. **Plano de diversificacao** se risco alto

## Output
- Pareto de receita por cliente
- Herfindahl Index
- Classificacao de risco
- Plano de diversificacao (se necessario)

## Quality Gates
- [ ] Todos os clientes incluidos
- [ ] HHI calculado corretamente
- [ ] Risco classificado com justificativa

## Quando Usar
- Review trimestral
- Perda de cliente grande (avaliar impacto)
- Planejamento de diversificacao
