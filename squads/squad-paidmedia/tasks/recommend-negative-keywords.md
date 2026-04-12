---
task: recommend-negative-keywords
responsavel: "@google-ads-specialist"
responsavel_type: Agent
atomic_layer: Task
elicit: false

Entrada:
  - campo: search_terms_data
    tipo: data
    origem: "Google Ads"
    obrigatorio: true

Saida:
  - campo: negative_recommendations
    tipo: document
    destino: "Query (implementacao)"
---

# Task: Recommend Negative Keywords

## Metadata
- **Agent:** google-ads-specialist (Query)
- **Squad:** squad-paidmedia
- **Complexity:** LOW

## Objetivo
Recomendar negative keywords com base em search terms report e n-gram analysis.

## Steps

1. **Analisar search terms sem conversao com spend**
   - Filtrar: spend >$0, conversions = 0, ultimos 30 dias
   - Ordenar por spend (maior waste primeiro)

2. **N-gram analysis**
   - Extrair unigrams e bigrams de todos os search terms
   - Identificar patterns em termos irrelevantes
   - Categorias comuns: "gratis", "emprego", "como", "o que e", competitor brands

3. **Categorizar negatives**
   - Campaign-level: termos universalmente irrelevantes para a conta
   - Ad group-level: termos irrelevantes para aquele tema especifico
   - Shared lists: por categoria (competitor brands, informational, job-related)

4. **Definir match type dos negatives**
   - Exact negative: quando apenas aquele termo exato e irrelevante
   - Phrase negative: quando qualquer busca contendo a frase e irrelevante
   - Broad negative: quando qualquer combinacao das palavras e irrelevante
   - CUIDADO: broad negative pode bloquear termos relevantes

5. **Estimar impacto**
   - Spend que seria economizado nos ultimos 30 dias
   - % de reducao de waste estimada
   - Conversoes que NaO serao perdidas (validar que negatives nao bloqueiam termos bons)

## Output
Lista de negative keywords com nivel (campaign/ad group/shared), match type e impacto estimado.

## Quality Gates
- [ ] Negatives NAO bloqueiam termos que convertem
- [ ] Match type correto para cada negative
- [ ] Nivel correto (campaign vs ad group vs shared)
- [ ] Impacto estimado em $ de waste evitado

## Quando Usar
- Semanalmente para contas com broad match
- Apos audit-search-terms
- Quando waste >15% do budget
