---
task: analyze-keyword-search-terms
responsavel: "@google-ads-specialist"
responsavel_type: Agent
atomic_layer: Task
elicit: false

Entrada:
  - campo: keyword_search_term_data
    tipo: data
    origem: "Google Ads"
    obrigatorio: true

Saida:
  - campo: kw_st_analysis
    tipo: document
    destino: "Query (implementacao)"
---

# Task: Analyze Keyword & Search Terms Insights

## Metadata
- **Agent:** google-ads-specialist (Query)
- **Squad:** squad-paidmedia
- **Complexity:** MEDIUM

## Objetivo
Analisar relacao entre keywords e search terms para otimizar match types, identificar gaps e melhorar relevancia.

## Steps

1. **Mapear keyword → search term relationships**
   - Para cada keyword: quais search terms ela trigga?
   - Search term coverage: % dos search terms cobertos por keywords exatas
   - Search term diversity: quantos search terms unicos por keyword

2. **Analisar match type effectiveness**
   - Broad match: % de search terms relevantes vs irrelevantes
   - Phrase match: % de search terms relevantes vs irrelevantes
   - Exact match: delivery volume e CPA comparativo
   - Recomendacao de ajuste de match type por keyword

3. **Identificar keyword gaps**
   - Search terms que convertem mas nao tem keyword dedicada
   - Search terms com volume que poderiam ser ad groups proprios
   - Temas emergentes nao cobertos pela estrutura atual

4. **Analisar intent alignment**
   - Search terms com intent transacional → keywords em ad groups de conversao?
   - Search terms informativos → devem ser negativados ou ter ad group separado?
   - Search terms de brand → devem estar em campanha de brand separada?

5. **Gerar plano de acao**
   - Keywords a adicionar (de search terms de sucesso)
   - Match types a ajustar
   - Negatives a adicionar
   - Novos ad groups a criar

## Output
Analise de keyword-search term com gaps, match type recommendations e plano de acao.

## Quality Gates
- [ ] Mapping keyword → search term completo
- [ ] Match type effectiveness quantificada
- [ ] Gaps identificados com dados de volume e conversao
- [ ] Plano de acao priorizado

## Quando Usar
- Otimizacao mensal de keywords
- Quando broad match esta ativo
- Antes de expansao de keywords
