# Chrome Brain Integration — Squad Product (Orbit)

> Squad Product tem acesso ao Chrome Brain para analise de produtos concorrentes, mapeamento de user journeys, captura de onboarding flows e benchmark de funcionalidades.

## Tier: 3

## Quando Ativar

- Analise de produto concorrente (funcionalidades, pricing, UX, fluxos)
- Captura de onboarding flows e product tours de referencia
- Mapeamento de user journey em aplicacoes web
- Benchmark de funcionalidades e features entre competidores

## O Que Recebe do Chrome Brain

- Screenshots de funcionalidades de produtos concorrentes
- Onboarding flows capturados passo a passo
- User journey mapeado com screenshots e navegacao
- Pricing pages e feature comparison tables extraidas

## O Que Envia pro Chrome Brain

N/A para esta squad

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
`~/.sinapse/sinapse/knowledge-base/chrome-brain.md` secao Learnings Log

## Referencia Completa

`~/.sinapse/sinapse/knowledge-base/chrome-brain.md`
