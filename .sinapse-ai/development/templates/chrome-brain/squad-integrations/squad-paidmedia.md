# Chrome Brain Integration — Squad Paid Media (Apex)
> Squad Paid Media tem acesso ao Chrome Brain para captura de landing pages de concorrentes, extracao de criativos publicitarios, analise de lead forms e auditoria Lighthouse de paginas de destino.
## Tier: 2
## Quando Ativar
- Analise de landing page de concorrente (estrutura, copy, CTA, formulario)
- Extracao de criativos publicitarios visiveis em bibliotecas de anuncios (Meta Ad Library, Google Ads Transparency)
- Auditoria de lead forms de concorrentes (campos, UX, numero de steps, fricao)
- Lighthouse audit de landing pages proprias ou de clientes (performance impacta Quality Score)
- Captura de SERP ads para analise de headlines, descriptions e extensoes
## O Que Recebe do Chrome Brain
- Screenshots de landing pages de concorrentes em multiplos breakpoints
- Estrutura de landing page extraida (hero, beneficios, prova social, CTA, formulario)
- Criativos de anuncios capturados da Meta Ad Library e Google Ads Transparency Center
- Lead form analysis: campos, tipos de input, validacoes, numero de steps
- Lighthouse scores de landing pages (performance, mobile usability)
- SERP screenshots com anuncios pagos destacados
## O Que Envia pro Chrome Brain
- URLs de landing pages para captura batch
- Filtros para Meta Ad Library (anunciante, pais, plataforma)
- Landing pages proprias para auditoria Lighthouse
- Requests de captura mobile-first (375px) para analise de UX mobile

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
