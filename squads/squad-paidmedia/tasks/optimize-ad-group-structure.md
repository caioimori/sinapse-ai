---
task: optimize-ad-group-structure
responsavel: "@google-ads-specialist"
responsavel_type: Agent
atomic_layer: Task
elicit: false

Entrada:
  - campo: ad_group_data
    tipo: data
    origem: "Google Ads"
    obrigatorio: true

Saida:
  - campo: optimization_plan
    tipo: document
    destino: "Query (implementacao)"
---

# Task: Optimize Ad Group Structure

## Metadata
- **Agent:** google-ads-specialist (Query)
- **Squad:** squad-paidmedia
- **Complexity:** MEDIUM

## Objetivo
Otimizar estrutura de ad groups por tematica para melhorar Quality Score e ad relevance.

## Steps

1. **Avaliar tightness atual**
   - Keywords por ad group (ideal: 5-20 por tema)
   - Relevancia tematica: todas as keywords do grupo compartilham intent?
   - Ad copy alignment: headlines refletem os keywords do grupo?

2. **Identificar ad groups problematicos**
   - >30 keywords: provavelmente precisa split
   - Quality Score medio <5: relevancia issue
   - Keywords com intents diferentes no mesmo grupo
   - Ad copies genericos demais para o tema

3. **Reestruturar por intent**
   - Agrupar keywords por intent (nao por produto/servico)
   - Exemplo: "comprar X" e "preco de X" podem ir juntos, mas "como usar X" vai separado
   - Criar ad copies especificos para cada tema

4. **Migrar de SKAG para STAG (se aplicavel)**
   - Single Keyword Ad Groups estao obsoletos com RSAs
   - Migrar para Single Theme Ad Groups (5-15 keywords por tema)
   - Consolidar SKAGs que compartilham o mesmo tema

5. **Validar coverage**
   - Cada ad group tem pelo menos 1 RSA (ideal: 2-3)
   - Headlines no RSA refletem keywords do grupo
   - Extensions relevantes por ad group (se aplicavel)

## Output
Plano de reestruturacao com ad groups a criar, consolidar ou eliminar.

## Quality Gates
- [ ] Ad groups agrupados por intent
- [ ] 5-20 keywords por ad group
- [ ] Ad copies alinhados com theme de cada grupo
- [ ] Quality Score projecao pos-reestruturacao

## Quando Usar
- Auditoria de conta
- Quality Score baixo persistente
- Expansao de keywords
