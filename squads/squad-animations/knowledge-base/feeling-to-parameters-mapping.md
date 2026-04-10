# Feeling-to-Parameters Mapping — Animation Intent Translation

> A knowledge base mais critica da squad. Traduz descricoes subjetivas humanas
> em parametros tecnicos concretos de animacao. Elimina a necessidade de iteracao
> de prompt — o usuario descreve, o agente traduz.

---

## 1. Mapeamento Principal: Feeling → Parametros

### Feelings Primarios

| Feeling | Duration | Easing | Scale Range | Movement | Technique |
|---------|----------|--------|-------------|----------|-----------|
| Elegante | 0.8-1.2s | ease-in-out cubic `(0.76, 0, 0.24, 1)` | 0.98-1.02 | Suave, minimo | Fade + transform sutil, spacing generoso |
| Energetico | 0.15-0.4s | ease-out back `(0.34, 1.56, 0.64, 1)` | 0.8-1.2 | Rapido, bounce | Spring, overshoot, stagger rapido |
| Misterioso | 1.0-2.5s | ease-in cubic `(0.55, 0.055, 0.675, 0.19)` | 0.9-1.0 | Lento, reveal | Blur, fade parcial, particulas, fog |
| Magnetico | 0.4-1.0s | custom spring (stiffness: 200, damping: 20) | Variavel | Atracao ao cursor | Cursor-following, parallax mouse, attraction |
| Cinematico | 1.5-4.0s | ease-in-out quint `(0.83, 0, 0.17, 1)` | 0.5-2.0 | Camera, zoom | Camera path, DOF, letterbox, slow-mo |
| Organico | 0.6-1.5s | custom bezier `(0.25, 0.46, 0.45, 0.94)` | 0.95-1.05 | Curvo, ondulante | Perlin noise, morphing, arcs naturais |
| Futurista | 0.2-0.8s | steps(N) ou linear | 1.0 | Geometrico | Glitch, grid, data viz, wireframe, neon |
| Playful | 0.2-0.5s | bounce/elastic `(0.68, -0.55, 0.265, 1.55)` | 0.7-1.3 | Bounce, wiggle | Squash-stretch, overshoot, cores vivas |
| Premium | 0.5-1.0s | ease-out cubic `(0.33, 1, 0.68, 1)` | 0.98-1.0 | Contido, preciso | Fade delicado, tipografia fina, espacamento |
| Dramatico | 0.6-1.5s | ease-in expo `(0.7, 0, 0.84, 0)` | 0.3-3.0 | Grande, impactante | Scale extremo, delay + burst, contraste |
| Calmo | 1.0-3.0s | ease-in-out sine `(0.37, 0, 0.63, 1)` | 0.99-1.01 | Lento, respiratorio | Float, pulse suave, gradients lentos |
| Agressivo | 0.1-0.3s | linear ou ease-out | 1.0-1.5 | Rapido, direto | Shake, flash, corte seco, sem easing |
| Sofisticado | 0.6-1.0s | ease-out quart `(0.25, 1, 0.5, 1)` | 0.97-1.03 | Preciso, contido | Stagger lento, reveal mask, tipografia |
| Hipnotico | 2.0-8.0s | linear (loop) | 0.8-1.2 | Ciclico, infinito | Loop perfeito, rotacao continua, pulse |
| Explosivo | 0.3-0.8s | ease-out expo `(0.16, 1, 0.3, 1)` | 0.0-2.0 | De dentro pra fora | Particle burst, scale from 0, stagger radial |

### Feelings Compostos

| Descricao do Usuario | Traduz Para | Combinacao |
|---------------------|-------------|------------|
| "Tipo Apple" | Cinematico + Premium | Scroll-driven, produto hero, tipografia limpa |
| "Tipo Awwwards" | Sofisticado + Magnetico | Smooth scroll, cursor custom, hover effects |
| "Tipo Matrix" | Futurista + Hipnotico | Rain de caracteres, green glow, terminal |
| "Tipo Disney+" | Cinematico + Dramatico | Video hero, fade elegante, parallax profundo |
| "Tipo game" | Energetico + Playful | Physics, colisoes, particulas, interatividade |
| "Algo diferente" | Misterioso + Organico | Generative art, noise, particulas, shaders |
| "Clean e moderno" | Premium + Elegante | Fade suave, spacing, tipografia, minimal |
| "Impressionar cliente" | Dramatico + Cinematico | Hero impactante, scroll storytelling, 3D |
| "Reter usuario" | Magnetico + Hipnotico | Micro-interactions, cursor effects, reveals |

---

## 2. Contexto → Estilo Default

### Por Industria

