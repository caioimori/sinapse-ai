---
task: audit-keywords
responsavel: "@google-ads-specialist"
responsavel_type: Agent
atomic_layer: Task
elicit: false

Entrada:
  - campo: keyword_data
    tipo: data
    origem: "Google Ads"
    obrigatorio: true

Saida:
  - campo: keyword_audit
    tipo: document
    destino: "Query (implementacao)"
---

# Task: Audit Keywords

## Metadata
- **Agent:** google-ads-specialist (Query)
- **Squad:** squad-paidmedia
- **Complexity:** MEDIUM

## Objetivo
Auditar portfolio de keywords para qualidade, relevancia, duplicatas e oportunidades.

## Steps

1. **Inventario de keywords**
   - Total de keywords ativas
   - Distribuicao por match type (exact, phrase, broad)
   - Distribuicao por Quality Score (1-10)
   - Keywords com 0 impressions nos ultimos 30 dias

2. **Quality Score analysis**
   - % com QS >= 7 (bom)
   - % com QS 4-6 (medio — otimizar)
   - % com QS <= 3 (ruim — pausar ou reestruturar)
   - Decomposicao: ad relevance, LP experience, expected CTR

3. **Identificar problemas**
   - Keyword cannibalization: mesma keyword em multiplos ad groups
   - Low volume keywords: "Low search volume" status
   - Expensive keywords: alto CPC sem conversoes
   - Irrelevant keywords: keywords que triggam search terms irrelevantes

4. **Oportunidades**
   - Gaps: termos de busca convertendo que nao sao keywords
   - Long-tail: expandir a partir de search terms de sucesso
   - Competitor keywords: termos de marca concorrente (se estrategia permite)
   - Negative gaps: categorias de negativos que faltam

5. **Recomendacoes**
   - Keywords a pausar (QS <3, sem conversoes em 60d)
   - Keywords a adicionar (de search terms report)
   - Match type adjustments (broad → phrase, phrase → exact)
   - Keywords a mover para ad groups mais relevantes

## Output
Keyword audit com inventario, QS analysis, problemas e recomendacoes.

## Quality Gates
- [ ] Quality Score distribution calculada
- [ ] Cannibalization identificada
- [ ] Recomendacoes com impacto esperado
- [ ] Dados de 30+ dias usados

## Quando Usar
- Auditoria de conta
- Quality Score medio caindo
- Expansao de keywords
