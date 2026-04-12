---
task: audit-search-terms
responsavel: "@google-ads-specialist"
responsavel_type: Agent
atomic_layer: Task
elicit: false

Entrada:
  - campo: search_terms_report
    tipo: data
    origem: "Google Ads"
    obrigatorio: true

Saida:
  - campo: search_terms_audit
    tipo: document
    destino: "Query (implementacao)"
---

# Task: Audit Search Terms

## Metadata
- **Agent:** google-ads-specialist (Query)
- **Squad:** squad-paidmedia
- **Complexity:** MEDIUM

## Objetivo
Auditar search terms report para identificar waste, oportunidades de negative keywords e novos keywords.

## Steps

1. **Exportar search terms data (ultimos 30-90 dias)**
   - Search term, impressions, clicks, cost, conversions, CPA
   - Match type que triggou o ad
   - Campaign e ad group

2. **Categorizar search terms**
   - Relevante + Converte: manter, considerar exact match
   - Relevante + Nao converte: monitorar, dar mais tempo
   - Irrelevante + Spend: negativar IMEDIATAMENTE
   - Irrelevante + Baixo spend: negativar preventivamente

3. **Calcular waste**
   - Total spend em termos irrelevantes
   - % do budget total gasto em waste
   - Benchmark: waste ideal <15% do total spend

4. **N-gram analysis**
   - Quebrar search terms em unigrams e bigrams
   - Identificar palavras que aparecem em termos irrelevantes repetidamente
   - Estas sao candidatas a negative keywords de nivel campanha

5. **Gerar listas de acao**
   - Negative keywords a adicionar (com nivel: campaign ou ad group)
   - Keywords a promover para exact match
   - Keywords a adicionar como novos keywords
   - Shared negative keyword lists a criar/atualizar

## Output
Audit report com waste quantificado, negatives recomendados e novos keywords identificados.

## Quality Gates
- [ ] Waste quantificado em $ e %
- [ ] Negative keywords com nivel especificado (campaign/ad group)
- [ ] N-gram analysis completada
- [ ] Novos keywords identificados

## Quando Usar
- Semanalmente para contas com broad match ativas
- Quinzenalmente para contas com phrase/exact
- Apos adicionar novos keywords
