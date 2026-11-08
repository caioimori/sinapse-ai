---
titulo: "LOOPS Onda 11 — Design Systems, Motion & Product Craft (diagramas e passo a passo)"
tipo: loops-diagramas
onda: 11
created: 2026-06-22
total_workflows: 15
---

# LOOPS Onda 11 — Design Systems, Motion & Product Craft

Os loops operacionais da camada de **design systems, motion e craft de produto** — destilados dos domínios 43-47 em diagramas de fluxo prontos pra virar comportamento de agent. Da arquitetura de tokens à API de componente, do teste de usabilidade à escala tipográfica, da timeline GSAP à estrutura de uma LP de alta conversão.

## Índice dos loops

- **W1-W3** — Design Systems Engineering (tokens 3 camadas, API de componente, design-to-code)
- **W4-W6** — UX Research & Interaction Design (continuous discovery, teste de usabilidade, avaliação heurística)
- **W7-W9** — Visual & Brand Systems (escala tipográfica, sistema de cor, composição com Gestalt)
- **W10-W12** — Motion, Animation & Creative Coding (justificar animação, timeline GSAP, scroll-driven)
- **W13-W15** — Conversion & Persuasion Engineering (estruturar LP, diagnosticar fricção, prova social ética)

---

## W1 — Arquitetura de tokens (primitivo → semântico → componente)

> Estrutura os tokens em 3 camadas e trava o gate: nenhum componente consome primitivo direto — só token semântico, pra theming e rebrand não quebrarem.

```mermaid
flowchart TD
    A["Definir primitivos<br/>color.blue.500 = #3B82F6"] --> B["Criar semânticos<br/>color-action-primary = color.blue.500"]
    B --> C["Criar tokens de componente<br/>button-primary-bg = color-action-primary"]
    C --> D["Rodar Style Dictionary<br/>gera CSS custom properties"]
    D --> E{"Gate: primitivo<br/>em componente?"}
    E -->|"Sim"| F["Bloqueia — substituir<br/>por token semântico"]
    E -->|"Não"| G["Aprovado — build limpo"]
    F --> B
```

---

## W2 — Desenhar API de componente (configuração vs composição)

> Decide a API pública pela variabilidade de conteúdo: props simples, compound components com context, ou slots nomeados — com story cobrindo os estados reais.

```mermaid
flowchart LR
    A["Briefing do componente"] --> B{"Variabilidade<br/>de conteúdo?"}
    B -->|"Baixa"| C["Props + children simples"]
    B -->|"Alta"| D{"Múltiplos pontos<br/>de injeção?"}
    D -->|"Não"| E["Compound Components<br/>com Context implícito"]
    D -->|"Sim"| F["Slots nomeados via Context"]
    C --> G["Story CSF3 com argTypes"]
    E --> G
    F --> G
    G --> H{"Play function cobre<br/>fluxos críticos?"}
    H -->|"Não"| I["Adicionar play function"]
    H -->|"Sim"| J["Merge no Core"]
    I --> H
```

---

## W3 — Pipeline design-to-code

> Fecha o loop Figma → tokens JSON → Style Dictionary → código → Storybook → Chromatic, com gate de regressão visual no CI.

```mermaid
flowchart TD
    A["Designer atualiza token<br/>no Tokens Studio (Figma)"] --> B["Sincroniza com repo via GitHub"]
    B --> C["PR em semantic.tokens.json"]
    C --> D["CI roda Style Dictionary<br/>gera tokens.css"]
    D --> E["Storybook visual diff"]
    E --> F{"Chromatic: regressão visual?"}
    F -->|"Sim"| G["Revisar diff"]
    F -->|"Não"| H["PR aprovado, merge e deploy"]
    G --> I{"Aprovado intencionalmente?"}
    I -->|"Sim"| J["Aceitar baseline no Chromatic"]
    I -->|"Não"| K["Corrigir token no Figma"]
    J --> H
    K --> A
```

---

## W4 — Continuous discovery (opportunity solution tree)

> Cadência semanal de entrevistas alimentando a árvore de oportunidades, com teste das assumptions críticas antes de construir qualquer solução.

```mermaid
flowchart TD
    A["Definir outcome"] --> B["Entrevistas semanais"]
    B --> C["Mapear oportunidades"]
    C --> D["Gerar soluções"]
    D --> E["Mapear assumptions críticas"]
    E --> F{"Assumption falsificável?"}
    F -->|"Sim"| G["Rodar assumption test"]
    F -->|"Não"| H["Redefinir solução"]
    G --> I{"Passou?"}
    I -->|"Sim"| J["Prototipar"]
    I -->|"Não"| D
    J --> B
    H --> D
```

---

## W5 — Teste de usabilidade iterativo

