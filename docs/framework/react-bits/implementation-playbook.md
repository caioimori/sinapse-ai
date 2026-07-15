# React Bits - playbook de implementação e composição

## Sumário

1. Fluxo obrigatório
2. Seleção por intenção
3. Adaptação segura
4. Composição
5. Performance
6. Acessibilidade
7. Frameworks e SSR
8. Diagnóstico

## 1. Fluxo obrigatório

1. Traduzir o objetivo visual em função: orientar, explicar, dar feedback, criar
   atmosfera ou enfatizar hierarquia.
2. Consultar somente o catálogo da categoria relevante e formar uma shortlist de no
   máximo três componentes.
3. Escolher pelo menor custo técnico que entrega o efeito. CSS antes de Motion/GSAP;
   DOM antes de Canvas; Canvas 2D antes de WebGL, quando o resultado visual permitir.
4. Abrir a documentação e a fonte fixada. Verificar props, dependências, DOM/canvas,
   listeners, loop de animação e cleanup.
5. Verificar os pacotes declarados com `npm view` e instalar só os necessários.
6. Integrar em um boundary pequeno. Não espalhar internals do componente pela página.
7. Adaptar tokens, conteúdo, layout, interação e breakpoints ao design existente.
8. Implementar reduced motion, navegação por teclado, contraste, fallback e cleanup.
9. Medir mobile real, CPU/GPU, memória, CLS/LCP/INP e comportamento ao sair da rota.
10. Registrar origem, variante e customizações importantes junto ao componente local.

## 2. Seleção por intenção

| Intenção             | Começar por                                  | Evitar quando                               |
| -------------------- | -------------------------------------------- | ------------------------------------------- |
| Headline memorável   | BlurText, SplitText, Shuffle, RotatingText   | texto longo ou conteúdo crítico atrasado    |
| Número/prova         | CountUp, Counter                             | o valor precisa ser lido instantaneamente   |
| Entrada de seção     | FadeContent, AnimatedContent, GradualBlur    | já existem muitos reveals simultâneos       |
| Profundidade em card | SpotlightCard, TiltedCard, ReflectiveCard    | touch-only ou tabela densa                  |
| Navegação expressiva | GooeyNav, PillNav, StaggeredMenu, Dock       | fluxo crítico sem fallback semântico        |
| Galeria/portfólio    | CircularGallery, DomeGallery, Masonry, Stack | muitas imagens sem lazy loading             |
| Atmosfera leve       | CSS gradients, DotGrid, Threads              | contraste do conteúdo fica instável         |
| Hero WebGL           | Aurora, Silk, Orb, LightRays, Galaxy         | mobile fraco sem fallback estático          |
| Interação lúdica     | ClickSpark, Magnet, StickerPeel              | CTA crítico ou interface corporativa sóbria |
| Experiência física   | Ballpit, Lanyard, FallingText, Antigravity   | custo e distração não têm função narrativa  |

Consultar os quatro catálogos para todas as opções; esta tabela é apenas ponto de
partida e não substitui a seleção por objetivo, marca e orçamento de performance.

## 3. Adaptação segura

### Criar um boundary

Manter o componente importado em `components/react-bits/<nome>/` e expor um wrapper
da aplicação. O wrapper traduz tokens e conteúdo locais para as props do efeito. Isso
facilita atualizar ou substituir o upstream sem contaminar a página.

### Tokens, não valores soltos

