---
task: improve-ad-copy
responsavel: "@google-ads-specialist"
responsavel_type: Agent
atomic_layer: Task
elicit: true

Entrada:
  - campo: current_ads
    tipo: data
    origem: "Google Ads"
    obrigatorio: true
  - campo: keyword_themes
    tipo: list
    origem: "Query"
    obrigatorio: true

Saida:
  - campo: improved_ads
    tipo: document
    destino: "Query (implementacao)"
---

# Task: Improve Ad Copy

## Metadata
- **Agent:** google-ads-specialist (Query)
- **Squad:** squad-paidmedia
- **Complexity:** MEDIUM

## Objetivo
Melhorar ad copies Google Ads com base em dados de performance, Quality Score e best practices.

## Steps

1. **Analisar performance atual**
   - CTR por ad e headline combination
   - RSA asset performance (headlines/descriptions rated: Best, Good, Low)
   - Pinning strategy e impacto
   - Quality Score component: ad relevance

2. **Identificar gaps**
   - Headlines sem keyword do ad group
   - Descriptions sem CTA claro
   - Missing: numeros, urgencia, beneficios, diferenciais
   - Ad Strength abaixo de "Good"

3. **Gerar melhorias**
   - Headline 1: incluir keyword principal + beneficio primario
   - Headline 2: diferencial competitivo ou social proof
   - Headline 3: CTA com urgencia ou oferta
   - Descriptions: expandir beneficios, incluir CTA, usar todos os caracteres
   - Formulas provadas: "Get [Benefit] in [Timeframe]", "[Number] [Noun] [Benefit]", "Free [Offer] + [Qualifier]"

4. **Otimizar extensions/assets**
   - Sitelinks: 4+ com descriptions
   - Callouts: 4+ com beneficios/features
   - Structured snippets: categorias relevantes
   - Image assets: se aplicavel
   - Promotion extensions: se ha oferta ativa

5. **Configurar para teste**
   - Criar ad como variante (nao substituir winner atual)
   - Usar Google Ads Experiments se possivel
   - Definir periodo de teste (min 14 dias)

## Output
Novos ad copies com headlines, descriptions e extensions otimizados.

## Quality Gates
- [ ] Keywords do ad group presentes em headlines
- [ ] CTA claro em pelo menos 1 headline e 1 description
- [ ] Ad Strength projetado: "Good" ou "Excellent"
- [ ] Extensions atualizadas

## Quando Usar
- Quality Score de ad relevance abaixo de "Average"
- CTR abaixo do benchmark do vertical
- Quando Canvas entrega novas mensagens
