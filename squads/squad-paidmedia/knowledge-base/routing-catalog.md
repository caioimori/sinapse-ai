# Routing Catalog — Paid Media Squad

Maps keywords and domains to specialist agents for intelligent routing within the Paid Media squad.

---

## Domain Routing Matrix

| Domain | Keywords | Primary Agent | Secondary Agent |
|--------|----------|--------------|-----------------|
| **Meta/Facebook Ads** | meta ads, facebook ads, instagram ads, feed ads, reel ads, meta pixel, CAPI, advantage+, CBO, ABO, ASC, ODAX | meta-ads-specialist (Reach) | campaign-analyst (Cadence) |
| **Google Ads — Search** | google search ads, RSA, keywords, match types, negative keywords, quality score, smart bidding, tCPA, tROAS | google-ads-specialist (Query) | campaign-analyst (Cadence) |
| **Google Ads — Shopping** | google shopping, performance max, pmax, merchant center, product feed, ROAS | google-ads-specialist (Query) | campaign-analyst (Cadence) |
| **Google Ads — YouTube** | youtube ads, skippable, bumper, TrueView, video action campaign, YouTube shorts ads | google-ads-specialist (Query) | creative-strategist (Canvas) |
| **Google Ads — Display** | GDN, display ads, responsive display, remarketing google, affinity, in-market | google-ads-specialist (Query) | campaign-analyst (Cadence) |
| **TikTok Ads** | tiktok ads, spark ads, in-feed ads, topview, tiktok creative center, FYP ads, tiktok shop ads | meta-ads-specialist (Reach) | creative-strategist (Canvas) |
| **LinkedIn Ads** | linkedin ads, sponsored content, inmail, lead gen forms, ABM linkedin, B2B linkedin, insight tag | meta-ads-specialist (Reach) | campaign-analyst (Cadence) |
| **Programmatic & DSPs** | programmatic, DSP, DV360, the trade desk, RTB, header bidding, ad exchange, SSP, viewability, brand safety | performance-engineer (Lighthouse) | campaign-analyst (Cadence) |
| **Campaign strategy** | campaign strategy, media plan, channel mix, budget allocation, funnel, cross-channel | paidmedia-orqx (Apex) | campaign-analyst (Cadence) |
| **Creative strategy** | ad creative, creative testing, video ads, static vs video, hooks, angles, UGC, AIDA, PAS, BAB, hook rate, 3 second rule | creative-strategist (Canvas) | meta-ads-specialist (Reach) |
| **CRO & landing pages** | landing page, CRO, conversion rate, A/B test, form optimization, page speed, core web vitals | cro-specialist (Uplift) | performance-engineer (Lighthouse) |
| **Performance & tracking** | tracking, pixel, CAPI, UTM, attribution, analytics, tag manager, GA4, EMQ, event match quality | performance-engineer (Lighthouse) | campaign-analyst (Cadence) |
| **Attribution & MMM** | attribution, MMM, media mix modeling, incrementality, lift study, Robyn, Meridian, MER, blended ROAS | campaign-analyst (Cadence) | paidmedia-orqx (Apex) |
| **Campaign analysis** | report, ROAS, CPA, CPL, performance analysis, metrics, dashboard, MER, blended CPA, LTV:CAC | campaign-analyst (Cadence) | paidmedia-orqx (Apex) |
| **Scaling** | scaling, budget increase, horizontal scaling, vertical scaling, CBO, diminishing returns, marginal CPA | meta-ads-specialist (Reach) | google-ads-specialist (Query) |
| **Audience targeting** | audience, lookalike, interest targeting, retargeting, custom audience, CDP, first-party data, Value Rules | meta-ads-specialist (Reach) | campaign-analyst (Cadence) |
| **Bid strategy** | bidding, cost cap, bid cap, tCPA, tROAS, smart bidding, manual CPC, value optimization | google-ads-specialist (Query) | meta-ads-specialist (Reach) |
| **Social algorithms** | instagram algorithm, tiktok algorithm, youtube algorithm, linkedin algorithm, reels algorithm, FYP, batch testing | creative-strategist (Canvas) | campaign-analyst (Cadence) |
| **Social commerce** | live commerce, tiktok shop, instagram shopping, social commerce, shoppable posts | meta-ads-specialist (Reach) | creative-strategist (Canvas) |
| **Brazil market** | mercado brasileiro, PIX, WhatsApp ads, click-to-WhatsApp, sazonalidade brasil, CONAR, benchmarks brasil | paidmedia-orqx (Apex) | campaign-analyst (Cadence) |
| **AI & automation** | AI ads, DCO, dynamic creative, advantage+ creative, GEM meta, AI max google, automation | creative-strategist (Canvas) | performance-engineer (Lighthouse) |
| **Competitive intel** | competitor ads, ad library, ad spy, facebook ad library, google transparency center | campaign-analyst (Cadence) | meta-ads-specialist (Reach) |

