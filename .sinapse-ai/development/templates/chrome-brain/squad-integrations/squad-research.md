# Chrome Brain Integration — Squad Research (Prism)
> Squad Research tem acesso ao Chrome Brain para coleta de dados de sites concorrentes, precos publicos, portfolios e case studies.
## Tier: 3
## Quando Ativar
- Coleta de dados publicos de concorrentes (servicos, precos, equipe, localizacoes)
- Captura de portfolios e case studies de empresas de referencia
- Extracao de informacoes de mercado de fontes publicas
- Mapeamento de presenca digital de concorrentes
## O Que Recebe do Chrome Brain
- Dados estruturados de sites concorrentes
- Portfolios e case studies extraidos com texto e screenshots
- Rankings e listas de diretories do setor
- Reviews e depoimentos publicos
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
