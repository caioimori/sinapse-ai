---
checklist: campaign-launch-checklist
squad: squad-paidmedia
description: "Checklist pre-launch para verificar todos os componentes antes de ativar campanha"
used_by:
  - execute-launch-checklist
  - campaign-launch-cycle
---

# Campaign Launch Checklist

## 1. Tracking & Measurement
- [ ] Facebook Pixel ativo e firing em todas as LPs
- [ ] Conversions API (CAPI) configurado com EMQ >6.0
- [ ] Event deduplication entre Pixel e CAPI funcionando
- [ ] Google Ads conversion tag ativo e testado
- [ ] GA4 configurado com conversion events corretos
- [ ] Enhanced conversions habilitado (Google)
- [ ] UTM parameters em todas as URLs de destino
- [ ] Auto-tagging habilitado (Google Ads)
- [ ] Cross-domain tracking configurado (se aplicavel)
- [ ] Teste end-to-end: submeter conversao de teste e verificar em todas as plataformas

## 2. Campaign Configuration
- [ ] Campaign objective correto para o goal de negocio
- [ ] Budget type (CBO/ABO) conforme planejado
- [ ] Budget amount correto (diario ou lifetime)
- [ ] Schedule start/end date corretos
- [ ] Bid strategy alinhada com objetivo
- [ ] Conversion action correta selecionada
- [ ] Attribution window configurada

## 3. Audience & Targeting
- [ ] Audiences Cold/Warm/Hot configuradas (Meta)
- [ ] Exclusions entre tiers ativas (Meta)
- [ ] Keywords selecionadas e organizadas por ad group (Google)
- [ ] Negative keywords adicionadas (Google)
- [ ] Geographic targeting correto
- [ ] Device targeting (ou All devices)
- [ ] Placements: Advantage+ ou manual com justificativa

## 4. Creative & Ad Copy
- [ ] Criativos em resolucao e formato corretos por plataforma
- [ ] Copy e headlines sem erros de ortografia
- [ ] CTAs corretos selecionados
- [ ] Video ads com captions/text overlay (sound-off)
- [ ] Ad extensions/assets configurados (Google: sitelinks, callouts, structured snippets)
- [ ] Preview verificada em todos os placements
- [ ] Min 3 ads ativos por ad set/ad group

## 5. Landing Page
- [ ] LP carregando corretamente em mobile e desktop
- [ ] Lighthouse Performance score >80
- [ ] Core Web Vitals: LCP <2.5s, CLS <0.1
- [ ] Message match: ad headline ≈ LP headline
- [ ] CTA da LP funcionando e visivel
- [ ] Form (se aplicavel) submetendo corretamente
- [ ] Thank you page com tracking de conversao
- [ ] SSL certificado ativo (HTTPS)

## 6. Final Validation
- [ ] Naming conventions aplicadas (campaign, ad set, ad)
- [ ] Budget total aprovado e alocado corretamente
- [ ] KPIs e targets documentados
- [ ] Monitoring plan definido (quem verifica, quando)
- [ ] Stakeholders informados do launch date
- [ ] Rollback plan (o que fazer se performance for ruim nas primeiras 48h)

## Decision
- **GO:** Todos os items checked
- **NO-GO:** Qualquer item failing → resolver antes de ativar
