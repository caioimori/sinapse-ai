---
task: design-loading-choreography
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

# Task: Design Loading Choreography

## Metadata
- **Squad:** squad-design
- **Agent:** Kinetic (dx-interaction-designer)
- **Complexity:** Standard

## Objetivo
Projetar coreografia de loading states — definir como conteudo aparece progressivamente, coordenando skeletons, spinners e content reveals.

## Entrada
- Page layouts
- Data fetching patterns
- Performance metrics
- Duration scale

## Passos

### 1. Loading State Types
| Tipo | Quando | Visual |
|------|--------|--------|
| Skeleton | Estrutura do conteudo conhecida | Placeholder animado |
| Spinner | Acao pontual (submit, load more) | Circular indicator |
| Progress bar | Progresso mensuravel | Linear progress |
| Shimmer | Conteudo tipo feed/cards | Sweep animation |
| Pulse | Conteudo simples (texto) | Opacity pulse |
| Dot loading | Chat/messaging | Three-dot animation |

### 2. Skeleton Design
```yaml
skeleton:
  animation: "shimmer sweep left-to-right"
  duration: "1.5s"
  easing: "linear"
  iteration: "infinite"

  colors:
    light:
      base: "neutral-100"
      highlight: "neutral-200"
    dark:
      base: "neutral-800"
      highlight: "neutral-700"

  shapes:
    text_line: "height: 16px, width: 80-100%, border-radius: 4px"
    heading: "height: 24px, width: 60%, border-radius: 4px"
    avatar: "width: 40px, height: 40px, border-radius: 50%"
    image: "width: 100%, aspect-ratio: 16/9, border-radius: 8px"
    button: "width: 120px, height: 40px, border-radius: 6px"
```

### 3. Loading Choreography
Sequencia de aparecimento do conteudo:
```
t=0ms    Layout shell appears (instant)
t=0ms    Skeleton placeholders visible
t=50ms   Header/nav renders (cached/static)
t=~200ms Primary content streams in (Suspense)
t=~200ms Content fades in, skeleton fades out
t=~500ms Secondary content streams in
t=~500ms Below-fold content lazy loads
```

### 4. Content Reveal Pattern
```typescript
// Skeleton → Content transition
function ContentReveal({ loading, children }: Props) {
  return (
    <div className="relative">
      <div
        className={cn(
          'transition-opacity duration-200',
          loading ? 'opacity-100' : 'opacity-0 pointer-events-none'
        )}
      >
        <Skeleton />
      </div>
      <div
        className={cn(
          'transition-opacity duration-300',
          loading ? 'opacity-0' : 'opacity-100'
        )}
      >
        {children}
      </div>
    </div>
  );
}
```

### 5. Staggered Loading
Para listas de items:
```yaml
staggered_reveal:
  first_item_delay: "0ms"
  item_stagger: "50ms"
  max_stagger: "500ms"  # Cap total
  animation:
    from: "opacity: 0, translateY: 10px"
    to: "opacity: 1, translateY: 0"
    duration: "200ms"
    easing: "var(--ease-decelerate)"
```

### 6. Rules
| Regra | Descricao |
|-------|-----------|
| No layout shift | Skeleton deve ter mesmas dimensoes do conteudo |
| Skeleton > spinner | Quando estrutura e conhecida, use skeleton |
| Min display time | Skeleton visivel por no minimo 200ms (evita flash) |
| Smooth transition | Fade skeleton → content (no pop-in) |
| Reduced motion | Static skeleton (no shimmer), instant content swap |

## Saida
- Loading choreography specification
- Skeleton design system
- Content reveal patterns
- Staggered loading specs
- Reduced motion alternatives

## Validacao
- [ ] No layout shifts (CLS = 0)
- [ ] Skeleton dimensions match content
- [ ] Smooth transition skeleton → content
- [ ] Min 200ms skeleton display
- [ ] Stagger capped at 500ms
- [ ] Reduced motion: no shimmer, instant reveal
