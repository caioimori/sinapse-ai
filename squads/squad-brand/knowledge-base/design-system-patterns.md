# Design System Patterns — Knowledge Base

> Padrões e boas práticas para criação de design systems de marca.

---

## 1. Arquitetura de Tokens

### 3 Níveis de Tokens

#### Nível 1 — Primitive (Global)
Valores brutos sem semântica. Nomeados pelo valor.
```css
--color-blue-500: #3B82F6;
--color-gray-900: #111827;
--spacing-4: 16px;
--font-size-16: 1rem;
--radius-8: 8px;
```

#### Nível 2 — Semantic (Alias)
Mapeamento para intenção/uso. Nomeados pelo propósito.
```css
--color-primary: var(--color-blue-500);
--color-text-primary: var(--color-gray-900);
--spacing-component-padding: var(--spacing-4);
--font-size-body: var(--font-size-16);
--radius-default: var(--radius-8);
```

#### Nível 3 — Component
Tokens específicos por componente. Nomeados pelo componente + propriedade.
```css
--button-bg: var(--color-primary);
--button-text: var(--color-text-on-primary);
--button-padding-y: var(--spacing-component-padding);
--button-radius: var(--radius-default);
--card-bg: var(--color-surface);
--card-shadow: var(--shadow-md);
```

### Convenção de Naming
```
--{category}-{property}-{variant}-{state}
```
| Segmento | Exemplos |
|----------|----------|
| category | color, spacing, font, radius, shadow, border |
| property | primary, bg, text, padding, size |
| variant | sm, md, lg, subtle, bold |
| state | hover, active, disabled, focus |

---

## 2. Escala de Espaçamento

### Base-4 System
| Token | Value | Uso |
|-------|-------|-----|
| --spacing-0 | 0px | Reset |
| --spacing-0.5 | 2px | Borders, hairlines |
| --spacing-1 | 4px | Ícones inline, gaps mínimos |
| --spacing-2 | 8px | Padding interno tight |
| --spacing-3 | 12px | Padding interno small |
| --spacing-4 | 16px | Padding padrão |
| --spacing-5 | 20px | Gap entre elementos |
| --spacing-6 | 24px | Padding de seção |
| --spacing-8 | 32px | Margin entre blocos |
| --spacing-10 | 40px | Seção spacing |
| --spacing-12 | 48px | Large spacing |
| --spacing-16 | 64px | Section padding |
| --spacing-20 | 80px | Page sections |
| --spacing-24 | 96px | Hero padding |

### Quando Usar Cada Nível
- **2-4px:** Dentro de componentes (icon-to-text, border)
- **8-16px:** Padding interno de componentes
- **16-32px:** Gap entre componentes
- **32-64px:** Seções de página
- **64-96px:** Hero sections, separações maiores

---

## 3. Grid System

### 12-Column Grid
| Breakpoint | Name | Min Width | Columns | Gutter | Margin | Container |
|-----------|------|-----------|---------|--------|--------|-----------|
| xs | Mobile | 0px | 4 | 16px | 16px | fluid |
| sm | Mobile L | 640px | 4 | 16px | 24px | fluid |
| md | Tablet | 768px | 8 | 24px | 32px | fluid |
| lg | Desktop | 1024px | 12 | 24px | 32px | 960px |
| xl | Desktop L | 1280px | 12 | 32px | auto | 1200px |
| 2xl | Wide | 1536px | 12 | 32px | auto | 1400px |

### Layouts Comuns
| Layout | Colunas (desktop) | Uso |
|--------|-------------------|-----|
| Full width | 12 | Hero, CTA |
| Wide content | 10 (1+10+1) | Blog post, article |
| Content + sidebar | 8+4 | Dashboard, docs |
| 3 cards | 4+4+4 | Features, pricing |
| 4 cards | 3+3+3+3 | Grid de produtos |
| 2 columns | 6+6 | Comparison, split |

---

## 4. Componentes Base

### Componentes Obrigatórios (12 mínimo)
| # | Componente | Variantes Mínimas |
|---|-----------|-------------------|
| 1 | Button | primary, secondary, ghost, outline × sm, md, lg |
| 2 | Input | text, email, password, search × default, error, disabled |
| 3 | Select | single, multi × sizes |
| 4 | Checkbox | default, indeterminate × sizes |
| 5 | Radio | default × sizes |
| 6 | Toggle | default × sizes |
| 7 | Card | default, elevated, outlined × sizes |
| 8 | Badge | status colors × sizes |
| 9 | Avatar | image, initials, icon × sm, md, lg |
| 10 | Tag/Chip | default, removable × colors |
| 11 | Alert | info, success, warning, error |
| 12 | Modal | sm, md, lg, fullscreen |

### Anatomia de Componente — Template
```
COMPONENTE: {nome}
├── Tamanhos: sm (32px) | md (40px) | lg (48px)
├── Estados: default | hover | active | focus | disabled
├── Variantes: primary | secondary | ghost | outline
├── Acessibilidade: role, aria-label, keyboard nav
├── Tokens: bg, text, border, shadow, radius, padding
└── Código: HTML structure + CSS custom properties
```

