---
task: simulate-pricing-impact
responsavel: "@pricing-strategist"
responsavel_type: Agent
atomic_layer: Task
elicit: true

Entrada:
  - campo: pricing_change
    tipo: object
    origem: "usuario"
    obrigatorio: true
  - campo: current_metrics
    tipo: object
    origem: "financeiro"
    obrigatorio: true

Saida:
  - campo: impact_simulation
    tipo: document
    destino: "finance-orqx, diretoria"

Checklist:
  - "[ ] Modelar cenario base"
  - "[ ] Modelar cenario com mudanca"
  - "[ ] Estimar impacto em volume"
  - "[ ] Calcular impacto em receita e margem"
  - "[ ] Analisar risco"
---

# Task: Simulate Pricing Impact

## Metadata
- **Agent:** pricing-strategist (Mint)
- **Squad:** squad-finance
- **Complexity:** COMPLEX

## Objetivo
Simular impacto financeiro de uma mudanca de preco antes de implementar.

## Steps

1. **Cenario base (status quo):**
   ```
   Receita_atual = Preco_atual × Volume_atual
   Margem_atual = (Preco_atual - Custo) / Preco_atual
   ```
2. **Cenario com mudanca:**
   ```
   Volume_novo = Volume_atual × (1 + Elasticidade × % Mudanca_preco)
   Receita_nova = Preco_novo × Volume_novo
   Margem_nova = (Preco_novo - Custo) / Preco_novo
   Lucro_novo = (Preco_novo - Custo) × Volume_novo
   ```
3. **Analise de sensibilidade:**
   - Best case: volume cai menos que esperado
   - Base case: volume cai conforme elasticidade
   - Worst case: volume cai mais que esperado
4. **Break-even volume:**
   ```
   Volume_breakeven = Lucro_atual / (Preco_novo - Custo)
   Perda_maxima_volume = 1 - (Volume_breakeven / Volume_atual)
   ```

## Output
- Comparacao base vs novo (3 cenarios)
- Break-even volume
- Recomendacao: implementar, ajustar ou manter

## Quality Gates
- [ ] Elasticidade estimada com dados reais
- [ ] 3 cenarios modelados
- [ ] Break-even volume calculado

## Quando Usar
- Antes de qualquer reajuste de preco
- Planejamento de promocao/desconto
