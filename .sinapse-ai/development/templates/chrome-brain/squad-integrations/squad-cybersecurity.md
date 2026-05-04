# Chrome Brain Integration — Squad Cybersecurity (Fortress)
> Squad Cybersecurity tem acesso ao Chrome Brain para inspecao de HTTP headers, console security errors, network requests suspeitas e cookies/storage.
## Tier: 3
## Quando Ativar
- Inspecao de HTTP headers de seguranca (CSP, HSTS, X-Frame-Options)
- Captura de console security errors e mixed content warnings
- Analise de network requests para identificar chamadas inseguras
- Auditoria de cookies (Secure, HttpOnly, SameSite) e storage
## O Que Recebe do Chrome Brain
- HTTP response headers completos
- Console messages de seguranca
- Network requests com detalhes de protocol e headers
- Cookies listados com flags e validade
- Lighthouse best practices score
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
