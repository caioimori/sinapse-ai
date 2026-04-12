---
checklist: account-audit-checklist
squad: squad-paidmedia
description: "Checklist completo para auditoria de conta de midia paga"
used_by:
  - audit-meta-ads-account
  - audit-google-ads-account
  - account-audit-cycle
---

# Account Audit Checklist

## 1. Tracking Infrastructure
- [ ] Google Tag Manager presente e configurado
- [ ] Facebook Pixel ativo com eventos corretos
- [ ] CAPI implementado com EMQ >6.0
- [ ] Google Ads conversion tag ativo
- [ ] GA4 configurado com conversion events
- [ ] Enhanced conversions habilitado
- [ ] UTM parameters consistentes
- [ ] Cross-domain tracking (se necessario)
- [ ] Consent management configurado (GDPR/LGPD)
- [ ] Data layer documentado

## 2. Account Structure (Meta)
- [ ] Numero de campanhas ativas razoavel (3-5 por objetivo)
- [ ] CBO utilizado (default)
- [ ] Naming conventions consistentes
- [ ] Audience tiers definidos (Cold/Warm/Hot)
- [ ] Exclusions entre tiers configuradas
- [ ] Max 5 ad sets por campanha CBO
- [ ] 3-6 ads por ad set

## 3. Account Structure (Google)
- [ ] Campaign structure alinhada com template (Simplified/Standard/Scaled)
- [ ] Ad groups tematicamente coesos (5-20 keywords por grupo)
- [ ] Match type strategy definida
- [ ] Negative keywords implementadas
- [ ] Shared negative keyword lists criadas
- [ ] Ad extensions configuradas (sitelinks, callouts, snippets)
- [ ] Min 2 RSAs por ad group

## 4. Keywords & Quality Score (Google)
- [ ] Quality Score distribution: >50% com QS >=7
- [ ] Keywords com QS <4 identificadas e plano de acao
- [ ] Keyword cannibalization verificada
- [ ] Search terms waste <15% do budget
- [ ] Low volume keywords identificadas

## 5. Bidding & Budget
- [ ] Bid strategy adequada para volume de conversoes
- [ ] Smart Bidding readiness verificada (30+ conv/30d)
- [ ] Budget pacing saudavel (ratio 0.9-1.1)
- [ ] Budget por ad set >= 5x CPA target (Meta ABO)
- [ ] Impression share lost by budget analisada (Google)

## 6. Creative Performance
- [ ] Creative count adequado (3-6 ativos por ad set)
- [ ] Creative diversity (mix de formatos)
- [ ] Creative age verificada (alerta se >30 dias)
- [ ] Frequency analysis (<3 media por ad)
- [ ] Winners e losers identificados

## 7. Landing Pages
- [ ] LPs com Lighthouse score >80
- [ ] Core Web Vitals passing (LCP <2.5s, CLS <0.1)
- [ ] Mobile rendering verificado
- [ ] Message match com ads
- [ ] Conversion tracking na LP

## Score Card
| Area | Score (A-D) | Notes |
|------|------------|-------|
| Tracking | | |
| Structure (Meta) | | |
| Structure (Google) | | |
| Keywords/QS | | |
| Bidding/Budget | | |
| Creative | | |
| Landing Pages | | |
| **Overall** | | |
