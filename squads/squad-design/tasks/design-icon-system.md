---
task: design-icon-system
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

# Task: Design Icon System

## Metadata
- **Squad:** squad-design
- **Agent:** Canvas (dx-ui-designer)
- **Complexity:** Standard

## Objetivo
Projetar o sistema de icones do produto — definir estilo, tamanhos, grid, e guidelines de uso que garantem consistencia visual e acessibilidade.

## Entrada
- Brand guidelines (estilo visual)
- UI component inventory
- Navigation patterns
- Accessibility requirements

## Passos

### 1. Definir Estilo
| Aspecto | Opcoes | Decisao |
|---------|--------|---------|
| Tipo | Outline / Filled / Duo-tone | |
| Peso do traço | 1px / 1.5px / 2px | |
| Cantos | Sharp / Rounded (2px) / Round | |
| Grid base | 16px / 20px / 24px | |
| Padding | 1px / 2px | |

### 2. Configurar Icon Grid
```yaml
icon_system:
  grid: 24px  # Base grid
  stroke_width: 1.5px
  corner_radius: 2px
  padding: 2px  # Safe area
  optical_adjustment: true

  sizes:
    - name: "xs"
      size: "16px"
      usage: "Inline text, badges"
      min_touch: false

    - name: "sm"
      size: "20px"
      usage: "Buttons, inputs"
      min_touch: false

    - name: "md"
      size: "24px"
      usage: "Default, navigation"
      min_touch: true  # 24x24 min target

    - name: "lg"
      size: "32px"
      usage: "Feature highlights"
      min_touch: true

    - name: "xl"
      size: "48px"
      usage: "Empty states, illustrations"
      min_touch: true
```

### 3. Categorizar Icones
| Categoria | Exemplos | Quantidade |
|-----------|---------|-----------|
| Navigation | Home, menu, back, search, close | ~10 |
| Action | Add, edit, delete, share, download | ~15 |
| Status | Success, error, warning, info, loading | ~8 |
| Content | File, image, video, link, text | ~10 |
| Communication | Email, chat, notification, phone | ~8 |
| User | Profile, settings, logout, group | ~6 |
| Commerce | Cart, payment, invoice, shipping | ~8 |
| Social | Like, comment, share, bookmark | ~6 |

### 4. Definir Guidelines de Uso
- **Sempre com label** para acoes primarias (a11y)
- **aria-hidden="true"** quando decorativo
- **aria-label** quando standalone sem texto
- **currentColor** para herdar cor do parent
- **Nao usar icones como unico indicador** (a11y)

### 5. Documentar Naming Convention
```
[category]-[name]-[variant]
```
Exemplos: `nav-home`, `action-edit`, `status-success-filled`

### 6. Export Pipeline
| Formato | Uso | Otimizacao |
|---------|-----|-----------|
| SVG | Web, inline | SVGO optimized |
| React Component | Next.js/React | Tree-shakeable |
| SVG Sprite | Multi-icon pages | Single request |
| Icon Font | Legacy support | Fallback |

## Saida
- Icon style guide
- Icon grid specification
- Icon inventory com categorias
- Usage guidelines (a11y-compliant)
- Export pipeline configuration
- Handoff para Scaffold (implementation)

## Validacao
- [ ] Grid base e estilo definidos
- [ ] Todas as categorias cobertas
- [ ] Guidelines de a11y documentados
- [ ] Naming convention consistente
- [ ] Sizes com touch targets adequados (WCAG 2.5.8)
- [ ] Export pipeline configurado
