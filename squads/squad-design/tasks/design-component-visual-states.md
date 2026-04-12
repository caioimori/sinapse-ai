---
task: design-component-visual-states
responsavel: "@dx-ui-designer"
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

# Task: Design Component Visual States

## Metadata
- **Squad:** squad-design
- **Agent:** Canvas (dx-ui-designer)
- **Complexity:** Standard

## Objetivo
Projetar todos os estados visuais de cada componente — garantir que cada estado possivel e visualmente comunicado com clareza, consistencia e acessibilidade.

## Entrada
- Component inventory (de Stratum)
- Brand tokens (cores, tipografia)
- Accessibility requirements (WCAG 2.2)
- Interaction patterns (de Kinetic)

## Passos

### 1. Definir Estado Matrix
Para cada componente, mapear estados:

| Estado | Descricao | Trigger |
|--------|-----------|---------|
| Default | Estado normal, nenhuma interacao | — |
| Hover | Mouse sobre o elemento | mouseenter |
| Focus | Navegacao por teclado | tab/focus |
| Active/Pressed | Sendo clicado/tocado | mousedown/touchstart |
| Selected | Item selecionado | click |
| Disabled | Indisponivel | programmatic |
| Loading | Aguardando resposta | async operation |
| Error | Validacao falhou | validation |
| Success | Acao completada | confirmation |
| Empty | Sem conteudo | no data |
| Skeleton | Carregando conteudo | initial load |
| Read-only | Visivel mas nao editavel | permission |

### 2. Definir Visual Language por Estado
```yaml
state_visual_system:
  hover:
    background: "lighten 5% or darken 5%"
    cursor: "pointer"
    transition: "150ms ease-out"

  focus:
    outline: "2px solid focus-ring-color"
    outline_offset: "2px"
    # WCAG 2.2: Focus indicator must have 3:1 contrast
    # WCAG 2.4.13: Focus appearance area >= 2px perimeter

  active:
    transform: "scale(0.98)"
    background: "darken 10%"
    transition: "50ms ease-in"

  disabled:
    opacity: 0.5
    cursor: "not-allowed"
    # NAO usar apenas cor para indicar disabled

  error:
    border_color: "error-500"
    icon: "error-icon"
    message_color: "error-700"
    # Usar icone + cor + texto (nao apenas cor)

  loading:
    animation: "pulse or spinner"
    aria_busy: true
    interaction: "blocked"
```

### 3. Componentes por Prioridade
| Prioridade | Componentes |
|-----------|------------|
| P0 | Button, Input, Link, Checkbox, Radio |
| P1 | Select, Textarea, Card, Modal, Toast |
| P2 | Tabs, Accordion, Table, Pagination |
| P3 | Tooltip, Popover, Breadcrumb, Badge |

### 4. Documentar State Combinations
Alguns estados se combinam:
- Hover + Focus (mouse sobre elemento focado)
- Disabled + Selected (item selecionado mas desabilitado)
- Error + Focus (campo com erro recebendo foco)
- Loading + Disabled (loading impede interacao)

### 5. Criar State Sheet
Para cada componente, produzir um "state sheet" visual:
- Todos os estados lado a lado
- Com annotations de tokens usados
- Dark mode variants incluidos

## Saida
- State visual system documentation
- State sheets por componente
- Token mapping por estado
- Dark mode state variants
- Handoff para Scaffold (implementation) e Beacon (a11y review)

## Validacao
- [ ] Todos os estados mapeados por componente
- [ ] Focus visible com contraste >= 3:1 (WCAG 2.4.13)
- [ ] Disabled nao depende apenas de cor
- [ ] Error usa icone + cor + texto
- [ ] State combinations documentadas
- [ ] Dark mode variants incluidos
