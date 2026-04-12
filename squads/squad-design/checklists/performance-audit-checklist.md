# Performance Audit Checklist

## Uso
Checklist para auditoria de web performance. Aplicar em TODA pagina antes de publicacao. Core Web Vitals sao gate BLOQUEANTE.

## Core Web Vitals (BLOQUEANTE)
- [ ] **LCP < 2.5s** — Largest Contentful Paint
- [ ] **INP < 200ms** — Interaction to Next Paint
- [ ] **CLS < 0.1** — Cumulative Layout Shift
- [ ] Lighthouse Performance Score >= 90
- [ ] TTFB < 800ms (Time to First Byte)
- [ ] TBT < 200ms (Total Blocking Time)

## LCP Optimization
- [ ] LCP element identificado (geralmente hero image ou headline)
- [ ] LCP image com fetchpriority="high"
- [ ] LCP image com preload (se necessario)
- [ ] Sem render-blocking CSS antes do LCP
- [ ] Sem render-blocking JS antes do LCP
- [ ] Server response time < 800ms
- [ ] LCP image otimizada (formato, tamanho, compression)
- [ ] CDN configurado para assets criticos

## INP Optimization
- [ ] Sem long tasks (> 50ms) no main thread durante interacao
- [ ] Event handlers otimizados (debounce, throttle)
- [ ] Heavy computation em Web Workers (se necessario)
- [ ] Sem layout thrashing (read-write-read batching)
- [ ] Third-party scripts nao bloqueiam interacao
- [ ] React: useTransition para atualizacoes nao-urgentes

## CLS Optimization
- [ ] Imagens com width e height explicitos (ou aspect-ratio)
- [ ] Fonts com font-display: swap + size-adjust
- [ ] Nenhum conteudo inserido acima de conteudo existente (exceto em resposta a acao do usuario)
- [ ] Ads/embeds com espaco reservado
- [ ] Skeleton screens com dimensoes corretas
- [ ] Dynamic content nao causa layout shift

## JavaScript
- [ ] Bundle total < 300KB (parsed)
- [ ] Critical path JS < 100KB
- [ ] Code splitting por rota implementado
- [ ] Tree-shaking funcional (sem dead code)
- [ ] Sem duplicate dependencies
- [ ] Dynamic imports para componentes pesados
- [ ] Compression: Brotli (preferido) ou Gzip
- [ ] Source maps apenas em development
- [ ] Sem eval() ou inline scripts pesados

## CSS
- [ ] CSS total < 50KB
- [ ] Critical CSS inline no head
- [ ] Restante do CSS carregado async
- [ ] Sem CSS nao utilizado (PurgeCSS ou similar)
- [ ] Sem @import (usar link tags)
- [ ] CSS containment usado onde apropriado
- [ ] Sem !important excessivo (indica CSS desorganizado)

## Imagens
- [ ] Formato otimo: AVIF > WebP > JPEG (photos), SVG > PNG (graphics)
- [ ] srcset + sizes para imagens responsivas
- [ ] loading="lazy" para imagens below the fold
- [ ] fetchpriority="high" para hero image
- [ ] Dimensoes (width/height) declaradas
- [ ] Art direction com picture element (se necessario)
- [ ] Image CDN configurado (Cloudinary, imgix, ou Vercel Image)
- [ ] Placeholder (blur, LQIP, ou solid color)

## Fonts
- [ ] font-display: swap (body) ou optional (decorativa)
- [ ] Fonts self-hosted ou preconnect ao CDN
- [ ] Variable fonts (se multiplos pesos necessarios)
- [ ] Subset para caracteres usados (latin, latin-ext)
- [ ] Max 2-3 font families
- [ ] Font files < 100KB total
- [ ] Fallback font com size-adjust para minimizar CLS

## Resource Hints
- [ ] preconnect para origens criticas (CDN, API, fonts)
- [ ] preload para recursos criticos acima do fold
- [ ] prefetch para proxima pagina provavel
- [ ] dns-prefetch para origens terciarias
- [ ] fetchpriority="high" em recursos criticos
- [ ] fetchpriority="low" em recursos nao-criticos

## Caching
- [ ] Cache-Control com max-age adequado
- [ ] Immutable para assets com hash no nome
- [ ] Stale-while-revalidate para HTML
- [ ] ETags configurados
- [ ] Service Worker cache (se PWA)

## Third-Party Scripts
- [ ] Inventario de scripts terceiros documentado
- [ ] Scripts nao-criticos com defer ou async
- [ ] Facade pattern para embeds pesados (YouTube, maps, chat)
- [ ] Scripts de analytics nao bloqueiam render
- [ ] Content Security Policy (CSP) configurado
- [ ] Impacto por script medido (TBT contribution)

## Server & Network
- [ ] HTTP/2 ou HTTP/3 ativo
- [ ] Compression (Brotli preferido)
- [ ] CDN para assets estaticos
- [ ] Edge rendering (se aplicavel)
- [ ] Redirects minimizados (cada redirect = latencia)

## CI/CD Integration
- [ ] Lighthouse CI configurado
- [ ] Budget assertions (build falha se exceder)
- [ ] Bundle size tracking (por commit)
- [ ] Performance regression alerts
- [ ] Automated testing em cada PR

## Monitoring Continuo
- [ ] RUM (Real User Monitoring) ativo
- [ ] Synthetic monitoring agendado
- [ ] Dashboard de Core Web Vitals
- [ ] Alertas para regressao configurados

## Verdicts
| Verdict | Criterio |
|---------|----------|
| **CERTIFIED** | CWV pass + Lighthouse >= 90 + budgets ok |
| **EXCEEDS BUDGET** | CWV pass mas budgets estourados |
| **FAIL** | Qualquer CWV fora do target |