Substituir cores, tipografia, radius, sombras, duração e easing pelos tokens do design
system. Centralizar constantes de qualidade (`particleCount`, DPR, blur, segments,
postprocessing`) em presets `low`, `medium`e`high`.

### Lifecycle

- Cancelar `requestAnimationFrame` e timers no cleanup.
- Remover listeners, observers e media queries registrados.
- Destruir renderer, geometries, materials, textures e contexts WebGL quando a rota
  desmontar.
- Usar `gsap.context()`/cleanup e `useGSAP` quando o componente depender de GSAP.
- Pausar loops quando a aba estiver oculta ou o canvas estiver fora da viewport.

### Conteúdo e layout

Nunca deixar a demo definir a arquitetura da página. O conteúdo real determina
height, wrapping, overflow, foco e leitura. Testar frases curtas/longas, caracteres
acentuados, zoom 200%, fontes ainda não carregadas e container estreito.

## 4. Composição

Usar uma hierarquia de atenção: um efeito dominante por viewport, um ou dois efeitos
de suporte e microinterações discretas. Não somar três loops WebGL/Canvas apenas por
serem visualmente compatíveis.

### Combinações fortes

- Hero: background WebGL + headline de texto + CTA com microinteração.
- Seção de prova: CountUp + FadeContent, sem background concorrente.
- Portfólio: gallery interativa + transição de seção simples.
- Navegação: menu expressivo + conteúdo estável; não animar simultaneamente todos os
  cards abaixo.

### Regras de conflito

- Um único dono do scroll suave; não empilhar Lenis, scroll container custom e hooks
  que assumem `window` sem coordená-los.
- Um único cursor custom ativo; desativar em touch/coarse pointer.
- Compartilhar renderer/canvas somente quando a arquitetura foi desenhada para isso;
  componentes independentes não devem assumir estado WebGL global.
- Namespaces de CSS e `z-index` explícitos evitam colisões ao combinar demos.

## 5. Performance

### Orçamento inicial

- Meta de 60 fps em dispositivos alvo; 30 fps estáveis é fallback aceitável para
  efeitos ambientais pesados, nunca para interação direta.
- Limitar DPR: `Math.min(devicePixelRatio, 1.5)` no mobile e no máximo 2 em desktop.
- Reduzir partículas, segmentos, blur, samples e postprocessing antes de reduzir a
  responsividade da interface.
- Lazy-load de WebGL/physics e das dependências que não participam do conteúdo acima
  da dobra.
- Evitar animar layout; preferir transform e opacity no DOM.

### Qualidade adaptativa

Usar `prefers-reduced-motion`, `pointer: coarse`, largura, memória/concurrency quando
disponíveis e uma medição de frame time para escolher preset. Se WebGL falhar, renderizar
gradient/imagem estática preservando contraste e layout.

### Testes

Medir cold load, interação, scroll longo, navegação ida/volta e cinco minutos de aba
aberta. Procurar crescimento de memória, múltiplos RAFs, listeners duplicados, canvas
órfão e bundles repetindo Three/GSAP/Motion.

## 6. Acessibilidade

- Respeitar `prefers-reduced-motion: reduce` e apresentar estado final imediatamente.
- Texto fragmentado precisa manter uma representação contínua para leitores de tela;
  spans visuais podem receber `aria-hidden` e o container um rótulo completo.
- Backgrounds/canvas decorativos devem ser ignorados por tecnologia assistiva e não
  capturar pointer/foco.
- Componentes navegáveis mantêm HTML semântico, ordem de tab, foco visível, Escape,
  setas e Enter/Space conforme o padrão WAI-ARIA aplicável.
- Não depender apenas de hover, movimento ou cor para comunicar estado.
- Evitar flashes intensos e movimentos vestibulares; fornecer controle para pausar
  loops persistentes quando forem conteúdo, não decoração.

## 7. Frameworks e SSR

React Bits usa React moderno, e vários componentes acessam DOM, Canvas, WebGL ou APIs
de browser. Em Next.js/App Router, colocar esses componentes atrás de um client
boundary e, quando necessário, carregar dinamicamente sem SSR. Não mover toda a
página para client component por causa de um único efeito.

Em Vite/SPA, ainda executar cleanup na troca de rota. Em Astro, hidratar apenas a ilha
interativa (`client:visible`/`client:idle` quando apropriado) e preservar conteúdo
semântico no HTML estático.

## 8. Diagnóstico

| Sintoma            | Causas prováveis                               | Ação                                           |
| ------------------ | ---------------------------------------------- | ---------------------------------------------- |
| Tela preta WebGL   | shader compile, container 0px, context perdido | validar dimensões, console e fallback          |
| Animação duplica   | Strict Mode/cleanup incompleto                 | tornar efeito idempotente e limpar lifecycle   |
| Mobile trava       | DPR/partículas/post FX altos                   | preset low, lazy-load e pausa offscreen        |
| Scroll quebrado    | dois owners do scroll/container errado         | escolher um owner e passar ref correto         |
| Texto ilegível     | fragmentação/overflow/font load                | preservar texto, ajustar wrap e aguardar fonte |
| Hydration mismatch | browser API durante render                     | client boundary/dynamic import                 |
| Clique bloqueado   | canvas/z-index/pointer-events                  | canvas decorativo com `pointer-events: none`   |
| Bundle explode     | múltiplos motores pesados                      | selecionar uma família e deduplicar imports    |