| Industria | Estilo Default | Techniques |
|-----------|---------------|------------|
| Fintech / Banking | Premium + Calmo | Numeros animados, graficos smooth, gradients |
| Moda / Luxo | Elegante + Cinematico | Full-bleed images, slow reveals, tipografia bold |
| Tech / SaaS | Futurista + Sofisticado | 3D product, grid layouts, data viz |
| E-commerce | Energetico + Playful | Product hover, cart animations, CTAs bouncy |
| Portfolio criativo | Magnetico + Misterioso | Custom cursor, hover distortion, page transitions |
| Startup | Energetico + Premium | Hero animado, scroll reveals, social proof |
| Saude / Wellness | Calmo + Organico | Gradients suaves, breathing animations, nature |
| Gaming | Agressivo + Explosivo | Particles, glitch, neon, fast transitions |
| Educacao | Playful + Calmo | Illustrations animadas, progress, step-by-step |
| Imobiliario | Cinematico + Premium | 3D tours, map animations, gallery smooth |

### Por Elemento

| Elemento | Estilo Default | Duration | Technique |
|----------|---------------|----------|-----------|
| Hero section | Dramatico | 1.0-2.0s | Scale + fade, 3D, particulas, video |
| Navigation | Premium | 0.2-0.4s | Fade, slide, underline |
| Cards | Sofisticado | 0.3-0.5s | Lift, shadow, image zoom |
| CTA buttons | Energetico | 0.15-0.3s | Scale, color shift, ripple |
| Footer | Calmo | 0.4-0.8s | Fade-in suave no scroll |
| Modal/Drawer | Premium | 0.3-0.5s | Overlay fade + slide content |
| Loading | Hipnotico | 1.0-2.0s loop | Spinner, skeleton, progress |
| Page transition | Cinematico | 0.4-0.8s | Wipe, fade, morph |
| Scroll sections | Sofisticado | 0.5-0.8s | Reveal, parallax, pin |
| Tooltips | Premium | 0.15-0.25s | Scale from origin + fade |

---

## 3. Palavras-Chave → Parametros Diretos

### Adjetivos de Velocidade
| Palavra | Duration Multiplier | Easing |
|---------|-------------------|--------|
| "rapido", "fast", "snappy" | 0.5x | ease-out |
| "normal", "suave" | 1.0x | ease-out cubic |
| "lento", "slow", "gradual" | 1.5-2.0x | ease-in-out |
| "muito lento", "dramatic" | 2.0-3.0x | ease-in-out quint |
| "instantaneo" | 0ms (cut) | none |

### Adjetivos de Intensidade
| Palavra | Scale Range | Overshoot |
|---------|------------|-----------|
| "sutil", "discreto" | 0.98-1.02 | 0% |
| "moderado", "balanced" | 0.9-1.1 | 5% |
| "forte", "bold" | 0.7-1.3 | 10-15% |
| "extremo", "wild" | 0.3-2.0 | 20-30% |
| "explosivo" | 0.0-3.0+ | 30%+ |

### Adjetivos de Direcao
| Palavra | Transform |
|---------|-----------|
| "de cima", "drop" | translateY(-100%) → 0 |
| "de baixo", "rise" | translateY(100%) → 0 |
| "da esquerda" | translateX(-100%) → 0 |
| "da direita" | translateX(100%) → 0 |
| "do centro", "expand" | scale(0) → scale(1) |
| "de longe", "zoom in" | scale(0.5) + opacity(0) → normal |
| "girar", "spin" | rotate(360deg) |
| "flip" | rotateY(180deg) ou rotateX(180deg) |

---

## 4. Anti-Patterns — O Que NAO Fazer

| Erro Comum | Problema | Solucao |
|-----------|---------|---------|
| Tudo animado ao mesmo tempo | Caos visual, sem hierarquia | Stagger + priorizar hero content |
| Duracao > 1s para micro-interaction | Sente lento, impaciente | Max 300ms para hover/click |
| Ease-in para entradas | Parece hesitante, lento no inicio | Usar ease-out para entradas |
| Parallax em tudo | Nauseante, vestibular issues | Usar parallax apenas em 1-2 secoes |
| Animacao blocking content | Usuario espera sem poder agir | Conteudo legivel sem animacao |
| Ignore prefers-reduced-motion | Acessibilidade violada | SEMPRE ter fallback |
| Bounce em contexto serio | Infantiliza a marca | Bounce so para marcas playful |
| Flash rapido (<3/sec) | Risco de convulsao (WCAG) | Nunca flash abaixo de 3/segundo |

---

## 5. Perguntas Clarificadoras (quando necessario)

Em vez de bombardear com perguntas, Lens faz NO MAXIMO 2 perguntas focadas:

1. **"Qual o feeling?"** — Se nao conseguir inferir do contexto
   - Opcoes: Elegante / Energetico / Cinematico / Playful / Futurista / Outro
2. **"Qual a referencia mais proxima?"** — Se ambiguo
   - Opcoes: Apple.com / Awwwards top / Portfolio criativo / E-commerce / Outro URL

Se o usuario responder "nao sei", usar defaults baseados na industria e elemento.
