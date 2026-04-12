---
task: design-accessible-form-patterns
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

# Task: Design Accessible Form Patterns

## Metadata
- **Squad:** squad-design
- **Agent:** Beacon (dx-accessibility-specialist)
- **Complexity:** Standard

## Objetivo
Projetar padroes de formulario acessiveis — garantir que todos os forms atendam WCAG 2.2 AA incluindo os novos criterios 3.3.7 e 3.3.8.

## Entrada
- Form patterns (de Canvas)
- Component library (de Scaffold)
- WCAG 2.2 requirements

## Passos

### 1. Required Form A11y Elements
| Elemento | Requisito WCAG | Implementacao |
|----------|---------------|--------------|
| Labels | 1.3.1, 3.3.2 | `<label for="id">` sempre |
| Error messages | 3.3.1 | role="alert" + aria-describedby |
| Required indicator | 3.3.2 | aria-required + visual indicator |
| Help text | 3.3.2 | aria-describedby |
| Error summary | 3.3.1 | Focus on first error |
| Autocomplete | 1.3.5 | autocomplete attributes |
| No redundant entry | 3.3.7 | Pre-fill known data |
| Accessible auth | 3.3.8 | No cognitive test CAPTCHAs |

### 2. Label Patterns
```html
<!-- Visible label (preferred) -->
<label for="email">Email</label>
<input id="email" type="email" autocomplete="email" />

<!-- Visually hidden label (when design hides it) -->
<label for="search" class="sr-only">Search</label>
<input id="search" type="search" placeholder="Search..." />

<!-- Group label (fieldset/legend) -->
<fieldset>
  <legend>Payment Method</legend>
  <label><input type="radio" name="payment" value="card" /> Credit Card</label>
  <label><input type="radio" name="payment" value="pix" /> PIX</label>
</fieldset>
```

### 3. Error Handling Pattern
```html
<!-- Field with error -->
<label for="email">Email</label>
<input
  id="email"
  type="email"
  aria-invalid="true"
  aria-describedby="email-error"
/>
<p id="email-error" role="alert">
  Please enter a valid email address
</p>

<!-- Error summary (top of form on submit) -->
<div role="alert" aria-labelledby="error-heading">
  <h2 id="error-heading">Please fix the following errors:</h2>
  <ul>
    <li><a href="#email">Email is required</a></li>
    <li><a href="#password">Password must be at least 8 characters</a></li>
  </ul>
</div>
```

### 4. WCAG 2.2 New Criteria
**3.3.7 Redundant Entry:**
- Nao pedir informacao ja fornecida
- Pre-fill dados de steps anteriores
- Excecoes: seguranca (re-digitar senha)

**3.3.8 Accessible Authentication:**
- Nao exigir cognitive function test (puzzles, CAPTCHAs)
- Permitir paste em campos de senha
- Fornecer alternativa a CAPTCHA (email verification)
- Support password managers (autocomplete)

### 5. Multi-Step Forms A11y
| Aspecto | Requisito |
|---------|----------|
| Progress | Indicador de progresso acessivel |
| Step announcement | "Step X of Y" anunciado |
| Back navigation | Botao "Back" preserva dados |
| Validation | Validar apenas step atual |
| Focus | Move para primeiro campo do step |
| Summary | Review step antes de submit |

### 6. Autocomplete Attributes
| Campo | autocomplete |
|-------|-------------|
| Full name | name |
| Email | email |
| Phone | tel |
| Address line 1 | address-line1 |
| City | address-level2 |
| State | address-level1 |
| Zip/Postal | postal-code |
| Country | country-name |
| Credit card | cc-number |
| Expiry | cc-exp |
| CVC | cc-csc |
| Username | username |
| Current password | current-password |
| New password | new-password |

## Saida
- Accessible form patterns document
- Label patterns guide
- Error handling specification
- WCAG 2.2 new criteria implementation
- Multi-step form a11y guidelines
- Autocomplete reference

## Validacao
- [ ] Labels em todos os campos
- [ ] Error messages com role="alert"
- [ ] aria-invalid em campos com erro
- [ ] aria-describedby para help text e errors
- [ ] autocomplete attributes
- [ ] No redundant entry (WCAG 3.3.7)
- [ ] No cognitive CAPTCHA (WCAG 3.3.8)