> 5 usuários da persona primária por rodada (pegam ~85% dos problemas), think-aloud, síntese por severidade, corrige e repete.

```mermaid
flowchart LR
    A["Definir objetivo e tarefas"] --> B["Recrutar 5 usuários<br/>(persona primária)"]
    B --> C["Conduzir sessão<br/>(think-aloud)"]
    C --> D["Sintetizar problemas<br/>por severidade"]
    D --> E{"Problemas críticos?"}
    E -->|"Sim"| F["Corrigir design"]
    E -->|"Não"| G["Documentar e monitorar"]
    F --> H{"Próxima rodada?"}
    H -->|"Sim"| A
    H -->|"Não"| I["Launch com confiança"]
```

---

## W6 — Avaliação heurística de Nielsen

> 3-5 especialistas inspecionam a interface independentemente com as 10 heurísticas, consolidam e priorizam por severidade.

```mermaid
flowchart TD
    A["Definir escopo da avaliação"] --> B["3-5 avaliadores independentes"]
    B --> C["Inspeção individual<br/>(10 heurísticas)"]
    C --> D["Registrar problemas<br/>com heurística violada"]
    D --> E["Classificar severidade (0 a 4)"]
    E --> F["Consolidar lista única"]
    F --> G["Priorizar por severidade e frequência"]
    G --> H["Relatório com recomendações de fix"]
```

---

## W7 — Construir escala tipográfica e ritmo vertical

> Escala modular fluida com clamp() entre viewport mín/máx, fugindo da dead-zone 32-48px, com leading por papel e medida em ch.

```mermaid
flowchart TD
    A["Definir corpo base (--step-0)"] --> B["Escolher ratio modular (1.2 a 1.618)"]
    B --> C["Calcular steps via Utopia"]
    C --> D["Gerar clamp() por step"]
    D --> E{"Step de headline<br/>cai em 32-48px?"}
    E -->|"Sim"| F["Ajustar ratio ou viewport máximo"]
    F --> C
    E -->|"Não"| G["Definir leading por papel semântico"]
    G --> H["Parear famílias (máx 2 famílias / 2 pesos)"]
    H --> I["Validar medida em ch (45-75) no corpo"]
    I --> J["Exportar tokens pra CSS custom properties"]
```

---

## W8 — Sistema de cor (primitivo → semântico → funcional)

> Constrói as escalas neutra e de acento, mapeia semânticos e funcionais sobre primitivos, e valida contraste WCAG AA em contexto real (não em swatch isolado).

```mermaid
flowchart LR
    A["Definir escala neutra (10 steps)"] --> B["Definir escala de acento (10 steps)"]
    B --> C["Mapear tokens semânticos sobre primitivos"]
    C --> D["Mapear tokens funcionais sobre semânticos"]
    D --> E["Testar combinações em contexto real"]
    E --> F{"Contraste >= 4.5:1 (WCAG AA)?"}
    F -->|"Não"| G["Ajustar token semântico"]
    G --> E
    F -->|"Sim"| H["Testar dark mode por override de semânticos"]
    H --> I["Validar via screenshot desktop + mobile"]
```

---

## W9 — Composição com hierarquia visual e Gestalt

> Define grid tipográfico, força assimetria intencional sobre simetria trivial, aplica Gestalt (proximidade, figura-fundo) e adiciona identity layer (grain, `#0A0A0A` não `#000`).

```mermaid
flowchart TD
    A["Definir grid tipográfico<br/>(campos + colunas + margens)"] --> B["Posicionar pela diagonal visual principal"]
    B --> C{"Layout simétrico<br/>com centralização trivial?"}
    C -->|"Sim"| D["Aplicar offset / assimetria calculada"]
    D --> B
    C -->|"Não"| E["Verificar proximidade (grupos relacionados)"]
    E --> F["Verificar figura-fundo (contraste)"]
    F --> G["Adicionar identity layer<br/>(grain + elemento gráfico sutil)"]
    G --> H["Screenshot desktop 1280px"]
    H --> I["Screenshot mobile 390px"]
    I --> J{"Algum check bloqueante?"}
    J -->|"Sim"| K["Corrigir e reiterar"]
    K --> H
    J -->|"Não"| L["Aprovado para entrega"]
```

---

## W10 — Decidir se uma animação se justifica

> Toda animação passa pelo filtro "o que o usuário aprende com isso?": se não comunica estado/feedback/hierarquia, é decoração e sai. E sempre respeita prefers-reduced-motion.

```mermaid
flowchart TD
    A["Pedido de animação"] --> B{"O que o usuário<br/>aprende com isso?"}
    B -->|"Comunica estado,<br/>feedback ou hierarquia"| C["Animação justificada"]
    B -->|"Nada, é decorativo"| D["Remover ou substituir por fade"]
    C --> E{"prefers-reduced-motion?"}
    E -->|"reduce ativo"| F["Substituir por fade ou remover"]
    E -->|"no-preference"| G["Implementar com easing<br/>e duração corretos"]
    G --> H["Validar: só transform e opacity"]
    H --> I["APROVADO — produzir"]
```

