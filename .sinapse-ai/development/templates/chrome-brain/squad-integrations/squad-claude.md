# Chrome Brain Integration — Squad Claude (Claude Code Mastery)
> Squad Claude tem acesso ao Chrome Brain para documentacao de novos patterns de automacao, solucoes NSN, discovery de MCP tools, gestao de configuracao e otimizacao de prompts para tarefas de browser.
## Tier: 1
## Quando Ativar
- Descoberta de novo pattern de automacao que precisa ser documentado e testado
- Solucao NSN encontrada que precisa ser validada em browser real antes de registrar
- Discovery de novos MCP tools ou capabilities via browser (docs, changelogs, APIs)
- Configuracao de MCP servers ou Chrome DevTools que requer teste interativo
- Otimizacao de prompts para tarefas de browser (testar variantes, medir resultados)
- Debug de integracao Chrome Brain com outros squads (reproduzir problema no browser)
## O Que Recebe do Chrome Brain
- Resultados de testes de novos patterns de automacao (funciona/nao funciona)
- Screenshots de documentacao oficial (Claude, MCP, Chrome DevTools Protocol)
- Changelogs e release notes extraidos de sites de ferramentas
- Configuracoes testadas e validadas (JSON, YAML, env vars)
- Metricas de performance de diferentes abordagens de automacao
- Error logs e stack traces capturados durante debug de integracoes
## O Que Envia pro Chrome Brain
- Novos patterns validados para registro no Learnings Log
- Scripts de teste para validacao de configuracoes MCP
- Documentacao de solucoes NSN para propagacao cross-squad
- Prompts otimizados para tarefas de browser recorrentes
- Regras de auto-activation atualizadas baseadas em novos patterns

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
