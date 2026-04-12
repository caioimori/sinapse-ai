---
task: design-form-patterns
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

# Task: Design Form Patterns

## Metadata
- **Squad:** squad-design
- **Agent:** Canvas (dx-ui-designer)
- **Complexity:** Standard

## Objetivo
Projetar padroes de formulario consistentes e acessiveis — definir layouts, validacao visual, error states e patterns de input que otimizam completion rate.

## Entrada
- Component visual states (de design-component-visual-states)
- Accessibility requirements (WCAG 2.2)
- User flows que envolvem formularios
- Content requirements (labels, help text)

## Passos

### 1. Definir Form Layout Patterns
| Pattern | Quando usar | Vantagem |
|---------|------------|----------|
| Single column | Default, mobile | Facil de scanear |
| Two column | Campos relacionados (name + surname) | Compacto |
| Stepped/Wizard | Formularios longos (>7 campos) | Reduz overwhelm |
| Inline | Edicao rapida em contexto | Nao interrompe fluxo |
| Floating labels | Espaco limitado | Compacto mas acessivel |

### 2. Definir Input States
```yaml
input_states:
  default:
    border: "neutral-300"
    background: "white"
    label: "neutral-700"

  focus:
    border: "brand-500"
    outline: "2px solid brand-200"
    label: "brand-600"

  filled:
    border: "neutral-400"
    background: "white"
    label: "neutral-600"

  error:
    border: "error-500"
    background: "error-50"
    label: "error-700"
    icon: "alert-circle"
    message: "error-600"

  success:
    border: "success-500"
    icon: "check-circle"

  disabled:
    border: "neutral-200"
    background: "neutral-50"
    text: "neutral-400"
    cursor: "not-allowed"
```

### 3. Padronizar Validacao Visual
| Tipo | Quando mostrar | Visual |
|------|---------------|--------|
| Real-time | Ao sair do campo (blur) | Inline message |
| On submit | Ao enviar formulario | Summary + inline |
| Character count | Campos com limite | Counter badge |
| Strength | Senhas | Progress bar |
| Format hint | Campos com formato especifico | Placeholder ou help text |

### 4. Definir Help Text System
| Tipo | Posicao | Quando usar |
|------|---------|------------|
| Label | Acima do campo | Sempre (obrigatorio) |
| Help text | Abaixo do campo | Quando precisa explicacao |
| Placeholder | Dentro do campo | Exemplo de formato (nunca como label) |
| Tooltip | Ao lado do label | Informacao adicional on-demand |
| Error message | Abaixo do campo (substitui help) | Apos validacao falhar |

### 5. Accessibility Requirements (WCAG 2.2)
- Labels sempre associados (`for`/`id`)
- Error messages referenciadas com `aria-describedby`
- Required fields com `aria-required="true"` + visual indicator
- Error summary com links para campos (WCAG 3.3.1)
- Autocomplete attributes (WCAG 1.3.5)
- No CAPTCHA sem alternativa acessivel (WCAG 3.3.8)
- Nao pedir info ja fornecida (WCAG 3.3.7)

### 6. Submit Button Patterns
| Estado | Visual | Comportamento |
|--------|--------|--------------|
| Default | Primary button | Clickable |
| Submitting | Loading spinner + text | Disabled |
| Success | Success icon + message | Redirect ou reset |
| Error | Error message | Re-enable form |

## Saida
- Form pattern library
- Input state specifications
- Validation visual patterns
- Help text guidelines
- Submit flow specifications
- Handoff para Scaffold (implementation) e Beacon (a11y review)

## Validacao
- [ ] Labels nunca substituidos por placeholders
- [ ] Error messages claras e acionaveis
- [ ] Focus management em forms multi-step
- [ ] Autocomplete attributes definidos
- [ ] Touch targets >= 44x44px
- [ ] Keyboard navigation funcional
