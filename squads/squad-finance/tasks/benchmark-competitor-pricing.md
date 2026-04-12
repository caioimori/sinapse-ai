---
task: benchmark-competitor-pricing
responsavel: "@pricing-strategist"
responsavel_type: Agent
atomic_layer: Task
elicit: true

Entrada:
  - campo: service_category
    tipo: string
    origem: "usuario"
    obrigatorio: true
  - campo: competitors
    tipo: array
    origem: "usuario, pesquisa"
    obrigatorio: false

Saida:
  - campo: pricing_benchmark
    tipo: document
    destino: "finance-orqx, comercial"

Checklist:
  - "[ ] Identificar concorrentes relevantes"
  - "[ ] Coletar precos praticados"
  - "[ ] Comparar escopo e posicionamento"
  - "[ ] Definir posicionamento de preco"
---

# Task: Benchmark Competitor Pricing

## Metadata
- **Agent:** pricing-strategist (Mint)
- **Squad:** squad-finance
- **Complexity:** MEDIUM

## Objetivo
Benchmarking de precos contra concorrentes para posicionar adequadamente no mercado.

## Steps

1. **Identificar concorrentes** (diretos e indiretos)
2. **Coletar dados de pricing:**
   - Sites publicos, propostas, win/loss data
   - Glassdoor/salarios para estimar custos
3. **Comparar normalizando escopo:**
   ```
   Preco normalizado = Preco / Escopo_padronizado
   Ex: R$/hora, R$/sprint, R$/projeto tipo
   ```
4. **Posicionar:**
   - Below market: competir por volume
   - At market: competir por diferenciacao
   - Above market: competir por valor/premium

## Output
- Mapa de precos do mercado
- Posicionamento relativo
- Recomendacao de faixa de preco

## Quality Gates
- [ ] Pelo menos 5 concorrentes mapeados
- [ ] Precos normalizados para comparacao justa
- [ ] Posicionamento alinhado com estrategia

## Quando Usar
- Revisao anual de pricing
- Entrada em novo mercado/segmento
- Perda recorrente de propostas