---

## W11 — Construir timeline GSAP com easing e stagger

> Orquestra a sequência por hierarquia visual (herói primeiro), usa defaults de duração/ease, position parameter e stagger espacial, validando 60fps e reduced-motion.

```mermaid
flowchart LR
    A["Identificar elementos<br/>e hierarquia visual"] --> B["Definir herói (anima primeiro)"]
    B --> C["gsap.timeline com defaults<br/>de duração e ease"]
    C --> D["Adicionar tweens com position parameter"]
    D --> E{"Múltiplos elementos similares?"}
    E -->|"Sim"| F["stagger com from e grid auto"]
    E -->|"Não"| G["position overlap manual"]
    F --> H["Testar scrub com ScrollTrigger"]
    G --> I["Verificar prefers-reduced-motion"]
    H --> I
    I --> J["Validar 60fps no DevTools Performance"]
```

---

## W12 — Scroll-driven animation com performance

> Escolhe CSS scroll-driven nativo ou GSAP ScrollTrigger pela necessidade de suporte, com feature detection e fallback para prefers-reduced-motion.

```mermaid
flowchart TD
    A["Caso de uso de scroll animation"] --> B{"Suporte Firefox<br/>necessário?"}
    B -->|"Não"| C["CSS scroll-driven<br/>animation-timeline: view()"]
    B -->|"Sim"| D["GSAP ScrollTrigger"]
    C --> E["Definir animation-range<br/>(entry, cover, exit)"]
    D --> F["Configurar trigger, start, end, scrub"]
    E --> G["Declarar animation-timeline<br/>após o shorthand animation"]
    F --> H{"Pin de seção necessário?"}
    H -->|"Sim"| I["pin: true + anticipatePin: 1"]
    H -->|"Não"| J["toggleActions ou scrub"]
    G --> K["Feature detect @supports"]
    I --> L["Testar prefers-reduced-motion"]
    J --> L
    K --> L
    L --> M["VALIDADO"]
```

---

## W13 — Estruturar uma LP de alta conversão

> Da proposta de valor (resultado, não feature) às objeções e prova, escreve copy na voz do cliente, distribui sinais de confiança e valida no teste dos 5 segundos.

```mermaid
flowchart TD
    A["Briefing da oferta<br/>audiência e objetivo"] --> B["Definir proposta de valor<br/>resultado, não feature"]
    B --> C["Mapear objeções<br/>5-7 principais do público"]
    C --> D["Estruturar anatomia<br/>hero · valor · prova · objeções · CTA"]
    D --> E["Escrever copy<br/>voz do cliente como matéria-prima"]
    E --> F["Distribuir sinais de confiança<br/>ao longo da página"]
    F --> G["Revisar com 7 princípios de Cialdini"]
    G --> H{"Teste dos 5 segundos<br/>aprovado?"}
    H -->|"Não"| B
    H -->|"Sim"| I["LP pronta para publicação"]
```

---

## W14 — Diagnosticar fricção no funil (Fogg B=MAP)

> Acha a etapa de maior queda e diagnostica qual variável faltou — motivação, habilidade ou prompt — atacando preferencialmente a fricção (habilidade), a alavanca mais confiável.

```mermaid
flowchart TD
    A["Funil com queda de conversão"] --> B["Identificar etapa de maior queda<br/>visita · scroll · clique · form · compra"]
    B --> C{"Qual variável faltou?"}
    C -->|"Motivação"| D["Revisar copy de benefício<br/>(esperança / medo / aceitação social)"]
    C -->|"Habilidade"| E["Reduzir fricção<br/>(6 dimensões de simplicidade de Fogg)"]
    C -->|"Prompt"| F["Revisar CTA<br/>posição · copy · contraste · micro-copy"]
    D --> G["Implementar hipótese"]
    E --> G
    F --> G
    G --> H["Medir resultado<br/>(A/B test na Onda 14)"]
    H --> B
```

---

## W15 — Aplicar prova social e gatilhos de Cialdini com ética

> Coleta material real (depoimento com resultado + foto + cargo), distribui os gatilhos por seção e passa pelo checklist ético de Brignull — escassez real, nada de dark pattern.

```mermaid
flowchart LR
    A["Lista de gatilhos<br/>(7 princípios de Cialdini)"] --> B["Identificar quais já existem na LP"]
    B --> C["Coletar material real<br/>depoimentos · dados · credenciais"]
    C --> D["Aplicar por seção<br/>reciprocidade topo · autoridade pós-hero<br/>prova social meio · escassez no CTA"]
    D --> E{"Checklist ético de Brignull<br/>escassez real, prova real?"}
    E -->|"Falha"| F["Corrigir — nunca fingir<br/>escassez ou fabricar prova"]
    E -->|"Aprovado"| G["Publicar com LTV preservado"]
    F --> E
```

