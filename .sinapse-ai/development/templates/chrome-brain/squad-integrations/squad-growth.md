# Chrome Brain Integration — Squad Growth (Catalyst)
> Squad Growth tem acesso ao Chrome Brain para medicao de Core Web Vitals, analise de network waterfall, captura de console errors, screenshots de SERP e performance traces.
## Tier: 2
## Quando Ativar
- Medicao de Core Web Vitals (LCP, CLS, INP, FCP, TTFB) de pagina em producao
- Analise de network waterfall para identificar bottlenecks de carregamento
- Captura de console errors e warnings em ambiente de producao
- Screenshots de SERP para analise de posicionamento organico e featured snippets
- Performance trace completo para diagnostico de jank, layout shifts ou long tasks
## O Que Recebe do Chrome Brain
- Core Web Vitals medidos em tempo real via Lighthouse e Performance API
- Network waterfall completo (requests, timings, tamanhos, cache hits/misses)
- Console messages filtrados por nivel (errors, warnings, info)
- SERP screenshots com posicoes organicas e paid destacadas
- Performance traces com flame chart (main thread, compositing, painting)
## O Que Envia pro Chrome Brain
- URLs para auditoria de performance em serie
- Configuracoes de throttling (3G, 4G, desktop) para testes
- Scripts de medicao customizados via evaluate_script

## Tools Disponiveis

1. **Chrome DevTools MCP** (29 tools) — acoes rapidas, screenshots, audit
2. **dev-browser** — scraping complexo, batch operations
3. **claude-in-chrome** — fallback visual

## Session Management

- Max 15 screenshots por sessao
- Salvar outputs em arquivo antes de acumular
- Rotacionar sessao a cada ~12 screenshots

## NSN Mode

Ativo. Se uma acao de browser falhar, tentar alternativas automaticamente.
Buscar solucao na internet. Configurar, testar, repetir. Max 5 ciclos.

## Auto-Learning

Ao descobrir novo pattern ou resolver barreira via NSN, atualizar:
`~/.sinapse/sinapse/knowledge-base/chrome-brain.md` → secao Learnings Log

## Referencia Completa

`~/.sinapse/sinapse/knowledge-base/chrome-brain.md`
