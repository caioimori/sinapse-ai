---
task: design-focus-management
responsavel: "@dx-accessibility-specialist"
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

# Task: Design Focus Management

## Metadata
- **Squad:** squad-design
- **Agent:** Beacon (dx-accessibility-specialist)
- **Complexity:** Complex

## Objetivo
Projetar estrategia de focus management — definir como o foco se move, onde vai apos acoes, e como e visualizado em todo o produto.

## Entrada
- User flows
- Component library
- Interactive patterns
- WCAG 2.2 focus requirements

## Passos

### 1. Focus Order Principles
| Principio | Descricao |
|-----------|-----------|
| Source order | Tab order segue DOM order |
| Logical flow | Sequencia faz sentido contextual |
| No positive tabindex | Nunca usar tabindex > 0 |
| Skip navigation | Skip links no topo |
| Grouped controls | Radio/tabs use roving tabindex |

### 2. Focus Movement Patterns
| Cenario | Focus After Action |
|---------|-------------------|
| Modal opens | Primeiro focusable no modal |
| Modal closes | Elemento que abriu o modal |
| Dropdown opens | Primeiro item |
| Dropdown closes (select) | Trigger element |
| Dropdown closes (escape) | Trigger element |
| Form error | Primeiro campo com erro |
| Form success | Mensagem de sucesso ou redirect |
| Toast appears | NAO move focus (aria-live) |
| Tab switch | Conteudo do tab panel |
| Accordion toggle | Mantém no trigger |
| Delete item | Proximo item ou container vazio |
| Page navigation | Main content (h1 ou main) |

### 3. Focus Trapping
Para modals, drawers e popovers:
```typescript
function useFocusTrap(containerRef: RefObject<HTMLElement>) {
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const focusableElements = container.querySelectorAll(
      'a[href], button, textarea, input, select, [tabindex]:not([tabindex="-1"])'
    );
    const firstEl = focusableElements[0] as HTMLElement;
    const lastEl = focusableElements[focusableElements.length - 1] as HTMLElement;

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key !== 'Tab') return;

      if (e.shiftKey && document.activeElement === firstEl) {
        e.preventDefault();
        lastEl.focus();
      } else if (!e.shiftKey && document.activeElement === lastEl) {
        e.preventDefault();
        firstEl.focus();
      }
    }

    container.addEventListener('keydown', handleKeyDown);
    firstEl?.focus();

    return () => container.removeEventListener('keydown', handleKeyDown);
  }, [containerRef]);
}
```

### 4. Roving Tabindex
Para grupos de controles (tabs, radio, toolbar):
```typescript
// Only one item in the group has tabindex="0"
// Others have tabindex="-1"
// Arrow keys move focus within group
// Tab exits group

function useRovingTabindex(items: HTMLElement[]) {
  const [activeIndex, setActiveIndex] = useState(0);

  function handleKeyDown(e: KeyboardEvent) {
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      e.preventDefault();
      const next = (activeIndex + 1) % items.length;
      setActiveIndex(next);
      items[next].focus();
    }
    // ... ArrowLeft/ArrowUp, Home, End
  }
}
```

### 5. Focus Indicator Design
```css
/* Focus indicator spec */
:focus-visible {
  outline: 2px solid var(--color-focus-ring);
  outline-offset: 2px;
  border-radius: var(--radius-sm);
}

/* Remove for mouse users */
:focus:not(:focus-visible) {
  outline: none;
}
```

Requirements (WCAG 2.4.13):
- Area >= 2px perimeter
- Contrast >= 3:1 against adjacent
- Not obscured by other content (2.4.11)

### 6. Scroll and Focus
- Focus DEVE ser visivel (scroll into view se necessario)
- Sticky headers/footers NAO devem obscurecer focused element
- `scrollIntoView({ block: 'nearest', behavior: 'smooth' })`

## Saida
- Focus management strategy document
- Focus movement map per pattern
- Focus trap implementation
- Roving tabindex implementation
- Focus indicator specification
- Handoff para Scaffold (implementation)

## Validacao
- [ ] Focus order logico em todas as paginas
- [ ] Focus trap em modais/overlays
- [ ] Roving tabindex em tab groups
- [ ] Focus indicator visivel (3:1 contrast)
- [ ] Focus nao obscurecido por sticky elements
- [ ] Focus retorna corretamente apos fechar overlays
