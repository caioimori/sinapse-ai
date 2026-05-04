# Chrome Brain Integration — Squad Copy (Quill Prime)
> Squad Copy tem acesso ao Chrome Brain para extracao de copy de landing pages, analise de headlines/CTAs/bullets, mapeamento de sales pages e teste de copy via injecao de scripts.
## Tier: 2
## Quando Ativar
- Extracao de copy completa de landing page ou sales page de concorrente
- Analise de headlines, subheadlines, CTAs e bullet points de paginas de alta conversao
- Mapeamento de estrutura de sales page (hook, problema, agitacao, solucao, prova, oferta, urgencia, CTA)
- Teste de variantes de copy via evaluate_script (injectar headline alternativa)
- Benchmark de copy patterns em multiplas paginas do mesmo nicho
## O Que Recebe do Chrome Brain
- Copy completa extraida com hierarquia preservada
- Headlines e subheadlines isolados para analise de patterns
- CTAs capturados com contexto (posicao, cor, tamanho, texto)
- Estrutura de sales page mapeada por funcao persuasiva
## O Que Envia pro Chrome Brain
- URLs de sales pages para extracao batch
- Scripts de injecao de copy alternativa para teste visual A/B
- Seletores para captura de secoes especificas

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
