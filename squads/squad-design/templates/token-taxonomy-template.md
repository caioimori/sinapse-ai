# Token Taxonomy Template

## Instrucoes
Template para documentar a taxonomia completa de design tokens em 3 camadas. Preencher durante a fase de Design System Architecture.

---

## 1. Visao Geral

| Campo | Valor |
|-------|-------|
| Projeto | |
| Formato | W3C DTCG Spec 2025.10 (JSON) |
| Export targets | [CSS Custom Properties / Tailwind / SCSS / JSON] |
| Ferramenta | [Style Dictionary / Theo / Custom] |
| Dark mode | [Sim/Nao] |
| Multi-brand | [Sim/Nao — quantas marcas?] |

## 2. Naming Convention

```
[categoria].[subcategoria].[propriedade].[modificador].[estado]
```

**Exemplos:**
- `color.blue.500` (primitive)
- `color.action.primary` (semantic)
- `button.background.default` (component)

### Regras
- Sempre lowercase
- Ponto como separador
- Sem abreviacoes (background, nao bg)
- Estado sempre no final (default, hover, active, disabled)

## 3. Tier 1 — Primitive Tokens

### 3.1 Colors
| Token | Value | Description |
|-------|-------|-------------|
| color.blue.50 | | Lightest blue |
| color.blue.100 | | |
| color.blue.200 | | |
| color.blue.300 | | |
| color.blue.400 | | |
| color.blue.500 | | Base blue |
| color.blue.600 | | |
| color.blue.700 | | |
| color.blue.800 | | |
| color.blue.900 | | |
| color.blue.950 | | Darkest blue |
<!-- Repetir para: gray, red, green, yellow, orange, purple, pink, teal -->

### 3.2 Typography
| Token | Value |
|-------|-------|
| font.family.sans | |
| font.family.mono | |
| font.family.serif | |
| font.size.xs | |
| font.size.sm | |
| font.size.base | |
| font.size.lg | |
| font.size.xl | |
| font.size.2xl | |
| font.size.3xl | |
| font.size.4xl | |
| font.weight.regular | 400 |
| font.weight.medium | 500 |
| font.weight.semibold | 600 |
| font.weight.bold | 700 |
| font.lineheight.tight | |
| font.lineheight.normal | |
| font.lineheight.relaxed | |

### 3.3 Spacing
| Token | Value |
|-------|-------|
| spacing.0 | 0px |
| spacing.1 | 4px |
| spacing.2 | 8px |
| spacing.3 | 12px |
| spacing.4 | 16px |
| spacing.5 | 20px |
| spacing.6 | 24px |
| spacing.8 | 32px |
| spacing.10 | 40px |
| spacing.12 | 48px |
| spacing.16 | 64px |
| spacing.20 | 80px |
| spacing.24 | 96px |

### 3.4 Border Radius
| Token | Value |
|-------|-------|
| radius.none | 0 |
| radius.sm | |
| radius.md | |
| radius.lg | |
| radius.xl | |
| radius.full | 9999px |

### 3.5 Elevation / Shadow
| Token | Value |
|-------|-------|
| shadow.none | none |
| shadow.sm | |
| shadow.md | |
| shadow.lg | |
| shadow.xl | |

### 3.6 Motion
| Token | Value |
|-------|-------|
| duration.micro | 100ms |
| duration.small | 200ms |
| duration.medium | 300ms |
| duration.large | 500ms |
| easing.default | cubic-bezier(0.4, 0, 0.2, 1) |
| easing.in | cubic-bezier(0.4, 0, 1, 1) |
| easing.out | cubic-bezier(0, 0, 0.2, 1) |
| easing.spring | — |

## 4. Tier 2 — Semantic Tokens

### 4.1 Action
| Token | References | Light | Dark |
|-------|-----------|-------|------|
| color.action.primary.default | color.blue.600 | | |
| color.action.primary.hover | color.blue.700 | | |
| color.action.primary.active | color.blue.800 | | |
| color.action.secondary.default | | | |
| color.action.destructive.default | color.red.600 | | |

### 4.2 Feedback
| Token | References |
|-------|-----------|
| color.feedback.success | color.green.600 |
| color.feedback.warning | color.yellow.500 |
| color.feedback.error | color.red.600 |
| color.feedback.info | color.blue.500 |

### 4.3 Surface
| Token | Light | Dark |
|-------|-------|------|
| color.surface.background | | |
| color.surface.default | | |
| color.surface.elevated | | |
| color.surface.overlay | | |

### 4.4 Text
| Token | Light | Dark |
|-------|-------|------|
| color.text.primary | | |
| color.text.secondary | | |
| color.text.disabled | | |
| color.text.inverse | | |
| color.text.link | | |

### 4.5 Border
| Token | Light | Dark |
|-------|-------|------|
| color.border.default | | |
| color.border.strong | | |
| color.border.subtle | | |
| color.border.focus | | |

### 4.6 Semantic Typography
| Token | Size | Weight | Line-height |
|-------|------|--------|-------------|
| typography.heading.1 | | | |
| typography.heading.2 | | | |
| typography.heading.3 | | | |
| typography.heading.4 | | | |
| typography.body.large | | | |
| typography.body.default | | | |
| typography.body.small | | | |
| typography.caption | | | |
| typography.overline | | | |

## 5. Tier 3 — Component Tokens (exemplo: Button)

| Token | Default | Hover | Active | Focus | Disabled |
|-------|---------|-------|--------|-------|----------|
| button.primary.background | action.primary.default | action.primary.hover | action.primary.active | — | surface.default |
| button.primary.text | text.inverse | text.inverse | text.inverse | — | text.disabled |
| button.primary.border | transparent | transparent | transparent | border.focus | border.default |
| button.padding.sm | spacing.2 spacing.3 | | | | |
| button.padding.md | spacing.2 spacing.4 | | | | |
| button.padding.lg | spacing.3 spacing.6 | | | | |

## 6. Dark Mode Mapping

### Estrategia: Semantic Token Redirection
```
Light Mode:
  color.surface.background → color.white (primitive)
  color.text.primary → color.gray.900 (primitive)

Dark Mode:
  color.surface.background → color.gray.900 (primitive)
  color.text.primary → color.gray.50 (primitive)
```

**Regra:** NUNCA duplicar tokens. Redirecionar semantics para primitives diferentes.

## 7. Export Configuration

### CSS Custom Properties
```css
:root {
  --color-action-primary-default: #0066CC;
  --spacing-4: 16px;
}
[data-theme="dark"] {
  --color-surface-background: #1A1A1A;
}
```

### Tailwind Extension
```js
theme: {
  extend: {
    colors: {
      action: { primary: 'var(--color-action-primary-default)' }
    }
  }
}
```

## 8. Governance

- Novos tokens: via RFC (proposta → review → aprovacao)
- Renaming: BREAKING CHANGE — requer major version
- Deprecation: marcar deprecated, manter por 2 minor versions
- Audit: trimestral (tokens nao usados, inconsistencias)
