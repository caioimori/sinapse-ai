# Chrome Brain Integration — Squad Content (Inkwell)
> Squad Content tem acesso ao Chrome Brain para extracao de conteudo textual, analise de estrutura editorial de concorrentes, captura de meta tags, headings e schema markup.
## Tier: 2
## Quando Ativar
- Extracao de conteudo textual completo de artigo ou pagina de concorrente
- Analise de estrutura editorial: hierarquia de headings, tamanho de secoes, densidade de keywords
- Captura de meta tags (title, description, OG tags, Twitter cards) para benchmark
- Inspecao de schema markup (JSON-LD, microdata) para rich snippets
- Mapeamento de content hub ou topic cluster de concorrente
## O Que Recebe do Chrome Brain
- Texto completo extraido com estrutura preservada (headings, paragrafos, listas)
- Meta tags parseados: title, description, canonical, OG, Twitter Card
- Schema markup extraido e validado (JSON-LD completo)
- Hierarquia de headings (H1-H6) com contagem e distribuicao
- Links internos mapeados (anchor text, destino, contexto)
## O Que Envia pro Chrome Brain
- URLs de artigos/paginas para extracao batch
- Scripts de extracao customizados para formatos especificos
- Seletores CSS para conteudo principal

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
