# Disney's 12 Principles of Animation — Applied to Web

> Originalmente codificados por Frank Thomas e Ollie Johnston (The Illusion of Life, 1981).
> Aplicados ao contexto de animacoes web, UI/UX e creative coding.

---

## 1. Squash & Stretch
- **Original:** Objetos deformam para mostrar peso e flexibilidade
- **Web:** Botoes que comprimem ao clicar, icones que esticam ao hover
- **CSS:** `transform: scaleY(0.95)` no `:active`, `scaleX(1.05) scaleY(0.95)` no press
- **Quando:** Click feedback, bounce animations, loading indicators
- **Regra:** Manter volume constante — se comprime em Y, expande em X

## 2. Anticipation
- **Original:** Movimento preparatorio antes da acao principal
- **Web:** Menu que recua 10px antes de expandir, botao que encolhe antes de navegar
- **CSS:** Keyframe 0%: `translateY(5px)`, 30%: `translateY(-2px)`, 100%: `translateY(0)`
- **Quando:** Antes de transicoes importantes, page navigation, modais
- **Regra:** Quanto maior a acao seguinte, maior a anticipation

## 3. Staging
- **Original:** Apresentacao clara de uma ideia ao espectador
- **Web:** Hierarquia visual via motion — hero anima primeiro, depois CTA, depois detalhes
- **Implementacao:** Stagger delays para criar ordem de leitura visual
- **Quando:** Landing pages, hero sections, onboarding flows
- **Regra:** Uma coisa de cada vez — nao competir por atencao

## 4. Straight Ahead vs Pose to Pose
- **Original:** Animacao sequencial vs. definir poses-chave e interpolar
- **Web:** Procedural (JS frame-by-frame) vs Declarativo (CSS keyframes, GSAP timeline)
- **Straight Ahead:** Animacoes generativas, particulas, simulacoes fisicas
- **Pose to Pose:** UI transitions, scroll reveals, page transitions
- **Regra:** UI = pose-to-pose (previsivel). Generative = straight-ahead (surpreendente)

## 5. Follow Through & Overlapping Action
- **Original:** Partes do corpo nao param ao mesmo tempo — cabelo continua, saia balanca
- **Web:** Staggered animations — cards aparecem em sequencia, elementos filhos demoram mais
- **GSAP:** `stagger: { each: 0.05, from: "start" }`
- **Quando:** Lists, grids, multiplos elementos, menu items
- **Regra:** Stagger 30-100ms entre elementos. Elementos menores tem mais delay

## 6. Slow In / Slow Out (Easing)
- **Original:** Aceleracao e desaceleracao naturais
- **Web:** Easing functions — ease-in, ease-out, ease-in-out, cubic-bezier
- **Entradas:** ease-out (chega rapido, desacelera) — usuario sente responsividade
- **Saidas:** ease-in (comeca devagar, acelera) — prepara o olho para a saida
- **Transicoes:** ease-in-out — suave nos dois extremos
- **Regra:** NUNCA linear para UI (exceto loading bars). Sempre ease-out para entradas

## 7. Arcs
- **Original:** Movimento natural segue arcos, nao linhas retas
- **Web:** Elementos que se movem em bezier curves, nao apenas translateX/Y linear
- **CSS:** `offset-path: path('M0,0 C50,0 50,100 100,100')` ou motion path
- **GSAP:** `motionPath` plugin para paths curvos
- **Quando:** Elementos que se movem de A para B, tooltips, notificacoes
- **Regra:** Se o movimento e > 200px, considere um arco

## 8. Secondary Action
- **Original:** Acoes de suporte que enriquecem a acao principal
- **Web:** Icone que pulsa enquanto texto aparece, sombra que cresce com hover, ripple effect
- **Implementacao:** Pseudo-elements (::before, ::after) com animacoes proprias
- **Quando:** Sempre que a animacao principal parece "seca" ou "simples demais"
- **Regra:** Secondary action NUNCA deve competir com a primary — deve complementar

## 9. Timing
- **Original:** Numero de frames define peso, humor e personalidade
- **Web:** Duration em ms define percepcao
- **Rapido (100-200ms):** Leve, responsivo, snappy — micro-interactions
- **Medio (300-500ms):** Balanced, confortavel — transitions de UI
- **Lento (600-1200ms):** Pesado, dramatico, luxuoso — hero reveals
- **Muito lento (1500ms+):** Cinematico, contemplativo — background, ambiente
- **Regra:** Tempo de atencao humana media para animacao = 300ms. Acima disso, precisa de proposito

## 10. Exaggeration
- **Original:** Amplificar a realidade para clareza e impacto
- **Web:** Overshoot (scale vai a 1.1 antes de 1.0), bounce, elastic easing
- **CSS:** `cubic-bezier(0.68, -0.55, 0.265, 1.55)` — ultrapassa e volta
- **Quando:** CTA buttons, notificacoes importantes, feedback de sucesso/erro
- **Regra:** Exagero proporcional a importancia. CTA = mais. Info = menos

## 11. Solid Drawing
- **Original:** Entender forma, volume, peso — desenhar com profundidade
- **Web:** CSS 3D transforms com perspective — elementos que parecem ter volume
- **CSS:** `perspective: 1000px` + `rotateX/Y` para cards 3D, flips, tilt effects
- **Three.js:** PBR materials, iluminacao correta, sombras — objetos criveis
- **Quando:** Cards 3D, product showcases, portfolios
- **Regra:** Se usar 3D transform, usar perspective. Se nao, parece achatado

## 12. Appeal
- **Original:** Design que captura e mantem atencao — carisma do personagem
- **Web:** Motion que encanta — o "wow" que faz o usuario explorar mais
- **Tecnicas:** Spring physics (sensacao viva), detalhes inesperados, easter eggs
- **Quando:** Sempre — appeal e o objetivo final de toda animacao
- **Regra:** Appeal nao e "mais animacao" — e a animacao CERTA no momento CERTO
