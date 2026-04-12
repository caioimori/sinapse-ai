---
task: create-screen-reader-specs
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

# Task: Create Screen Reader Specs

## Metadata
- **Squad:** squad-design
- **Agent:** Beacon (dx-accessibility-specialist)
- **Complexity:** Standard

## Objetivo
Criar especificacoes de screen reader para cada componente e fluxo — definir exatamente o que deve ser anunciado, quando e como.

## Entrada
- Component library
- ARIA patterns
- User flows
- Interactive widgets

## Passos

### 1. Announcement Types
| Tipo | Quando | Mecanismo |
|------|--------|----------|
| Name | Ao focar | aria-label, text content |
| Role | Ao focar | Semantic element, role attr |
| State | Ao focar + ao mudar | aria-expanded, aria-checked, etc |
| Description | Apos nome | aria-describedby |
| Value | Ao focar (inputs) | value + aria-valuenow |
| Live update | Ao mudar conteudo | aria-live region |

### 2. Per-Component Specs
```yaml
screen_reader_spec:
  component: "Button"
  element: "<button>"
  announcement:
    focus: "[text content], button"
    disabled: "[text content], button, dimmed"
    loading: "[text content], button, busy"
  keyboard:
    enter: "Activate"
    space: "Activate"
  notes: "Use <button>, nao div com role=button"

---
screen_reader_spec:
  component: "Modal"
  element: "<dialog>"
  announcement:
    open: "[dialog title], dialog"
    close: "Focus returns to trigger"
  required_aria:
    - "aria-modal=true"
    - "aria-labelledby=[title-id]"
  keyboard:
    escape: "Close dialog"
    tab: "Move within dialog (trapped)"
  notes: "Focus trap required. Background inert."

---
screen_reader_spec:
  component: "Toast"
  element: "<div role='status'>"
  announcement:
    appear: "[message], status"
    urgent: "<div role='alert'> for errors"
  required_aria:
    - "role=status (info) or role=alert (error)"
  keyboard: "None — nao recebe foco"
  notes: "Nao mover foco para toast. aria-live anuncia automaticamente."
```

### 3. Flow Announcements
Para cada user flow, documentar o que o screen reader deve anunciar:

| Step | User Action | Announcement |
|------|------------|-------------|
| 1 | Tab to login | "Email, text input" |
| 2 | Type email | [Characters typed] |
| 3 | Tab to password | "Password, password input" |
| 4 | Tab to submit | "Login, button" |
| 5 | Press Enter | "Logging in" (loading state) |
| 6a | Success | "Redirecting to dashboard" |
| 6b | Error | "Error: Invalid credentials" |

### 4. Dynamic Content Rules
| Tipo | Anuncio | aria-live |
|------|---------|----------|
| Form error | "Error: [message]" | assertive (or role=alert) |
| Success message | "[message]" | polite (or role=status) |
| Loading indicator | "Loading" | polite |
| Counter update | "[count] items" | polite |
| Chat message | "[sender]: [message]" | polite |
| Timer | "[time remaining]" | off (announce on request) |

### 5. Testing Protocol
```yaml
testing:
  screen_readers:
    - name: "NVDA"
      browser: "Firefox"
      os: "Windows"
    - name: "VoiceOver"
      browser: "Safari"
      os: "macOS"
    - name: "VoiceOver"
      browser: "Safari"
      os: "iOS"

  for_each_component:
    - Navigate to component
    - Verify role announcement
    - Verify name announcement
    - Verify state announcement
    - Interact and verify state change
    - Verify keyboard pattern
```

## Saida
- Screen reader specs per component
- Flow announcement scripts
- Dynamic content rules
- Testing protocol
- Handoff para Scaffold (implementation)

## Validacao
- [ ] Spec para cada componente interativo
- [ ] Flow scripts para fluxos criticos
- [ ] Live region rules definidas
- [ ] Testing protocol documentado
- [ ] Testado com pelo menos 2 screen readers
