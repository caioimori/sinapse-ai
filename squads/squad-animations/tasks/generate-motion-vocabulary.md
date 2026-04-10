---
task: generate-motion-vocabulary
responsavel: "@animation-interpreter"
responsavel_type: Agent
atomic_layer: Task
elicit: false

Entrada:
  - campo: project_briefing
    tipo: document
    origem: "briefing, brand system, conversas"
    obrigatorio: true

Saida:
  - campo: motion_vocabulary
    tipo: document
    destino: "todos os agentes da squad"

Checklist:
  - "[ ] Extrair adjetivos e descricoes do briefing"
  - "[ ] Mapear cada termo para parametros concretos"
  - "[ ] Criar tabela vocabulario → parametros"
  - "[ ] Validar coerencia entre termos"
---

# Task: Generate Motion Vocabulary

## Metadata
- **Agent:** animation-interpreter (Lens)
- **Squad:** squad-animations
- **Complexity:** MEDIUM

## Objetivo
Criar vocabulario de motion especifico do projeto — dicionario que traduz termos subjetivos do usuario e do briefing em parametros tecnicos concretos. Quando o usuario disser "X", todos os agentes da squad interpretam exatamente "Y".

## Pre-Conditions
- Briefing do projeto disponivel
- Brand personality definida
- Animation system tokens definidos (ou defaults)
- Conversas anteriores com usuario (se houver)

## Passos

### 1. Extrair Adjetivos do Briefing
```yaml
# Scan the briefing for motion-relevant terms
extracted_terms:
  feelings: [premium, cinematico, suave, moderno]
  speed: [rapido, agil, sem espera]
  style: [clean, minimalista, elegante]
  negations: [nao exagerado, sem bounce, nada pesado]
  references: [Apple-like, editorial, magazine]
```

### 2. Criar Vocabulario Core (Universal)
| Termo do Usuario | Traducao Tecnica | Duration | Easing | Movement |
|-----------------|-----------------|----------|--------|----------|
| rapido | Snappy, immediate | 150-250ms | power2.out | Short distance |
| lento | Deliberate, dramatic | 500-800ms | ease-decelerate | Long travel |
| suave | Smooth, flowing | 300-500ms | ease-decelerate | Gradual |
| bounce | Overshoot + settle | 400-600ms | back.out(1.7) | Spring-like |
| snap | Instant feel | 100-200ms | power3.out | Minimal travel |
| float | Hovering, weightless | 2-4s loop | sine.inOut | Up/down gentle |
| pulse | Rhythmic attention | 1-2s loop | sine.inOut | Scale 1.0-1.05 |
| slide | Lateral movement | 300-500ms | power2.out | translateX |
| fade | Opacity change | 200-400ms | ease-standard | opacity only |
| pop | Sudden appear | 200-350ms | back.out(2) | scale 0.8→1.0 |

### 3. Criar Vocabulario Projeto-Especifico
```yaml
# Terms specific to THIS project, derived from briefing
project_vocabulary:
  "hero entrance":
    description: "How the hero section loads"
    parameters:
      duration: 600ms
      easing: ease-decelerate
      stagger: 150ms between elements
      elements: [background, headline, subtitle, CTA]
      order: background → headline → subtitle → CTA

  "card reveal":
    description: "How cards appear on scroll"
    parameters:
      duration: 400ms
      easing: ease-decelerate
      from: { opacity: 0, y: 30 }
      stagger: 80ms
      trigger: viewport-enter (20% visible)

  "subtle hover":
    description: "Standard hover state"
    parameters:
      duration: 200ms
      easing: ease-standard
      effect: translateY(-2px) + shadow-increase
```

### 4. Mapear Sinonimos
| Sinonimo 1 | Sinonimo 2 | Sinonimo 3 | Termo Canonico |
|-----------|-----------|-----------|---------------|
| cinematico | filme | cinematic | cinematico |
| premium | luxo | sofisticado | premium |
| snappy | rapido | punchy | snappy |
| clean | limpo | minimal | clean |
| bounce | quicando | spring | bounce |
| fade | desvanecer | dissolve | fade |
| dramatico | impactante | epic | dramatico |