---

## Agent Profiles

| Agent | ID | Especialidade |
|-------|-----|--------------|
| **Apex** | paidmedia-orqx | Orquestração, cross-channel strategy, budget allocation |
| **Signal** | meta-ads-specialist | Meta Ads, Instagram, TikTok, LinkedIn |
| **Query** | google-ads-specialist | Google Search, Display, YouTube, Shopping, PMax |
| **Canvas** | creative-strategist | Creative strategy, UGC, hooks, social algorithms |
| **Convert** | cro-specialist | Landing pages, CRO, form optimization |
| **Lighthouse** | performance-engineer | Tracking, Pixel, CAPI, GA4, programmatic |
| **Pulse** | campaign-analyst | Analytics, reporting, attribution, benchmarks |

---

## Routing Decision Rules

1. **Route to Primary Agent** por default para cada domain
2. **Use Secondary Agent** quando:
   - O primary está sobrecarregado
   - Request abrange múltiplos domains
3. **Request multi-domain:** O orchestrator (paidmedia-orqx) coordena handoffs
4. **Requests novos canais** (TikTok, LinkedIn): Route para Reach (meta-ads-specialist)
5. **Requests programmatic/DSP:** Route para Lighthouse (performance-engineer)

---

## Quick Decision Tree

```
Paid traffic request?
├── Meta/Instagram/Facebook → Signal
├── TikTok/LinkedIn ads → Signal
├── Google Search/Shopping/PMax → Query
├── YouTube ads → Query (strategy) + Canvas (creative)
├── Creative/UGC/Hooks → Canvas
├── Tracking/CAPI/Pixel → Lighthouse
├── Landing page/CRO → Convert
├── Attribution/MMM/Analytics → Pulse
├── Budget allocation/cross-channel → Apex
├── Brazilian market/PIX/WhatsApp → Apex (context) + Signal/Query (execution)
└── Programmatic/DSP/RTB → Lighthouse
```

---

## Knowledge Base Index

| KB File | Conteúdo | Agents Primários |
|---------|---------|-----------------|
| `meta-ads-campaign-architecture.md` | Estrutura de campanhas Meta, CBO/ABO, ODAX, Advantage+, Andromeda | Signal |
| `meta-ads-optimization-playbook.md` | Marginal CPA, creative fatigue, CAPI implementation, cadência de otimização | Signal, Pulse |
| `meta-ads-scaling-framework.md` | 4 phases de scaling, risk triggers, creative velocity | Signal, Apex |
| `google-ads-account-architecture.md` | Estruturas de conta, keyword strategy, QS, Smart Bidding, PMax, AI Max | Query |
| `google-ads-optimization-playbook.md` | Search term hygiene, negative keywords, budget pacing, conversion tracking | Query |
| `tiktok-linkedin-ads-playbook.md` | TikTok Ads (Spark, TopView, Creative Center), LinkedIn Ads (ABM, Lead Gen) | Signal |
| `programmatic-attribution-deep.md` | RTB, DSPs, DV360, The Trade Desk, MMM (Robyn/Meridian), Incrementality, Privacy Sandbox | Lighthouse, Pulse |
| `creative-strategy-deep.md` | 3s rule, UGC, AIDA/PAS/BAB, Schwartz levels, ad fatigue, ODAX, AI ads | Canvas |
| `audiences-segmentation-deep.md` | Cold/Warm/Hot audiences, CDP, first-party data, LAL strategy, predictive audiences | Signal, Query |
| `creative-testing-framework.md` | Hypothesis formation, sample size, hook formulas, success criteria | Canvas |
| `cro-conversion-optimization.md` | Form friction, progressive profiling, A/B testing, activation | Convert |
| `analytics-reporting-frameworks.md` | Attribution models, funnel analysis, anomaly detection, period comparison | Pulse |
| `paid-media-metrics-reference.md` | Todas as métricas, fórmulas, benchmarks por vertical | Pulse, todos |
| `social-algorithms-playbook.md` | Instagram/TikTok/YouTube/LinkedIn/X algorithms, Two-Tower, batch testing | Canvas |
| `brazil-market-context.md` | CPM benchmarks BR, PIX, WhatsApp CTW, sazonalidade, CONAR, live commerce | Apex, Signal |
| `competitive-ad-intelligence.md` | Ad Library, Transparency Center, multi-platform audit | Pulse |
| `traffic-masters-frameworks.md` | Depesh Mandalia, Molly Pittman, Kasim Aslam, Hormozi, Schwartz — frameworks elite | todos |
| `video-ad-production-guide.md` | Produção de vídeo para ads | Canvas |
| `local-seo-gmb-playbook.md` | Local SEO, Google Meu Negócio | Query |
