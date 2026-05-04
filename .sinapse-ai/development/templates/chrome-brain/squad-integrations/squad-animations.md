# Chrome Brain Integration — Squad Animations (Kinetic)
> Squad Animations tem acesso ao Chrome Brain para captura de DOM, extracao de shaders, clonagem de animacoes e inspecao de scene graphs Three.js em sites de referencia.
## Tier: 1
## Quando Ativar
- Usuario pede para clonar ou replicar uma animacao de um site externo
- Precisa extrair shaders GLSL, vertex/fragment, de um canvas WebGL em producao
- Analise de scene graph Three.js (geometrias, materiais, luzes, cameras) de referencia ao vivo
- Identificacao de assets (modelos 3D, texturas, SVGs, fontes) usados em animacoes de terceiros
- Extracao de CSS @keyframes ou timelines GSAP/Framer Motion de uma pagina
- Preview e validacao de animacao recem-criada diretamente no browser
## O Que Recebe do Chrome Brain
- DOM snapshot completo (HTML + inline styles + computed styles)
- Screenshots de referencia (estados de animacao: inicio, meio, fim)
- Codigo fonte de shaders GLSL extraido via evaluate_script no contexto WebGL
- Scene graph Three.js serializado (renderer.info, scene.children recursivo)
- CSS @keyframes parseados e timelines GSAP/ScrollTrigger extraidas
- Lista de assets externos (URLs de .glb, .obj, .gltf, texturas, spritesheets)
- Performance traces de animacoes (FPS, paint timing, composite layers)
## O Que Envia pro Chrome Brain
- Animacoes recem-criadas para preview em nova aba (HTML single-file)
- Requests de captura em pontos especificos de scroll ou tempo
- Scripts de extracao customizados para injecao via evaluate_script
- Resultados de validacao visual (comparacao original vs clone)
- Novos patterns de extracao descobertos durante clonagem

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
