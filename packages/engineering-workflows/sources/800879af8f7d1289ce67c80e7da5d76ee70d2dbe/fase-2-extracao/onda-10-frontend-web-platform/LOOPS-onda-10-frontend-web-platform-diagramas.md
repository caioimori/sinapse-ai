---
titulo: "LOOPS Onda 10 — Frontend & Web Platform (diagramas e passo a passo)"
tipo: loops-diagramas
onda: 10
created: 2026-06-22
total_workflows: 15
---

# LOOPS Onda 10 — Frontend & Web Platform

Os loops operacionais da camada de **frontend e web platform** — destilados dos domínios 38-42 em diagramas de fluxo prontos pra virar comportamento de agent. Da escolha da estratégia de rendering ao pipeline do browser, da otimização de LCP/INP à auditoria de acessibilidade, do layout fluido sem overflow à tipografia com clamp.

## Índice dos loops

- **W1-W3** — Frontend Architecture & Rendering (estratégia de rendering, gestão de estado, waterfall de fetch)
- **W4-W6** — Web Platform & Browser Internals (pipeline de rendering, event loop, layout thrashing)
- **W7-W9** — Web Performance & Core Web Vitals (otimizar LCP, reduzir INP, budget no CI)
- **W10-W12** — Accessibility & Inclusive Design (auditoria WCAG, decisão de ARIA, gestão de foco)
- **W13-W15** — CSS Architecture & Layout (layout fluido sem overflow, tipografia fluida, metodologia CSS)

---

## W1 — Escolher estratégia de rendering (CSR/SSR/SSG/ISR/RSC/islands)

> A escolha entre as estratégias de rendering é decisão de produto (SEO, frescor de dados, interatividade), não de framework.

```mermaid
flowchart TD
    A["Novo projeto frontend"] --> B{"SEO necessário?"}
    B -->|Não| C["CSR — SPA"]
    B -->|Sim| D{"Dados mudam com que frequência?"}
    D -->|Nunca / raramente| E["SSG — build estático"]
    D -->|Com frequência imprevisível| F["ISR — stale-while-revalidate"]
    D -->|Por request / personalizado| G{"Muitas partes independentes?"}
    G -->|Sim| H["Streaming SSR + Suspense boundaries"]
    G -->|Não| I["SSR clássico"]
    E --> J{"Interatividade cirúrgica?"}
    J -->|Sim| K["Islands — Astro com client:*"]
    J -->|Não| L["SSG puro — Next.js ou Astro"]
    H --> M["RSC — Server Components por default<br/>Client Components só onde há state/eventos"]
```

---

## W2 — Decisão de gestão de estado

> Roteia o estado pela origem: server-state vai pro TanStack Query (cache + invalidação), UI local fica em useState, e só o compartilhado vira store global mínima.

```mermaid
flowchart LR
    A["Novo estado identificado"] --> B{"Origem do estado"}
    B -->|"Servidor remoto (API, banco)"| C["TanStack Query<br/>queryKey + queryFn + staleTime"]
    B -->|"UI local de um componente"| D["useState / useSignal local"]
    B -->|"Compartilhado entre features"| E{"É server state<br/>que vários componentes leem?"}
    E -->|Sim| F["TanStack Query com queryKey compartilhada<br/>deduplicação automática"]
    E -->|Não| G["Zustand / Jotai<br/>store global mínimo"]
    C --> H{"Precisa de atualização<br/>imediata após mutação?"}
    H -->|Sim| I["invalidateQueries após mutation<br/>ou optimistic update"]
    H -->|Não| J["staleTime configura revalidação"]
```

---

## W3 — Eliminar waterfall de data fetching

> Detecta fetches independentes que estão em série (waterfall acidental) e os paraleliza, com Suspense boundaries separados e prefetch na intenção de navegar.

