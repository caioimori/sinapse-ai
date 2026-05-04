---
task: audit-google-ads-account
responsavel: "@google-ads-specialist"
responsavel_type: Agent
atomic_layer: Task
elicit: true

Entrada:
  - campo: account_data
    tipo: data
    origem: "Google Ads"
    obrigatorio: true

Saida:
  - campo: audit_report
    tipo: document
    destino: "Apex"
---

# Task: Audit Google Ads Account

## Metadata
- **Agent:** google-ads-specialist (Query)
- **Squad:** squad-paidmedia
- **Complexity:** HIGH

## Objetivo
Auditoria completa de conta Google Ads cobrindo estrutura, keywords, bidding, ad copy, tracking, Quality Score e budget efficiency.

## Steps

1. **Audit de estrutura de conta**
   - Numero de campanhas vs template recomendado (Simplified/Standard/Scaled)
   - Campaign types: Search, Display, Shopping, Pmax — mix adequado?
   - Ad group tightness (keywords por ad group, relevancia tematica)
   - Naming conventions
   - Score: A (best practice) / B (razoavel) / C (precisa trabalho) / D (critico)

2. **Audit de keywords**
   - Portfolio balance: head vs body vs long-tail
   - Match type distribution: broad vs phrase vs exact
   - Keyword duplicates e cannibalization
   - Quality Score distribution (% acima de 7, % abaixo de 4)
   - Negative keywords: volume, cobertura, shared lists
   - Search terms waste: % de spend em termos irrelevantes

3. **Audit de ad copy**
   - Ad Strength distribution para RSAs
   - Numero de ads por ad group (ideal: 2-3 RSAs)
   - Headline diversity e pinning strategy
   - Extensions/assets: sitelinks, callouts, structured snippets, images
   - Ad relevance score

4. **Audit de bidding**
   - Strategy por campanha (manual, target CPA, target ROAS, maximize conversions)
   - Smart Bidding readiness (volume de conversoes, tracking quality)
   - Bid adjustments: device, location, schedule
   - Budget utilization: limited by budget?

5. **Audit de conversion tracking**
   - Conversion actions configuradas
   - Conversion values corretos
   - Attribution model (data-driven recommended)
   - Google Ads vs GA4 conversion discrepancia
   - Enhanced conversions status

6. **Audit de budget efficiency**
   - CPA por campanha vs target
   - Impression share e lost IS (budget vs rank)
   - Budget pacing (under/overspend)
   - Wasted spend (irrelevant search terms, low QS keywords)
   - Top of page rate

7. **Score card e recomendacoes**
   - Score por area (A-D)
   - Overall health score (1-100)
   - Top 10 recomendacoes priorizadas
   - Quick wins vs strategic changes
   - Estimated impact per recommendation

## Output
Audit report completo com score card, findings e recomendacoes.

## Quality Gates
- [ ] Todas as 6 areas auditadas
- [ ] Quality Score distribution calculada
- [ ] Wasted spend quantificado
- [ ] Recomendacoes com impacto estimado
- [ ] Dados de 90+ dias analisados

## Quando Usar
- Onboarding de conta nova
- Auditoria trimestral rotineira
- Queda significativa de performance
- Antes de scaling
