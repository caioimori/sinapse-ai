---
task: design-value-based-pricing
responsavel: "@pricing-strategist"
responsavel_type: Agent
atomic_layer: Task
elicit: true

Entrada:
  - campo: service
    tipo: string
    origem: "usuario"
    obrigatorio: true
  - campo: client_context
    tipo: object
    origem: "usuario, comercial"
    obrigatorio: true

Saida:
  - campo: value_based_pricing
    tipo: document
    destino: "squad-commercial"

Checklist:
  - "[ ] Aplicar Hormozi Value Equation"
  - "[ ] Quantificar valor entregue ao cliente"
  - "[ ] Definir fator de captura de valor"
  - "[ ] Construir narrativa de valor"
  - "[ ] Validar contra floor de custo"
---

# Task: Design Value-Based Pricing

## Metadata
- **Agent:** pricing-strategist (Mint)
- **Squad:** squad-finance
- **Complexity:** CRITICAL

## Objetivo
Desenhar pricing baseado no valor entregue ao cliente usando a Hormozi Value Equation, nao no custo de producao.

## Steps

1. **Aplicar Hormozi Value Equation:**
   ```
   Valor = (Dream Outcome × Perceived Likelihood) / (Time Delay × Effort & Sacrifice)

   Exemplo para redesign de e-commerce:
   Dream Outcome: +30% conversao = +R$ 500K/ano receita adicional
   Perceived Likelihood: 80% (cases, garantia, metodologia)
   Time Delay: 3 meses (vs 6 meses de outro fornecedor)
   Effort & Sacrifice: Minimo (done-for-you, processo claro)

   Valor percebido ALTO → preco pode ser premium
   ```

2. **Quantificar valor entregue:**
   ```
   Valor_direto = receita_adicional + custo_evitado + tempo_economizado
   Valor_indireto = brand_equity + vantagem_competitiva + capacitacao

   Exemplo:
   Redesign e-commerce: +R$ 500K/ano receita
   Preco justo: R$ 500K × 10-20% captura = R$ 50-100K
   (vs cost-plus de R$ 30K que seria baseado apenas em horas)
   ```

3. **Construir narrativa de valor:**
   - Problema do cliente em termos financeiros
   - Solucao com outcome quantificado
   - ROI esperado com timeline
   - Garantia de resultado (se aplicavel)

4. **Validar contra floor:**
   ```
   Floor = Custo_projeto × (1 + Margem_minima_40%)
   Preco_value_based DEVE ser > Floor
   Se Preco_value < Floor → nao fazer o projeto OU renegociar escopo
   ```

## Output
- Value-based pricing com fundamentacao completa
- Narrativa de valor para proposta
- ROI projetado para o cliente
- Floor vs ceiling price

## Quality Gates
- [ ] Valor quantificado em reais
- [ ] Hormozi equation aplicada corretamente
- [ ] Preco acima do floor de custo
- [ ] Narrativa convincente e fundamentada

## Quando Usar
- Propostas de alto valor
- Servicos com impacto mensuravel no negocio do cliente
- Diferenciacao contra concorrentes que cobram por hora