### Estados Padrão
| Estado | Visual | Interação |
|--------|--------|-----------|
| Default | Base styling | Idle |
| Hover | Brightness +5-10% ou sombra | Mouse over |
| Active/Pressed | Brightness -5% ou scale(0.98) | Clicking |
| Focus | Ring 2px offset 2px cor primary | Tab navigation |
| Disabled | Opacity 0.5, cursor not-allowed | Não interagível |
| Loading | Spinner ou skeleton | Aguardando |
| Error | Border + text cor de erro | Validação falhou |

---

## 5. Dark Mode — Padrões

### Princípios
1. **Remap, não inverta** — Não inverter cores simplesmente
2. **Elevação com luminosidade** — Surfaces mais altas = mais claras
3. **Saturação reduzida** — Cores em dark mode ~15% menos saturadas
4. **Contraste mantido** — WCAG AA em ambos os modos

### Token Remapping
| Light Mode Token | Dark Mode Value |
|-----------------|----------------|
| --color-bg-page | white → gray-900 |
| --color-bg-surface | gray-50 → gray-800 |
| --color-bg-elevated | white → gray-700 |
| --color-text-primary | gray-900 → gray-50 |
| --color-text-secondary | gray-600 → gray-400 |
| --color-border | gray-200 → gray-700 |
| --color-primary | blue-600 → blue-400 (dessaturado) |
| --shadow-md | rgba(0,0,0,0.1) → rgba(0,0,0,0.4) |

### Implementação
```css
:root { /* Light mode - default */
  --color-bg-page: var(--color-white);
  --color-text-primary: var(--color-gray-900);
}

[data-theme="dark"] {
  --color-bg-page: var(--color-gray-900);
  --color-text-primary: var(--color-gray-50);
}

@media (prefers-color-scheme: dark) {
  :root:not([data-theme="light"]) {
    --color-bg-page: var(--color-gray-900);
    --color-text-primary: var(--color-gray-50);
  }
}
```

---

## 6. Acessibilidade — WCAG AA

### Contraste Mínimo
| Elemento | Ratio Mínimo | Exceção |
|----------|-------------|---------|
| Texto normal (< 18px) | 4.5:1 | — |
| Texto grande (>= 18px bold ou >= 24px) | 3:1 | — |
| Componentes UI | 3:1 | Disabled elements |
| Ícones informativos | 3:1 | Decorativos isentos |
| Focus indicator | 3:1 | — |
| Links em texto | 3:1 vs texto ao redor | Ou underline |

### ARIA Patterns por Componente
| Componente | Role | Required ARIA |
|-----------|------|---------------|
| Button | button | aria-label (se icon-only) |
| Input | textbox | aria-label, aria-required, aria-invalid |
| Modal | dialog | aria-modal, aria-labelledby |
| Alert | alert | aria-live="polite" |
| Tabs | tablist/tab/tabpanel | aria-selected, aria-controls |
| Accordion | — | aria-expanded, aria-controls |
| Dropdown | listbox/option | aria-expanded, aria-selected |

### Keyboard Navigation
| Interação | Tecla |
|-----------|-------|
| Foco próximo | Tab |
| Foco anterior | Shift+Tab |
| Ativar/selecionar | Enter / Space |
| Cancelar/fechar | Escape |
| Navegar opções | Arrow Up/Down |
| Navegar tabs | Arrow Left/Right |

---

## 7. Formatos de Exportação

### Style Dictionary / Design Tokens
| Formato | Uso | Ferramenta |
|---------|-----|-----------|
| CSS Custom Properties | Web nativo | Qualquer browser |
| SCSS Variables | Sass projects | SCSS compiler |
| JSON | Cross-platform | Style Dictionary |
| Tailwind Config | Tailwind CSS | tailwind.config.js |
| Swift / Kotlin | Mobile nativo | iOS / Android |
| Figma Variables | Design tool | Figma |

### Estrutura de Arquivo
```
tokens/
├── primitive/
│   ├── colors.json
│   ├── spacing.json
│   ├── typography.json
│   └── radius.json
├── semantic/
│   ├── light.json
│   ├── dark.json
│   └── brand.json
├── component/
│   ├── button.json
│   ├── input.json
│   └── card.json
└── build/
    ├── css/tokens.css
    ├── scss/_tokens.scss
    ├── js/tokens.js
    └── tailwind/tailwind.config.js
```

---

## 8. Versionamento

### Semantic Versioning para Design Systems
- **Major (X.0.0)** — Breaking changes (cores primárias, tipografia base, componentes removidos)
- **Minor (0.X.0)** — Novos componentes, novas variantes, tokens adicionais
- **Patch (0.0.X)** — Bug fixes, ajustes de valor, correções de acessibilidade

### Changelog Obrigatório
```markdown
## [2.1.0] - 2026-03-15
### Added
- New Tag component with 5 color variants
- Dark mode tokens for Alert component
### Changed
- Button border-radius from 8px to 6px
### Fixed
- Card shadow not rendering in Safari
```