```mermaid
flowchart TD
    A["Data fetching a implementar"] --> B{"Fetches são<br/>independentes entre si?"}
    B -->|Sim| C["Promise.all ou useQueries<br/>execução paralela"]
    B -->|Não| D{"Fetch B depende<br/>do resultado de A?"}
    D -->|Sim| E["Fetch sequencial é obrigatório<br/>waterfall inevitável"]
    D -->|Não| F["Investigar dependência<br/>provavelmente waterfall acidental"]
    C --> G{"React 19 com Suspense?"}
    G -->|Sim| H["Suspense boundaries SEPARADOS<br/>siblings no mesmo boundary são sequenciais"]
    G -->|Não| I["Suspense boundary único OK no React 18"]
    A --> J{"Navegação previsível?"}
    J -->|Sim| K["Prefetch em onMouseEnter<br/>ou prefetchQuery no server"]
    K --> L["Usuário vê dados sem spinner"]
```

---

## W4 — Pipeline de rendering do browser

> Do byte HTML ao pixel: parse → DOM/CSSOM → render tree → layout → paint → composite. Saber onde cada mudança reverbera evita reflows caros.

```mermaid
flowchart TD
    A["HTML bytes"] --> B["Parse HTML<br/>Tokenizer + Tree Constructor"]
    B --> C["DOM Tree"]
    D["CSS bytes"] --> E["Parse CSS<br/>CSSOM Tree"]
    C --> F["Render Tree<br/>DOM + CSSOM merged"]
    E --> F
    F --> G["Layout / Reflow<br/>x, y, width, height"]
    G --> H["Paint Records<br/>instruções vetoriais"]
    H --> I["Rasterização<br/>pixels em tiles"]
    I --> J["Composite<br/>GPU combina layers"]
    J --> K["Frame exibido na tela"]
```

---

## W5 — Não bloquear a main thread (event loop)

> O event loop coordena tasks, microtasks, rAF e idle work. Trabalho pesado vai pra Web Worker ou requestIdleCallback pra manter 60fps.

```mermaid
flowchart LR
    A["Task Queue<br/>setTimeout, eventos, fetch"] --> B["Executa 1 task"]
    B --> C["Drena Microtask Queue<br/>Promises, MutationObserver"]
    C --> D{"Vsync disponível?"}
    D -- "Sim" --> E["rAF callbacks<br/>IntersectionObserver"]
    E --> F["Paint / Composite"]
    F --> G["requestIdleCallback<br/>work não-crítico"]
    G --> A
    D -- "Não" --> A
```

---

## W6 — Evitar layout thrashing (batch read/write)

> Agrupa todas as leituras de geometria antes das escritas de estilo, eliminando o forced synchronous layout que mata a performance.

```mermaid
flowchart TD
    A["Início do rAF callback"] --> B["FASE READ<br/>Ler offsetWidth, getBoundingClientRect<br/>de todos os elementos"]
    B --> C["FASE WRITE<br/>Escrever style em todos os elementos"]
    C --> D["Browser faz 1 layout no próximo frame"]
    E["Anti-padrão: read dentro de loop write"] --> F["Escrita invalida layout"]
    F --> G["Leitura força layout síncrono"]
    G --> F
```

---

## W7 — Otimizar LCP (passo a passo)

> Mede o LCP no campo (P75), identifica o elemento e a sub-parte dominante (TTFB / load delay / load duration / render delay) e ataca a causa certa.

```mermaid
flowchart TD
    A["Medir LCP atual<br/>PageSpeed Insights + CrUX"] --> B{"LCP maior<br/>que 2,5 s?"}
    B -- Não --> Z["Monitorar com<br/>web-vitals RUM"]
    B -- Sim --> C["Identificar elemento LCP<br/>DevTools Performance"]
    C --> D["Analisar sub-partes<br/>TTFB / Delay / Load / Render"]
    D --> E{"Gargalo principal?"}
    E -- TTFB --> F["CDN edge + cache HTML<br/>stale-while-revalidate"]
    E -- "Resource Load Delay" --> G["Preload LCP + fetchpriority high<br/>Remover loading lazy do LCP"]
    E -- "Resource Load Duration" --> H["AVIF/WebP + srcset<br/>Otimizar dimensões"]
    E -- "Element Render Delay" --> I["Remover JS/CSS bloqueante<br/>antes do LCP"]
    F --> J["Re-medir lab + aguardar CrUX"]
    G --> J
    H --> J
    I --> J
    J --> B
```

