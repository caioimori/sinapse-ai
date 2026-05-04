---
task: model-pricing-scenario
responsavel: "@pricing-strategist"
responsavel_type: Agent
atomic_layer: Task
elicit: true

Entrada:
  - campo: service_description
    tipo: string
    origem: "usuario"
    obrigatorio: true
  - campo: cost_data
    tipo: object
    origem: "profitability-analyst"
    obrigatorio: true
  - campo: market_data
    tipo: object
    origem: "pesquisa, benchmarks"
    obrigatorio: false

Saida:
  - campo: pricing_scenarios
    tipo: document
    destino: "finance-orqx, comercial"

Checklist:
  - "[ ] Definir custo floor"
  - "[ ] Definir valor ceiling"
  - "[ ] Modelar 3 cenarios"
  - "[ ] Simular impacto em margem"
  - "[ ] Recomendar cenario ideal"
---

# Task: Model Pricing Scenario

## Metadata
- **Agent:** pricing-strategist (Mint)
- **Squad:** squad-finance
- **Complexity:** COMPLEX

## Objetivo
Modelar cenarios de pricing para um servico, considerando custo, valor percebido e mercado.

## Steps

1. **Definir floor price (custo):**
   ```
   Floor = Cost_per_delivery × (1 + Margem_minima_aceitavel)
   Margem_minima: 40% gross (agencia)
   ```
2. **Definir ceiling price (valor):**
   ```
   Ceiling = Valor_entregue_ao_cliente × Fator_captura
   Fator_captura: 10-30% do valor gerado (tipico)
   ```
3. **Modelar 3 cenarios:**
   - Conservative: proximo ao floor, alta conversao
   - Balanced: meio do range, conversao moderada
   - Premium: proximo ao ceiling, conversao seletiva
4. **Simular impacto:**
   ```
   Para cada cenario:
   Receita_projetada = Preco × Volume_estimado
   Margem_projetada = (Preco - Custo) / Preco × 100
   Lucro_projetado = (Preco - Custo) × Volume_estimado
   ```
5. **Recomendar cenario** baseado em objetivo (volume vs margem vs market share)

## Output
- 3 cenarios com preco, margem, volume e lucro projetados
- Analise de sensibilidade (o que muda se volume variar +/- 20%)
- Recomendacao com justificativa

## Quality Gates
- [ ] Floor price cobre custos com margem minima
- [ ] Ceiling price fundamentado em valor real
- [ ] Simulacoes com premissas explicitas

## Quando Usar
- Lancamento de novo servico
- Revisao de pricing existente
- Cenarios para planejamento estrategico
