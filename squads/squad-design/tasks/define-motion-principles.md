---
task: define-motion-principles
responsavel: "@dx-interaction-designer"
responsavel_type: Agent
atomic_layer: Task
elicit: false

Entrada:
  - campo: context
    tipo: object
    origem: "workflow ou manual"
    obrigatorio: true

Saida:
  - campo: resultado
    tipo: document
    destino: "stakeholders"

Checklist:
  - "[ ] Validar inputs e pre-condicoes"
  - "[ ] Executar steps conforme documentado"
  - "[ ] Verificar criterios de qualidade"
  - "[ ] Gerar output no formato especificado"
---

# Task: Define Motion Principles

## Metadata
- **Squad:** squad-design
- **Agent:** Kinetic (dx-interaction-designer)
- **Complexity:** Standard

## Objetivo
Definir principios de motion design do produto — estabelecer guidelines de alto nivel que orientam todas as decisoes de animacao e interacao.

## Entrada
- Brand personality
- UX principles (de Compass)
- Performance budgets (de Apex)
- Accessibility requirements (de Beacon)

## Passos

### 1. Motion Values
Derivar dos valores do produto:
| Valor do Produto | Principio de Motion |
|-----------------|-------------------|
| Confiavel | Animacoes previsiveis e consistentes |
| Eficiente | Duracoes curtas, sem delays |
| Delightful | Micro-interactions cuidadosas |
| Acessivel | Respects prefers-reduced-motion |
| Performatico | 60fps, GPU-accelerated |

### 2. Disney's 12 Principles Adaptados para UI
| Principio Disney | Adaptacao UI | Uso |
|-----------------|-------------|-----|
| Timing | Duration scale | Curto para UI, longo para atencao |
| Ease-in/Ease-out | Easing curves | Natural deceleration |
| Anticipation | Hover states, press states | Preview da acao |
| Follow-through | Overshoot, settle | Elementos pesados |
| Secondary Action | Related element animation | Feedback coordenado |
| Staging | Focus attention | Guiar olhar do usuario |
| Exaggeration | Scale, emphasis | Chamar atencao |
| Appeal | Polished micro-interactions | Qualidade percebida |

### 3. Principios Core (3-5)
```yaml
motion_principles:
  - name: "Purposeful"
    description: "Toda animacao tem um proposito funcional — guiar, informar ou dar feedback"
    do: "Usar animacao para indicar loading, transicao de estado, ou feedback"
    dont: "Animar por estetica sem funcao"

  - name: "Responsive"
    description: "Resposta imediata a interacao — max 100ms para acknowledging input"
    do: "Hover/active states instantaneos, loading indicators imediatos"
    dont: "Delays antes de feedback, animacoes que bloqueiam interacao"

  - name: "Natural"
    description: "Movimento segue fisica natural — ease-out para entrar, ease-in para sair"
    do: "Easing curves naturais, momentum-based scrolling"
    dont: "Linear motion, bounce excessivo, spring overdamped"

  - name: "Accessible"
    description: "Respeita preferencias do usuario — prefers-reduced-motion sempre honored"
    do: "Provide reduced-motion alternatives, no flashing"
    dont: "Ignorar media query, flashar > 3x/segundo"

  - name: "Performant"
    description: "60fps em todos os dispositivos — GPU-accelerated, nao bloqueia main thread"
    do: "Transform e opacity para animacoes, will-change seletivo"
    dont: "Animar layout properties (width, height, top, left)"
```

### 4. Quando NAO Animar
| Cenario | Por que nao |
|---------|-----------|
| Conteudo critico (errors, alerts) | Atrasa informacao urgente |
| Text content appearance | Atrasa leitura |
| Layout shifts | Causa CLS |
| High-frequency updates | Causa distraction |
| Background/wallpaper motion | Sem proposito funcional |

## Saida
- Motion principles document (3-5 principios)
- Disney adaptation guide
- "Quando nao animar" guidelines
- Do/Don't examples
- Handoff para todo o squad

## Validacao
- [ ] 3-5 principios memoraveis
- [ ] Cada principio tem do/dont
- [ ] prefers-reduced-motion e principio core
- [ ] Performance e principio core
- [ ] Alinhados com brand personality