---

## W8 — Reduzir INP (interatividade)

> Identifica a interação mais lenta e otimiza a fase dominante: input delay (quebrar long tasks), processing (enxugar handler) ou presentation (evitar thrashing).

```mermaid
flowchart TD
    A["Medir INP field<br/>web-vitals attribution"] --> B{"INP maior<br/>que 200 ms?"}
    B -- Não --> Z["Monitorar CrUX<br/>Search Console"]
    B -- Sim --> C["Identificar interação mais lenta<br/>via PerformanceObserver"]
    C --> D["Profiling no DevTools<br/>Long Tasks"]
    D --> E{"Fase dominante?"}
    E -- "Input Delay" --> F["Quebrar Long Tasks com yield<br/>Remover scripts bloqueantes"]
    E -- "Processing Time" --> G["Enxugar handler<br/>Mover trabalho secundário pra depois"]
    E -- "Presentation Delay" --> H["Evitar layout thrashing<br/>content-visibility auto"]
    F --> I["Validar com TBT no Lighthouse"]
    G --> I
    H --> I
    I --> J["Aguardar CrUX field (28 dias)"]
    J --> B
```

---

## W9 — Orçamento de performance no CI

> Define budgets (LCP, TBT, KB de bundle) e trava o deploy com size-limit + Lighthouse CI — regressão de performance vira build vermelho.

```mermaid
flowchart LR
    A["Definir budgets<br/>LCP alvo, TBT, bundle KB"] --> B["Configurar size-limit<br/>bundles JS/CSS"]
    B --> C["Configurar Lighthouse CI<br/>thresholds"]
    C --> D["Steps no GitHub Actions"]
    D --> E["PR abre, CI executa"]
    E --> F{"size-limit passou?"}
    F -- Não --> G["BLOQUEADO<br/>bundle excedeu budget"]
    F -- Sim --> H{"Lighthouse CI passou?"}
    H -- Não --> I["BLOQUEADO<br/>métrica regrediu"]
    H -- Sim --> J["Deploy autorizado"]
    G --> K["Otimizar (code split / remove dep)"]
    I --> K
    K --> E
```

---

## W10 — Auditoria WCAG de uma página (3 camadas)

> Automação (axe/Lighthouse) pega ~30%; teclado pega foco e operabilidade; screen reader confirma nome/role/estado. As três camadas se completam.

```mermaid
flowchart TD
    A["Página a auditar"] --> B["Camada 1: axe / Lighthouse<br/>captura ~30% dos problemas"]
    B --> C{"Violações críticas?"}
    C -- "Sim" --> D["Corrigir (image-alt, label,<br/>color-contrast, button-name)"]
    D --> B
    C -- "Não" --> E["Camada 2: teste por teclado<br/>Tab / Shift+Tab / Enter / Escape"]
    E --> F{"Foco preso ou invisível?"}
    F -- "Sim" --> G["Corrigir: focus trap,<br/>:focus-visible, skip link"]
    G --> E
    F -- "Não" --> H["Camada 3: screen reader<br/>NVDA+Chrome ou VoiceOver+Safari"]
    H --> I{"Nome/role/estado<br/>anunciados?"}
    I -- "Não" --> J["Corrigir: aria-label,<br/>role correto, aria-live"]
    J --> H
    I -- "Sim" --> K["Aprovado WCAG AA<br/>zero violations, keyboard e SR ok"]
```

---

## W11 — Decisão de uso de ARIA (HTML semântico primeiro)

> A primeira regra do ARIA é não usar ARIA: se existe elemento nativo, use-o. ARIA entra só como complemento ou em padrões custom do APG.

