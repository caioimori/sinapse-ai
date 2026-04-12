---
task: conduct-visual-qa
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

# Task: Conduct Visual QA

## Metadata
- **Squad:** squad-design
- **Agent:** Canvas (dx-ui-designer)
- **Complexity:** Standard

## Objetivo
Conduzir QA visual do produto implementado — verificar fidelidade ao design, consistencia visual, responsividade e polish em todos os breakpoints e estados.

## Entrada
- Design specs originais
- Produto implementado (staging/preview)
- Component library (Storybook)
- Browser/device matrix

## Passos

### 1. Setup de Avaliacao
| Browser | Versao | Viewport |
|---------|--------|----------|
| Chrome | Latest | 1440, 1280, 1024, 768, 375 |
| Safari | Latest | 1440, 1024, 375 |
| Firefox | Latest | 1440, 768, 375 |
| Edge | Latest | 1440, 768 |
| Safari iOS | Latest | 390, 428 |
| Chrome Android | Latest | 360, 412 |

### 2. Verificar Design Fidelity
Para cada pagina/componente:
| Aspecto | Criterio | Status |
|---------|----------|--------|
| Spacing | Match token values (8px grid) | |
| Typography | Font, size, weight, line-height | |
| Colors | Token values corretos | |
| Border radius | Consistente com system | |
| Shadows | Elevation system correto | |
| Icons | Tamanho, cor, alinhamento | |
| Images | Aspect ratio, quality, crop | |
| Alignment | Grid compliance | |

### 3. Verificar Component States
Para cada componente interativo:
- [ ] Default state
- [ ] Hover state
- [ ] Focus state (teclado)
- [ ] Active/pressed state
- [ ] Disabled state
- [ ] Loading state
- [ ] Error state
- [ ] Empty state

### 4. Responsive Testing
Para cada breakpoint:
- [ ] Layout reflow correto
- [ ] Nenhum overflow horizontal
- [ ] Touch targets >= 44x44px (mobile)
- [ ] Texto legivel sem zoom
- [ ] Imagens nao distorcidas
- [ ] Navigation adaptada

### 5. Dark Mode Verification
- [ ] Todos os tokens mapeados corretamente
- [ ] Contraste mantido
- [ ] Imagens adaptadas
- [ ] Elevation invertida (surfaces vs shadows)
- [ ] Transicao suave entre temas

### 6. Cross-Browser Issues
Catalogar diferencas:
```yaml
visual_qa_finding:
  id: "VQA-001"
  page: ""
  element: ""
  severity: "[critical/major/minor/cosmetic]"
  browser: ""
  viewport: ""
  expected: ""
  actual: ""
  screenshot: "[reference]"
  fix_suggestion: ""
```

### 7. Polish Check
- [ ] Truncation com ellipsis onde necessario
- [ ] Scrollbars estilizados ou hidden
- [ ] Animacoes suaves (60fps)
- [ ] Focus ring visivel e consistente
- [ ] Selection color alinhada com brand
- [ ] Cursor correto por tipo de elemento

## Saida
- Visual QA report com findings
- Screenshot comparisons (design vs implementation)
- Fix priority list
- Cross-browser compatibility matrix
- Overall fidelity score

## Validacao
- [ ] Todos os breakpoints testados
- [ ] Todos os estados verificados
- [ ] Dark mode verificado
- [ ] Cross-browser testado
- [ ] Design fidelity >= 95%
- [ ] Findings documentados com screenshots
