# Chrome Brain Integration — Squad Commercial (Pipeline)
> Squad Commercial tem acesso ao Chrome Brain para analise de formularios, pricing pages e funis de conversao de concorrentes.
## Tier: 3
## Quando Ativar
- Analise de formularios de concorrentes (campos, steps, UX, microcopy)
- Captura de paginas de pricing (planos, precos, features, comparativos)
- Mapeamento de funil de conversao da landing ate o contato/compra
- Benchmark de UX comercial (checkout, onboarding, trial signup)
## O Que Recebe do Chrome Brain
- Formularios analisados com campos, tipos, validacoes
- Pricing pages capturadas com dados estruturados
- Funil mapeado: paginas, CTAs, steps, redirects
- Trust signals identificados
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
`~/.sinapse/sinapse/knowledge-base/chrome-brain.md` → secao Learnings Log

## Referencia Completa

`~/.sinapse/sinapse/knowledge-base/chrome-brain.md`
