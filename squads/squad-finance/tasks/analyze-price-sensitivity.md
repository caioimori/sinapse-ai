---
task: analyze-price-sensitivity
responsavel: "@pricing-strategist"
responsavel_type: Agent
atomic_layer: Task
elicit: true

Entrada:
  - campo: service
    tipo: string
    origem: "usuario"
    obrigatorio: true
  - campo: survey_data
    tipo: object
    origem: "pesquisa de mercado"
    obrigatorio: false

Saida:
  - campo: price_sensitivity_report
    tipo: document
    destino: "finance-orqx"

Checklist:
  - "[ ] Aplicar Van Westendorp (se dados disponiveis)"
  - "[ ] Analisar elasticidade historica"
  - "[ ] Identificar optimal price point"
  - "[ ] Definir acceptable price range"
---

# Task: Analyze Price Sensitivity

## Metadata
- **Agent:** pricing-strategist (Mint)
- **Squad:** squad-finance
- **Complexity:** COMPLEX

## Objetivo
Analisar sensibilidade de preco do mercado para definir faixa otima de precificacao.

## Steps

1. **Van Westendorp (se dados de pesquisa disponiveis):**
   - Plotar 4 curvas (Too Cheap, Cheap, Expensive, Too Expensive)
   - Encontrar intersecoes (PMC, PME, IDP, OPP)
   - Definir acceptable price range
2. **Analise historica (se sem pesquisa):**
   ```
   Elasticidade = % Mudanca_Volume / % Mudanca_Preco
   |E| < 1: Inelastico (pode aumentar preco)
   |E| = 1: Unitario
   |E| > 1: Elastico (cuidado ao aumentar)
   ```
3. **Win/Loss analysis:**
   - Propostas ganhas: qual foi o preco?
   - Propostas perdidas: preco foi fator? Qual preco ganharia?
4. **Definir faixa otima** considerando todos os dados

## Output
- Optimal price point (OPP)
- Acceptable price range (PMC a PME)
- Elasticidade estimada
- Recomendacao de preco com justificativa

## Quality Gates
- [ ] Metodologia adequada aos dados disponiveis
- [ ] Range de preco definido com limites claros
- [ ] Recomendacao considera tanto margem quanto conversao

## Quando Usar
- Antes de reajuste de precos
- Lancamento de servico em mercado novo
- Perda de propostas por preco