### 5. Definir Intensidade Scale
```yaml
# When user adds qualifiers like "muito", "um pouco", "extremamente"
intensity_modifiers:
  "um pouco / slightly":
    duration: "+20%"
    distance: "-30%"
    effect: "more subtle version"
  "normal / padrao":
    duration: "default"
    distance: "default"
    effect: "standard version"
  "bastante / very":
    duration: "+50%"
    distance: "+30%"
    effect: "enhanced version"
  "extremamente / extremely":
    duration: "+100%"
    distance: "+60%"
    effect: "maximum version"
```

### 6. Definir Combinacoes Comuns
| Combinacao | Interpretacao | Parametros |
|-----------|---------------|-----------|
| "suave e rapido" | Smooth but quick | 200ms, ease-decelerate, small distance |
| "dramatico mas clean" | Impact without noise | 600ms, ease-decelerate, single property |
| "playful mas profissional" | Fun but controlled | 300ms, back.out(1.2), subtle overshoot |
| "cinematico e minimalista" | Slow with restraint | 600ms, ease-decelerate, opacity + tiny movement |

### 7. Criar Anti-Vocabulario (O Que NAO Fazer)
| Termo Negativo | O Que Evitar | Threshold |
|---------------|-------------|-----------|
| "nao exagerado" | scale > 1.1, rotate, large slide | Max scale 1.05, max slide 40px |
| "sem bounce" | back.out, elastic, overshoot | Use ease-decelerate only |
| "nada lento" | duration > 500ms | Max 400ms |
| "nao pesado" | Heavy libs, complex shaders | CSS-first, lightweight |
| "sem distracao" | Attention-grabbing animations | Subtle only, no loops |

### 8. Documentar Contexto por Componente
```yaml
component_vocabulary:
  hero:
    default_entrance: "cinematico" # 600ms, layered stagger
    default_scroll: "parallax suave" # 0.3-0.7x speed
  cards:
    default_entrance: "reveal suave" # 400ms, fadeUp
    default_hover: "subtle lift" # 200ms, -2px
  buttons:
    default_hover: "glow" # 200ms, shadow increase
    default_press: "press" # 80ms, scale 0.98
  modals:
    default_entrance: "pop" # 300ms, scale + fade
    default_exit: "fade rapido" # 200ms, opacity only
```

### 9. Criar Glossario de Termos Tecnicos Simplificados
| Termo Tecnico | Explicacao Simples (para usuario) |
|--------------|--------------------------------|
| Easing | "A velocidade da animacao nao e constante — comeca rapido e freia" |
| Stagger | "Cada elemento aparece com um pequeno delay, criando cascata" |
| Parallax | "Elementos de fundo se movem mais devagar que os de frente" |
| Scrub | "A animacao acompanha o scroll, nao roda sozinha" |
| Reduced motion | "Para usuarios que preferem menos movimento na tela" |
| Compositing | "Animamos apenas propriedades que a GPU acelera" |

### 10. Distribuir e Atualizar
- Publicar vocabulario como documento compartilhado na squad
- Todos agentes devem consultar antes de interpretar pedidos
- Atualizar quando novos termos surgem nas conversas
- Versionar (v1, v2...) para rastrear evolucao

## Output
- Motion vocabulary document completo
- Tabela universal: termo → parametros
- Vocabulario projeto-especifico
- Mapeamento de sinonimos
- Escala de intensidade
- Combinacoes comuns resolulvidas
- Anti-vocabulario (o que evitar)
- Glossario de termos tecnicos simplificados

## Quality Criteria
- [ ] Todos termos do briefing mapeados
- [ ] Nenhum termo ambiguo (cada um tem parametros concretos)
- [ ] Sinonimos mapeados para termos canonicos
- [ ] Escala de intensidade definida
- [ ] Anti-vocabulario alinhado com feedback do usuario
- [ ] Vocabulario consistente (nao contradiz a si mesmo)
- [ ] Compreensivel por todos agentes da squad
- [ ] Versionado e atualizavel
