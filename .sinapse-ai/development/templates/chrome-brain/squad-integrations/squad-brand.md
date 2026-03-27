# Chrome Brain Integration — Squad Brand (Meridian)
> Squad Brand tem acesso ao Chrome Brain para extracao de design systems visuais, captura de identidade de concorrentes e coleta de visual assets.
## Tier: 3
## Quando Ativar
- Extracao de design system visual (paleta de cores, tipografia, spacing, shadows)
- Captura de identidade visual de concorrentes (logo, cores, tom, estilo fotografico)
- Screenshots de referencia de brand identity em contexto digital
- Coleta de visual assets para mood board
## O Que Recebe do Chrome Brain
- Paleta de cores extraida via computed styles
- Font stack completo (familias, pesos, tamanhos)
- Spacing scale e sizing tokens
- Screenshots de paginas-chave
- Logo e favicon capturados
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
