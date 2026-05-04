---
task: test-keyboard-navigation
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

# Task: Test Keyboard Navigation

## Metadata
- **Squad:** squad-design
- **Agent:** Beacon (dx-accessibility-specialist)
- **Complexity:** Standard

## Objetivo
Testar navegacao por teclado em todos os fluxos — verificar que toda funcionalidade e acessivel sem mouse.

## Entrada
- User flows documentados
- Interactive components
- Focus management specs

## Passos

### 1. Keyboard Controls Reference
| Tecla | Acao Esperada |
|-------|--------------|
| Tab | Avancar para proximo focusable element |
| Shift+Tab | Retornar para anterior |
| Enter | Ativar link ou button |
| Space | Ativar button, toggle checkbox/switch |
| Escape | Fechar modal/dropdown/tooltip |
| Arrow keys | Navegar dentro de widgets (tabs, menus, radio) |
| Home/End | Primeiro/ultimo item em lista |

### 2. Test Matrix por Fluxo
Para cada user flow critico:

```yaml
keyboard_test:
  flow: ""
  steps:
    - step: 1
      action: ""
      key: ""
      expected_focus: ""
      expected_announcement: ""
      pass: "[yes/no]"
      notes: ""
```

### 3. Verificar Focus Management
| Cenario | Focus Esperado |
|---------|---------------|
| Page load | First interactive element ou skip link |
| Modal open | Primeiro element dentro do modal |
| Modal close | Element que abriu o modal |
| Dropdown open | Primeiro item do dropdown |
| Form submit (error) | Primeiro campo com erro |
| Form submit (success) | Status message ou proxima pagina |
| Tab panel switch | Conteudo do novo panel |
| Accordion expand | Conteudo expandido |

### 4. Verificar Focus Trapping
Modais e overlays devem:
- [ ] Trap focus dentro (Tab nao sai)
- [ ] Escape fecha e retorna foco
- [ ] Focus no primeiro element ao abrir
- [ ] Focus retorna ao trigger ao fechar

### 5. Verificar Skip Links
- [ ] Skip link visivel ao receber foco
- [ ] "Skip to main content" funciona
- [ ] Skip link e o primeiro element focusable
- [ ] Focus vai para o main content

### 6. Verificar Focus Indicators (WCAG 2.4.7, 2.4.13)
| Criterio | Requirement |
|----------|------------|
| Visibilidade | Focus indicator DEVE ser visivel |
| Contraste | >= 3:1 contra cor adjacente |
| Area | >= 2px de espessura no perimetro |
| Nao obscurecido | Nao pode ser coberto por sticky headers/footers |
| Consistente | Mesmo estilo em todo o produto |

### 7. Testar em Diferentes Browsers
| Browser | OS | Comportamento de focus |
|---------|----|-----------------------|
| Chrome | Windows/Mac | Tab funciona em todos os elements |
| Firefox | Windows/Mac | Tab funciona (buttons incluidos) |
| Safari | Mac | Tab pode nao focar buttons (setting) |
| Edge | Windows | Similar ao Chrome |

## Saida
- Keyboard navigation test report
- Pass/fail per flow
- Focus management issues
- Focus indicator compliance
- Skip link verification
- Browser-specific findings

## Validacao
- [ ] Todos os fluxos criticos testados via teclado
- [ ] Focus management correto em modais/overlays
- [ ] Focus indicators visiveis (>= 3:1 contraste)
- [ ] Skip links funcionais
- [ ] Nenhum keyboard trap
- [ ] Tab order logico