---

## W16 — Decisão e parametrização de spring physics

> Decide quando spring supera cubic-bezier (interrupções, inputs rápidos, peso percebido) e parametriza stiffness/damping/mass para o perfil de personalidade da marca — duração emergente, nunca fixada — validando com prefers-reduced-motion.

```mermaid
flowchart TD
    A["Animação identificada"] --> B{"A animação pode ser<br/>interrompida pelo usuário<br/>durante o movimento?"}
    B -->|"Não"| C["cubic-bezier é suficiente<br/>escolher ease-out/in/in-out"]
    B -->|"Sim"| D["Spring physics justificada<br/>duração emergente evita descontinuidade"]
    C --> Z["Implementar e validar"]
    D --> E{"Perfil de personalidade<br/>da marca?"}
    E -->|"Premium editorial<br/>calmo"| F["stiffness 50<br/>damping 15<br/>mass 3"]
    E -->|"Amigável<br/>acolhedor"| G["stiffness 150<br/>damping 8<br/>mass 1"]
    E -->|"Snappy<br/>decisivo"| H["stiffness 300<br/>damping 30<br/>mass 1"]
    E -->|"Default neutro"| I["stiffness 100<br/>damping 10<br/>mass 1"]
    F --> J["Testar: sensação está correta?<br/>objeto parece ter massa?"]
    G --> J
    H --> J
    I --> J
    J -->|"Bounce excessivo"| K["Aumentar damping<br/>ou reduzir stiffness"]
    J -->|"Movimento lânguido"| L["Aumentar stiffness<br/>ou reduzir mass"]
    J -->|"Sensação correta"| M{"prefers-reduced-motion<br/>reduce ativo?"}
    K --> J
    L --> J
    M -->|"Sim"| N["Substituir por fade<br/>opacity 0 → 1 sem posição"]
    M -->|"Não"| O["Aprovar para produção"]
```

---

## W17 — Escalar para WebGL e Three.js

> Decide quando WebGL se justifica (efeitos impossíveis em CSS), configura a cena com os cinco primitivos, cria ShaderMaterial com uniforms de tempo e mouse, fecha o loop rAF — com fallback 2D se GPU indisponível, prefers-reduced-motion e gate de 60fps.

```mermaid
flowchart TD
    A["Briefing de hero section<br/>ou experiência criativa"] --> B{"O efeito é realizável<br/>em CSS ou SVG?"}
    B -->|"Sim"| C["Implementar em CSS<br/>sem Three.js"]
    B -->|"Não — grain procedural<br/>partículas reativas<br/>distorção de campo<br/>geometrias 3D"| D["WebGL com Three.js justificado"]
    C --> Z["Entregar"]
    D --> E["Criar cena<br/>new THREE.Scene()"]
    E --> F["Configurar câmera<br/>PerspectiveCamera FOV 75<br/>aspect ratio dinâmico"]
    F --> G["Criar renderer<br/>antialias true<br/>alpha true<br/>pixelRatio min 2"]
    G --> H{"Efeito precisa<br/>de shader customizado?"}
    H -->|"Não"| I["Usar MeshStandardMaterial<br/>ou MeshBasicMaterial"]
    H -->|"Sim — grain procedural<br/>distorção<br/>partículas"| J["ShaderMaterial com uniforms<br/>uTime uResolution uMouse"]
    I --> K["Adicionar geometria e mesh<br/>à cena"]
    J --> K
    K --> L["Adicionar luz<br/>AmbientLight + DirectionalLight<br/>se usar materiais físicos"]
    L --> M{"prefers-reduced-motion<br/>reduce ativo?"}
    M -->|"Sim"| N["Renderizar frame estático<br/>cancelAnimationFrame<br/>não iniciar loop"]
    M -->|"Não"| O["Iniciar loop rAF<br/>atualizar uTime por frame<br/>renderer.render a cada frame"]
    N --> P["Entregar com fallback estático"]
    O --> Q{"Frame rate >= 60fps<br/>no DevTools Performance?"}
    Q -->|"Não"| R["Reduzir geometria<br/>ou pixelRatio<br/>ou complexidade do shader"]
    Q -->|"Sim"| S{"Browser suporta WebGL?<br/>renderer.capabilities.isWebGL2"}
    R --> Q
    S -->|"Não"| T["Ativar fallback 2D<br/>CSS grain estático<br/>ou imagem"]
    S -->|"Sim"| U["Entregar hero com Three.js"]
```
