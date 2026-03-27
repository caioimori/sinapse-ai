# Chrome Brain Integration — Squad Storytelling (Arc)
> Squad Storytelling tem acesso ao Chrome Brain para captura de apresentacoes web, analise de estrutura narrativa de landing pages e storytelling patterns.
## Tier: 3
## Quando Ativar
- Captura de apresentacoes HTML publicadas na web
- Analise de estrutura narrativa de landing pages (arco emocional, pacing)
- Extracao de storytelling patterns de paginas de alta conversao
- Captura de narrative flow de onboarding ou product tours
## O Que Recebe do Chrome Brain
- HTML de apresentacoes web (slides + transicoes)
- Estrutura narrativa mapeada por funcao na historia
- Sequencia de CTAs no arco narrativo
- Screenshots de momentos-chave
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
