---
task: review-aria-patterns
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

# Task: Review ARIA Patterns

## Metadata
- **Squad:** squad-design
- **Agent:** Beacon (dx-accessibility-specialist)
- **Complexity:** Standard

## Objetivo
Revisar implementacao de ARIA patterns — verificar que roles, states e properties estao corretos e seguem as APG (ARIA Authoring Practices Guide).

## Entrada
- Component library
- Interactive widgets
- ARIA APG reference

## Passos

### 1. Regra de Ouro do ARIA
1. **Nao use ARIA se HTML semantico resolve** (button, not div[role=button])
2. **Nao mude semantica nativa** (h2[role=tab] e errado)
3. **Todos os roles interativos devem ser operaveis por teclado**
4. **Nao use role="presentation" ou aria-hidden em focusable elements**
5. **Todos os interactive elements devem ter accessible name**

### 2. Verificar Patterns por Widget
| Widget | Role | Required ARIA | Keyboard |
|--------|------|--------------|----------|
| Dialog/Modal | dialog | aria-modal, aria-labelledby | Escape close, focus trap |
| Tabs | tablist, tab, tabpanel | aria-selected, aria-controls | Arrow keys switch |
| Accordion | region | aria-expanded, aria-controls | Enter/Space toggle |
| Menu | menu, menuitem | aria-expanded, aria-haspopup | Arrow keys, Enter select |
| Combobox | combobox, listbox | aria-expanded, aria-activedescendant | Arrow keys, Enter select |
| Tooltip | tooltip | aria-describedby on trigger | Focus/hover shows |
| Toast | status or alert | role="status" (info) or role="alert" (urgent) | Auto-dismiss |
| Breadcrumb | navigation | aria-label="Breadcrumb", aria-current="page" | — |
| Switch | switch | aria-checked | Space toggle |
| Slider | slider | aria-valuenow, aria-valuemin, aria-valuemax | Arrow keys |

### 3. Live Regions
| Tipo | role/aria-live | Quando usar |
|------|--------------|------------|
| Alert | role="alert" | Errors, urgent messages |
| Status | role="status" | Non-urgent updates |
| Log | role="log" | Chat, activity feed |
| Timer | role="timer" | Countdown |
| Polite | aria-live="polite" | Non-interrupting updates |
| Assertive | aria-live="assertive" | Immediate attention needed |

### 4. Common ARIA Mistakes
| Erro | Correto |
|------|---------|
| `<div role="button">` | `<button>` |
| `aria-label` em non-interactive | Remove ou use visually-hidden text |
| `aria-hidden="true"` em focusable | Remove aria-hidden ou make unfocusable |
| Missing aria-expanded on trigger | Add to element that controls disclosure |
| aria-label conflitando com text content | Remove aria-label, use text content |
| role="presentation" em parent com interactive children | Remove role |

### 5. Verificar Accessible Names
Cada interactive element deve ter accessible name via:
1. Text content (preferido)
2. aria-label (quando nao tem texto visivel)
3. aria-labelledby (referenciando outro elemento)

Priority: text > aria-labelledby > aria-label > title

### 6. Screen Reader Testing
Testar cada widget com:
- NVDA + Firefox (Windows)
- VoiceOver + Safari (Mac/iOS)
- TalkBack + Chrome (Android)

Verificar:
- Role anunciado corretamente
- State changes anunciados
- Labels lidos corretamente
- Navigation dentro do widget funcional

## Saida
- ARIA review report
- Pattern compliance per widget
- Common mistakes found
- Screen reader test results
- Recommendations

## Validacao
- [ ] Todos os widgets custom revisados
- [ ] APG patterns seguidos
- [ ] HTML semantico preferido sobre ARIA
- [ ] Live regions configurados corretamente
- [ ] Screen reader testing executado
- [ ] Accessible names em todos os interactive elements