```mermaid
flowchart TD
    A["Necessidade de componente<br/>interativo ou semântico"] --> B{"Existe elemento<br/>HTML nativo?"}
    B -- "Sim: button, a, input,<br/>select, details, table" --> C["Usar elemento nativo<br/>Regra 1 do ARIA"]
    C --> D{"Comportamento nativo<br/>é suficiente?"}
    D -- "Sim" --> E["Entregar sem ARIA<br/>role + keyboard + focus já inclusos"]
    D -- "Não: estilo/comportamento extra" --> F["ARIA só como complemento<br/>aria-expanded, aria-describedby"]
    B -- "Não: Tabs, Combobox,<br/>Tree, Slider custom" --> G["Consultar APG<br/>w3.org/WAI/ARIA/apg"]
    G --> H["Implementar role + states<br/>+ keyboard conforme APG"]
    H --> I["Testar axe + teclado + SR"]
    F --> I
    E --> J["Aprovado, sem ARIA desnecessário"]
    I --> J
```

---

## W12 — Gestão de foco em componente modal

> Abrir salva o trigger e move o foco pro modal; trap prende o Tab dentro; fechar restaura o foco ao trigger. É o padrão APG Dialog.

```mermaid
flowchart TD
    A["Usuário clica no trigger"] --> B["Salvar referência<br/>const trigger = document.activeElement"]
    B --> C["Exibir modal<br/>dialog.hidden = false"]
    C --> D["Mover foco<br/>primeiro focável ou título.focus()"]
    D --> E["Ativar focus trap<br/>Tab e Shift+Tab presos no modal"]
    E --> F{"Escape ou clicou fechar?"}
    F -- "Não: navega dentro" --> E
    F -- "Sim" --> G["Fechar modal<br/>dialog.hidden = true"]
    G --> H["Restaurar foco<br/>trigger.focus()"]
    H --> I{"Foco voltou ao trigger?"}
    I -- "Falhou" --> J["Fallback pra parent focável"]
    I -- "OK" --> K["Padrão APG Dialog correto"]
```

---

## W13 — Layout fluido sem overflow (mobile → desktop)

> Audita o overflow horizontal, aplica box-sizing + img max-width, troca larguras fixas por min()/clamp() e valida com screenshot a 320px.

```mermaid
flowchart TD
    A["Auditar overflow horizontal<br/>(scrollWidth > innerWidth)"] --> B["Reset box-sizing border-box<br/>+ img max-width 100%"]
    B --> C["Substituir width fixo<br/>por min() + clamp()"]
    C --> D["Trocar max-width hardcoded<br/>por min(80rem, 100% - pad)"]
    D --> E["min-width 0 em flex/grid items"]
    E --> F["Validar: screenshot 320px<br/>sem scroll horizontal"]
```

---

## W14 — Tipografia fluida com clamp (sem dead-zone)

> Gera a escala fluida (Utopia) entre viewport mín/máx, garante que nenhum step de headline cai na dead-zone 32-48px e declara tokens `--step-N` via clamp.

```mermaid
flowchart TD
    A["Definir viewport min/max<br/>(ex: 320px → 1240px)"] --> B["Escolher ratio<br/>mobile 1.2, desktop 1.5"]
    B --> C["Gerar escala Utopia<br/>steps -2 a +5"]
    C --> D{"Algum step de headline<br/>cai em 32-48px?"}
    D -- Sim --> E["Ajustar ratio ou viewport<br/>pra pular a dead-zone"]
    E --> C
    D -- Não --> F["Declarar tokens --step-N<br/>em :root via clamp()"]
    F --> G["Substituir font-size fixos<br/>por var(--step-N)"]
```

---

## W15 — Escolher metodologia de arquitetura CSS

> Roteia entre CUBE, ITCSS+BEM e utility-first/Tailwind conforme existência de design system, tamanho do time e framework.

```mermaid
flowchart LR
    A["Projeto novo ou existente"] --> B{"Tem design system<br/>com tokens?"}
    B -- Sim --> C["CUBE CSS<br/>cascade + tokens como utilities"]
    B -- Não --> D{"Time grande ou pequeno?"}
    D -- Grande --> E["ITCSS + BEM<br/>camadas + nomenclatura"]
    D -- Pequeno --> F{"Tem framework UI?"}
    F -- Sim --> G["Tailwind + tokens<br/>customizados no config"]
    F -- Não --> H["CUBE CSS leve<br/>globals + blocks"]
```

---

## W16 — Diagnosticar e corrigir CLS

