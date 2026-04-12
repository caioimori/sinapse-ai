---
task: audit-core-web-vitals
responsavel: "@performance-engineer"
responsavel_type: Agent
atomic_layer: Task
elicit: false
---

# Task: Audit Core Web Vitals

## Metadata
- **Agent:** performance-engineer (Lighthouse)
- **Squad:** squad-paidmedia
- **Complexity:** MEDIUM

## Objetivo
Auditar Core Web Vitals das landing pages de campanhas e recomendar melhorias.

## Steps

1. **Medir CWV para cada LP**
   - LCP (Largest Contentful Paint): Good <2.5s, Needs Improvement 2.5-4s, Poor >4s
   - INP (Interaction to Next Paint): Good <200ms, NI 200-500ms, Poor >500ms
   - CLS (Cumulative Layout Shift): Good <0.1, NI 0.1-0.25, Poor >0.25
   - Medir mobile E desktop separadamente

2. **Identificar causas de LCP lento**
   - Render-blocking resources (CSS, JS)
   - Slow server response (TTFB >800ms)
   - Imagem hero sem lazy load / formato nao otimizado
   - Client-side rendering atrasando paint
   - Recomendacoes: preload LCP image, otimizar server, critical CSS inline

3. **Identificar causas de INP alto**
   - Long tasks no main thread (>50ms)
   - Heavy JavaScript execution
   - Third-party scripts bloqueando interacao
   - Recomendacoes: code splitting, defer non-essential JS, Web Workers

4. **Identificar causas de CLS alto**
   - Images/iframes sem dimensoes
   - Fonts causando FOIT/FOUT
   - Ads/embeds injetados dinamicamente
   - Recomendacoes: width/height em images, font-display: swap, reservar espaco

5. **Impacto em ads**
   - CWV afeta Quality Score no Google Ads (LP experience)
   - LCP >4s = ~7% drop em conversao por segundo adicional
   - CLS > 0.1 = usuarios perdem confianca na pagina
   - Mobile CWV geralmente pior que desktop = impacto em trafego pago (60%+ mobile)

## Output
CWV audit report com metricas, causas e recomendacoes por LP.

## Quality Gates
- [ ] Todas as LPs de campanhas ativas medidas
- [ ] Mobile E desktop medidos
- [ ] Causas identificadas para cada issue
- [ ] Impacto em ads/conversion quantificado

## Quando Usar
- Pre-launch de campanha
- Quando Quality Score de LP experience e baixo
- Auditoria trimestral
