---
task: design-ab-test
responsavel: "@google-ads-specialist"
responsavel_type: Agent
atomic_layer: Task
elicit: true

Entrada:
  - campo: test_hypothesis
    tipo: string
    origem: "usuario ou Canvas"
    obrigatorio: true

Saida:
  - campo: test_design
    tipo: document
    destino: "Query (implementacao)"
---

# Task: Design A/B Test (Google Ads)

## Metadata
- **Agent:** google-ads-specialist (Query)
- **Squad:** squad-paidmedia
- **Complexity:** MEDIUM

## Objetivo
Desenhar teste A/B de ad copy no Google Ads com metodologia estatistica, controle de variaveis e criterios de sucesso claros.

## Steps

1. **Definir hipotese**
   - Formato: IF [mudamos X no ad copy], THEN [metrica Y muda Z%], BECAUSE [racional]
   - Exemplo: IF incluimos numero no headline, THEN CTR aumenta 15%, BECAUSE numeros chamam atencao em SERPs

2. **Selecionar variavel de teste**
   - Headline 1 (mais impacto)
   - Headline 2
   - Description 1
   - Display path
   - CTA messaging
   - REGRA: apenas 1 variavel por teste

3. **Configurar variantes**
   - Control: ad copy atual (melhor performer)
   - Variante: ad copy com mudanca isolada
   - Para RSA: fixar (pin) os elementos que variam, manter outros iguais

4. **Calcular parametros do teste**
   - Baseline CTR/CVR do ad group
   - MDE: 15-20% (ajustar por volume)
   - Confidence: 95%
   - Duracao minima: 14 dias (Google recomenda 30)
   - Usar Google Ads Experiments (Campaign Experiments) para split controlado

5. **Definir metricas de sucesso**
   - Primaria: CTR (para ad copy tests) ou CVR (para landing page tests)
   - Secundaria: CPA, conversion volume, impression share
   - Guardrail: nao aceitar winner se CPA subir >10%

## Output
Documento de test design com hipotese, variantes, sample size, duracao e criterios.

## Quality Gates
- [ ] 1 variavel isolada
- [ ] Sample size calculado
- [ ] Google Ads Experiments configurado (nao apenas ads no mesmo ad group)
- [ ] Metricas primaria e guardrail definidas

## Quando Usar
- Otimizacao de ad copy em Google Ads
- Testar novas abordagens de messaging