> Identifica a causa raiz do layout shift (imagem sem dimensões, fonte com FOUT, banner injetado, conteúdo dinâmico acima do fold) e aplica o fix correto para cada origem, validando com CrUX até atingir CLS ≤ 0,1.

```mermaid
flowchart TD
    A["Medir CLS atual<br/>PageSpeed Insights + Search Console"] --> B{"CLS maior<br/>que 0,1?"}
    B -- "Não" --> Z["Monitorar CrUX<br/>Search Console mensal"]
    B -- "Sim" --> C["Abrir DevTools Performance<br/>Gravar e identificar Layout Shift records"]
    C --> D["Inspecionar elemento causador<br/>via PerformanceObserver ou<br/>Layout Instability API"]
    D --> E{"Causa do shift?"}
    E -- "Imagem sem dimensões" --> F["Adicionar width e height explícitos no HTML<br/>+ max-width 100%; height auto no CSS"]
    E -- "Fonte web com FOUT" --> G["Ajustar font-display<br/>optional elimina FOUT<br/>swap aceita FOUT mas garante texto visível"]
    E -- "Banner ou notificação injetada<br/>acima de conteúdo existente" --> H["Reservar espaço fixo<br/>min-height no slot do banner<br/>antes de injetar conteúdo"]
    E -- "Conteúdo dinâmico via JS<br/>acima do fold" --> I["Inserir placeholder com<br/>aspect-ratio ou height mínimo<br/>antes do fetch completar"]
    E -- "Animação em top ou left" --> J["Substituir por transform translate<br/>compositor-only não dispara layout"]
    F --> K["Re-medir CLS no Lighthouse lab"]
    G --> K
    H --> K
    I --> K
    J --> K
    K --> L{"CLS lab ≤ 0,05?"}
    L -- "Não" --> D
    L -- "Sim" --> M["Aguardar 28 dias<br/>para dados CrUX atualizarem"]
    M --> B
```

---

## W17 — Service Worker: registrar, escolher estratégia e invalidar cache

> Registra o SW, roteia cada tipo de recurso para a estratégia de cache correta (cache-first para assets com hash, network-first para APIs, stale-while-revalidate para dados secundários, network-only para transações), versiona o cache e invalida no activate para evitar servir respostas obsoletas.

```mermaid
flowchart TD
    A["Registrar SW no documento principal<br/>navigator.serviceWorker.register"] --> B["Evento install<br/>Pre-cachear recursos críticos via caches.open<br/>skipWaiting para ativar imediatamente"]
    B --> C["Evento activate<br/>Apagar caches com nome diferente do atual<br/>clients.claim para controlar páginas abertas"]
    C --> D["Interceptar fetch<br/>evento fetch"]
    D --> E{"Tipo de recurso?"}
    E -- "JS, CSS, imagens<br/>com hash no nome" --> F["Cache First<br/>Retorna do cache imediatamente<br/>busca na rede só se miss"]
    E -- "HTML de página<br/>ou dados de API críticos" --> G["Network First<br/>Tenta rede, cai no cache se offline<br/>atualiza cache com resposta fresca"]
    E -- "Avatares, thumbnails<br/>dados secundários" --> H["Stale-While-Revalidate<br/>Retorna cache imediatamente<br/>busca rede em background e atualiza cache"]
    E -- "Analytics, pagamentos<br/>dados que não devem vir do cache" --> I["Network Only<br/>Sem cache, sempre rede<br/>falha se offline"]
    E -- "Assets pré-cacheados no install<br/>sem fallback de rede necessário" --> J["Cache Only<br/>Só cache, sem rede<br/>para recursos garantidos no install"]
    F --> K["Resposta entregue ao browser"]
    G --> K
    H --> K
    I --> K
    J --> K
    K --> L{"Deploy de nova versão?"}
    L -- "Não" --> D
    L -- "Sim" --> M["Incrementar CACHE_NAME<br/>nova versão do SW.js"]
    M --> N["Install do novo SW<br/>pre-cacheia novos recursos"]
    N --> O["Activate apaga caches antigos<br/>apenas o novo CACHE_NAME sobrevive"]
    O --> D
```
