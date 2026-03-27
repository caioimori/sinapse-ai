# Chrome Brain Integration — Squad Cloning (Helix)
> Squad Cloning tem acesso ao Chrome Brain para captura completa de paginas (DOM+CSS+JS), extracao de transcripts, mapeamento de navegacao e automacao de formularios para clonagem cognitiva.
## Tier: 1
## Quando Ativar
- Pipeline de clonagem requer captura completa de um site (HTML + CSS + JS + assets)
- Extracao de transcripts de video embedados (YouTube, Vimeo, Loom)
- Mapeamento de estrutura de navegacao e information architecture de um site alvo
- Extracao de conteudo textual estruturado (headings, paragrafos, listas, quotes)
- Automacao de formularios multi-step para cognitive profiling (signup, onboarding)
- Captura de padroes de interacao (hover states, modals, dropdowns, accordions)
## O Que Recebe do Chrome Brain
- Full page HTML (document.documentElement.outerHTML) com inline styles
- CSS completo (stylesheets parseados, computed styles, custom properties)
- JavaScript comportamental (event listeners, state management, routing logic)
- Transcripts de video extraidos via API ou captions
- Sitemap/navegacao mapeada (links internos, hierarquia de paginas, breadcrumbs)
- Cognitive profile data: formularios preenchidos, respostas capturadas, fluxos percorridos
- Assets identificados e catalogados (fontes, imagens, icones, modelos 3D)
## O Que Envia pro Chrome Brain
- URLs alvo para captura sequencial (batch cloning)
- Scripts de extracao customizados para contextos especificos
- Formularios para preenchimento automatizado (cognitive profiling)
- Clones recem-criados para validacao visual side-by-side
- Mapa de navegacao para crawling orientado

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
